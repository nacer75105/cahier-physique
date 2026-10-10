/* =====================================================================
   Balayage de la figure « lewis-pas-a-pas » (ch4, s8) : les 16 entités
   (les 15 du programme, plus BF3) × 6 étapes.

   Recalculé ICI, sans passer par la figure :
   - le nombre d'électrons à placer = somme des électrons de valence MOINS la
     charge (on ajoute pour un anion, on retire pour un cation), et le sens
     de cette correction tel que la lecture l'énonce ;
   - les doublets restant après les liaisons simples, puis zéro ;
   - le schéma final, comparé à une table de schémas attendus écrite ici :
     liaisons et leurs ordres (dont la triple liaison de N2), doublets non
     liants et lacunes par atome (H+ et BF3 ; jamais Na+), électrons autour
     de chaque atome, charge et crochets d'un ion ;
   - chaque calcul affiché (outils/calculs-affiches.mjs) ;
   - les 15 entités du programme (référentiel l. 293-294) sont toutes là ;
   et la mise en page : aucun texte qui déborde ou se chevauche, aucun doublet
   sur un trait de liaison ni sur un autre atome.

   Usage : node outils/balayage-lewis.mjs [--racine=public]
     Code de sortie 1 au moindre défaut, 2 si l'environnement manque.
   ===================================================================== */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { calculsFaux, lireNb } from "./calculs-affiches.mjs";

