const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const buildInitialEditorHtml = (value: string) => {
  if (!value.trim()) {
    return "<p><br></p>";
  }

  return value
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`)
    .join("");
};

const getSelection = () => {
  return typeof window === "undefined" ? null : window.getSelection();
};

export interface EditorFormattingState {
  isBold: boolean;
  color: string | null;
}

const DEFAULT_EDITOR_COLOR = "#17232a";

const execDocumentCommand = (command: string, value?: string) => {
  if (typeof document === "undefined" || typeof document.execCommand !== "function") {
    return false;
  }

  if (command === "foreColor") {
    document.execCommand("styleWithCSS", false, "true");
  }

  return document.execCommand(command, false, value);
};

const normalizeColorValue = (value: string) => {
  const trimmed = value.trim().toLowerCase();

  if (!trimmed || trimmed === "inherit" || trimmed === "initial") {
    return null;
  }

  if (trimmed.startsWith("#")) {
    if (
      trimmed === "#000" ||
      trimmed === "#000000" ||
      trimmed === DEFAULT_EDITOR_COLOR
    ) {
      return null;
    }

    return trimmed;
  }

  const rgbMatch = trimmed.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);

  if (!rgbMatch) {
    return trimmed;
  }

  const [red, green, blue] = rgbMatch.slice(1, 4).map((channel) => Number(channel));

  if (
    (red === 0 && green === 0 && blue === 0) ||
    (red === 23 && green === 35 && blue === 42)
  ) {
    return null;
  }

  return `#${[red, green, blue]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
};

export const saveEditorSelection = (root: HTMLElement | null) => {
  if (!root) {
    return null;
  }

  const selection = getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);

  if (!root.contains(range.commonAncestorContainer)) {
    return null;
  }

  return range.cloneRange();
};

export const restoreEditorSelection = (range: Range | null) => {
  if (!range) {
    return false;
  }

  const selection = getSelection();

  if (!selection) {
    return false;
  }

  selection.removeAllRanges();
  selection.addRange(range);
  return true;
};

const moveCaretAfterNode = (node: Node) => {
  const selection = getSelection();

  if (!selection) {
    return;
  }

  const range = document.createRange();
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};

export const insertHtmlAtSelection = (html: string) => {
  const selection = getSelection();

  if (!selection || selection.rangeCount === 0) {
    return;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const fragment = range.createContextualFragment(html);
  const lastNode = fragment.lastChild;

  range.insertNode(fragment);

  if (lastNode) {
    moveCaretAfterNode(lastNode);
  }
};

export const insertTextAtSelection = (text: string) => {
  const selection = getSelection();

  if (!selection || selection.rangeCount === 0) {
    return;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const node = document.createTextNode(text);
  range.insertNode(node);
  moveCaretAfterNode(node);
};

export const applyBoldAtSelection = () => {
  const selection = getSelection();

  if (!selection || selection.rangeCount === 0) {
    return;
  }

  if (execDocumentCommand("bold")) {
    return;
  }

  const range = selection.getRangeAt(0);

  if (range.collapsed) {
    return;
  }

  const fragment = range.extractContents();
  const strong = document.createElement("strong");
  strong.append(fragment);
  range.insertNode(strong);
  moveCaretAfterNode(strong);
};

export const applyColorAtSelection = (color: string) => {
  const selection = getSelection();

  if (!selection || selection.rangeCount === 0) {
    return;
  }

  if (execDocumentCommand("foreColor", color)) {
    return;
  }

  const range = selection.getRangeAt(0);

  if (range.collapsed) {
    return;
  }

  const fragment = range.extractContents();
  const span = document.createElement("span");
  span.style.color = color;
  span.append(fragment);
  range.insertNode(span);
  moveCaretAfterNode(span);
};

export const clearColorAtSelection = () => {
  applyColorAtSelection(DEFAULT_EDITOR_COLOR);
};

export const readEditorFormattingState = (root: HTMLElement | null): EditorFormattingState => {
  if (!root || typeof document === "undefined") {
    return { isBold: false, color: null };
  }

  const selection = getSelection();

  if (!selection || selection.rangeCount === 0) {
    return { isBold: false, color: null };
  }

  const range = selection.getRangeAt(0);

  if (!root.contains(range.commonAncestorContainer)) {
    return { isBold: false, color: null };
  }

  let isBold = false;
  let color: string | null = null;

  try {
    isBold = document.queryCommandState("bold");
  } catch {
    isBold = false;
  }

  try {
    color = normalizeColorValue(String(document.queryCommandValue("foreColor") ?? ""));
  } catch {
    color = null;
  }

  return { isBold, color };
};

export const buildScriptureEmbedHtml = (input: {
  reference: string;
  verses: Array<{
    verseNumber: number;
    text: string;
  }>;
}) => {
  const verseLines = input.verses
    .map(
      (verse) =>
        `<p><span class="note-scripture-verse-number">${verse.verseNumber}</span>${escapeHtml(verse.text)}</p>`
    )
    .join("");

  return `<div class="note-scripture-embed" contenteditable="false" data-note-scripture-embed><button class="note-reference-chip note-reference-chip--removable" data-note-scripture-remove type="button">@${escapeHtml(input.reference)}</button><div class="note-scripture-embed__body">${verseLines}</div></div><p><br></p>`;
};
