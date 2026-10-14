"""Données de TP des scripts du ch11 (bilan énergétique) : chutes pointées.

Règle du cahier : des mesures de TP réalistes, jamais « trop parfaites ». Les
altitudes viennent d'un modèle de chute AVEC la traînée de l'air (force
½·ρ·Cd·S·v², intégrée pas à pas), puis d'un pointage simulé : un bruit
gaussien d'écart-type 2 mm (un à deux pixels sur une vidéo d'un mètre de
haut), graine fixe, arrondi au millimètre affiché par le logiciel.

Choix de la graine (balle) : parmi les graines 1 à 400, l'étendue de Em
(points 1 à 7) a pour médiane 11 mJ (quartiles 8 et 14). La graine 157 donne
9 mJ et une pente de Em nulle : un tirage TYPIQUE, ni flatteur ni alarmant.
`python chutes.py --graines` refait cette étude.

Usage : python outils/donnees-tp/chutes.py   (affiche les listes et les bilans)
"""
import math, random

G, RHO_AIR = 9.81, 1.2

def chute(m, d, cd, z0, tau, n):
    """altitudes vraies aux instants i·tau (lâcher sans vitesse)"""
    k = 0.5 * RHO_AIR * cd * math.pi * (d / 2) ** 2
    dt, t, z, v, out = 1e-5, 0.0, z0, 0.0, []
    for i in range(n):
        while t < i * tau - 1e-12:
            v += (-G + k * v * v / m) * dt
            z += v * dt
            t += dt
        out.append(z)
    return out

def bilan(z, m, tau):
    lignes = []
    for i in range(1, len(z) - 1):
        v = (z[i + 1] - z[i - 1]) / (2 * tau)
        ec, epp = round(1000 * 0.5 * m * v * v), round(1000 * m * G * z[i])
        lignes.append((i, ec, epp, ec + epp))
    return lignes

# balle de tennis : 58 g, 6,7 cm, Cd ≈ 0,55 ; 20 images/s gardées d'une vidéo à 60 images/s
BALLE = chute(0.058, 0.067, 0.55, 1.00, 0.05, 9)
BRUIT = random.Random(157)              # un tirage typique : étendue de Em proche de la médiane, sans tendance
ALEA = [BRUIT.gauss(0, 0.002) for _ in BALLE]
BALLE_MM = [round(z + a, 3) for z, a in zip(BALLE, ALEA)]
BALLE_CM = [round(z + a, 2) for z, a in zip(BALLE, ALEA)]
BALLE_MM[0] = 1.000; BALLE_CM[0] = 1.00          # le lâcher est pointé sur la mire de 1,00 m
# volant de badminton : 5,0 g, vitesse limite 6,8 m/s (Cd·S choisi pour cela), 10 images/s
k_vol = 0.005 * G / 6.8 ** 2
VOLANT = chute(0.005, 2 * math.sqrt(k_vol / (0.5 * RHO_AIR * 1.0 * math.pi)), 1.0, 3.0, 0.1, 9)
R2 = random.Random(3)
VOLANT_MM = [round(z + R2.gauss(0, 0.003), 3) for z in VOLANT]
VOLANT_MM[0] = 3.000

if __name__ == "__main__" and "--graines" in __import__("sys").argv:
    import statistics
    etendues = {}
    for g in range(1, 401):
        r = random.Random(g); a = [r.gauss(0, 0.002) for _ in BALLE]
        z = [round(x + e, 3) for x, e in zip(BALLE, a)]; z[0] = 1.000
        em = [l[3] for l in bilan(z, 0.058, 0.05)]
        etendues[g] = max(em) - min(em)
    print("médiane", statistics.median(etendues.values()), "quartiles", statistics.quantiles(etendues.values(), n=4), "graine 157 :", etendues[157])
elif __name__ == "__main__":
    for nom, z, m, tau in [("balle au mm", BALLE_MM, 0.058, 0.05), ("balle au cm", BALLE_CM, 0.058, 0.05),
                           ("volant au mm", VOLANT_MM, 0.005, 0.1)]:
        print(nom, z)
        for i, ec, epp, em in bilan(z, m, tau): print(f"  Point {i} : Ec = {ec} mJ ; Epp = {epp} mJ ; Em = {em} mJ")
    print("balle, Em vraie (sans pointage) :", [round(1000 * (0.5 * 0.058 * ((BALLE[i+1]-BALLE[i-1])/0.1)**2 + 0.058*G*BALLE[i]), 1) for i in range(1, 8)])
