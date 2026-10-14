/* Vocabulaire de la mesure : le cahier parle comme le programme 2019.

   Source : ressource éduscol « Mesure et incertitudes au lycée » (2021),
   `.claude/referentiels/mesure-incertitudes/` (voir son SOURCES.md) :
   - « précision » est banni du VIM (élément 13) : on parle d'incertitude-type
     petite ou grande ;
   - l'erreur aléatoire / systématique et la « valeur vraie » ne sont plus au
     programme (élément 14) : variabilité, modélisation incomplète,
     manipulation mal faite ou expérience mal réalisée ;
   - l'écart relatif « était souvent utilisé à tort pour valider des
     résultats » (élément 22) : un pourcentage est un repère, jamais un verdict.

   Le script relit TOUT le texte affiché : chaque chaîne des chapitres
   (03-cours-*.js, cours, exercices, notes de figures écrites dans le cours),
   et les chaînes des figures (02-figures.js) et des générateurs
   (06-generateurs.js). Les emplois hors mesure (« l'erreur la plus
   fréquente » = faute de l'élève, « l'instant précis ») ne sont pas visés par
   les motifs. Les rares emplois voulus d'un motif (le ch19 qui CITE l'ancien
   usage pour le corriger) sont inscrits dans PERMIS avec un extrait : un
   extrait qui n'existe plus fait aussi échouer le script (liste à jour).

   Ajouté le 2026-10-14 (chantier harmonisation du vocabulaire), après le
   remplacement de 34 phrases dans 8 fichiers.

   Usage : node outils/verifier-vocabulaire.mjs [--racine=public]
     code 1 au moindre emploi périmé, 2 si un fichier manque. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const arg = n => (process.argv.find(a => a.startsWith("--" + n + "=")) || "").split("=").slice(1).join("=");
const ici = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const APP = path.join(path.resolve(arg("racine") || path.join(ici, "..", "public")), "app");

const MESURE = "mesures?|volumes?|instruments?|appareils?|pipettes?|éprouvettes?|burettes?|fioles?|balances?|capteurs?|verrerie|lectures?|dosages?|pesées?|thermomètres?|chronomètres?|données de l'énoncé";
/* fin de mot qui connaît les accents (\b de JavaScript s'arrête sur « é ») */
const FIN = "(?![a-zà-ÿœ])";
const MOTIFS = [
  [/erreurs? (de mesure|de lecture|de pesée|de manipulation|expérimentales?|aléatoires?|systématiques?)/i, "« erreur » au sens de la mesure → incertitude, manipulation mal faite, expérience mal réalisée"],
  [/erreurs? [^.;:]{0,40}(pesées?|lectures?|mesures?)/i, "« erreur » portant sur une pesée, une lecture, une mesure → manipulation mal faite, incertitude"],
  [/aux erreurs( de mesure)? près/i, "« aux erreurs près » → « à l'incertitude des mesures près »"],
  [/signe d'(une )?erreur/i, "« signe d'une erreur » (expérimental) → « signe d'une manipulation mal faite »"],
  [/valeurs? vraies?|vraies? valeurs?|valeurs? réelles?/i, "« valeur vraie / réelle » → valeur de référence, valeur mesurée"],
  [/impr[ée]cis\w*/i, "« imprécis » → incertitude grande"],
  [new RegExp(`(${MESURE})[^.;:]{0,40}pr[ée]cis(e|es|ion)?${FIN}|pr[ée]cis(e|es|ion)?${FIN}[^.;:]{0,25}(${MESURE})`, "i"), "« précis / précision » d'une mesure → incertitude petite"],
  [new RegExp(`(plus|moins|très) pr[ée]cis(e|es)?${FIN}|pr[ée]cision${FIN}`, "i"), "« plus / moins précis », « précision » → incertitude plus petite / plus grande"],
  [/(balance|pipette|éprouvette|appareil|instrument|capteur|thermomètre|chronomètre)s? [^.;:]{0,30}se tromp/i, "un instrument ne « se trompe » pas : sa lecture a une incertitude"],
  [/écart[^.]{0,80}%[^.]{0,60}(confirm|valid|vaut confirmation|est bon|c'est bon)|(confirm|valid)\w*[^.]{0,40}écart[^.]{0,40}%/i, "écart en % utilisé comme verdict → repère, comparé qualitativement à l'incertitude"],
];
/* emplois voulus : le ch19 cite l'ancien usage pour le corriger, et deux
   « précision » qui ne parlent pas de mesure */
const PERMIS = [
  { f: "03-cours-incertitudes.js", extrait: "On évite d'ailleurs le mot « précis », trop vague" },
  { f: "03-cours-incertitudes.js", extrait: "On lit parfois « l'écart à la référence est de 3 %, donc c'est bon »" },
  { f: "03-cours-incertitudes.js", extrait: "Oui, parce que l'écart est inférieur à 1 %" },
  { f: "03-cours-incertitudes.js", extrait: "Compatible, parce que l'écart est inférieur à 1 %" },
  { f: "03-cours-mouvement.js", extrait: "Un correcteur attend cette précision, et elle vaut souvent un point." },
  { f: "03-cours-chimie-1.js", extrait: "**Une précision qui compte.**" },        /* un détail du raisonnement */
  { f: "03-cours-chimie-2.js", extrait: "pour un angle précis, mesure-le" },      /* un angle particulier */
  { f: "06-generateurs.js", extrait: "ce qu'on veut obtenir : un volume et une concentration précis" },  /* des valeurs visées */
];

const fichiers = fs.readdirSync(APP).filter(x => /^03-cours-.*\.js$/.test(x));
if (!fichiers.length) { console.error("aucun fichier de cours dans " + APP); process.exit(2); }
const chaines = [];   // [fichier, chemin, texte]
for (const f of fichiers) {
  const ctx = { window: {} }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(APP, f), "utf8"), ctx);
  const walk = (o, ch) => {
    if (typeof o === "string") chaines.push([f, ch, o]);
    else if (Array.isArray(o)) o.forEach((x, i) => walk(x, ch + "[" + i + "]"));
    else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) walk(v, ch + "." + k);
  };
  for (const c of ctx.window.COURS || []) {
    c.sections.forEach((s, i) => s.blocs.forEach((b, j) => walk(b, `ch${c.n} ${s.id} (affichée ${i + 1}) bloc ${j}`)));
    c.exos.forEach(e => walk(e, `ch${c.n} ${e.id}`));
    for (const k of ["titre", "sous", "desc"]) walk(c[k], `ch${c.n} ${k}`);
  }
}
/* figures et générateurs : les littéraux de chaîne, hors commentaires */
for (const f of ["02-figures.js", "06-generateurs.js"]) {
  const p = path.join(APP, f);
  if (!fs.existsSync(p)) { console.error("fichier manquant : " + p); process.exit(2); }
  const src = fs.readFileSync(p, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  for (const m of src.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g)) {
    const t = m[1] ?? m[2];
    if (t && t.length > 12) chaines.push([f, "ligne " + (src.slice(0, m.index).split("\n").length), t]);
  }
}

let ko = 0, vus = 0;
const permisVus = new Set();
for (const [f, ch, t] of chaines) {
  for (const [re, quoi] of MOTIFS) {
    const m = t.match(re);
    if (!m) continue;
    const autour = t.slice(Math.max(0, m.index - 80), m.index + m[0].length + 80);
    const p = PERMIS.find(x => x.f === f && t.includes(x.extrait) && x.extrait.includes(m[0].slice(0, 6)));
    if (p) { permisVus.add(p); continue; }
    console.log(`PÉRIMÉ ${f}, ${ch} : « …${autour.replace(/\s+/g, " ")}… »\n        ${quoi}`); ko = 1;
  }
  vus++;
}
for (const p of PERMIS) if (!permisVus.has(p)) {
  const existe = chaines.some(([f, , t]) => f === p.f && t.includes(p.extrait));
  if (!existe) { console.log(`PERMIS PÉRIMÉ ${p.f} : « ${p.extrait} » n'existe plus, à retirer de PERMIS`); ko = 1; }
}
console.log(ko ? "Vocabulaire de la mesure en défaut." : `${vus} chaînes relues, vocabulaire de la mesure à jour (${PERMIS.length} emplois permis).`);
process.exit(ko);
