"""Solubilités affichées au ch5 (sections s9 et s4, exercices co25 à co27).

Recalcule chaque valeur depuis les fichiers de donnees/ et la recoupe avec une
deuxième source. Sortie : un JSON des valeurs (lu par outils/balayage-solubilite.mjs),
code 1 si un recoupement sort de sa tolérance. Voir LISEZMOI.md.

    python -I -X utf8 outils/solubilites/valeurs.py
"""
import csv, json, os, sys
import xml.etree.ElementTree as ET

ICI = os.path.dirname(os.path.abspath(__file__))
D = os.path.join(ICI, "donnees")
NS = {"t": "http://www.iupac.org/namespaces/ThermoML"}

def thermoml(fichier, composants, prop, var_compo):
    """{composition: valeur} à 298.15 K pour le jeu de données dont les composants
    sont exactement `composants` ; `var_compo` = nom de la variable de composition."""
    r = ET.parse(os.path.join(D, fichier)).getroot()
    tx = lambda e, p: (e.find(p, NS).text or "").strip() if e.find(p, NS) is not None else ""
    noms = {tx(c, "t:RegNum/t:nOrgNum"): tx(c, "t:sCommonName") for c in r.findall("t:Compound", NS)}
    out = {}
    for d in r.findall("t:PureOrMixtureData", NS):
        comps = sorted(noms[tx(x, "t:RegNum/t:nOrgNum")] for x in d.findall("t:Component", NS))
        if comps != sorted(composants): continue
        props = {tx(p, "t:nPropNumber"): p.find(".//t:ePropName", NS).text for p in d.findall("t:Property", NS)}
        if prop not in props.values(): continue
        vars_ = {}
        for v in d.findall("t:Variable", NS):
            nom = v.find(".//t:VariableType/*", NS).text
            vars_[tx(v, "t:nVarNumber")] = (nom, noms.get(tx(v, ".//t:RegNum/t:nOrgNum"), ""))
        for nv in d.findall("t:NumValues", NS):
            vv = {vars_[tx(x, "t:nVarNumber")]: float(tx(x, "t:nVarValue")) for x in nv.findall("t:VariableValue", NS)}
            pv = [float(tx(x, "t:nPropValue")) for x in nv.findall("t:PropertyValue", NS)]
            T = [v for (n, _), v in vv.items() if n.startswith("Temperature")][0]
            if abs(T - 298.15) > 0.2: continue
            compo = [v for k, v in vv.items() if k == var_compo]
            out[compo[0] if compo else None] = pv[0]
    if not out: sys.exit(f"{fichier} : aucun jeu {composants} / {prop} / {var_compo}")
    return out

def g100(w):                     # fraction massique du soluté -> g pour 100 g de solvant
    return 100 * w / (1 - w)

def interp(x, pts):
    pts = sorted(pts)
    for (a, ga), (b, gb) in zip(pts, pts[1:]):
        if a <= x <= b: return ga + (gb - ga) * (x - a) / (b - a)
    raise ValueError(x)

defauts = []
def recoupe(nom, v, autre, tol, src):
    ecart = abs(autre - v) / v
    ok = ecart <= tol
    if not ok: defauts.append(f"{nom} : {v:.3g} contre {autre:.3g} ({src}), écart {100*ecart:.0f} % > {100*tol:.0f} %")
    return {"source": src, "valeur": round(autre, 4), "ecart_pct": round(100 * ecart, 1), "tolerance_pct": 100 * tol}

# ---------------- KCl dans eau + éthanol, 25 °C (Pinho et Macedo 2005) ----------------
pinho = thermoml("pinho-2005.xml", ["ethanol", "potassium chloride", "water"], "Mass fraction",
                 ("Solvent: Mass fraction", "water"))
pinho_eau = thermoml("pinho-2005.xml", ["potassium chloride", "water"], "Mass fraction", None)[None]
P = [(0.0, g100(pinho_eau))] + [(round(1 - we, 4), g100(w)) for we, w in pinho.items()]   # (fraction éthanol, g/100 g)
gal = thermoml("galleguillos-2003.xml", ["ethanol", "potassium chloride", "water"], "Mass fraction",
               ("Mass fraction", "ethanol"))
# Galleguillos donne la fraction d'éthanol dans la solution saturée : on la ramène au solvant seul
G = [(we / (1 - wk), g100(wk)) for we, wk in gal.items()]
far = thermoml("farelo-2004.xml", ["ethanol", "potassium chloride", "water"], "Molality, mol/kg",
               ("Solvent: Mole fraction", "ethanol"))
