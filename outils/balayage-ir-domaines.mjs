/* =====================================================================
   Balayage des figures « spectre-ir », « spectre-oh » (ch7, s8), des spectres
   des exercices du ch7, et de « domaines-em » (ch13, s8).

   Spectres infrarouges : chaque point de la courbe AFFICHÉE doit être la
   mesure (public/app/02-spectres-ir.js, spectres Coblentz du NIST), à sa
   place sur des axes recalculés ici ; chaque repère doit tomber dans la plage
   de la table du cours pour SA liaison (recopiée de LibreTexts ici, pas de la
   figure), sur une vraie absorption, au creux de la bande (sauf l'O–H d'acide,
   trop large pour avoir un creux), avec une flèche qui s'arrête juste
   au-dessus de la courbe ; chaque « vers N » de la lecture et des notes doit
   désigner une vraie bande ; la courbe ne passe sur aucun texte ; la source
   est affichée ; les spectres d'exercice n'ont aucun repère.
   Domaines : les 6 exemples et 61 positions du curseur. λ et f affichés sont
   chacun l'arrondi à 3 chiffres de la valeur exacte, recalculée ici depuis
   les sources (120 kV, 2,45 GHz, 5 GHz, 100 MHz, 42,577 MHz/T × 1,5 T), leur
   produit redonne c, le domaine annoncé est celui des frontières du cours,
   le repère est à sa place logarithmique et dans la bande de son domaine,
   et chaque bande commence et finit à la place de ses frontières.
   Partout : aucun texte qui déborde, se chevauche ou qu'un trait traverse ;
   calculs affichés (outils/calculs-affiches.mjs).

   Usage : node outils/balayage-ir-domaines.mjs [--racine=public]
     Il sert lui-même le dossier et lance Chrome (variable CHROME sinon).
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
const profil = fs.mkdtempSync(path.join(os.tmpdir(), "balayage-ir-em-"));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };
const serveur = http.createServer((q, r) => {
  const f = path.join(racine, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "") || "index.html");
  if (!f.startsWith(racine) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" }); fs.createReadStream(f).pipe(r);
});
await new Promise(r => serveur.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${serveur.address().port}/index.html`;
const port = 9337, sleep = ms => new Promise(r => setTimeout(r, ms));
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

/* ---- données recalculées ici, sans passer par 02-figures.js ---- */
globalThis.window = {};
await import("file:///" + path.join(racine, "app", "02-spectres-ir.js").replace(/\\/g, "/"));
const SP = globalThis.window.SPECTRES_IR;
/* la table du cours (ch7, s8), recopiée de la source (LibreTexts) : chaque repère
   doit tomber dans la plage de SA liaison */
const TABLE = { "O–H lié": [3200, 3550], "O–H libre": [3584, 3700], "O–H acide": [2500, 3300], "C–H": [2840, 3000], "C–H aldéhyde": [2695, 2830] };
const CO = { aldehyde: [1720, 1740], cetone: [1705, 1725], acide: [1706, 1720] };
const Tde = (S, s) => { const k = Math.round((S.s0 - s) / S.pas); return k < 0 || k >= S.t.length ? null : S.t[k] / 1000; };
const defauts = []; let etats = 0;
const ko = s => { if (defauts.length < 80) defauts.push(s); };

