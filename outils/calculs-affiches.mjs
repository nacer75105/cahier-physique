/* =====================================================================
   Contrôle CALCULS AFFICHÉS : chaque calcul écrit dans une figure (ligne
   de lecture, note, libellé) doit se refaire avec les nombres TELS QU'ILS
   SONT AFFICHÉS et retomber sur le résultat affiché.

   Pourquoi. Au chantier « source réelle » (ch10, 2026-10-10), la figure
   affichait « 9,4 − 2 × 0,43 = 8,55 » : le résultat venait du courant exact,
   les opérandes de valeurs arrondies, et l'élève qui refait le calcul trouve
   8,54. C'est pire qu'une valeur fausse : cela lui montre un calcul qui ne
   tombe pas juste et lui apprend à ne pas vérifier les siens. Le balayage
   vérifiait les longueurs et les positions, jamais l'arithmétique affichée.
   C'est l'analogue, pour les figures, de la règle des corrigés : la valeur
   affichée se calcule à partir de ce qui est affiché.

   Usage : import { calculsFaux } from "./calculs-affiches.mjs" ;
   calculsFaux(texte) renvoie la liste des calculs qui ne retombent pas juste.
   Tout balayage de figure doit l'appliquer à chaque texte affiché.
   ===================================================================== */

/* un nombre affiché à la française : « 4,70 », « 1 276 », « −824 », « 0,5 » */
const NB = String.raw`[−-]?\d{1,3}(?:[  ]\d{3})+(?:,\d+)?|[−-]?\d+(?:,\d+)?`;
const OP = String.raw`\s*[−+×÷*/-]\s*`;
/* le résultat peut être une fraction « 13/2 » (les balayages lisent ainsi le
   <span class="frac"> du moteur, dont le texte brut collerait « 132 ») */
const CHAINE = new RegExp(String.raw`((?:${NB})(?:${OP}(?:${NB}))+)\s*=\s*(${NB})(?:\s*/\s*(${NB}))?(?![\d,])`, "g");

export const lireNb = s => Number(s.replace(/[  ]/g, "").replace(",", ".").replace("−", "-"));
const decimales = s => (s.split(",")[1] || "").length;

/* évalue « 9,4 − 2 × 0,43 » en respectant la priorité de × et ÷ */
function evaluer(expr) {
  const jetons = expr.match(new RegExp(String.raw`${NB}|[−+×÷*/-]`, "g"));
  /* un « − » collé à un nombre après un opérande est un opérateur, pas un signe */
  const toks = [];
  for (const j of jetons) {
    if (/^[−-]\d/.test(j) && toks.length && typeof toks[toks.length - 1] === "number") { toks.push("-"); toks.push(lireNb(j.slice(1))); }
    else if (/\d/.test(j)) toks.push(lireNb(j));
    else toks.push({"−":"-", "×":"*", "÷":"/"}[j] || j);
  }
  const prod = [toks[0]];
  for (let i = 1; i < toks.length; i += 2) {
    const op = toks[i], v = toks[i + 1];
    if (op === "*") prod[prod.length - 1] *= v;
    else if (op === "/") prod[prod.length - 1] /= v;
    else { prod.push(op); prod.push(v); }
  }
  let r = prod[0];
  for (let i = 1; i < prod.length; i += 2) r = prod[i] === "+" ? r + prod[i + 1] : r - prod[i + 1];
  return r;
}

export function calculsFaux(texte) {
  const out = [];
  for (const m of texte.matchAll(CHAINE)) {
    const calc = evaluer(m[1]), aff = m[3] ? lireNb(m[2]) / lireNb(m[3]) : lireNb(m[2]), d = m[3] ? 9 : decimales(m[2]);
    /* le résultat affiché doit être l'arrondi du calcul refait sur les nombres affichés */
    if (Math.abs(calc - aff) > 0.5 * Math.pow(10, -d) + 1e-9)
      out.push(`« ${m[0].trim()} » : refait avec les nombres affichés, le calcul donne ${String(+calc.toFixed(d + 2)).replace(".", ",")}`);
  }
  return out;
}
