'use client';
import { useState, useEffect } from 'react';
const empty = { title: '', slug: '', excerpt: '', content: '', image: '', published: true };
const fFields = [['tagline', 'Tagline'], ['email', 'Email'], ['phone', 'Phone'], ['address', 'Address'], ['copyright', 'Copyright text']];
export default function AdminClient() {
  const [tab, setTab] = useState('posts'); const [rows, setRows] = useState([]); const [f, setF] = useState(null); const [ft, setFt] = useState(null); const [msg, setMsg] = useState('');
  const load = async () => { if (tab === 'footer') setFt(await (await fetch('/api/footer')).json()); else setRows(await (await fetch('/api/content/' + tab)).json()); };
  useEffect(() => { setF(null); setMsg(''); load(); }, [tab]);
  const save = async () => { const r = await fetch('/api/content/' + tab + (f.id ? '/' + f.id : ''), { method: f.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) }); const d = await r.json(); if (r.ok) { setF(null); setMsg('Saved'); load(); } else setMsg(d.error || 'Error'); };
  const del = async id => { if (confirm('Delete this item?')) { await fetch('/api/content/' + tab + '/' + id, { method: 'DELETE' }); load(); } };
  const up = async e => { const fd = new FormData(); fd.append('file', e.target.files[0]); setMsg('Uploading…'); const d = await (await fetch('/api/upload', { method: 'POST', body: fd })).json(); d.url ? (setF({ ...f, image: d.url }), setMsg('Image uploaded')) : setMsg(d.error || 'Upload failed'); };
  const saveFooter = async () => { const r = await fetch('/api/footer', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ft) }); setMsg(r.ok ? 'Footer saved' : 'Error'); };
  const out = async () => { await fetch('/api/login', { method: 'DELETE' }); location.href = '/admin/login'; };
  return (<main className="sec top adm"><div className="wrap">
    <div className="row between"><h1 className="h2" style={{ fontSize: 40 }}>Admin</h1><button className="btn ghost sm" onClick={out}>Log out</button></div>
    <div className="tabs">{['posts', 'pages', 'footer'].map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t === 'posts' ? 'Blog posts' : t === 'pages' ? 'Content pages' : 'Footer'}</button>)}</div>
    {msg && <p className="mut">{msg}</p>}
    {tab === 'footer' && ft && <div className="cform">
      {fFields.map(([k, l]) => <label key={k}>{l}<input value={ft[k] || ''} onChange={e => setFt({ ...ft, [k]: e.target.value })} /></label>)}
      <label>Footer links (one per line: Label|/url)<textarea rows={5} value={ft.links || ''} onChange={e => setFt({ ...ft, links: e.target.value })} /></label>
      <label>Social links (one per line: Label|https://…)<textarea rows={4} value={ft.socials || ''} onChange={e => setFt({ ...ft, socials: e.target.value })} /></label>
      <button className="btn" onClick={saveFooter}>Save footer</button></div>}
    {tab !== 'footer' && !f && <><button className="btn sm" onClick={() => setF({ ...empty })}>+ New {tab === 'posts' ? 'post' : 'page'}</button>
      <div className="list">{rows.map(r => <div key={r.id} className="item"><div><b>{r.title}</b><small className="mut"> /{tab === 'posts' ? 'blog' : 'p'}/{r.slug}{r.published ? '' : ' (draft)'}</small></div>
        <div className="row"><button className="btn ghost sm" onClick={() => setF(r)}>Edit</button><button className="btn ghost sm" onClick={() => del(r.id)}>Delete</button></div></div>)}{!rows.length && <p className="mut">Nothing here yet.</p>}</div></>}
    {tab !== 'footer' && f && <div className="cform">
      <label>Title<input value={f.title} onChange={e => setF({ ...f, title: e.target.value })} /></label>
      <label>Slug (optional)<input value={f.slug} onChange={e => setF({ ...f, slug: e.target.value })} /></label>
      <label>Short summary<input value={f.excerpt} onChange={e => setF({ ...f, excerpt: e.target.value })} /></label>
      <label>Content (blank line = new paragraph, “## ” = heading)<textarea rows={14} value={f.content} onChange={e => setF({ ...f, content: e.target.value })} /></label>
      <label>Cover image<input type="file" accept="image/*" onChange={up} /></label>{f.image && <img src={f.image} alt="" style={{ maxWidth: 260, borderRadius: 12 }} />}
      <label className="row"><input type="checkbox" checked={f.published} onChange={e => setF({ ...f, published: e.target.checked })} style={{ width: 'auto' }} /> Published</label>
      <div className="row"><button className="btn" onClick={save}>Save</button><button className="btn ghost" onClick={() => setF(null)}>Cancel</button></div></div>}
  </div></main>);
}
