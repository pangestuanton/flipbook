import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

VIEWPORTS = [
    ("mobile_320", 320, 568),
    ("mobile_360", 360, 740),
    ("mobile_390", 390, 844),
    ("mobile_412", 412, 915),
    ("tablet_768", 768, 1024),
    ("tablet_820", 820, 1180),
    ("desktop_1024", 1024, 768),
    ("desktop_1280", 1280, 800),
    ("desktop_1440", 1440, 900),
    ("desktop_1920", 1920, 1080),
    ("landscape_640", 640, 360),
    ("landscape_844", 844, 390),
    ("landscape_915", 915, 412),
]

def run_audit():
    issues = []
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        page = browser.new_page(reduced_motion="reduce")
        
        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(str(err)))
        page.on("console", lambda msg: page_errors.append(f"console[{msg.type}]: {msg.text}") if msg.type == "error" else None)

        for name, width, height in VIEWPORTS:
            page.set_viewport_size({"width": width, "height": height})
            page.goto("file:///D:/Project/flipbook/index.html", wait_until="load")
            page.evaluate("localStorage.clear()")
            page.reload(wait_until="load")
            page.wait_for_function("window.__book && !app.hidden")
            page.wait_for_timeout(300)

            # Check 1: Document level overflow
            doc_overflow = page.evaluate("""() => {
                return {
                    scrollWidth: document.documentElement.scrollWidth,
                    clientWidth: window.innerWidth,
                    hasOverflow: document.documentElement.scrollWidth > window.innerWidth
                };
            }""")
            if doc_overflow["hasOverflow"]:
                issues.append({
                    "viewport": name,
                    "type": "doc_horizontal_overflow",
                    "details": doc_overflow
                })

            # Check topbar & toolbar layout
            bar_issues = page.evaluate("""() => {
                const issues = [];
                const topbar = document.querySelector('.topbar');
                if (topbar && topbar.scrollWidth > topbar.clientWidth + 1) {
                    issues.push({ element: '.topbar', scroll: topbar.scrollWidth, client: topbar.clientWidth });
                }
                const toolbar = document.querySelector('.toolbar');
                if (toolbar && toolbar.scrollWidth > toolbar.clientWidth + 1) {
                    issues.push({ element: '.toolbar', scroll: toolbar.scrollWidth, client: toolbar.clientWidth });
                }
                const brand = document.querySelector('.topbar__brand');
                if (brand && brand.scrollWidth > brand.clientWidth + 1) {
                    issues.push({ element: '.topbar__brand', scroll: brand.scrollWidth, client: brand.clientWidth });
                }
                return issues;
            }""")
            for bi in bar_issues:
                issues.append({"viewport": name, "type": "bar_overflow", "details": bi})

            # Check all faces (1 to 17)
            total_faces = page.evaluate("FB_CONTENT.faces.length")
            # Step through each face
            for f in range(1, total_faces + 1):
                page.evaluate(f"__book.goToFace({f})")
                page.wait_for_timeout(100)

                # Check active faces for overflow or clipping
                face_check = page.evaluate(f"""() => {{
                    const faceEl = document.querySelector('[data-face="{f}"]');
                    if (!faceEl) return null;
                    const content = faceEl.querySelector('.leaf__content');
                    const issues = [];
                    if (content) {{
                        // Check if content horizontal scroll is exceeded
                        if (content.scrollWidth > content.clientWidth + 1) {{
                            issues.push({{ type: 'content_h_scroll', scroll: content.scrollWidth, client: content.clientWidth }});
                        }}
                        // Check children inside content
                        const children = content.querySelectorAll('*');
                        for (let child of children) {{
                            // exclude floaty which can be positioned absolute
                            if (child.classList.contains('floaty') || child.closest('.floaty')) continue;
                            if (child.scrollWidth > content.clientWidth + 2 && child.clientWidth > content.clientWidth) {{
                                issues.push({{
                                    tag: child.tagName,
                                    cls: child.className,
                                    text: (child.innerText || '').slice(0, 30),
                                    childWidth: child.scrollWidth,
                                    parentWidth: content.clientWidth
                                }});
                            }}
                        }}
                    }}
                    return issues;
                }}""")
                if face_check:
                    issues.append({
                        "viewport": name,
                        "face": f,
                        "type": "face_content_overflow",
                        "items": face_check
                    })

            # Check Drawer
            page.locator("#btnToc").click()
            page.wait_for_timeout(300)
            drawer_check = page.evaluate("""() => {
                const d = document.querySelector('#drawer');
                const head = d.querySelector('.drawer__head');
                const body = d.querySelector('.drawer__body');
                const foot = d.querySelector('.drawer__foot');
                return {
                    drawerWidth: d.clientWidth,
                    drawerScrollWidth: d.scrollWidth,
                    headOverflow: head.scrollWidth > head.clientWidth + 1,
                    bodyOverflow: body.scrollWidth > body.clientWidth + 1,
                    footOverflow: foot.scrollWidth > foot.clientWidth + 1,
                };
            }""")
            if drawer_check["drawerScrollWidth"] > drawer_check["drawerWidth"] + 1 or drawer_check["headOverflow"] or drawer_check["bodyOverflow"] or drawer_check["footOverflow"]:
                issues.append({"viewport": name, "type": "drawer_overflow", "details": drawer_check})
            page.keyboard.press("Escape")
            page.wait_for_timeout(150)

            # Check Quiz Center
            page.locator("#btnQuiz").click()
            page.wait_for_timeout(300)
            quiz_check = page.evaluate("""() => {
                const qc = document.querySelector('#quizcenter');
                const panel = qc.querySelector('.quizcenter__panel');
                return {
                    panelWidth: panel.clientWidth,
                    panelScrollWidth: panel.scrollWidth,
                    hasOverflow: panel.scrollWidth > panel.clientWidth + 1,
                    panelHeight: panel.clientHeight,
                    windowHeight: window.innerHeight
                };
            }""")
            if quiz_check["hasOverflow"]:
                issues.append({"viewport": name, "type": "quiz_overflow", "details": quiz_check})
            page.keyboard.press("Escape")
            page.wait_for_timeout(150)

            # Check Lightbox
            page.evaluate("""() => {
                const lbTrigger = document.querySelector('[data-lightbox]');
                if (lbTrigger) lbTrigger.click();
            }""")
            page.wait_for_timeout(300)
            lb_check = page.evaluate("""() => {
                const lb = document.querySelector('#lightbox');
                const frame = lb.querySelector('.lightbox__frame');
                if (!lb.classList.contains('is-open')) return null;
                return {
                    frameWidth: frame.clientWidth,
                    frameScrollWidth: frame.scrollWidth,
                    hasOverflow: frame.scrollWidth > frame.clientWidth + 1,
                    frameHeight: frame.clientHeight,
                    windowHeight: window.innerHeight
                };
            }""")
            if lb_check and lb_check["hasOverflow"]:
                issues.append({"viewport": name, "type": "lightbox_overflow", "details": lb_check})
            page.keyboard.press("Escape")
            page.wait_for_timeout(150)

        browser.close()

    print(json.dumps({"issues_count": len(issues), "page_errors": page_errors, "issues": issues}, indent=2))

if __name__ == "__main__":
    run_audit()
