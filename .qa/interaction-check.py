from playwright.sync_api import sync_playwright
import json
from pathlib import Path
with sync_playwright() as p:
 b=p.chromium.launch(channel='msedge',headless=True)
 pg=b.new_page(viewport={'width':320,'height':568},reduced_motion='reduce')
 pg.route('https://fonts.googleapis.com/**',lambda route: route.abort())
 errors=[];pg.on('pageerror',lambda e: errors.append(str(e)))
 pg.goto('file:///D:/Project/flipbook/index.html',wait_until='load')
 pg.wait_for_function('window.__book && !app.hidden')
 pg.evaluate('__book.goToFace(3)');pg.wait_for_timeout(600)
 content=pg.locator('[data-face="3"] .leaf__content')
 content.focus();pg.keyboard.press('PageDown');pg.wait_for_timeout(200)
 assert content.evaluate('(e)=>e.scrollTop')>0
 assert pg.evaluate('__book.currentFace()')==3
 assert pg.locator('[data-face="3"] .leaf__pagenum').bounding_box()['x']>140
 pg.locator('#btnToc').click();pg.wait_for_timeout(400)
 pg.screenshot(path='.qa/final-320-drawer.png')
 pg.keyboard.press('Shift+Tab')
 assert pg.evaluate('document.activeElement.closest("#drawer") !== null')
 pg.keyboard.press('Escape');pg.wait_for_timeout(150)
 assert pg.evaluate('document.activeElement.id')=='btnToc'
 pg.locator('#btnQuiz').click();pg.wait_for_timeout(300)
 n=pg.evaluate('FB_CONTENT.quiz.length')
 for i in range(n):
  correct=pg.evaluate(f'FB_CONTENT.quiz[{i}].a')
  pg.locator('.quiz__opt').nth(correct).click()
  pg.locator('.quiz__next').click()
 assert f'{n}' in pg.locator('.quiz__score').inner_text()
 pg.screenshot(path='.qa/final-320-quiz.png')
 pg.keyboard.press('Escape')
 pg.evaluate('__book.goToFace(13)');pg.wait_for_timeout(2000)
 pg.screenshot(path='.qa/final-320-material.png')
 # Check layout at 200% zoom equivalent: desktop CSS viewport is halved.
 pg.set_viewport_size({'width':640,'height':360});pg.wait_for_timeout(400)
 assert pg.evaluate('document.documentElement.scrollWidth <= innerWidth')
 pg.screenshot(path='.qa/final-640-landscape.png')
 assert not errors,errors
 result=json.loads(Path('.qa/results.json').read_text());result.update({'keyboardContentScroll':'pass','dialogFocus':'pass','fullQuiz':'pass','zoomEquivalent':'pass'})
 Path('.qa/results.json').write_text(json.dumps(result,indent=2))
 print('PASS: keyboard scroll, dialog focus and return, full quiz, narrow landscape; no JavaScript errors.')
 b.close()
