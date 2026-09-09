import {
  createHighlighter,
  type Highlighter,
  type ThemeRegistrationRaw,
} from "shiki";

// Editorial syntax palette. Two themes that share the same scope mapping —
// only the literal hex values differ. The light theme is built around an
// inkwell sienna accent (typical of letterpress monochrome with one PMS
// spot color); the dark theme lifts the same hue toward warm amber for
// contrast on the dark surface.

type Settings = NonNullable<ThemeRegistrationRaw["settings"]>;

const buildSettings = (p: {
  fg: string;
  comment: string;
  keyword: string;
  string: string;
  numberConst: string;
  fn: string;
  type: string;
  punctuation: string;
  operator: string;
}): Settings => [
  // Default — applied first; later rules override on more-specific scopes.
  { settings: { foreground: p.fg, background: "#00000000" } },

  {
    scope: "comment",
    settings: { foreground: p.comment, fontStyle: "italic" },
  },
  {
    scope: "punctuation.definition.comment",
    settings: { foreground: p.comment, fontStyle: "italic" },
  },

  { scope: "string", settings: { foreground: p.string } },
  { scope: "string.quoted", settings: { foreground: p.string } },
  { scope: "string.template", settings: { foreground: p.string } },
  {
    scope: "punctuation.definition.string",
    settings: { foreground: p.string },
  },
  { scope: "string.regexp", settings: { foreground: p.string } },

  { scope: "constant.numeric", settings: { foreground: p.numberConst } },
  { scope: "constant.language", settings: { foreground: p.numberConst } },
  {
    scope: "constant.character.escape",
    settings: { foreground: p.numberConst },
  },
  { scope: "constant.other", settings: { foreground: p.numberConst } },
  { scope: "constant", settings: { foreground: p.numberConst } },

  { scope: "keyword", settings: { foreground: p.keyword, fontStyle: "bold" } },
  {
    scope: "keyword.control",
    settings: { foreground: p.keyword, fontStyle: "bold" },
  },
  {
    scope: "keyword.operator.new",
    settings: { foreground: p.keyword, fontStyle: "bold" },
  },
  { scope: "storage", settings: { foreground: p.keyword, fontStyle: "bold" } },
  {
    scope: "storage.type",
    settings: { foreground: p.keyword, fontStyle: "bold" },
  },
  {
    scope: "storage.modifier",
    settings: { foreground: p.keyword, fontStyle: "bold" },
  },
  {
    scope: "variable.language",
    settings: { foreground: p.keyword, fontStyle: "bold" },
  },

  {
    scope: "entity.name.function",
    settings: { foreground: p.fn, fontStyle: "bold" },
  },
  {
    scope: "support.function",
    settings: { foreground: p.fn, fontStyle: "bold" },
  },
  { scope: "meta.function-call", settings: { foreground: p.fn } },
  {
    scope: "variable.function",
    settings: { foreground: p.fn, fontStyle: "bold" },
  },

  { scope: "entity.name.type", settings: { foreground: p.type } },
  { scope: "support.type", settings: { foreground: p.type } },
  { scope: "support.class", settings: { foreground: p.type } },
  { scope: "entity.other.inherited-class", settings: { foreground: p.type } },

  { scope: "variable", settings: { foreground: p.fg } },
  { scope: "variable.parameter", settings: { foreground: p.fg } },
  { scope: "variable.other", settings: { foreground: p.fg } },
  { scope: "meta.definition.variable", settings: { foreground: p.fg } },

  { scope: "punctuation", settings: { foreground: p.punctuation } },
  { scope: "meta.brace", settings: { foreground: p.punctuation } },
  { scope: "meta.delimiter", settings: { foreground: p.punctuation } },
  { scope: "punctuation.separator", settings: { foreground: p.punctuation } },
  { scope: "punctuation.terminator", settings: { foreground: p.punctuation } },

  { scope: "keyword.operator", settings: { foreground: p.operator } },
  {
    scope: "keyword.operator.assignment",
    settings: { foreground: p.operator },
  },

  {
    scope: "entity.name.tag",
    settings: { foreground: p.keyword, fontStyle: "bold" },
  },
  {
    scope: "support.tag",
    settings: { foreground: p.keyword, fontStyle: "bold" },
  },
  {
    scope: "entity.other.attribute-name",
    settings: { foreground: p.operator },
  },

  // Markdown / MDX
  {
    scope: "markup.heading",
    settings: { foreground: p.keyword, fontStyle: "bold" },
  },
  {
    scope: "entity.name.section",
    settings: { foreground: p.keyword, fontStyle: "bold" },
  },
  {
    scope: "punctuation.definition.heading",
    settings: { foreground: p.keyword, fontStyle: "bold" },
  },
  {
    scope: "markup.bold",
    settings: { foreground: p.keyword, fontStyle: "bold" },
  },
  {
    scope: "markup.italic",
    settings: { foreground: p.fg, fontStyle: "italic" },
  },
  { scope: "markup.underline.link", settings: { foreground: p.string } },
  { scope: "string.other.link", settings: { foreground: p.string } },

  // TOML / YAML / JSON keys
  { scope: "support.type.property-name", settings: { foreground: p.fg } },
  {
    scope: "entity.name.tag.toml",
    settings: { foreground: p.type, fontStyle: "bold" },
  },

  // Shell tokens
  { scope: "string.unquoted.argument.shell", settings: { foreground: p.fg } },
  {
    scope: "variable.parameter.option.shell",
    settings: { foreground: p.operator },
  },
];

