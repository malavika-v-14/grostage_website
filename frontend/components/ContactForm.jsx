'use client';
import { useState } from 'react';
export default function ContactForm() {
  const [s,setS] = useState({name:'',email:'',message:''});
  const [status,setStatus] = useState('');
  const [pending,setPending] = useState(false);
  const send = async e => {
    e.preventDefault(); if(pending) return; setPending(true); setStatus('');
    try {
      const r = await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(s)});
      if(!r.ok) throw new Error('send');
      setStatus('Thank you. Your message is with us. We will be in touch soon.');
      setS({name:'',email:'',message:''});
    } catch {setStatus('Your message could not be sent. Please try again or email info@grostage.com.');}
    finally {setPending(false);}
  };
  return <form onSubmit={send} className="cform"><label htmlFor="contact-name">Your name<input id="contact-name" autoComplete="name" required maxLength={150} placeholder="What should we call you?" value={s.name} onChange={e=>setS({...s,name:e.target.value})} /></label><label htmlFor="contact-email">Email address<input id="contact-email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" value={s.email} onChange={e=>setS({...s,email:e.target.value})} /></label><label htmlFor="contact-message">What are you thinking?<textarea id="contact-message" rows={5} required maxLength={10000} placeholder="A little about your idea, business or challenge…" value={s.message} onChange={e=>setS({...s,message:e.target.value})} /></label><button className="btn" disabled={pending}>{pending ? 'Sending…' : 'Let’s start a conversation'}<span>↗</span></button><p className="form-status" role="status" aria-live="polite">{status}</p></form>;
}
