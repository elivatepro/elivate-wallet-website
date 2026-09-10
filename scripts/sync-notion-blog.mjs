import { createHash } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
if (!NOTION_API_KEY) {
  throw new Error(
    "NOTION_API_KEY is required to build the Elivate Wallet blog from Notion.",
  );
}

const NOTION_VERSION = "2025-09-03";
const POSTS_DATA_SOURCE_ID =
  process.env.NOTION_BLOG_POSTS_DATA_SOURCE_ID ??
  "87705dc6-54c1-443f-b74e-89e51227d556";
const AUTHORS_DATA_SOURCE_ID =
  process.env.NOTION_BLOG_AUTHORS_DATA_SOURCE_ID ??
  "f24f92f5-61cb-432b-88c6-67c55f60102f";
const BLOG_TIME_ZONE = process.env.BLOG_TIME_ZONE ?? "Africa/Lagos";
const APPROVED_CATEGORIES = new Set([
  "Product",
  "Financial Records",
  "Network Operations",
  "Guides",
  "Company",
]);

const root = process.cwd();
const generatedDir = path.join(root, "src", "generated");
const mediaDir = path.join(root, "public", "blog-media");
const outputFile = path.join(generatedDir, "blog-data.json");

await Promise.all([
  rm(generatedDir, { recursive: true, force: true }),
  rm(mediaDir, { recursive: true, force: true }),
]);
await Promise.all([
  mkdir(generatedDir, { recursive: true }),
  mkdir(mediaDir, { recursive: true }),
]);

function dateInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

const today = dateInTimeZone(new Date(), BLOG_TIME_ZONE);

async function notion(pathname, init = {}) {
  const response = await fetch(`https://api.notion.com/v1${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Notion API ${response.status} ${response.statusText} for ${pathname}: ${text}`,
    );
  }

  return response.json();
}

