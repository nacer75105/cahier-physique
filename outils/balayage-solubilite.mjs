/* =====================================================================
   Balayage des solubilités du ch5 : section s9 « Solvants purs ou en
   mélange », valeurs de la caféine en s4, exercices co25 à co27.

   Valeurs : chaque solubilité, densité et miscibilité affichée (cours et
   tableaux des exercices) est RECALCULÉE par outils/solubilites/valeurs.py
   depuis les fichiers sources versionnés (ThermoML, tableau de Shalmashi,
   PubChem) ; un nombre affiché doit être l'arrondi correct de la valeur
   calculée, au nombre de décimales affiché ; les recoupements de valeurs.py
   doivent tenir. Un tableau d'exercice qui reprend celui du cours doit lui
   être identique.
   Sens : le solvant retenu dans le cours et dans co27 dissout l'espèce mieux
   que l'eau et n'est pas miscible ; « bas » ou « haut » suit la densité ;
   chaque rapport annoncé (« plus de deux cents fois », « près de quatre
   fois », « plus de cinq fois ») se vérifie sur les nombres affichés.
   Vocabulaire de la mesure à jour dans tout ce qui est neuf (ni « erreur »,
   ni « précis »). Affichage (ordinateur et téléphone) : aucun balisage resté
   brut, pas de débordement en largeur, tableaux des exercices présents,
   calculs affichés justes.

   Usage : node outils/balayage-solubilite.mjs [--racine=public]
     Code de sortie 1 au moindre défaut, 2 si l'environnement manque.
   ===================================================================== */
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import { calculsFaux } from "./calculs-affiches.mjs";

const arg = n => (process.argv.find(a => a.startsWith("--" + n + "=")) || "").split("=").slice(1).join("=");
const ici = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const racine = path.resolve(arg("racine") || path.join(ici, "..", "public"));
const defauts = []; let etats = 0;
const ko = s => { if (defauts.length < 80) defauts.push(s); };

/* ---- les valeurs recalculées depuis les sources ---- */
const PY = process.env.PYTHON || "python";
const r = spawnSync(PY, ["-I", "-X", "utf8", path.join(ici, "solubilites", "valeurs.py")], { encoding: "utf8" });
if (r.error || !r.stdout) { console.error("valeurs.py ne tourne pas : " + (r.error || r.stderr)); process.exit(2); }
const V = JSON.parse(r.stdout);
V.defauts.forEach(d => ko("recoupement : " + d));

/* ---- la source, chargée telle quelle ---- */
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(racine, "app", "03-cours-chimie-2.js"), "utf8"), ctx);
const C = ctx.window.COURS.find(c => c.id === "cohesion");
const sec = id => C.sections.find(s => s.id === id);
const exo = id => C.exos.find(e => e.id === id);
const s9 = sec("s9"), s4 = sec("s4");
if (!s9 || !s4 || !exo("co25") || !exo("co26") || !exo("co27")) { console.error("s9, s4 ou co25-co27 introuvables"); process.exit(2); }

const nombre = c => { const m = String(c).match(/\$(-?[\d]+(?:\{,\}\d+)?)\$/); return m ? { v: +m[1].replace("{,}", "."), dec: (m[1].split("{,}")[1] || "").length } : null; };
const arrondi = (v, dec) => Math.round(v * 10 ** dec + 1e-9) / 10 ** dec;
const verifie = (lab, cellule, attendu) => {
  const n = nombre(cellule);
  if (!n) { ko(`${lab} : aucun nombre lisible dans « ${cellule} »`); return; }
  if (Math.abs(arrondi(attendu, n.dec) - n.v) > 1e-9) ko(`${lab} : affiché ${n.v}, la source donne ${attendu} (arrondi attendu ${arrondi(attendu, n.dec)})`);
};

/* KCl : tableau du cours, et celui de co25 qui doit être le même */
const tKCl = s9.blocs.find(b => b.t === "tbl");
tKCl.rows.forEach(row => {
  const pct = nombre(row[0]).v, e = V.kcl[pct];
  if (!e) { ko(`s9 : pas de valeur source pour ${pct} % d'éthanol`); return; }
  verifie(`s9, KCl à ${pct} %`, row[1], e.g_pour_100g);
});
if (JSON.stringify(exo("co25").tbl) !== JSON.stringify({ head: tKCl.head, rows: tKCl.rows })) ko("co25 : son tableau diffère de celui du cours (s9)");

