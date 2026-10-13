"""Fabrique public/app/02-spectres-uv.js à partir des spectres d'absorption
UV-visible téléchargés (dossier donnees/). Usage, depuis la racine du dépôt :
    python outils/spectres-uv/fabriquer.py public/app/02-spectres-uv.js
Voir LISEZMOI.md."""
import sys, os
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "donnees") + os.sep
# clé, nom, fichier, solvant, source (affichée sous la figure)
L = [
 ("bleu-methylene", "bleu de méthylène", "mb-water.txt", "eau",
  "S. Prahl, Oregon Medical Laser Center (omlc.org/spectra/mb), solution à 10 µmol/L, cuve de 1 cm"),
 ("rhodamine-b", "rhodamine B", "009-abs.txt", "éthanol",
  "PhotochemCAD (Du 1998, Dixon 2005), mesure de R.-C. A. Fuh sur Cary 3, via omlc.org"),
 ("proflavine", "proflavine", "078-abs.txt", "eau (pH 7)",
  "PhotochemCAD (Du 1998, Dixon 2005), mesure de R.-C. A. Fuh sur Cary 3, via omlc.org"),
]
L0, L1, PAS = 380, 700, 2

def lire(f):
    pts = []
    for l in open(D + f, encoding="utf8", errors="replace"):
        if l.startswith("#") or not l.strip():
            continue
        p = l.split()
        try:
            pts.append((float(p[0]), float(p[1])))
        except ValueError:
            pass
    return sorted(pts)

def interp(pts, x):
    for (a, ya), (b, yb) in zip(pts, pts[1:]):
        if a <= x <= b:
            return ya + (yb - ya) * (x - a) / (b - a) if b > a else ya
    raise ValueError("hors des mesures : %s" % x)

out = []
for cle, nom, f, solv, src in L:
    pts = lire(f)
    # moyenne des points mesurés à ±1 nm de chaque longueur d'onde (pas de
    # 0,25 nm pour PhotochemCAD, 2 nm pour le bleu de méthylène : alors
    # interpolation linéaire entre les deux mesures voisines)
    brut = []
    for l in range(L0, L1 + 1, PAS):
        b = [y for (x, y) in pts if abs(x - l) <= PAS / 2]
        brut.append(sum(b) / len(b) if len(b) >= 2 else interp(pts, l))
    m = max(brut)
    lmax = L0 + PAS * brut.index(m)
    a = [max(0, round(1000 * y / m)) for y in brut]
    out.append((cle, nom, solv, src, lmax, a))
    print(cle, "lambda max", lmax, "nm, epsilon max", round(m), file=sys.stderr)

js = ["/* =====================================================================",
"   Spectres d'absorption UV-visible RÉELS (ch2, s2), jamais dessinés à la main.",
"   Sources : base PhotochemCAD 2.1a (H. Du et al., Photochem. Photobiol. 68,",
"   141, 1998 ; J. M. Dixon et al., Photochem. Photobiol. 81, 212, 2005),",
"   fichiers diffusés par S. Prahl (Oregon Medical Laser Center, omlc.org,",
"   2017) ; bleu de méthylène mesuré par S. Prahl (omlc.org/spectra/mb).",
"   Téléchargés le 2026-10-13 (outils/spectres-uv/donnees/).",
"   a = absorbance rapportée à sa valeur au maximum du visible, en pour mille,",
"   tous les 2 nm de 380 à 700 nm (moyenne des mesures à ±1 nm ; celles de",
"   la rhodamine B s'arrêtent à 700 nm). La figure",
"   la multiplie par l'absorbance maximale choisie : toute la courbe est",
"   proportionnelle à la concentration (loi de Beer-Lambert).",
"   Fabriqué par outils/spectres-uv/fabriquer.py (voir son LISEZMOI) :",
"   ne pas éditer à la main.",
"   ===================================================================== */",
"window.SPECTRES_UV = {"]
for cle, nom, solv, src, lmax, a in out:
    js.append('  "%s": {nom:"%s", solvant:"%s", source:"%s", lmax:%d, l0:%d, pas:%d,' % (cle, nom, solv, src, lmax, L0, PAS))
    js.append('   a:[' + ",".join(map(str, a)) + ']},')
js.append("};")
open(sys.argv[1], "w", encoding="utf8").write("\n".join(js) + "\n")
