/* =====================================================================
   1. Rendu des formules (physique et chimie)
   Notation utilisée dans les contenus :
     @f{a}{b}   fraction        @r{x}   racine carrée
     @v{AB}     vecteur         ^{...}  exposant     _{...}  indice
     @u{m/s}    unité — jamais mise en italique, contrairement aux
                grandeurs. C'est la convention de notation en sciences :
                la grandeur s'écrit en italique ($v$), son unité droite.
   Dans le texte courant, les formules sont encadrées par des $ .
   ===================================================================== */
(function(){
"use strict";

var FN = ["cos","sin","tan","ln","exp","log","lim","max","min",
          "de","du","et","ou","si","la","le","un","en","au","ce","on","il","ne",
          // symboles de la physique-chimie qui ne sont pas des variables
          "mol","kg","cm","km","mm","nm","Hz","Pa","Wh","kWh","eV","mL","dm",
          "Al","Ar","Ag","As","Au","Ba","Be","Br","Ca","Cd","Cl","Co","Cr",
          "Cs","Cu","Fe","Ga","Ge","He","Hg","Kr","Li","Mg","Mn","Na","Ne",
          "Ni","Pb","Pt","Rb","Se","Si","Sn","Sr","Ti","Xe","Zn"];

function esc(s){
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function mathCore(s){
  /* Ce qui doit rester droit est mis de côté avant tout le reste. La passe
     qui met les lettres isolées en italique transformerait sinon « m/s » en
     « m/s » penché — or en sciences, une unité droite et une grandeur en
     italique ne veulent pas dire la même chose. */
  var droits = [];
  function garder(html){
    droits.push(html);
    return "" + (droits.length - 1) + "";
  }
  /* Une unité peut porter un exposant — @u{mol^{-1}} — donc un niveau
     d'accolades imbriquées. On le traite avant la mise à l'abri, sans quoi
     le marqueur resterait tel quel à l'écran. */
  s = String(s).replace(/@u\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, function(_, u){
    var t = u.replace(/\^\{([^{}]*)\}/g, "<sup>$1</sup>")
             .replace(/_\{([^{}]*)\}/g, "<sub>$1</sub>")
             .replace(/\^([0-9+−-]+)/g, "<sup>$1</sup>");
    return garder('<span class="u">' + t + '</span>');
  });
  /* Même chose pour les formules chimiques : les symboles des éléments
     s'écrivent droits (H₂O, et non H₂O penché), mais leurs indices et
     leurs charges doivent être mis en place avant la mise à l'abri. */
  s = s.replace(/@c\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, function(_, f){
    var t = f.replace(/\^\{([^{}]*)\}/g, "<sup>$1</sup>")
             .replace(/_\{([^{}]*)\}/g, "<sub>$1</sub>")
             .replace(/\^([0-9+−-]+)/g, "<sup>$1</sup>")
             .replace(/_([0-9]+)/g, "<sub>$1</sub>");
    return garder('<span class="u">' + t + '</span>');
  });
  /* Distance algébrique : @a{OA'} donne OA′ surmonté d'une barre. La barre
     dit « position avec son signe », et non simple longueur : c'est tout le
     sens de la relation de conjugaison. Les noms de points restent droits,
     et l'apostrophe devient un vrai prime. */
  s = s.replace(/@a\{([^{}]*)\}/g, function(_, x){
    return garder('<span class="alg">' + x.replace(/'/g, "′") + '</span>');
  });
  // 3{,}5 : les accolades collent la virgule au nombre, elles ne s'affichent pas
  s = s.replace(/\{,\}/g, ",");
  /* Fractions. Le numérateur et le dénominateur peuvent contenir eux-mêmes
     des accolades — celles d'un indice ($C_{mère}$) ou d'une racine — d'où
     le motif en deux niveaux. Deux passes pour tolérer une fraction dans
     une fraction. */
  var FRAC = /@f\{((?:[^{}]|\{[^{}]*\})*)\}\{((?:[^{}]|\{[^{}]*\})*)\}/g;
  for(var i=0;i<2;i++){
    s = s.replace(FRAC, '<span class="frac"><span>$1</span><span>$2</span></span>');
  }
  s = s.replace(/@r\{([^{}]*)\}/g,'<span class="rad"><i>√</i><span>$1</span></span>');
  s = s.replace(/@v\{([^{}]*)\}/g,'<span class="vec">$1</span>');
  s = s.replace(/\^\{([^{}]*)\}/g,'<sup>$1</sup>');
  s = s.replace(/_\{([^{}]*)\}/g,'<sub>$1</sub>');
  s = s.replace(/\^(-?[0-9A-Za-z])/g,'<sup>$1</sup>');
  s = s.replace(/_(-?[0-9A-Za-z])/g,'<sub>$1</sub>');
  // variables en italique (une seule lettre), en sautant les balises
  s = s.replace(/&[a-zA-Z]+;|&#\d+;|<[^>]*>|[A-Za-zÀ-ÖØ-öø-ÿα-ωΑ-Ω]+/g,function(m){
    if(m.charAt(0)==="<" || m.charAt(0)==="&") return m;   // balises et entités intactes
    if(m.length>2 || FN.indexOf(m.toLowerCase())>=0) return m;   // cos, sin, ln, mots
    return "<em>"+m+"</em>";                           // a, x, v, ac…
  });
  // tout ce qui devait rester droit revient à sa place
  s = s.replace(/(\d+)/g, function(_, i){ return droits[+i]; });
  return s;
}
/* Les formules chimiques apparaissent aussi en plein texte, hors des
   dollars : « on verse de l'acide @c{HCl} ». On les traite donc des deux
   côtés, avec la même écriture droite et les mêmes indices. */
function chim(s){
  /* même tolérance que dans mathCore : une unité peut porter un exposant */
  s = String(s).replace(/@u\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, function(_, u){
    return '<span class="m u">' +
      u.replace(/\^\{([^{}]*)\}/g, "<sup>$1</sup>")
       .replace(/_\{([^{}]*)\}/g, "<sub>$1</sub>")
       .replace(/\^([0-9+−-]+)/g, "<sup>$1</sup>") + '</span>';
  }).replace(/\{,\}/g, ',');
  return s.replace(/@c\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, function(_, f){
    return '<span class="m u">' +
      f.replace(/\^\{([^{}]*)\}/g, "<sup>$1</sup>")
       .replace(/_\{([^{}]*)\}/g, "<sub>$1</sub>")
       .replace(/\^([0-9+−-]+)/g, "<sup>$1</sup>")
       .replace(/_([0-9]+)/g, "<sub>$1</sub>") + '</span>';
  });
}
// $ maths $  →  math ; **gras** ; texte échappé
function T(s){
  if(s==null) return "";
  var parts = esc(s).split("$"), out = "";
  for(var i=0;i<parts.length;i++){
    out += (i%2===1) ? '<span class="m">'+mathCore(parts[i])+"</span>" : chim(parts[i]);
  }
  out = out.replace(/\*\*([^*]+)\*\*/g,"<b>$1</b>");
  // on ré-autorise une poignée de balises de mise en forme, et rien d'autre
  return out.replace(/&lt;br\s*\/?&gt;/g,"<br>")
            .replace(/&lt;(\/?)b&gt;/g,"<$1b>")
            .replace(/&amp;(nbsp|lt|gt);/g,"&$1;");
}
// maths seules (pas de $)
function M(s){ return '<span class="m">'+mathCore(esc(s))+"</span>"; }
function MB(s){ return '<div class="mblock">'+mathCore(esc(s))+"</div>"; }

/* =====================================================================
   2. Petits utilitaires
   ===================================================================== */
function el(tag,cls,html){
  var e=document.createElement(tag);
  if(cls) e.className=cls;
  if(html!=null) e.innerHTML=html;
  return e;
}
function h(str){ var d=document.createElement("div"); d.innerHTML=str.trim(); return d.firstChild; }
function $(sel,root){ return (root||document).querySelector(sel); }
function $$(sel,root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
function toast(msg){
  var t=el("div","toast",T(msg));
  $("#toasts").appendChild(t);
  setTimeout(function(){ t.style.transition="opacity .3s"; t.style.opacity="0";
    setTimeout(function(){ t.remove(); },320); },2300);
}
function nowISO(){ return new Date().toISOString(); }
function uid(){ return "x"+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4); }
function pct(a,b){ return b>0 ? Math.round(100*a/b) : 0; }
function plural(n,s,p){ return n+" "+(n>1?(p||s+"s"):s); }

/* nombres : accepte 3,5   3.5   7/2   2,5e-3   6,02×10^23   1,5.10^-2 …
   L'écriture scientifique est indispensable en physique-chimie : une
   concentration se donne en 10⁻³ mol/L, une constante en 10²³. On accepte
   donc toutes les façons dont une élève peut la taper au clavier. */
function parseNum(str){
  if(str==null) return NaN;
  var s=String(str).trim().replace(/\s/g,"").replace(/,/g,".")
        .replace(/^\+/,"").replace(/−|–/g,"-");
  if(s==="") return NaN;
  // « 6,02×10^23 », « 3.10^-4 », « 2*10**5 » : un facteur et une puissance de dix
  var puiss = s.match(/^(-?\d+(?:\.\d+)?)[×x*·.]?10(?:\^|\*\*)?\(?(-?\d+)\)?$/i);
  if(puiss) return parseFloat(puiss[1]) * Math.pow(10, parseFloat(puiss[2]));
  // « 10^-3 » tout seul, avec ou sans signe
  var p10 = s.match(/^(-?)10(?:\^|\*\*)?\(?(-?\d+)\)?$/i);
  if(p10) return (p10[1] ? -1 : 1) * Math.pow(10, parseFloat(p10[2]));
  // « 2,5e-3 », la notation des calculatrices
  if(/^-?\d+(\.\d+)?e[+-]?\d+$/i.test(s)) return parseFloat(s);
  var frac=s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if(frac) return parseFloat(frac[1])/parseFloat(frac[2]);
  if(/^-?\d+(\.\d+)?$/.test(s)) return parseFloat(s);
  return NaN;
}
/* Fenêtre d'un diagnostic numérique : à quelle distance de la valeur `d`
   d'un distracteur faut-il tomber pour recevoir SON message ?

   Définition unique, partagée par les trois endroits qui en ont besoin :
   l'affichage (`diagnostic()`, 04-vue.js), le filtre de doublons des
   générateurs (`fabriquer()`, 06-generateurs.js) et le script d'audit
   (outils/verifier-diags.mjs). Elle a longtemps été recopiée dans chacun,
   et ces copies avaient divergé : `fabriquer()` comparait deux
   distracteurs avec la tolérance ABSOLUE de la bonne réponse, ce qui
   écartait comme doublons des erreurs parfaitement distinctes dès que la
   réponse était grande devant elles (768 cas sur 120 000 tirages rejoués).
   Une seule définition, donc, et personne ne la recopie.

   La fenêtre est relative (5 % de la valeur du distracteur, jamais moins
   que la tolérance de la réponse), puis bornée trois fois : jamais plus de
   la moitié de la valeur elle-même, jamais plus de la moitié de la
   distance à la bonne réponse, jamais plus de la moitié de la distance à
   chaque AUTRE distracteur de `exo.diag` — pour qu'un diagnostic
   n'empiète ni sur zéro, ni sur la réponse juste, ni sur un autre
   diagnostic. Deux fenêtres ne peuvent donc plus se recouvrir, par
   construction.

   La troisième borne date du 2026-09-23. Sans elle, le plancher `tol` (la
   tolérance de la bonne réponse, parfois bien plus grande que les petits
   distracteurs) gonflait leurs fenêtres jusqu'à les faire se chevaucher :
   `fo-poids`, Vénus, m = 12 — réponse 106,8 N, tol 1,068 ; distracteurs
   m/g = 1,348 et g/m = 0,742, fenêtre de 1,348 à ±0,674 : l'élève qui
   calculait g/m recevait le message de m/g.

   CONTREPARTIE, à garder en tête : la fenêtre d'un distracteur dépend
   désormais de la liste des autres (`exo.diag`), pas seulement de sa
   valeur et de la réponse. Dans `fabriquer()` elle est calculée sur la
   liste complète des candidats, à l'affichage sur la liste conservée —
   les deux scripts d'audit rejouent ce même contrat (0 mort, 0 masqué
   mesuré). Un appelant qui passerait une liste partielle obtiendrait une
   fenêtre plus large. */
function fenetreDiag(exo, d){
  if(d === 0) return 0;
  var fen = Math.max(exo.tol || 0.0005, Math.abs(d)*0.05);
  fen = Math.min(fen, Math.abs(d)/2, Math.abs(d - exo.rep)/2);
  var ds = exo.diag || [];
  for(var i=0; i<ds.length; i++){
    var u = ds[i].v;
    if(isFinite(u) && u !== d) fen = Math.min(fen, Math.abs(u - d)/2);
  }
  return fen;
}

/* normalisation de texte pour comparer des réponses écrites */
function norm(s){
  return String(s||"").toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g,"")
    /* l'apostrophe compte comme un espace : « vers l'avant », « vers l’avant »
       et « vers l avant » sont la même réponse */
    .replace(/['’‘`´]/g," ")
    .replace(/\s+/g," ").replace(/[.;!?]+$/,"").trim();
}

/* =====================================================================
   3. Mémoire locale (progression, révisions, cours importés)
   ===================================================================== */
var KEY="cahier-physique.v1";
var S = { chap:{}, perso:[], srs:{}, controles:[], entrain:{}, theme:null };
function load(){
  try{
    var raw=localStorage.getItem(KEY);
    if(raw){ var o=JSON.parse(raw); for(var k in o) S[k]=o[k]; }
  }catch(e){}
}
function save(silencieux){
  // Une sauvegarde silencieuse enregistre un état reçu du serveur : elle ne
  // doit pas prétendre être une modification, sinon l'horodatage adopté est perdu.
  if(!silencieux) S.maj = Date.now();
  try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){}
  // en version connectée, la couche IA renvoie l'état au serveur
  if(!silencieux && window.APRES_SAVE) window.APRES_SAVE();
}
function chapState(id){
  if(!S.chap[id]) S.chap[id]={ lu:[], exos:{} };
  if(!S.chap[id].lu) S.chap[id].lu=[];
  if(!S.chap[id].exos) S.chap[id].exos={};
  return S.chap[id];
}
/* Chaque section de cours porte un id fixe (sec.id, "s1", "s2"...),
   attribué une fois pour toutes et jamais réutilisé — voir CLAUDE.md,
   § « Id de section ». `S.chap[id].lu` stockait auparavant des index de
   position, qui se décalent silencieusement dès qu'une section s'insère
   au milieu d'un chapitre. Cette fonction, appelée une seule fois (une
   fois COURS chargé), convertit les anciens tableaux d'index en
   tableaux d'id. */
function migrerSections(cours){
  if(S.migSections) return { reinitialises:[] };
  var reinitialises = [];
  // chapitres déjà modifiés avant l'existence des id : impossible de
  // reconstruire avec certitude ce qui avait été coché, mieux vaut
  // repartir propre que garder une correspondance fausse.
  var CHAPITRES_A_REINITIALISER = ["titrage", "cristaux"];
  (cours || []).forEach(function(c){
    var st = chapState(c.id);
    var ancien = st.lu.some(function(x){ return typeof x === "number"; });
    if(!ancien) return;
    if(CHAPITRES_A_REINITIALISER.indexOf(c.id) >= 0){
      st.lu = [];
      reinitialises.push(c.titre || c.id);
    } else {
      var vus = {};
      st.lu.filter(function(x){ return typeof x === "number"; }).forEach(function(i){
        var sec = c.sections && c.sections[i];
        if(sec && sec.id) vus[sec.id] = true;
      });
      st.lu = Object.keys(vus);
    }
  });
  S.migSections = 1;
  save();
  return { reinitialises: reinitialises };
}
load();
if(!S.srs) S.srs={};
if(!S.controles) S.controles=[];
if(!S.entrain) S.entrain={};

/* =====================================================================
   3 bis. Révision espacée
   Chaque exercice raté devient une carte. À chaque réussite la carte
   monte d'un cran et revient plus tard ; à chaque échec elle retombe
   au premier cran et revient tout de suite.
   ===================================================================== */
var PALIERS = [0, 1, 3, 7, 16, 35, 70];   // en jours
var JOUR = 86400000;
function srsCle(chapId, exoId){ return chapId+"::"+exoId; }
function srsMaj(chapId, exoId, ok, meta){
  var k = srsCle(chapId, exoId);
  var c = S.srs[k];
  if(!ok){
    S.srs[k] = { palier:0, du:Date.now(), vu:Date.now(), ratages:((c&&c.ratages)||0)+1,
                 chapId:chapId, exoId:exoId, titre:(meta&&meta.titre)||(c&&c.titre)||"" };
  } else if(c){
    var p = Math.min(c.palier+1, PALIERS.length-1);
    c.palier = p; c.vu = Date.now(); c.du = Date.now() + PALIERS[p]*JOUR;
    if(p >= PALIERS.length-1) delete S.srs[k];   // acquis : on retire la carte
  }
  save();
}
function srsCartes(){
  var out=[];
  for(var k in S.srs){ var c=S.srs[k]; c.cle=k; out.push(c); }
  return out.sort(function(a,b){ return a.du-b.du; });
}
function srsDues(){
  var t=Date.now();
  return srsCartes().filter(function(c){ return c.du<=t; });
}
function srsQuand(c){
  var d = Math.ceil((c.du - Date.now())/JOUR);
  if(d<=0) return "à réviser maintenant";
  if(d===1) return "demain";
  if(d<14) return "dans "+d+" jours";
  var sem = Math.round(d/7);
  return "dans "+sem+" semaine"+(sem>1?"s":"");
}
function shuffle(a){
  a=a.slice();
  for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; }
  return a;
}
function duree(ms){
  var s=Math.max(0,Math.round(ms/1000));
  return Math.floor(s/60)+" min "+String(s%60).padStart(2,"0")+" s";
}
function chrono(ms){
  var s=Math.max(0,Math.round(ms/1000));
  return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
}

/* =====================================================================
   4. Thème
   ===================================================================== */
function applyTheme(){
  if(S.theme) document.documentElement.setAttribute("data-theme",S.theme);
  else document.documentElement.removeAttribute("data-theme");
}
applyTheme();

/* exposé au reste de l'application */
window.APP = {
  esc:esc, T:T, M:M, MB:MB, el:el, h:h, $:$, $$:$$, toast:toast,
  uid:uid, pct:pct, plural:plural, parseNum:parseNum, norm:norm, nowISO:nowISO,
  fenetreDiag:fenetreDiag,
  S:S, save:save, chapState:chapState, migrerSections:migrerSections, applyTheme:applyTheme,
  srsMaj:srsMaj, srsCartes:srsCartes, srsDues:srsDues, srsQuand:srsQuand,
  shuffle:shuffle, duree:duree, chrono:chrono, PALIERS:PALIERS
};
})();
