/* =====================================================================
   Contrôle des scripts Python du cahier — le « balayage » du code.

   Chaque script ({t:"code", x, sortie} dans un cours, ou exercice portant
   `code` et `sortie`) est EXÉCUTÉ avec Python, et sa sortie comparée,
   caractère par caractère (fins de ligne normalisées, espaces de fin
   ignorés), à celle que le cours affiche ou que l'exercice attend. Un script
   qui plante, qui écrit sur la sortie d'erreur ou dont la sortie diffère fait
   échouer le contrôle : le cours ne peut pas mentir sur ce que Python affiche.

   Exercices : un QCM marqué `lignes:true` (« que va afficher ce script ? »)
   doit avoir pour bonne réponse une ligne réellement affichée, et aucun autre
   choix ne doit l'être ; un exercice numérique marqué `repDansSortie:true`
   doit avoir sa réponse parmi les nombres affichés.

   NIVEAU DE CODE (décision de l'utilisatrice, 2026-10-14 : « du Python de
   1re, pas d'informaticien ») : ni `def`, ni `import`, ni `lambda`, ni
   `class`, ni liste en compréhension, ni `append` ; au plus une boucle et au
   plus une structure `if` (ses `elif`/`else` comptent avec elle).

   Usage : node outils/verifier-scripts.mjs   (code 1 au moindre défaut,
   2 si Python manque). Obligatoire pour tout script ajouté au cahier.
   ===================================================================== */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { spawnSync } from "node:child_process";

const APP = "public/app";
const ctx = { window: {} }; vm.createContext(ctx);
for (const f of fs.readdirSync(APP).filter(x => /^03-cours-.*\.js$/.test(x)))
  vm.runInContext(fs.readFileSync(path.join(APP, f), "utf8"), ctx, { filename: f });
const COURS = ctx.window.COURS;

const PY = process.env.PYTHON || "python";
const essai = spawnSync(PY, ["--version"], { encoding: "utf8" });
if (essai.status !== 0) { console.error("Python introuvable (" + PY + ")"); process.exit(2); }

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "scripts-"));
const norm = s => String(s).replace(/\r\n/g, "\n").split("\n").map(l => l.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "");
let n = 0; const defauts = [];
const ko = s => defauts.push(s);

function executer(code) {
  const f = path.join(tmp, "s" + (++n) + ".py");
  fs.writeFileSync(f, code, "utf8");
  const r = spawnSync(PY, ["-I", "-X", "utf8", f], { encoding: "utf8", timeout: 10000,
    env: { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" } });
  return { sortie: norm(r.stdout || ""), erreur: (r.stderr || "").trim(), code: r.status };
}

function niveau(code, lab) {
  const lignes = code.split("\n").map(l => l.replace(/#.*$/, ""));
  const texte = lignes.join("\n");
  [[/\bdef\s/, "fonction def"], [/\bimport\b/, "import"], [/\blambda\b/, "lambda"], [/\bclass\s/, "class"],
   [/\[[^\]\n]*\bfor\b[^\]\n]*\]/, "liste en compréhension"], [/\.append\(/, "append"]].forEach(([re, nom]) => {
    if (re.test(texte)) ko(`${lab} : niveau de code — ${nom} interdit`); });
  const boucles = lignes.filter(l => /^\s*(for|while)\b/.test(l)).length;
  const si = lignes.filter(l => /^\s*if\b/.test(l)).length;
  if (boucles > 1) ko(`${lab} : niveau de code — ${boucles} boucles (une au plus)`);
  if (si > 1) ko(`${lab} : niveau de code — ${si} structures if (une au plus)`);
  if (!/#/.test(code)) ko(`${lab} : aucun commentaire`);
}

function controler(code, attendu, lab) {
  niveau(code, lab);
  const r = executer(code);
  if (r.code !== 0 || r.erreur) { ko(`${lab} : le script plante (code ${r.code}) : ${r.erreur.split("\n").slice(-1)[0]}`); return null; }
  if (attendu == null) { ko(`${lab} : aucune sortie attendue n'est écrite (champ sortie)`); return r.sortie; }
  if (r.sortie !== norm(attendu)) {
    const a = r.sortie.split("\n"), b = norm(attendu).split("\n"), i = a.findIndex((l, k) => l !== b[k]);
    ko(`${lab} : sortie différente, ligne ${i + 1} — Python affiche « ${a[i] ?? "(rien)"} », le cours écrit « ${b[i] ?? "(rien)"} »`);
  }
  return r.sortie;
}

let nbScripts = 0;
for (const c of COURS) {
  c.sections.forEach(s => s.blocs.forEach((b, k) => {
    if (b.t !== "code") return;
    nbScripts++; controler(b.x, b.sortie, `ch${c.n} ${c.id}:${s.id} bloc ${k + 1}`);
  }));
  c.exos.forEach(e => {
    if (!e.code) return;
    nbScripts++; const lab = `ch${c.n} ${c.id}:${e.id}`;
    const sortie = controler(e.code, e.sortie, lab);
    if (sortie == null) return;
    const lignes = sortie.split("\n").map(l => l.trim());
    if (e.lignes) {
      if (e.type !== "qcm") ko(`${lab} : lignes:true sur un exercice qui n'est pas un QCM`);
      else e.choix.forEach((ch, i) => { const est = lignes.includes(ch.trim());
        if (i === e.bonne && !est) ko(`${lab} : la bonne réponse « ${ch} » n'est pas une ligne affichée`);
        if (i !== e.bonne && est) ko(`${lab} : le choix faux « ${ch} » est aussi une ligne affichée`); });
    }
    if (e.repDansSortie) {
      const nombres = (sortie.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
      if (!nombres.some(v => Math.abs(v - e.rep) <= (e.tol ?? 0))) ko(`${lab} : la réponse ${e.rep} n'apparaît pas dans la sortie`);
    }
  });
}

try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
for (const d of defauts) console.log("  " + d);
console.log(`${nbScripts} scripts exécutés, ${defauts.length} défauts.`);
process.exit(defauts.length ? 1 : 0);
