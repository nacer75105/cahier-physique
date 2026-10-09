/* =====================================================================
   Contrôle AFFICHAGE (verifier-generateurs) : ce que le corrigé d'un
   générateur affiche de la réponse doit être cohérent avec la réponse
   attendue `rep` et sa tolérance `tol`.

   Pourquoi. Au ch16 (2026-10-09), des corrigés de générateurs affichaient
   un résultat qui n'était pas l'arrondi juste de la réponse, ou une
   valeur qui ne retombait pas sur le calcul montré. Les audits ne le
   voyaient pas : ils ne lisaient jamais le texte des corrigés.

   Trois règles, sur chaque tirage :
   1. le corrigé affiche au moins une valeur de la réponse ACCEPTÉE par
      la tolérance (l'élève qui recopie le corrigé a juste) ;
   2. toute valeur affichée proche de la réponse (à moins de 2 %) est soit
      la réponse exacte, soit son ARRONDI CORRECT (demi vers le haut) au
      nombre de chiffres affichés — jamais un arrondi faux ;
   3. deux affichages de la réponse au même nombre de chiffres sont
      identiques (conséquence de la règle 2, signalée à part).
   ===================================================================== */

/* arrondi au plus proche, demi vers le haut, à d chiffres significatifs.
   Le facteur (1 + 1e-12) corrige le flottant : 0,4125 y vaut 0,41249999… */
export const arrondi = (v, d) => Number((v * (1 + 1e-12 * Math.sign(v))).toPrecision(d));

/* Les nombres écrits par fr() et sig3() : « 0{,}412 », « 151 950 »,
   « 1{,}13 × 10^{5} », « 9{,}0 × 10^9 ». Les indices et exposants de
   formules (H_2O, MnO_4^-) ne sont pas des nombres affichés. */
const RE = /(?<![_^{}\d,.\w])(\d{1,3}(?: \d{3})+|\d+)(?:\{,\}(\d+))?(?:\s*×\s*10\^\{?([−-]?\d+)\}?)?(?![\d}])/g;
export function nombres(txt) {
  const out = [];
  for (const m of txt.matchAll(RE)) {
    const ent = m[1].replace(/ /g, ""), dec = m[2] || "", exp = m[3] ? +m[3].replace("−", "-") : 0;
    const v = Number(ent + (dec ? "." + dec : "")) * Math.pow(10, exp);
    const chiffres = (ent + dec).replace(/^0+/, "");
    /* chiffres significatifs : un entier terminé par des zéros est ambigu
       (« 1000 ») : on admet tout nombre de chiffres entre le minimum et le total */
    const max = chiffres.length, min = dec ? max : chiffres.replace(/0+$/, "").length || 1;
    out.push({ texte: m[0], v, min, max });
  }
  return out;
}

/* les défauts d'affichage d'un exercice généré : [{cle, texte}] */
export function defautsAffichage(e) {
  const out = [], r = e.rep, tol = e.tol;
  if (typeof r !== "number" || !isFinite(r) || r === 0 || !e.corr) return out;
  /* un nombre déjà écrit dans l'énoncé est une donnée (g = 9,81…), pas un affichage de la réponse */
  const donnees = new Set(nombres(e.enonce || "").map(n => n.v));
  const proches = nombres(e.corr.join(" ")).filter(n => Math.abs(n.v - r) <= 0.02 * Math.abs(r) && !donnees.has(n.v));
  if (!proches.length) return out;                        // réponse non affichée sous forme numérique
  if (!proches.some(n => Math.abs(n.v - r) <= tol))
    out.push({ cle: "AFFICHAGE:refusée", texte: `le corrigé affiche ${proches.map(n => "« " + n.texte + " »").join(", ")}, aucune valeur acceptée par la tolérance (rep=${r}, tol=${tol})` });
  for (const n of proches) {
    if (Math.abs(n.v - r) <= 1e-9 * Math.abs(r)) continue;          // la réponse elle-même
    let ok = false;
    for (let d = n.min; d <= n.max && !ok; d++) if (Math.abs(arrondi(r, d) - n.v) <= 1e-9 * Math.abs(r)) ok = true;
    if (!ok) out.push({ cle: "AFFICHAGE:arrondi", texte: `« ${n.texte} » n'est pas l'arrondi de ${r} à ${n.min === n.max ? n.min : n.min + "-" + n.max} chiffres (attendu ${arrondi(r, n.max)})` });
  }
  const parD = {};
  for (const n of proches) { const k = n.max; (parD[k] = parD[k] || new Set()).add(n.v); }
  for (const k in parD) if (parD[k].size > 1)
    out.push({ cle: "AFFICHAGE:divergent", texte: `la réponse est affichée à ${k} chiffres de deux façons : ${[...parD[k]].join(" et ")}` });
  return out;
}