/* caféine : tableau du cours (s4) et celui de co27 */
const NOMS = { "Eau": "eau", "Dichlorométhane": "dichloromethane", "Éthanol": "ethanol", "Chloroforme": "chloroforme", "Acétone": "acetone" };
const caf = (lab, t) => t.rows.forEach(row => {
  const s = NOMS[row[0]];
  if (!s) { ko(`${lab} : solvant inconnu « ${row[0]} »`); return; }
  verifie(`${lab}, caféine dans ${row[0]}`, row[1], V.cafeine[s].g_pour_100g);
  verifie(`${lab}, densité de ${row[0]}`, row[3], V.solvants[s].d);
  const mis = V.solvants[s].miscible, ecrit = row[2];
  if (mis === null ? ecrit !== "—" : ecrit !== (mis ? "Oui" : "Non")) ko(`${lab} : miscibilité de ${row[0]} écrite « ${ecrit} »`);
});
const tCaf = s4.blocs.find(b => b.t === "tbl" && /Caféine/.test(b.head[1]));
if (!tCaf) ko("s4 : tableau de la caféine introuvable"); else caf("s4", tCaf);
caf("co27", exo("co27").tbl);

/* ---- sens ---- */
const texte = o => JSON.stringify(o);
const neufs = [s9, ...s4.blocs.slice(s4.blocs.findIndex(b => /Avec des valeurs/.test(b.x || "")), s4.blocs.findIndex(b => /Ce que le programme de 1re ne demande pas/.test(b.x || "")) + 1),
  exo("co25"), exo("co26"), exo("co27")];
if (neufs.length < 7) ko("s4 : blocs neufs (de « Avec des valeurs » à « Ce que le programme… ») introuvables");
const tout = neufs.map(texte).join("\n");
for (const mot of [/\berreurs?\b/i, /\bprécis(e|es|ion|ions|ément)?\b/i]) if (mot.test(tout)) ko(`vocabulaire : « ${tout.match(mot)[0]} » dans un bloc neuf`);
/* le solvant retenu : mieux que l'eau, non miscible, et la bonne phase */
const retenus = [["s4", "dichloromethane", texte(s4.blocs.find(b => b.t === "liste" && /dichlorométhane convient/i.test(texte(b))))],
                 ["co27", "chloroforme", exo("co27").choix[exo("co27").bonne]]];
