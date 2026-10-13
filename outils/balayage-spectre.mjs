/* =====================================================================
   Balayage du ch2 : spectre d'absorption et limites du protocole.

   Figure « spectre-uv » : 3 espèces × 5 concentrations, sur ordinateur et
   téléphone. Les spectres sont RE-ÉCHANTILLONNÉS ICI depuis les fichiers
   bruts (outils/spectres-uv/donnees/, PhotochemCAD et OMLC), sans passer par
   fabriquer.py : chaque point de la courbe AFFICHÉE doit être la mesure ×
   l'absorbance maximale choisie, à sa place sur des axes recalculés ici ; le
   repère λmax est au maximum des mesures du visible ; les trois parts
   transmises (bleu 400-500, vert 500-600, rouge 600-700 nm, moyenne de
   10^−A) sont recalculées, les jauges ont la bonne longueur et la pastille
   la bonne couleur ; SENS des messages : la couleur annoncée comme absorbée
   est la moins transmise, la couleur perçue est sa complémentaire (rouge ↔
   cyan, vert ↔ magenta, bleu ↔ jaune), elle ne change pas avec la
   concentration, et le tableau du cours donne le même λmax pour chaque
   espèce et la même couleur.
   Figure fixe « La gamme prolongée » : chaque point est la mesure du tableau
   du cours, la droite est A = 0,18 × C.
   Ch2 entier (cours et exercices) : mise en page, aucun balisage resté brut,
   calculs affichés ; et, dans les blocs réécrits par ce chantier (sections
   s2, s3, s8, exercices me1 et me17 à me21), aucun mot de l'ancien
   vocabulaire de la mesure (« précis », « précision », « erreur de mesure »,
   « valeur vraie », « se trompe »).

   Usage : node outils/balayage-spectre.mjs [--racine=public]
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
const profil = fs.mkdtempSync(path.join(os.tmpdir(), "balayage-spectre-"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };
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

/* ---- les spectres, refaits depuis les fichiers bruts ---- */
const DON = path.join(ici, "spectres-uv", "donnees");
const lire = f => fs.readFileSync(path.join(DON, f), "utf8").split("\n").filter(l => l.trim() && !l.startsWith("#"))
  .map(l => l.trim().split(/\s+/).map(Number)).filter(p => p.length >= 2 && isFinite(p[0]) && isFinite(p[1])).sort((a, b) => a[0] - b[0]);
const interp = (pts, x) => { for (let i = 0; i + 1 < pts.length; i++) if (pts[i][0] <= x && x <= pts[i + 1][0]) return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * (x - pts[i][0]) / (pts[i + 1][0] - pts[i][0] || 1); return NaN; };
const ESPECES = [
  { cle: "bleu-methylene", fic: "mb-water.txt", absorbee: "rouge", tableau: "Bleue (cyan)" },
  { cle: "rhodamine-b", fic: "009-abs.txt", absorbee: "vert", tableau: "Rose (magenta)" },
  { cle: "proflavine", fic: "078-abs.txt", absorbee: "bleu", tableau: "Jaune" },
];
const AMAX = [0.25, 0.5, 1.0, 1.5, 2.0], COMPL = { rouge: "cyan", vert: "magenta", bleu: "jaune" };
for (const E of ESPECES) {
  const pts = lire(E.fic), brut = [];
  for (let l = 380; l <= 700; l += 2) { const b = pts.filter(p => Math.abs(p[0] - l) <= 1).map(p => p[1]); brut.push(b.length >= 2 ? b.reduce((a, x) => a + x, 0) / b.length : interp(pts, l)); }
  const m = Math.max(...brut); E.a = brut.map(y => Math.max(0, Math.round(1000 * y / m))); E.lmax = 380 + 2 * brut.indexOf(m);
  const vis = pts.filter(p => p[0] >= 380 && p[0] <= 700); E.lmaxBrut = vis.reduce((a, p) => p[1] > a[1] ? p : a)[0];
}

const src2 = fs.readFileSync(path.join(racine, "app", "03-cours-chimie-1.js"), "utf8");
const defauts = []; let etats = 0;
const ko = s => { if (defauts.length < 80) defauts.push(s); };
for (const E of ESPECES) {
  if (Math.abs(E.lmax - E.lmaxBrut) > 2) ko(`${E.cle} : λmax rééchantillonné ${E.lmax} nm, maximum des mesures ${E.lmaxBrut} nm`);
  const ligne = src2.split("\n").find(l => l.includes(`["${E.tableau}",`));
  if (!ligne || !ligne.includes(`$${E.lmax}$ @u{nm}`)) ko(`tableau du cours : la ligne « ${E.tableau} » ne donne pas λmax = ${E.lmax} nm`);
}

