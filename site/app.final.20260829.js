const renderBase=render;
// Homepage feature photography is route-specific and credited on every card.
// Wikimedia Commons file pages are retained in the photo objects so that the
// visible credit remains useful, not just decorative.
Object.assign(ROUTE_PHOTOS,{
  'patagonia-beer-trail':{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bariloche_-_Argentina.jpg?width=1400',alt:'Patagonian lake and mountains near Bariloche, Argentina',title:'Bariloche, Argentine Patagonia',author:'Carlos Hames',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',source:'https://commons.wikimedia.org/wiki/File:Bariloche_-_Argentina.jpg'},
  'tierra-del-fuego':{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Tierra_del_Fuego_National_Park_(8089461351).jpg?width=1400',alt:'Coast and forest in Tierra del Fuego National Park, Argentina',title:'Tierra del Fuego National Park',author:'Jorge Lascar',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',source:'https://commons.wikimedia.org/wiki/File:Tierra_del_Fuego_National_Park_(8089461351).jpg'},
  'huascaran-circuit':{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Peruvian_National_Park_Huascaran.jpg?width=1400',alt:'Andean landscape in Huascarán National Park, Peru',title:'Huascarán National Park, Peru',author:'VanniaAliaga',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',source:'https://commons.wikimedia.org/wiki/File:Peruvian_National_Park_Huascaran.jpg'},
  'cordillera-blanca-bikepacking-route':{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Cordillera_Blanca%2C_Per%C3%BA.jpg?width=1400',alt:'Cordillera Blanca mountains in Peru',title:'Cordillera Blanca, Peru',author:'Coordenação-Geral de Observação da Terra/INPE',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',source:'https://commons.wikimedia.org/wiki/File:Cordillera_Blanca,_Per%C3%BA.jpg'},
  'salkantay-trail':{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Peru_-_Salkantay_Trek_091_-_Salkantay_(7339855088).jpg?width=1400',alt:'Salkantay mountain on the Salkantay Trek in Peru',title:'Salkantay Trek, Peru',author:'McKay Savage',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',source:'https://commons.wikimedia.org/wiki/File:Peru_-_Salkantay_Trek_091_-_Salkantay_(7339855088).jpg'},
  'ausangate-loop':{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ausangate_Mountain_Peru_01.jpg?width=1400',alt:'Ausangate Mountain in Peru',title:'Ausangate Mountain, Peru',author:'Stefanos Nikologianis',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',source:'https://commons.wikimedia.org/wiki/File:Ausangate_Mountain_Peru_01.jpg'}
});
const HOME_FEATURED_RIDES=['Carretera Austral','Peru Great Divide','Trans Ecuador Mountain Bike Route (TEMBR)','Ruta 40','Lagunas / Lípez Route','Patagonia Beer Trail','Tierra del Fuego','Huascarán Circuit','Cordillera Blanca Bikepacking Route','Salkantay Trail','Ausangate Loop'];
function homepageFeaturedRoutes(routes){const byName=new Map((routes||[]).map(r=>[r.canonical_name,r]));return HOME_FEATURED_RIDES.map(name=>byName.get(name)).filter(Boolean).sort((a,b)=>{const interestA=HOME_FEATURED_RIDES.indexOf(a.canonical_name),interestB=HOME_FEATURED_RIDES.indexOf(b.canonical_name);const scoreA=((HOME_FEATURED_RIDES.length-interestA)*100)+(Number(a.information_depth)||0);const scoreB=((HOME_FEATURED_RIDES.length-interestB)*100)+(Number(b.information_depth)||0);return scoreB-scoreA})}
// The landing page has three immediate jobs: show the route network, surface
// the key rides and get a rider into search or Ask.  The deeper country and
// topic browser intentionally follows instead of competing with them.
home=async()=>{const b=APP.bootstrap||await api('/api/bootstrap');APP.bootstrap=b;const featured=homepageFeaturedRoutes(b.routes);return `<section class="landing-hero"><div class="wrap landing-hero-grid"><div class="landing-copy"><div class="eyebrow">Free cycling field guide</div><h1>Find the ride. Then find what you need.</h1><p class="landing-lede">Practical route knowledge for bikepacking and touring across South and Central America—rides, places, ferries, food, water, repair and public map points.</p>${searchBox('Search Puerto Montt, Huaraz, a ride, a town or a service…')}<div class="landing-actions"><a class="btn landing-ask" href="/ask" data-link>Ask a planning question</a><a class="landing-map-link" href="/map" data-link>Open the full map <span aria-hidden="true">→</span></a></div><p class="landing-note">Free, non-commercial and built for riders planning a real trip.</p></div><section class="landing-map-panel" aria-labelledby="home-map-title"><div class="landing-map-head"><div><div class="eyebrow">Live public map</div><h2 id="home-map-title">Useful stops, at a glance</h2></div><span class="map-count">${b.map_point_count} pins</span></div><p id="home-map-status" class="landing-map-status">Loading publication-safe exact locations…</p><div id="home-map" class="map home-map" aria-label="Interactive map of publication-safe Cycling Americas locations"></div><div id="home-map-fallback" class="mapfallback">Use the full map to browse publication-safe exact locations.</div></section></div></section><section class="section featured-rides" aria-labelledby="featured-rides-title"><div class="wrap"><div class="head featured-head"><div><div class="eyebrow">Start here</div><h2 id="featured-rides-title">Flagship rides</h2><p class="muted">Ordered by rider interest and the depth of route-specific planning material currently available.</p></div><a class="under" href="/routes" data-link>All ${b.routes.length} rides →</a></div><div class="feature-routes-grid" id="home-routes">${featured.map(routeCard).join('')}</div></div></section><section class="section alt home-discovery"><div class="wrap"><div class="head"><div><div class="eyebrow">Browse by place</div><h2>Choose a country or a ride</h2></div></div><div class="planner"><div class="field"><label for="home-country">Country</label><select id="home-country"><option value="">All countries</option>${b.countries.map(c=>`<option value="${esc(c.iso2)}">${esc(c.canonical_name)}</option>`).join('')}</select></div><div class="field"><label for="home-route">Ride</label><select id="home-route"></select></div><button class="btn" id="home-open">Open guide</button></div><p class="meta" id="home-filter-note">Choose a country to show only its named rides.</p>${homeTopics()}</div></section>`};
initHome=()=>{const b=APP.bootstrap,c=$('#home-country'),r=$('#home-route'),grid=$('#home-routes'),note=$('#home-filter-note');if(!b||!c||!r||!grid)return;const featured=homepageFeaturedRoutes(b.routes);const update=()=>{const list=b.routes.filter(x=>!c.value||x.country_codes.includes(c.value)),old=r.value;r.innerHTML='<option value="">Choose a ride</option>'+list.map(x=>`<option value="${esc(x.route_id)}">${esc(x.canonical_name)}</option>`).join('');if(list.some(x=>x.route_id===old))r.value=old;grid.innerHTML=(c.value?list:featured).map(routeCard).join('')||'<div class="empty">No named ride is currently assigned to this country.</div>';note.textContent=c.value?`${list.length} named ride${list.length===1?'':'s'} in ${c.options[c.selectedIndex].text}. The cards above are now scoped to that country.`:'Choose a country to show only its named rides.'};c.onchange=update;$('#home-open').onclick=()=>{const ride=b.routes.find(x=>x.route_id===r.value);if(ride)navigate('/routes/'+ride.slug);else if(c.value){const country=b.countries.find(x=>x.iso2===c.value);navigate('/countries/'+country.slug)}else navigate('/routes')};update();initHomeMap()};
// ASK is the primary planning action, so it belongs in the landing experience
// rather than reading as a secondary utility below the fold.
render=async()=>{await renderBase();initQaPolished(document);initFaqGuide(document);initDataDownloads(document);if(sitePath()==='/countries'||sitePath()==='/countries/')initCountries()};
function landingAskPanel(){return `<section class="landing-ask-panel" aria-labelledby="landing-ask-title"><div class="landing-ask-head"><div><div class="eyebrow">Ask</div><h2 id="landing-ask-title">Ask the field guide</h2></div><a class="landing-ask-more" href="/ask" data-link>Open Ask <span aria-hidden="true">→</span></a></div>${qaBox()}<p class="landing-ask-hint">Try a route, place, ferry, repair, food, water or border question.</p></section>`}

