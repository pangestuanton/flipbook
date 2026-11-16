from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch(channel='msedge', headless=True)
    for w, h in [(390, 844), (1024, 768), (320, 568)]:
        page = b.new_page(viewport={'width': w, 'height': h}, reduced_motion='reduce')
        page.goto('file:///D:/Project/flipbook/index.html')
        page.wait_for_function('window.__book && !app.hidden')
        page.evaluate('__book.goToFace(11)')
        page.wait_for_timeout(400)
        
        # Click all 3 hotspots
        hotspots = page.locator('.hotspot').all()
        for i, hs in enumerate(hotspots):
            hs.click()
            page.wait_for_timeout(150)
            page.screenshot(path=f'.qa/hotspot-{w}-{i}.png')
            
            # Check overflow
            content_overflow = page.evaluate('''() => {
                const c = document.querySelector('[data-face="11"] .leaf__content');
                return c.scrollWidth > c.clientWidth + 1;
            }''')
            print(f'w={w}, hotspot {i}: overflow={content_overflow}')
        page.close()
    b.close()
