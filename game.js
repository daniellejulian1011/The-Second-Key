/* THE SECOND KEY · Static GitHub Pages game. No game engine, backend, tracking or paywall required. */
'use strict';
(() => {
const TAU=Math.PI*2, PI=Math.PI, $=id=>document.getElementById(id);
const STORE='the-second-key-save-v2', PREF='the-second-key-settings-v2', ENDINGS='the-second-key-endings-v2';
const DAYS=['A Normal Friday','The First Call','The House Isn\'t Safe','The Power Fails','Until Morning'];
const ENDING_DATA=[
 ['No More Keys','The spare key is evidence now. Evelyn survives, Nathaniel is arrested, and the doors finally belong to her again.','Secret best ending'],
 ['Blue Lights','A police car pulls into the driveway. Evelyn survives, but Nathaniel disappears before the deputy can detain him.','Good ending'],
 ["The Neighbor’s Porch",'She stumbles through the rain and pounds on the nearest porch door. A light clicks on. Someone believes her.','Escape ending'],
 ['The Back Gate','She slips beyond the fence and into the woods. The house disappears in the rain. Nathaniel is still out there.','Escape ending'],
 ['One Last Message','Evelyn never reaches the road, but the recording makes its way to Deputy Ortiz. This time, the evidence speaks.','Bittersweet ending'],
 ['Dinner for Two','Two plates. Two glasses. Every chair pushed in neatly. Nathaniel calls it a beginning.','Dark ending'],
 ['You Let Him In','Nathaniel crosses the threshold willingly opened to him. His gentle expression finally falls away.','Bad ending'],
 ['The Hollow Ring','An unanswered telephone rings inside an empty house. Rain washes the muddy footprints from the porch.','Failure ending']
];
const ROOMS={
 living:{name:'Price House — Living Room',links:{s:'foyer',w:'kitchen',e:'dining'},hide:'behind the sofa',ambient:'A comforting room that feels less familiar by the minute.'},
 foyer:{name:'Price House — Front Foyer',links:{n:'living',e:'garage',s:'porch',u:'hall'},hide:'the coat closet',ambient:'The front door is shut. The chain is dangling loose.'},
 kitchen:{name:'Price House — Kitchen',links:{e:'living',n:'dining',w:'basement',s:'yard'},hide:'beneath the kitchen table',ambient:'The corded telephone sits beside the sink. The back door faces the rain.'},
 dining:{name:'Price House — Dining Room',links:{w:'living',s:'kitchen'},hide:'behind the buffet cabinet',ambient:'There are six chairs at the family table. No one is here.'},
 hall:{name:'Upstairs — Hallway',links:{d:'foyer',e:'evelyn',n:'parents',w:'bathroom'},hide:'the linen closet',ambient:'The floorboards give a soft, unforgiving creak.'},
 evelyn:{name:'Upstairs — Evelyn’s Bedroom',links:{w:'hall'},hide:'beneath the bed',ambient:'The only room that still feels like hers.'},
 parents:{name:'Upstairs — Parents’ Bedroom',links:{s:'hall'},hide:'the wardrobe',ambient:'The answering machine is blinking.'},
 bathroom:{name:'Upstairs — Bathroom',links:{e:'hall'},hide:'behind the shower curtain',ambient:'The mirror reflects a room whose door is not quite shut.'},
 basement:{name:'Basement — Utility & Laundry',links:{e:'kitchen',s:'yard'},hide:'between the shelves',ambient:'The breaker panel rattles in the dark.'},
 yard:{name:'Price House — Back Yard',links:{n:'kitchen',w:'garage',s:'porch',e:'basement'},hide:'behind the rain barrels',ambient:'Wet grass. A locked fence gate. No one should be outside.'},
 garage:{name:'Price House — Garage',links:{w:'foyer',e:'yard'},hide:'behind the family car',ambient:'A parked car, a toolbox, and the sharp smell of gasoline.'},
 porch:{name:'Front Porch & Driveway',links:{n:'foyer',w:'yard'},hide:'behind the porch column',ambient:'The neighbor’s porch is a dark shape across the street.'}
};
const DIR={n:{x:0,z:-3.15,a:0},e:{x:3.15,z:0,a:PI/2},s:{x:0,z:3.15,a:PI},w:{x:-3.15,z:0,a:-PI/2},u:{x:1.3,z:-2.2,a:0},d:{x:-1.3,z:2.2,a:PI}};
const OPP={n:'s',s:'n',e:'w',w:'e',u:'d',d:'u'};
const INTERACTABLES={
 living:[{id:'tv',label:'Inspect TV',x:2.1,z:-2.4},{id:'livingPhone',label:'Answer telephone',x:-1.6,z:-2.0},{id:'familyPhoto',label:'Examine photograph',x:1.3,z:1.8}],
 foyer:[{id:'frontDoor',label:'Inspect front door',x:0,z:2.7},{id:'chain',label:'Fasten security chain',x:1.6,z:2.7},{id:'frontCloset',label:'Look in coat closet',x:-2.5,z:-1}],
 kitchen:[{id:'mud',label:'Inspect muddy mark',x:-1.5,z:-2.6},{id:'backDoor',label:'Examine back door',x:0,z:2.8},{id:'kitchenPhone',label:'Use telephone',x:1.5,z:-2.4},{id:'drawer',label:'Open kitchen drawer',x:2.6,z:0.6},{id:'kitchenLights',label:'Kitchen light switch',x:-2.6,z:1.2}],
 dining:[{id:'table',label:'Examine dining table',x:0.4,z:-1.8},{id:'familyAlbum',label:'Browse family album',x:-2.4,z:1.7}],
 hall:[{id:'hallPicture',label:'Inspect crooked portrait',x:1.4,z:-2.7},{id:'hallCloset',label:'Check hall closet',x:-1.7,z:1.9}],
 evelyn:[{id:'camera',label:'Pick up camera',x:-1.6,z:-2.2},{id:'diary',label:'Read Evelyn’s diary',x:1.4,z:1.0},{id:'bedWindow',label:'Look out bedroom window',x:1.8,z:-2.3},{id:'torch',label:'Pick up flashlight',x:-2.4,z:1.8}],
 parents:[{id:'answerMachine',label:'Play answering machine',x:-2,z:-2.3},{id:'repairReceipt',label:'Read repair receipt',x:1.8,z:1.7},{id:'parentsPhone',label:'Use upstairs telephone',x:2.1,z:-1.7}],
 bathroom:[{id:'mirror',label:'Inspect mirror',x:-1.2,z:-2.6},{id:'bathCabinet',label:'Check medicine cabinet',x:2.1,z:-2.0}],
 basement:[{id:'breaker',label:'Inspect breaker panel',x:2.5,z:-1.4},{id:'cassette',label:'Check tape recorder',x:-1.5,z:-2.1},{id:'cellar',label:'Examine storm-cellar door',x:.2,z:2.8},{id:'box',label:'Search technician’s box',x:-2.5,z:1.8}],
 yard:[{id:'gate',label:'Approach back gate',x:2.3,z:1.8},{id:'neighbor',label:'Look towards neighbor',x:-2.4,z:-1.5},{id:'prints',label:'Examine footprints',x:0.6,z:-2.1}],
 garage:[{id:'car',label:'Inspect family car',x:-1.5,z:-2.0},{id:'toolbox',label:'Inspect repair toolbox',x:2.3,z:1.3}],
 porch:[{id:'mailbox',label:'Inspect mailbox',x:2.4,z:-1.4},{id:'street',label:'Look down the street',x:0,z:2.6}]
};
const CLUES={mud:'Fresh shoeprints from the back door — size eleven. They were made tonight.',drawer:'A photograph of Evelyn asleep on the couch. The inscription reads: "You looked so peaceful. I didn’t want to wake you."',repairReceipt:'A service receipt. September 4, 1990. Nathaniel Cross repaired the electrical panel and inspected the downstairs door.',box:'Inside the technician’s tool case: a key-copy invoice, hand-drawn diagrams of the Price house, and an appointment scheduled without permission.',cassette:'A T-120 cassette labeled "FOR YOU". His calm voice lists her daily routines and the hours her parents are away.',familyPhoto:'Someone has turned the family portrait around. Its hook is still warm from someone’s hand.',familyAlbum:'Photographs of happier summers. One photograph has been carefully removed.',hallPicture:'This frame was straight an hour ago. The dust beneath it is disturbed.',prints:'Heavy boot prints lead from the fence to the kitchen. Someone has made this trip more than once.',diary:'August 15: Evelyn helped a customer named Nathaniel at Redbird Video after he cut his hand. Nothing about the encounter seemed unusual.',answerMachine:'Gloria Price: "The electrician was such a pleasant young man. I left the extra house key on the counter for him."',toolbox:'A roll of electrical tape marked CROSS. There is a fresh imprint of a house key pressed into soft putty.'};
const ITEMS=[['flashlight','🔦','FLASHLIGHT'],['keys','🗝','KEYS'],['camera','📷','CAMERA'],['cassette','📼','TAPE'],['photo','▧','PHOTO'],['note','✉','LETTER']];
const DIFF={easy:{speed:.64,sight:2.6,hearing:.65,search:.24,deathDist:.75},normal:{speed:.88,sight:3.3,hearing:1,search:.46,deathDist:.85},nightmare:{speed:1.2,sight:4.3,hearing:1.5,search:.78,deathDist:1.0}};
const DEFAULT_PREF={difficulty:'normal',volume:.42,voices:true,jumpscares:true,shake:true,flashes:true,subtitles:true};
let pref={...DEFAULT_PREF,...readJSON(PREF,{})}, save=readJSON(STORE,null), s=null;
let images={}, keys={}, touches=new Set(), drag=null, lastFrame=0, aiAccumulator=0, renderFrame=0, lastHud=0, toastTimeout=0, shakeUntil=0, doNotAutoAdvanceUntil=0, inputLocked=false, activeChoice=null, firstUserGesture=false, joystickState={}, transitioning=false;
const clamp=(a,b,c)=>Math.max(b,Math.min(c,a));
const norm=a=>(a%TAU+TAU)%TAU;
const diff=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
function readJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
const saveJSON=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch(e){console.warn('Storage unavailable:',e)}};
const now=()=>performance.now();
const room=()=>ROOMS[s.room];
function freshGame(chapter=0){return {version:2,room:'living',x:0,z:.5,yaw:0,pitch:0,clock:21*60+15,chapter:0,objective:'Investigate the strange noise in the kitchen.',flags:{},visited:['living'],evidence:[],photos:[],items:['flashlight'],equipped:'flashlight',flashlight:false,cameraMode:false,film:6,hidden:null,alarm:0,noisyUntil:0,lastNoiseRoom:null,secondsPlayed:0,policeCalledAt:null,phoneAnswered:false,lightOut:false,sessionEnd:false,lastSafeRoom:'living',checkpoint:null,npc:{room:'yard',x:1,z:-2.2,mode:'lurking',targetRoom:'yard',xTarget:1,zTarget:-2.2,linger:0,searchAt:0,lastSeen:0},ending:null,voicePlayed:[]};}
function timeLabel(t){let hr=Math.floor(t/60)%24;return `${hr%12||12}:${String(Math.floor(t)%60).padStart(2,'0')} ${hr>=12?'PM':'AM'}`;}
function showScreen(id){['main-menu','game-screen','death-screen','ending-screen'].forEach(name=>$(name).classList.toggle('hidden',name!==id));}
function saveGame(){if(!s||s.sessionEnd)return;const d=JSON.parse(JSON.stringify(s));delete d.photosThumbs;saveJSON(STORE,d);save=d;}
function checkpoint(){if(!s||s.sessionEnd)return;const cp=JSON.parse(JSON.stringify(s));cp.checkpoint=null;s.checkpoint=cp;saveGame();}
function loadCheckpoint(){let cp=s?.checkpoint;if(!cp&&save?.checkpoint)cp=save.checkpoint;if(!cp)cp=save;if(!cp){startGame();return}enterGame({...freshGame(),...structuredClone(cp),sessionEnd:false});}
function navigateToMenu(){stopVoice();s=null;inputLocked=false;transitioning=false;showScreen('main-menu');$('modal').classList.add('hidden');$('portrait-dialog').classList.add('hidden');}
function startGame(chapter=0){s=freshGame();enterGame(s);if(chapter>0){s.chapter=chapter;s.clock=[21*60+15,22*60+47,23*60+20,23*60+54,24*60+10][chapter];if(chapter>=1){s.flags.mud=true;s.evidence.push('mud');s.phoneAnswered=chapter>1;s.flags.called=true;}if(chapter>=2){s.npc.mode='search';s.npc.room='kitchen';s.npc.x=0;s.npc.z=2.7;s.flags.entry=true;}if(chapter>=3){s.lightOut=true;s.npc.mode='search';}if(chapter>=4){s.flags.drawer=true;s.flags.box=true;s.evidence.push('drawer','box');}setDialog('EVELYN',chapter===1?'Why is the telephone ringing at this hour?':chapter===2?'The photograph… he has been inside.':'The footsteps are coming from downstairs.');checkpoint();}else intro();}
function enterGame(data){s={...freshGame(),...data};s.flags={...data.flags};s.npc={...freshGame().npc,...data.npc};s.yaw=Number(s.yaw||0);s.pitch=Number(s.pitch||0);s.checkpoint=data.checkpoint||null;if(!s.visited.includes(s.room))s.visited.push(s.room);firstUserGesture=true;audioResume();showScreen('game-screen');$('modal').classList.add('hidden');$('portrait-dialog').classList.add('hidden');inputLocked=false;loadRoomArt();updateInventory();updateChoices();updateHUD();$('viewport').focus();saveGame();}
function intro(){setDialog('EVELYN','Mom and Dad won’t be home until tomorrow. Just me, an old movie, and this rain.');toast('FRIDAY · OCTOBER 26 · 1990');checkpoint();}
function toast(t,ms=3600){const el=$('toast');el.textContent=t;el.classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('visible'),ms);}
let voiceAudio=null;
function playClip(file,force=false){if((!pref.voices&&!force)||pref.volume<=0)return false;try{if(voiceAudio){voiceAudio.pause();voiceAudio=null}voiceAudio=new Audio('assets/audio/'+file+'.ogg');voiceAudio.volume=clamp(pref.volume*.95,0,1);const result=voiceAudio.play();if(result&&typeof result.catch==='function')result.catch(()=>{});return true}catch(e){console.warn('Recorded audio unavailable:',e);return false}}
function speak(text,who){if(!pref.voices)return;stopVoice();let clip=null;if(who==='NATHANIEL'){if(text.startsWith('Evelyn? Oh'))clip='nathaniel-call';else if(text.startsWith('Evelyn, darling'))clip='nathaniel-darling';else if(text.startsWith('The curtains'))clip='nathaniel-window';}else if(who==='APRIL')clip='april';else if(who==='DEPUTY ORTIZ')clip='deputy';else if(who==='GLORIA')clip='gloria';if(clip&&playClip(clip))return;if(!('speechSynthesis' in window))return;try{let u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=who==='NATHANIEL'?.8:1.02;u.pitch=who==='NATHANIEL'?.65:1.1;u.volume=Math.min(1,pref.volume*1.4);speechSynthesis.speak(u)}catch(e){console.warn('Voice unavailable',e)}}
function stopVoice(){if(voiceAudio){voiceAudio.pause();voiceAudio=null}try{speechSynthesis.cancel()}catch{}}
function setDialog(who,text,voice=true){$('speaker-name').textContent=who;$('dialogue-text').textContent=text;$('dialogue-panel').style.display=(pref.voices&&!pref.subtitles)?'none':'';if(voice&&['NATHANIEL','APRIL','DEPUTY ORTIZ','GLORIA'].includes(who))speak(text,who);}
function monologue(text){setDialog('EVELYN',text,false)}
function narrator(text){setDialog('NARRATOR',text,false)}
function soundNoise(amount=.2){if(!s)return;s.alarm=clamp(s.alarm+amount,0,1);s.noisyUntil=now()+5500;s.lastNoiseRoom=s.room;}
function addClue(id){if(!s.evidence.includes(id)){s.evidence.push(id);toast(`EVIDENCE DISCOVERED · ${s.evidence.length} CLUES`);saveGame()}s.flags[id]=true;}
function grantItem(id){if(!s.items.includes(id)){s.items.push(id);updateInventory();toast('ITEM ACQUIRED · '+id.toUpperCase())}}
function advanceChapter(n){if(n<=s.chapter||n>DAYS.length-1)return;s.chapter=n;const times=[21*60+15,22*60+47,23*60+20,23*60+54,24*60+8];s.clock=Math.max(s.clock,times[n]);if(n===1){audioPhone();setDialog('PHONE','… RING … RING … The sound fills the entire house.',false);s.flags.phoneRinging=true;}if(n===2){s.npc.mode='search';s.flags.entry=true;s.npc.targetRoom='kitchen';setDialog('NATHANIEL','Evelyn, darling… I would hate for you to be frightened. Unlock the door.');}if(n===3){s.lightOut=true;s.flags.outage=true;audioThunk();setDialog('SFX','… THUD … The refrigerator stops humming. Every light goes out.',false);s.npc.mode='search';}if(n===4){s.npc.mode='search';narrator('A key scrapes against a lock. Somewhere inside the house, a door clicks open.');}checkpoint();updateHUD();updateChoices();saveGame();}
function loadRoomArt(){const path='assets/'+s.room+'.svg';for(const name of ['pano-a','pano-b','pano-c'])$(name).src=path;updateHUD();updateChoices();}
function flag(name){return !!s.flags[name]}
function roomTransition(target,sourceDir=null,fromNPC=false){if(!ROOMS[target])return false;if(!fromNPC){if(s.hidden){s.hidden=null;}s.room=target;if(!s.visited.includes(target))s.visited.push(target);const opos=OPP[sourceDir];const spot=DIR[opos]||{x:0,z:0};s.x=clamp(spot.x*.77,-2.9,2.9);s.z=clamp(spot.z*.77,-2.9,2.9);if(sourceDir==='u'||sourceDir==='d'){s.x=0;s.z=0;}s.lastSafeRoom=target;loadRoomArt();setDialog('EVELYN',ROOMS[target].ambient,false);soundNoise(.08);playCreak();if(s.chapter>=2&&target==='basement'&&!flag('basementWarning')){s.flags.basementWarning=true;setDialog('SFX','The stairs creak under your weight. A floorboard above you answers.',false)}updateChoices();saveGame();}return true;}
function nearbyExitFor(roomId,x,z){const r=ROOMS[roomId];for(const [d,to] of Object.entries(r.links)){const p=DIR[d];if(d==='u'||d==='d')continue;let ed=(d==='n'&&z<-3.02)||(d==='s'&&z>3.02)||(d==='e'&&x>3.02)||(d==='w'&&x<-3.02);if(ed&&Math.hypot(x-p.x,z-p.z)<1.65)return {dir:d,to}}return null;}
function transitionVia(to){const entry=Object.entries(room().links).find(([,v])=>v===to);if(!entry)return;let dir=entry[0];if(!s.hidden){roomTransition(to,dir);}else toast('LEAVE YOUR HIDING SPOT FIRST');}
function showStoryLine(who,quote){if(s.sessionEnd)return;inputLocked=true;$('portrait-dialog').classList.remove('hidden');$('portrait-name').textContent=who;$('portrait-line').textContent=quote;speak(quote,who);}
function dismissStory(){inputLocked=false;$('portrait-dialog').classList.add('hidden');updateChoices();}
function action(id){if(!s||s.sessionEnd||inputLocked)return;let used=true;
 switch(id){
 case 'tv':narrator('The CRT hisses with static. In the black glass, you could have sworn there was a silhouette in the hall.');audioStatic();if(s.chapter>1)soundNoise(.17);break;
 case 'mud':addClue('mud');monologue('Mud? I cleaned this floor after dinner. These prints are too large to be mine.');if(s.chapter===0)advanceChapter(1);break;
 case 'livingPhone':case 'kitchenPhone':case 'parentsPhone':if(s.chapter===0){advanceChapter(1);break}openPhoneChoices();return;
 case 'familyPhoto':addClue('familyPhoto');monologue(CLUES.familyPhoto);break;
 case 'familyAlbum':addClue('familyAlbum');monologue(CLUES.familyAlbum);break;
 case 'frontDoor':
  if(s.chapter>=2){showPrompt('FRONT DOOR','The chain rattles. Someone has tested the lock.',[
   {label:'Look through the peephole',do:()=>{setDialog('EVELYN','Empty porch. Wait… a coat sleeve disappears behind the mailbox.');s.flags.peephole=true}},
   {label:'Go outside',do:()=>transitionVia('porch')},{label:'Close the door',do:()=>monologue('Locked. This one, at least.')}
  ]);}else monologue('The door is locked. Mom asked me to leave the porch light on.');break;
 case 'chain':s.flags.chain=true;monologue('Chain fastened. It might slow down an intruder, but it won’t stop someone with the right key.');soundNoise(.16);break;
 case 'frontCloset':case 'hallCloset':if(s.chapter>=2){hide()}else monologue('A familiar smell of cedar and mothballs. Nothing unusual.');break;
 case 'backDoor':
  if(s.chapter<1){monologue('The rain is coming down hard. The back door is locked.');break}
  showPrompt('THE BACK DOOR','A key scrapes against the cylinder. Then it stops.',[
    {label:'Hold the door shut',do:()=>{s.flags.backHeld=true;soundNoise(.22);monologue('I pull against the handle. Something pulls back. The pressure slowly releases.')}},
    {label:'Turn off the kitchen light',do:()=>action('kitchenLights')},
    {label:'Open the door to Nathaniel',danger:true,do:()=>ending(6)},
    {label:'Back away quietly',do:()=>{s.x=0;s.z=0;monologue('I step away. The knob turns once more.')}}
  ]);break;
 case 'kitchenLights':s.flags.lightOff=!s.flags.lightOff;monologue(s.flags.lightOff?'I flick the switch. The kitchen falls into shadow.':'I switch on the kitchen light.');soundNoise(.08);break;
 case 'drawer':addClue('drawer');grantItem('photo');monologue(CLUES.drawer);s.alarm=Math.max(s.alarm,.18);if(s.chapter<2)advanceChapter(2);else if(s.chapter===2)advanceChapter(3);break;
 case 'table':monologue('The table is set for dinner. A second place setting has been added since this afternoon.');s.flags.table=true;break;
 case 'hallPicture':addClue('hallPicture');monologue(CLUES.hallPicture);break;
 case 'camera':grantItem('camera');s.equipped='camera';s.cameraMode=true;updateInventory();monologue('My 35mm camera. There are six frames of film left. I should photograph anything suspicious.');break;
 case 'torch':grantItem('flashlight');s.equipped='flashlight';s.flashlight=true;updateInventory();monologue('The beam still works. The batteries won’t last forever.');break;
 case 'diary':addClue('diary');monologue(CLUES.diary);break;
 case 'bedWindow':if(s.chapter>=1){doLightning();showStoryLine('NATHANIEL','The curtains are open, Evelyn. You know I can see you.')}else monologue('Nothing except maple trees, streetlights, and rain.');break;
 case 'answerMachine':addClue('answerMachine');grantItem('cassette');monologue(CLUES.answerMachine);playClip('gloria');audioStatic();if(s.evidence.length>=3){s.flags.evidenceSent=true;toast('RECORDED MESSAGE PREPARED FOR DEPUTY ORTIZ');}break;
 case 'repairReceipt':addClue('repairReceipt');monologue(CLUES.repairReceipt);break;
 case 'mirror':monologue('For half a second, I think someone is standing behind me. No. Just the bathroom door.');doLightning();break;
 case 'bathCabinet':monologue('A first-aid kit. Bandages. It reminds me of the night I first met Nathaniel.');s.flags.bandage=true;break;
 case 'breaker':
  if(!s.lightOut){monologue('The switches are all in place. Nathaniel worked on this panel in September.');break}
  if(flag('breaker')){monologue('The power is back, but the lights are still flickering.');break}
  s.flags.breaker=true;s.lightOut=false;s.alarm=clamp(s.alarm+.28,0,1);audioBreaker();monologue('The breaker slams into place. The lights return. Something moves behind the washing machine.');if(s.chapter<4)advanceChapter(4);break;
 case 'cassette':addClue('cassette');grantItem('cassette');monologue(CLUES.cassette);audioStatic();if(s.chapter===2)advanceChapter(3);break;
 case 'box':addClue('box');grantItem('keys');monologue(CLUES.box);if(s.chapter<4)advanceChapter(4);break;
 case 'cellar':
  showPrompt('STORM-CELLAR EXIT','The exterior latch is swollen from the rain. It might be another way outside.',[
   {label:'Force the storm-cellar door',do:()=>{soundNoise(.37);transitionVia('yard')}},
   {label:'Listen at the door',do:()=>{narrator('Wind scratches at the hatch. Beneath it: the unmistakable click of a key.') }},
   {label:'Leave it shut',do:()=>monologue('Not yet.')}
  ]);break;
 case 'gate':
  if(s.chapter<2){monologue('I don’t want to go out in this storm.');break}
  showPrompt('THE BACK GATE','Beyond the fence, the town road leads toward the neighbor’s house.',[
   {label:'Escape through the back gate',do:()=>ending(3)},
   {label:'Run to the neighbor’s porch',do:()=>ending(2)},
   {label:'Check whether he followed',do:()=>{monologue('Branches stir under the streetlamp. I can’t tell if it is the wind.');s.flags.gateChecked=true}}
  ]);break;
 case 'neighbor':if(s.chapter>=2)ending(2);else monologue('Their kitchen light is on, a block away.');break;
 case 'prints':addClue('prints');monologue(CLUES.prints);break;
 case 'car':monologue('Dad left the keys inside the house. And the ignition cable looks freshly disconnected.');s.flags.carSabotage=true;break;
 case 'toolbox':addClue('toolbox');monologue(CLUES.toolbox);break;
 case 'mailbox':monologue('PRICE · 2147. The mailbox door is ajar. Someone has been here.');s.flags.mailbox=true;break;
 case 'street':if(s.chapter>=2)ending(2);else monologue('A lonely stretch of road under yellow streetlights. No cars.');break;
 default:used=false;
 }
 if(used){s.clock+=id==='backDoor'?1:0.4; if(s.chapter===2&&s.evidence.length>=3&&flag('drawer'))advanceChapter(3);saveGame();updateChoices();updateInventory();updateHUD();}
}
function showPrompt(title,intro,options){if(s.sessionEnd)return;setDialog(title,intro,false);activeChoice=options;updateChoices();}
function hide(){if(s.hidden){s.hidden=null;monologue('I crawl out slowly.');$('darkness').style.opacity='0';}else{s.hidden=room().hide;s.flags.hid=true;monologue(`I slide into ${s.hidden}. I try not to breathe too loudly.`);$('darkness').style.opacity='.54';}soundNoise(.03);updateChoices();saveGame();}
function openPhoneChoices(){
 if(s.lightOut&&s.chapter>=3){monologue('The landline still works. For how much longer?');}
 const options=[];
 if(!s.phoneAnswered){options.push({label:'Answer the ringing telephone',do:()=>{s.phoneAnswered=true;s.flags.called=true;audioPhone();showStoryLine('NATHANIEL','Evelyn? Oh, good. You’re still awake. Don’t look out the front, sweetheart. I’m at the back.');if(s.chapter<2)advanceChapter(2);}})}
 options.push({label:'Call April Serrano',do:()=>{s.flags.aprilCalled=true;setDialog('APRIL','Evelyn? Call the police. Lock every entrance. I am not leaving you alone in this.');s.alarm=Math.max(s.alarm,.08)}});
 options.push({label:'Call 911 — Deputy Ortiz',do:()=>{
  if(s.policeCalledAt!==null){monologue('The dispatcher already has my address. Help is coming.');return}
  s.policeCalledAt=s.secondsPlayed;s.flags.called911=true;setDialog('DEPUTY ORTIZ','Stay inside, Evelyn. Tell me his name and do not approach him. We are sending a unit.');soundNoise(.15);toast('POLICE DISPATCHED');
 }});
 if(s.policeCalledAt!==null){options.push({label:'Describe Nathaniel and give the evidence',do:()=>{
  if(s.evidence.length>=4&&flag('nathanielPhoto')&&flag('repairReceipt')){ending(0)}else{setDialog('DEPUTY ORTIZ','I need photographs and proof of how he entered. Stay alive and keep the line open.',false)}
 }});}
 if(s.policeCalledAt!==null&&s.secondsPlayed-s.policeCalledAt>48)options.push({label:'Wait for Deputy Ortiz — stay protected',do:()=>ending(1)});
 if(s.evidence.length>=3)options.push({label:'Leave a detailed taped statement',do:()=>{s.flags.evidenceSent=true;grantItem('cassette');setDialog('EVELYN','My name is Evelyn Price. Nathaniel Cross copied my house key. If I do not get out, please take this to the police.',false)}});
 options.push({label:'Put down the receiver',do:()=>monologue('The dial tone sounds impossibly loud.')});showPrompt('TELEPHONE','The telephone cord twists around my fingers.',options);
}
function capturePhoto(is360=false){if(!s||s.sessionEnd||!s.items.includes('camera')){toast('FIND THE CAMERA IN EVELYN’S BEDROOM');return}
 if(s.film<(is360?2:1)){toast('OUT OF FILM');return}
 s.film-=is360?2:1;const v=npcInView();let record={room:s.room,clock:s.clock,yaw:s.yaw,type:is360?'360':'35mm',nathaniel:v,npcAngle:v?norm(Math.atan2(s.npc.x-s.x,-(s.npc.z-s.z))):null,npcDistance:v?distance(s,s.npc):null,number:s.photos.length+1};s.photos.push(record);s.flags.tookPhoto=true;
 if(v){s.flags.nathanielPhoto=true;addClue('nathanielPhoto');toast('THE FIGURE IS VISIBLE IN YOUR PHOTOGRAPH');s.npc.mode='chase';soundNoise(.55)}else{toast(is360?'360° PANORAMA CAPTURED · 2 FRAMES USED':'PHOTOGRAPH CAPTURED · 1 FRAME USED');soundNoise(.4)}
 $('photo-flash').style.opacity=pref.flashes?'.88':'.25';setTimeout(()=>$('photo-flash').style.opacity='0',150);audioCamera();updateInventory();updateChoices();saveGame();}
