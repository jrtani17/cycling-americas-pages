/* Presentation only: preserve source records, quantities and dated observations. */
const READING_ORDER=['food-water','sleep','repair-gear','transport-borders','overview','money-connectivity'];
HANDBOOK_CHAPTERS.sort((a,b)=>READING_ORDER.indexOf(a.id)-READING_ORDER.indexOf(b.id));
const READING_TITLES={'food-water':'Food, Water & Fuel',sleep:'Sleep & Camping','repair-gear':'Bikes & Repairs','transport-borders':'Transport & Borders',overview:'Roads, Weather & Safety','money-connectivity':'Money & Connectivity'};
HANDBOOK_CHAPTERS.forEach(c=>c.title=READING_TITLES[c.id]);
const READING_GROUPS={
  'food-water':[['Food and resupply',/food|grocer|resupply|restaurant|store|meal/i],['Water and carrying capacity',/water|litre|liter|\bl\b.*carry/i],['Stove fuel and supplies',/fuel|gas|canister|stove|bencina|alcohol/i]],
  sleep:[['Choosing where to stay',/camping dependence|wild camp|where to|sleep strategy|overnight|camping strategy/i],['Campsites and refuges',/camp|refug|tent/i],['Hostels and lodging',/hostel|hostal|hosped|hotel|lodg|casa|residencial/i]],
  'repair-gear':[['Bike setup and spares',/setup|spare|tire|tyre|wheel size|gearing|frame|loaded|tubeless|equipment/i],['Failures and field repairs',/failure|broken|workaround|puncture|emergency|damaged/i],['Shops, mechanics and parts',/shop|mechanic|bike|bici|cycle|parts|workshop|repair|taller/i]],
  'transport-borders':[['Ferries and boats',/ferry|ferries|boat|sailing|terminal|navigation operator|barcaza/i],['Buses and other bailouts',/bus|bailout|pickup|hitch|taxi|flight|transfer|transport/i],['Border crossings',/border|crossing|customs|immigration|pdi|aduana/i]],
  overview:[['Road surface and terrain',/surface|ripio|gravel|climb|pavement|terrain|route profile|road/i],['Weather, wind and timing',/weather|wind|season|snow|rain|timing/i],['Safety and access',/safety|hazard|closure|access|advisory|traffic|dog/i]],
  'money-connectivity':[['Cash, cards and ATMs',/cash|money|card|atm|fee|currency|bank/i],['Phone signal and navigation',/signal|internet|connect|sim|phone|offline|navigation|wifi/i]]
};
function readingText(value,title=''){
  let text=String(value||'').trim();
  text=text.replace(/^Approved named public ((?:[\w/-]+\s+){0,3})target near ([^.]+)\.\s*/i,(_,service,place)=>`Reported ${service.trim()} near ${place}. `);
  text=text.replace(/Supplied research snapshot \((\d{4}-\d{2}-\d{2})\):\s*/gi,'');
  text=text.replace(/^Topic:[^\n]*\n/gim,'').replace(/^Answer:\s*/gim,'');
  text=text.replace(/^[^\n]*\?\.\s*(?=\n|Topic:|Answer:)/,'');
  if(title&&text.toLowerCase().startsWith(title.toLowerCase()+'.'))text=text.slice(title.length+1).trim();
  return text;
}
function readingParagraphs(value){
  // Render actual list markers as lists, without altering hyphenated place names.
  const lines=String(value).replace(/:\s+-\s+/g,':\n- ').replace(/;\s+-\s+/g,';\n- ').split(/\n/);
  let out='',paragraph=[],items=[];
  const flush=()=>{if(paragraph.length){out+='<p>'+esc(paragraph.join(' '))+'</p>';paragraph=[]}if(items.length){out+='<ul>'+items.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul>';items=[]}};
  for(const line of lines){const t=line.trim(),match=t.match(/^[-•]\s+(.+)/);if(!t){flush();continue}if(match){if(paragraph.length)flush();items.push(match[1])}else{if(items.length)flush();paragraph.push(t)}}flush();return out;
}
// Deduplicate only the reading excerpts, never their evidence or provenance.
handbookChapterContent=(chapter,{units=[],facts=[],points=[]})=>{
  const u=units.filter(v=>guideBucketForUnit(v)===chapter.id),f=facts.filter(v=>guideBucketForFact(v)===chapter.id);
  return {units:u,facts:f,points:guidePointsFor(points,chapter.id),total:u.length+f.length};
};
function readingExcerpt(value){
  const text=readingText(value).trim();
  const paragraph=text.split(/\n\s*\n/)[0];
  if(/(?:^|\n)\s*(?:[-•]|\d+[.)])\s/.test(paragraph))return paragraph.split('\n').slice(0,4).join('\n');
  // Extract complete sentences; never synthesize a claim or cut a quantity in half.
  if(typeof Intl.Segmenter==='function')return [...new Intl.Segmenter('en',{granularity:'sentence'}).segment(paragraph)].slice(0,2).map(s=>s.segment).join('').trim();
  return paragraph;
}
function readingTechnical(r){return /structured_route_model/i.test(r.value.evidence_strength||'')||/current change log|Evidence class:|the database (?:currently )?(?:models|should)|public route pages should|canonical line.*conflat|Route ID:|Operational meaning:|geocode and current-verify|next research pass/i.test(r.title+' '+r.text)}
function readingRank(r){
  const text=readingText(r.lead||r.text,r.title);
  return (/\.{3}|…/.test(text)?-20:0)+(/carrying|capacity|carry|spares|availability|dependence|gaps|cash|signal|season|rough|surface|border|delay/i.test(text)?4:0)+(/\d/.test(text)?2:0)+(r.lead?1:0)-(/Approved named public|research pass|database|business identity still needs/i.test(r.text)?4:0);
}
function readingRecords(chapter,payload){
  const data=handbookChapterContent(chapter,payload);
  return [...data.units.map(value=>({title:guideDisplayLabel(value.title),text:value.detailed_answer||value.concise_answer||'',lead:value.concise_answer,value})),...data.facts.map(value=>({title:handbookFactTitle(value),text:value.value_text||'',value}))].map((r,i)=>({...r,number:i+1,chapter:chapter.id}));
}
function readingSourceLink(r,label='Full detail & source'){
  return `<a class="reading-ref" href="#${r.chapter}-source-${r.number}">${esc(label)}</a>`;
}
function readingNarrative(entries){
  const claims=[];
  [...entries].sort((a,b)=>readingRank(b)-readingRank(a)).forEach(r=>{
    const text=readingText(r.text||r.lead,r.title).replace(/\s*\n\s*[-•]\s+/g,'. ').replace(/\s+/g,' ').trim(),v=r.value||{};
    const date=v.observation_date||v.source_date||v.source_publication_date||v.latest_verification_at||v.last_verified||v.last_checked_date||'';
    const datedRider=/rider|dated/i.test([r.title,v.evidence_strength,v.freshness_class,v.temporal_status,v.source_type].filter(Boolean).join(' '));
    const dateLabel=String(date).match(/^(\d{4})-(\d{2})/) ? new Intl.DateTimeFormat('en',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(String(date).slice(0,10)+'T00:00:00Z')) : String(date);
    const sentences=typeof Intl.Segmenter==='function'
      ? [...new Intl.Segmenter('en',{granularity:'sentence'}).segment(text)].map(s=>s.segment.trim())
      : (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[]).map(s=>s.trim());
    sentences.filter(Boolean).forEach((sentence,index)=>{
      if(index===0&&datedRider&&dateLabel&&!/rider (?:reported|report|observation)/i.test(sentence))sentence=`A ${dateLabel} rider reported: ${sentence}`;
      const key=norm(sentence);
      if(!key||claims.some(c=>c.key===key||(key.length>80&&c.key.includes(key))||(c.key.length>80&&key.includes(c.key))))return;
      claims.push({key,text:sentence,source:r});
    });
  });
  const chunks=[];let i=0;
  while(i<claims.length){
    const remaining=claims.length-i;
    if(remaining<=5){if(remaining===1&&chunks.length)chunks[chunks.length-1].push(claims[i]);else chunks.push(claims.slice(i));break}
    const size=remaining===6?3:4;chunks.push(claims.slice(i,i+size));i+=size;
  }
  return chunks.map(chunk=>{
    const sources=[];chunk.forEach(c=>{if(!sources.includes(c.source))sources.push(c.source)});
    return `<p>${esc(chunk.map(c=>c.text).join(' '))} <span class="reading-inline-sources">${sources.map(r=>readingSourceLink(r,'['+(r.sourceNumber||r.number)+']')).join(' ')}</span></p>`;
  }).join('');
}
function readingSource(r){
  const v=r.value,dates=['observation_date','source_date','source_publication_date','latest_verification_at','last_verified','last_checked_date'].filter(k=>v[k]).map(k=>`${k.replaceAll('_',' ')}: ${v[k]}`);
  const url=isSafePublicUrl(v.source_url);
  return `<li id="${r.chapter}-source-${r.number}" value="${r.sourceNumber||r.number}"><strong>${esc(r.title||'Field observation')}</strong>${readingParagraphs(r.text)}${v.concise_answer&&v.concise_answer!==r.text?readingParagraphs(v.concise_answer):''}<p class="meta">${esc([v.product_unit_id||v.external_fact_id, ...dates,v.evidence_strength,v.source_name,v.freshness_class||v.freshness,v.verification_warning].filter(Boolean).join(' · '))}${url?` · <a href="${esc(url)}" target="_blank" rel="noreferrer">Source ↗</a>`:''}</p></li>`;
}
handbookTopic=function(chapter,payload){
  const data=handbookChapterContent(chapter,payload);
  if(!data.total&&!data.points.length)return '';
  const records=readingRecords(chapter,payload);
  const seen=new Set(),entries=records.filter(r=>{const key=norm(r.text);if(!key||seen.has(key))return false;seen.add(key);return true});
  const groups=(READING_GROUPS[chapter.id]||[]).map(([title,test])=>({title,test,entries:[]}));
  const other={title:'Other practical details',entries:[]};
  const technical=[];
  entries.forEach((r,index)=>{
    if(readingTechnical(r)){technical.push(r);return}
    const haystack=r.title+' '+String(r.value.subcategory||'')+' '+String(r.value.category||'');
    // Fuel and borders are specific enough to take priority over generic store/transport terms.
    let group;
    if(chapter.id==='food-water'&&/fuel|gas|canister|stove|bencina/i.test(haystack))group=groups[2];
    if(chapter.id==='transport-borders'&&/border|customs|immigration|pdi|aduana/i.test(haystack))group=groups[2];
    group=group||groups.find(g=>g.test.test(haystack))||groups.find(g=>g.test.test(r.text))||other;
    group.entries.push(r);
  });
  const renderGroup=group=>{
    if(!group.entries.length)return '';
    return `<div class="reading-subtopic"><h3>${esc(group.title)}</h3><div class="reading-passage reading-narrative">${readingNarrative(group.entries)}</div></div>`;
  };
  const sources=records.map(readingSource).join('');
  return `<section class="handbook-topic guide-section reading-chapter" id="${chapter.id}"><h2>${esc(chapter.title)}</h2><div class="reading-body">${[...groups,other].map(renderGroup).join('')}</div>${data.points.length?`<p class="handbook-map-cue"><a href="#by-place" data-guide-jump>Browse mapped stops →</a></p>`:''}${records.length?`<details id="${chapter.id}-sources" class="reading-sources"><summary>Sources & dates — all ${records.length} notes</summary><ol>${sources}</ol></details>`:''}</section>`;
};
handbookNav=function(extra=[],chapters=HANDBOOK_CHAPTERS){
  const links=[['quick-reference','Overview'],...(chapters.length?[['essentials','Essentials']]:[]),...extra.filter(([id])=>id==='by-place').map(([id])=>[id,'Route & places']),...extra.filter(([id])=>id==='questions').map(([id])=>[id,'FAQ']),['guide-sources','Sources']];
  return `<nav class="guide-nav handbook-nav" aria-label="Guide sections"><div class="wrap">${links.map(([id,label])=>`<a href="#${id}" data-guide-jump onclick="jumpToGuideSection('${id}');return false">${label}</a>`).join('')}</div></nav>`;
};
let READING_ACTIVE_PAYLOAD=null;
function readingPageKind(payload){return (payload?.segments||[]).length||(payload?.facts||[]).some(v=>v.route_id)?'route':'country'}
function readingAllRecords(payload){return handbookActiveChapters(payload).flatMap(c=>readingRecords(c,payload)).map((r,i)=>({...r,sourceNumber:i+1}))}
function readingArticleKey(record,kind){
  const hay=(record.title+' '+record.text+' '+String(record.value?.subcategory||'')+' '+String(record.value?.category||'')+' '+String(record.value?.data_field||'')).toLowerCase();
  if(kind==='route'){
    if(record.chapter==='food-water')return 'food';
    if(record.chapter==='sleep')return 'sleep';
    if(record.chapter==='repair-gear')return 'repair';
    if(record.chapter==='money-connectivity')return 'money';
    if(record.chapter==='transport-borders')return 'transport';
    if(/road|surface|ripio|gravel|pavement|terrain|climb|weather|wind|season|snow|rain|safety|hazard|traffic|closure|access/.test(hay))return 'roads';
    if(/plan|itinerary|direction|northbound|southbound|days?|distance|navigation|prepare|strategy|carry|packing|load/.test(hay))return 'planning';
    return 'overview';
  }
  if(record.chapter==='food-water')return 'food';
  if(record.chapter==='sleep')return 'sleep';
  if(record.chapter==='repair-gear')return 'repair';
  if(record.chapter==='money-connectivity')return /signal|internet|connect|sim|phone|wifi|mobile/.test(hay)?'connectivity':'money';
  if(record.chapter==='transport-borders')return /border|custom|immigration|crossing|permit|aduana|pdi/.test(hay)?'borders':'transport';
  if(/season|weather|wind|rain|snow|altitude|elevation|puna|heat|cold/.test(hay))return 'season';
  if(/road|surface|ripio|gravel|pavement|traffic|shoulder|driver|hazard/.test(hay))return 'roads';
  if(/major ride|major route|route network|corridor|circuit|loop/.test(hay))return 'rides';
  return 'overview';
}
function readingArticleDefs(kind){
  return kind==='route'
    ? [['overview','Overview','overview'],['planning','Planning the ride','planning'],['roads','Roads, terrain, weather & safety','roads'],['food-water','Food, water & stove fuel','food'],['sleep','Camping & lodging','sleep'],['repair-gear','Bike repair & spares','repair'],['money-connectivity','Cash, cards & connectivity','money'],['transport-borders','Transport, ferries, borders & bailouts','transport']]
    : [['overview','What cycling here is actually like','overview'],['season','Season / weather / altitude','season'],['roads','Roads & traffic','roads'],['food-water','Food & water','food'],['sleep','Camping & lodging','sleep'],['repair-gear','Repairs & major service hubs','repair'],['money','Money & ATMs','money'],['connectivity','Connectivity','connectivity'],['transport','Buses / transport with bicycles','transport'],['borders','Borders / permits','borders'],['rides','Major rides and how they differ','rides']];
}
function readingArticleSection(def,records,kind){
  const [id,title,key]=def,entries=records.filter(r=>!readingTechnical(r)&&readingArticleKey(r,kind)===key);
  if(!entries.length)return '';
  return `<section class="handbook-topic guide-section reading-chapter reading-article-section" id="${id}"><h2>${esc(title)}</h2><div class="reading-body reading-narrative">${readingNarrative(entries)}</div></section>`;
}
handbookParts=function(payload){
  READING_ACTIVE_PAYLOAD=payload;
  const kind=readingPageKind(payload),records=readingAllRecords(payload),defs=readingArticleDefs(kind);
  const active=defs.filter(def=>records.some(r=>!readingTechnical(r)&&readingArticleKey(r,kind)===def[2]));
  const introEntries=records.filter(r=>!readingTechnical(r)&&readingArticleKey(r,kind)==='overview').slice(0,4);
  const intro=introEntries.length?`<div class="reading-intro">${readingNarrative(introEntries)}</div>`:'';
  return `${intro}<section id="essentials" class="reading-essentials"><h2>Field guide</h2><div class="reading-topic-index">${active.map(def=>`<a href="#${def[0]}" data-guide-jump>${esc(def[1])}</a>`).join('')}</div></section>${active.map(def=>readingArticleSection(def,records,kind)).join('')}`;
};
const readingQuickReference=handbookQuickReference;
handbookQuickReference=function(payload){
  READING_ACTIVE_PAYLOAD=payload;
  const kind=readingPageKind(payload),records=readingAllRecords(payload);
  const notes=readingArticleDefs(kind).map(def=>{
    const r=records.filter(x=>!readingTechnical(x)&&readingArticleKey(x,kind)===def[2]).sort((a,b)=>readingRank(b)-readingRank(a))[0];
    return r?`<div><dt><a href="#${def[0]}" data-guide-jump>${esc(def[1])}</a></dt><dd>${readingParagraphs(readingExcerpt(readingText(r.lead||r.text,r.title)))}${readingSourceLink(r,'Detail')}</dd></div>`:'';
  }).join('');
  return readingQuickReference(payload).replace('</section>',`<dl class="reading-brief">${notes}</dl></section>`);
};
function readingPlaceKey(value){return norm(value).replace(/\b(province|region|department|departamento)\b/g,'').trim()}
function readingPlaceMatches(record,place){
  const key=readingPlaceKey(place),v=record.value||{};
  const labels=[record.title,v.nearest_place,v.place_name,v.locality,v.municipality,v.poi_or_service_name].filter(Boolean);
  if(labels.some(label=>{const k=readingPlaceKey(label);return k===key||(key.length>5&&k.includes(key))||(k.length>5&&key.includes(k))}))return true;
  return key.length>5&&readingPlaceKey(readingText(record.text,record.title)).includes(key);
}
handbookByPlace=function({kind,points=[],segments=[],mapHref,mapLabel,countries=[]}){
  const ordered=[...segments].sort((a,b)=>(a.sequence_no??Infinity)-(b.sequence_no??Infinity));
  const order=[...new Set(ordered.flatMap(s=>[s.start_place_name,s.end_place_name]).filter(Boolean))];
  const groups=new Map();
  points.forEach(p=>{const place=p.nearest_place||'Other mapped stops';if(!groups.has(place))groups.set(place,[]);groups.get(place).push(p)});
  const records=READING_ACTIVE_PAYLOAD?handbookActiveChapters(READING_ACTIVE_PAYLOAD).flatMap(c=>readingRecords(c,READING_ACTIVE_PAYLOAD)).filter(r=>!readingTechnical(r)):[];
  const allPlaces=[...new Set([...order,...groups.keys()])];
  const rank=place=>{const i=order.findIndex(v=>readingPlaceKey(v)===readingPlaceKey(place));return i<0?Infinity:i};
  allPlaces.sort((a,b)=>rank(a)-rank(b)||a.localeCompare(b));
  const rendered=allPlaces.map(place=>{
    const stops=groups.get(place)||[],matched=records.filter(r=>readingPlaceMatches(r,place));
    const prose=matched.length?readingNarrative(matched):'';
    if(!prose&&!stops.length)return '';
    return `<section class="reading-place"><h3>${esc(place)}</h3>${prose?`<div class="reading-place-copy">${prose}</div>`:''}${stops.map(p=>`<details class="reading-stop"><summary><strong>${esc(p.canonical_name)}</strong><span>${esc(p.display_type||p.service_type||p.point_type||'')}</span></summary>${mapCard(p)}</details>`).join('')}</section>`;
  }).join('');
  return `<section class="handbook-place guide-section reading-places" id="by-place"><h2>${kind==='route'?'Route by place':'Important places'}</h2>${countries.length>1?compactCountryCards(countries):''}${kind==='route'&&ordered.length?`<h3 id="segments">Route sequence</h3><ol class="reading-segments">${ordered.map(s=>`<li>${segmentCard(s)}</li>`).join('')}</ol>`:''}<p><a href="${esc(mapHref)}" data-link>${esc(mapLabel)} →</a>${points.length?` · ${points.length} mapped stops`:''}</p>${rendered||'<p>No place-specific guide prose is attached yet.</p>'}</section>`;
};
function readingFAQMatch(question,records){
  const q=String(question.question||''),key=norm(q);
  const explicit=records.find(r=>question.linked_product_unit_id&&r.value.product_unit_id===question.linked_product_unit_id);
  if(explicit)return explicit;
  const exact=records.find(r=>[r.value.title,r.value.data_field,r.value.idea_name].some(t=>t&&norm(t)===key));
  if(exact&&!readingTechnical(exact))return exact;
  // Ambiguous referents need Ask rather than guessing which crossing/place is meant.
  if(/\bthis (?:border|crossing|place|route)\b/i.test(q))return null;
  const intents={find_food_resupply:/\b(food|grocer\w*|resupply|restaurant\w*)\b/i,find_bike_repair:/\b(repair\w*|mechanic\w*|workshop\w*|spares|parts|bike shop)\b/i,find_camping:/\b(camp\w*|tent\w*)\b/i,transport_bicycle:/\b(bus|buses|taxi|pickup|shuttle|ferry|ferries|boat)\b|transport.*bic|bic.*transport/i,ferry_logistics:/\b(ferry|ferries|boat\w*|sailing)\b/i,border_status:/\b(border|customs|crossing)\b/i,border_crossing:/\b(border|customs|crossing)\b/i,season_weather:/\b(weather|season\w*|wind\w*|rain\w*|snow\w*)\b/i,connectivity:/\b(signal|connectivity|internet|wifi|sim|entel)\b/i,money_payments:/\b(cash|atms?|cards?|money)\b/i};
  const test=intents[question.intent];
  const buckets={find_food_resupply:'food-water',find_bike_repair:'repair-gear',find_camping:'sleep',transport_bicycle:'transport-borders',ferry_logistics:'transport-borders',border_status:'transport-borders',border_crossing:'transport-borders',season_weather:'overview',connectivity:'money-connectivity',money_payments:'money-connectivity'};
  const location=q.match(/(?:near |about |like near )([^?]+)\??$/i)?.[1]||'';
  const place=location.replace(/\s+work with bicycles$/i,'').trim();
  if(!test&&!place)return null;
  const candidates=records.filter(r=>{
    const shown=r.title+' '+readingExcerpt(readingText(r.lead||r.text,r.title));
    return !readingTechnical(r)&&(!buckets[question.intent]||r.chapter===buckets[question.intent])&&(!test||test.test(shown))&&(!place||norm(shown).includes(norm(place)));
  });
  // Prefer an existing short answer and named service over a long generic note.
  return candidates.sort((a,b)=>Number(!!b.lead)-Number(!!a.lead)||readingRank(b)-readingRank(a)||Number(!!b.value.poi_or_service_name)-Number(!!a.value.poi_or_service_name))[0]||null;
}
handbookQuestions=function(questions=[],payload={units:[],facts:[],points:[]}){
  const chapters=handbookActiveChapters(payload),records=readingAllRecords(payload);
  const faq=uniqueGuideItems(questions,q=>q.question);
  return `${faq.length?`<section class="guide-section handbook-questions" id="questions"><h2>FAQ</h2>${faq.map(q=>{const r=readingFAQMatch(q,records);return `<details class="reading-faq"><summary>${esc(q.question)}</summary>${r?`<div class="reading-passage">${readingNarrative([r])}</div>`:'<p>No directly matched answer was found in the loaded guide notes. Use Ask to narrow the question.</p>'}<p>${askLink(q.question,'Ask a more specific question →')}</p></details>`}).join('')}</section>`:''}<section id="guide-sources" class="guide-section reading-source-index"><h2>Sources & dates</h2><p>Full dated observations, evidence IDs and verification metadata supporting the article above.</p><ol class="reading-source-list">${records.map(readingSource).join('')}</ol></section>`;
};
function readingOpenTarget(){
  let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}
  const target=document.getElementById(id);if(!target)return;
  for(let el=target;el;el=el.parentElement)if(el.tagName==='DETAILS')el.open=true;
}
document.addEventListener('click',event=>{
  const link=event.target.closest('a[data-reading-source]');if(!link)return;
  const details=document.getElementById(link.dataset.readingSource);if(details)details.open=true;
});
window.addEventListener('hashchange',readingOpenTarget);
// SPA guide content arrives asynchronously; preserve incoming evidence anchors.
new MutationObserver(readingOpenTarget).observe(document.getElementById('app'),{childList:true,subtree:true});
window.addEventListener('beforeprint',()=>document.querySelectorAll('.handbook-layout details:not([open])').forEach(d=>{d.dataset.readingPrint='true';d.open=true}));
window.addEventListener('afterprint',()=>document.querySelectorAll('[data-reading-print]').forEach(d=>{d.open=false;delete d.dataset.readingPrint}));
render();
