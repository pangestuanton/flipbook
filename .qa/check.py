from playwright.sync_api import sync_playwright
import json
from pathlib import Path
with sync_playwright() as p:
 b=p.chromium.launch(channel='msedge', headless=True)
 page=b.new_page()
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 for w,h in [(1440,900),(1024,768),(768,1024),(390,844),(320,568),(844,390)]:
  page.set_viewport_size({'width':w,'height':h})
  page.goto('http://127.0.0.1:8765')
  page.wait_for_timeout(1200)
  print(w,h,page.evaluate('''() => ({book:[getComputedStyle(document.documentElement).getPropertyValue('--pw'),getComputedStyle(document.documentElement).getPropertyValue('--ph')], overflow:document.documentElement.scrollWidth>innerWidth, mode:__book.mode, stage:document.querySelector('#stage').clientHeight})'''))
  page.screenshot(path=f'.qa/{w}-cover.png')
  page.evaluate('__book.goToFace(3)');page.wait_for_timeout(1500)
  page.screenshot(path=f'.qa/{w}-info.png')
 print('ERRORS',errors)
 b.close()
