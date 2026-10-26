import type { MarkdownEdit } from "./types";

const URL_PLACEHOLDER = "https://";

/** A single http(s) or mailto address, as copied from the address bar */
const URL_PATTERN = /^(https?:\/\/|mailto:)\S+$/i;

function setValueAndSelection(
  textarea: HTMLTextAreaElement,
  next: string,
  selStart: number,
  selEnd: number,
  onChange: (value: string) => void,
) {
  onChange(next);
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(selStart, selEnd);
  });
}

/** Applies a markdown edit to the textarea's current selection */
export function applyEdit(
  textarea: HTMLTextAreaElement,
  edit: MarkdownEdit,
  onChange: (value: string) => void,
) {
  const { selectionStart: start, selectionEnd: end, value } = textarea;
  let next: string;
  let selStart: number;
  let selEnd: number;

  if (edit.kind === "wrap") {
    const selected = value.slice(start, end) || edit.placeholder;
    next =
      value.slice(0, start) +
      edit.before +
      selected +
      edit.after +
      value.slice(end);
    selStart = start + edit.before.length;
    selEnd = selStart + selected.length;
  } else if (edit.kind === "link") {
    const selected = value.slice(start, end);
    const text = selected || edit.placeholder;
    const beforeUrl = `[${text}](`;
    next =
      value.slice(0, start) +
      beforeUrl +
      URL_PLACEHOLDER +
      ")" +
      value.slice(end);
    if (selected) {
      // Text is already chosen, so select the address: typing or pasting replaces it
      selStart = start + beforeUrl.length;
      selEnd = selStart + URL_PLACEHOLDER.length;
    } else {
      selStart = start + 1;
      selEnd = selStart + text.length;
    }
  } else {
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    next = value.slice(0, lineStart) + edit.prefix + value.slice(lineStart);
    selStart = start + edit.prefix.length;
    selEnd = end + edit.prefix.length;
  }

  setValueAndSelection(textarea, next, selStart, selEnd, onChange);
}

/**
 * Pasting a URL over selected text turns that text into a link.
 * Returns false (normal paste) when nothing is selected or the clipboard isn't a URL.
 */
export function pasteAsLink(
  textarea: HTMLTextAreaElement,
  pasted: string,
  onChange: (value: string) => void,
) {
  const { selectionStart: start, selectionEnd: end, value } = textarea;
  const selected = value.slice(start, end);
  const url = pasted.trim();
  if (
    !selected.trim() ||
    // Markdown link text can't span lines
    selected.includes("\n") ||
    // Pasting into the link button's "https://" slot should just fill in the address
    selected === URL_PLACEHOLDER ||
    !URL_PATTERN.test(url)
  ) {
    return false;
  }

  const link = `[${selected}](${url})`;
  const next = value.slice(0, start) + link + value.slice(end);
  const cursor = start + link.length;
  setValueAndSelection(textarea, next, cursor, cursor, onChange);
  return true;
}