/* le tracé d'un spectre : chaque point de la courbe AFFICHÉE doit être la mesure */
await ev(`window.__spectre = function(B){
  const svg = B.querySelector("svg"), M = svg.getScreenCTM(), p = svg.querySelector("path[data-courbe]");
  const pts = p.getAttribute("d").split(/[ML]/).filter(x => x.trim()).map(x => x.trim().split(/\\s+/).map(Number));
  const textes = [...svg.querySelectorAll("text")].map(t => ({t: t.textContent, r: t.getBBox()}));
  /* la courbe ne doit passer sur aucun texte (coordonnées du SVG) */
  const sur = textes.filter(z => pts.some(q => q[0] > z.r.x && q[0] < z.r.x + z.r.width && q[1] > z.r.y + 1 && q[1] < z.r.y + z.r.height - 1)).map(z => z.t);
  const pointes = [...svg.querySelectorAll("polygon")].map(g => g.getAttribute("points").split(" ").map(c => c.split(",").map(Number))).map(v => ({x: v[2][0], y: v[2][1]}));
  return {cle: p.getAttribute("data-courbe"), pts, sur, pointes, etat: B.getAttribute("data-etat") ? JSON.parse(B.getAttribute("data-etat")) : null,
    reperes: [...svg.querySelectorAll("[data-repere]")].map(t => t.textContent), page: window.__page(B), nan: /NaN|undefined/.test(B.textContent),
    lecture: B.querySelector(".figLecture") ? window.__plat(B.querySelector(".figLecture")) : "", notes: [...B.querySelectorAll(".figNote")].map(n => window.__plat(n))};
};`);
function controleSpectre(res, lab, axe) {
  const S = SP[res.cle];
  if (!S) { ko(lab + " : spectre inconnu « " + res.cle + " »"); return; }
  res.page.forEach(d => ko(lab + " : " + d));
  if (res.nan) ko(lab + " : NaN ou undefined affiché");
  res.sur.forEach(t => ko(lab + " : la courbe passe sur « " + t + " »"));
  /* la courbe : autant de points que de mesures, chacun à sa place */
  if (res.pts.length !== S.t.length) ko(lab + ` : ${res.pts.length} points tracés pour ${S.t.length} mesures`);
  const X = s => axe.x0 + (axe.haut - s) / (axe.haut - axe.bas) * (axe.x1 - axe.x0), Y = t => axe.y0 - t * (axe.y0 - axe.yT);
  let pire = 0;
  res.pts.forEach((q, k) => { const s = S.s0 - k * S.pas; pire = Math.max(pire, Math.abs(q[0] - X(s)), Math.abs(q[1] - Y(S.t[k] / 1000))); });
  if (pire > 0.2) ko(lab + ` : la courbe s'écarte des mesures de ${pire.toFixed(2)} px`);
  /* les repères : dans la plage de la table, sur une vraie bande, pointe juste au-dessus de la courbe */
  const fam = S.famille;
  (res.etat && res.etat.reperes || []).forEach(r => {
    const plage = r.lib === "C=O" ? CO[fam] : TABLE[r.lib];
    if (!plage) { ko(lab + ` : repère « ${r.lib} » absent de la table`); return; }
    if (r.s < plage[0] || r.s > plage[1]) ko(lab + ` : repère « ${r.lib} » à ${r.s} cm-1, hors de la plage ${plage.join("-")} de la table`);
    const T = Tde(S, r.s);
    if (T == null || T > 0.75) ko(lab + ` : repère « ${r.lib} » à ${r.s} cm-1 sur T = ${T} : pas une vraie absorption`);
    if (r.lib !== "O–H acide") { let mini = 1; for (let s = r.s - 15; s <= r.s + 15; s += 5) { const v = Tde(S, s); if (v != null) mini = Math.min(mini, v); }
      if (T - mini > 0.03) ko(lab + ` : repère « ${r.lib} » à ${r.s} cm-1 (T = ${T}) à côté du creux (T = ${mini} à moins de 15 cm-1)`); }
    const p = res.pointes.find(q => Math.abs(q.x - X(r.s)) < 0.5);
    if (!p) ko(lab + ` : pas de flèche pointée sur ${r.s} cm-1`);
    else if (Y(T) - p.y < 1 || Y(T) - p.y > 8) ko(lab + ` : la flèche de ${r.s} cm-1 s'arrête à ${(Y(T) - p.y).toFixed(1)} px de la courbe`);
    if (!new RegExp(r.lib).test(res.lecture)) ko(lab + ` : la lecture ne nomme pas « ${r.lib} »`);
  });
  /* chaque « vers N » de la lecture et des notes désigne une vraie bande, à 25 cm-1 près ;
     sauf dans une phrase qui nie (« pas de bande forte vers 1700 ») ou qui donne une consigne
     générale (« cherche … vers 1700 »), qui ne parlent pas d'une bande présente */
  for (const t of [res.lecture, ...res.notes].flatMap(x => x.split(/(?<=[.:])\s+/)).filter(x => !/[Pp]as de|Cherche/.test(x))) for (const m of t.matchAll(/vers (\d{3,4})(?: et (\d{3,4}))?/g)) for (const N of [m[1], m[2]].filter(Boolean).map(Number)) {
    if (N < 600 || N > 3800) continue;
    let mini = 1; for (let s = N - 25; s <= N + 25; s += 5) { const v = Tde(S, s); if (v != null) mini = Math.min(mini, v); }
    const T = Tde(S, N);
    if (T == null || T > 0.95 || T - mini > 0.15) ko(lab + ` : « vers ${N} » ne tombe pas sur une bande (T = ${T}, creux voisin ${mini})`);
  }
}