const arg = n => (process.argv.find(a => a.startsWith("--" + n + "=")) || "").split("=").slice(1).join("=");
const ici = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const racine = path.resolve(arg("racine") || path.join(ici, "..", "public"));
const profil = fs.mkdtempSync(path.join(os.tmpdir(), "balayage-lewis-"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };
const serveur = http.createServer((q, r) => {
  const f = path.join(racine, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "") || "index.html");
  if (!f.startsWith(racine) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" }); fs.createReadStream(f).pipe(r);
});
await new Promise(r => serveur.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${serveur.address().port}/index.html`;
const port = 9339, sleep = ms => new Promise(r => setTimeout(r, ms));
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
for (let i = 0; i < 120 && !(await ev('typeof GOTO === "function"')); i++) await sleep(250);

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


await ev(`window.__plat = function(el){ const c = el.cloneNode(true); c.querySelectorAll(".frac").forEach(f => f.replaceWith(f.children[0].textContent + "/" + f.children[1].textContent)); return c.textContent; };`);

/* ---- les schémas ATTENDUS, écrits ici, sans passer par la figure ----
   atomes dans l'ordre de la figure (le premier est l'atome central) ;
   liaisons : [i, j, ordre] ; lp : doublets non liants par atome ; lac : lacunes par atome */
const VAL = { H: 1, B: 3, C: 4, N: 5, O: 6, F: 7, Na: 1, Al: 3, Cl: 7 };
const ATTENDU = {
  "H2":   { el: ["H", "H"], charge: 0, liaisons: [[0, 1, 1]], lp: [0, 0], lac: [0, 0] },
  "O2":   { el: ["O", "O"], charge: 0, liaisons: [[0, 1, 2]], lp: [2, 2], lac: [0, 0] },
  "N2":   { el: ["N", "N"], charge: 0, liaisons: [[0, 1, 3]], lp: [1, 1], lac: [0, 0] },
  "HCl":  { el: ["Cl", "H"], charge: 0, liaisons: [[0, 1, 1]], lp: [3, 0], lac: [0, 0] },
  "H2O":  { el: ["O", "H", "H"], charge: 0, liaisons: [[0, 1, 1], [0, 2, 1]], lp: [2, 0, 0], lac: [0, 0, 0] },
  "CO2":  { el: ["C", "O", "O"], charge: 0, liaisons: [[0, 1, 2], [0, 2, 2]], lp: [0, 2, 2], lac: [0, 0, 0] },
  "NH3":  { el: ["N", "H", "H", "H"], charge: 0, liaisons: [[0, 1, 1], [0, 2, 1], [0, 3, 1]], lp: [1, 0, 0, 0], lac: [0, 0, 0, 0] },
  "CH4":  { el: ["C", "H", "H", "H", "H"], charge: 0, liaisons: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]], lp: [0, 0, 0, 0, 0], lac: [0, 0, 0, 0, 0] },
  "H+":   { el: ["H"], charge: 1, liaisons: [], lp: [0], lac: [1] },
  "Na+":  { el: ["Na"], charge: 1, liaisons: [], lp: [0], lac: [0] },
  "Cl-":  { el: ["Cl"], charge: -1, liaisons: [], lp: [4], lac: [0] },
  "O2-":  { el: ["O"], charge: -2, liaisons: [], lp: [4], lac: [0] },
  "OH-":  { el: ["O", "H"], charge: -1, liaisons: [[0, 1, 1]], lp: [3, 0], lac: [0, 0] },
  "H3O+": { el: ["O", "H", "H", "H"], charge: 1, liaisons: [[0, 1, 1], [0, 2, 1], [0, 3, 1]], lp: [1, 0, 0, 0], lac: [0, 0, 0, 0] },
  "NH4+": { el: ["N", "H", "H", "H", "H"], charge: 1, liaisons: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]], lp: [0, 0, 0, 0, 0], lac: [0, 0, 0, 0, 0] },
  "BF3":  { el: ["B", "F", "F", "F"], charge: 0, liaisons: [[0, 1, 1], [0, 2, 1], [0, 3, 1]], lp: [0, 3, 3, 3], lac: [1, 0, 0, 0] }
};
const PROGRAMME = ["O2", "H2", "N2", "H2O", "CO2", "NH3", "CH4", "HCl", "H+", "H3O+", "Na+", "NH4+", "Cl-", "OH-", "O2-"];   // référentiel, l. 293-294
const CHG = { "1": "+", "-1": "−", "-2": "2−" };
const defauts = []; let etats = 0;
const ko = s => { if (defauts.length < 80) defauts.push(s); };

await ev(`GOTO({page:"chap", chap:"lewis", onglet:"cours", fiche:null}); new Promise(r => setTimeout(r, 900))`);
const cles = await ev(`(()=>{ const B=[...document.querySelectorAll(".figBoite")].find(b=>b.getAttribute("data-etat")&&JSON.parse(b.getAttribute("data-etat")).modele==="lewis-pas-a-pas"); if(!B) return null;
  return [...B.querySelectorAll(".row button")].filter(x=>!/étape/.test(x.textContent)).map(x=>x.textContent); })()`);
if (!cles) ko("figure lewis-pas-a-pas introuvable dans le ch4");
const vus = new Set();
for (let k = 0; cles && k < cles.length; k++) {
  for (let e = 0; e < 6; e++) {
    const res = await ev(`(()=>{ const B=[...document.querySelectorAll(".figBoite")].find(b=>b.getAttribute("data-etat")&&JSON.parse(b.getAttribute("data-etat")).modele==="lewis-pas-a-pas");
      B.scrollIntoView({block:"center"});
      const bt=[...B.querySelectorAll(".row button")].filter(x=>!/étape/.test(x.textContent));
      bt[${k}].click();
      const suiv=[...B.querySelectorAll("button")].find(x=>/suivante/.test(x.textContent));
      for(let i=0;i<${e};i++) suiv.click();
      const svg=B.querySelector("svg");
      const par=a=>[...svg.querySelectorAll("["+a+"]")];
      const centre=g=>{const r=g.getBoundingClientRect(); return {x:r.left+r.width/2, y:r.top+r.height/2};};
      return {etat:JSON.parse(B.getAttribute("data-etat")),
        doublets:par("data-doublet").map(g=>+g.getAttribute("data-doublet")),
        lacunes:par("data-lacune").map(g=>+g.getAttribute("data-lacune")),
        liaisons:par("data-liaison").map(g=>g.getAttribute("data-liaison")),
        atomes:par("data-atome").map(t=>({k:+t.getAttribute("data-atome"), el:t.textContent, c:centre(t)})),
        points:par("data-doublet").flatMap(g=>[...g.querySelectorAll("circle")].map(c=>({k:+g.getAttribute("data-doublet"), c:centre(c)}))),
        traits:par("data-liaison").flatMap(g=>[...g.querySelectorAll("line")].map(l=>{const r=l.getBoundingClientRect(), M=l.getScreenCTM(); const p=(x,y)=>({x:M.a*x+M.c*y+M.e, y:M.b*x+M.d*y+M.f}); return [p(+l.getAttribute("x1"),+l.getAttribute("y1")), p(+l.getAttribute("x2"),+l.getAttribute("y2"))];})),
        charge:(svg.querySelector("[data-charge]")||{}).textContent||null, crochets:svg.querySelectorAll("path").length,
        lecture:window.__plat(B.querySelector(".figLecture")), note:window.__plat(B.querySelector(".figNote")),
        page:window.__page(B), nan:/NaN|undefined/.test(B.textContent)}; })()`);
    etats++;
    const cle = res.etat.cle, A = ATTENDU[cle], lab = `lewis « ${cle} » étape ${e + 1}`;
    if (!A) { ko(lab + " : entité absente de la table attendue"); continue; }
    vus.add(cle);
    res.page.forEach(d => ko(lab + " : " + d));
    if (res.nan) ko(lab + " : NaN ou undefined affiché");
    calculsFaux(res.lecture).forEach(z => ko(lab + " : " + z));
    calculsFaux(res.note).forEach(z => ko(lab + " : " + z));
    /* les atomes : ceux de la table, dans l'ordre */
    if (res.atomes.map(a => a.el).join() !== A.el.join()) ko(lab + ` : atomes ${res.atomes.map(a => a.el)}, attendu ${A.el}`);
    /* le comptage, recalculé ici : somme des valences, MOINS la charge (on ajoute pour un anion, on retire pour un cation) */
    const somme = A.el.reduce((s, x) => s + VAL[x], 0), total = somme - A.charge, paires = total / 2;
    if (res.etat.total !== total || res.etat.paires !== paires) ko(lab + ` : la figure compte ${res.etat.total} électrons / ${res.etat.paires} doublets, attendu ${total} / ${paires}`);
    if (e === 0) {
      if (!res.lecture.includes(`= ${total} électrons`) && !(A.el.length === 1 && !A.charge)) ko(lab + ` : la lecture n'annonce pas ${total} électrons : « ${res.lecture} »`);
      if (A.charge < 0 && !/on ajoute/.test(res.lecture)) ko(lab + " : ion négatif, la lecture ne dit pas qu'on AJOUTE les électrons gagnés");
      if (A.charge > 0 && !/on retire/.test(res.lecture)) ko(lab + " : ion positif, la lecture ne dit pas qu'on RETIRE les électrons perdus");
      if (A.charge < 0 && /on retire/.test(res.lecture) || A.charge > 0 && /on ajoute/.test(res.lecture)) ko(lab + " : le sens de la correction de charge est inversé");
    }
    const nl = A.liaisons.length;
    if (e === 2 && res.etat.reste !== paires - nl) ko(lab + ` : il reste ${res.etat.reste} doublets, attendu ${paires} − ${nl} = ${paires - nl}`);
    if (e >= 3 && res.etat.reste !== 0) ko(lab + ` : ${res.etat.reste} doublets restent à placer après l'étape 4`);
    /* le schéma final : liaisons et leurs ordres, doublets, lacunes, charge, crochets */
    if (e === 5) {
      const lia = res.liaisons.slice().sort().join(" "), att = A.liaisons.map(([i, j, o]) => `${i}-${j}:${o}`).sort().join(" ");
      if (lia !== att) ko(lab + ` : liaisons ${lia || "aucune"}, attendu ${att || "aucune"}`);
      const lp = A.el.map((_, i) => res.doublets.filter(x => x === i).length), lac = A.el.map((_, i) => res.lacunes.filter(x => x === i).length);
      if (lp.join() !== A.lp.join()) ko(lab + ` : doublets non liants par atome ${lp}, attendu ${A.lp}`);
      if (lac.join() !== A.lac.join()) ko(lab + ` : lacunes par atome ${lac}, attendu ${A.lac}`);
      /* octets recomptés ici, et bilan de la figure */
      A.el.forEach((x, i) => {
        const e2 = 2 * A.liaisons.filter(l => l[0] === i || l[1] === i).reduce((s, l) => s + l[2], 0) + 2 * A.lp[i];
        const b = res.etat.bilan && res.etat.bilan[i];
        if (!b || b.electrons !== e2) ko(lab + ` : atome ${i + 1} (${x}) : la figure compte ${b && b.electrons} électrons, attendu ${e2}`);
      });
      if (A.charge) {
        if (res.charge !== CHG[String(A.charge)]) ko(lab + ` : charge affichée « ${res.charge} », attendu « ${CHG[String(A.charge)]} »`);
        if (res.crochets < 2) ko(lab + " : ion sans crochets");
      } else if (res.charge) ko(lab + " : charge affichée sur une molécule neutre");
      if (A.lac.some(x => x) && !/lacune/.test(res.lecture)) ko(lab + " : la lecture ne nomme pas la lacune");
      if (cle === "Na+" && /lacune/.test(res.lecture)) ko(lab + " : Na⁺ présenté avec une lacune");
    }
    /* mise en page : un point de doublet ne tombe ni sur un trait de liaison, ni sur un autre atome */
    for (const p of res.points) {
      for (const [a, b] of res.traits) {
        const dx = b.x - a.x, dy = b.y - a.y, L2 = dx * dx + dy * dy, t = Math.max(0, Math.min(1, ((p.c.x - a.x) * dx + (p.c.y - a.y) * dy) / L2));
        if (Math.hypot(p.c.x - (a.x + t * dx), p.c.y - (a.y + t * dy)) < 4) { ko(lab + ` : un doublet de l'atome ${p.k + 1} touche un trait de liaison`); break; }
      }
      for (const a of res.atomes) if (a.k !== p.k && Math.hypot(p.c.x - a.c.x, p.c.y - a.c.y) < 14) ko(lab + ` : un doublet de l'atome ${p.k + 1} empiète sur l'atome ${a.k + 1}`);
    }
  }
}
/* hors plafond : une entité du programme absente doit toujours être dite */
PROGRAMME.forEach(c => { if (!vus.has(c)) defauts.push(`entité du programme absente de la figure : ${c}`); });

ws.close(); chrome.kill(); serveur.close();
try { fs.rmSync(profil, { recursive: true, force: true }); } catch {}
for (const d of defauts) console.log("  " + d);
for (const e of erreurs) console.log("  console : " + e);
console.log(`${etats} états balayés, ${defauts.length} défauts, ${erreurs.length} erreurs de console.`);
process.exit(defauts.length || erreurs.length ? 1 : 0);
