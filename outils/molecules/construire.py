"""Construit les fichiers public/app/molecules/*.mol (MOL V2000, ångströms).

Chaque molécule est décrite par une MATRICE Z : pour chaque atome, une
longueur de liaison, un angle et un dièdre par rapport à des atomes déjà
placés. Les longueurs et angles viennent des géométries EXPÉRIMENTALES du
NIST CCCBDB (voir LISEZMOI.md et references.json) ; ce que la mesure ne
donne pas (dièdres, positions des H d'un CH2…) est fixé par la symétrie et la
conformation, et marqué « complément » en commentaire. L'éthanol (coordonnées
expérimentales) et le propan-2-ol (géométrie calculée B3LYP) sont recopiés
tels quels ; le méthane (methane.mol) est écrit à la main depuis sa fiche.

Usage, depuis la racine du dépôt :
    python outils/molecules/construire.py public/app/molecules
"""
import sys, os, math

TETRA = math.degrees(math.acos(-1 / 3))          # 109,47° : angle tétraédrique

def hcc_methyle(hch):
    """Angle H–C–C d'un méthyle de symétrie C3v (axe le long de C–C) dont l'angle
    H–C–H vaut hch : sin(α) = (2/√3)·sin(hch/2), α étant l'angle C–H / axe."""
    a = math.degrees(math.asin(2 / math.sqrt(3) * math.sin(math.radians(hch) / 2)))
    return 180 - a

def hcc_methylene(ccc, hch=TETRA):
    """Angle H–C–C des deux H d'un CH2 placés symétriquement par rapport au plan
    C–C–C, l'angle H–C–H valant hch, entre deux voisins faisant l'angle ccc."""
    a = math.sqrt((1 + math.cos(math.radians(hch))) / 2)       # composante le long de -bissectrice
    return math.degrees(math.acos(-a * math.cos(math.radians(ccc) / 2)))

def dihedre_methylene(ccc, hcc):
    """Dièdre H–C–C'–C'' (C' central, voisins C et C'') qui place un H du CH2 de
    façon symétrique : calculé numériquement pour respecter hcc avec les DEUX voisins."""
    # on cherche φ tel que l'angle H–C–C'' vaille aussi hcc (par construction l'angle avec C vaut hcc)
    best = None
    for k in range(0, 36000):
        phi = k / 100
        p = zmat([("C", None, None, None), ("C", (0, 1.5), None, None), ("C", (1, 1.5), (0, ccc), None),
                  ("H", (1, 1.0), (0, hcc), (2, phi))])
        a2 = angle(p[3][1], p[1][1], p[2][1])
        if best is None or abs(a2 - hcc) < best[0]: best = (abs(a2 - hcc), phi)
        if best[0] < 1e-6: break
    return best[1]

def place(a, b, c, r, ang, dih):
    """Position d'un atome à distance r de a, angle (x, a, b) = ang, dièdre (x, a, b, c) = dih."""
    ang, dih = math.radians(ang), math.radians(dih)
    bc = [b[i] - c[i] for i in range(3)]            # de c vers b (convention NeRF)
    ab = [a[i] - b[i] for i in range(3)]
    nb = math.sqrt(sum(x * x for x in ab)); ab = [x / nb for x in ab]
    n = [bc[1] * ab[2] - bc[2] * ab[1], bc[2] * ab[0] - bc[0] * ab[2], bc[0] * ab[1] - bc[1] * ab[0]]
    nn = math.sqrt(sum(x * x for x in n)); n = [x / nn for x in n]
    m = [n[1] * ab[2] - n[2] * ab[1], n[2] * ab[0] - n[0] * ab[2], n[0] * ab[1] - n[1] * ab[0]]
    d = [-r * math.cos(ang), r * math.sin(ang) * math.cos(dih), r * math.sin(ang) * math.sin(dih)]
    return [a[i] + d[0] * ab[i] + d[1] * m[i] + d[2] * n[i] for i in range(3)]

def zmat(lignes):
    """lignes : (élément, (i, r), (j, angle), (k, dièdre)) avec i, j, k des indices déjà placés."""
    pos = []
    for el, br, ar, dr in lignes:
        if br is None: p = [0.0, 0.0, 0.0]
        elif ar is None: p = [pos[br[0]][1][0] + br[1], pos[br[0]][1][1], pos[br[0]][1][2]]
        elif dr is None:
            a = pos[br[0]][1]; b = pos[ar[0]][1]
            # troisième atome : dans le plan xy, de l'autre côté
            u = [b[i] - a[i] for i in range(3)]; nu = math.sqrt(sum(x * x for x in u)); u = [x / nu for x in u]
            v = [-u[1], u[0], 0.0]
            t = math.radians(ar[1])
            p = [a[i] + br[1] * (math.cos(t) * u[i] + math.sin(t) * v[i]) for i in range(3)]
        else:
            p = place(pos[br[0]][1], pos[ar[0]][1], pos[dr[0]][1], br[1], ar[1], dr[1])
        pos.append((el, p))
    return pos