M_KCL = 74.551
KCL = {}
for pct in (0, 10, 30, 50, 70, 90):
    v = interp(pct / 100, P)
    e = {"pct_ethanol": pct, "g_pour_100g": round(v, 4), "recoupements": []}
    if pct == 0:
        e["recoupements"].append(recoupe("KCl eau", v, interp(0, G), 0.05, "Galleguillos 2003"))
        e["recoupements"].append(recoupe("KCl eau", v, 35.5, 0.05, "HSDB via PubChem : 35,5 g/100 g d'eau à 25 °C"))
    elif pct in (10,):
        # ThermoML étiquette « fraction molaire » ; l'article porte « jusqu'à 20 % en masse » : lu en masse
        e["recoupements"].append(recoupe("KCl 10 %", v, far[0.1] * M_KCL / 10, 0.02, "Farelo 2004 (composition lue en masse)"))
    else:
        e["recoupements"].append(recoupe(f"KCl {pct} %", v, interp(pct / 100, G), 0.40, "Galleguillos 2003"))
    KCL[pct] = e

# ---------------- caféine, 25 °C (Shalmashi et Golmohammad 2010, tableau 1) ----------------
M = {"cafeine": 194.19, "eau": 18.015, "dichloromethane": 84.93, "ethanol": 46.07, "chloroforme": 119.38,
     "acetone": 58.08, "acetate_ethyle": 88.11}
with open(os.path.join(D, "shalmashi-2010-tableau1.csv"), encoding="utf8") as f:
    lignes = [l for l in f if not l.startswith("#")]
X = {r["solvant"]: float(r["mille_x"]) / 1000 for r in csv.DictReader(lignes)}
def caf(x, solv): return 100 * x * M["cafeine"] / ((1 - x) * M[solv])
zhong = {s: thermoml("zhong-2017.xml", ["caffeine", n], "Mole fraction", None)[None]
         for s, n in (("eau", "water"), ("ethanol", "ethanol"), ("acetone", "acetone"), ("acetate_ethyle", "ethyl acetate"))}
CAF = {}
for s in ("eau", "dichloromethane", "ethanol", "chloroforme", "acetone", "acetate_ethyle"):
    v = caf(X[s], s)
    CAF[s] = {"g_pour_100g": round(v, 4), "recoupements": []}
    if s in zhong:
        tol = {"eau": 0.30, "ethanol": 0.30, "acetone": 0.30, "acetate_ethyle": 0.30}[s]
        CAF[s]["recoupements"].append(recoupe(f"caféine {s}", v, caf(zhong[s], s), tol, "Zhong 2017"))
# Merck Index via PubChem (HSDB) : « 1 g dissolves in 46 mL water, 66 mL alcohol, 50 mL acetone, 5.5 mL chloroform »
RHO = {"eau": 0.997, "ethanol": 0.789, "acetone": 0.791, "chloroforme": 1.48}
for s, mL, tol in (("eau", 46, 0.10), ("chloroforme", 5.5, 0.10), ("acetone", 50, 0.70), ("ethanol", 66, 1.80)):
    CAF[s]["recoupements"].append(recoupe(f"caféine {s}", CAF[s]["g_pour_100g"], 100 / (mL * RHO[s]), tol,
                                          f"Merck Index via PubChem : 1 g dans {mL} mL"))
# source pédagogique (ChemCollective, UBC) : 2,18 g/100 mL d'eau et 18,2 g/100 mL de dichlorométhane à 25 °C
CAF["dichloromethane"]["recoupements"].append(recoupe("caféine dichlorométhane", CAF["dichloromethane"]["g_pour_100g"],
                                                      18.2 / 1.33, 0.60, "ChemCollective (UBC) : 18,2 g/100 mL"))
CAF["eau"]["recoupements"].append(recoupe("caféine eau", CAF["eau"]["g_pour_100g"], 2.16 / 0.997, 0.10,
                                          "HSDB via PubChem : 21,6 g/L à 25 °C"))
# ce qui doit tenir quelle que soit la source : l'ordre des solvants
ordre = all([CAF["dichloromethane"]["g_pour_100g"] > 3 * CAF["eau"]["g_pour_100g"],
             18.2 / 2.18 > 3,
             CAF["chloroforme"]["g_pour_100g"] > 3 * CAF["eau"]["g_pour_100g"],
             CAF["ethanol"]["g_pour_100g"] < CAF["eau"]["g_pour_100g"],
             CAF["acetate_ethyle"]["g_pour_100g"] < CAF["eau"]["g_pour_100g"],
             caf(zhong["acetate_ethyle"], "acetate_ethyle") < caf(zhong["eau"], "eau"),
             caf(zhong["ethanol"], "ethanol") < caf(zhong["eau"], "eau"),
             100 / (66 * RHO["ethanol"]) < 100 / (46 * RHO["eau"])])
if not ordre: defauts.append("caféine : l'ordre des solvants n'est pas le même selon les sources")

# ---------------- solvants : densité, miscibilité (PubChem) ----------------
SOLV = {"eau": {"d": 1.00, "miscible": None}, "dichloromethane": {"d": 1.33, "miscible": False},
        "chloroforme": {"d": 1.48, "miscible": False}, "ethanol": {"d": 0.79, "miscible": True},
        "acetone": {"d": 0.79, "miscible": True}, "acetate_ethyle": {"d": 0.90, "miscible": False}}
