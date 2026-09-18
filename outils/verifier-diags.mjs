/* =====================================================================
   Vérification des diagnostics numériques (champ `diag` des exercices
   et des étapes d'atelier de type numérique).

   Un diagnostic {v, m} associe une valeur à une erreur type : si l'élève
   tape v, on lui affiche le message m. Si v a été mal calculé, l'élève
   qui fait exactement cette erreur ne reçoit jamais le message — sans que
   rien ne le signale. Ce script refait chaque calcul erroné à partir de
   sa description, indépendamment de la valeur v écrite dans le cours.

   Les calculs refaits sont dans outils/diags/<fichier>.mjs, un par
   fichier de cours : clé = adresse de la question, valeur = {rep, diags}
   (voir outils/diags/LISEZMOI.md).

   Usage : node outils/verifier-diags.mjs [id-chapitre ...] [--tout]
     sans --tout, seuls les problèmes sont listés.
   ===================================================================== */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(RACINE, "public", "app");
const args = process.argv.slice(2);
const TOUT = args.includes("--tout");
const FILTRE = args.filter(a => !a.startsWith("--"));

/* ---- mêmes règles que diagnostic() et verifier() de public/app/04-vue.js ---- */
const tolDe = q => (q.tol != null ? q.tol : 0.0005);
const estJuste = (q, x) => Math.abs(x - q.rep) <= tolDe(q);
function fenetre(q, d) {
  let fen = q.tol || 0.0005;
  if (d !== 0) fen = Math.min(fen, Math.abs(d) / 2);
  return fen;
}
/* Ce que l'application affiche vraiment pour la saisie x : "juste",
   l'indice du premier diag qui l'attrape, ou "générique". */
function reaction(q, x) {
  if (estJuste(q, x)) return "juste";
  for (let i = 0; i < (q.diag || []).length; i++)
    if (Math.abs(x - q.diag[i].v) <= fenetre(q, q.diag[i].v)) return i;
  return "générique";
}

/* ---- chargement des cours et des calculs refaits ---- */
const questions = []; // {fichier, chap, adr, q, libelle}
for (const f of fs.readdirSync(APP).filter(f => f.startsWith("03-cours")).sort()) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(APP, f), "utf8"), ctx, { filename: f });
  for (const c of ctx.window.COURS) {
    if (FILTRE.length && !FILTRE.includes(c.id)) continue;
    for (const e of c.exos || [])
      if (e.type === "num") questions.push({ fichier: f, chap: c, adr: e.id, q: e });
    for (const s of c.sections || []) {
      let k = 0;
      for (const b of s.blocs || []) {
        if (b.t !== "atelier") continue;
        k++;
        (b.etapes || []).forEach((e, j) => {
          if (typeof e.rep === "number")
            questions.push({ fichier: f, chap: c, adr: `${s.id}/atelier${k}/etape${j + 1}`, q: e });
        });
      }
    }
  }
}

const calculs = {};
for (const f of new Set(questions.map(x => x.fichier))) {
  const reg = path.join(RACINE, "outils", "diags", f.replace(/\.js$/, ".mjs"));
  calculs[f] = fs.existsSync(reg) ? (await import(pathToFileURL(reg))).default : {};
}

/* ---- vérifications ---- */
const fmt = x => (typeof x === "number" ? Number(x.toPrecision(4)).toString() : String(x));
const problemes = []; // {chap, adr, niveau, texte}
const stats = { questions: 0, diags: 0, verifies: 0, faux: 0, fenetre: 0, nonCouverts: 0, sansCalcul: 0 };
const signaler = (x, niveau, texte) => problemes.push({ chap: x.chap, adr: x.adr, niveau, texte });

for (const x of questions) {
  const q = x.q, diags = q.diag || [];
  stats.questions++;
  stats.diags += diags.length;
  const reg = calculs[x.fichier][`${x.chap.id}:${x.adr}`];

  // 1. la bonne réponse elle-même
  if (reg && typeof reg.rep === "function") {
    const r = reg.rep();
    if (!estJuste(q, r))
      signaler(x, "FAUX", `réponse attendue ${fmt(q.rep)} (tol ${fmt(tolDe(q))}), le calcul refait donne ${fmt(r)}`);
  }

  diags.forEach((d, i) => {
    const nom = `diag[${i}] v=${fmt(d.v)}`;
    // 2. contrôles mécaniques, sans calcul refait
    if (typeof d.v !== "number" || !isFinite(d.v)) return signaler(x, "FAUX", `${nom} : valeur non numérique`);
    if (estJuste(q, d.v)) signaler(x, "MORT", `${nom} : compté juste (dans la tolérance de la réponse), le message ne s'affiche jamais`);
    else if (reaction(q, d.v) !== i) signaler(x, "MORT", `${nom} : masqué par diag[${reaction(q, d.v)}], qui l'attrape avant`);

    // 3. le calcul erroné refait
    const c = reg && reg.diags ? reg.diags[i] : undefined;
    if (c === undefined) { stats.nonCouverts++; return; }
    if (c === null || typeof c.calc !== "function") {
      stats.sansCalcul++;
      if (TOUT) signaler(x, "info", `${nom} : pas de calcul identifiable (${c && c.note || "—"})`);
      return;
    }
    stats.verifies++;
    const e = c.calc(), rx = reaction(q, e);
    if (rx === i) { if (TOUT) signaler(x, "ok", `${nom} : ${c.erreur} → ${fmt(e)}`); return; }
    const suite = rx === "juste" ? "comptée JUSTE — l'erreur n'est pas détectée"
      : rx === "générique" ? "message générique" : `message de diag[${rx}] à la place`;
    /* v n'est qu'un arrondi du calcul erroné (écart < 5 %, arrondi à 2 chiffres) : la valeur du
       cours est bonne, c'est la fenêtre de reconnaissance de diagnostic()
       — absolue, min(tol, |v|/2) — qui est trop étroite pour l'attraper. */
    if (rx === "générique" && Math.abs(e - d.v) <= 0.05 * Math.abs(e)) {
      stats.fenetre++;
      return signaler(x, "FENÊTRE", `${nom} : « ${c.erreur} » donne ${fmt(e)}, fenêtre ±${fmt(fenetre(q, d.v))} → ${suite}`);
    }
    stats.faux++;
    signaler(x, "FAUX", `${nom} : « ${c.erreur} » donne ${fmt(e)} → ${suite}`);
  });
}

/* ---- rapport ---- */
const parChap = new Map();
for (const p of problemes) {
  const k = `ch${p.chap.n} ${p.chap.id}`;
  if (!parChap.has(k)) parChap.set(k, []);
  parChap.get(k).push(p);
}
for (const [k, ps] of [...parChap].sort((a, b) => a[1][0].chap.n - b[1][0].chap.n)) {
  console.log(`\n== ${k}`);
  for (const p of ps) console.log(`  [${p.niveau}] ${p.adr} — ${p.texte}`);
}
const nFaux = problemes.filter(p => p.niveau === "FAUX").length;
const nMort = problemes.filter(p => p.niveau === "MORT").length;
console.log(`\n${stats.questions} questions numériques, ${stats.diags} diagnostics.`);
console.log(`${stats.verifies} calculs refaits, ${stats.sansCalcul} sans calcul identifiable, ${stats.nonCouverts} non couverts.`);
console.log(`${nFaux} FAUX, ${stats.fenetre} FENÊTRE (valeur juste, fenêtre trop étroite), ${nMort} MORT.`);
process.exitCode = nFaux + nMort + stats.nonCouverts ? 1 : 0;
