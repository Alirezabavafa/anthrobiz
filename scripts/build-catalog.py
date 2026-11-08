"""Build the catalog from researched records and downloaded provider icons."""
import json, shutil, re
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
sources=root.parent/'catalog-research'
rows=[]
for group in ['marketing','operations','productivity']:
    rows+=json.loads((sources/f'{group}.json').read_text())
assert len(rows)>=100 and len({r['id'] for r in rows})==len(rows)
manifest=[]
for t in rows:
    assert t['pricingUrl'].startswith('https://') and t['url'].startswith('https://')
    source=Path(t.get('logoLocal') or '')
    if not source.is_file(): raise ValueError(f"Missing actual logo: {t['id']}")
    target=root/'web/logos'/f"{t['id']}.png"
    if source.suffix.lower()=='.svg':
        # Render trusted brand SVG as an inert PNG before serving it.
        manifest.append({'input':str(source),'output':str(target)})
    else:
        im=Image.open(source).convert('RGBA');im.thumbnail((128,128),Image.Resampling.LANCZOS);im.save(target)
    t['logo']=f"logos/{t['id']}.png"
    t.pop('logoLocal',None)
    t['color']='#ffffff'
    t['question']='Does this plan include the features, usage allowance and permissions your business needs?'
    free=t.get('freePlan') is True
    cost=0 if free else t.get('monthlyUSD')
    known=t.get('pricingStatus')=='verified' and cost is not None
    if known:
        entry=4 if free else 3 if cost<=25 else 2 if cost<=50 else 1 if cost<=100 else 0
        t['score']=3+entry+(3 if free else 0)
        t['scoreReason']=f"Published entry price: 3/3. Entry-cost band: {entry}/4. Confirmed free plan: {3 if free else 0}/3. Based on the listed entry plan, not total business cost or product quality."
    else:
        t['score']=None
        t['scoreReason']='Not scored: comparable USD entry-cost evidence is unavailable. This is not a judgment of product quality.'
    t['scoreMethod']='AnthroBiz getting-started accessibility v1'
    # Keep exact provenance without affiliate or tracking parameters in source links.
    if t.get('evidenceUrl'):t['evidenceUrl']=t['evidenceUrl'].split('?')[0]
rows.sort(key=lambda t:t['name'].lower())
(root/'research/catalog.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
(root/'web/catalog.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
(root/'web/catalog.js').write_text('window.ANTHROBIZ_CATALOG = '+json.dumps(rows,ensure_ascii=False)+';\n')
(sources/'svg-manifest.json').write_text(json.dumps(manifest))
print(json.dumps({'tools':len(rows),'categories':len({r['category'] for r in rows}),'verified':sum(r['pricingStatus']=='verified' for r in rows),'scored':sum(r['score'] is not None for r in rows),'svg':len(manifest)}))
