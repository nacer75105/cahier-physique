/* Renvois « section N » : pointent-ils toujours au bon endroit ?

   Le numéro affiché d'une section est sa POSITION dans `sections:[...]`
   (`sectionNode()`, 04-vue.js : idx + 1), pas son id. Insérer une section
   avant une autre décale donc le numéro affiché de toutes les suivantes, même
   si aucun id ne change. Ce script relit chaque renvoi par numéro, le résout
   avec l'ordre actuel des sections du chapitre visé, et compare à l'id attendu.

   Couverture :
   - les renvois « section N » internes au ch1 et au ch19 (Mesure et
     incertitudes, qui renvoie à cinq chapitres et reçoit leurs renvois) ;
   - tout renvoi « chapitre N, section M » (ou « chapitre N (section M »),
     dans n'importe quel fichier de cours, vers n'importe quel chapitre
     (étendu le 2026-10-13, chantier mesure et incertitudes).

   Usage : node outils/verifier-renvois.mjs   (code 1 au moindre renvoi faux,
   ou si un renvoi par numéro couvert n'est pas répertorié ci-dessous) */
import fs from "node:fs";

const APP = "public/app";

/* Chaque renvoi : le fichier, un extrait qui le repère sans ambiguïté, le
   numéro écrit, et l'id de la section visée (repéré à la rédaction). */
