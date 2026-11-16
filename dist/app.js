const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const floors = [
 {name:'THE SURFACE',hash:'surface',object:0},
 {name:'RESEARCH & PROFESSIONAL EXPERIENCE',hash:'experience',row:'research-experience',object:7},
 {name:'TEACHING & GENERAL EXPERIENCE',hash:'teaching',row:'general-experience',object:9},
 {name:'LEADERSHIP EXPERIENCE',hash:'leadership',row:'leadership-experience',object:10},
 {name:'RESEARCH PROJECTS',hash:'research',row:'research-projects',object:2},
 {name:'PERSONAL PROJECTS',hash:'projects',row:'personal-projects',object:5},
 {name:'ABOUT',hash:'about',object:1},
 {name:'THE CORE',hash:'core',object:8}
];
const sectionLinks=[
 {title:'Introduction',description:'The surface and the sculpture.'},
 {title:'Research & professional experience',description:'Lab work, data analysis, and collaboration.'},
 {title:'Teaching & general experience',description:'Teaching, tutoring, and internships.'},
 {title:'Leadership experience',description:'Community, membership, and student engagement.'},
 {title:'Research projects',description:'Wireless systems, simulation, and quantum ML.'},
 {title:'Personal projects',description:'Products, tools, and engineering experiments.'},
 {title:'About',description:'The person behind the work.'},
 {title:'Contact',description:'Start a conversation.'}
];
let pendingSectionFocus=null,observedHash=location.hash;
const names=floors.map(f=>f.name);
const PROJECT_FLOOR=5,RESEARCH_FLOOR=4;
const LAST_FLOOR=names.length-1;
let selectedPersonal='middleman-project',selectedResearch='wn4ss-project';
const projectDemos={"wn4ss-project": "<div class=\"demo-panel\"><div class=\"demo-top\"><span><i></i> SIGNAL LAB</span><span>ILLUSTRATIVE SIMULATION</span></div><canvas id=\"waveform\" width=\"600\" height=\"110\" aria-label=\"Simulated wireless signal prediction waveform\"></canvas><div class=\"demo-controls\"><label>Rainfall <input id=\"rain\" type=\"range\" min=\"0\" max=\"100\" value=\"35\"></label><button id=\"model-switch\">MLP <span>\u21c4</span></button><output id=\"signal-output\">\u221264 dBm</output></div></div>", "mindmirror-project": "<div class=\"demo-panel emotion-demo\"><div class=\"demo-top\"><span><i></i> EMOTION STUDY</span><span>INTERACTIVE VISUALIZATION</span></div><div class=\"emotion-options\" role=\"group\" aria-label=\"Explore emotion colors\"><button data-emotion=\"calm\" class=\"selected\">Calm</button><button data-emotion=\"joy\">Joy</button><button data-emotion=\"reflective\">Reflective</button></div><p id=\"emotion-caption\">A quieter state. A cooler reflection.</p></div>", "middleman-project": "<div class=\"demo-panel\"><div class=\"demo-top\"><span><i></i> ESCROW FLOW</span><span>LOCAL DEMONSTRATION</span></div><div class=\"escrow-track\"><span class=\"current\">01 \u00b7 Fund</span><span>02 \u00b7 Hold</span><span>03 \u00b7 Release</span></div><button id=\"escrow-next\" class=\"demo-action\">Simulate deposit <span>\u2192</span></button><p class=\"demo-note\">No payment is collected.</p></div>", "schema-project": "<div class=\"demo-panel\"><div class=\"demo-top\"><span><i></i> TRANSFORMATION LAB</span><span>LOCAL SAMPLE</span></div><div id=\"data-sample\" class=\"code-sample\">{ \"user_name\": \"Ada\", \"score\": \"42\" }</div><button id=\"morph-next\" class=\"demo-action\">Transform sample <span>\u2192</span></button><p id=\"morph-status\" class=\"demo-note\">Raw input \u00b7 inconsistent field names and types</p></div>"};
const hashes = floors.map(f=>f.hash);
let navigation=null, scrollVelocity=0, motionTime=0, heroReady=false;
let currentFloor = 0, reduced = matchMedia('(prefers-reduced-motion: reduce)').matches, modalOpen = false;
let targetProgress = 0, smoothProgress = 0, lastTime = 0, view, emotion = 'calm', escrow = 0, morph = false, model = 'MLP';
const rotations = Array(names.length).fill(0);
let cursorX=0,cursorY=0,easedCursorX=0,easedCursorY=0;
window.addEventListener('pointermove',e=>{cursorX=e.clientX/innerWidth-.5;cursorY=e.clientY/innerHeight-.5;document.documentElement.style.setProperty('--pointer-x',e.clientX+'px');document.documentElement.style.setProperty('--pointer-y',e.clientY+'px');document.body.classList.toggle('over-object',e.clientX>innerWidth*.48&&e.clientY>innerHeight*.2&&e.clientY<innerHeight*.78&&currentFloor>=0&&!e.target.closest('button,.portfolio-row,dialog'));},{passive:true});
let drag = {down:false,startX:0,lastX:0,total:0,velocity:0,rotation:0};
const clamp = (v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth = t => t*t*(3-2*t);
const cinematicEase = t => t*t*t*(t*(t*6-15)+10);
const rail = $('#depth-nav');
names.forEach((name,i)=>{const b=document.createElement('button');b.innerHTML=`<span>${String(i).padStart(2,'0')} / ${name}</span><i></i>`;b.setAttribute('aria-label',`Go directly to ${sectionLinks[i].title.toLowerCase()}`);b.title=sectionLinks[i].title;b.dataset.directFloor=i;rail.append(b);});
function floorScroll(index){return index / LAST_FLOOR * (document.documentElement.scrollHeight-innerHeight);}
function jump(index,{direct=false,historyMode='replace',focus=false}={}){
 index=clamp(index,0,LAST_FLOOR);targetProgress=index;
 if(direct||reduced){navigation=null;smoothProgress=index;scrollVelocity=0;window.scrollTo({top:floorScroll(index),behavior:'instant'});if(view)view.pushTarget=0;}
 else navigation={to:index};
 if(historyMode!=='none'){
  const method=historyMode==='push'&&location.hash!=='#'+hashes[index]?'pushState':'replaceState';
  history[method](null,'','#'+hashes[index]);
 }
 observedHash='#'+hashes[index];
 if(focus)pendingSectionFocus=index;
}
function focusSection(index){
 const section=$(`.floor[data-floor="${index}"]`),heading=section?.querySelector('h1,h2');
 if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
 const status=$('#section-status');if(status)status.textContent=sectionLinks[index].title;
}
function followLocation(){
 const aliases={wn4ss:'research',mindmirror:'projects',middleman:'projects',schema:'projects',contact:'core',resume:'about'};
 const hash=location.hash.slice(1),index=hashes.indexOf(aliases[hash]||hash||'surface');
 if(index<0||observedHash===location.hash&&smoothProgress===index)return;
 if(modalOpen)closeDialog();jump(index,{direct:true,historyMode:'none',focus:true});observedHash=location.hash;
}
window.addEventListener('popstate',followLocation);window.addEventListener('hashchange',followLocation);
function interruptDescent(event){
 if(modalOpen)return;
 const direction=event?.type==='wheel'?Math.sign(event.deltaY):event?.key==='ArrowUp'||event?.key==='PageUp'?-1:event?.key==='ArrowDown'||event?.key==='PageDown'?1:0;
 const gap=targetProgress-smoothProgress;
 const reverse=direction&&Math.sign(gap)!==direction&&Math.abs(gap)>.15;
 const touch=event?.type==='touchstart'&&Math.abs(gap)>.3;
 if(navigation||reverse||touch){targetProgress=smoothProgress;window.scrollTo({top:floorScroll(smoothProgress),behavior:'instant'});}
 navigation=null;
}
window.addEventListener('wheel',interruptDescent,{passive:true});
window.addEventListener('touchstart',interruptDescent,{passive:true});
window.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))interruptDescent(e);});

// One camera driver. Large native scroll deltas cannot bypass the intermediate poses.
const MAX_JOURNEY_SPEED=.42,MAX_JOURNEY_ACCELERATION=1.4;
function advanceJourney(target,dt){
 const error=target-smoothProgress;
 if(Math.abs(error)<.0001&&Math.abs(scrollVelocity)<.001){smoothProgress=target;scrollVelocity=0;return;}
 const desired=clamp(error*5,-MAX_JOURNEY_SPEED,MAX_JOURNEY_SPEED);
 scrollVelocity+=clamp(desired-scrollVelocity,-MAX_JOURNEY_ACCELERATION*dt,MAX_JOURNEY_ACCELERATION*dt);
 const step=scrollVelocity*dt;
 if(Math.sign(step)===Math.sign(error)&&Math.abs(step)>=Math.abs(error)){smoothProgress=target;scrollVelocity=0;}
 else smoothProgress=clamp(smoothProgress+step,0,LAST_FLOOR);
}
let heroTitleElapsed=0,atmosphereRunning=false,ambientMotionRunning=false;
function setAmbientMotion(running){
 if(running===ambientMotionRunning)return;
 ambientMotionRunning=running;document.body.classList.toggle('ambient-motion-active',running);
}
function setAtmosphereMotion(running){
 if(running===atmosphereRunning)return;
 atmosphereRunning=running;document.body.classList.toggle('hero-atmosphere-active',running);
}
function updateHeroTitles(dt){
 if(currentFloor!==0||modalOpen||document.hidden)return;
 if(!reduced)heroTitleElapsed+=dt;
 const cycle=Math.floor(heroTitleElapsed/3),phase=heroTitleElapsed%3;
 let offset=0;
 if(reduced)offset=cycle%4;
 else if(cycle){const previous=(cycle-1)%4,p=cinematicEase(clamp(phase/.65));offset=previous+p;if(offset===4)offset=0;}
 $('.title-strip').style.transform=`translate3d(${-offset*100}%,0,0)`;
}
document.addEventListener('visibilitychange',()=>{lastTime=0;if(document.hidden){navigation=null;setAtmosphereMotion(false);setAmbientMotion(false);}});

