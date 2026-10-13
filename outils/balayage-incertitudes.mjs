/* =====================================================================
   Balayage du ch19 « Mesure et incertitudes ».

   Figure « histogramme » : 2 séries (éprouvette, bécher) × 6 largeurs de
   classes, à deux largeurs d'écran (ordinateur et téléphone). Tout est
   RECALCULÉ ici, sans passer par 02-figures.js : classes (une valeur posée
   sur une borne va à droite), effectifs, moyenne, écart-type (N − 1), écart-
   type et incertitude-type u = s/√N affichés à deux chiffres significatifs,
   moyenne au rang de u (règle d'écriture du cours) ; la moyenne et s du
   bécher écrits dans le cours doivent être ceux que la figure affiche.
   Contrôles : nombre de barres, hauteurs proportionnelles aux effectifs
   (à 1 px), barres jointives, effectif écrit au-dessus de chaque barre non
   vide et d'aucune vide, bornes écrites à leur place, point de la moyenne et
   bande ± s à leur place (à 1 px), le curseur change le dessin, lecture
   exacte ; SENS de la note (« trop peu » si 3 barres ou moins, « trop de
   classes » s'il y a une classe vide ou une majorité de classes à une seule
   valeur, comptes annoncés exacts, sinon « beaucoup près de la moyenne, moins
   sur les bords » vrai sur le dessin ; rapport des écarts-types annoncé pour
   le bécher) ; les valeurs de l'éprouvette sont celles du tableau du cours.
   Figure fixe du type B et tout le chapitre : mise en page, calculs affichés,
   et aucun balisage resté brut ($, @m{, {,}) dans le cours ni les exercices.

   Usage : node outils/balayage-incertitudes.mjs [--racine=public]
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
const profil = fs.mkdtempSync(path.join(os.tmpdir(), "balayage-incertitudes-"));
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

/* ---- recalcul indépendant ---- */
const SERIES = [
  { nom: "éprouvette graduée", ech: 1000, dec: 3, larg: [1, 2, 4, 5, 10, 20],
    val: [1006, 1000, 1001, 1002, 993, 989, 991, 999, 1003, 998, 990, 1005, 989, 995, 994, 999] },
  { nom: "bécher", ech: 100, dec: 2, larg: [1, 2, 3, 5, 10],
    val: [96, 98, 98, 99, 103, 93, 99, 98, 96, 100, 100, 105, 101, 100, 103, 96] },
];
const fr = (x, d) => x.toFixed(d).replace(".", ",");
const deuxCS = x => { const d = Math.max(0, 1 - Math.floor(Math.log10(x))); return { v: +(x * (1 + 1e-12)).toFixed(d), d }; };
function stats(S) {
  const N = S.val.length, moy = S.val.reduce((a, v) => a + v, 0) / N / S.ech;
  const s = Math.sqrt(S.val.reduce((a, v) => a + (v / S.ech - moy) ** 2, 0) / (N - 1));
  const sA = deuxCS(s), uA = deuxCS(s / Math.sqrt(N));
  return { N, moy, s, sA, uA, moyA: +(moy * (1 + 1e-12)).toFixed(uA.d) };
}
function classes(S, L) {
  const lo = Math.floor(Math.min(...S.val) / L) * L, nb = Math.floor((Math.max(...S.val) - lo) / L) + 1;
  const eff = Array(nb).fill(0); S.val.forEach(v => eff[Math.floor((v - lo) / L)]++);
  return { lo, nb, eff };
}

const defauts = []; let etats = 0;
const ko = s => { if (defauts.length < 80) defauts.push(s); };

/* les valeurs de l'éprouvette sont celles du tableau du cours */
{ const src = fs.readFileSync(path.join(racine, "app", "03-cours-incertitudes.js"), "utf8");
  const tb = src.slice(src.indexOf('head:["Binômes"'), src.indexOf('{t:"p", x:"Personne ne s\'est trompé'));
  const lus = [...tb.matchAll(/\$(\d)\{,\}(\d{3})\$/g)].map(m => Math.round(+(m[1] + "." + m[2]) * 1000));
  if (lus.join() !== SERIES[0].val.join()) ko(`le tableau du cours (${lus.join(" ")}) diffère de la série de la figure`);
  /* les valeurs du bécher écrites dans le cours = celles que la figure affiche */
  const b = stats(SERIES[1]), ecrit = `Pour le bécher : $@m{ρ} = ${fr(b.moyA, b.uA.d).replace(",", "{,}")}$ @u{g/mL} et $s = ${fr(b.sA.v, b.sA.d).replace(",", "{,}")}$ @u{g/mL}`;
  if (!src.includes(ecrit)) ko(`le cours ne dit pas « ${ecrit} »`);
  for (const S of SERIES) { const x = stats(S); for (const v of [fr(x.moyA, x.uA.d), fr(x.uA.v, x.uA.d)]) if (!src.includes(v.replace(",", "{,}") + "$")) ko(`la valeur ${v} (${S.nom}) n'apparaît pas dans le cours`); } }