// The landing page is a starting point, not a second country directory.  Put
// the three useful actions—search, Ask and the live map—above the route cards.
home=async()=>{const b=APP.bootstrap||await api('/api/bootstrap');APP.bootstrap=b;const featured=homepageFeaturedRoutes(b.routes);return `<section class="landing-hero"><div class="wrap landing-hero-grid"><div class="landing-copy"><p class="landing-lede">Practical route knowledge for bikepacking and touring across South and Central America—places, ferries, water, repair, resupply and the rides that connect them.</p><div class="landing-tools"><div><div class="landing-tool-label">Search the field guide</div>${searchBox('Search Puerto Montt, Huaraz, a ride, a town or a service…')}</div>${landingAskPanel()}</div><p class="landing-note">Free, non-commercial and built for riders planning a real trip.</p></div><section class="landing-map-panel" aria-labelledby="home-map-title"><div class="landing-map-head"><div><div class="eyebrow">Live public map</div><h2 id="home-map-title">Useful stops, at a glance</h2></div><span class="map-count">${b.map_point_count} pins</span></div><p id="home-map-status" class="landing-map-status">Loading exact public locations…</p><div id="home-map" class="map home-map" aria-label="Interactive map of Cycling Americas locations"></div><div id="home-map-fallback" class="mapfallback">Use the full map to browse exact public locations.</div><a class="landing-map-footer" href="/map" data-link>Explore the full map <span aria-hidden="true">→</span></a></section></div></section><section class="section featured-rides" aria-labelledby="featured-rides-title"><div class="wrap"><div class="head featured-head"><div><div class="eyebrow">Start here</div><h2 id="featured-rides-title">Flagship rides</h2><p class="muted">The routes riders return to most, ordered by interest and available planning depth.</p></div><a class="under" href="/routes" data-link>All ${b.routes.length} rides →</a></div><div class="feature-routes-grid" id="home-routes">${featured.map(routeCard).join('')}</div></div></section><section class="section alt home-next-step"><div class="wrap home-next-step-inner"><div><div class="eyebrow">Keep exploring</div><h2>Routes, countries and detailed field notes</h2><p class="muted">Browse the full ride collection or open a country guide when you are ready to narrow the trip.</p></div><div class="home-next-links"><a class="btn" href="/routes" data-link>Explore all rides</a><a class="home-next-country" href="/countries" data-link>Browse countries →</a></div></div></section>`};
initHome=()=>{initHomeMap()};
// Generated guide records have an explicit recommended section.  Honour that
// first, then keep the earlier title-based matching as a compatibility path
// for the original country packs.
const GUIDE_SECTION_BY_BUCKET={
  overview:['Start Here','How cycling works here','Overview'],
  'food-water':['Food & Water'],sleep:['Sleep'],
  'repair-gear':['Repair & Gear'],'money-connectivity':['Money & Connectivity'],
  'transport-borders':['Transport & Borders']
};
function scopedTopicUnits(units,bucket,scope){const terms=UNIT_TERMS[bucket]||[],sections=GUIDE_SECTION_BY_BUCKET[bucket]||[];return (units||[]).filter(u=>{if(scope&&u.primary_scope_type&&u.primary_scope_type!==scope)return false;const section=String(u.recommended_section||'').trim();if(sections.includes(section))return true;const primary=norm([u.title,section].join(' ')),isGeneral=/planning snapshot|country planning|country guide/.test(primary),hay=isGeneral?norm([u.concise_answer,u.detailed_answer].join(' ')):primary,matches=terms.some(t=>hay.includes(norm(t)));return bucket==='overview'?isGeneral||matches:!isGeneral&&matches})}
function topicUnits(units,bucket){return scopedTopicUnits(units,bucket,'country')}
function routeTopicUnits(units,bucket){return scopedTopicUnits(units,bucket,'route')}
// Keep every supported field note available, but let the first useful notes
// read as a guide rather than turning a country or route chapter into a wall.
function countryTopicCopy(units){const seen=new Set(),unique=(units||[]).filter(u=>{const key=norm([u.title,u.detailed_answer||u.concise_answer].join(' '));if(seen.has(key))return false;seen.add(key);return true}),shown=unique.slice(0,6),more=unique.slice(6);return `<div class="country-topic-copy">${shown.map(countryUnitParagraph).join('')}${more.length?`<details class="more-field-notes"><summary>More field notes (${more.length})</summary><div class="country-topic-copy-more">${more.map(countryUnitParagraph).join('')}</div></details>`:''}</div>`}
function routeSection(id,title,units,facts){return countryTopicSection({id,title,units,facts})}
routeGuidePage=async id=>{const r=await api('/api/routes/'+encodeURIComponent(id)),facts=r.external_facts||[],units=r.product_units||[],overviewUnits=routeTopicUnits(units,'overview'),foodUnits=routeTopicUnits(units,'food-water'),sleepUnits=routeTopicUnits(units,'sleep'),repairUnits=routeTopicUnits(units,'repair-gear'),moneyUnits=routeTopicUnits(units,'money-connectivity'),transportUnits=routeTopicUnits(units,'transport-borders'),overviewFacts=topicFacts(facts,COUNTRY_BUCKETS.overview),foodFacts=topicFacts(facts,COUNTRY_BUCKETS['food-water']),sleepFacts=topicFacts(facts,COUNTRY_BUCKETS.sleep),repairFacts=topicFacts(facts,COUNTRY_BUCKETS['repair-gear']),moneyFacts=topicFacts(facts,['money','connectivity']),transportFacts=topicFacts(facts,COUNTRY_BUCKETS['transport-borders']),critical=facts.filter(f=>f.requires_current_verification&&['ferry','border','recent','safety','season'].includes(f.category)).sort((a,b)=>(a.category==='recent'?0:1)-(b.category==='recent'?0:1))[0],stats=[['Distance',r.distance_text],['Typical time',r.typical_days_text],['Difficulty',r.difficulty_text],['Exact stops',r.map_points.length?String(r.map_points.length):null]].filter(([,v])=>v),present={segments:r.segments.length,food:foodFacts.length||foodUnits.length,sleep:sleepFacts.length||sleepUnits.length,repair:repairFacts.length||repairUnits.length,money:moneyFacts.length||moneyUnits.length,transport:transportFacts.length||transportUnits.length,stops:r.map_points.length};return `${pageHero('Ride guide',r.canonical_name,r.overview_text||r.endpoints_or_scope_hint||'Route planning information.',`<div class="tagrow">${r.countries.map(c=>`<span class="tag">${esc(c.canonical_name)}</span>`).join('')}</div>${stats.length?`<div class="stats">${stats.map(([k,v])=>`<div class="stat"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div>`:''}<div class="guide-actions"><a class="btn" href="/map?route=${encodeURIComponent(r.route_id)}" data-link>Map this ride</a><button class="btn ghost" onclick="window.print()">Print / save PDF</button></div>`)}${routeNav(r,present)}${critical?`<section class="section notice-section"><div class="wrap"><div class="warning"><b>Recheck before travel.</b> ${esc(critical.value_text)} ${critical.last_checked_date?`(checked ${esc(critical.last_checked_date)})`:''}</div></div></section>`:''}<section class="section"><div class="wrap guide-layout"><main>${routeSection('overview','Start Here',overviewUnits,overviewFacts)||`<section class="guide-section" id="overview"><div class="head"><h2>Start Here</h2></div><p>${esc(r.overview_text||'This route currently has a limited public planning profile.')}</p></section>`}${r.countries.length>1?`<section class="guide-section" id="countries"><div class="head"><h2>Countries on this ride</h2></div>${compactCountryCards(r.countries)}</section>`:''}${r.segments.length?`<section class="guide-section" id="segments"><div class="head"><div><div class="eyebrow">Itinerary</div><h2>${r.segments.length} ordered planning segments</h2></div><span class="meta">Distances appear only where published geometry supports them.</span></div><div class="segments">${r.segments.map(segmentCard).join('')}</div></section>`:''}${routeSection('water-food','Food & Water',foodUnits,foodFacts)}${routeSection('sleep','Sleep',sleepUnits,sleepFacts)}${routeSection('repair-supplies','Repair & Gear',repairUnits,repairFacts)}${routeSection('money-connectivity','Money & Connectivity',moneyUnits,moneyFacts)}${routeSection('transport-borders','Transport & Borders',transportUnits,transportFacts)}${r.map_points.length?`<section class="guide-section" id="stops"><div class="head"><div><div class="eyebrow">Map & Stops</div><h2>Exact public stops</h2></div><a class="under" href="/map?route=${encodeURIComponent(r.route_id)}" data-link>Open scoped map →</a></div><div class="grid two">${r.map_points.map(mapCard).join('')}</div></section>`:''}${r.questions.length?`<section class="guide-section"><div class="head"><h2>Questions riders ask</h2></div><div class="question-chips">${r.questions.slice(0,6).map(q=>askLink(q.question,q.question)).join('')}</div></section>`:''}</main><aside class="guide-aside"><div class="card"><h3>Evidence & updates</h3><p class="meta">Guide notes are organized from route-scoped public records and de-identified rider knowledge.</p>${r.sources?.length?`<details><summary>${r.sources.length} public sources</summary><div class="list">${r.sources.slice(0,20).map(s=>`<a class="source" href="${esc(s.url)}" target="_blank" rel="noreferrer">${esc(s.name)} ↗</a>`).join('')}</div></details>`:''}<p style="margin-top:16px">${askLink(`What should cyclists know about ${r.canonical_name}?`,'Ask about this ride →')}</p></div></aside></div></section>`};
function routeNav(r,present){const country=r.countries||[],countryLink=country.length===1?`<a href="/countries/${esc(slug(country[0].canonical_name))}" data-link>Country</a>`:country.length>1?'<a href="#countries">Countries</a>':'';return `<section class="guide-nav"><div class="wrap"><a href="#overview">Start Here</a>${countryLink}${present.segments?'<a href="#segments">Segments</a>':''}${present.food?'<a href="#water-food">Food & Water</a>':''}${present.sleep?'<a href="#sleep">Sleep</a>':''}${present.repair?'<a href="#repair-supplies">Repair & Gear</a>':''}${present.money?'<a href="#money-connectivity">Money & Connectivity</a>':''}${present.transport?'<a href="#transport-borders">Transport & Borders</a>':''}${present.stops?'<a href="#stops">Map & Stops</a>':''}</div></section>`}
function homepageAllRoutes(routes){const featured=homepageFeaturedRoutes(routes),featuredIds=new Set(featured.map(r=>r.route_id)),remaining=(routes||[]).filter(r=>!featuredIds.has(r.route_id)).sort((a,b)=>(Number(b.information_depth)||0)-(Number(a.information_depth)||0)||a.canonical_name.localeCompare(b.canonical_name));return [...featured,...remaining]}
// The home page now carries the whole ride collection at its main point of
// entry.  The highest-interest, deepest guides remain first without hiding
// the smaller named routes behind a second page.
home=async()=>{const b=APP.bootstrap||await api('/api/bootstrap');APP.bootstrap=b;const rides=homepageAllRoutes(b.routes);return `<section class="landing-hero"><div class="wrap landing-hero-grid"><div class="landing-copy"><p class="landing-lede">Practical route knowledge for bikepacking and touring across South and Central America—places, ferries, water, repair, resupply and the rides that connect them.</p><div class="landing-tools"><div><div class="landing-tool-label">Search the field guide</div>${searchBox('Search Puerto Montt, Huaraz, a ride, a town or a service…')}</div>${landingAskPanel()}</div><p class="landing-note">Free, non-commercial and built for riders planning a real trip.</p></div><section class="landing-map-panel" aria-labelledby="home-map-title"><div class="landing-map-head"><div><div class="eyebrow">Live public map</div><h2 id="home-map-title">Useful stops, at a glance</h2></div><span class="map-count">${b.map_point_count} pins</span></div><p id="home-map-status" class="landing-map-status">Loading exact public locations…</p><div id="home-map" class="map home-map" aria-label="Interactive map of Cycling Americas locations"></div><div id="home-map-fallback" class="mapfallback">Use the full map to browse exact public locations.</div><a class="landing-map-footer" href="/map" data-link>Explore the full map <span aria-hidden="true">→</span></a></section></div></section><section class="section featured-rides" aria-labelledby="featured-rides-title"><div class="wrap"><div class="head featured-head"><div><div class="eyebrow">Rides</div><h2 id="featured-rides-title">All ${b.routes.length} ride guides</h2><p class="muted">Flagship rides lead, followed by every other supported route and corridor. Each guide opens into topic-based planning notes.</p></div><a class="under" href="/routes" data-link>Browse as a list →</a></div><div class="feature-routes-grid all-rides-grid" id="home-routes">${rides.map(routeCard).join('')}</div></div></section><section class="section alt home-next-step"><div class="wrap home-next-step-inner"><div><div class="eyebrow">Keep exploring</div><h2>Country guides and detailed field notes</h2><p class="muted">Open a country guide when you are ready to narrow the trip by local food, water, sleep, repair, money or transport.</p></div><div class="home-next-links"><a class="btn" href="/countries" data-link>Browse countries</a><a class="home-next-country" href="/map" data-link>Explore map points →</a></div></div></section>`};
// Voice input is browser-native: no audio is sent through the Cycling
// Americas server.  Browsers without the Web Speech API simply retain the
// normal typed Ask control.
function qaBoxWithVoice(question=''){return `<div class="qa"><p class="ask-database-description">Searches the Cycling Americas rider FAQ database and public sources for answers.</p><textarea data-qa-input placeholder="Try: Bike repair in Huaraz?">${esc(question)}</textarea><div class="qa-actions"><button class="btn" data-qa-go>ASK</button><button class="qa-voice" type="button" data-qa-voice aria-label="Speak your question" title="Speak your question" onclick="captureAskVoice(this)">Use voice</button><span class="fine" data-qa-status aria-live="polite"></span></div><div class="answer" data-qa-answer></div></div>`}
function initQaWithVoice(root=document){$$('[data-qa-go]',root).forEach(btn=>{const box=btn.closest('.qa'),input=$('[data-qa-input]',box),ans=$('[data-qa-answer]',box),status=$('[data-qa-status]',box),voice=$('[data-qa-voice]',box),SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;btn.onclick=async()=>{const q=input.value.trim();if(!q)return;btn.disabled=true;status.textContent='Searching…';ans.style.display='block';ans.textContent='Resolving the place, ride and planning evidence…';try{const d=await api('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})});const mode=d.mode_label||(d.mode==='ai-synthesis'?'AI synthesis grounded in the public planning database':'Database result — AI synthesis unavailable'),general=d.general_context?`<section class="answer-section answer-general"><h3>General GPT context</h3><p>${esc(d.general_context).replace(/\n/g,'<br>')}</p><p class="answer-caption">Not a verified local record.</p></section>`:'',note=`<p class="answer-notice">* ${esc(d.planning_note||'Confirm local details before relying on them.')}</p>`;ans.innerHTML=`<section class="answer-section"><h3>Cycling Americas records</h3><div>${esc(d.answer).replace(/\n/g,'<br>')}</div><div class="answer-meta">${esc(mode)} · ${d.records_used} record${d.records_used===1?'':'s'} used</div></section>${general}${note}${d.sources?.length?`<details class="answer-evidence"><summary>Public sources</summary><div class="sourcechips">${d.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noreferrer">${esc(s.title||'source')} ↗</a>`).join('')}</div></details>`:''}`;status.textContent=''}catch(e){ans.textContent='Q&A error: '+e.message;status.textContent=''}finally{btn.disabled=false}};if(!voice)return;if(!SpeechRecognition){voice.hidden=true;return}let recognition=null,listening=false,baseText='';const reset=()=>{listening=false;voice.classList.remove('is-listening');voice.textContent='Use voice';voice.setAttribute('aria-pressed','false')};voice.onclick=()=>{if(listening){recognition?.stop();return}recognition=new SpeechRecognition();recognition.continuous=false;recognition.interimResults=true;recognition.lang=document.documentElement.lang||navigator.language||'en-US';baseText=input.value.trim();recognition.onstart=()=>{listening=true;voice.classList.add('is-listening');voice.textContent='Stop listening';voice.setAttribute('aria-pressed','true');status.textContent='Listening…'};recognition.onresult=e=>{let finalText='',interimText='';for(let i=e.resultIndex;i<e.results.length;i++){const transcript=e.results[i][0].transcript.trim();if(e.results[i].isFinal)finalText+=`${finalText?' ':''}${transcript}`;else interimText+=`${interimText?' ':''}${transcript}`}input.value=[baseText,finalText,interimText].filter(Boolean).join(baseText&&(finalText||interimText)?' ':'');status.textContent=interimText?'Listening…':'Voice captured.'};recognition.onerror=e=>{status.textContent=e.error==='not-allowed'?'Microphone access was not allowed.':'Voice input was unavailable.'};recognition.onend=()=>{reset();if(status.textContent==='Listening…')status.textContent='Voice captured.'};try{recognition.start()}catch{reset();status.textContent='Voice input was unavailable.'}}})}
// Model answers are plain text. Render the small, intentionally supported
// Markdown subset ourselves so concrete field notes remain readable without
// ever treating model output as trusted HTML.
function askAnswerMarkup(value){
  let text=String(value||'').replace(/\r/g,'').trim();
  if(!text)return '<p>No answer was returned.</p>';
  if(!text.includes('\n')){
    text=text
      .replace(/(?:^|\s)(What the (?:records|evidence) say|What you should do|Practical implications?|Practical plan|Current-check note|What remains uncertain|General guidance):\s*/gi,'\n## $1\n')
      .replace(/\s+-\s+(?=[A-Z])/g,'\n- ');
  }
  const headingLabels={
    'short answer':'Short answer','answer':'Short answer','what the records say':'What the records say',
    'what the evidence says':'What the records say','specifics':'Specifics from the guide',
    'specifics from the guide':'Specifics from the guide','what you should do':'Practical plan',
    'practical implication':'Practical plan','practical implications':'Practical plan','practical plan':'Practical plan',
    'what remains uncertain':'What remains uncertain','general guidance':'General guidance','before you go':'Before you go'
  };
  // Escape first, then add only the few markup tags we deliberately support.
  // This keeps a model's occasional emphasis readable without allowing it to
  // inject arbitrary HTML into the page.
  const inline=value=>esc(value)
    .replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>')
    .replace(/`([^`\n]+)`/g,'<code>$1</code>');
  const parts=[],paragraph=[],items=[];
  const flushParagraph=()=>{if(paragraph.length){parts.push(`<p>${inline(paragraph.join(' '))}</p>`);paragraph.length=0}};
  const flushItems=()=>{if(items.length){parts.push(`<ul>${items.map(item=>`<li>${inline(item)}</li>`).join('')}</ul>`);items.length=0}};
  for(const raw of text.split('\n')){
    const line=raw.trim();
    // Model bullet lists often contain a blank line between items. Preserve
    // one coherent list instead of rendering each item as a separate list.
    if(!line){flushParagraph();continue}
    const heading=line.match(/^(?:#{1,3}\s*)?([A-Za-z][A-Za-z &'’/-]{2,}):?\s*$/);
    const labelled=line.match(/^(?:#{1,3}\s*)?([A-Za-z][A-Za-z &'’/-]{2,}):\s+(.+)$/);
    const label=(heading||labelled)?.[1]?.trim().toLowerCase();
    if(label&&headingLabels[label]){
      flushParagraph();flushItems();parts.push(`<h3>${esc(headingLabels[label])}</h3>`);
      if(labelled?.[2])paragraph.push(labelled[2].trim());
      continue;
    }
    const bullet=line.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/);
    if(bullet){flushParagraph();items.push(bullet[1].trim());continue}
    flushItems();paragraph.push(line);
  }
  flushParagraph();flushItems();
  return parts.join('')||`<p>${inline(text)}</p>`;
}

function initQaPolished(root=document){
  // Retain browser-native voice input, then replace only the result callback
  // with structured, safe presentation.
  initQaWithVoice(root);
  $$('[data-qa-go]',root).forEach(btn=>{
    const box=btn.closest('.qa'),input=$('[data-qa-input]',box),ans=$('[data-qa-answer]',box),status=$('[data-qa-status]',box),homepagePanel=!!box.closest('.landing-ask-panel'),context=box.closest('[data-qa-context]'),routeSelect=context?.querySelector('[data-qa-route]');
    // Enhance every Ask box, including legacy route/place templates.
    const description=box.querySelector('.ask-database-description');
    if(description)description.textContent='Answers from the Cycling Americas rider FAQ database, including recorded public-source research.';
    if(!box.querySelector('[data-qa-public]'))input.insertAdjacentHTML('afterend','<label class="qa-public-option" style="display:flex;align-items:center;gap:.6rem;font-size:.95rem;margin:12px 0"><input type="checkbox" data-qa-public style="width:18px;height:18px;margin:0;flex:none">Include public data answer as well</label>');
    btn.onclick=async()=>{
      const question=input.value.trim();
      if(!question)return;
      const readyLabel=btn.dataset.qaReadyLabel||(btn.dataset.qaReadyLabel=btn.textContent.trim());
      btn.disabled=true;
      btn.classList.add('is-loading');
      btn.innerHTML='<span class="qa-spinner" aria-hidden="true"></span><span>Generating…</span>';
      box.classList.add('is-loading');
      box.setAttribute('aria-busy','true');
      input.setAttribute('aria-busy','true');
      const routeId=routeSelect?.value||'';
      const routeName=routeId?routeSelect?.options?.[routeSelect.selectedIndex]?.textContent?.trim()||'this ride':'';
      status.textContent=routeName?`Searching ${routeName} database records…`:'Searching the rider database…';
      ans.style.display='block';
      ans.innerHTML=`<div class="qa-loading" role="status"><span class="qa-spinner" aria-hidden="true"></span><span>${routeName?`Looking through ${esc(routeName)} field records…`:'Looking through the relevant database records…'}</span></div>`;
      try{
        const includePublicData=box.querySelector('[data-qa-public]')?.checked===true;
        const data=await api('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,route_id:routeId||undefined,include_public_data:includePublicData})});
        const mode=data.mode_label||(data.mode==='ai-synthesis'?'AI synthesis grounded in Cycling Americas records':'Database result — AI synthesis unavailable');
        const matchedCount=Number.isFinite(Number(data.retrieved_records))?Number(data.retrieved_records):Number(data.records_used||0);
        const evidenceCount=Number.isFinite(Number(data.evidence_records))?Number(data.evidence_records):Number(data.records_used||0);
        const evidenceMeta=evidenceCount
          ?`${matchedCount} scoped match${matchedCount===1?'':'es'} · ${evidenceCount} used for this answer`
          :`${matchedCount} scoped match${matchedCount===1?'':'es'}`;
        const generalLabel=data.general_context_label||'Question-specific GPT perspective';
        const general=includePublicData&&data.general_context?`<details class="answer-section answer-general" open><summary>Additional public-knowledge answer</summary>${askAnswerMarkup(data.general_context)}<p class="answer-caption">General GPT knowledge, not database evidence or a live web search.</p></details>`:includePublicData?'<p class="answer-caption">No additional public-knowledge answer is available for this question. The database answer is shown above.</p>':'';
        const note=`<p class="answer-notice">* ${esc(data.planning_note||'Confirm local operating details before relying on them.')}</p>`;
        const sources=data.sources?.length?`<details class="answer-evidence"><summary>Sources already in the database</summary><div class="sourcechips">${data.sources.map(source=>`<a href="${esc(source.url)}" target="_blank" rel="noreferrer">${esc(source.title||'source')} ↗</a>`).join('')}</div></details>`:'';
        const scopeNote=routeName?`<p class="qa-scope-active">Scoped to <strong>${esc(routeName)}</strong></p>`:'';
        const interpreted=data.interpretation;
        const interpretedPlaces=interpreted?(interpreted.places?.length?interpreted.places:interpreted.routes?.length?interpreted.routes:interpreted.countries||[]):[];
        const interpretationNote=interpretedPlaces.length?`<p class="answer-caption">Interpreted as: ${esc((interpreted.topics||[]).map(topic=>topic==='camping'?'lodging / camping':topic).join(', '))} in ${esc(interpretedPlaces.join(', '))}.</p>`:'';
        ans.innerHTML=`${scopeNote}${interpretationNote}<section class="answer-section"><div class="answer-eyebrow">From the rider database</div>${askAnswerMarkup(data.answer)}<div class="answer-meta">${esc(mode)} · ${esc(evidenceMeta)}</div></section>${general}${note}${sources}`;
        status.textContent='';
      }catch(error){
        ans.textContent='Q&A error: '+error.message;
        status.textContent='The answer could not be loaded. Please try again.';
      }finally{
        btn.disabled=false;
        btn.classList.remove('is-loading');
        btn.textContent=readyLabel;
        box.classList.remove('is-loading');
        box.removeAttribute('aria-busy');
        input.removeAttribute('aria-busy');
      }
    };
  });
}

// A single field-guide schema keeps country and ride pages comparable without
// pretending that every country has the same amount of source material.
// Existing records stay scoped to their source entity; empty sections state the
// gap plainly rather than filling it with generic travel advice.
const SHARED_GUIDE_CHAPTERS=[
  {id:'overview',title:'Start Here'},
  {id:'food-water',title:'Food & Water'},
  {id:'sleep',title:'Sleep'},
  {id:'repair-gear',title:'Repair & Gear'},
  {id:'money-connectivity',title:'Money & Connectivity'},
  {id:'transport-borders',title:'Transport & Borders'}
];
const guideText=(...values)=>norm(values.filter(Boolean).join(' '));
const guideHas=(text,terms)=>terms.some(term=>text.includes(term));
function guideBucketForUnit(unit){
  const text=guideText(unit.recommended_section,unit.title,unit.idea_name,unit.data_field);
  if(guideHas(text,['food','water','resupply','grocery','market','fuel','stove','cooking','bodega']))return 'food-water';
  if(guideHas(text,['camp','sleep','lodging','accommodation','hostel','refuge','refugio','tent']))return 'sleep';
  if(guideHas(text,['repair','bike shop','bicycle','bicicle','parts','gear','workshop','mechanic']))return 'repair-gear';
  if(guideHas(text,['cash','atm','card','money','payment','currency','exchange','connectivity','signal','wifi','internet','sim']))return 'money-connectivity';
  if(guideHas(text,['transport','ferry','boat','barge','border','customs','immigration','bus','train','bailout','permit','crossing']))return 'transport-borders';
  return 'overview';
}
function guideBucketForFact(fact){
  const category=String(fact.category||'').toLowerCase();
  if(['food','water','fuel'].includes(category))return 'food-water';
  if(category==='camping')return 'sleep';
  if(category==='repair')return 'repair-gear';
  if(['money','connectivity'].includes(category))return 'money-connectivity';
  if(['transport','ferry','border'].includes(category))return 'transport-borders';
  return 'overview';
}
function guideBucketForPoint(point){
  const text=guideText(point.service_type,point.display_type,point.point_type);
  if(guideHas(text,['food','water','fuel']))return 'food-water';
  if(guideHas(text,['camp','lodging','hostel','hotel','sleep','refuge']))return 'sleep';
  if(guideHas(text,['repair','gear','bike shop','bicycle']))return 'repair-gear';
  if(guideHas(text,['transport','ferry','border','bus']))return 'transport-borders';
  return '';
}
function guideScopeAllows(unit,scope){
  const kind=String(unit.primary_scope_type||'').trim().toLowerCase();
  if(!kind)return true;
  if(scope==='country')return kind==='country';
  return ['route','place','poi','map_point','service','public_map_point','agent_poi'].includes(kind);
}
function uniqueGuideItems(items,keyFor){
  const seen=new Set();
  return (items||[]).filter(item=>{
    const key=norm(keyFor(item));
    if(!key||seen.has(key))return false;
    seen.add(key);
    return true;
  });
}
function guideUnitsFor(units,scope,bucket){
  return uniqueGuideItems((units||[]).filter(unit=>guideScopeAllows(unit,scope)&&guideBucketForUnit(unit)===bucket),unit=>[unit.title,unit.detailed_answer||unit.concise_answer].join(' '));
}
function guideFactsFor(facts,bucket){
  return uniqueGuideItems((facts||[]).filter(fact=>guideBucketForFact(fact)===bucket),fact=>fact.value_text||fact.external_fact_id);
}
function guideFactsDistinctFromUnits(facts,units){
  const unitText=(units||[]).map(unit=>norm(unit.detailed_answer||unit.concise_answer||'')).filter(Boolean);
  return (facts||[]).filter(fact=>{
    const text=norm(fact.value_text||'');
    return !text||!unitText.some(unit=>unit.includes(text)||text.includes(unit));
  });
}
function guidePointsFor(points,bucket){
  return uniqueGuideItems((points||[]).filter(point=>guideBucketForPoint(point)===bucket),point=>point.map_point_id||point.canonical_name);
}
function guideUnitCards(units){
  if(!units.length)return '';
  const card=unit=>{
    const title=guideDisplayLabel(unit.title)||'Field note';
    const meta=[unit.evidence_strength&&`Evidence: ${unit.evidence_strength}`,unit.freshness_class||unit.freshness,unit.latest_verification_at&&`reviewed ${unit.latest_verification_at}`].filter(Boolean).join(' · ');
    return `<article class="guide-unit"><h3>${esc(title)}</h3><p>${esc(unit.detailed_answer||unit.concise_answer||'')}</p>${meta?`<p class="meta">${esc(meta)}</p>`:''}</article>`;
  };
  const visible=units.slice(0,6),more=units.slice(6);
  return `<div class="guide-units">${visible.map(card).join('')}</div>${more.length?`<details class="more-facts"><summary>More field notes (${more.length})</summary><div class="guide-units guide-units-more">${more.map(card).join('')}</div></details>`:''}`;
}
function guideFactLabel(fact){
  const generic=new Set(['other','planning option','planning_option','fact','note','details','information']);
  const labels=uniqueGuideItems([fact.poi_or_service_name,fact.place_or_segment,fact.subcategory,fact.data_field].filter(Boolean),value=>value)
    .filter(value=>!generic.has(norm(value)));
  return labels.slice(0,2).map(label=>guideDisplayLabel(label)).join(' · ');
}
function guideDisplayLabel(value){
  const raw=focusedCountryUnitLabel(String(value||''))
    .replace(/[._]+/g,' ')
    .replace(/\s+/g,' ')
    .trim();
  if(!raw)return '';
  const known={
    'safety context':'Safety Context',
    'cash cards atms':'Cash, Cards & ATMs',
    'cash payment profile':'Cash & Payment Profile',
    'country snapshot':'Country Snapshot'
  };
  const key=raw.toLowerCase();
  if(known[key])return known[key];
  if(raw===raw.toLowerCase())return raw.replace(/\b\w/g,letter=>letter.toUpperCase()).replace(/\bAtms\b/g,'ATMs').replace(/\bWifi\b/g,'Wi‑Fi');
  return raw;
}
function guideFactCards(facts){
  if(!facts.length)return '';
  const card=fact=>{
    const label=guideFactLabel(fact),meta=[fact.evidence_strength&&`Evidence: ${fact.evidence_strength}`,fact.last_checked_date&&`reviewed ${fact.last_checked_date}`].filter(Boolean).join(' · ');
    const source=isSafePublicUrl(fact.source_url);
    return `<article class="fact">${label?`<h3 class="field-record-label">${esc(label)}</h3>`:''}<p>${esc(fact.value_text||'')}</p>${meta||source?`<p class="meta">${esc(meta)}${meta&&source?' · ':''}${source?`<a class="under" href="${esc(source)}" target="_blank" rel="noreferrer">Source ↗</a>`:''}</p>`:''}</article>`;
  };
  const visible=facts.slice(0,6),more=facts.slice(6);
  return `<div class="guide-facts">${visible.map(card).join('')}</div>${more.length?`<details class="more-facts"><summary>More supporting records (${more.length})</summary><div class="guide-facts">${more.map(card).join('')}</div></details>`:''}`;
}
function guidePointCards(points){
  if(!points.length)return '';
  const card=point=>{
    const link=point.map_point_id?`/stops/${esc(point.map_point_id)}`:'';
    const body=`<span class="tag">${esc(point.display_type||point.service_type||point.point_type||'stop')}</span><h3>${esc(point.canonical_name)}</h3>${point.nearest_place?`<p class="meta">Near ${esc(point.nearest_place)}</p>`:''}<p>${esc(point.summary||'Public cycling-related stop.')}</p>`;
    return link?`<a class="guide-stop" href="${link}" data-link>${body}</a>`:`<article class="guide-stop">${body}</article>`;
  };
  const visible=points.slice(0,4),more=points.slice(4);
  return `<div class="guide-topic-stops">${visible.map(card).join('')}</div>${more.length?`<details class="more-facts"><summary>More mapped stops (${more.length})</summary><div class="guide-topic-stops">${more.map(card).join('')}</div></details>`:''}`;
}
function sharedGuideSection(chapter,{units,facts,points,scopeLabel}){
  facts=guideFactsDistinctFromUnits(facts,units);
  const hasContent=units.length||facts.length||points.length;
  return `<section class="guide-section" id="${chapter.id}"><div class="head"><h2>${esc(chapter.title)}</h2>${hasContent?`<span class="meta">${units.length+facts.length} field record${units.length+facts.length===1?'':'s'}${points.length?` · ${points.length} mapped stop${points.length===1?'':'s'}`:''}</span>`:'<span class="meta">No field notes yet</span>'}</div>${units.length?guideUnitCards(units):''}${facts.length?`<h3 class="country-topic-subhead">Supporting records</h3>${guideFactCards(facts)}`:''}${points.length?`<h3 class="country-topic-subhead">Mapped stops</h3>${guidePointCards(points)}`:''}${!hasContent?`<p class="guide-empty">No ${esc(scopeLabel)} field note is published for ${esc(chapter.title.toLowerCase())} yet.</p>`:''}</section>`;
}
function sharedGuideSections(payload){
  return SHARED_GUIDE_CHAPTERS.map(chapter=>sharedGuideSection(chapter,{
    units:guideUnitsFor(payload.units,payload.scope,chapter.id),
    facts:guideFactsFor(payload.facts,chapter.id),
    points:guidePointsFor(payload.points,chapter.id),
    scopeLabel:payload.scopeLabel
  })).join('');
}
function sharedGuideNav(extra=[]){
  const links=[...SHARED_GUIDE_CHAPTERS.map(chapter=>[chapter.id,chapter.title]),...extra];
  return `<section class="guide-nav"><div class="wrap">${links.map(([id,label])=>`<a href="#${id}" data-guide-jump onclick="jumpToGuideSection('${esc(id)}');return false">${esc(label)}</a>`).join('')}</div></section>`;
}
function sharedEvidenceAside({name,sources=[],safety,askQuestion}){
  const safeSources=(sources||[]).filter(source=>isSafePublicUrl(source.url));
  const safeLink=safety&&isSafePublicUrl(safety.source_url);
  return `<aside class="guide-aside"><div class="card"><h3>${safety?'Safety context':'Using this guide'}</h3>${safety?`<span class="tag safety${esc(safety.advisory_level||'')}">${esc(safety.level_label||'Current advisory')}</span><p>${esc(safety.summary||'')}</p>${safety.route_relevance_note?`<p>${esc(safety.route_relevance_note)}</p>`:''}${safeLink?`<p><a class="under" href="${esc(safeLink)}" target="_blank" rel="noreferrer">Advisory source ↗</a></p>`:''}`:`<p class="meta">Field notes are organized by topic and remain tied to the country or ride named on this page.</p>`}<p class="guide-aside-note">Operational details can change—confirm locally before relying on a service, schedule, price, border rule or access condition.</p>${safeSources.length?`<details><summary>${safeSources.length} public source${safeSources.length===1?'':'s'}</summary><div class="list">${safeSources.slice(0,40).map(source=>`<a class="source" href="${esc(source.url)}" target="_blank" rel="noreferrer">${esc(source.name||'Public source')} ↗</a>`).join('')}</div></details>`:''}<p style="margin-top:16px">${askLink(askQuestion,'Ask about this guide →')}</p></div></aside>`;
}
function guideMapSection({id='stops',title='Map & Stops',points,mapHref,mapLabel}){
  return `<section class="guide-section" id="${id}"><div class="head"><h2>${esc(title)}</h2><a class="under" href="${mapHref}" data-link>${esc(mapLabel)}</a></div>${points.length?`<div class="grid two">${points.map(mapCard).join('')}</div>`:'<p class="guide-empty">No exact public map stop is attached to this guide yet.</p>'}</section>`;
}
function guideRidesSection(rides){
  return `<section class="guide-section" id="rides"><div class="head"><h2>Rides</h2><span class="meta">${rides.length} named ride${rides.length===1?'':'s'}</span></div>${rides.length?`<div class="grid two">${rides.map(routeCard).join('')}</div>`:'<p class="guide-empty">No named ride is currently assigned to this country.</p>'}</section>`;
}
function guideQuestionsSection(questions){
  return questions.length?`<section class="guide-section" id="questions"><div class="head"><h2>Questions riders ask</h2></div><div class="question-chips">${questions.map(question=>askLink(question.question,question.question)).join('')}</div></section>`:'';
}

// Replace the redundant site-search control with Ask. The search API stays
// available for existing integrations, but no public page exposes the broad
// search field that competed with the more useful planning guide.
searchBox=()=>'';
routesPage=async()=>{
  const country=new URLSearchParams(location.search).get('country')||'';
  const data=await api('/api/routes'+(country?'?country='+encodeURIComponent(country):''));
  const bootstrap=APP.bootstrap||await api('/api/bootstrap');APP.bootstrap=bootstrap;
  const countries=(await api('/api/countries')).countries;
  const selected=country?countries.find(item=>item.iso2===country):null;
  const ordered=homepageAllRoutes(data.routes||[]);
  const featured=homepageFeaturedRoutes(data.routes||[]);
  const featuredIds=new Set(featured.map(route=>route.route_id));
  const remaining=ordered.filter(route=>!featuredIds.has(route.route_id));
  // A country with no flagship route should still open directly onto its
  // available rides, rather than hiding the whole country behind a reveal.
  const lead=featured.length?featured:ordered;
  const extra=featured.length?remaining:[];
  const title=selected?`${esc(selected.canonical_name)} rides`:'Major rides';
  const intro=selected
    ?'The country filter applies to both the visible rides and the optional remainder below.'
    :'The most established, best-supported rides are up front. Every other supported route remains one click away.';
  const moreLabel=selected?`Show ${extra.length} more ${esc(selected.canonical_name)} ride${extra.length===1?'':'s'}`:`Show ${extra.length} more ride${extra.length===1?'':'s'}`;
  const grid=lead.length?`<div class="feature-routes-grid route-page-grid" id="routes-grid">${lead.map(routeCard).join('')}</div>`:'<div class="empty">No named ride is currently assigned to this country.</div>';
  const reveal=extra.length?`<details class="route-page-more"><summary><span><b>${moreLabel}</b><small>All remain part of the guide.</small></span><span class="route-page-more-cue" aria-hidden="true">View all</span></summary><div class="feature-routes-grid route-page-more-grid">${extra.map(routeCard).join('')}</div></details>`:'';
  return `${pageHero('Rides','Browse ride guides','Choose a country to narrow the collection, then open a detailed field guide.')}<section class="section alt"><div class="wrap"><div class="field" style="max-width:360px"><label for="routes-country">Country</label><select id="routes-country"><option value="">All countries</option>${bootstrap.countries.map(item=>`<option value="${esc(item.iso2)}" ${item.iso2===country?'selected':''}>${esc(item.canonical_name)}</option>`).join('')}</select></div>${selected?`<div class="country-selection"><span class="countryflag">${COUNTRY_FLAGS[selected.iso2]||'◎'}</span><div><b>${esc(selected.canonical_name)}</b><p class="meta">${countryCounts(selected)} · <a class="under" href="/countries/${esc(selected.slug)}" data-link>country guide</a></p></div></div>`:''}<div class="head route-page-head"><div><div class="eyebrow">${selected?'Selected country':'Start here'}</div><h2>${title}</h2><p class="muted">${intro}</p></div><span class="meta">${data.routes.length} shown</span></div>${grid}${reveal}</div></section>`;
};
countryPage=async id=>{
  const country=await api('/api/countries/'+encodeURIComponent(id));
  const core=sharedGuideSections({units:country.product_units||[],facts:country.external_facts||[],points:country.map_points||[],scope:'country',scopeLabel:'country-wide'});
  const rides=guideRidesSection(country.routes||[]);
  const questions=guideQuestionsSection(country.questions||[]);
  const stops=guideMapSection({points:country.map_points||[],mapHref:`/map?country=${encodeURIComponent(country.iso2)}`,mapLabel:'Open country map'});
  return `${pageHero('Country',`Cycling in ${country.canonical_name}`,`Country-wide field notes, related rides and mapped public stops for ${country.canonical_name}.`)}${sharedGuideNav([['rides','Rides'],['stops','Map & Stops'],...(country.questions?.length?[['questions','Questions']]:[])])}<section class="section"><div class="wrap guide-layout"><main>${core}${rides}${stops}${questions}</main>${sharedEvidenceAside({name:country.canonical_name,sources:country.sources||[],safety:country.safety,askQuestion:`What should cyclists know about ${country.canonical_name}?`})}</div></section>`;
};
routeGuidePage=async id=>{
  const route=await api('/api/routes/'+encodeURIComponent(id));
  const stats=[['Distance',route.distance_text],['Typical time',route.typical_days_text],['Difficulty',route.difficulty_text],['Exact stops',route.map_points.length?String(route.map_points.length):null]].filter(([,value])=>value);
  const overview=sharedGuideSection(SHARED_GUIDE_CHAPTERS[0],{units:guideUnitsFor(route.product_units||[],'route','overview'),facts:guideFactsFor(route.external_facts||[],'overview'),points:guidePointsFor(route.map_points||[],'overview'),scopeLabel:'route-specific'});
  const topics=SHARED_GUIDE_CHAPTERS.slice(1).map(chapter=>sharedGuideSection(chapter,{units:guideUnitsFor(route.product_units||[],'route',chapter.id),facts:guideFactsFor(route.external_facts||[],chapter.id),points:guidePointsFor(route.map_points||[],chapter.id),scopeLabel:'route-specific'})).join('');
  const crossCountry=route.countries.length>1?`<section class="guide-section" id="countries"><div class="head"><h2>Countries on this ride</h2></div>${compactCountryCards(route.countries)}</section>`:'';
  const segments=route.segments.length?`<section class="guide-section" id="segments"><div class="head"><h2>Planning segments</h2><span class="meta">${route.segments.length} ordered section${route.segments.length===1?'':'s'}</span></div><div class="segments">${route.segments.map(segmentCard).join('')}</div></section>`:'';
  const stops=guideMapSection({points:route.map_points||[],mapHref:`/map?route=${encodeURIComponent(route.route_id)}`,mapLabel:'Open route map'});
  const questions=guideQuestionsSection(route.questions||[]);
  const extras=[...(route.countries.length>1?[['countries','Countries']]:[]),...(route.segments.length?[['segments','Segments']]:[]),['stops','Map & Stops'],...(route.questions?.length?[['questions','Questions']]:[])];
  return `${pageHero('Ride guide',route.canonical_name,route.overview_text||route.endpoints_or_scope_hint||'Route planning information.',`<div class="tagrow">${route.countries.map(country=>`<span class="tag">${esc(country.canonical_name)}</span>`).join('')}</div>${stats.length?`<div class="stats">${stats.map(([label,value])=>`<div class="stat"><span>${esc(label)}</span><b>${esc(value)}</b></div>`).join('')}</div>`:''}<div class="guide-actions"><a class="btn" href="/map?route=${encodeURIComponent(route.route_id)}" data-link>Map this ride</a><button class="btn ghost" onclick="window.print()">Print / save PDF</button></div>`)}${sharedGuideNav(extras)}<section class="section"><div class="wrap guide-layout"><main>${overview}${crossCountry}${segments}${topics}${stops}${questions}</main>${sharedEvidenceAside({name:route.canonical_name,sources:route.sources||[],askQuestion:`What should cyclists know about ${route.canonical_name}?`})}</div></section>`;
};
const landingMountainScene=()=>`<svg class="landing-mountain-scene" viewBox="0 0 1600 560" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
  <path class="mountain-haze" d="M0 421 112 315 231 388 389 193 542 395 702 258 876 397 1046 168 1221 382 1383 263 1600 413V560H0Z"/>
  <path class="mountain-snowline" d="M0 421 112 315 231 388 389 193 542 395 702 258 876 397 1046 168 1221 382 1383 263 1600 413"/>
  <path class="mountain-mid" d="M0 480 145 340 291 453 470 295 623 467 789 334 943 469 1126 264 1291 462 1453 322 1600 438V560H0Z"/>
  <path class="mountain-near" d="M0 532 133 428 257 502 418 384 582 526 756 413 926 513 1095 370 1249 499 1401 407 1600 509V560H0Z"/>
  <path class="mountain-trail" d="M0 536c177-42 283 19 431-13 146-31 231-102 364-73 105 24 164 92 304 67 149-27 253-81 501-46"/>
  <g class="mountain-rider" transform="translate(88 438) rotate(-38)">
    <circle class="rider-wheel" cx="-9" cy="15" r="8"/>
    <circle class="rider-wheel" cx="17" cy="15" r="8"/>
    <path class="rider-frame" d="m-9 15 11-15 8 15H-9L2 0l15 15M2 0h10l4-6M-1 0-6-2"/>
    <path class="rider-body" d="m1-2 5-12 8 7-5 11m-2-24a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4-13l-10 4m14 6 7 8"/>
  </g>
