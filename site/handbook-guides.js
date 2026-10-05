/*
 * Detailed field-handbook layer for country and route guides.
 *
 * It deliberately renders the complete publication-safe field record rather
 * than reducing a rich route to a handful of generic cards.  The layer is a
 * presentation change only: all claims continue to come from the scoped
 * cycling_web.sqlite endpoint already used by each page.
 */
const HANDBOOK_CHAPTERS=[
  {id:'overview',title:'Route & Conditions',intro:'Route character, surface, weather and timing details that materially change the plan.'},
  {id:'repair-gear',title:'Bike & Spares',intro:'Bike setup, repair capacity and the parts worth settling before remote sections.'},
  {id:'food-water',title:'Food & Water',intro:'Resupply, water treatment and the gaps that shape a riding day.'},
  {id:'sleep',title:'Sleep & Camping',intro:'Overnight options, weather shelter and practical pacing notes.'},
  {id:'money-connectivity',title:'Money & Signal',intro:'Cash access, cards, connection and navigation realities.'},
  {id:'transport-borders',title:'Ferries & Borders',intro:'Ferries, transfers, crossings and useful bailout options.'}
];

function handbookCountLabel(count,singular,plural=singular+'s'){
  return `${count} ${count===1?singular:plural}`;
}
function handbookContextLabel(item){
  const value=String(item?.planning_vs_on_route||'').trim().toLowerCase();
  if(value==='planning')return 'Before You Ride';
  if(value==='on_route')return 'On the Road';
  return 'Route Reference';
}
function handbookParagraphs(value){
  const paragraphs=String(value||'').trim().split(/\n\s*\n/).map(text=>text.trim()).filter(Boolean);
  return paragraphs.map(text=>`<p>${esc(text).replace(/\n/g,'<br>')}</p>`).join('');
}
function handbookUnitsFor(units,chapterId){
  return uniqueGuideItems((units||[]).filter(unit=>guideBucketForUnit(unit)===chapterId),unit=>[
    // Source imports can create two product-unit IDs for the exact same
    // reader-facing note.  Treat that as one note in the guide; the full
    // public source detail still remains available in the supporting layer.
    unit.title,unit.detailed_answer||unit.concise_answer
  ].join(' '));
}
function handbookFactsFor(facts,chapterId){
  return uniqueGuideItems((facts||[]).filter(fact=>guideBucketForFact(fact)===chapterId),fact=>[
    fact.external_fact_id,fact.value_text
  ].join(' '));
}
function handbookFactsDistinctFromUnits(facts,units){
  const unitText=(units||[]).map(unit=>norm(unit.detailed_answer||unit.concise_answer||'')).filter(Boolean);
  return (facts||[]).filter(fact=>{
    const text=norm(fact.value_text||'');
    return !text||!unitText.some(unit=>unit.includes(text)||text.includes(unit));
  });
}
function handbookChapterContent(chapter,{units,facts,points}){
  const chapterUnits=handbookUnitsFor(units,chapter.id);
  const chapterFacts=handbookFactsDistinctFromUnits(handbookFactsFor(facts,chapter.id),chapterUnits);
  const chapterPoints=guidePointsFor(points,chapter.id);
  return {units:chapterUnits,facts:chapterFacts,points:chapterPoints,total:chapterUnits.length+chapterFacts.length};
}
function handbookActiveChapters(payload){
  return HANDBOOK_CHAPTERS.filter(chapter=>{
    const content=handbookChapterContent(chapter,payload);
    return content.total||content.points.length;
  });
}
function handbookEntry(unit){
  const rawTitle=guideDisplayLabel(unit.title)||'Field note';
  const title=/^(?:start here|overview|route context) field note \d+$/i.test(rawTitle)
    ?'Route planning note':rawTitle;
  const detail=unit.detailed_answer||unit.concise_answer||'';
  const summary=detail;
  const meta=[
    unit.evidence_strength&&`Evidence: ${unit.evidence_strength}`
  ].filter(Boolean).join(' · ');
  return `<article class="handbook-note"><div class="handbook-note-title">${esc(title)}</div><div class="handbook-note-copy">${handbookParagraphs(summary)}</div>${meta?`<p class="handbook-note-meta">${esc(meta)}</p>`:''}</article>`;
}
function handbookFactTitle(fact){
  const values=[fact.poi_or_service_name,fact.place_or_segment,fact.subcategory,fact.data_field]
    .filter(Boolean).map(value=>guideDisplayLabel(value));
  return uniqueGuideItems(values,value=>value).slice(0,2).join(' · ')||'Published Field Detail';
}
function handbookFactEntry(fact){
  const source=isSafePublicUrl(fact.source_url);
  const meta=[
    fact.evidence_strength&&`Evidence: ${fact.evidence_strength}`
  ].filter(Boolean).join(' · ');
  return `<article class="handbook-note handbook-fact-note"><div class="handbook-note-title">${esc(handbookFactTitle(fact))}</div><div class="handbook-note-copy">${handbookParagraphs(fact.value_text)}</div>${meta||source?`<p class="handbook-note-meta">${esc(meta)}${meta&&source?' · ':''}${source?`<a class="under" href="${esc(source)}" target="_blank" rel="noreferrer">Source ↗</a>`:''}</p>`:''}</article>`;
}
function handbookTopic(chapter,{units,facts,points,scopeLabel}){
  const {units:topicUnits,facts:topicFacts,points:topicPoints,total}=handbookChapterContent(chapter,{units,facts,points});
  const hasContent=total||topicPoints.length;
  if(!hasContent)return '';
  const entries=[...topicUnits.map(unit=>({kind:'unit',value:unit})),...topicFacts.map(fact=>({kind:'fact',value:fact}))];
  const lead=entries.slice(0,2),remaining=entries.slice(2);
  const renderEntry=entry=>entry.kind==='unit'?handbookEntry(entry.value):handbookFactEntry(entry.value);
  const recordLabel=[
    topicUnits.length&&handbookCountLabel(topicUnits.length,'field note'),
    topicFacts.length&&handbookCountLabel(topicFacts.length,'source detail'),
    topicPoints.length&&handbookCountLabel(topicPoints.length,'mapped stop')
  ].filter(Boolean).join(' · ');
  const mapCue=topicPoints.length?`<p class="handbook-map-cue">${topicPoints.length} mapped stop${topicPoints.length===1?'':'s'} related to this topic are listed in <a class="under" href="#by-place" data-guide-jump onclick="jumpToGuideSection('by-place');return false">Route by place</a>.</p>`:'';
  return `<section class="handbook-topic guide-section" id="${chapter.id}"><div class="handbook-topic-head"><div><h2>${esc(chapter.title)}</h2><p class="handbook-topic-intro">${esc(chapter.intro||'Read the practical notes first, then open the full dated record when planning a specific decision.')}</p></div><span class="meta">${esc(recordLabel||'No field notes yet')}</span></div><div class="handbook-reading">${lead.map(renderEntry).join('')}</div>${remaining.length?`<details class="handbook-records"><summary>All field notes & dated evidence (${remaining.length})</summary><div class="handbook-record-list">${remaining.map(renderEntry).join('')}</div></details>`:''}${mapCue}</section>`;
}
function handbookParts(payload){
  return HANDBOOK_CHAPTERS.map(chapter=>handbookTopic(chapter,payload)).filter(Boolean).join('');
}
function handbookQuickReference({kind,units,facts,points,routes,questions,distance,typicalTime}){
  const records=HANDBOOK_CHAPTERS.map(chapter=>{
    const content=handbookChapterContent(chapter,{units,facts,points});
    return {chapter,notes:content.units.length,sources:content.facts.length,points:content.points.length};
  });
  const directNoteCount=uniqueGuideItems(units||[],unit=>[unit.title,unit.detailed_answer||unit.concise_answer].join(' ')).length;
  const cards=kind==='route'
    ?[['Distance',distance],['Typical time',typicalTime],['Exact stops',points.length?String(points.length):null],['Field notes',directNoteCount?String(directNoteCount):null]]
    :[['Country notes',directNoteCount?String(directNoteCount):null],['Named rides',(routes||[]).length||null],['Exact stops',points.length||null],['Rider questions',(questions||[]).length||null]];
  return `<section class="handbook-quick" id="quick-reference"><div class="handbook-quick-head"><div><div class="eyebrow">Field Guide</div><h2>At a Glance</h2><p>${kind==='route'?'Start with route scale, then use the topic bar for the planning detail that matters to your trip.':'Use the topic bar to move from overall planning to daily riding and logistics.'}</p></div></div><div class="handbook-quick-grid">${cards.filter(([,value])=>value).map(([label,value])=>`<div class="handbook-quick-card"><span>${esc(label)}</span><b>${esc(value)}</b></div>`).join('')}</div></section>`;
}
function handbookNav(extra=[],chapters=HANDBOOK_CHAPTERS){
  const links=[['quick-reference','At a Glance'],...chapters.map(chapter=>[chapter.id,chapter.title]),...extra];
  return `<section class="guide-nav handbook-nav"><div class="wrap">${links.map(([id,label])=>`<a href="#${id}" data-guide-jump onclick="jumpToGuideSection('${esc(id)}');return false">${esc(label)}</a>`).join('')}</div></section>`;
}
function handbookByPlace({kind,points,segments,mapHref,mapLabel,countries}){
  const segmentSection=segments?.length?`<details class="handbook-records handbook-segments"><summary>${kind==='route'?'Route segments':'Related segments'} (${segments.length})</summary><div class="segments">${segments.map(segmentCard).join('')}</div></details>`:'';
  const countrySection=countries?.length>1?`<div class="handbook-country-links"><span>Countries on this ride</span>${compactCountryCards(countries)}</div>`:'';
  const visiblePoints=(points||[]).slice(0,12),remainingPoints=Math.max(0,(points||[]).length-visiblePoints.length);
  return `<section class="handbook-place guide-section" id="by-place"><div class="handbook-topic-head"><div><h2>${kind==='route'?'Route by Place':'Places & Stops'}</h2><p class="handbook-topic-intro">${kind==='route'?'Use named places, segments and the scoped map to connect general planning notes to an actual day.':'Named rides and exact public stops give country-wide planning notes a practical local starting point.'}</p></div></div>${countrySection}${segmentSection}<div class="handbook-stops-head"><span>${points.length?`${points.length} exact public stop${points.length===1?'':'s'}`:'No exact public stop yet'}</span><a class="under" href="${mapHref}" data-link>${esc(mapLabel)}</a></div>${visiblePoints.length?`<div class="grid two handbook-stops-grid">${visiblePoints.map(mapCard).join('')}</div>`:'<p class="guide-empty">No exact public map stop is attached to this guide yet.</p>'}${remainingPoints?`<p class="handbook-map-cue">${remainingPoints} more mapped stop${remainingPoints===1?'':'s'} are available on the <a class="under" href="${mapHref}" data-link>scoped map</a>.</p>`:''}</section>`;
}
function handbookQuestions(questions){
  return questions?.length?`<section class="guide-section handbook-questions" id="questions"><div class="eyebrow">Related FAQ</div><h2>Questions for This Guide</h2><div class="question-chips">${questions.map(question=>askLink(question.question,question.question)).join('')}</div></section>`:'';
}