for (const largeur of [1100, 400]) {
  await cmd("Emulation.setDeviceMetricsOverride", { width: largeur, height: 1400, deviceScaleFactor: 1, mobile: largeur < 600 });
  await cmd("Page.navigate", { url }); await sleep(1500);
  for (let i = 0; i < 60 && !(await ev('typeof GOTO === "function"')); i++) await sleep(250);
  await ev(`GOTO({page:"chap", chap:"incertitudes", onglet:"cours", fiche:null}); new Promise(r => setTimeout(r, 900))`);
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
    [...svg.querySelectorAll("rect, circle")].forEach(r => { const b = r.getBoundingClientRect();
      if (b.right > cadre.right + .5 || b.left < cadre.left - .5 || b.top < cadre.top - .5 || b.bottom > cadre.bottom + .5) d.push("une forme déborde du cadre");
      textes.forEach(x => { if (x.r.left < b.right - 1 && b.left < x.r.right - 1 && x.r.top < b.bottom - 1 && b.top < x.r.bottom - 1 && r.tagName === "circle") d.push("le point couvre « " + x.t + " »");
        if (r.hasAttribute("data-classe") && x.r.left < b.right - 1 && b.left < x.r.right - 1 && x.r.top < b.bottom - 1 && b.top < x.r.bottom - 1) d.push("une barre couvre « " + x.t + " »"); }); });
    return d;
  };`);
  const ecran = largeur < 600 ? "téléphone" : "ordinateur";
  const empreintes = new Map();

  for (let is = 0; is < SERIES.length; is++) for (let ik = 0; ik < SERIES[is].larg.length; ik++) {
    const S = SERIES[is], L = S.larg[ik], st = stats(S), cl = classes(S, L);
    const res = await ev(`(()=>{ const B=[...document.querySelectorAll(".figBoite")].find(b=>b.getAttribute("data-etat")&&JSON.parse(b.getAttribute("data-etat")).modele==="histogramme");
      B.querySelectorAll(".row button")[${is}].click(); const c=B.querySelector("input[type=range]"); c.value=${ik}; c.dispatchEvent(new Event("input")); B.scrollIntoView({block:"center"});
      const svg=B.querySelector("svg"), vb=svg.viewBox.baseVal, k=svg.getBoundingClientRect().width/vb.width;
      const barres=[...svg.querySelectorAll("rect[data-classe]")].map(r=>({x:+r.getAttribute("x"), w:+r.getAttribute("width"), y:+r.getAttribute("y"), h:+r.getAttribute("height")}));
      const textes=[...svg.querySelectorAll("text")].map(t=>({t:t.textContent, x:+t.getAttribute("x"), y:+t.getAttribute("y")}));
      const pt=svg.querySelector("circle[data-moyenne]"), bd=svg.querySelector("line[data-bande]");
      return {etat:JSON.parse(B.getAttribute("data-etat")), barres, textes, k, moy:+pt.getAttribute("cx"), bande:[+bd.getAttribute("x1"), +bd.getAttribute("x2")],
        lecture:B.querySelector(".figLecture").textContent, note:B.querySelector(".figNote").textContent, page:window.__page(B), nan:/NaN|undefined|Infinity/.test(B.textContent)}; })()`);
    etats++; const lab = `${ecran}, ${S.nom}, classes de ${fr(L / S.ech, S.dec)}`;
    res.page.forEach(d => ko(lab + " : " + d)); if (res.nan) ko(lab + " : NaN/undefined/Infinity affiché");
    const E = res.etat;
    if (E.classes !== cl.nb || E.effectifs.join() !== cl.eff.join()) ko(lab + ` : la figure range en ${E.effectifs.join("/")} ; attendu ${cl.eff.join("/")}`);
    if (res.barres.length !== cl.nb) ko(lab + ` : ${res.barres.length} barres dessinées, ${cl.nb} attendues`);
    /* l'axe : x(v) linéaire, de la première à la dernière borne */
    const xa = cl.lo / S.ech, xb = (cl.lo + cl.nb * L) / S.ech, X = v => 55 + (v - xa) * (420 - 55) / (xb - xa);
    const emax = Math.max(...cl.eff), ky = (225 - 60) / emax;
    res.barres.forEach((b, j) => {
      if (Math.abs(b.x - X((cl.lo + j * L) / S.ech)) > 0.5 || Math.abs(b.x + b.w - X((cl.lo + (j + 1) * L) / S.ech)) > 0.5) ko(lab + ` : barre ${j + 1} mal placée en abscisse`);
      if (Math.abs(b.h * res.k - cl.eff[j] * ky * res.k) > 1) ko(lab + ` : barre ${j + 1} haute de ${(b.h * res.k).toFixed(1)} px, attendu ${(cl.eff[j] * ky * res.k).toFixed(1)}`);
      if (Math.abs(b.y + b.h - 225) > 0.5) ko(lab + ` : barre ${j + 1} décollée de l'axe`);
      if (j && Math.abs(res.barres[j - 1].x + res.barres[j - 1].w - b.x) > 0.5) ko(lab + ` : barres ${j} et ${j + 1} non jointives`);
      const lib = res.textes.filter(t => Math.abs(t.x - (b.x + b.w / 2)) < 0.5 && t.y < 225 && t.y > 40 && /^\d+$/.test(t.t));
      if (cl.eff[j] && (lib.length !== 1 || +lib[0].t !== cl.eff[j])) ko(lab + ` : la barre ${j + 1} (effectif ${cl.eff[j]}) porte ${lib.map(t => t.t).join(",") || "aucun libellé"}`);
      if (!cl.eff[j] && lib.length) ko(lab + ` : la barre vide ${j + 1} porte un effectif`);
    });
    if (cl.eff.reduce((a, x) => a + x, 0) !== 16) ko(lab + " : les effectifs ne font pas 16");
    /* bornes écrites sous l'axe : chacune à sa place */
    const bornes = res.textes.filter(t => Math.abs(t.y - 245) < 0.5);
    if (!bornes.length) ko(lab + " : aucune borne écrite");
    bornes.forEach(t => { const v = +t.t.replace(",", "."); if (Math.abs(t.x - X(v)) > 0.5) ko(lab + ` : la borne « ${t.t} » est écrite à x = ${t.x.toFixed(1)}, sa place est ${X(v).toFixed(1)}`);
      if (Math.abs(Math.round((v * S.ech - cl.lo) / L) * L + cl.lo - v * S.ech) > 1e-6) ko(lab + ` : « ${t.t} » n'est pas une borne de classe`); });
    /* moyenne et bande ± s */
    if (Math.abs(res.moy - X(st.moy)) > 1 / res.k) ko(lab + " : point de la moyenne mal placé");
    if (Math.abs(res.bande[0] - X(st.moy - st.s)) > 1 / res.k || Math.abs(res.bande[1] - X(st.moy + st.s)) > 1 / res.k) ko(lab + " : bande ± s mal placée");
    /* lecture exacte */
    const att = `N = 16 mesures · moyenne = ${fr(st.moyA, st.uA.d)} g/mL · écart-type s = ${fr(st.sA.v, st.sA.d)} g/mL · incertitude-type de la moyenne u = ${fr(st.uA.v, st.uA.d)} g/mL · ${cl.nb} classes de ${fr(L / S.ech, S.dec)} g/mL`;
    if (res.lecture !== att) ko(lab + ` : lecture « ${res.lecture} », attendu « ${att} »`);
    if (!res.textes.some(t => t.t === `masse volumique ρ (g/mL), classes de ${fr(L / S.ech, S.dec)} g/mL`)) ko(lab + " : titre de l'axe absent ou faux");
    /* SENS de la note */
    const nV = cl.eff.filter(x => x === 0).length, nU = cl.eff.filter(x => x === 1).length;
    if (!res.note.trim()) ko(lab + " : note vide");
    if (cl.nb <= 3) { if (!/Trop peu de classes/.test(res.note)) ko(lab + " : 3 barres ou moins, la note ne dit pas « trop peu »"); }
    else if (nV > 0 || nU > cl.nb / 2) {
      if (!/Trop de classes/.test(res.note)) ko(lab + " : classe vide ou majorité de classes à une valeur, la note ne dit pas « trop de classes »");
      if (!res.note.includes(`sur ${cl.nb} barres`)) ko(lab + " : nombre de barres annoncé faux");
      if (nV && !res.note.includes(nV + (nV > 1 ? " sont vides" : " est vide"))) ko(lab + " : nombre de classes vides annoncé faux");
      if (!nV && /vide/.test(res.note)) ko(lab + " : la note annonce une classe vide qui n'existe pas");
      if (nU && !res.note.includes(nU + (nU > 1 ? " ne contiennent" : " ne contient"))) ko(lab + " : nombre de classes à une valeur annoncé faux");
    } else {
      if (/Trop/.test(res.note)) ko(lab + " : la note dit « trop » sur un histogramme lisible");
      const m = Math.max(...cl.eff), bord = cl.eff[0] === m || cl.eff[cl.nb - 1] === m;
      if (bord && /moins sur les bords/.test(res.note)) ko(lab + " : la note annonce « moins sur les bords », mais une classe du bord est la plus remplie");
      if (!bord && !/moins sur les bords/.test(res.note)) ko(lab + " : la plus grande classe est au milieu, la note ne le dit pas");
      if (bord && !/dépend du découpage/.test(res.note)) ko(lab + " : classe du bord la plus remplie, la note ne dit pas que le dessin dépend du découpage");
    }
    if (is === 1) {
      const r = Math.round(st.sA.v / stats(SERIES[0]).sA.v), m = res.note.match(/environ (\d+) fois plus grand/);
      if (!m || +m[1] !== r) ko(lab + ` : rapport des écarts-types annoncé ${m ? m[1] : "absent"}, attendu ${r}`);
    }
    for (const t of [res.lecture, res.note, ...res.textes.map(x => x.t)]) calculsFaux(t).forEach(d => ko(lab + " : " + d));
    /* le curseur change le dessin */
    const emp = res.barres.map(b => b.x.toFixed(1) + ":" + b.h.toFixed(1)).join("|");
    if (empreintes.has(emp)) ko(lab + ` : même dessin que « ${empreintes.get(emp)} »`); empreintes.set(emp, lab);
  }

  /* la figure fixe du type B */
  { const res = await ev(`(()=>{ const B=[...document.querySelectorAll(".figBoite")].find(b=>b.textContent.includes("Le modèle de l'évaluation de type B"));
      if(!B) return null; B.scrollIntoView({block:"center"}); return {page:window.__page(B), texte:B.textContent}; })()`);
    if (!res) ko(ecran + " : figure fixe du type B introuvable");
    else { res.page.forEach(d => ko(ecran + ", figure du type B : " + d)); calculsFaux(res.texte).forEach(d => ko(ecran + ", figure du type B : " + d)); etats++; }
  }

  /* tout le cours puis tous les exercices : aucun balisage brut, aucun calcul faux */
  for (const onglet of ["cours", "exos"]) {
    await ev(`GOTO({page:"chap", chap:"incertitudes", onglet:"${onglet}", fiche:null}); new Promise(r => setTimeout(r, 700))`);
    const r = await ev(`(()=>{ const v=document.querySelector("#view"); const c=v.cloneNode(true);
      c.querySelectorAll(".frac").forEach(f => f.replaceWith(f.children[0].textContent + "/" + f.children[1].textContent));
      return {texte:c.textContent, moy:v.querySelectorAll(".moy").length, larg:document.documentElement.scrollWidth, vue:window.innerWidth}; })()`);
    const brut = r.texte.match(/@[a-z]\{|\{,\}|\$|\\\\n/g);
    if (brut) ko(`${ecran}, onglet ${onglet} : balisage resté brut (${[...new Set(brut)].join(" ")})`);
    if (onglet === "cours" && r.moy < 5) ko(`${ecran} : la moyenne x̄ (@m) n'est pas rendue (${r.moy} occurrences)`);
    if (r.larg > r.vue + 1) ko(`${ecran}, onglet ${onglet} : la page déborde en largeur (${r.larg} px pour ${r.vue})`);
    calculsFaux(r.texte).forEach(d => ko(`${ecran}, onglet ${onglet} : ${d}`));
    etats++;
  }
}

ws.close(); chrome.kill(); serveur.close();
try { fs.rmSync(profil, { recursive: true, force: true }); } catch {}
for (const d of defauts) console.log("  " + d);
for (const e of erreurs) console.log("  console : " + e);
console.log(`${etats} états balayés, ${defauts.length} défauts, ${erreurs.length} erreurs de console.`);
process.exit(defauts.length || erreurs.length ? 1 : 0);
