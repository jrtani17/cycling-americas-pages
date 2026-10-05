/* Practical sticky navigation + categorized services for every field guide. */
(function(){
  if (window.__cyclingFieldShortcutsInstalled) return;
  window.__cyclingFieldShortcutsInstalled = true;

  var CATEGORIES = [
    {key:'repair', label:'Repairs', mapType:'repair', re:/repair|mechanic|bike shop|bicycle|bicicle|workshop|taller|weld|spare|parts|cycle shop/i, reportTargets:['repairs','bike-spares'], fallback:'repair-gear'},
    {key:'camping', label:'Camping', mapType:'camping', re:/\bcamp\b|camping|campsite|campground|wild camp|refugio|refuge/i, reportTargets:['sleep'], fallback:'sleep'},
    {key:'lodging', label:'Lodging', mapType:'lodging', re:/hostel|hostal|hotel|hosped|cabañ|cabana|lodg|guesthouse|residencial|room|refugio|refuge/i, reportTargets:['sleep'], fallback:'sleep'},
    {key:'food', label:'Food', mapType:'food', re:/food|grocery|grocer|minimarket|supermarket|restaurant|resupply|meal|market/i, reportTargets:['food'], fallback:'food-water'},
    {key:'water', label:'Water', mapType:'water', re:/\bwater\b|agua|spring|fountain|tap|potable|refill/i, reportTargets:['water'], fallback:'food-water'},
    {key:'fuel', label:'Fuel', mapType:'fuel', re:/fuel|stove|canister|camping gas|white gas|bencina|gasolina blanca/i, reportTargets:['stove-fuel'], fallback:'food-water'},
    {key:'transport', label:'Transport / ferries', mapType:'transport', re:/ferry|boat|barcaza|bus|transport|shuttle|pickup|taxi|terminal|port/i, reportTargets:['ferry-system','hornopiren','yungay','roads-bailout'], fallback:'transport-borders'},
    {key:'borders', label:'Borders', mapType:'border', re:/border|custom|immigration|aduana|pdi|crossing|salvoconducto/i, reportTargets:['lago-desierto','ohiggins-chalten'], fallback:'transport-borders'},
    {key:'cash', label:'Cash / ATMs', re:/\batm\b|cash|bank|money|card|payment/i, reportTargets:['money'], fallback:'money-connectivity'},
    {key:'connectivity', label:'Connectivity', re:/wifi|wi-fi|internet|signal|sim|connect|charging|charger|electric|power/i, reportTargets:['money','weather-offline'], fallback:'money-connectivity'}
  ];

  function pointText(point){
    var fields=[
      point.display_type,point.service_type,point.point_type,point.category,
      point.canonical_name,point.nearest_place,point.summary
    ];
    if(Array.isArray(point.facilities)) fields=fields.concat(point.facilities);
    return fields.filter(Boolean).join(' ');
  }

  function groupedPoints(points){
    var groups={},other=[];
    CATEGORIES.forEach(function(category){groups[category.key]=[];});
    (points||[]).forEach(function(point){
      var matched=false,text=pointText(point);
      CATEGORIES.forEach(function(category){
        if(category.re.test(text)){groups[category.key].push(point);matched=true;}
      });
      if(!matched)other.push(point);
    });
    return {groups:groups,other:other};
  }

  function reportIds(report){
    var ids={};
    (report&&report.parts||[]).forEach(function(part){
      if(part.id)ids[part.id]=true;
      (part.sections||[]).forEach(function(section){if(section.id)ids[section.id]=true;});
    });
    return ids;
  }

  function activeFallbacks(payload){
    var active={};
    if(typeof handbookActiveChapters==='function'){
      handbookActiveChapters(payload||{}).forEach(function(chapter){active[chapter.id]=true;});
    }
    return active;
  }

  function narrativeTarget(category,report,payload){
    if(report){
      var ids=reportIds(report);
      for(var i=0;i<category.reportTargets.length;i++){
        if(ids[category.reportTargets[i]])return category.reportTargets[i];
      }
    }
    var active=activeFallbacks(payload);
    return active[category.fallback]?category.fallback:'';
  }

  function existingTarget(html,candidates){
    for(var i=0;i<candidates.length;i++){
      if(html.indexOf('id="'+candidates[i]+'"')>=0)return candidates[i];
    }
    return '';
  }

  function navItems(html,payload,report,kind){
    payload=payload||{};
    var grouped=groupedPoints(payload.points||[]).groups;
    var overviewTarget=existingTarget(html,['quick-reference','overview','essentials','country-essentials']);
    if(!overviewTarget&&report&&report.parts&&report.parts.length)overviewTarget=report.parts[0].id;
    if(!overviewTarget)overviewTarget=existingTarget(html,['rides','by-place','sources','guide-sources']);
    var items=[{label:'Overview',target:overviewTarget||''}];

    CATEGORIES.forEach(function(category){
      var count=grouped[category.key].length;
      var target=count?('poi-'+category.key):narrativeTarget(category,report,payload);
      if(target)items.push({label:category.label,target:target,practical:true});
    });

    if(kind==='route'){
      var routeTarget=existingTarget(html,['by-place','route-sequence','segments']);
      if(routeTarget)items.push({label:'Route & places',target:routeTarget});
    }else{
      var ridesTarget=existingTarget(html,['rides','by-place']);
      if(ridesTarget)items.push({label:ridesTarget==='rides'?'Rides':'Places',target:ridesTarget});
    }

    var faqTarget=existingTarget(html,['questions']);
    if(faqTarget)items.push({label:'FAQ',target:faqTarget});
    var sourcesTarget=existingTarget(html,['sources','guide-sources']);
    if(sourcesTarget)items.push({label:'Sources',target:sourcesTarget});

    return items.filter(function(item){return item.target;});
  }

  function stickyNavHtml(html,payload,report,kind){
    var items=navItems(html,payload,report,kind);
    if(!items.length)return '';
    return '<nav class="guide-nav field-practical-nav" aria-label="Field guide shortcuts">'+
      '<div class="wrap field-practical-nav-track">'+
      items.map(function(item){
        return '<a href="#'+esc(item.target)+'" data-field-nav="'+esc(item.target)+'"'+
          (item.practical?' class="field-practical-link"':'')+'>'+
          '<span>'+esc(item.label)+'</span>'+
        '</a>';
      }).join('')+
      '</div>'+
    '</nav>';
  }

  function replaceStickyNav(html,payload,report,kind){
    var nav=stickyNavHtml(html,payload,report,kind);
    if(!nav)return html;

    var handbook=/<nav class="guide-nav handbook-nav"[\s\S]*?<\/nav>/;
    var generic=/<nav class="guide-nav"[\s\S]*?<\/nav>/;
    if(handbook.test(html))return html.replace(handbook,nav);
    if(generic.test(html))return html.replace(generic,nav);

    var mobile='<details class="report-mobile-toc">';
    var shell='<div class="wrap report-shell">';
    var section='<section class="section">';
    if(html.indexOf(mobile)>=0)return html.replace(mobile,nav+mobile);
    if(html.indexOf(shell)>=0)return html.replace(shell,nav+shell);
    if(html.indexOf(section)>=0)return html.replace(section,nav+section);
    return nav+html;
  }


  function cleanSummaryText(record){
    if(!record)return '';
    var raw=record.lead||record.text||(record.value&&record.value.concise_answer)||(record.value&&record.value.value_text)||'';
    var text=typeof readingText==='function'?readingText(raw,record.title||''):String(raw||'').trim();
    if(typeof readingExcerpt==='function')text=readingExcerpt(text);
    return String(text||'').replace(/\s+/g,' ').trim();
  }

  function summaryRecords(payload,kind){
    if(typeof readingAllRecords!=='function'||typeof readingArticleKey!=='function')return [];
    var records=readingAllRecords(payload||{}).filter(function(record){
      return !(typeof readingTechnical==='function'&&readingTechnical(record));
    });
    var defs=kind==='route'
      ? [['Planning','planning'],['Roads & weather','roads'],['Food & water','food'],['Repairs','repair'],['Ferries & transport','transport'],['Cash & connectivity','money'],['Camping & lodging','sleep']]
      : [['Roads & conditions','roads'],['Food & water','food'],['Repairs','repair'],['Transport','transport'],['Borders','borders'],['Cash','money'],['Connectivity','connectivity'],['Camping & lodging','sleep']];
    var used=[],picked=[];
    defs.forEach(function(def){
      var candidates=records.filter(function(record){return readingArticleKey(record,kind)===def[1];})
        .sort(function(a,b){return (typeof readingRank==='function'?readingRank(b):0)-(typeof readingRank==='function'?readingRank(a):0);});
      for(var i=0;i<candidates.length;i++){
        var text=cleanSummaryText(candidates[i]),key=norm(text);
        if(text.length<35||used.some(function(existing){return key===existing||(key.length>75&&existing.includes(key))||(existing.length>75&&key.includes(existing));}))continue;
        used.push(key);picked.push({label:def[0],text:text});break;
      }
    });
    return picked.slice(0,6);
  }

  function executiveSummaryHtml(payload,report,kind){
    // Hand-authored report guides already contain their own Key judgments.
    if(report&&report.keyJudgments&&report.keyJudgments.length)return '';
    var items=summaryRecords(payload,kind);
    if(!items.length)return '';
    return '<section class="field-executive" id="overview">'+
      '<div class="eyebrow">What matters most</div>'+
      '<h2>Start here</h2>'+
      '<ul>'+items.map(function(item){return '<li><strong>'+esc(item.label)+'.</strong> '+esc(item.text)+'</li>';}).join('')+'</ul>'+
    '</section>';
  }

  function scopedCategoryMap(mapHref,category){
    if(!category.mapType)return mapHref;
    return mapHref+(mapHref.indexOf('?')>=0?'&':'?')+'type='+encodeURIComponent(category.mapType);
  }

  function fieldStopRow(point){
    var details=point.map_point_id?'/stops/'+encodeURIComponent(point.map_point_id):'';
    var type=point.display_type||point.service_type||point.point_type||'Stop';
    var location=point.nearest_place||point.country_name||'Location not named';
    var precision=point.release_status==='PUBLIC_EXACT'?'Exact location':'Approximate location';
    var contacts=Array.isArray(point.contact_actions)?point.contact_actions.slice(0,2):[];
    return '<article class="field-stop-row">'+
      '<div class="field-stop-row-head"><h4>'+(details?'<a href="'+esc(details)+'" data-link>'+esc(point.canonical_name)+'</a>':esc(point.canonical_name))+'</h4><span>'+esc(type)+'</span></div>'+
      '<p class="field-stop-location">'+esc(location)+' · '+esc(precision)+'</p>'+
      (point.summary?'<p>'+esc(point.summary)+'</p>':'')+
      '<div class="field-stop-actions">'+
        (details?'<a href="'+esc(details)+'" data-link>Details & contact →</a>':'')+
        contacts.map(function(contact){return '<a href="'+esc(contact.href)+'" target="_blank" rel="noreferrer">'+esc(contact.label||contact.type||'Contact')+' →</a>';}).join('')+
      '</div>'+
    '</article>';
  }

  function serviceGroup(category,items,mapHref){
    if(!items.length)return '';
    var visible=items.slice(0,8),more=items.slice(8);
    var categoryMap=scopedCategoryMap(mapHref,category);
    return '<section class="field-service-group" id="poi-'+esc(category.key)+'">'+
      '<div class="field-service-group-head"><h3>'+esc(category.label)+'</h3><a href="'+esc(categoryMap)+'" data-link>Map '+esc(category.label.toLowerCase())+' →</a></div>'+
      '<div class="field-stop-list">'+visible.map(fieldStopRow).join('')+'</div>'+
      (more.length?
        '<details class="field-more-stops"><summary>Show more</summary><div class="field-stop-list">'+more.map(fieldStopRow).join('')+'</div></details>':'')+
    '</section>';
  }

  function serviceDirectory(points,mapHref){
    if(!points||!points.length)return '';
    var grouped=groupedPoints(points);
    var sections=CATEGORIES.map(function(category){
      return serviceGroup(category,grouped.groups[category.key],mapHref);
    }).join('');
    var other='';
    if(grouped.other.length){
      var visible=grouped.other.slice(0,8),more=grouped.other.slice(8);
      other='<section class="field-service-group" id="poi-other">'+
        '<div class="field-service-group-head"><h3>Other useful stops</h3><a href="'+esc(mapHref)+'" data-link>Open map →</a></div>'+
        '<div class="field-stop-list">'+visible.map(fieldStopRow).join('')+'</div>'+
        (more.length?'<details class="field-more-stops"><summary>Show more</summary><div class="field-stop-list">'+more.map(fieldStopRow).join('')+'</div></details>':'')+
      '</section>';
    }
    return '<section class="report-appendix field-service-directory" id="field-services">'+
      '<div class="report-part-head"><span>Field tools</span><h2>Services and useful stops</h2>'+
      '<p>Scan the practical categories below or use the sticky menu to jump directly to what you need.</p></div>'+
      sections+other+
    '</section>';
  }

  function reportForRoute(route){
    var reports=window.CYCLING_GUIDE_REPORTS&&window.CYCLING_GUIDE_REPORTS.routes||{};
    return reports[route.slug]||reports[norm(route.canonical_name).replace(/ /g,'-')]||null;
  }

  function reportForCountry(country){
    var reports=window.CYCLING_GUIDE_REPORTS&&window.CYCLING_GUIDE_REPORTS.countries||{};
    return reports[String(country.iso2||'').toUpperCase()]||null;
  }

  function removeSimpleSection(html,id){
    var marker='id="'+id+'"',markerIndex=html.indexOf(marker);
    if(markerIndex<0)return html;
    var start=html.lastIndexOf('<section',markerIndex),end=html.indexOf('</section>',markerIndex);
    if(start<0||end<0)return html;
    return html.slice(0,start)+html.slice(end+10);
  }


  function stripGenericGuideAside(html){
    var generic=/<aside class="guide-aside">[\s\S]*?<h3>Using this guide<\/h3>[\s\S]*?<\/aside>/;
    if(!generic.test(html))return {html:html,removed:false};
    return {html:html.replace(generic,''),removed:true};
  }

  function removeQuickReference(html){
    return removeSimpleSection(html,'quick-reference');
  }

  function insertGuideLayer(html,directory,payload,report,kind){
    // The hero already carries the scale/stats. Start the actual guide with judgments, not another count box.
    html=removeQuickReference(html);
    var aside=stripGenericGuideAside(html);html=aside.html;

    if(html.indexOf('<section class="report-standfirst">')>=0){
      html=html.replace('<section class="report-standfirst">','<section class="report-standfirst" id="overview">');
    }

    if(html.indexOf('<main class="report-main">')<0&&html.indexOf('<main>')>=0){
      html=html.replace('class="wrap guide-layout handbook-layout"','class="wrap guide-layout handbook-layout field-guide-report-layout"');
      html=html.replace('<main>','<main class="field-guide-report-main">');
    }

    if(aside.removed){
      html=html.replace('class="wrap guide-layout handbook-layout field-guide-report-layout"','class="wrap guide-layout handbook-layout field-guide-report-layout field-guide-no-aside"');
      html=html.replace('class="wrap guide-layout handbook-layout"','class="wrap guide-layout handbook-layout field-guide-no-aside"');
    }

    var executive=executiveSummaryHtml(payload,report,kind);
    if(executive){
      if(html.indexOf('<main class="report-main">')>=0)html=html.replace('<main class="report-main">','<main class="report-main">'+executive);
      else if(html.indexOf('<main class="field-guide-report-main">')>=0)html=html.replace('<main class="field-guide-report-main">','<main class="field-guide-report-main">'+executive);
    }

    if(directory){
      if(html.indexOf('<main class="report-main">')>=0)html=removeSimpleSection(html,'mapped-stops');
      var reportSources='<section class="report-appendix" id="sources">';
      var guideSources='<section id="guide-sources"';
      var byPlace='<section class="handbook-place guide-section reading-places" id="by-place">';
      if(html.indexOf(reportSources)>=0){
        html=html.replace(reportSources,directory+reportSources);
      }else if(html.indexOf(guideSources)>=0){
        html=html.replace(guideSources,directory+guideSources);
      }else if(html.indexOf(byPlace)>=0){
        html=html.replace(byPlace,directory+byPlace);
      }else{
        html=html.replace('</main>',directory+'</main>');
      }
    }

    // Build the sticky menu last so Overview and the practical POI anchors are known.
    html=replaceStickyNav(html,payload,report,kind);
    return html;
  }

  var previousRouteGuidePage=routeGuidePage;
  routeGuidePage=async function(id){
    var pair=await Promise.all([
      previousRouteGuidePage(id),
      api('/api/routes/'+encodeURIComponent(id))
    ]);
    var html=pair[0],route=pair[1];
    var payload={
      units:route.product_units||[],
      facts:route.external_facts||[],
      points:route.map_points||[],
      segments:route.segments||[]
    };
    return insertGuideLayer(
      html,
      serviceDirectory(payload.points,'/map?route='+encodeURIComponent(route.route_id)),
      payload,
      reportForRoute(route),
      'route'
    );
  };

  var previousCountryPage=countryPage;
  countryPage=async function(id){
    var pair=await Promise.all([
      previousCountryPage(id),
      api('/api/countries/'+encodeURIComponent(id))
    ]);
    var html=pair[0],country=pair[1];
    var payload={
      units:country.product_units||[],
      facts:country.external_facts||[],
      points:country.map_points||[]
    };
    return insertGuideLayer(
      html,
      serviceDirectory(payload.points,'/map?country='+encodeURIComponent(country.iso2)),
      payload,
      reportForCountry(country),
      'country'
    );
  };

  var navObserver=null;
  function setupActiveNav(){
    if(navObserver){navObserver.disconnect();navObserver=null;}
    var nav=document.querySelector('.field-practical-nav');
    if(!nav)return;
    var links=Array.prototype.slice.call(nav.querySelectorAll('a[data-field-nav]'));
    var targets=links.map(function(link){
      return {link:link,target:document.getElementById(link.getAttribute('data-field-nav'))};
    }).filter(function(item){return item.target;});
    if(!targets.length)return;

    function setActive(link){
      links.forEach(function(item){item.classList.toggle('active',item===link);});
      if(!link)return;
      var track=nav.querySelector('.field-practical-nav-track');
      if(!track)return;
      var left=link.offsetLeft-(track.clientWidth-link.offsetWidth)/2;
      track.scrollTo({left:Math.max(0,left),behavior:'smooth'});
    }
    setActive(links[0]);

    if('IntersectionObserver' in window){
      navObserver=new IntersectionObserver(function(entries){
        var visible=entries.filter(function(entry){return entry.isIntersecting;})
          .sort(function(a,b){return Math.abs(a.boundingClientRect.top)-Math.abs(b.boundingClientRect.top);});
        if(!visible.length)return;
        var match=targets.find(function(item){return item.target===visible[0].target;});
        if(match)setActive(match.link);
      },{rootMargin:'-135px 0px -62% 0px',threshold:[0,0.01]});
      targets.forEach(function(item){navObserver.observe(item.target);});
    }
  }

  document.addEventListener('click',function(event){
    var link=event.target.closest&&event.target.closest('.field-practical-nav a[data-field-nav]');
    if(!link)return;
    document.querySelectorAll('.field-practical-nav a').forEach(function(item){item.classList.remove('active');});
    link.classList.add('active');
    var target=document.getElementById(link.getAttribute('data-field-nav'));
    if(target&&!target.hasAttribute('tabindex'))target.setAttribute('tabindex','-1');
    if(target)setTimeout(function(){target.focus({preventScroll:true});},350);
  });

  var app=document.getElementById('app');
  if(app)new MutationObserver(function(){requestAnimationFrame(setupActiveNav);}).observe(app,{childList:true,subtree:true});

  render();
})();