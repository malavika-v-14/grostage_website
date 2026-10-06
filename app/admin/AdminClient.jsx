'use client';
import { useState, useEffect } from 'react';

const empty = { title: '', slug: '', category: '', excerpt: '', content: '', tags: '', image: '', published: true };
const footerFields = [['tagline', 'Tagline'], ['email', 'Email'], ['phone', 'Phone'], ['address', 'Address'], ['copyright', 'Copyright text']];
const socialFields = [['linkedin', 'LinkedIn URL', 'LinkedIn'], ['instagram', 'Instagram URL', 'Instagram'], ['facebook', 'Facebook URL', 'Facebook'], ['youtube', 'YouTube URL', 'YouTube'], ['twitter', 'Twitter / X URL', 'Twitter / X']];
const socialAliases = { linkedin: 'linkedin', instagram: 'instagram', facebook: 'facebook', youtube: 'youtube', twitter: 'twitter', twitterx: 'twitter', x: 'twitter' };

function footerForEditing(data) {
  const fields = Object.fromEntries(socialFields.map(([key]) => [key, '']));
  String(data.socials || '').split('\n').forEach(line => {
    const [label, ...urlParts] = line.split('|');
    const normalized = String(label || '').toLowerCase().replace(/[^a-z]/g, '');
    const key = socialAliases[normalized];
    if (key) fields[key] = urlParts.join('|').trim();
  });
  return { ...data, ...fields };
}