function setMotion(){if(reduced){navigation=null;scrollVelocity=0;heroTitleElapsed=Math.floor(heroTitleElapsed/3)*3+.65;}document.body.classList.toggle('reduced',reduced);document.body.classList.toggle('motion-enabled',!reduced);$('#motion-toggle').setAttribute('aria-pressed',String(reduced));$('#motion-toggle span').textContent=reduced?'OFF':'ON';}
setMotion();
$('#motion-toggle').onclick=()=>{reduced=!reduced;setMotion();};
document.addEventListener('click',e=>{const direct=e.target.closest('[data-direct-floor]');if(direct){if(e.button>0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();if(modalOpen)closeDialog();jump(Number(direct.dataset.directFloor),{direct:true,historyMode:'push',focus:true});return;}const target=e.target.closest('[data-jump]');if(target){if(modalOpen)closeDialog();jump(Number(target.dataset.jump));}const p=e.target.closest('[data-project]');if(p)openProject(p.dataset.project);const o=e.target.closest('[data-overlay]');if(o)openOverlay(o.dataset.overlay);});
$('.identity').onclick=e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();jump(0,{direct:true,historyMode:'push',focus:true});};
$('.skip').onclick=e=>{e.preventDefault();jump(currentFloor,{direct:true,focus:true});};
window.addEventListener('scroll',()=>{if(!navigation&&!modalOpen)targetProgress=scrollY/(document.documentElement.scrollHeight-innerHeight)*LAST_FLOOR;},{passive:true});
const details={
wn4ss:{title:'WN4SS',tag:'01 / MACHINE LEARNING RESEARCH',intro:'Weather-aware modeling for wireless signal strength. The chamber’s signal lab is an illustrative simulation, not a trained model inference endpoint.',decisions:[['PROBLEM','Weather and temporal variation can make wireless signal behavior difficult to anticipate.'],['APPROACH','Compare PyTorch MLP, XGBoost, LightGBM, Random Forest, and LinearSVR using weather and network KPI features and five-fold cross-validation.'],['TRADE-OFF','Evaluate multiple model families and test cross-city generalization without retraining to assess how well the approach transfers.'],['RESULT','Achieved MAE of 1.83 dB and 2.21 dB in Elmira, NY without retraining. First-author manuscript under review at IEEE TMLCN (TMLCN-11-26-0378).']]},
mindmirror:{title:'MindMirror AI',tag:'02 / HUMAN-CENTERED AI',intro:'A browser-based emotion detection and music recommendation app using MorphCast and Spotify. The color study here is manually controlled; it does not access your camera or infer your emotions.',decisions:[['PROBLEM','An interface should respond quickly enough to feel connected to a person’s expression.'],['APPROACH','Use the MorphCast SDK for real-time facial analysis and the Spotify API for mood-based music recommendations.'],['TRADE-OFF','Responsiveness, inference cost, and handling sensitive camera data require separate design decisions.'],['RESULT','The project’s interaction concept is demonstrated here through emotion-driven material changes. Production performance is not represented.']]},
middleman:{title:'TheMiddleMan',tag:'03 / TRANSACTION SYSTEMS',intro:'An escrow flow built around Next.js, Firebase, and Stripe. This portfolio contains a local state-machine demonstration, with no payment integration or real funds.',decisions:[['PROBLEM','Both sides of a transaction need a clear account of what is committed, held, and released.'],['APPROACH','Model the exchange as explicit stages: deposit, escrow hold, and release.'],['TRADE-OFF','A simple interface depends on careful handling of retries, disputes, authorization, and asynchronous payment events.'],['RESULT','An interactive representation of the intended escrow lifecycle. Implementation and payment-provider configuration need project links for verification.']]},
schema:{title:'SchemaMorph',tag:'04 / DATA ENGINEERING',intro:'An ETL pipeline handling 5 GB datasets. The interactive sample demonstrates a small schema transformation locally in your browser.',decisions:[['PROBLEM','Inconsistent field names and types make otherwise useful source data difficult to combine.'],['APPROACH','Extract the input, map fields into a common schema, normalize types, and load the result.'],['TRADE-OFF','Large inputs make memory usage, validation, and partial failures central engineering concerns.'],['RESULT','Designed for 5 GB datasets, as described in the project brief. Throughput and memory benchmarks have not been supplied.']]}
};
function showDialog(label,html){$('#overlay').classList.remove('is-section-index');$('.index-button').setAttribute('aria-expanded','false');navigation=null;targetProgress=smoothProgress;scrollVelocity=0;window.scrollTo({top:floorScroll(smoothProgress),behavior:'instant'});$('#dialog-label').textContent=label;$('#dialog-content').innerHTML=html;modalOpen=true;if(!$('#overlay').open)$('#overlay').showModal();$('#overlay').scrollTop=0;document.body.style.overflow='hidden';if(view)view.pushTarget=1;bindProjectDemo();}
function openProject(key){const d=details[key];showDialog(d.tag,`<h2>${d.title}</h2><p>${d.intro}</p><h3>Engineering notes</h3>${d.decisions.map(([k,v])=>`<div class="decision"><b>${k}</b><p>${v}</p></div>`).join('')}<p class="note">Architecture notes based on the supplied project brief. Live demos and source links are awaiting connection.</p>`);}
function sectionIndexHTML(){
 const groups=[{name:'Experience',items:[1,2,3]},{name:'Projects',items:[4,5]},{name:'Profile',items:[0,6,7],profile:true}];
 return `<div class="index-intro"><h2>Find your way.</h2><p>Choose a section to go straight there.</p></div><nav class="section-index" aria-label="Portfolio sections">${groups.map(group=>`<section class="index-group${group.profile?' index-profile':''}"><h3>${group.name}</h3><div class="index-links">${group.items.map(i=>`<a class="section-link" href="#${hashes[i]}" data-direct-floor="${i}"${i===currentFloor?' aria-current="location"':''}><span class="section-link-copy"><strong>${sectionLinks[i].title}</strong><span>${sectionLinks[i].description}</span>${i===currentFloor?'<small>Current section</small>':''}</span><span class="section-link-arrow" aria-hidden="true">↗</span></a>`).join('')}</div></section>`).join('')}</nav>`;
}
function resumeHTML(){
 const sections=[['Research & professional experience','research-experience'],['Teaching & general experience','general-experience'],['Leadership','leadership-experience']];
 return `<h2>Atharva Badgujar.</h2><p>Machine learning, data systems, and products that connect technical ideas with human needs.</p><p><a href="mailto:abadguja@buffalo.edu">abadguja@buffalo.edu ↗</a></p><div class="resume-actions"><a class="download" href="resume.pdf" download="Atharva-Badgujar-Resume-Draft.pdf">Download résumé draft ↓</a><a href="#research" data-direct-floor="4" class="text-button">Explore research ↗</a></div>${sections.map(([title,key])=>`<section class="resume-section"><h3>${title}</h3>${window.PORTFOLIO.rows[key].ids.map(id=>{const card=window.PORTFOLIO.cards[id];return `<div class="resume-role"><h4>${escapeCardText(card.title)}</h4><p>${escapeCardText(card.meta)}${card.dates?`<span>${escapeCardText(card.dates)}</span>`:''}</p></div>`;}).join('')}</section>`).join('')}<p class="note">Résumé draft based on the portfolio entries. Education details are not included.</p>`;
}
function openOverlay(type){if(type==='index'){showDialog('SECTION INDEX',sectionIndexHTML());$('#overlay').classList.add('is-section-index');$('.index-button').setAttribute('aria-expanded','true');}
if(type==='resume')showDialog('ABOUT / RÉSUMÉ',resumeHTML());
if(type==='archive'){if(modalOpen)closeDialog();jump(PROJECT_FLOOR);return;}
if(type==='contact')showDialog('THE CORE / CONTACT',`<h2>Let’s make<br>something matter.</h2><p>Open to conversations about machine learning, research, and thoughtful engineering.</p><a class="contact-button" href="mailto:abadguja@buffalo.edu">abadguja@buffalo.edu <span>↗</span></a>`);}
$('#resume-open').onclick=()=>openOverlay('resume');
function closeDialog(){$('#overlay').close();modalOpen=false;document.body.style.overflow='';if(view)view.pushTarget=0;}
$('#close-dialog').onclick=closeDialog;
$('#overlay').addEventListener('close',()=>{if($('#overlay').open)return;modalOpen=false;document.body.style.overflow='';$('.index-button').setAttribute('aria-expanded','false');if(view)view.pushTarget=0;});
$('#overlay').addEventListener('click',e=>{if(e.target===$('#overlay')){const b=e.target.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)closeDialog();}});
function bindProjectDemo(){
 if($('#emotion-caption')){emotion='calm';$$('[data-emotion]').forEach(b=>b.onclick=()=>{emotion=b.dataset.emotion;$$('[data-emotion]').forEach(x=>x.classList.toggle('selected',x===b));$('#emotion-caption').textContent={calm:'A quieter state. A cooler reflection.',joy:'A warmer state. Light opens outward.',reflective:'A deeper state. Violet settles into the surface.'}[emotion];});
}
 if($('#escrow-next')){escrow=0;$('#escrow-next').onclick=()=>{escrow=(escrow+1)%4;$$('.escrow-track span').forEach((x,i)=>x.classList.toggle('current',i<=escrow));$('#escrow-next').innerHTML=['Simulate deposit <span>→</span>','Confirm delivery <span>→</span>','Release escrow <span>→</span>','Flow complete · Reset <span>↺</span>'][escrow];$('.escrow-track span:last-child').textContent=escrow===3?'03 · Released':'03 · Release';};
}
 if($('#morph-next')){morph=false;$('#morph-next').onclick=()=>{morph=!morph;const raw={user_name:'Ada',score:'42'};const transformed={name:raw.user_name,score:Number(raw.score)};$('#data-sample').textContent=JSON.stringify(morph?transformed:raw);$('#morph-next').innerHTML=morph?'Reset sample <span>↺</span>':'Transform sample <span>→</span>';$('#morph-status').textContent=morph?'Normalized · name: string / score: number':'Raw input · inconsistent field names and types';};
}
 if($('#model-switch')){model='MLP';$('#model-switch').onclick=()=>{model=model==='MLP'?'XGBoost':'MLP';$('#model-switch').innerHTML=model+' <span>⇄</span>';};
}
}
function waveform(t){const canvas=$('#waveform');if(!canvas)return;const ctx=canvas.getContext('2d');const w=canvas.width,h=canvas.height,rain=Number($('#rain').value);ctx.clearRect(0,0,w,h);ctx.strokeStyle='#253c4c';ctx.lineWidth=1;for(let y=20;y<h;y+=25){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}for(let series=0;series<2;series++){ctx.strokeStyle=series?'#a1d7fa':'#3b607a';ctx.lineWidth=series?1.8:1;ctx.beginPath();for(let x=0;x<w;x++){const a=x/27-(reduced?0:t*.00065);let y=55+Math.sin(a)*15+Math.cos(a*.43)*9+Math.sin(a*3.1)*(rain/14);if(series)y+=(model==='MLP'?5:2)*Math.sin(a*1.7);x?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}$('#signal-output').textContent=`−${Math.round(56+rain*.23)} dBm`;}
// Ease only at the ends, leaving time for the central pass-through.
function passageEase(t){if(t<.2){const x=t/.2;return .25*(x*x*x-.5*x*x*x*x);}if(t>.8)return 1-passageEase(1-t);return (t-.1)*1.25;}
function entranceState(depth){return {gallery:1-cinematicEase(clamp((depth-.02)/.32)),shaft:cinematicEase(clamp((depth-.34)/.36))};}
function progressState(p){const base=Math.min(LAST_FLOOR-1,Math.floor(p)),frac=p-base;return p>=LAST_FLOOR?LAST_FLOOR:base+passageEase(clamp((frac-.28)/.72));}
const floorElements=$$('.floor');
const frameUI={world:$('#world'),backdrop:$('#hero-backdrop'),atmosphere:$('#hero-atmosphere'),chamber:$('#chamber-art'),progress:$('.journey-progress i'),caption:$('#chamber-caption'),captionName:$('#chamber-caption b'),veil:$('#descent-veil'),nav:$$('#depth-nav button'),depth:$('#depth-number'),line:$('#transition-line')};
let paintedDepth=NaN,paintedFloor=-1,paintedReady=false,paintedReduced=false,lastRevealDepth=NaN,lastRevealFloor=-1,lastRevealReduced=false,lastReveal=1;
function revealFloor(depth,floor){
 if(depth===lastRevealDepth&&floor===lastRevealFloor&&reduced===lastRevealReduced)return lastReveal;
 lastRevealDepth=depth;lastRevealFloor=floor;lastRevealReduced=reduced;
 const base=Math.min(Math.floor(depth),LAST_FLOOR-1),phase=depth>=LAST_FLOOR?1:depth-base;
 const incoming=floor>base,active=floorElements[floor];
 const reveal=reduced||phase===0?1:incoming?cinematicEase(clamp((phase-.78)/.22)):1-cinematicEase(clamp(phase/.22));
 const heading=reduced||phase===0?1:incoming?cinematicEase(clamp((phase-.80)/.20)):reveal;
 active.style.opacity=1;active.style.setProperty('--floor-y','0px');active.style.setProperty('--floor-scale','1');active.style.setProperty('--floor-tilt','0deg');
 active.style.setProperty('--content-reveal',reveal);active.style.setProperty('--heading-reveal',heading);
 active.style.setProperty('--row-arrival',`${incoming?(1-reveal)*28:0}px`);
 active.style.setProperty('--row-arrival-tilt',`${incoming?(1-reveal)*2:0}deg`);
 active.dataset.readable=String(reveal>.7);active.inert=reveal<=.7;active.style.pointerEvents=reveal>.7?'auto':'none';
 lastReveal=reveal;return reveal;
}
function frame(time){
 const elapsed=lastTime?Math.max(0,(time-lastTime)/1000):1/60,dt=Math.min(elapsed,.05);lastTime=time;
 if(document.hidden){requestAnimationFrame(frame);return;}
 if(navigation&&!modalOpen)targetProgress=navigation.to;
 if(!reduced&&!modalOpen)motionTime+=dt;const pointerEase=1-Math.exp(-dt*6);easedCursorX+=(cursorX-easedCursorX)*pointerEase;easedCursorY+=(cursorY-easedCursorY)*pointerEase;
 const target=clamp(targetProgress,0,LAST_FLOOR);
 if(reduced){smoothProgress=target;scrollVelocity=0;}
 else if(!modalOpen)advanceJourney(target,dt);
 if(navigation&&!modalOpen){window.scrollTo({top:floorScroll(smoothProgress),behavior:'instant'});if(Math.abs(smoothProgress-navigation.to)<.0001){smoothProgress=navigation.to;targetProgress=navigation.to;navigation=null;}}
 const depth=reduced?Math.round(target):progressState(smoothProgress);
 setAtmosphereMotion(depth<.34&&!modalOpen&&!reduced);
 setAmbientMotion(!modalOpen&&!reduced);
 const base=Math.min(Math.floor(depth),LAST_FLOOR-1),phase=depth>=LAST_FLOOR?1:depth-base;
 const floor=reduced?Math.round(depth):clamp(base+(phase>=.55?1:0),0,LAST_FLOOR);
 const difference=Math.abs(depth-Math.round(depth));
 if(floor!==currentFloor){rotations[currentFloor]=drag.rotation;currentFloor=floor;drag.rotation=rotations[floor];drag.velocity=0;floorElements.forEach((el,i)=>{el.hidden=i!==floor;});carouselStates.forEach(state=>{if(!state.row.closest('[hidden]'))state.measure();});$('#floor-name').textContent=names[floor];$('#interaction-hint').textContent=floors[floor].row?'DRAG THE COLLECTION · SCROLL TO DESCEND':'MOVE TO EXPLORE THE LIGHT';}
 const opacity=revealFloor(depth,floor);
if(depth!==paintedDepth||floor!==paintedFloor||heroReady!==paintedReady||reduced!==paintedReduced){
 const floorChanged=floor!==paintedFloor;paintedDepth=depth;paintedFloor=floor;paintedReady=heroReady;paintedReduced=reduced;
 const artOpacity=entranceState(depth).gallery;
 document.documentElement.style.setProperty('--chamber-opacity',String(.65*(1-cinematicEase(clamp(depth/.32)))+(innerWidth<601?.09:.12)*cinematicEase(clamp((depth-.75)/.25))));
 frameUI.world.style.opacity=view?(heroReady?1:1-artOpacity):0;frameUI.backdrop.style.opacity=artOpacity;frameUI.atmosphere.style.opacity=artOpacity;frameUI.atmosphere.hidden=artOpacity<=0;
 frameUI.chamber.style.transform=`translate3d(0,${reduced?0:Math.sin(depth*Math.PI)*20}px,0) scale(${1.02+(reduced?0:Math.sin(depth*Math.PI)*.035)})`;
 frameUI.progress.style.transform=`scaleX(${depth/LAST_FLOOR})`;frameUI.caption.style.opacity=floor>0&&floor<LAST_FLOOR?opacity:0;
 frameUI.veil.style.opacity=reduced?'0':String(Math.pow(Math.sin(phase*Math.PI),4)*.12);
 const meters=String(Math.round(depth*12)).padStart(3,'0');if(frameUI.depth.textContent!==meters)frameUI.depth.textContent=meters;frameUI.line.style.opacity=0;
 if(floorChanged){document.body.dataset.floor=String(floor);frameUI.captionName.textContent=names[floor];frameUI.nav.forEach((b,i)=>{b.classList.toggle('active',i===floor);if(i===floor)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});}
}

updateCarouselMotion(time,dt);
if(view&&!modalOpen&&!reduced)view.samplePerformance?.(elapsed,Math.abs(scrollVelocity)<.02&&!drag.down);
if(!modalOpen){if(!drag.down){drag.velocity*=Math.exp(-dt*4);drag.rotation+=drag.velocity*dt;}if(view)view.update(depth,motionTime,dt);}else if(view)view.update(depth,motionTime,dt);
if(pendingSectionFocus===floor&&Math.abs(depth-floor)<.001&&!modalOpen){focusSection(floor);pendingSectionFocus=null;}
updateHeroTitles(elapsed);if($('#waveform'))waveform(motionTime*1000);requestAnimationFrame(frame);}
window.addEventListener('resize',()=>{paintedDepth=NaN;targetProgress=scrollY/(document.documentElement.scrollHeight-innerHeight)*LAST_FLOOR;});
if(location.hash)requestAnimationFrame(()=>{observedHash='';followLocation();});
requestAnimationFrame(frame);

// Additive card catalog. All summaries are rendered on the card face, before opening details.
let carouselStates=[];
function exhibitIndex(){return selectedPersonal==='mindmirror-project'?4:selectedPersonal==='middleman-project'?5:6;}
function researchIndex(){return selectedResearch==='qcnn'?11:selectedResearch==='wn4ss-project'?3:2;}
function escapeCardText(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function portfolioRowHTML(key,instance){
 const row=window.PORTFOLIO.rows[key];
 return `<section class="portfolio-row" data-portfolio-row="${key}" aria-labelledby="${instance}-heading"><div class="portfolio-row-head"><div><span class="portfolio-row-label">${escapeCardText(row.label)}</span><h3 id="${instance}-heading">${escapeCardText(row.title)}</h3></div><div class="portfolio-controls"><button data-carousel-pause aria-pressed="false" aria-label="Pause ${escapeCardText(row.title)} carousel">Pause</button><button data-carousel-prev aria-label="Previous ${escapeCardText(row.title)} card">←</button><button data-carousel-next aria-label="Next ${escapeCardText(row.title)} card">→</button></div></div><div class="portfolio-track" role="group" aria-label="${escapeCardText(row.title)} cards">${Array.from({length:5},(_,cycle)=>row.ids.map((id,index)=>{const c=window.PORTFOLIO.cards[id],prefix=`${instance}-${cycle}-${id}`;return `<article class="portfolio-card" data-cycle="${cycle}" data-card-index="${index}"${cycle!==1?' aria-hidden="true"':''}><button${cycle!==1?' tabindex="-1"':''} class="portfolio-card-open" data-portfolio-card="${id}" aria-labelledby="${prefix}-title" aria-describedby="${prefix}-description">${cardArtwork(id,prefix)}<span class="portfolio-card-title" id="${prefix}-title">${escapeCardText(c.title)}</span><span class="portfolio-card-description" id="${prefix}-description">${escapeCardText(c.description)}</span><span class="portfolio-card-meta">${escapeCardText(c.meta)}</span>${c.dates?`<span class="portfolio-card-dates">${escapeCardText(c.dates)}</span>`:''}<span class="portfolio-card-link">Full details <span>↗</span></span></button></article>`;}).join('')).join('')}</div><div class="portfolio-row-foot"><span>DRAG TO EXPLORE</span></div></section>`;
}
function cardArtwork(id,prefix){
 const metal=`url(#${prefix}-metal)`,glass=`url(#${prefix}-glass)`;
 let shape='';
 if(id==='middleman-project')shape=`<g transform="translate(160 68)"><ellipse cx="-34" cy="0" rx="52" ry="32" transform="rotate(-25)" fill="none" stroke="${metal}" stroke-width="14"/><ellipse cx="34" cy="0" rx="52" ry="32" transform="rotate(25)" fill="none" stroke="${metal}" stroke-width="14"/><path d="M-12 7h24v20h-24z" fill="${metal}"/><circle cy="17" r="3" fill="#a7dcff"/></g>`;
 else if(id==='mindmirror-project')shape=`<g transform="translate(160 64)"><ellipse rx="50" ry="49" fill="${metal}"/><ellipse rx="43" ry="42" fill="${glass}"/><path d="M-25 -20Q5 -33 23 -13M-26 -12Q5 -25 26 -6M-27 -4Q5 -17 28 2" fill="none" stroke="#b9e2f7" stroke-opacity=".4" stroke-width="1"/><ellipse rx="60" ry="53" fill="none" stroke="#789ab5" stroke-width=".6"/></g>`;
 else if(['schema-project','tailr','shadowdevice','proximity','insightlens'].includes(id)){
  shape='<g transform="translate(160 63)">';for(let i=0;i<9;i++){const x=(i%3-1)*34,y=(Math.floor(i/3)-1)*24;shape+=`<g transform="translate(${x} ${y})"><path d="M0 -16l22 10v22L0 27l-22-11V-6z" fill="${metal}" stroke="#607b91" stroke-width=".6"/><path d="M-22 -6L0 5l22-11M0 5v22" fill="none" stroke="${i%3===0?'#90cef4':'#30485d'}" stroke-width="1"/></g>`;}shape+='</g>';
 }else if(id==='qcnn')shape=`<g transform="translate(160 65)"><ellipse rx="80" ry="29" fill="none" stroke="${metal}" stroke-width="6"/><ellipse rx="80" ry="29" transform="rotate(60)" fill="none" stroke="${metal}" stroke-width="6"/><ellipse rx="80" ry="29" transform="rotate(-60)" fill="none" stroke="${metal}" stroke-width="6"/><circle r="16" fill="${glass}"/><circle r="7" fill="#b2e7ff"/></g>`;
 else if(['wn4ss-project','gprop-project','rag'].includes(id)){
  const nodes=[];for(let c=0;c<4;c++)for(let r=0;r<3;r++)nodes.push([105+c*37,36+r*29]);shape='<g>';nodes.forEach(([x,y],i)=>{if(i<9)for(let j=0;j<3;j++){const q=nodes[Math.floor(i/3)*3+3+j];shape+=`<path d="M${x} ${y}L${q[0]} ${q[1]}" stroke="#6a9cbe" stroke-opacity=".4" stroke-width=".7"/>`;}});nodes.forEach(([x,y],i)=>shape+=`<circle cx="${x}" cy="${y}" r="${i%3===0?5:3}" fill="${i>8?'#b8e6ff':metal}"/>`);shape+='</g>';
 }else if(['verbatim','podcast','interchat','crius07'].includes(id)){
  shape='<g>';for(let i=0;i<28;i++){const h=8+Math.abs(Math.sin(i*.62)*35*Math.sin(i*.13+1));shape+=`<rect x="${76+i*6}" y="${66-h}" width="3" height="${h*2}" rx="1.5" fill="${i%4===0?'#b3e0ff':metal}"/>`;}shape+='</g>';
 }else if(id==='bonvoyage')shape=`<g transform="translate(160 66)"><circle r="45" fill="none" stroke="${metal}" stroke-width="7"/><ellipse rx="20" ry="45" fill="none" stroke="#839eb2"/><path d="M-44 0h88M-39 -22h78M-39 22h78" stroke="#839eb2" fill="none"/><path d="M-56 28Q15 -48 59 -20" fill="none" stroke="#b1e0fc" stroke-width="2"/><circle cx="59" cy="-20" r="4" fill="#d3f0ff"/></g>`;
 else shape=`<g transform="translate(160 65)"><path d="M-60 37V-14L-34-27v64M-12 37V-35l26-13v85M36 37V-7l26-13v57" fill="${metal}" stroke="#b0c4d2" stroke-width=".6"/><path d="M-72 40H77" stroke="#99d7ff" stroke-width="1"/></g>`;
 return `<span class="card-art" aria-hidden="true"><svg viewBox="0 0 320 130" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${prefix}-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#162633"/><stop offset=".25" stop-color="#7894a8"/><stop offset=".42" stop-color="#edf2f4"/><stop offset=".5" stop-color="#708493"/><stop offset=".7" stop-color="#203445"/><stop offset=".94" stop-color="#bccdd8"/></linearGradient><radialGradient id="${prefix}-glass"><stop stop-color="#c6edff"/><stop offset=".18" stop-color="#4d9dc9"/><stop offset=".65" stop-color="#153c5c"/><stop offset="1" stop-color="#071625"/></radialGradient></defs><ellipse cx="160" cy="116" rx="100" ry="8" fill="#000" opacity=".3"/><path d="M46 117H275" stroke="#8db6d1" stroke-opacity=".14"/><g class="card-art-object">${shape}</g></svg></span>`;
}
function prunePortfolioRows(){carouselStates=carouselStates.filter(state=>{if(state.row.isConnected)return true;window.removeEventListener('resize',state.measure);state.observer?.disconnect();state.visibilityObserver?.disconnect();return false;});}
function rowIsVisible(state){return !document.hidden&&!modalOpen&&!state.floor?.hidden&&state.inViewport;}
// Keep a fractional position: scrollLeft is rounded on some browsers.
// Identical cycles on both sides allow an invisible modulo wrap, never a rewind.
function normalizeRail(state){
 if(!state.span)return;
 const shift=state.span+((state.position-state.span)%state.span+state.span)%state.span-state.position;
 if(Math.abs(shift)>.01){state.position+=shift;if(state.tween){state.tween.from+=shift;state.tween.to+=shift;}if(state.gesture)state.gesture.left+=shift;}
}
function writeRail(state,position){state.position=position;normalizeRail(state);state.track.scrollLeft=state.position;state.update();}
function railPositions(state){return state.metrics.map(item=>item.left);}
function settleRail(state,target,duration=750){
 if(reduced){state.tween=null;writeRail(state,target);return;}
 state.tween={from:state.position,to:target,start:null,duration};
}
function mountPortfolioRows(root=document){
 prunePortfolioRows();
 root.querySelectorAll('[data-portfolio-row]').forEach(row=>{
  if(row.dataset.mounted)return;row.dataset.mounted='true';
  const track=row.querySelector('.portfolio-track'),items=[...track.children],count=window.PORTFOLIO.rows[row.dataset.portfolioRow].ids.length;
  const state={row,track,items,count,floor:row.closest('.floor'),inViewport:true,width:0,selected:-1,first:0,last:-1,keys:items.map(item=>item.querySelector('[data-portfolio-card]').dataset.portfolioCard),span:0,position:0,metrics:[],paused:false,tween:null,gesture:null,suppressClick:false,nativeUntil:0,focused:false};carouselStates.push(state);
  track.tabIndex=0;track.setAttribute('aria-label',`${window.PORTFOLIO.rows[row.dataset.portfolioRow].title}: continuously looping collection. Drag, swipe, or use left and right arrow keys. Pause to read.`);
  function update(){
   if(!state.metrics.length)return;
   const width=state.width||1,step=state.span/count;
   const selected=clamp(Math.round(state.position/step),0,items.length-1);
   const first=Math.max(0,Math.floor((state.position-step)/step)),last=Math.min(items.length-1,Math.ceil((state.position+width+step)/step));
   if(first!==state.first||last!==state.last){
    for(let i=state.first;i<=state.last;i++)if(i<first||i>last)items[i].classList.remove('is-in-view');
    for(let i=first;i<=last;i++)items[i].classList.add('is-in-view');state.first=first;state.last=last;
   }
   for(let index=first;index<=last;index++){
    const item=items[index],metric=state.metrics[index],left=metric.left-state.position;
    const offset=clamp((left+metric.width/2-width*.32)/width,-1,1);
    item.style.transform=reduced?'none':`perspective(1500px) translateY(${Math.abs(offset)*7}px) rotateY(${-offset*5.5}deg) scale(${1-Math.abs(offset)*.035})`;
   }
   if(selected!==state.selected){
    items[state.selected]?.classList.remove('is-focused');items[selected].classList.add('is-focused');state.selected=selected;
    const key=state.keys[selected];
    if(row.dataset.portfolioRow==='personal-projects'&&key)selectedPersonal=key;
    if(row.dataset.portfolioRow==='research-projects'&&key)selectedResearch=key;
    if(row.dataset.portfolioRow==='research-experience'&&view)view.selectedRole=selected%count;
   }
  }
  state.update=update;
  state.measure=()=>{
   state.width=track.clientWidth;if(!state.width)return;
   const fraction=state.span?((state.position/state.span)%1+1)%1:0,first=items[0].offsetLeft;
   state.metrics=items.map(item=>({left:item.offsetLeft-first,width:item.offsetWidth||360}));
   const nextSpan=state.metrics[count].left;if(nextSpan!==state.span)state.tween=null;state.span=nextSpan;
   writeRail(state,state.span*(1+fraction));
   if(state.gesture)state.gesture.left=state.position+state.gesture.lastX-state.gesture.x;
  };
  state.move=direction=>{const step=state.span/count;if(!step)return;const current=state.tween?.to??state.position;settleRail(state,direction>0?(Math.floor((current+2)/step)+1)*step:(Math.ceil((current-2)/step)-1)*step);};
  row.querySelector('[data-carousel-prev]').onclick=()=>state.move(-1);
  row.querySelector('[data-carousel-next]').onclick=()=>state.move(1);
  row.querySelector('[data-carousel-pause]').onclick=e=>{state.paused=!state.paused;if(state.paused)state.tween=null;e.currentTarget.setAttribute('aria-pressed',String(state.paused));e.currentTarget.textContent=state.paused?'Play':'Pause';e.currentTarget.setAttribute('aria-label',`${state.paused?'Play':'Pause'} ${window.PORTFOLIO.rows[row.dataset.portfolioRow].title} carousel`);};
  track.addEventListener('focusin',()=>{state.focused=!state.gesture;state.tween=null;state.position=track.scrollLeft;});
  track.addEventListener('focusout',e=>{if(!track.contains(e.relatedTarget))state.focused=false;});
  track.addEventListener('keydown',e=>{
   if(e.key==='ArrowLeft'||e.key==='ArrowRight'){
    e.preventDefault();const direction=e.key==='ArrowLeft'?-1:1,card=e.target.closest('[data-portfolio-card]');
    if(card){const index=window.PORTFOLIO.rows[row.dataset.portfolioRow].ids.indexOf(card.dataset.portfolioCard),next=(index+direction+count)%count,canonical=items[count+next];state.tween=null;state.focused=true;writeRail(state,state.metrics[count+next].left);canonical.querySelector('[data-portfolio-card]').focus({preventScroll:true});}
    else state.move(direction);
   }
   if((e.key==='Enter'||e.key===' ')&&e.target===track){e.preventDefault();const key=state.keys[state.selected];if(key)openPortfolioCard(key);}
  });
  track.addEventListener('pointerdown',e=>{if(e.button!==0)return;state.focused=false;state.tween=null;state.gesture={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastTime:e.timeStamp,left:state.position,velocity:0,dragging:false};state.suppressClick=false;});
  track.addEventListener('pointermove',e=>{
   const card=e.target.closest('.portfolio-card');if(card&&!reduced){const box=card.getBoundingClientRect();card.style.setProperty('--card-light-x',`${(e.clientX-box.left)/box.width*100}%`);card.style.setProperty('--card-light-y',`${(e.clientY-box.top)/box.height*100}%`);}
   const g=state.gesture;if(!g||g.id!==e.pointerId)return;const dx=e.clientX-g.x,dy=e.clientY-g.y;
   if(!g.dragging){if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>9){state.gesture=null;return;}if(Math.abs(dx)<8)return;g.dragging=true;state.suppressClick=true;track.setPointerCapture(e.pointerId);track.classList.add('is-dragging');}
   const elapsed=Math.max(8,e.timeStamp-g.lastTime)/1000;g.velocity=g.velocity*.6+(g.lastX-e.clientX)/elapsed*.4;g.lastX=e.clientX;g.lastTime=e.timeStamp;
   writeRail(state,g.left-dx);
  });
  function release(e){const g=state.gesture;if(!g)return;state.gesture=null;track.classList.remove('is-dragging');if(g.dragging){settleRail(state,state.position+clamp(g.velocity,-1600,1600)*.16,700);if(track.hasPointerCapture?.(e.pointerId))track.releasePointerCapture(e.pointerId);}}
  track.addEventListener('pointerup',release);track.addEventListener('pointercancel',release);
  track.addEventListener('click',e=>{if(state.suppressClick){e.preventDefault();e.stopImmediatePropagation();state.suppressClick=false;}},true);
  track.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)||e.shiftKey){state.tween=null;state.nativeUntil=performance.now()+180;}},{passive:true});
  track.addEventListener('scroll',()=>{if(state.focused||state.nativeUntil>performance.now()){state.position=track.scrollLeft;update();}},{passive:true});
  window.addEventListener('resize',state.measure);
  if(typeof ResizeObserver!=='undefined'){state.observer=new ResizeObserver(state.measure);state.observer.observe(track);state.observer.observe(items[0]);}
  if(typeof IntersectionObserver!=='undefined'){state.visibilityObserver=new IntersectionObserver(entries=>{state.inViewport=entries[0].isIntersecting;},{rootMargin:'80px'});state.visibilityObserver.observe(row);}
  requestAnimationFrame(state.measure);
 });
}
function updateCarouselMotion(time,dt=1/60){
 carouselStates.forEach(state=>{
  if(!rowIsVisible(state)||document.hidden){state.tween=null;return;}
  if(!state.span)state.measure();
  if(state.gesture||time<state.nativeUntil)return;
  if(state.tween){const tween=state.tween;if(tween.start===null)tween.start=time;const p=reduced?1:clamp((time-tween.start)/tween.duration);writeRail(state,tween.from+(tween.to-tween.from)*cinematicEase(p));if(p===1)state.tween=null;}
  else if(!reduced&&!state.paused&&!state.focused)writeRail(state,state.position+28*Math.min(dt,.05));
 });
}

