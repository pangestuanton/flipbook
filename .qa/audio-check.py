from playwright.sync_api import sync_playwright
from pathlib import Path
import json
with sync_playwright() as p:
 b=p.chromium.launch(channel='msedge',headless=True)
 pg=b.new_page(viewport={'width':390,'height':844})
 pg.route('https://fonts.googleapis.com/**',lambda route: route.abort())
 errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.goto(Path('index.html').resolve().as_uri(),wait_until='load')
 pg.wait_for_function('window.__book && !document.querySelector("#app").hidden')
 assert pg.locator('#backgroundMusic').evaluate('(a)=>a.paused && a.preload === "none" && a.loop')
 pg.locator('#btnSound').click()
 assert pg.locator('#audioPanel').is_visible()
 assert pg.evaluate('document.activeElement.id')=='btnMusic'
 pg.locator('#btnMusic').click()
 pg.wait_for_function('!document.querySelector("#backgroundMusic").paused && document.querySelector("#backgroundMusic").currentTime > 0.3')
 assert pg.locator('#btnMusic').get_attribute('aria-pressed')=='true'
 assert pg.locator('#btnMusic').inner_text()=='Jeda musik'
 pg.locator('#musicVolume').fill('17')
 assert abs(pg.locator('#backgroundMusic').evaluate('(a)=>a.volume')-.17)<.001
 pg.locator('#pageSound').check()
 assert pg.evaluate('JSON.parse(localStorage.getItem("flipbook.sound"))')==True
 pg.keyboard.press('Escape')
 assert pg.locator('#audioPanel').is_hidden()
 assert pg.evaluate('document.activeElement.id')=='btnSound'
 pg.locator('#btnNext').click()
 assert not pg.locator('#backgroundMusic').evaluate('(a)=>a.paused')
 for w,h in [(320,568),(390,844),(768,1024),(1440,900),(640,360)]:
  pg.set_viewport_size({'width':w,'height':h});pg.wait_for_timeout(250)
  pg.locator('#btnSound').click()
  panel=pg.locator('#audioPanel').bounding_box()
  assert panel['x']>=0 and panel['x']+panel['width']<=w,(w,panel)
  assert panel['y']>=0 and panel['y']+panel['height']<=h,(w,panel)
  assert pg.evaluate('document.documentElement.scrollWidth <= innerWidth')
  pg.screenshot(path=f'.qa/audio-{w}.png')
  pg.keyboard.press('Escape')
 pg.locator('#btnSound').click()
 pg.locator('#btnMusic').click()
 assert pg.locator('#backgroundMusic').evaluate('(a)=>a.paused')
 pg.locator('#btnMusic').click()
 pg.wait_for_function('!document.querySelector("#backgroundMusic").paused')
 pg.evaluate('Object.defineProperty(document,"hidden",{configurable:true,get:()=>true});document.dispatchEvent(new Event("visibilitychange"))')
 assert pg.locator('#backgroundMusic').evaluate('(a)=>a.paused')
 pg.evaluate('Object.defineProperty(document,"hidden",{configurable:true,get:()=>false});document.dispatchEvent(new Event("visibilitychange"))')
 pg.wait_for_function('!document.querySelector("#backgroundMusic").paused')
 # Loop past the end of the phrase.
 pg.locator('#backgroundMusic').evaluate('(a)=>a.currentTime=a.duration-.2')
 pg.wait_for_timeout(650)
 assert pg.locator('#backgroundMusic').evaluate('(a)=>!a.paused && a.currentTime < 3')
 pg.reload(wait_until='load')
 pg.wait_for_function('window.__book && !document.querySelector("#app").hidden')
 assert pg.locator('#backgroundMusic').evaluate('(a)=>a.paused && Math.abs(a.volume-.17)<.001')
 assert pg.locator('#pageSound').is_checked()
 assert not errors,errors
 Path('.qa/audio-results.json').write_text(json.dumps({'playPause':'pass','volumePersistence':'pass','effectsIndependent':'pass','pageNavigation':'pass','loop':'pass','visibilityPauseResume':'pass','noAutoplayOnLoad':'pass','responsiveWidths':[320,390,768,1440,640],'pageErrors':errors},indent=2))
 print('PASS: playback, looping, pause/resume, saved volume, independent effects, visibility lifecycle, responsive panel; no JavaScript errors.',flush=True)
 b.close()
