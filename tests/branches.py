from playwright.sync_api import sync_playwright
from pathlib import Path
ROOT=Path('/mnt/data/second-key-game')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 def page_at(width=1600,height=900):
  page=browser.new_page(viewport={'width':width,'height':height},has_touch=width<500,is_mobile=width<500)
  errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.route('**/assets/**',lambda route: route.fulfill(body=(ROOT/'assets'/route.request.url.split('/assets/')[-1]).read_bytes(),content_type=('audio/ogg' if route.request.url.endswith('.ogg') else 'image/svg+xml')))
  html=(ROOT/'index.html').read_text().replace('<head>','<head><base href="https://offline-asset.test/">').replace('<script src="game.js" defer></script>','').replace('<link rel="stylesheet" href="styles.css" />','')
  page.set_content(html)
  page.add_style_tag(content='\n'.join((ROOT/'styles.css').read_text().splitlines()[1:]))
  page.add_script_tag(content=(ROOT/'game.js').read_text())
  return page,errs
 page,errors=page_at()
 page.locator('[data-menu=new]').click();page.locator('.choice',has_text='Go investigate the kitchen').click()
 assert page.evaluate('__SECOND_KEY_TEST__.getState().room')=='kitchen'
 page.locator('.choice',has_text='Inspect muddy mark').click()
 assert page.evaluate('__SECOND_KEY_TEST__.getState().chapter')==1
 page.locator('.choice',has_text='Answer the ringing phone').first.click()
 assert page.locator('.choice',has_text='Answer the ringing telephone').count()==1
 page.locator('.choice',has_text='Answer the ringing telephone').click()
 assert page.locator('#portrait-dialog').is_visible()
 page.locator('#portrait-dismiss').click()
 assert page.evaluate('__SECOND_KEY_TEST__.getState().chapter')==2
 page.evaluate("__SECOND_KEY_TEST__.act('backDoor')")
 assert page.locator('.choice',has_text='Hold the door shut').count()==1
 page.locator('.choice',has_text='Hold the door shut').click()
 assert page.evaluate('__SECOND_KEY_TEST__.getState().flags.backHeld')
 page.evaluate("__SECOND_KEY_TEST__.act('drawer')")
 assert page.evaluate('__SECOND_KEY_TEST__.getState().evidence.includes(\'drawer\')')
 page.evaluate("__SECOND_KEY_TEST__.goRoom('basement')")
 page.evaluate("__SECOND_KEY_TEST__.act('breaker')")
 assert page.evaluate('__SECOND_KEY_TEST__.getState().flags.breaker')
 # NPS should roam through explicitly connected rooms from yard toward kitchen.
 page.evaluate("""() => {let s=__SECOND_KEY_TEST__.getState();s.npc={room:'yard',x:1,z:0,mode:'search',targetRoom:'kitchen',xTarget:0,zTarget:-3,linger:0,searchAt:0,lastSeen:0};s.room='parents';} """)
 for _ in range(60):page.evaluate('__SECOND_KEY_TEST__.ai(0.1)')
 assert page.evaluate("__SECOND_KEY_TEST__.getState().npc.room")=='kitchen', 'NPC did not cross linked door into kitchen'
 page.evaluate("__SECOND_KEY_TEST__.goRoom('evelyn')")
 page.evaluate("__SECOND_KEY_TEST__.act('camera')")
 page.evaluate("__SECOND_KEY_TEST__.photo(true)")
 page.locator('#journal-button').click();page.locator('button[data-photo="0"]').click()
 assert page.locator('#photo-direction').count()==1
 page.locator('#photo-direction').fill('180')
 page.locator('#photo-back').click();page.locator('#modal-close').click()
 print('BRANCH TESTS PASS', 'errors:', errors)
 assert not errors
 mobile,errors2=page_at(393,852)
 mobile.locator('[data-menu=new]').click()
 mobile.screenshot(path=str(ROOT/'tests'/'mobile.png'))
 print('MOBILE',mobile.locator('#game-screen').is_visible(), 'movement controls:',mobile.locator('#movement-controls').is_visible(), 'choices:',mobile.locator('.choice').count(),'errors',errors2)
 assert mobile.locator('#movement-controls').is_visible()
 assert not errors2
 browser.close()