function openPortfolioCard(id){
 const c=window.PORTFOLIO.cards[id];if(!c)return;
 if(window.PORTFOLIO.rows['personal-projects'].ids.includes(id))selectedPersonal=id;
 if(window.PORTFOLIO.rows['research-projects'].ids.includes(id))selectedResearch=id;
 const fromCatalog=false;
 showDialog('PORTFOLIO / FULL DETAILS',`${fromCatalog?'<button class="text-button card-back" data-overlay="archive">← Back to projects</button>':''}<h2 class="portfolio-detail-title">${escapeCardText(c.title)}</h2><p class="portfolio-detail-meta">${escapeCardText(c.meta)}${c.dates?`<br>${escapeCardText(c.dates)}`:''}</p><p>${escapeCardText(c.description)}</p><ul class="portfolio-detail-list">${c.bullets.map(b=>`<li>${escapeCardText(b)}</li>`).join('')}</ul>${projectDemos[id]?`<div class="project-demo-detail"><h3>Interactive study</h3>${projectDemos[id]}</div>`:''}`);
}
function initPortfolioCards(){
 $$('[data-row-mount]').forEach(mount=>{const key=mount.dataset.rowMount;mount.innerHTML=portfolioRowHTML(key,`floor-${key}`);});
 mountPortfolioRows();
 document.addEventListener('click',e=>{const card=e.target.closest('[data-portfolio-card]');if(card)openPortfolioCard(card.dataset.portfolioCard);});

}

