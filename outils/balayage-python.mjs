/* =====================================================================
   Balayage des capacités numériques Python : ch1 (s10), ch8 (s8), ch9 (s9),
   ch11 (s9, bilan énergétique) et ch12 (s8, propagation d'une onde).

   Scripts : chaque bloc de code AFFICHÉ (cours et exercices) doit être,
   caractère pour caractère, le script de la source — indentation comprise,
   sans aucune mise en forme (un « ** » ou un « _ » ne doit rien devenir) ;
   la sortie affichée, celle de la source (elle-même vérifiée par
   outils/verifier-scripts.mjs, qui exécute chaque script) ; le bouton
   « Copier le script » présent ; la page ne déborde pas en largeur (un
   script long défile dans son cadre).
   Ch8, figures fixes de la section « Δv à l'échelle » : chaque point est une
   position du tableau du cours ; les vecteurs v₂, v₃ et Δv de la
   construction sont RECALCULÉS ici depuis le tableau (vitesse en M_i =
   déplacement de M_(i−1) à M_(i+1) divisé par 2τ, échelle 1 carreau pour
   1 m/s) ; chaque vecteur et chaque point porte son nom (aucun élément sans
   légende) ; mise en page (débordement, chevauchement, trait sur un texte).
   Ch12, figure « Deux photos de la corde » : chaque point des deux courbes est
   RECALCULÉ depuis le script du cours (liste `source`, `n`, `dx` lus dans le
   code ; y = source[n − k] si k ≤ n, 0 sinon) et la courbe pleine est la
   sortie affichée, ligne à ligne ; la flèche λ va d'une crête à la crête
   suivante et mesure v × T (T = longueur du motif × dt) ; chaque courbe et la
   flèche ont leur légende. Exercice on15 : son tableau est la sortie du script.
   Ch11 : chaque ligne de la sortie vérifie Em = Ec + Epp (nombres affichés).
   Partout : aucun balisage resté brut ($, @x{, {,}, accent grave), calculs
   affichés dans le texte (hors scripts).

   Usage : node outils/balayage-python.mjs [--racine=public]
     Code de sortie 1 au moindre défaut, 2 si l'environnement manque.
   ===================================================================== */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import { calculsFaux } from "./calculs-affiches.mjs";

const arg = n => (process.argv.find(a => a.startsWith("--" + n + "=")) || "").split("=").slice(1).join("=");
const ici = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const racine = path.resolve(arg("racine") || path.join(ici, "..", "public"));
const profil = fs.mkdtempSync(path.join(os.tmpdir(), "balayage-python-"));
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

/* ---- la source, chargée telle quelle ---- */
const ctx = { window: {} }; vm.createContext(ctx);
for (const f of ["03-cours-chimie-1.js", "03-cours-mouvement.js", "03-cours-energie.js", "03-cours-ondes.js"]) vm.runInContext(fs.readFileSync(path.join(racine, "app", f), "utf8"), ctx);
const COURS = Object.fromEntries(ctx.window.COURS.map(c => [c.id, c]));
const defauts = []; let etats = 0;
const ko = s => { if (defauts.length < 80) defauts.push(s); };