</svg>`;
home=async()=>{
  const bootstrap=APP.bootstrap||await api('/api/bootstrap');APP.bootstrap=bootstrap;
  const rides=homepageFeaturedRoutes(bootstrap.routes);
  const guideOptions=`<option value="">Choose a guide</option><optgroup label="Featured rides">${rides.map(route=>`<option value="ride:${esc(route.slug)}">${esc(route.canonical_name)}</option>`).join('')}</optgroup><optgroup label="Country guides">${(bootstrap.countries||[]).map(country=>`<option value="country:${esc(country.slug)}">${esc(country.canonical_name)}</option>`).join('')}</optgroup>`;
  return `<section class="landing-hero">${landingMountainScene()}<div class="wrap landing-hero-grid"><div class="landing-copy">${landingAskPanel()}<p class="landing-note">Free, non-commercial and made for real trips.</p></div><section class="landing-map-panel" aria-labelledby="home-map-title"><div class="landing-map-head"><div><div class="eyebrow">Map</div><h2 id="home-map-title">Find useful stops</h2></div><span class="map-count">${bootstrap.map_point_count} pins</span></div><p id="home-map-status" class="landing-map-status">Loading locations…</p><div id="home-map" class="map home-map" aria-label="Interactive map of Cycling Americas locations"></div><div id="home-map-fallback" class="mapfallback">Open the map to browse locations.</div><a class="landing-map-footer" href="/map" data-link>Open map <span aria-hidden="true">→</span></a></section></div></section><section class="section featured-rides" aria-labelledby="featured-rides-title"><div class="wrap"><div class="head featured-head"><div><div class="eyebrow">Rides</div><h2 id="featured-rides-title">Featured guides</h2><p class="muted">Our most detailed ride guides, with photos and practical notes.</p></div><a class="under" href="/routes" data-link>Browse rides →</a></div><div class="feature-routes-grid" id="home-routes">${rides.map(routeCard).join('')}</div></div></section><section class="section alt home-next-step"><div class="wrap home-next-step-inner"><div><div class="eyebrow">Guide picker</div><h2>Open a guide</h2><p class="muted">Choose a featured ride or country.</p></div><div class="home-guide-picker"><div class="field"><label for="home-guide-select">Guide</label><select id="home-guide-select">${guideOptions}</select></div><button class="btn" id="home-guide-open" type="button">Open guide</button><a class="home-next-country" href="/map" data-link>Map →</a></div></div></section>`;
};
initHome=()=>{
  initHomeMap();
  const guide=$('#home-guide-select'),open=$('#home-guide-open');
  if(!guide||!open)return;
  const openGuide=()=>{
    const [type,slugValue]=String(guide.value||'').split(':');
    if(!slugValue){guide.focus();return}
    navigate(type==='ride'?'/routes/'+encodeURIComponent(slugValue):'/countries/'+encodeURIComponent(slugValue));
  };
  open.onclick=openGuide;
  guide.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();openGuide()}};
};

// The data area is useful only if a rider can take a focused slice with them.
// Keep its downloads scoped to the same public DTOs used in the site instead
// of exposing a separate database or a bulk contact feed.
function publicExportParts(value){
  if(!value||value==='all')return {scope:'all',id:''};
  const divider=value.indexOf(':');
  return divider<0?{scope:'all',id:''}:{scope:value.slice(0,divider),id:value.slice(divider+1)};
}
function publicExportUrl(value,format){
  const parts=publicExportParts(value);
  return '/api/public-export?scope='+encodeURIComponent(parts.scope)+'&id='+encodeURIComponent(parts.id)+'&format='+encodeURIComponent(format);
}
function initDataDownloads(root=document){
  const scope=root.querySelector('#data-export-scope'),format=root.querySelector('#data-export-format'),download=root.querySelector('#data-export-download');
  if(!scope||!format||!download)return;
  const status=root.querySelector('#data-export-status');
  const update=()=>{
    const isExcel=format.value==='xlsx',label=scope.options[scope.selectedIndex]?.text||'public release';
    download.href=publicExportUrl(scope.value,format.value);
    download.download='';
    download.textContent=isExcel?'Download Excel workbook':'Download JSON';
    if(status)status.textContent=isExcel?`${label}: a filterable workbook with a short Read Me sheet and public planning tables.`:`${label}: structured JSON for a private AI project, local script or custom map.`;
  };
  scope.addEventListener('change',update);format.addEventListener('change',update);update();

  const prepare=root.querySelector('#contribution-email');
  if(!prepare)return;
  prepare.addEventListener('click',()=>{
    const kind=root.querySelector('#contribution-kind')?.value||'new field information';
    const contributionScope=root.querySelector('#contribution-scope');
    const scopeLabel=contributionScope?.options[contributionScope.selectedIndex]?.text||'No specific country or ride';
    const notes=(root.querySelector('#contribution-notes')?.value||'').trim();
    const files=[...(root.querySelector('#contribution-files')?.files||[])].map(file=>file.name);
    const body=[
      'Hello John,',
      '',
      `I am sending: ${kind}`,
      `Related guide: ${scopeLabel}`,
      files.length?`Files selected on my device: ${files.join(', ')}`:'No file selected.',
      '',
      'Notes:',
      notes||'[Add the place, route, source link, correction or contact context here.]',
      '',
      'Please attach any selected files to this email before sending. Files are not uploaded to or stored by the public website.',
    ].join('\n');
    const subject=`Cycling Americas contribution — ${kind}`;
    const destination='mailto:Johntanis216@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    const contributionStatus=root.querySelector('#contribution-status');
    if(contributionStatus)contributionStatus.textContent='Opening your email app. Attach any selected files there before sending.';
    window.location.href=destination;
  });
}
dataPage=async()=>{
  const bootstrap=APP.bootstrap||await api('/api/bootstrap');APP.bootstrap=bootstrap;
  const rel=bootstrap.release||{};
  const countries=bootstrap.countries||[],routes=bootstrap.routes||[];
  const exportOptions=`<option value="all">Entire public release</option><optgroup label="Country guides">${countries.map(country=>`<option value="country:${esc(country.iso2)}">Country — ${esc(country.canonical_name)}</option>`).join('')}</optgroup><optgroup label="Ride guides">${routes.map(route=>`<option value="route:${esc(route.route_id)}">Ride — ${esc(route.canonical_name)}</option>`).join('')}</optgroup>`;
  const contributionOptions=`<option value="">No specific country or ride</option><optgroup label="Countries">${countries.map(country=>`<option value="country:${esc(country.iso2)}">${esc(country.canonical_name)}</option>`).join('')}</optgroup><optgroup label="Rides">${routes.map(route=>`<option value="route:${esc(route.route_id)}">${esc(route.canonical_name)}</option>`).join('')}</optgroup>`;
  return `${pageHero('Resources','Use the public guide your way','Download a focused country or ride package, save a guide for offline reference, or help improve the next release.')}<section class="section resource-section"><div class="wrap"><div class="resource-grid"><article class="resource-card resource-download" aria-labelledby="data-export-title"><div class="eyebrow">Public data</div><h2 id="data-export-title">Take a country or ride with you</h2><p>Choose a small, useful slice of the publication-safe guide. The export includes the guide notes, public research facts, mapped stops and evidence fields that are relevant to that country or ride.</p><div class="data-export-controls"><div class="field"><label for="data-export-scope">What do you need?</label><select id="data-export-scope">${exportOptions}</select></div><div class="field"><label for="data-export-format">Download format</label><select id="data-export-format"><option value="json">JSON — best for AI and developers</option><option value="xlsx">Excel workbook (.xlsx)</option></select></div><a class="btn" id="data-export-download" href="/api/public-export?scope=all&amp;format=json" download>Download JSON</a></div><p class="meta data-export-status" id="data-export-status" role="status"></p><p class="fine">Downloads exclude contact records, contributor material and restricted locations.</p></article><article class="resource-card resource-ai" aria-labelledby="data-ai-title"><div class="eyebrow">For your own AI</div><h2 id="data-ai-title">How the JSON helps</h2><p>JSON is structured text: it keeps the fields and relationships intact instead of flattening the guide into a document. It is the better choice for a private AI project, a local script or a custom map.</p><ol class="resource-steps"><li>Download a country, ride or full public release.</li><li>Add the JSON to your private project or local AI workspace.</li><li>Ask it to use the supplied records, keep places and rides in scope, and link to source URLs where available.</li><li>Use the evidence and freshness fields as context—not as a guarantee that a ferry, price or business is current.</li></ol><p class="meta">The Excel option contains the same public information in readable, filterable tables with a short Read Me sheet.</p></article></div><div class="resource-grid resource-secondary"><article class="resource-card"><div class="eyebrow">Offline planning</div><h2>Save a clean field guide</h2><p>Every country and ride page is designed to print well. Open the guide you need, then use your browser’s Print command to save a PDF before you leave signal.</p><p class="resource-links"><a class="under" href="/routes" data-link>Choose a ride →</a><a class="under" href="/countries" data-link>Choose a country →</a></p></article><article class="resource-card"><div class="eyebrow">Release details</div><h2>What is in the data</h2><p>Current release: ${esc(rel.release_id||'Cycling Americas public release')}. The complete release includes all ${bootstrap.map_point_count} exact public map points, canonical countries and supported rides.</p><p class="meta">Source attribution, check dates, evidence strength and re-verification notes are preserved wherever the public record supplies them.</p></article></div></div></section><section class="section alt contribution-section" aria-labelledby="contribution-title"><div class="wrap contribution-layout"><div><div class="eyebrow">Improve the guide</div><h2 id="contribution-title">Have a correction, resource or useful local detail?</h2><p>Send a public source, a business name, route knowledge or a correction directly to the site owner. The site does not collect uploads or store visitor contact details; this form simply prepares an email on your device.</p><p class="fine">Please do not send private host locations or personal information without the person’s consent.</p></div><form class="contribution-form" onsubmit="return false"><div class="contribution-fields"><div class="field"><label for="contribution-kind">What are you sending?</label><select id="contribution-kind"><option>Correction or update</option><option>New business or service</option><option>Route or country field note</option><option>Public source or document</option><option>Photo or map improvement</option></select></div><div class="field"><label for="contribution-scope">Related country or ride</label><select id="contribution-scope">${contributionOptions}</select></div></div><div class="field"><label for="contribution-notes">What should we know?</label><textarea id="contribution-notes" rows="5" placeholder="Name the place, describe the update, add the public source link, or explain why it helps riders."></textarea></div><div class="contribution-upload"><div><label for="contribution-files">Attach source files</label><input id="contribution-files" type="file" multiple accept=".pdf,.xlsx,.xls,.csv,.json,.geojson,.gpx,.kml,.txt,.md,.jpg,.jpeg,.png,.webp"></div><p class="meta">Files stay on your device. After the email opens, attach them in your email app before sending.</p></div><div class="contribution-actions"><button class="btn" type="button" id="contribution-email">Prepare email</button><a class="under" href="mailto:Johntanis216@gmail.com?subject=Cycling%20Americas%20contribution">Email John directly →</a></div><p class="meta" id="contribution-status" role="status"></p></form></div></section>`;
};

// FAQ documents are route-first in this release.  The page renders the
// editorially written FAQ records in place, while country-wide FAQs remain
// deliberately out of the selector until they have the same coverage.
function faqTopicLabel(item){
  const key=norm([item?.topic_id,item?.intent_slug].filter(Boolean).join(' '));
  if(/camp|sleep|lodg/.test(key))return 'Camping & Sleep';
  if(/repair|bike shop|mechanic|parts|gear/.test(key))return 'Bike Repair & Gear';
  if(/water|food|resupply/.test(key))return 'Food & Water';
  if(/ferry|bus|transport/.test(key))return 'Transport';
  if(/border/.test(key))return 'Borders';
  if(/money|cash|card|atm/.test(key))return 'Money & Connectivity';
  return 'Route Planning';
}
function faqAnswerMarkup(value){
  const paragraphs=String(value||'').replace(/\r/g,'').split(/\n\s*\n/).map(part=>part.trim()).filter(Boolean);
  return paragraphs.length?paragraphs.map(part=>`<p>${esc(part).replace(/\n/g,'<br>')}</p>`).join(''):'<p>No published answer is available yet.</p>';
}
function faqDocumentCard(item,index){
  const meta=[item?.evidence_strength&&`Evidence: ${item.evidence_strength}`,item?.freshness_class&&`Freshness: ${item.freshness_class}`].filter(Boolean).join(' · ');
  return `<details class="faq-document" ${index===0?'open':''}><summary><span>${esc(item?.normalized_question||'Published route answer')}</span><span class="faq-document-toggle" aria-hidden="true">Read answer</span></summary><div class="faq-document-answer">${faqAnswerMarkup(item?.answer_text)}${meta?`<p class="meta">${esc(meta)}</p>`:''}</div></details>`;
}
function faqDocumentsMarkup(items=[]){
  if(!items.length)return '<div class="faq-empty"><p>A separate FAQ is not published for this ride yet. The route-specific field-guide notes below are still available.</p></div>';
  const groups=new Map();
  items.forEach(item=>{const label=faqTopicLabel(item);if(!groups.has(label))groups.set(label,[]);groups.get(label).push(item)});
  return `<div class="faq-document-groups">${[...groups.entries()].map(([label,group])=>`<section class="faq-topic-group"><div class="head"><h3>${esc(label)}</h3><span class="meta">${group.length} answer${group.length===1?'':'s'}</span></div>${group.map((item,index)=>faqDocumentCard(item,index)).join('')}</section>`).join('')}</div>`;
}
function faqGuideDocuments(route){
  if(!route)return '<div class="faq-empty"><p>Choose a ride to open its published FAQ and field-guide notes.</p></div>';
  const faqItems=route.faq_items||[];
  const fieldNotes=sharedGuideSections({units:route.product_units||[],facts:route.external_facts||[],points:route.map_points||[],scope:'route',scopeLabel:'route-specific'});
  return `<div class="faq-guide-head"><div><div class="eyebrow">Selected ride</div><h2>${esc(route.canonical_name||'Ride field guide')}</h2><p class="muted">${esc(route.overview_text||route.endpoints_or_scope_hint||'Published route FAQ and planning notes.')}</p></div></div><section class="faq-doc-section" aria-labelledby="faq-documents-title"><div class="head"><div><div class="eyebrow">FAQ documents</div><h2 id="faq-documents-title">Frequently asked</h2></div>${faqItems.length?`<span class="meta">${faqItems.length} published answer${faqItems.length===1?'':'s'}</span>`:''}</div>${faqDocumentsMarkup(faqItems)}</section><section class="faq-field-notes" aria-labelledby="faq-field-notes-title"><div class="head"><div><div class="eyebrow">Field guide</div><h2 id="faq-field-notes-title">Route planning notes</h2></div></div>${fieldNotes}</section>`;
}
function setFaqRouteQuery(routeId){
  const params=new URLSearchParams(location.search);
  if(routeId)params.set('route',routeId);else params.delete('route');
  const query=params.toString();
  history.replaceState({},'',`${sitePath()}${query?`?${query}`:''}`);
}
function initFaqGuide(root=document){
  const select=root.querySelector('[data-faq-route]'),documents=root.querySelector('[data-faq-documents]');
  if(!select||!documents)return;
  select.onchange=async()=>{
    const routeId=select.value;
    documents.setAttribute('aria-busy','true');
    documents.innerHTML='<div class="faq-documents-loading" role="status">Loading this field guide…</div>';
    try{
      const route=await api('/api/routes/'+encodeURIComponent(routeId));
      documents.innerHTML=faqGuideDocuments(route);
      setFaqRouteQuery(routeId);
    }catch(error){
      documents.innerHTML='<div class="faq-empty"><p>This field guide could not be loaded. Please choose another ride.</p></div>';
    }finally{documents.removeAttribute('aria-busy')}
  };
}
askPage=async()=>{
  const params=new URLSearchParams(location.search),question=params.get('q')||'',requestedRoute=params.get('route')||'';
  const bootstrap=APP.bootstrap||await api('/api/bootstrap');APP.bootstrap=bootstrap;
  const routes=homepageAllRoutes(bootstrap.routes||[]);
  const selectedRoute=routes.find(route=>route.route_id===requestedRoute)||routes.find(route=>question&&norm(question).includes(norm(route.canonical_name)))||null;
  const routeOptions=`<option value="">Choose a ride for its FAQ</option>${routes.map(route=>`<option value="${esc(route.route_id)}" ${selectedRoute?.route_id===route.route_id?'selected':''}>${esc(route.canonical_name)}</option>`).join('')}`;
  let selectedDetail=null;
  if(selectedRoute){try{selectedDetail=await api('/api/routes/'+encodeURIComponent(selectedRoute.route_id))}catch{selectedDetail=null}}
  return `${pageHero('FAQ','Ride field guides and direct answers.','Choose a ride to read its published FAQ documents and route-specific planning notes. Country guides are not selectable here yet.')}<section class="section"><div class="wrap qa-page" data-qa-context><div class="qa-scope faq-scope"><div class="field"><label for="qa-route">Ride field guide</label><select id="qa-route" data-qa-route data-faq-route>${routeOptions}</select></div><p class="meta">Changing the ride updates this page in place. Your follow-up questions stay grounded in the selected ride.</p></div><div class="faq-documents" data-faq-documents aria-live="polite">${faqGuideDocuments(selectedDetail)}</div><section class="faq-follow-up" aria-labelledby="faq-follow-up-title"><div class="head"><div><h2 id="faq-follow-up-title">Ask the Database</h2></div></div>${qaBoxWithVoice(question)}</section></div></section>`;
};

landingAskPanel=()=>`<section class="landing-ask-panel" aria-labelledby="landing-ask-title"><div class="landing-ask-head"><div><div class="eyebrow">FAQ</div><h2 id="landing-ask-title">Ask the Database</h2></div><a class="landing-ask-more" href="/ask" data-link>Open FAQ <span aria-hidden="true">→</span></a></div>${qaBoxWithVoice()}<p class="landing-ask-hint">Rides, places, repairs and ferries.</p></section>`;

// app.core.js and app.final.js execute as separate deferred scripts.  Publish
// these overrides explicitly on window so the renderer in app.core calls the
// enhanced Ask controls rather than its earlier function declarations.
window.qaBox=qaBoxWithVoice;window.initQa=initQaPolished;

// Keep the resource page honest about the depth of the scoped handbooks. The
// site interface stays concise; the downloadable country and ride packages do
// not inherit its display caps.
dataPage=async()=>{
  const bootstrap=APP.bootstrap||await api('/api/bootstrap');APP.bootstrap=bootstrap;
  const rel=bootstrap.release||{};
  const countries=bootstrap.countries||[],routes=bootstrap.routes||[];
  const exportOptions=`<option value="all">Entire public release</option><optgroup label="Country field handbooks">${countries.map(country=>`<option value="country:${esc(country.iso2)}">Country — ${esc(country.canonical_name)}</option>`).join('')}</optgroup><optgroup label="Ride field handbooks">${routes.map(route=>`<option value="route:${esc(route.route_id)}">Ride — ${esc(route.canonical_name)}</option>`).join('')}</optgroup>`;
  const contributionOptions=`<option value="">No specific country or ride</option><optgroup label="Countries">${countries.map(country=>`<option value="country:${esc(country.iso2)}">${esc(country.canonical_name)}</option>`).join('')}</optgroup><optgroup label="Rides">${routes.map(route=>`<option value="route:${esc(route.route_id)}">${esc(route.canonical_name)}</option>`).join('')}</optgroup>`;
  return `${pageHero('Resources','Use the public guide your way','Download a detailed country or ride field handbook, save a guide for offline reference, or help improve the next release.')}<section class="section resource-section"><div class="wrap"><div class="resource-grid"><article class="resource-card resource-download" aria-labelledby="data-export-title"><div class="eyebrow">Field handbook export</div><h2 id="data-export-title">Take the full planning record with you</h2><p>Each country and ride download preserves dated evidence, detailed field notes, route and place scope, mapped stops, sources, equipment signals and coverage metadata—not just the short summaries shown on the site.</p><div class="data-export-controls"><div class="field"><label for="data-export-scope">What do you need?</label><select id="data-export-scope">${exportOptions}</select></div><div class="field"><label for="data-export-format">Download format</label><select id="data-export-format"><option value="json">JSON — best for AI and developers</option><option value="xlsx">Excel workbook (.xlsx)</option></select></div><a class="btn" id="data-export-download" href="/api/public-export?scope=all&amp;format=json" download>Download JSON</a></div><p class="meta data-export-status" id="data-export-status" role="status"></p><p class="fine">Downloads contain de-identified public planning evidence. They exclude contributor identities, direct contacts and restricted locations.</p></article><article class="resource-card resource-ai" aria-labelledby="data-ai-title"><div class="eyebrow">For your own AI</div><h2 id="data-ai-title">Use the structure, not a vague summary</h2><p>JSON keeps the relationships a planning tool needs: <code>evidence_records</code> for granular claims, <code>topic_index</code> for retrieval, and <code>coverage</code> for the strength and limits of a subject.</p><ol class="resource-steps"><li>Download the country or ride you are planning.</li><li>Add the JSON to your private AI workspace or local tool.</li><li>Ask it to use the matching evidence records, retain route and place scope, and distinguish dated reports from current sources.</li><li>Use the source URLs and verification fields to check time-sensitive details before relying on them.</li></ol><p class="meta">Excel provides the same public records in filterable sheets, including evidence, equipment, services, places and coverage.</p></article></div><div class="resource-grid resource-secondary"><article class="resource-card"><div class="eyebrow">Offline planning</div><h2>Save a clean field guide</h2><p>Every country and ride page is designed to print well. Open the guide you need, then use your browser’s Print command to save a PDF before you leave signal.</p><p class="resource-links"><a class="under" href="/routes" data-link>Choose a ride →</a><a class="under" href="/countries" data-link>Choose a country →</a></p></article><article class="resource-card"><div class="eyebrow">Release details</div><h2>What is in the data</h2><p>Current release: ${esc(rel.release_id||'Cycling Americas public release')}. The complete release includes all ${bootstrap.map_point_count} exact public map points, canonical countries and supported rides.</p><p class="meta">Evidence dates, source attribution, location confidence and unresolved coverage gaps travel with the relevant handbook.</p></article></div></div></section><section class="section alt contribution-section" aria-labelledby="contribution-title"><div class="wrap contribution-layout"><div><div class="eyebrow">Improve the guide</div><h2 id="contribution-title">Have a correction, resource or useful local detail?</h2><p>Send a public source, a business name, route knowledge or a correction directly to the site owner. The site does not collect uploads or store visitor contact details; this form simply prepares an email on your device.</p><p class="fine">Please do not send private host locations or personal information without the person’s consent.</p></div><form class="contribution-form" onsubmit="return false"><div class="contribution-fields"><div class="field"><label for="contribution-kind">What are you sending?</label><select id="contribution-kind"><option>Correction or update</option><option>New business or service</option><option>Route or country field note</option><option>Public source or document</option><option>Photo or map improvement</option></select></div><div class="field"><label for="contribution-scope">Related country or ride</label><select id="contribution-scope">${contributionOptions}</select></div></div><div class="field"><label for="contribution-notes">What should we know?</label><textarea id="contribution-notes" rows="5" placeholder="Name the place, describe the update, add the public source link, or explain why it helps riders."></textarea></div><div class="contribution-upload"><div><label for="contribution-files">Attach source files</label><input id="contribution-files" type="file" multiple accept=".pdf,.xlsx,.xls,.csv,.json,.geojson,.gpx,.kml,.txt,.md,.jpg,.jpeg,.png,.webp"></div><p class="meta">Files stay on your device. After the email opens, attach them in your email app before sending.</p></div><div class="contribution-actions"><button class="btn" type="button" id="contribution-email">Prepare email</button><a class="under" href="mailto:Johntanis216@gmail.com?subject=Cycling%20Americas%20contribution">Email John directly →</a></div><p class="meta" id="contribution-status" role="status"></p></form></div></section>`;
};

// Keep credits quiet and specific: contributors belong with the project story,
// rather than competing with field-guide content elsewhere in the site.
aboutPage=()=>`${pageHero('About','Why this exists','')}<section class="section"><div class="wrap"><div class="about"><img src="https://citymarket.coop/client_media/crops/Default.c971ff59.board_member_john_tanis.jpg" alt="John Tanis"><div class="about-letter"><p>I’m John, and I built Cycling Americas after seeing practical answers in cycling groups disappear into chat history.</p><p>The goal is to make useful route details, such as ferry information, campsites, water warnings and bike shops, easier to find while planning a ride and while actually riding it.</p><p>The project is free and non-commercial, with no ads, subscriptions, paid tier or anything for sale.</p><p>I also want source material handled carefully, so ordinary rider identities, private contacts, private hosts and sensitive coordinates do not belong on the public site.</p><p>If you have a correction, privacy concern, useful field detail or feedback about the guide, write to <a class="under" href="mailto:Johntanis216@gmail.com">Johntanis216@gmail.com</a>.</p></div></div></div></section><section class="section alt contributors-section" aria-labelledby="contributors-title"><div class="wrap contributors-wrap"><h2 id="contributors-title">Contributors</h2><p class="contributor-line"><span>Strategic and technical consultant</span><a class="under" href="https://www.cockrem.com" target="_blank" rel="noreferrer">Peter Cockrem</a></p></div></section>`;

// Homepage: keep the Ask surface unmistakable, then give map filters enough
// room to be useful without sending someone to a second page first.
qaBoxWithVoice=(question='',placeholder='Try: What repair options, food stops and ferry plans should I know on the Carretera Austral?')=>`<div class="qa"><p class="ask-database-description">Searches the Cycling Americas rider FAQ database and public sources for answers.</p><textarea data-qa-input placeholder="${esc(placeholder)}">${esc(question)}</textarea><div class="qa-actions"><button class="btn" data-qa-go>ASK</button><button class="qa-voice" type="button" data-qa-voice aria-label="Speak your question" title="Speak your question" onclick="captureAskVoice(this)">Use voice</button><span class="fine" data-qa-status aria-live="polite"></span></div><div class="answer" data-qa-answer></div></div>`;
window.qaBox=qaBoxWithVoice;
landingAskPanel=()=>`<section class="landing-ask-panel" aria-labelledby="landing-ask-title"><div class="landing-ask-head"><div><div class="eyebrow">Planning help</div><h2 id="landing-ask-title">Ask the Database</h2></div><a class="landing-ask-more" href="/ask" data-link>Open Ask <span aria-hidden="true">→</span></a></div>${qaBoxWithVoice()}<p class="landing-ask-hint">Ask about a ride, place, repair, water carry, transport or border.</p></section>`;

function homeMapPanel(bootstrap){
  const countries=(bootstrap.countries||[]).map(country=>`<option value="${esc(country.iso2)}">${esc(country.canonical_name)}</option>`).join('');
  const routes=(bootstrap.routes||[]).map(route=>`<option value="${esc(route.route_id)}">${esc(route.canonical_name)}</option>`).join('');
  return `<section class="section landing-map-section" aria-labelledby="home-map-title"><div class="wrap"><div class="landing-map-section-head"><div><div class="eyebrow">Map</div><h2 id="home-map-title">Find useful stops</h2><p class="muted">Filter public map pins by country, ride, service and location confidence.</p></div><span class="map-count">${bootstrap.map_point_count} pins</span></div><section class="landing-map-panel landing-map-panel--full"><div class="home-map-controls" aria-label="Filter map pins"><div class="field"><label for="home-map-country">Country</label><select id="home-map-country"><option value="">All countries</option>${countries}</select></div><div class="field"><label for="home-map-route">Ride</label><select id="home-map-route"><option value="">All rides</option>${routes}</select></div><div class="field"><label for="home-map-type">Point type</label><select id="home-map-type"><option value="">All point types</option><option value="camping">Camping</option><option value="repair">Repair</option><option value="lodging">Lodging</option><option value="transport">Transport</option><option value="border">Border</option><option value="food">Food</option><option value="water">Water</option><option value="fuel">Fuel</option><option value="gear">Gear</option><option value="other">Other</option></select></div><div class="field"><label for="home-map-confidence">Location confidence</label><select id="home-map-confidence"><option value="">All confidence</option><option value="high-medium">High & medium</option><option value="high">High</option><option value="low">Low</option></select></div><div class="field"><label for="home-map-sort">Sort matching places</label><select id="home-map-sort"><option value="country">Country A–Z</option><option value="place">Nearest place A–Z</option><option value="type">Point type A–Z</option></select></div></div><p id="home-map-status" class="landing-map-status" role="status">Loading locations…</p><div id="home-map" class="map home-map" aria-label="Interactive map of Cycling Americas locations"></div><div id="home-map-fallback" class="mapfallback">Open the map to browse locations.</div><div class="home-map-matches"><div class="home-map-matches-head"><b>Matching places</b><span class="meta" id="home-map-list-note"></span></div><div class="home-map-list" id="home-map-list" aria-live="polite"></div></div><a class="landing-map-footer" href="/map" data-link>Open the full map <span aria-hidden="true">→</span></a></section></div></section>`;
}
function homeMapSortParts(point,sort){
  if(sort==='place')return [point.nearest_place||point.country_name||'',point.canonical_name||''];
  if(sort==='type')return [point.display_type||point.service_type||'',point.canonical_name||''];
  return [point.country_name||'',point.canonical_name||''];
}
function homeMapMatchCard(point){
  const detail=[point.country_name,point.nearest_place,point.display_type].filter(Boolean).join(' · ');
  const href=point.map_point_id?`/stops/${encodeURIComponent(point.map_point_id)}`:'/map';
  return `<a class="home-map-match" href="${href}" data-link><span class="home-map-match-type">${esc(point.display_type||'Stop')}</span><b>${esc(point.canonical_name||'Unnamed place')}</b><small>${esc(detail)}</small></a>`;
}
home=async()=>{
  const bootstrap=APP.bootstrap||await api('/api/bootstrap');APP.bootstrap=bootstrap;
  const rides=homepageFeaturedRoutes(bootstrap.routes);
  const guideOptions=`<option value="">Choose a guide</option><optgroup label="Featured rides">${rides.map(route=>`<option value="ride:${esc(route.slug)}">${esc(route.canonical_name)}</option>`).join('')}</optgroup><optgroup label="Country guides">${(bootstrap.countries||[]).map(country=>`<option value="country:${esc(country.slug)}">${esc(country.canonical_name)}</option>`).join('')}</optgroup>`;
  return `<section class="landing-hero">${landingMountainScene()}<div class="wrap"><div class="landing-copy landing-copy--wide">${landingAskPanel()}<p class="landing-note">Free, non-commercial and made for real trips.</p></div></div></section>${homeMapPanel(bootstrap)}<section class="section featured-rides" aria-labelledby="featured-rides-title"><div class="wrap"><div class="head featured-head"><div><div class="eyebrow">Rides</div><h2 id="featured-rides-title">Featured guides</h2><p class="muted">Our most detailed ride guides, with photos and practical notes.</p></div><a class="under" href="/routes" data-link>Browse rides →</a></div><div class="feature-routes-grid" id="home-routes">${rides.map(routeCard).join('')}</div></div></section><section class="section alt home-next-step"><div class="wrap home-next-step-inner"><div><div class="eyebrow">Guide picker</div><h2>Open a guide</h2><p class="muted">Choose a featured ride or country.</p></div><div class="home-guide-picker"><div class="field"><label for="home-guide-select">Guide</label><select id="home-guide-select">${guideOptions}</select></div><button class="btn" id="home-guide-open" type="button">Open guide</button><a class="home-next-country" href="/map" data-link>Map →</a></div></div></section>`;
};
initHome=()=>{
  initHomeMap();
  const guide=$('#home-guide-select'),open=$('#home-guide-open');
  if(!guide||!open)return;
  const openGuide=()=>{
    const [type,slugValue]=String(guide.value||'').split(':');
    if(!slugValue){guide.focus();return;}
    navigate(type==='ride'?'/routes/'+encodeURIComponent(slugValue):'/countries/'+encodeURIComponent(slugValue));
  };
  open.onclick=openGuide;
  guide.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();openGuide();}};
};
initHomeMap=async()=>{
  const el=$('#home-map'),status=$('#home-map-status'),fallback=$('#home-map-fallback'),country=$('#home-map-country'),route=$('#home-map-route'),type=$('#home-map-type'),confidence=$('#home-map-confidence'),sort=$('#home-map-sort'),list=$('#home-map-list'),note=$('#home-map-list-note');
  if(!el||!status||!country||!route||!type||!confidence||!sort||!list)return;
  const bootstrap=APP.bootstrap||await api('/api/bootstrap');APP.bootstrap=bootstrap;
  const setRoutes=()=>{
    const prior=route.value;
    const allowed=(bootstrap.routes||[]).filter(item=>!country.value||(item.country_codes||[]).includes(country.value));
    route.innerHTML=`<option value="">All rides</option>${allowed.map(item=>`<option value="${esc(item.route_id)}">${esc(item.canonical_name)}</option>`).join('')}`;
    if(allowed.some(item=>item.route_id===prior))route.value=prior;
  };
  if(APP.homeMap){try{APP.homeMap.remove();}catch{}APP.homeMap=null;}
  let layer=null;
  if(window.L){
    APP.homeMap=L.map(el,{scrollWheelZoom:false}).setView([-18,-67],3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors',maxZoom:18}).addTo(APP.homeMap);
    layer=L.layerGroup().addTo(APP.homeMap);
  }else{el.style.display='none';fallback.style.display='block';}
  let renderVersion=0;
  const query=()=>{
    const params=new URLSearchParams();
    if(country.value)params.set('country',country.value);
    if(route.value)params.set('route',route.value);
    if(type.value)params.set('type',type.value);
    if(confidence.value)params.set('confidence',confidence.value);
    const text=params.toString();return text?`?${text}`:'';
  };
  const renderMap=async()=>{
    const version=++renderVersion;
    status.textContent='Loading matching map pins…';
    try{
      const data=await api('/api/map'+query());
      if(version!==renderVersion||!document.body.contains(el))return;
      const points=(data.points||[]).filter(hasMapCoordinates).sort((a,b)=>homeMapSortParts(a,sort.value).join('|').localeCompare(homeMapSortParts(b,sort.value).join('|')));
      status.textContent=points.length?`${points.length} map pin${points.length===1?'':'s'} shown.`:'No map pins match these filters.';
      if(note)note.textContent=points.length?`${Math.min(points.length,6)} of ${points.length} listed below, sorted by ${sort.options[sort.selectedIndex].text.toLowerCase()}.`:'';
      list.innerHTML=points.length?points.slice(0,6).map(homeMapMatchCard).join(''):'<div class="empty">No matching places.</div>';
      if(!layer)return;
      layer.clearLayers();
      const bounds=[];
      points.forEach(point=>{
        const latitude=Number(point.latitude),longitude=Number(point.longitude),source=isSafePublicUrl(point.source_url);
        bounds.push([latitude,longitude]);
        const popup=`<b>${esc(point.canonical_name)}</b><div>${esc([point.country_name,point.nearest_place,point.display_type].filter(Boolean).join(' · '))}</div><div>${esc(pinConfidenceLabel(point))}</div>${point.summary?`<p>${esc(point.summary)}</p>`:''}${source?`<a href="${esc(source)}" target="_blank" rel="noreferrer">Public source ↗</a>`:''}`;
        L.circleMarker([latitude,longitude],{radius:6,weight:2,...markerStyle(point)}).bindPopup(popup).addTo(layer);
      });
      if(bounds.length)APP.homeMap.fitBounds(bounds,{padding:[24,24],maxZoom:6});
    }catch(error){
      if(version!==renderVersion)return;
      status.textContent='The homepage map is temporarily unavailable.';
      fallback.style.display='block';fallback.textContent=error.message;
    }
  };
  country.onchange=()=>{setRoutes();renderMap();};
  [route,type,confidence,sort].forEach(control=>{control.onchange=renderMap;});
  setRoutes();renderMap();
};

// Final homepage polish: keep the scene playful without putting a person in
// the illustration, and keep map filtering focused on the actual map.
const landingMountainSceneV3=()=>`<svg class="landing-mountain-scene" viewBox="0 0 1600 560" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
  <path class="mountain-haze" d="M0 421 112 315 231 388 389 193 542 395 702 258 876 397 1046 168 1221 382 1383 263 1600 413V560H0Z"/>
  <path class="mountain-snowline" d="M0 421 112 315 231 388 389 193 542 395 702 258 876 397 1046 168 1221 382 1383 263 1600 413"/>
  <path class="mountain-mid" d="M0 480 145 340 291 453 470 295 623 467 789 334 943 469 1126 264 1291 462 1453 322 1600 438V560H0Z"/>
  <path class="mountain-near" d="M0 532 133 428 257 502 418 384 582 526 756 413 926 513 1095 370 1249 499 1401 407 1600 509V560H0Z"/>
