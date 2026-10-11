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

**Real app screens first.** A reader should see exactly what they'll see in the app.
Draw a diagram only for a concept no single screen shows (a lifecycle, a hierarchy, a
decision flow) — and then it must look like it belongs to the app. Never ship a rough or
off-brand illustration; no image is better than a weak one.

Everything lives in the Paper file above, page **Docs — Visual guides**. Load the Paper
guide first (`get_guide` → `paper-mcp-instructions`). Never edit the source screen
artboards; only clone from them.

### Screen plates (preferred)

1. Find the current screen: newest approved version first (Website page `Site src · …`
   and `Navigation v5` are the latest; then `App — Screens v4`, `v3`; `Statements &
   reports v1` for exports). Avoid DRAFT/archive unless nothing else exists, and skip
   screens with outdated navigation where the sidebar would be visible.
2. Make an artboard `Plate · <slug> · <what>`: background `#0B0D0E`, padding 56px, the
   screen inside a frame with radius 16px (phones 28px), `1px solid #2A2F31`, shadow
   `0 30px 80px rgba(0,0,0,0.45)`. Clone the screen with `<x-paper-clone node-id=…>`.
   - Desktop: crop to the part the chapter is about (a panel, form or dialog), cutting
     only at natural edges — never through text, a card or a button. ~1300–1600px wide.
   - Phones: 1:1, one or two side by side (two for consecutive steps).
3. Screenshot and critique before exporting. Export PNG: desktop `1x`, phones `2x`.

### Diagrams (only when needed)

Match the redrawn diagrams (`Guide v2 · …`): background `#0B0D0E`; content in an app card
(`#1A1D1E`, `1px #2A2F31`, radius 24px); **Lexend** (the app's typeface), title 46px/600,
body 17–21px; the app's status chips (rounded 8px, tinted background) and colours — info
`#82B8E8`/`#17283A`, success `#43C48B`/`#16301F`, warning `#F2B85E`/`#33291A`, danger
`#F57875`/`#3A1E1E`, brand `#FF7F4F`; mono eyebrow (JetBrains Mono 15px, `#FF7F4F`).
Reuse real UI pieces (the four-segment withdrawal bar, chips, buttons) so the diagram
reads like the product. Align everything to a grid and check the screenshot at 0.5×.
Export PNG at `1x` (1600px wide).

### Putting images in a chapter

```
node --env-file=.env scripts/notion-docs-image.mjs <page-id> <target> <file.png> "<caption>"
```

`<target>` is one of:
- `[[image:<marker>]]` placeholder: write a paragraph `[[image:<marker>]]` and pass `<marker>`;
- `after:<start of a paragraph, list item, heading or image caption>` to insert after it;
- `caption:<start of an existing image's caption>` to replace that image.

Inserting twice after the same block puts the second image first — chain with
`after:<previous caption>` instead. The caption is also the alt text: say what the
image shows, using the on-screen names.

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
