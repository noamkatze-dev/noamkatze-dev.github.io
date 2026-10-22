// Handles "[TODO ...]" markers in case-study Markdown/MDX.
//
//   dev  → wraps each marker in <mark class="todo"> so it is easy to spot.
//   build → removes markers (and the sentence they sit in), then removes
//                        anything left empty: paragraphs, list items, TODO-only
//                        components, and whole sections whose only content was a TODO.
//
// No dependencies: walks the HAST tree by hand.
import { existsSync, readdirSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { TODO_RE, stripTodo, isTodoOnly, bindLast } from './todo.mjs';

const SKIP = new Set(['code', 'pre', 'script', 'style', 'mark']);
const IMAGES = join(process.cwd(), 'src/assets/images');

/* ---------- dev: highlight ---------- */

function splitText(value) {
  const out = [];
  let last = 0;
  for (const m of value.matchAll(TODO_RE)) {
    if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) });
    out.push({ type: 'element', tagName: 'mark', properties: { className: ['todo'] }, children: [{ type: 'text', value: m[0] }] });
    last = m.index + m[0].length;
  }
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
  return out;
}

function highlight(node) {
  if (!node || !Array.isArray(node.children)) return;
  if (node.type === 'element' && SKIP.has(node.tagName)) return;
  const next = [];
  for (const child of node.children) {
    if (child.type === 'text' && /\[TODO/.test(child.value)) next.push(...splitText(child.value));
    else {
      highlight(child);
      next.push(child);
    }
  }
  node.children = next;
}

/* ---------- build: strip ---------- */

const isJsx = (n) => n.type === 'mdxJsxFlowElement' || n.type === 'mdxJsxTextElement';
const attr = (n, name) => {
  const a = (n.attributes || []).find((x) => x.name === name);
  return a && typeof a.value === 'string' ? a.value : undefined;
};

function imageExists(file) {
  if (!file) return false;
  const dir = join(IMAGES, dirname(file));
  if (!existsSync(dir)) return false;
  const stem = basename(file, extname(file)).toLowerCase();
  return readdirSync(dir).some((f) => basename(f, extname(f)).toLowerCase() === stem);
}

function textOf(node) {
  if (node.type === 'text') return node.value;
  return (node.children || []).map(textOf).join('');
}

const PRUNABLE = new Set(['p', 'li', 'ul', 'ol', 'strong', 'em', 'span', 'blockquote', 'h3', 'h4']);

/** Returns true when the node should be removed. */
function strip(node) {
  if (node.type === 'text') {
    if (/\[TODO/.test(node.value)) node.value = stripTodo(node.value, { keepEdges: true });
    return false;
  }
  if (node.type === 'element' && SKIP.has(node.tagName)) return false;

  if (Array.isArray(node.children)) {
    node.children = node.children.filter((c) => !strip(c));
  }

  if (isJsx(node)) {
    switch (node.name) {
      case 'Embed':
        return isTodoOnly(attr(node, 'url') ?? '');
      case 'Figure':
        return !imageExists(attr(node, 'file'));
      case 'Decision':
        return ['title', 'choice', 'why', 'tradeoff'].every((k) => isTodoOnly(attr(node, k) ?? ''));
      case 'Decisions':
      case 'FigureGrid':
      case 'Gallery':
      case 'Flow':
      case 'Iteration':
        return !node.children.some((c) => isJsx(c) || (c.type === 'element'));
      default:
        return false;
    }
  }

  if (node.type === 'element' && PRUNABLE.has(node.tagName)) {
    const hasMedia = node.children.some((c) => (c.type === 'element' && !PRUNABLE.has(c.tagName)) || isJsx(c));
    const text = textOf(node).trim();
    // A paragraph reduced to just a bold label ("**What I changed:**") is removed too.
    const onlyLabel =
      node.tagName === 'p' &&
      /:$/.test(text) &&
      node.children.every((c) => (c.type === 'text' && c.value.trim() === '') || (c.type === 'element' && c.tagName === 'strong'));
    if (!hasMedia && (text === '' || onlyLabel)) return true;
  }
  return false;
}

/** Removes h2/h3 headings whose section (up to the next heading of the same or higher level) has no content left. */
function dropEmptySections(root) {
  const kids = root.children;
  const level = (n) => (n.type === 'element' && /^h[23]$/.test(n.tagName) ? Number(n.tagName[1]) : 0);
  const meaningful = (n) => !(n.type === 'text' && n.value.trim() === '') && level(n) === 0;
  const keep = kids.map((n, i) => {
    const L = level(n);
    if (!L) return true;
    for (let j = i + 1; j < kids.length; j++) {
      const lj = level(kids[j]);
      if (lj && lj <= L) break;
      if (meaningful(kids[j])) return true;
    }
    return false;
  });
  root.children = kids.filter((_, i) => keep[i]);
}

/* ---------- both: no lonely last word ---------- */

// Headings are left to `text-wrap: balance` (binding big uppercase words could overflow on phones).
const BIND = new Set(['p', 'li', 'figcaption', 'dd', 'blockquote']);

function lastTextNode(node) {
  const kids = node.children || [];
  for (let i = kids.length - 1; i >= 0; i--) {
    const c = kids[i];
    if (c.type === 'text') {
      if (c.value.trim() !== '') return c;
    } else if (c.type === 'element' && !SKIP.has(c.tagName) && !BIND.has(c.tagName)) {
      const t = lastTextNode(c);
      if (t) return t;
      return null;
    } else if (c.type === 'element' || c.type === 'mdxJsxFlowElement' || c.type === 'mdxJsxTextElement') {
      return null;
    }
  }
  return null;
}

function bindWords(node) {
  if (!node || !Array.isArray(node.children)) return;
  if (node.type === 'element' && SKIP.has(node.tagName)) return;
  if (node.type === 'element' && BIND.has(node.tagName)) {
    const t = lastTextNode(node);
    if (t) t.value = bindLast(t.value);
  }
  node.children.forEach(bindWords);
}

/* ---------- both: wrap each h2 and its content in <section class="cs-section"> ---------- */
// Lets the case-study layout put the heading in a left column and the text on the right.
function wrapSections(root) {
  const out = [];
  let current = null;
  for (const node of root.children) {
    if (node.type === 'element' && node.tagName === 'h2') {
      current = { type: 'element', tagName: 'section', properties: { className: ['cs-section'] }, children: [node] };
      out.push(current);
    } else if (current) {
      current.children.push(node);
    } else {
      out.push(node);
    }
  }
  root.children = out;
}

export default function rehypeTodo(options = {}) {
  // `astro build` → production. Detected here so astro.config.mjs needs no change.
  const prod = options.prod ?? (process.argv.includes('build') || process.env.NODE_ENV === 'production');
  return (tree) => {
    if (!prod) {
      bindWords(tree);
      highlight(tree);
      wrapSections(tree);
      return;
    }
    strip(tree);
    dropEmptySections(tree);
    bindWords(tree);
    wrapSections(tree);
  };
}