export default function AdminClient() {
  const [tab, setTab] = useState('works');
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(null);
  const [footer, setFooter] = useState(null);
  const [message, setMessage] = useState('');

  const load = async () => {
    const endpoint = tab === 'footer' ? '/api/footer' : tab === 'contacts' ? '/api/contacts' : `/api/content/${tab}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || 'Unable to load data');
    if (tab === 'footer') setFooter(footerForEditing(data));
    else setRows(data);
  };

  useEffect(() => {
    setForm(null);
    setMessage('');
    load();
  }, [tab]);

  const save = async () => {
    const response = await fetch(`/api/content/${tab}${form.id ? `/${form.id}` : ''}`, {
      method: form.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || 'Unable to save');
    setForm(null);
    setMessage(tab === 'works' ? 'Work saved and published to the website.' : 'Post saved.');
    load();
  };

  const remove = async id => {
    if (!confirm('Delete this item?')) return;
    const response = await fetch(`/api/content/${tab}/${id}`, { method: 'DELETE' });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? 'Deleted.' : data.error || 'Unable to delete');
    if (response.ok) load();
  };

  const upload = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    setMessage('Uploading…');
    const response = await fetch('/api/upload', { method: 'POST', body: data });
    const result = await response.json();
    if (result.url) {
      setForm(current => ({ ...current, image: result.url }));
      setMessage('Image uploaded.');
    } else setMessage(result.error || 'Upload failed');
  };

  const saveFooter = async () => {
    const socials = socialFields.map(([key, , label]) => footer[key] ? `${label}|${footer[key].trim()}` : '').filter(Boolean).join('\n');
    const payload = { ...footer, socials };
    socialFields.forEach(([key]) => delete payload[key]);
    const response = await fetch('/api/footer', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setMessage(response.ok ? 'Footer saved.' : 'Unable to save footer.');
  };

  const logOut = async () => {
    await fetch('/api/login', { method: 'DELETE' });
    location.href = '/admin/login';
  };

  const edit = row => setForm({
    ...row,
    tags: Array.isArray(row.tags) ? row.tags.join(', ') : (row.tags || ''),
  });

  const publicPath = row => `/${tab === 'works' ? 'work' : 'blog'}/${row.slug}`;

  return <main className="sec top adm"><div className="wrap">
    <div className="row between"><h1 className="h2" style={{ fontSize: 40 }}>Admin</h1><button className="btn ghost sm" onClick={logOut}>Log out</button></div>
    <div className="tabs">
      {[['works', 'Work'], ['posts', 'Blog posts'], ['contacts', 'Contact submissions'], ['footer', 'Footer']].map(([key, label]) =>
        <button key={key} className={tab === key ? 'on' : ''} onClick={() => setTab(key)}>{label}</button>
      )}
    </div>
    {message && <p className="mut">{message}</p>}

    {tab === 'footer' && footer && <div className="cform">
      {footerFields.map(([key, label]) => <label key={key}>{label}<input value={footer[key] || ''} onChange={event => setFooter({ ...footer, [key]: event.target.value })} /></label>)}
      <label>Footer links (one per line: Label|/url)<textarea rows={5} value={footer.links || ''} onChange={event => setFooter({ ...footer, links: event.target.value })} /></label>
      <section className="admin-social-panel">
        <h2>Social Links</h2>
        <div>{socialFields.map(([key, label]) => <label key={key}>{label}<input type="url" inputMode="url" placeholder="https://" value={footer[key] || ''} onChange={event => setFooter({ ...footer, [key]: event.target.value })} /></label>)}</div>
      </section>
      <button className="btn" onClick={saveFooter}>Save footer</button>
    </div>}

    {tab === 'contacts' && <div className="list">
      {rows.map(row => <article key={row.id} className="item contact-item"><div><b>{row.name}</b><small className="mut"> {row.email} · {new Date(row.created_at).toLocaleString()}</small><p>{row.message}</p></div></article>)}
      {!rows.length && <p className="mut">No contact submissions yet.</p>}
    </div>}

    {!['footer', 'contacts'].includes(tab) && !form && <>
      <button className="btn sm" onClick={() => setForm({ ...empty })}>+ Add new {tab === 'works' ? 'work' : 'post'}</button>
      <div className="list">
        {rows.map(row => <div key={row.id} className="item"><div><b>{row.title}</b><small className="mut"> {publicPath(row)}{row.published ? '' : ' (draft)'}</small></div>
          <div className="row"><a className="btn ghost sm" href={publicPath(row)} target="_blank" rel="noreferrer">View</a><button className="btn ghost sm" onClick={() => edit(row)}>Edit</button><button className="btn ghost sm" onClick={() => remove(row.id)}>Delete</button></div>
        </div>)}
        {!rows.length && <p className="mut">Nothing here yet.</p>}
      </div>
    </>}

    {!['footer', 'contacts'].includes(tab) && form && <div className="cform">
      <label>Title<input value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} /></label>
      <label>Slug (optional)<input value={form.slug} onChange={event => setForm({ ...form, slug: event.target.value })} /></label>
      {tab === 'works' && <label>Category<input placeholder="Example: E-commerce / Digital product" value={form.category || ''} onChange={event => setForm({ ...form, category: event.target.value })} /></label>}
      <label>Short summary<input value={form.excerpt} onChange={event => setForm({ ...form, excerpt: event.target.value })} /></label>
      <label>Detailed content <small className="mut">Use a blank line for a new paragraph. Start a heading with ## followed by a space.</small><textarea rows={14} placeholder={'Project introduction.\n\n## The challenge\n\nDescribe the challenge here.'} value={form.content} onChange={event => setForm({ ...form, content: event.target.value })} /></label>
      {tab === 'works' && <label>Tags (comma separated)<input placeholder="Website, UI/UX, E-commerce" value={form.tags || ''} onChange={event => setForm({ ...form, tags: event.target.value })} /></label>}
      <label>Cover image<input type="file" accept="image/*" onChange={upload} /></label>
      {form.image && <img src={form.image} alt="" style={{ maxWidth: 260, borderRadius: 12 }} />}
      <label className="row"><input type="checkbox" checked={form.published} onChange={event => setForm({ ...form, published: event.target.checked })} style={{ width: 'auto' }} /> Published</label>
      <div className="row"><button className="btn" onClick={save}>Save {tab === 'works' ? 'work' : 'post'}</button><button className="btn ghost" onClick={() => setForm(null)}>Cancel</button></div>
    </div>}
  </div></main>;
}
