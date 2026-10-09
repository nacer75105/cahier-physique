/* =====================================================================
   Balayage de la figure « source-reelle » (ch10, la source réelle de tension).

   3 sources × 11 charges (à vide … court-circuit). I = E/(R + r) et
   U = E − rI sont RECALCULÉS ici ; la barre E = U + rI doit être partagée
   en longueurs AFFICHÉES proportionnelles (à 1 px près), le point doit être
   sur la caractéristique, à (I ; U), et la lecture et la note doivent dire
   le cas affiché (à vide : U = E ; court-circuit : U = 0, I = E/r).
   Anciennement (ch18) :

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

   Usage : node outils/balayage-source-reelle.mjs [--racine=public]
     Il sert lui-même le dossier et lance Chrome (variable CHROME sinon).
     Code de sortie 1 au moindre défaut, 2 si l'environnement manque.
   ===================================================================== */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";

const arg = n => (process.argv.find(a => a.startsWith("--" + n + "=")) || "").split("=").slice(1).join("=");
const ici = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const racine = path.resolve(arg("racine") || path.join(ici, "..", "public"));
const profil = fs.mkdtempSync(path.join(os.tmpdir(), "balayage-source-"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };
const serveur = http.createServer((q, r) => {
  const f = path.join(racine, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "") || "index.html");
  if (!f.startsWith(racine) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" }); fs.createReadStream(f).pipe(r);
});
await new Promise(r => serveur.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${serveur.address().port}/index.html`;
const port = 9336, sleep = ms => new Promise(r => setTimeout(r, ms));
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
await ev(`GOTO({page:"chap", chap:"electrique", onglet:"cours", fiche:null}); new Promise(r => setTimeout(r, 900))`);

/* ---- contrôles de mise en page, dans la page ---- */
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

/* ---- recalcul indépendant ---- */
const SOURCES = [{E: 4.7, r: 1.3}, {E: 9.4, r: 2.0}, {E: 12.6, r: 0.02}];
const CHARGES = [Infinity, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0];
const defauts = []; let etats = 0;
const ko = s => { if (defauts.length < 60) defauts.push(s); };
for (let is = 0; is < 3; is++) for (let ir = 0; ir < CHARGES.length; ir++) {
  const { E, r } = SOURCES[is], R = CHARGES[ir], I = R === Infinity ? 0 : E / (R + r), U = E - r * I, Icc = E / r;
  const res = await ev(`(()=>{ const B=[...document.querySelectorAll(".figBoite")].find(b=>b.getAttribute("data-etat")&&JSON.parse(b.getAttribute("data-etat")).modele==="source-reelle");
    B.querySelectorAll(".row button")[${is}].click(); const c=B.querySelector("input[type=range]"); c.value=${ir}; c.dispatchEvent(new Event("input")); B.scrollIntoView({block:"center"});
    const svg=B.querySelector("svg"), M=svg.getScreenCTM(), ec=(x,y)=>({x:M.a*x+M.c*y+M.e, y:M.b*x+M.d*y+M.f});
    const larg=n=>svg.querySelector('rect[data-barre="'+n+'"]').getBoundingClientRect().width;
    const cadre=[...svg.querySelectorAll("rect")].find(x=>x.getAttribute("fill")==="none"&&+x.getAttribute("width")===180).getBoundingClientRect().width;
    const p=svg.querySelector("circle[data-point]").getBoundingClientRect(), droite=[...svg.querySelectorAll("line")].find(l=>/bleu/.test(l.getAttribute("stroke"))&&+l.getAttribute("stroke-width")===2);
    const d1=ec(+droite.getAttribute("x1"),+droite.getAttribute("y1")), d2=ec(+droite.getAttribute("x2"),+droite.getAttribute("y2"));
    return {etat:JSON.parse(B.getAttribute("data-etat")), lU:larg("U"), lr:larg("rI"), L:cadre, pt:{x:p.left+p.width/2, y:p.top+p.height/2}, d1, d2,
      lecture:B.querySelector(".figLecture").textContent, note:B.querySelector(".figNote").textContent, page:window.__page(B), nan:/NaN|undefined|Infinity/.test(B.textContent)}; })()`);
  etats++; const lab = `source ${is} charge ${R === Infinity ? "à vide" : R === 0 ? "court-circuit" : R + " Ω"}`;
  res.page.forEach(d => ko(lab + " : " + d)); if (res.nan) ko(lab + " : NaN/undefined/Infinity affiché");
  if (Math.abs(res.etat.I - I) > 1e-9 || Math.abs(res.etat.U - U) > 1e-9) ko(lab + ` : la figure calcule I=${res.etat.I}, U=${res.etat.U} ; attendu I=${I}, U=${U}`);
  /* la barre : U et rI proportionnels à E, et leur somme remplit le cadre */
  if (Math.abs(res.lU - res.L * U / E) > 1) ko(lab + ` : barre U ${res.lU.toFixed(1)} px, attendu ${(res.L * U / E).toFixed(1)}`);
  if (Math.abs(res.lr - res.L * r * I / E) > 1) ko(lab + ` : barre rI ${res.lr.toFixed(1)} px, attendu ${(res.L * r * I / E).toFixed(1)}`);
  /* le point sur la caractéristique, à (I ; U) */
  const fx = I / Icc, fy = U / E, attx = res.d1.x + fx * (res.d2.x - res.d1.x), atty = res.d2.y + fy * (res.d1.y - res.d2.y);
  if (Math.abs(res.pt.x - attx) > 1 || Math.abs(res.pt.y - atty) > 1) ko(lab + ` : point à (${res.pt.x.toFixed(1)} ; ${res.pt.y.toFixed(1)}), attendu (${attx.toFixed(1)} ; ${atty.toFixed(1)})`);
  if (R === Infinity && !/À vide/.test(res.note)) ko(lab + " : la note ne dit pas « à vide »");
  if (R === 0 && !/Court-circuit/.test(res.note)) ko(lab + " : la note ne dit pas « court-circuit »");
  if (R !== Infinity && R !== 0 && !/fatigue/.test(res.note)) ko(lab + " : la note n'explique pas la baisse de U");
  const fmt = x => { const a = Math.abs(x); return String(+x.toFixed(a >= 100 ? 0 : a >= 10 ? 1 : 2)).replace(".", ","); };
  if (!res.lecture.includes("= " + fmt(U) + " V")) ko(lab + " : lecture « " + res.lecture + " », attendu U = " + fmt(U));
}

ws.close(); chrome.kill(); serveur.close();
try { fs.rmSync(profil, { recursive: true, force: true }); } catch {}
for (const d of defauts) console.log("  " + d);
for (const e of erreurs) console.log("  console : " + e);
console.log(`${etats} états balayés, ${defauts.length} défauts, ${erreurs.length} erreurs de console.`);
process.exit(defauts.length || erreurs.length ? 1 : 0);
