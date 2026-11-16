from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch(channel='msedge', headless=True)
    page = b.new_page(viewport={'width': 640, 'height': 360})
    page.goto('file:///D:/Project/flipbook/index.html')
    page.wait_for_function('window.__book && !app.hidden')
    for f in range(1, 18):
        page.evaluate(f'__book.goToFace({f})')
        page.wait_for_timeout(100)
        info = page.evaluate(f'''() => {{
            const face = document.querySelector('[data-face="{f}"]');
            if (!face) return null;
            const content = face.querySelector('.leaf__content');
            return {{
                face: {f},
                scrollHeight: content ? content.scrollHeight : 0,
                clientHeight: content ? content.clientHeight : 0,
                scrollWidth: content ? content.scrollWidth : 0,
                clientWidth: content ? content.clientWidth : 0
            }};
        }}''')
        print(info)
    b.close()
