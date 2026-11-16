from playwright.sync_api import sync_playwright

def inspect_visual():
    with sync_playwright() as p:
        b = p.chromium.launch(channel="msedge", headless=True)
        # Test widths 360, 375, 390, 412, 480, 768, 1024
        for w, h in [(360, 740), (375, 667), (390, 844), (412, 915), (768, 1024), (1024, 768)]:
            pg = b.new_page(viewport={"width": w, "height": h}, reduced_motion="reduce")
            pg.goto("file:///D:/Project/flipbook/index.html")
            pg.wait_for_function("window.__book && !app.hidden")
            
            # Check face 2 (TOC)
            pg.evaluate("__book.goToFace(2)")
            pg.wait_for_timeout(300)
            pg.screenshot(path=f".qa/inspect-{w}-face2-toc.png")
            
            # Check face 3 (Info)
            pg.evaluate("__book.goToFace(3)")
            pg.wait_for_timeout(300)
            pg.screenshot(path=f".qa/inspect-{w}-face3-info.png")
            
            # Check face 11 (Struktur)
            pg.evaluate("__book.goToFace(11)")
            pg.wait_for_timeout(300)
            pg.screenshot(path=f".qa/inspect-{w}-face11-struktur.png")

            # Check face 14 (Majas)
            pg.evaluate("__book.goToFace(14)")
            pg.wait_for_timeout(300)
            pg.screenshot(path=f".qa/inspect-{w}-face14-majas.png")

            # Check face 16 (Contoh)
            pg.evaluate("__book.goToFace(16)")
            pg.wait_for_timeout(300)
            pg.screenshot(path=f".qa/inspect-{w}-face16-contoh.png")
            
            # Check face 17 (Penutup)
            pg.evaluate("__book.goToFace(17)")
            pg.wait_for_timeout(300)
            pg.screenshot(path=f".qa/inspect-{w}-face17-penutup.png")

            pg.close()
        b.close()
    print("Screenshots taken")

if __name__ == "__main__":
    inspect_visual()