for (const [lab, s, t] of retenus) {
  if (!(V.cafeine[s].g_pour_100g > V.cafeine.eau.g_pour_100g)) ko(`${lab} : ${s} retenu sans dissoudre mieux que l'eau`);
  if (V.solvants[s].miscible !== false) ko(`${lab} : ${s} retenu alors qu'il est miscible`);
  const bas = V.solvants[s].d > 1;
  if (bas !== /\bbas\b/.test(t) || bas === /\bhaut\b/.test(t)) ko(`${lab} : la phase annoncée ne suit pas la densité ${V.solvants[s].d}`);
}
/* les rapports annoncés, sur les nombres affichés */
const lu = (t, s) => nombre(t.rows.find(r => NOMS[r[0]] === s || nombre(r[0])?.v === s)[1]).v;
const rapports = [
  [tout.includes("plus de deux cents fois moins"), lu(tKCl, 0) / lu(tKCl, 90) > 200, "« plus de deux cents fois moins » (KCl, 0 % contre 90 %)"],
  [/près de quatre fois plus/.test(tout), Math.abs(lu(tCaf, "dichloromethane") / lu(tCaf, "eau") - 4) < 0.5, "« près de quatre fois plus » (dichlorométhane)"],
  [/plus de cinq fois plus/.test(tout), lu(exo("co27").tbl, "chloroforme") / lu(exo("co27").tbl, "eau") > 5, "« plus de cinq fois plus » (chloroforme)"],
  [/moins de caféine que l'eau/.test(tout), lu(tCaf, "ethanol") < lu(tCaf, "eau"), "« l'éthanol dissout moins de caféine que l'eau »"],
];
for (const [present, vrai, quoi] of rapports) if (!present) ko(`phrase attendue absente : ${quoi}`); else if (!vrai) ko(`faux : ${quoi}`);
/* la baisse « pas à pas » : la solubilité décroît d'une ligne à l'autre */
tKCl.rows.reduce((p, row) => { const v = nombre(row[1]).v; if (v >= p) ko(`s9 : la solubilité ne décroît pas à ${row[0]}`); return v; }, Infinity);

/* ---- affichage ---- */
const profil = fs.mkdtempSync(path.join(os.tmpdir(), "balayage-solubilite-"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };
const serveur = http.createServer((q, rr) => {
  const f = path.join(racine, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "") || "index.html");
  if (!f.startsWith(racine) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rr.writeHead(404); rr.end(); return; }
  rr.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" }); fs.createReadStream(f).pipe(rr);
});
await new Promise(res => serveur.listen(0, "127.0.0.1", res));
const url = `http://127.0.0.1:${serveur.address().port}/index.html`;
const port = 9341, sleep = ms => new Promise(res => setTimeout(res, ms));
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
if (!fs.existsSync(CHROME)) { console.error("Chrome introuvable : " + CHROME); process.exit(2); }
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profil}`, "--window-size=1100,1400", "--no-first-run", "about:blank"], { stdio: "ignore" });
let cibles;
for (let i = 0; i < 200; i++) { try { cibles = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (cibles.length) break; } catch {} await sleep(200); }
if (!cibles) { console.error("Chrome ne répond pas"); process.exit(2); }
const ws = new WebSocket(cibles.find(c => c.type === "page").webSocketDebuggerUrl);
await new Promise(res => ws.addEventListener("open", res));
let id = 0; const att = new Map(), erreurs = [];
ws.addEventListener("message", e => { const m = JSON.parse(e.data);
  if (m.id && att.has(m.id)) { att.get(m.id)(m); att.delete(m.id); }
  else if (m.method === "Runtime.exceptionThrown") erreurs.push("EXCEPTION " + JSON.stringify(m.params.exceptionDetails).slice(0, 300));
  else if (m.method === "Runtime.consoleAPICalled" && /error|warn/.test(m.params.type)) erreurs.push(m.params.type + " " + m.params.args.map(a => a.value ?? a.description).join(" ").slice(0, 300)); });
const cmd = (method, params = {}) => new Promise(res => { const i = ++id; att.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => { const x = await cmd("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
  if (x.result.exceptionDetails) throw new Error(JSON.stringify(x.result.exceptionDetails).slice(0, 600)); return x.result.result.value; };
await cmd("Runtime.enable"); await cmd("Page.enable"); await cmd("Network.setCacheDisabled", { cacheDisabled: true });

const ordre = C.sections.map(s => s.id);
for (const largeur of [1100, 400]) {
  await cmd("Emulation.setDeviceMetricsOverride", { width: largeur, height: 1400, deviceScaleFactor: 1, mobile: largeur < 600 });
  await cmd("Page.navigate", { url }); await sleep(1500);
  for (let i = 0; i < 60 && !(await ev('typeof GOTO === "function"')); i++) await sleep(250);
  const ecran = largeur < 600 ? "téléphone" : "ordinateur";
  for (const onglet of ["cours", "exos"]) {
    await ev(`GOTO({page:"chap", chap:"cohesion", onglet:"${onglet}", fiche:null}); new Promise(r => setTimeout(r, 700))`);
    /* les exemples guidés et les checks se déplient : on les ouvre tous */
    await ev(`(async()=>{ for(let k=0;k<12;k++){ const b=[...document.querySelectorAll("#view .demo button")].filter(x=>x.offsetParent); if(!b.length) break; b.forEach(x=>x.click()); await new Promise(r=>setTimeout(r,80)); } })()`);
    const res = await ev(`(()=>{ const v=document.querySelector("#view"), secs=v.querySelectorAll("section");
      const zone = ${JSON.stringify(onglet)}==="cours" ? [secs[${ordre.indexOf("s9")}], secs[${ordre.indexOf("s4")}]] : [v];
      const txt = zone.map(z => { if(!z) return ""; const c=z.cloneNode(true);
        c.querySelectorAll(".frac").forEach(f => f.replaceWith("(" + f.children[0].textContent + ")/(" + f.children[1].textContent + ")")); return c.textContent; });
      const tables = [...v.querySelectorAll(".card table.tbl")].map(t => t.querySelectorAll("tbody tr").length);
      return {txt, tables, larg:document.documentElement.scrollWidth, vue:window.innerWidth, demo:[...v.querySelectorAll(".demo")].map(d=>d.textContent)}; })()`);
    etats++; const lab = `${ecran}, ${onglet}`;
    if (onglet === "cours" && res.txt.some(t => !t)) ko(`${lab} : section s9 ou s4 introuvable à l'écran`);
    const brut = res.txt.join(" ").match(/@[a-z]\{|\{,\}|\$|`/g);
    if (brut) ko(`${lab} : balisage resté brut (${[...new Set(brut)].join(" ")})`);
    if (res.larg > res.vue + 1) ko(`${lab} : la page déborde en largeur (${res.larg} px pour ${res.vue})`);
    if (onglet === "cours") {
      res.txt.forEach(t => calculsFaux(t).forEach(d => ko(`${lab} : ${d}`)));
      const ex = res.demo.find(d => /réapparaître un sel/.test(d));
      if (!ex || !/22,8/.test(ex)) ko(`${lab} : l'exemple guidé du KCl n'affiche pas son résultat une fois déplié`);
      else calculsFaux(ex).forEach(d => ko(`${lab}, exemple guidé : ${d}`));
    } else {
      /* co25 (6 lignes) et co27 (3 lignes) : leurs tableaux sont affichés */
      if (!res.tables.includes(6) || !res.tables.includes(3)) ko(`${lab} : tableaux des exercices co25 / co27 absents (${res.tables.join(", ") || "aucun"})`);
    }
  }
}

ws.close(); chrome.kill(); serveur.close();
try { fs.rmSync(profil, { recursive: true, force: true }); } catch {}
for (const d of defauts) console.log("  " + d);
for (const e of erreurs) console.log("  console : " + e);
console.log(`${etats} états balayés, ${defauts.length} défauts, ${erreurs.length} erreurs de console.`);
process.exit(defauts.length || erreurs.length ? 1 : 0);
