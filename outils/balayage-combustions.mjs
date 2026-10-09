/* =====================================================================
   Balayage des figures du ch18 « L'énergie des combustions ».

   « combustion » : les 6 combustibles × 5 étapes. Les coefficients de
   chaque étape et les comptes d'atomes sont RECALCULÉS ici, sans passer
   par 02-figures.js ; l'équation affichée doit porter ces coefficients ;
   à la dernière étape, elle doit être équilibrée, en nombres entiers.
   « bilan-liaisons » : les 4 combustibles. Rompues, formées et Er sont
   recalculées ici à partir de la table (LibreTexts, C=O dans CO2 = 799) ;
   les hauteurs RÉELLEMENT AFFICHÉES des trois barres (rupture, formation,
   bilan) doivent être proportionnelles à ces énergies, à 1 px près, et les
   barres doivent joindre les niveaux qu'elles relient. C'est elle qui fait
   comprendre le signe : elle doit être exacte.
   Partout : aucun texte qui déborde, se chevauche ou qu'un trait traverse ;
   lecture et note cohérentes avec le dessin.

   Usage : node outils/balayage-combustions.mjs [--racine=public]
     Il sert lui-même le dossier et lance Chrome (variable CHROME sinon).
     Code de sortie 1 au moindre défaut, 2 si l'environnement manque.
   ===================================================================== */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { calculsFaux } from "./calculs-affiches.mjs";