/* ---- ch8 : figures recalculées depuis le tableau ---- */
const s8 = COURS.vitesse.sections.find(s => s.id === "s8");
if (!s8) ko("ch8 : section s8 introuvable");
else {
  const tb = s8.blocs.find(b => b.t === "tbl");
  const lire = c => +String(c).replace(/[$]/g, "").replace("{,}", ".");
  const X = tb.rows[0].slice(1).map(lire), Y = tb.rows[1].slice(1).map(lire), tau = 0.05;
  const figs = s8.blocs.filter(b => b.t === "fig");
  const fp = figs[0], fc = figs[1];
  const pts = fp.objets.filter(o => o.t === "point");
  if (pts.length !== X.length) ko(`ch8 : ${pts.length} points dans la figure, ${X.length} positions dans le tableau`);
  pts.forEach((p, i) => { if (p.x !== X[i] || p.y !== Y[i]) ko(`ch8 : le point ${p.nom} est en (${p.x} ; ${p.y}), le tableau dit (${X[i]} ; ${Y[i]})`); });
  const v = i => [(X[i + 1] - X[i - 1]) / (2 * tau) / 100, (Y[i + 1] - Y[i - 1]) / (2 * tau) / 100];
  const v2 = v(2), v3 = v(3), dv = [v3[0] - v2[0], v3[1] - v2[1]];
  const vecs = fc.objets.filter(o => o.t === "vec");
  const cherche = nom => vecs.find(o => o.nom === nom);
  const proche = (a, b) => Math.abs(a - b) < 1e-9;
  const V2 = cherche("v₂"), V3 = cherche("v₃"), DV = cherche("Δv");
  if (!V2 || !V3 || !DV) ko("ch8 : vecteurs v₂, v₃ ou Δv introuvables (ou sans nom) dans la construction");
  else {
    if (!(proche(V2.a[0] - V2.de[0], v2[0]) && proche(V2.a[1] - V2.de[1], v2[1]))) ko(`ch8 : v₂ dessiné ${V2.a[0] - V2.de[0]} ; ${V2.a[1] - V2.de[1]} carreaux, attendu ${v2}`);
    if (!(proche(V3.a[0] - V3.de[0], v3[0]) && proche(V3.a[1] - V3.de[1], v3[1]))) ko(`ch8 : v₃ dessiné faux, attendu ${v3}`);
    if (V2.de.join() !== V3.de.join()) ko("ch8 : v₂ et v₃ ne partent pas du même point");
    if (!(proche(DV.de[0], V2.a[0]) && proche(DV.de[1], V2.a[1]) && proche(DV.a[0], V3.a[0]) && proche(DV.a[1], V3.a[1]))) ko("ch8 : Δv ne va pas de la pointe de v₂ à celle de v₃");
    const L = Math.hypot(...dv);
    if (!fc.note.includes(`mesure $${String(+L.toFixed(2)).replace(".", "{,}")}$ carreau`)) ko(`ch8 : la note n'annonce pas Δv = ${L} carreau`);
  }
  [...fp.objets, ...fc.objets].forEach(o => { if ((o.t === "vec" || o.t === "point") && !o.nom) ko(`ch8 : un ${o.t} sans légende`); });
  /* une construction « à l'échelle » exige un repère orthonormé */
  if (fp.libre || fc.libre) ko("ch8 : une figure de la section est en libre:true (repère non orthonormé)");
}

/* ---- ch11 : la somme affichée tombe juste sur chaque ligne ---- */
const s11 = COURS.mecanique.sections.find(s => s.id === "s9");
if (!s11) ko("ch11 : section s9 introuvable");
else {
  const sorties = [...s11.blocs.filter(b => b.t === "code").map(b => b.sortie), ...COURS.mecanique.exos.filter(e => e.code).map(e => e.sortie)];
  let lignes = 0;
  for (const so of sorties) for (const l of so.split("\n")) {
    const m = l.match(/Ec = (\d+) mJ ; Epp = (\d+) mJ ; Em = (\d+) mJ/);
    if (!m) { ko(`ch11 : ligne de sortie illisible « ${l} »`); continue; }
    lignes++; if (+m[1] + +m[2] !== +m[3]) ko(`ch11 : « ${l} » — ${m[1]} + ${m[2]} ne fait pas ${m[3]}`);
  }
  if (lignes < 21) ko(`ch11 : ${lignes} lignes de bilan lues, 21 attendues`);
}

