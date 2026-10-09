/* =====================================================================
   Balayage des figures de couleurs (ch17) : ce que l'écran AFFICHE.

   Pour chaque état des figures « additive » (27), « objet » (56) et
   « filtres » (49), puis pour le cercle des couleurs à six cases : capture
   d'écran réelle dans Chrome headless, décodage du PNG, et comparaison du
   pixel lu au centre de chaque zone avec la couleur recalculée ICI, par un
   modèle indépendant de 02-figures.js. S'y ajoutent les contrôles de mise
   en page (texte qui déborde, se chevauche ou qu'un trait traverse ; nom de
   zone qui sort de sa zone ; projecteur éteint dessiné) et la cohérence
   entre le dessin, la ligne de lecture et la note.

   Pourquoi. Le chapitre qui enseigne la couleur doit afficher des couleurs
   justes : un fondu approximatif, une zone mal remplie ou un nom faux ne
   se voient pas en relisant le code. Écrit pendant le chantier ch17
   (2026-10-09), où il a trouvé des noms débordant de leur zone et des
   disques de projecteurs éteints ; versionné ensuite pour ne pas pouvoir
   être oublié. Il mord : une couleur atténuée ou une zone mal remplie,
   injectées dans une copie, sont détectées au pixel près.

   Usage : node outils/balayage-couleurs.mjs [--racine=public] [--captures=dossier]
     Il sert lui-même le dossier --racine (public/ par défaut) et lance
     Chrome (variable CHROME pour un autre chemin). Code de sortie 1 au
     moindre défaut, 2 si Chrome ou l'application ne démarrent pas.
   ===================================================================== */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import zlib from "node:zlib";