/* ---- ch7 : les figures « spectre-ir » et « spectre-oh », repères montrés puis cachés ---- */
await ev(`GOTO({page:"chap", chap:"organique", onglet:"cours", fiche:null}); new Promise(r => setTimeout(r, 900))`);
for (const [modele, n] of [["spectre-ir", 4], ["spectre-oh", 2]]) for (let k = 0; k < n; k++) for (const cacher of [false, true]) {
  const res = await ev(`(()=>{ const B=[...document.querySelectorAll(".figBoite")].find(b=>b.querySelector("path[data-courbe]")&&b.querySelectorAll(".row button").length===${n + 1});
    if(!B) return null; B.querySelectorAll(".row button")[${k}].click();
    const bA=[...B.querySelectorAll("button")].pop(); if(${cacher} === /Cacher/.test(bA.textContent)) bA.click();
    B.scrollIntoView({block:"center"}); return window.__spectre(B); })()`);
  const lab = `${modele} ${k}${cacher ? " (repères cachés)" : ""}`;
  if (!res) { ko(lab + " : figure introuvable"); continue; }
  etats++;
  if (cacher && res.reperes.length) ko(lab + " : des repères restent affichés");
  if (!cacher && !res.reperes.length) ko(lab + " : aucun repère affiché");
  const S = SP[res.cle];
  if (S && !res.notes.some(t => t.includes(S.source))) ko(lab + " : la source du spectre n'est pas affichée");
  controleSpectre(res, lab, res.etat.axe);
}
/* ---- ch7 : les spectres des exercices, sans repères ---- */
const exos = await ev(`(()=>{ const c = window.COURS.find(x => x.id === "organique"); return c.exos.filter(e => e.fig && e.fig.objets && e.fig.objets.some(o => o.t === "spectreir")).map(e => e.id); })()`);
if (exos.length < 4) ko(`seulement ${exos.length} exercices à spectre trouvés`);
for (const idx of exos) {
  const res = await ev(`(()=>{ const c = window.COURS.find(x => x.id === "organique"), e = c.exos.find(x => x.id === "${idx}");
    const B = window.FIGURE(e.fig); B.setAttribute("data-test", "${idx}"); document.body.appendChild(B); B.scrollIntoView({block:"center"});
    const r = window.__spectre(B); B.remove(); return r; })()`);
  etats++;
  if (res.reperes.length) ko(idx + " : un exercice ne doit montrer aucun repère");
  const vb = { x0: 46, x1: 440 - 14, yT: 18, y0: 230 - 44, haut: 3800, bas: 600 };
  controleSpectre(res, "exercice " + idx, vb);
}

/* ---- ch13 : l'échelle des domaines ---- */
const C = 3.00e8;
const DOM = [["rayons γ", -Infinity, 1e-11], ["rayons X", 1e-11, 1e-8], ["ultraviolet", 1e-8, 4e-7], ["visible", 4e-7, 8e-7], ["infrarouge", 8e-7, 1e-3], ["micro-ondes", 1e-3, 1], ["ondes radio", 1, Infinity]];
const domaine = l => DOM.find(d => l >= d[1] && l < d[2])[0];
/* les exemples, recalculés depuis leurs sources (voir APPLIS_EM) */
const APPLIS = [["radiographie", 6.63e-34 * C / (120e3 * 1.6e-19), null], ["lumière verte", 550e-9, null], ["four à micro-ondes", null, 2.45e9],
  ["wifi 5 GHz", null, 5e9], ["radio FM", null, 100e6], ["IRM", null, 42.577e6 * 1.5]];
const r3 = x => { const e = Math.floor(Math.log10(x)); let m = +(x / 10 ** e).toFixed(2); return m >= 10 ? [+(m / 10).toFixed(2), e + 1] : [m, e]; };
const SUP = { "⁻": "-", "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9" };
const lit = t => { const m = t.match(/([\d,]+) × 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/); return m ? [lireNb(m[1]), Number([...m[2]].map(c => SUP[c]).join(""))] : null; };
await ev(`GOTO({page:"chap", chap:"lumiere", onglet:"cours", fiche:null}); new Promise(r => setTimeout(r, 900))`);
const lireEM = async action => ev(`(()=>{ const B=[...document.querySelectorAll(".figBoite")].find(b=>b.getAttribute("data-etat")&&JSON.parse(b.getAttribute("data-etat")).modele==="domaines-em");
  if(!B) return null; ${action}; B.scrollIntoView({block:"center"});
  const svg=B.querySelector("svg"), rep=svg.querySelector("line[data-repere]");
  const bandes=[...svg.querySelectorAll("rect[data-domaine]")].map(r=>({nom:r.getAttribute("data-domaine"), x0:+r.getAttribute("x"), x1:+r.getAttribute("x") + +r.getAttribute("width")}));
  return {etat:JSON.parse(B.getAttribute("data-etat")), x:+rep.getAttribute("x1"), bandes, lecture:window.__plat(B.querySelector(".figLecture")), note:window.__plat(B.querySelector(".figNote")),
    page:window.__page(B), nan:/NaN|undefined|Infinity/.test(B.textContent)}; })()`);