/* ---- ch12 : la figure et le tableau recalculés depuis le script ---- */
const s12 = COURS.ondes.sections.find(s => s.id === "s8");
if (!s12) ko("ch12 : section s8 introuvable");
else {
  const cb = s12.blocs.find(b => b.t === "code"), code = cb.x;
  const lit = re => { const m = code.match(re); if (!m) ko(`ch12 : ${re} introuvable dans le script`); return m ? m[1] : null; };
  const source = JSON.parse(lit(/^source = (\[[^\]]*\])/m)), n = +lit(/^n = (\d+)/m), v = +lit(/^v = ([\d.]+)/m), dt = +lit(/^dt = ([\d.]+)/m);
  const dx = v * dt, NB = +lit(/range\((\d+)\)/);
  const photo = nn => Array.from({ length: NB }, (_, k) => [+(k * dx).toFixed(1), k <= nn ? source[nn - k] : 0]);
  const sortie = cb.sortie.split("\n").map(l => { const m = l.match(/^x = ([\d.]+) m : y = (-?[\d.]+) cm$/); return m ? [+m[1], +m[2]] : null; });
  if (JSON.stringify(sortie) !== JSON.stringify(photo(n))) ko("ch12 : la sortie affichée n'est pas la photo recalculée depuis la liste source");
  const fig = s12.blocs.find(b => b.t === "fig");
  const courbes = fig.objets.filter(o => o.t === "courbeXY");
  const pleine = courbes.find(c => !c.pointille), pointillee = courbes.find(c => c.pointille);
  if (!pleine || JSON.stringify(pleine.pts) !== JSON.stringify(photo(n))) ko(`ch12 : la courbe pleine n'est pas la sortie du script (n = ${n})`);
  const n2 = +(fig.note.match(/avec \$n = (\d+)\$/) || [])[1];
  if (!pointillee || !n2 || JSON.stringify(pointillee.pts) !== JSON.stringify(photo(n2))) ko(`ch12 : la courbe en pointillé n'est pas la photo recalculée pour n = ${n2}`);
  /* λ : motif de la source, puis flèche d'une crête à la suivante */
  let T = null; for (let p = 1; p < source.length; p++) if (source.every((y, i) => i + p >= source.length || source[i + p] === y)) { T = p * dt; break; }
  const lam = v * T, fl = fig.objets.find(o => o.t === "vec");
  if (!fl || !fl.nom) ko("ch12 : flèche λ absente ou sans légende");
  else {
    if (Math.abs((fl.a[0] - fl.de[0]) - lam) > 1e-9) ko(`ch12 : la flèche λ mesure ${fl.a[0] - fl.de[0]} m, v × T = ${lam}`);
    const crete = Math.max(...source), pt = x => photo(n).find(p => Math.abs(p[0] - x) < 1e-9);
    if (!(pt(fl.de[0]) && pt(fl.de[0])[1] === crete && pt(fl.a[0]) && pt(fl.a[0])[1] === crete)) ko("ch12 : la flèche λ ne va pas d'une crête à une crête");
    if (!fl.nom.includes(String(+lam.toFixed(1)).replace(".", ","))) ko(`ch12 : la légende « ${fl.nom} » n'annonce pas λ = ${lam}`);
  }
  /* légendes : les deux instants et le front, en texte permanent */
  const textes = fig.objets.filter(o => o.t === "texte").map(o => o.txt).join(" | ");
  for (const [nn, quoi] of [[n, "courbe pleine"], [n2, "courbe en pointillé"]])
    if (!textes.includes(`t = ${String(+(nn * dt).toFixed(1)).replace(".", ",")} s`)) ko(`ch12 : la ${quoi} (t = ${nn * dt} s) n'a pas de légende`);
  const front = photo(n).filter((p, k) => k <= n).pop()[0];
  if (!fig.objets.some(o => o.t === "texte" && /front/.test(o.txt) && Math.abs(o.x - front) < 1e-9)) ko(`ch12 : le front (x = ${front} m) n'est pas légendé à sa place`);
  /* on15 : le tableau est la sortie */
  const on15 = COURS.ondes.exos.find(e => e.id === "on15");
  const tb = on15 && on15.tbl ? on15.tbl.rows.map(r => r.map(c => +String(c).replace(/\$/g, "").replace("{,}", "."))) : null;
  if (!tb || JSON.stringify(tb) !== JSON.stringify(photo(n))) ko("ch12 : le tableau de on15 n'est pas la sortie du script");
}