countryPage=async id=>{
  const country=await api('/api/countries/'+encodeURIComponent(id));
  const payload={units:country.product_units||[],facts:country.external_facts||[],points:country.map_points||[],scopeLabel:'country-wide'};
  const activeChapters=handbookActiveChapters(payload);
  const quick=handbookQuickReference({kind:'country',...payload,routes:country.routes||[],questions:country.questions||[]});
  const fieldGuide=handbookParts(payload);
  const byPlace=handbookByPlace({kind:'country',points:payload.points,mapHref:`/map?country=${encodeURIComponent(country.iso2)}`,mapLabel:'Open country map'});
  const rides=guideRidesSection(country.routes||[]);
  const questions=handbookQuestions(country.questions||[],payload);
  return `${pageHero('Country Field Guide',`Cycling in ${country.canonical_name}`,`Country-wide planning, named rides and exact public stops for ${country.canonical_name}.`)}${handbookNav([['by-place','Places & Stops'],['rides','Rides'],...(country.questions?.length?[['questions','FAQ']]:[])],activeChapters)}<section class="section"><div class="wrap guide-layout handbook-layout"><main>${quick}${fieldGuide}${byPlace}${rides}${questions}</main>${sharedEvidenceAside({name:country.canonical_name,sources:country.sources||[],safety:country.safety,askQuestion:`What should cyclists know about ${country.canonical_name}?`})}</div></section>`;
};
routeGuidePage=async id=>{
  const route=await api('/api/routes/'+encodeURIComponent(id));
  const payload={units:route.product_units||[],facts:route.external_facts||[],points:route.map_points||[],scopeLabel:'route-specific'};
  const activeChapters=handbookActiveChapters(payload);
  const stats=[['Distance',route.distance_text],['Typical time',route.typical_days_text],['Difficulty',route.difficulty_text],['Exact stops',route.map_points.length?String(route.map_points.length):null]].filter(([,value])=>value);
  const quick=handbookQuickReference({kind:'route',...payload,questions:route.questions||[],distance:route.distance_text,typicalTime:route.typical_days_text});
  const fieldGuide=handbookParts(payload);
  const byPlace=handbookByPlace({kind:'route',points:payload.points,segments:route.segments||[],countries:route.countries||[],mapHref:`/map?route=${encodeURIComponent(route.route_id)}`,mapLabel:'Open route map'});
  const questions=handbookQuestions(route.questions||[],payload);
  return `${pageHero('Route Field Guide',route.canonical_name,route.overview_text||route.endpoints_or_scope_hint||'Route planning information.',`<div class="tagrow">${route.countries.map(country=>`<span class="tag">${esc(country.canonical_name)}</span>`).join('')}</div>${stats.length?`<div class="stats">${stats.map(([label,value])=>`<div class="stat"><span>${esc(label)}</span><b>${esc(value)}</b></div>`).join('')}</div>`:''}<div class="guide-actions"><a class="btn" href="/map?route=${encodeURIComponent(route.route_id)}" data-link>Map this ride</a><button class="btn ghost" onclick="window.print()">Print / save PDF</button></div>`)}${handbookNav([['by-place','Route by Place'],...(route.questions?.length?[['questions','FAQ']]:[])],activeChapters)}<section class="section"><div class="wrap guide-layout handbook-layout"><main>${quick}${fieldGuide}${byPlace}${questions}</main>${sharedEvidenceAside({name:route.canonical_name,sources:route.sources||[],askQuestion:`What should cyclists know about ${route.canonical_name}?`})}</div></section>`;
};

// This file is intentionally loaded after the established final layer.
// Re-render once so direct route/country loads use the detailed handbook view.
render();
