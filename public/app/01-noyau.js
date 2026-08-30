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
  s = String(s).replace(/@u\{([^{}]*)\}/g, function(_, u){
    return garder('<span class="u">' + u + '</span>');
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
  // 3{,}5 : les accolades collent la virgule au nombre, elles ne s'affichent pas
  s = s.replace(/\{,\}/g, ",");
  // fractions (deux passes pour tolérer une imbrication simple)
  for(var i=0;i<2;i++){
    s = s.replace(/@f\{([^{}]*)\}\{([^{}]*)\}/g,
      '<span class="frac"><span>$1</span><span>$2</span></span>');
  }
  s = s.replace(/@r\{([^{}]*)\}/g,'<span class="rad"><i>√</i><span>$1</span></span>');
  s = s.replace(/@v\{([^{}]*)\}/g,'<span class="vec">$1</span>');
  s = s.replace(/\^\{([^{}]*)\}/g,'<sup>$1</sup>');
  s = s.replace(/_\{([^{}]*)\}/g,'<sub>$1</sub>');
  s = s.replace(/\^(-?[0-9A-Za-z])/g,'<sup>$1</sup>');
  s = s.replace(/_(-?[0-9A-Za-z])/g,'<sub>$1</sub>');
  // variables en italique (une seule lettre), en sautant les balises
  s = s.replace(/&[a-zA-Z]+;|&#\d+;|<[^>]*>|[A-Za-zα-ωΑ-Ω]+/g,function(m){
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
  s = String(s).replace(/@u\{([^{}]*)\}/g, '<span class="m u">$1</span>')
               .replace(/\{,\}/g, ',');
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
/* normalisation de texte pour comparer des réponses écrites */
function norm(s){
  return String(s||"").toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g,"")
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
  S:S, save:save, chapState:chapState, applyTheme:applyTheme,
  srsMaj:srsMaj, srsCartes:srsCartes, srsDues:srsDues, srsQuand:srsQuand,
  shuffle:shuffle, duree:duree, chrono:chrono, PALIERS:PALIERS
};
})();