const RENVOIS = [
  { f: "03-cours-chimie-1.js", extrait: "ce qu'on supposera jusqu'à la section 6", n: 6, id: "s6" },
  { f: "03-cours-chimie-1.js", extrait: "la section 7 montrera comment", n: 7, id: "s8" },
  { f: "03-cours-chimie-1.js", extrait: "Jusqu'à la section 6, on suppose", n: 6, id: "s6" },
  { f: "03-cours-chimie-1.js", extrait: "la section 7 montre les exceptions", n: 7, id: "s8" },
  { f: "03-cours-chimie-1.js", extrait: "résume les sections 4 à 6", n: [4, 6], id: ["s4", "s6"] },
  { f: "03-cours-chimie-1.js", extrait: "faite jusqu'à la section 6", n: 6, id: "s6" },
  { f: "03-cours-chimie-1.js", extrait: "c'est l'objet de la section 7", n: 7, id: "s8" },
  { f: "03-cours-chimie-1.js", extrait: "comme aux sections 4 et 5", n: [4, 5], id: ["s4", "s5"] },
  { f: "03-cours-chimie-1.js", extrait: "verres de lait de la section 4", n: 4, id: "s4" },
  { f: "03-cours-chimie-1.js", extrait: "Dans le tableau de la section 4", n: 4, id: "s4" },
  { f: "03-cours-chimie-1.js", extrait: "comparé à $x_{max}$ (section 7)", n: 7, id: "s8" },
  { f: "03-cours-chimie-1.js", extrait: "du diazote et du dihydrogène (section 7)", n: 7, id: "s8" },
  /* liquide pur, mélange, concentration en masse : s9, affichée en 8 (2026-10-12) */
  { f: "03-cours-chimie-1.js", extrait: "On passe d'abord par la masse : section 8", n: 8, id: "s9" },
  { f: "03-cours-chimie-1.js", extrait: "avec la masse volumique (section 8)", n: 8, id: "s9" },
  { f: "03-cours-chimie-1.js", extrait: "donné en pourcentage : section 8", n: 8, id: "s9" },
  { f: "03-cours-chimie-1.js", extrait: "c'est l'objet de la section 8", n: 8, id: "s9" },
  { f: "03-cours-chimie-1.js", extrait: "$m = C_m V$ (section 8)", n: 8, id: "s9" },
  { f: "03-cours-chimie-1.js", extrait: "Les formules de la section 3", n: 3, id: "s3" },
  { f: "03-cours-chimie-1.js", extrait: "pièces de monnaie de la section 3", n: 3, id: "s3" },
  { f: "03-cours-chimie-1.js", extrait: "piège des millilitres (section 3)", n: 3, id: "s3" },
  { f: "03-cours-oxydoreduction.js", extrait: "(chapitre 1, section 7)", n: 7, id: "s8" },
  { f: "03-cours-chimie-1.js", extrait: "voir le chapitre 1, section 7", n: 7, id: "s8" },   // ch3, tableau des conditions d'un titrage
  /* renvois croisés déjà présents avant le 2026-10-13, répertoriés à l'extension du script */
  { f: "03-cours-chimie-1.js", extrait: "La méthode est au chapitre 16 (section 4)", chap: "oxydoreduction", n: 4, id: "s4" },
  { f: "03-cours-chimie-1.js", extrait: "; sa section 5 relie chacune", chap: "oxydoreduction", n: 5, id: "s5" },
  { f: "03-cours-oxydoreduction.js", extrait: "(voir aussi le chapitre 15, section 2)", chap: "champs", n: 2, id: "s2" },
  /* ch19 Mesure et incertitudes : ses renvois vers les TP des autres chapitres… */
  { f: "03-cours-incertitudes.js", extrait: "calculent $ρ = @f{m}{V}$ (chapitre 1, section 8)", n: 8, id: "s9" },
  { f: "03-cours-incertitudes.js", extrait: "Le chapitre 2, section 3, partait de la même idée", chap: "mesures", n: 3, id: "s3" },
  { f: "03-cours-incertitudes.js", extrait: "de la pile plate du chapitre 10, section 5 :", chap: "electrique", n: 5, id: "s8" },
  { f: "03-cours-incertitudes.js", extrait: "[\"Canette (chapitre 18, section 6)\"", chap: "combustions", n: 6, id: "s6" },
  { f: "03-cours-incertitudes.js", extrait: "s'échappe dans l'air (chapitre 18, section 6)", chap: "combustions", n: 6, id: "s6" },
  { f: "03-cours-incertitudes.js", extrait: "la pile plate (chapitre 10, section 5), les points", chap: "electrique", n: 5, id: "s8" },
  { f: "03-cours-incertitudes.js", extrait: "Avec la seringue (chapitre 14, section 3)", chap: "fluides", n: 3, id: "s3" },
  { f: "03-cours-incertitudes.js", extrait: "avec le même protocole (chapitre 3, section 2)", chap: "titrage", n: 2, id: "s2" },
  { f: "03-cours-incertitudes.js", extrait: "sous une canette d'eau (chapitre 18, section 6)", chap: "combustions", n: 6, id: "s6" },
  /* … ses renvois internes… */
  { f: "03-cours-incertitudes.js", extrait: "Les seize observations de la section 1", chap: "incertitudes", n: 1, id: "s1" },
  { f: "03-cours-incertitudes.js", extrait: "On l'arrondira à la section 4", chap: "incertitudes", n: 4, id: "s4" },
  { f: "03-cours-incertitudes.js", extrait: "[\"Eau, éprouvette (section 2)\"", chap: "incertitudes", n: 2, id: "s2" },
  /* … et ceux qu'il reçoit */
  { f: "03-cours-chimie-1.js", extrait: "quand on ne mesure qu'une fois (chapitre 19, section 3)", chap: "incertitudes", n: 3, id: "s3" },
  { f: "03-cours-energie.js", extrait: "Le chapitre 19, section 3, l'évalue", chap: "incertitudes", n: 3, id: "s3" },
  { f: "03-cours-fluides.js", extrait: "Le chapitre 19, section 5, apprend", chap: "incertitudes", n: 5, id: "s5" },
  { f: "03-cours-combustions.js", extrait: "Le chapitre 19, section 5, compare", chap: "incertitudes", n: 5, id: "s5" },
];

