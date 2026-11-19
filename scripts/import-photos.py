#!/usr/bin/env python3
"""Copy the photo derivatives used by src/data/projects.ts into public/img/ and write src/data/images.json.
Source of truth: Agent A's assets/photos/photos_manifest.json (AI-upscaled 12K masters -> AVIF/WebP 640..3840).
Masters never enter the bundle. Ids not yet in A's manifest fall back to a derivative made from the archived
original in assets/_wayback (same photo, unscaled), so the build never shows an empty slot.
Widths shipped: <= 2400 (3840 left out to keep the Pages repo light)."""
import base64, io, json, os, re, shutil
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(APP)
OUT = os.path.join(APP, 'public', 'img')
os.makedirs(OUT, exist_ok=True)
ids = sorted(set(re.findall(r"P\('([a-z0-9-]+)'", open(os.path.join(APP, 'src/data/projects.ts')).read())))
man_a = json.load(open(os.path.join(ROOT, 'assets/photos/photos_manifest.json')))
WB = os.path.join(ROOT, 'assets/_wayback')
def wayback(i):
    m = re.match(r'(.*)-(\d+)$', i); g, n = m.group(1), int(m.group(2))
    if g == 'tommy-hilfiger-floor': return f'{WB}/images_samples_Tommy_{n:02d}.jpg'
    if g == 'tommy-hilfiger-store': return f'{WB}/images_samples_Tommy_2_{n:02d}.jpg'
    if g == 'canadian-tire': return f'{WB}/images_samples_canadian_tire_Canadian-Tire_{n}.jpg'
    if g == 'kfc':
        for e in ('JPG', 'jpg'):
            f = f'{WB}/images_samples_kfc_{n}.{e}'
            if os.path.exists(f): return f
    if g == 'discount-office': return os.path.join(WB, sorted(f for f in os.listdir(WB) if 'discount' in f)[n - 1])
def lqip(path):
    im = Image.open(path).convert('RGB'); im.thumbnail((16, 16)); b = io.BytesIO(); im.save(b, 'WEBP', quality=40)
    return 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
for f in os.listdir(OUT): os.remove(os.path.join(OUT, f))
out, src_used = {}, {}
for i in ids:
    a = man_a.get(i)
    webp = (a or {}).get('web', {}).get('webp', [])
    if a and webp and all(os.path.exists(os.path.join(ROOT, p)) for p in webp):
        ws = []
        for p in webp:
            w = int(re.search(r'-(\d+)\.webp$', p).group(1))
            if w > 2400: continue
            ws.append(w)
            for ext in ('webp', 'avif'):
                s = os.path.join(ROOT, p[:-4] + ext)
                if os.path.exists(s): shutil.copy(s, os.path.join(OUT, f'{i}-{w}.{ext}'))
        W, H = a['master_px']
        out[i] = {'w': W, 'h': H, 'ws': sorted(ws), 'lqip': lqip(os.path.join(OUT, f'{i}-{min(ws)}.webp'))}
        src_used[i] = 'agent-a'
    else:
        f = wayback(i)
        im = Image.open(f).convert('RGB')
        ws = [w for w in (480, 800, 1200) if w <= im.width] or [im.width]
        for w in ws:
            r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
            r.save(os.path.join(OUT, f'{i}-{w}.webp'), quality=82, method=6)
            r.save(os.path.join(OUT, f'{i}-{w}.avif'), quality=60)
        out[i] = {'w': im.width, 'h': im.height, 'ws': ws, 'lqip': lqip(f)}
        src_used[i] = 'wayback-fallback'
# Stock photos (kind 'stock', assets/stock/stock_manifest.json): every id referenced as S('id') in src/data/stock.ts.
stock_ids = sorted(set(re.findall(r"S\('([a-z0-9-]+)'", open(os.path.join(APP, 'src/data/stock.ts')).read())))
HERO_IDS = {'floor-coating-crew', 'floor-coating-wide', 'drywall-retail-shell', 'mississauga-aerial', 'cranes-concrete-frame', 'cranes-dusk', 'office-fitout-finished', 'ceiling-lift-install', 'rooftop-hvac'}
man_s = json.load(open(os.path.join(ROOT, 'assets/stock/stock_manifest.json')))
for i in stock_ids:
    a = man_s[i]; ws = []
    for p in a['web']['webp']:
        w = int(re.search(r'-(\d+)\.webp$', p).group(1))
        if w > 2400: continue
        ws.append(w)
        for ext in ('webp', 'avif'):
            shutil.copy(os.path.join(ROOT, p[:-4] + ext), os.path.join(OUT, f'{i}-{w}.{ext}'))
    W, H = a['source_px']
    if i in HERO_IDS:  # full-bleed heroes sit under a 66% ink scrim: lighter AVIF keeps mobile LCP down
        big = Image.open(os.path.join(ROOT, [p for p in a['web']['webp'] if p.endswith('-2400.webp')][0])).convert('RGB')
        for w in ws:
            big.resize((w, round(big.height * w / big.width)), Image.LANCZOS).save(os.path.join(OUT, f'{i}-{w}.avif'), quality=38, speed=6)
    out[i] = {'w': W, 'h': H, 'ws': sorted(ws), 'lqip': lqip(os.path.join(OUT, f'{i}-{min(ws)}.webp'))}
    src_used[i] = 'stock'
json.dump(out, open(os.path.join(APP, 'src/data/images.json'), 'w'))
print(json.dumps(src_used, indent=0))