initPortfolioCards();

async function init3D(){const T=await import('./vendor/three.module.js');
const {createHeroHologram}=await import('./hero-hologram.js');
const {finishExhibits}=await import('./exhibit-finish.js');
const {createShaft}=await import('./shaft-scene.js');
const {createAdaptiveQuality}=await import('./adaptive-quality.js');
const scene=new T.Scene();scene.background=null;scene.fog=new T.FogExp2('#060b12',.021);
const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});renderer.setSize(innerWidth,innerHeight);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.14;renderer.setClearColor(0x000000,0);$('#world').append(renderer.domElement);
let renderInvalidated=true;
const quality=createAdaptiveQuality({width:innerWidth,height:innerHeight,pixelRatio:devicePixelRatio,onChange(ratio,level){renderer.setPixelRatio(ratio);document.body.classList.toggle('adaptive-low',level>=2);}});
const camera=new T.PerspectiveCamera(40,innerWidth/innerHeight,.1,220);camera.position.set(0,1.1,13.7);
const envCanvas=document.createElement('canvas');envCanvas.width=1024;envCanvas.height=512;const ec=envCanvas.getContext('2d');ec.fillStyle='#101720';ec.fillRect(0,0,1024,512);for(const [x,w,col] of [[110,90,'#b5c7da'],[400,190,'#edf4ff'],[750,35,'#a8c4db']]){const g=ec.createLinearGradient(x,0,x+w,0);g.addColorStop(0,'#111820');g.addColorStop(.45,col);g.addColorStop(.55,col);g.addColorStop(1,'#111820');ec.fillStyle=g;ec.fillRect(x,0,w,270);}const envTex=new T.CanvasTexture(envCanvas);envTex.mapping=T.EquirectangularReflectionMapping;const pmrem=new T.PMREMGenerator(renderer);scene.environment=pmrem.fromEquirectangular(envTex).texture;envTex.dispose();pmrem.dispose();
const brushCanvas=document.createElement('canvas');brushCanvas.width=512;brushCanvas.height=512;const bc=brushCanvas.getContext('2d');bc.fillStyle='#818181';bc.fillRect(0,0,512,512);let seed=31;const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};for(let i=0;i<2300;i++){const shade=Math.floor(100+rand()*56);bc.strokeStyle=`rgb(${shade},${shade},${shade})`;bc.lineWidth=.3+rand()*.6;const y=rand()*512;bc.beginPath();bc.moveTo(0,y);bc.lineTo(512,y+rand()*.6);bc.stroke();}const brush=new T.CanvasTexture(brushCanvas);brush.wrapS=brush.wrapT=T.RepeatWrapping;brush.repeat.set(3,7);brush.anisotropy=renderer.capabilities.getMaxAnisotropy();
const metal=new T.MeshPhysicalMaterial({color:'#bac6cf',metalness:1,roughness:.28,anisotropy:.72,anisotropyRotation:Math.PI/2,clearcoat:.12,clearcoatRoughness:.35,bumpMap:brush,bumpScale:.012,side:T.DoubleSide,envMapIntensity:1.55});const darkMetal=new T.MeshStandardMaterial({color:'#323f4d',metalness:.95,roughness:.37,envMapIntensity:1});const blueMat=new T.MeshStandardMaterial({color:'#9cc8df',metalness:.65,roughness:.22,emissive:'#327da1',emissiveIntensity:.65});
scene.add(new T.AmbientLight('#a7c6dc',.35));const top=new T.DirectionalLight('#f0f6ff',3.8);top.position.set(2,9,5);scene.add(top);const rim=new T.DirectionalLight('#789dbf',2);rim.position.set(-4,1,-4);scene.add(rim);scene.add(top.target,rim.target);const cursorLight=new T.PointLight('#daeaff',55,25,2);scene.add(cursorLight);let pointer={x:0,y:0};window.addEventListener('pointermove',e=>{pointer.x=e.clientX/innerWidth*2-1;pointer.y=1-e.clientY/innerHeight*2;},{passive:true});
const groups=[],strips=[],floorRings=[],pillars=[],blocks=[];for(let i=0;i<12;i++){const g=new T.Group();g.position.set(2.5,-i*13,0);scene.add(g);groups.push(g);}
function ribbon(index,total,radius=2.65,isHero=false){
 const positions=[],uvs=[],indices=[],segments=200;
 const profile=[[-.43,-.024],[-.4,-.052],[.4,-.052],[.43,-.024],[.43,.024],[.4,.052],[-.4,.052],[-.43,.024]];
 function path(t){const r=radius*(isHero?1-Math.sin(t)*.1:1)+Math.sin(t*3+index*.8)*.045;return new T.Vector3(Math.cos(t)*r,Math.sin(t)*r*(isHero?1.33:1.16),Math.sin(t*2+index*.8)*.3);}
 for(let i=0;i<=segments;i++){const t=i/segments*Math.PI*2,center=path(t),tangent=path(t+.001).sub(path(t-.001)).normalize();let normal=new T.Vector3(Math.cos(t),Math.sin(t),0);normal.addScaledVector(tangent,-normal.dot(tangent)).normalize();normal.applyAxisAngle(tangent,Math.sin(t*2+index)*.22);const binormal=new T.Vector3().crossVectors(tangent,normal).normalize();
 for(let j=0;j<profile.length;j++){const [u,v]=profile[j],p=center.clone().addScaledVector(normal,u*(isHero?.82:1)).addScaledVector(binormal,v);positions.push(p.x,p.y,p.z);uvs.push(i/segments,j/profile.length);}}
 for(let i=0;i<segments;i++)for(let j=0;j<profile.length;j++){const a=i*8+j,b=i*8+(j+1)%8;indices.push(a,b,a+8,b,b+8,a+8);}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geo.setIndex(indices);geo.computeVertexNormals();const mesh=new T.Mesh(geo,metal);mesh.rotation.y=index/total*Math.PI;mesh.rotation.z=.18+Math.sin(index)*.4;mesh.userData.baseY=mesh.rotation.y;return mesh;
}
groups[0].name='interactive-vessel';groups[0].rotation.set(.06,-.25,-.08);
const heroHologram=createHeroHologram(T,groups[0]);
const pearlMaterial=new T.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:`varying vec3 vNormal;varying vec3 vPosition;void main(){vNormal=normalize(normalMatrix*normal);vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform float uTime;varying vec3 vNormal;varying vec3 vPosition;void main(){vec3 p=normalize(vPosition);float wave=sin(p.x*13.+sin(p.y*18.+uTime*.2)*2.+sin(p.z*12.)*1.4);float veins=pow(1.-abs(wave),7.);float fresnel=pow(1.-abs(vNormal.z),2.5);float cloud=sin(p.x*8.+p.y*5.+sin(p.z*12.))*0.5+0.5;vec3 color=mix(vec3(.025,.18,.4),vec3(.15,.64,.95),cloud);color+=vec3(.25,.65,1.)*veins*.9;color+=vec3(.3,.7,1.)*fresnel*.75;gl_FragColor=vec4(color,1.);}`});
function core(group,scale=.6){const orb=new T.Mesh(new T.SphereGeometry(scale,64,48),pearlMaterial);group.add(orb);const glow=new T.PointLight('#66b8ff',18,8,2);group.add(glow);const spriteCanvas=document.createElement('canvas');spriteCanvas.width=spriteCanvas.height=128;const c=spriteCanvas.getContext('2d'),g=c.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(110,190,255,.5)');g.addColorStop(.2,'rgba(70,150,255,.15)');g.addColorStop(1,'rgba(20,70,255,0)');c.fillStyle=g;c.fillRect(0,0,128,128);const sprite=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(spriteCanvas),blending:T.AdditiveBlending,depthWrite:false,transparent:true}));sprite.scale.set(5,5,1);group.add(sprite);return orb;}
const lastOrb=core(groups[8],.9);const finalStrips=[];for(let i=0;i<6;i++){const s=ribbon(i,6,2.3);groups[8].add(s);finalStrips.push(s);}
// Dissolving physical floor plates, with a luminous edge at the opening.
const floorMat=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,
 uniforms:{uDissolve:{value:0},uReveal:{value:0},uTint:{value:new T.Color('#8fcff4')}},
 vertexShader:`varying vec2 vPlate;void main(){vPlate=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform float uDissolve;uniform float uReveal;uniform vec3 uTint;varying vec2 vPlate;
 void main(){float radial=length(vPlate)/17.1;float opening=mix(.157,1.02,uDissolve);
 float gap=radial-opening;if(gap<0.||uDissolve>.999)discard;
 float edge=(1.-smoothstep(0.,.012,gap))*smoothstep(.01,.08,uDissolve);
 float etch=pow(.5+.5*cos(radial*220.),32.)*.006;
 gl_FragColor=vec4(mix(vec3(.075,.12,.16),uTint*.8,edge),(.065+edge*.3+etch)*uReveal);}`});
