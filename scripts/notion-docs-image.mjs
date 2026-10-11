// Upload an image (e.g. a diagram exported from Paper) into a Notion Docs
// chapter, replacing a placeholder paragraph.
//
// Usage:
//   node --env-file=.env scripts/notion-docs-image.mjs <page-id> <marker> <image.png> [caption]
//
// Write a paragraph containing exactly `[[image:<marker>]]` where the image
// should go, then run this. The paragraph is replaced by the uploaded image,
// which the docs sync copies into /docs-media at build time.

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

const placeholder = `[[image:${marker}]]`;

// Find the placeholder paragraph among the page's top-level blocks.
let target = null;
let cursor;
do {
  const qs = new URLSearchParams({ page_size: "100" });
  if (cursor) qs.set("start_cursor", cursor);
  const page = await notion(`/blocks/${pageId}/children?${qs}`);
  target = page.results.find(
    (b) =>
      b.type === "paragraph" &&
      b.paragraph.rich_text.map((t) => t.plain_text).join("").trim() ===
        placeholder,
  );
  cursor = !target && page.has_more ? page.next_cursor : undefined;
} while (cursor);
if (!target) throw new Error(`No paragraph "${placeholder}" on page ${pageId}.`);

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
await notion(`/blocks/${target.id}`, { method: "DELETE" });

console.log(`[docs] Inserted ${path.basename(file)} at ${placeholder}.`);
