// Upload an image (e.g. a diagram exported from Paper) into a Notion Docs
// chapter, replacing a placeholder paragraph.
//
// Usage:
//   node --env-file=.env scripts/notion-docs-image.mjs <page-id> <marker> <image.png> [caption]
//
// Write a paragraph containing exactly `[[image:<marker>]]` where the image
// should go, then run this. The paragraph is replaced by the uploaded image,
// which the docs sync copies into /docs-media at build time.
//
// To swap an image that's already in the chapter, pass `caption:<start of
// its caption>` as the marker instead; that image block is replaced.
// To add an image without a placeholder, pass `after:<start of a block's
// text>`; it goes right after that paragraph, list item or heading.

import { readFile } from "node:fs/promises";
import path from "node:path";

const [pageId, marker, file, caption = ""] = process.argv.slice(2);
if (!pageId || !marker || !file) {
  console.error(
    "Usage: node --env-file=.env scripts/notion-docs-image.mjs <page-id> <marker> <image.png> [caption]",
  );
  process.exit(1);
}

const KEY = process.env.NOTION_API_KEY;
if (!KEY) throw new Error("NOTION_API_KEY is required.");
const VERSION = "2025-09-03";
const headers = { Authorization: `Bearer ${KEY}`, "Notion-Version": VERSION };

async function notion(pathname, init = {}) {
  const res = await fetch(`https://api.notion.com/v1${pathname}`, {
    ...init,
    headers: { ...headers, ...init.headers },
  });
  if (!res.ok) {
    throw new Error(`Notion ${res.status} for ${pathname}: ${await res.text()}`);
  }
  return res.json();
}

const byCaption = marker.startsWith("caption:")
  ? marker.slice("caption:".length).trim()
  : null;
const afterText = marker.startsWith("after:")
  ? marker.slice("after:".length).trim()
  : null;
const placeholder = byCaption
  ? `image captioned "${byCaption}…"`
  : afterText
    ? `block starting "${afterText}…"`
    : `[[image:${marker}]]`;
const plain = (rich = []) => rich.map((t) => t.plain_text).join("").trim();
const blockText = (b) =>
  b.type === "image" ? plain(b.image.caption) : plain(b[b.type]?.rich_text);

// Find the placeholder paragraph among the page's top-level blocks.
let target = null;
let cursor;
do {
  const qs = new URLSearchParams({ page_size: "100" });
  if (cursor) qs.set("start_cursor", cursor);
  const page = await notion(`/blocks/${pageId}/children?${qs}`);
  target = page.results.find((b) =>
    byCaption
      ? b.type === "image" && plain(b.image.caption).startsWith(byCaption)
      : afterText
        ? blockText(b).startsWith(afterText)
        : b.type === "paragraph" && plain(b.paragraph.rich_text) === placeholder,
  );
  cursor = !target && page.has_more ? page.next_cursor : undefined;
} while (cursor);
if (!target) throw new Error(`No ${placeholder} on page ${pageId}.`);

// 1. Create a file upload, 2. send the bytes, 3. insert it as an image block.
const ext = path.extname(file).toLowerCase();
const contentType =
  { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" }[ext] ??
  "application/octet-stream";
const upload = await notion("/file_uploads", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ filename: path.basename(file), content_type: contentType }),
});

const form = new FormData();
form.append(
  "file",
  new Blob([await readFile(file)], { type: contentType }),
  path.basename(file),
);
await notion(`/file_uploads/${upload.id}/send`, { method: "POST", body: form });

await notion(`/blocks/${pageId}/children`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    after: target.id,
    children: [
      {
        type: "image",
        image: {
          type: "file_upload",
          file_upload: { id: upload.id },
          caption: caption ? [{ type: "text", text: { content: caption } }] : [],
        },
      },
    ],
  }),
});
if (!afterText) await notion(`/blocks/${target.id}`, { method: "DELETE" });

console.log(`[docs] Inserted ${path.basename(file)} at ${placeholder}.`);