for(let i=0;i<names.length;i++){
 const floor=new T.Mesh(new T.RingGeometry(2.7,17.1,128),floorMat.clone());floor.rotation.x=-Math.PI/2;floor.position.set(0,-i*13-4.2,0);scene.add(floor);
 const ring=new T.Mesh(new T.TorusGeometry(16.95,.014,8,160),new T.MeshBasicMaterial({color:i%2?'#8a9fb0':'#8fd5f2',transparent:true,opacity:.25}));ring.rotation.x=Math.PI/2;ring.position.copy(floor.position);scene.add(ring);floorRings.push({ring,floor});
}
// The shaft enters only after the camera passes the surface sculpture.
const shaft=createShaft(T,scene,names.length,brush),architecture=shaft.group;
function torus(group,r=1.8,t=.12){const ring=new T.Mesh(new T.TorusGeometry(r,t,24,128),metal);group.add(ring);return ring;}
for(let i=0;i<3;i++){const band=ribbon(i,3,1.8);band.scale.y=.9;groups[1].add(band);}core(groups[1],.48);
function lattice(group){const nodes=[];for(let layer=0;layer<4;layer++)for(let row=0;row<5;row++){const p=new T.Vector3((layer-1.5)*.9,(row-2)*.8,Math.sin(layer+row)*.6);nodes.push(p);const node=new T.Mesh(new T.SphereGeometry(.085,12,8),layer===3?blueMat:metal);node.position.copy(p);group.add(node);}const positions=[];nodes.forEach((p,i)=>{if(i<15)for(let k=0;k<5;k++){const q=nodes[Math.floor(i/5)*5+5+k];positions.push(p.x,p.y,p.z,q.x,q.y,q.z);}});const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));group.add(new T.LineSegments(geo,new T.LineBasicMaterial({color:'#4b7898',transparent:true,opacity:.35})));const cage=torus(group,2.75,.045);cage.rotation.y=.5;}
lattice(groups[2]);lattice(groups[3]);
for(let i=0;i<3;i++){const band=ribbon(i,3,2.2);band.scale.set(.85,.85,.85);band.rotation.z=Math.PI/2+i*.6;groups[2].add(band);}
for(let i=0;i<3;i++){const band=torus(groups[3],2.55+i*.16,.07);band.rotation.set(.25+i*.18,.65,0);}
const orbitWave=[];for(let i=0;i<200;i++){const t=i/199*Math.PI*2;orbitWave.push(new T.Vector3(Math.cos(t)*3,Math.sin(t)*.35-1.9,Math.sin(t)*1.4));}const waveMesh=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(orbitWave),200,.018,8,false),blueMat);groups[3].add(waveMesh);

