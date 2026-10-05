/* GitHub Pages compatibility layer.
 * Railway remains the API/Ask backend; GitHub Pages serves only public static UI.
 */
(()=>{
  const onPages=location.hostname.endsWith('github.io');
  const base=onPages?'/cycling-americas-pages':'';
  const apiBase=onPages?'https://cycling-americas-web-production.up.railway.app':'';
  window.CYCLING_SITE={onPages,base,apiBase};
  window.sitePath=()=>{
    const p=location.pathname||'/';
    if(base&&p===base)return '/';
    if(base&&p.startsWith(base+'/'))return p.slice(base.length)||'/';
    return p;
  };
  window.siteBrowserPath=logical=>{
    const raw=String(logical||'/');
    if(!onPages||!raw.startsWith('/'))return raw;
    if(raw===base||raw.startsWith(base+'/'))return raw;
    return base+raw;
  };

  if(!onPages)return;

  const nativeFetch=window.fetch.bind(window);
  window.fetch=(input,init)=>{
    if(typeof input==='string'&&input.startsWith('/api/'))input=apiBase+input;
    return nativeFetch(input,init);
  };

  for(const method of ['pushState','replaceState']){
    const native=history[method].bind(history);
    history[method]=(state,title,url)=>{
      if(typeof url==='string'&&url.startsWith('/')&&!url.startsWith('//'))url=siteBrowserPath(url);
      return native(state,title,url);
    };
  }

  const rewrite=root=>{
    const links=[],assets=[];
    if(root?.matches?.('a[href]'))links.push(root);
    root?.querySelectorAll?.('a[href]')?.forEach(a=>links.push(a));
    for(const a of links){
      const href=a.getAttribute('href')||'';
      if(href.startsWith('/api/'))a.setAttribute('href',apiBase+href);
      else if(href.startsWith('/')&&!href.startsWith('//'))a.setAttribute('href',siteBrowserPath(href));
    }
    if(root?.matches?.('[src],[poster]'))assets.push(root);
    root?.querySelectorAll?.('[src],[poster]')?.forEach(el=>assets.push(el));
    for(const el of assets){
      for(const attr of ['src','poster']){
        const value=el.getAttribute(attr)||'';
        if(value.startsWith('/')&&!value.startsWith('//'))el.setAttribute(attr,siteBrowserPath(value));
      }
    }
  };
  rewrite(document);
  new MutationObserver(muts=>muts.forEach(m=>m.addedNodes.forEach(n=>n.nodeType===1&&rewrite(n))))
    .observe(document.documentElement,{childList:true,subtree:true});
})();