for (const largeur of [1100, 400]) {
  await cmd("Emulation.setDeviceMetricsOverride", { width: largeur, height: 1400, deviceScaleFactor: 1, mobile: largeur < 600 });
  await cmd("Page.navigate", { url }); await sleep(1500);
  for (let i = 0; i < 60 && !(await ev('typeof GOTO === "function"')); i++) await sleep(250);
  const ecran = largeur < 600 ? "téléphone" : "ordinateur";
  await ev(`window.__page = function(B){
    const svg = B.querySelector("svg"), d = [];
    if (!svg) return d;
    const cadre = svg.getBoundingClientRect(), M = svg.getScreenCTM();
    const textes = [...svg.querySelectorAll("text")].map(t => ({t: t.textContent, r: t.getBoundingClientRect()}));
    textes.forEach(x => { if (x.r.left < cadre.left - .5 || x.r.right > cadre.right + .5 || x.r.top < cadre.top - .5 || x.r.bottom > cadre.bottom + .5) d.push("« " + x.t + " » déborde"); });
    for (let i = 0; i < textes.length; i++) for (let j = i + 1; j < textes.length; j++) { const a = textes[i].r, b = textes[j].r;
      if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) d.push("« " + textes[i].t + " » chevauche « " + textes[j].t + " »"); }
    const ec = (x, y) => ({x: M.a*x + M.c*y + M.e, y: M.b*x + M.d*y + M.f});
    [...svg.querySelectorAll("line")].forEach(l => { if ((l.getAttribute("stroke") || "").includes("line2") || +l.getAttribute("stroke-width") < 1.3) return;
      const p1 = ec(+l.getAttribute("x1"), +l.getAttribute("y1")), p2 = ec(+l.getAttribute("x2"), +l.getAttribute("y2"));
      const L = Math.hypot(p2.x - p1.x, p2.y - p1.y), ep = (+l.getAttribute("stroke-width") || 1)/2;
      for (let s = 0; s <= L; s += 2) { const x = p1.x + (p2.x - p1.x)*s/L, y = p1.y + (p2.y - p1.y)*s/L;
        const t = textes.find(z => x > z.r.left && x < z.r.right && y + ep > z.r.top + 1 && y - ep < z.r.bottom - 1);
        if (t) { d.push("un trait traverse « " + t.t + " »"); break; } } });
    [...svg.querySelectorAll("polygon")].forEach(p => { const b = p.getBoundingClientRect();
      textes.forEach(x => { if (x.r.left < b.right - 1 && b.left < x.r.right - 1 && x.r.top < b.bottom - 1 && b.top < x.r.bottom - 1) d.push("une pointe de flèche touche « " + x.t + " »"); }); });
    return d;
  };`);
  for (const [chap, sec] of [["transformation", "s10"], ["vitesse", "s8"], ["forces", "s9"], ["mecanique", "s9"], ["ondes", "s8"]]) {
    const C = COURS[chap];
    for (const onglet of ["cours", "exos"]) {
      await ev(`GOTO({page:"chap", chap:"${chap}", onglet:"${onglet}", fiche:null}); new Promise(r => setTimeout(r, 700))`);
      const r = await ev(`(()=>{ const v=document.querySelector("#view");
        const blocs=[...v.querySelectorAll(".codeBloc")].map(b=>({code:b.querySelector("pre.code").textContent, sortie:(b.querySelector("pre.codeSortie")||{}).textContent||null, copier:!!b.querySelector("button")}));
        /* la nouvelle section seule (cours) ou les nouveaux exercices : le reste
           du chapitre a ses propres contrôles */
        const idx=${JSON.stringify(C.sections.map(s=>s.id))}.indexOf("${sec}");
        const zone = "${onglet}"==="cours" ? v.querySelectorAll("section")[idx] : v;
        const c=(zone||v).cloneNode(true); c.querySelectorAll(".codeBloc, code.ic").forEach(x=>x.remove());
        c.querySelectorAll(".frac").forEach(f => f.replaceWith("(" + f.children[0].textContent + ")/(" + f.children[1].textContent + ")"));
        return {blocs, texte:c.textContent, larg:document.documentElement.scrollWidth, vue:window.innerWidth}; })()`);
      etats++; const lab = `${ecran}, ${chap} ${onglet}`;
      const attendus = onglet === "cours"
        ? C.sections.find(s => s.id === sec).blocs.filter(b => b.t === "code").map(b => ({ code: b.x, sortie: b.sortie }))
        : C.exos.filter(e => e.code).map(e => ({ code: e.code, sortie: null }));
      if (r.blocs.length !== attendus.length) ko(`${lab} : ${r.blocs.length} scripts affichés, ${attendus.length} dans la source`);
      attendus.forEach((a, k) => { const b = r.blocs[k]; if (!b) return;
        if (b.code !== a.code) ko(`${lab} : le script ${k + 1} affiché diffère de la source`);
        if ((a.sortie || null) !== (b.sortie || null)) ko(`${lab} : la sortie du script ${k + 1} affichée diffère de la source`);
        if (!b.copier) ko(`${lab} : bouton « Copier le script » absent`); });
      const brut = r.texte.match(/@[a-z]\{|\{,\}|\$|`/g);
      if (brut) ko(`${lab} : balisage resté brut (${[...new Set(brut)].join(" ")})`);
      if (r.larg > r.vue + 1) ko(`${lab} : la page déborde en largeur (${r.larg} px pour ${r.vue})`);
      if (onglet === "cours") calculsFaux(r.texte).forEach(d => ko(`${lab} : ${d}`));
    }
  }
  /* figures du ch8 */
  await ev(`GOTO({page:"chap", chap:"vitesse", onglet:"cours", fiche:null}); new Promise(r => setTimeout(r, 700))`);
  for (const titre of ["Les positions relevées", "La construction à l'échelle"]) {
    const res = await ev(`(()=>{ const B=[...document.querySelectorAll(".figBoite")].find(b=>b.textContent.includes(${JSON.stringify(titre)}));
      if(!B) return null; B.scrollIntoView({block:"center"});
      const svg=B.querySelector("svg"), ang=(x1,y1,x2,y2)=>Math.abs(Math.atan2(y1-y2, x2-x1)*180/Math.PI);
      let angle=null;
      /* positions : M₁ (15 ; 19) et M₃ (45 ; 49), 30 cm de chaque côté — construction : v₂ = (3 ; 3) */
      const pts=[...svg.querySelectorAll("circle")].map(c=>[+c.getAttribute("cx"), +c.getAttribute("cy")]);
      if(${JSON.stringify(titre)}.startsWith("Les positions") && pts.length>=4) angle=ang(pts[1][0],pts[1][1],pts[3][0],pts[3][1]);
      const lv=[...svg.querySelectorAll("g")].find(g=>/vert/.test(g.getAttribute("stroke")||""));
      if(${JSON.stringify(titre)}.startsWith("La construction") && lv){ const l=lv.querySelector("line"); angle=ang(+l.getAttribute("x1"),+l.getAttribute("y1"),+l.getAttribute("x2"),+l.getAttribute("y2")); }
      return {page:window.__page(B), texte:B.textContent, angle}; })()`);
    if (res && res.angle != null && Math.abs(res.angle - 45) > 1) ko(`${ecran}, « ${titre} » : un déplacement à composantes égales s'affiche à ${res.angle.toFixed(1)}° au lieu de 45° (repère non orthonormé)`);
    if (res && res.angle == null) ko(`${ecran}, « ${titre} » : angle de contrôle introuvable`);
    if (!res) ko(`${ecran} : figure « ${titre} » introuvable`);
    else { res.page.forEach(d => ko(`${ecran}, « ${titre} » : ${d}`)); calculsFaux(res.texte).forEach(d => ko(`${ecran}, « ${titre} » : ${d}`)); etats++; }
  }

  /* figure du ch12 : mise en page */
  await ev(`GOTO({page:"chap", chap:"ondes", onglet:"cours", fiche:null}); new Promise(r => setTimeout(r, 700))`);
  { const titre = "Deux photos de la corde";
    const res = await ev(`(()=>{ const B=[...document.querySelectorAll(".figBoite")].find(b=>b.textContent.includes(${JSON.stringify(titre)}));
      if(!B) return null; B.scrollIntoView({block:"center"}); return {page:window.__page(B), texte:B.textContent}; })()`);
    if (!res) ko(`${ecran} : figure « ${titre} » introuvable`);
    else { res.page.forEach(d => ko(`${ecran}, « ${titre} » : ${d}`)); calculsFaux(res.texte).forEach(d => ko(`${ecran}, « ${titre} » : ${d}`)); etats++; }
  }
}

ws.close(); chrome.kill(); serveur.close();
try { fs.rmSync(profil, { recursive: true, force: true }); } catch {}
for (const d of defauts) console.log("  " + d);
for (const e of erreurs) console.log("  console : " + e);
console.log(`${etats} états balayés, ${defauts.length} défauts, ${erreurs.length} erreurs de console.`);
process.exit(defauts.length || erreurs.length ? 1 : 0);
