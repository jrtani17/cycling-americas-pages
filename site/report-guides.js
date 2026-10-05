/* Report-style Field Guide editorial layer.
 * This file deliberately separates authored reader-facing prose from the
 * supporting database record. Dated source observations remain accessible in
 * the evidence appendix; they do not determine paragraph order.
 */
(function(){
  const report=window.CA_REPORT;
  if(report){
    report.parts=[
      {id:'before-you-go',number:'I',title:'Before You Go',
       intro:'The useful preparation is not expedition packing. It is deciding where you can reset, solving bike-specific weaknesses before they become southern-Patagonia problems, and leaving enough time for ferries and weather to move the plan.',
       sections:[
        {id:'route-character',number:'1',title:'What this trip is actually like',paragraphs:[
          'The most useful correction to the mental picture of the Carretera Austral is that remote does not mean unsupported. Riders repeatedly encounter small towns, groceries, water, camping or simple lodging, ferries and improvised local help. The friction appears at the interfaces: weather, changing road surfaces, thin parts inventories, inconsistent bus decisions, opening hours and the final crossing toward Argentina.',
          'Plan around capable service nodes instead of treating the road as one continuous wilderness crossing. Puerto Montt and Puerto Varas are the northern workshop and supply base. Coyhaique is the most important mid-route reset. Cochrane is where southbound riders should deliberately reassess cash, food and mechanical condition. Villa O’Higgins is a threshold: if you continue toward El Chaltén, ordinary road touring turns into a ferry, border and loaded-bike trail problem.',
          'The road is also changing. Historical rider descriptions of pavement and ripio are useful for understanding character, but active paving means old kilometre counts should not be treated as permanent. The durable picture is sustained loaded riding through a mix of pavement, gravel, washboard, construction, mountain weather and occasional traffic stress.'
        ],callout:{title:'Planning consequence',text:'Ask “where is the next place that can solve this particular problem?” rather than “how many days of wilderness am I entering?”'}},
        {id:'direction',number:'2',title:'Choosing a direction',paragraphs:[
          'Do not let a simplified prevailing-wind rule choose the whole trip. Riders who had also crossed the open Argentine steppe repeatedly described the Carretera as more sheltered and variable. Northbound headwinds happen, but the archive does not support treating northbound as a planning mistake.',
          'Choose direction around the rest of your itinerary: where you enter Patagonia, where you want to finish, the season, border plans and onward transport. Then use the actual forecast. A bad wind day is a reason to start early, shorten the day or wait; it is not evidence that the entire route was chosen backwards.'
        ]},
        {id:'time',number:'3',title:'How much time to allow',paragraphs:[
          'The full Puerto Montt to Villa O’Higgins corridor is roughly 1,247 kilometres. A common loaded-touring range of about 30–60 kilometres per riding day produces a very broad three-to-six-week riding envelope before rest days, ferry waits, hikes, mechanical problems or bad weather are added.',
          'The important variable is slack rather than average speed. Hornopirén can involve ferry-connection delays, construction can slow familiar sections, and the Villa O’Higgins system can move or stop with weather. A trip plan that requires every ferry to operate on the first expected day is fragile even if the cycling pace itself is realistic.'
        ]},
        {id:'bike-spares',number:'4',title:'Bike setup and critical spares',paragraphs:[
          'The rider archive makes a stronger case for carrying small bicycle-specific parts than for hauling bulky generic replacements. Coyhaique has real mechanical capacity, but riders still reported limited variety, and farther south the problem is often not whether someone can work on a bicycle—it is whether the exact component exists locally.',
          'Carry the frame-specific derailleur hanger, brake pads for your exact caliper, correct spokes and nipples for unusual wheel builds, quick links and a chain tool, tubes even if you run tubeless, tire plugs and boot material, rack hardware and any proprietary brake or hub piece that could immobilize the bike. If a known problem already exists, fix it before the route rather than asking a small town to diagnose it.',
          'You do not need a mountain bike just because the route contains ripio. You do need tires, wheels, gearing and luggage attachment that you trust for loaded gravel, washboard and vibration. Repairability matters as much as nominal bike category.'
        ],bullets:['Inspect brake-pad life and chain wear before departure.','Carry at least one tube even with tubeless tires.','Bring the proprietary pieces a competent local mechanic cannot fabricate.','Treat a recurring rack, wheel or brake problem as something to solve at the next major service node, not later.']},
        {id:'weather-offline',number:'5',title:'Weather, flexibility and offline preparation',paragraphs:[
          'December through March is commonly recommended for longer daylight and more favorable conditions, but the operational issue is shorter term: tomorrow’s weather can change tomorrow’s transport. A 2024 rider reported a Lago O’Higgins sailing moving a day earlier because high waves were forecast, and an official delegation was stranded at Candelario for three days in May 2026 after severe weather closed the port.',
          'Build flexibility into the itinerary, not just the clothing system. Do not schedule a hard flight immediately after the Villa O’Higgins crossing. Keep an emergency meal when entering ferry-dependent sections. Download maps, reservations, operator details and border documents before signal becomes patchy.'
        ]}
       ]},
      {id:'daily-logistics',number:'II',title:'Daily Logistics',
       intro:'Food and water were generally easier than anxious pre-trip planning suggested. Cash, parts, opening hours, traffic pinch points and weather-dependent transport caused more practical trouble.',
       sections:[
        {id:'food',number:'6',title:'Food and resupply',paragraphs:[
          'When riders asked whether the Carretera required three or four days of food because the map looked empty, experienced cyclists generally answered that two to three days of carrying capacity had been enough, even at a fairly slow pace. Villa Santa Lucía, La Junta and Puyuhuapi repeatedly appear as useful resupply points.',
          'Treat “two to three days” as capacity, not a command to leave every town carrying three full days of meals. A practical system is enough staples for roughly two breakfasts, two dinners, a full riding day of food and one “everything is closed” meal, then normal replenishment. Increase the buffer before a ferry-dependent stretch, a weekend or holiday, or when your diet depends on specialized foods.',
          'Opening hours matter more than the existence of a map pin. A December 2024 rider in Tortel found sharply limited restaurant and grocery availability over a Friday/Saturday period. The durable lesson is that a town can have food in theory while still leaving a cyclist hungry tonight.'
        ]},
        {id:'water',number:'7',title:'Water',paragraphs:[
          'Riders generally described water access as frequent. In a dedicated 2024 discussion, normal carries clustered around roughly 1.5–3 litres, with riders increasing capacity only when a particular source gap or dry camp warranted it.',
          'A normal working capacity of about two to three litres therefore fits the rider evidence better than expedition-size loads, while the ability to flex toward roughly four litres creates useful margin for a dry camp, hot day, long climb or uncertain source. Keep source availability separate from water safety: frequent streams do not eliminate the need for treatment.'
        ]},
        {id:'stove-fuel',number:'8',title:'Stove fuel and supplies',paragraphs:[
          'Fuel availability depends heavily on the stove system. Riders described screw-thread gas cartridges as the useful touring format in Chile, while long thin bayonet cartridges are also common for portable grills. Less common proprietary or pierceable systems are much harder to depend on. Solve compatibility before the trip.',
          'For multifuel stoves, bencina blanca or gasolina blanca is the useful term for white gas. Puyuhuapi is particularly well documented: rider reports and independent regional service information both support it as a place where camping gas or white gas has been found. Treat that as a useful likelihood, not permanent inventory.',
          'In small towns, a ferretería can be more useful than an outdoor store. Hardware shops may carry fuel, bolts, clamps, tools and improvised repair materials even when there is no specialist camping retailer.'
        ]},
        {id:'sleep',number:'9',title:'Camping, refuges and lodging',paragraphs:[
          'The route has enough formal and informal overnight options that reserving every night usually removes more flexibility than it creates. Riders used campgrounds, simple hostels, cabañas, cyclist refuges and occasional improvised options depending on the section.',
          'Covered kitchens and common rooms matter disproportionately in Patagonia because they let wet riders and gear recover. When evaluating a campsite, shelter can be as valuable as the tent pitch itself. Villa O’Higgins is different: high-season lodging can tighten precisely when ferry weather turns the town into a waiting room.',
          'Older rider-shared private hosts and personal contacts are intentionally not reproduced in the public guide. Confirm any historic cyclist-refuge report before depending on it.'
        ]},
        {id:'money',number:'10',title:'Cash, cards and connectivity',paragraphs:[
          'The route is connected enough that cards and a phone are useful, but not connected enough to make one phone and one bank card your entire contingency plan. Riders often found card acceptance at food shops while campsites, informal transport and smaller services were more likely to need cash. Card terminals and signal can fail together.',
          'Coyhaique is the obvious cash reset. Cochrane was repeatedly described as the last useful ATM southbound. Historical fee reports are not current pricing, but the planning point remains: leave Cochrane with cash. Villa O’Higgins has been officially described as having no ATM and limited card acceptance.',
          'Before leaving reliable signal, save the next ferry booking, border documents, operator details and offline maps. Keep some emergency cash separate from your wallet and use a second payment method for the Argentina crossing.'
        ]},
        {id:'repairs',number:'11',title:'Bike repair and parts',paragraphs:[
          'Mechanical support follows a gradient. Puerto Montt and Puerto Varas are the strongest northern reset. Coyhaique is the route’s most important workshop town. Smaller places may have mechanical skill, welding or improvised help, but much thinner inventories.',
          'Rueda al Sur in Puerto Varas and Patagonia Cycles in Coyhaique were current public businesses when the handbook was checked in August 2026. Riders also described other mechanics in larger towns, but an old positive mention is not treated as a timeless recommendation. Call ahead when you need a specific modern part.',
          'Cochrane illustrates the southern problem: riders found local repair help, yet other reports show that a mechanic can be available without the exact chain or component required. Carry or replace the small proprietary parts that cannot be improvised.'
        ]},
        {id:'roads-bailout',number:'12',title:'Road surface, traffic and bailout options',paragraphs:[
          'Ripio is not one surface. The road can move from hardpack to washboard, loose aggregate, construction and pavement within the same corridor. Historical surface reports become stale quickly because paving continues, so use them to understand route character rather than to count current gravel kilometres.',
          'Traffic stress is localized. Riders repeatedly singled out the substantial climb south of Puyuhuapi; a loaded tandem team used a pickup after finding the traffic uncomfortable. That does not make the entire Carretera high-traffic, but it does mean the next thirty kilometres can matter more than the route’s overall reputation.',
          'Bus carriage of bicycles often depends on the actual luggage bay and the driver more than a clean written policy. A pickup truck is also a real field tool. If the bicycle cannot roll safely, aim for the nearest capable service node rather than preserving every planned riding kilometre.'
        ]}
       ]},
      {id:'ferries',number:'III',title:'Ferries, Borders and Special Logistics',
       intro:'There is no single “Carretera ferry.” Each crossing has its own booking, capacity, payment and weather reality. Name the crossing and plan it as a separate transport system.',
       sections:[
        {id:'ferry-system',number:'13',title:'How to think about the ferries',paragraphs:[
          'Caleta La Arena, Hornopirén, Puerto Yungay, Lago O’Higgins and Lago del Desierto should be treated as separate systems. Some are routine vehicle ferries; some are bookable and capacity-limited; some are weather-sensitive passenger operations where a missed sailing changes the whole day.',
          'Confirm whether booking is required, save the operator’s current public contact, ask specifically about bicycle space when it is unclear, carry food for a missed southern sailing and recheck the day before when weather is moving. Keep rain and warm layers accessible during boarding and waiting.'
        ]},
        {id:'hornopiren',number:'14',title:'Hornopirén to Caleta Gonzalo',paragraphs:[
          'Hornopirén is primarily a ferry-planning town. The Somarco/Barcazas connection is structured and bookable, but bicycle capacity and the intermediate connection still deserve confirmation. Historical rider reports describe the second ferry waiting for cyclists on the connecting road, while the operator has warned that intermediate delays can occur.',
          'Do not arrive assuming that a bicycle can always be added at the last minute. Confirm the ticket and sailing, keep weather layers handy and allow the ferry sequence—not an ambitious mileage target—to control the day.'
        ]},
        {id:'yungay',number:'15',title:'Puerto Yungay to Río Bravo',paragraphs:[
          'The Puerto Yungay crossing is much more routine than the Villa O’Higgins system. Current municipal information has described it as a free, first-come vehicle ferry with multiple departures. The exact same-day timetable is still worth checking locally because old rider notes and online schedules have disagreed.',
          'Waiting conditions can be wet and exposed. Keep rain layers available rather than buried because the crossing looks short on the map.'
        ]},
        {id:'ohiggins-chalten',number:'16',title:'Villa O’Higgins to El Chaltén',paragraphs:[
          'The southern crossing is a multi-step system: leave Villa O’Higgins for the Lago O’Higgins port, cross to Candelario Mancilla, complete Chilean exit formalities, continue by road and trail toward Lago del Desierto, complete Argentine entry formalities, cross the lake by boat unless you deliberately choose the much harder shore route, and then continue toward El Chaltén.',
          'Every transition adds a failure mode: weather, boat timing, paperwork, loaded-bike handling, waiting and payment. Riders described contacting the Lago O’Higgins operator ahead of time and booking when cyclist demand was high. The durable rule is to reconfirm and not build a hard onward connection immediately after the crossing.',
          'Arrive with cash. Villa O’Higgins has been officially described as having no ATM and limited card acceptance, and the route becomes dependent on local boats and transport from this point.'
        ],callout:{title:'Schedule slack is infrastructure',text:'Sailings have moved with weather and the port has closed for multiple days. Extra time is not optional if a hard deadline follows this crossing.'}},
        {id:'candelario',number:'17',title:'Candelario Mancilla and the hike-a-bike',paragraphs:[
          'Candelario is not merely a border desk. It can become a place to wait, sleep, eat what you carried, dry gear and reorganize. Northbound riders can reach it and then wait days for Lago O’Higgins transport, which makes food planning more important in that direction.',
          'The famous six kilometres of hike-a-bike hides the real problem. Riders described swamp, rivers, large steps, steep or narrow trail, unloading and reloading luggage, awkward log crossings and repeated carrying. One late-November 2024 rider reported roughly two and a half hours going Chile to Argentina; another experienced rider said the reverse direction could take roughly twice as long when alone.',
          'A traditional four-pannier setup will probably come apart at obstacles. Two cyclists can relay bikes and bags, which materially changes the difficulty. Do not compare this segment to an ordinary six-kilometre gravel climb.'
        ]},
        {id:'lago-desierto',number:'18',title:'Lago del Desierto and border paperwork',paragraphs:[
          'For a loaded touring bicycle, the normal strategy is to use the Lago del Desierto boat. Riders who encountered people taking the shore path described it as substantially harder than the Candelario hike-a-bike and suitable only for riders who intentionally want that challenge with a light setup.',
          'Payment deserves redundancy. Riders reported card-terminal and advance-payment failures in 2024. Those reports do not establish current prices or payment policy, but they do establish the value of a second way to pay at a remote lake.',
          'The Candelario / Paso Dos Lagunas exit is not the same process as an ordinary highway border. Cyclists repeatedly discussed a Chilean salvoconducto. Apply while you still have reliable internet, save the issued document offline and allow for the possibility that a weather-changed departure date forces you to revisit the paperwork.'
        ]}
       ]},
      {id:'places',number:'IV',title:'North-to-South Field Guide',
       intro:'This is intentionally uneven. A town gets the categories for which the rider archive or current verification contains something useful; it is not padded with generic tourism copy.',
       sections:[
        {id:'puerto-montt-varas',number:'19',title:'Puerto Montt / Puerto Varas',paragraphs:['Use this area for final serious bike work, unusual spares, full groceries, packing or box logistics and anything you have been “watching” on the bicycle. If brake pads are half gone, a wheel is questionable or a rack bolt has already loosened twice, solve it here rather than testing it farther south.']},
        {id:'puyuhuapi',number:'20',title:'Puyuhuapi',paragraphs:['Puyuhuapi is unusually valuable because food, stove fuel and a known road concern converge here. Rider and independent regional information both support it as useful resupply and a place where camping gas or white gas has been found. South of town, riders repeatedly mention the substantial climb and at least one loaded tandem team used a pickup because traffic felt uncomfortable.']},
        {id:'coyhaique',number:'21',title:'Coyhaique',paragraphs:['This is the route’s major reset town. Inspect tires and wheels, check spoke tension, replace marginal brake pads or a worn chain, solve rack problems, withdraw cash and buy specialty food before continuing south. Modern-bike repair is available, but inventory can still change, so verify a specific part before depending on it.']},
        {id:'cochrane',number:'22',title:'Cochrane',paragraphs:['Cochrane is the last deliberate southbound reset before services thin sharply. Riders reported an ATM and local mechanical help, but also demonstrated the inventory problem: a mechanic can be available without the component you need. Leave with cash, food buffer and no known mechanical problem you are postponing.']},
        {id:'tortel',number:'23',title:'Caleta Tortel',paragraphs:['Tortel is distinctive and worthwhile for many riders, but do not arrive with an empty food bag late in the week. One 2024 rider found sharply limited restaurant and grocery availability. TABSA’s long-route ferry network can make the town relevant to transport planning, but only the current schedule can tell you whether it helps on your date.']},
        {id:'villa-ohiggins',number:'24',title:'Villa O’Higgins',paragraphs:['If this is the finish, work backward from transport north. If you continue to Argentina, switch mental models: you are preparing a ferry–border–trail system. Arrive with cash because there is no ATM and card acceptance can be limited. High-season lodging can tighten while riders wait on weather.']},
        {id:'el-chalten',number:'25',title:'El Chaltén',paragraphs:['Do not confuse a major trekking destination with a major touring-bike service centre. A 2024 rider looking to order tires was told there was no bike shop. Verify current dedicated repair capacity before depending on the town for an uncommon tire, wheel or drivetrain problem.']}
       ]}
    ];
  }

  const reports=window.CYCLING_GUIDE_REPORTS||{routes:{},countries:{}};
  const h=(v)=>esc(String(v||''));
  const paragraphs=a=>(a||[]).map(p=>`<p>${h(p)}</p>`).join('');
  const bullets=a=>a?.length?`<ul class="report-bullets">${a.map(x=>`<li>${h(x)}</li>`).join('')}</ul>`:'';
  const callout=c=>c?`<aside class="report-callout"><strong>${h(c.title)}</strong><p>${h(c.text)}</p></aside>`:'';
  const section=s=>`<section class="report-section" id="${h(s.id)}"><div class="report-section-number">${h(s.number)}</div><div class="report-section-copy"><h3>${h(s.title)}</h3>${paragraphs(s.paragraphs)}${bullets(s.bullets)}${callout(s.callout)}</div></section>`;
  const part=p=>`<section class="report-part" id="${h(p.id)}"><header class="report-part-head"><span>Part ${h(p.number)}</span><h2>${h(p.title)}</h2>${p.intro?`<p>${h(p.intro)}</p>`:''}</header>${(p.sections||[]).map(section).join('')}</section>`;
  const authoredRoute=r=>reports.routes?.[r.slug]||reports.routes?.[norm(r.canonical_name).replace(/ /g,'-')]||null;
  const authoredCountry=c=>reports.countries?.[String(c.iso2||'').toUpperCase()]||null;

  function toc(report,extra=[]){
    const parts=(report.parts||[]).map(p=>`<li><a href="#${h(p.id)}" data-guide-jump><span>${h(p.number)}</span>${h(p.title)}</a><ol>${(p.sections||[]).map(s=>`<li><a href="#${h(s.id)}" data-guide-jump>${h(s.number)}. ${h(s.title)}</a></li>`).join('')}</ol></li>`).join('');
    return `<nav class="report-toc" aria-label="Field guide contents"><div class="report-toc-label">Contents</div><ol>${parts}${extra.map(([id,label])=>`<li class="report-toc-extra"><a href="#${h(id)}" data-guide-jump>${h(label)}</a></li>`).join('')}</ol></nav>`;
  }
  function mobileToc(report,extra=[]){
    return `<details class="report-mobile-toc"><summary>Jump to a section</summary><div>${(report.parts||[]).map(p=>`<a href="#${h(p.id)}" data-guide-jump>${h(p.number)}. ${h(p.title)}</a>`).join('')}${extra.map(([id,label])=>`<a href="#${h(id)}" data-guide-jump>${h(label)}</a>`).join('')}</div></details>`;
  }
  function header(report){
    return `<section class="report-standfirst">${paragraphs(report.standfirst)}</section>${report.keyJudgments?.length?`<section class="report-key"><div class="eyebrow">Key judgments</div><h2>What to know before you start</h2><ul>${report.keyJudgments.map(x=>`<li>${h(x)}</li>`).join('')}</ul></section>`:''}`;
  }
  function actions(kind,e){
    const map=kind==='route'?`/map?route=${encodeURIComponent(e.route_id)}`:`/map?country=${encodeURIComponent(e.iso2)}`;
    const q=kind==='route'?`What should I know before cycling the ${e.canonical_name}?`:`What should I know about cycling in ${e.canonical_name}?`;
    return `<div class="report-actions"><a class="btn" href="${map}" data-link>Open scoped map</a><button class="btn ghost" onclick="window.print()">Print / save PDF</button>${askLink(q,'Ask about this guide')}</div>`;
  }
  function evidence(payload){
    const records=[...(payload.units||[]).map(v=>({title:guideDisplayLabel(v.title)||'Field note',text:v.detailed_answer||v.concise_answer||'',meta:[v.latest_verification_at,v.evidence_strength].filter(Boolean).join(' · ')})),...(payload.facts||[]).map(v=>({title:handbookFactTitle(v),text:v.value_text||'',meta:[v.observation_date||v.last_checked_date||v.source_publication_date,v.evidence_strength].filter(Boolean).join(' · ')}))];
    if(!records.length)return '';
    return `<details class="report-evidence"><summary>Supporting dated evidence (${records.length} records)</summary><p class="report-evidence-intro">These records support the guide but are not the guide itself. They stay here for traceability instead of appearing as a stack of notes in the narrative.</p><div class="report-evidence-list">${records.map(r=>`<article><h4>${h(r.title)}</h4>${typeof readingParagraphs==='function'?readingParagraphs(typeof readingText==='function'?readingText(r.text,r.title):r.text):paragraphs([r.text])}<p class="meta">${h(r.meta)}</p></article>`).join('')}</div></details>`;
  }
  function sources(entity,payload){
    const links=(entity.sources||[]).filter(s=>isSafePublicUrl(s.url));
    return `<section class="report-appendix" id="sources"><div class="report-part-head"><span>Evidence</span><h2>Sources, dates and traceability</h2><p>Time-sensitive services, ferry schedules, borders, prices and road works should be reconfirmed close to use.</p></div>${links.length?`<ol class="report-source-list">${links.map(s=>`<li><a href="${h(s.url)}" target="_blank" rel="noreferrer">${h(s.name||'Public source')} ↗</a>${s.checked?`<span>Checked ${h(s.checked)}</span>`:''}</li>`).join('')}</ol>`:''}${evidence(payload)}</section>`;
  }
  function mapped(points,mapHref){
    if(!points?.length)return '';
    const show=points.slice(0,12);
    return `<section class="report-appendix" id="mapped-stops"><div class="report-part-head"><span>Field tools</span><h2>Mapped services and stops</h2><p>Use the scoped map for the complete current set and location confidence.</p></div><div class="grid two report-stop-grid">${show.map(mapCard).join('')}</div>${points.length>show.length?`<p><a class="under" href="${mapHref}" data-link>See all ${points.length} mapped stops →</a></p>`:''}</section>`;
  }
  function segments(items){
    const ordered=[...(items||[])].sort((a,b)=>(a.sequence_no??999)-(b.sequence_no??999));
    return ordered.length?`<section class="report-appendix" id="route-sequence"><div class="report-part-head"><span>Route sequence</span><h2>Ordered segments</h2><p>Use the sequence below to connect the narrative guide to the actual route.</p></div><ol class="report-segment-list">${ordered.map(s=>`<li>${segmentCard(s)}</li>`).join('')}</ol></section>`:'';
  }
  function faq(questions){
    return questions?.length?`<section class="report-appendix" id="questions"><div class="report-part-head"><span>FAQ</span><h2>Questions this guide can answer</h2></div><div class="question-chips">${uniqueGuideItems(questions,q=>q.question).map(q=>askLink(q.question,q.question)).join('')}</div></section>`:'';
  }
  function rides(routes){
    return routes?.length?`<section class="report-appendix" id="rides"><div class="report-part-head"><span>Rides</span><h2>Ride guides in this country</h2><p>Route-specific conditions belong in these guides rather than being repeated as national facts.</p></div><div class="grid two">${routes.map(routeCard).join('')}</div></section>`:'';
  }
  function countryEssentials(payload){
    const records=[...(payload.units||[]).map(v=>v.detailed_answer||v.concise_answer||''),...(payload.facts||[]).map(v=>v.value_text||'')].filter(Boolean);
    if(!records.length)return '';
    return `<section class="report-part" id="country-essentials"><header class="report-part-head"><span>Country-wide</span><h2>Country-wide essentials</h2><p>Only country-scoped records appear here. Corridor-specific information stays on the relevant ride guide.</p></header><div class="report-country-prose">${records.slice(0,18).map(x=>paragraphs([typeof readingText==='function'?readingText(x):x])).join('')}</div></section>`;
  }

  routeGuidePage=async id=>{
    const route=await api('/api/routes/'+encodeURIComponent(id));
    const payload={units:route.product_units||[],facts:route.external_facts||[],points:route.map_points||[]};
    const report=authoredRoute(route);
    if(!report)return handbookRouteFallback(route,payload);
    const extra=[['route-sequence','Route sequence'],['mapped-stops','Mapped stops'],...(route.questions?.length?[['questions','FAQ']]:[]),['sources','Sources & dates']];
    const stats=[['Distance',route.distance_text],['Typical time',route.typical_days_text],['Difficulty',route.difficulty_text]].filter(([,v])=>v);
    const hero=`<div class="tagrow">${(route.countries||[]).map(c=>`<span class="tag">${h(c.canonical_name)}</span>`).join('')}</div>${stats.length?`<div class="stats">${stats.map(([l,v])=>`<div class="stat"><span>${h(l)}</span><b>${h(v)}</b></div>`).join('')}</div>`:''}${actions('route',route)}`;
    const body=(report.parts||[]).map(part).join('')+segments(route.segments)+mapped(payload.points,`/map?route=${encodeURIComponent(route.route_id)}`)+faq(route.questions)+sources(route,payload);
    return `${pageHero(report.kicker,report.title,report.deck,hero)}${mobileToc(report,extra)}<div class="wrap report-shell">${toc(report,extra)}<main class="report-main">${header(report)}${body}</main></div>`;
  };

  function handbookRouteFallback(route,payload){
    // Preserve the established long-form renderer for routes that do not yet
    // have a dedicated editorial report.
    const active=handbookActiveChapters(payload);
    const stats=[['Distance',route.distance_text],['Typical time',route.typical_days_text],['Difficulty',route.difficulty_text]].filter(([,v])=>v);
    const quick=handbookQuickReference({kind:'route',...payload,questions:route.questions||[],distance:route.distance_text,typicalTime:route.typical_days_text});
    return `${pageHero('Route Field Guide',route.canonical_name,route.overview_text||route.endpoints_or_scope_hint||'Route planning information.',`<div class="tagrow">${route.countries.map(c=>`<span class="tag">${h(c.canonical_name)}</span>`).join('')}</div>${stats.length?`<div class="stats">${stats.map(([l,v])=>`<div class="stat"><span>${h(l)}</span><b>${h(v)}</b></div>`).join('')}</div>`:''}${actions('route',route)}`)}${handbookNav([['by-place','Route by Place'],...(route.questions?.length?[['questions','FAQ']]:[])],active)}<section class="section"><div class="wrap guide-layout handbook-layout"><main>${quick}${handbookParts(payload)}${handbookByPlace({kind:'route',points:payload.points,segments:route.segments||[],countries:route.countries||[],mapHref:`/map?route=${encodeURIComponent(route.route_id)}`,mapLabel:'Open route map'})}${handbookQuestions(route.questions||[],payload)}</main>${sharedEvidenceAside({name:route.canonical_name,sources:route.sources||[],askQuestion:`What should cyclists know about ${route.canonical_name}?`})}</div></section>`;
  }

  countryPage=async id=>{
    const country=await api('/api/countries/'+encodeURIComponent(id));
    const payload={units:country.product_units||[],facts:country.external_facts||[],points:country.map_points||[]};
    const report=authoredCountry(country);
    if(!report){
      const active=handbookActiveChapters(payload);
      return `${pageHero('Country Field Guide',`Cycling in ${country.canonical_name}`,`Country-wide planning and named rides for ${country.canonical_name}.`,actions('country',country))}${handbookNav([['by-place','Places & Stops'],['rides','Rides'],...(country.questions?.length?[['questions','FAQ']]:[])],active)}<section class="section"><div class="wrap guide-layout handbook-layout"><main>${handbookQuickReference({kind:'country',...payload,routes:country.routes||[],questions:country.questions||[]})}${handbookParts(payload)}${handbookByPlace({kind:'country',points:payload.points,mapHref:`/map?country=${encodeURIComponent(country.iso2)}`,mapLabel:'Open country map'})}${guideRidesSection(country.routes||[])}${handbookQuestions(country.questions||[],payload)}</main>${sharedEvidenceAside({name:country.canonical_name,sources:country.sources||[],safety:country.safety,askQuestion:`What should cyclists know about ${country.canonical_name}?`})}</div></section>`;
    }
    const extra=[['country-essentials','Country-wide essentials'],['rides','Ride guides'],['mapped-stops','Mapped stops'],...(country.questions?.length?[['questions','FAQ']]:[]),['sources','Sources & dates']];
    const body=countryEssentials(payload)+rides(country.routes||[])+mapped(payload.points,`/map?country=${encodeURIComponent(country.iso2)}`)+faq(country.questions)+sources(country,payload);
    return `${pageHero(report.kicker,report.title,report.deck,actions('country',country))}${mobileToc(report,extra)}<div class="wrap report-shell">${toc(report,extra)}<main class="report-main">${header(report)}${body}</main></div>`;
  };

  // Final render is started by field-shortcuts.js after it wraps every guide page.
})();