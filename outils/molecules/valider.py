"""Validation croisée d'une molécule construite (public/app/molecules/<nom>.mol)
contre une géométrie de référence B3LYP/6-31G* du CCCBDB (outils/molecules/b3lyp/<nom>.json).

Les atomes des deux fichiers ne sont pas numérotés pareil : on les fait
correspondre par la connectivité (même élément, mêmes voisins), en essayant
toutes les permutations des H d'un même atome et en gardant celle qui écarte
le moins l'ensemble des distances interatomiques. On compare ensuite CHAQUE liaison (écart en pm) et CHAQUE
angle entre deux liaisons (écart en degrés).

CRITÈRE (décision du chantier, 2026-10-10) : chaque liaison à moins de 2 pm,
et chaque angle ENTRE ATOMES LOURDS (C, O) à moins de 1,5°. Les angles qui
font intervenir un H sont affichés pour information, jamais disqualifiants :
l'éthanol MESURÉ s'écarte lui-même de son B3LYP de 3,4° sur H–C–H et de 2,5°
sur C–O–H — c'est l'écart normal mesure/calcul sur les hydrogènes.

Usage : python outils/molecules/valider.py propan-1-ol [--seuils 2 1.5]
Code de sortie 1 si un écart dépasse les seuils.
"""
import sys, os, json, math, itertools
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(os.path.dirname(ICI))

def lire_mol(chemin):
    L = open(chemin, encoding="ascii").read().splitlines()
    na, nl = int(L[3][0:3]), int(L[3][3:6])
    at = [(L[4 + i][31:34].strip(), [float(L[4 + i][0:10]), float(L[4 + i][10:20]), float(L[4 + i][20:30])]) for i in range(na)]
    li = [(int(L[4 + na + j][0:3]) - 1, int(L[4 + na + j][3:6]) - 1) for j in range(nl)]
    return at, li

def dist(p, q): return math.sqrt(sum((p[i] - q[i]) ** 2 for i in range(3)))
def angle(p, c, q):
    u = [p[i] - c[i] for i in range(3)]; v = [q[i] - c[i] for i in range(3)]
    return math.degrees(math.acos(max(-1, min(1, sum(u[i] * v[i] for i in range(3)) / (math.sqrt(sum(x * x for x in u)) * math.sqrt(sum(x * x for x in v)))))))

def liaisons_par_distance(at):
    out = []
    for i in range(len(at)):
        for j in range(i + 1, len(at)):
            lim = 1.25 if "H" in (at[i][0], at[j][0]) else 1.75
            if dist(at[i][1], at[j][1]) < lim: out.append((i, j))
    return out

def voisins(n, li):
    v = [[] for _ in range(n)]
    for a, b in li: v[a].append(b); v[b].append(a)
    return v

def correspondances(A, la, B, lb):
    """Toutes les bijections A → B qui respectent éléments et liaisons (petites molécules)."""
    va, vb = voisins(len(A), la), voisins(len(B), lb)
    lourds_a = [i for i, a in enumerate(A) if a[0] != "H"]
    lourds_b = [i for i, b in enumerate(B) if b[0] != "H"]
    sols = []
    for perm in itertools.permutations(lourds_b):
        m = dict(zip(lourds_a, perm))
        if any(A[i][0] != B[m[i]][0] for i in lourds_a): continue
        if any((m[x] in vb[m[i]]) != (x in va[i]) for i in lourds_a for x in lourds_a): continue
        # les H : chacun suit son atome porteur ; on essaie les permutations par porteur
        groupes = []
        for i in lourds_a:
            ha = [h for h in va[i] if A[h][0] == "H"]; hb = [h for h in vb[m[i]] if B[h][0] == "H"]
            if len(ha) != len(hb): break
            groupes.append((ha, hb))
        else:
            for choix in itertools.product(*[itertools.permutations(hb) for ha, hb in groupes]):
                mm = dict(m)
                for (ha, hb), c in zip(groupes, choix): mm.update(zip(ha, c))
                sols.append(mm)
    return sols

def comparer(nom, seuil_pm=2.0, seuil_deg=1.5, bavard=True):
    A, la = lire_mol(os.path.join(RACINE, "public", "app", "molecules", nom + ".mol"))
    ref = json.load(open(os.path.join(ICI, "b3lyp", nom + ".json"), encoding="utf-8"))
    B = [(a[0].rstrip("0123456789"), a[1:4]) for a in ref["atomes"]]
    lb = liaisons_par_distance(B)
    va = voisins(len(A), la)
    angles = [(i, c, k) for c in range(len(A)) for i, k in itertools.combinations(va[c], 2)]
    meilleur = None
    # l'appariement retenu est celui qui écarte le moins TOUTES les distances interatomiques :
    # un critère sur les seuls angles confondait un H dans le plan et un H hors du plan
    paires = [(i, j) for i in range(len(A)) for j in range(i + 1, len(A))]
    for m in correspondances(A, la, B, lb):
        s = sum((dist(A[i][1], A[j][1]) - dist(B[m[i]][1], B[m[j]][1])) ** 2 for i, j in paires)
        if meilleur is None or s < meilleur[0]: meilleur = (s, m)
    if meilleur is None: raise SystemExit(nom + " : aucune correspondance d'atomes (connectivité différente)")
    m = meilleur[1]
    nomA = lambda i: A[i][0] + str(i + 1)
    dl = sorted(((abs(dist(A[a][1], A[b][1]) - dist(B[m[a]][1], B[m[b]][1])) * 100, nomA(a) + "–" + nomA(b), dist(A[a][1], A[b][1]) * 100, dist(B[m[a]][1], B[m[b]][1]) * 100) for a, b in la), reverse=True)
    da = sorted(((abs(angle(A[i][1], A[c][1], A[k][1]) - angle(B[m[i]][1], B[m[c]][1], B[m[k]][1])), nomA(i) + "–" + nomA(c) + "–" + nomA(k), angle(A[i][1], A[c][1], A[k][1]), angle(B[m[i]][1], B[m[c]][1], B[m[k]][1])) for i, c, k in angles), reverse=True)
    lourds = [x for x in da if "H" not in [p.rstrip("0123456789") for p in x[1].split("–")]]
    avecH = [x for x in da if x not in lourds]
    ok = dl[0][0] <= seuil_pm and (not lourds or lourds[0][0] <= seuil_deg)
    if bavard:
        print(f"{nom} : {'ACCEPTÉ' if ok else 'REFUSÉ'} — liaison max {dl[0][0]:.2f} pm ({dl[0][1]}), "
              f"angle entre atomes lourds max {lourds[0][0] if lourds else 0:.2f}°"
              f" ; pour information, angle impliquant un H max {avecH[0][0] if avecH else 0:.2f}° ({avecH[0][1] if avecH else '-'})")
        for x in dl[:3]: print(f"   liaison {x[1]:10s} construit {x[2]:7.2f} pm  B3LYP {x[3]:7.2f} pm  écart {x[0]:.2f}")
        for x in lourds: print(f"   angle   {x[1]:14s} construit {x[2]:7.2f}°  B3LYP {x[3]:7.2f}°  écart {x[0]:.2f}")
    return dl[0], (lourds[0] if lourds else None), ok

if __name__ == "__main__":
    a = sys.argv[1:]
    s = [2.0, 1.5]
    if "--seuils" in a: i = a.index("--seuils"); s = [float(a[i + 1]), float(a[i + 2])]; a = a[:i] + a[i + 3:]
    ok = all(comparer(n, *s)[2] for n in a)
    sys.exit(0 if ok else 1)
