// Wraps every "[TODO ...]" marker in rendered Markdown/MDX in <mark class="todo">
// so unfinished content is impossible to miss on the page.
// No dependencies: walks the HAST tree by hand.

const TODO_RE = /\[TODO[^\]]*\]/g;
const SKIP = new Set(['code', 'pre', 'script', 'style', 'mark']);

function splitText(value) {
  const out = [];
  let last = 0;
  for (const m of value.matchAll(TODO_RE)) {
    if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) });
    out.push({
      type: 'element',
      tagName: 'mark',
      properties: { className: ['todo'] },
      children: [{ type: 'text', value: m[0] }],
    });
    last = m.index + m[0].length;
  }
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
  return out;
}

function walk(node) {
  if (!node || !Array.isArray(node.children)) return;
  if (node.type === 'element' && SKIP.has(node.tagName)) return;
  const next = [];
  for (const child of node.children) {
    if (child.type === 'text' && TODO_RE.test(child.value)) {
      TODO_RE.lastIndex = 0;
      next.push(...splitText(child.value));
    } else {
      TODO_RE.lastIndex = 0;
      walk(child);
      next.push(child);
    }
  }
  node.children = next;
}

export default function rehypeTodo() {
  return (tree) => walk(tree);
}
