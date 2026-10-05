// Shared guide selector; the established handbook renderers retain all content.
async function resolveGuideLocation(){
  const original=sitePath()+location.search+location.hash;
  const match=sitePath().match(/^\/(routes|countries)(?:\/([^/]+))?\/?$/);
  if(!match)return true;
  const b=APP.bootstrap||await api('/api/bootstrap');APP.bootstrap=b;
  if(original!==sitePath()+location.search+location.hash)return false;
  const qs=new URLSearchParams(location.search),id=decodeURIComponent(match[2]||'');
  if(id){
    if(match[1]==='routes'){
      const route=b.routes.find(r=>r.route_id===id||r.slug===id);
      if(!route)return true; // Preserve the existing not-found handling.
      qs.set('ride',route.route_id);
      if(!qs.get('country')&&route.country_codes?.length===1)qs.set('country',route.country_codes[0]);
    }else{
      const country=b.countries.find(c=>[c.country_id,c.iso2,c.slug].some(value=>String(value||'').toLowerCase()===id.toLowerCase())||norm(c.canonical_name).replace(/ /g,'-')===id);
      if(!country)return true;
      qs.set('country',country.iso2);qs.delete('ride');
    }
  }
  history.replaceState({},'','/field-guides'+(qs.size?'?'+qs.toString():'')+location.hash);
  return true;
}

function groupMapCards(points){
  const categories=[['water','Water'],['food','Food and resupply'],['camping','Camping'],['lodging','Lodging'],['repair','Bike repair'],['fuel','Fuel'],['transport','Transport'],['border','Borders'],['gear','Gear'],['other','Other stops']];
  const groups=new Map(categories.map(([id])=>[id,[]]));
  for(const point of points){const type=point.display_type;groups.get(groups.has(type)?type:'other').push(point)}
  const confidence={high:0,medium:1,low:2};
  return categories.map(([id,label])=>{
    const entries=groups.get(id);
    if(!entries.length)return '';
    entries.sort((a,b)=>(confidence[String(a.pin_confidence).toLowerCase()]??3)-(confidence[String(b.pin_confidence).toLowerCase()]??3)||String(a.nearest_place||'').localeCompare(String(b.nearest_place||''))||String(a.canonical_name).localeCompare(String(b.canonical_name)));
    return `<section class="guide-section map-category" style="margin-top:32px;padding-top:24px;border-top:1px solid #cbdde6"><h2>${label} <span class="meta">(${entries.length})</span></h2><div class="grid two">${entries.map(mapCard).join('')}</div></section>`;
  }).join('');
}

async function fieldGuidesPage(){
  const b=APP.bootstrap||await api('/api/bootstrap');APP.bootstrap=b;
  return `${pageHero('','Field Guides','Choose a country guide or a ride handbook.')}<section class="section"><div class="wrap"><div class="filters" aria-label="Field guide selection"><div class="field"><label for="guide-country">Country</label><select id="guide-country"><option value="">Choose a country</option>${[...b.countries].sort((a,b)=>a.canonical_name.localeCompare(b.canonical_name)).map(c=>`<option value="${esc(c.iso2)}">${esc(c.canonical_name)}</option>`).join('')}</select></div><div class="field"><label for="guide-ride">Ride</label><select id="guide-ride"></select></div></div><div id="guide-downloads" class="guide-actions" hidden></div><p id="guide-status" role="status" class="meta"></p></div></section><div id="selected-guide"></div>`;
}

async function initFieldGuides(){
  const country=$('#guide-country'),ride=$('#guide-ride'),content=$('#selected-guide'),downloads=$('#guide-downloads'),status=$('#guide-status'),b=APP.bootstrap;
  if(!country||!ride||!content||!b)return;
  const params=new URLSearchParams(location.search);country.value=params.get('country')||'';
  function options(preferred=''){
    const routes=b.routes.filter(r=>!country.value||(r.country_codes||[]).includes(country.value));
    ride.innerHTML=`<option value="">${country.value?'Country guide (all rides)':'Or choose a ride'}</option>`+routes.map(r=>`<option value="${esc(r.route_id)}">${esc(r.canonical_name)}</option>`).join('');
    ride.value=routes.some(r=>r.route_id===preferred)?preferred:'';
  }
  options(params.get('ride')||'');
  let version=0;
  async function show(preserveAnchor=false){
    const current=++version,route=b.routes.find(r=>r.route_id===ride.value),nation=b.countries.find(c=>c.iso2===country.value);
    const qs=new URLSearchParams();if(nation)qs.set('country',nation.iso2);if(route)qs.set('ride',route.route_id);
    const anchor=preserveAnchor?location.hash:'';
    history.replaceState({},'',sitePath()+(qs.size?'?'+qs.toString():'')+anchor);
    downloads.hidden=true;downloads.innerHTML='';content.innerHTML='';
    if(!route&&!nation){status.textContent='Select a country or ride above.';return}
    status.textContent='Loading guide…';
    try{
      const html=route?await routeGuidePage(route.slug||route.route_id):await countryPage(nation.iso2);
      if(current!==version||!content.isConnected)return;
      content.innerHTML=html;
      const scope=route?'route':'country',id=route?route.route_id:nation.iso2,name=route?route.canonical_name:nation.canonical_name;
      downloads.innerHTML=`<span>Download ${esc(name)}:</span> `+['json','xlsx'].map(format=>`<a class="btn ghost inlinebtn" href="/api/public-export?scope=${scope}&id=${encodeURIComponent(id)}&format=${format}" download>${format==='json'?'JSON':'Excel'}</a>`).join(' ');
      downloads.hidden=false;status.textContent='';
      const bottom=document.createElement('section');
      bottom.className='section';
      bottom.innerHTML=`<div class="wrap"><h2>Download this guide</h2><div class="guide-actions">${downloads.innerHTML}</div></div>`;
      content.append(bottom);
      if(typeof initQaPolished==='function')initQaPolished(content);
      if(location.hash)jumpToGuideSection(decodeURIComponent(location.hash.slice(1)));
    }catch(error){if(current===version&&content.isConnected)status.textContent='Could not load guide: '+error.message}
  }
  country.onchange=()=>{options();show()};ride.onchange=()=>show();
  await show(true);
}