/* ---- vocabulaire, dans les blocs réécrits ---- */
{ const ch = src2.slice(src2.indexOf('id:"mesures", n:2'), src2.indexOf('id:"titrage", n:3'));
  const bloc = (deb, fin) => ch.slice(ch.indexOf(deb), fin ? ch.indexOf(fin) : undefined);
  const zones = { s2: bloc('{id:"s2",', '{id:"s3",'), s3: bloc('{id:"s3",', '{id:"s8",'), s8: bloc('{id:"s8",', '{id:"s5",'),
    me1: bloc('{id:"me1",', '{id:"me2",'), "me17-21": bloc('{id:"me17",') };
  const BANNI = /\bprécis\w*|\bimprécis\w*|\bprécision\w*|erreurs? de mesure|valeur vraie|se trompe/gi;
  /* emplois sans rapport avec la mesure, laissés tels quels (bloc non réécrit) */
  const HORS_MESURE = ["la méthode précise est expliquée"];
  for (const [z, t] of Object.entries(zones)) { if (t.length < 50) { ko(`bloc ${z} introuvable`); continue; }
    for (const m of t.matchAll(BANNI)) { const autour = t.slice(Math.max(0, m.index - 30), m.index + 40); if (!HORS_MESURE.some(h => autour.includes(h))) ko(`vocabulaire : « ${m[0]} » dans ${z}`); } }
  /* la gamme prolongée : table du cours */
  const tb = ch.slice(ch.indexOf('head:["$C$ (@u{mmol/L})"'));
  const C = [...tb.slice(0, tb.indexOf("rows:")).matchAll(/"\$(\d+)\$"/g)].map(m => +m[1]);
  const Am = [...tb.slice(tb.indexOf('["$A$ mesurée"'), tb.indexOf('["$A$ prévue')).matchAll(/\$(\d)\{,\}(\d\d)\$/g)].map(m => +(m[1] + "." + m[2]));
  const Ap = [...tb.slice(tb.indexOf('["$A$ prévue'), tb.indexOf("]}")).matchAll(/\$(\d)\{,\}(\d\d)\$/g)].map(m => +(m[1] + "." + m[2]));
  if (C.length !== 9 || Am.length !== 9 || Ap.length !== 9) ko(`table de la gamme prolongée mal lue (${C.length}/${Am.length}/${Ap.length})`);
  C.forEach((c, i) => { if (Math.abs(Ap[i] - +(0.18 * c).toFixed(2)) > 1e-9) ko(`table : A prévue ${Ap[i]} pour C = ${c}, la droite donne ${(0.18 * c).toFixed(2)}`); });
  globalThis.GAMME = C.map((c, i) => [c, Am[i]]).filter(p => p[0] > 0);
}