const elivateLight: ThemeRegistrationRaw = {
  name: "elivate-light",
  type: "light",
  colors: {
    "editor.background": "#00000000",
    "editor.foreground": "#171717",
  },
  settings: buildSettings({
    fg: "#171717",
    comment: "#8a8a8a",
    keyword: "#171717",
    string: "#7a4a1c",
    numberConst: "#7a4a1c",
    fn: "#171717",
    type: "#3d5a80",
    punctuation: "#9a9a9a",
    operator: "#525252",
  }),
};

const elivateDark: ThemeRegistrationRaw = {
  name: "elivate-dark",
  type: "dark",
  colors: {
    "editor.background": "#00000000",
    "editor.foreground": "#fafafa",
  },
  settings: buildSettings({
    fg: "#fafafa",
    comment: "#9a9a9a",
    keyword: "#fafafa",
    string: "#d4a574",
    numberConst: "#d4a574",
    fn: "#fafafa",
    type: "#a8c1e0",
    punctuation: "#9a9a9a",
    operator: "#d4d4d4",
  }),
};

const SUPPORTED_LANGS = [
  "bash",
  "shell",
  "sh",
  "typescript",
  "ts",
  "tsx",
  "javascript",
  "js",
  "jsx",
  "json",
  "toml",
  "yaml",
  "yml",
  "markdown",
  "md",
  "mdx",
  "sql",
  "css",
  "html",
  "diff",
] as const;

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [elivateLight, elivateDark],
      langs: [...SUPPORTED_LANGS],
    });
  }
  return highlighterPromise;
}

export async function highlight(code: string, lang: string) {
  const h = await getHighlighter();
  const known = new Set(h.getLoadedLanguages());
  const safeLang = known.has(lang) ? lang : "text";
  return h.codeToHtml(code, {
    lang: safeLang,
    themes: { light: "elivate-light", dark: "elivate-dark" },
    defaultColor: false,
  });
}

// Editorial language metadata — gives every code block a one-character
// glyph that prints in its header strip. Mirrors the way an editorial
// magazine uses tiny mono symbols to label figures (§, ¶, etc.).
export type LangMeta = { label: string; glyph: string };

const LANG_META: Record<string, LangMeta> = {
  bash: { label: "Shell", glyph: "$" },
  shell: { label: "Shell", glyph: "$" },
  sh: { label: "Shell", glyph: "$" },
  typescript: { label: "TypeScript", glyph: "‹›" },
  ts: { label: "TypeScript", glyph: "‹›" },
  tsx: { label: "TSX", glyph: "‹›" },
  javascript: { label: "JavaScript", glyph: "‹›" },
  js: { label: "JavaScript", glyph: "‹›" },
  jsx: { label: "JSX", glyph: "‹›" },
  json: { label: "Data", glyph: "{ }" },
  toml: { label: "Config", glyph: "[ ]" },
  yaml: { label: "Config", glyph: "—" },
  yml: { label: "Config", glyph: "—" },
  markdown: { label: "Prose", glyph: "¶" },
  md: { label: "Prose", glyph: "¶" },
  mdx: { label: "Prose", glyph: "¶" },
  sql: { label: "Query", glyph: "›" },
  css: { label: "Style", glyph: "§" },
  html: { label: "Markup", glyph: "‹›" },
  diff: { label: "Diff", glyph: "±" },
  csv: { label: "Rows", glyph: "⊟" },
};

export function getLangMeta(lang: string | undefined): LangMeta {
  if (!lang) return { label: "Code", glyph: "·" };
  return LANG_META[lang] ?? { label: lang, glyph: "·" };
}