const rainGeo=new T.BufferGeometry(),rainPos=[];for(let i=0;i<130;i++)rainPos.push(rand()*7-3.5,rand()*7-3.5,rand()*4-2);rainGeo.setAttribute('position',new T.Float32BufferAttribute(rainPos,3));const rainPoints=new T.Points(rainGeo,new T.PointsMaterial({color:'#a6d7fa',size:.025,transparent:true,opacity:.5}));groups[3].add(rainPoints);
const mirrorRim=torus(groups[4],1.9,.16);mirrorRim.scale.y=1.32;const mirrorMat=new T.MeshStandardMaterial({color:'#83a6bf',metalness:.95,roughness:.14,envMapIntensity:1.7,emissive:'#12314d',emissiveIntensity:.4});const mirror=new T.Mesh(new T.SphereGeometry(1.78,64,48),mirrorMat);mirror.scale.set(1,1.32,.1);groups[4].add(mirror);groups[4].rotation.y=-.32;
const mirrorEdge=torus(groups[4],2.1,.022);mirrorEdge.scale.y=1.3;mirrorEdge.material=blueMat;mirrorEdge.position.z=-.02;
const mirrorOuter=torus(groups[4],2.22,.07);mirrorOuter.scale.y=1.3;mirrorOuter.position.z=-.15;
const mirrorBack=torus(groups[4],1.85,.11);mirrorBack.scale.y=1.3;mirrorBack.position.z=-.28;
mirrorMat.onBeforeCompile=shader=>{shader.uniforms.uRipple={value:0};mirrorMat.userData.shader=shader;shader.vertexShader='uniform float uRipple;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.z += sin(position.y*7.0+uRipple)*cos(position.x*5.0+uRipple*.7)*.009;');};