def dist(p, q): return math.sqrt(sum((p[i] - q[i]) ** 2 for i in range(3)))
def angle(p, c, q):
    u = [p[i] - c[i] for i in range(3)]; v = [q[i] - c[i] for i in range(3)]
    return math.degrees(math.acos(max(-1, min(1, sum(u[i] * v[i] for i in range(3)) / (math.sqrt(sum(x * x for x in u)) * math.sqrt(sum(x * x for x in v)))))))

def ecrire_mol(chemin, titre, commentaire, pos, liaisons):
    # ligne 2 : programme ; ligne 3 : commentaire libre (80 caractères au plus, non coupé en deux)
    L = [titre, "  cahier-physique  Angstrom, voir outils/molecules/LISEZMOI.md", commentaire[:80],
         "%3d%3d  0  0  0  0  0  0  0  0999 V2000" % (len(pos), len(liaisons))]
    for el, p in pos:
        L.append("%10.4f%10.4f%10.4f %-3s 0  0  0  0  0  0  0  0  0  0  0  0" % (p[0], p[1], p[2], el))
    for a, b, o in liaisons:
        L.append("%3d%3d%3d  0  0  0  0" % (a + 1, b + 1, o))
    L.append("M  END")
    open(chemin, "w", encoding="ascii", newline="\n").write("\n".join(L) + "\n")

def liaisons_auto(pos, doubles=()):
    out = []
    for i in range(len(pos)):
        for j in range(i + 1, len(pos)):
            lim = 1.25 if "H" in (pos[i][0], pos[j][0]) else 1.75
            if dist(pos[i][1], pos[j][1]) < lim:
                out.append((i, j, 2 if (i, j) in doubles else 1))
    return out

# ============================ les molécules ============================
# Valeurs : CCCBDB, géométries expérimentales (URL et références dans references.json).
# OH de l'acide éthanoïque : r(O–H) = 0,97 Å (valeur standard d'un COOH, décision du
# chantier) ; angle C–O–H de l'acide formique expérimental (CCCBDB), même groupe COOH,
# lu dans references.json (_complements).