def pubchem_textes(cid, h):
    out = []
    def walk(n):
        if isinstance(n, dict):
            for s in n.get("StringWithMarkup", []): out.append(s["String"])
            for v in n.values(): walk(v)
        elif isinstance(n, list):
            for v in n: walk(v)
    walk(json.load(open(os.path.join(D, f"pubchem_{cid}_{h}.json"), encoding="utf8")))
    return out
CID = {"dichloromethane": 6344, "chloroforme": 6212, "ethanol": 702, "acetone": 180, "acetate_ethyle": 8857}
for s, cid in CID.items():
    d = SOLV[s]["d"]
    if not any(t.strip().startswith(f"{d:.2f}".rstrip("0").rstrip(".")) or f"{d:.2f}" in t for t in pubchem_textes(cid, "Density")):
        defauts.append(f"{s} : densité {d} introuvable dans PubChem")
    txt = " ".join(pubchem_textes(cid, "Solubility")).lower()
    if SOLV[s]["miscible"] and "miscible with water" not in txt and "in water, miscible" not in txt and "solubility in water: miscible" not in txt:
        defauts.append(f"{s} : « miscible à l'eau » non confirmé par PubChem")
    if SOLV[s]["miscible"] is False and "g/100ml at 20 °c" not in txt:
        defauts.append(f"{s} : solubilité dans l'eau non trouvée dans PubChem")

# ---------------- « Dissoudre » (ch5 s3) et générateur co-solubilite, 25 °C ----------------
# Sel : Pinho 2005 (fraction massique de la solution saturée), recoupé par PubChem
# (HSDB « 36.0 g/100 g of water at 25 °C », « One gram dissolves in 2.8 mL water »)
# et par Galleguillos 2003, qui donne aussi la masse volumique de la solution saturée.
w_sel = thermoml("pinho-2005.xml", ["sodium chloride", "water"], "Mass fraction", None)[None]
w_gal = thermoml("galleguillos-2003.xml", ["sodium chloride", "water"], "Mass fraction", None)[None]
rho_gal = thermoml("galleguillos-2003.xml", ["sodium chloride", "water"], "Mass density, kg/m3", None)[None]
sel_eau = 10 * g100(w_sel)                            # g par kg d'eau, soit par litre d'eau
sel_sol = w_gal * rho_gal                              # g par litre de solution saturée
t5234 = pubchem_textes(5234, "Solubility")
if "36.0 g/100 g of water at 25 °C" not in t5234: defauts.append("sel : « 36.0 g/100 g of water at 25 °C » absent de PubChem")
if not any(t.startswith("One gram dissolves in 2.8 mL water") for t in t5234): defauts.append("sel : « 1 g dans 2,8 mL » absent de PubChem")
DISSOUDRE = {"sel_g_par_L_eau": round(sel_eau, 2), "sel_g_par_L_solution": round(sel_sol, 2),
             "recoupements": [recoupe("sel, g/L d'eau", sel_eau, 360.0, 0.02, "PubChem HSDB 36,0 g/100 g"),
                              recoupe("sel, g/L d'eau", sel_eau, 1000 / 2.8, 0.02, "PubChem, 1 g dans 2,8 mL"),
                              recoupe("sel, fraction massique", w_sel, w_gal, 0.02, "Galleguillos 2003")]}
# Diiode : PubChem « 0.33 mg/mL at 25 °C », recoupé par l'ICSC « g/100ml at 20 °C: 0.03 »
t807 = pubchem_textes(807, "Solubility")
if "0.33 mg/mL at 25 °C" not in t807: defauts.append("diiode : « 0.33 mg/mL at 25 °C » absent de PubChem")
if "Solubility in water, g/100ml at 20 °C: 0.03" not in t807: defauts.append("diiode : valeur ICSC absente de PubChem")
DISSOUDRE["diiode_g_par_L_eau"] = 0.33
DISSOUDRE["recoupements"].append(recoupe("diiode, g/L", 0.33, 0.3, 0.15, "ICSC, 0,03 g/100 mL à 20 °C"))
# Sucre : ICSC « g/100ml at 25 °C: 200 », recoupé par « 1 g dissolves in 0.5 ml water »
t5988 = pubchem_textes(5988, "Solubility")
if "Solubility in water, g/100ml at 25 °C: 200" not in t5988: defauts.append("sucre : valeur ICSC absente de PubChem")
if not any(t.startswith("1 g dissolves in 0.5 ml water") for t in t5988): defauts.append("sucre : « 1 g dans 0,5 mL » absent de PubChem")
DISSOUDRE["sucre_g_par_L_eau"] = 2000.0
DISSOUDRE["recoupements"].append(recoupe("sucre, g/L", 2000.0, 1 / 0.5 * 1000, 0.02, "PubChem, 1 g dans 0,5 mL"))

print(json.dumps({"kcl": KCL, "cafeine": CAF, "solvants": SOLV, "dissoudre": DISSOUDRE, "defauts": defauts}, ensure_ascii=False, indent=1))
sys.exit(1 if defauts else 0)
