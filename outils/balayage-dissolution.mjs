/* =====================================================================
   Balayage des figures de la dissolution (ch5) : « solvatation » (s3,
   2 ions × 2 orientations) et « savon » (s8, 5 étapes). Les NOMBRES (géométrie
   des molécules d'eau, carbones de la queue, milieux où tombent têtes et
   queues) et le SENS des messages (ce que la lecture dit faire face à l'ion,
   ou se placer dans l'eau, l'air ou la graisse, est ce que le dessin montre).
   Détail des contrôles en tête de chaque partie.

   Usage : node outils/balayage-dissolution.mjs [--racine=public]
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
const profil = fs.mkdtempSync(path.join(os.tmpdir(), "balayage-dissolution-"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };
const serveur = http.createServer((q, r) => {
  const f = path.join(racine, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "") || "index.html");
  if (!f.startsWith(racine) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" }); fs.createReadStream(f).pipe(r);
});
await new Promise(r => serveur.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${serveur.address().port}/index.html`;
const port = 9341, sleep = ms => new Promise(r => setTimeout(r, ms));
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

/* ---- les deux figures, retrouvées dans le ch5 ---- */
const defauts = []; let etats = 0;
const ko = s => { if (defauts.length < 80) defauts.push(s); };
await ev(`GOTO({page:"chap", chap:"cohesion", onglet:"cours", fiche:null}); new Promise(r => setTimeout(r, 900))`);
const trouve = m => `[...document.querySelectorAll(".figBoite")].find(b=>b.getAttribute("data-etat")&&JSON.parse(b.getAttribute("data-etat")).modele==="${m}")`;
for (const m of ["solvatation", "savon"]) if (!(await ev(`!!(${trouve(m)})`))) defauts.push(`figure ${m} introuvable dans le ch5`);

const ang = (a, o, b) => { const u = [a.x - o.x, a.y - o.y], v = [b.x - o.x, b.y - o.y];
  return Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)))) * 180 / Math.PI; };
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/* =====================================================================
   1. Solvatation : 2 ions × 2 orientations.
   Recalculé ICI, à partir des positions dessinées (data-px, data-py) :
   - l'atome de chaque molécule le plus proche de l'ion : l'oxygène pour un
     cation, un hydrogène pour un anion (l'inverse si « retournées ») ;
   - pour un H tourné vers l'ion : O, H et l'ion alignés ;
   - deux O–H de même longueur, angle H–O–H de 104,5° ;
   - traits d'attraction (vert) ou de répulsion (rouge) selon l'orientation ;
   - δ− posé près d'un O, δ+ près d'un H ;
   - le SENS de la lecture et de la note : charge de l'ion, atome qui fait
     face (le même que le dessin), « impossible » et « se repoussent » quand
     les molécules sont retournées, et le bon atome dans la règle rappelée.
   ===================================================================== */
