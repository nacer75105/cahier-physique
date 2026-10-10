/* =====================================================================
   Balayage de la figure « molecule-3d » (ch7, s9) : les huit molécules.

   Pour chaque molécule, tout est recalculé ICI, sans passer par la figure :
   - les coordonnées du fichier public/app/molecules/<clé>.mol, relues par un
     lecteur MOL indépendant, doivent être celles que la vue 3D a chargées ;
   - chaque longueur, angle et dièdre de outils/molecules/references.json doit
     se retrouver dans ces coordonnées (0,05 pm, 0,05°, 0,1° pour un dièdre) ;
   - le source_type affiché et la note d'origine de la géométrie doivent être
     ceux de references.json (« Géométrie mesurée » posé sur une géométrie
     calculée est un défaut) ;
   - chaque angle cité dans l'observation doit être un angle réel de la
     molécule, à l'arrondi affiché ;
   - un angle mesuré ne change pas quand on tourne la molécule, et un vrai
     clic sur trois atomes affiche l'angle recalculé ici ;
   - les étiquettes de longueurs et d'angles disent les valeurs recalculées ;
   - aucune requête ne sort de la machine, aucune erreur de console ;
   et la mise en page : aucun texte qui déborde ni ne se chevauche.

   Usage : node outils/balayage-geometrie.mjs [--racine=public]
     Il sert lui-même le dossier et lance Chrome avec un rendu WebGL logiciel
     (SwiftShader). Code de sortie 1 au moindre défaut, 2 si l'environnement manque.
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
const profil = fs.mkdtempSync(path.join(os.tmpdir(), "balayage-geometrie-"));
const TYPES = { ".mol": "chemical/x-mdl-molfile",  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };
const serveur = http.createServer((q, r) => {
  const f = path.join(racine, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "") || "index.html");
  if (!f.startsWith(racine) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" }); fs.createReadStream(f).pipe(r);
});
await new Promise(r => serveur.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${serveur.address().port}/index.html`;
const port = 9338, sleep = ms => new Promise(r => setTimeout(r, ms));
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
if (!fs.existsSync(CHROME)) { console.error("Chrome introuvable : " + CHROME); process.exit(2); }
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profil}`, "--window-size=1100,1400", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--no-first-run", "about:blank"], { stdio: "ignore" });
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
const requetes = []; ws.addEventListener("message", ev => { const m = JSON.parse(ev.data); if (m.method === "Network.requestWillBeSent") requetes.push(m.params.request.url); });
await cmd("Network.enable");
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

/* ---- recalcul indépendant ---- */
const REF = JSON.parse(fs.readFileSync(path.join(racine, "..", "outils", "molecules", "references.json"), "utf8"));
function lireMol(t) {
  const L = t.split(/\r?\n/), na = parseInt(L[3].slice(0, 3)), nl = parseInt(L[3].slice(3, 6));
  const at = []; for (let i = 0; i < na; i++) { const l = L[4 + i]; at.push({ nom: l.slice(31, 34).trim() + (i + 1), x: +l.slice(0, 10), y: +l.slice(10, 20), z: +l.slice(20, 30) }); }
  const li = []; for (let j = 0; j < nl; j++) { const l = L[4 + na + j]; li.push([parseInt(l.slice(0, 3)) - 1, parseInt(l.slice(3, 6)) - 1]); }
  return { at, li };
}
const d3 = (p, q) => Math.hypot(p.x - q.x, p.y - q.y, p.z - q.z);
const ang = (p, c, q) => { const u = [p.x - c.x, p.y - c.y, p.z - c.z], v = [q.x - c.x, q.y - c.y, q.z - c.z];
  return Math.acos(Math.max(-1, Math.min(1, (u[0]*v[0] + u[1]*v[1] + u[2]*v[2]) / (Math.hypot(...u) * Math.hypot(...v))))) * 180 / Math.PI; };
const dih = (p, q, r, s) => { const b1 = [q.x-p.x, q.y-p.y, q.z-p.z], b2 = [r.x-q.x, r.y-q.y, r.z-q.z], b3 = [s.x-r.x, s.y-r.y, s.z-r.z];
  const X = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]], D = (a, b) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const n1 = X(b1, b2), n2 = X(b2, b3), nb = Math.hypot(...b2), m1 = X(n1, b2.map(x => x / nb)); return Math.atan2(D(m1, n2), D(n1, n2)) * 180 / Math.PI; };
