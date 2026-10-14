"""Masses volumiques du cahier : chaque valeur relue dans sa source versionnée.

Pour chaque entrée : l'extrait doit figurer dans le fichier source (PubChem
pug_view JSON, ou texte de la circulaire NBS 457), la valeur du cahier doit
être l'arrondi de la valeur source au nombre de chiffres affichés (à 1 % pour
l'eau sucrée, donnée « ≈ »), et le cours ou le générateur doit afficher cette
valeur. Voir LISEZMOI.md. Code 1 au moindre écart.

Usage : python outils/masses-volumiques/verifier.py
"""
import json, os, subprocess, sys
sys.stdout.reconfigure(encoding="utf-8")

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.normpath(os.path.join(ICI, "..", ".."))
D, S = os.path.join(ICI, "donnees"), os.path.join(ICI, "..", "solubilites", "donnees")
APP = os.path.join(RACINE, "public", "app")

def chaines(chemin):
    """toutes les chaînes « String » d'un JSON pug_view"""
    out = []
    def walk(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k == "String" and isinstance(v, str): out.append(v)
                else: walk(v)
        elif isinstance(o, list):
            for x in o: walk(x)
    walk(json.load(open(chemin, encoding="utf8")))
    return out

# (nom, source, extrait exact, valeur source, valeur du cahier, fichier, texte affiché)
E = [
 ("éthanol", os.path.join(S, "pubchem_702_Density.json"), "0.7893 g/cu cm at 20 °C", 0.7893, 0.789, "03-cours-chimie-1.js", "$ρ = 0{,}789$ @u{g/mL}"),
 ("éthanol (générateur)", os.path.join(S, "pubchem_702_Density.json"), "0.7893 g/cu cm at 20 °C", 0.7893, 0.789, "06-generateurs.js", 'nom:"éthanol", rho:0.789'),
 ("cyclohexane (cahier)", os.path.join(D, "pubchem_8078_Density.json"), "0.779 at 68 °F (USCG, 1999) - Less dense than water; will float", 0.779, 0.779, "03-cours-chimie-1.js", "$ρ = 0{,}779$ @u{g/mL}"),
 ("cyclohexane (générateur)", os.path.join(D, "pubchem_8078_Density.json"), "0.779 at 68 °F (USCG, 1999) - Less dense than water; will float", 0.779, 0.779, "06-generateurs.js", 'nom:"cyclohexane", rho:0.779'),
 ("dichlorométhane", os.path.join(S, "pubchem_6344_Density.json"), "1.3266 @ 20°C", 1.3266, 1.33, "03-cours-chimie-1.js", "$ρ = 1{,}33$ @u{g/mL}"),
 ("dichlorométhane (générateur)", os.path.join(S, "pubchem_6344_Density.json"), "1.3266 @ 20°C", 1.3266, 1.33, "06-generateurs.js", 'nom:"dichlorométhane", rho:1.33'),
 ("glycérol (générateur)", os.path.join(D, "pubchem_753_Density.json"), "1.2613 g/cu cm at 20 °C", 1.2613, 1.26, "06-generateurs.js", 'nom:"glycérol", rho:1.26'),
 ("ammoniaque à 28 %", os.path.join(D, "pubchem_14923_Density.json"), "About 0.90 @ 25 °C/25 °C", 0.90, 0.90, "03-cours-chimie-1.js", "de masse volumique $0{,}90$ @u{g/mL}"),
 ("aluminium (unité)", os.path.join(D, "pubchem_5359268_Density.json"), "2.7 g/cm³", 2.7, 2.7, None, None),
 ("aluminium", os.path.join(D, "pubchem_5359268_Density.json"), "2.70", 2.70, 2.70, "03-cours-cristaux.js", "Donc $ρ = 2{,}70$ @u{g/cm³}"),
 ("aluminium (générateur)", os.path.join(D, "pubchem_5359268_Density.json"), "2.70", 2700, 2700, "06-generateurs.js", "M:27.0, ref:2700"),
 ("cuivre", os.path.join(D, "pubchem_23978_Density.json"), "8.96 @25 °C", 8960, 8960, "03-cours-cristaux.js", "$8960$ @u{kg/m^3}"),
 ("cuivre (générateur)", os.path.join(D, "pubchem_23978_Density.json"), "8.96 @25 °C", 8960, 8960, "06-generateurs.js", "M:63.5, ref:8960"),
 ("nickel (générateur)", os.path.join(D, "pubchem_935_Density.json"), "8.908 (NTP, 1992) - Denser than water; will sink", 8908, 8910, "06-generateurs.js", "M:58.7, ref:8910"),
 ("argent (générateur)", os.path.join(D, "pubchem_23954_Density.json"), "10.5 @25 °C", 10500, 10500, "06-generateurs.js", "M:108, ref:10500"),
 ("or (générateur)", os.path.join(D, "pubchem_23985_Density.json"), "19.3 @25 °C", 19300, 19300, "06-generateurs.js", "M:197, ref:19300"),
]

def chiffres(v):
    t = ("%r" % v).rstrip("0").rstrip(".").replace(".", "").lstrip("0")
    return len(t.rstrip("0")) or 1

ko = 0
for nom, src, extrait, vs, vc, f, aff in E:
    if extrait not in chaines(src):
        print(f"SOURCE  {nom} : « {extrait} » absent de {os.path.basename(src)}"); ko = 1
    n = chiffres(vc)
    if float(f"{vs:.{n}g}") != vc:
        print(f"ARRONDI {nom} : {vc} n'est pas l'arrondi de {vs} à {n} chiffres"); ko = 1
    if f and aff not in open(os.path.join(APP, f), encoding="utf8").read():
        print(f"COURS   {nom} : « {aff} » absent de {f}"); ko = 1

# eau sucrée : NBS Circular 457, table 1, ligne 4,9 °Brix (20 °C)
pdf = os.path.join(D, "nbs-circular-457.pdf")
try:
    txt = subprocess.run(["pdftotext", "-layout", pdf, "-"], capture_output=True, text=True, encoding="latin-1").stdout
except FileNotFoundError:
    print("pdftotext introuvable : eau sucrée non vérifiée"); sys.exit(2)
ligne = next((l for l in txt.splitlines() if ". 01746" in l and ". 986" in l), None)
if not ligne:
    print("SOURCE  eau sucrée : ligne 4,9 °Brix (1,01746 ; 4,986 g/100 mL) absente de la circulaire 457"); ko = 1
else:
    rho, c = 1.01746, 49.86            # g/mL, g de sucre par litre de solution
    if abs(rho - 1.02) / 1.02 > 0.01 or abs(c - 50) / 50 > 0.01:
        print("ARRONDI eau sucrée : 1,02 g/mL pour 50 g/L ne correspond pas à la source"); ko = 1
    if "$ρ = 1{,}02$ @u{g/mL} et une concentration en masse de sucre" not in open(os.path.join(APP, "03-cours-chimie-1.js"), encoding="utf8").read():
        print("COURS   eau sucrée : valeur 1,02 g/mL absente du ch1"); ko = 1

print("Masses volumiques en défaut." if ko else f"{len(E) + 1} masses volumiques relues dans leur source, toutes justes.")
sys.exit(ko)