const lockA=torus(groups[5],1.65,.24);lockA.position.x=-.65;lockA.rotation.y=.7;const lockB=torus(groups[5],1.65,.24);lockB.position.x=.65;lockB.rotation.set(.7,-.7,0);const lock=new T.Mesh(new T.BoxGeometry(.5,.7,.38),metal);groups[5].add(lock);lock.position.y=-1.6;
const boltGeo=new T.SphereGeometry(.045,8,6);for(const ring of [lockA,lockB]){const inner=new T.Mesh(new T.TorusGeometry(1.63,.016,8,128),blueMat);inner.position.z=.15;ring.add(inner);for(let i=0;i<24;i++){const t=i/24*Math.PI*2,bolt=new T.Mesh(boltGeo,darkMetal);bolt.position.set(Math.cos(t)*1.66,Math.sin(t)*1.66,.15);ring.add(bolt);}}
const lockBridge=new T.Mesh(new T.BoxGeometry(.16,.36,.41),blueMat);lockBridge.position.set(0,-1.6,.04);groups[5].add(lockBridge);

const square=new T.Shape();square.moveTo(-.23,-.23);square.lineTo(.23,-.23);square.lineTo(.23,.23);square.lineTo(-.23,.23);square.closePath();const blockGeo=new T.ExtrudeGeometry(square,{depth:.46,bevelEnabled:true,bevelSegments:6,steps:1,bevelSize:.075,bevelThickness:.075});blockGeo.center();for(let i=0;i<36;i++){const block=new T.Mesh(blockGeo,i%7===0?blueMat:metal);block.position.set((i%3-1)*.8,(Math.floor(i/3)%4-1.5)*.8,(Math.floor(i/12)-1)*.8);block.userData.base=block.position.clone();groups[6].add(block);blocks.push(block);}groups[6].rotation.set(.23,-.5,.15);
for(let i=0;i<5;i++){const profile=new T.Shape();profile.moveTo(-.27,-2-i*.125);profile.lineTo(.27,-2-i*.125);profile.lineTo(.27,2+i*.125);profile.lineTo(-.27,2+i*.125);profile.closePath();const pillarGeometry=new T.ExtrudeGeometry(profile,{depth:.68,bevelEnabled:true,bevelSegments:5,bevelSize:.055,bevelThickness:.055,steps:1});pillarGeometry.center();const pillar=new T.Mesh(pillarGeometry,metal.clone());pillar.rotation.y=(i-2)*.14;pillar.position.set((i-2)*1.05,-.5,-Math.abs(i-2)*.65);groups[7].add(pillar);pillars.push(pillar);const cap=new T.Mesh(new T.BoxGeometry(.61,.025,.76),blueMat);cap.position.set(pillar.position.x,1.51+i*.125,pillar.position.z);groups[7].add(cap);}
for(let i=0;i<2;i++){const arch=ribbon(i,2,2.8);arch.rotation.set(.12,.8+i*.9,-.13);arch.scale.set(.94,1.03,.65);arch.position.z=-.65;groups[7].add(arch);}
const foundation=torus(groups[7],3.2,.055);foundation.rotation.x=Math.PI/2;foundation.position.y=-2.6;
// Teaching: suspended, open leaves. Leadership: connected orbital bands.
for(let i=0;i<3;i++){const leaf=ribbon(i,3,1.75);leaf.rotation.set(.1,(i-1)*.42,Math.PI*.12);leaf.scale.set(.75,1.08,.8);leaf.position.x=(i-1)*.5;groups[9].add(leaf);}
const teachingSpine=new T.Mesh(new T.CylinderGeometry(.055,.055,4.4,12),blueMat);groups[9].add(teachingSpine);
for(let i=0;i<3;i++){const band=torus(groups[10],2.05,.095);band.rotation.set(i*.78,.4+i*.52,i*.3);}
for(let i=0;i<7;i++){const a=i/7*Math.PI*2;const node=new T.Mesh(new T.SphereGeometry(i===0?.2:.11,20,16),i===0?blueMat:metal);node.position.set(Math.cos(a)*2.1,Math.sin(a)*2.1,Math.sin(a*2)*.8);groups[10].add(node);}
const collectiveCore=new T.Mesh(new T.IcosahedronGeometry(.75,1),metal);groups[10].add(collectiveCore);
for(let i=0;i<3;i++){const orbit=torus(groups[11],2.25,.07);orbit.scale.y=.43;orbit.rotation.z=i*Math.PI/3;}
for(let i=0;i<7;i++){const a=i/7*Math.PI*2;const node=new T.Mesh(new T.SphereGeometry(.13,20,12),blueMat);node.position.set(Math.cos(a)*2.25,Math.sin(a)*1.7,Math.sin(a*2)*.5);groups[11].add(node);}
groups[11].add(new T.Mesh(new T.IcosahedronGeometry(.55,3),blueMat));
// A restrained light frame gives every exhibit a physical location in the chamber.
const halo=new T.Group();halo.name='exhibit-light-frame';scene.add(halo);
const haloMat=new T.MeshBasicMaterial({color:'#b0d8ef',transparent:true,opacity:.14,depthWrite:false});
const haloArc=new T.Mesh(new T.TorusGeometry(3.2,.013,8,100,Math.PI*1.55),haloMat);haloArc.rotation.z=.45;halo.add(haloArc);
const haloInner=new T.Mesh(new T.TorusGeometry(3.03,.006,6,100,Math.PI*1.55),haloMat);haloInner.rotation.z=.45;halo.add(haloInner);
const dustGeo=new T.BufferGeometry(),dustPos=[];for(let i=0;i<700;i++)dustPos.push((rand()-.5)*22,-rand()*118+6,(rand()-.5)*15);dustGeo.setAttribute('position',new T.Float32BufferAttribute(dustPos,3));const dust=new T.Points(dustGeo,new T.PointsMaterial({color:'#c4d9eb',size:.018,transparent:true,opacity:.4,depthWrite:false}));scene.add(dust);
const beamMaterial=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,uniforms:{},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv; void main(){float a=pow(vUv.y,1.8)*0.018;gl_FragColor=vec4(.52,.64,.79,a);}'});const beam=new T.Mesh(new T.ConeGeometry(5,15,64,1,true),beamMaterial);beam.position.set(2.5,6,0);scene.add(beam);
const canvas=renderer.domElement;
canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag.down=true;drag.startX=drag.lastX=e.clientX;drag.total=0;drag.velocity=0;canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!drag.down)return;const dx=e.clientX-drag.lastX;drag.total+=Math.abs(dx);drag.rotation+=dx*.006;drag.velocity=dx*.11;drag.lastX=e.clientX;});
function release(e){if(!drag.down)return;drag.down=false;if(e.type==='pointerup'&&drag.total<6&&(currentFloor===RESEARCH_FLOOR||currentFloor===PROJECT_FLOOR)){const ray=new T.Raycaster();ray.setFromCamera(new T.Vector2(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2),camera);const index=currentFloor===RESEARCH_FLOOR?researchIndex():exhibitIndex();if(ray.ray.intersectsBox(new T.Box3().setFromObject(groups[index])))openPortfolioCard(currentFloor===RESEARCH_FLOOR?selectedResearch:selectedPersonal);}}
canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
const exhibitFinish=finishExhibits(T,renderer,groups);
const objectFloors=[0,6,4,4,5,5,5,1,7,2,3,4];
const exhibitFades={2:0,3:1,4:0,5:1,6:0,11:0};
for(const index of [2,3,4,5,6,11]){const cache=new Map();groups[index].userData.fadeMaterials=[];groups[index].traverse(object=>{if(!object.material)return;const convert=source=>{if(cache.has(source))return cache.get(source);const material=source.clone();material.onBeforeCompile=source.onBeforeCompile;if(source.color)material.color=source.color;cache.set(source,material);groups[index].userData.fadeMaterials.push({material,opacity:source.opacity,transparent:source.transparent,depthWrite:source.depthWrite});return material;};object.material=Array.isArray(object.material)?object.material.map(convert):convert(object.material);});}

