---
name: elivate-docs
description: Write, update, or review Elivate Wallet help docs (elivatewallet.com/docs) — chapters live in the Notion "Docs" database and are illustrated with diagrams drawn in Paper. Use for any request to add, edit, fix, reorganize, or illustrate a docs chapter, or to check the docs against how the app actually behaves.
---

# Writing the Elivate Wallet docs

The docs at **elivatewallet.com/docs** are written in **Notion** and published to the
site automatically. You never edit chapter files in this repo: `src/content/docs/` is
generated from Notion on every build (`scripts/sync-notion-docs.mjs`).

## Golden rules

1. **Never invent product behaviour.** Every step, label, limit, fee, timeline and status
   must come from the app's code or from the owner. If you can't verify it, leave it out
   and list it as an open question for the owner. Readers act on these docs with real money.
2. **Use the exact words on screen.** Button, tab, field and status names in **bold**,
   spelled and capitalised exactly as in the app (e.g. **Submit for verification**,
   **Needs action**, **Available to withdraw**).
3. **Agents write `Draft` or `Review` only.** Set `Published` only when the owner
   explicitly says to publish. Publishing a chapter triggers a production rebuild.
4. **No secrets, real people or real data** in text, screenshots or diagrams. Use the
   synthetic names and amounts already used across the docs (Adaeze Nwosu, ₦48,000, …).

## Where things live

| What | Where |
|---|---|
| Chapters | Notion database **Docs** — data source `aa1a529b-55d2-4867-941e-6172096258fd` (under Website Governing Brief → Docs Page) |
| Publishing rules | Notion page **Docs Page** (Website Governing Brief) |
| Diagrams | Paper file **Elivate Wallet** (`01M43FZCYB3WG1474QPKKRVQDQ`), page **Docs — Visual guides** |
| App screenshots | `public/images/app/*.png`, `public/images/phone/*.png` (use as `https://elivatewallet.com/images/...`) |
| Product facts | The app repo — `~/Projects/elivate-wallet` (GitHub `elivatepro/elivate-wallet`). Start with [references/product-reference.md](references/product-reference.md), a dated snapshot with file citations; re-check the cited files before relying on anything that may have changed. |

### Chapter fields (all required for Published)

- **Title** — what the reader wants to do or know ("Requesting a withdrawal").
- **Slug** — lowercase-hyphenated; becomes `/docs/<slug>`. Don't change a published slug (it breaks links).
- **Description** — one sentence, shown under the title, in the index and in search.
- **Group** — sidebar section: `Getting started`, `For members`, `For leaders`, `Setup & admin`, `Troubleshooting` (legacy: `Foundations`, `Workflows`, `Reference`). A new group needs code changes in `scripts/sync-notion-docs.mjs` (`APPROVED_GROUPS`) and `src/lib/docs.ts` (`GROUP_ORDER`).
- **Order** — position within the group (1 = first).
- **Status** — `Draft` → `Review` → `Published`.

## Workflow

1. **Understand the request** and who the reader is (member, leader, President Team).
2. **Verify facts** in the app repo (UI copy in `frontend/src`, rules in `backend/supabase/migrations`, contracts in `00-product.md` / `01-domain-rules.md`). Note anything stubbed, behind a flag or not yet deployed — don't document it.
3. **Check what exists**: query the Docs database (or `node --env-file=.env scripts/sync-notion-docs.mjs` and read `src/content/docs/`). Update an existing chapter rather than adding an overlapping one.
4. **Write the chapter** in Notion (Notion MCP `notion-create-pages` with `data_source_id`, or the Notion API) following the template and style below. Status `Review`.
   - **Updating a Published chapter:** don't edit it in place unless told to publish — any rebuild would ship the edit. Create a `Review` copy with the **same slug**; the owner swaps it in by setting the old one to `Draft` and the new one to `Published` (two Published chapters with one slug fail the build safely).
5. **Add visuals** where a picture explains faster than words (see below).
6. **Preview** locally (see Verify) and fix anything that renders badly.
7. **Report back**: chapters touched (with Notion links), what you verified and where, and every open question or unverified claim you left out.

## Chapter template

```
<One or two sentences: what this is and when you'd use it.>

# <Task-shaped heading, e.g. "Request a withdrawal">
1. Go to **Screen** and select **Button**.
2. ...one action per step, in the order the app asks for it...
<What happens next / what the reader sees.>

# Good to know            ← limits, permissions, edge cases (only verified ones)

# If something goes wrong ← exact error text in bold + what to do
```

- Notion **Heading 1** becomes the section heading on the site (the page title is the H1). Use Heading 2/3 sparingly.
- Numbered lists for procedures, bullets for facts, a table for statuses or permissions.
- A Notion **callout** renders as a highlighted "Good to know" box — one per chapter at most.
- Link other chapters with absolute URLs: `https://elivatewallet.com/docs/<slug>`.
- Avoid code blocks; readers aren't developers.

## Style

- Plain, friendly British/Nigerian English ("organised", ₦ amounts, WAT times).
- Address the reader as "you". Short sentences. Lead with the action.
- Say who can do something ("Only the leader who approved it can…") — permissions matter.
- Explain money effects explicitly: what's **Reserved**, when **Posted** changes.
- No marketing tone, no promises about timelines that the app doesn't enforce.

## Visuals (Paper)

Draw diagrams in Paper for concepts (flows, structures, "what the numbers mean"); use real app screenshots for "where to click".

1. Open the Paper file above, page **Docs — Visual guides**. Load the Paper guide first (`get_guide` → `paper-mcp-instructions`) and match the existing artboards:
   - Artboard **1600px wide**, `backgroundColor: var(--color-light-canvas)`, padding `72px 80px`, height `fit-content`.
   - Header: mono eyebrow (JetBrains Mono 16px, `#B74725`, uppercase) + title (Space Grotesk 500, 48px, `#212628`).
   - Cards: white, 2px `#D8DDDE` border, 16–20px radius; the one key element in brand orange (`#FFF0EA` fill, `#FF7F4F` border, `#B74725` text). Body text DM Sans ≥ 17px so it stays readable when scaled down.
   - Status colours from the design tokens: success `#167D55`, warning `#8A5C00`, danger `#B4433C`.
   - Name the artboard `Guide · <Topic> → docs`. Synthetic data only.
2. Screenshot and review it (spacing, contrast, accuracy) before exporting.
3. Export PNG at `1.5x` (`mcp__paper__export`).
4. In the Notion chapter, put a paragraph containing exactly `[[image:<marker>]]` where it belongs, then run:
   ```
   node --env-file=.env scripts/notion-docs-image.mjs <page-id> <marker> <file.png> "<caption>"
   ```
   The caption is also the alt text — describe what the image shows, including key numbers.
5. Screenshots: `![Caption.](https://elivatewallet.com/images/app/queue.png)` in the Notion content.

## Verify

```
DOCS_PREVIEW=1 node --env-file=.env scripts/sync-notion-docs.mjs   # includes Review chapters
npx astro build && npx wrangler dev                                  # http://localhost:8787/docs
```

- Open every chapter you touched (desktop + mobile width, light + dark), check images, tables and links.
- Search (⌘K) for a key term — it should find your chapter.
- Ask AI a question your chapter answers; it answers only from the docs, so this checks the wording is clear.
- **Never deploy a preview build.** Re-run the sync without `DOCS_PREVIEW` afterwards.
- The sync fails loudly on a Published chapter with missing fields or a duplicate slug — fix it in Notion, never by editing generated files.
