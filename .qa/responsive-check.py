from playwright.sync_api import sync_playwright
import json
from pathlib import Path
with sync_playwright() as p:
 b=p.chromium.launch(channel='msedge',headless=True)
 page=b.new_page(reduced_motion='reduce')
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 results=[]
 for w,h in [(1440,900),(1024,768),(768,1024),(390,844),(320,568),(844,390),(640,360)]:
  page.set_viewport_size({'width':w,'height':h})
  page.goto('http://127.0.0.1:8765',wait_until='load')
  page.evaluate('localStorage.clear()')
  page.reload(wait_until='load')
  page.wait_for_function('window.__book && document.querySelector("#book").clientHeight > 100');page.wait_for_timeout(500)
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),f'overflow {w}'
  assert page.evaluate('document.querySelector("#book").clientHeight > 100'),f'book size {w}'
  page.screenshot(path=f'.qa/final-{w}-cover.png')
  overflow=page.evaluate('''() => [...document.querySelectorAll('.leaf__content')].filter(el=>el.scrollWidth>el.clientWidth+1).map(el=>({face:el.parentElement.dataset.face,client:el.clientWidth,scroll:el.scrollWidth}))''')
  assert not overflow,(w,overflow)
  page.locator('#btnNext').click();page.wait_for_timeout(250)
  assert page.evaluate('__book.currentFace()')==2
  page.locator('#btnToc').click()
  page.wait_for_timeout(400)
  assert page.locator('#drawer').get_attribute('aria-hidden')=='false'
  assert page.evaluate('document.querySelector("#app").inert')
  page.locator('#drawerToc [data-face="13"]').click();page.wait_for_timeout(1800)
  assert page.evaluate('__book.currentFace()')==(13 if w<=900 else 12)
  page.screenshot(path=f'.qa/final-{w}-material.png')
  page.locator('#btnQuiz').click();page.wait_for_timeout(400)
  page.locator('.quiz__opt').first.click()
  page.locator('.quiz__next').click()
  assert 'Soal 2' in page.locator('.quiz__count').first.inner_text()
  page.keyboard.press('Escape');page.wait_for_timeout(100)
  page.evaluate('__book.goToFace(17)');page.wait_for_timeout(1600)
  assert page.locator('#btnNext').is_disabled(),f'end {w}'
  assert page.evaluate('document.querySelector("[data-face=\\"17\\"]").inert')==False
  assert page.evaluate('document.querySelector("#book").getBoundingClientRect().right <= innerWidth+1')
  results.append({'viewport':f'{w}x{h}','horizontalOverflow':False,'navigation':'pass','quiz':'pass','lastPage':'pass'})
 # Rebuild must preserve navigation and contents.
 page.set_viewport_size({'width':1440,'height':900});page.wait_for_timeout(300)
 page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(300)
 assert page.locator('#tocList .toc__item').count()==15
 page.locator('#btnPrev').click();page.wait_for_timeout(300)
 assert page.evaluate('__book.currentFace()')==15
 # Phone swipe and content scroll must not conflict.
 page.evaluate('__book.goToFace(3)');page.wait_for_timeout(2000)
 page.evaluate('''() => {const el=document.querySelector('#leafstack');const face=el.querySelector('[data-face="3"] .leaf__content');for (const [type,x,y] of [['pointerdown',280,350],['pointermove',170,352],['pointerup',100,352]]) face.dispatchEvent(new PointerEvent(type,{bubbles:true,isPrimary:true,pointerId:5,pointerType:'touch',clientX:x,clientY:y}));}''')
 page.wait_for_timeout(300)
 assert page.evaluate('__book.currentFace()')==4
 page.evaluate('''() => {const face=document.querySelector('[data-face="4"] .leaf__content');for (const [type,x,y] of [['pointerdown',200,350],['pointermove',200,250],['pointerup',200,150]]) face.dispatchEvent(new PointerEvent(type,{bubbles:true,isPrimary:true,pointerId:6,pointerType:'touch',clientX:x,clientY:y}));}''')
 assert page.evaluate('__book.currentFace()')==4
 assert not errors,errors
 Path('.qa/results.json').write_text(json.dumps({'viewports':results,'resize':'pass','swipe':'pass','verticalScroll':'pass','pageErrors':errors},indent=2))
 print(json.dumps(results),flush=True)
 b.close()