const objectTimes=Array(groups.length).fill(0),turnRates=[.045,.065,.055,.06,.045,.06,.065,.025,.045,.045,.05,.055];groups.forEach(g=>g.userData.restRotation=g.rotation.clone());
const flightPaths=new Map(),flightPoint=new T.Vector3(),flightTarget=new T.Vector3();
function flightPath(floor,mobile){
 const key=`${floor}-${mobile}`;if(flightPaths.has(key))return flightPaths.get(key);
 const x=mobile?.8:0,y=-floor*13,nextY=y-13;
 const collection=floor>=1&&floor<=5;
 const cx=floor===0?(mobile?.8:.6):collection?(mobile?2.3:3.45):(mobile?.45:2.7);
 const cy=y+(floor===0?(mobile?2.1:.55):collection?(mobile?2.1:1.65):(mobile?2.4:.35));
 const nextCollection=floor+1>=1&&floor+1<=5;
 const nx=nextCollection?(mobile?2.3:3.45):(mobile?.45:2.7);
 const ny=nextY+(nextCollection?(mobile?2.1:1.65):(mobile?2.4:.35));
 const sweep=mobile?2.2:4.6;
 const points=[[x,y+1.1,13.7],[cx+sweep*.65,cy+1,11],[cx+sweep,cy+.4,6],
  [cx,cy,-.8],[nx,ny+.6,-1.4],[nx,ny,.35],[nx*.5+x*.5,ny*.5+(nextY+1.1)*.5,6.5],[x,nextY+1.1,13.7]];
 const targets=[[x,y,0],[cx,cy,0],[cx,cy,-2],[cx,cy-5,-8],
  [nx,ny,-7],[nx,ny,-3],[nx*.5+x*.5,ny*.5+nextY*.5,0],[x,nextY,0]];
 const path={position:new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),false,'centripetal'),target:new T.CatmullRomCurve3(targets.map(p=>new T.Vector3(...p)),false,'centripetal')};
 path.position.arcLengthDivisions=700;path.position.updateArcLengths();flightPaths.set(key,path);return path;
}
const chamberTints=['#060a0e','#0c1013','#0b1016','#0a101a','#071420','#0d101d','#09121a','#061220'].map(color=>new T.Color(color));
const cursorTarget=new T.Vector3(),mirrorTints={calm:new T.Color('#83a6bf'),joy:new T.Color('#d4ae75'),reflective:new T.Color('#9a86c7')};
blocks.forEach((block,i)=>block.userData.normalized=new T.Vector3((i%6-2.5)*.65,(Math.floor(i/6)%3-1)*.65,(Math.floor(i/18)-.5)*.65));
let pushed=0;view={pushTarget:0,selectedRole:0,samplePerformance:(elapsed,idle)=>quality.sample(elapsed,idle),update(depth,t,dt){
 if(modalOpen&&!renderInvalidated&&Math.abs(pushed-this.pushTarget)<.001)return;
 const mobile=innerWidth<601,active=Math.round(depth),drift=reduced?0:Math.sin(t*.13)*.025;
 const tintFloor=Math.min(Math.floor(depth),LAST_FLOOR-1);
 scene.fog.color.copy(chamberTints[tintFloor]).lerp(chamberTints[tintFloor+1],cinematicEase(clamp(depth-tintFloor)));
 pushed+=(this.pushTarget-pushed)*(1-Math.exp(-dt*5));

 const leg=Math.min(Math.floor(depth),LAST_FLOOR-1),travel=depth>=LAST_FLOOR?1:depth-leg;
 if(reduced){camera.position.set(mobile?.8:0,1.1-depth*13,13.7-pushed*1.1);camera.lookAt(mobile?.8:0,-depth*13,0);camera.fov=40;}
 else {
  const path=flightPath(leg,mobile),parameter=path.position.getUtoTmapping(travel);path.position.getPoint(parameter,flightPoint);path.target.getPoint(parameter,flightTarget);
  camera.position.copy(flightPoint);camera.position.x+=drift;camera.position.z-=pushed*1.1;
  camera.lookAt(flightTarget);camera.rotateZ(Math.sin(travel*Math.PI)**2*(leg%2?1:-1)*.014);
  camera.fov=40+Math.sin(travel*Math.PI)**4*7;
 }
 camera.updateProjectionMatrix();
 cursorLight.position.lerp(cursorTarget.set(pointer.x*6,3+pointer.y*4-depth*13,6),1-Math.exp(-dt*8));
 top.position.set(2+Math.sin(t*.19)*2,9-depth*13,5);rim.position.y=1-depth*13;
 top.target.position.set(2,-depth*13,0);rim.target.position.set(2,-depth*13,0);pearlMaterial.uniforms.uTime.value=t;
 halo.visible=active>=1&&active<=5;halo.position.set(mobile?2.3:3.45,-active*13+(mobile?2.1:1.65),-1.1);halo.scale.setScalar(mobile?.31:.67);haloMat.opacity=.15*(1-Math.abs(depth-active)*2);halo.rotation.z=reduced?0:Math.sin(t*.08)*.04;
 for(let i=0;i<groups.length;i++){
 const g=groups[i],objectFloor=objectFloors[i],isProject=i>=4&&i<=6,isResearch=[2,3,11].includes(i),isCollection=objectFloor>=1&&objectFloor<=5;
 if(Math.abs(objectFloor-depth)>=.95){g.visible=false;continue;}
 if(isProject||isResearch){
  const target=i===(isProject?exhibitIndex():researchIndex())?1:0;
  exhibitFades[i]=reduced||Math.abs(target-exhibitFades[i])<.001?target:exhibitFades[i]+(target-exhibitFades[i])*(1-Math.exp(-dt*6));
  if(g.userData.fadeApplied!==exhibitFades[i]){
   g.userData.fadeMaterials.forEach(({material,opacity,transparent,depthWrite})=>{material.opacity=opacity*exhibitFades[i];material.transparent=transparent||exhibitFades[i]<.999;material.depthWrite=depthWrite&&exhibitFades[i]>.99;});
   g.userData.fadeApplied=exhibitFades[i];
  }
 }
 g.visible=Math.abs(objectFloor-depth)<.95&&(!(isProject||isResearch)||exhibitFades[i]>.005);
 if(g.visible&&!reduced&&!modalOpen&&!(drag.down&&objectFloor===active))objectTimes[i]+=dt;
 const phase=objectTimes[i],rest=g.userData.restRotation;
 g.scale.setScalar(i===0?(mobile?Math.min(.54,innerWidth/innerHeight*1.1):.94):i===8?1.4:(isCollection?(mobile?(i===7?.24:.32):(i===7?.6:isProject?.68:.76)):(mobile?.85:1.15)));
 g.position.x=i===0?(mobile?.8:.6):(isCollection?(mobile?2.3:3.45):(mobile?.45:2.7));
 g.position.y=i===0?(mobile?2.1:.55):-objectFloor*13+(isCollection?(mobile?2.1:1.65):(mobile?2.4:.35));
 if(g.visible)g.rotation.set(rest.x,rest.y+phase*turnRates[i]+(objectFloor===active?drag.rotation:rotations[objectFloor]),rest.z);
}const unlock=smooth(clamp((smoothProgress-.08)/.5)),heroTime=objectTimes[0];
heroHologram.update(heroTime,dt,pointer,unlock,!reduced&&!modalOpen,quality.pixelRatio);exhibitFinish.update(objectTimes);const shaftReveal=entranceState(depth).shaft;shaft.update(shaftReveal,camera);
floorRings.forEach(({ring,floor},i)=>{const dist=Math.abs(i-depth),layerFade=1-cinematicEase(clamp((dist-1)/.6));ring.visible=floor.visible=shaftReveal>.0001&&dist<1.6;floor.material.uniforms.uReveal.value=shaftReveal*layerFade;const phase=smooth(clamp((depth-i-.06)/.54));floor.material.uniforms.uDissolve.value=phase;ring.material.opacity=shaftReveal*layerFade*(.07+Math.sin(phase*Math.PI)*.16);ring.scale.setScalar(1+Math.sin(phase*Math.PI)*.035);});if(mirrorMat.userData.shader)mirrorMat.userData.shader.uniforms.uRipple.value=objectTimes[4]*.22;if(groups[4].visible)mirrorMat.color.lerp(mirrorTints[emotion],1-Math.exp(-dt*3));if(groups[5].visible)lockB.position.x+=( (escrow===3?1.6:.65)-lockB.position.x)*(1-Math.exp(-dt*4));if(groups[6].visible)blocks.forEach((b,i)=>{const base=b.userData.base;const target=morph?b.userData.normalized:base;b.position.lerp(target,1-Math.exp(-dt*4));b.rotation.x=0;b.rotation.z=0;});if(groups[7].visible)pillars.forEach((p,i)=>{p.material.emissive.set(i===this.selectedRole?'#162d41':'#000000');});if(groups[8].visible)finalStrips.forEach((s,i)=>{s.rotation.y=s.userData.baseY+Math.sin(t*.15+i)*.04;s.scale.setScalar(1+(1-clamp(depth-(LAST_FLOOR-1)))*.7);});lastOrb.scale.setScalar(1+Math.sin(t*.7)*.015);if(!reduced&&groups[3].visible){const a=rainPoints.geometry.attributes.position;for(let i=0;i<a.count;i++){a.array[i*3+1]-=dt*.28;if(a.array[i*3+1]<-3.5)a.array[i*3+1]=3.5;}a.needsUpdate=true;}dust.rotation.y=Math.sin(t*.02)*.05;renderer.render(scene,camera);renderInvalidated=false;}};
window.addEventListener('resize',()=>{renderInvalidated=true;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);quality.resize({width:innerWidth,height:innerHeight,pixelRatio:devicePixelRatio});});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();document.body.classList.add('no-webgl');document.body.classList.remove('hero-ready');heroReady=false;view=null;});
view.update(progressState(smoothProgress),motionTime,0);heroReady=true;document.body.classList.add('hero-ready');
if(renderer.compileAsync&&renderer.extensions?.has('KHR_parallel_shader_compile')&&window.requestIdleCallback)window.requestIdleCallback(()=>{renderer.compileAsync(scene,camera).catch(()=>{});});
}
init3D().catch(err=>{console.warn('3D unavailable; using the lightweight visual fallback.',err);document.body.classList.add('no-webgl');});
