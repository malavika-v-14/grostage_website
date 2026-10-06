'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
export default function SiteLoader(){const [show,setShow]=useState(true);useEffect(()=>{const t=setTimeout(()=>setShow(false),700);return()=>clearTimeout(t)},[]);if(!show)return null;return <div className="site-loader" aria-hidden="true"><Image src="/brand/grostage-original.png" alt="" width={300} height={425} priority /><span /></div>}