def molecules(coh_formique):
    M = {}
    # ---- éthanal (Hollenstein & Günthard 1971) : Cs, un H du méthyle éclipse C=O
    hcc = hcc_methyle(108.3)
    M["ethanal"] = ("ethanal", zmat([
        ("C", None, None, None),                       # C1 carbonyle
        ("C", (0, 1.501), None, None),                 # C2 méthyle
        ("O", (0, 1.216), (1, 123.9), None),           # O3
        ("H", (0, 1.114), (1, 117.5), (2, 180)),       # H4 de CHO, dans le plan
        ("H", (1, 1.086), (0, hcc), (2, 0)),           # H5 éclipse C=O (complément : conformation)
        ("H", (1, 1.086), (0, hcc), (2, 120)),
        ("H", (1, 1.086), (0, hcc), (2, -120)),
    ]), {(0, 2)})
    # ---- propanone (Kuchitsu 1998) : C2v, un H de chaque méthyle éclipse C=O
    M["propanone"] = ("propanone", zmat([
        ("C", None, None, None),                       # C1 carbonyle
        ("O", (0, 1.214), None, None),                 # O2
        ("C", (0, 1.520), (1, 122.0), None),           # C3
        ("C", (0, 1.520), (1, 122.0), (2, 180)),       # C4 (CCC = 116°)
        ("H", (2, 1.103), (0, 110.5), (1, 0)), ("H", (2, 1.103), (0, 110.5), (1, 120)), ("H", (2, 1.103), (0, 110.5), (1, -120)),
        ("H", (3, 1.103), (0, 110.5), (1, 0)), ("H", (3, 1.103), (0, 110.5), (1, 120)), ("H", (3, 1.103), (0, 110.5), (1, -120)),
    ]), {(0, 1)})
    # ---- acide éthanoïque (Hellwege 1976) : Cs, OH syn (O=C–O–H = 0°), un H du méthyle éclipse C=O
    M["acide-ethanoique"] = ("acide ethanoique", zmat([
        ("C", None, None, None),                       # C1 méthyle
        ("C", (0, 1.517), None, None),                 # C2 carboxyle
        ("O", (1, 1.212), (0, 126.6), None),           # O3 (=O)
        ("O", (1, 1.361), (0, 110.6), (2, 180)),       # O4 (–OH)
        ("H", (3, 0.97), (1, coh_formique), (2, 0)),   # H5 hydroxyle (0,97 Å standard ; angle : acide formique)
        ("H", (0, 1.100), (1, TETRA), (2, 0)),         # méthyle : HCC tétraédrique (complément, non mesuré)
        ("H", (0, 1.100), (1, TETRA), (2, 120)), ("H", (0, 1.100), (1, TETRA), (2, -120)),
    ]), {(1, 2)})
    # ---- butane anti (Kuchitsu 1998, rg) : C2h, CCCC = 180°, méthyles décalés.
    # HCC = 111° (moyenne mesurée) pour les méthyles ; pour les CH2, HCH tétraédrique
    # (complément : 111° partout donnerait HCH = 98°, impossible).
    hm = hcc_methylene(113.8); dm = dihedre_methylene(113.8, hm)
    M["butane"] = ("butane", zmat([
        ("C", None, None, None), ("C", (0, 1.531), None, None),
        ("C", (1, 1.531), (0, 113.8), None), ("C", (2, 1.531), (1, 113.8), (0, 180)),
        ("H", (0, 1.117), (1, 111.0), (2, 180)), ("H", (0, 1.117), (1, 111.0), (2, 60)), ("H", (0, 1.117), (1, 111.0), (2, -60)),
        ("H", (1, 1.117), (0, hm), (2, dm)), ("H", (1, 1.117), (0, hm), (2, -dm)),
        ("H", (2, 1.117), (3, hm), (1, dm)), ("H", (2, 1.117), (3, hm), (1, -dm)),
        ("H", (3, 1.117), (2, 111.0), (1, 180)), ("H", (3, 1.117), (2, 111.0), (1, 60)), ("H", (3, 1.117), (2, 111.0), (1, -60)),
    ]), set())
    # ---- propan-1-ol et propan-2-ol : AUCUNE mesure au CCCBDB, paramètres TRANSFÉRÉS
    # éthanol (Coussan 1998) : C–O 1,431 ; O–H 0,971 ; C–C(O) 1,512 ; CCO 107,8 ; HOC 105,4 ;
    # C–H méthyle 1,088 (dans le plan) / 1,098, méthylène 1,086.
    # butane (Kuchitsu 1998) : CCC 113,8 ; C–C 1,531 hors C–C(O). HCH, HCC : tétraédriques.
    hm1 = hcc_methylene(107.8); dm1 = dihedre_methylene(107.8, hm1)       # CH2 entre C et O
    hm2 = hcc_methylene(113.8); dm2 = dihedre_methylene(113.8, hm2)       # CH2 entre C et C
    M["propan-1-ol"] = ("propan-1-ol", zmat([
        ("C", None, None, None),                        # C1 (porte OH)
        ("O", (0, 1.431), None, None),                  # O2
        ("C", (0, 1.512), (1, 107.8), None),            # C3
        ("C", (2, 1.531), (0, 113.8), (1, 180)),        # C4 : O–C–C–C = 180° (chaîne trans)
        ("H", (1, 0.971), (0, 105.4), (2, 180)),        # H5 : H–O–C–C = 180° (OH trans)
        ("H", (0, 1.086), (2, hm1), (1, dm1)), ("H", (0, 1.086), (2, hm1), (1, -dm1)),
        ("H", (2, 1.086), (0, hm2), (3, dm2)), ("H", (2, 1.086), (0, hm2), (3, -dm2)),
        ("H", (3, 1.088), (2, TETRA), (0, 180)), ("H", (3, 1.098), (2, TETRA), (0, 60)), ("H", (3, 1.098), (2, TETRA), (0, -60)),
    ]), set())
    return M

