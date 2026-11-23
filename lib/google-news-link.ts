// Google News RSS gives news.google.com redirect links. Turn them into the newspaper's own
// article URL so readers (and Google) go straight to the source. Falls back to the original link.
const gnResolved=new Map<string,string>();
function gnIdOf(link:string){return link.match(/news\.google\.com\/(?:rss\/)?articles\/([^?/#]+)/)?.[1]}
export async function resolveGoogleNewsLink(link:string):Promise<string>{
 const id=gnIdOf(link);if(!id)return link;
 const known=gnResolved.get(id);if(known)return known;
 try{
  // Older IDs carry the URL inside the base64 text.
  const raw=Buffer.from(id.replace(/-/g,'+').replace(/_/g,'/'),'base64').toString('latin1');
  if(!raw.includes('AU_yqL')){const u=raw.match(/https?:\/\/[\x21-\x7e]+/)?.[0];if(u){gnResolved.set(id,u);return u}}
  const page=await fetch(`https://news.google.com/rss/articles/${id}`,{next:{revalidate:86400},signal:AbortSignal.timeout(6000),headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'}});
  if(!page.ok)return link;
  const html=await page.text();
  const sig=html.match(/data-n-a-sg="([^"]+)"/)?.[1];const ts=html.match(/data-n-a-ts="([^"]+)"/)?.[1];
  if(!sig||!ts)return link;
  const req=JSON.stringify(['garturlreq',[['X','X',['X','X'],null,null,1,1,'US:en',null,1,null,null,null,null,null,0,1],'X','X',1,[1,1,1],1,1,null,0,0,null,0],id,Number(ts),sig]);
  const r=await fetch('https://news.google.com/_/DotsSplashUi/data/batchexecute',{method:'POST',next:{revalidate:86400},signal:AbortSignal.timeout(6000),headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8','User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'},body:'f.req='+encodeURIComponent(JSON.stringify([[['Fbv4je',req]]]))});
  if(!r.ok)return link;
  const text=await r.text();
  const outer=JSON.parse(text.split('\n\n')[1]);
  const url=JSON.parse(outer[0][2])[1];
  if(typeof url==='string'&&/^https?:\/\//.test(url)&&!url.includes('news.google.com')){gnResolved.set(id,url);return url}
 }catch{}
 return link;
}