function npcInView(){if(!s||s.npc.room!==s.room||s.chapter<2)return false;const a=Math.atan2(s.npc.x-s.x,-(s.npc.z-s.z));return Math.abs(diff(a,s.yaw))<.7&&distance(s,s.npc)<6.4;}
function setEquip(id){if(!s||!s.items.includes(id))return;s.equipped=id;s.cameraMode=id==='camera';if(id==='flashlight'){s.flashlight=!s.flashlight;s.cameraMode=false}updateInventory();saveGame()}
function toggleFlashlight(){if(!s||!s.items.includes('flashlight')){toast('NO FLASHLIGHT');return}s.equipped='flashlight';s.cameraMode=false;s.flashlight=!s.flashlight;updateInventory()}
function updateInventory(){if(!s)return;const slots=$('inventory');slots.innerHTML='';let sorted=['flashlight','keys','camera','cassette','photo','note'];sorted.forEach((id,idx)=>{const data=ITEMS.find(a=>a[0]===id);let el=document.createElement('button');el.className='item-slot '+(s.equipped===id?'active ':'')+(!s.items.includes(id)?'empty':'');el.title=data[2];el.innerHTML=`${data[1]}<span>${data[2]}</span>`;el.setAttribute('aria-label',`Equip ${data[2]}`);el.disabled=!s.items.includes(id);el.onclick=()=>setEquip(id);slots.append(el)});
 $('equip-label').textContent=(s.equipped||'nothing').toUpperCase()+(s.equipped==='camera'?` · ${s.film} FRAMES`:'');$('camera-overlay').classList.toggle('hidden',!s.cameraMode);$('film-label').textContent='FILM '+String(s.film).padStart(2,'0');$('camera-button').classList.toggle('hidden',!s.cameraMode);
}
function choicesNow(){if(!s)return[];if(activeChoice){let old=activeChoice;return old.map((o)=>({label:o.label,danger:o.danger,do:o.do,temporary:true}));}
 const c=[];const add=(label,fn,danger=false)=>c.push({label,do:fn,danger});
 if(s.hidden){add('Leave hiding place',hide);add('Stay completely still',()=>{s.alarm=Math.max(0,s.alarm-.1);monologue('I count my breaths in the darkness.')});if(s.cameraMode)add('Take a photograph',()=>capturePhoto(false));return c}
 if(s.room==='living'&&s.chapter===0){add('Go investigate the kitchen',()=>transitionVia('kitchen'));add('Watch the TV',()=>action('tv'))}
 if(s.chapter===1&&(s.room==='living'||s.room==='kitchen'||s.room==='parents'))add('Answer the ringing phone',()=>openPhoneChoices());
 if(s.chapter>=2&&s.npc.room===s.room&&distance(s,s.npc)<3.3){add('HIDE — He is close',hide);add('Run to another room',()=>{soundNoise(.45);let next=Object.values(room().links)[0];transitionVia(next)});add('Give yourself up to Nathaniel',()=>ending(5),true)}
 const near=(INTERACTABLES[s.room]||[]).filter(o=>distance(s,o)<4.8).slice(0,6);
 near.forEach(o=>add(o.label,()=>action(o.id),o.id==='backDoor'));
 if(s.chapter>=2&&s.room==='living'&&!c.some(o=>o.label==='Hide behind the sofa'))add('Hide behind the sofa',hide);
 if(s.chapter>=2&&s.room!=='living')add('Hide in '+room().hide,hide);
 const exits=Object.entries(room().links);
 exits.forEach(([d,to])=>add((d==='u'?'Go upstairs to ':d==='d'?'Go downstairs to ':'Move to ')+ROOMS[to].name.replace('Price House — ','').replace('Upstairs — ',''),()=>transitionVia(to)));
 if(s.cameraMode){add('Take photograph',()=>capturePhoto(false));if(s.film>=2)add('Capture a 360° panoramic photograph',()=>capturePhoto(true));}
 if(s.chapter>=4&&s.policeCalledAt!==null&&s.secondsPlayed-s.policeCalledAt>=48&&s.room==='foyer')add('Wait for the flashing blue lights',()=>ending(1));
 return c;
}
function updateChoices(){if(!s||s.sessionEnd)return;const opts=choicesNow();const root=$('choice-panel');root.innerHTML='';opts.forEach((c,idx)=>{let button=document.createElement('button');button.className='choice'+(c.danger?' danger':'');button.textContent=c.label;button.setAttribute('aria-label',c.label);button.onclick=()=>{activeChoice=null;c.do();if(s&&!s.sessionEnd){updateChoices();updateHUD();saveGame()}};root.append(button)});}
function updateHUD(){if(!s)return;let objective='';if(s.chapter===0)objective='Investigate the unfamiliar muddy marks.';
 else if(s.chapter===1)objective='The phone is ringing. Why does he know?';
 else if(s.chapter===2)objective='Secure the house. Find proof of his visits.';
 else if(s.chapter===3)objective='Restore the power or find another way out.';
 else objective=s.policeCalledAt!==null?'Survive until Deputy Ortiz arrives.':'Collect evidence. Escape or summon help.';
 $('room-label').textContent=ROOMS[s.room].name.toUpperCase();$('clock-label').textContent=timeLabel(s.clock);$('chapter-label').textContent='CHAPTER '+['I','II','III','IV','V'][s.chapter]+' · '+DAYS[s.chapter].toUpperCase();$('objective-label').textContent=objective;$('threat-fill').style.width=(s.alarm*100).toFixed(1)+'%';$('status-label').textContent=s.hidden?'HIDING · KEEP STILL':s.npc.mode==='chase'&&s.npc.room===s.room?'HE SEES YOU':s.alarm>.65?'HE HEARD SOMETHING':s.lightOut?'POWER FAILURE':s.npc.room===s.room&&s.chapter>=2?'SOMEONE IS NEARBY':'QUIET';$('darkness').style.opacity=s.hidden?'.65':s.lightOut&&!s.flashlight?'.68':s.flags.lightOff&&s.room==='kitchen'?'.3':'.02';$('flashlight-cone').style.opacity=s.flashlight?1:0;
}
function ending(index){if(!s||s.sessionEnd)return;s.ending=index;s.sessionEnd=true;stopVoice();audioEnding(index);let unlocked=readJSON(ENDINGS,[]);if(!unlocked.includes(index)){unlocked.push(index);saveJSON(ENDINGS,unlocked)}$('ending-count').textContent=String(index+1).padStart(2,'0')+' / 08';$('ending-heading').textContent=ENDING_DATA[index][0].toUpperCase();$('ending-description').textContent=ENDING_DATA[index][1];saveJSON(STORE,null);save=null;showScreen('ending-screen');}
function showDeath(reason='Nathaniel found you. He won’t let you leave again.'){if(!s||s.sessionEnd)return;
 if(s.flags.evidenceSent&&s.evidence.length>=3){ending(4);return}
 let unlocked=readJSON(ENDINGS,[]);if(!unlocked.includes(7)){unlocked.push(7);saveJSON(ENDINGS,unlocked)}
 s.sessionEnd=true;stopVoice();$('death-description').textContent=reason;$('death-heading').textContent='YOU DIED';let previous=readJSON(STORE,null);if(previous)save={...previous,checkpoint:s.checkpoint||previous.checkpoint};showScreen('death-screen');
}
function jumpscare(reason){if(!s||s.sessionEnd||transitioning)return;transitioning=true;inputLocked=true;const el=$('scare');el.style.display=pref.jumpscares?'flex':'none';$('damage-vignette').style.opacity='.82';if(pref.shake){$('viewport').classList.add('screen-shake');$('game-screen').classList.add('screen-shake')}if(pref.flashes)doLightning();audioScream();setDialog('NATHANIEL','EVEEELYN!');setTimeout(()=>{el.style.display='none';$('damage-vignette').style.opacity='0';$('viewport').classList.remove('screen-shake');$('game-screen').classList.remove('screen-shake');transitioning=false;inputLocked=false;showDeath(reason)},pref.jumpscares?1050:300);
}
const view=$('viewport'), panoA=$('pano-a'), panoB=$('pano-b'), panoC=$('pano-c');
let movement={vx:0,vz:0,bob:0,walking:false}, previousRoom=null, hotspotRoom=null;
let currentClosest=null;
function renderPanorama(t){if(!s)return;const w=view.clientWidth,h=view.clientHeight;const imH=h*1.28,imW=imH*3200/900;let shift=norm(s.yaw)/TAU+.125;let parallax=(s.x*Math.cos(s.yaw)+s.z*Math.sin(s.yaw))*22;let left=w/2-imW*shift+parallax+Math.sin(movement.bob)*4;
 const y=(h-imH)/2+clamp(s.pitch,-.62,.62)*h*.36+Math.cos(movement.bob*2)*1.7;
 [panoA,panoB,panoC].forEach((img,i)=>{img.style.left=Math.round(left+imW*(i-1))+'px';img.style.top='0px';img.style.width=Math.round(imW)+'px';img.style.height=Math.round(imH)+'px';img.style.transform=`translateY(${Math.round(y)}px)`});
 const rel=panoramaFOV(w,imW);renderActor(w,h,rel,t);renderHotspots(w,h,rel);
}
function panoramaFOV(w,imW){return Math.min(2.6,w/imW*TAU)}
function projectPoint(px,pz,w,h,fov){let dx=px-s.x,dz=pz-s.z;let ang=Math.atan2(dx,-dz),a=diff(ang,s.yaw);if(Math.abs(a)>fov*.55)return null;let dis=Math.hypot(dx,dz);return {x:w/2+(a/fov)*w,y:h*.52+s.pitch*h*.25+clamp((dis-2)*17,-55,120),dist:dis,a}}
function renderActor(w,h,fov,t){const el=$('nathaniel-sprite');if(s.chapter<2||s.npc.room!==s.room){el.style.display='none';return}
 const p=projectPoint(s.npc.x,s.npc.z,w,h,fov);if(!p||p.dist>6.3){el.style.display='none';return}
 el.style.display='block';const hei=clamp(h*2.15/Math.max(.65,p.dist),95,h*1.85),wid=hei*.49;
 el.style.height=hei+'px';el.style.width=wid+'px';el.style.left=p.x+'px';el.style.top=(h*.69+s.pitch*h*.31+hei*.23+Math.sin(t*.005)*Math.min(7,13/p.dist))+'px';
 el.style.opacity=String(clamp((6.5-p.dist)/2.2,.27,1));el.style.filter=`drop-shadow(6px 9px 11px #000) brightness(${s.lightOut&&!s.flashlight?.3:s.flashlight?.91:.65})`;
}
function hotspotElements(){const h=$('hotspots');h.innerHTML='';if(!s)return;const hotspots=(INTERACTABLES[s.room]||[]).map(o=>({...o,type:'object'}));
 for(const [d,to] of Object.entries(room().links)){const v=DIR[d];hotspots.push({id:'exit-'+to,label:(d==='u'?'GO UPSTAIRS':d==='d'?'GO DOWNSTAIRS':'GO TO ')+ROOMS[to].name.split('—').pop().toUpperCase().trim(),x:v.x,z:v.z,type:'exit',to})}
 hotspots.forEach(o=>{let el=document.createElement('button');el.className='hotspot'+(o.id==='backDoor'?' danger':'');el.textContent=o.label;el.title=o.label;el.dataset.id=o.id;el.style.display='none';el.onclick=(ev)=>{ev.stopPropagation();if(inputLocked)return;if(o.type==='exit')transitionVia(o.to);else action(o.id)};h.append(el);o.element=el});
 return hotspots;
}
let renderedHotspots=[];
function renderHotspots(w,h,fov){if(!s)return;if(s.room!==hotspotRoom){renderedHotspots=hotspotElements();hotspotRoom=s.room;currentClosest=null}
 let minDis=100,closest=null;
 for(const o of renderedHotspots){const p=projectPoint(o.x,o.z,w,h,fov);if(!p||p.dist>4.6||s.hidden){o.element.style.display='none';continue}
 o.element.style.display='block';o.element.style.left=p.x.toFixed(1)+'px';o.element.style.top=(p.y+clamp(64/Math.max(1,p.dist),12,45)).toFixed(1)+'px';let centered=Math.abs(p.a)+p.dist*.06;if(centered<minDis){minDis=centered;closest=o}
 }
 currentClosest=closest;
}
function interactNearest(){if(!s||inputLocked||s.hidden)return;if(currentClosest){if(currentClosest.type==='exit')transitionVia(currentClosest.to);else action(currentClosest.id)}else{toast('LOOK TOWARD AN OBJECT OR USE THE CHOICE PANEL')}}
function tryMove(dt){if(!s||inputLocked||s.hidden||s.sessionEnd)return;
 const forward=Number(keys['KeyW']||keys['ArrowUp']||touches.has('fwd'))-Number(keys['KeyS']||keys['ArrowDown']||touches.has('back'));
 const side=Number(keys['KeyD']||touches.has('right'))-Number(keys['KeyA']||touches.has('left'));
 const turn=Number(keys['KeyE']&&keys['ShiftLeft']||keys['ArrowRight'])-Number(keys['KeyQ']||keys['ArrowLeft']);
 if(turn)s.yaw=norm(s.yaw+turn*dt*1.24);
 const rawX=forward*Math.sin(s.yaw)+side*Math.cos(s.yaw),rawZ=-forward*Math.cos(s.yaw)+side*Math.sin(s.yaw);let len=Math.hypot(rawX,rawZ)||1;
 const moving=!!(forward||side),running=moving&&(keys['ShiftLeft']||keys['ShiftRight']);
 const speed=running?3.25:1.85;let tx=(rawX/len)*speed,tz=(rawZ/len)*speed;const lerp=clamp(dt*7,0,1);
 movement.vx+=(tx-movement.vx)*lerp;movement.vz+=(tz-movement.vz)*lerp;movement.walking=moving;
 if(Math.hypot(movement.vx,movement.vz)<.02)return;
 if(moving)movement.bob+=dt*(running?15:9);
 const before={x:s.x,z:s.z};let nx=s.x+movement.vx*dt,nz=s.z+movement.vz*dt;
 const exit=nearbyExitFor(s.room,nx,nz);if(exit){roomTransition(exit.to,exit.dir);movement.vx*=.4;movement.vz*=.4;return}
 s.x=clamp(nx,-2.98,2.98);s.z=clamp(nz,-2.98,2.98);
 if(moving){if(running){s.alarm=clamp(s.alarm+dt*.04,0,1);s.noisyUntil=now()+950;s.lastNoiseRoom=s.room}else if(Math.random()<dt*.7)playFootstep()}
}
function bfsNext(start,goal){if(start===goal)return start;const q=[start],prev={[start]:null};while(q.length){const cur=q.shift();for(const n of Object.values(ROOMS[cur].links)){if(n in prev)continue;prev[n]=cur;if(n===goal){let node=goal;while(prev[node]!==start&&prev[node]!=null)node=prev[node];return node}q.push(n)}}return null}
function stepNPC(dt){if(!s||s.sessionEnd||s.chapter<2||transitioning)return;
 const n=s.npc, cfg=DIFF[pref.difficulty]||DIFF.normal;
 const d=n.room===s.room?distance(n,s):999;const canSee=n.room===s.room&&!s.hidden&&d<(cfg.sight+(s.flashlight?1.4:0)+(s.lightOut?-1.15:0));
 if(canSee){n.mode='chase';n.lastSeen=s.secondsPlayed;n.targetRoom=s.room;n.xTarget=s.x;n.zTarget=s.z;s.alarm=clamp(s.alarm+dt*.34,0,1)}
 if(s.noisyUntil>now()&&s.lastNoiseRoom&&n.mode!=='chase'){n.targetRoom=s.lastNoiseRoom;n.mode='investigate'}
 if(n.mode==='chase'&&!canSee&&s.secondsPlayed-n.lastSeen>(pref.difficulty==='nightmare'?11:7)){n.mode='search';n.linger=0}
 if(n.room===s.room&&!s.hidden&&d<cfg.deathDist){jumpscare('Nathaniel reaches Evelyn. The last thing she sees is the glint of a copied house key.');return}
 if(s.hidden&&n.room===s.room){
  if(d<2.45&&(s.alarm>.20||n.mode==='chase')){
   n.searchAt+=dt;if(n.searchAt>=(pref.difficulty==='nightmare'?3.2:5.7)){
    n.searchAt=0;audioCreak();setDialog('SFX',`A closet door opens. He is searching ${s.hidden}…`,false);
    if(Math.random()<cfg.search){s.hidden=null;jumpscare('Nathaniel pulls the hiding place open. There is nowhere else to run.');return}
   }
  }else n.searchAt=0;
 }
 let targetRoom=n.targetRoom;
 if(n.mode==='lurking')return;
 if(!targetRoom||n.mode==='search'&&n.linger>11){const candidates=Object.values(ROOMS[n.room].links);targetRoom=candidates[Math.floor(Math.random()*candidates.length)];n.targetRoom=targetRoom;n.linger=0}
 if(n.mode==='investigate'&&n.room===n.targetRoom&&d>6){n.mode='search';n.linger=0}
 if(n.mode==='search')n.linger+=dt;
 if(n.room===s.room&&canSee){n.xTarget=s.x;n.zTarget=s.z;targetRoom=s.room}
 if(n.room===targetRoom){
   if(n.mode==='chase'||n.mode==='investigate'&&n.room===s.room){n.xTarget=s.x;n.zTarget=s.z}
   else if(Math.hypot(n.xTarget-n.x,n.zTarget-n.z)<.28){n.xTarget=-2.3+Math.random()*4.6;n.zTarget=-2.3+Math.random()*4.6}
 }else{
   const next=bfsNext(n.room,targetRoom)||targetRoom;
   const entry=Object.entries(ROOMS[n.room].links).find(([,to])=>to===next);
   if(!entry){n.targetRoom=n.room;return}
   const pos=DIR[entry[0]];
   n.xTarget=pos.x;n.zTarget=pos.z;
   if(Math.hypot(n.x-pos.x,n.z-pos.z)<.31){
    n.room=next;const loc=DIR[OPP[entry[0]]]||DIR.n;n.x=loc.x*.86;n.z=loc.z*.86;
    n.xTarget=0;n.zTarget=0;
    if(n.room===s.room){playCreak();setDialog('SFX','A door creaks open somewhere nearby.',false);s.alarm=clamp(s.alarm+.1,0,1)}
    if(n.room===n.targetRoom&&n.mode!=='chase'){n.mode='search';n.linger=0}
    return;
   }
 }
 const dx=n.xTarget-n.x,dz=n.zTarget-n.z,len=Math.hypot(dx,dz)||1;
 const speed=(n.mode==='chase'?2.16:n.mode==='investigate'?1.35:1.0)*cfg.speed;
 n.x+=dx/len*Math.min(len,dt*speed);n.z+=dz/len*Math.min(len,dt*speed);
 if(n.room===s.room&&d<4&&Math.random()<dt*.19)playFootstep(true);
}
function updateStoryTime(dt){if(!s||s.sessionEnd||inputLocked)return;s.secondsPlayed+=dt;
 if(s.chapter===0&&s.secondsPlayed>95)advanceChapter(1);
 if(s.chapter===1&&s.secondsPlayed>135)advanceChapter(2);
 if(s.chapter===2&&s.secondsPlayed>205)advanceChapter(3);
 if(s.chapter===3&&s.secondsPlayed>320)advanceChapter(4);
 s.clock+=dt/(s.chapter<2?10:4);
 if(s.policeCalledAt!==null&&s.secondsPlayed-s.policeCalledAt>50&&!flag('policeClose')){s.flags.policeClose=true;toast('FAINT SIRENS IN THE DISTANCE');audioSiren()}
 s.alarm=clamp(s.alarm-dt*.02,0,1);
 if(s.alarm>.7&&s.npc.mode==='search')s.npc.mode='investigate';
}
function tick(t){requestAnimationFrame(tick);if(!lastFrame){lastFrame=t;return}let dt=clamp((t-lastFrame)/1000,0,.06);lastFrame=t;
 if(!s||s.sessionEnd||$('game-screen').classList.contains('hidden'))return;
 if(!$('modal').classList.contains('hidden')||!$('portrait-dialog').classList.contains('hidden'))return;
 tryMove(dt);updateStoryTime(dt);aiAccumulator+=dt;if(aiAccumulator>.075){stepNPC(aiAccumulator);aiAccumulator=0}
 if(t-lastHud>650){updateHUD();lastHud=t}
 renderPanorama(t);
}
function playerKeyDown(e){if(!s||s.sessionEnd||$('game-screen').classList.contains('hidden'))return;
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Tab'].includes(e.code))e.preventDefault();
 if(e.repeat){keys[e.code]=true;return}
 if(e.code==='Escape'){openModal('pause');return}
 if(e.code==='Tab'){openModal('map');return}
 if(!$('modal').classList.contains('hidden'))return;
 keys[e.code]=true;
 if(e.code==='KeyE'&&!e.shiftKey)interactNearest();
 if(e.code==='KeyF')toggleFlashlight();
 if(e.code==='KeyC'){if(s.items.includes('camera')){s.equipped='camera';s.cameraMode=!s.cameraMode;updateInventory()}else toast('FIND YOUR CAMERA UPSTAIRS')}
 if(e.code==='Space'&&s.cameraMode)capturePhoto(false);
 if(e.code==='KeyH')hide();
 if(e.code==='Digit1')setEquip('flashlight');if(e.code==='Digit2')setEquip('keys');if(e.code==='Digit3')setEquip('camera');
 if(e.code==='KeyJ')openModal('journal');
}
window.addEventListener('keydown',playerKeyDown);window.addEventListener('keyup',e=>keys[e.code]=false);window.addEventListener('blur',()=>{keys={};touches.clear()});
view.addEventListener('pointerdown',e=>{if(!s||inputLocked||e.target.closest('button'))return;drag={id:e.pointerId,x:e.clientX,y:e.clientY};try{view.setPointerCapture(e.pointerId)}catch{};view.classList.add('dragging')});
view.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id||!s)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;s.yaw=norm(s.yaw+dx*.0045);s.pitch=clamp(s.pitch+dy*.003,-.7,.7);drag.x=e.clientX;drag.y=e.clientY});
function stopDrag(e){if(drag&&drag.id===e.pointerId){drag=null;view.classList.remove('dragging');saveGame()}}
view.addEventListener('pointerup',stopDrag);view.addEventListener('pointercancel',stopDrag);
for(const btn of document.querySelectorAll('[data-move]')){
 const dir=btn.dataset.move;
 const begin=e=>{e.preventDefault();e.stopPropagation();touches.add(dir);btn.setPointerCapture?.(e.pointerId)};
 const end=e=>{e.preventDefault();e.stopPropagation();touches.delete(dir)};
 btn.addEventListener('pointerdown',begin);btn.addEventListener('pointerup',end);btn.addEventListener('pointercancel',end);
}
$('interact-button').onclick=interactNearest;$('camera-button').onclick=()=>capturePhoto(false);
$('pause-button').onclick=()=>openModal('pause');$('map-button').onclick=()=>openModal('map');$('journal-button').onclick=()=>openModal('journal');
$('portrait-dismiss').onclick=dismissStory;
function openModal(kind){if(kind==='settings'&&!s||kind==='settings'||kind==='pause'||kind==='chapters'||kind==='endings'||kind==='map'||kind==='journal'||kind==='credits'||kind==='exit'){}else return;
 let title='',html='';const go=()=>{$('modal-title').textContent=title;$('modal-content').innerHTML=html;$('modal').classList.remove('hidden')};
 if(kind==='settings'){
 title='SETTINGS';html=`<p>Adjust the intensity before the lights go out. Your choices are saved automatically on this device.</p>
 <div class="setting"><label for="difficulty">DIFFICULTY</label><select id="difficulty"><option value="easy">EASY — patient stalker, safer hiding</option><option value="normal">NORMAL — tense but fair</option><option value="nightmare">NIGHTMARE — faster pursuit and searches</option></select></div>
 <div class="setting"><label for="volume">AUDIO VOLUME</label><input id="volume" type="range" min="0" max="1" step="0.05"></div>
 <div class="setting"><label for="voices">SYNTHETIC VOICE LINES (BROWSER DEPENDENT)</label><input id="voices" type="checkbox"></div>
 <div class="setting"><label for="jumpscares">VISUAL JUMPSCARE</label><input id="jumpscares" type="checkbox"></div>
 <div class="setting"><label for="shake">CAMERA SHAKING</label><input id="shake" type="checkbox"></div>
 <div class="setting"><label for="flashes">LIGHTNING / FLASHING</label><input id="flashes" type="checkbox"></div>
 <div class="setting"><label for="subtitles">VOICE SUBTITLES</label><input id="subtitles" type="checkbox"></div>
 <p>TOUCH: drag to look around and use the movement pad. DESKTOP: W A S D move, drag mouse to look, Q/E turn, Shift run, E interact, F flashlight, C camera, Space take photo, H hide, Tab map, J journal, Esc pause.</p>
 <div class="modal-actions"><button id="test-audio">TEST AUDIO</button><button id="save-settings">SAVE & CLOSE</button></div>`;
 go();$('difficulty').value=pref.difficulty;$('volume').value=pref.volume;
 for(const p of ['voices','jumpscares','shake','flashes','subtitles'])$(p).checked=!!pref[p];
 const persist=()=>{pref.difficulty=$('difficulty').value;pref.volume=Number($('volume').value);for(const k of ['voices','jumpscares','shake','flashes','subtitles'])pref[k]=$(k).checked;saveJSON(PREF,pref);updateVolume()};
 for(const el of $('modal-content').querySelectorAll('input,select'))el.addEventListener('change',persist);
 $('save-settings').onclick=()=>{persist();closeModal()};$('test-audio').onclick=()=>{audioResume();audioPhone()};return;
 }
 if(kind==='pause'){
 title='PAUSED';html=`<p>Friday, October 26, 1990. The clock is ticking. Your progress saves when you enter rooms or discover clues.</p><div class="modal-actions"><button id="resume">RESUME GAME</button><button id="save-now">SAVE CHECKPOINT</button><button id="pause-settings">SETTINGS</button><button id="pause-map">FLOOR PLAN</button><button id="pause-menu">MAIN MENU</button></div>`;go();$('resume').onclick=closeModal;$('save-now').onclick=()=>{checkpoint();toast('CHECKPOINT SAVED');closeModal()};$('pause-settings').onclick=()=>openModal('settings');$('pause-map').onclick=()=>openModal('map');$('pause-menu').onclick=navigateToMenu;return;
 }
 if(kind==='chapters'){
 title='CHAPTER SELECT';const unlocked=Math.max(readJSON('the-second-key-unlocked-chapter-v2',0),s?.chapter||0);html=`<p>Begin a chapter with its story setup. Your discovered endings remain in the gallery.</p><div class="grid-cards">${DAYS.map((name,i)=>`<div class="gallery-card ${i>unlocked?'locked':''}"><div class="eyebrow">CHAPTER ${['I','II','III','IV','V'][i]}</div><h3>${name}</h3><p>${['9:15 PM','10:47 PM','11:20 PM','11:54 PM','12:08 AM'][i]}</p><button data-chapter="${i}" ${i>unlocked?'disabled':''}>${i<=unlocked?'START CHAPTER':'LOCKED'}</button></div>`).join('')}</div>`;go();$('modal-content').querySelectorAll('[data-chapter]').forEach(b=>b.onclick=()=>{closeModal();startGame(Number(b.dataset.chapter))});return;
 }
 if(kind==='endings'){
 title='ENDING ARCHIVE';const unlocked=readJSON(ENDINGS,[]);html=`<p>Eight conclusions. Every decision can close a door—or open one.</p><div class="grid-cards">${ENDING_DATA.map((e,i)=>`<div class="gallery-card ${unlocked.includes(i)?'':'locked'}"><div class="eyebrow">ENDING ${String(i+1).padStart(2,'0')} / 08 · ${unlocked.includes(i)?'DISCOVERED':'UNDISCOVERED'}</div><h3>${unlocked.includes(i)?e[0]:'???'}</h3><p>${unlocked.includes(i)?e[2]:'Play to uncover this outcome.'}</p></div>`).join('')}</div><div class="modal-actions"><button id="reset-endings">RESET ENDING ARCHIVE</button></div>`;go();$('reset-endings').onclick=()=>{if(confirm('Reset all discovered endings? Your game save is unaffected.')){saveJSON(ENDINGS,[]);openModal('endings')}};return;
 }
 if(kind==='map'){
 title='PRICE HOUSE — FLOOR PLAN';if(!s)return;const rows=[['porch','foyer','living','dining'],['yard','garage','kitchen','basement'],['hall','evelyn','parents','bathroom']];html=`<p>Visited rooms are marked in amber. The map is a reference only; it does not teleport Evelyn. Current location: <strong>${room().name}</strong>.</p><div class="mini-map">${rows.flatMap(row=>row.map(r=>`<button disabled class="${s.room===r?'current':s.visited.includes(r)?'visited':''} ${s.npc.room===r&&s.chapter>=2?'danger-here':''}">${ROOMS[r].name.split('—').pop().trim()}</button>`)).join('')}</div><p>FLOOR 1: FOYER, LIVING ROOM, DINING ROOM, KITCHEN. FLOOR 2: HALLWAY, BEDROOMS, BATHROOM. LOWER LEVEL: BASEMENT. EXTERIOR: GARAGE, PORCH, YARD.</p><p class="micro">Red border means a possible sound or movement nearby. The map is not an exact threat tracker.</p>`;go();return;
 }
 if(kind==='journal'){
 title='EVIDENCE & PHOTOGRAPHS';if(!s)return;html=`<p>Evelyn Price · aspiring photographer · Grayswick, Pennsylvania. <strong>${s.evidence.length} discovered clues</strong> · <strong>${s.photos.length} photographs</strong> · <strong>${s.film} frames remaining</strong>.</p><div class="journal-entry"><b>THE FIRST ENCOUNTER — AUGUST 15</b><p>Evelyn helped a customer at Redbird Video after he injured his hand. She was being kind. Nathaniel imagined a different story.</p></div><div class="journal-entry"><b>THE REPAIR — SEPTEMBER 4</b><p>The Price family hired Nathaniel Cross to repair electrical equipment. His access made the later intrusion possible.</p></div>${s.evidence.map(e=>`<div class="journal-entry"><b>${e.replace(/([A-Z])/g,' $1').toUpperCase()}</b><p>${CLUES[e]|| (e==='nathanielPhoto'?'A photograph of Nathaniel Cross inside the Price property, taken tonight.':'Collected evidence.')}</p></div>`).join('')||'<p>Find clues in the house to begin your evidence journal.</p>'}<h3>CAMERA ROLL</h3>${s.photos.map((p,i)=>`<div class="journal-entry"><b>FRAME ${p.number} · ${p.type} · ${timeLabel(p.clock)}</b><p>${ROOMS[p.room].name}${p.nathaniel?' · NATHANIEL VISIBLE':' · Nothing obvious in the frame'}</p><button class="ornate" data-photo="${i}">VIEW ${p.type==='360'?'INTERACTIVE 360° PANORAMA':'PHOTOGRAPH'}</button></div>`).join('')||'<p>No photographs taken yet. Equip the camera, look around, and take a shot.</p>'}<div class="modal-actions"><button id="journal-close">BACK TO THE HOUSE</button></div>`;
 go();$('journal-close').onclick=closeModal;$('modal-content').querySelectorAll('[data-photo]').forEach(el=>el.onclick=()=>openCapturedPhoto(Number(el.dataset.photo)));return;
 }
 if(kind==='exit'){
 title='EXIT';html='<p>To leave the game, you can close this browser tab. Browser security prevents a website from closing a tab it did not open.</p><div class="modal-actions"><button id="leave-menu">RETURN TO MAIN MENU</button></div>';go();$('leave-menu').onclick=closeModal;return;
 }
}
function openCapturedPhoto(i){if(!s||!s.photos[i])return;const p=s.photos[i],w=640,h=310;
 $('modal-title').textContent=(p.type==='360'?'360° PANORAMA':'35MM PHOTOGRAPH')+' · FRAME '+p.number;
 $('modal-content').innerHTML=`<p>${ROOMS[p.room].name} · ${timeLabel(p.clock)} ${p.nathaniel?'· <strong>NATHANIEL CAUGHT ON FILM</strong>':''}</p><div id="photo-crop" style="width:100%;height:310px;position:relative;overflow:hidden;background:#090b0f;border:1px solid #a28b6b;touch-action:none"><img id="photo-image" src="assets/${p.room}.svg" alt="Original illustrated house panorama" draggable="false" style="position:absolute;width:1350px;max-width:none;height:380px;top:-30px;left:0;filter:sepia(.17) contrast(1.1)">${p.nathaniel?'<img id="photo-person" src="assets/nathaniel.svg" alt="Nathaniel captured on film" style="position:absolute;bottom:0;max-width:none;pointer-events:none;filter:contrast(1.1)">':''}</div>${p.type==='360'?'<p>DRAG THE IMAGE OR MOVE THE SLIDER TO VIEW ALL 360 DEGREES.</p><input id="photo-direction" type="range" min="0" max="360" value="'+Math.round(p.yaw*180/PI)+'" style="width:100%;accent-color:#b89d72">':'<p>Original 35mm-style frame. Captured during gameplay.</p>'}<div class="modal-actions"><button id="photo-back">BACK TO JOURNAL</button></div>`;
 const crop=$('photo-crop'),img=$('photo-image');let yaw=p.yaw,dragging=null;
 const paint=()=>{const iw=img.clientWidth||1350,cw=crop.clientWidth;let offset=iw*(norm(yaw)/TAU+.125);let left=cw/2-offset;img.style.left=left+'px';crop.style.backgroundImage=`url('assets/${p.room}.svg')`;crop.style.backgroundSize=`${iw}px 380px`;crop.style.backgroundPosition=(left+iw)+'px -30px';const person=$('photo-person');if(person){let a=diff(p.npcAngle,yaw),fov=cw/iw*TAU;person.style.display=Math.abs(a)<fov*.53?'block':'none';person.style.left=(cw/2+a/fov*cw)+'px';person.style.transform='translateX(-50%)';person.style.height=clamp(580/(p.npcDistance||2),100,390)+'px'}};
 paint();if(p.type==='360'){
 $('photo-direction').oninput=e=>{yaw=Number(e.target.value)*PI/180;paint()};
 crop.addEventListener('pointerdown',e=>{dragging=e.clientX;crop.setPointerCapture(e.pointerId)});
 crop.addEventListener('pointermove',e=>{if(dragging===null)return;yaw=norm(yaw+(e.clientX-dragging)*.009);dragging=e.clientX;$('photo-direction').value=Math.round(yaw*180/PI);paint()});
 crop.addEventListener('pointerup',()=>dragging=null);crop.addEventListener('pointercancel',()=>dragging=null);
 }
 $('photo-back').onclick=()=>openModal('journal');
}
function closeModal(){$('modal').classList.add('hidden');if(s)$('viewport').focus()}
$('modal-close').onclick=closeModal;$('modal-scrim').onclick=closeModal;
// Self-contained WebAudio soundscape: no licensed samples, remote audio, or autoplay.
let AC=null,ambientNode=null,ambientGain=null,master=null,soundReady=false;
function audioResume(){try{if(!AC){const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;AC=new Ctx();master=AC.createGain();master.gain.value=pref.volume;master.connect(AC.destination);const noise=AC.createBuffer(1,AC.sampleRate*3,AC.sampleRate);const data=noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.36;ambientNode=AC.createBufferSource();ambientNode.buffer=noise;ambientNode.loop=true;const low=AC.createBiquadFilter();low.type='lowpass';low.frequency.value=620;ambientGain=AC.createGain();ambientGain.gain.value=.11;ambientNode.connect(low);low.connect(ambientGain);ambientGain.connect(master);ambientNode.start();}AC.resume?.();updateVolume()}catch(e){console.warn('Audio unavailable:',e)}}
function updateVolume(){if(master)master.gain.setTargetAtTime(pref.volume,AC.currentTime,.02)}
function synth(freq=300,len=.13,type='sine',gain=.17,slide=1){if(!AC||pref.volume<=0)return;let osc=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;osc.type=type;osc.frequency.setValueAtTime(freq,t);osc.frequency.exponentialRampToValueAtTime(Math.max(10,freq*slide),t+len);g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,gain),t+.015);g.gain.exponentialRampToValueAtTime(.001,t+len);osc.connect(g);g.connect(master);osc.start(t);osc.stop(t+len+.02)}
function audioPhone(){audioResume();[0,.18,.38,.55].forEach((d,i)=>setTimeout(()=>synth(i%2?565:444,.18,'sine',.10),d*1000))}
function audioCreak(){synth(146,.53,'triangle',.11,.52);setTimeout(()=>synth(92,.4,'sawtooth',.025,.62),170)}
function audioThunk(){synth(105,.5,'triangle',.2,.19);synth(46,.65,'sawtooth',.05,.45)}
function audioStatic(){for(let i=0;i<6;i++)setTimeout(()=>synth(350+Math.random()*800,.06,'sawtooth',.02,.33),i*65)}
function audioCamera(){synth(185,.052,'square',.17,.4);setTimeout(()=>synth(66,.11,'triangle',.07,.66),110)}
function audioBreaker(){synth(720,.04,'square',.19,.45);setTimeout(()=>synth(90,.4,'triangle',.13,.55),90)}
function audioScream(){audioResume();playClip('nathaniel-scream',true);synth(600,.72,'sawtooth',.24,.35);synth(940,.85,'square',.12,.20);synth(75,.9,'sawtooth',.14,.50);for(let i=0;i<5;i++)setTimeout(()=>synth(250+Math.random()*900,.15,'sawtooth',.045,.8),i*90)}
function audioSiren(){[0,500,1000,1500].forEach((d,i)=>setTimeout(()=>synth(i%2?560:420,.55,'sine',.075,1.1),d))}
function audioEnding(index){synth(index>=5?96:392,2,'triangle',.14,.68)}
function playFootstep(heavy=false){if(Math.random()<.60)synth(heavy?74:112,.095,'triangle',heavy?.13:.03,.48)}
function playCreak(){if(Math.random()<.65)audioCreak()}
function doLightning(){if(!pref.flashes)return;const el=$('lightning');el.style.opacity='.57';setTimeout(()=>el.style.opacity='0',120);setTimeout(()=>synth(43,.8,'sawtooth',.14,.4),170)}
$('retry-button').onclick=()=>loadCheckpoint();$('checkpoint-button').onclick=()=>loadCheckpoint();$('death-menu-button').onclick=navigateToMenu;$('new-after-ending').onclick=()=>startGame();$('ending-menu-button').onclick=navigateToMenu;
for(const button of document.querySelectorAll('[data-menu]'))button.addEventListener('click',()=>{
 audioResume();const act=button.dataset.menu;
 if(act==='new')startGame();
 else if(act==='continue'){let state=readJSON(STORE,null);if(state)enterGame(state);else toast('NO SAVE FILE · START A NEW GAME')}
 else if(act==='chapters')openModal('chapters');else if(act==='endings')openModal('endings');
 else if(act==='settings')openModal('settings');else if(act==='exit')openModal('exit');
});
$('cover-door').onclick=()=>startGame();$('cover-window').onclick=()=>{toast('A FIGURE MOVES BEHIND THE BEDROOM CURTAIN.');audioCreak()};$('cover-mailbox').onclick=()=>toast('PRICE · 2147. SOMEONE KNOWS THE ADDRESS.');
// Periodic saves are deliberately throttled to avoid synchronous storage thrashing.
setInterval(()=>{if(!s||s.sessionEnd)return;saveGame();if(Math.random()<.085&&s.chapter>=1)doLightning()},10500);
setInterval(()=>{if(!s||s.sessionEnd||s.npc.room!==s.room||s.chapter<2)return; if(distance(s,s.npc)<4)playFootstep(true)},2200);
function recordProgress(){if(!s)return;const k='the-second-key-unlocked-chapter-v2';const prev=readJSON(k,0);if(s.chapter>prev)saveJSON(k,s.chapter)}
const originalAdvanceChapter=advanceChapter;advanceChapter=function(n){originalAdvanceChapter(n);recordProgress()};
const originalStartGame=startGame;startGame=function(chapter=0){originalStartGame(chapter);recordProgress()};
const originalEnterGame=enterGame;enterGame=function(data){originalEnterGame(data);recordProgress()};
// Detect broken image assets early; fallback remains the illustrated background color.
for(const name of ['cover','living','foyer','kitchen','dining','hall','evelyn','parents','bathroom','basement','yard','garage','porch','nathaniel','nathaniel-close']){
 const im=new Image();im.src='assets/'+name+'.svg';im.onerror=()=>console.error('Missing image asset:',name);
}
window.addEventListener('beforeunload',()=>{if(s&&!s.sessionEnd)saveGame()});
requestAnimationFrame(tick);
window.__SECOND_KEY_TEST__={getState:()=>s,actions:()=>document.querySelectorAll('.choice').length,goRoom:to=>{if(!s)return;s.room=to;loadRoomArt()},act:action,chapter:advanceChapter,ending,interact:interactNearest,photo:capturePhoto,ai:stepNPC,save:saveGame,openModal};
})();
