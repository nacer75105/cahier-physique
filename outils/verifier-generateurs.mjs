/* =====================================================================
   Vérification des diagnostics des GÉNÉRATEURS (06-generateurs.js).

   Complément indispensable de verifier-diags.mjs, qui n'atteint pas ce
   code : verifier-diags.mjs analyse les questions écrites en dur dans
   03-cours-*.js, alors qu'un générateur tire ses nombres au hasard et
   calcule ses distracteurs à chaque exercice. Un défaut peut donc
   n'apparaître que sur une combinaison de tirages sur mille.

   Ce script rejoue chaque générateur un grand nombre de fois, applique
   le VRAI filtre de fabriquer() puis, sur les diagnostics conservés,
   cherche quatre défauts (MORT, MASQUÉ, ARRONDI, GÉNÉRIQUE, tous comptés
   dans le code de sortie) et relève les écartés :

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
     ARRONDI  un diagnostic conservé qui, arrondi ou tronqué à 2 ou 3
              chiffres significatifs — ce que l'élève tape vraiment —,
              reçoit le message d'un AUTRE diagnostic, ou est compté juste ;
              ou la bonne réponse arrondie à 2 ou 3 chiffres qui reçoit le
              message d'un distracteur. MASQUÉ ne teste que la valeur
              exacte : deux fenêtres disjointes (fenetreDiag() le garantit)
              n'empêchent pas l'arrondi de l'une de tomber dans l'autre
              (ti-simple, C_B = 0,010 : 0,010417 s'écrit « 0,010 », qui est
              C_B). À 1 chiffre, c'est affiché pour information seulement :
              deux erreurs à moins d'un facteur 2 se confondent forcément.
     GÉNÉRIQUE  un message générique de diagnostic() qui manque ou se
              trompe : -r, 2r ou r/2, arrondis ou tronqués de 1 à 4 chiffres
              et qui auraient été acceptés au signe ou au facteur 2 près,
              doivent recevoir « mauvais signe », « double », « moitié » ;
              r × 10^n (n de -3 à 3, n ≠ 0) ne doit recevoir aucun des trois.
              Seules comptent les saisies qu'aucun diagnostic de exo.diag
              ne capte avant.

   fenetreDiag() n'est pas recopiée ici : elle est extraite de sa
   définition unique dans public/app/01-noyau.js, exactement comme le
   fait verifier-diags.mjs. Ces deux scripts et les deux fichiers de
   l'application partagent donc une seule règle. C'est le point qui
   avait cédé : la règle vivait en trois copies, elles ont divergé, et
   le filtre de fabriquer() écartait des diagnostics parfaitement
   distincts (voir A_VERIFIER.md). diagnostic() est extraite de même de
   public/app/04-vue.js pour le contrôle GÉNÉRIQUE.

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

/* ---- diagnostic(), extraite de même de 04-vue.js : les messages génériques
   (mauvais signe, double, moitié) ne vivent que là. On lui passe des nombres :
   parseNum() n'a rien à lire. ---- */