const arg = n => (process.argv.find(a => a.startsWith("--" + n + "=")) || "").split("=").slice(1).join("=");
const ici = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const racine = path.resolve(arg("racine") || path.join(ici, "..", "public"));
const profil = fs.mkdtempSync(path.join(os.tmpdir(), "balayage-combustions-"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };
const serveur = http.createServer((q, r) => {
  const f = path.join(racine, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "") || "index.html");
  if (!f.startsWith(racine) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" }); fs.createReadStream(f).pipe(r);
});
await new Promise(r => serveur.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${serveur.address().port}/index.html`;
const port = 9335, sleep = ms => new Promise(r => setTimeout(r, ms));
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
if (!fs.existsSync(CHROME)) { console.error("Chrome introuvable : " + CHROME); process.exit(2); }
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profil}`, "--window-size=1100,1400", "--no-first-run", "about:blank"], { stdio: "ignore" });
let cibles;
for (let i = 0; i < 200; i++) { try { cibles = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (cibles.length) break; } catch {} await sleep(200); }
if (!cibles) { console.error("Chrome ne répond pas"); process.exit(2); }
const ws = new WebSocket(cibles.find(c => c.type === "page").webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener("open", r));
let id = 0; const att = new Map(), erreurs = [];
ws.addEventListener("message", ev => { const m = JSON.parse(ev.data);
  if (m.id && att.has(m.id)) { att.get(m.id)(m); att.delete(m.id); }
  else if (m.method === "Runtime.exceptionThrown") erreurs.push("EXCEPTION " + JSON.stringify(m.params.exceptionDetails).slice(0, 300));
  else if (m.method === "Runtime.consoleAPICalled" && /error|warn/.test(m.params.type)) erreurs.push(m.params.type + " " + m.params.args.map(a => a.value ?? a.description).join(" ").slice(0, 300)); });
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; att.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => { const r = await cmd("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 600)); return r.result.result.value; };
await cmd("Runtime.enable"); await cmd("Page.enable"); await cmd("Network.setCacheDisabled", { cacheDisabled: true });
await cmd("Emulation.setDeviceMetricsOverride", { width: 1100, height: 1400, deviceScaleFactor: 1, mobile: false });
await cmd("Page.navigate", { url }); await sleep(1500);
for (let i = 0; i < 60 && !(await ev('typeof GOTO === "function"')); i++) await sleep(250);
await ev(`GOTO({page:"chap", chap:"combustions", onglet:"cours", fiche:null}); new Promise(r => setTimeout(r, 900))`);

/* ---- recalcul indépendant ---- */
const T = { CH: 413, CC: 347, CO: 358, OH: 467, OO: 495, CdO: 799 };
const COMB = {
  "méthane":  { C: 1, H: 4,  O: 0, l: { CH: 4 } },
  "propane":  { C: 3, H: 8,  O: 0, l: { CH: 8, CC: 2 } },
  "butane":   { C: 4, H: 10, O: 0, l: { CH: 10, CC: 3 } },
  "pentane":  { C: 5, H: 12, O: 0, l: { CH: 12, CC: 4 } },
  "octane":   { C: 8, H: 18, O: 0, l: { CH: 18, CC: 7 } },
  "méthanol": { C: 1, H: 4,  O: 1, l: { CH: 3, CO: 1, OH: 1 } },
  "éthanol":  { C: 2, H: 6,  O: 1, l: { CH: 5, CC: 1, CO: 1, OH: 1 } }
};
const ordre = ["méthane", "propane", "butane", "octane", "méthanol", "éthanol"], bilanOrdre = ["méthane", "propane", "pentane", "éthanol"];
const coefs = (nom, e) => { const c = COMB[nom], o2 = (2 * c.C + c.H / 2 - c.O) / 2;
  let k = { f: 1, o2: 1, co2: 1, h2o: 1 };
  if (e >= 1) k.co2 = c.C; if (e >= 2) k.h2o = c.H / 2; if (e >= 3) k.o2 = o2;
  if (e >= 4 && o2 % 1) k = { f: 2, o2: 2 * o2, co2: 2 * c.C, h2o: c.H };
  return k; };
const bilan = nom => { const c = COMB[nom], o2 = (2 * c.C + c.H / 2 - c.O) / 2; let R = o2 * T.OO; for (const k in c.l) R += c.l[k] * T[k];
  const F = 2 * c.C * T.CdO + c.H * T.OH; return { R, F, E: R - F }; };
const millier = x => { const a = Math.abs(Math.round(x)); let s = String(a); if (a >= 1000) s = s.replace(/(\d)(?=(\d{3})+$)/, "$1 "); return (x < 0 ? "−" : "") + s; };

/* ---- contrôles de mise en page, dans la page ---- */
await ev(`window.__plat = function(el){ const c = el.cloneNode(true); c.querySelectorAll(".frac").forEach(f => f.replaceWith(f.children[0].textContent + "/" + f.children[1].textContent)); return c.textContent; };`);
await ev(`window.__page = function(B){
  const svg = B.querySelector("svg"), d = [];
  if (!svg) return d;
  const cadre = svg.getBoundingClientRect(), M = svg.getScreenCTM();
  const textes = [...svg.querySelectorAll("text")].map(t => ({t: t.textContent, r: t.getBoundingClientRect()}));
  textes.forEach(x => { if (x.r.left < cadre.left - .5 || x.r.right > cadre.right + .5 || x.r.top < cadre.top - .5 || x.r.bottom > cadre.bottom + .5) d.push("« " + x.t + " » déborde"); });
  for (let i = 0; i < textes.length; i++) for (let j = i + 1; j < textes.length; j++) { const a = textes[i].r, b = textes[j].r;
    if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) d.push("« " + textes[i].t + " » chevauche « " + textes[j].t + " »"); }
  const ec = (x, y) => ({x: M.a*x + M.c*y + M.e, y: M.b*x + M.d*y + M.f});
  [...svg.querySelectorAll("line")].forEach(l => { const p1 = ec(+l.getAttribute("x1"), +l.getAttribute("y1")), p2 = ec(+l.getAttribute("x2"), +l.getAttribute("y2"));
    const L = Math.hypot(p2.x - p1.x, p2.y - p1.y), ep = (+l.getAttribute("stroke-width") || 1)/2;
    for (let s = 0; s <= L; s += 2) { const x = p1.x + (p2.x - p1.x)*s/L, y = p1.y + (p2.y - p1.y)*s/L;
      const t = textes.find(z => x > z.r.left && x < z.r.right && y + ep > z.r.top + 1 && y - ep < z.r.bottom - 1);
      if (t) { d.push("un trait traverse « " + t.t + " »"); break; } } });
  [...svg.querySelectorAll("rect[data-barre]")].forEach(r => { const b = r.getBoundingClientRect();
    textes.forEach(x => { if (x.r.left < b.right - 1 && b.left < x.r.right - 1 && x.r.top < b.bottom - 1 && b.top < x.r.bottom - 1) d.push("la barre " + r.getAttribute("data-barre") + " couvre « " + x.t + " »"); }); });
  return d;
};`);

const defauts = []; let etats = 0;
const ko = s => { if (defauts.length < 60) defauts.push(s); };

/* ---- figure « combustion » ---- */
for (let ic = 0; ic < ordre.length; ic++) for (let e = 0; e <= 4; e++) {
  const nom = ordre[ic], k = coefs(nom, e), c = COMB[nom];
  const r = await ev(`(()=>{ const B=[...document.querySelectorAll(".figBoite")].find(b=>b.getAttribute("data-etat")&&JSON.parse(b.getAttribute("data-etat")).modele==="combustion");
    B.querySelector(".row").querySelectorAll("button")[${ic}].click(); const i=B.querySelector("input[type=range]"); i.value=${e}; i.dispatchEvent(new Event("input"));
    return {etat: JSON.parse(B.getAttribute("data-etat")), eq: window.__plat(B.querySelector(".figLecture")), note: window.__plat(B.querySelector(".figNote")),
      lignes: [...B.querySelectorAll("tbody tr")].map(t=>t.textContent), nan: /NaN|undefined/.test(B.textContent)}; })()`);
  etats++; const lab = `combustion ${nom} étape ${e}`;
  if (r.nan) ko(lab + " : NaN/undefined");
  if (r.etat.combustible !== nom || r.etat.etape !== e) ko(lab + " : état « " + r.etat.combustible + " " + r.etat.etape + " »");
  for (const x of ["f", "o2", "co2", "h2o"]) if (Math.abs(r.etat.k[x] - k[x]) > 1e-9) ko(lab + ` : coefficient ${x} = ${r.etat.k[x]}, attendu ${k[x]}`);
  const g = { C: k.f * c.C, H: k.f * c.H, O: k.f * c.O + 2 * k.o2 }, d = { C: k.co2, H: 2 * k.h2o, O: 2 * k.co2 + k.h2o };
  for (const x of ["C", "H", "O"]) {
    if (Math.abs(r.etat.gauche[x] - g[x]) > 1e-9 || Math.abs(r.etat.droite[x] - d[x]) > 1e-9) ko(lab + ` : atomes ${x} ${r.etat.gauche[x]}/${r.etat.droite[x]}, attendu ${g[x]}/${d[x]}`);
    const p = r.etat.postes.find(q => q.el === x), des = { C: 1, H: 2, O: 3 }[x];
    const attendu = des > e ? "avenir" : (Math.abs(g[x] - d[x]) < 1e-9 ? "ok" : "ko");
    if (!p || p.affiche !== attendu) ko(lab + ` : ligne ${x} affichée « ${p && p.affiche} », attendu « ${attendu} »`);
    if (des <= e && attendu !== "ok") ko(lab + ` : les atomes ${x} devraient être équilibrés à cette étape`);
  }
  /* les nombres de l'équation affichée : 2 et 13 pour le butane à l'étape 4, etc. */
  const nb = x => x === 1 ? "" : (x % 1 ? "" : String(x));
  const eqn = r.eq.replace(/\s/g, "");
  for (const [x, f] of [["o2", "O2"], ["co2", "CO2"], ["h2o", "H2O"]]) if (k[x] % 1 === 0 && k[x] !== 1 && !eqn.includes(nb(k[x]) + f)) ko(lab + ` : l'équation « ${r.eq} » ne porte pas ${k[x]} ${f}`);
  if (e === 4) { if ([k.f, k.o2, k.co2, k.h2o].some(x => x % 1)) ko(lab + " : nombres non entiers à la dernière étape");
    if (g.C !== d.C || g.H !== d.H || g.O !== d.O) ko(lab + " : équation finale non équilibrée"); }
  if (r.lignes.length !== 3) ko(lab + " : " + r.lignes.length + " lignes au tableau");
  if (!r.note.trim()) ko(lab + " : note vide");
  for (const t of [r.eq, r.note]) calculsFaux(t).forEach(d => ko(lab + " : " + d));
}

/* ---- figure « bilan-liaisons » ---- */
for (let ic = 0; ic < bilanOrdre.length; ic++) {
  const nom = bilanOrdre[ic], B = bilan(nom);
  const r = await ev(`(()=>{ const B=[...document.querySelectorAll(".figBoite")].find(b=>b.getAttribute("data-etat")&&JSON.parse(b.getAttribute("data-etat")).modele==="bilan-liaisons");
    B.querySelector(".row").querySelectorAll("button")[${ic}].click(); B.scrollIntoView({block:"center"});
    const svg=B.querySelector("svg"), h=n=>{const r=svg.querySelector('rect[data-barre="'+n+'"]').getBoundingClientRect();return {h:r.height,top:r.top,bas:r.bottom};};
    const niv=[...svg.querySelectorAll("line")].filter(l=>+l.getAttribute("stroke-width")===3).map(l=>l.getBoundingClientRect().top+l.getBoundingClientRect().height/2);
    return {etat: JSON.parse(B.getAttribute("data-etat")), rupture:h("rupture"), formation:h("formation"), bilan:h("bilan"), niveaux:niv,
      textes:[...svg.querySelectorAll("text")].map(t=>t.textContent), pointes:[...svg.querySelectorAll("polygon")].map(p=>{const b=p.getBoundingClientRect();return {haut:b.top,bas:b.bottom};}), lecture:window.__plat(B.querySelector(".figLecture")), note:window.__plat(B.querySelector(".figNote")),
      page: window.__page(B), nan: /NaN|undefined/.test(B.textContent)}; })()`);
  etats++; const lab = `bilan-liaisons ${nom}`;
  r.page.forEach(d => ko(lab + " : " + d)); if (r.nan) ko(lab + " : NaN/undefined");
  if (Math.abs(r.etat.R - B.R) > 1e-6 || Math.abs(r.etat.F - B.F) > 1e-6) ko(lab + ` : la figure calcule R=${r.etat.R}, F=${r.etat.F} ; attendu R=${B.R}, F=${B.F}`);
  /* proportionnalité des hauteurs AFFICHÉES : une seule échelle pour les trois barres */
  const k = r.formation.h / B.F;
  if (Math.abs(r.rupture.h - k * B.R) > 1) ko(lab + ` : barre de rupture ${r.rupture.h.toFixed(1)} px, attendu ${(k * B.R).toFixed(1)} (proportionnelle à ${B.R} kJ)`);
  if (Math.abs(r.bilan.h - k * Math.abs(B.E)) > 1) ko(lab + ` : barre du bilan ${r.bilan.h.toFixed(1)} px, attendu ${(k * Math.abs(B.E)).toFixed(1)} (proportionnelle à ${Math.abs(B.E)} kJ)`);
  /* les barres joignent les niveaux : rupture des réactifs aux atomes, formation des atomes aux produits, bilan des réactifs aux produits */
  const [yR, yA, yP] = r.niveaux;
  const pres = (a, b) => Math.abs(a - b) <= 1.5;
  if (!(pres(r.rupture.top, yA) && pres(r.rupture.bas, yR))) ko(lab + " : la barre de rupture ne relie pas les réactifs aux atomes séparés");
  if (!(pres(r.formation.top, yA) && pres(r.formation.bas, yP))) ko(lab + " : la barre de formation ne relie pas les atomes séparés aux produits");
  if (!(pres(r.bilan.top, yR) && pres(r.bilan.bas, yP))) ko(lab + " : la barre du bilan ne relie pas les réactifs aux produits");
  if (!(yP > yR && yR > yA)) ko(lab + " : ordre des niveaux faux (produits sous les réactifs, atomes au-dessus)");
  for (const s of ["+" + millier(B.R) + " kJ", "−" + millier(B.F) + " kJ", "Er = " + millier(B.E) + " kJ/mol", "énergie stockée dans les molécules ↑"]) if (!r.textes.includes(s)) ko(lab + ` : libellé « ${s} » absent`);
  /* les pointes : rouge en haut de la rupture (elle monte), verte en bas de la formation (elle descend) */
  if (!r.pointes || r.pointes.length !== 2) ko(lab + " : " + (r.pointes ? r.pointes.length : 0) + " pointes de flèche au lieu de 2");
  else { const [pr, pv] = r.pointes;
    if (!(Math.abs(pr.haut - yA) <= 2)) ko(lab + " : la pointe rouge n'est pas en haut de la barre de rupture");
    if (!(Math.abs(pv.bas - yP) <= 2)) ko(lab + " : la pointe verte n'est pas en bas de la barre de formation"); }
  if (!r.lecture.includes("= " + millier(B.E) + " kJ/mol")) ko(lab + " : lecture « " + r.lecture + " »");
  if (!/négatif/.test(r.note) || B.E >= 0) ko(lab + " : la note ne dit pas que Er est négatif");
  for (const t of [r.lecture, r.note, ...r.textes]) calculsFaux(t).forEach(d => ko(lab + " : " + d));
}

ws.close(); chrome.kill(); serveur.close();
try { fs.rmSync(profil, { recursive: true, force: true }); } catch {}
for (const d of defauts) console.log("  " + d);
for (const e of erreurs) console.log("  console : " + e);
console.log(`${etats} états balayés, ${defauts.length} défauts, ${erreurs.length} erreurs de console.`);
process.exit(defauts.length || erreurs.length ? 1 : 0);
