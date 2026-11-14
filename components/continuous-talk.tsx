'use client'
import { useEffect, useRef, useState } from 'react'
export default function ContinuousTalk({onTalk}: {onTalk:(active:boolean)=>void}) {
 const running=useRef(false)
 const timeout=useRef<ReturnType<typeof setTimeout>|null>(null)
 const [active,setActive]=useState(false)
 const [title,setTitle]=useState('')
 const [error,setError]=useState('')
 const stop=()=>{running.current=false;if(timeout.current)clearTimeout(timeout.current);speechSynthesis.cancel();setActive(false);onTalk(false)}
 const cycle=async()=>{
  if(!running.current)return
  try{
   const r=await fetch('/api/radio/programme',{cache:'no-store'})
   if(!r.ok)throw Error('Unavailable')
   const data=await r.json() as {name:string;script:string}
   if(!running.current)return
   setTitle(data.name);setError('')
   const voices=speechSynthesis.getVoices()
   const voice=voices.find(v=>/^en-(AU|NZ)$/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang))||null
   const parts=data.script.match(/.{1,180}(?:\s|$)/g)||[data.script]
   let i=0
   const next=()=>{
    if(!running.current)return
    if(i===parts.length){timeout.current=setTimeout(()=>void cycle(),1200);return}
    const u=new SpeechSynthesisUtterance(parts[i++]);u.voice=voice;u.lang=voice?.lang||'en-AU';u.rate=.98
    u.onend=next
    u.onerror=(e)=>{if(!running.current)return;if(e.error==='interrupted'||e.error==='canceled')return;setError('Voice interrupted. Please restart.');stop()}
    speechSynthesis.speak(u)
   }
   next()
  }catch{if(running.current){setError('Programme unavailable; retrying.');timeout.current=setTimeout(()=>void cycle(),15000)}}
 }
 const start=()=>{
  if(!('speechSynthesis' in window)){setError('Browser speech unavailable');return}
  speechSynthesis.cancel();speechSynthesis.getVoices();running.current=true;setActive(true);setError('');onTalk(true);void cycle()
 }
 useEffect(()=>()=>{running.current=false;if(timeout.current)clearTimeout(timeout.current);if('speechSynthesis' in window)speechSynthesis.cancel()},[])
 return <div className="mt-5 border-t border-slate-800 pt-5">
  <button type="button" onClick={active?stop:start} className="rounded-full border border-red-500 px-5 py-3 font-bold">{active?'Stop continuous talk':'Start free continuous talk'}</button>
  <p className="mt-2 text-sm text-slate-300">{active?'Speaking: '+title:'Spoken programmes play over the existing music; music lowers during speech.'}</p>
  {error&&<p role="alert" className="mt-2 text-sm text-amber-300">{error}</p>}
 </div>
}