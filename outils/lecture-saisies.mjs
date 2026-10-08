/* =====================================================================
   Contrôle LECTURE, commun à verifier-diags et verifier-generateurs :
   une valeur écrite comme l'élève la tape doit être lue à sa valeur par
   parseNum() (public/app/01-noyau.js).

   Pourquoi. Jusqu'au 2026-10-08, parseNum() lisait comme une puissance
   de dix tout nombre contenant « 10 » : « 3100 » donnait 3, « 100 »
   donnait 1, « 141000 » donnait 14. Des bonnes réponses étaient
   déclarées fausses (el12, fl5, l'atelier des fluides), et des
   diagnostics ne s'affichaient jamais. Les audits ne le voyaient pas :
   ils passaient des nombres à diagnostic(), jamais du texte.

   Comme fenetreDiag() et diagnostic(), parseNum() est EXTRAITE de sa
   définition unique, jamais recopiée ; si l'extraction échoue, arrêt en
   code 2.
   ===================================================================== */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

export function extraireParseNum(APP, nomScript) {
  const src = fs.readFileSync(path.join(APP, "01-noyau.js"), "utf8");
  const m = src.match(/function parseNum\(str\)\{[\s\S]*?\n\}/);
  if (!m) {
    console.error(`${nomScript} : impossible d'extraire parseNum() de public/app/01-noyau.js.`);
    console.error("La fonction a été renommée ou déplacée. Corrige l'extraction plutôt que de recopier la règle.");
    process.exit(2);
  }
  const c = { Math, String, parseFloat, NaN };
  vm.createContext(c);
  vm.runInContext(m[0] + "\nthis.f = parseNum;", c);
  return c.f;
}

/* Les écritures d'une valeur x : x elle-même et ses arrondis à 1 à 4
   chiffres, en décimal avec virgule (« 141000 », « 0,00104 »), puis en
   écriture scientifique avec chacun des signes acceptés (« 1,41×10^5 »,
   « 1,41x10^5 », « 1,41*10^5 », « 1,41·10^5 », « 1,41.10^5 », « 1,41e5 », et
   « 1,5.10-2 » pour un exposant négatif).
   Chaque écriture porte la valeur qu'elle représente vraiment. */
export function saisies(x) {
  const out = [];
  if (typeof x !== "number" || !isFinite(x)) return out;
  const vals = new Set([x]);
  if (x !== 0) for (let n = 1; n <= 4; n++) vals.add(+x.toPrecision(n));
  for (const v of vals) {
    const dec = String(v);
    if (!/e/i.test(dec)) out.push({ texte: dec.replace(".", ","), attendu: v });
    if (v === 0) continue;
    for (let k = 0; k <= 3; k++) {
      const [mant, exp] = v.toExponential(k).split("e");
      const attendu = Number(mant + "e" + exp), m = mant.replace(".", ","), e = String(+exp);
      for (const sep of ["×", "x", "*", "·"]) out.push({ texte: `${m}${sep}10^${e}`, attendu });
      out.push({ texte: `${m}.10^${e}`, attendu });
      if (+exp < 0) out.push({ texte: `${m}.10${e}`, attendu }); // « 1,5.10-2 »
      out.push({ texte: `${m}e${e}`, attendu });
    }
  }
  return out;
}

/* Les écritures de x mal lues : [{texte, attendu, lu}] */
export function lecturesFausses(parseNum, x) {
  return saisies(x).map(s => ({ ...s, lu: parseNum(s.texte) }))
    .filter(s => !(Math.abs(s.lu - s.attendu) <= 1e-9 * Math.abs(s.attendu) + 1e-300));
}
