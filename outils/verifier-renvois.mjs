/* Renvois « section N » vers le chapitre 1 : pointent-ils toujours au bon endroit ?

   Le numéro affiché d'une section est sa POSITION dans `sections:[...]`
   (`sectionNode()`, 04-vue.js : idx + 1), pas son id. Insérer une section
   avant une autre décale donc le numéro affiché de toutes les suivantes, même
   si aucun id ne change. Ce script relit chaque renvoi par numéro, le résout
   avec l'ordre actuel des sections, et compare à l'id attendu.

   Usage : node outils/verifier-renvois.mjs   (code 1 au moindre renvoi faux,
   ou si un renvoi « section N » vers le ch1 n'est pas répertorié ci-dessous) */
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
  { f: "03-cours-oxydoreduction.js", extrait: "(chapitre 1, section 7)", n: 7, id: "s8" },
  { f: "03-cours-chimie-1.js", extrait: "voir le chapitre 1, section 7", n: 7, id: "s8" },   // ch3, tableau des conditions d'un titrage
];

/* ordre actuel des sections du chapitre 1 */
const src = fs.readFileSync(`${APP}/03-cours-chimie-1.js`, "utf8");
const debut = src.indexOf('id:"transformation", n:1');
const fin = src.indexOf('id:"mesures", n:2');
if (debut < 0 || fin < 0) { console.error("Chapitre 1 introuvable"); process.exit(2); }
const ch1 = src.slice(debut, fin);
const ordre = [...ch1.slice(0, ch1.indexOf("exos:[")).matchAll(/\{id:"(s\d+)", titre:"([^"]*)"/g)]
  .map(m => ({ id: m[1], titre: m[2] }));
console.log("Ordre affiché du ch1 : " + ordre.map((s, i) => `${i + 1}=${s.id}`).join(" "));

let ko = 0;
for (const r of RENVOIS) {
  const texte = fs.readFileSync(`${APP}/${r.f}`, "utf8");
  const nb = texte.split(r.extrait).length - 1;
  if (nb !== 1) { console.log(`INTROUVABLE ${r.f} : « ${r.extrait} » (${nb} occurrences)`); ko = 1; continue; }
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

/* tout renvoi par numéro vers le ch1 doit être répertorié ci-dessus */
const connus = RENVOIS.map(r => r.extrait);
const chercher = (texte, re, f) => {
  for (const m of texte.matchAll(re)) {
    const autour = texte.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60);
    if (!connus.some(e => autour.includes(e))) {
      console.log(`NON RÉPERTORIÉ ${f} : « …${autour.replace(/\s+/g, " ")}… »`); ko = 1;
    }
  }
};
chercher(ch1, /sections? \d+/g, "03-cours-chimie-1.js (ch1)");
for (const f of fs.readdirSync(APP).filter(x => /^0[3-9].*\.js$/.test(x)))
  chercher(fs.readFileSync(`${APP}/${f}`, "utf8"), /chapitre 1,? \(?sections? \d+/g, f);

console.log(ko ? "Renvois en défaut." : `${RENVOIS.length} renvois vers le ch1, tous justes.`);
process.exit(ko);
