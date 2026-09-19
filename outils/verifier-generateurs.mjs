/* =====================================================================
   Vérification des diagnostics des GÉNÉRATEURS (06-generateurs.js).

   Complément indispensable de verifier-diags.mjs, qui n'atteint pas ce
   code : verifier-diags.mjs analyse les questions écrites en dur dans
   03-cours-*.js, alors qu'un générateur tire ses nombres au hasard et
   calcule ses distracteurs à chaque exercice. Un défaut peut donc
   n'apparaître que sur une combinaison de tirages sur mille.

   Ce script rejoue chaque générateur un grand nombre de fois, applique
   le VRAI filtre de fabriquer() puis, sur les diagnostics conservés,
   cherche trois défauts :

     MORT     un diagnostic conservé qu'aucune saisie ne peut atteindre :
              sa propre valeur n'est captée par aucune fenêtre, ou bien
              elle tombe dans la tolérance de la bonne réponse.
     MASQUÉ   un diagnostic conservé dont la valeur est captée par un
              diagnostic précédent : l'élève qui fait CETTE erreur reçoit
              le message d'une AUTRE. C'est le défaut le plus trompeur,
              parce qu'il donne une explication fausse avec aplomb.
     ÉCARTÉ   un diagnostic retiré par le filtre de fabriquer(). Ce n'est
              pas un défaut en soi — c'est même le rôle du filtre — mais
              un nombre élevé sur un générateur signale des distracteurs
              trop proches les uns des autres, à revoir dans le tirage.

   fenetreDiag() n'est pas recopiée ici : elle est extraite de sa
   définition unique dans public/app/01-noyau.js, exactement comme le
   fait verifier-diags.mjs. Ces deux scripts et les deux fichiers de
   l'application partagent donc une seule règle. C'est le point qui
   avait cédé : la règle vivait en trois copies, elles ont divergé, et
   le filtre de fabriquer() écartait des diagnostics parfaitement
   distincts (voir A_VERIFIER.md).

   Usage : node outils/verifier-generateurs.mjs [id-générateur|chapitre ...]
                                                [--tirages=N] [--tout]
     sans --tout, seuls les générateurs en défaut sont détaillés.
     --tirages=N  (défaut 3000) nombre de tirages par générateur.
   ===================================================================== */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(RACINE, "public", "app");
const args = process.argv.slice(2);
const TOUT = args.includes("--tout");
const opt = args.find(a => a.startsWith("--tirages="));
const N = opt ? Math.max(1, parseInt(opt.split("=")[1], 10) || 3000) : 3000;
const FILTRE = args.filter(a => !a.startsWith("--"));

/* ---- la règle, extraite de sa définition unique ---- */
const fenetreDiag = (() => {
  const src = fs.readFileSync(path.join(APP, "01-noyau.js"), "utf8");
  const m = src.match(/function fenetreDiag\(exo, d\)\{[\s\S]*?\n\}/);
  if (!m) {
    console.error("verifier-generateurs : impossible d'extraire fenetreDiag() de public/app/01-noyau.js.");
    console.error("La fonction a été renommée ou déplacée. Corrige l'extraction plutôt que de recopier la règle.");
    process.exit(2);
  }
  const c = { Math };
  vm.createContext(c);
  vm.runInContext(m[0] + "\nthis.f = fenetreDiag;", c);
  return c.f;
})();

/* ---- chargement des générateurs (aucun DOM : des bouchons suffisent) ---- */
const ctx = {
  window: { APP: { S: {}, el: () => {}, esc: s => s, pct: () => 0, save: () => {}, fenetreDiag } },
  Math, console, String, Number, Array, Object, JSON, isFinite, parseFloat, RegExp, Date
};
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(APP, "06-generateurs.js"), "utf8"), ctx,
                { filename: "06-generateurs.js" });
const GEN = ctx.window.GEN;

/* Le filtre de fabriquer(), rejoué à l'identique. Il est recopié ici — et
   seulement ici — parce qu'il vit au milieu d'une fonction qui tire aussi
   le générateur au hasard : on ne peut pas l'appeler sur un exercice
   choisi. Si tu modifies fabriquer(), reporte la modification ici.
   La règle de fenêtre, elle, n'est pas recopiée : c'est fenetreDiag(). */