/* la note d'origine attendue, par type de source (recopiée ici, pas lue dans la figure) */
const ORIGINE = { mesure_cartesienne: /^Géométrie mesurée en laboratoire/, mesure_parametres: /^Atomes placés pour respecter des longueurs et des angles mesurés/,
  transfert: /^Pas de mesure complète pour cette molécule/, calcule: /^Géométrie calculée par ordinateur, pas mesurée/ };
/* le nom AFFICHÉ d'un atome : « C(1) » (le .mol et references.json disent « C1 ») */
const aff = nom => nom.replace(/^([A-Z][a-z]?)(\d+)$/, "$1($2)");
const defauts = []; let etats = 0;
const ko = s => { if (defauts.length < 80) defauts.push(s); };
const B3D = `document.querySelector("[data-modele=molecule-3d]")`;

await ev(`GOTO({page:"chap", chap:"organique", onglet:"cours", fiche:null}); new Promise(r => setTimeout(r, 900))`);
const cles = await ev(`(()=>{ const B=${B3D}; return B ? window.MOLECULES_3D.map(m=>m.cle) : null; })()`);
if (!cles) ko("figure molecule-3d introuvable dans le ch7");
const vues = new Set();
for (let k = 0; cles && k < cles.length; k++) {
  const cle = cles[k], lab = "molecule-3d « " + cle + " »";
  if (!REF[cle]) { ko(lab + " : absente de references.json"); continue; }
  await ev(`(()=>{ const B=${B3D}; B.scrollIntoView({block:"center"}); B.querySelectorAll(".row button")[${k}].click(); })()`);
  for (let i = 0; i < 80 && !(await ev(`!!(${B3D}.__instance)`)); i++) await sleep(200);
  const res = await ev(`(()=>{ const B=${B3D}, m=B.__instance; if(!m) return null;
    const at=m.viewer.getModel().selectedAtoms({}).map(a=>({x:a.x,y:a.y,z:a.z,el:a.elem}));
    const notes=[...B.querySelectorAll(".figNote")].map(n=>window.__plat(n));
    return {at, cle:B.getAttribute("data-molecule"), type:B.getAttribute("data-source-type"), notes, page:window.__page(B.querySelector(".figBoite")||B),
      nan:/NaN|undefined/.test(B.textContent), canvas:!!B.querySelector("canvas")}; })()`);
  if (!res) { ko(lab + " : la vue 3D ne se monte pas"); continue; }
  etats++;
  const fichier = lireMol(fs.readFileSync(path.join(racine, "app", "molecules", cle + ".mol"), "utf8"));
  const A = fichier.at, R = REF[cle], idx = n => A.findIndex(a => a.nom === n);
  if (res.cle !== cle) ko(lab + " : la figure affiche « " + res.cle + " »");
  if (!res.canvas) ko(lab + " : pas de canvas 3D");
  if (res.nan) ko(lab + " : NaN ou undefined affiché");
  res.page.forEach(d => ko(lab + " : " + d));
  /* les coordonnées chargées sont celles du fichier */
  if (res.at.length !== A.length) ko(lab + ` : ${res.at.length} atomes chargés pour ${A.length} dans le fichier`);
  else res.at.forEach((a, i) => { if (d3(a, A[i]) > 1e-4 || a.el !== A[i].nom.replace(/\d+$/, "")) ko(lab + ` : atome ${A[i].nom} chargé à ${d3(a, A[i]).toFixed(4)} Å de sa place, élément ${a.el}`); });
  vues.add(JSON.stringify(res.at.map(a => [a.x, a.y, a.z])));
  /* les valeurs de references.json se retrouvent dans les coordonnées */
  for (const l of R.liaisons || []) { const v = d3(A[idx(l.atomes[0])], A[idx(l.atomes[1])]) * 100; if (Math.abs(v - l.valeur_pm) > 0.05) ko(lab + ` : ${l.atomes.join("–")} = ${v.toFixed(2)} pm, références ${l.valeur_pm}`); }
  for (const a of R.angles || []) { const v = ang(...a.atomes.map(n => A[idx(n)])); if (Math.abs(v - a.valeur_deg) > 0.05) ko(lab + ` : ${a.atomes.join("–")} = ${v.toFixed(2)}°, références ${a.valeur_deg}`); }
  for (const d of R.diedres || []) { const v = Math.abs(dih(...d.atomes.map(n => A[idx(n)]))); if (Math.abs(v - d.valeur_deg) > 0.1) ko(lab + ` : dièdre ${d.atomes.join("–")} = ${v.toFixed(2)}°, références ${d.valeur_deg}`); }
  /* l'origine de la géométrie : type et note */
  if (res.type !== R.meta.source_type) ko(lab + ` : source_type affiché « ${res.type} », références « ${R.meta.source_type} »`);
  if (!res.notes.some(n => ORIGINE[R.meta.source_type] && ORIGINE[R.meta.source_type].test(n))) ko(lab + " : la note d'origine ne correspond pas au source_type « " + R.meta.source_type + " »");
  /* chaque angle cité dans l'observation est un vrai angle de la molécule */
  const voisins = A.map((_, i) => fichier.li.filter(l => l.includes(i)).map(l => l[0] === i ? l[1] : l[0]));
  const vrais = []; voisins.forEach((v, c) => { for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) vrais.push(ang(A[v[i]], A[c], A[v[j]])); });
  const obs = res.notes.find(n => !Object.values(ORIGINE).some(re => re.test(n))) || "";
  if (!obs) ko(lab + " : pas d'observation sous la vue");
  for (const m of obs.matchAll(/(\d{2,3}(?:,\d+)?)\s*°/g)) {
    const t = m[1], v = lireNb(t), dec = (t.split(",")[1] || "").length;
    if ([90, 120, 180, 360].includes(v) && !t.includes(",") || t === "109,5") continue;   // angles du modèle et tour complet, cités pour comparaison
    if (!vrais.some(x => Math.abs(x - v) <= 0.5 * 10 ** -dec + 1e-9)) ko(lab + ` : l'observation cite ${t}°, qui n'est aucun angle de la molécule`);
  }
  calculsFaux(obs).forEach(z => ko(lab + " : " + z));
  /* rotation : l'angle mesuré ne change pas */
  let tri = null; for (let c = 0; c < A.length && !tri; c++) if (voisins[c].length >= 2) tri = [voisins[c][0], c, voisins[c][1]];
  const attendu = ang(A[tri[0]], A[tri[1]], A[tri[2]]);
  const avant = await ev(`${B3D}.__instance.mesurerAngle(${tri})`);
  await ev(`(()=>{ const m=${B3D}.__instance; m.tourner(71,"x"); m.tourner(-38,"y"); m.tourner(23,"z"); })()`);
  const apres = await ev(`${B3D}.__instance.mesurerAngle(${tri})`);
  if (Math.abs(avant - attendu) > 1e-6 || Math.abs(apres - attendu) > 1e-6) ko(lab + ` : angle mesuré ${avant} puis ${apres} après rotation, attendu ${attendu}`);
  /* un vrai clic sur trois atomes : si un atome est caché derrière un autre, la lecture
     nomme l'atome réellement choisi ; on tourne alors la molécule et on recommence */
  const cliquer = async (triple) => {
    for (let essai = 0; essai < 10; essai++) {
      await ev(`(()=>{ const B=${B3D}, m=B.__instance; m.reinitialiser(); m.tourner(${essai * 37}, "y"); m.tourner(${essai * 23}, "x");
        const b=[...B.querySelectorAll("button")].find(x=>/Mesurer/.test(x.textContent)); if(/gho/.test(b.className)) b.click(); else { b.click(); b.click(); } })()`);
      let bon = true;
      for (let n = 0; n < 3; n++) {
        const p = await ev(`(()=>{ const m=${B3D}.__instance, a=m.viewer.getModel().selectedAtoms({})[${"${triple[n]}"}], q=m.viewer.modelToScreen(a); return {x:q.x - scrollX, y:q.y - scrollY}; })()`.replace("${triple[n]}", triple[n]));
        for (const type of ["mousePressed", "mouseReleased"]) await cmd("Input.dispatchMouseEvent", { type, x: p.x, y: p.y, button: "left", clickCount: 1 });
        await sleep(200);
        const l = await ev(`${B3D}.querySelector(".figLecture").textContent`);
        if (n < 2 && !l.includes("choisi : " + aff(A[triple[n]].nom) + " ")) { bon = false; break; }
      }
      const lu = await ev(`${B3D}.querySelector(".figLecture").textContent`);
      await ev(`(()=>{ const b=[...${B3D}.querySelectorAll("button")].find(x=>/Mesurer/.test(x.textContent)); if(/pri/.test(b.className)) b.click(); })()`);
      /* le troisième atome aussi doit être celui visé : la lecture nomme les trois */
      const noms = triple.map(t => aff(A[t].nom));
      const vise = lu.includes(noms.join("–")) || (lu.includes(noms[1]) && lu.includes(noms[0]) && lu.includes(noms[2]) && /n'est pas relié/.test(lu)) || /deux fois le même atome/.test(lu);
      if (bon && vise) return lu;
    }
    return null;
  };
  const lu = await cliquer(tri);
  const mm = lu && lu.match(/= ([\d,]+)°/);
  if (!lu) ko(lab + ` : impossible de cliquer ${tri.map(i => A[i].nom).join(", ")} sous 10 orientations`);
  else if (!mm || Math.abs(lireNb(mm[1]) - attendu) > 0.005 + 1e-9) ko(lab + ` : un clic sur ${tri.map(i => A[i].nom).join(", ")} affiche « ${lu} », attendu ${attendu.toFixed(2).replace(".", ",")}°`);
  /* un sommet qui n'est pas lié aux deux autres : la mesure doit être refusée, et le dire */
  const libre = A.findIndex((_, x) => x !== tri[0] && x !== tri[2] && x !== tri[1] && !(voisins[x].includes(tri[0]) && voisins[x].includes(tri[2])));
  const lu2 = await cliquer([tri[0], libre, tri[2]]);
  if (!lu2) ko(lab + " : impossible de tester le refus d'un faux angle");
  else if (!/n'est pas relié/.test(lu2) || /= [\d,]+°/.test(lu2)) ko(lab + ` : un faux angle (${A[tri[0]].nom}, ${A[libre].nom}, ${A[tri[2]].nom}) est affiché comme mesure : « ${lu2} »`);
  /* le même atome cliqué deux fois : pas d'« angle » de 0° */
  const lu3 = await cliquer([tri[0], tri[1], tri[0]]);
  if (!lu3) ko(lab + " : impossible de tester le double clic sur un même atome");
  else if (!/deux fois le même atome/.test(lu3) || /= [\d,]+°/.test(lu3)) ko(lab + ` : cliquer deux fois ${A[tri[0]].nom} affiche « ${lu3} »`);
  /* les étiquettes : longueurs et angles affichés = recalculés */
  await ev(`[...${B3D}.querySelectorAll("button")].filter(b=>/Afficher/.test(b.textContent)).forEach(b=>b.click())`);
  const etiq = await ev(`${B3D}.__instance.viewer.labels.map(l=>l.text)`);
  const nb = t => lireNb(t.match(/[\d,]+/)[0]);
  /* les angles : étiquettes automatiques, et celle de la dernière mesure (« H2–C1–H3 = 109,47° »), qui remplace l'automatique de son sommet */
  const pm = etiq.filter(t => /pm$/.test(t)).map(nb), dg = etiq.filter(t => /°$/.test(t)).map(t => nb(t.replace(/^.*=/, "")));
  if (pm.length !== fichier.li.length) ko(lab + ` : ${pm.length} étiquettes de longueur pour ${fichier.li.length} liaisons`);
  fichier.li.forEach(([a, b]) => { const v = +(d3(A[a], A[b]) * 100).toFixed(1); if (!pm.includes(v)) ko(lab + ` : longueur ${A[a].nom}–${A[b].nom} = ${v} pm absente des étiquettes`); });
  if (!dg.length) ko(lab + " : aucune étiquette d'angle affichée");
  dg.forEach(v => { if (!vrais.some(x => Math.abs(x - v) <= 0.005 + 1e-9)) ko(lab + ` : étiquette ${v}° qui n'est aucun angle de la molécule`); });
  await ev(`[...${B3D}.querySelectorAll("button")].filter(b=>/Cacher/.test(b.textContent)).forEach(b=>b.click())`);
}
if (cles && vues.size !== cles.length) ko(`${vues.size} jeux de coordonnées distincts pour ${cles.length} molécules : un bouton n'a pas changé la vue`);
/* hors de la machine : rien, sauf les polices Google que l'appli charge depuis toujours (index.html), sans lien avec la figure 3D */
const ext = requetes.filter(u => !/^http:\/\/127\.0\.0\.1:/.test(u) && !/^data:/.test(u) && !/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(u));
ext.forEach(u => ko("requête hors de la machine : " + u));

ws.close(); chrome.kill(); serveur.close();
try { fs.rmSync(profil, { recursive: true, force: true }); } catch {}
for (const d of defauts) console.log("  " + d);
for (const e of erreurs) console.log("  console : " + e);
console.log(`${etats} états balayés, ${defauts.length} défauts, ${erreurs.length} erreurs de console.`);
process.exit(defauts.length || erreurs.length ? 1 : 0);
