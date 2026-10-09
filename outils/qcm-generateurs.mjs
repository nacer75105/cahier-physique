/* =====================================================================
   Contrôle QCM (verifier-generateurs) : les générateurs qui produisent
   des QCM (type:"qcm") et non des réponses numériques.

   Pourquoi. Jusqu'au 2026-10-09, verifier-generateurs ne rejouait que les
   générateurs numériques : les premiers générateurs de QCM du cahier
   (co-objet, co-filtres, ch17) n'étaient contrôlés par aucun audit
   versionné. Un script hors dépôt les avait vérifiés pendant le chantier ;
   un contrôle qu'on peut oublier de relancer ne protège rien.

   Sur chaque tirage :
   - STRUCTURE : 4 choix distincts, `bonne` valide, un diagnostic par choix,
     vide pour la bonne réponse et non vide ailleurs, corrigé présent, aucun
     NaN ni undefined ;
   - RÉPONSE : la bonne réponse, recalculée par une règle INDÉPENDANTE du
     générateur (ci-dessous, une par générateur), qui relit l'énoncé ;
   - MESSAGE : chaque diagnostic dit vrai sur le choix qu'il commente (un
     message « c'est la couleur de la lumière » n'est posé que sur elle) ;
   et, sur l'ensemble des tirages d'un générateur :
   - POSITION : chacune des 4 places reçoit la bonne réponse au moins
     15 % du temps (25 % attendus).
   Un générateur de QCM sans règle ici est NON COUVERT, et compté comme
   un défaut : un nouveau générateur de QCM doit apporter sa règle.
   ===================================================================== */

/* ---- le modèle des couleurs (ch17), recalculé ici ---- */
const C = { rouge: [1,0,0], vert: [0,1,0], bleu: [0,0,1], jaune: [1,1,0], cyan: [0,1,1], magenta: [1,0,1], blanc: [1,1,1], noir: [0,0,0] };
const FEM = { blanche: "blanc", verte: "vert", bleue: "bleu" };
const nomDe = t => Object.keys(C).find(k => C[k].join() === t.join());
const ET = (a, b) => a.map((x, i) => x & b[i]);
const OU = (a, b) => a.map((x, i) => x | b[i]);
const liste = t => { const l = ["rouge","vert","bleu"].filter((x, i) => t[i]).map(x => "le " + x);
  return !l.length ? "rien" : l.length === 1 ? l[0] : l.slice(0, -1).join(", ") + " et " + l[l.length - 1]; };
const accordFaux = s => /lumière \**(blanc|vert|bleu)\b/.test(s);