const diagnostic = (() => {
  const src = fs.readFileSync(path.join(APP, "04-vue.js"), "utf8");
  const m = src.match(/function diagnostic\(exo, saisie\)\{[\s\S]*?\n\}/);
  if (!m) {
    console.error("verifier-generateurs : impossible d'extraire diagnostic() de public/app/04-vue.js.");
    console.error("La fonction a été renommée ou déplacée. Corrige l'extraction plutôt que de recopier la règle.");
    process.exit(2);
  }
  const c = { Math, isNaN, fenetreDiag, A: { parseNum: Number, norm: s => String(s) } };
  vm.createContext(c);
  vm.runInContext(m[0] + "\nthis.f = diagnostic;", c);
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

/* ---- ce que l'élève tape : la valeur arrondie ou tronquée à n chiffres ---- */
const arrondi = (x, n) => (x === 0 ? 0 : +x.toPrecision(n));
function tronque(x, n) {
  if (x === 0) return 0;
  const p = Math.pow(10, n - 1 - Math.floor(Math.log10(Math.abs(x))));
  return Math.trunc(+(x * p).toPrecision(12)) / p; // 0,29 × 100 vaut 28,999… en flottant
}
function ecritures(x, chiffres) {
  const vus = new Set([x]), out = [];
  /* du plus précis au moins précis : « 0,010 » est à la fois l'arrondi à 1 et
     à 2 chiffres de 0,010417 ; il doit compter comme une écriture à 2 chiffres,
     donc comme un défaut, pas comme une simple information */
  for (const n of [...chiffres].sort((a, b) => b - a))
    for (const [v, nom] of [[arrondi(x, n), "arrondi"], [tronque(x, n), "tronqué"]])
      if (!vus.has(v)) { vus.add(v); out.push({ v, n, nom: `${nom} à ${n} ch.` }); }
  return out;
}
const estJuste = (exo, x) => Math.abs(x - exo.rep) <= exo.tol;

/* ARRONDI : défauts (2 et 3 chiffres) et cas pour information (1 chiffre) */
function arrondis(exo) {
  const defauts = [], infos = [];
  exo.diag.forEach((d, i) => {
    for (const { v, n, nom } of ecritures(d.v, [1, 2, 3])) {
      const j = estJuste(exo, v) ? "juste" : quiCapte(exo, v);
      if (j === i || j === -1) continue;
      const texte = `diag[${i}] = ${fmt(d.v)} ${nom} (${fmt(v)}) `
        + (j === "juste" ? "est compté JUSTE" : `reçoit le message de diag[${j}] = ${fmt(exo.diag[j].v)}`);
      (n === 1 ? infos : defauts).push({ cle: `ARRONDI:${i}<-${j}:${n}`, texte });
    }
  });
  for (const { v, nom } of ecritures(exo.rep, [2, 3])) {
    if (estJuste(exo, v)) continue;
    const j = quiCapte(exo, v);
    if (j >= 0) defauts.push({ cle: `ARRONDI:rep<-${j}`,
      texte: `la réponse ${fmt(exo.rep)} ${nom} (${fmt(v)}) reçoit le message de diag[${j}] = ${fmt(exo.diag[j].v)}` });
  }
  return { defauts, infos };
}

/* GÉNÉRIQUE : les messages de référence sont ceux que diagnostic() donne à
   -r, 2r et r/2 exacts sur un exercice sans diagnostic précis — aucun texte
   n'est recopié ici. */
function generiques(exo) {
  const r = exo.rep, tol = exo.tol, out = [];
  if (r === 0) return out;
  const x = { type: "num", rep: r, tol, diag: exo.diag };
  const nu = { type: "num", rep: r, tol, diag: [] };
  const cibles = [["mauvais signe", -r, tol], ["double", 2 * r, 2 * tol], ["moitié", r / 2, tol / 2]];
  const refs = cibles.map(([, c]) => diagnostic(nu, c));
  if (new Set(refs).size < 3) return [{ cle: "GÉNÉRIQUE:refs", texte: `-r, 2r et r/2 ne reçoivent pas trois messages distincts : les zones génériques se chevauchent (rep=${fmt(r)}, tol=${fmt(tol)})` }];
  cibles.forEach(([nom, c, t], k) => {
    for (const { v, nom: ecrit } of [{ v: c, nom: "exact" }, ...ecritures(c, [1, 2, 3, 4])]) {
      if (Math.abs(v - c) > t || estJuste(x, v) || quiCapte(x, v) >= 0) continue;
      if (diagnostic(x, v) !== refs[k])
        out.push({ cle: `GÉNÉRIQUE:${nom}`, texte: `${fmt(v)} (${nom === "mauvais signe" ? "-r" : nom === "double" ? "2r" : "r/2"} ${ecrit}) ne reçoit pas « ${nom} » (rep=${fmt(r)}, tol=${fmt(tol)})` });
    }
  });
  for (let n = -3; n <= 3; n++) {
    if (n === 0) continue;
    const v = r * Math.pow(10, n);
    if (quiCapte(x, v) >= 0) continue;
    const k = refs.indexOf(diagnostic(x, v));
    if (k >= 0) out.push({ cle: `GÉNÉRIQUE:10^${n}`, texte: `${fmt(v)} (r × 10^${n}) reçoit « ${cibles[k][0]} » à tort (rep=${fmt(r)}, tol=${fmt(tol)})` });
  }
  return out;
}

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
let totArrondi = 0, totGenerique = 0, totInfo = 0;

for (const g of pool) {
  const s = { id: g.id, titre: g.titre, chap: g.chap, exos: 0, diags: 0,
              mort: 0, masque: 0, ecarte: 0, arrondi: 0, generique: 0, info: 0,
              cas: new Map(), infos: new Map() };
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
    /* ARRONDI et GÉNÉRIQUE : comptés en tirages touchés, un exemple par cas */
    const { defauts, infos } = arrondis(exo);
    const gen = generiques(exo);
    if (defauts.length) s.arrondi++;
    if (gen.length) s.generique++;
    if (infos.length) s.info++;
    for (const d of [...defauts, ...gen]) if (!s.cas.has(d.cle)) s.cas.set(d.cle, d.texte);
    for (const d of infos) if (!s.infos.has(d.cle) && s.infos.size < 3) s.infos.set(d.cle, d.texte);
  }
  totExos += s.exos; totDiags += s.diags;
  totMort += s.mort; totMasque += s.masque; totEcarte += s.ecarte;
  totArrondi += s.arrondi; totGenerique += s.generique; totInfo += s.info;
  rapport.push(s);
}

/* ---- rapport ---- */
const defauts = s => s.mort + s.masque + s.arrondi + s.generique;
for (const s of rapport.sort((a, b) => defauts(b) - defauts(a))) {
  const enDefaut = defauts(s) > 0;
  if (!enDefaut && !TOUT) continue;
  const tete = `${s.id} (${s.chap}) — ${s.titre}`;
  console.log(`\n== ${tete}`);
  console.log(`   ${s.exos} tirages, ${s.diags} diagnostics conservés, ${s.ecarte} écartés comme déjà captés.`);
  if (enDefaut) {
    console.log(`   ${s.mort} MORT, ${s.masque} MASQUÉ, ${s.arrondi} tirages ARRONDI, ${s.generique} tirages GÉNÉRIQUE — exemples distincts :`);
    for (const t of s.cas.values()) console.log(`     ${t}`);
  } else console.log(`   aucun défaut.`);
  if (TOUT && s.info) {
    console.log(`   info : ${s.info} tirages où un arrondi à 1 chiffre reçoit un autre message, par exemple :`);
    for (const t of s.infos.values()) console.log(`     ${t}`);
  }
}

console.log(`\n${rapport.length} générateurs, ${N} tirages chacun, ${totExos} exercices numériques.`);
console.log(`${totDiags} diagnostics conservés, ${totEcarte} écartés parce qu'un autre les captait déjà.`);
console.log(`${totMort} MORT (inatteignable), ${totMasque} MASQUÉ (reçoit le message d'une autre erreur).`);
console.log(`${totArrondi} tirages ARRONDI (arrondi à 2 ou 3 chiffres mal diagnostiqué), ${totGenerique} tirages GÉNÉRIQUE (mauvais signe, double, moitié).`);
console.log(`Pour information : ${totInfo} tirages où un arrondi à 1 chiffre reçoit un autre message (détail avec --tout).`);
if (!totMort && !totMasque && !totArrondi && !totGenerique) console.log(`Aucun générateur en défaut.`);
process.exitCode = totMort + totMasque + totArrondi + totGenerique ? 1 : 0;