/* ordre actuel des sections de chaque chapitre, lu dans les fichiers de cours */
const FICHIERS = fs.readdirSync(APP).filter(x => /^03-cours-.*\.js$/.test(x));
const CHAP = {};
for (const f of FICHIERS) {
  const s = fs.readFileSync(`${APP}/${f}`, "utf8"), c = [...s.matchAll(/id:"([a-z-]+)", n:(\d+)/g)];
  c.forEach((m, k) => {
    const bloc = s.slice(m.index, k + 1 < c.length ? c[k + 1].index : s.length);
    const ordre = [...bloc.slice(0, bloc.indexOf("exos:[")).matchAll(/\{id:"(s\d+)", titre:"([^"]*)"/g)].map(x => ({ id: x[1], titre: x[2] }));
    CHAP[m[1]] = { n: +m[2], f, bloc, ordre };
  });
}
if (!CHAP.transformation || !CHAP.incertitudes) { console.error("Chapitre 1 ou 19 introuvable"); process.exit(2); }
const parNumero = n => Object.keys(CHAP).find(k => CHAP[k].n === n);
console.log("Ordre affiché du ch1 : " + CHAP.transformation.ordre.map((s, i) => `${i + 1}=${s.id}`).join(" "));
console.log("Ordre affiché du ch19 : " + CHAP.incertitudes.ordre.map((s, i) => `${i + 1}=${s.id}`).join(" "));

let ko = 0;
for (const r of RENVOIS) {
  const texte = fs.readFileSync(`${APP}/${r.f}`, "utf8");
  const nb = texte.split(r.extrait).length - 1;
  if (nb !== 1) { console.log(`INTROUVABLE ${r.f} : « ${r.extrait} » (${nb} occurrences)`); ko = 1; continue; }
  const chap = CHAP[r.chap || "transformation"], ordre = chap.ordre;
  /* « chapitre N » écrit dans l'extrait doit être le chapitre visé */
  const ecrit = r.extrait.match(/chapitre (\d+)/);
  if (ecrit && +ecrit[1] !== chap.n) { console.log(`FAUX ${r.f} : « ${r.extrait} » — le chapitre ${ecrit[1]} n'est pas « ${r.chap} » (chapitre ${chap.n})`); ko = 1; }
  const ns = [].concat(r.n), ids = [].concat(r.id);
  ns.forEach((n, k) => {
    const vise = ordre[n - 1];
    if (!vise || vise.id !== ids[k]) {
      const ou = ordre.findIndex(s => s.id === ids[k]) + 1;
      console.log(`FAUX ${r.f} : « ${r.extrait} » — la section ${n} est ${vise ? vise.id + " « " + vise.titre + " »" : "absente"}, attendu ${ids[k]} (affichée en ${ou})`);
      ko = 1;
    }
  });
}

/* tout renvoi par numéro couvert doit être répertorié ci-dessus */
const connus = RENVOIS.map(r => r.extrait);
const chercher = (texte, re, f) => {
  for (const m of texte.matchAll(re)) {
    const autour = texte.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60);
    if (!connus.some(e => autour.includes(e))) {
      console.log(`NON RÉPERTORIÉ ${f} : « …${autour.replace(/\s+/g, " ")}… »`); ko = 1;
    }
  }
};
chercher(CHAP.transformation.bloc, /sections? \d+/g, "03-cours-chimie-1.js (ch1)");
chercher(CHAP.incertitudes.bloc, /sections? \d+/g, "03-cours-incertitudes.js (ch19)");
for (const f of fs.readdirSync(APP).filter(x => /^0[3-9].*\.js$/.test(x)))
  chercher(fs.readFileSync(`${APP}/${f}`, "utf8"), /chapitre \d+,? \(?sections? \d+/g, f);
/* un « chapitre N » qui n'existe pas */
for (const f of FICHIERS)
  for (const m of fs.readFileSync(`${APP}/${f}`, "utf8").matchAll(/chapitre (\d+),? \(?section/g))
    if (!parNumero(+m[1])) { console.log(`FAUX ${f} : renvoi vers un chapitre ${m[1]} qui n'existe pas`); ko = 1; }

console.log(ko ? "Renvois en défaut." : `${RENVOIS.length} renvois répertoriés, tous justes.`);
process.exit(ko);