</svg>`;
landingAskPanel=()=>`<section class="landing-ask-panel" aria-labelledby="landing-ask-title"><div class="landing-ask-head"><div><h2 id="landing-ask-title">Ask the Database</h2></div><a class="landing-ask-more" href="/ask" data-link>Open Ask <span aria-hidden="true">→</span></a></div>${qaBoxWithVoice()}</section>`;
function homeMapPanel(bootstrap){
  const countries=(bootstrap.countries||[]).map(country=>`<option value="${esc(country.iso2)}">${esc(country.canonical_name)}</option>`).join('');
  const routes=(bootstrap.routes||[]).map(route=>`<option value="${esc(route.route_id)}">${esc(route.canonical_name)}</option>`).join('');
  return `<section class="section landing-map-section" aria-labelledby="home-map-title"><div class="wrap"><div class="landing-map-section-head"><div><div class="eyebrow">Map</div><h2 id="home-map-title">Find useful stops</h2><p class="muted">Filter public map pins by country, ride, service and location confidence.</p></div><span class="map-count">${bootstrap.map_point_count} pins</span></div><section class="landing-map-panel landing-map-panel--full"><div class="home-map-controls" aria-label="Filter map pins"><div class="field"><label for="home-map-country">Country</label><select id="home-map-country"><option value="">All countries</option>${countries}</select></div><div class="field"><label for="home-map-route">Ride</label><select id="home-map-route"><option value="">All rides</option>${routes}</select></div><div class="field"><label for="home-map-type">Point type</label><select id="home-map-type"><option value="">All point types</option><option value="camping">Camping</option><option value="repair">Repair</option><option value="lodging">Lodging</option><option value="transport">Transport</option><option value="border">Border</option><option value="food">Food</option><option value="water">Water</option><option value="fuel">Fuel</option><option value="gear">Gear</option><option value="other">Other</option></select></div><div class="field"><label for="home-map-confidence">Location confidence</label><select id="home-map-confidence"><option value="">All confidence</option><option value="high-medium">High & medium</option><option value="high">High</option><option value="low">Low</option></select></div></div><p id="home-map-status" class="landing-map-status" role="status">Loading locations…</p><div id="home-map" class="map home-map" aria-label="Interactive map of Cycling Americas locations"></div><div id="home-map-fallback" class="mapfallback">Open the map to browse locations.</div><a class="landing-map-footer" href="/map" data-link>Open the full map <span aria-hidden="true">→</span></a></section></div></section>`;
}
home=async()=>{
  const bootstrap=APP.bootstrap||await api('/api/bootstrap');APP.bootstrap=bootstrap;
  const rides=homepageFeaturedRoutes(bootstrap.routes);
  const guideOptions=`<option value="">Choose a guide</option><optgroup label="Featured rides">${rides.map(route=>`<option value="ride:${esc(route.slug)}">${esc(route.canonical_name)}</option>`).join('')}</optgroup><optgroup label="Country guides">${(bootstrap.countries||[]).map(country=>`<option value="country:${esc(country.slug)}">${esc(country.canonical_name)}</option>`).join('')}</optgroup>`;
  return `<section class="landing-hero">${landingMountainSceneV3()}<div class="wrap"><div class="landing-copy landing-copy--wide">${landingAskPanel()}</div></div></section>${homeMapPanel(bootstrap)}<section class="section featured-rides" aria-labelledby="featured-rides-title"><div class="wrap"><div class="head featured-head"><div><div class="eyebrow">Rides</div><h2 id="featured-rides-title">Featured guides</h2><p class="muted">Our most detailed ride guides, with photos and practical notes.</p></div><a class="under" href="/routes" data-link>Browse rides →</a></div><div class="feature-routes-grid" id="home-routes">${rides.map(routeCard).join('')}</div></div></section><section class="section alt home-next-step"><div class="wrap home-next-step-inner"><div><div class="eyebrow">Guide picker</div><h2>Open a guide</h2><p class="muted">Choose a featured ride or country.</p></div><div class="home-guide-picker"><div class="field"><label for="home-guide-select">Guide</label><select id="home-guide-select">${guideOptions}</select></div><button class="btn" id="home-guide-open" type="button">Open guide</button><a class="home-next-country" href="/map" data-link>Map →</a></div></div></section>`;
};
initHomeMap=async()=>{
  const el=$('#home-map'),status=$('#home-map-status'),fallback=$('#home-map-fallback'),country=$('#home-map-country'),route=$('#home-map-route'),type=$('#home-map-type'),confidence=$('#home-map-confidence');
  if(!el||!status||!country||!route||!type||!confidence)return;
  const bootstrap=APP.bootstrap||await api('/api/bootstrap');APP.bootstrap=bootstrap;
  const setRoutes=()=>{
    const prior=route.value;
    const allowed=(bootstrap.routes||[]).filter(item=>!country.value||(item.country_codes||[]).includes(country.value));
    route.innerHTML=`<option value="">All rides</option>${allowed.map(item=>`<option value="${esc(item.route_id)}">${esc(item.canonical_name)}</option>`).join('')}`;
    if(allowed.some(item=>item.route_id===prior))route.value=prior;
  };
  if(APP.homeMap){try{APP.homeMap.remove();}catch{}APP.homeMap=null;}
  let layer=null;
  if(window.L){
    APP.homeMap=L.map(el,{scrollWheelZoom:false,zoomSnap:.25}).setView([-22,-70],4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors',maxZoom:18}).addTo(APP.homeMap);
    layer=L.layerGroup().addTo(APP.homeMap);
  }else{el.style.display='none';fallback.style.display='block';}
  let renderVersion=0;
  const query=()=>{
    const params=new URLSearchParams();
    if(country.value)params.set('country',country.value);
    if(route.value)params.set('route',route.value);
    if(type.value)params.set('type',type.value);
    if(confidence.value)params.set('confidence',confidence.value);
    const text=params.toString();return text?`?${text}`:'';
  };
  const renderMap=async()=>{
    const version=++renderVersion;
    status.textContent='Loading matching map pins…';
    try{
      const data=await api('/api/map'+query());
      if(version!==renderVersion||!document.body.contains(el))return;
      const points=(data.points||[]).filter(hasMapCoordinates);
      status.textContent=points.length?`${points.length} map pin${points.length===1?'':'s'} shown.`:'No map pins match these filters.';
      if(!layer)return;
      layer.clearLayers();
      const bounds=[];
      points.forEach(point=>{
        const latitude=Number(point.latitude),longitude=Number(point.longitude),source=isSafePublicUrl(point.source_url);
        bounds.push([latitude,longitude]);
        const popup=`<b>${esc(point.canonical_name)}</b><div>${esc([point.country_name,point.nearest_place,point.display_type].filter(Boolean).join(' · '))}</div><div>${esc(pinConfidenceLabel(point))}</div>${point.summary?`<p>${esc(point.summary)}</p>`:''}${source?`<a href="${esc(source)}" target="_blank" rel="noreferrer">Public source ↗</a>`:''}`;
        L.circleMarker([latitude,longitude],{radius:6,weight:2,...markerStyle(point)}).bindPopup(popup).addTo(layer);
      });
      const filtered=Boolean(country.value||route.value||type.value||confidence.value);
      if(filtered&&bounds.length)APP.homeMap.fitBounds(bounds,{padding:[24,24],maxZoom:6});
      else APP.homeMap.setView([-22,-70],4);
    }catch(error){
      if(version!==renderVersion)return;
      status.textContent='The homepage map is temporarily unavailable.';
      fallback.style.display='block';fallback.textContent=error.message;
    }
  };
  country.onchange=()=>{setRoutes();renderMap();};
  [route,type,confidence].forEach(control=>{control.onchange=renderMap;});
  setRoutes();renderMap();
};

render();
