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
   d'une instance. options : { afficherAngles, afficherLiaisons, molecule }.
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
      derniere = {atomes:[i, j, k], valeur:a, texte:mol.atomes[i].nom + "–" + mol.atomes[j].nom + "–" + mol.atomes[k].nom + " = " + fr(a, 2) + "°"};
      lecture.textContent = "angle " + derniere.texte + " (sommet : " + mol.atomes[j].nom + ")";
      publier(); etiquettes();
      return a;
    }
    v.setClickable({}, true, function(atome){
      if(!mesure) return;
      choix.push(atome.index);
      styles();
      if(choix.length === 3){ mesurerAngle(choix[0], choix[1], choix[2]); choix = []; styles(); }
      else lecture.textContent = "atome " + choix.length + " choisi : " + mol.atomes[atome.index].nom + (choix.length === 1 ? " — clique le sommet de l'angle" : " — clique le troisième atome");
    });
    function bouton(txt, f){ var b = el("button", "btn gho sm", txt); b.type = "button"; b.onclick = f; outils.appendChild(b); return b; }
    var vue0 = null;
    var bR = bouton("Réinitialiser la vue", function(){ v.setView(vue0); v.render(); publier(); });
    var bM = bouton("Mesurer un angle", function(){ mesure = !mesure; choix = []; styles();
      bM.className = "btn " + (mesure ? "pri" : "gho") + " sm";
      lecture.textContent = mesure ? "Clique trois atomes : le deuxième est le sommet de l'angle." : (derniere ? "angle " + derniere.texte : ""); });
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
    note.textContent = "Géométrie mesurée (NIST CCCBDB) : les longueurs et les angles affichés sont recalculés à partir des positions des atomes.";
    publier();
    return {viewer:v, molecule:mol, boite:boite, mesurerAngle:mesurerAngle, reinitialiser:function(){ bR.onclick(); },
      tourner:function(deg, axe){ v.rotate(deg, axe || "y"); v.render(); publier(); }};
  })
  .catch(function(e){ lecture.textContent = "Figure 3D indisponible : " + e.message; throw e; });
}

window.MoleculeViewer = { monter:monter, lireMol:lireMol, angle:angle, distance:distance };
})();
