// Shared helpers for "[TODO ...]" markers.
// Dev: markers stay visible (highlighted). Production build: markers are removed,
// together with the sentence they sit in, so no half-finished sentence ships.

export const TODO_RE = /\[TODO[^\]]*\]/g;

export function hasTodo(s) {
  return typeof s === 'string' && /\[TODO/.test(s);
}

/** Removes every TODO marker and the sentence it belongs to. */
export function stripTodo(input, { keepEdges = false } = {}) {
  let s = String(input ?? '');
  const leadWs = keepEdges && /^\s/.test(s) ? ' ' : '';
  const trailWs = keepEdges && /\s$/.test(s) ? ' ' : '';
  let guard = 0;
  while (/\[TODO[^\]]*\]/.test(s) && guard++ < 50) {
    const m = s.match(/\[TODO[^\]]*\]/);
    const start = m.index;
    const end = start + m[0].length;
    // Sentence start: just after the last ". " / "! " / "? " / ": " before the marker.
    const before = s.slice(0, start);
    const lastStop = Math.max(before.lastIndexOf('. '), before.lastIndexOf('! '), before.lastIndexOf('? '));
    const sStart = lastStop >= 0 ? lastStop + 2 : 0;
    const lead = s.slice(sStart, start);
    let sEnd;
    if (lead.trim() === '') {
      // The marker starts its own sentence: drop only the marker (and a following stop).
      sEnd = end;
      if (/^[.!?]/.test(s.slice(sEnd))) sEnd += 1;
    } else {
      // Marker inside a sentence: drop the whole sentence.
      const after = s.slice(end);
      const stop = after.search(/[.!?](\s|$)/);
      sEnd = stop >= 0 ? end + stop + 1 : s.length;
    }
    s = s.slice(0, sStart) + s.slice(sEnd);
  }
  const out = s.replace(/\s{2,}/g, ' ').replace(/\s+([.,;:!?])/g, '$1').trim();
  return out ? leadWs + out + trailWs : '';
}

/** True when nothing meaningful is left once TODOs are removed. */
export function isTodoOnly(s) {
  return stripTodo(s).replace(/[\s.,;:!?()–-]/g, '') === '';
}