async function queryPublishedPosts() {
  const results = [];
  let cursor;

  do {
    const body = {
      page_size: 100,
      filter: {
        and: [
          { property: "Status", select: { equals: "Published" } },
          { property: "Publish Date", date: { on_or_before: today } },
        ],
      },
      sorts: [{ property: "Publish Date", direction: "descending" }],
    };
    if (cursor) body.start_cursor = cursor;

    const page = await notion(`/data_sources/${POSTS_DATA_SOURCE_ID}/query`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    results.push(...page.results);
    cursor = page.has_more ? page.next_cursor : undefined;
  } while (cursor);

  return results;
}

async function listBlockChildren(blockId) {
  const results = [];
  let cursor;

  do {
    const params = new URLSearchParams({ page_size: "100" });
    if (cursor) params.set("start_cursor", cursor);
    const page = await notion(`/blocks/${blockId}/children?${params}`);
    results.push(...page.results);
    cursor = page.has_more ? page.next_cursor : undefined;
  } while (cursor);

  return results;
}

function richTextPlain(richText = []) {
  return richText.map((item) => item.plain_text ?? "").join("");
}

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function richTextHtml(richText = []) {
  return richText
    .map((item) => {
      let value = escapeHtml(item.plain_text ?? "");
      const annotations = item.annotations ?? {};
      if (annotations.code) value = `<code>${value}</code>`;
      if (annotations.bold) value = `<strong>${value}</strong>`;
      if (annotations.italic) value = `<em>${value}</em>`;
      if (annotations.strikethrough) value = `<s>${value}</s>`;
      if (annotations.underline) value = `<u>${value}</u>`;
      const href = item.href;
      if (href) {
        value = `<a href="${escapeHtml(href)}" rel="noreferrer">${value}</a>`;
      }
      return value;
    })
    .join("");
}

function propertyText(property) {
  if (!property) return "";
  if (property.type === "title") return richTextPlain(property.title);
  if (property.type === "rich_text") return richTextPlain(property.rich_text);
  return "";
}

function propertySelect(property) {
  return property?.type === "select" ? property.select?.name ?? "" : "";
}

function propertyCheckbox(property) {
  return property?.type === "checkbox" ? Boolean(property.checkbox) : false;
}

function propertyDate(property) {
  return property?.type === "date" ? property.date?.start ?? "" : "";
}

function propertyRelationIds(property) {
  return property?.type === "relation"
    ? (property.relation ?? []).map((relation) => relation.id)
    : [];
}

function propertyFile(property) {
  return property?.type === "files" ? property.files?.[0] ?? null : null;
}

function fileUrl(file) {
  if (!file) return null;
  if (file.type === "external") return file.external?.url ?? null;
  if (file.type === "file") return file.file?.url ?? null;
  return null;
}

function extensionFromContentType(contentType = "") {
  if (contentType.includes("image/jpeg")) return ".jpg";
  if (contentType.includes("image/png")) return ".png";
  if (contentType.includes("image/webp")) return ".webp";
  if (contentType.includes("image/gif")) return ".gif";
  if (contentType.includes("image/svg+xml")) return ".svg";
  if (contentType.includes("image/avif")) return ".avif";
  return ".bin";
}

async function localizeNotionFile(file, namespace) {
  if (!file) return null;
  if (file.type === "external") return file.external?.url ?? null;
  if (file.type !== "file" || !file.file?.url) return null;

  const sourceUrl = file.file.url;
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to localize Notion media (${response.status})`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  const hash = createHash("sha256")
    .update(`${namespace}:${sourceUrl}`)
    .digest("hex")
    .slice(0, 20);
  const extension = extensionFromContentType(response.headers.get("content-type") ?? "");
  const filename = `${namespace}-${hash}${extension}`;
  await writeFile(path.join(mediaDir, filename), bytes);
  return `/blog-media/${filename}`;
}

function slugBase(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || "section";
}

function uniqueSlug(value, used) {
  const base = slugBase(value);
  let candidate = base;
  let index = 2;
  while (used.has(candidate)) candidate = `${base}-${index++}`;
  used.add(candidate);
  return candidate;
}

async function renderBlocks(blocks, state) {
  let html = "";

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const type = block.type;

    if (type === "bulleted_list_item" || type === "numbered_list_item") {
      const tag = type === "bulleted_list_item" ? "ul" : "ol";
      const items = [];
      while (index < blocks.length && blocks[index].type === type) {
        const item = blocks[index];
        const data = item[type];
        const text = richTextPlain(data?.rich_text);
        state.text.push(text);
        const children = item.has_children
          ? await renderBlocks(await listBlockChildren(item.id), state)
          : "";
        items.push(`<li>${richTextHtml(data?.rich_text)}${children}</li>`);
        index += 1;
      }
      index -= 1;
      html += `<${tag}>${items.join("")}</${tag}>`;
      continue;
    }

    const data = block[type] ?? {};
    const text = richTextPlain(data.rich_text);
    if (text) state.text.push(text);

    if (type === "paragraph") {
      html += `<p>${richTextHtml(data.rich_text)}</p>`;
    } else if (type === "heading_1" || type === "heading_2" || type === "heading_3") {
      const level = type === "heading_1" ? 2 : type === "heading_2" ? 3 : 4;
      const id = uniqueSlug(text, state.headingIds);
      if (text) state.contents.push({ id, text, level });
      html += `<h${level} id="${id}">${richTextHtml(data.rich_text)}</h${level}>`;
    } else if (type === "quote") {
      html += `<blockquote>${richTextHtml(data.rich_text)}</blockquote>`;
    } else if (type === "callout") {
      const icon = data.icon?.type === "emoji" ? `${escapeHtml(data.icon.emoji)} ` : "";
      html += `<aside class="notion-callout">${icon}${richTextHtml(data.rich_text)}</aside>`;
    } else if (type === "code") {
      const language = escapeHtml(data.language ?? "text");
      html += `<pre><code data-language="${language}">${escapeHtml(text)}</code></pre>`;
    } else if (type === "divider") {
      html += "<hr />";
    } else if (type === "image") {
      const source = data.type === "file"
        ? await localizeNotionFile({ type: "file", file: data.file }, `body-${block.id}`)
        : fileUrl({ type: "external", external: data.external });
      if (source) {
        const caption = richTextPlain(data.caption);
        html += `<figure><img src="${escapeHtml(source)}" alt="${escapeHtml(caption)}" loading="lazy" />${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}</figure>`;
      }
    } else if (type === "bookmark") {
      const url = data.url ?? "";
      if (url) html += `<p><a href="${escapeHtml(url)}" rel="noreferrer">${escapeHtml(url)}</a></p>`;
    } else if (type === "equation") {
      html += `<div class="notion-equation"><code>${escapeHtml(data.expression ?? "")}</code></div>`;
    }

    if (block.has_children && !["bulleted_list_item", "numbered_list_item"].includes(type)) {
      html += await renderBlocks(await listBlockChildren(block.id), state);
    }
  }

  return html;
}

const authorCache = new Map();
async function getAuthor(authorId) {
  if (authorCache.has(authorId)) return authorCache.get(authorId);

  const page = await notion(`/pages/${authorId}`);
  if (page.parent?.type === "data_source_id" && page.parent.data_source_id !== AUTHORS_DATA_SOURCE_ID) {
    throw new Error(`Blog post references author ${authorId} outside Blog Authors.`);
  }

  const properties = page.properties ?? {};
  const name = propertyText(properties.Name).trim();
  const role = propertyText(properties.Role).trim();
  if (!name) throw new Error(`Blog author ${authorId} is missing Name.`);
  if (!role) throw new Error(`Blog author ${name} is missing Role.`);

  const author = {
    id: page.id,
    name,
    role,
    bio: propertyText(properties.Bio).trim(),
    active: propertyCheckbox(properties.Active),
    photo: await localizeNotionFile(propertyFile(properties.Photo), `author-${page.id}`),
  };
  authorCache.set(authorId, author);
  return author;
}

function formatDate(dateString) {
  const date = new Date(`${dateString.slice(0, 10)}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function monthLabel(dateString) {
  const date = new Date(`${dateString.slice(0, 10)}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(date)
    .replace(" ", " · ");
}

async function normalizePost(page) {
  const properties = page.properties ?? {};
  const title = propertyText(properties.Title).trim();
  const slug = propertyText(properties.Slug).trim();
  const publishDate = propertyDate(properties["Publish Date"]).slice(0, 10);
  const excerpt = propertyText(properties.Excerpt).trim();
  const category = propertySelect(properties.Category);
  const authorIds = propertyRelationIds(properties.Author);

  const errors = [];
  if (!title) errors.push("Title");
  if (!slug) errors.push("Slug");
  if (!publishDate) errors.push("Publish Date");
  if (!excerpt) errors.push("Excerpt");
  if (!APPROVED_CATEGORIES.has(category)) errors.push("approved Category");
  if (authorIds.length !== 1) errors.push("exactly one Author");
  if (errors.length) {
    throw new Error(`Published blog post ${page.id} is missing/invalid: ${errors.join(", ")}.`);
  }

  const author = await getAuthor(authorIds[0]);
  const state = { text: [], contents: [], headingIds: new Set() };
  const html = await renderBlocks(await listBlockChildren(page.id), state);
  const wordCount = state.text.join(" ").trim().split(/\s+/).filter(Boolean).length;

  return {
    id: page.id,
    title,
    slug,
    publishDate,
    displayDate: formatDate(publishDate),
    monthKey: publishDate.slice(0, 7),
    monthLabel: monthLabel(publishDate),
    excerpt,
    featuredLede: propertyText(properties["Featured Lede"]).trim() || null,
    category,
    featured: propertyCheckbox(properties.Featured),
    seoTitle: propertyText(properties["SEO Title"]).trim() || null,
    seoDescription: propertyText(properties["SEO Description"]).trim() || null,
    coverImage: await localizeNotionFile(propertyFile(properties["Cover Image"]), `cover-${page.id}`),
    socialImage: await localizeNotionFile(propertyFile(properties["Social Image"]), `social-${page.id}`),
    author,
    readMin: Math.max(1, Math.ceil(wordCount / 220)),
    contents: state.contents,
    html,
  };
}

const pages = await queryPublishedPosts();
const posts = [];
for (const page of pages) posts.push(await normalizePost(page));

posts.sort((a, b) => b.publishDate.localeCompare(a.publishDate));
const slugs = new Set();
for (const post of posts) {
  if (slugs.has(post.slug)) throw new Error(`Duplicate published blog slug: ${post.slug}`);
  slugs.add(post.slug);
}

const total = posts.length;
posts.forEach((post, index) => {
  post.articleNumber = String(total - index).padStart(3, "0");
});

await writeFile(
  outputFile,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      currentDate: today,
      timeZone: BLOG_TIME_ZONE,
      posts,
    },
    null,
    2,
  ),
  "utf8",
);

console.log(
  `[blog] Synced ${posts.length} published Notion article${posts.length === 1 ? "" : "s"} for ${today} (${BLOG_TIME_ZONE}).`,
);
