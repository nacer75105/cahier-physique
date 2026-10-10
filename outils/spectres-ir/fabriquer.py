"""Fabrique public/app/02-spectres-ir.js à partir des spectres JCAMP-DX du NIST
(dossier jcamp/). Usage, depuis la racine du dépôt :
    python outils/spectres-ir/fabriquer.py public/app/02-spectres-ir.js
Voir LISEZMOI.md."""
import sys, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from jdx import lire
N = os.path.join(os.path.dirname(os.path.abspath(__file__)), "jcamp") + os.sep
L = [
 ("ethanol","éthanol","C64175-3","CH3-CH2-OH","alcool"),
 ("ethanal","éthanal","C75070-2","CH3-CHO","aldehyde"),
 ("butanone","butanone","C78933-2","CH3-CO-CH2-CH3","cetone"),
 ("acide-ethanoique","acide éthanoïque","C64197-2","CH3-COOH","acide"),
 ("butanol-pur","butan-1-ol pur (liquide)","C71363-2","CH3-CH2-CH2-CH2-OH","alcool"),
 ("butanol-dilue","butan-1-ol très dilué (0,5 % dans CCl₄)","C71363-3","CH3-CH2-CH2-CH2-OH","alcool"),
 ("propan-2-ol","propan-2-ol","C67630-3","CH3-CHOH-CH3","alcool"),
 ("propanone","propanone","C67641-3","CH3-CO-CH3","cetone"),
 ("acide-butanoique","acide butanoïque","C107926-1","CH3-CH2-CH2-COOH","acide"),
 ("propan-1-ol","propan-1-ol","C71238-3","CH3-CH2-CH2-OH","alcool"),
 ("heptanal","heptanal","C111717-0","CH3-(CH2)5-CHO","aldehyde"),
]
PAS = 5; HAUT = 3800; BAS = 600
out = {}
for cle, nom, f, form, fam in L:
    h, x, y = lire(N + f + ".jdx")
    pts = sorted(zip(x, y))
    xmin, xmax = pts[0][0], pts[-1][0]
    s0 = min(HAUT, int(xmax // PAS) * PAS)
    vals = []
    s = s0
    while s >= max(BAS, xmin):
        b = [v for (u, v) in pts if abs(u - s) <= PAS / 2]
        if not b:
            b = [min(pts, key=lambda p: abs(p[0] - s))[1]]
        t = sum(b) / len(b)
        vals.append(max(0, min(1000, round(1000 * t))))
        s -= PAS
    out[cle] = {"nom": nom, "formule": form, "famille": fam, "s0": s0, "pas": PAS, "t": vals,
                "source": "Coblentz Society, spectre n° " + h["SOURCE REFERENCE"].split()[-1] + " (NIST Chemistry WebBook, SRD 69)",
                "etat": h["STATE"]}
    print(cle, s0, len(vals), min(vals), max(vals), h["STATE"][:60], file=sys.stderr)
js = ["/* =====================================================================",
"   Spectres infrarouges RÉELS (ch7, s8), jamais dessinés à la main.",
"   Source : Coblentz Society, via le NIST Chemistry WebBook (SRD 69),",
"   https://webbook.nist.gov/chemistry/ — fichiers JCAMP-DX téléchargés le",
"   2026-10-10, numéro Coblentz indiqué pour chacun. Tous en PHASE",
"   CONDENSÉE (liquide pur, ou solution dans CCl4 au-dessus de ~1330 cm-1",
"   et CS2 en dessous), comme les spectres des manuels et des sujets : en",
"   phase gazeuse, la bande O–H d'un alcool est fine (vers 3650 cm-1), et",
"   c'est en phase condensée que les liaisons hydrogène l'élargissent.",
"   Rééchantillonnage : moyenne des points mesurés à ±2,5 cm-1 de chaque",
"   nombre d'onde, tous les 5 cm-1, de s0 vers le bas jusqu'à 600 cm-1.",
"   t = transmittance en pour mille, bornée à 0-1000 (quelques points",
"   numérisés dépassaient 100 % de quelques pour mille).",
"   Fabriqué par outils/spectres-ir/fabriquer.py (voir son LISEZMOI) :",
"   ne pas éditer à la main.",
"   ===================================================================== */",
"window.SPECTRES_IR = {"]
for k, v in out.items():
    js.append('  "%s": {nom:%s, formule:%s, famille:"%s", source:%s, etat:%s, s0:%d, pas:%d,' % (k, json.dumps(v["nom"], ensure_ascii=False), json.dumps(v["formule"]), v["famille"], json.dumps(v["source"], ensure_ascii=False), json.dumps(v["etat"]), v["s0"], v["pas"]))
    js.append('   t:[' + ",".join(map(str, v["t"])) + ']},')
js[-1] = js[-1].rstrip(",")
js.append("};")
open(sys.argv[1] if len(sys.argv) > 1 else "02-spectres-ir.js", "w", encoding="utf-8", newline=chr(10)).write(chr(10).join(js) + chr(10))
