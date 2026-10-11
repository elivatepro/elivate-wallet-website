// Plain-text views of docs chapters, shared by the search index and the
// Ask AI corpus so both see exactly what readers see.

/** Strip MDX/Markdown syntax from a chapter body, keeping readable text. */
export function mdxToPlainText(body: string | undefined): string {
  return (body ?? "")
    .replace(/^---[\s\S]*?---/, "") // frontmatter, if present
    .replace(/(`{3,})[^\n]*\n([\s\S]*?)\n\1/g, "$2") // fenced code -> code
    .replace(/<\/?[A-Z][^>]*>/g, "") // MDX components (<Callout>)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images -> alt text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> label
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // heading markers
    .replace(/^\s*>\s?/gm, "") // quotes
    .replace(/^\s*(?:[-*]|\d+\.)\s+(?:[☐☑]\s+)?/gm, "") // list markers
    .replace(/^\|?\s*-{3,}[\s|:-]*$/gm, "") // table separator rows
    .replace(/\|/g, " ")
    .replace(/(\*\*|__|~~|`+)/g, "")
    .replace(/(^|\s)_([^_]+)_(?=\s|$|[.,;:!?])/g, "$1$2")
    .replace(/\\([\\`*_[\]{}<>#|~!])/g, "$1") // sync-script escapes
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** "## Heading" lines in a chapter body, in order. */
export function mdxHeadings(body: string | undefined): string[] {
  return [...(body ?? "").matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) =>
    mdxToPlainText(m[1]),
  );
}
