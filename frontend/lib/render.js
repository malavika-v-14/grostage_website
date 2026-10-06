export function Body({ text = '' }) {
  return text.split(/\n\s*\n/).map((b, i) => b.startsWith('## ') ? <h2 key={i}>{b.slice(3)}</h2> : <p key={i}>{b}</p>);
}