def propan2ol():
    """propan-2-ol, Cs, OH trans (H–O–C–H = 180°) : C–C 1,512 (éthanol, C lié à O),
    CCO 107,8°, CCC 113,8° ; le dièdre de C4 est calculé pour respecter les trois angles."""
    best = None
    for k in range(0, 36000):
        phi = k / 100
        p = zmat([("C", None, None, None), ("O", (0, 1.431), None, None), ("C", (0, 1.512), (1, 107.8), None), ("C", (0, 1.512), (1, 107.8), (2, phi))])
        a = angle(p[2][1], p[0][1], p[3][1])
        if best is None or abs(a - 113.8) < best[0]: best = (abs(a - 113.8), phi)
    phi = best[1]
    base = [("C", None, None, None), ("O", (0, 1.431), None, None), ("C", (0, 1.512), (1, 107.8), None), ("C", (0, 1.512), (1, 107.8), (2, phi))]
    p = zmat(base)
    # H du carbone central : à l'opposé de la somme des trois liaisons (complément : C–H méthine 1,086 de l'éthanol)
    c = p[0][1]; s = [0, 0, 0]
    for i in (1, 2, 3):
        d = [p[i][1][j] - c[j] for j in range(3)]; n = math.sqrt(sum(x * x for x in d))
        s = [s[j] + d[j] / n for j in range(3)]
    n = math.sqrt(sum(x * x for x in s)); hC = [c[j] - 1.086 * s[j] / n for j in range(3)]
    pos = p + [("H", hC)]
    # H de OH : trans par rapport au H du carbone central (H–O–C–H = 180°)
    pos.append(("H", place(pos[1][1], pos[0][1], pos[4][1], 0.971, 105.4, 180)))
    # méthyles décalés : un H anti au O (dièdre H–C–C–O = 180°), tétraédriques
    for ci in (2, 3):
        for dd, r in ((180, 1.088), (60, 1.098), (-60, 1.098)):
            pos.append(("H", place(pos[ci][1], pos[0][1], pos[1][1], r, TETRA, dd)))
    return pos

if __name__ == "__main__":
    import json
    sortie = sys.argv[1] if len(sys.argv) > 1 else "public/app/molecules"
    ref = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "references.json"), encoding="utf-8"))
    coh = ref["_complements"]["coh_formique_deg"]["valeur"]
    M = molecules(coh)
    # propan-2-ol : géométrie CALCULÉE (B3LYP/6-31G* du CCCBDB, conformère gauche), recopiée
    # de b3lyp/propan-2-ol.json. Le transfert symétrique ne rend pas l'asymétrie des deux
    # angles C–C–O de ce conformère (111,1° et 106,2°) : voir LISEZMOI. propan2ol() reste
    # pour mémoire (version transférée, refusée par valider.py).
    b3 = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "b3lyp", "propan-2-ol.json"), encoding="utf-8"))
    pos = [(a[0].rstrip("0123456789"), a[1:4]) for a in b3["atomes"]]
    M["propan-2-ol"] = ("propan-2-ol", pos, set())
    # éthanol (Coussan 1998 via CCCBDB) : la fiche ne donne que 8 paramètres internes ; son
    # tableau cartésien, généré par la base avec des hypothèses non documentées, n'est PAS une
    # mesure des H (et contredit sa propre liste : C1–H5). On construit donc depuis les
    # paramètres : C–C 1,512 ; C–O 1,431 ; O–H 0,971 ; C–C–O 107,8 ; C–O–H 105,4 ; C1–H5
    # 1,088 (méthyle, dans le plan) et 1,098 (hors du plan) ; C2–H 1,086. Compléments : anti
    # (H–O–C–C = 180°), méthyle décalé, H–C–H tétraédriques.
    hme = hcc_methylene(107.8); dme = dihedre_methylene(107.8, hme)
    M["ethanol"] = ("ethanol", zmat([
        ("C", None, None, None),                        # C1 méthyle
        ("C", (0, 1.512), None, None),                  # C2
        ("O", (1, 1.431), (0, 107.8), None),            # O3
        ("H", (2, 0.971), (1, 105.4), (0, 180)),        # H4 : H–O–C–C = 180° (anti)
        ("H", (0, 1.088), (1, TETRA), (2, 180)),        # H5 méthyle, dans le plan, anti au O
        ("H", (0, 1.098), (1, TETRA), (2, 60)), ("H", (0, 1.098), (1, TETRA), (2, -60)),
        ("H", (1, 1.086), (0, hme), (2, dme)), ("H", (1, 1.086), (0, hme), (2, -dme)),
    ]), set())
    for cle, (titre, pos, doubles) in M.items():
        ecrire_mol(os.path.join(sortie, cle + ".mol"), titre,
                   "CALCULE B3LYP/6-31G* (CCCBDB), conformere gauche, pas mesure" if cle == "propan-2-ol" else

                   "construit (outils/molecules/construire.py) depuis CCCBDB experimental" if cle != "propan-1-ol" else "construit, parametres TRANSFERES ethanol/butane (CCCBDB)",
                   pos, liaisons_auto(pos, doubles))
        print(cle, len(pos), "atomes")