for (const largeur of [1100, 400]) {
  await cmd("Emulation.setDeviceMetricsOverride", { width: largeur, height: 1400, deviceScaleFactor: 1, mobile: largeur < 600 });
  await cmd("Page.navigate", { url }); await sleep(1500);
  for (let i = 0; i < 60 && !(await ev('typeof GOTO === "function"')); i++) await sleep(250);
  await ev(`GOTO({page:"chap", chap:"mesures", onglet:"cours", fiche:null}); new Promise(r => setTimeout(r, 900))`);
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
    /* la courbe ne passe sur aucun texte */
    const c = svg.querySelector("path[data-courbe]");
    if (c) { const Lc = c.getTotalLength(); for (let s = 0; s <= Lc; s += 2) { const p = c.getPointAtLength(s), q = ec(p.x, p.y);
      const t = textes.find(z => q.x > z.r.left + 1 && q.x < z.r.right - 1 && q.y > z.r.top + 1 && q.y < z.r.bottom - 1);
      if (t) { d.push("la courbe passe sur « " + t.t + " »"); break; } } }
    [...svg.querySelectorAll("rect, circle")].forEach(r => { const b = r.getBoundingClientRect();
      if (b.right > cadre.right + .5 || b.left < cadre.left - .5 || b.top < cadre.top - .5 || b.bottom > cadre.bottom + .5) d.push("une forme déborde du cadre"); });
    return d;
  };`);
  const ecran = largeur < 600 ? "téléphone" : "ordinateur";
  const parEspece = {};
  for (let is = 0; is < ESPECES.length; is++) for (let ia = 0; ia < AMAX.length; ia++) {
    const E = ESPECES[is], Amax = AMAX[ia];
    const res = await ev(`(()=>{ const B=[...document.querySelectorAll(".figBoite")].find(b=>b.getAttribute("data-etat")&&JSON.parse(b.getAttribute("data-etat")).modele==="spectre-uv");
      B.querySelectorAll(".row button")[${is}].click(); const c=B.querySelector("input[type=range]"); c.value=${ia}; c.dispatchEvent(new Event("input")); B.scrollIntoView({block:"center"});
      const svg=B.querySelector("svg");
      const d=svg.querySelector("path[data-courbe]").getAttribute("d").replace(/[ML]/g," ").trim().split(/\\s+/).map(Number);
      const lm=svg.querySelector("line[data-lmax]"), pa=svg.querySelector("rect[data-pastille]");
      const jauges=["bleu","vert","rouge"].map(n=>+svg.querySelector('rect[data-tiers="'+n+'"]').getAttribute("width"));
      return {etat:JSON.parse(B.getAttribute("data-etat")), d, lmx:+lm.getAttribute("x1"), lmy:+lm.getAttribute("y2"), fill:pa.getAttribute("fill"), jauges,
        textes:[...svg.querySelectorAll("text")].map(t=>t.textContent), lecture:B.querySelector(".figLecture").textContent, note:B.querySelector(".figNote").textContent,
        page:window.__page(B), nan:/NaN|undefined|Infinity/.test(B.textContent)}; })()`);
    etats++; const lab = `${ecran}, ${E.cle}, A max = ${Amax}`;
    res.page.forEach(d => ko(lab + " : " + d)); if (res.nan) ko(lab + " : NaN/undefined/Infinity affiché");
    const S = res.etat, px = l => S.X0 + (l - S.L0) * (S.X1 - S.X0) / (S.L1 - S.L0), py = a => S.BASE - a * (S.BASE - S.HAUT) / S.YMAX;
    if (S.espece !== E.cle || S.Amax !== Amax) ko(lab + ` : la figure affiche ${S.espece}, A max = ${S.Amax}`);
    /* la courbe : chaque point est la mesure × A max */
    if (res.d.length !== 2 * E.a.length) ko(lab + ` : ${res.d.length / 2} points tracés, ${E.a.length} attendus`);
    else for (let i = 0; i < E.a.length; i++) { const l = 380 + 2 * i;
      if (Math.abs(res.d[2 * i] - px(l)) > 0.02 || Math.abs(res.d[2 * i + 1] - py(Amax * E.a[i] / 1000)) > 0.02) { ko(lab + ` : point à ${l} nm mal placé`); break; } }
    if (S.lmax !== E.lmax) ko(lab + ` : λmax affiché ${S.lmax}, recalculé ${E.lmax}`);
    if (Math.abs(res.lmx - px(E.lmax)) > 0.02 || Math.abs(res.lmy - py(Amax)) > 0.02) ko(lab + " : repère λmax mal placé");
    if (!res.textes.includes(`λmax = ${E.lmax} nm`)) ko(lab + " : libellé λmax absent ou faux");
    /* les trois parts transmises */
    const T = [[400, 500], [500, 600], [600, 700]].map(([a, b]) => { let s = 0, n = 0; E.a.forEach((v, i) => { const l = 380 + 2 * i; if (l >= a && (l < b || (b === 700 && l === 700))) { s += Math.pow(10, -Amax * v / 1000); n++; } }); return s / n; });
    T.forEach((t, k) => { if (Math.abs(res.jauges[k] - 70 * t) > 0.05) ko(lab + ` : jauge ${["bleu", "vert", "rouge"][k]} ${res.jauges[k].toFixed(1)}, attendu ${(70 * t).toFixed(1)}`);
      if (!res.textes.includes(`transmis : ${Math.round(100 * t)} %`)) ko(lab + ` : « transmis : ${Math.round(100 * t)} % » absent`); });
    const rgb = `rgb(${Math.round(255 * T[2])},${Math.round(255 * T[1])},${Math.round(255 * T[0])})`;
    if (res.fill !== rgb) ko(lab + ` : pastille ${res.fill}, attendu ${rgb}`);
    const kmin = T.indexOf(Math.min(...T)), abs = ["bleu", "vert", "rouge"][kmin];
    if (abs !== E.absorbee) ko(lab + ` : la moins transmise est le ${abs}, l'espèce absorbe le ${E.absorbee}`);
    /* SENS des messages */
    if (!res.lecture.includes(`absorbe surtout le ${abs}`)) ko(lab + " : la lecture n'annonce pas la bonne couleur absorbée");
    if (!res.lecture.includes(`couleur perçue : ${COMPL[abs]}`)) ko(lab + ` : la lecture n'annonce pas « ${COMPL[abs]} »`);
    if (!res.note.includes(`il reste sa complémentaire, le ${COMPL[abs]}`)) ko(lab + " : la note ne donne pas la bonne complémentaire");
    if (!res.note.includes("Spectre mesuré (")) ko(lab + " : la source n'est pas affichée");
    if (!res.textes.some(t => t.startsWith(COMPL[abs]))) ko(lab + " : la pastille ne porte pas le nom de la couleur perçue");
    (parEspece[E.cle] = parEspece[E.cle] || new Set()).add(S.percue);
    for (const t of [res.lecture, res.note, ...res.textes]) calculsFaux(t).forEach(d => ko(lab + " : " + d));
  }
  for (const [k, v] of Object.entries(parEspece)) if (v.size !== 1) ko(`${ecran}, ${k} : la couleur perçue change avec la concentration (${[...v].join(", ")})`);

  /* la figure fixe de la gamme prolongée */
  { const res = await ev(`(()=>{ const B=[...document.querySelectorAll(".figBoite")].find(b=>b.textContent.includes("La gamme prolongée"));
      if(!B) return null; B.scrollIntoView({block:"center"}); const svg=B.querySelector("svg");
      return {page:window.__page(B), texte:B.textContent, n:svg.querySelectorAll("circle").length}; })()`);
    if (!res) ko(ecran + " : figure de la gamme prolongée introuvable");
    else { res.page.forEach(d => ko(ecran + ", gamme prolongée : " + d)); calculsFaux(res.texte).forEach(d => ko(ecran + ", gamme prolongée : " + d)); etats++;
      if (res.n < globalThis.GAMME.length) ko(ecran + ` : ${res.n} points dans la figure de la gamme, ${globalThis.GAMME.length} mesures`); }
  }

  /* tout le ch2 : balisage, débordement, calculs */
  for (const onglet of ["cours", "exos"]) {
    await ev(`GOTO({page:"chap", chap:"mesures", onglet:"${onglet}", fiche:null}); new Promise(r => setTimeout(r, 700))`);
    const r = await ev(`(()=>{ const v=document.querySelector("#view"); const c=v.cloneNode(true);
      c.querySelectorAll(".frac").forEach(f => f.replaceWith(f.children[0].textContent + "/" + f.children[1].textContent));
      return {texte:c.textContent, larg:document.documentElement.scrollWidth, vue:window.innerWidth}; })()`);
    const brut = r.texte.match(/@[a-z]\{|\{,\}|\$|\\\\n/g);
    if (brut) ko(`${ecran}, ch2 ${onglet} : balisage resté brut (${[...new Set(brut)].join(" ")})`);
    if (r.larg > r.vue + 1) ko(`${ecran}, ch2 ${onglet} : la page déborde en largeur`);
    calculsFaux(r.texte).forEach(d => ko(`${ecran}, ch2 ${onglet} : ${d}`));
    etats++;
  }
}

/* la figure fixe : points = mesures du tableau (coordonnées de la source) */
{ const src = src2.slice(src2.indexOf('titre:"La gamme prolongée'), src2.indexOf('note:"Jusqu\'à $6$'));
  const pts = [...src.matchAll(/\{t:"point", x:([\d.]+), y:([\d.]+)/g)].map(m => [+m[1], +m[2]]);
  if (JSON.stringify(pts) !== JSON.stringify(globalThis.GAMME)) ko(`figure de la gamme : points ${JSON.stringify(pts)} ≠ mesures du tableau ${JSON.stringify(globalThis.GAMME)}`);
  if (!/\{t:"seg", de:\[0,0\], a:\[12,2\.16\]/.test(src)) ko("figure de la gamme : la droite n'est pas A = 0,18 × C"); }

ws.close(); chrome.kill(); serveur.close();
try { fs.rmSync(profil, { recursive: true, force: true }); } catch {}
for (const d of defauts) console.log("  " + d);
for (const e of erreurs) console.log("  console : " + e);
console.log(`${etats} états balayés, ${defauts.length} défauts, ${erreurs.length} erreurs de console.`);
process.exit(defauts.length || erreurs.length ? 1 : 0);