const arg = n => (process.argv.find(a => a.startsWith("--" + n + "=")) || "").split("=").slice(1).join("=");
const racine = path.resolve(arg("racine") || path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")), "..", "public"));
const captures = arg("captures") || null;
if (captures) fs.mkdirSync(captures, { recursive: true });
const profil = fs.mkdtempSync(path.join(os.tmpdir(), "balayage-couleurs-"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2" };
const serveur = http.createServer((q, r) => {
  const f = path.join(racine, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "") || "index.html");
  if (!f.startsWith(racine) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" }); fs.createReadStream(f).pipe(r);
});
await new Promise(r => serveur.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${serveur.address().port}/index.html`;
const port = 9334, sleep = ms => new Promise(r => setTimeout(r, ms));
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
if (!fs.existsSync(CHROME)) { console.error("Chrome introuvable : " + CHROME + " (variable CHROME)"); process.exit(2); }
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`,
  `--user-data-dir=${profil}`, "--window-size=1100,1400", "--no-first-run", "--force-color-profile=srgb", "about:blank"], { stdio: "ignore" });
let cibles;
for (let i = 0; i < 200; i++) { try { cibles = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (cibles.length) break; } catch {} await sleep(200); }
const ws = new WebSocket(cibles.find(c => c.type === "page").webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener("open", r));
let id = 0; const att = new Map(), erreurs = [];
ws.addEventListener("message", ev => { const m = JSON.parse(ev.data);
  if (m.id && att.has(m.id)) { att.get(m.id)(m); att.delete(m.id); }
  else if (m.method === "Runtime.exceptionThrown") erreurs.push("EXCEPTION " + JSON.stringify(m.params.exceptionDetails).slice(0, 400));
  else if (m.method === "Runtime.consoleAPICalled" && /error|warn/.test(m.params.type)) erreurs.push(m.params.type + " " + m.params.args.map(a => a.value ?? a.description).join(" ").slice(0, 300)); });
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; att.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => { const r = await cmd("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 800)); return r.result.result.value; };
await cmd("Runtime.enable"); await cmd("Page.enable"); await cmd("Network.enable"); await cmd("Network.setCacheDisabled", { cacheDisabled: true });
await cmd("Emulation.setDeviceMetricsOverride", { width: 1100, height: 1400, deviceScaleFactor: 1, mobile: false });
await cmd("Page.navigate", { url }); await sleep(2500);

/* ---- décodeur PNG minimal (8 bits, RGB ou RGBA, non entrelacé) ---- */
function png(buf) {
  let p = 8, W, H, type, idat = [];
  while (p < buf.length) { const len = buf.readUInt32BE(p), t = buf.toString("ascii", p + 4, p + 8), d = buf.subarray(p + 8, p + 8 + len);
    if (t === "IHDR") { W = d.readUInt32BE(0); H = d.readUInt32BE(4); type = d[9]; if (d[8] !== 8 || d[12] !== 0) throw new Error("PNG non géré"); }
    else if (t === "IDAT") idat.push(d); p += 12 + len; }
  const bpp = type === 6 ? 4 : 3, raw = zlib.inflateSync(Buffer.concat(idat)), ligne = W * bpp, px = Buffer.alloc(H * ligne);
  for (let y = 0; y < H; y++) { const f = raw[y * (ligne + 1)], src = y * (ligne + 1) + 1;
    for (let x = 0; x < ligne; x++) { const a = x >= bpp ? px[y * ligne + x - bpp] : 0, b = y ? px[(y - 1) * ligne + x] : 0, c = (x >= bpp && y) ? px[(y - 1) * ligne + x - bpp] : 0;
      let v = raw[src + x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const q = a + b - c, pa = Math.abs(q - a), pb = Math.abs(q - b), pc = Math.abs(q - c); v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c); }
      px[y * ligne + x] = v & 255; } }
  return { W, H, at: (x, y) => { const i = (Math.round(y) * W + Math.round(x)) * bpp; return [px[i], px[i + 1], px[i + 2]]; } };
}

/* ---- le modèle, recalculé ici, indépendamment de 02-figures.js ---- */
const NOMS = { rouge: [1,0,0], vert: [0,1,0], bleu: [0,0,1], jaune: [1,1,0], cyan: [0,1,1], magenta: [1,0,1], blanc: [1,1,1], noir: [0,0,0] };
const nomDe = t => Object.keys(NOMS).find(k => NOMS[k].join() === t.map(x => x ? 1 : 0).join());
const ET = (a, b) => a.map((x, i) => x & b[i]);
function nomNiveaux(L) {   /* règles du plan : sombre (tout à 50 %), pâle, et six teintes nommées */
  const m = Math.max(...L); if (!m) return "noir";
  const S = L.map(x => x === m ? 1 : 0), mi = L.map(x => x > 0 && x < m ? 1 : 0), z = L.filter(x => !x).length;
  const b = nomDe(S);
  if (!mi.some(Boolean)) return m === 2 ? b : (b === "blanc" ? "gris" : b + " sombre");
  if (!z) return b + " pâle";
  return { "rouge|vert": "orange", "vert|rouge": "vert-jaune", "rouge|bleu": "rose", "bleu|rouge": "violet", "vert|bleu": "vert printemps", "bleu|vert": "bleu azur" }[b + "|" + nomDe(mi)];
}

const OBJETS = ["blanc","rouge","vert","bleu","jaune","cyan","magenta","noir"], LUMIERES = ["blanc","rouge","vert","bleu","jaune","cyan","magenta"], FILTRES = ["aucun","rouge","vert","bleu","jaune","cyan","magenta"];
const etats = [];
for (let r = 0; r < 3; r++) for (let v = 0; v < 3; v++) for (let b = 0; b < 3; b++) etats.push({ fig: "additive", niv: [r, v, b] });
OBJETS.forEach((o, io) => LUMIERES.forEach((l, il) => etats.push({ fig: "objet", io, il })));
FILTRES.forEach((a, i1) => FILTRES.forEach((b, i2) => etats.push({ fig: "filtres", i1, i2 })));

for (let i = 0; i < 60 && !(await ev("typeof GOTO === \"function\"")); i++) await sleep(250);
await ev(`GOTO({page:"chap", chap:"couleurs", onglet:"cours", fiche:null}); new Promise(r => setTimeout(r, 900))`);
/* dans la page : fixe l'état, puis renvoie data-etat, les points à lire (en px de la fenêtre) et les contrôles de mise en page */
await ev(`window.__fixe = function(e){
  const boites = [...document.querySelectorAll(".figBoite")].filter(b => b.getAttribute("data-etat"));
  const B = boites.find(b => JSON.parse(b.getAttribute("data-etat")).modele === e.fig);
  if (e.fig === "additive") B.querySelectorAll("input[type=range]").forEach((i, k) => { i.value = e.niv[k]; i.dispatchEvent(new Event("input")); });
  else { const rangs = B.querySelectorAll(".row"); const a = e.fig === "objet" ? [e.io, e.il] : [e.i1, e.i2];
    [0, 1].forEach(k => rangs[k].querySelectorAll("button")[a[k]].click()); }
  B.scrollIntoView({block:"center"});
  const svg = B.querySelector("svg"), M = svg.getScreenCTM(), cadre = svg.getBoundingClientRect();
  const etat = JSON.parse(B.getAttribute("data-etat"));
  const ecran = p => ({x: M.a*p[0] + M.c*p[1] + M.e, y: M.b*p[0] + M.d*p[1] + M.f});
  const defauts = [];
  const textes = [...svg.querySelectorAll("text")].map(t => ({t:t.textContent, r:t.getBoundingClientRect()}));
  textes.forEach(x => { if (x.r.left < cadre.left - .5 || x.r.right > cadre.right + .5 || x.r.top < cadre.top - .5 || x.r.bottom > cadre.bottom + .5) defauts.push("« " + x.t + " » déborde"); });
  for (let i = 0; i < textes.length; i++) for (let j = i + 1; j < textes.length; j++) { const a = textes[i].r, b = textes[j].r;
    if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) defauts.push("« " + textes[i].t + " » chevauche « " + textes[j].t + " »"); }
  /* un trait (faisceau, rayon) ne doit traverser aucun texte : on le suit pixel par pixel */
  [...svg.querySelectorAll("line")].forEach(l => { const p1 = ecran([+l.getAttribute("x1"), +l.getAttribute("y1")]), p2 = ecran([+l.getAttribute("x2"), +l.getAttribute("y2")]);
    const L = Math.hypot(p2.x - p1.x, p2.y - p1.y), ep = (+l.getAttribute("stroke-width") || 1)/2;
    for (let s = 0; s <= L; s += 2) { const x = p1.x + (p2.x - p1.x)*s/L, y = p1.y + (p2.y - p1.y)*s/L;
      const t = textes.find(z => x > z.r.left && x < z.r.right && y + ep > z.r.top + 1 && y - ep < z.r.bottom - 1);
      if (t) { defauts.push("un trait traverse « " + t.t + " »"); break; } } });
  const cercles = e.fig === "additive" ? [[165,130,100],[265,130,100],[215,217,100]] : [];
  const nbCerclesDessines = svg.querySelectorAll("svg > circle").length;
  const etiquettes = textes.map(x => x.t);
  /* additive : le nom de chaque zone tient-il entièrement dans sa zone ? (coins de sa boîte, en coordonnées du SVG) */
  const debordeZone = [];
  if (e.fig === "additive") etat.zones.forEach(z => { if (z.cle === "000") return;
    const ts = [...svg.querySelectorAll('text[data-zone="' + z.cle + '"]')];
    const existe = z.cle.split("").every((c, i) => c === "0" || e.niv[i] > 0);
    if (!existe) { if (ts.length) debordeZone.push("zone " + z.cle + " nommée alors qu'un de ses projecteurs est éteint"); return; }
    if (!ts.length) { debordeZone.push("nom de la zone " + z.cle + " introuvable"); return; }
    if (ts.map(t => t.textContent).join(" ") !== z.nom) debordeZone.push("zone " + z.cle + " : écrit « " + ts.map(t => t.textContent).join(" ") + " », nom « " + z.nom + " »");
    ts.forEach(t => { const bb = t.getBBox();
      [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]].forEach(q => {
        const dedans = cercles.map(c => Math.hypot(q[0] - c[0], q[1] - c[1]) < c[2] ? 1 : 0).join("");
        if (dedans !== z.cle) debordeZone.push("« " + t.textContent + " » sort de sa zone " + z.cle + " (coin en " + dedans + ")"); }); }); });
  debordeZone.forEach(d => defauts.push(d));
  const marques = [...B.querySelectorAll(".row")].map(r => [...r.querySelectorAll("button")].findIndex(b => b.classList.contains("pri")));
  return {etat, points: etat.zones.map(z => Object.assign(ecran(z.p), {z})), defauts, cercles: Array(nbCerclesDessines).fill(0), etiquettes, marques,
    lecture: (B.querySelector(".figLecture")||{textContent:""}).textContent, note: (B.querySelector(".figNote")||{textContent:""}).textContent,
    nan: /NaN|undefined|Infinity/.test(B.textContent)};
};`);

const rap = { etats: 0, pixels: 0, defauts: [] };
const ko = s => { if (rap.defauts.length < 60) rap.defauts.push(s); };
for (const e of etats) {
  const r = await ev(`window.__fixe(${JSON.stringify(e)})`); await sleep(60);
  const shot = await cmd("Page.captureScreenshot", { format: "png" }), img = png(Buffer.from(shot.result.data, "base64"));
  const lab = e.fig + " " + (e.fig === "additive" ? e.niv.join("") : e.fig === "objet" ? OBJETS[e.io] + "/" + LUMIERES[e.il] : FILTRES[e.i1] + "/" + FILTRES[e.i2]);
  rap.etats++;
  r.defauts.forEach(d => ko(lab + " : " + d));
  if (r.nan) ko(lab + " : NaN/undefined");
  /* attendu, recalculé ici */
  let attendu = {};                       // id de zone -> [rgb, nom]
  if (e.fig === "additive") {
    ["100","010","001","110","101","011","111","000"].forEach(cle => { const L = cle.split("").map((c, i) => c === "1" ? e.niv[i] : 0);
      attendu[cle] = [L.map(x => Math.round(255*x/2)), nomNiveaux(L)]; });
    /* chaque point de lecture est dans sa zone et elle seule (géométrie relue sur les cercles dessinés) */
    r.etat.zones.forEach(z => { const dedans = [[165,130,100],[265,130,100],[215,217,100]].map(c => Math.hypot(z.p[0] - c[0], z.p[1] - c[1]) < c[2] - 3 ? 1 : 0).join("");
      if (dedans !== z.cle) ko(lab + " : point de la zone " + z.cle + " situé dans " + dedans); });

    /* la lecture nomme la superposition de tous les faisceaux allumés, et rien d'éteint */
    const cleOn = e.niv.map(x => x ? 1 : 0).join(""), nbOn = e.niv.filter(Boolean).length;
    if (nbOn === 0 && !/aucun projecteur/.test(r.lecture)) ko(lab + " : lecture « " + r.lecture + " »");
    if (nbOn >= 1 && !r.lecture.includes(attendu[cleOn][1])) ko(lab + " : lecture « " + r.lecture + " », attendu " + attendu[cleOn][1]);
    if (nbOn < 3 && /les trois/.test(r.lecture)) ko(lab + " : la lecture parle des trois alors qu'un projecteur est éteint");
    if (nbOn >= 2 && !r.note.includes(attendu[cleOn][1])) ko(lab + " : la note ne nomme pas " + attendu[cleOn][1]);
    /* aucun cercle d'un projecteur éteint (il laissait des arcs) */
    const nbCercles = r.cercles.length; if (nbOn && nbCercles < nbOn) ko(lab + " : " + nbCercles + " cercles pour " + nbOn + " projecteurs allumés");
  } else if (e.fig === "objet") {
    const o = NOMS[OBJETS[e.io]], l = NOMS[LUMIERES[e.il]], d = ET(o, l), vu = nomDe(d);
    attendu = { lampe: [l.map(x => 255*x), LUMIERES[e.il]], objet: [d.map(x => 255*x), vu], temoin: [o.map(x => 255*x), OBJETS[e.io]] };
    if (r.etat.vu !== vu) ko(lab + " : la figure dit « " + r.etat.vu + " », attendu " + vu);
    if (!r.lecture.endsWith("paraît " + vu)) ko(lab + " : lecture « " + r.lecture + " »");
    if (!r.note.includes("Il paraît donc " + vu)) ko(lab + " : la note ne dit pas « " + vu + " »");
    if (vu === "noir" && OBJETS[e.io] !== "noir" && !/Le piège/.test(r.note)) ko(lab + " : noir sans l'encadré du piège");
    if (r.marques.join() !== [e.io, e.il].join()) ko(lab + " : boutons marqués " + r.marques);
    if (!r.etiquettes.includes("l'objet, vu ainsi : " + vu)) ko(lab + " : libellé de l'objet absent ou faux");
  } else {
    const t1 = e.i1 ? NOMS[FILTRES[e.i1]] : [1,1,1], t2 = ET(t1, e.i2 ? NOMS[FILTRES[e.i2]] : [1,1,1]);
    attendu = { avant: [[255,255,255], "blanc"], entre: [t1.map(x => 255*x), nomDe(t1)], apres: [t2.map(x => 255*x), nomDe(t2)], ecran: [t2.map(x => 255*x), nomDe(t2)] };
    if (e.i1) attendu["filtre 1"] = [NOMS[FILTRES[e.i1]].map(x => 255*x), FILTRES[e.i1]];
    if (e.i2) attendu["filtre 2"] = [NOMS[FILTRES[e.i2]].map(x => 255*x), FILTRES[e.i2]];
    if (!r.lecture.endsWith("filtre 2 : " + nomDe(t2))) ko(lab + " : lecture « " + r.lecture + " »");
    if (r.marques.join() !== [e.i1, e.i2].join()) ko(lab + " : boutons marqués " + r.marques);
    if ((e.i1 || e.i2) && !r.note.includes("**") && !r.note.includes(nomDe(t2))) ko(lab + " : la note ne nomme pas " + nomDe(t2));
  }
  /* 1. ce que la figure écrit dans son SVG ; 2. ce que l'écran affiche */
  for (const p of r.points) {
    const cle = p.z.cle || p.z.id, a = attendu[cle];
    if (!a) { ko(lab + " : zone inattendue " + cle); continue; }
    if (p.z.rgb.join() !== a[0].join()) ko(lab + " : zone " + cle + " déclarée " + p.z.rgb + ", attendu " + a[0]);
    if (p.z.nom !== a[1]) ko(lab + " : zone " + cle + " nommée « " + p.z.nom + " », attendu « " + a[1] + " »");
    const vu = img.at(p.x, p.y); rap.pixels++;
    if (vu.some((c, i) => Math.abs(c - a[0][i]) > 3)) ko(lab + " : PIXEL zone " + cle + " affiché " + vu + ", attendu " + a[0]);
  }
  /* zones attendues mais absentes du dessin (hors zones noires des faisceaux) */
  Object.keys(attendu).forEach(k => { if (!r.points.some(p => (p.z.cle || p.z.id) === k) && attendu[k][0].some(Boolean) && k !== "000") ko(lab + " : zone " + k + " non dessinée"); });
  if (captures && ["additive 222", "additive 210", "objet rouge/cyan", "objet jaune/magenta", "filtres jaune/cyan", "filtres magenta/aucun"].includes(lab)) {
    const s = await ev(`(()=>{ const b=[...document.querySelectorAll(".figBoite")].find(b=>b.getAttribute("data-etat")&&JSON.parse(b.getAttribute("data-etat")).modele===${JSON.stringify(e.fig)}); const r=b.getBoundingClientRect(); return {x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height}; })()`);
    const c = await cmd("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: s.x, y: s.y, width: s.w, height: s.h, scale: 1 } });
    fs.writeFileSync(path.join(captures, lab.replace(/[ /]/g, "-") + ".png"), Buffer.from(c.result.data, "base64"));
  }
}
{
  const r = await ev(`(()=>{ const f=[...document.querySelectorAll(".figBoite, figure, .fig")].map(x=>x.closest(".figBoite")||x).find(b=>/Le cercle des couleurs, à six cases/.test(b.textContent));
    if(!f) return null; f.scrollIntoView({block:"center"}); const svg=f.querySelector("svg"), M=svg.getScreenCTM();
    const pleins=[...svg.querySelectorAll("circle")].filter(c=>/^rgb/.test(c.getAttribute("fill")||""));
    const textes=[...svg.querySelectorAll("text")].map(t=>{const b=t.getBBox();return {t:t.textContent,x:b.x+b.width/2,y:b.y+b.height/2};});
    return pleins.map(c=>{const cx=+c.getAttribute("cx"),cy=+c.getAttribute("cy");
      const proche=textes.reduce((m,t)=>{const d=Math.hypot(t.x-cx,t.y-cy);return d<m.d?{d,t:t.t}:m;},{d:1e9,t:""});
      return {fill:c.getAttribute("fill"), sx:M.a*cx+M.c*cy+M.e, sy:M.b*cx+M.d*cy+M.f, cx, cy, nom:proche.t}; }); })()`);
  await sleep(150);
  if (!r || r.length !== 6) ko("cercle des couleurs : " + (r ? r.length : 0) + " cases au lieu de 6");
  else {
    const shot = await cmd("Page.captureScreenshot", { format: "png" }), img = png(Buffer.from(shot.result.data, "base64"));
    r.forEach(c => { const rgb = c.fill.match(/\d+/g).map(Number), vu = img.at(c.sx, c.sy); rap.pixels++;
      if (vu.some((x, i) => Math.abs(x - rgb[i]) > 3)) ko("cercle : case " + c.nom + " affichée " + vu + ", attendu " + rgb);
      if (nomDe(rgb.map(x => x ? 1 : 0)) !== c.nom) ko("cercle : la case " + rgb + " est nommée « " + c.nom + " »"); });
    /* deux cases face à face (symétriques par rapport au centre) doivent donner du blanc */
    const mx = r.reduce((m, o) => m + o.cx, 0)/6, my = r.reduce((m, o) => m + o.cy, 0)/6;
    r.forEach(a => { const b = r.find(o => Math.abs(o.cx - (2*mx - a.cx)) < 2 && Math.abs(o.cy - (2*my - a.cy)) < 2);
      if (!b) { ko("cercle : pas de case en face de " + a.nom); return; }
      const sa = a.fill.match(/\d+/g).map(x => +x ? 1 : 0), sb = b.fill.match(/\d+/g).map(x => +x ? 1 : 0);
      if (sa.map((x, i) => x | sb[i]).join() !== "1,1,1" || sa.map((x, i) => x & sb[i]).join() !== "0,0,0") ko("cercle : " + a.nom + " et " + b.nom + " face à face ne sont pas complémentaires"); });
    rap.cercle = r.map(c => c.nom).join(", ");
  }
}
ws.close(); chrome.kill(); serveur.close();
try { fs.rmSync(profil, { recursive: true, force: true }); } catch {}
for (const d of rap.defauts) console.log("  " + d);
for (const e of erreurs) console.log("  console : " + e);
console.log(`${rap.etats} états, ${rap.pixels} pixels lus, cercle : ${rap.cercle || "non trouvé"}.`);
console.log(`${rap.defauts.length} défauts${rap.defauts.length >= 60 ? " (liste tronquée à 60)" : ""}, ${erreurs.length} erreurs de console.`);
process.exit(rap.defauts.length || erreurs.length ? 1 : 0);