function filtrer(e) {
  if (e.tol == null && e.type === "num") e.tol = 0.0005;
  if (e.type !== "num" || !e.diag) return { gardes: [], ecartes: [] };
  const vus = [], gardes = [], ecartes = [];
  for (const d of e.diag) {
    if (!isFinite(d.v)) { ecartes.push({ d, pourquoi: "valeur non finie" }); continue; }
    if (Math.abs(d.v - e.rep) <= e.tol) { ecartes.push({ d, pourquoi: "tombe sur la bonne réponse" }); continue; }
    let par = null;
    for (const u of vus) if (Math.abs(d.v - u) <= fenetreDiag(e, u)) { par = u; break; }
    if (par !== null) { ecartes.push({ d, pourquoi: `capté par le diagnostic ${fmt(par)}` }); continue; }
    vus.push(d.v); gardes.push(d);
  }
  return { gardes, ecartes };
}

/* quel diagnostic conservé capte la valeur x ? (ordre de diagnostic()) */
function quiCapte(exo, x) {
  for (let i = 0; i < exo.diag.length; i++)
    if (Math.abs(x - exo.diag[i].v) <= fenetreDiag(exo, exo.diag[i].v)) return i;
  return -1;
}
const fmt = n => (Math.abs(n) >= 1e4 || (n !== 0 && Math.abs(n) < 1e-3))
  ? n.toExponential(3) : String(Math.round(n * 1e6) / 1e6);

/* ---- rejeu ---- */
let pool = GEN.tous();
if (FILTRE.length) {
  pool = pool.filter(g => FILTRE.includes(g.id) || FILTRE.includes(g.chap));
  if (!pool.length) {
    console.error(`Aucun générateur ne correspond à : ${FILTRE.join(", ")}`);
    console.error(`Générateurs disponibles : ${GEN.tous().map(g => g.id).join(", ")}`);
    process.exit(2);
  }
}

const rapport = [];
let totExos = 0, totDiags = 0, totMort = 0, totMasque = 0, totEcarte = 0;

for (const g of pool) {
  const s = { id: g.id, titre: g.titre, chap: g.chap, exos: 0, diags: 0,
              mort: 0, masque: 0, ecarte: 0, cas: new Map() };
  for (let k = 0; k < N; k++) {
    const e = g.gen();
    if (e.type !== "num" || !e.diag) continue;
    s.exos++;
    const { gardes, ecartes } = filtrer(e);
    s.diags += gardes.length;
    s.ecarte += ecartes.filter(x => x.pourquoi.startsWith("capté")).length;

    const exo = { tol: e.tol, rep: e.rep, diag: gardes };
    for (let i = 0; i < gardes.length; i++) {
      const j = quiCapte(exo, gardes[i].v);
      let cle = null, texte = null;
      if (j === -1) {
        s.mort++; cle = `MORT:${i}`;
        texte = `diag[${i}] = ${fmt(gardes[i].v)} : aucune saisie ne l'atteint (rep=${fmt(e.rep)}, tol=${fmt(e.tol)})`;
      } else if (j !== i) {
        s.masque++; cle = `MASQUÉ:${i}<-${j}`;
        texte = `diag[${i}] = ${fmt(gardes[i].v)} reçoit le message de diag[${j}] = ${fmt(gardes[j].v)}`
              + ` (fenêtre ±${fmt(fenetreDiag(exo, gardes[j].v))}, rep=${fmt(e.rep)}, tol=${fmt(e.tol)})`;
      }
      if (cle && !s.cas.has(cle)) s.cas.set(cle, texte);
    }
  }
  totExos += s.exos; totDiags += s.diags;
  totMort += s.mort; totMasque += s.masque; totEcarte += s.ecarte;
  rapport.push(s);
}

/* ---- rapport ---- */
for (const s of rapport.sort((a, b) => (b.mort + b.masque) - (a.mort + a.masque))) {
  const enDefaut = s.mort || s.masque;
  if (!enDefaut && !TOUT) continue;
  const tete = `${s.id} (${s.chap}) — ${s.titre}`;
  console.log(`\n== ${tete}`);
  console.log(`   ${s.exos} tirages, ${s.diags} diagnostics conservés, ${s.ecarte} écartés comme déjà captés.`);
  if (enDefaut) {
    console.log(`   ${s.mort} MORT, ${s.masque} MASQUÉ — exemples distincts :`);
    for (const t of s.cas.values()) console.log(`     ${t}`);
  } else console.log(`   aucun défaut.`);
}

console.log(`\n${rapport.length} générateurs, ${N} tirages chacun, ${totExos} exercices numériques.`);
console.log(`${totDiags} diagnostics conservés, ${totEcarte} écartés parce qu'un autre les captait déjà.`);
console.log(`${totMort} MORT (inatteignable), ${totMasque} MASQUÉ (reçoit le message d'une autre erreur).`);
if (!totMort && !totMasque) console.log(`Aucun générateur en défaut.`);
process.exitCode = totMort + totMasque ? 1 : 0;