function controleEM(res, lab, attendu) {
  if (!res) { ko(lab + " : figure introuvable"); return; }
  etats++;
  res.page.forEach(d => ko(lab + " : " + d)); if (res.nan) ko(lab + " : NaN/undefined/Infinity affiché");
  /* les bandes : bornes à la place logarithmique de leurs frontières */
  const g = res.bandes[0].x0, dr = res.bandes[res.bandes.length - 1].x1, X = l => g + (Math.log10(l) + 12) / 15 * (dr - g);
  DOM.forEach(([nom, de, a], i) => { const b = res.bandes[i];
    if (!b || b.nom !== nom) { ko(lab + ` : bande ${i} « ${b && b.nom} », attendu « ${nom} »`); return; }
    if (isFinite(de) && Math.abs(b.x0 - X(de)) > 0.5) ko(lab + ` : la bande « ${nom} » commence à ${b.x0.toFixed(1)} px, attendu ${X(de).toFixed(1)}`);
    if (isFinite(a) && Math.abs(b.x1 - X(a)) > 0.5) ko(lab + ` : la bande « ${nom} » finit à ${b.x1.toFixed(1)} px, attendu ${X(a).toFixed(1)}`); });
  /* la lecture : λ et f affichés, chacun l'arrondi à 3 chiffres de la valeur exacte, et le domaine */
  const [lt, ft] = res.lecture.split("·"), L = lit(lt || ""), F = lit(ft || "");
  if (!L || !F) { ko(lab + " : lecture illisible : " + res.lecture); return; }
  const lam = attendu.lam, f = attendu.f;
  const [lm, le] = r3(lam), [fm, fe] = r3(f);
  if (L[0] !== lm || L[1] !== le) ko(lab + ` : λ affichée ${L[0]} × 10^${L[1]}, attendu ${lm} × 10^${le}`);
  if (F[0] !== fm || F[1] !== fe) ko(lab + ` : f affichée ${F[0]} × 10^${F[1]}, attendu ${fm} × 10^${fe}`);
  const prod = L[0] * 10 ** L[1] * F[0] * 10 ** F[1];
  if (Math.abs(prod / C - 1) > 0.01) ko(lab + ` : λ × f affichés = ${prod.toExponential(3)}, pas c`);
  const d = domaine(lam);
  if (!res.lecture.includes("domaine : " + d)) ko(lab + ` : la lecture n'annonce pas « ${d} » : ${res.lecture}`);
  /* le repère : à la place de λ, dans la bande de son domaine */
  if (Math.abs(res.x - X(lam)) > 0.5) ko(lab + ` : repère à ${res.x.toFixed(1)} px, attendu ${X(lam).toFixed(1)}`);
  const b = res.bandes.find(z => z.nom === d);
  if (b && (res.x < b.x0 - 0.5 || res.x > b.x1 + 0.5)) ko(lab + ` : repère hors de la bande « ${d} »`);
  calculsFaux(res.lecture + " " + res.note).forEach(z => ko(lab + " : " + z));
}
for (let k = 0; k < APPLIS.length; k++) {
  const [nom, l0, f0] = APPLIS[k], lam = l0 || C / f0, f = f0 || C / l0;
  const res = await lireEM(`B.querySelectorAll(".row button")[${k}].click()`);
  controleEM(res, "domaines-em « " + nom + " »", { lam, f });
  if (res && res.etat.appli !== nom) ko(`domaines-em « ${nom} » : la note n'est pas celle de l'exemple`);
}
for (let lg = -12; lg <= 3 + 1e-9; lg += 0.25) {
  const res = await lireEM(`const c=B.querySelector("input[type=range]"); c.value=${lg}; c.dispatchEvent(new Event("input"))`);
  const v = res ? res.etat.lg : lg;               // le curseur arrondit à son pas
  controleEM(res, `domaines-em λ = 10^${v.toFixed(2)} m`, { lam: 10 ** v, f: C / 10 ** v });
}

ws.close(); chrome.kill(); serveur.close();
try { fs.rmSync(profil, { recursive: true, force: true }); } catch {}
for (const d of defauts) console.log("  " + d);
for (const e of erreurs) console.log("  console : " + e);
console.log(`${etats} états balayés, ${defauts.length} défauts, ${erreurs.length} erreurs de console.`);
process.exit(defauts.length || erreurs.length ? 1 : 0);