for (const [ion, charge, bouton] of [["Na+", 1, "Na⁺ (cation)"], ["Cl-", -1, "Cl⁻ (anion)"]]) {
  for (const ret of [false, true]) {
    const res = await ev(`(()=>{ const B=${trouve("solvatation")}; B.scrollIntoView({block:"center"});
      const bt=[...B.querySelectorAll("button")];
      bt.find(x=>x.textContent===${JSON.stringify(bouton)}).click();
      bt.find(x=>x.textContent===${JSON.stringify(ret ? "retournées (ne tient pas)" : "tournées comme dans la réalité")}).click();
      const svg=B.querySelector("svg"), ci=svg.querySelector("[data-ion]");
      const pt=e=>({x:+e.getAttribute("data-px"), y:+e.getAttribute("data-py")});
      return {etat:JSON.parse(B.getAttribute("data-etat")),
        ion:{x:+ci.getAttribute("cx"), y:+ci.getAttribute("cy"), r:+ci.getAttribute("r"), cle:ci.getAttribute("data-ion")},
        eaux:[...svg.querySelectorAll("[data-eau]")].map(g=>[...g.querySelectorAll("[data-at]")].map(t=>({el:t.getAttribute("data-at"), ...pt(t)}))),
        liens:[...svg.querySelectorAll("[data-lien]")].map(l=>({type:l.getAttribute("data-lien"), stroke:l.getAttribute("stroke")})),
        deltas:[...svg.querySelectorAll("[data-delta]")].map(t=>({s:t.getAttribute("data-delta"), ref:pt(t), x:+t.getAttribute("x"), y:+t.getAttribute("y")})),
        actifs:bt.filter(x=>/pri/.test(x.className)).map(x=>x.textContent),
        lecture:window.__plat(B.querySelector(".figLecture")), note:window.__plat(B.querySelector(".figNote")),
        page:window.__page(B), nan:/\\bNaN\\b|undefined/.test(B.textContent)}; })()`);
    etats++;
    const lab = `solvatation « ${ion} »${ret ? " retournées" : ""}`;
    res.page.forEach(d => ko(lab + " : " + d));
    if (res.nan) ko(lab + " : NaN ou undefined affiché");
    [res.lecture, res.note].forEach(t => calculsFaux(t).forEach(z => ko(lab + " : " + z)));
    if (!res.note.trim()) ko(lab + " : note vide");
    if (res.etat.ion !== ion || res.ion.cle !== ion || res.etat.charge !== charge || res.etat.retourne !== ret) ko(lab + ` : état publié ${JSON.stringify(res.etat)}`);
    if (!res.actifs.includes(bouton)) ko(lab + " : le bouton de l'ion n'est pas marqué");
    /* qui doit faire face, recalculé ici */
    const faceO = (charge > 0) !== ret;
    if (res.eaux.length !== res.etat.nbEau) ko(lab + ` : ${res.eaux.length} molécules dessinées, ${res.etat.nbEau} annoncées`);
    res.eaux.forEach((E, k) => {
      const O = E.filter(a => a.el === "O"), H = E.filter(a => a.el === "H");
      if (O.length !== 1 || H.length !== 2) { ko(lab + ` : molécule ${k} sans 1 O et 2 H`); return; }
      const dOH = H.map(h => dist(h, O[0]));
      if (Math.abs(dOH[0] - dOH[1]) > 0.5) ko(lab + ` : molécule ${k}, liaisons O–H inégales (${dOH.map(x => x.toFixed(1))} px)`);
      const a = ang(H[0], O[0], H[1]);
      if (Math.abs(a - 104.5) > 0.5) ko(lab + ` : molécule ${k}, angle H–O–H ${a.toFixed(1)}°, attendu 104,5°`);
      const proche = [...E].sort((p, q) => dist(p, res.ion) - dist(q, res.ion))[0];
      if (proche.el !== (faceO ? "O" : "H")) ko(lab + ` : molécule ${k}, c'est ${proche.el} qui fait face à l'ion, attendu ${faceO ? "O" : "H"}`);
      if (!faceO) {
        if (ang(res.ion, proche, O[0]) < 178) ko(lab + ` : molécule ${k}, l'H tourné vers l'ion n'est pas aligné avec O et l'ion (${ang(res.ion, proche, O[0]).toFixed(1)}°)`);
        const autre = H.find(h => h !== proche);
        if (dist(autre, res.ion) < dist(O[0], res.ion) - 1e-6 && dist(autre, res.ion) < dist(proche, res.ion) + 5) ko(lab + ` : molécule ${k}, le second H vient aussi vers l'ion`);
      } else if (H.some(h => dist(h, res.ion) <= dist(O[0], res.ion))) ko(lab + ` : molécule ${k}, un H est plus près de l'ion que O`);
      const dp = dist(proche, res.ion) - res.ion.r;
      if (dp < 6 || dp > 30) ko(lab + ` : molécule ${k}, l'atome qui fait face est à ${dp.toFixed(1)} px du bord de l'ion`);
    });
    for (let i = 0; i < res.eaux.length; i++) for (let j = i + 1; j < res.eaux.length; j++)
      for (const a of res.eaux[i]) for (const b of res.eaux[j]) if (dist(a, b) < 16) ko(lab + ` : molécules ${i} et ${j} trop proches (${a.el}-${b.el} ${dist(a, b).toFixed(1)} px)`);
    /* attractions ou répulsions */
    if (res.liens.length !== res.eaux.length) ko(lab + ` : ${res.liens.length} traits ion–molécule pour ${res.eaux.length} molécules`);
    res.liens.forEach(l => { const t = ret ? "repulsion" : "attraction", c = ret ? "rouge" : "vert";
      if (l.type !== t || !l.stroke.includes(c)) ko(lab + ` : trait « ${l.type} » en ${l.stroke}, attendu ${t} en ${c}`); });
    /* δ− près d'un O, δ+ près d'un H : l'atome le plus proche de l'étiquette est le sien */
    const tous = res.eaux.flat();
    if (res.deltas.filter(d => d.s === "-").length !== 1 || res.deltas.filter(d => d.s === "+").length !== 2) ko(lab + " : il faut un δ− et deux δ+");
    res.deltas.forEach(d => {
      const ref = tous.find(a => Math.abs(a.x - d.ref.x) < 0.01 && Math.abs(a.y - d.ref.y) < 0.01);
      if (!ref || ref.el !== (d.s === "-" ? "O" : "H")) ko(lab + ` : δ${d.s} rattaché à ${ref ? ref.el : "rien"}`);
      const c = { x: d.x, y: d.y - 4.5 }, plus = [...tous].sort((p, q) => dist(p, c) - dist(q, c))[0];
      if (plus !== ref) ko(lab + ` : l'étiquette δ${d.s} est plus près d'un autre atome (${plus.el}) que du sien`);
    });
    /* le sens des messages */
    const nomFace = faceO ? /oxygène/ : /hydrogène/;
    if (!ret) {
      if (!res.lecture.includes("charge " + (charge > 0 ? "+" : "−"))) ko(lab + ` : la lecture ne donne pas le signe de l'ion : « ${res.lecture} »`);
      const vers = (res.lecture.match(/tourne vers lui ([^,]*)/) || [])[1] || "";
      if (!nomFace.test(vers)) ko(lab + ` : la lecture dit que l'eau tourne vers l'ion « ${vers} », le dessin montre ${faceO ? "l'oxygène" : "un hydrogène"}`);
      if (!faceO && (!/un de ses hydrogènes/.test(vers) || !/O–H dirigée droit sur l'ion/.test(res.lecture))) ko(lab + " : un seul hydrogène fait face à un anion, la lecture doit le dire");
      if (!new RegExp(res.eaux.length + " molécules d'eau sont dessinées").test(res.lecture)) ko(lab + " : le nombre de molécules lu ne correspond pas au dessin");
      if (!/solvaté/.test(res.lecture)) ko(lab + " : la lecture ne nomme pas la solvatation");
      if (/ne tient pas|repouss/.test(res.lecture)) ko(lab + " : la lecture parle de répulsion pour la bonne orientation");
    } else {
      if (!/ne tient pas/.test(res.lecture) || !/se repoussent/.test(res.lecture)) ko(lab + ` : la disposition retournée n'est pas dite intenable : « ${res.lecture} »`);
      const vers = (res.lecture.match(/ne tient pas : ([^:]*) face à/) || [])[1] || "";
      if (!nomFace.test(vers)) ko(lab + ` : la lecture met « ${vers} » face à l'ion, le dessin montre ${faceO ? "l'oxygène" : "un hydrogène"}`);
      const regle = charge > 0 ? /l'oxygène δ− contre un ion positif/ : /un hydrogène δ\+ contre un ion négatif/;
      if (!regle.test(res.note)) ko(lab + ` : la note ne rappelle pas le bon sens pour un ${charge > 0 ? "cation" : "anion"}`);
    }
  }
}

/* =====================================================================
   2. Le savon pas à pas : 5 étapes.
   Recalculé ICI : le milieu où tombent la tête et le bout de la queue de
   chaque molécule (eau, air, graisse, tissu), à partir des zones publiées ;
   le nombre de carbones de la queue dessinée contre la formule affichée ;
   les têtes vers l'extérieur d'une gouttelette ; et le sens de la lecture
   à chaque étape (le milieu qu'elle nomme est celui du dessin).
   ===================================================================== */
const ATTENDU_SAVON = [
  { n: 1 },
  { n: 7, tete: "eau", queue: "air", lit: [/tête[^.]*dans l'eau/, /queue[^.]*dans l'air/] },
  { n: 6, tete: "eau", queue: "graisse", lit: [/queue[^.]*dans la graisse/, /tête[^.]*dans l'eau/] },
  { n: 10, tete: "eau", queue: "graisse", gouttes: 1, lit: [/queues vers l'intérieur, dans la graisse/, /têtes[^.]*vers l'extérieur, dans l'eau/, /micelle/] },
  { n: 16, tete: "eau", queue: "graisse", gouttes: 2, lit: [/se repoussent/, /même signe/, /rinçage/] }
];
for (let e = 0; e < 5; e++) {
  const res = await ev(`(()=>{ const B=${trouve("savon")}; B.scrollIntoView({block:"center"});
    const bt=[...B.querySelectorAll("button")], prec=bt.find(x=>/précédente/.test(x.textContent)), suiv=bt.find(x=>/suivante/.test(x.textContent));
    for(let i=0;i<6;i++) prec.click(); for(let i=0;i<${e};i++) suiv.click();
    const svg=B.querySelector("svg"), xy=s=>{const p=s.split(",").map(Number); return {x:p[0], y:p[1]};};
    return {etat:JSON.parse(B.getAttribute("data-etat")), nav:B.querySelector(".row span").textContent,
      savons:[...svg.querySelectorAll("[data-savon]")].map(g=>({tete:xy(g.getAttribute("data-tete")), queue:xy(g.getAttribute("data-queue")), nc:+g.getAttribute("data-nc"),
        traits:g.querySelectorAll("line").length, signe:g.querySelector("text").textContent, r:+g.querySelector("circle").getAttribute("r")})),
      rects:[...svg.querySelectorAll("rect[data-milieu]")].map(r=>({m:r.getAttribute("data-milieu"), x:+r.getAttribute("x"), y:+r.getAttribute("y"), w:+r.getAttribute("width"), h:+r.getAttribute("height")})),
      gouttes:[...svg.querySelectorAll("circle[data-milieu=graisse]")].map(c=>({x:+c.getAttribute("cx"), y:+c.getAttribute("cy"), r:+c.getAttribute("r")})),
      ellipses:[...svg.querySelectorAll("path[data-milieu=graisse]")].map(p=>{const v=p.getAttribute("data-ellipse").split(",").map(Number); return {x:v[0], y:v[1], rx:v[2], ry:v[3]};}),
      na:[...svg.querySelectorAll("[data-na]")].map(t=>({x:+t.getAttribute("x"), y:+t.getAttribute("y") - 4})),
      textes:[...svg.querySelectorAll("text")].map(t=>({s:t.textContent, x:+t.getAttribute("x"), y:+t.getAttribute("y")})),
      lecture:window.__plat(B.querySelector(".figLecture")), note:window.__plat(B.querySelector(".figNote")),
      page:window.__page(B), nan:/\\bNaN\\b|undefined/.test(B.textContent)}; })()`);
  etats++;
  const A = ATTENDU_SAVON[e], lab = `savon étape ${e + 1}`;
  res.page.forEach(d => ko(lab + " : " + d));
  if (res.nan) ko(lab + " : NaN ou undefined affiché");
  [res.lecture, res.note, ...res.textes.map(t => t.s)].forEach(t => calculsFaux(t).forEach(z => ko(lab + " : " + z)));
  if (!res.note.trim() || !res.lecture.trim()) ko(lab + " : lecture ou note vide");
  if (res.etat.etape !== e || !res.nav.startsWith(`étape ${e + 1}/5`)) ko(lab + ` : état ${res.etat.etape}, navigation « ${res.nav} »`);
  if (res.savons.length !== A.n || res.etat.nbSavons !== A.n) ko(lab + ` : ${res.savons.length} molécules dessinées, attendu ${A.n}`);
  /* le milieu d'un point, décidé ici */
  const milieu = p => {
    if (res.gouttes.some(g => dist(p, g) < g.r)) return "graisse";
    if (res.ellipses.some(c => p.y <= c.y && ((p.x - c.x) / c.rx) ** 2 + ((p.y - c.y) / c.ry) ** 2 < 1)) return "graisse";
    for (const m of ["tissu", "eau", "air"]) if (res.rects.some(r => r.m === m && p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h)) return m;
    return "hors des milieux";
  };
  /* les mots de la lecture, contre le dessin */
  (A.lit || []).forEach(re => { if (!re.test(res.lecture)) ko(lab + ` : la lecture ne dit pas ${re} : « ${res.lecture} »`); });
  if (/molécules? de savon|chaque molécule/.test(res.lecture + res.note)) ko(lab + " : le savon est fait d'ions (stéarate), pas de molécules");
  if (/s'appelle une micelle/.test(res.lecture)) ko(lab + " : « micelle » présenté comme le nom exact de la gouttelette emballée");
  if (/savon dissout|dissout la graisse|dissoudre la graisse/.test(res.lecture + res.note)) ko(lab + " : le savon est dit dissoudre la graisse");
  if (e === 0) {
    const S = res.savons[0];
    /* la queue dessinée a autant de carbones que la formule affichée : CH3 + (CH2)n */
    const f = res.textes.map(t => t.s).join(" "), m = f.match(/\(CH₂\)([₀-₉]+)/);
    const nCH2 = m ? +[...m[1]].map(c => "₀₁₂₃₄₅₆₇₈₉".indexOf(c)).join("") : NaN;
    if (!S || S.nc !== 1 + nCH2) ko(lab + ` : la queue dessinée a ${S && S.nc} carbones, la formule affichée en donne 1 + ${nCH2}`);
    if (S && S.traits !== S.nc) ko(lab + ` : ${S.traits} traits pour ${S.nc} carbones`);
    if (!new RegExp((1 + nCH2) + " carbones").test(res.lecture)) ko(lab + " : la lecture ne donne pas le nombre de carbones de la formule");
    if (S && S.signe !== "COO⁻") ko(lab + ` : la tête porte « ${S.signe} », attendu COO⁻`);
    /* « hydrophile » nommé près de la tête, « lipophile » près de la queue */
    const pos = s => res.textes.find(t => t.s.includes(s));
    const milieuQueue = S && { x: (S.tete.x + S.queue.x) / 2, y: (S.tete.y + S.queue.y) / 2 };
    const hy = pos("hydrophile"), li = pos("lipophile");
    if (!hy || !li || dist(hy, S.tete) > dist(hy, milieuQueue) || dist(li, milieuQueue) > dist(li, S.tete)) ko(lab + " : « hydrophile » doit nommer la tête et « lipophile » la queue");
    if (!/tête chargée[^,]*, hydrophile/.test(res.lecture) || !/apolaire, lipophile/.test(res.lecture) || !/amphiphile/.test(res.lecture)) ko(lab + ` : la lecture n'associe pas tête/hydrophile, queue/lipophile, amphiphile : « ${res.lecture} »`);
  } else {
    res.savons.forEach((S, k) => {
      const mt = milieu(S.tete), mq = milieu(S.queue);
      if (mt !== A.tete) ko(lab + ` : la tête de la molécule ${k} est dans « ${mt} », attendu ${A.tete}`);
      if (mq !== A.queue) ko(lab + ` : la queue de la molécule ${k} finit dans « ${mq} », attendu ${A.queue}`);
      if (S.signe !== "−") ko(lab + ` : la tête de la molécule ${k} porte « ${S.signe} », attendu −`);
    });
    for (let i = 0; i < res.savons.length; i++) for (let j = i + 1; j < res.savons.length; j++)
      if (dist(res.savons[i].tete, res.savons[j].tete) < res.savons[i].r + res.savons[j].r - 0.5) ko(lab + ` : les têtes ${i} et ${j} se chevauchent`);
    res.na.forEach((p, k) => { if (milieu(p) !== "eau") ko(lab + ` : l'ion Na⁺ ${k} est dans « ${milieu(p)} », pas dans l'eau`); });
    if (!res.na.length) ko(lab + " : les ions Na⁺ qui compensent la charge ne sont pas dessinés");
  }
  if (A.gouttes) {
    if (res.gouttes.length !== A.gouttes) ko(lab + ` : ${res.gouttes.length} gouttelette(s), attendu ${A.gouttes}`);
    /* chaque gouttelette : têtes dehors, queues dedans, molécules réparties tout autour */
    res.gouttes.forEach((g, gi) => {
      const autour = res.savons.filter(S => dist(S.queue, g) < g.r);
      if (!autour.length) { ko(lab + ` : gouttelette ${gi} sans savon`); return; }
      autour.forEach(S => { if (dist(S.tete, g) <= dist(S.queue, g)) ko(lab + ` : gouttelette ${gi}, une tête est plus près du centre que sa queue`); });
      const a = autour.map(S => Math.atan2(S.tete.y - g.y, S.tete.x - g.x) * 180 / Math.PI).sort((p, q) => p - q);
      const trou = Math.max(...a.map((x, i) => (i + 1 < a.length ? a[i + 1] : a[0] + 360) - x));
      if (trou > 1.5 * 360 / autour.length) ko(lab + ` : gouttelette ${gi}, un côté sans savon (trou de ${trou.toFixed(0)}°)`);
    });
    if (A.gouttes === 2 && res.gouttes.length === 2 && dist(res.gouttes[0], res.gouttes[1]) < res.gouttes[0].r + res.gouttes[1].r + 40) ko(lab + " : les deux gouttelettes « se repoussent » mais sont collées");
  }
}

ws.close(); chrome.kill(); serveur.close();
try { fs.rmSync(profil, { recursive: true, force: true }); } catch {}
for (const d of defauts) console.log("  " + d);
for (const e of erreurs) console.log("  console : " + e);
console.log(`${etats} états balayés, ${defauts.length} défauts, ${erreurs.length} erreurs de console.`);
process.exit(defauts.length || erreurs.length ? 1 : 0);
