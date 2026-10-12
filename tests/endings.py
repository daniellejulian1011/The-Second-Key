from playwright.sync_api import sync_playwright
from pathlib import Path
ROOT=Path('/mnt/data/second-key-game')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1400,'height':900})
 errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 page.route('**/assets/**',lambda route:route.fulfill(body=(ROOT/'assets'/route.request.url.split('/assets/')[-1]).read_bytes(),content_type='audio/ogg' if route.request.url.endswith('.ogg') else 'image/svg+xml'))
 html=(ROOT/'index.html').read_text().replace('<head>','<head><base href="https://offline-asset.test/">').replace('<script src="game.js" defer></script>','').replace('<link rel="stylesheet" href="styles.css" />','')
 page.set_content(html)
 page.add_style_tag(content='\n'.join((ROOT/'styles.css').read_text().splitlines()[1:]))
 page.evaluate("""() => {const bag={};Object.defineProperty(window,'localStorage',{value:{getItem:k=>bag[k]??null,setItem:(k,v)=>{bag[k]=String(v)},removeItem:k=>delete bag[k]},configurable:true})}""")
 page.add_script_tag(content=(ROOT/'game.js').read_text())
 def new(stage=2):
  page.evaluate('''() => {if(__SECOND_KEY_TEST__.getState())__SECOND_KEY_TEST__.ending(3)}''')
  page.locator('[data-menu=new]').click() if page.locator('#main-menu').is_visible() else page.locator('#ending-menu-button').click()
  if page.locator('#main-menu').is_visible(): page.locator('[data-menu=new]').click()
  if stage:page.evaluate(f'__SECOND_KEY_TEST__.chapter({stage})')
 def start(stage=2):
  if page.locator('#ending-screen').is_visible(): page.locator('#new-after-ending').click()
  elif page.locator('#death-screen').is_visible(): page.locator('#death-menu-button').click();page.locator('[data-menu=new]').click()
  elif page.locator('#main-menu').is_visible(): page.locator('[data-menu=new]').click()
  if stage:page.evaluate(f'__SECOND_KEY_TEST__.chapter({stage})')
 def assert_end(label):
  got=page.locator('#ending-heading').inner_text()
  assert page.locator('#ending-screen').is_visible() and label in got,(label,got)
  print('PASS ENDING',got)
 start();page.evaluate("__SECOND_KEY_TEST__.goRoom('yard')");page.evaluate("__SECOND_KEY_TEST__.act('gate')");page.locator('.choice',has_text='Run to the neighbor').click();assert_end("NEIGHBOR")
 start();page.evaluate("__SECOND_KEY_TEST__.goRoom('yard')");page.evaluate("__SECOND_KEY_TEST__.act('gate')");page.locator('.choice',has_text='Escape through the back gate').click();assert_end('BACK GATE')
 start();page.evaluate("__SECOND_KEY_TEST__.goRoom('kitchen')");page.evaluate("__SECOND_KEY_TEST__.act('backDoor')");page.locator('.choice',has_text='Open the door to Nathaniel').click();assert_end('YOU LET HIM IN')
 start();page.evaluate("__SECOND_KEY_TEST__.goRoom('kitchen')");page.evaluate("""() => {let s=__SECOND_KEY_TEST__.getState();s.npc.room='kitchen';s.npc.x=0;s.npc.z=1.8;s.x=0;s.z=0;s.npc.mode='chase'}""");page.evaluate("__SECOND_KEY_TEST__.act('mud')")
 page.locator('.choice',has_text='Give yourself up to Nathaniel').click();assert_end('DINNER FOR TWO')
 start();page.evaluate("__SECOND_KEY_TEST__.goRoom('kitchen')");page.evaluate("__SECOND_KEY_TEST__.act('kitchenPhone')");page.locator('.choice',has_text='Call 911').click();page.evaluate("__SECOND_KEY_TEST__.getState().secondsPlayed+=65")
 page.evaluate("__SECOND_KEY_TEST__.act('kitchenPhone')");page.locator('.choice',has_text='Wait for Deputy Ortiz').click();assert_end('BLUE LIGHTS')
 start();page.evaluate("__SECOND_KEY_TEST__.goRoom('evelyn')");page.evaluate("__SECOND_KEY_TEST__.act('camera')")
 page.evaluate("__SECOND_KEY_TEST__.goRoom('kitchen')");page.evaluate("__SECOND_KEY_TEST__.act('mud')");page.evaluate("__SECOND_KEY_TEST__.act('drawer')")
 page.evaluate("__SECOND_KEY_TEST__.goRoom('parents')");page.evaluate("__SECOND_KEY_TEST__.act('repairReceipt')")
 page.evaluate("__SECOND_KEY_TEST__.goRoom('basement')");page.evaluate("__SECOND_KEY_TEST__.act('box')")
 page.evaluate("""() => {let s=__SECOND_KEY_TEST__.getState();s.npc.room='basement';s.npc.x=0;s.npc.z=-2.0;s.x=0;s.z=0;s.yaw=0;}""")
 page.evaluate('__SECOND_KEY_TEST__.photo(false)')
 assert page.evaluate("__SECOND_KEY_TEST__.getState().flags.nathanielPhoto")
 page.evaluate("__SECOND_KEY_TEST__.goRoom('kitchen')");page.evaluate("__SECOND_KEY_TEST__.act('kitchenPhone')");page.locator('.choice',has_text='Call 911').click()
 page.evaluate("__SECOND_KEY_TEST__.act('kitchenPhone')");page.locator('.choice',has_text='Describe Nathaniel and give').click();assert_end('NO MORE KEYS')
 # One Last Message through actual NPC attack handler.
 start();page.evaluate("__SECOND_KEY_TEST__.goRoom('kitchen')")
 page.evaluate("""() => {let s=__SECOND_KEY_TEST__.getState();s.evidence=['mud','drawer','box'];s.flags.evidenceSent=true;s.npc={room:'kitchen',x:0,z:0,mode:'chase',targetRoom:'kitchen',xTarget:0,zTarget:0,linger:0,searchAt:0,lastSeen:0};s.x=0;s.z=0;}""")
 page.evaluate('__SECOND_KEY_TEST__.ai(.1)');page.wait_for_timeout(1300);assert_end('ONE LAST MESSAGE')
 start();page.evaluate("__SECOND_KEY_TEST__.goRoom('kitchen')")
 page.evaluate("""() => {let s=__SECOND_KEY_TEST__.getState();s.npc={room:'kitchen',x:0,z:0,mode:'chase',targetRoom:'kitchen',xTarget:0,zTarget:0,linger:0,searchAt:0,lastSeen:0};s.x=0;s.z=0;}""")
 page.evaluate('__SECOND_KEY_TEST__.ai(.1)');page.wait_for_timeout(1350)
 assert page.locator('#death-screen').is_visible(), 'Hollow Ring game-over not reached'
 page.locator('#death-menu-button').click();page.locator('[data-menu=endings]').click()
 assert page.locator('.gallery-card').count()==8
 print('LOCKED',page.locator('.gallery-card.locked').all_inner_texts());print('STORAGE',page.evaluate('localStorage.getItem(\"the-second-key-endings-v2\")'));assert page.locator('.gallery-card.locked').count()==0
 print('PASS THE HOLLOW RING, ARCHIVE 8/8')
 print('PAGE ERRORS',errs)
 assert not errs
 browser.close()
