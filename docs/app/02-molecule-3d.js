/* =====================================================================
   Figure « molecule-3d » : une molécule en boules et bâtonnets, qu'on fait
   tourner à la souris (ch7, géométrie des molécules organiques).
   ---------------------------------------------------------------------
   Le rendu est confié à 3Dmol.js (public/app/vendor/3dmol/, BSD-3-Clause,
   version épinglée, voir son LISEZMOI), chargé À LA DEMANDE : la
   bibliothèque pèse un demi-mégaoctet, inutile tant qu'aucune figure 3D
   n'est affichée. Les molécules viennent de public/app/molecules/*.mol
   (géométries expérimentales du NIST CCCBDB, voir outils/molecules/).

   Les longueurs et les angles AFFICHÉS ne sont jamais recopiés : ils se
   recalculent depuis les coordonnées des atomes. Tourner la molécule ne
   déplace que la caméra, pas les atomes : un angle mesuré est donc le même
   quelle que soit la vue, et le balayage le vérifie.

   API : window.MoleculeViewer.monter(divId, cheminMol, options) → Promise
   d'une instance. options : { afficherAngles, afficherLiaisons, molecule,
   sourceType } (sourceType : meta.source_type de references.json, pour la note).
   ===================================================================== */
(function(){
"use strict";

/* le dossier de ce script : app/ dans l'appli, ../public/app/ depuis une page de test */
var BASE = (function(){
  var s = document.currentScript && document.currentScript.src;
  return s ? s.replace(/[^\/]*$/, "") : "app/";
})();
var BIBLIO = BASE + "vendor/3dmol/3Dmol-min.js";
var chargement = null;
function chargerBibliotheque(){
  if(window.$3Dmol) return Promise.resolve(window.$3Dmol);
  if(chargement) return chargement;
  chargement = new Promise(function(ok, ko){
    var s = document.createElement("script");
    s.src = BIBLIO;
    s.onload = function(){ window.$3Dmol ? ok(window.$3Dmol) : ko(new Error("3Dmol.js chargé mais introuvable")); };
    s.onerror = function(){ chargement = null; ko(new Error("3Dmol.js introuvable : " + BIBLIO)); };
    document.head.appendChild(s);
  });
  return chargement;
}

/* ---- lecture d'un fichier MOL V2000 : atomes (nommés élément + rang) et liaisons ---- */
function lireMol(texte){
  var l = texte.split(/\r?\n/), compte = l[3] || "";
  var na = parseInt(compte.slice(0, 3), 10), nl = parseInt(compte.slice(3, 6), 10);
  if(!(na > 0) || !/V2000/.test(compte)) throw new Error("fichier MOL V2000 illisible");
  var atomes = [], liaisons = [];
  for(var i = 0; i < na; i++){
    var a = l[4 + i];
    var el = a.slice(31, 34).trim();
    atomes.push({nom:el + (i + 1), el:el, x:+a.slice(0, 10), y:+a.slice(10, 20), z:+a.slice(20, 30)});
  }
  for(var j = 0; j < nl; j++){
    var b = l[4 + na + j];
    liaisons.push({a:parseInt(b.slice(0, 3), 10) - 1, b:parseInt(b.slice(3, 6), 10) - 1, ordre:parseInt(b.slice(6, 9), 10)});
  }
  return {titre:(l[0] || "").trim(), atomes:atomes, liaisons:liaisons};
}
function distance(p, q){ return Math.hypot(p.x - q.x, p.y - q.y, p.z - q.z); }
/* angle p–c–q au sommet c, en degrés */
function angle(p, c, q){
  var u = [p.x - c.x, p.y - c.y, p.z - c.z], v = [q.x - c.x, q.y - c.y, q.z - c.z];
  var pr = u[0]*v[0] + u[1]*v[1] + u[2]*v[2];
  var co = pr/(Math.hypot(u[0], u[1], u[2])*Math.hypot(v[0], v[1], v[2]));
  return Math.acos(Math.max(-1, Math.min(1, co)))*180/Math.PI;
}
var fr = function(x, d){ return x.toFixed(d).replace(".", ","); };
/* le nom AFFICHÉ d'un atome : « C(1) », « O(2) » ; « C1 » ressemblait aux numéros du nom
   de la molécule, et « O2 » à la molécule de dioxygène */
function affiche(mol, i){ var a = mol.atomes[i]; return a.el + "(" + (i + 1) + ")"; }
function voisins(mol, i){
  return mol.liaisons.filter(function(l){ return l.a === i || l.b === i; }).map(function(l){ return l.a === i ? l.b : l.a; });
}
function el(tag, cls, txt){ var e = document.createElement(tag); if(cls) e.className = cls; if(txt != null) e.textContent = txt; return e; }

function monter(divId, cheminMol, options){
  options = options || {};
  var hote = typeof divId === "string" ? document.getElementById(divId) : divId;
  if(!hote) return Promise.reject(new Error("conteneur introuvable : " + divId));
  var url = /^(https?:|file:|\/)/.test(cheminMol) ? cheminMol : BASE + cheminMol;
  var boite = el("div", "figBoite"), scene = el("div"), outils = el("div", "row"), lecture = el("div", "figLecture"), note = el("div", "figNote");
  scene.style.cssText = "position:relative;width:100%;height:320px";
  outils.style.cssText = "justify-content:center;flex-wrap:wrap;gap:6px";
  boite.appendChild(scene); boite.appendChild(outils); boite.appendChild(lecture); boite.appendChild(note);
  hote.appendChild(boite);
  lecture.textContent = "chargement de la molécule…";
  return Promise.all([chargerBibliotheque(), fetch(url).then(function(r){ if(!r.ok) throw new Error("molécule introuvable : " + url); return r.text(); })])
  .then(function(res){
    var $3Dmol = res[0], texte = res[1], mol = lireMol(texte);
    var fond = getComputedStyle(document.body).backgroundColor || "white";
    var v = $3Dmol.createViewer(scene, {backgroundColor:fond, antialias:true});
    var modele = v.addModel(texte, "sdf");
    var angles = !!options.afficherAngles, longueurs = !!options.afficherLiaisons, mesure = false, choix = [], derniere = null;
    var STYLE = {stick:{radius:0.14}, sphere:{scale:0.28}};
    function etiquettes(){
      v.removeAllLabels();
      if(longueurs) mol.liaisons.forEach(function(l){
        var p = mol.atomes[l.a], q = mol.atomes[l.b];
        v.addLabel(fr(distance(p, q)*100, 1) + " pm", {position:{x:(p.x + q.x)/2, y:(p.y + q.y)/2, z:(p.z + q.z)/2}, fontSize:12, fontColor:"black", backgroundColor:"white", backgroundOpacity:0.8});
      });
      /* un angle par atome central (au moins deux voisins) : celui de ses deux premiers voisins */
      if(angles) mol.atomes.forEach(function(c, i){
        var vs = voisins(mol, i);
        if(vs.length < 2) return;
        if(derniere && derniere.atomes[1] === i) return;      // la mesure, au même sommet, la remplace
        var a = angle(mol.atomes[vs[0]], c, mol.atomes[vs[1]]);
        v.addLabel(fr(a, 2) + "°", {position:{x:c.x, y:c.y, z:c.z}, fontSize:12, fontColor:"white", backgroundColor:"#333", backgroundOpacity:0.85});
      });
      if(derniere) v.addLabel(derniere.texte, {position:mol.atomes[derniere.atomes[1]], fontSize:13, fontColor:"black", backgroundColor:"#ffd84d", backgroundOpacity:0.95});
      v.render();
    }
    function styles(){
      v.setStyle({}, STYLE);
      choix.forEach(function(i){ v.setStyle({index:i}, {stick:{radius:0.14}, sphere:{scale:0.34, color:"#f2a900"}}); });
      v.render();
    }
    /* la mesure : à partir des coordonnées des atomes du modèle, que la rotation ne touche pas */
    function mesurerAngle(i, j, k){
      var at = modele.selectedAtoms({});
      var p = at[i], c = at[j], q = at[k];
      var a = angle(p, c, q);
      derniere = {atomes:[i, j, k], valeur:a, texte:affiche(mol, i) + "–" + affiche(mol, j) + "–" + affiche(mol, k) + " = " + fr(a, 2) + "°"};
      lecture.textContent = "angle " + derniere.texte + " (sommet : " + affiche(mol, j) + ")";
      publier(); etiquettes();
      return a;
    }
    v.setClickable({}, true, function(atome){
      if(!mesure) return;
      choix.push(atome.index);
      styles();
      if(choix.length === 3){
        /* un angle de liaison n'a de sens que si le sommet est lié aux deux autres atomes :
           sinon (un atome caché derrière un autre, un clic dans le désordre), on le dit */
        var vs = voisins(mol, choix[1]);
        if(choix[0] === choix[2] || choix[0] === choix[1] || choix[1] === choix[2]){
          /* le même atome deux fois : l'« angle » vaudrait 0° (ou n'existerait pas) */
          lecture.textContent = "Tu as cliqué deux fois le même atome : choisis trois atomes différents, l'atome du milieu étant relié aux deux autres.";
        } else if(vs.indexOf(choix[0]) < 0 || vs.indexOf(choix[2]) < 0){
          /* un angle de liaison n'a de sens que si le sommet est lié aux deux autres atomes */
          lecture.textContent = "Le 2ᵉ atome cliqué, " + affiche(mol, choix[1]) + ", n'est pas relié par un bâtonnet à la fois à " + affiche(mol, choix[0]) + " et à " + affiche(mol, choix[2]) +
            " : ce n'est pas l'angle entre deux liaisons. Recommence : un atome, puis l'atome du milieu auquel il est relié, puis un troisième relié lui aussi à l'atome du milieu. Si un atome en cache un autre, fais d'abord tourner la molécule.";
        } else mesurerAngle(choix[0], choix[1], choix[2]);
        choix = []; styles();
      }
      else lecture.textContent = "atome " + choix.length + " choisi : " + affiche(mol, atome.index) + (choix.length === 1 ? " — clique maintenant l'atome du milieu (le sommet)" : " — clique le troisième atome");
    });
    function bouton(txt, f){ var b = el("button", "btn gho sm", txt); b.type = "button"; b.onclick = f; outils.appendChild(b); return b; }
    var vue0 = null;
    var bR = bouton("Réinitialiser la vue", function(){ v.setView(vue0); v.render(); publier(); });
    var bM = bouton("Mesurer un angle", function(){ mesure = !mesure; choix = []; styles();
      bM.className = "btn " + (mesure ? "pri" : "gho") + " sm";
      lecture.textContent = mesure ? "Clique trois atomes : le deuxième doit être l'atome du milieu, relié aux deux autres (le sommet de l'angle)." : (derniere ? "angle " + derniere.texte : ""); });
    var bA = bouton("", function(){ angles = !angles; maj(); });
    var bL = bouton("", function(){ longueurs = !longueurs; maj(); });
    function maj(){ bA.textContent = angles ? "Cacher les angles" : "Afficher les angles"; bL.textContent = longueurs ? "Cacher les longueurs" : "Afficher les longueurs"; etiquettes(); publier(); }
    function publier(){
      boite.setAttribute("data-etat", JSON.stringify({modele:"molecule-3d", molecule:options.molecule || mol.titre, atomes:mol.atomes.map(function(a){ return a.nom; }),
        mesure:derniere && {atomes:derniere.atomes.map(function(i){ return mol.atomes[i].nom; }), valeur:derniere.valeur}, angles:angles, longueurs:longueurs, vue:v.getView()}));
    }
    /* zoomTo cadre au moins 25 Å (minimum de 3Dmol) : une petite molécule y serait
       minuscule. On rapproche selon son étendue réelle (rayon autour du centre). */
    var cx = 0, cy = 0, cz = 0;
    mol.atomes.forEach(function(a){ cx += a.x; cy += a.y; cz += a.z; });
    cx /= mol.atomes.length; cy /= mol.atomes.length; cz /= mol.atomes.length;
    var rayon = Math.max.apply(null, mol.atomes.map(function(a){ return Math.hypot(a.x - cx, a.y - cy, a.z - cz); }));
    styles(); v.zoomTo(); v.zoom(Math.min(6, 7.5/(rayon + 1.2))); v.render(); vue0 = v.getView();
    maj();
    lecture.textContent = "Fais tourner la molécule en la faisant glisser.";
    /* ce que vaut la géométrie dépend de sa source (outils/molecules/references.json, meta.source_type) */
    var ORIGINE = {
      mesure_cartesienne:"Géométrie mesurée en laboratoire (NIST CCCBDB)",
      mesure_parametres:"Atomes placés pour respecter des longueurs et des angles mesurés en laboratoire (NIST CCCBDB)",
      transfert:"Pas de mesure complète pour cette molécule : atomes placés avec les longueurs et les angles mesurés sur l'éthanol et le butane (NIST CCCBDB)",
      calcule:"Géométrie calculée par ordinateur, pas mesurée (méthode B3LYP/6-31G*, NIST CCCBDB)"
    };
    note.textContent = (ORIGINE[options.sourceType] || "Géométrie de la molécule") + " : le logiciel mesure lui-même longueurs et angles sur ces positions.";
    publier();
    return {viewer:v, molecule:mol, boite:boite, mesurerAngle:mesurerAngle, reinitialiser:function(){ bR.onclick(); },
      tourner:function(deg, axe){ v.rotate(deg, axe || "y"); v.render(); publier(); }};
  })
  .catch(function(e){ lecture.textContent = "Figure 3D indisponible : " + e.message; throw e; });
}

window.MoleculeViewer = { monter:monter, lireMol:lireMol, angle:angle, distance:distance };

/* ---- la figure du cours (ch7, s9) : {t:"figi", nom:"molecule-3d"} ----
   Une rangée de boutons choisit la molécule ; sous la vue 3D, une observation
   qui dit quoi regarder. Les angles cités sont ceux de
   outils/molecules/references.json (mesurés, sauf le propan-2-ol, calculé), et
   source_type recopie meta.source_type : outils/balayage-geometrie.mjs vérifie
   les deux contre ce fichier et contre les coordonnées affichées. */
var MOLECULES_3D = [
  {cle:"methane", nom:"méthane", source_type:"mesure_cartesienne",
   obs:"**Le tétraèdre.** Le carbone est au centre, ses quatre liaisons pointent vers les quatre sommets d'un tétraèdre : $109{,}47°$ entre deux liaisons, l'angle du modèle du chapitre 4. Mesure-le : active « Mesurer un angle », puis clique un H, le C, puis un autre H."},
  {cle:"butane", nom:"butane", source_type:"mesure_parametres",
   obs:"**La chaîne en zigzag.** Écrite à plat, $@c{CH_3-CH_2-CH_2-CH_3}$ semble droite. En vrai, chaque carbone garde ses liaisons en tétraèdre et la chaîne se plie en zigzag : l'angle C–C–C mesuré vaut $113{,}8°$, pas $180°$."},
  {cle:"ethanol", nom:"éthanol", source_type:"mesure_parametres",
   obs:"**Un oxygène coudé.** L'angle C–O–H mesuré vaut $105{,}4°$ : l'oxygène porte deux doublets non liants, invisibles ici mais qui prennent de la place ; ils serrent ses deux liaisons l'une contre l'autre, et l'angle se referme sous $109{,}5°$ (chapitre 4). Autour des carbones, le tétraèdre : C–C–O $107{,}8°$."},
  {cle:"ethanal", nom:"éthanal", source_type:"mesure_parametres",
   obs:"**Un carbone plan.** Le carbone du $@c{C}$=$@c{O}$ et ses trois voisins sont dans un même plan : C–C=O $123{,}9°$, C–C–H $117{,}5°$ (le H porté par le carbone du C=O, pas un H du méthyle), proches des $120°$ du modèle. Le carbone du méthyle, lui, reste en tétraèdre."},
  {cle:"propanone", nom:"propanone", source_type:"mesure_parametres",
   obs:"**Le C=O au milieu.** Le même carbone plan que dans l'éthanal (C–C–C $116°$, C–C=O $122°$), mais pris entre deux carbones : c'est ce qui en fait une cétone. Mesure les trois angles autour de ce carbone : leur somme fait $360°$, signe qu'ils sont dans un même plan."},
  {cle:"acide-ethanoique", nom:"acide éthanoïque", source_type:"mesure_parametres",
   obs:"**Le groupe COOH est plan.** Autour du carbone du carboxyle, C–C=O $126{,}6°$ et C–C–O(H) $110{,}6°$ (l'oxygène qui porte l'hydrogène) : ses trois liaisons sont dans un même plan, et même le H du groupe $@c{OH}$ est dans ce plan. L'oxygène du $@c{OH}$ est coudé : C–O–H $106{,}3°$."},
  {cle:"propan-1-ol", nom:"propan-1-ol", source_type:"transfert",
   obs:"**Isomère n° 1.** Mêmes atomes que le propan-2-ol ($@c{C_3H_8O}$), mais le groupe $@c{OH}$ est au bout de la chaîne : zigzag C–C–C $113{,}8°$, puis O–C–C $107{,}8°$."},
  {cle:"propan-2-ol", nom:"propan-2-ol", source_type:"calcule",
   obs:"**Isomère n° 2.** Le groupe $@c{OH}$ est sur le carbone du milieu : la molécule est plus ramassée que le propan-1-ol. Les deux angles O–C–C ne sont pas égaux ($111{,}1°$ et $106{,}2°$) : le H du groupe $@c{OH}$ n'est pas placé symétriquement, il est du côté d'un $@c{CH_3}$ (l'angle y est plus ouvert) et à l'opposé de l'autre. Détail hors programme : retiens seulement que la molécule n'est pas parfaitement symétrique. (Pour cette molécule, la géométrie a été calculée par ordinateur, faute de mesure.)"}
];
window.MODELES_EXT = window.MODELES_EXT || {};
window.MODELES_EXT["molecule-3d"] = function(){
  var T = (window.APP && window.APP.T) || function(x){ return x; };
  var boite = el("div"), rang = el("div", "row"), titre = el("span", "small", "la molécule"), hote = el("div"), obs = el("div", "figNote");
  rang.style.cssText = "flex-wrap:wrap;justify-content:center;align-items:center;gap:6px";
  titre.style.cssText = "color:var(--ink2);min-width:100%;text-align:center";
  rang.appendChild(titre);
  var bts = MOLECULES_3D.map(function(m, k){
    var b = el("button", "btn gho", m.nom); b.type = "button";
    b.onclick = function(){ choisir(k); };
    rang.appendChild(b); return b;
  });
  function choisir(k){
    var m = MOLECULES_3D[k];
    bts.forEach(function(b, i){ b.className = "btn " + (i === k ? "pri" : "gho"); });
    if(boite.__instance) try { boite.__instance.viewer.clear(); } catch(e){}      // libère l'ancienne vue WebGL
    while(hote.firstChild) hote.removeChild(hote.firstChild);
    obs.innerHTML = T(m.obs);
    boite.setAttribute("data-molecule", m.cle);
    boite.setAttribute("data-source-type", m.source_type);
    boite.__instance = null;
    monter(hote, "molecules/" + m.cle + ".mol", {molecule:m.cle, sourceType:m.source_type})
      .then(function(inst){ if(boite.getAttribute("data-molecule") === m.cle) boite.__instance = inst; })   // pour le balayage
      .catch(function(){});
  }
  boite.appendChild(rang); boite.appendChild(hote); boite.appendChild(obs);
  boite.setAttribute("data-modele", "molecule-3d");
  choisir(0);
  return boite;
};
window.MOLECULES_3D = MOLECULES_3D;
})();
