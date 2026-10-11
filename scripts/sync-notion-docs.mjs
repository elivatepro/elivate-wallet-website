// Pulls published chapters from the Notion "Docs" database and writes them as
// MDX files into src/content/docs, so the existing docs pages render them
// unchanged. Runs before `astro dev` / `astro build` (see package.json).

import { createHash } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
if (!NOTION_API_KEY) {
  throw new Error(
    "NOTION_API_KEY is required to build the Elivate Wallet docs from Notion.",
  );
}

const NOTION_VERSION = "2025-09-03";
const DOCS_DATA_SOURCE_ID =
  process.env.NOTION_DOCS_DATA_SOURCE_ID ??
  "aa1a529b-55d2-4867-941e-6172096258fd";
const APPROVED_GROUPS = new Set(["Foundations", "Workflows", "Reference"]);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const root = process.cwd();
const contentDir = path.join(root, "src", "content", "docs");
const mediaDir = path.join(root, "public", "docs-media");

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

async function queryPublishedDocs() {
  const results = [];
  let cursor;

  do {
    const body = {
      page_size: 100,
      filter: { property: "Status", select: { equals: "Published" } },
      sorts: [{ property: "Order", direction: "ascending" }],
    };
    if (cursor) body.start_cursor = cursor;

    const page = await notion(`/data_sources/${DOCS_DATA_SOURCE_ID}/query`, {
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

function propertyText(property) {
  if (!property) return "";
  if (property.type === "title") return richTextPlain(property.title);
  if (property.type === "rich_text") return richTextPlain(property.rich_text);
  return "";
}

function propertySelect(property) {
  return property?.type === "select" ? property.select?.name ?? "" : "";
}

function propertyNumber(property) {
  return property?.type === "number" ? property.number : null;
}

// Backslash-escape everything Markdown or MDX would otherwise interpret, so
// whatever is typed in Notion renders as typed.
function escapeMdx(value = "") {
  return value.replace(/[\\`*_[\]{}<>#|~!]/g, "\\$&");
}

function richTextMdx(richText = []) {
  return richText
    .map((item) => {
      const raw = item.plain_text ?? "";
      if (!raw) return "";
      const annotations = item.annotations ?? {};
      // Emphasis markers can't hug whitespace, so keep it outside them.
      const [, lead, core, trail] = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
      if (!core) return raw;

      let value = annotations.code
        ? `\`${core.replaceAll("`", "'")}\``
        : escapeMdx(core);
      if (annotations.bold) value = `**${value}**`;
      if (annotations.italic) value = `_${value}_`;
      if (annotations.strikethrough) value = `~~${value}~~`;
      if (item.href) value = `[${value}](${item.href.replaceAll(")", "%29")})`;
      return `${lead}${value}${trail}`;
    })
    .join("")
    .replace(/\n/g, "  \n");
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

// Notion-hosted file URLs expire after an hour, so images are copied into
// public/docs-media at build time (written once the whole sync succeeds).
const pendingMedia = [];

async function localizeImage(data, blockId) {
  if (data.type === "external") return data.external?.url ?? null;
  if (data.type !== "file" || !data.file?.url) return null;

  const response = await fetch(data.file.url);
  if (!response.ok) {
    throw new Error(`Failed to download Notion image (${response.status})`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  const hash = createHash("sha256").update(blockId).digest("hex").slice(0, 20);
  const extension = extensionFromContentType(
    response.headers.get("content-type") ?? "",
  );
  const filename = `${hash}${extension}`;
  pendingMedia.push({ filename, bytes });
  return `/docs-media/${filename}`;
}

function indent(text, prefix) {
  return text
    .split("\n")
    .map((line) => (line ? prefix + line : line))
    .join("\n");
}

async function childrenMdx(block, state) {
  if (!block.has_children) return "";
  return renderBlocks(await listBlockChildren(block.id), state);
}

async function renderBlocks(blocks, state) {
  const out = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const type = block.type;
    const data = block[type] ?? {};
    const text = richTextMdx(data.rich_text);

    if (type === "bulleted_list_item" || type === "numbered_list_item" || type === "to_do") {
      // Consecutive items form one list; nested blocks indent under their item.
      const items = [];
      let number = 1;
      while (index < blocks.length && blocks[index].type === type) {
        const item = blocks[index];
        const itemData = item[type] ?? {};
        const marker =
          type === "numbered_list_item"
            ? `${number++}. `
            : type === "to_do"
              ? `- ${itemData.checked ? "☑" : "☐"} `
              : "- ";
        const nested = await childrenMdx(item, state);
        items.push(
          `${marker}${richTextMdx(itemData.rich_text)}${
            nested ? `\n\n${indent(nested, " ".repeat(marker.length))}` : ""
          }`,
        );
        index += 1;
      }
      index -= 1;
      out.push(items.join("\n"));
      continue;
    }

    switch (type) {
      case "paragraph":
        if (text) out.push(text);
        break;
      // The page title is the chapter's H1, so Notion headings start at H2.
      case "heading_1":
        out.push(`## ${text}`);
        break;
      case "heading_2":
        out.push(`### ${text}`);
        break;
      case "heading_3":
        out.push(`#### ${text}`);
        break;
      case "quote":
        out.push(indent(`${text}\n\n${await childrenMdx(block, state)}`.trim(), "> "));
        continue;
      case "callout": {
        const body = [text, await childrenMdx(block, state)]
          .filter(Boolean)
          .join("\n\n");
        out.push(`<Callout>\n\n${body}\n\n</Callout>`);
        continue;
      }
      case "toggle":
        out.push(`**${text}**`);
        break;
      case "code": {
        const language = (data.language ?? "").replace(/[^a-z0-9+#-]/gi, "");
        out.push(
          "```" + (language === "plain text" ? "" : language) + "\n" +
            richTextPlain(data.rich_text) + "\n```",
        );
        break;
      }
      case "divider":
        out.push("---");
        break;
      case "image": {
        const src = await localizeImage(data, block.id);
        const caption = richTextPlain(data.caption);
        if (src) out.push(`![${escapeMdx(caption)}](${src})`);
        break;
      }
      case "bookmark":
      case "embed":
      case "link_preview":
        if (data.url) out.push(`<${data.url}>`);
        break;
      case "table": {
        const rows = await listBlockChildren(block.id);
        const cells = rows.map((row) =>
          (row.table_row?.cells ?? []).map((cell) =>
            richTextMdx(cell) || " ", // escapeMdx already escapes "|"
          ),
        );
        if (cells.length) {
          const width = Math.max(...cells.map((row) => row.length));
          const line = (row) =>
            `| ${Array.from({ length: width }, (_, i) => row[i] ?? " ").join(" | ")} |`;
          out.push(
            [
              line(cells[0]),
              `| ${Array(width).fill("---").join(" | ")} |`,
              ...cells.slice(1).map(line),
            ].join("\n"),
          );
        }
        continue;
      }
      case "column_list":
      case "column":
      case "synced_block":
        break; // Content-only wrappers; their children render below.
      default:
        state.skipped.add(type);
        continue;
    }

    const nested = await childrenMdx(block, state);
    if (nested) out.push(nested);
  }

  return out.join("\n\n");
}

function frontmatterValue(value) {
  return typeof value === "number" ? String(value) : JSON.stringify(value);
}

async function normalizeDoc(page) {
  const properties = page.properties ?? {};
  const title = propertyText(properties.Title).trim();
  const slug = propertyText(properties.Slug).trim();
  const description = propertyText(properties.Description).trim();
  const group = propertySelect(properties.Group);
  const order = propertyNumber(properties.Order);

  const errors = [];
  if (!title) errors.push("Title");
  if (!SLUG_PATTERN.test(slug)) errors.push("Slug (lowercase letters, numbers, hyphens)");
  if (!description) errors.push("Description");
  if (!APPROVED_GROUPS.has(group)) errors.push("Group");
  if (typeof order !== "number") errors.push("Order");
  if (errors.length) {
    throw new Error(
      `Published doc "${title || page.id}" is missing/invalid: ${errors.join(", ")}.`,
    );
  }

  const state = { skipped: new Set() };
  const body = await renderBlocks(await listBlockChildren(page.id), state);
  if (state.skipped.size) {
    console.warn(
      `[docs] "${title}": skipped unsupported Notion blocks: ${[...state.skipped].join(", ")}`,
    );
  }

  const frontmatter = { title, description, group, order };
  const mdx = [
    "---",
    ...Object.entries(frontmatter).map(([k, v]) => `${k}: ${frontmatterValue(v)}`),
    `# Generated from Notion (${page.url}). Edit it there, not here.`,
    "---",
    "",
    body,
    "",
  ].join("\n");

  return { slug, title, mdx };
}

const pages = await queryPublishedDocs();
const docs = [];
for (const page of pages) docs.push(await normalizeDoc(page));

const slugs = new Set();
for (const doc of docs) {
  if (slugs.has(doc.slug)) throw new Error(`Duplicate published docs slug: ${doc.slug}`);
  slugs.add(doc.slug);
}

// Only replace the folder once everything above succeeded, so a Notion error
// fails the build instead of shipping an empty docs section.
await Promise.all([
  rm(contentDir, { recursive: true, force: true }),
  rm(mediaDir, { recursive: true, force: true }),
]);
await Promise.all([
  mkdir(contentDir, { recursive: true }),
  mkdir(mediaDir, { recursive: true }),
]);
for (const doc of docs) {
  await writeFile(path.join(contentDir, `${doc.slug}.mdx`), doc.mdx, "utf8");
}
for (const { filename, bytes } of pendingMedia) {
  await writeFile(path.join(mediaDir, filename), bytes);
}

console.log(
  `[docs] Synced ${docs.length} published Notion chapter${docs.length === 1 ? "" : "s"}.`,
);