export const REGLES = {
  /* « Un objet est **X** en lumière blanche … uniquement en lumière **Y** » */
  "co-objet": {
    donnees(e) {
      const m = e.enonce.match(/objet est \*\*(\w+)\*\* en lumière blanche.*uniquement en lumière \*\*(\w+)\*\*/);
      return m && { a: m[1], b: FEM[m[2]] || m[2] };
    },
    attendu: ({ a, b }) => nomDe(ET(C[a], C[b])),
    /* ce que chaque message affirme, et sur quel choix il a le droit de l'affirmer */
    messages: ({ a, b }) => [
      [/en lumière \*\*blanche\*\*/, a, "« couleur en lumière blanche »"],
      [/C'est la couleur de la lumière/, b, "« couleur de la lumière »"],
      [/additionné/, nomDe(OU(C[a], C[b])), "« tu as additionné »"],
      [/paraîtrait noir/, "noir", "message du noir"]
    ],
    autres: ({ a, b }, d) => /absorbe une partie/.test(d) && !ET(C[a], C[b]).some(Boolean) ? "« absorbe une partie » alors qu'il absorbe tout" : null
  },
  /* « … traverse un filtre **X**, puis un filtre **Y** » */
  "co-filtres": {
    donnees(e) {
      const m = e.enonce.match(/filtre \*\*(\w+)\*\*, puis un filtre \*\*(\w+)\*\*/);
      return m && { a: m[1], b: m[2] };
    },
    attendu: ({ a, b }) => nomDe(ET(C[a], C[b])),
    messages: ({ a, b }) => [
      [/C'est la couleur du premier filtre/, a, "« premier filtre »"],
      [/C'est la couleur du second filtre/, b, "« second filtre »"],
      [/additionné/, nomDe(OU(C[a], C[b])), "« tu as additionné »"],
      [/ne retrouve jamais tout le blanc/, "blanc", "message du blanc"],
      [/Une composante passe les deux filtres/, "noir", "message du noir"]
    ],
    autres: () => null
  }
};

/* défauts d'un tirage : [{cle, texte}] */
export function defautsQCM(id, e) {
  const out = [], ko = (cle, texte) => out.push({ cle: "QCM:" + cle, texte });
  const R = REGLES[id];
  if (!R) { ko("non couvert", `aucune règle de vérification pour le générateur de QCM « ${id} » (outils/qcm-generateurs.mjs)`); return out; }
  const ch = e.choix || [];
  if (ch.length !== 4) ko("structure", `${ch.length} choix au lieu de 4`);
  if (new Set(ch.map(x => String(x).toLowerCase())).size !== ch.length) ko("structure", `choix en double : ${ch.join(" / ")}`);
  if (!(Number.isInteger(e.bonne) && e.bonne >= 0 && e.bonne < ch.length)) { ko("structure", `bonne = ${e.bonne}`); return out; }
  if (!e.diag || e.diag.length !== ch.length) ko("structure", `${e.diag ? e.diag.length : 0} diagnostics pour ${ch.length} choix`);
  if (!e.corr || !e.corr.length) ko("structure", "pas de corrigé");
  if (/NaN|undefined/.test(JSON.stringify(e))) ko("structure", "NaN ou undefined dans l'exercice");
  const D = R.donnees(e);
  if (!D) { ko("énoncé", `énoncé illisible pour la règle : « ${e.enonce} »`); return out; }
  const juste = R.attendu(D), lab = `${D.a}/${D.b}`;
  if (String(ch[e.bonne]).toLowerCase() !== juste) ko("réponse", `${lab} : bonne réponse « ${ch[e.bonne]} », la règle donne « ${juste} »`);
  const calcul = liste(ET(C[D.a], C[D.b])) + ".";
  (e.diag || []).forEach((d, i) => {
    const c = String(ch[i]).toLowerCase();
    if (i === e.bonne) { if (d !== "") ko("structure", `${lab} : diagnostic non vide sur la bonne réponse`); return; }
    if (!d) { ko("structure", `${lab} : diagnostic vide pour « ${c} »`); return; }
    for (const [re, choix, quoi] of R.messages(D)) if (re.test(d) && c !== choix) ko("message", `${lab} : ${quoi} posé sur « ${c} »`);
    const a = R.autres(D, d); if (a) ko("message", `${lab} : ${a}`);
    if (!d.includes(calcul)) ko("message", `${lab} : le calcul rappelé ne finit pas sur « ${calcul} »`);
    if (accordFaux(d)) ko("accord", `${lab} : « ${d.match(/lumière \**(blanc|vert|bleu)\b/)[0]} »`);
  });
  if (accordFaux(e.enonce + " " + (e.corr || []).join(" "))) ko("accord", `${lab} : accord fautif dans l'énoncé ou le corrigé`);
  return out;
}

/* défaut de répartition sur l'ensemble des tirages d'un générateur, ou null */
export function defautPosition(positions) {
  const n = positions.reduce((a, b) => a + b, 0);
  if (!n) return null;
  const mini = Math.min(...positions);
  return mini < 0.15 * n ? { cle: "QCM:position", texte: `bonne réponse par position : ${positions.join(" / ")} sur ${n} tirages (au moins 15 % attendus partout)` } : null;
}
