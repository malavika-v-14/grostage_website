'use client';
import { useState } from 'react';
export default function Login() {
  const [pw, setPw] = useState(''); const [err, setErr] = useState('');
  const go = async e => { e.preventDefault(); const r = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) }); r.ok ? (location.href = '/admin') : setErr('Wrong password'); };
  return <main className="sec top"><form onSubmit={go} className="wrap cform" style={{ maxWidth: 420 }}><h1 className="h2" style={{ fontSize: 36 }}>Admin login</h1>
    <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} /><button className="btn">Log in</button><p className="mut">{err}</p></form></main>;
}
