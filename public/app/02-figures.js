/* =====================================================================
   Moteur de figures géométriques
   ---------------------------------------------------------------------
   Deux types de blocs :
     {t:"fig",  ...}  figure fixe, décrite en coordonnées mathématiques
     {t:"figi", nom:"..."}  figure manipulable (le nom désigne un modèle)
   Les couleurs viennent des jetons CSS : les figures suivent le thème.
   ===================================================================== */
(function(){
"use strict";
var A = window.APP, T = A.T, el = A.el;
var NS = "http://www.w3.org/2000/svg";

function n(tag, attrs){
  var e = document.createElementNS(NS, tag);
  for(var k in attrs) if(attrs[k]!=null) e.setAttribute(k, attrs[k]);
  return e;
}
function coul(nom){
  var n = nom || "ink";
  // une couleur littérale (#ff0000, rgb(...)) passe telle quelle : c'est ce qui
  // permet de dessiner un spectre, dont les teintes ne doivent pas suivre le thème
  if(/^(#|rgb)/.test(n)) return n;
  return "var(--" + n + ")";
}

/* ---- repère : coordonnées maths -> pixels ----
   Par défaut le repère est orthonormé : un schéma doit garder ses
   proportions, sinon un cercle devient une ellipse et un angle droit
   n'en est plus un. Mais un graphique de mesures (une absorbance en
   fonction d'une concentration, par exemple) n'a aucune raison de
   l'être : ses deux axes portent des grandeurs sans rapport. Ces
   figures-là déclarent libre:true et reçoivent deux échelles. */
function repere(vue, w, h, marge, libre){
  var m = marge==null ? 26 : marge;
  var x0=vue[0], y0=vue[1], x1=vue[2], y1=vue[3];
  var kx = (w-2*m)/(x1-x0), ky = (h-2*m)/(y1-y0);
  if(!libre) kx = ky = Math.min(kx, ky);      // repère orthonormé
  var cx = m + ((w-2*m) - kx*(x1-x0))/2;
  var cy = m + ((h-2*m) - ky*(y1-y0))/2;
  return {
    X: function(x){ return cx + (x-x0)*kx; },
    Y: function(y){ return h - cy - (y-y0)*ky; },
    x: function(px){ return x0 + (px-cx)/kx; },
    y: function(py){ return y0 + (h-cy-py)/ky; },
    k: Math.min(kx,ky), kx: kx, ky: ky, vue: vue
  };
}

/* ---- fond : grille et axes ---- */
function fond(svg, R, opts){
  var v = R.vue, i;
  if(opts.grille !== false){
    var g = n("g", {"stroke":coul("line"), "stroke-width":1, "opacity":.75});
    for(i=Math.ceil(v[0]); i<=v[2]; i++)
      g.appendChild(n("line",{x1:R.X(i), y1:R.Y(v[1]), x2:R.X(i), y2:R.Y(v[3])}));
    for(i=Math.ceil(v[1]); i<=v[3]; i++)
      g.appendChild(n("line",{x1:R.X(v[0]), y1:R.Y(i), x2:R.X(v[2]), y2:R.Y(i)}));
    svg.appendChild(g);
  }
  if(opts.axes !== false){
    var a = n("g", {"stroke":coul("ink3"), "stroke-width":1.6});
    if(v[1]<=0 && v[3]>=0) a.appendChild(n("line",{x1:R.X(v[0]),y1:R.Y(0),x2:R.X(v[2]),y2:R.Y(0)}));
    if(v[0]<=0 && v[2]>=0) a.appendChild(n("line",{x1:R.X(0),y1:R.Y(v[1]),x2:R.X(0),y2:R.Y(v[3])}));
    svg.appendChild(a);
    if(opts.graduations !== false){
      var t = n("g", {"fill":coul("ink3"), "font-size":10, "font-family":"system-ui"});
      for(i=Math.ceil(v[0]); i<=v[2]; i++) if(i!==0 && v[1]<=0 && v[3]>=0)
        t.appendChild(txt(R.X(i), R.Y(0)+13, String(i), "middle"));
      for(i=Math.ceil(v[1]); i<=v[3]; i++) if(i!==0 && v[0]<=0 && v[2]>=0)
        t.appendChild(txt(R.X(0)-7, R.Y(i)+4, String(i), "end"));
      svg.appendChild(t);
    }
  }
}
function txt(x, y, s, ancre){
  var e = n("text", {x:x, y:y, "text-anchor":ancre||"start"});
  e.textContent = s;
  return e;
}

/* ---- animation SMIL : un schéma fixe peut « respirer » ----
   o.anime est un tableau de {attr, values, dur, begin, repeat} pour une
   valeur qui oscille (attributeName=attr), ou {transform, values, dur,
   begin} pour une rotation/translation (animateTransform), ou
   {motion:path, dur, begin} pour un point qui suit un tracé
   (animateMotion). Chaque spec devient un enfant SMIL de l'élément e :
   c'est ce qui le rend animé sans toucher au reste du moteur. */
function animer(e, specs){
  (specs||[]).forEach(function(s){
    var attrs = {dur:s.dur||"2s", repeatCount:s.repeat==null?"indefinite":s.repeat};
    if(s.begin!=null) attrs.begin = s.begin;
    var tag;
    if(s.motion){ tag = "animateMotion"; attrs.path = s.motion; }
    else if(s.transform){ tag = "animateTransform"; attrs.attributeName = "transform"; attrs.type = s.transform; }
    else { tag = "animate"; attrs.attributeName = s.attr; }
    if(s.values!=null) attrs.values = s.values;
    if(s.from!=null) attrs.from = s.from;
    if(s.to!=null) attrs.to = s.to;
    e.appendChild(n(tag, attrs));
  });
  return e;
}

/* ---- flèche de vecteur ---- */
function fleche(svg, R, de, a, couleur, nom, anime, nomEn, epMin){
  var x1=R.X(de[0]), y1=R.Y(de[1]), x2=R.X(a[0]), y2=R.Y(a[1]);
  var dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy) || 1;
  /* Une flèche courte se dessinait mal de deux façons à la fois. Avec une
     pointe fixe de 9 px, le corps devenait nul ou négatif dès L < 11 px : la
     ligne partait à l'envers et la pointe débordait derrière la queue. Et
     réduire la seule pointe ne suffit pas : sa demi-largeur vaut 0,45 t,
     contre 1,2 px pour la demi-épaisseur du trait, si bien qu'en dessous de
     5,3 px elle est intégralement avalée par le trait qui la porte — on voit
     un tiret arrondi, sans direction lisible.
     On réduit donc la flèche ENTIÈRE, pointe et épaisseur dans le même
     rapport : sa forme est alors exactement la même à toutes les tailles
     (demi-pointe / demi-trait = 3,375 quelle que soit L), et sa longueur
     reste strictement proportionnelle à la grandeur représentée. Au-delà de
     18 px le facteur vaut 1 : aucune flèche normale n'est modifiée. */
  var s=Math.min(1, L/18);
  /* epMin (optionnel, absent partout sauf `polarite`) : épaisseur de trait
     minimale, en px. La flèche entière est grossie dans le même rapport,
     donc sa forme ne change pas ; sa longueur, elle, ne bouge jamais. Pas
     en dessous de 5 px de long : la pointe (9·s px) déborderait derrière la
     queue. Une flèche n'est ainsi jamais plus épaisse qu'une plus longue
     qu'elle, pour peu que la figure passe le même epMin à toutes. */
  if(epMin && L >= 5) s=Math.max(s, epMin/2.4);
  var ux=dx/L, uy=dy/L, t=9*s;
  var g = n("g", {stroke:coul(couleur), fill:coul(couleur), "stroke-width":2.4*s,
                  "stroke-linecap":"round"});
  g.appendChild(n("line",{x1:x1,y1:y1,x2:x2-ux*t*0.8,y2:y2-uy*t*0.8}));
  g.appendChild(n("polygon",{ points:
    (x2)+","+(y2)+" "+
    (x2-ux*t-uy*t*0.45)+","+(y2-uy*t+ux*t*0.45)+" "+
    (x2-ux*t+uy*t*0.45)+","+(y2-uy*t-ux*t*0.45), stroke:"none"}));
  if(anime) animer(g, anime);
  svg.appendChild(g);
  if(nom){
    /* Par défaut le libellé se pose au milieu de la flèche, décalé de 14 px
       perpendiculairement. Une figure peut imposer sa position par `nomEn`
       (coordonnées du repère) quand ce placement tomberait sur un objet —
       typiquement à l'intérieur de la caisse, pour une force courte partant
       de son centre. */
    var e = nomEn
      ? txt(R.X(nomEn[0]), R.Y(nomEn[1]) + 4, nom, "middle")
      : txt(x1+dx/2 - uy*14, y1+dy/2 + ux*14 + 4, nom, "middle");
    e.setAttribute("fill", coul(couleur));
    e.setAttribute("font-size", 14);
    e.setAttribute("font-style", "italic");
    e.setAttribute("font-family", "Source Serif 4, Georgia, serif");
    svg.appendChild(e);
  }
}

/* ---- angle droit / angle marqué ---- */
function marqueAngle(svg, R, en, v1, v2, droit){
  var a1 = Math.atan2(R.Y(en[1])-R.Y(v1[1]), R.X(v1[0])-R.X(en[0]));
  var a2 = Math.atan2(R.Y(en[1])-R.Y(v2[1]), R.X(v2[0])-R.X(en[0]));
  var px = R.X(en[0]), py = R.Y(en[1]);
  if(droit){
    var t = 13;
    var c1x = px + Math.cos(a1)*t, c1y = py - Math.sin(a1)*t;
    var c2x = px + Math.cos(a2)*t, c2y = py - Math.sin(a2)*t;
    svg.appendChild(n("polyline", {
      points: c1x+","+c1y+" "+(c1x+c2x-px)+","+(c1y+c2y-py)+" "+c2x+","+c2y,
      fill:"none", stroke:coul("rouge"), "stroke-width":2 }));
  } else {
    var r = 22;
    var d = "M "+(px+Math.cos(a1)*r)+" "+(py-Math.sin(a1)*r)+
            " A "+r+" "+r+" 0 0 "+((a2-a1+2*Math.PI)%(2*Math.PI) > Math.PI ? 1 : 0)+
            " "+(px+Math.cos(a2)*r)+" "+(py-Math.sin(a2)*r);
    svg.appendChild(n("path",{d:d, fill:"none", stroke:coul("ambre"), "stroke-width":2}));
  }
}

/* ---- point nommé ---- */
function point(svg, R, x, y, nom, couleur, dessous, anime){
  var px=R.X(x), py=R.Y(y);
  var cp = n("circle",{cx:px, cy:py, r:4.5, fill:coul(couleur||"ink")});
  if(anime) animer(cp, anime);
  svg.appendChild(cp);
  if(nom){
    var e = txt(px+8, py + (dessous ? 18 : -9), nom);
    e.setAttribute("fill", coul(couleur||"ink"));
    e.setAttribute("font-size", 15);
    e.setAttribute("font-family", "Source Serif 4, Georgia, serif");
    e.setAttribute("font-weight", 600);
    svg.appendChild(e);
  }
}

/* =====================================================================
   Figure fixe
   ===================================================================== */
function figure(b){
  var w = b.w || 380, h = b.h || 300;
  var boite = el("div","figBoite");
  if(b.titre) boite.appendChild(el("div","figTitre", T(b.titre)));
  var svg = n("svg", {viewBox:"0 0 "+w+" "+h, class:"fig", role:"img"});
  svg.setAttribute("aria-label", b.alt || b.titre || "figure géométrique");
  var R = repere(b.vue || [-1,-1,6,5], w, h, b.marge, b.libre);
  fond(svg, R, b);
  (b.objets||[]).forEach(function(o){ dessiner(svg, R, o); });
  boite.appendChild(svg);
  if(b.note) boite.appendChild(el("div","figNote", T(b.note)));
  return boite;
}

function dessiner(svg, R, o){
  switch(o.t){
    case "point": {
      /* o.chute:[dx,dy] fait tomber le point en boucle, d'un bout à l'autre du
         déplacement donné en coordonnées maths — une goutte qui tombe, un
         objet qui chute — sans que la figure ait à calculer les pixels.
         Le chemin d'animateMotion est un DÉPLACEMENT RELATIF ("M0 0 L..."),
         pas des coordonnées absolues : point() place déjà le cercle à son
         cx/cy réel, et animateMotion applique son chemin comme une
         translation SUPPLÉMENTAIRE par-dessus cette position. Un chemin en
         coordonnées absolues additionne deux fois la même position de
         départ, et le point atterrit hors de la figure. */
      var animeP = o.anime ? o.anime.slice() : [];
      if(o.chute){
        var p0x=R.X(o.x), p0y=R.Y(o.y);
        var p1x=R.X(o.x+(o.chute[0]||0)), p1y=R.Y(o.y+(o.chute[1]||0));
        animeP.push({motion:"M0 0 L"+(p1x-p0x)+" "+(p1y-p0y), dur:o.chuteDur||"1.2s"});
      }
      point(svg,R,o.x,o.y,o.nom,o.couleur,o.dessous,animeP.length?animeP:null);
      break;
    }
    case "seg": {
      var eseg = n("line",{x1:R.X(o.de[0]),y1:R.Y(o.de[1]),
        x2:R.X(o.a[0]),y2:R.Y(o.a[1]), stroke:coul(o.couleur||"ink"),
        "stroke-width":o.epais||2.2, "stroke-linecap":"round",
        "stroke-dasharray": o.pointille ? "5 5" : null});
      if(o.anime) animer(eseg, o.anime);
      svg.appendChild(eseg);
      break;
    }
    case "droite": {
      var v=R.vue, dx=o.a[0]-o.de[0], dy=o.a[1]-o.de[1];
      var t1=-50, t2=50;
      svg.appendChild(n("line",{
        x1:R.X(o.de[0]+dx*t1), y1:R.Y(o.de[1]+dy*t1),
        x2:R.X(o.de[0]+dx*t2), y2:R.Y(o.de[1]+dy*t2),
        stroke:coul(o.couleur||"bleu"), "stroke-width":o.epais||2.2,
        "stroke-dasharray": o.pointille ? "5 5" : null}));
      break;
    }
    case "vec": fleche(svg,R,o.de,o.a,o.couleur||"bleu",o.nom,o.anime,o.nomEn,o.epMin); break;
    case "cercle": {
      var ecerc = n("circle",{cx:R.X(o.c[0]), cy:R.Y(o.c[1]), r:o.r*R.k,
        fill: o.remplir ? coul(o.couleur||"bleu") : "none",
        "fill-opacity": o.remplir ? (o.opacite==null ? .1 : o.opacite) : null,
        stroke:coul(o.couleur||"bleu"), "stroke-width":2.2,
        "stroke-dasharray": o.pointille ? "5 5" : null});
      if(o.anime) animer(ecerc, o.anime);
      svg.appendChild(ecerc);
      break;
    }
    case "poly":
      svg.appendChild(n("polygon",{
        points:o.pts.map(function(p){ return R.X(p[0])+","+R.Y(p[1]); }).join(" "),
        fill: o.remplir ? coul(o.couleur||"bleu") : "none",
        "fill-opacity": o.remplir ? .12 : null,
        stroke:coul(o.couleur||"bleu"), "stroke-width":2.2}));
      break;
    case "angle": marqueAngle(svg,R,o.en,o.de,o.a,o.droit); break;
    case "texte": {
      var e = txt(R.X(o.x), R.Y(o.y), o.txt, o.ancre||"middle");
      e.setAttribute("fill", coul(o.couleur||"ink2"));
      e.setAttribute("font-size", o.taille||13);
      e.setAttribute("font-family", "system-ui");
      svg.appendChild(e);
      break;
    }
    /* un spectre infrarouge réel, sans repères : le document d'un exercice
       ({t:"spectreir", cle:"propan-2-ol"}) ; la figure se trace en pixels,
       sur toute la largeur de la boîte, et ignore le repère R */
    case "spectreir": {
      var vb = svg.getAttribute("viewBox").split(" ").map(Number);
      traceSpectreIR(svg, vb[2], vb[3], o.cle, {annot:false, empreinte:o.empreinte});
      break;
    }
    case "courbe": {
      var f = window.COURBES && window.COURBES[o.f];
      if(!f) break;
      var d="", vv=R.vue, i;
      for(i=0;i<=240;i++){
        var x = vv[0] + (vv[2]-vv[0])*i/240, y = f(x);
        if(!isFinite(y) || y<vv[1]-5 || y>vv[3]+5){ d += ""; continue; }
        d += (d ? " L " : "M ") + R.X(x) + " " + R.Y(y);
      }
      svg.appendChild(n("path",{d:d, fill:"none", stroke:coul(o.couleur||"bleu"),
        "stroke-width":2.6}));
      break;
    }

    /* ---------------- primitives de physique-chimie ---------------- */

    /* rectangle : un bloc, une cuve, un solide */
    case "rect": {
      var rx = R.X(o.x), ry = R.Y(o.y + (o.h || 1));
      var erect = n("rect", {
        x:rx, y:ry, width:(o.w||1)*R.kx, height:(o.h||1)*R.ky,
        rx: o.rond==null ? 3 : o.rond,
        fill: o.remplir===false ? "none" : coul(o.couleur||"bleu"),
        "fill-opacity": o.opacite==null ? .14 : o.opacite,
        stroke: coul(o.couleur||"bleu"), "stroke-width":2.2,
        "stroke-dasharray": o.pointille ? "5 5" : null });
      if(o.anime) animer(erect, o.anime);
      svg.appendChild(erect);
      if(o.nom){
        var er = txt(R.X(o.x + (o.w||1)/2), R.Y(o.y + (o.h||1)/2) + 5, o.nom, "middle");
        er.setAttribute("fill", coul(o.couleur||"ink"));
        er.setAttribute("font-size", o.taille || 14);
        er.setAttribute("font-family", "Source Serif 4, Georgia, serif");
        er.setAttribute("font-weight", 600);
        svg.appendChild(er);
      }
      break;
    }

    /* sol hachuré : ce sur quoi l'objet repose */
    case "sol": {
      var sx1 = R.X(o.de), sx2 = R.X(o.a), sy = R.Y(o.y || 0);
      var gs = n("g", {stroke:coul(o.couleur||"ink3"), "stroke-width":1.6});
      gs.appendChild(n("line",{x1:sx1, y1:sy, x2:sx2, y2:sy, "stroke-width":2.4}));
      for(var hx = sx1; hx < sx2 - 4; hx += 11)
        gs.appendChild(n("line",{x1:hx, y1:sy+11, x2:hx+9, y2:sy}));
      svg.appendChild(gs);
      break;
    }

    /* courbe définie par ses points : mesures, spectres, dosages */
    case "courbeXY": {
      if(!o.pts || o.pts.length < 2) break;
      var dxy = o.pts.map(function(p, i){
        return (i ? "L " : "M ") + R.X(p[0]) + " " + R.Y(p[1]);
      }).join(" ");
      var ecxy = n("path", {d:dxy, fill:"none", stroke:coul(o.couleur||"bleu"),
        "stroke-width":o.epais||2.6, "stroke-linejoin":"round", "stroke-linecap":"round",
        "stroke-dasharray": o.pointille ? "6 5" : null});
      if(o.anime) animer(ecxy, o.anime);
      svg.appendChild(ecxy);
      if(o.points) o.pts.forEach(function(p){
        svg.appendChild(n("circle",{cx:R.X(p[0]), cy:R.Y(p[1]), r:3.4,
          fill:coul(o.couleur||"bleu")}));
      });
      /* un point qui parcourt la courbe : on VOIT la grandeur évoluer, pas
         seulement son état final */
      if(o.point){
        var epm = n("circle", {r:o.point.r||5, fill:coul(o.point.couleur||o.couleur||"bleu")});
        animer(epm, [{motion:dxy, dur:o.point.dur||"2.5s", begin:o.point.begin}]);
        svg.appendChild(epm);
      }
      break;
    }

    /* axes fléchés et nommés, pour un graphique de mesures */
    case "axes": {
      var v = R.vue;
      var ox = R.X(o.x0==null ? v[0] : o.x0), oy = R.Y(o.y0==null ? v[1] : o.y0);
      var ga = n("g", {stroke:coul("ink3"), fill:coul("ink3"), "stroke-width":1.8});
      ga.appendChild(n("line",{x1:ox, y1:oy, x2:R.X(v[2]), y2:oy}));
      ga.appendChild(n("line",{x1:ox, y1:oy, x2:ox, y2:R.Y(v[3])}));
      ga.appendChild(n("polygon",{points:(R.X(v[2])+6)+","+oy+" "+(R.X(v[2])-4)+","+(oy-4)+" "+(R.X(v[2])-4)+","+(oy+4), stroke:"none"}));
      ga.appendChild(n("polygon",{points:ox+","+(R.Y(v[3])-6)+" "+(ox-4)+","+(R.Y(v[3])+4)+" "+(ox+4)+","+(R.Y(v[3])+4), stroke:"none"}));
      svg.appendChild(ga);
      if(o.ax){
        var ea = txt(R.X(v[2]) + 2, oy + 18, o.ax, "end");
        ea.setAttribute("fill", coul("ink2")); ea.setAttribute("font-size", 12.5);
        ea.setAttribute("font-family", "system-ui"); svg.appendChild(ea);
      }
      if(o.ay){
        var eb = txt(ox + 6, R.Y(v[3]) + 2, o.ay, "start");
        eb.setAttribute("fill", coul("ink2")); eb.setAttribute("font-size", 12.5);
        eb.setAttribute("font-family", "system-ui"); svg.appendChild(eb);
      }
      break;
    }

    /* dipôle électrique : un fil qui porte un symbole normalisé */
    case "dip": dipole(svg, R, o); break;

    /* --- schéma de Lewis --- */
    case "atome": {
      var ax = R.X(o.x), ay = R.Y(o.y);
      if(o.fond !== false){
        var eat = n("circle",{cx:ax, cy:ay, r:o.r ? o.r*R.k : 15,
          fill:coul("surface"), stroke:"none"});
        if(o.anime) animer(eat, o.anime);
        svg.appendChild(eat);
      }
      var ea2 = txt(ax, ay + 6, o.nom || "", "middle");
      ea2.setAttribute("fill", coul(o.couleur||"ink"));
      ea2.setAttribute("font-size", o.taille || 19);
      ea2.setAttribute("font-family", "Source Serif 4, Georgia, serif");
      ea2.setAttribute("font-weight", 600);
      svg.appendChild(ea2);
      break;
    }
    case "liaison": {
      var lx1=R.X(o.de[0]), ly1=R.Y(o.de[1]), lx2=R.X(o.a[0]), ly2=R.Y(o.a[1]);
      var ldx=lx2-lx1, ldy=ly2-ly1, lL=Math.hypot(ldx,ldy)||1;
      var lux=ldx/lL, luy=ldy/lL, lnx=-luy, lny=lux;
      var marge = o.marge==null ? 15 : o.marge;      // on s'arrête avant le symbole
      var nb = o.n || 1, ecart = 4;
      var gl = n("g", {stroke:coul(o.couleur||"ink"), "stroke-width":2.2, "stroke-linecap":"round"});
      for(var li=0; li<nb; li++){
        var d0 = (li - (nb-1)/2) * ecart;
        gl.appendChild(n("line",{
          x1:lx1+lux*marge+lnx*d0, y1:ly1+luy*marge+lny*d0,
          x2:lx2-lux*marge+lnx*d0, y2:ly2-luy*marge+lny*d0}));
      }
      if(o.anime) animer(gl, o.anime);
      svg.appendChild(gl);
      break;
    }
    /* doublet non liant : deux points collés à l'atome, dans une direction */
    case "doublet": {
      var a0 = (o.dir||0) * Math.PI/180;
      var dcx = R.X(o.x) + Math.cos(a0)*(o.d==null?19:o.d);
      var dcy = R.Y(o.y) - Math.sin(a0)*(o.d==null?19:o.d);
      var pnx = -Math.sin(a0), pny = -Math.cos(a0);
      var gd = n("g", {fill:coul(o.couleur||"bleu")});
      gd.appendChild(n("circle",{cx:dcx+pnx*4, cy:dcy+pny*4, r:2.6}));
      gd.appendChild(n("circle",{cx:dcx-pnx*4, cy:dcy-pny*4, r:2.6}));
      if(o.anime) animer(gd, o.anime);
      svg.appendChild(gd);
      break;
    }

    /* --- optique --- */
    case "lentille": {
      var lcx = R.X(o.x), htL = (o.h||3)*R.k/2;
      var gL = n("g", {stroke:coul(o.couleur||"bleu"), "stroke-width":2.4, fill:"none",
                       "stroke-linecap":"round"});
      gL.appendChild(n("line",{x1:lcx, y1:R.Y(o.y||0)-htL, x2:lcx, y2:R.Y(o.y||0)+htL}));
      var t2 = o.divergente ? -8 : 8;
      [[-1, -htL], [1, htL]].forEach(function(s){
        gL.appendChild(n("line",{x1:lcx-t2, y1:R.Y(o.y||0)+s[1]+(o.divergente?0:s[0]*0),
                                 x2:lcx, y2:R.Y(o.y||0)+s[1]}));
        gL.appendChild(n("line",{x1:lcx+t2, y1:R.Y(o.y||0)+s[1], x2:lcx, y2:R.Y(o.y||0)+s[1]}));
      });
      svg.appendChild(gL);
      break;
    }
    /* objet ou image : une flèche verticale posée sur l'axe */
    case "objet": {
      fleche(svg, R, [o.x, o.y0==null?0:o.y0], [o.x, (o.y0==null?0:o.y0)+o.h],
             o.couleur||"vert", null);
      if(o.nom){
        var eo = txt(R.X(o.x), R.Y((o.y0==null?0:o.y0)+o.h) + (o.h<0?16:-9), o.nom, "middle");
        eo.setAttribute("fill", coul(o.couleur||"vert"));
        eo.setAttribute("font-size", 14);
        eo.setAttribute("font-family", "Source Serif 4, Georgia, serif");
        eo.setAttribute("font-weight", 600);
        svg.appendChild(eo);
      }
      break;
    }
    /* rayon lumineux : segment avec une pointe au milieu */
    case "rayon": {
      var rx1=R.X(o.de[0]), ry1=R.Y(o.de[1]), rx2=R.X(o.a[0]), ry2=R.Y(o.a[1]);
      var rdx=rx2-rx1, rdy=ry2-ry1, rL=Math.hypot(rdx,rdy)||1;
      var rux=rdx/rL, ruy=rdy/rL;
      /* La pointe (9 px) est posée à la fraction `pointe` du rayon (0,55 par
         défaut). Sur un rayon court (0,55·L < 9, soit L < 16,4 px) sa base
         passait derrière le départ, et une fraction fournie n'était pas
         bornée. On borne donc la fraction : base au plus tôt au départ,
         pointe au plus tard à l'arrivée ; et si le rayon est plus court que
         la pointe elle-même (L < 9 px), pointe et épaisseur sont réduites
         ensemble, comme dans fleche(). Pour tout rayon sain, rien ne change
         (rs = 1, fraction intacte) : aucun rayon du cahier n'est touché. La
         tolérance de 1e-6 px laisse en place une fraction calculée par la
         figure pour poser la base pile au départ. */
      var rs = rL >= 9 ? 1 : rL/9;
      var rq = o.pointe==null ? .55 : o.pointe;
      if(rq*rL < 9*rs - 1e-6) rq = Math.min(1, 9*rs/rL);
      if(rq > 1) rq = 1;
      var rt = 9*rs, rw = 4.5*rs;
      var gr = n("g", {stroke:coul(o.couleur||"ambre"), fill:coul(o.couleur||"ambre"),
                       "stroke-width":(o.epais||2)*rs, "stroke-linecap":"round",
                       "stroke-dasharray": o.pointille ? "6 5" : null});
      gr.appendChild(n("line",{x1:rx1, y1:ry1, x2:rx2, y2:ry2}));
      var mx = rx1 + rdx*rq, my = ry1 + rdy*rq;
      gr.appendChild(n("polygon",{ "stroke-dasharray":null, stroke:"none", points:
        mx+","+my+" "+(mx-rux*rt-ruy*rw)+","+(my-ruy*rt+rux*rw)+" "+
        (mx-rux*rt+ruy*rw)+","+(my-ruy*rt-rux*rw) }));
      if(o.anime) animer(gr, o.anime);
      svg.appendChild(gr);
      break;
    }

    /* verrerie : bécher, erlenmeyer, burette */
    case "becher": {
      var bx=R.X(o.x), by=R.Y(o.y), bw=(o.w||2)*R.k, bh=(o.h||2.4)*R.k;
      var gb = n("g", {stroke:coul(o.couleur||"ink3"), "stroke-width":2.2, fill:"none",
                       "stroke-linejoin":"round"});
      gb.appendChild(n("path",{d:"M "+bx+" "+(by-bh)+" L "+bx+" "+by+" L "+(bx+bw)+" "+by+
                                  " L "+(bx+bw)+" "+(by-bh)}));
      if(o.niveau){
        var nh = bh*o.niveau;
        var eliq = n("rect",{x:bx+2, y:by-nh, width:bw-4, height:nh-2,
          fill:coul(o.liquide||"bleu"), "fill-opacity":.22});
        if(o.anime) animer(eliq, o.anime);
        svg.appendChild(eliq);
        gb.appendChild(n("line",{x1:bx, y1:by-nh, x2:bx+bw, y2:by-nh,
          stroke:coul(o.liquide||"bleu"), "stroke-width":1.8}));
      }
      svg.appendChild(gb);
      if(o.nom){
        var eb2 = txt(bx+bw/2, by+18, o.nom, "middle");
        eb2.setAttribute("fill", coul("ink2")); eb2.setAttribute("font-size", 12.5);
        eb2.setAttribute("font-family", "system-ui"); svg.appendChild(eb2);
      }
      break;
    }
  }
}

/* =====================================================================
   Dipôles électriques
   ---------------------------------------------------------------------
   Un dipôle se décrit par le segment de fil qu'il occupe : le symbole
   normalisé est dessiné au milieu, orienté comme le fil, et le fil est
   interrompu de part et d'autre pour lui laisser la place.
   ===================================================================== */
function dipole(svg, R, o){
  var x1=R.X(o.de[0]), y1=R.Y(o.de[1]), x2=R.X(o.a[0]), y2=R.Y(o.a[1]);
  var dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy)||1;
  var ux=dx/L, uy=dy/L;
  var cx=(x1+x2)/2, cy=(y1+y2)/2;
  var deg = Math.atan2(dy,dx)*180/Math.PI;
  var demi = o.type==="fil" ? 0 : (o.demi || 15);
  var c = coul(o.couleur || "ink");

  var fil = n("g", {stroke:c, "stroke-width":2.2, "stroke-linecap":"round"});
  /* o.flux fait défiler des tirets le long du fil : le courant qui circule,
     pas seulement le circuit qui existe. */
  var l1 = n("line",{x1:x1, y1:y1, x2:cx-ux*demi, y2:cy-uy*demi,
    "stroke-dasharray": o.flux ? "6 5" : null});
  var l2 = n("line",{x1:cx+ux*demi, y1:cy+uy*demi, x2:x2, y2:y2,
    "stroke-dasharray": o.flux ? "6 5" : null});
  if(o.flux){
    var sens = o.flux === "retour" ? "0;11" : "0;-11";
    animer(l1, [{attr:"stroke-dashoffset", values:sens, dur:o.fluxDur||"0.9s"}]);
    animer(l2, [{attr:"stroke-dashoffset", values:sens, dur:o.fluxDur||"0.9s"}]);
  }
  fil.appendChild(l1);
  fil.appendChild(l2);
  svg.appendChild(fil);
  if(o.type==="fil") return;

  var g = n("g", {transform:"translate("+cx+","+cy+") rotate("+deg+")",
                  stroke:c, fill:"none", "stroke-width":2.2, "stroke-linecap":"round"});
  switch(o.type){
    case "pile":                       // générateur : une barre longue, une courte
      g.appendChild(n("line",{x1:-3, y1:-11, x2:-3, y2:11, "stroke-width":2.6}));
      g.appendChild(n("line",{x1:4, y1:-5.5, x2:4, y2:5.5, "stroke-width":4.5}));
      break;
    case "resistor":                   // conducteur ohmique : rectangle
      g.appendChild(n("rect",{x:-14, y:-7, width:28, height:14, fill:coul("surface")}));
      break;
    case "lampe":                      // lampe : cercle barré d'une croix
      g.appendChild(n("circle",{cx:0, cy:0, r:12, fill:coul("surface")}));
      g.appendChild(n("line",{x1:-8.5, y1:-8.5, x2:8.5, y2:8.5}));
      g.appendChild(n("line",{x1:-8.5, y1:8.5, x2:8.5, y2:-8.5}));
      break;
    case "moteur":
    case "volt":
    case "amp": {
      g.appendChild(n("circle",{cx:0, cy:0, r:12, fill:coul("surface")}));
      var lettre = o.type==="moteur" ? "M" : (o.type==="volt" ? "V" : "A");
      var e = n("text",{x:0, y:5, "text-anchor":"middle", stroke:"none", fill:c,
        "font-size":14, "font-family":"Source Serif 4, Georgia, serif", "font-weight":600,
        transform:"rotate("+(-deg)+")"});
      e.textContent = lettre;
      g.appendChild(e);
      break;
    }
    case "inter":                      // interrupteur, ouvert ou fermé
      g.appendChild(n("circle",{cx:-12, cy:0, r:2.6, fill:c}));
      g.appendChild(n("circle",{cx:12, cy:0, r:2.6, fill:c}));
      g.appendChild(n("line",{x1:-12, y1:0, x2:10, y2: o.ferme ? 0 : -10}));
      break;
    case "diode":
      g.appendChild(n("polygon",{points:"-8,-9 -8,9 9,0", fill:c, stroke:"none"}));
      g.appendChild(n("line",{x1:9, y1:-9, x2:9, y2:9}));
      break;
    default:
      g.appendChild(n("rect",{x:-14, y:-7, width:28, height:14, fill:coul("surface")}));
  }
  svg.appendChild(g);

  if(o.nom){
    var nx = cx - uy*(o.cote===-1 ? -24 : 24), ny = cy + ux*(o.cote===-1 ? -24 : 24);
    var en = txt(nx, ny+5, o.nom, "middle");
    en.setAttribute("fill", c);
    en.setAttribute("font-size", 14);
    en.setAttribute("font-family", "Source Serif 4, Georgia, serif");
    en.setAttribute("font-weight", 600);
    svg.appendChild(en);
  }
}

/* =====================================================================
   Figures manipulables — on déplace un curseur, la figure suit
   ===================================================================== */
var MODELES = {};

/* les nombres affichés suivent l'usage français : virgule décimale */
function fr(n, d){
  return n.toFixed(d==null ? 2 : d).replace(".", ",");
}
function boiteManip(w, h){
  var boite = el("div","figBoite");
  var svg = n("svg",{viewBox:"0 0 "+w+" "+h, class:"fig"});
  boite.appendChild(svg);
  return { boite:boite, svg:svg };
}
function curseur(parent, label, min, max, pas, val, onChange){
  var l = el("div","figCurseur");
  var t = el("span", null, label);
  var i = document.createElement("input");
  i.type="range"; i.min=min; i.max=max; i.step=pas; i.value=val;
  i.addEventListener("input", function(){ onChange(parseFloat(i.value)); });
  l.appendChild(t); l.appendChild(i);
  parent.appendChild(l);
  return i;
}

/* -- 1. Lentille convergente : on déplace l'objet, l'image suit -- */
MODELES["lentille"] = function(){
  var w=440, h=250, f=2, d=5;                       // distance focale, position objet (cm)
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var OAPMAX = 12;                                  // |OA′| au-delà duquel l'image sortirait du cadre
  var iD, iF;
  var BARRE = function(x){ return '<span class="alg">' + x + '</span>'; };

  /* Quand l'objet approche du foyer, l'image part à l'infini et quitte le
     cadre. Plutôt que de dessiner des rayons qui sortent de la boîte, on
     fait sauter au curseur la zone où |OA′| dépasserait OAPMAX : de part
     et d'autre, l'image reste visible, et la note dit ce qui se passe au
     foyer. Bornes : OA′ = f·d/(d−f), d'où d ≥ OAPMAX·f/(OAPMAX−f) (image
     réelle) et d ≤ OAPMAX·f/(OAPMAX+f) (image virtuelle). */
  /* On saute aussi la zone où |γ| > 5 (|d − f| < 0,2 f) : l'objet, redessiné
     plus petit pour que l'image tienne, y deviendrait illisible. */
  /* Et la zone où 1 < γ < 5/3 pour une image virtuelle, soit d < 0,4 f
     (γ = f/(f − d)). Tout contre la lentille, l'image virtuelle est presque
     confondue avec l'objet (γ → 1). Les écarts se mesurent en ENCRE, bord à
     bord, pointe comprise (demi-largeur 4,05 px, pas seulement la
     demi-épaisseur 1,2 px du fût) : d'axe à axe on lisait 6,87 px au seuil
     γ = 1,5, mais il ne restait que 1,62 px d'encre entre les deux flèches
     (1,25 px sur téléphone) — une seule bande bicolore. Au seuil 5/3, avec le
     curseur d dès 0,8, pire cas d = 0,8 ; f′ = 2 : 12,21 px d'axe à axe,
     6,96 px d'encre (5,36 px sur téléphone). Le critère porte sur γ
     (image trop proche de l'objet), pas sur d. dMin ≤ dVirt pour toute
     focale du curseur (1,1 à 4) : un d ramené à dMin reste en zone
     virtuelle, les deux sauts ne se contredisent pas. C'est une BUTÉE, pas
     un saut : en dessous de dMin le curseur ne descend plus, et augmenter f′
     l'éloigne de la lentille, ce qui peut pousser l'objet avec elle. Pour
     f ≤ 2, dMin ≤ 0,8 (min du curseur) : sans effet. */
  /* Curseur d dès 0,8 cm (et non 0,6) : à 0,6 et 0,7, le rayon incident
     parallèle ne mesurait que 13,7 à 16 px, pour une pointe de 9 px — elle
     ne pouvait laisser 2 px ni à l'objet ni à la lentille. */
  /* Focale min 1,1 cm : la plus petite image (d = 8) garde un trait de flèche
     d'au moins 1,3 px dans le viewBox, soit 1 px sur un téléphone (facteur
     CSS 0,771). */
  function borner(){
    var dReel = Math.ceil(Math.max(OAPMAX*f/(OAPMAX - f), 1.2*f)*10 - 1e-9)/10;
    var dVirt = Math.floor(Math.min(OAPMAX*f/(OAPMAX + f), 0.8*f)*10 + 1e-9)/10;
    var dMin = Math.ceil(0.4*f*10 - 1e-9)/10;
    if(d > dVirt && d < dReel){
      d = (d - dVirt < dReel - d) ? dVirt : dReel;
      if(iD) iD.value = d;
    }
    if(d < dMin){
      d = dMin;
      if(iD) iD.value = d;
    }
  }

  /* libellé posé à la main, au style de ceux de dessiner() (objet : 14 ;
     point : 15) */
  function libelle(x, y, s, c, ancre, taille){
    var e = txt(x, y, s, ancre);
    e.setAttribute("fill", coul(c));
    e.setAttribute("font-size", taille || 14);
    e.setAttribute("font-family", "Source Serif 4, Georgia, serif");
    e.setAttribute("font-weight", 600);
    svg.appendChild(e);
  }

  /* point où la demi-droite (x0,y0) + t·(ux,uy), t ≥ 0, sort du cadre */
  function bord(x0, y0, ux, uy, X, Y){
    var t = Infinity;
    if(ux > 0) t = Math.min(t, (X - x0)/ux);
    if(ux < 0) t = Math.min(t, (-X - x0)/ux);
    if(uy > 0) t = Math.min(t, (Y - y0)/uy);
    if(uy < 0) t = Math.min(t, (-Y - y0)/uy);
    return [x0 + t*ux, y0 + t*uy];
  }

  function dessine(){
    borner();
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var oa = -d;
    var oap = (f*oa)/(f + oa);                      // 1/OA′ − 1/OA = 1/f′
    var g = oap/oa;                                 // grandissement
    /* L'image doit tenir en hauteur : quand le grandissement est grand, on
       dessine un objet plus petit. Les rapports (γ, positions) ne changent
       pas, seule la taille dessinée s'adapte. */
    var ho = Math.min(1.4, 2.0/Math.abs(g)), hi = ho*g;
    /* Échelle verticale propre (objet et image sont petits devant les
       distances) ; la largeur s'adapte pour contenir objet et image. */
    // marge plus large à gauche pour le libellé « A′B′ (virtuelle) »
    var X = Math.max(9, 1.12*Math.max(d, Math.abs(oap)) + (oap < 0 ? 2.2 : 0.4)), Y = 2.4;
    var R = repere([-X, -Y, X, Y], w, h, 14, true);

    dessiner(svg, R, {t:"seg", de:[-X,0], a:[X,0], couleur:"line2", epais:1.6});
    /* la hauteur de la lentille est donnée en unités R.k : repère libre, on
       la convertit pour qu'elle couvre 2,2 unités verticales de part et
       d'autre de l'axe, au-dessus du point où arrive le rayon parallèle */
    dessiner(svg, R, {t:"lentille", x:0, h:4.4*R.ky/R.k});
    /* Libellé « AB » posé ici plutôt que par dessiner() : une image virtuelle
       très proche, plus haute que l'objet, traverserait le libellé centré ;
       on le pousse alors vers la lentille, du côté opposé à l'image. S'il n'y
       a plus la place avant la lentille (objet collé contre elle), il passe
       sous l'axe, au pied A de l'objet, où rien n'est dessiné (d = 0,8 avec
       f′ = 1,9 ou 2). */
    var xAB = R.X(-d), yAB = R.Y(ho) - 9;
    if(oap < 0) xAB += Math.max(0, 18 - (R.X(-d) - R.X(oap)));
    var abDessous = xAB > R.X(0) - 14;
    if(abDessous){ xAB = R.X(-d); yAB = R.Y(0) + 18; }
    /* « F » se pose au-dessus de l'axe, à droite du point. Une flèche
       dressée (l'objet, ou l'image virtuelle) qui passe à moins de 20 px
       du libellé le barrerait : il descend alors sous l'axe — à gauche du
       point si « AB » y est déjà. « F′ » n'a jamais de flèche dressée près
       de lui (l'image réelle est renversée, sous l'axe). */
    var xF = R.X(-f), xFlib = [xF + 8, xF + 19];
    var pres = function(x){ return x > xFlib[0] - 20 && x < xFlib[1] + 20; };
    var fDessous = pres(R.X(-d)) || (oap < 0 && pres(R.X(oap)));
    // position du libellé « F » (x, ligne de base, ancre), telle que point() la pose
    var libF = fDessous && abDessous ? [xF - 8, R.Y(0) + 18, "end"]
             : [xF + 8, R.Y(0) + (fDessous ? 18 : -9), "start"];
    dessiner(svg, R, {t:"point", x:f, y:0, nom:"F′", couleur:"ink3"});
    if(fDessous && abDessous){
      dessiner(svg, R, {t:"point", x:-f, y:0, couleur:"ink3"});
      libelle(libF[0], libF[1], "F", "ink3", "end", 15);
    } else dessiner(svg, R, {t:"point", x:-f, y:0, nom:"F", couleur:"ink3", dessous:fDessous});
    /* « A′B′ (virtuelle) » est long (≈ 95 px) : centré sur une image proche
       de la lentille, il mordait sur son chapeau. On l'aligne par la fin,
       au plus près à 14 px à gauche de l'axe de la lentille (le chapeau
       s'étend à 8 px) : il ne recule que vers la gauche, loin de l'objet. */
    var xVirt = Math.min(R.X(oap) + 48, R.X(0) - 14);
    dessiner(svg, R, {t:"objet", x:-d, h:ho, couleur:"vert"});
    libelle(xAB, yAB, "AB", "vert", "middle");

    /* Pointes des rayons : 0,55 du segment par défaut (celui de
       case "rayon"), mais ici chaque pointe — triangle plein de 9 px de
       long et ±4,5 px de large — est placée par la figure. Posée au
       milieu, elle tombait sur le disque de F′ (le rayon émergent y passe),
       sur l'autre pointe (les deux rayons incidents partent du même point
       B, les deux émergents se rejoignent en B′), sur la ligne de l'autre
       rayon, ou sur le libellé « F ». On décrit donc en ENCRE (px du
       viewBox) tout ce qui est dessiné — flèches objet et image (fût et
       pointe), lentille, disques des foyers, boîtes des libellés, autres
       rayons et pointillés, bords du cadre — et on cherche, pour les deux
       rayons d'un même côté à la fois, les deux positions qui laissent la
       plus grande marge minimale (plafonnée à MARGE : au-delà, rien ne
       gagne à s'écarter du milieu), la plus proche de 0,55 à marge égale.
       La pointe reste dans le segment : sa base est au moins à 9 px du
       départ, sa pointe au plus à l'arrivée. Un rayon ne compte pas la
       droite qui le prolonge (le rayon central et son émergent, un
       émergent et son pointillé) : elles sont confondues par nature. */
    var MARGE = 8;
    var P = function(x, y){ return [R.X(x), R.Y(y)]; };
    var pB = P(-d, ho), pO = P(0, 0), pH = P(0, ho), pBi = P(oap, hi);
    var e1 = bord(0, ho, f, -ho, X, Y);             // émergent par F′ (image virtuelle)
    var e2 = bord(0, 0, d, -ho, X, Y);              // émergent non dévié (image virtuelle)
    var fin1 = oap > 0 ? pBi : P(e1[0], e1[1]), fin2 = oap > 0 ? pBi : P(e2[0], e2[1]);
    /* Distances au CARRÉ : la racine ne sert qu'à la fin, quand la mesure
       améliore vraiment la marge — sinon on compare des carrés. La racine est
       monotone : le minimum reste le même, et la valeur rendue, identique. */
    var dPS2 = function(p, a, b){                   // point–segment, au carré
      var dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx*dx + dy*dy, t = 0, ex, ey;
      if(L2){ t = ((p[0] - a[0])*dx + (p[1] - a[1])*dy)/L2; if(t < 0) t = 0; else if(t > 1) t = 1; }
      ex = p[0] - a[0] - t*dx; ey = p[1] - a[1] - t*dy;
      return ex*ex + ey*ey;
    };
    var orient = function(p, q, r){ return (q[0] - p[0])*(r[1] - p[1]) - (q[1] - p[1])*(r[0] - p[0]); };
    var dSS2 = function(a, b, c, e){                // segment–segment, au carré
      if(orient(a, b, c)*orient(a, b, e) < 0 && orient(c, e, a)*orient(c, e, b) < 0) return 0;
      var m = dPS2(a, c, e), v;
      v = dPS2(b, c, e); if(v < m) m = v;
      v = dPS2(c, a, b); if(v < m) m = v;
      v = dPS2(e, a, b); if(v < m) m = v;
      return m;
    };
    var dedans = function(p, Q){                    // dans un polygone convexe
      var sg = 0, n = Q.length, i, v;
      for(i = 0; i < n; i++){
        v = orient(Q[i], Q[i + 1 === n ? 0 : i + 1], p);
        if(v){ if(!sg) sg = v > 0 ? 1 : -1; else if((v > 0 ? 1 : -1) !== sg) return false; }
      }
      return true;
    };
    /* encre d'un tracé : segments épais [a, b, demi-épaisseur] (s),
       polygones pleins (p), disques [centre, rayon] (c). Les listes vides sont
       partagées : deux cents pointes sont construites par redessin, et rien
       n'écrit jamais dedans. */
    var VIDE = [];
    var trait = function(a, b, hw){ return {s:[[a, b, hw]], p:VIDE, c:VIDE}; };
    /* rectangle englobant de l'encre d'un tracé, gardé sur le tracé */
    var cadre = function(o){
      if(o.bb) return o.bb;
      var bb = [Infinity, Infinity, -Infinity, -Infinity];
      var pr = function(x, y, r){
        bb[0] = Math.min(bb[0], x - r); bb[1] = Math.min(bb[1], y - r);
        bb[2] = Math.max(bb[2], x + r); bb[3] = Math.max(bb[3], y + r);
      };
      o.s.forEach(function(q){ pr(q[0][0], q[0][1], q[2]); pr(q[1][0], q[1][1], q[2]); });
      o.p.forEach(function(Q){ Q.forEach(function(p){ pr(p[0], p[1], 0); }); });
      o.c.forEach(function(c){ pr(c[0][0], c[0][1], c[1]); });
      return (o.bb = bb);
    };
    /* Rectangles englobants d'un seul segment épais et d'un seul polygone,
       gardés dessus : un obstacle en compte plusieurs (le cadre en a quatre,
       la lentille trois) et une pointe n'en frôle presque jamais plus d'un. */
    var cadreSeg = function(q){
      return q.bb || (q.bb = [Math.min(q[0][0], q[1][0]) - q[2], Math.min(q[0][1], q[1][1]) - q[2],
                              Math.max(q[0][0], q[1][0]) + q[2], Math.max(q[0][1], q[1][1]) + q[2]]);
    };
    var cadreDisq = function(c){
      return c.bb || (c.bb = [c[0][0] - c[1], c[0][1] - c[1], c[0][0] + c[1], c[0][1] + c[1]]);
    };
    var cadrePoly = function(Q){
      if(Q.bb) return Q.bb;
      var bb = [Infinity, Infinity, -Infinity, -Infinity], i;
      for(i = 0; i < Q.length; i++){
        bb[0] = Math.min(bb[0], Q[i][0]); bb[1] = Math.min(bb[1], Q[i][1]);
        bb[2] = Math.max(bb[2], Q[i][0]); bb[3] = Math.max(bb[3], Q[i][1]);
      }
      return (Q.bb = bb);
    };
    /* deux rectangles séparés d'au moins s : inutile de mesurer plus fin */
    var ecartes = function(a, b, s){
      var gx = Math.max(0, b[0] - a[2], a[0] - b[2]), gy = Math.max(0, b[1] - a[3], a[1] - b[3]);
      return gx*gx + gy*gy >= s*s;
    };
    var loin = function(a, b){ return ecartes(a, b, MARGE); };
    /* Écart d'encre entre un triangle plein T (de rectangle englobant tb) et
       un tracé o, plafonné à MARGE : loin, on ne calcule rien. La marge ne
       fait que décroître et le résultat ne descend pas sous 0 : dès qu'une
       mesure l'annule, on rend 0 sans mesurer le reste. Boucles écrites à la
       main plutôt qu'en forEach : la fonction est appelée quatre mille fois
       par redessin, et chaque forEach y créait une fermeture. */
    var ecart = function(T, tb, o){
      if(loin(tb, cadre(o))) return MARGE;
      var m = MARGE, nT = T.length, i, j, k, q, Q, nQ, q1, q2, a1, a2, v, r, lim;
      for(i = 0; i < o.s.length; i++){
        q = o.s[i]; r = q[2];
        if(ecartes(tb, cadreSeg(q), m + r)) continue;
        q1 = q[0]; q2 = q[1];
        for(j = 0; j < nT; j++){
          a1 = T[j]; a2 = T[j + 1 === nT ? 0 : j + 1];
          v = dSS2(a1, a2, q1, q2);
          if(v <= r*r) return 0;
          lim = m + r;
          if(v < lim*lim) m = Math.sqrt(v) - r;
        }
        /* Aucune arête du triangle n'a été touchée : le segment est donc tout
           entier dedans ou tout entier dehors — une extrémité suffit à
           trancher. */
        if(dedans(q1, T)) return 0;
      }
      for(i = 0; i < o.p.length; i++){
        Q = o.p[i]; nQ = Q.length;
        if(ecartes(tb, cadrePoly(Q), m)) continue;
        for(j = 0; j < nQ; j++){
          q1 = Q[j]; q2 = Q[j + 1 === nQ ? 0 : j + 1];
          for(k = 0; k < nT; k++){
            a1 = T[k]; a2 = T[k + 1 === nT ? 0 : k + 1];
            v = dSS2(a1, a2, q1, q2);
            if(v <= 0) return 0;
            if(v < m*m) m = Math.sqrt(v);
          }
        }
        // aucun bord croisé : l'un est dans l'autre, ou ils sont disjoints
        if(dedans(Q[0], T) || dedans(T[0], Q)) return 0;
      }
      for(i = 0; i < o.c.length; i++){
        q = o.c[i]; r = q[1];
        if(ecartes(tb, cadreDisq(q), m + r)) continue;
        q1 = q[0];
        for(j = 0; j < nT; j++){
          a1 = T[j]; a2 = T[j + 1 === nT ? 0 : j + 1];
          v = dPS2(q1, a1, a2);
          if(v <= r*r) return 0;
          lim = m + r;
          if(v < lim*lim) m = Math.sqrt(v) - r;
        }
        if(dedans(q1, T)) return 0;
      }
      return m;
    };
    // la flèche que fleche() dessine sur l'axe en x, de hauteur hh
    var encreFleche = function(x, hh){
      var x0 = R.X(x), y1 = R.Y(0), y2 = R.Y(hh), L = Math.abs(y2 - y1) || 1;
      var k = Math.min(1, L/18), t = 9*k, u = (y2 - y1)/L;
      return {s:[[[x0, y1], [x0, y2 - u*t*0.8], 1.2*k]],
              p:[[[x0, y2], [x0 - t*0.45, y2 - u*t], [x0 + t*0.45, y2 - u*t]]], c:[]};
    };
    /* boîte d'un libellé, à chasse estimée (large : 0,68 em par capitale).
       Elle est rognée de 1,5 px : un libellé compte moins qu'un tracé — une
       pointe à 0,5 px d'un texte le laisse lisible, alors qu'à 0,5 px d'un
       trait elle s'y soude. La marge n'y descend donc sous 2 px que si
       l'encre touche presque la lettre. */
    var chasse = function(ch){
      return /[A-Z]/.test(ch) ? 0.68 : ch === " " ? 0.25 : ch === "′" ? 0.28 : "()".indexOf(ch) >= 0 ? 0.34
           : "il".indexOf(ch) >= 0 ? 0.29 : ch === "t" ? 0.34 : ch === "r" ? 0.4 : 0.52;
    };
    var boite = function(x, y, s, taille, ancre){
      var lg = 0, i, x0;
      for(i = 0; i < s.length; i++) lg += chasse(s[i])*taille;
      x0 = ancre === "middle" ? x - lg/2 : ancre === "end" ? x - lg : x;
      return {s:[], c:[], p:[[[x0 + 1.5, y - 0.72*taille + 1.5], [x0 + lg - 1.5, y - 0.72*taille + 1.5],
                             [x0 + lg - 1.5, y + 0.22*taille - 1.5], [x0 + 1.5, y + 0.22*taille - 1.5]]]};
    };
    var lcx = R.X(0), yL = R.Y(0), htL = 2.2*R.ky;
    var obstacles = [
      encreFleche(-d, ho), encreFleche(oap, hi),
      {s:[[[lcx, yL - htL], [lcx, yL + htL], 1.2], [[lcx - 8, yL - htL], [lcx + 8, yL - htL], 1.2],
          [[lcx - 8, yL + htL], [lcx + 8, yL + htL], 1.2]], p:[], c:[]},
      {s:[], p:[], c:[[P(-f, 0), 4.5], [P(f, 0), 4.5]]},
      {s:[[[0, 0], [w, 0], 0], [[w, 0], [w, h], 0], [[w, h], [0, h], 0], [[0, h], [0, 0], 0]], p:[], c:[]},
      boite(libF[0], libF[1], "F", 15, libF[2]), boite(R.X(f) + 8, yL - 9, "F′", 15),
      boite(xAB, yAB, "AB", 14, "middle"),
      oap > 0 ? boite(R.X(oap), R.Y(hi) + 16, "A′B′", 14, "middle")
              : boite(xVirt, R.Y(hi) - 9, "A′B′ (virtuelle)", 14, "end")
    ];
    var lIa = trait(pB, pH, 1), lIb = trait(pB, pO, 1), lEa = trait(pH, fin1, 1), lEb = trait(pO, fin2, 1);
    var tiretA = oap < 0 ? [trait(pH, pBi, 1.1)] : [], tiretB = oap < 0 ? [trait(pO, pBi, 1.1)] : [];
    var tete = function(a, b, q){                   // la pointe de case "rayon"
      var L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0])/L, uy = (b[1] - a[1])/L;
      var mx = a[0] + (b[0] - a[0])*q, my = a[1] + (b[1] - a[1])*q;
      var T = [[mx, my], [mx - ux*9 - uy*4.5, my - uy*9 + ux*4.5], [mx - ux*9 + uy*4.5, my - uy*9 - ux*4.5]];
      return {s:VIDE, p:[T], c:VIDE};
    };
    /* Chaque position candidate garde ses marges contre chaque obstacle
       (plafonnées à MARGE), triées. On compare deux positions par leur pire
       marge, puis, à égalité (à 0,05 px près), par la suivante, et ainsi de
       suite : quand un obstacle impose une marge que rien ne peut relever
       (le rayon incident parallèle, court, passe tout entier sous « AB »
       à d = 0,8), les autres continuent de compter au lieu d'être
       sacrifiés. À égalité complète, la plus proche de 0,55 l'emporte. */
    var candidats = function(a, b, obs){
      var L = Math.hypot(b[0] - a[0], b[1] - a[1]), liste = [], fr = [0.55], k, i, j, q, T, tb, v, x;
      for(k = 0; k <= 48; k++) fr.push((9 + (L - 9)*k/48)/L);
      /* Toutes les positions candidates sont la même pointe glissée le long du
         rayon : leurs rectangles englobants tiennent dans celui des deux
         extrêmes. Un obstacle à MARGE ou plus de ce rectangle-là l'est pour
         toutes les positions — on le sort de la boucle, en gardant sa marge
         (MARGE) à la fin de chaque liste triée, où elle se range de toute
         façon. */
      var t1 = cadre(tete(a, b, Math.min(9/L, 1))), t2 = cadre(tete(a, b, 1));
      var enveloppe = [Math.min(t1[0], t2[0]), Math.min(t1[1], t2[1]), Math.max(t1[2], t2[2]), Math.max(t1[3], t2[3])];
      var pres = [], nLoin = 0;
      for(i = 0; i < obs.length; i++){
        if(loin(enveloppe, cadre(obs[i]))) nLoin++; else pres.push(obs[i]);
      }
      for(k = 0; k < fr.length; k++){
        q = fr[k];
        if(q*L < 9 - 1e-9 || q > 1 + 1e-9) continue;
        T = tete(a, b, q); tb = T.bb = cadrePoly(T.p[0]); v = [];
        // insertion directe dans la liste triée : une douzaine d'obstacles
        for(i = 0; i < pres.length; i++){
          x = ecart(T.p[0], tb, pres[i]);
          for(j = v.length; j > 0 && v[j - 1] > x; j--) v[j] = v[j - 1];
          v[j] = x;
        }
        for(i = 0; i < nLoin; i++) v.push(MARGE);
        liste.push({fr:q, T:T, v:v, e0:Math.abs(q - 0.55)});
      }
      return liste.length ? liste : [{fr:1, T:tete(a, b, 1), v:[0], e0:0.45}];
    };
    var fusion = function(u, v, g){                 // trois listes triées en une
      var r = [], i = 0, j = 0, pris = false;
      while(i < u.length || j < v.length || !pris){
        var x = i < u.length ? u[i] : Infinity, y = j < v.length ? v[j] : Infinity;
        if(!pris && g <= x && g <= y){ r.push(g); pris = true; }
        else if(x <= y){ r.push(x); i++; } else { r.push(y); j++; }
      }
      return r;
    };
    /* Verdict de la comparaison entre la liste fusionnée de u, v et g et la
       meilleure liste connue (> 0 : la paire u, v est meilleure), sans
       construire la fusion : la comparaison tranche après une valeur ou deux,
       alors que la fusion en aligne vingt-six (128 000 valeurs fusionnées par
       redessin, pour 5 400 réellement lues). On fusionne donc à la demande,
       terme à terme, et on s'arrête dès que le verdict est acquis. */
    var compareFusion = function(u, v, g, ref){
      var i = 0, j = 0, pris = false, k, x, y, a;
      for(k = 0; k < ref.length; k++){
        x = i < u.length ? u[i] : Infinity;
        y = j < v.length ? v[j] : Infinity;
        if(!pris && g <= x && g <= y){ a = g; pris = true; }
        else if(x <= y){ a = x; i++; } else { a = y; j++; }
        if(a > ref[k] + 0.05) return 1;
        if(a < ref[k] - 0.05) return -1;
        if(a >= MARGE - 1e-9 && ref[k] >= MARGE - 1e-9) return 0;
      }
      return 0;
    };
    /* Les 50 × 50 paires sont toutes passées en revue, dans le même ordre
       qu'avant : les raccourcis qui suivent n'écartent que des paires déjà
       battues à coup sûr, et le placement retenu est exactement celui de la
       recherche exhaustive (vérifié sur les 1 688 états atteignables). */
    var placer = function(ca, cb){                  // les deux pointes d'un même côté
      var best = null, eloigne = Infinity, res = null, i, j, A, Av, Ab, Ap, Bc, ea, e, g, c, m;
      for(i = 0; i < ca.length; i++){
        A = ca[i]; Av = A.v; Ap = A.T.p[0]; Ab = cadre(A.T); ea = A.e0;
        for(j = 0; j < cb.length; j++){
          Bc = cb[j]; e = ea + Bc.e0;
          if(best){
            /* la pire marge de la paire ne dépasse jamais la plus petite des
               deux pires marges individuelles : si celle-ci est déjà battue,
               la paire l'est aussi, sans mesurer l'écart des deux pointes */
            m = Av[0] < Bc.v[0] ? Av[0] : Bc.v[0];
            if(m < best[0] - 0.05) continue;
            /* même épreuve en supposant les deux pointes infiniment loin l'une
               de l'autre (MARGE) : c'est le meilleur sort possible de la paire.
               S'il ne suffit pas, inutile de mesurer leur écart réel. */
            if(compareFusion(Av, Bc.v, MARGE, best) < 0) continue;
            g = ecart(Ap, Ab, Bc.T);
            c = compareFusion(Av, Bc.v, g, best);
            if(c < 0 || (c === 0 && e >= eloigne)) continue;
          } else g = ecart(Ap, Ab, Bc.T);
          best = fusion(Av, Bc.v, g); eloigne = e; res = [A, Bc];
        }
      }
      return res;
    };
    var inc = placer(candidats(pB, pH, obstacles.concat([lIb, lEa, lEb], tiretA, tiretB)),
                     candidats(pB, pO, obstacles.concat([lIa, lEa], tiretA)));
    var tetesInc = [inc[0].T, inc[1].T];
    var em = placer(candidats(pH, fin1, obstacles.concat([lIa, lIb, lEb], tiretB, tetesInc)),
                    candidats(pO, fin2, obstacles.concat([lIa, lEa], tiretA, tetesInc)));

    // rayons incidents : parallèle à l'axe, et vers le centre O
    dessiner(svg, R, {t:"rayon", de:[-d, ho], a:[0, ho], couleur:"ambre", pointe:inc[0].fr});
    dessiner(svg, R, {t:"rayon", de:[-d, ho], a:[0, 0], couleur:"bleu", pointe:inc[1].fr});

    if(oap > 0){
      // image réelle : les rayons émergents se croisent vraiment en B′
      dessiner(svg, R, {t:"rayon", de:[0, ho], a:[oap, hi], couleur:"ambre", pointe:em[0].fr});
      dessiner(svg, R, {t:"rayon", de:[0, 0], a:[oap, hi], couleur:"bleu", pointe:em[1].fr});
      dessiner(svg, R, {t:"objet", x:oap, h:hi, nom:"A′B′", couleur:"rouge"});
    } else {
      /* image virtuelle : la lumière continue vers la droite, en divergeant.
         Ce sont les PROLONGEMENTS des rayons émergents, vers l'arrière, qui se
         croisent en B′, du même côté que l'objet — d'où les pointillés. */
      dessiner(svg, R, {t:"rayon", de:[0, ho], a:e1, couleur:"ambre", pointe:em[0].fr});
      dessiner(svg, R, {t:"rayon", de:[0, 0], a:e2, couleur:"bleu", pointe:em[1].fr});
      dessiner(svg, R, {t:"seg", de:[0, ho], a:[oap, hi], couleur:"ambre", pointille:true});
      dessiner(svg, R, {t:"seg", de:[0, 0], a:[oap, hi], couleur:"bleu", pointille:true});
      dessiner(svg, R, {t:"objet", x:oap, h:hi, couleur:"rouge"});
      libelle(xVirt, R.Y(hi) - 9, "A′B′ (virtuelle)", "rouge", "end");
    }
    /* Une flèche dont le pied touche un foyer recouvrait son disque : on
       repose alors un disque plus petit par-dessus, pour qu'on lise encore
       le point sans masquer la flèche. */
    [f, -f].forEach(function(xf){
      var touche = [-d, oap].some(function(x){ return Math.abs(R.X(x) - R.X(xf)) < 8.7; });
      if(touche) svg.appendChild(n("circle", {cx:R.X(xf), cy:R.Y(0), r:3, fill:coul("ink3")}));
    });

    var taille = Math.abs(Math.abs(g) - 1) < 0.01 ? " (même taille)"
               : Math.abs(g) > 1 ? " (agrandie)" : " (réduite)";
    lecture.innerHTML =
      BARRE("OA") + " = " + fr(oa, 1) + " cm · " + BARRE("OA′") + " = " + fr(oap, 1) + " cm · f′ = " + fr(f, 1) + " cm" +
      " · γ = " + fr(g) + " (sans unité)" + taille +
      (g < 0 ? " · renversée" : " · droite") +
      (oap > 0 ? " · réelle" : " · virtuelle");
  }

  iD = curseur(curs, "distance objet–lentille (cm)", 0.8, 8, 0.1, d, function(v){ d = v; dessine(); });
  iF = curseur(curs, "focale f′ (cm)", 1.1, 4, 0.1, f, function(v){ f = v; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(el("div","figNote",
    "Rapproche l’objet du foyer F : l’image s’éloigne et grandit. Tout près du foyer, elle part si loin qu’elle ne tiendrait plus dans le cadre : le curseur saute cette zone (exactement au foyer, les rayons ressortent parallèles et il n’y a plus d’image). Passe entre F et la lentille : l’image devient virtuelle et droite — c’est la loupe. Tout contre la lentille, l’image virtuelle se confond presque avec l’objet (γ proche de 1) : le curseur s’arrête avant (c’est une butée), sinon on ne distinguerait plus les deux flèches ; si tu augmentes f′, cette butée s’éloigne de la lentille et peut pousser l’objet avec elle. Changer f′ déplace aussi les foyers : l’objet peut alors passer de l’autre côté de F, et l’image passer de réelle à virtuelle, ou l’inverse. Les hauteurs sont agrandies pour la lisibilité ; et quand l’image devient très grande, la figure dessine l’objet plus petit pour que l’image tienne dans le cadre : c’est la valeur de γ qui dit de combien l’image est agrandie."));
  return m.boite;
};

/* -- 2. Onde périodique : la source fixe f, le milieu fixe v, λ en découle --
   La figure est une photo de l'onde à un instant (axe en mètres) : on y lit
   la longueur d'onde. La commande est la fréquence, imposée par la source ;
   la célérité est celle du son dans l'air ; λ = v/f est le résultat.
   Plages bornées pour que rien ne se chevauche : avec f de 60 à 400 Hz,
   λ va de 0,85 à 5,7 m et la courbe (tracée de 0 à 9,6 m) laisse libre
   l'étiquette « x (m) » ; avec une amplitude de 1,2 au plus, le creux de la
   courbe reste au-dessus de la flèche de mesure (y = -1,45). */
MODELES["onde"] = function(){
  var w=440, h=260, f=200, amp=0.8;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var v = 340;                                        // célérité du son dans l'air, en m/s

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var lam = v/f;
    var R = repere([-0.4, -2, 11.2, 2], w, h, 18);
    dessiner(svg, R, {t:"axes", x0:0, y0:0, ax:"x (m)", ay:"élongation"});
    dessiner(svg, R, {t:"seg", de:[0, -1.3], a:[0, 0], couleur:"ink3"});
    var pts=[], i;
    for(i=0;i<=600;i++){
      var x = 9.6*i/600;
      pts.push([x, amp*Math.sin(2*Math.PI*x/lam)]);
    }
    dessiner(svg, R, {t:"courbeXY", pts:pts, couleur:"bleu"});
    // la longueur d'onde, mesurée d'une crête à la suivante
    var c1 = lam/4, c2 = c1 + lam;
    dessiner(svg, R, {t:"seg", de:[c1, amp], a:[c1, -1.5], couleur:"line2", pointille:true});
    dessiner(svg, R, {t:"seg", de:[c2, amp], a:[c2, -1.5], couleur:"line2", pointille:true});
    dessiner(svg, R, {t:"vec", de:[c1, -1.45], a:[c2, -1.45], couleur:"rouge"});
    dessiner(svg, R, {t:"texte", x:(c1+c2)/2, y:-1.9, txt:"λ = "+fr(lam,2)+" m", couleur:"rouge"});
    lecture.innerHTML =
      "f = " + f + " Hz (imposée par la source) · v = " + v + " m/s (imposée par l’air) · " +
      "T = 1/f = " + fr(1000/f, 1) + " ms · λ = v/f = " + fr(lam, 2) + " m";
  }
  curseur(curs, "fréquence f (Hz)", 60, 400, 10, f, function(x){ f=x; dessine(); });
  curseur(curs, "amplitude", 0.4, 1.2, 0.1, amp, function(x){ amp=x; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(el("div","figNote",
    "Graphique de l’onde à un instant, comme une photo : l’axe horizontal est une position, en mètres, et l’écart entre deux crêtes est la longueur d’onde λ. Pour un son, l’air ne monte pas et ne descend pas : l’écart de la courbe par rapport à l’axe représente le décalage de chaque tranche d’air vers l’avant ou vers l’arrière. La fréquence est imposée par la source : c’est elle qui fait la note — plus f est grande, plus le son est aigu. La célérité est imposée par l’air. La longueur d’onde en découle, λ = v/f : plus le son est aigu, plus λ est courte. L’amplitude rend seulement les bosses plus grandes, donc le son plus fort : elle ne change ni f ni λ."));
  return m.boite;
};

/* -- 3. Chute libre : vecteur vitesse et sa variation -- */
MODELES["chute"] = function(){
  var w=420, h=320, v0=8, ang=55;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var g = 9.81, a = ang*Math.PI/180;
    var vx = v0*Math.cos(a), vy = v0*Math.sin(a);
    var tf = 2*vy/g, pts=[], i;
    var portee = vx*tf, haut = vy*vy/(2*g);
    /* trois instants dessinés, séparés de dt = tf/4 */
    var ts = [0.25, 0.5, 0.75].map(function(p){ return tf*p; }), dt = tf/4;
    /* Repère ORTHONORMÉ : la forme de la trajectoire change vraiment avec
       l'angle (un repère libre, ajusté à la portée et à la hauteur,
       ramenait toutes les paraboles à la même image).
       Les vitesses sont tracées à l'échelle k (en m par m/s), la variation
       aussi : vert + rouge = vert suivant quel que soit k. k est choisi pour
       que la flèche verte ne dépasse pas 70 % de l'écart entre deux positions
       dessinées (sinon elles se chevauchent) ; avec un angle de lancer d'au
       moins 30°, la flèche rouge reste alors lisible (16 px au moins). */
    var pos = function(t){ return [vx*t, vy*t - 0.5*g*t*t]; };
    var d12 = Math.hypot(pos(ts[1])[0]-pos(ts[0])[0], pos(ts[1])[1]-pos(ts[0])[1]);
    var k = 0.7*d12/Math.hypot(vx, vy - g*ts[0]);
    function vue(k){
      var x0 = 0, x1 = portee, y0 = 0, y1 = haut;
      ts.forEach(function(t){
        var x = vx*t, y = vy*t - 0.5*g*t*t, wy = vy - g*t;
        var gx = x + k*vx, gy = y + k*wy;
        x1 = Math.max(x1, gx); y1 = Math.max(y1, gy); y0 = Math.min(y0, gy - k*g*dt);
      });
      var D = Math.max(x1 - x0, y1 - y0), mg = 0.08*D;
      return [x0 - mg, y0 - mg, x1 + mg, y1 + mg];
    }
    var R = repere(vue(k), w, h, 18);
    dessiner(svg, R, {t:"axes", x0:0, y0:0, ax:"x (m)", ay:"y (m)"});
    for(i=0;i<=60;i++){
      var t = tf*i/60;
      pts.push([vx*t, vy*t - 0.5*g*t*t]);
    }
    dessiner(svg, R, {t:"courbeXY", pts:pts, couleur:"bleu"});
    // le vecteur vitesse en trois instants, tangent à la trajectoire
    ts.forEach(function(t){
      var x = vx*t, y = vy*t - 0.5*g*t*t;
      var wy = vy - g*t;
      dessiner(svg, R, {t:"point", x:x, y:y, couleur:"ink"});
      dessiner(svg, R, {t:"vec", de:[x,y], a:[x+k*vx, y+k*wy], couleur:"vert"});
      dessiner(svg, R, {t:"vec", de:[x+k*vx, y+k*wy], a:[x+k*vx, y+k*wy-k*g*dt], couleur:"rouge"});
    });
    /* ni portée, ni hauteur, ni durée : elles se calculent avec les équations
       horaires, qui sont au programme de Terminale */
    lecture.innerHTML = "angle de lancer = " + ang + "° · vitesse de départ v₀ = " + fr(v0, 1) + " m/s";
  }
  /* pas de curseur pour v₀ : changer v₀ agrandit la trajectoire sans
     changer sa forme, et la figure se remet à l'échelle — le dessin
     restait identique au pixel près. On le dit dans la note. */
  curseur(curs, "angle de lancer (°)", 30, 80, 1, ang, function(x){ ang=x; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(el("div","figNote",
    "En vert le vecteur vitesse, toujours tangent à la trajectoire. En rouge sa variation d'un instant dessiné au suivant, placée au bout de la flèche verte : la flèche verte plus la rouge donne la flèche verte de l'instant suivant. La flèche rouge pointe toujours vers le bas, comme le poids. Les deux axes ont la même échelle : la forme de la trajectoire est la vraie. Sans l'air, lancer plus vite ne changerait que la taille de la trajectoire, ni sa forme ni la direction de Δv : c'est pourquoi seul l'angle se règle ici."));
  return m.boite;
};

/* -- 4. Tableau d'avancement : on pousse la réaction et on regarde -- */
MODELES["avancement"] = function(){
  /* xs : position du curseur, jamais modifiée par le dessin — sinon, après
     un bornage à x_max, x restait figé alors que le curseur était plus loin */
  var w=430, h=280, xs=0, nAl=0.80, nCl=0.90;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var xmax = Math.min(nAl/2, nCl/3);
    var x = Math.min(xs, xmax);                      // on ne dépasse jamais l'épuisement
    var fin = xs >= xmax - 1e-9;
    /* nAl/2 = nCl/3 : les deux réactifs s'épuisent ensemble. On le teste
       exactement, au lieu de comparer deux « zéros » flottants */
    var stoech = Math.abs(3*nAl - 2*nCl) < 1e-9;
    var clLimite = !stoech && nCl/3 < nAl/2;
    var qAl = Math.max(0, nAl - 2*x), qCl = Math.max(0, nCl - 3*x), qPr = 2*x;
    if(fin){ if(stoech || !clLimite) qAl = 0; if(stoech || clLimite) qCl = 0; }   // zéro exact, pas 1e-16
    var haut = Math.max(nAl, nCl, 2*xmax, 0.2) * 1.25;
    var R = repere([0, 0, 3, haut], w, h, 26, true);

    // trois barres : les deux réactifs qui descendent, le produit qui monte
    [[0.45, qAl, "bleu", "Al"], [1.5, qCl, "rouge", "Cl₂"], [2.55, qPr, "vert", "AlCl₃"]]
      .forEach(function(b){
        dessiner(svg, R, {t:"rect", x:b[0]-0.32, y:0, w:0.64, h:Math.max(b[1], 0.0001),
                          couleur:b[2], opacite:.55, rond:2});
        dessiner(svg, R, {t:"texte", x:b[0], y:-haut*0.055, txt:b[3], couleur:"ink2", taille:12.5});
        dessiner(svg, R, {t:"texte", x:b[0], y:b[1]+haut*0.045,
                          txt:b[1].toFixed(3).replace(".", ",")+" mol", couleur:b[2], taille:12.5});
      });
    dessiner(svg, R, {t:"seg", de:[0,0], a:[3,0], couleur:"ink3", epais:1.8});

    /* tout à trois décimales : le curseur avance par pas de 0,005, et
       nCl − 3x tombe souvent sur un « ,xx5 » que deux décimales arrondissaient mal */
    lecture.innerHTML =
      /* « ≈ » quand x_max ne tombe pas juste à trois décimales : sinon
         l'élève qui recalcule à partir du x affiché trouve −0,001 */
      "x " + (Math.abs(x*1000 - Math.round(x*1000)) > 1e-6 ? "≈" : "=") + " " + fr(x, 3) + " mol · Al : " + fr(nAl) + " − 2x = " + fr(qAl, 3) + " mol" +
      " · Cl₂ : " + fr(nCl) + " − 3x = " + fr(qCl, 3) + " mol · AlCl₃ : 2x = " + fr(qPr, 3) + " mol";
    note.innerHTML = fin
      ? "<b>La réaction est terminée.</b> " + (stoech
          ? "Les deux réactifs sont épuisés en même temps : le mélange est stœchiométrique, il ne reste ni aluminium ni dichlore."
          : clLimite
            ? "Le dichlore est tombé à zéro : c’est lui le réactif limitant. Il reste de l’aluminium."
            : "L’aluminium est tombé à zéro : c’est lui le réactif limitant. Il reste du dichlore.")
      : "Pousse le curseur : les deux réactifs descendent, chacun à la vitesse de son coefficient. Le premier qui touche zéro arrête tout (transformation supposée totale).";
  }

  /* borne du curseur = plus grand x_max possible : min(1,40/2 ; 1,50/3) = 0,50 */
  curseur(curs, "avancement x (mol)", 0, 0.50, 0.005, xs, function(v){ xs = v; dessine(); });
  curseur(curs, "Al au départ (mol)", 0.40, 1.40, 0.05, nAl, function(v){ nAl = v; dessine(); });
  curseur(curs, "Cl₂ au départ (mol)", 0.30, 1.50, 0.05, nCl, function(v){ nCl = v; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 5. Titrage : on verse, et on guette l'équivalence -- */
MODELES["titrage"] = function(){
  var w=430, h=290, vb=0, CA=0.075;
  var CB = 0.10, VA = 20;                      // titrant connu, prise d'essai
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var veq = CA*VA/CB;                        // volume équivalent, en mL
    var R = repere([0, 0, 10, 6], w, h, 20, true);

    // la burette, dont le niveau descend à mesure qu'on verse
    dessiner(svg, R, {t:"rect", x:1.2, y:2.6, w:0.7, h:3.2, couleur:"line2", opacite:.12, rond:3});
    var reste = Math.max(0.06, 3.2*(1 - vb/30));
    dessiner(svg, R, {t:"rect", x:1.25, y:2.6, w:0.6, h:reste, couleur:"bleu", opacite:.4, rond:2});
    dessiner(svg, R, {t:"texte", x:1.55, y:6.0, txt:"burette", couleur:"ink3", taille:11});

    // le bécher, qui rosit dès que le titrant est en excès
    var apres = vb > veq + 1e-9;
    dessiner(svg, R, {t:"becher", x:0.75, y:0.5, w:1.7, h:1.6,
                      niveau:.6, couleur:"ink3", liquide: apres ? "rouge" : "line2"});
    dessiner(svg, R, {t:"texte", x:1.6, y:0.1, txt:"bécher", couleur:"ink3", taille:11});

    // ce qu'il reste d'espèce titrée, en fonction du volume versé
    var pts = [], i;
    for(i = 0; i <= 60; i++){
      var v = 30*i/60;
      pts.push([3.6 + v*(6.0/30), 1.0 + 3.4*Math.max(0, (CA*VA - CB*v))/(CA*VA)]);
    }
    dessiner(svg, R, {t:"axes", x0:3.6, y0:1.0, ax:"V versé (mL)", ay:"n restante"});
    dessiner(svg, R, {t:"courbeXY", pts:pts, couleur:"bleu"});
    var px = 3.6 + vb*(6.0/30);
    var py = 1.0 + 3.4*Math.max(0, (CA*VA - CB*vb))/(CA*VA);
    dessiner(svg, R, {t:"seg", de:[px,1.0], a:[px,py], couleur:"line2", pointille:true});
    dessiner(svg, R, {t:"point", x:px, y:py, couleur:"rouge"});
    var pe = 3.6 + veq*(6.0/30);
    dessiner(svg, R, {t:"seg", de:[pe,1.0], a:[pe,4.5], couleur:"vert", pointille:true});
    dessiner(svg, R, {t:"texte", x:pe, y:4.8, txt:"équivalence", couleur:"vert", taille:11});

    var reste_n = Math.max(0, CA*VA - CB*vb);
    lecture.innerHTML = "versé : " + fr(vb, 1) + " mL · reste à titrer : " + fr(reste_n, 2) +
      " mmol · V équivalent = " + fr(veq, 1) + " mL";
    note.innerHTML = apres
      ? "<b>Tu as dépassé.</b> Le titrant s’accumule sans rien trouver à consommer : la couleur reste. Le volume à relever est celui de la <b>première</b> goutte qui a fait tourner la couleur."
      : (Math.abs(vb - veq) < 0.25
         ? "<b>L’équivalence.</b> Les deux réactifs viennent de se consommer exactement. C’est ce volume-là qu’on relève."
         : "Chaque goutte versée est aussitôt consommée : la couleur disparaît en agitant. Continue.");
  }

  curseur(curs, "volume versé (mL)", 0, 30, 0.5, vb, function(v){ vb = v; dessine(); });
  curseur(curs, "concentration inconnue (mol/L)", 0.02, 0.14, 0.005, CA, function(v){ CA = v; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 5bis. Titrage suivi par pH-métrie : l'équivalence au milieu du saut --
   La courbe est une fonction logistique, symétrique autour de l'équivalence :
   le milieu du saut coïncide alors exactement avec le point de plus forte
   pente, ce que des points relevés à la main ne garantiraient pas. Le
   volume équivalent (14,5 mL) est délibérément différent de celui de
   l'exercice ti10 (12,0 mL), pour que la figure serve d'entraînement sans
   donner la réponse de l'exercice qui utilise la même méthode de lecture. */
MODELES["titrage-ph"] = function(){
  var w=430, h=270, vb=0, veq=14.5, pHbas=2.6, pHhaut=12.0, largeur=0.35;
  function pHat(v){
    return pHbas + (pHhaut-pHbas) / (1 + Math.exp(-(v-veq)/largeur));
  }
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var R = repere([-2.6,-1.4,24,13.6], w, h, 20, true);
    var courbe = [], v;
    for(v=0; v<=24; v+=0.25) courbe.push([v, pHat(v)]);
    dessiner(svg, R, {t:"axes", x0:0, y0:0, ax:"V versé (mL)", ay:"pH"});
    dessiner(svg, R, {t:"courbeXY", pts:courbe, couleur:"bleu"});
    // graduations, sans quoi rien ne se lit sur les axes
    [5,10,15,20].forEach(function(g){
      dessiner(svg, R, {t:"texte", x:g, y:-0.95, txt:String(g), couleur:"ink3", taille:11});
    });
    [4,8,12].forEach(function(g){
      dessiner(svg, R, {t:"texte", x:-1.4, y:g, txt:String(g), couleur:"ink3", taille:11});
    });

    // repère fixe : le milieu du saut, où le pH change le plus vite
    var pHeq = pHat(veq);
    dessiner(svg, R, {t:"seg", de:[veq,0], a:[veq,pHeq], couleur:"vert", pointille:true});
    dessiner(svg, R, {t:"seg", de:[0,pHeq], a:[veq,pHeq], couleur:"vert", pointille:true});
    dessiner(svg, R, {t:"texte", x:veq+0.4, y:pHeq+1.1, txt:"équivalence", couleur:"vert", taille:11, ancre:"start"});

    // le curseur : le point qu'on lit à mesure qu'on verse
    dessiner(svg, R, {t:"point", x:vb, y:pHat(vb), couleur:"rouge"});

    var pH = pHat(vb), ecart = vb - veq;
    lecture.innerHTML = "versé : " + fr(vb,1) + " mL · pH lu : " + fr(pH,1) +
      " · V équivalent = " + fr(veq,1) + " mL (milieu du saut)";
    note.innerHTML = T(vb === 0
      ? "Rien n'a encore été versé : le pH initial est de " + fr(pHbas,1) + ". Fais glisser le curseur pour commencer à verser."
      : (Math.abs(ecart) < 0.3
         ? "<b>Tu es au milieu du saut.</b> C'est là, approximativement, que le pH change le plus vite : la meilleure estimation de l'équivalence, à $V_{éq} = " + fr(veq,1) + "$ mL."
         : (ecart < -1.5
            ? "Le pH monte très doucement : chaque goutte versée est aussitôt consommée. On est encore loin du saut."
            : (ecart < 0
               ? "Le saut approche : ralentis le versement, une seule goutte suffit bientôt à faire basculer le pH."
               : (ecart < 1.5
                  ? "Le saut vient de se produire. Le titrant commence à s'accumuler, en léger excès."
                  : "L'équivalence est dépassée depuis longtemps : le pH continue de monter, de nouveau très doucement, porté par l'excès de titrant.")))));
  }

  curseur(curs, "volume versé (mL)", 0, 24, 0.25, vb, function(v){ vb = v; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 6. Loi d'Ohm : mesurer une résistance en manipulant -- */
MODELES["ohm"] = function(){
  var w=380, hCircuit=250, hGraph=170, h=hCircuit+hGraph;
  var U=12, R0=10;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");
  // chaque réglage de tension laisse un point sur le petit graphique : la
  // proportionnalité se découvre en manipulant, pas en lisant une droite déjà
  // tracée. On repart de zéro dès que la résistance change, sinon deux droites
  // de pentes différentes se mélangeraient et la figure induirait en erreur.
  var trail = [{I:U/R0, U:U}];
  // échelle en I FIXE (bornée par le pire cas : R minimal, U maximal) — sans
  // quoi une échelle qui s'adapte à R annule visuellement l'effet de R sur la
  // pente, qui est justement ce que la figure doit montrer. La plage de R
  // reste volontairement resserrée (5 à 20 Ω) : au-delà, même sur l'échelle
  // fixe, le nuage de points se tasse sur quelques pixels et ne se lit plus
  // comme une droite qui se construit.
  var Imax = 24/5;

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var Rp = repere([0, 0, 8, 6], w, hCircuit, 22);
    var I = U/R0, P = U*I;

    // un seul dipôle en série avec le générateur : la résistance qu'on étudie.
    // (Une lampe en plus donnerait I = U/R sans tenir compte de sa propre
    // résistance, ce qui contredirait le calcul affiché.)
    dessiner(svg, Rp, {t:"dip", type:"pile", de:[1,1], a:[1,5], nom:"G"});
    dessiner(svg, Rp, {t:"dip", type:"resistor", de:[1,5], a:[7,5], nom:"R"});
    dessiner(svg, Rp, {t:"dip", type:"fil", de:[7,5], a:[7,1]});
    dessiner(svg, Rp, {t:"dip", type:"fil", de:[7,1], a:[1,1]});
    // le nom du dipôle ("G") ne dit pas où se lit la tension : un repère
    // dédié, à côté du générateur, pour que U ait un endroit visible sur
    // le schéma et pas seulement une valeur dans la ligne de lecture.
    dessiner(svg, Rp, {t:"texte", x:0.35, y:3, txt:"U", couleur:"ink"});

    // le halo autour de la résistance : son rayon et son opacité suivent la
    // puissance dissipée (effet Joule), avec une racine pour que la montée
    // reste visible sur toute la plage des curseurs au lieu de saturer dès
    // les premiers réglages.
    var eclat = Math.min(1, Math.sqrt(P/40));
    if(eclat > 0.02){
      svg.insertBefore(n("circle", {
        cx: Rp.X(4), cy: Rp.Y(5), r: 12 + 22*eclat,
        fill: coul("ambre"), "fill-opacity": (0.10 + 0.35*eclat).toFixed(3)
      }), svg.firstChild);
    }
    dessiner(svg, Rp, {t:"texte", x:4, y:0.2,
      txt:"I = " + fr(I, 3) + " A", couleur:"bleu", taille:13});

    // le graphique U = f(I), construit point par point à mesure qu'on règle la
    // tension, sur une échelle en I fixe (voir Imax) : c'est justement en
    // gardant la même échelle qu'on voit la pente changer avec R.
    var gg = n("g", {transform:"translate(0,"+hCircuit+")"});
    svg.appendChild(gg);
    var Rg = repere([-Imax*0.06, -3.2, Imax*1.08, 24*1.08], w, hGraph, 24, true);
    dessiner(gg, Rg, {t:"axes", x0:0, y0:0, ax:"I (A)", ay:"U (V)"});
    trail.forEach(function(p){ dessiner(gg, Rg, {t:"point", x:p.I, y:p.U, couleur:"bleu"}); });
    // repères pointillés sur le point courant : les deux nombres dont le
    // rapport donne R, lisibles directement, sans avoir à lire les axes.
    dessiner(gg, Rg, {t:"seg", de:[I,0], a:[I,U], couleur:"line2", pointille:true});
    dessiner(gg, Rg, {t:"seg", de:[0,U], a:[I,U], couleur:"line2", pointille:true});
    dessiner(gg, Rg, {t:"texte", x:I, y:-2.2, txt:fr(I,3), couleur:"rouge", taille:10.5});
    dessiner(gg, Rg, {t:"texte", x:-Imax*0.03, y:U, txt:fr(U,1), couleur:"rouge", taille:10.5, ancre:"end"});
    dessiner(gg, Rg, {t:"point", x:I, y:U, couleur:"rouge"});

    // le message n'attend qu'un nombre suffisant de réglages, pas un étalement
    // minimal en I : à grand R, cet étalement reste petit sur l'échelle fixe
    // (la pente est raide) sans que ce soit moins vrai pour autant.
    var assezDePoints = trail.length > 3;

    lecture.innerHTML = "U = " + fr(U, 1) + " V · R = " + R0 + " Ω · I = U/R = " +
      fr(I, 3) + " A · P = U×I = " + fr(P, 2) + " W";
    var texte = (I > 0.5)
      ? "Forte intensité : la résistance chauffe d’autant plus — la puissance dissipée suit le <b>carré</b> de l’intensité."
      : "Augmente la tension : l'intensité monte, et la résistance chauffe. C'est toute la loi d'Ohm, $U = R × I$.";
    if(assezDePoints) texte += " Regarde les points bleus sur le graphique : ils s'alignent sur une droite par l'origine, exactement comme sur le graphique de mesure — c'est la même proportionnalité, construite par tes propres réglages. Le rapport des deux nombres en rouge, $@f{U}{I}$, retombe (à l'arrondi de lecture près) sur la résistance affichée en haut.";
    note.innerHTML = T(texte);
  }

  curseur(curs, "tension U (V)", 1.5, 24, 0.5, U, function(v){
    U = v; trail.push({I:U/R0, U:U}); if(trail.length>60) trail.shift(); dessine();
  });
  curseur(curs, "résistance R (Ω)", 5, 20, 1, R0, function(v){
    R0 = v; trail = [{I:U/R0, U:U}]; dessine();
  });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 7. Énergie mécanique : ce qu'on perd en hauteur, on le gagne en vitesse -- */
MODELES["energie"] = function(){
  var w=430, h=300, pos=0.1, frott=0;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");
  var masse = 2, g = 9.81, h0 = 5;

  function hauteur(p){ return h0*(1 - p)*(1 - p); }   // une pente qui s'aplatit

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var R = repere([0, 0, 13, 6.2], w, h, 20, true);

    // la piste
    var pts = [], i;
    for(i = 0; i <= 60; i++){ var p = i/60; pts.push([1 + 7*p, 0.6 + hauteur(p)]); }
    dessiner(svg, R, {t:"courbeXY", pts:pts, couleur:"ink3", epais:3});
    dessiner(svg, R, {t:"seg", de:[1,0.6], a:[8.2,0.6], couleur:"line2", pointille:true});

    var z = hauteur(pos);
    /* la bille est posée sur la piste le long de la normale, calculée en
       pixels : le repère est libre (kx ≠ ky), un simple décalage vertical
       l'enfonçait dans la pente raide */
    var pente = -2*h0*(1 - pos)/7;                  // dz/dx de la piste
    var tx = R.kx, ty = -R.ky*pente, nn = Math.sqrt(tx*tx + ty*ty);
    var rpx = 0.22*R.k;
    var cx = R.X(1 + 7*pos) + ty/nn*rpx, cy = R.Y(0.6 + z) - tx/nn*rpx;
    dessiner(svg, R, {t:"cercle", c:[R.x(cx), R.y(cy)], r:0.22,
                      couleur:"bleu", remplir:true});

    // le bilan d'énergie, en trois barres
    var Epp = masse*g*z;
    var Em0 = masse*g*h0;
    var perdu = frott*Em0*pos;                       // les frottements grignotent
    var Ec = Math.max(0, Em0 - Epp - perdu);
    var Em = Ec + Epp;
    var ech = 5.4/Em0;
    [[9.4, Epp, "ambre", "Epp"], [10.6, Ec, "bleu", "Ec"], [11.8, Em, "vert", "Em"]]
      .forEach(function(b){
        dessiner(svg, R, {t:"rect", x:b[0]-0.36, y:0.6, w:0.72, h:Math.max(b[1]*ech, 0.001),
                          couleur:b[2], opacite:.55, rond:2});
        dessiner(svg, R, {t:"texte", x:b[0], y:0.15, txt:b[3], couleur:"ink2", taille:12});
      });
    dessiner(svg, R, {t:"seg", de:[8.9,0.6], a:[12.4,0.6], couleur:"ink3", epais:1.6});
    /* le trait rouge marque le niveau du DÉPART : l'écart avec la barre
       verte est ce qui est parti en chaleur */
    if(frott > 0)
      dessiner(svg, R, {t:"seg", de:[11.44,0.6+Em0*ech], a:[12.16,0.6+Em0*ech],
                        couleur:"rouge", pointille:true, epais:2});

    var v = Math.sqrt(2*Ec/masse);
    /* on arrondit Epp et Ec au dixième, puis Em = leur somme arrondie :
       l'élève qui additionne ce qu'il lit retombe toujours sur Em */
    var EppA = Math.round(Epp*10)/10, EcA = Math.round(Ec*10)/10,
        EmA = Math.round((EppA + EcA)*10)/10;
    lecture.innerHTML = "hauteur = " + fr(z, 2) + " m · Epp = " + fr(EppA, 1) +
      " J · Ec = " + fr(EcA, 1) + " J · Em = " + fr(EmA, 1) + " J" +
      (frott > 0 ? " · chaleur = " + fr(Math.round(Em0*10 - EmA*10)/10, 1) + " J" : "") +
      " · v = " + fr(v, 1) + " m/s (valeurs arrondies)";
    note.innerHTML = (frott === 0)
      ? "Bille de 2 kg lâchée sans vitesse de 5 m de haut. Sans frottement, la barre verte ne bouge pas d’un pixel : l’énergie mécanique se conserve. Ce que la bille perd en hauteur, elle le gagne en vitesse."
      : "Bille de 2 kg lâchée sans vitesse de 5 m de haut. Avec frottement, la barre verte descend à mesure que la bille avance : une partie de l’énergie part en chaleur. Le trait rouge marque le niveau du départ.";
  }

  curseur(curs, "position", 0, 1, 0.02, pos, function(v){ pos = v; dessine(); });
  curseur(curs, "frottement", 0, 0.6, 0.05, frott, function(v){ frott = v; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 8. Chronophotographie : on lit une vitesse sur des points -- */
MODELES["chronophoto"] = function(){
  var w=440, h=270, v0=2, acc=3, tau=100, ipt=3;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var t = tau/1000, pos = [], i;
    for(i = 0; i <= 6; i++){
      var ti = i*t;
      pos.push(v0*ti + 0.5*acc*ti*ti);          // position, en mètres
    }
    var xmax = Math.max(pos[6], 0.5);
    var R = repere([-0.06*xmax, 0, xmax*1.10, 1], w, h, 24, true);

    // la règle graduée, sous les positions
    dessiner(svg, R, {t:"seg", de:[0,0.28], a:[xmax*1.05,0.28], couleur:"line2", epais:1.6});
    pos.forEach(function(x, k){
      var vif = (k >= ipt-1 && k <= ipt+1);
      dessiner(svg, R, {t:"point", x:x, y:0.55, nom:"M"+k,
                        couleur: k===ipt ? "ink" : (vif ? "bleu" : "ink3")});
      dessiner(svg, R, {t:"seg", de:[x,0.28], a:[x,0.36], couleur:"line2"});
    });

    // la distance qui encadre le point étudié
    var a = pos[ipt-1], b = pos[ipt+1];
    dessiner(svg, R, {t:"vec", de:[a,0.15], a:[b,0.15], couleur:"rouge"});
    dessiner(svg, R, {t:"texte", x:(a+b)/2, y:0.03,
                      txt:"M"+(ipt-1)+"M"+(ipt+1)+" = "+fr((b-a)*100, 2)+" cm", couleur:"rouge", taille:12});

    // le vecteur vitesse au point étudié
    var v = (b - a)/(2*t);
    /* la flèche verte est tracée au-dessus du point, pour rester lisible :
       un pointillé la rattache au point étudié */
    dessiner(svg, R, {t:"seg", de:[pos[ipt],0.58], a:[pos[ipt],0.78], couleur:"line2", pointille:true});
    dessiner(svg, R, {t:"vec", de:[pos[ipt],0.78], a:[pos[ipt] + v*t*0.9, 0.78],
                      couleur:"vert", nom:"v"});

    /* distance écrite à 4 décimales : l'arrondir au centième puis donner v
       calculé avec la valeur exacte rendait le calcul affiché faux */
    var juste = Math.abs(v*100 - Math.round(v*100)) < 1e-4;
    lecture.innerHTML = "v" + ipt + " = M" + (ipt-1) + "M" + (ipt+1) + " / 2τ = " +
      fr(b-a, 4) + " m / (2 × " + fr(t, 3) + " s) " + (juste ? "= " : "≈ ") + fr(Math.round(v*100 + 1e-7)/100) + " m/s";   // arrondi exact des « …5 »
    note.innerHTML = (acc === 0)
      ? "Aucun gain de vitesse : les points sont <b>régulièrement espacés</b>, et le vecteur vitesse garde la même longueur d’un bout à l’autre."
      : "Les points s’écartent de plus en plus : le mobile accélère. Déplace le point étudié — la flèche verte s’allonge à chaque fois.";
  }

  curseur(curs, "point étudié", 1, 5, 1, ipt, function(x){ ipt = Math.round(x); dessine(); });
  curseur(curs, "gain de vitesse par seconde (m/s²)", 0, 8, 0.5, acc, function(x){ acc = x; dessine(); });
  curseur(curs, "τ (ms)", 40, 200, 10, tau, function(x){ tau = x; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 9. Bilan des forces : ce qui se compense, ce qui accélère -- */
MODELES["bilan"] = function(){
  var w=420, h=310, F=70, frott=40;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");
  var masse = 8, g = 9.81;

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var R = repere([0, 0, 10, 8], w, h, 20);
    var P = masse*g;
    /* une seule échelle pour toutes les flèches : sinon le poids (78 N)
       paraîtrait plus court qu'une traction de 80 N */
    var echH = 3.0/120, echV = echH;

    dessiner(svg, R, {t:"sol", de:0.5, a:9.5, y:2.0});
    dessiner(svg, R, {t:"rect", x:4.1, y:2.0, w:1.8, h:1.2, couleur:"bleu"});
    var cx = 5, cy = 2.6;

    // le poids et la réaction se compensent toujours ici
    /* « P » au milieu de sa flèche tomberait dans les hachures du sol, qui
       descendent 11 px sous la ligne : on le pose à côté de la pointe. */
    dessiner(svg, R, {t:"vec", de:[cx,cy], a:[cx, cy - P*echV], couleur:"rouge", nom:"P",
                      nomEn:[cx - 0.55, cy - P*echV + 0.25]});
    dessiner(svg, R, {t:"vec", de:[cx,cy], a:[cx, cy + P*echV], couleur:"vert", nom:"R"});
    /* La traction et le frottement, horizontaux. Ils partent du centre de la
       caisse, donc une force faible tient entièrement dedans : le libellé posé
       au milieu de la flèche tombait alors sur le fond bleu, illisible — pour
       « f », à toutes ses valeurs. On le pose donc au-delà de la pointe, et
       jamais avant le bord de la caisse (4,1 à gauche, 5,9 à droite), quitte à
       le décrocher un peu d'une flèche courte : mieux vaut un libellé détaché
       et lisible qu'un libellé posé sur la caisse. */
    var bordD = 5.9, bordG = 4.1, ecart = 0.42;
    if(F > 0)     dessiner(svg, R, {t:"vec", de:[cx,cy], a:[cx + F*echH, cy], couleur:"bleu", nom:"F",
                                    nomEn:[Math.max(cx + F*echH, bordD) + ecart, cy]});
    if(frott > 0) dessiner(svg, R, {t:"vec", de:[cx,cy], a:[cx - frott*echH, cy], couleur:"ambre", nom:"f",
                                    nomEn:[Math.min(cx - frott*echH, bordG) - ecart, cy]});

    // la résultante horizontale, à l'écart pour rester lisible
    var somme = F - frott;
    dessiner(svg, R, {t:"seg", de:[0.8,6.6], a:[9.2,6.6], couleur:"line", epais:1});
    dessiner(svg, R, {t:"texte", x:1.6, y:7.2, txt:"somme des forces", couleur:"ink3", taille:11.5});
    if(Math.abs(somme) > 0.5){
      dessiner(svg, R, {t:"vec", de:[cx, 6.6], a:[cx + somme*echH, 6.6], couleur:"ink", nom:"ΣF"});
    } else {
      dessiner(svg, R, {t:"point", x:cx, y:6.6, couleur:"ink"});
      /* 6,78 et non 6,6 : posé sur l'axe, le texte serait souligné par lui */
      dessiner(svg, R, {t:"texte", x:cx + 1.1, y:6.78, txt:"ΣF = 0", couleur:"ink2", taille:13});
    }

    lecture.innerHTML = "F = " + fr(F, 0) + " N · f = " + fr(frott, 0) + " N · P = R = " +
      fr(P, 0) + " N · ΣF = " + fr(Math.abs(somme), 0) + " N" +
      (somme < 0 ? " vers l’arrière" : somme > 0 ? " vers l’avant" : "");
    note.innerHTML = (Math.abs(somme) < 0.5)
      ? "<b>Les forces se compensent.</b> Le vecteur vitesse ne change pas : la caisse reste immobile, ou glisse en ligne droite à vitesse constante. C’est le principe d’inertie."
      : (somme > 0
         ? "<b>La traction l’emporte.</b> La somme des forces pointe vers l’avant, donc Δv aussi : la caisse accélère."
         : "<b>Le frottement l’emporte.</b> La somme pointe vers l’arrière : si la caisse avance, elle ralentit.");
  }

  /* Pas de 10 N et non de 5 : à 5 N la flèche ne ferait que 4,2 px, avec un
     trait de 0,56 px — sous le pixel, donc un trait fantôme sans direction
     lisible. À 10 N elle fait 8,4 px, trait de 1,1 px et pointe deux fois
     plus large que lui : c'est une vraie flèche, petite. Écarter ces valeurs
     est préférable à les dessiner faux, et préférable aussi à une longueur
     minimale, qui ferait mentir l'échelle unique de la figure. */
  curseur(curs, "traction F (N)", 0, 120, 10, F, function(x){ F = x; dessine(); });
  /* 60 N au plus pour une caisse de 78 N : au-delà, le frottement serait
     irréaliste pour une caisse qui glisse sur un sol */
  curseur(curs, "frottement f (N)", 0, 60, 10, frott, function(x){ frott = x; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 10. Couleur, longueur d'onde et énergie du photon -- */
MODELES["spectre"] = function(){
  var w=440, h=210, lam=550;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");

  /* Approximation classique de la couleur perçue pour une longueur d'onde
     du visible. Ce sont de vraies couleurs, pas des jetons du thème : elles
     ne doivent pas changer avec le mode sombre. */
  function couleurDe(l){
    var r=0, v=0, b=0;
    if(l < 440){ r = -(l-440)/(440-380); b = 1; }
    else if(l < 490){ v = (l-440)/(490-440); b = 1; }
    else if(l < 510){ v = 1; b = -(l-510)/(510-490); }
    else if(l < 580){ r = (l-510)/(580-510); v = 1; }
    else if(l < 645){ r = 1; v = -(l-645)/(645-580); }
    else { r = 1; }
    var att = 1;
    if(l < 420) att = 0.3 + 0.7*(l-400)/(420-400);
    else if(l > 700) att = 0.3 + 0.7*(800-l)/(800-700);
    var f = function(c){ return Math.round(255*Math.pow(Math.max(0,c)*att, 0.8)); };
    return "rgb(" + f(r) + "," + f(v) + "," + f(b) + ")";
  }

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    /* 400–800 nm : la convention du programme pour le visible, la même
       que partout dans le cours (soit environ 1,6 à 3,1 eV) */
    var R = repere([400, 0, 800, 10], w, h, 22, true);

    // la bande spectrale, tranche par tranche
    for(var l = 400; l < 800; l += 4){
      svg.appendChild(n("rect", {
        x: R.X(l), y: R.Y(9), width: Math.ceil(R.X(l+4) - R.X(l)) + 1,
        height: R.Y(4) - R.Y(9), fill: couleurDe(l), stroke:"none" }));
    }
    dessiner(svg, R, {t:"seg", de:[lam,9.6], a:[lam,3.4], couleur:"ink", epais:2.4});
    dessiner(svg, R, {t:"texte", x:lam, y:10.2, txt:Math.round(lam)+" nm", couleur:"ink", taille:12.5});
    [400,500,600,700,800].forEach(function(g){
      dessiner(svg, R, {t:"texte", x:g, y:2.2, txt:g, couleur:"ink3", taille:11});
    });
    dessiner(svg, R, {t:"texte", x:600, y:0.6, txt:"longueur d'onde (nm)", couleur:"ink3", taille:11.5});

    var E = 1.99e-25 / (lam*1e-9);                 // en joules
    lecture.innerHTML = "λ = " + Math.round(lam) + " nm · E = hc/λ = " +
      (E*1e19).toFixed(2).replace(".", ",") + " × 10⁻¹⁹ J = " +
      (E/1.6e-19).toFixed(2).replace(".", ",") + " eV";
    note.innerHTML = (lam < 450)
      ? "Vers le violet : courte longueur d’onde, donc photons <b>énergétiques</b>. Un cran plus loin, l’ultraviolet abîme la peau."
      : (lam > 680
         ? "Vers le rouge : grande longueur d’onde, donc photons <b>peu énergétiques</b>. Au-delà, l’infrarouge ne se voit plus, il chauffe."
         : "Déplace le curseur d’un bout à l’autre : la longueur d’onde augmente, l’énergie du photon diminue. Les deux varient toujours en sens inverse.");
  }

  curseur(curs, "λ (nm)", 400, 800, 5, lam, function(x){ lam = x; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 11. Mouvement circulaire uniforme : la vitesse change sans changer -- */
MODELES["circulaire"] = function(){
  var w=430, h=300, ang=40, ecart=35;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");
  var R0 = 2.0, v = 3.0;                       // rayon de la trajectoire, valeur de la vitesse

  function pt(a){ return [5.8 + R0*Math.cos(a*Math.PI/180), 4.2 + R0*Math.sin(a*Math.PI/180)]; }
  function tang(a){                            // vecteur vitesse, tangent, sens direct
    return [-Math.sin(a*Math.PI/180), Math.cos(a*Math.PI/180)];
  }

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var R = repere([0, 0, 10, 7.2], w, h, 18);

    dessiner(svg, R, {t:"cercle", c:[5.8,4.2], r:R0, couleur:"line2"});
    dessiner(svg, R, {t:"point", x:5.8, y:4.2, nom:"O", couleur:"ink3"});

    var a1 = ang, a2 = ang + ecart;
    var p1 = pt(a1), p2 = pt(a2);
    var u1 = tang(a1), u2 = tang(a2);
    /* longueur dessinée du vecteur vitesse : plus courte que l'arc M₁M₂,
       sinon, aux petits angles, v₁ traversait M₂ et touchait v₂ */
    var L = Math.min(0.8, 0.7*R0*ecart*Math.PI/180);

    // les deux positions et leurs vecteurs vitesse, tangents
    dessiner(svg, R, {t:"point", x:p1[0], y:p1[1], couleur:"ink"});
    dessiner(svg, R, {t:"point", x:p2[0], y:p2[1], couleur:"ink3"});
    dessiner(svg, R, {t:"vec", de:p1, a:[p1[0]+u1[0]*L, p1[1]+u1[1]*L], couleur:"vert", nom:"v₁"});
    dessiner(svg, R, {t:"vec", de:p2, a:[p2[0]+u2[0]*L, p2[1]+u2[1]*L], couleur:"bleu", nom:"v₂"});

    // les deux mêmes vecteurs reportés d'un même point, et leur différence
    var o = [1.7, 2.7], Lr = 1.3;    // le report, assez grand pour que Δv reste lisible
    dessiner(svg, R, {t:"texte", x:0.15, y:0.3, ancre:"start", txt:"les deux vitesses, reportées d’un même point", couleur:"ink3", taille:11});
    dessiner(svg, R, {t:"vec", de:o, a:[o[0]+u1[0]*Lr, o[1]+u1[1]*Lr], couleur:"vert"});
    dessiner(svg, R, {t:"vec", de:o, a:[o[0]+u2[0]*Lr, o[1]+u2[1]*Lr], couleur:"bleu"});
    dessiner(svg, R, {t:"vec", de:[o[0]+u1[0]*Lr, o[1]+u1[1]*Lr],
                      a:[o[0]+u2[0]*Lr, o[1]+u2[1]*Lr], couleur:"rouge", nom:"Δv"});

    /* la même variation, reportée à MI-CHEMIN sur l'arc : c'est là qu'elle
       pointe exactement vers le centre, quel que soit l'angle parcouru
       (placée en M₁, elle était décalée de la moitié de l'angle) */
    /* elle part d'un point légèrement décalé vers O : partie de l'arc même,
       elle tombait sur la flèche verte v₁ pour les petits angles */
    var pm = pt(ang + ecart/2), am = (ang + ecart/2)*Math.PI/180;
    var ps = [pm[0] - 0.3*Math.cos(am), pm[1] - 0.3*Math.sin(am)];
    var dx = u2[0]-u1[0], dy = u2[1]-u1[1], n = Math.hypot(dx, dy) || 1;
    dessiner(svg, R, {t:"point", x:ps[0], y:ps[1], couleur:"rouge"});
    dessiner(svg, R, {t:"vec", de:ps, a:[ps[0]+dx/n*0.75, ps[1]+dy/n*0.75], couleur:"rouge"});   // s'arrête avant l'étiquette « O »

    var dv = 2*v*Math.sin(ecart*Math.PI/360);
    lecture.innerHTML =
      "v₁ = v₂ = " + fr(v,1) + " m/s — la valeur ne change pas · angle parcouru : " +
      Math.round(ecart) + "° · valeur du vecteur Δv (flèche rouge reportée, en bas à gauche) : " + fr(dv,2) + " m/s";
    note.innerHTML = (ecart <= 20)
      ? "Sur un petit angle, Δv est presque perpendiculaire aux deux vitesses : entre deux instants proches, il pointe vers le <b>centre</b>. C’est, pratiquement, la direction de la somme des forces."
      : "Les flèches verte et bleue ont exactement la même longueur : la valeur de la vitesse ne change pas. Ce qui change, c’est la <b>direction</b> — et cela suffit à faire un Δv non nul. Placée à mi-chemin, juste à l'intérieur du cercle, la flèche rouge pointe vers le centre O.";
  }

  curseur(curs, "position (°)", 0, 360, 5, ang, function(x){ ang = x; dessine(); });
  curseur(curs, "angle parcouru (°)", 20, 90, 5, ecart, function(x){ ecart = x; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 13. Polarité : deux conditions, et il les faut toutes les deux -- */
MODELES["polarite"] = function(){
  /* centreNeg : 1 si l'atome central A est le plus électronégatif (type H₂O :
     A est δ−, les X sont δ+), 0 si ce sont les atomes extérieurs X (type CO₂ :
     A est δ+, les X sont δ−). Les δ, les flèches et la résultante suivent
     l'électronégativité réelle, jamais la seule position des atomes. */
  var w=440, h=300, dchi=1.2, ang=105, centreNeg=1;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");
  var MODELE = " <span class=\"small\">(Chaque liaison est représentée par une flèche de longueur proportionnelle à l’écart d’électronégativité : un modèle simplifié, qui suffit pour savoir si les effets se compensent.)</span>";

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var R = repere([0, 0, 10, 5.3], w, h, 16);
    var A = [5, 2.4], L = 1.75;
    var d1 = (90 + ang/2) * Math.PI/180, d2 = (90 - ang/2) * Math.PI/180;
    var X1 = [A[0] + L*Math.cos(d1), A[1] + L*Math.sin(d1)];
    var X2 = [A[0] + L*Math.cos(d2), A[1] + L*Math.sin(d2)];

    dessiner(svg, R, {t:"liaison", de:A, a:X1, couleur:"ink3"});
    dessiner(svg, R, {t:"liaison", de:A, a:X2, couleur:"ink3"});
    dessiner(svg, R, {t:"atome", x:A[0], y:A[1], nom:"A", couleur:"ink"});
    dessiner(svg, R, {t:"atome", x:X1[0], y:X1[1], nom:"X", couleur:"ink"});
    dessiner(svg, R, {t:"atome", x:X2[0], y:X2[1], nom:"X", couleur:"ink"});

    /* Les charges partielles n'apparaissent que si la liaison est polarisée,
       et grandissent avec l'écart. Code couleur unique dans tout le cours :
       δ− en rouge, δ+ en bleu. */
    /* Trait minimal de 1,3 px (1,0 px sur téléphone) pour TOUTES les
       flèches dès δχ = 0,3 : sous ce trait, la résultante se voyait sans ses
       deux termes (δχ = 0,3 à 90°, δχ = 0,4 de 90° à 115°) — une somme
       montrée sans ce qu'elle additionne, alors que c'est le raisonnement
       du chapitre. Le même seuil pour toutes, décidé sur δχ et non sur la
       longueur de chacune : sinon la résultante, plus longue, le
       franchirait seule (δχ = 0,2 à 90°). Épaisseurs égales, donc, jamais
       inversées ; c'est la longueur qui porte la grandeur. */
    var epMin = dchi >= 0.25 ? 1.3 : 0;
    if(dchi > 0.05){
      var t = 10 + 4*dchi;
      var sA = centreNeg ? "δ−" : "δ+", sX = centreNeg ? "δ+" : "δ−";
      var cA = centreNeg ? "rouge" : "bleu", cX = centreNeg ? "bleu" : "rouge";
      // δ de A du côté opposé à la résultante, pour ne jamais la chevaucher
      dessiner(svg, R, {t:"texte", x: centreNeg ? A[0] : A[0]+0.34, y: centreNeg ? A[1]+0.62 : A[1]-0.62, txt:sA, couleur:cA, taille:t});
      dessiner(svg, R, {t:"texte", x:X1[0]-0.55, y:X1[1]+0.28, txt:sX, couleur:cX, taille:t});
      dessiner(svg, R, {t:"texte", x:X2[0]+0.55, y:X2[1]+0.28, txt:sX, couleur:cX, taille:t});

      /* une flèche de polarisation par liaison, du δ+ vers le δ−, de longueur
         proportionnelle à l'écart (0,9 au plus, pour un écart de 2 : elle
         n'entre jamais dans l'atome d'arrivée) */
      var q = 0.45*dchi;
      [[X1,d1],[X2,d2]].forEach(function(p){
        var u = [-Math.cos(p[1]), -Math.sin(p[1])];          // de X vers A
        var base = p[0];
        if(!centreNeg){ u = [-u[0], -u[1]]; base = A; }       // de A vers X
        var dep = [base[0] + u[0]*0.42, base[1] + u[1]*0.42];
        dessiner(svg, R, {t:"vec", de:dep, a:[dep[0]+u[0]*q, dep[1]+u[1]*q], couleur:"bleu", epMin:epMin});
      });
    }

    /* la résultante, portée par la bissectrice : vers le bas (vers A) si A
       est δ−, vers le haut (entre les X) si ce sont les X */
    var res = 2*dchi*Math.cos(ang*Math.PI/360);
    var nul = dchi <= 0.05 || ang >= 178;
    if(!nul){
      var sgn = centreNeg ? -1 : 1;
      // même échelle que les flèches de liaison : la résultante est leur somme exacte
      var y0 = A[1] + sgn*0.5, y1 = y0 + sgn*0.45*res;
      dessiner(svg, R, {t:"vec", de:[A[0], y0], a:[A[0], y1], couleur:"rouge", epMin:epMin});
      if(centreNeg)
        dessiner(svg, R, {t:"texte", x:A[0]+1.55, y:(y0+y1)/2, txt:"résultante", couleur:"rouge", taille:12.5});
      else
        dessiner(svg, R, {t:"texte", x:A[0]-1.75, y:A[1]-0.75, txt:"résultante ↑", couleur:"rouge", taille:12.5});
    } else {
      dessiner(svg, R, {t:"texte", x:A[0], y:A[1]-1.0, txt:"résultante nulle", couleur:"vert", taille:13});
    }

    /* « très faiblement polaire » tant que la résultante AFFICHÉE ne dépasse
       pas 0,41 : en dessous, la flèche résultante fait moins de 7,5 px et son
       trait environ 1 px — dire « polaire » sans nuance devant elle
       annoncerait ce qu'on ne voit pas. Le test porte sur la valeur arrondie
       qu'on lit, pas sur la valeur brute : sinon un même « 0,41 » recevrait
       deux mots selon l'état (0,405 et 0,410 s'affichent pareil).
       Seul le discours change : `nul` reste la garde exacte (δχ = 0 ou
       180°, résultante rigoureusement nulle), sinon on déclarerait
       apolaires des molécules qui ne le sont pas. La valeur chiffrée reste
       affichée (0,01 au plus petit, jamais 0,00). */
    var resLu = nul ? 0 : res, faible = !nul && Math.round(resLu*100) <= 41;
    lecture.innerHTML = "écart d’électronégativité : " + fr(dchi,1) +
      " · angle X–A–X : " + Math.round(ang) + "° · résultante (unité arbitraire) : " + fr(resLu, 2) +
      " — molécule <b>" + (nul ? "apolaire" : (faible ? "très faiblement polaire" : "polaire")) + "</b>";

    if(dchi <= 0.05)
      note.innerHTML = "Écart nul : <b>aucune liaison n’est polarisée</b>. Les électrons sont partagés à parts égales, et la forme de la molécule n’y change rien — elle est apolaire quel que soit l’angle, comme le dioxygène O<sub>2</sub> ou le dichlore Cl<sub>2</sub>.";
    else if(ang >= 178)
      note.innerHTML = centreNeg
        ? "Les liaisons sont bel et bien polarisées, mais la molécule est <b>linéaire</b> : les deux flèches sont exactement opposées et s’annulent. La molécule est apolaire malgré des liaisons polarisées."
        : "Les liaisons sont bel et bien polarisées, mais la molécule est <b>linéaire</b> : les deux flèches sont exactement opposées et s’annulent. C’est la situation du dioxyde de carbone (pour lui, l’écart vaut 0,8) : carbone central δ+, oxygènes δ−, molécule apolaire malgré des liaisons polarisées.";
    /* 170° et 175° : la molécule est dessinée presque droite, la résultante
       ne dépasse pas 6,4 px — parler de « forme coudée » décrirait autre
       chose que le dessin. Elle reste non nulle : jamais « apolaire » ici. */
    else if(ang >= 168)
      note.innerHTML = centreNeg
        ? "Les liaisons sont polarisées, et la molécule est <b>presque linéaire</b> : les deux flèches sont presque opposées et se compensent presque entièrement. Il reste une résultante, dirigée vers l’atome central δ−, mais si faible qu’on la voit à peine sur le dessin, voire plus du tout : la molécule est <b>très faiblement polaire</b>. Referme l’angle pour voir la résultante grandir."
        : "Les liaisons sont polarisées, et la molécule est <b>presque linéaire</b> : les deux flèches sont presque opposées et se compensent presque entièrement. Il reste une résultante, dirigée vers les atomes extérieurs δ−, mais si faible qu’on la voit à peine sur le dessin, voire plus du tout : la molécule est <b>très faiblement polaire</b>. Referme l’angle pour voir la résultante grandir.";
    else {
      /* coudée mais résultante trop petite pour être bien dessinée : dire
         pourquoi la lecture annonce « très faiblement », avec la VRAIE cause —
         un écart faible (δχ ≤ 0,4), ou sinon un angle grand (dès δχ = 0,5,
         la résultante ne tombe sous 0,42 qu'à partir de 135°) — et que ce
         seuil tient au dessin. Avant la consigne « tu obtiens l'eau », pour
         que « Ici » ne désigne pas l'eau, nettement polaire. */
      var pourquoi = !faible ? "" : " Ici, " + (dchi <= 0.45
          ? "l’écart d’électronégativité est faible, donc les deux flèches de liaison sont courtes et la résultante aussi"
          : "l’angle est grand : les deux flèches tirent dans des directions assez opposées pour se compenser en bonne partie") +
        ". La résultante existe, mais elle est trop petite pour être bien dessinée à cette échelle — d’où « <b>très faiblement polaire</b> ».";
      note.innerHTML = centreNeg
        ? "Liaisons polarisées <b>et</b> forme coudée : les deux flèches ne se compensent plus entièrement, il en reste une résultante, dirigée vers l’atome central δ−." + pourquoi + " Règle l’angle à 105° et l’écart à 1,2 — tu obtiens la molécule d’eau."
        : "Liaisons polarisées <b>et</b> forme coudée : les deux flèches ne se compensent plus entièrement, il en reste une résultante, dirigée cette fois vers les deux atomes extérieurs, qui sont δ−." + pourquoi;
    }
    note.innerHTML += MODELE;
    bH2O.className = "btn " + (centreNeg ? "pri" : "gho");
    bCO2.className = "btn " + (centreNeg ? "gho" : "pri");
  }

  /* deux boutons plutôt qu'un curseur à deux positions : ils nomment les deux
     cas du cours */
  var choix = el("div","row");
  choix.style.gap = "8px"; choix.style.flexWrap = "wrap"; choix.style.marginBottom = "6px";
  var bH2O = el("button","btn pri","Type H₂O : l’atome central attire");
  var bCO2 = el("button","btn gho","Type CO₂ : les atomes extérieurs attirent");
  bH2O.type = bCO2.type = "button";
  bH2O.onclick = function(){ centreNeg = 1; dessine(); };
  bCO2.onclick = function(){ centreNeg = 0; dessine(); };
  choix.appendChild(bH2O); choix.appendChild(bCO2);
  curs.appendChild(choix);
  curseur(curs, "écart d’électronégativité", 0, 2, 0.1, dchi, function(x){ dchi = x; dessine(); });
  curseur(curs, "angle X–A–X (°)", 90, 180, 5, ang, function(x){ ang = x; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 14. Les trois mailles cubiques, et ce qu'elles contiennent vraiment -- */
MODELES["maille"] = function(){
  var w=440, h=300, type=3, montre=false;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");
  var bVoir = el("button","btn gho","Voir la réponse");
  bVoir.type = "button";
  bVoir.onclick = function(){ montre = true; dessine(); };
  var NOMS = ["", "cubique simple", "cubique centrée", "cubique à faces centrées"];
  var PROPRE = [0, 1, 2, 4];
  var COMPAC = ["", "52", "68", "74"];

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var R = repere([0, 0, 10, 6.8], w, h, 18);
    var S = 3.5, ox = 2.5, oy = 1.2;
    /* projection oblique : l'axe z part vers le fond, en haut à droite */
    function P(x, y, z){ return [ox + S*x + S*0.42*z, oy + S*y + S*0.30*z]; }

    /* Convention de tout le chapitre : ce qui est DERRIÈRE se dessine en
       pointillé — arêtes comme atomes. Dans cette projection, z croissant
       s'éloigne du regard : le seul sommet caché est [0,0,1], et les faces
       cachées sont celles du fond (z=1), du dessous (y=0) et de gauche
       (x=0). L'élève peut ainsi compter les quatorze atomes sans en
       deviner aucun. */
    function sommetCache(s){ return s[0]===0 && s[1]===0 && s[2]===1; }
    function faceCachee(f){ return f[2]===1 || f[1]===0 || f[0]===0; }

    // les douze arêtes du cube — les trois issues du sommet caché en pointillé
    var som = [];
    [0,1].forEach(function(x){ [0,1].forEach(function(y){ [0,1].forEach(function(z){ som.push([x,y,z]); }); }); });
    som.forEach(function(a){
      som.forEach(function(b){
        var d = Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]) + Math.abs(a[2]-b[2]);
        if(d === 1 && (a[0]+a[1]*2+a[2]*4) < (b[0]+b[1]*2+b[2]*4))
          dessiner(svg, R, {t:"seg", de:P(a[0],a[1],a[2]), a:P(b[0],b[1],b[2]),
                            couleur:"line2", epais:1.7,
                            pointille: sommetCache(a) || sommetCache(b)});
      });
    });

    // les atomes de cette maille-ci
    var pos = som.map(function(s){ return {p:s, r:0.30, c:"bleu", cache:sommetCache(s)}; });
    if(type === 2) pos.push({p:[0.5,0.5,0.5], r:0.34, c:"ambre", cache:false});
    if(type === 3) [[0.5,0.5,0],[0.5,0.5,1],[0.5,0,0.5],[0.5,1,0.5],[0,0.5,0.5],[1,0.5,0.5]]
      .forEach(function(f){ pos.push({p:f, r:0.34, c:"ambre", cache:faceCachee(f)}); });

    // du fond vers l'avant, pour que les recouvrements soient corrects.
    // La profondeur réelle le long de la direction de vue est
    // −0,42x − 0,30y + z : la grande valeur est la plus lointaine, donc
    // dessinée en premier. (L'ancienne clé ignorait x et donnait à y le
    // mauvais signe ; sans effet visible aux rayons actuels, mais faux dès
    // qu'un rayon augmente.)
    var prof = function(p){ return -0.42*p[0] - 0.30*p[1] + p[2]; };
    pos.sort(function(a,b){ return prof(b.p) - prof(a.p); });
    pos.forEach(function(a){
      var q = P(a.p[0], a.p[1], a.p[2]);
      dessiner(svg, R, a.cache
        ? {t:"cercle", c:q, r:a.r-0.04, couleur:a.c, pointille:true}
        : {t:"cercle", c:q, r:a.r, couleur:a.c, remplir:true, opacite:.55});
    });

    /* commun aux trois états : dire ce que signifie le pointillé, sinon
       l'élève prend le sommet du fond pour autre chose qu'un atome */
    var POINTILLE = " Ce qui est tracé en <b>pointillé</b>, un peu plus petit, est simplement <b>derrière</b> : le sommet du fond, et — quand il y en a — les centres des faces cachées. Ce sont des atomes comme les autres, et ils comptent comme eux.";

    /* Le cours demande « compte toi-même AVANT de lire la réponse » : tant
       qu'on n'a pas cliqué, ni la lecture ni la note ne donnent le résultat.
       Le bouton se referme à chaque changement de maille, sinon il n'y aurait
       plus rien à chercher sur les suivantes. */
    if(!montre){
      lecture.innerHTML = "maille " + NOMS[type] + " · atomes en propre : <b>?</b> · compacité : <b>?</b>";
      note.innerHTML = "À toi : compte les atomes posés sur cette maille, puis demande-toi ce qui lui revient <b>à elle seule</b> — un sommet est partagé entre huit cubes, un centre de face entre deux, un atome au centre du cube n’appartient qu’à lui." + POINTILLE;
      bVoir.style.display = "";
      return;
    }
    bVoir.style.display = "none";
    lecture.innerHTML = "maille " + NOMS[type] + " · atomes en propre : <b>" + PROPRE[type] +
      "</b> · compacité : " + COMPAC[type] + " %";
    if(type === 1)
      note.innerHTML = "Huit atomes posés sur la maille, mais chacun n’est là que pour <b>un huitième</b> : il est partagé entre les huit cubes qui se touchent en ce sommet. 8 × ⅛ = <b>1</b> atome en propre." + POINTILLE;
    else if(type === 2)
      note.innerHTML = "Le neuvième atome, au centre, n’est partagé avec personne : il compte pour <b>un entier</b>. 8 × ⅛ + 1 = <b>2</b> atomes en propre. C’est la structure du fer à température ambiante." + POINTILLE;
    else
      note.innerHTML = "Chaque atome de face est au milieu de deux cubes : il compte pour <b>une moitié</b>. 8 × ⅛ + 6 × ½ = 1 + 3 = <b>4</b> atomes en propre. Les trois faces cachées — fond, dessous, gauche — sont en pointillé : compte bien <b>six</b> centres de faces, donc quatorze atomes posés sur la maille. C’est la structure du cuivre, de l’aluminium et de l’or — et la plus compacte des trois." + POINTILLE;
  }

  curseur(curs, "type de maille", 1, 3, 1, type, function(x){ type = Math.round(x); montre = false; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  bVoir.style.marginTop = "6px";
  m.boite.appendChild(bVoir);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 15. La ligne de contact : où les sphères d'une maille se touchent -- */
MODELES["contact"] = function(){
  var w=440, h=300, type=1, r=0.30;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");
  var NOMS = ["", "cubique simple", "cubique à faces centrées"];
  var LIGNE = ["", "l'arête", "la diagonale d'une face"];

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    /* cadre agrandi par rapport à "maille" : le rayon monte jusqu'à 0,55a, il faut
       de la marge pour que les sphères ne débordent pas du cadre visible */
    var R = repere([-1, -1, 10, 7.5], w, h, 18);
    var S = 3.0, ox = 2.2, oy = 1.3;
    /* même projection oblique que la figure "maille" */
    function P(x, y, z){ return [ox + S*x + S*0.42*z, oy + S*y + S*0.30*z]; }

    // les douze arêtes du cube, pour situer les atomes étudiés
    var som = [];
    [0,1].forEach(function(x){ [0,1].forEach(function(y){ [0,1].forEach(function(z){ som.push([x,y,z]); }); }); });
    som.forEach(function(a){
      som.forEach(function(b){
        var d = Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]) + Math.abs(a[2]-b[2]);
        /* même convention que les autres figures du chapitre : les trois
           arêtes issues du seul sommet caché [0,0,1] se dessinent en pointillé */
        if(d === 1 && (a[0]+a[1]*2+a[2]*4) < (b[0]+b[1]*2+b[2]*4))
          dessiner(svg, R, {t:"seg", de:P(a[0],a[1],a[2]), a:P(b[0],b[1],b[2]), couleur:"line2", epais:1.7,
                            pointille: (a[0]===0&&a[1]===0&&a[2]===1) || (b[0]===0&&b[1]===0&&b[2]===1)});
      });
    });

    // ligne : les deux extrémités de la ligne de contact à tracer.
    // marques : tous les atomes qui sont dessus (2 pour l'arête, 3 pour la diagonale
    // — sommet, centre de la face, sommet opposé — pour qu'on voie les quatre rayons).
    // Ils sont TOUS dans le plan de la face avant (z = 0) : la projection oblique n'y
    // déforme aucune distance, donc les dessiner à l'échelle vraie (r*S) est fidèle.
    // dist : l'écart entre deux sphères VOISINES sur cette ligne, en unités de a.
    var ligne, marques, dist, autres;
    if(type === 1){
      ligne = [[0,0,0],[1,0,0]];
      marques = [[0,0,0],[1,0,0]];
      dist = 1;
      autres = [[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]];
    } else {
      ligne = [[0,0,0],[1,1,0]];
      marques = [[0,0,0],[0.5,0.5,0],[1,1,0]];
      dist = Math.SQRT2/2;                      // sommet ↔ centre de la face, la moitié de la diagonale
      autres = som.filter(function(s){ return !(s[0]===0&&s[1]===0&&s[2]===0) && !(s[0]===1&&s[1]===1&&s[2]===0); })
        .concat([[0.5,0.5,1],[0.5,0,0.5],[0.5,1,0.5],[0,0.5,0.5],[1,0.5,0.5]]);
    }

    var ecart = dist - 2*r;                    // > 0 séparées, < 0 chevauchement, ≈ 0 tangentes
    var tangent = Math.abs(ecart) < 0.004;
    var teinte = tangent ? "vert" : (ecart>0 ? "ambre" : "rouge");
    var rTheo = dist / 2;                       // le rayon exact de tangence, affiché une fois qu'on l'a trouvé

    // la ligne de contact, tracée en évidence sous les atomes (trait plein : elle est
    // sur la face avant, jamais cachée — les pointillés du chapitre ne servent qu'aux arêtes de fond)
    dessiner(svg, R, {t:"seg", de:P(ligne[0][0],ligne[0][1],ligne[0][2]),
                       a:P(ligne[1][0],ligne[1][1],ligne[1][2]), couleur:teinte, epais:2.8});

    // les atomes du fond (« autres ») : la projection oblique raccourcit la profondeur d'un
    // facteur < 1 (voir P ci-dessus), donc deux sphères tangentes en réalité mais éloignées
    // dans la profondeur se dessineraient comme visiblement chevauchantes à l'échelle vraie —
    // un artefact de projection, pas un vrai chevauchement. On les trace donc en simples
    // contours, à taille réduite et fixe (0,145 a), comme repère du cube plutôt que comme mesure.
    // Seuls les atomes de la ligne de contact (marques, tous dans le plan avant) sont à l'échelle.
    // Le 0,145 n'est pas arbitraire : il est choisi sous le minimum du curseur (0,150), pour que
    // la sphère réglée par l'élève ne paraisse JAMAIS plus petite que les repères ; et il laisse
    // +1,2 px entre les encres des deux repères les plus proches (le trait fait 2,2 px), là où
    // 0,16 les faisait encore se toucher et 0,20 les faisait se croiser.
    autres.sort(function(a,b){ return (-0.42*b[0] -0.30*b[1] + b[2]) - (-0.42*a[0] -0.30*a[1] + a[2]); });
    autres.forEach(function(p){
      /* même convention que les autres figures du chapitre : ce qui est
         derrière se trace en pointillé. Attention, « autres » mélange des
         sommets et des centres de faces, et le critère n'est pas le même :
         un seul SOMMET est caché, [0,0,1] (les autres sont sur la
         silhouette), tandis qu'une FACE est cachée dès que z=1, y=0 ou x=0. */
      var sommet = (p[0]===0||p[0]===1) && (p[1]===0||p[1]===1) && (p[2]===0||p[2]===1);
      var cache = sommet ? (p[0]===0 && p[1]===0 && p[2]===1)
                         : (p[2]===1 || p[1]===0 || p[0]===0);
      dessiner(svg, R, {t:"cercle", c:P(p[0],p[1],p[2]), r:0.145*S,
                         couleur:"bleu", remplir:false, pointille:cache});
    });
    marques.forEach(function(p){
      dessiner(svg, R, {t:"cercle", c:P(p[0],p[1],p[2]), r:r*S,
                         couleur:teinte, remplir:true, opacite:.6});
    });

    // le nom de la ligne surlignée est donné dans la lecture ci-dessous plutôt que
    // dessiné sur la figure : à la tangence, une étiquette posée sur la ligne se
    // retrouverait sous les sphères elles-mêmes, devenue illisible juste quand elle compte le plus

    /* Deux pièges à désamorcer dans le texte, sinon la figure enseigne faux.
       (1) La couleur ne veut PAS dire ici ce qu'elle veut dire dans les deux
       figures précédentes : là-bas elle disait le rôle de l'atome (bleu =
       sommet, ambre = centre de face), ici elle dit l'état du contact.
       (2) Les atomes en fin contour ne suivent pas le curseur : taille fixe
       et réduite, parce que pour ceux du fond la projection raccourcit la
       profondeur (un pas selon z ne se projette que sur 0,52 fois sa
       longueur) et les ferait paraître emboîtés. Pour r < 0,16 ils
       paraissent même plus gros que les sphères réglées. */
    var ECHELLE = " <i>Attention, la couleur ne dit plus le rôle de l'atome comme dans les figures précédentes, mais l'état du contact : ambre = encore séparées, vert = tangentes, rouge = elles se chevauchent. Et seules les sphères <b>pleines</b> sont à l'échelle du rayon que tu règles : les atomes en fin contour sont tous réduits à la même taille, sinon ceux du fond paraîtraient emboîtés — la projection y raccourcit la profondeur." +
      (type === 1
        ? " Dans cette maille, les sphères se touchent en réalité le long de <b>chaque</b> arête, pas seulement de celle qui est mise en évidence.</i>"
        : " Dans cette maille, les sphères se touchent le long des <b>deux diagonales de chacune des six faces</b>, pas seulement de celle qui est mise en évidence.</i>");

    if(tangent){
      /* on affiche la valeur EXACTE (rTheo) plutôt que la valeur brute du curseur : sinon,
         selon le pas de 0,001, on obtiendrait par exemple 4r = 1,412 a affiché à côté de
         a√2 ≈ 1,414 a — deux nombres censés être égaux mais différents à l'affichage */
      lecture.innerHTML = NOMS[type] + " · ligne de contact : " + LIGNE[type] + " · rayon r ≈ " + fr(rTheo,3) + " a — <b>c'est exactement là</b> : les sphères se touchent.";
      var pont = type === 1
        ? "2r = " + fr(2*rTheo,3) + " a, soit la longueur de l'arête : c'est la relation <b>a = 2r</b>."
        : "4r = " + fr(4*rTheo,3) + " a, soit la longueur de la diagonale de la face (a√2 = " + fr(Math.SQRT2,3) + " a) : c'est la relation <b>a√2 = 4r</b>.";
      note.innerHTML = "<b>C'est exactement là</b> (à la précision du curseur près, arrondie ici à la valeur théorique). Au rayon que tu viens de trouver, les sphères voisines sont tangentes le long de " +
        LIGNE[type] + " : " + pont + " C'est cette égalité entre a et r, combinée à la population N, qui permet ensuite de calculer la compacité." + ECHELLE;
    } else if(ecart > 0){
      lecture.innerHTML = NOMS[type] + " · ligne de contact : " + LIGNE[type] + " · rayon r = " + fr(r,3) + " a · écart entre les surfaces : +" + fr(ecart,3) + " a (séparées)";
      note.innerHTML = "Il reste du vide entre les sphères : ce rayon est trop petit pour ce modèle. Augmente le curseur jusqu'à ce qu'elles se touchent exactement, sans se chevaucher." + ECHELLE;
    } else {
      lecture.innerHTML = NOMS[type] + " · ligne de contact : " + LIGNE[type] + " · rayon r = " + fr(r,3) + " a · chevauchement : " + fr(Math.abs(ecart),3) + " a de trop";
      note.innerHTML = "Les sphères se chevauchent : ce rayon est trop grand pour tenir dans la maille sans que la matière se recouvre elle-même. Réduis le curseur." + ECHELLE;
    }
  }

  curseur(curs, "type de maille", 1, 2, 1, type, function(x){ type = Math.round(x); dessine(); });
  curseur(curs, "rayon r (en fraction de a)", 0.15, 0.55, 0.001, r, function(x){ r = x; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 16. La droite d'étalonnage, et la lecture à l'envers -- */
MODELES["etalonnage"] = function(){
  var w=440, h=300, C=1.2, k=0.30;      // C en 10^-3 mol/L, k en L/mmol
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var Cmax = 2.5, Amax = 1.0;
    /* la cuve est dessinée à droite de la droite d'étalonnage (x > 2,7),
       hors de la zone des points : elle ne masque jamais la lecture */
    var R = repere([-0.42, -0.20, 3.4, Amax*1.12], w, h, 24, true);
    var A = k*C;

    dessiner(svg, R, {t:"axes", x0:0, y0:0, ax:"C (mmol/L)", ay:"A"});
    // graduations, pour que la lecture ait un sens
    [0.5, 1.0, 1.5, 2.0].forEach(function(g){
      dessiner(svg, R, {t:"seg", de:[g,0], a:[g,-0.022], couleur:"ink3"});
      dessiner(svg, R, {t:"texte", x:g, y:-0.09, txt:fr(g,1), couleur:"ink3", taille:10.5});
    });
    [0.25, 0.50, 0.75].forEach(function(g){
      dessiner(svg, R, {t:"seg", de:[0,g], a:[-0.03,g], couleur:"ink3"});
      dessiner(svg, R, {t:"texte", x:-0.20, y:g-0.02, txt:fr(g,2), couleur:"ink3", taille:10.5});
    });

    dessiner(svg, R, {t:"courbeXY", pts:[[0,0],[Cmax, k*Cmax]], couleur:"bleu", epais:2.4});
    // les étalons, jalons de la droite
    [0.5, 1.0, 1.5, 2.0].forEach(function(c){
      dessiner(svg, R, {t:"cercle", c:[c, k*c], r:0.035, couleur:"bleu", remplir:true, opacite:.9});
    });

    // le point courant, et sa lecture sur les deux axes
    dessiner(svg, R, {t:"seg", de:[C,0], a:[C,A], couleur:"line2", pointille:true});
    dessiner(svg, R, {t:"seg", de:[0,A], a:[C,A], couleur:"line2", pointille:true});
    dessiner(svg, R, {t:"cercle", c:[C,A], r:0.055, couleur:"rouge", remplir:true, opacite:.95});

    // la cuve, dont la teinte suit l'absorbance A = kC : à concentration
    // égale, une espèce peu colorée donne une cuve pâle
    var cx = 2.85, cy = 0.35, cw = 0.36, ch = 0.30;
    dessiner(svg, R, {t:"rect", x:cx, y:cy, w:cw, h:ch, couleur:"rouge",
                      remplir:true, opacite:0.06 + 0.62*(A/Amax)});
    dessiner(svg, R, {t:"texte", x:cx+cw/2, y:cy+ch+0.06, txt:"la cuve", couleur:"ink3", taille:11});

    // k·C est toujours un multiple de 0,001 : trois décimales, exactes.
    // L'« écran » imite un appareil qui affiche au centième (arrondi au plus
    // proche, les demis vers le haut, calculé sur l'entier n = 1000·A).
    var n1000 = Math.round(A*1000), ecran = Math.round(n1000/10)/100;
    lecture.innerHTML = "C = " + fr(C,2) + " mmol/L · k = " + fr(k,2) +
      " L/mmol · A = k × C = " + fr(n1000/1000, 3) + " (sans unité) → écran de l’appareil : <b>" + fr(ecran, 2) + "</b>";
    note.innerHTML = (k < 0.18)
      ? "Espèce peu colorée, ou longueur d’onde mal choisie : pour une même concentration, l’absorbance est faible, la cuve reste pâle et la droite est presque plate. Déplace la concentration d’un cran : l’écran de l’appareil ne bouge parfois pas du tout. Deux solutions différentes affichent le même nombre, comme une pincée de sel sur une balance au gramme : le dosage devient <b>imprécis</b>. On règle donc toujours l’appareil sur la longueur d’onde où l’espèce absorbe le plus."
      : "Fais varier la concentration : le point rouge glisse <b>sur la droite</b>, jamais à côté. C’est ce qui permet la lecture à l’envers — on mesure A, on remonte à la droite, on redescend sur l’axe des concentrations.";
  }

  curseur(curs, "concentration C", 0, 2.5, 0.05, C, function(x){ C = x; dessine(); });
  curseur(curs, "espèce ou longueur d’onde (pente k)", 0.10, 0.40, 0.02, k, function(x){ k = x; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 17. Semblable dissout semblable -- */
MODELES["dissolution"] = function(){
  var w=440, h=300, sol=1, solv=1;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");
  var SOLUTES  = ["", "sel (ionique)", "sucre (polaire)", "huile (apolaire)"];
  var SOLVANTS = ["", "eau (polaire)", "cyclohexane (apolaire)"];

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var R = repere([0, 0, 10, 6.6], w, h, 18);
    var dissout = (solv === 1) ? (sol !== 3) : (sol === 3);

    dessiner(svg, R, {t:"becher", x:3.1, y:0.8, w:3.8, h:4.4,
                      niveau:0.72, liquide: solv===1 ? "bleu" : "ambre"});
    dessiner(svg, R, {t:"texte", x:5, y:0.25, txt:SOLVANTS[solv], couleur:"ink3", taille:12});

    var i, x, y;
    if(dissout){
      // dispersé : les particules sont partout, une par une
      var grille = [[3.7,1.5],[4.6,2.2],[5.6,1.6],[6.3,2.6],[3.6,3.0],[4.4,3.6],
                    [5.3,3.1],[6.2,3.55],[3.9,2.5],[5.0,1.3],[6.4,1.4],[5.0,3.55]];
      /* toutes sous la surface du liquide (y ≈ 3,97) : une particule
         « dissoute » ne doit pas flotter au-dessus */
      grille.forEach(function(p, i2){
        dessiner(svg, R, {t:"cercle", c:p, r:0.17,
                          couleur: (sol===1 && i2%2) ? "ambre" : "vert",
                          remplir:true, opacite:.85});
      });
    } else if(sol === 3){
      // l'huile ne se mélange pas à l'eau : elle surnage en une couche
      dessiner(svg, R, {t:"rect", x:3.15, y:3.95, w:3.7, h:0.55, couleur:"vert",
                        remplir:true, opacite:.5});
      dessiner(svg, R, {t:"texte", x:7.6, y:4.15, txt:"couche", couleur:"vert", taille:11});
      dessiner(svg, R, {t:"texte", x:7.6, y:3.75, txt:"séparée", couleur:"vert", taille:11});
    } else {
      // le solide reste au fond, en tas
      for(i=0;i<12;i++){
        x = 4.1 + (i%4)*0.55; y = 1.15 + Math.floor(i/4)*0.42;
        dessiner(svg, R, {t:"cercle", c:[x,y], r:0.17,
                          couleur: (sol===1 && i%2) ? "ambre" : "vert",
                          remplir:true, opacite:.85});
      }
      dessiner(svg, R, {t:"texte", x:7.6, y:1.3, txt:"dépôt", couleur:"ink3", taille:11});
    }

    lecture.innerHTML = SOLUTES[sol] + " dans " + SOLVANTS[solv] + " → <b>" +
      (dissout ? "se dissout" : "ne se dissout pas") + "</b>";

    if(dissout && solv === 1 && sol === 1)
      note.innerHTML = "Les molécules d’eau, <b>polaires</b>, entourent chaque ion et le stabilisent presque autant que ses voisins du cristal : celui-ci se disloque, ion par ion. En orange les ions Na⁺, en vert les ions Cl⁻.";
    else if(dissout && solv === 1)
      note.innerHTML = "Le sucre porte de nombreux groupes <b>–OH</b> : il forme des <b>liaisons hydrogène</b> avec l’eau, aussi solides que celles que l’eau forme avec elle-même.";
    else if(dissout)
      note.innerHTML = "Deux espèces apolaires : seules des interactions de <b>van der Waals</b> sont en jeu, de part et d’autre. Rien ne s’oppose au mélange.";
    else if(solv === 1)
      note.innerHTML = "L’huile est <b>apolaire</b> : l’eau ne s’y lie que par de faibles interactions de van der Waals. Les molécules d’eau préfèrent rester liées entre elles et excluent l’huile, qui surnage.";
    else
      note.innerHTML = "Le cyclohexane est <b>apolaire</b> : il ne peut ni entourer un ion (le sel) ni former de liaison hydrogène avec les groupes –OH (le sucre). Le soluté reste au fond, intact." + (sol === 1 ? " En orange les ions Na⁺, en vert les ions Cl⁻." : "");
  }

  curseur(curs, "soluté", 1, 3, 1, sol, function(x){ sol = Math.round(x); dessine(); });
  curseur(curs, "solvant", 1, 2, 1, solv, function(x){ solv = Math.round(x); dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 18. Pourquoi les alcools bouillent bien plus haut que les alcanes -- */
MODELES["ebullition"] = function(){
  var w=450, h=300, n=4, fam=1;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");
  /* températures d'ébullition mesurées, en °C, pour n = 1 à 8 */
  var ALCANES = [null, -161, -89, -42, -0.5, 36, 69, 98, 126];
  var ALCOOLS = [null, 65, 78, 97, 118, 138, 157, 176, 195];
  var NOM_A = [null,"méthane","éthane","propane","butane","pentane","hexane","heptane","octane"];
  var NOM_O = [null,"méthanol","éthanol","propan-1-ol","butan-1-ol","pentan-1-ol","hexan-1-ol","heptan-1-ol","octan-1-ol"];

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var R = repere([0.2, -190, 8.9, 235], w, h, 26, true);
    var serie = fam === 1 ? ALCANES : ALCOOLS;
    var noms  = fam === 1 ? NOM_A : NOM_O;

    dessiner(svg, R, {t:"axes", x0:0.6, y0:-180, ax:"n (carbones)", ay:"T (°C)"});
    // le zéro et les 100 °C, repères parlants
    dessiner(svg, R, {t:"seg", de:[0.6,0], a:[8.7,0], couleur:"line2", pointille:true});
    dessiner(svg, R, {t:"texte", x:8.25, y:-24, txt:"0 °C", couleur:"ink3", taille:10.5});
    dessiner(svg, R, {t:"seg", de:[0.6,100], a:[8.7,100], couleur:"line2", pointille:true});
    dessiner(svg, R, {t:"texte", x:8.15, y:76, txt:"100 °C", couleur:"ink3", taille:10.5});

    // les deux familles, celle qu'on ne regarde pas restant en fond
    var autre = fam === 1 ? ALCOOLS : ALCANES;
    dessiner(svg, R, {t:"courbeXY", couleur:"line2", pointille:true,
                      pts:[1,2,3,4,5,6,7,8].map(function(i){ return [i, autre[i]]; })});
    dessiner(svg, R, {t:"courbeXY", couleur: fam===1 ? "bleu" : "rouge", points:true,
                      pts:[1,2,3,4,5,6,7,8].map(function(i){ return [i, serie[i]]; })});

    var T = serie[n];
    dessiner(svg, R, {t:"seg", de:[n,-180], a:[n,T], couleur:"line2", pointille:true});
    /* repère libre : r est multiplié par R.k (≈ 0,58 px par °C), d'où
       r:10 pour un point d'environ 6 px, bien visible sur la courbe */
    dessiner(svg, R, {t:"cercle", c:[n,T], r:10, couleur:"ambre", remplir:true, opacite:.95});
    /* l'étiquette se place à l'écart des tracés : en dessous à droite
       pour n = 1-2 (plancher −173 °C pour rester au-dessus de l'axe),
       au-dessus à gauche ensuite — balayé sur les 16 états */
    var aDroite = n < 3;
    dessiner(svg, R, {t:"texte", x: aDroite ? n+0.2 : n-0.2, y: aDroite ? Math.max(T-32, -173) : T+14,
                      txt:noms[n], couleur:"ink", taille:12, ancre: aDroite ? "start" : "end"});

    bAlc.className = "btn " + (fam === 1 ? "pri" : "gho");
    bOl.className  = "btn " + (fam === 2 ? "pri" : "gho");
    lecture.innerHTML = noms[n] + " · " + n + " carbone" + (n>1?"s":"") +
      " · T<sub>ébullition</sub> = " + fr(T, T%1 ? 1 : 0).replace("-","−") +
      " °C (sous la pression atmosphérique normale) — à 25 °C, c’est un <b>" +
      (T > 25 ? "liquide" : "gaz") + "</b>";
    note.innerHTML = (fam === 1)
      ? "Chaque carbone ajouté allonge la molécule : les forces de van der Waals augmentent, et la température d’ébullition monte régulièrement. La courbe grise en pointillé montre la même chaîne portant un groupe <b>–OH</b> — <b>toujours bien plus haut</b>."
      : "Un seul groupe <b>–OH</b> suffit à faire gagner plus de <b>200 °C</b> au méthanol par rapport au méthane, à nombre de carbones égal. La cause principale est la <b>liaison hydrogène</b>, bien plus forte que van der Waals. Le méthanol est aussi plus lourd, mais cela n’explique qu’une petite part de l’écart : l’éthane, de masse voisine, bout encore à −89 °C. C’est aussi pourquoi l’eau est liquide alors que le méthane est un gaz.";
  }

  curseur(curs, "nombre de carbones", 1, 8, 1, n, function(x){ n = Math.round(x); dessine(); });
  /* deux boutons plutôt qu'un curseur 1–2 : on choisit une famille,
     on ne règle pas une grandeur */
  var choix = el("div","row");
  var bAlc = el("button","btn pri","Alcanes");
  var bOl  = el("button","btn gho","Alcools (–OH)");
  bAlc.type = bOl.type = "button";
  bAlc.onclick = function(){ fam = 1; dessine(); };
  bOl.onclick  = function(){ fam = 2; dessine(); };
  choix.appendChild(bAlc); choix.appendChild(bOl);
  curs.appendChild(choix);
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- Fluides : écriture d'une pression, « 3,03 × 10⁵ » -- */
var EXPOSANTS = {"-":"⁻","0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹"};
function sciFr(x, d){
  if(x === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(x)));
  var mant = x/Math.pow(10, e);
  /* 9,996 arrondi à deux décimales donnerait « 10,00 × 10⁴ » */
  if(Math.abs(+mant.toFixed(d==null?2:d)) >= 10){ e++; mant = x/Math.pow(10, e); }
  return fr(mant, d==null?2:d) + " × 10" + String(e).split("").map(function(c){ return EXPOSANTS[c]; }).join("");
}
function milliers(n){ return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

/* -- Fluides 1. Un gaz enfermé : on règle le volume et la température -- */
MODELES["gaz"] = function(){
  var w=430, h=250, V=60, Tc=20;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");
  /* 24 entités placées une fois pour toutes, en fractions de la boîte :
     quand le volume change, elles se resserrent sans changer de place
     relative — c'est le même gaz, plus ou moins comprimé. Une moitié fait
     des allers-retours horizontaux (elle frappe le fond et le piston),
     l'autre des allers-retours verticaux (elle frappe le haut et le bas) :
     dans un vrai gaz, toutes les directions sont mêlées. */
  var PARTS = [], graine = 7, i;
  function alea(){ graine = (graine*9301 + 49297) % 233280; return graine/233280; }
  for(i=0;i<24;i++) PARTS.push({fx:alea(), fy:alea(), horiz: i%2===0});
  var X0 = 0.4, Y0 = 0.7, Y1 = 4.7, LMAX = 7.2;     // le cylindre, en unités de la figure
  var PMAX = 4000;                                   // hPa : 60 → 20 mL et 100 °C donnent 3 869 hPa

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var R = repere([0, 0, 10, 5.4], w, h, 12);
    var L = LMAX*V/60, xp = X0 + L;
    var TK = Tc + 273.15;
    var P = 1013*(60/V)*(TK/293.15);                 // hPa ; Mariotte à 20 °C, et P ∝ T à V fixé
    /* vitesse moyenne des entités ∝ √T (en kelvins) : seule la durée des
       animations en dépend, aucune formule n'est affichée */
    var vit = 75*Math.sqrt(TK/293.15);               // px par seconde

    // le gaz, puis les parois fixes (fond, haut, bas) et le piston mobile
    dessiner(svg, R, {t:"rect", x:X0, y:Y0, w:L, h:Y1-Y0, couleur:"bleu", opacite:.07, rond:0});
    dessiner(svg, R, {t:"seg", de:[X0, Y1], a:[X0+LMAX+0.5, Y1], couleur:"ink3", epais:3});
    dessiner(svg, R, {t:"seg", de:[X0, Y0], a:[X0+LMAX+0.5, Y0], couleur:"ink3", epais:3});
    dessiner(svg, R, {t:"seg", de:[X0, Y0], a:[X0, Y1], couleur:"ink3", epais:3});
    dessiner(svg, R, {t:"rect", x:xp, y:Y0+0.05, w:0.3, h:Y1-Y0-0.1, couleur:"ink3", opacite:.55, rond:1});
    dessiner(svg, R, {t:"seg", de:[xp+0.3, (Y0+Y1)/2], a:[X0+LMAX+0.9, (Y0+Y1)/2], couleur:"ink3", epais:4});
    dessiner(svg, R, {t:"texte", x:xp+0.15, y:Y0-0.45, txt:"piston", couleur:"ink3", taille:11});
    dessiner(svg, R, {t:"texte", x:X0+0.1, y:Y1+0.3, txt:"gaz enfermé", couleur:"bleu", taille:11, ancre:"start"});

    PARTS.forEach(function(p){
      var cx = X0 + 0.2 + p.fx*(L - 0.4), cy = Y0 + 0.2 + p.fy*(Y1 - Y0 - 0.4);
      var px = R.X(cx), py = R.Y(cy), r = 4, chemin, long;
      if(p.horiz){
        var a = R.X(X0) + r + 2, b = R.X(xp) - r - 1;
        chemin = "M0 0 L" + (b-px).toFixed(1) + " 0 L" + (a-px).toFixed(1) + " 0 Z";
        long = 2*(b - a);
      } else {
        var haut = R.Y(Y1) + r + 2, bas = R.Y(Y0) - r - 2;
        chemin = "M0 0 L0 " + (haut-py).toFixed(1) + " L0 " + (bas-py).toFixed(1) + " Z";
        long = 2*(bas - haut);
      }
      var c = n("circle", {cx:px, cy:py, r:r, fill:coul("bleu")});
      animer(c, [{motion:chemin, dur:(long/vit).toFixed(2)+"s"}]);
      svg.appendChild(c);
    });

    // la jauge de pression : sa hauteur suit P
    var xb = 9.0, hb = (Y1-Y0)*Math.min(1, P/PMAX);
    dessiner(svg, R, {t:"rect", x:xb, y:Y0, w:0.5, h:Y1-Y0, couleur:"line2", remplir:false, rond:2});
    dessiner(svg, R, {t:"rect", x:xb, y:Y0, w:0.5, h:hb, couleur:"rouge", opacite:.55, rond:2});
    dessiner(svg, R, {t:"texte", x:xb+0.25, y:Y1+0.3, txt:"pression", couleur:"rouge", taille:11});

    lecture.innerHTML = "V = " + V + " mL · T = " + String(Tc).replace("-", "−") + " °C · P ≈ " + milliers(P) +
      " hPa · P × V ≈ " + milliers(Math.round(P*V/10)*10) + " hPa·mL";
    var texte;
    if(Tc === 20 && V === 60)
      texte = "Le gaz à $20$ °C, dans $60$ @u{mL}, sous $1013$ @u{hPa}. Enfonce le piston avec le curseur du volume, et regarde le produit $P × V$.";
    else if(Tc === 20)
      texte = "Volume divisé par $" + (Math.abs(60/V - Math.round(6000/V)/100) > 1e-9 ? "≈ " : "") + fr(60/V, 2).replace(/0+$/, "").replace(/,$/, "") + "$ : les entités sont plus serrées et leurs allers-retours jusqu'au piston plus courts, elles le frappent plus souvent. La pression est multipliée par ce même nombre, et $P × V$ reste égal à $60 780$ @u{hPa·mL} : c'est la loi de Mariotte.";
    else
      texte = "À " + String(Tc).replace("-", "−") + " °C, les entités vont " + (Tc > 20 ? "plus" : "moins") + " vite qu'à $20$ °C : leurs chocs sont " + (Tc > 20 ? "plus fréquents et plus forts" : "plus rares et plus faibles") + ", et la pression " + (Tc > 20 ? "monte" : "baisse") + " sans que le volume change. $P × V$ reste constant si tu bouges seulement le volume, mais sa valeur n'est plus celle de $20$ °C : la loi de Mariotte ne compare que des états **à la même température**.";
    note.innerHTML = T(texte);
  }

  curseur(curs, "volume V (mL)", 20, 60, 5, V, function(x){ V = x; dessine(); });
  curseur(curs, "température (°C)", -20, 100, 10, Tc, function(x){ Tc = x; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- Fluides 2. La pression dans un liquide : deux points, deux altitudes -- */
MODELES["colonne"] = function(){
  var w=430, h=330, zA=-5, zB=-25, mer=false;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");
  var PATM = 1.013e5, g = 9.81;

  /* quatre flèches dirigées vers le point : le liquide pousse dans toutes
     les directions, aussi fort de tous les côtés. Leur longueur, en
     pixels (le repère n'est pas orthonormé), suit la pression. */
  function etoile(R, x, z, P, couleur){
    var Lp = 8 + 24*(P - PATM)/(4.3e5), gap = 7;
    var dx = function(p){ return p/R.kx; }, dz = function(p){ return p/R.ky; };
    dessiner(svg, R, {t:"vec", de:[x - dx(gap+Lp), z], a:[x - dx(gap), z], couleur:couleur});
    dessiner(svg, R, {t:"vec", de:[x + dx(gap+Lp), z], a:[x + dx(gap), z], couleur:couleur});
    dessiner(svg, R, {t:"vec", de:[x, z + dz(gap+Lp)], a:[x, z + dz(gap)], couleur:couleur});
    dessiner(svg, R, {t:"vec", de:[x, z - dz(gap+Lp)], a:[x, z - dz(gap)], couleur:couleur});
  }

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var R = repere([0, -49.5, 10, 7.5], w, h, 14, true);
    var rho = mer ? 1030 : 1000;
    var PA = PATM + rho*g*(-zA), PB = PATM + rho*g*(-zB);
    var xA = 3.6, xB = 6.6;

    dessiner(svg, R, {t:"rect", x:1.6, y:-48, w:8.0, h:48, couleur:"bleu", opacite: mer ? .17 : .09, rond:0});
    dessiner(svg, R, {t:"seg", de:[1.6, 0], a:[9.6, 0], couleur:"bleu", epais:2.6});
    /* au-dessus de la plus haute étiquette possible (z = −1 m) ; le nom du
       liquide est dans la lecture et sur les boutons, pas dans l'eau, où il
       croisait l'étiquette d'un point placé au fond */
    dessiner(svg, R, {t:"texte", x:9.6, y:5.0, txt:"air : P = Patm = 1,013 × 10⁵ Pa", couleur:"ink3", taille:11.5, ancre:"end"});

    // l'axe des altitudes, orienté vers le haut, origine à la surface
    dessiner(svg, R, {t:"vec", de:[0.9, -49], a:[0.9, 5], couleur:"ink3"});
    dessiner(svg, R, {t:"texte", x:1.1, y:4.2, txt:"z (m)", couleur:"ink2", taille:11.5, ancre:"start"});
    [0, -10, -20, -30, -40].forEach(function(z){
      dessiner(svg, R, {t:"seg", de:[0.75, z], a:[1.05, z], couleur:"ink3", epais:1.4});
      dessiner(svg, R, {t:"texte", x:0.6, y:z - 1.2, txt:(z === 0 ? "0" : "−" + (-z)), couleur:"ink3", taille:10.5, ancre:"end"});
    });

    // l'écart d'altitude entre A et B
    if(Math.abs(zA - zB) >= 3){
      var xm = (xA + xB)/2;
      dessiner(svg, R, {t:"seg", de:[xm, zA], a:[xm, zB], couleur:"ink3", epais:1.4, pointille:true});
      dessiner(svg, R, {t:"texte", x:xm + 0.15, y:(zA + zB)/2 - 1, txt:Math.abs(zA - zB) + " m", couleur:"ink", taille:11.5, ancre:"start"});
    }

    etoile(R, xA, zA, PA, "vert");
    etoile(R, xB, zB, PB, "ambre");
    dessiner(svg, R, {t:"point", x:xA, y:zA, couleur:"vert"});
    dessiner(svg, R, {t:"point", x:xB, y:zB, couleur:"ambre"});
    dessiner(svg, R, {t:"texte", x:xA - 0.9, y:Math.min(zA + 1.6, -2.2), txt:"A", couleur:"vert", taille:13, ancre:"end"});
    dessiner(svg, R, {t:"texte", x:xA - 0.9, y:zA - 3.2, txt:sciFr(PA) + " Pa", couleur:"vert", taille:11, ancre:"end"});
    dessiner(svg, R, {t:"texte", x:xB + 0.9, y:Math.min(zB + 1.6, -2.2), txt:"B (plongeur)", couleur:"ambre", taille:13, ancre:"start"});
    dessiner(svg, R, {t:"texte", x:xB + 0.9, y:zB - 3.2, txt:sciFr(PB) + " Pa", couleur:"ambre", taille:11, ancre:"start"});

    bDouce.className = "btn " + (mer ? "gho" : "pri");
    bMer.className   = "btn " + (mer ? "pri" : "gho");
    var dP = PB - PA;
    lecture.innerHTML = (mer ? "eau de mer" : "eau douce") + " · z<sub>A</sub> = " + (zA < 0 ? "−" + (-zA) : "0") + " m · z<sub>B</sub> = " + (zB < 0 ? "−" + (-zB) : "0") + " m · ρ = " +
      milliers(rho) + " kg/m³<br>P<sub>B</sub> − P<sub>A</sub> = ρ g (z<sub>A</sub> − z<sub>B</sub>) = " +
      (dP === 0 ? "0" : (dP < 0 ? "−" : "") + sciFr(Math.abs(dP))) + " Pa";
    var texte;
    if(zA === zB)
      texte = "A et B sont à la même altitude : leurs pressions sont **égales**, et leurs flèches de même longueur. Dans un liquide au repos, la pression ne dépend que de l'altitude.";
    else {
      var bas = zB < zA ? "B" : "A", haut = zB < zA ? "A" : "B", dz = Math.abs(zA - zB);
      texte = bas + " est $" + dz + "$ @u{m} plus bas que " + haut + " : sa pression est plus grande de $ρ g × " + dz + "$ @u{m} $≈ " +
        fr(rho*g*dz/1e5, 2) + "$ bar, et ses flèches sont plus longues. Environ $1$ bar tous les $10$ @u{m} d'eau." +
        (mer ? " L'eau de mer, un peu plus dense, donne un écart un peu plus grand que l'eau douce." : "");
    }
    note.innerHTML = T(texte);
  }

  curseur(curs, "altitude de A, zA (m)", -40, -3, 1, zA, function(x){ zA = x; dessine(); });
  curseur(curs, "altitude de B, zB (m)", -40, -3, 1, zB, function(x){ zB = x; dessine(); });
  var choix = el("div","row");
  var bDouce = el("button","btn pri","Eau douce");
  var bMer   = el("button","btn gho","Eau de mer");
  bDouce.type = bMer.type = "button";
  bDouce.onclick = function(){ mer = false; dessine(); };
  bMer.onclick   = function(){ mer = true;  dessine(); };
  choix.appendChild(bDouce); choix.appendChild(bMer);
  curs.appendChild(choix);
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- Champs 1. Une charge ponctuelle : son champ en P, et la force si l'on y place une charge --
   L'attribut data-etat du SVG publie la géométrie dessinée (P, E, F) : le
   balayage du parcours vérifie par le calcul que E est radial, de bon sens,
   en 1/d², et que F n'existe qu'avec une charge en P. */
MODELES["charge"] = function(){
  var w=430, h=380, signeQ=1, dcm=3, angle=30, test=0;     // test : 0 aucune charge en P, ±1 signe de q
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");
  var K = 9.0e9, Q = 1.0e-8, QT = 1.0e-9;                  // |Q| = 10 nC, |q| = 1,0 nC
  var ECH = 4, ECH_F = 1.25, RQ = 0.42, BORD = 4.8;         // flèche E = ECH/d² (d en cm = unités)

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var R = repere([-5, -5, 5, 5], w, h, 10);
    var i, a, ux, uy, L;
    // les 12 lignes de champ radiales, et leur sens
    for(i=0;i<12;i++){
      a = i*Math.PI/6; ux = Math.cos(a); uy = Math.sin(a);
      L = Math.min(Math.abs(ux) > 1e-9 ? BORD/Math.abs(ux) : 1e9, Math.abs(uy) > 1e-9 ? BORD/Math.abs(uy) : 1e9);
      dessiner(svg, R, {t:"seg", de:[RQ*ux, RQ*uy], a:[L*ux, L*uy], couleur:"line2", epais:1.4});
      /* pas de pointe grise sur la ligne de P : elle se confondait avec P,
         la flèche E ou l'étiquette P */
      if(i === Math.round(angle/30) % 12) continue;
      var r1 = signeQ > 0 ? 3.3 : 3.7, r2 = signeQ > 0 ? 3.7 : 3.3;
      dessiner(svg, R, {t:"vec", de:[r1*ux, r1*uy], a:[r2*ux, r2*uy], couleur:"ink3"});
    }
    // la source
    dessiner(svg, R, {t:"cercle", c:[0,0], r:RQ, couleur: signeQ > 0 ? "rouge" : "bleu", remplir:true, opacite:.85});
    dessiner(svg, R, {t:"texte", x:0, y:-0.17, txt: signeQ > 0 ? "+" : "−", couleur:"ink", taille:17});

    // le point P, sur une ligne de champ
    a = angle*Math.PI/180; ux = Math.cos(a); uy = Math.sin(a);
    var px = dcm*ux, py = dcm*uy, LE = ECH/(dcm*dcm);
    var ex = signeQ*LE*ux, ey = signeQ*LE*uy;
    var nx = -uy, ny = ux;                                  // normale, pour placer les étiquettes
    var Fv = null;
    /* la charge test d'abord : dessinée par-dessus, elle cachait la flèche E à grande distance */
    if(test) dessiner(svg, R, {t:"cercle", c:[px, py], r:0.14, couleur: test > 0 ? "rouge" : "bleu", remplir:true, opacite:.9});
    if(test){
      var LF = ECH_F*LE, s = test*signeQ;
      Fv = [s*LF*ux, s*LF*uy];
      dessiner(svg, R, {t:"vec", de:[px, py], a:[px+Fv[0], py+Fv[1]], couleur:"ambre", epMin:3.4});
      /* étiquette au milieu de la flèche, côté +n : loin des deux pointes */
      dessiner(svg, R, {t:"texte", x:px+0.5*Fv[0]+0.6*nx, y:py+0.5*Fv[1]+0.6*ny-0.15, txt:"F", couleur:"ambre", taille:13});
    }
    dessiner(svg, R, {t:"vec", de:[px, py], a:[px+ex, py+ey], couleur:"vert"});
    dessiner(svg, R, {t:"texte", x:px+0.5*ex-0.6*nx, y:py+0.5*ey-0.6*ny-0.15, txt:"E", couleur:"vert", taille:13});
    if(!test) dessiner(svg, R, {t:"point", x:px, y:py, couleur:"ink"});
    /* l'étiquette P : la première place libre, loin des étiquettes E et F et de la source */
    var occupe = [[px+0.5*ex-0.6*nx, py+0.5*ey-0.6*ny], [0, 0], [px+ex, py+ey]];
    if(Fv){ occupe.push([px+0.5*Fv[0]+0.6*nx, py+0.5*Fv[1]+0.6*ny]); occupe.push([px+Fv[0], py+Fv[1]]); }
    /* les pointes grises des lignes voisines */
    for(var iv=0;iv<12;iv++){ var av = iv*Math.PI/6; occupe.push([3.5*Math.cos(av), 3.5*Math.sin(av)]); }
    var dirs = [[nx, ny], [-nx, -ny], [ux, uy], [-ux, -uy], [nx+ux, ny+uy], [nx-ux, ny-uy], [ux-nx, uy-ny], [-nx-ux, -ny-uy]];
    var cands = [];
    [0.6, 0.95, 1.3].forEach(function(r){ dirs.forEach(function(d){ var l = Math.hypot(d[0], d[1]); cands.push([r*d[0]/l, r*d[1]/l]); }); });
    var pl = cands[0];
    for(var c=0;c<cands.length;c++){
      var cx = px+cands[c][0], cy = py+cands[c][1];
      if(Math.abs(cx) <= 4.6 && cy <= 4.55 && cy >= -4.75 &&
         occupe.every(function(o, k){ return Math.hypot(cx-o[0], cy-o[1]) >= (k === 1 ? 1.0 : k === 0 || k === 3 ? 0.75 : 0.5); })){ pl = cands[c]; break; }
    }
    dessiner(svg, R, {t:"texte", x:px+pl[0], y:py+pl[1]-0.15, txt:"P", couleur:"ink", taille:13});

    svg.setAttribute("data-etat", JSON.stringify({Q:signeQ, test:test, d:dcm, P:[px,py], E:[ex,ey], F:Fv}));

    bPlus.className = "btn " + (signeQ > 0 ? "pri" : "gho");
    bMoins.className = "btn " + (signeQ < 0 ? "pri" : "gho");
    [b0, bqp, bqm].forEach(function(b, k){ b.className = "btn " + ([0, 1, -1][k] === test ? "pri" : "gho"); });
    var E = K*Q/Math.pow(dcm/100, 2);
    lecture.innerHTML = "source Q (au centre) = " + (signeQ > 0 ? "+" : "−") + "10 nC · d = " + fr(dcm, 1) + " cm · E = k|Q|/d² ≈ " + sciFr(E) + " N/C" +
      (test ? "<br>q = " + (test > 0 ? "+" : "−") + "1,0 nC en P · F = |q| × E ≈ " + sciFr(QT*E) + " N" : "");
    var sensE = signeQ > 0 ? "en s'éloignant de Q, qui est positive" : "vers Q, qui est négative";
    var texte = test
      ? "Une charge $q " + (test > 0 ? "> 0" : "< 0") + "$ placée en P subit $@v{F} = q@v{E}$ : la force est " +
        (test > 0 ? "**dans le même sens** que le champ." : "**de sens opposé** au champ.") +
        " Le champ, lui, n'a pas changé. (La flèche F n'est pas « plus grande » ou « plus petite » que la flèche E : ce sont deux grandeurs différentes, en @u{N} et en @u{N/C}, qu'on ne compare pas, pas plus que des kilomètres et des km/h.)"
      : "Aucune charge en P : il n'y a **pas de force**, mais le champ $@v{E}$ existe bien en P, créé par Q. Il suit la ligne qui passe par P, dirigé " + sensE + ". Place une charge en P pour voir apparaître la force.";
    note.innerHTML = T(texte);
  }

  curseur(curs, "distance d (cm)", 2, 4, 0.5, dcm, function(x){ dcm = x; dessine(); });
  curseur(curs, "position autour de Q (°)", 0, 330, 30, angle, function(x){ angle = x; dessine(); });
  var l1 = el("div","row"), l2 = el("div","row");
  var bPlus = el("button","btn pri","Q > 0"), bMoins = el("button","btn gho","Q < 0");
  var b0 = el("button","btn pri","Pas de charge en P"), bqp = el("button","btn gho","q > 0 en P"), bqm = el("button","btn gho","q < 0 en P");
  [bPlus, bMoins, b0, bqp, bqm].forEach(function(b){ b.type = "button"; });
  bPlus.onclick = function(){ signeQ = 1; dessine(); };
  bMoins.onclick = function(){ signeQ = -1; dessine(); };
  b0.onclick = function(){ test = 0; dessine(); };
  bqp.onclick = function(){ test = 1; dessine(); };
  bqm.onclick = function(){ test = -1; dessine(); };
  l1.appendChild(bPlus); l1.appendChild(bMoins);
  l2.appendChild(b0); l2.appendChild(bqp); l2.appendChild(bqm);
  curs.appendChild(l1); curs.appendChild(l2);
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- Champs 2. Cartes de lignes de champ : deux charges, ou deux plaques --
   Les lignes des deux charges sont CALCULÉES : on suit pas à pas la
   direction du champ réel (somme des champs en 1/d², méthode du point
   milieu), depuis des points répartis régulièrement autour de chaque charge
   positive. Elles sont donc justes par construction : tangentes au champ,
   issues de + et finissant sur − ou au bord, serrées près des charges. */
MODELES["cartes"] = function(){
  var w=430, h=330, conf="dipole", sx=0, sy=1.5;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");
  var VUE = [-5, -3.6, 5, 3.6], A = 1.6, RC = 0.3, PAS = 0.03, NL = 16;
  var EREF = 2/(A*A);                                       // |E| au milieu du segment, pour (+,−)

  function charges(){
    return conf === "dipole" ? [{x:-A, y:0, q:1}, {x:A, y:0, q:-1}] : [{x:-A, y:0, q:1}, {x:A, y:0, q:1}];
  }
  function champ(x, y, cs){
    var ex = 0, ey = 0;
    for(var i=0;i<cs.length;i++){
      var dx = x - cs[i].x, dy = y - cs[i].y, r2 = dx*dx + dy*dy, r = Math.sqrt(r2);
      ex += cs[i].q*dx/(r2*r); ey += cs[i].q*dy/(r2*r);
    }
    return [ex, ey];
  }
  function dedans(x, y){ return x >= VUE[0] && x <= VUE[2] && y >= VUE[1] && y <= VUE[3]; }
  /* une ligne depuis (x, y), dans le sens du champ (sens = 1) ou à rebours (−1) */
  function ligne(x, y, cs, sens){
    var pts = [[x, y]], fin = "pas";
    for(var n=0;n<1600;n++){
      var e = champ(x, y, cs), ne = Math.hypot(e[0], e[1]);
      if(ne < 1e-4){ fin = "nul"; break; }
      var mx = x + sens*PAS/2*e[0]/ne, my = y + sens*PAS/2*e[1]/ne;
      var e2 = champ(mx, my, cs), n2 = Math.hypot(e2[0], e2[1]);
      if(n2 < 1e-4){ fin = "nul"; break; }
      x += sens*PAS*e2[0]/n2; y += sens*PAS*e2[1]/n2;
      if(!dedans(x, y)){ fin = "bord"; break; }
      var arrivee = null;
      for(var i=0;i<cs.length;i++) if(Math.hypot(x - cs[i].x, y - cs[i].y) < RC) arrivee = cs[i];
      if(arrivee){ fin = arrivee.q < 0 ? "moins" : "plus"; break; }
      pts.push([x, y]);
    }
    return {pts:pts, fin:fin};
  }

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var R = repere(VUE, w, h, 8);
    var etat = {conf:conf, lignes:[], sonde:[sx, sy], E:null, tangente:null};
    var pointes = [];
    /* la pointe d'une ligne : là où elle est à au moins 0,9 de la charge donnée */
    function pointe(pts, c, depuisFin){
      var n2 = pts.length, idx = -1;
      for(var t=0;t<n2-4;t++){
        var q = depuisFin ? n2 - 5 - t : t;
        if(q < 0 || q + 4 >= n2) continue;
        if(Math.hypot(pts[q][0] - c.x, pts[q][1] - c.y) >= 0.9){ idx = q; break; }
      }
      if(idx < 0) return;
      dessiner(svg, R, {t:"vec", de:pts[idx], a:pts[idx+4], couleur:"bleu"});
      pointes.push(pts[idx+4]);
    }
    var i, k;
    if(conf !== "plaques"){
      var cs = charges();
      cs.forEach(function(c){
        if(c.q < 0) return;
        for(k=0;k<NL;k++){
          var a = (k + 0.5)*2*Math.PI/NL;
          var l = ligne(c.x + (RC + 0.02)*Math.cos(a), c.y + (RC + 0.02)*Math.sin(a), cs, 1);
          if(l.pts.length < 2) continue;
          dessiner(svg, R, {t:"courbeXY", pts:l.pts, couleur:"bleu", epais:1.5});
          pointe(l.pts, c, false);
          etat.lignes.push({de:l.pts[0], a:l.pts[l.pts.length - 1], fin:l.fin, n:l.pts.length});
        }
      });
      /* Les lignes semées autour de la charge + n'arrivent sur la − que du côté
         qui lui fait face. On sème aussi autour de chaque charge −, en remontant
         le champ : celles qui reviennent au + doublonnent, on ne garde que celles
         qui viennent du bord, et on les oriente vers la charge. Sans elles, la
         moitié extérieure de la charge − restait vide, comme si le champ y était
         faible. */
      cs.forEach(function(c){
        if(c.q > 0) return;
        for(k=0;k<NL;k++){
          var a = (k + 0.5)*2*Math.PI/NL;
          var l = ligne(c.x + (RC + 0.02)*Math.cos(a), c.y + (RC + 0.02)*Math.sin(a), cs, -1);
          if(l.fin !== "bord" || l.pts.length < 2) continue;
          var p2 = l.pts.slice().reverse();                 // du bord vers la charge, dans le sens du champ
          dessiner(svg, R, {t:"courbeXY", pts:p2, couleur:"bleu", epais:1.5});
          pointe(p2, c, true);
          etat.lignes.push({de:p2[0], a:p2[p2.length - 1], fin:"moins", depuis:"bord", n:p2.length});
        }
      });
      /* les charges elles-mêmes sont dessinées en dernier, par-dessus la flèche de la sonde */
    } else {
      dessiner(svg, R, {t:"rect", x:-2.25, y:-2.7, w:0.25, h:5.4, couleur:"rouge", opacite:.6, rond:1});
      dessiner(svg, R, {t:"rect", x:2.0, y:-2.7, w:0.25, h:5.4, couleur:"bleu", opacite:.6, rond:1});
      /* au-dessus des plaques, hors de portée de la sonde (y ≤ 3) */
      dessiner(svg, R, {t:"texte", x:-2.1, y:3.2, txt:"plaque +", couleur:"rouge", taille:11.5});
      dessiner(svg, R, {t:"texte", x:2.1, y:3.2, txt:"plaque −", couleur:"bleu", taille:11.5});
      for(k=-4;k<=4;k++){
        var yk = 0.6*k;
        dessiner(svg, R, {t:"seg", de:[-2.0, yk], a:[2.0, yk], couleur:"bleu", epais:1.5});
        dessiner(svg, R, {t:"vec", de:[-0.2, yk], a:[0.2, yk], couleur:"bleu"});
        pointes.push([0.2, yk]);
        etat.lignes.push({de:[-2.0, yk], a:[2.0, yk], fin:"plaque"});
      }
      dessiner(svg, R, {t:"texte", x:0, y:-3.35, txt:"bords des plaques ignorés ; champ négligeable à l'extérieur", couleur:"ink3", taille:10.5});
    }

    /* la sonde : le champ en S, et la ligne de champ qui passe par S */
    var E = null, msg = "", tropPres = false;
    if(conf === "plaques"){
      if(Math.abs(Math.abs(sx) - 2) < 0.2 && Math.abs(sy) <= 2.7) msg = "sonde sur une plaque";
      else if(Math.abs(sx) < 2 && Math.abs(sy) <= 2.7) E = [1, 0];
      else if(Math.abs(sx) <= 2.5) msg = "au bord des plaques : le champ n'y est plus uniforme (non représenté)";
      else msg = "hors des plaques : champ négligeable";
    } else {
      var cs2 = charges();
      cs2.forEach(function(c){ if(Math.hypot(sx - c.x, sy - c.y) < RC + 0.25) tropPres = true; });
      if(tropPres) msg = "sonde sur une charge";
      else {
        var e = champ(sx, sy, cs2), ne = Math.hypot(e[0], e[1]);
        if(ne < 1e-3) msg = "champ nul en ce point";
        else {
          E = [e[0]/ne, e[1]/ne];
          var av = ligne(sx, sy, cs2, 1), ar = ligne(sx, sy, cs2, -1);
          var pl = ar.pts.slice(1).reverse().concat(av.pts);
          if(pl.length > 1) dessiner(svg, R, {t:"courbeXY", pts:pl, couleur:"ambre", epais:1.6, pointille:true});
          if(av.pts.length > 1){
            var q = av.pts[1];
            etat.tangente = [(q[0] - sx)/PAS, (q[1] - sy)/PAS];
          }
          etat.Eabs = ne;
          /* longueur toujours proportionnelle au champ (plafonnée, avec message) :
             la raccourcir pour éviter une charge montrait un champ qui faiblit
             en approchant de la charge −, ce qui est faux. Ce sont les charges,
             redessinées par-dessus, qui restent lisibles. */
          var Lp = Math.min(1.5, 0.9*ne/EREF), arretee = false;
          /* si la flèche entrait dans le disque d'une charge, sa pointe disparaissait
             dessous, ou un morceau ressortait de l'autre côté, à contre-sens : on
             l'arrête au bord du disque, et on le dit */
          cs2.forEach(function(c){
            var bx = sx - c.x, by = sy - c.y, bb = bx*E[0] + by*E[1], cc = bx*bx + by*by - RC*RC, dis = bb*bb - cc;
            if(dis > 0){
              var t1 = -bb - Math.sqrt(dis);
              if(t1 > 0 && t1 < Lp + 0.05){ Lp = Math.max(0.05, t1 - 0.08); arretee = true; }
            }
          });
          E = [E[0]*Lp, E[1]*Lp];
          etat.arretee = arretee;
          if(arretee) msg = "flèche arrêtée au bord de la charge : à cette échelle, elle la dépasserait";
          else if(0.9*ne/EREF > 1.5) msg = "flèche raccourcie : trop longue à cette échelle";
        }
      }
    }
    /* entre les plaques, la flèche s'arrête avant la plaque − */
    if(conf === "plaques" && E){ E = [Math.min(0.9, 1.95 - sx), 0]; etat.tangente = [1, 0]; }
    etat.E = E;
    dessiner(svg, R, {t:"cercle", c:[sx, sy], r:0.12, couleur:"ambre", remplir:true, opacite:1});
    if(E){
      dessiner(svg, R, {t:"vec", de:[sx, sy], a:[sx + E[0], sy + E[1]], couleur:"ambre", epMin:3});
    }
    if(conf !== "plaques") charges().forEach(function(c){
      dessiner(svg, R, {t:"cercle", c:[c.x, c.y], r:RC, couleur: c.q > 0 ? "rouge" : "bleu", remplir:true, opacite:1});
      dessiner(svg, R, {t:"texte", x:c.x, y:c.y - 0.13, txt: c.q > 0 ? "+" : "−", couleur:"ink", taille:15});
    });
    var occ = conf === "plaques" ? [[-2.6, 3.2], [-2.1, 3.2], [-1.6, 3.2], [1.6, 3.2], [2.1, 3.2], [2.6, 3.2]] : charges().map(function(c){ return [c.x, c.y]; });
    if(E) occ.push([sx + E[0], sy + E[1]]);
    var occP = pointes;
    if(E) occ.push([sx + 0.5*E[0], sy + 0.5*E[1]]);
    var cs3 = [], ps;
    [0.45, 0.8, 1.15, 1.5].forEach(function(r){ [[-1, 1], [1, 1], [-1, -1.4], [1, -1.4], [0, 1.2], [0, -1.6], [-1.3, 0], [1.3, 0]].forEach(function(d){
      var l = Math.hypot(d[0], d[1]); cs3.push([r*d[0]/l, r*d[1]/l]); }); });
    /* sonde collée à une charge, au milieu de l'anneau des pointes : aucune place
       libre ; la sonde reste visible (disque ambre) et nommée dans la lecture */
    ps = null;
    for(var c3=0;c3<cs3.length;c3++){
      var lx = sx + cs3[c3][0], ly = sy + cs3[c3][1];
      /* l'ancre est à un bout du texte : on teste aussi son milieu, à 0,15 de là */
      var mx = lx + (cs3[c3][0] < 0 ? -0.15 : 0.15), my = ly + 0.12;
      if(ly > -3.0 && ly < 3.45 && mx > -4.75 && mx < 4.75 &&
         occ.every(function(o){ return Math.hypot(mx - o[0], my - o[1]) >= 0.6; }) &&
         occP.every(function(o){ return Math.hypot(mx - o[0], my - o[1]) >= 0.6; })){ ps = cs3[c3]; break; }
    }
    if(ps) dessiner(svg, R, {t:"texte", x:sx + ps[0], y:sy + ps[1], txt:"S", couleur:"ambre", taille:12.5, ancre: ps[0] < 0 ? "end" : "start"});
    svg.setAttribute("data-etat", JSON.stringify(etat));

    [bDip, bPP, bPl].forEach(function(b, k2){ b.className = "btn " + (["dipole", "plusplus", "plaques"][k2] === conf ? "pri" : "gho"); });
    var nom = conf === "dipole" ? "deux charges opposées" : conf === "plusplus" ? "deux charges positives" : "deux plaques de charges opposées";
    lecture.innerHTML = nom + " · sonde S (" + fr(sx, 1) + " ; " + fr(sy, 1) + ")" + (msg ? " · " + msg : "");
    var texte = conf === "dipole"
      ? "Les lignes partent de la charge **positive** et arrivent sur la **négative**, de tous les côtés. Elles sont serrées près des charges, où le champ est intense, et s'écartent loin d'elles. En S, la flèche du champ est **tangente** à la ligne qui passe par S (en pointillé)."
      : conf === "plusplus"
      ? "Deux charges positives **de même valeur** : les lignes partent des deux charges et s'évitent. Entre elles, une zone presque vide de lignes, où le champ est faible ; au milieu exact, les deux champs se compensent, il est **nul**. Place la sonde en (0 ; 0) pour le vérifier."
      : "Entre les plaques, loin de leurs bords, les lignes sont **parallèles, de même sens et également espacées** : le champ est **uniforme**, la même flèche partout. Déplace la sonde entre les plaques : elle ne change pas.";
    note.innerHTML = T(texte);
  }

  var choix = el("div","row");
  var bDip = el("button","btn pri","+ et −"), bPP = el("button","btn gho","+ et +"), bPl = el("button","btn gho","Deux plaques");
  [bDip, bPP, bPl].forEach(function(b){ b.type = "button"; choix.appendChild(b); });
  bDip.onclick = function(){ conf = "dipole"; dessine(); };
  bPP.onclick = function(){ conf = "plusplus"; dessine(); };
  bPl.onclick = function(){ conf = "plaques"; dessine(); };
  curs.appendChild(choix);
  curseur(curs, "sonde : x", -4.5, 4.5, 0.5, sx, function(x){ sx = x; dessine(); });
  curseur(curs, "sonde : y", -3, 3, 0.5, sy, function(x){ sy = x; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- Champs 3. Le champ de pesanteur, uniforme à petite échelle --
   On regarde une zone de largeur L au-dessus d'un point du sol. Les lignes
   du champ de gravitation sont radiales (vers le centre de la Terre) ; quand
   L devient petit devant R_T, elles deviennent parallèles et équidistantes. */
MODELES["pesanteur"] = function(){
  var w=430, h=330, ZONES=[20000, 5000, 1000, 200, 50, 10], iz=0, RT=6400;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var L = ZONES[iz], y0 = -0.4*L, y1 = 0.6*L;
    var R = repere([-L/2, y0, L/2, y1], w, h, 0);
    var etat = {L:L, lignes:[]};
    /* le disque de la Terre est bien plus grand que la fenêtre : sans découpe,
       il débordait du SVG et teintait la page en dessous */
    var idClip = "clipPes" + Math.random().toString(36).slice(2, 8);
    var defs = n("defs", {}), cp = n("clipPath", {id:idClip});
    cp.appendChild(n("rect", {x:0, y:0, width:w, height:h}));
    defs.appendChild(cp); svg.appendChild(defs);
    var fond = n("g", {"clip-path":"url(#" + idClip + ")"});
    svg.appendChild(fond);
    // la Terre, centrée en (0 ; −R_T), le point du sol observé en (0 ; 0)
    dessiner(fond, R, {t:"cercle", c:[0, -RT], r:RT, couleur:"vert", remplir:true, opacite:.16});
    var N = 13, thetas = [];
    for(var i=0;i<N;i++){
      var x = (i - (N - 1)/2)*L/(N + 1);
      if(Math.abs(x) >= 0.97*RT) continue;
      var th = Math.asin(x/RT), ux = Math.sin(th), uy = Math.cos(th);
      var sx0 = RT*ux, sy0 = RT*uy - RT;                    // point de la surface
      // jusqu'au bord de la fenêtre, en s'éloignant du centre
      var t = Infinity;
      if(uy > 1e-12) t = Math.min(t, (y1 - sy0)/uy);
      if(ux > 1e-12) t = Math.min(t, (L/2 - sx0)/ux);
      if(ux < -1e-12) t = Math.min(t, (-L/2 - sx0)/ux);
      if(!(t > 0)) continue;
      var ex0 = sx0 + t*ux, ey0 = sy0 + t*uy;
      dessiner(svg, R, {t:"seg", de:[ex0, ey0], a:[sx0, sy0], couleur:"bleu", epais:1.5});
      dessiner(svg, R, {t:"vec", de:[sx0 + 0.62*t*ux, sy0 + 0.62*t*uy], a:[sx0 + 0.48*t*ux, sy0 + 0.48*t*uy], couleur:"bleu"});
      thetas.push(th);
      etat.lignes.push({sol:[sx0, sy0], haut:[ex0, ey0]});
    }
    var dth = (thetas[thetas.length - 1] - thetas[0])*180/Math.PI;
    var ecart = etat.lignes[etat.lignes.length - 1].sol[0] - etat.lignes[0].sol[0];
    var dg = 100*(1 - Math.pow(RT/(RT + y1), 2));
    etat.angle = dth; etat.dg = dg;
    svg.setAttribute("data-etat", JSON.stringify(etat));
    dessiner(svg, R, {t:"texte", x:0, y:y0 + 0.1*L, txt:"Terre", couleur:"vert", taille:13});
    dessiner(svg, R, {t:"texte", x:-L/2 + 0.02*L, y:y1 - 0.06*L, txt:"zone de " + milliers(L) + " km de large", couleur:"ink2", taille:12, ancre:"start"});
    /* deux chiffres significatifs : « 2° » pour 1,53° trompait */
    var fa = function(v){ var r = +v.toPrecision(v >= 100 ? 3 : 2); return r >= 1000 ? milliers(r) : String(r).replace(".", ","); };
    lecture.innerHTML = "zone de " + milliers(L) + " km · lignes extrêmes distantes de " + fa(ecart) + " km au sol, angle " + fa(dth) +
      "° · g diminue de " + fa(dg) + " % du sol au haut de la zone";
    var texte = L >= 5000
      ? "À cette échelle, les lignes du champ de gravitation **convergent** visiblement vers le centre de la Terre : le champ change de direction d'un endroit à l'autre, et sa valeur diminue nettement avec l'altitude."
      : L >= 200
      ? "Les lignes se rapprochent du parallélisme, mais l'écart d'angle et la variation de $g$ restent mesurables. Réduis encore la zone."
      : "À l'échelle d'une région, les lignes sont **parallèles et également espacées**, toutes dirigées vers le bas : le champ de pesanteur est **uniforme localement**. Même direction, même sens, presque la même valeur partout.";
    note.innerHTML = T(texte);
  }

  curseur(curs, "taille de la zone", 0, ZONES.length - 1, 1, iz, function(x){ iz = Math.round(x); dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* =====================================================================
   Oxydoréduction : un petit moteur chimique commun aux deux figures.
   Une espèce s'écrit « MnO4^- », « Cr2O7^2- », « H2O », « e^- ». Le moteur
   en tire le compte des atomes et la charge : chaque équation affichée est
   ainsi VÉRIFIÉE PAR LE CALCUL (éléments et charges), jamais recopiée.
   ===================================================================== */
function especeLue(f){
  var p = f.split("^"), base = p[0], ch = p[1] || "", el = {}, m, re = /([A-Z][a-z]?)(\d*)/g;
  if(base !== "e") while((m = re.exec(base))) el[m[1]] = (el[m[1]] || 0) + (m[2] ? +m[2] : 1);
  var q = 0;
  if(ch){ var s = ch.slice(-1) === "+" ? 1 : -1, v = ch.slice(0, -1); q = s*(v ? +v : 1); }
  return {el:el, q:q};
}
function especeC(f){
  var p = f.split("^"), base = p[0].replace(/(\d+)/g, function(d){ return d.length > 1 ? "_{" + d + "}" : "_" + d; });
  var ch = p[1] ? (p[1].length > 1 ? "^{" + p[1] + "}" : "^" + p[1]) : "";
  return "@c{" + base + ch + "}";
}
function membreC(termes){
  return termes.map(function(t){ return (t[0] === 1 ? "" : t[0] + " ") + especeC(t[1]); }).join(" + ");
}
function bilanMembre(termes){
  var el = {}, q = 0;
  termes.forEach(function(t){ var e = especeLue(t[1]); for(var k in e.el) el[k] = (el[k] || 0) + t[0]*e.el[k]; q += t[0]*e.q; });
  return {el:el, q:q};
}
/* { equilibre, ecarts:{X:[g,d]}, q:[g,d] } */
function verifierEquation(g, d){
  var a = bilanMembre(g), b = bilanMembre(d), ecarts = {}, ok = true, k;
  var tous = {}; for(k in a.el) tous[k] = 1; for(k in b.el) tous[k] = 1;
  for(k in tous){ var x = a.el[k] || 0, y = b.el[k] || 0; ecarts[k] = [x, y]; if(x !== y) ok = false; }
  if(a.q !== b.q) ok = false;
  return {equilibre:ok, ecarts:ecarts, q:[a.q, b.q]};
}
function chargeTxt(q){ return q === 0 ? "0" : (q > 0 ? "+" : "−") + Math.abs(q); }
function pgcd(a, b){ return b ? pgcd(b, a % b) : a; }

/* -- Oxydoréduction 1. Ajuster une demi-équation, étape par étape -- */
var AJUSTEUR = [
  {nom:"MnO₄⁻/Mn²⁺", princ:"Mn", etapes:[
    {g:[[1,"MnO4^-"]], d:[[1,"Mn^2+"]]},
    {g:[[1,"MnO4^-"]], d:[[1,"Mn^2+"]], txt:"Un atome de manganèse de chaque côté : rien à faire."},
    {g:[[1,"MnO4^-"]], d:[[1,"Mn^2+"],[4,"H2O"]], txt:"$4$ atomes O à gauche, aucun à droite : on ajoute $4 @c{H_2O}$ à droite."},
    {g:[[1,"MnO4^-"],[8,"H^+"]], d:[[1,"Mn^2+"],[4,"H2O"]], txt:"Les $4 @c{H_2O}$ apportent $8$ H à droite : on ajoute $8 @c{H^+}$ à gauche."},
    {g:[[1,"MnO4^-"],[8,"H^+"],[5,"e^-"]], d:[[1,"Mn^2+"],[4,"H2O"]], txt:"Charges : $−1 + 8 = +7$ à gauche, $+2$ à droite. Il faut $5$ charges négatives à gauche : $5 @c{e^-}$."}]},
  {nom:"Cr₂O₇²⁻/Cr³⁺", princ:"Cr", etapes:[
    {g:[[1,"Cr2O7^2-"]], d:[[1,"Cr^3+"]]},
    {g:[[1,"Cr2O7^2-"]], d:[[2,"Cr^3+"]], txt:"$2$ atomes de chrome à gauche, $1$ à droite : on met le coefficient $2$ devant $@c{Cr^{3+}}$. C'est la première étape, avant de toucher à O et H."},
    {g:[[1,"Cr2O7^2-"]], d:[[2,"Cr^3+"],[7,"H2O"]], txt:"$7$ atomes O à gauche : on ajoute $7 @c{H_2O}$ à droite."},
    {g:[[1,"Cr2O7^2-"],[14,"H^+"]], d:[[2,"Cr^3+"],[7,"H2O"]], txt:"Les $7 @c{H_2O}$ apportent $14$ H : on ajoute $14 @c{H^+}$ à gauche."},
    {g:[[1,"Cr2O7^2-"],[14,"H^+"],[6,"e^-"]], d:[[2,"Cr^3+"],[7,"H2O"]], txt:"Charges : $−2 + 14 = +12$ à gauche, $2 × (+3) = +6$ à droite. Il faut $6 @c{e^-}$ à gauche."}]},
  {nom:"SO₄²⁻/SO₂", princ:"S", etapes:[
    {g:[[1,"SO4^2-"]], d:[[1,"SO2"]]},
    {g:[[1,"SO4^2-"]], d:[[1,"SO2"]], txt:"Un atome de soufre de chaque côté : rien à faire."},
    {g:[[1,"SO4^2-"]], d:[[1,"SO2"],[2,"H2O"]], txt:"$4$ atomes O à gauche, $2$ à droite : il en manque $2$ à droite, on ajoute $2 @c{H_2O}$."},
    {g:[[1,"SO4^2-"],[4,"H^+"]], d:[[1,"SO2"],[2,"H2O"]], txt:"Les $2 @c{H_2O}$ apportent $4$ H : on ajoute $4 @c{H^+}$ à gauche."},
    {g:[[1,"SO4^2-"],[4,"H^+"],[2,"e^-"]], d:[[1,"SO2"],[2,"H2O"]], txt:"Charges : $−2 + 4 = +2$ à gauche, $0$ à droite. Il faut $2 @c{e^-}$ à gauche."}]},
  {nom:"NO₃⁻/NO", princ:"N", etapes:[
    {g:[[1,"NO3^-"]], d:[[1,"NO"]]},
    {g:[[1,"NO3^-"]], d:[[1,"NO"]], txt:"Un atome d'azote de chaque côté : rien à faire."},
    {g:[[1,"NO3^-"]], d:[[1,"NO"],[2,"H2O"]], txt:"$3$ atomes O à gauche, $1$ à droite : on ajoute $2 @c{H_2O}$ à droite."},
    {g:[[1,"NO3^-"],[4,"H^+"]], d:[[1,"NO"],[2,"H2O"]], txt:"Les $2 @c{H_2O}$ apportent $4$ H : on ajoute $4 @c{H^+}$ à gauche."},
    {g:[[1,"NO3^-"],[4,"H^+"],[3,"e^-"]], d:[[1,"NO"],[2,"H2O"]], txt:"Charges : $−1 + 4 = +3$ à gauche, $0$ à droite. Il faut $3 @c{e^-}$ à gauche."}]},
  {nom:"H₂O₂/H₂O", princ:null, etapes:[
    {g:[[1,"H2O2"]], d:[[1,"H2O"]]},
    {g:[[1,"H2O2"]], d:[[1,"H2O"]], txt:"Il n'y a ici que de l'oxygène et de l'hydrogène : pas d'autre élément à ajuster."},
    {g:[[1,"H2O2"]], d:[[2,"H2O"]], txt:"$2$ atomes O à gauche, $1$ à droite : on met le coefficient $2$ devant $@c{H_2O}$."},
    {g:[[1,"H2O2"],[2,"H^+"]], d:[[2,"H2O"]], txt:"$2$ H à gauche, $4$ à droite : on ajoute $2 @c{H^+}$ à gauche."},
    {g:[[1,"H2O2"],[2,"H^+"],[2,"e^-"]], d:[[2,"H2O"]], txt:"Charges : $+2$ à gauche, $0$ à droite. Il faut $2 @c{e^-}$ à gauche."}]},
  {nom:"O₂/H₂O", princ:null, etapes:[
    {g:[[1,"O2"]], d:[[1,"H2O"]]},
    {g:[[1,"O2"]], d:[[1,"H2O"]], txt:"Il n'y a ici que de l'oxygène et de l'hydrogène : pas d'autre élément à ajuster."},
    {g:[[1,"O2"]], d:[[2,"H2O"]], txt:"$2$ atomes O à gauche, $1$ à droite : coefficient $2$ devant $@c{H_2O}$."},
    {g:[[1,"O2"],[4,"H^+"]], d:[[2,"H2O"]], txt:"$4$ H à droite, aucun à gauche : on ajoute $4 @c{H^+}$ à gauche."},
    {g:[[1,"O2"],[4,"H^+"],[4,"e^-"]], d:[[2,"H2O"]], txt:"Charges : $+4$ à gauche, $0$ à droite. Il faut $4 @c{e^-}$ à gauche."}]}
];
var AJ_ETAPES = ["Le couple, tel qu'il est donné", "Étape 1 — l'élément principal", "Étape 2 — l'oxygène, avec $@c{H_2O}$",
                 "Étape 3 — l'hydrogène, avec $@c{H^+}$", "Étape 4 — les charges, avec $@c{e^-}$"];
var AJ_PIEGES = ["L'oxydant à gauche, le réducteur à droite, séparés par le signe $=$ : une demi-équation peut se lire dans les deux sens.",
  "**Piège** : sauter cette étape parce qu'il y a souvent un atome de chaque côté. Essaie $@c{Cr_2O_7^{2-}}$/$@c{Cr^{3+}}$ : sans le $2$ devant $@c{Cr^{3+}}$, la charge de droite est fausse dès le départ, et le nombre d'électrons aussi.",
  "**Piège** : mettre l'eau du côté qui a déjà trop d'oxygène. L'eau **apporte** de l'oxygène : on la met là où il en manque. Et on n'ajoute jamais de $@c{O_2}$ pour équilibrer.",
  "**Piège** : ajuster H avec $@c{H_2O}$. Une fois l'eau posée, on n'y touche plus : l'hydrogène s'ajuste avec $@c{H^+}$.",
  "**Piège** : mettre les électrons du mauvais côté. Ils vont du côté où la charge est la plus **grande**, pour la faire baisser : c'est toujours le côté de l'oxydant."];

MODELES["ajusteur"] = function(){
  var ic = 0, ie = 0;
  var boite = el("div","figBoite"), eq = el("div","figLecture"), tab = el("div"), curs = el("div","figCurseurs"), note = el("div","figNote");
  eq.style.fontSize = "17px";
  var choix = el("div","row"); choix.style.flexWrap = "wrap"; choix.style.justifyContent = "center";
  var bts = AJUSTEUR.map(function(c, k){
    var b = el("button","btn gho", c.nom); b.type = "button";
    b.onclick = function(){ ic = k; ie = 0; ce.value = 0; dessine(); };
    choix.appendChild(b); return b;
  });
  /* Ce que chaque étape doit avoir équilibré, et garder équilibré ensuite */
  function postes(couple, v){
    var p = [];
    if(couple.princ) p.push({nom:couple.princ, g:(v.ecarts[couple.princ] || [0,0])[0], d:(v.ecarts[couple.princ] || [0,0])[1], des:1});
    p.push({nom:"O", g:(v.ecarts.O || [0,0])[0], d:(v.ecarts.O || [0,0])[1], des:2});
    p.push({nom:"H", g:(v.ecarts.H || [0,0])[0], d:(v.ecarts.H || [0,0])[1], des:3});
    p.push({nom:"charge", g:v.q[0], d:v.q[1], des:4, charge:true});
    return p;
  }
  function dessine(){
    var c = AJUSTEUR[ic], st = c.etapes[ie], v = verifierEquation(st.g, st.d);
    bts.forEach(function(b, k){ b.className = "btn " + (k === ic ? "pri" : "gho"); });
    eq.innerHTML = T("$" + membreC(st.g) + " = " + membreC(st.d) + "$");
    var ps = postes(c, v), lignes = "";
    /* une ligne dont l'étape n'est pas venue reste grise, « à venir » : affichée
       ✓ par hasard (0 = 0) puis ✗ après l'étape de l'eau, elle enseignait le
       doute sur la méthode */
    ps.forEach(function(p){
      var ok = p.g === p.d, avenir = p.des > ie;
      p.affiche = avenir ? "avenir" : (ok ? "ok" : "ko");
      var etat = avenir ? '<td style="color:var(--ink3)">— à venir</td>'
        : "<td style=\"color:var(" + (ok ? "--vert" : "--rouge") + ");font-weight:600\">" + (ok ? "✓ équilibré" : "✗ à ajuster") + "</td>";
      lignes += "<tr><td>" + (p.charge ? "charge" : "atomes " + p.nom) + " (étape " + p.des + ")</td><td>" + (p.charge ? chargeTxt(p.g) : p.g) + "</td><td>" +
        (p.charge ? chargeTxt(p.d) : p.d) + "</td>" + etat + "</tr>";
    });
    tab.innerHTML = '<div class="tblWrap"><table class="tbl"><thead><tr><th></th><th>à gauche</th><th>à droite</th><th></th></tr></thead><tbody>' + lignes + "</tbody></table></div>";
    note.innerHTML = T("**" + AJ_ETAPES[ie] + ".** " + (st.txt || "On part du couple : l'oxydant " + especeC(st.g[0][1]) + " à gauche, le réducteur " + especeC(st.d[0][1]) + " à droite.") + "<br>" + AJ_PIEGES[ie]);
    boite.setAttribute("data-etat", JSON.stringify({couple:c.nom, etape:ie, g:st.g, d:st.d, postes:ps.map(function(p){ return {nom:p.nom, ok:p.g === p.d, des:p.des, affiche:p.affiche}; }), equilibre:v.equilibre}));
  }
  var ce = curseur(curs, "étape", 0, 4, 1, ie, function(x){ ie = Math.round(x); dessine(); });
  boite.appendChild(choix); boite.appendChild(eq); boite.appendChild(tab); boite.appendChild(curs); boite.appendChild(note);
  dessine();
  return boite;
};

/* -- Oxydoréduction 2. Combiner deux demi-équations ------------------------
   Les deux demi-équations sont des données ; la multiplication, la somme et
   la simplification sont CALCULÉES, puis l'équation finale est vérifiée. */
var DEMI = {
  "Cu2+/Cu":   {nom:"Cu²⁺/Cu",   g:[[1,"Cu^2+"]], d:[[1,"Cu"]], n:2},
  "Fe2+/Fe":   {nom:"Fe²⁺/Fe",   g:[[1,"Fe^2+"]], d:[[1,"Fe"]], n:2},
  "Ag+/Ag":    {nom:"Ag⁺/Ag",    g:[[1,"Ag^+"]],  d:[[1,"Ag"]], n:1},
  "Zn2+/Zn":   {nom:"Zn²⁺/Zn",   g:[[1,"Zn^2+"]], d:[[1,"Zn"]], n:2},
  "H+/H2":     {nom:"H⁺/H₂",     g:[[2,"H^+"]],   d:[[1,"H2"]], n:2},
  "MnO4-/Mn2+":{nom:"MnO₄⁻/Mn²⁺",g:[[1,"MnO4^-"],[8,"H^+"]], d:[[1,"Mn^2+"],[4,"H2O"]], n:5},
  "Fe3+/Fe2+": {nom:"Fe³⁺/Fe²⁺", g:[[1,"Fe^3+"]], d:[[1,"Fe^2+"]], n:1},
  "I2/I-":     {nom:"I₂/I⁻",     g:[[1,"I2"]],    d:[[2,"I^-"]], n:2},
  "S4O6/S2O3": {nom:"S₄O₆²⁻/S₂O₃²⁻", g:[[1,"S4O6^2-"]], d:[[2,"S2O3^2-"]], n:2},
  "CO2/C2O4":  {nom:"CO₂/C₂O₄²⁻", g:[[2,"CO2"]], d:[[1,"C2O4^2-"]], n:2},
  "H2O2/H2O":  {nom:"H₂O₂/H₂O",  g:[[1,"H2O2"],[2,"H^+"]], d:[[2,"H2O"]], n:2},
  "O2/H2O2":   {nom:"O₂/H₂O₂",   g:[[1,"O2"],[2,"H^+"]], d:[[1,"H2O2"]], n:2}
};
var PAIRES = [
  {ox:"Cu2+/Cu", red:"Fe2+/Fe", ctx:"un clou de fer dans une solution d'ions cuivre"},
  {ox:"Ag+/Ag", red:"Cu2+/Cu", ctx:"un fil de cuivre dans une solution d'ions argent"},
  {ox:"H+/H2", red:"Zn2+/Zn", ctx:"du zinc dans un acide"},
  {ox:"MnO4-/Mn2+", red:"Fe3+/Fe2+", ctx:"le titrage des ions fer(II) par le permanganate"},
  {ox:"I2/I-", red:"S4O6/S2O3", ctx:"le titrage du diiode par le thiosulfate"},
  {ox:"MnO4-/Mn2+", red:"CO2/C2O4", ctx:"le titrage des ions oxalate par le permanganate"},
  {ox:"H2O2/H2O", red:"I2/I-", ctx:"l'eau oxygénée qui oxyde les ions iodure"},
  {ox:"MnO4-/Mn2+", red:"O2/H2O2", ctx:"le permanganate qui oxyde l'eau oxygénée, ici réductrice"}
];
function fois(k, termes){ return termes.map(function(t){ return [k*t[0], t[1]]; }); }
function regrouper(termes){
  var m = {}, ordre = [];
  termes.forEach(function(t){ if(!(t[1] in m)){ m[t[1]] = 0; ordre.push(t[1]); } m[t[1]] += t[0]; });
  return ordre.map(function(f){ return [m[f], f]; }).filter(function(t){ return t[0] !== 0; });
}
/* retire des deux membres ce qui y figure des deux côtés (H⁺, H₂O…) */
function simplifier(g, d){
  var mg = {}, md = {};
  g.forEach(function(t){ mg[t[1]] = t[0]; }); d.forEach(function(t){ md[t[1]] = t[0]; });
  for(var f in mg) if(f in md){ var c = Math.min(mg[f], md[f]); mg[f] -= c; md[f] -= c; }
  return { g:g.map(function(t){ return [mg[t[1]], t[1]]; }).filter(function(t){ return t[0] > 0; }),
           d:d.map(function(t){ return [md[t[1]], t[1]]; }).filter(function(t){ return t[0] > 0; }) };
}
function combiner(p){
  var O = DEMI[p.ox], Rd = DEMI[p.red], L = O.n*Rd.n/pgcd(O.n, Rd.n), a = L/O.n, b = L/Rd.n;
  var gauche = regrouper(fois(a, O.g).concat(fois(b, Rd.d))), droite = regrouper(fois(a, O.d).concat(fois(b, Rd.g)));
  var s = simplifier(gauche, droite);
  /* l'erreur classique : additionner sans multiplier ; les électrons ne se
     compensent plus, on les retire (comme l'élève) et les charges divergent */
  var og = regrouper(O.g.concat(Rd.d)), od = regrouper(O.d.concat(Rd.g)), so = simplifier(og, od);
  return {O:O, R:Rd, a:a, b:b, L:L, g:s.g, d:s.d, brutG:gauche, brutD:droite, oubliG:so.g, oubliD:so.d,
          simplifie: JSON.stringify(s.g) !== JSON.stringify(gauche) || JSON.stringify(s.d) !== JSON.stringify(droite)};
}

MODELES["combinaison"] = function(){
  var ip = 0, ie = 0, oubli = false;
  var boite = el("div","figBoite"), zone = el("div"), curs = el("div","figCurseurs"), note = el("div","figNote");
  zone.className = "figLecture"; zone.style.lineHeight = "1.9";
  var bOubli = el("button","btn gho","Et si j'oubliais de multiplier ?"); bOubli.type = "button";
  bOubli.onclick = function(){ oubli = !oubli; dessine(); };
  var choix = el("div","row"); choix.style.flexWrap = "wrap"; choix.style.justifyContent = "center";
  var bts = PAIRES.map(function(p, k){
    var b = el("button","btn gho", DEMI[p.ox].nom + " et " + DEMI[p.red].nom); b.type = "button";
    b.onclick = function(){ ip = k; ie = 0; ce.value = 0; dessine(); };
    choix.appendChild(b); return b;
  });
  function demiOx(k, O){ return membreC(fois(k, O.g).concat([[k*O.n, "e^-"]])) + " = " + membreC(fois(k, O.d)); }
  function demiRed(k, R){ return membreC(fois(k, R.d)) + " = " + membreC(fois(k, R.g).concat([[k*R.n, "e^-"]])); }
  function dessine(){
    var p = PAIRES[ip], c = combiner(p), v = verifierEquation(c.g, c.d), lignes = [];
    bts.forEach(function(b, k){ b.className = "btn " + (k === ip ? "pri" : "gho"); });
    bOubli.className = "btn " + (oubli ? "pri" : "gho");
    var x1 = c.a > 1 ? "× " + c.a + " : " : "", x2 = c.b > 1 ? "× " + c.b + " : " : "";
    if(ie === 0){
      lignes.push("oxydant, qui capte : $" + demiOx(1, c.O) + "$");
      lignes.push("réducteur, qui cède : $" + demiRed(1, c.R) + "$");
    } else if(ie === 1){
      lignes.push(x1 + "$" + demiOx(c.a, c.O) + "$");
      lignes.push(x2 + "$" + demiRed(c.b, c.R) + "$");
    } else if(ie === 2){
      /* la somme brute : les électrons figurent des deux côtés, puis disparaissent */
      lignes.push("somme : $" + membreC(c.brutG.concat([[c.L, "e^-"]])) + " → " + membreC(c.brutD.concat([[c.L, "e^-"]])) + "$");
      lignes.push("$" + membreC(c.g) + " → " + membreC(c.d) + "$");
    } else {
      lignes.push("$" + membreC(c.g) + " → " + membreC(c.d) + "$");
    }
    var vo = verifierEquation(c.oubliG, c.oubliD);
    if(oubli){
      lignes.push(c.a === 1 && c.b === 1
        ? "sans multiplication : rien ne change ici, les électrons étaient déjà égaux."
        : "sans multiplication : $" + membreC(c.oubliG) + " → " + membreC(c.oubliD) + "$");
    }
    zone.innerHTML = lignes.map(function(l){ return T(l); }).join("<br>");
    if(oubli && !(c.a === 1 && c.b === 1)){
      var r = el("div"); r.style.color = "var(--rouge)"; r.style.fontWeight = "600";
      r.textContent = "charges : " + chargeTxt(vo.q[0]) + " à gauche, " + chargeTxt(vo.q[1]) + " à droite : non conservées";
      zone.appendChild(r);
    }
    var texte;
    if(ie === 0) texte = "**Le contexte** : " + p.ctx + ". On écrit la demi-équation de l'oxydant dans le sens où il **capte** ($" + c.O.n + "$ @u{e⁻}), celle du réducteur dans le sens où il **cède** ($" + c.R.n + "$ @u{e⁻}).";
    else if(ie === 1) texte = (c.a === 1 && c.b === 1)
      ? "Les deux demi-équations échangent déjà le même nombre d'électrons, $" + c.L + "$ : aucune multiplication n'est nécessaire."
      : "**On égalise les électrons** : $" + c.O.n + "$ d'un côté, $" + c.R.n + "$ de l'autre ; le plus petit nombre commun est $" + c.L + "$. On multiplie donc par $" + c.a + "$ et par $" + c.b + "$. Chaque électron cédé par le réducteur doit être capté par l'oxydant : **aucun ne peut rester**.";
    else if(ie === 2) texte = "**On additionne** les deux lignes : les $" + c.L + "$ électrons, présents des deux côtés, disparaissent." +
      (c.simplifie ? " Des espèces figurent aussi des deux côtés : on les simplifie (ici des ions $@c{H^+}$). Il reste l'équation de la réaction." : " Aucune autre espèce ne figure des deux côtés. Il reste l'équation de la réaction.");
    else {
      var detail = Object.keys(v.ecarts).map(function(k){ return k + " : " + v.ecarts[k][0] + " = " + v.ecarts[k][1]; }).join(" ; ");
      texte = "**On vérifie** : " + detail + " ; charges : " + chargeTxt(v.q[0]) + " = " + chargeTxt(v.q[1]) + ". " + (v.equilibre ? "Tout est conservé : l'équation est juste." : "L'équation n'est pas équilibrée.");
    }
    note.innerHTML = T(texte);
    boite.setAttribute("data-etat", JSON.stringify({paire:ip, etape:ie, a:c.a, b:c.b, L:c.L, nOx:c.O.n, nRed:c.R.n, g:c.g, d:c.d, equilibre:v.equilibre,
      electronsFinal: c.g.concat(c.d).some(function(t){ return t[1] === "e^-"; }), oubli:oubli, oubliG:c.oubliG, oubliD:c.oubliD,
      oubliEquilibre: vo.equilibre, simplifie:c.simplifie, brutG:c.brutG, brutD:c.brutD}));
  }
  var ce = curseur(curs, "étape", 0, 3, 1, ie, function(x){ ie = Math.round(x); dessine(); });
  var lo = el("div","row"); lo.style.justifyContent = "center"; lo.appendChild(bOubli); curs.appendChild(lo);
  boite.appendChild(choix); boite.appendChild(zone); boite.appendChild(curs); boite.appendChild(note);
  dessine();
  return boite;
};

/* =====================================================================
   Les couleurs (ch17) — modèle à trois composantes : rouge, vert, bleu
   ---------------------------------------------------------------------
   Une lumière, ou ce qu'un objet laisse repartir, est décrite par trois
   composantes [r, v, b]. Toutes les couleurs dessinées sont CALCULÉES à
   partir de ces composantes et écrites en rgb() littéral : jamais de
   fondu du navigateur (mix-blend-mode, opacité), qui afficherait une
   teinte approximative sur le chapitre qui enseigne la couleur. Chaque
   figure publie dans data-etat la couleur attendue au centre de chaque
   zone, en coordonnées du SVG : le balayage la compare au pixel affiché.
   ===================================================================== */
var NOMS_RVB = {"000":"noir","100":"rouge","010":"vert","001":"bleu","110":"jaune","011":"cyan","101":"magenta","111":"blanc"};
var COMPOSANTES = ["rouge","vert","bleu"];
function cleRVB(t){ return t.map(function(x){ return x ? 1 : 0; }).join(""); }
function nomRVB(t){ return NOMS_RVB[cleRVB(t)]; }
function rvbDe(nom){ for(var k in NOMS_RVB) if(NOMS_RVB[k] === nom) return k.split("").map(Number); return null; }
function et(a, b){ return [a[0] & b[0], a[1] & b[1], a[2] & b[2]]; }
function sauf(a, b){ return [a[0] & (1 - b[0]), a[1] & (1 - b[1]), a[2] & (1 - b[2])]; }
/* « rouge + vert », ou « rien » */
function listeRVB(t){
  var l = COMPOSANTES.filter(function(c, i){ return t[i]; });
  return l.length ? l.join(" + ") : "rien";
}
/* « le rouge et le vert », « le rouge, le vert et le bleu », ou « rien » */
function listeArt(t){
  var l = COMPOSANTES.filter(function(c, i){ return t[i]; }).map(function(c){ return "le " + c; });
  return !l.length ? "rien" : l.length === 1 ? l[0] : l.slice(0, -1).join(", ") + " et " + l[l.length - 1];
}
/* « lumière blanche », « lumière verte », « lumière cyan » */
function lumiereF(nom){ return "lumière " + ({blanc:"blanche", vert:"verte", bleu:"bleue", noir:"noire"}[nom] || nom); }
/* « du jaune », « de l'orange » */
function partitif(nom){ return (/^[aeiouyéè]/i.test(nom) ? "de l'" : "du ") + nom; }
function cssRVB(t, k){ k = k == null ? 255 : k; return "rgb(" + t.map(function(x){ return x ? k : 0; }).join(",") + ")"; }
/* texte lisible sur un fond donné (luminance relative approchée) */
function encreSur(rgb){ return (0.299*rgb[0] + 0.587*rgb[1] + 0.114*rgb[2]) > 140 ? "#000000" : "#ffffff"; }
function texteSvg(parent, x, y, s, o){
  o = o || {};
  var e = txt(x, y, s, o.ancre || "middle");
  e.setAttribute("fill", o.fill || coul("ink2"));
  e.setAttribute("font-size", o.taille || 12);
  e.setAttribute("font-family", "system-ui, sans-serif");
  if(o.gras) e.setAttribute("font-weight", 600);
  parent.appendChild(e);
  return e;
}
/* une rangée de boutons de choix ; renvoie les boutons */
function rangeeChoix(parent, titre, noms, surClic){
  var r = el("div","row"); r.style.flexWrap = "wrap"; r.style.justifyContent = "center"; r.style.alignItems = "center"; r.style.gap = "6px";
  var t = el("span","small", titre); t.style.color = "var(--ink2)"; t.style.minWidth = "100%"; t.style.textAlign = "center";
  r.appendChild(t);
  var bts = noms.map(function(nm, k){
    var b = el("button","btn gho", nm); b.type = "button";
    b.onclick = function(){ surClic(k); };
    r.appendChild(b); return b;
  });
  parent.appendChild(r);
  return bts;
}
function marquer(bts, k){ bts.forEach(function(b, i){ b.className = "btn " + (i === k ? "pri" : "gho"); }); }
/* un faisceau : un trait gris épais dessous, la couleur exacte dessus, pour
   qu'un faisceau blanc reste visible sur un fond clair et un noir sur un
   fond sombre ; « rien » est un pointillé gris */
function faisceau(svg, x1, y1, x2, y2, t){
  if(!(t[0] || t[1] || t[2])){
    svg.appendChild(n("line", {x1:x1, y1:y1, x2:x2, y2:y2, stroke:coul("ink3"), "stroke-width":1.6, "stroke-dasharray":"5 5"}));
    return;
  }
  svg.appendChild(n("line", {x1:x1, y1:y1, x2:x2, y2:y2, stroke:coul("ink3"), "stroke-width":10, "stroke-linecap":"butt"}));
  svg.appendChild(n("line", {x1:x1, y1:y1, x2:x2, y2:y2, stroke:cssRVB(t), "stroke-width":7, "stroke-linecap":"butt"}));
}

/* -- Couleurs 1. Synthèse additive : trois projecteurs sur un écran ------ */
/* niveaux 0, 1, 2 = éteint, faible, à fond ; nom de la teinte obtenue.
   « Faible » est la valeur d'écran 128, soit environ un cinquième de la
   lumière à fond (la luminance n'est pas proportionnelle à la valeur RVB) :
   l'appeler « 50 % » aurait été faux. */
function nomNiveaux(L){
  var m = Math.max(L[0], L[1], L[2]);
  if(m === 0) return "noir";
  var S = L.map(function(x){ return x === m ? 1 : 0; });
  var Tm = L.map(function(x){ return x > 0 && x < m ? 1 : 0; });
  var Z = L.map(function(x){ return x === 0 ? 1 : 0; });
  var base = nomRVB(S);
  if(!(Tm[0] || Tm[1] || Tm[2])){
    if(m === 2) return base;
    return base === "blanc" ? "gris" : base + " sombre";
  }
  if(!(Z[0] || Z[1] || Z[2])) return base + " pâle";
  var paires = {"rouge+vert":"orange", "vert+rouge":"vert-jaune", "rouge+bleu":"rose", "bleu+rouge":"violet", "vert+bleu":"vert printemps", "bleu+vert":"bleu azur"};
  return paires[base + "+" + nomRVB(Tm)];
}
MODELES["additive"] = function(){
  var w = 430, h = 345, niv = [2, 2, 2];
  var m = boiteManip(w, h), svg = m.svg, boite = m.boite;
  var lecture = el("div","figLecture"), curs = el("div","figCurseurs"), note = el("div","figNote");
  /* Géométrie choisie par une recherche numérique : chaque nom, écrit sur deux
     lignes au plus, tient dans sa zone avec au moins 8 px de marge (les
     lentilles en biais étaient trop étroites pour « bleu sombre » à r = 70).
     n : centre du nom ; s : un point de la zone, et d'elle seule, loin du nom,
     où le balayage lit le pixel affiché. */
  var C = [[165,130], [265,130], [215,217]], RAY = 100;
  var ZONES = [
    {cle:"100", n:[120,104], s:[131,83]},  {cle:"010", n:[310,104], s:[299,83]},  {cle:"001", n:[214,270], s:[245,269]},
    {cle:"110", n:[214,92],  s:[215,71]},  {cle:"101", n:[152,202], s:[150,181]}, {cle:"011", n:[278,202], s:[280,181]},
    {cle:"111", n:[214,152], s:[215,173]}, {cle:"000", n:null,      s:[30,170]}
  ];
  var idc = "cAdd" + Math.random().toString(36).slice(2, 8);
  function niveauxDe(cle){ return cle.split("").map(function(c, i){ return c === "1" ? niv[i] : 0; }); }
  function rgbNiv(L){ return L.map(function(x){ return Math.round(255*x/2); }); }
  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var defs = n("defs", {});
    C.forEach(function(c, i){ var cp = n("clipPath", {id:idc + i}); cp.appendChild(n("circle", {cx:c[0], cy:c[1], r:RAY})); defs.appendChild(cp); });
    svg.appendChild(defs);
    svg.appendChild(n("rect", {x:0, y:0, width:w, height:h, fill:"rgb(0,0,0)"}));
    var zones = [];
    function remplir(cle, forme){
      var L = niveauxDe(cle), rgb = rgbNiv(L);
      forme.setAttribute("fill", "rgb(" + rgb.join(",") + ")");
      return {L:L, rgb:rgb};
    }
    /* Seuls les faisceaux ALLUMÉS sont dessinés : le disque noir d'un projecteur
       éteint laissait des arcs fantômes au raccord des zones. Les zones d'un seul
       faisceau, puis les recouvrements, découpés par intersection. */
    var on = niv.map(function(x){ return x > 0; });
    [0,1,2].forEach(function(i){ if(!on[i]) return; var c = n("circle", {cx:C[i][0], cy:C[i][1], r:RAY}); remplir(["100","010","001"][i], c); svg.appendChild(c); });
    [[0,1,"110"], [0,2,"101"], [1,2,"011"]].forEach(function(p){
      if(!(on[p[0]] && on[p[1]])) return;
      var g = n("g", {"clip-path":"url(#" + idc + p[0] + ")"}), c = n("circle", {cx:C[p[1]][0], cy:C[p[1]][1], r:RAY});
      remplir(p[2], c); g.appendChild(c); svg.appendChild(g);
    });
    if(on[0] && on[1] && on[2]){
      var g1 = n("g", {"clip-path":"url(#" + idc + "0)"}), g2 = n("g", {"clip-path":"url(#" + idc + "1)"}), c3 = n("circle", {cx:C[2][0], cy:C[2][1], r:RAY});
      remplir("111", c3); g2.appendChild(c3); g1.appendChild(g2); svg.appendChild(g1);
    }
    /* le nom de chaque zone, écrit dans la zone, sur deux lignes s'il a deux mots */
    ZONES.forEach(function(z){
      var L = niveauxDe(z.cle), rgb = rgbNiv(L), nom = nomNiveaux(L);
      /* une zone n'existe à l'écran que si tous ses projecteurs sont allumés */
      var existe = z.n && z.cle.split("").every(function(c, i){ return c === "0" || on[i]; });
      zones.push({cle:z.cle, p:z.s, rgb:rgb, nom:nom, nommee:!!existe});
      if(!existe) return;
      var mots = nom.split(" "), lignes = mots.length > 1 ? [mots[0], mots.slice(1).join(" ")] : [nom];
      lignes.forEach(function(l, k){
        var e = texteSvg(svg, z.n[0], z.n[1] + (lignes.length > 1 ? (k ? 11 : -3) : 4), l, {fill:encreSur(rgb), taille:10.5, gras:true});
        e.setAttribute("data-zone", z.cle);
      });
    });
    texteSvg(svg, 12, h - 12, "écran blanc, salle obscure : là où rien n'arrive, il paraît noir", {fill:"#d0d0d0", taille:11, ancre:"start"});
    var pct = ["éteint", "faible", "à fond"];
    texteSvg(svg, 12, 22, "projecteur rouge : " + pct[niv[0]], {fill:"#d0d0d0", taille:11.5, ancre:"start"});
    texteSvg(svg, w - 12, 22, "projecteur vert : " + pct[niv[1]], {fill:"#d0d0d0", taille:11.5, ancre:"end"});
    texteSvg(svg, w - 12, h - 32, "projecteur bleu : " + pct[niv[2]], {fill:"#d0d0d0", taille:11.5, ancre:"end"});
    /* la superposition de tous les faisceaux allumés */
    var cleOn = on.map(function(x){ return x ? "1" : "0"; }).join(""), nbOn = on.filter(Boolean).length;
    var centre = zones.filter(function(z){ return z.cle === cleOn; })[0];
    var paires = [[3,"rouge + vert"], [4,"rouge + bleu"], [5,"vert + bleu"]].filter(function(q){ return zones[q[0]].nommee; })
      .map(function(q){ return q[1] + " : " + zones[q[0]].nom; });
    if(nbOn === 3) paires.push("les trois : " + centre.nom);
    lecture.innerHTML = nbOn === 0 ? "aucun projecteur allumé : l'écran reste noir"
      : nbOn === 1 ? "un seul projecteur allumé : " + centre.nom
      : paires.join(" · ");
    var tous = niv[0] === 2 && niv[1] === 2 && niv[2] === 2;
    note.innerHTML = T(tous
      ? "Là où deux faisceaux se superposent, l'écran renvoie les deux lumières à la fois : elles **s'ajoutent**. Rouge + vert donne du **jaune**, rouge + bleu du **magenta**, vert + bleu du **cyan**, et les trois ensemble du **blanc**. Mets un projecteur sur « faible » pour voir apparaître d'autres teintes."
      : nbOn === 0 ? "Tous les projecteurs sont éteints : aucune lumière n'arrive, l'écran paraît noir. Allume-les un par un."
      : nbOn === 1 ? "Un seul projecteur est allumé : l'écran ne montre que sa lumière, **" + centre.nom + "**. Allumes-en un deuxième pour voir les lumières s'ajouter."
      : "Là où les faisceaux allumés se superposent, " + COMPOSANTES.map(function(c, i){ return niv[i] ? "le " + c + " " + (niv[i] === 2 ? "à fond" : "faible") : null; }).filter(Boolean).join(" et ").replace(/ et (?=.* et )/, ", ") +
        " donnent " + partitif(centre.nom).replace(centre.nom, "**" + centre.nom + "**") + ". Les lumières s'ajoutent toujours ; en dosant chacune, un écran fabrique toutes ses teintes avec trois couleurs seulement.");
    boite.setAttribute("data-etat", JSON.stringify({modele:"additive", niv:niv.slice(), zones:zones}));
  }
  ["rouge","vert","bleu"].forEach(function(nm, i){
    curseur(curs, "projecteur " + nm, 0, 2, 1, niv[i], function(x){ niv[i] = Math.round(x); dessine(); });
  });
  boite.appendChild(lecture); boite.appendChild(curs); boite.appendChild(note);
  dessine();
  return boite;
};

/* -- Couleurs 2. La couleur d'un objet dépend de son éclairage ----------- */
var CHOIX_OBJET = ["blanc","rouge","vert","bleu","jaune","cyan","magenta","noir"];
var CHOIX_LUMIERE = ["blanc","rouge","vert","bleu","jaune","cyan","magenta"];
MODELES["objet"] = function(){
  var w = 430, h = 250, io = 1, il = 5;               // un objet rouge sous une lumière cyan
  var m = boiteManip(w, h), svg = m.svg, boite = m.boite;
  var choix = el("div"), lecture = el("div","figLecture"), note = el("div","figNote");
  var bo = rangeeChoix(choix, "couleur de l'objet en lumière blanche", CHOIX_OBJET, function(k){ io = k; dessine(); });
  var bl = rangeeChoix(choix, "couleur de la lumière qui l'éclaire", CHOIX_LUMIERE, function(k){ il = k; dessine(); });
  function dessine(){
    marquer(bo, io); marquer(bl, il);
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var obj = rvbDe(CHOIX_OBJET[io]), lum = rvbDe(CHOIX_LUMIERE[il]);
    var diff = et(obj, lum), abs = sauf(lum, obj), vu = nomRVB(diff);
    var LAMPE = [60, 70], OBJ = [170, 125, 90, 70], OEIL = [370, 110];
    var zones = [];
    /* la lampe et ses rayons vers l'objet */
    faisceau(svg, LAMPE[0] + 22, LAMPE[1] - 6, OBJ[0] + 18, OBJ[1], lum);
    faisceau(svg, LAMPE[0] + 18, LAMPE[1] + 14, OBJ[0], OBJ[1] + 38, lum);
    svg.appendChild(n("circle", {cx:LAMPE[0], cy:LAMPE[1], r:24, fill:cssRVB(lum), stroke:coul("ink"), "stroke-width":2}));
    zones.push({id:"lampe", p:LAMPE, rgb:lum.map(function(x){ return 255*x; }), nom:CHOIX_LUMIERE[il]});
    texteSvg(svg, LAMPE[0], LAMPE[1] + 44, "projecteur", {});
    texteSvg(svg, LAMPE[0], LAMPE[1] + 60, lumiereF(CHOIX_LUMIERE[il]), {gras:true});
    /* ce que l'objet diffuse vers l'œil */
    faisceau(svg, OBJ[0] + OBJ[2], OBJ[1] + 25, OEIL[0] - 22, OEIL[1] + 2, diff);
    texteSvg(svg, OBJ[0] + OBJ[2] + 8, OBJ[1] + 53, diff[0] || diff[1] || diff[2] ? "diffusé : " + listeRVB(diff) : "rien n'est diffusé", {taille:11.5, ancre:"start"});
    /* l'objet, de la couleur sous laquelle on le VOIT */
    svg.appendChild(n("rect", {x:OBJ[0], y:OBJ[1], width:OBJ[2], height:OBJ[3], rx:6, fill:cssRVB(diff), stroke:coul("ink"), "stroke-width":2}));
    zones.push({id:"objet", p:[OBJ[0] + OBJ[2]/2, OBJ[1] + OBJ[3]/2], rgb:diff.map(function(x){ return 255*x; }), nom:vu});
    texteSvg(svg, OBJ[0] + OBJ[2]/2, OBJ[1] + OBJ[3] + 18, "l'objet, vu ainsi : " + vu, {gras:true, fill:coul("ink")});
    texteSvg(svg, OBJ[0] + OBJ[2]/2, OBJ[1] + OBJ[3] + 34, "absorbé : " + listeRVB(abs), {taille:11.5});
    /* le même objet en lumière blanche, pour comparer */
    svg.appendChild(n("rect", {x:300, y:18, width:34, height:22, rx:3, fill:cssRVB(obj), stroke:coul("ink"), "stroke-width":1.5}));
    zones.push({id:"temoin", p:[317, 29], rgb:obj.map(function(x){ return 255*x; }), nom:CHOIX_OBJET[io]});
    texteSvg(svg, 292, 34, "en lumière blanche :", {ancre:"end", taille:11.5});
    texteSvg(svg, 342, 34, CHOIX_OBJET[io], {ancre:"start", taille:11.5, gras:true});
    /* l'œil */
    svg.appendChild(n("ellipse", {cx:OEIL[0], cy:OEIL[1], rx:22, ry:13, fill:"none", stroke:coul("ink"), "stroke-width":2}));
    svg.appendChild(n("circle", {cx:OEIL[0] - 6, cy:OEIL[1], r:6, fill:coul("ink")}));
    texteSvg(svg, OEIL[0], OEIL[1] + 32, "œil", {});
    lecture.innerHTML = "reçoit : " + listeRVB(lum) + " · absorbe : " + listeRVB(abs) + " · diffuse : " + listeRVB(diff) + " → paraît " + vu;
    var sait = CHOIX_OBJET[io] === "noir" ? "il ne renvoie rien : il absorbe tout"
      : CHOIX_OBJET[io] === "blanc" ? "il sait renvoyer le rouge, le vert et le bleu ; il n'absorbe rien"
      : "il sait renvoyer " + listeArt(obj) + " et absorbe le reste";
    var texte = "L'objet est **" + CHOIX_OBJET[io] + "** en lumière blanche : " + sait + ". Éclairé en " + lumiereF(CHOIX_LUMIERE[il]).replace(/^lumière (.*)$/, "lumière **$1**") + " (" + listeArt(lum) + "), il ne peut renvoyer que ce qui figure à la fois dans la lumière **reçue** et dans ce qu'il **sait renvoyer** : " + listeArt(diff) + ". Il paraît donc **" + vu + "**.";
    if(vu === "noir" && CHOIX_OBJET[io] !== "noir")
      texte += " **Le piège** : l'objet n'a pas changé, il n'est pas devenu noir. Il absorbe tout ce qu'il reçoit, et il n'a rien à renvoyer.";
    else if(vu !== CHOIX_OBJET[io])
      texte += " La couleur d'un objet n'est pas une propriété de l'objet seul : elle dépend aussi de la lumière qui l'éclaire.";
    note.innerHTML = T(texte);
    boite.setAttribute("data-etat", JSON.stringify({modele:"objet", objet:CHOIX_OBJET[io], lumiere:CHOIX_LUMIERE[il], diffuse:diff, absorbe:abs, vu:vu, zones:zones}));
  }
  boite.insertBefore(choix, svg); boite.appendChild(lecture); boite.appendChild(note);
  dessine();
  return boite;
};

/* -- Couleurs 3. Un ou deux filtres sur une lumière blanche -------------- */
var CHOIX_FILTRE = ["aucun","rouge","vert","bleu","jaune","cyan","magenta"];
MODELES["filtres"] = function(){
  var w = 430, h = 220, i1 = 4, i2 = 5;               // jaune puis cyan : du vert
  var m = boiteManip(w, h), svg = m.svg, boite = m.boite;
  var choix = el("div"), lecture = el("div","figLecture"), note = el("div","figNote");
  var b1 = rangeeChoix(choix, "premier filtre", CHOIX_FILTRE, function(k){ i1 = k; dessine(); });
  var b2 = rangeeChoix(choix, "second filtre", CHOIX_FILTRE, function(k){ i2 = k; dessine(); });
  var Y = 100, X = {lampe:40, f1:150, f2:255, ecran:375};
  function transmis(i){ return i === 0 ? [1,1,1] : rvbDe(CHOIX_FILTRE[i]); }
  function dessine(){
    marquer(b1, i1); marquer(b2, i2);
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var blanc = [1,1,1], t1 = et(blanc, transmis(i1)), t2 = et(t1, transmis(i2));
    var zones = [];
    faisceau(svg, X.lampe + 22, Y, X.f1 - 9, Y, blanc);
    faisceau(svg, X.f1 + 9, Y, X.f2 - 9, Y, t1);
    faisceau(svg, X.f2 + 9, Y, X.ecran - 12, Y, t2);
    zones.push({id:"avant", p:[(X.lampe + 22 + X.f1 - 9)/2, Y], rgb:[255,255,255], nom:"blanc"});
    if(t1[0] || t1[1] || t1[2]) zones.push({id:"entre", p:[(X.f1 + X.f2)/2, Y], rgb:t1.map(function(x){ return 255*x; }), nom:nomRVB(t1)});
    if(t2[0] || t2[1] || t2[2]) zones.push({id:"apres", p:[(X.f2 + X.ecran - 12)/2 + 5, Y], rgb:t2.map(function(x){ return 255*x; }), nom:nomRVB(t2)});
    svg.appendChild(n("circle", {cx:X.lampe, cy:Y, r:22, fill:"rgb(255,255,255)", stroke:coul("ink"), "stroke-width":2}));
    texteSvg(svg, X.lampe, Y + 42, "lampe", {});
    texteSvg(svg, X.lampe, Y + 58, "blanche", {});
    [[X.f1, i1, "filtre 1"], [X.f2, i2, "filtre 2"]].forEach(function(f){
      if(f[1] === 0){
        svg.appendChild(n("rect", {x:f[0] - 9, y:Y - 50, width:18, height:100, rx:3, fill:"none", stroke:coul("ink3"), "stroke-width":1.5, "stroke-dasharray":"4 4"}));
      } else {
        var t = rvbDe(CHOIX_FILTRE[f[1]]);
        svg.appendChild(n("rect", {x:f[0] - 9, y:Y - 50, width:18, height:100, rx:3, fill:cssRVB(t), stroke:coul("ink"), "stroke-width":1.5}));
        zones.push({id:f[2], p:[f[0], Y - 32], rgb:t.map(function(x){ return 255*x; }), nom:CHOIX_FILTRE[f[1]]});
      }
      texteSvg(svg, f[0], Y + 68, f[2], {});
      texteSvg(svg, f[0], Y + 84, f[1] === 0 ? "(aucun)" : CHOIX_FILTRE[f[1]], {gras:true});
    });
    texteSvg(svg, (X.lampe + X.f1)/2, Y - 16, "blanc", {taille:11.5});
    texteSvg(svg, (X.f1 + X.f2)/2, Y - 16, nomRVB(t1), {taille:11.5});
    texteSvg(svg, (X.f2 + X.ecran)/2, Y - 16, nomRVB(t2) === "noir" ? "plus rien" : nomRVB(t2), {taille:11.5});
    svg.appendChild(n("rect", {x:X.ecran - 12, y:Y - 60, width:26, height:120, rx:3, fill:cssRVB(t2), stroke:coul("ink"), "stroke-width":2}));
    zones.push({id:"ecran", p:[X.ecran + 1, Y - 40], rgb:t2.map(function(x){ return 255*x; }), nom:nomRVB(t2)});
    texteSvg(svg, X.ecran + 1, Y + 78, "écran", {});
    texteSvg(svg, X.ecran + 1, Y + 94, nomRVB(t2), {gras:true, fill:coul("ink")});
    lecture.innerHTML = "blanc → filtre 1 : " + nomRVB(t1) + " → filtre 2 : " + nomRVB(t2);
    var f1 = CHOIX_FILTRE[i1], f2 = CHOIX_FILTRE[i2];
    var texte = (i1 === 0 && i2 === 0) ? "Sans filtre, toute la lumière blanche arrive sur l'écran. Choisis un filtre : il ne fera que **retirer** des couleurs."
      : "Chaque filtre **transmet** les composantes de sa couleur et **absorbe** les autres. " +
        (i1 ? "Le filtre " + f1 + " laisse passer " + listeArt(transmis(i1)) + ". " : "") +
        (i2 ? "Le filtre " + f2 + " laisse passer " + listeArt(transmis(i2)) + (i1 ? ", mais seulement parmi ce qui lui arrive" : "") + ". " : "") +
        (nomRVB(t2) === "noir" ? "Sur l'écran n'arrive rien : il paraît **noir**." : "Sur l'écran arrive " + listeArt(t2) + " : il paraît **" + nomRVB(t2) + "**.") +
        (nomRVB(t2) === "noir" ? " Aucune composante n'a passé " + (i1 && i2 ? "les deux filtres." : "le filtre.") : "") +
        (i1 && i2 ? " Un filtre ne peut que retirer : jamais un second filtre ne fait revenir une couleur arrêtée par le premier." : "");
    note.innerHTML = T(texte);
    boite.setAttribute("data-etat", JSON.stringify({modele:"filtres", f1:f1, f2:f2, t1:t1, t2:t2, zones:zones}));
  }
  boite.insertBefore(choix, svg); boite.appendChild(lecture); boite.appendChild(note);
  dessine();
  return boite;
};

/* =====================================================================
   L'énergie des combustions (ch18)
   ---------------------------------------------------------------------
   Énergies de liaison moyennes, en kJ/mol, phase gazeuse : table
   « Average Bond Energies » de LibreTexts Chemistry (module « Bond
   Energies »), avec la valeur propre à C=O dans CO2 (799). Contrôle
   croisé avec les enthalpies de formation du NIST WebBook (eau gazeuse) :
   méthane −824 contre −802 kJ/mol, propane −2057 contre −2043, pentane
   −3290 contre −3272, éthanol −1276 contre −1278 (écarts ≤ 3 %).
   ===================================================================== */
var LIAISON = {"C-H":413, "C-C":347, "C-O":358, "C=O (CO₂)":799, "O-H":467, "O=O":495};
/* combustibles : formule, atomes, liaisons d'UNE molécule */
var COMBUSTIBLES = {
  "méthane":  {f:"CH_4",      C:1, H:4,  O:0, liaisons:{"C-H":4}},
  "propane":  {f:"C_3H_8",    C:3, H:8,  O:0, liaisons:{"C-H":8,  "C-C":2}},
  "butane":   {f:"C_4H_10",   C:4, H:10, O:0, liaisons:{"C-H":10, "C-C":3}},
  "pentane":  {f:"C_5H_12",   C:5, H:12, O:0, liaisons:{"C-H":12, "C-C":4}},
  "octane":   {f:"C_8H_18",   C:8, H:18, O:0, liaisons:{"C-H":18, "C-C":7}},
  "méthanol": {f:"CH_3OH",    C:1, H:4,  O:1, liaisons:{"C-H":3, "C-O":1, "O-H":1}},
  "éthanol":  {f:"C_2H_5OH",  C:2, H:6,  O:1, liaisons:{"C-H":5, "C-C":1, "C-O":1, "O-H":1}}
};
/* coefficients de la combustion complète d'UNE mole de combustible (O2 peut être demi-entier) */
function combustionDe(nom){
  var c = COMBUSTIBLES[nom], co2 = c.C, h2o = c.H/2, o2 = (2*co2 + h2o - c.O)/2;
  return {c:c, co2:co2, h2o:h2o, o2:o2};
}
/* bilan énergétique pour une mole de combustible : rompues, formées, Er = R − F */
function bilanLiaisons(nom){
  var q = combustionDe(nom), R = 0, F = 0, detR = [], detF = [];
  for(var l in q.c.liaisons){ R += q.c.liaisons[l]*LIAISON[l]; detR.push([q.c.liaisons[l], l]); }
  R += q.o2*LIAISON["O=O"]; detR.push([q.o2, "O=O"]);
  F = q.co2*2*LIAISON["C=O (CO₂)"] + q.h2o*2*LIAISON["O-H"];
  detF.push([2*q.co2, "C=O (CO₂)"]); detF.push([2*q.h2o, "O-H"]);
  return {R:R, F:F, E:R - F, detR:detR, detF:detF, q:q};
}
function coefTxt(x){                          // 1 → "", 2 → "2 ", 6,5 → "@f{13}{2} "
  if(x === 1) return "";
  if(x === Math.round(x)) return x + " ";
  return "@f{" + (2*x) + "}{2} ";
}
function milliersKJ(x){ var a = Math.abs(Math.round(x)), s = String(a); if(a >= 1000) s = s.replace(/(\d)(?=(\d{3})+$)/, "$1 "); return (x < 0 ? "−" : "") + s; }

/* -- Combustions 1. Ajuster l'équation de combustion complète, pas à pas -- */
var ETAPES_COMB = ["Le squelette", "1. Le carbone", "2. L'hydrogène", "3. L'oxygène, en dernier", "4. Des nombres entiers"];
MODELES["combustion"] = function(){
  var noms = ["méthane","propane","butane","octane","méthanol","éthanol"], ic = 0, ie = 0;
  var boite = el("div","figBoite"), eq = el("div","figLecture"), tab = el("div"), curs = el("div","figCurseurs"), note = el("div","figNote");
  eq.style.fontSize = "17px";
  var choix = el("div","row"); choix.style.flexWrap = "wrap"; choix.style.justifyContent = "center";
  var bts = noms.map(function(nm, k){
    var b = el("button","btn gho", nm); b.type = "button";
    b.onclick = function(){ ic = k; ie = 0; ce.value = 0; dessine(); };
    choix.appendChild(b); return b;
  });
  function dessine(){
    bts.forEach(function(b, k){ b.className = "btn " + (k === ic ? "pri" : "gho"); });
    var nom = noms[ic], q = combustionDe(nom), c = q.c;
    /* coefficients à l'étape ie : ce qui n'a pas encore été ajusté vaut 1 */
    var k = {f:1, o2:1, co2:1, h2o:1};
    if(ie >= 1) k.co2 = q.co2;
    if(ie >= 2) k.h2o = q.h2o;
    if(ie >= 3) k.o2 = q.o2;
    var double = ie >= 4 && q.o2 !== Math.round(q.o2);
    if(double){ k = {f:2, o2:2*q.o2, co2:2*q.co2, h2o:2*q.h2o}; }
    eq.innerHTML = T("$" + coefTxt(k.f) + "@c{" + c.f + "} + " + coefTxt(k.o2) + "@c{O_2} → " + coefTxt(k.co2) + "@c{CO_2} + " + coefTxt(k.h2o) + "@c{H_2O}$");
    var g = {C:k.f*c.C, H:k.f*c.H, O:k.f*c.O + 2*k.o2}, d = {C:k.co2, H:2*k.h2o, O:2*k.co2 + k.h2o};
    var postes = [["C",1], ["H",2], ["O",3]].map(function(p){
      var ok = Math.abs(g[p[0]] - d[p[0]]) < 1e-9, avenir = p[1] > ie;
      return {el:p[0], g:g[p[0]], d:d[p[0]], ok:ok, des:p[1], affiche: avenir ? "avenir" : (ok ? "ok" : "ko")};
    });
    var fmt = function(x){ return x === Math.round(x) ? String(x) : String(x).replace(".", ","); };
    tab.innerHTML = '<div class="tblWrap"><table class="tbl"><thead><tr><th>atomes</th><th>à gauche</th><th>à droite</th><th></th></tr></thead><tbody>' +
      postes.map(function(p){
        var etat = p.affiche === "avenir" ? '<td style="color:var(--ink3)">— à venir</td>'
          : '<td style="color:var(' + (p.ok ? "--vert" : "--rouge") + ');font-weight:600">' + (p.ok ? "✓ équilibré" : "✗ à ajuster") + "</td>";
        return "<tr><td>" + p.el + " (étape " + p.des + ")</td><td>" + fmt(p.g) + "</td><td>" + fmt(p.d) + "</td>" + etat + "</tr>";
      }).join("") + "</tbody></table></div>";
    var txt = [
      "On écrit le combustible et le dioxygène à gauche, le dioxyde de carbone et l'eau à droite : une combustion **complète** ne donne que ces deux produits. Aucun nombre n'est encore placé.",
      "**Le carbone d'abord** : chaque atome de carbone du combustible finit dans une molécule de $@c{CO_2}$. " + c.C + " atome" + (c.C > 1 ? "s" : "") + " de carbone, donc " + q.co2 + " $@c{CO_2}$.",
      "**L'hydrogène ensuite** : chaque molécule d'eau emporte 2 atomes d'hydrogène. " + c.H + " atomes d'hydrogène, donc " + fmt(q.h2o) + " $@c{H_2O}$.",
      "**L'oxygène en dernier**, parce que le dioxygène est la seule espèce qui ne contient que lui : on le règle sans rien dérégler. À droite, " + fmt(d.O) + " atomes d'oxygène" +
        (c.O ? " ; le combustible en apporte déjà " + c.O + " (ne l'oublie pas), le dioxygène doit donc en fournir $" + fmt(d.O) + " − " + c.O + " = " + fmt(d.O - c.O) + "$" : "") +
        ". Chaque $@c{O_2}$ en apporte 2 : il faut $" + fmt(d.O - c.O) + " ÷ 2 = " + (q.o2 !== Math.round(q.o2) ? "@f{" + (2*q.o2) + "}{2}$ (soit " + fmt(q.o2) + ")" : fmt(q.o2) + "$") + " $@c{O_2}$" +
        (q.o2 !== Math.round(q.o2) ? ", un nombre non entier." : "."),
      double ? "**Des nombres entiers** : on multiplie tous les nombres par 2 pour faire disparaître la fraction. L'équation reste juste, puisqu'on a multiplié des deux côtés." : "**Des nombres entiers** : ils le sont déjà, il n'y a rien à faire. L'équation est ajustée."
    ][ie];
    note.innerHTML = T(txt);
    boite.setAttribute("data-etat", JSON.stringify({modele:"combustion", combustible:nom, etape:ie, k:k, gauche:g, droite:d, postes:postes,
      equation:eq.textContent}));
  }
  var ce = curseur(curs, "étape", 0, 4, 1, ie, function(x){ ie = Math.round(x); dessine(); });
  boite.appendChild(choix); boite.appendChild(eq); boite.appendChild(tab); boite.appendChild(curs); boite.appendChild(note);
  dessine();
  return boite;
};

/* -- Combustions 2. Le bilan des liaisons : rompre coûte, former libère ---
   Les hauteurs des barres sont PROPORTIONNELLES aux énergies : une seule
   échelle k (px par kJ) pour la rupture, la formation et le bilan. */
MODELES["bilan-liaisons"] = function(){
  var noms = ["méthane","propane","pentane","éthanol"], ic = 0;
  var w = 430, h = 330, m = boiteManip(w, h), svg = m.svg, boite = m.boite;
  var lecture = el("div","figLecture"), note = el("div","figNote");
  var choix = el("div","row"); choix.style.flexWrap = "wrap"; choix.style.justifyContent = "center";
  var bts = noms.map(function(nm, k){
    var b = el("button","btn gho", nm); b.type = "button";
    b.onclick = function(){ ic = k; dessine(); };
    choix.appendChild(b); return b;
  });
  function dessine(){
    bts.forEach(function(b, k){ b.className = "btn " + (k === ic ? "pri" : "gho"); });
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var nom = noms[ic], B = bilanLiaisons(nom), q = B.q;
    var HAUT = 46, BAS = 286, k = (BAS - HAUT)/B.F;      // la formation, la plus grande, remplit la hauteur
    var yA = HAUT, yR = HAUT + B.R*k, yP = HAUT + B.F*k;
    var X = {r:[30,120], a:[165,265], p:[305,395]};
    var trait = function(x1, x2, y, c){ svg.appendChild(n("line", {x1:x1, y1:y, x2:x2, y2:y, stroke:coul(c), "stroke-width":3})); };
    trait(X.r[0], X.r[1], yR, "ink"); trait(X.a[0], X.a[1], yA, "ink2"); trait(X.p[0], X.p[1], yP, "ink");
    /* les deux étapes, en barres de largeur fixe et de hauteur proportionnelle */
    var bR = n("rect", {x:137, y:yA, width:16, height:yR - yA, fill:coul("rouge"), "fill-opacity":.75});
    var bF = n("rect", {x:277, y:yA, width:16, height:yP - yA, fill:coul("vert"), "fill-opacity":.75});
    var bE = n("rect", {x:404, y:yR, width:12, height:yP - yR, fill:coul("bleu"), "fill-opacity":.75});
    bR.setAttribute("data-barre", "rupture"); bF.setAttribute("data-barre", "formation"); bE.setAttribute("data-barre", "bilan");
    svg.appendChild(bR); svg.appendChild(bF); svg.appendChild(bE);
    /* pointillés de rappel des niveaux jusqu'aux barres */
    var poin = function(x1, x2, y){ svg.appendChild(n("line", {x1:x1, y1:y, x2:x2, y2:y, stroke:coul("ink3"), "stroke-width":1, "stroke-dasharray":"3 4"})); };
    poin(X.r[1], 137, yR); poin(153, X.a[0], yA); poin(X.a[1], 277, yA); poin(293, X.p[0], yP); poin(X.r[1], 404, yR); poin(X.p[1], 404, yP);
    var t = function(x, y, s, o){ return texteSvg(svg, x, y, s, o); };
    /* l'axe : la hauteur est l'énergie stockée dans les molécules */
    var ax = texteSvg(svg, 12, (HAUT + BAS)/2, "énergie stockée dans les molécules ↑", {taille:10.5, fill:coul("ink3")});
    ax.setAttribute("transform", "rotate(-90 12 " + (HAUT + BAS)/2 + ")");
    /* pointes : la rupture monte, la formation descend */
    svg.appendChild(n("polygon", {points:"135," + (yA + 9) + " 145," + (yA - 1) + " 155," + (yA + 9), fill:coul("rouge")}));
    svg.appendChild(n("polygon", {points:"275," + (yP - 9) + " 285," + (yP + 1) + " 295," + (yP - 9), fill:coul("vert")}));
    t((X.r[0] + X.r[1])/2, yR - 8, "réactifs", {gras:true});
    t((X.r[0] + X.r[1])/2, yR + 16, "1 " + nom + " + " + String(q.o2).replace(".", ",") + " O₂", {taille:11});
    t((X.a[0] + X.a[1])/2, yA - 22, "atomes séparés", {gras:true});
    t((X.p[0] + X.p[1])/2, yP - 8, "produits", {gras:true});
    t((X.p[0] + X.p[1])/2, yP + 16, q.co2 + " CO₂ + " + q.h2o + " H₂O (gaz)", {taille:11});
    t(145, yA - 6, "+" + milliersKJ(B.R) + " kJ", {fill:coul("rouge"), gras:true, taille:11.5});
    t(132, (yA + yR)/2 + 4, "rompre", {fill:coul("rouge"), taille:11, ancre:"end"});
    t(285, yA - 6, "−" + milliersKJ(B.F) + " kJ", {fill:coul("vert"), gras:true, taille:11.5});
    t(272, (yA + yP)/2 + 4, "former", {fill:coul("vert"), taille:11, ancre:"end"});
    /* sous les produits : à mi-hauteur de la barre, le libellé chevauchait « produits » quand le bilan est court (éthanol) */
    t(418, yP + 33, "Er = " + milliersKJ(B.E) + " kJ/mol", {fill:coul("bleu"), gras:true, taille:11.5, ancre:"end"});
    lecture.innerHTML = "rompre : +" + milliersKJ(B.R) + " kJ · former : −" + milliersKJ(B.F) + " kJ · Er = " + milliersKJ(B.R) + " − " + milliersKJ(B.F) + " = " + milliersKJ(B.E) + " kJ/mol";
    var liste = function(dd){
      var l = dd.map(function(d){ return String(d[0]).replace(".", ",") + " liaison" + (d[0] > 1 ? "s " : " ") + d[1].replace("-", "–"); });
      return l.length > 1 ? l.slice(0, -1).join(", ") + " et " + l[l.length - 1] : l[0];
    };
    note.innerHTML = T("Pour **une mole " + (/^[aeiouyéè]/.test(nom) ? "d'" : "de ") + nom + "** (tous les corps à l'état gazeux) : on **rompt** " + liste(B.detR) +
      " : il faut **fournir** $" + milliersKJ(B.R) + "$ @u{kJ} aux molécules (barre rouge, qui monte : leur porte-monnaie se remplit, on compte $+$). On **forme** " + liste(B.detF) +
      " : les molécules **rendent** $" + milliersKJ(B.F) + "$ @u{kJ} à l'extérieur (barre verte, qui descend : le porte-monnaie se vide, on compte $−$). " +
      "La barre verte est plus longue que la rouge : les produits sont plus bas que les réactifs. La **barre bleue** mesure cet écart entre le départ et l'arrivée : c'est $E_r = " + milliersKJ(B.R) + " − " + milliersKJ(B.F) + " = " + milliersKJ(B.E) + "$ @u{kJ/mol}, **négatif** : les molécules ont perdu de l'énergie, la combustion en libère.");
    boite.setAttribute("data-etat", JSON.stringify({modele:"bilan-liaisons", combustible:nom, R:B.R, F:B.F, E:B.E, k:k, detR:B.detR, detF:B.detF,
      hauteurs:{rupture:yR - yA, formation:yP - yA, bilan:yP - yR}}));
  }
  boite.insertBefore(choix, svg); boite.appendChild(lecture); boite.appendChild(note);
  dessine();
  return boite;
};

/* -- Électricité : la source réelle de tension (ch10) ----------------------
   Une source réelle = une source idéale E en série avec une résistance r.
   Branchée sur une résistance de charge R : I = E/(R + r), U = E − rI.
   Toutes les longueurs (barre E = U + rI, point sur la caractéristique) sont
   calculées à partir de ces deux relations ; data-etat les publie pour le
   balayage (outils/balayage-source-reelle.mjs). */
var SOURCES_REELLES = [
  {nom:"pile plate « 4,5 V »", E:4.7, r:1.3},
  {nom:"pile « 9 V »", E:9.4, r:2.0},
  {nom:"batterie de voiture", E:12.6, r:0.02}
];
var CHARGES = [Infinity, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0];   // ∞ : à vide ; 0 : court-circuit
function frU(x, d){ return String(+x.toFixed(d)).replace(".", ","); }
function sigU(x){ var a = Math.abs(x); return frU(x, a >= 100 ? 0 : a >= 10 ? 1 : 2); }
MODELES["source-reelle"] = function(){
  var is = 0, ir = 3;
  var w = 430, h = 300, m = boiteManip(w, h), svg = m.svg, boite = m.boite;
  var choix = el("div"), lecture = el("div","figLecture"), curs = el("div","figCurseurs"), note = el("div","figNote");
  var bs = rangeeChoix(choix, "la source", SOURCES_REELLES.map(function(s){ return s.nom; }), function(k){ is = k; dessine(); });
  function dessine(){
    marquer(bs, is);
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var S = SOURCES_REELLES[is], R = CHARGES[ir], E = S.E, r = S.r;
    var I = R === Infinity ? 0 : E/(R + r), U = E - r*I, Icc = E/r;
    /* ce qui est AFFICHÉ se recalcule à partir de ce qui est affiché : E et rI
       à 2 décimales, et U affichée = E affichée − rI affichée (un « 9,4 − 2 ×
       0,43 = 8,55 » montrait un calcul qui ne tombe pas juste) */
    var Ea = +E.toFixed(2), rIa = +(r*I).toFixed(2), Ua = +(Ea - rIa).toFixed(2);
    var v2 = function(x){ return x.toFixed(2).replace(".", ","); };
    var ligne = function(x1, y1, x2, y2, c, o){ var e = n("line", {x1:x1, y1:y1, x2:x2, y2:y2, stroke:coul(c || "ink"), "stroke-width":(o && o.ep) || 2}); if(o && o.tir) e.setAttribute("stroke-dasharray", o.tir); svg.appendChild(e); return e; };
    var t = function(x, y, s, o){ return texteSvg(svg, x, y, s, o); };
    /* ---- le circuit : la source réelle (boîte pointillée) et la charge R ---- */
    svg.appendChild(n("rect", {x:20, y:40, width:70, height:130, rx:6, fill:"none", stroke:coul("ink3"), "stroke-width":1.5, "stroke-dasharray":"5 4"}));
    t(96, 47, "source réelle", {taille:11, ancre:"start"});
    ligne(55, 50, 55, 70); svg.appendChild(n("circle", {cx:55, cy:85, r:14, fill:"none", stroke:coul("ink"), "stroke-width":2})); ligne(55, 71, 55, 99);
    t(80, 89, "E", {gras:true, ancre:"start"});
    ligne(55, 99, 55, 112); svg.appendChild(n("rect", {x:47, y:112, width:16, height:34, fill:"none", stroke:coul("rouge"), "stroke-width":2})); ligne(55, 146, 55, 160);
    t(70, 133, "r", {gras:true, ancre:"start", fill:coul("rouge")});
    ligne(55, 50, 55, 20); ligne(55, 20, 180, 20); ligne(55, 160, 55, 190); ligne(55, 190, 180, 190);
    if(R === Infinity){ ligne(180, 20, 180, 80); ligne(180, 130, 180, 190); t(190, 109, "à vide", {ancre:"start", taille:11.5}); t(190, 124, "(circuit ouvert)", {ancre:"start", taille:10.5}); }
    else if(R === 0){ ligne(180, 20, 180, 190, "rouge", {ep:3}); t(190, 109, "court-circuit", {ancre:"start", taille:11.5, fill:coul("rouge"), gras:true}); }
    else { ligne(180, 20, 180, 80); svg.appendChild(n("rect", {x:172, y:80, width:16, height:50, fill:"none", stroke:coul("ink"), "stroke-width":2})); ligne(180, 130, 180, 190);
      t(194, 109, "R = " + frU(R, 2) + " Ω", {ancre:"start", taille:11.5}); }
    /* ---- la barre E = U + rI, longueurs proportionnelles ---- */
    var L = 180, x0 = 20, yb = 228, kx = L/E, lU = U*kx, lr = r*I*kx;
    var bU = n("rect", {x:x0, y:yb, width:lU, height:16, fill:coul("bleu"), "fill-opacity":.7}); bU.setAttribute("data-barre", "U");
    var bR = n("rect", {x:x0 + lU, y:yb, width:lr, height:16, fill:coul("rouge"), "fill-opacity":.7}); bR.setAttribute("data-barre", "rI");
    svg.appendChild(bU); svg.appendChild(bR);
    svg.appendChild(n("rect", {x:x0, y:yb, width:L, height:16, fill:"none", stroke:coul("ink"), "stroke-width":1.5}));
    t(x0, yb - 8, "E = " + v2(Ea) + " V, partagée en :", {ancre:"start", taille:11});
    t(x0, yb + 32, "U = " + v2(Ua) + " V (délivrée)", {ancre:"start", taille:11, fill:coul("bleu")});
    t(x0 + L, yb + 48, "rI = " + v2(rIa) + " V (gardée par r)", {ancre:"end", taille:11, fill:coul("rouge")});
    /* ---- la caractéristique U(I) : de (0 ; E) à (Icc ; 0) ---- */
    var G = {x0:262, y0:250, lx:150, ly:190};
    ligne(G.x0, G.y0, G.x0 + G.lx + 6, G.y0, "ink3", {ep:1.5}); ligne(G.x0, G.y0, G.x0, G.y0 - G.ly - 6, "ink3", {ep:1.5});
    t(G.x0 + G.lx + 6, G.y0 + 32, "I (A)", {ancre:"end", taille:11}); t(G.x0 - 6, G.y0 - G.ly - 10, "U (V)", {ancre:"start", taille:11});
    var px = function(i){ return G.x0 + i/Icc*G.lx; }, py = function(u){ return G.y0 - u/E*G.ly; };
    ligne(px(0), py(E), px(Icc), py(0), "bleu", {ep:2});
    t(G.x0 - 4, py(E) + 4, sigU(E), {ancre:"end", taille:10.5});
    t(px(Icc), G.y0 + 16, sigU(Icc), {taille:10.5});
    var pt = n("circle", {cx:px(I), cy:py(U), r:5, fill:coul("rouge")}); pt.setAttribute("data-point", "1"); svg.appendChild(pt);
    lecture.innerHTML = (R === Infinity ? "à vide : " : R === 0 ? "court-circuit : " : "R = " + frU(R, 2) + " Ω : ") + "I = " + sigU(I) + " A · rI = " + v2(rIa) + " V · U = E − rI = " + v2(Ea) + " − " + v2(rIa) + " = " + v2(Ua) + " V";
    var texte;
    if(R === Infinity) texte = "**À vide**, aucun courant ne circule : rien n'est perdu dans $r$, et la tension aux bornes est la tension à vide, $U = E$. C'est ce que mesure un voltmètre branché seul sur la source.";
    else if(R === 0) texte = "**Court-circuit** : les deux bornes sont reliées par un fil. $U = 0$, et seule la résistance interne limite le courant : $I_{cc} = @f{E}{r} = " + sigU(Icc) + "$ @u{A}. Toute la puissance part en chaleur dans la source" + (r < 0.1 ? " : avec la résistance interne minuscule d'une batterie de voiture, des centaines d'ampères, de quoi faire fondre un câble ou enflammer la batterie." : ", qui chauffe : on ne relie jamais les deux bornes d'une pile.");
    else texte = "La résistance $R$ branchée sur la source fixe le courant : $I = @f{E}{R + r}$. Plus on en demande, plus la part **gardée par la résistance interne**, $rI$, grandit (perdue pour le circuit), et plus la tension **délivrée** $U = E - rI$ baisse, sans que la source s'use pour autant : revenue à vide, elle retrouve aussitôt $E$. " +
      (r*I/E < 0.01 ? "Ici, $rI$ fait moins de 1 % de $E$ : la source se comporte presque comme une source idéale." : r*I/E < 0.05 ? "Ici, $rI$ ne fait que " + Math.round(100*r*I/E) + " % de $E$ : la source se comporte presque comme une source idéale." : "Ici, $rI$ fait déjà " + Math.round(100*r*I/E) + " % de $E$.");
    note.innerHTML = T(texte);
    boite.setAttribute("data-etat", JSON.stringify({modele:"source-reelle", source:S.nom, E:E, r:r, R:R === Infinity ? "infini" : R, I:I, U:U, Icc:Icc,
      barre:{L:L, U:lU, rI:lr}, point:{x:px(I), y:py(U)}, droite:{x1:px(0), y1:py(E), x2:px(Icc), y2:py(0)}}));
  }
  var c = curseur(curs, "courant demandé", 0, CHARGES.length - 1, 1, ir, function(x){ ir = Math.round(x); dessine(); });
  boite.insertBefore(choix, svg); boite.appendChild(lecture); boite.appendChild(curs); boite.appendChild(note);
  dessine();
  return boite;
};

/* -- Chimie organique : spectres infrarouges RÉELS (ch7, s8) ----------------
   Les courbes viennent de public/app/02-spectres-ir.js (spectres Coblentz du
   NIST, phase condensée, voir son en-tête) : rien n'est dessiné à la main.
   Les repères (flèche + étiquette) pointent la courbe AU nombre d'onde
   indiqué, lu dans les données ; outils/balayage-ir-domaines.mjs vérifie que
   chaque repère tombe dans la plage de la table du cours pour sa liaison et
   sur une vraie absorption, et qu'aucune étiquette n'en chevauche une autre.
   Axe : de 3800 à 600 cm-1, DÉCROISSANT vers la droite, comme sur tout
   spectre IR ; transmittance en %, les bandes « pendent » vers le bas. */
var IR_AXE = {haut:3800, bas:600};
var IR_SOLUTION = "en solution à 10 % dans un solvant sans liaison hydrogène";
var ANNOT_IR = {
  "ethanol":          {etat:IR_SOLUTION, bandes:[{s:[3315], lib:"O–H lié"}, {s:[2975], lib:"C–H"}]},
  "ethanal":          {etat:IR_SOLUTION, bandes:[{s:[2825, 2720], lib:"C–H aldéhyde"}, {s:[1730], lib:"C=O"}]},
  "butanone":         {etat:IR_SOLUTION, bandes:[{s:[2980], lib:"C–H"}, {s:[1710], lib:"C=O"}]},
  "acide-ethanoique": {etat:IR_SOLUTION, bandes:[{s:[3100], lib:"O–H acide", plage:"de 2500 à 3300"}, {s:[1710], lib:"C=O"}]},
  "butanol-pur":      {etat:"liquide pur", bandes:[{s:[3320], lib:"O–H lié"}, {s:[2950], lib:"C–H"}]},
  "butanol-dilue":    {etat:"très dilué (0,5 %) dans un solvant sans liaison hydrogène", bandes:[{s:[3640], lib:"O–H libre"}, {s:[2960], lib:"C–H"}]},
  "propan-2-ol":      {etat:IR_SOLUTION},
  "propanone":        {etat:IR_SOLUTION},
  "acide-butanoique": {etat:IR_SOLUTION},
  "propan-1-ol":      {etat:IR_SOLUTION},
  "heptanal":         {etat:IR_SOLUTION}
};
/* transmittance (0-1) au nombre d'onde s, lue dans les données */
function irT(S, s){ var k = Math.round((S.s0 - s)/S.pas); return (k < 0 || k >= S.t.length) ? null : S.t[k]/1000; }
/* « CH3-CH2-OH » → « $@c{CH_3-CH_2-OH}$ » pour T() */
function irFormule(f){ return "$@c{" + f.replace(/(\d+)/g, "_$1") + "}$"; }
function irSource(cle){
  var S = window.SPECTRES_IR[cle], A = ANNOT_IR[cle] || {};
  return "Spectre réel : " + S.source + ", " + (A.etat || "phase condensée") + ".";
}
/* trace le spectre « cle » dans svg (largeur w, hauteur h) ; o.annot : repères ;
   o.empreinte : zone grisée sous 1500 cm-1. Renvoie l'état publié pour le balayage. */
function traceSpectreIR(svg, w, h, cle, o){
  o = o || {};
  var S = window.SPECTRES_IR && window.SPECTRES_IR[cle];
  if(!S) return null;
  var G = {x0:46, x1:w - 14, yT:o.annot ? 52 : 18, y0:h - 44};          // yT : T = 100 %
  var X = function(s){ return G.x0 + (IR_AXE.haut - s)/(IR_AXE.haut - IR_AXE.bas)*(G.x1 - G.x0); };
  var Y = function(tr){ return G.y0 - tr*(G.y0 - G.yT); };
  var t = function(x, y, s, oo){ return texteSvg(svg, x, y, s, oo); };
  var etat = {modele:"spectre-ir", cle:cle, axe:{x0:G.x0, x1:G.x1, yT:G.yT, y0:G.y0, haut:IR_AXE.haut, bas:IR_AXE.bas}, reperes:[]};
  /* la zone d'empreinte : beaucoup de bandes, inutiles pour trouver la famille */
  if(o.empreinte){
    svg.appendChild(n("rect", {x:X(1500), y:G.yT, width:X(IR_AXE.bas) - X(1500), height:G.y0 - G.yT, fill:coul("ink3"), "fill-opacity":.1}));
    var ze = t((X(1500) + X(IR_AXE.bas))/2, G.yT - 5, "empreinte digitale", {taille:10, fill:coul("ink3")});
    ze.setAttribute("data-zone", "empreinte");
  }
  /* axes et graduations */
  svg.appendChild(n("line", {x1:G.x0, y1:G.y0, x2:G.x1, y2:G.y0, stroke:coul("ink3"), "stroke-width":1.3}));
  svg.appendChild(n("line", {x1:G.x0, y1:G.y0, x2:G.x0, y2:G.yT - 4, stroke:coul("ink3"), "stroke-width":1.3}));
  [3500, 3000, 2500, 2000, 1500, 1000].forEach(function(s){
    svg.appendChild(n("line", {x1:X(s), y1:G.y0, x2:X(s), y2:G.y0 + 4, stroke:coul("ink3"), "stroke-width":1.2}));
    t(X(s), G.y0 + 16, String(s), {taille:10.5, fill:coul("ink3")});
  });
  [0, 50, 100].forEach(function(p){
    svg.appendChild(n("line", {x1:G.x0 - 4, y1:Y(p/100), x2:G.x0, y2:Y(p/100), stroke:coul("ink3"), "stroke-width":1.2}));
    t(G.x0 - 7, Y(p/100) + 4, String(p), {ancre:"end", taille:10.5, fill:coul("ink3")});
  });
  svg.appendChild(n("line", {x1:G.x0, y1:G.yT, x2:G.x1, y2:G.yT, stroke:coul("ink3"), "stroke-width":.8, "stroke-dasharray":"3 4"}));
  t((G.x0 + G.x1)/2, G.y0 + 34, "nombre d'onde σ (cm⁻¹) : il DIMINUE vers la droite →", {taille:11, fill:coul("ink2")});
  var ty = t(12, (G.yT + G.y0)/2, "transmittance (%)", {taille:10.5, fill:coul("ink2")});
  ty.setAttribute("transform", "rotate(-90 12 " + (G.yT + G.y0)/2 + ")");
  /* la courbe mesurée */
  var d = "";
  S.t.forEach(function(v, k){ var s = S.s0 - k*S.pas; d += (d ? " L " : "M ") + X(s).toFixed(1) + " " + Y(v/1000).toFixed(1); });
  var courbe = n("path", {d:d, fill:"none", stroke:coul("rouge"), "stroke-width":1.5, "stroke-linejoin":"round"});
  courbe.setAttribute("data-courbe", cle);
  svg.appendChild(courbe);
  /* les repères : étiquette en haut, une flèche par pointe, qui s'arrête juste au-dessus de la courbe */
  if(o.annot && ANNOT_IR[cle] && ANNOT_IR[cle].bandes){
    var places = [];
    ANNOT_IR[cle].bandes.forEach(function(b){
      var xs = b.s.map(X), xm = xs.reduce(function(a, x){ return a + x; }, 0)/xs.length;
      var larg = 6.5*b.lib.length + 6, rang = 0;
      xm = Math.max(larg/2 + 2, Math.min(w - larg/2 - 2, xm));
      while(places.some(function(p){ return p.rang === rang && Math.abs(p.x - xm) < (p.larg + larg)/2 + 4; })) rang++;
      places.push({x:xm, larg:larg, rang:rang});
      var yl = 34 - 16*rang;
      var lab = t(xm, yl, b.lib, {taille:12, gras:true, fill:coul("ink")});
      lab.setAttribute("data-repere", b.lib);
      /* deux pointes (le doublet de l'aldéhyde) : une barre sous l'étiquette, puis
         une flèche verticale par pointe, pour ne jamais traverser la courbe en biais */
      if(xs.length > 1) svg.appendChild(n("line", {x1:Math.min.apply(null, xs), y1:yl + 5, x2:Math.max.apply(null, xs), y2:yl + 5, stroke:coul("ink"), "stroke-width":1.3}));
      b.s.forEach(function(s, i){
        var yb = Y(irT(S, s)) - 4, x = xs[i];
        svg.appendChild(n("line", {x1:xs.length > 1 ? x : xm, y1:yl + 5, x2:x, y2:yb - 6, stroke:coul("ink"), "stroke-width":1.3}));
        svg.appendChild(n("polygon", {points:(x - 4) + "," + (yb - 7) + " " + (x + 4) + "," + (yb - 7) + " " + x + "," + yb, fill:coul("ink")}));
        etat.reperes.push({lib:b.lib, s:s, T:irT(S, s), x:x, pointe:yb});
      });
    });
  }
  return etat;
}
var NOTES_IR = {
  "ethanol": "**Alcool** : la grande bande **large** vers $3300$ @u{cm^{-1}}, c'est le $@c{O}$–$@c{H}$ lié par liaisons hydrogène. Pas de bande forte vers $1700$ : pas de $@c{C}$=$@c{O}$. La toute petite pointe fine vers $3635$ vient des rares molécules restées isolées dans le solvant (O–H libre).",
  "ethanal": "**Aldéhyde** : une bande **forte et fine** vers $1730$ @u{cm^{-1}} ($@c{C}$=$@c{O}$), et surtout les **deux pointes** vers $2720$ et $2825$, le $@c{C}$–$@c{H}$ du groupe $–@c{CHO}$, que n'a aucune cétone. La petite bande vers $3435$ n'est pas un $@c{O}$–$@c{H}$ : faible et fine, c'est l'harmonique de la bande $@c{C}$=$@c{O}$ (sa « note à l'octave », vers deux fois son nombre d'onde).",
  "butanone": "**Cétone** : une bande **forte et fine** vers $1710$ @u{cm^{-1}} ($@c{C}$=$@c{O}$), et rien d'autre de net : pas de bande large d'$@c{O}$–$@c{H}$, pas de double pointe vers $2700$-$2800$. La petite bande vers $3420$ est l'harmonique de la bande $@c{C}$=$@c{O}$ (sa « note à l'octave »), pas un $@c{O}$–$@c{H}$.",
  "acide-ethanoique": "**Acide carboxylique** : la bande $@c{C}$=$@c{O}$ vers $1710$ @u{cm^{-1}}, **et** une bande $@c{O}$–$@c{H}$ **très large**, de $2500$ à $3300$ environ, qui avale les $@c{C}$–$@c{H}$ vers $3000$. Les deux ensemble : c'est la signature du groupe $–@c{COOH}$.",
  "butanol-pur": "**Liquide pur** : chaque $@c{O}$–$@c{H}$ est accroché à des voisins par liaisons hydrogène, plus ou moins fortement. Chaque accrochage décale un peu sa vibration : la somme donne une bande **large**, vers $3320$ @u{cm^{-1}}.",
  "butanol-dilue": "**Très dilué** dans un solvant sans liaison hydrogène, chaque molécule est isolée : son $@c{O}$–$@c{H}$ vibre librement, et tous de la même façon. La bande devient **fine** et se place plus haut, vers $3640$ @u{cm^{-1}}. Même molécule, autre entourage."
};
function modeleSpectreIR(liste, titre){
  var ic = 0, annot = true;
  var w = 440, h = 270, m = boiteManip(w, h), svg = m.svg, boite = m.boite;
  var choix = el("div"), lecture = el("div","figLecture"), outils = el("div","row"), note = el("div","figNote"), source = el("div","figNote");
  var bs = rangeeChoix(choix, titre, liste.map(function(k){ return window.SPECTRES_IR[k].nom; }), function(k){ ic = k; dessine(); });
  outils.style.justifyContent = "center";
  var bA = el("button","btn gho sm", ""); bA.type = "button"; bA.onclick = function(){ annot = !annot; dessine(); };
  outils.appendChild(bA);
  source.style.fontSize = "12px";
  function dessine(){
    marquer(bs, ic);
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var cle = liste[ic], S = window.SPECTRES_IR[cle];
    var etat = traceSpectreIR(svg, w, h, cle, {annot:annot, empreinte:true});
    bA.textContent = annot ? "Cacher les repères (t'entraîner à lire)" : "Montrer les repères";
    lecture.innerHTML = T(S.nom + " " + irFormule(S.formule) + " · " + (annot ? ANNOT_IR[cle].bandes.map(function(b){ return b.lib + (b.plage ? " " + b.plage : " vers " + b.s.join(" et ")) + " cm⁻¹"; }).join(" · ") : "repères cachés : à toi de trouver les bandes"));
    note.innerHTML = T(annot ? NOTES_IR[cle] : "Cherche d'abord une bande forte et fine vers $1700$ @u{cm^{-1}} ($@c{C}$=$@c{O}$), puis une bande large centrée vers $3300$, ou une vallée très large qui descend jusque vers $2500$ ($@c{O}$–$@c{H}$), puis une ou deux pointes entre $2695$ et $2830$ (aldéhyde). Ignore la zone grisée.");
    source.textContent = irSource(cle);
    etat.annot = annot;
    boite.setAttribute("data-etat", JSON.stringify(etat));
  }
  boite.insertBefore(choix, svg); boite.appendChild(lecture); boite.appendChild(outils); boite.appendChild(note); boite.appendChild(source);
  dessine();
  return boite;
}
MODELES["spectre-ir"] = function(){ return modeleSpectreIR(["ethanol", "ethanal", "butanone", "acide-ethanoique"], "la molécule"); };
MODELES["spectre-oh"] = function(){ return modeleSpectreIR(["butanol-pur", "butanol-dilue"], "le butan-1-ol"); };

/* -- Lumière : l'échelle des domaines électromagnétiques (ch13, s8) ---------
   Échelle LOGARITHMIQUE : chaque graduation multiplie la longueur d'onde par
   10. Frontières, approximatives par nature (ce sont des conventions) :
   UV de 10 nm (limite avec les X, convention du cours) à 400 nm (CIE :
   UV 100-400 nm, en-deçà « UV extrême »), visible ~400-800 nm (la convention
   du cours, CIE : 380-780),
   IR 780 nm-1 mm (CIE, vocabulaire international de l'éclairage, e-ILV
   17-21-004 et 17-21-008) ; ondes radio : fréquences inférieures à 3 000 GHz
   (UIT, Règlement des radiocommunications, n° 1.5), dont les micro-ondes
   (~300 MHz-300 GHz, soit 1 m-1 mm) sont la partie la plus courte. X et γ se
   recouvrent ; on place la limite vers 10⁻¹¹ m. Applications sourcées : voir
   APPLIS_EM. outils/balayage-ir-domaines.mjs vérifie que la longueur d'onde
   et la fréquence AFFICHÉES vérifient f × λ = c à l'arrondi près, que le
   domaine annoncé est celui de la bande sous le repère, et la mise en page. */
var C_LUM = 3.00e8;
var DOMAINES_EM = [                    // [log10 λ min, log10 λ max) en mètres
  {nom:"rayons γ", court:"γ", de:-12, a:-11, coul:"#7b4fa0"},
  {nom:"rayons X", court:"X", de:-11, a:-8, coul:"#5b6fb5"},
  {nom:"ultraviolet", court:"UV", de:-8, a:Math.log10(4e-7), coul:"#8a63c9"},
  {nom:"visible", court:"visible", de:Math.log10(4e-7), a:Math.log10(8e-7), coul:null},
  {nom:"infrarouge", court:"infrarouge", de:Math.log10(8e-7), a:-3, coul:"#b5523b"},
  {nom:"micro-ondes", court:"micro-ondes", de:-3, a:0, coul:"#c98a2e"},
  {nom:"ondes radio", court:"ondes radio", de:0, a:3, coul:"#6f9a3c"}
];
var APPLIS_EM = [
  {nom:"radiographie", lam:6.63e-34*C_LUM/(120e3*1.6e-19),
   note:"Une radiographie du thorax se fait sous une tension d'environ $120$ kilovolts (IRSN) : chaque électron arrive sur la cible avec $120 000$ @u{eV}, et aucun photon X ne peut en emporter plus. Or, d'après $λ = @f{hc}{E}$ (section 3), plus un photon est énergétique, plus sa longueur d'onde est courte : les photons les plus énergétiques ont la plus petite, environ $10^{-11}$ @u{m}, dix fois plus petite qu'un atome (ici, la plus courte possible ; la plupart des photons du cliché en ont une deux ou trois fois plus grande). Ils traversent les tissus mous et sont arrêtés par les os : on voit l'ombre des os."},
  {nom:"lumière verte", lam:550e-9,
   note:"Le visible, de $400$ à $800$ @u{nm} environ : une fenêtre minuscule sur l'échelle, la seule que notre œil capte. Au milieu, le vert, vers $550$ @u{nm}."},
  {nom:"four à micro-ondes", f:2.45e9,
   note:"Un four à micro-ondes fonctionne à $2{,}45$ @u{GHz}, au centre d'une bande réservée aux usages industriels, scientifiques et médicaux (UIT, $2{,}4$ à $2{,}5$ @u{GHz}). Les molécules d'eau des aliments s'agitent et chauffent."},
  {nom:"wifi 5 GHz", f:5e9,
   note:"Le wifi utilise deux bandes : vers $2{,}4$ @u{GHz}, la même que le four (un four mal blindé peut gêner le wifi), et vers $5$ @u{GHz} (ANFR). Ce sont des micro-ondes, comme celles du four, mais un émetteur wifi est limité à $0{,}1$ @u{W} vers $2{,}4$ @u{GHz} et, selon la sous-bande, jusqu'à $1$ @u{W} vers $5$ @u{GHz} (ARCEP), quand un four en envoie plusieurs centaines dans les aliments."},
  {nom:"radio FM", f:100e6,
   note:"La radio FM émet entre $87{,}5$ et $108$ @u{MHz} (ANFR) : des longueurs d'onde de l'ordre de $3$ @u{m}. Ici, $100$ @u{MHz}."},
  {nom:"IRM", f:42.577e6*1.5,
   note:"L'IRM n'utilise **pas** de rayons X : un aimant de $1{,}5$ @u{T} (le modèle le plus courant) et des ondes radio de $63{,}9$ @u{MHz}, la fréquence à laquelle répondent les noyaux d'hydrogène dans ce champ ($42{,}58$ @u{MHz} par tesla, CODATA). L'imagerie médicale utilise les deux bouts de l'échelle."}
];
/* « 1,22 × 10⁻¹ » : mantisse à 3 chiffres significatifs, exposant en exposant */
var EXP_SUP = {"-":"⁻", "0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹"};
function sci3(x){
  var e = Math.floor(Math.log10(x)), m = +(x/Math.pow(10, e)).toFixed(2);
  if(m >= 10){ m = +(m/10).toFixed(2); e++; }
  return {m:m, e:e, txt:m.toFixed(2).replace(".", ",") + (e === 0 ? "" : " × 10" + String(e).split("").map(function(c){ return EXP_SUP[c]; }).join(""))};
}
function domaineDe(lg){ for(var i = 0; i < DOMAINES_EM.length; i++) if(lg >= DOMAINES_EM[i].de && lg < DOMAINES_EM[i].a) return DOMAINES_EM[i]; return lg < -12 ? DOMAINES_EM[0] : DOMAINES_EM[DOMAINES_EM.length - 1]; }
MODELES["domaines-em"] = function(){
  var lg = Math.log10(550e-9), ia = 1;
  var w = 440, h = 152, m = boiteManip(w, h), svg = m.svg, boite = m.boite;
  var choix = el("div"), lecture = el("div","figLecture"), curs = el("div","figCurseurs"), note = el("div","figNote");
  var bs = rangeeChoix(choix, "un exemple", APPLIS_EM.map(function(a){ return a.nom; }), function(k){ ia = k; var a = APPLIS_EM[k]; lg = Math.log10(a.lam || C_LUM/a.f); c.value = lg; dessine(); });
  var G = {x0:22, x1:w - 18, yb:66, hb:34};
  var X = function(l){ return G.x0 + (l + 12)/15*(G.x1 - G.x0); };
  function dessine(){
    marquer(bs, ia);
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var t = function(x, y, s, o){ return texteSvg(svg, x, y, s, o); };
    /* l'arc-en-ciel du visible : un dégradé de vraies couleurs, pas du thème */
    var defs = n("defs"), gr = n("linearGradient", {id:"arcEM", x1:0, x2:1, y1:0, y2:0});
    [["0","#7a00c8"],["0.2","#0046ff"],["0.4","#00c060"],["0.55","#e0e000"],["0.7","#ff8c00"],["1","#c00000"]].forEach(function(s){ gr.appendChild(n("stop", {offset:s[0], "stop-color":s[1]})); });
    defs.appendChild(gr); svg.appendChild(defs);
    /* les bandes des domaines, avec leur nom au-dessus */
    DOMAINES_EM.forEach(function(d, k){
      var r = n("rect", {x:X(d.de), y:G.yb, width:X(d.a) - X(d.de), height:G.hb, fill:d.coul || "url(#arcEM)", "fill-opacity":d.coul ? .55 : 1});
      r.setAttribute("data-domaine", d.nom); svg.appendChild(r);
      var xm = (X(d.de) + X(d.a))/2, lab;
      if(d.nom === "visible"){
        lab = t(xm, G.yb - 6, "visible", {taille:11.5, gras:true, fill:coul("ink")});
      } else lab = t(xm, G.yb + G.hb/2 + 4, d.court, {taille:d.court.length > 3 ? 10.5 : 12, gras:true, fill:coul("ink")});
      lab.setAttribute("data-nom-domaine", d.nom);
    });
    /* axe des longueurs d'onde, en dessous ; axe des fréquences, au-dessus */
    var ya = G.yb + G.hb;
    svg.appendChild(n("line", {x1:G.x0, y1:ya, x2:G.x1, y2:ya, stroke:coul("ink3"), "stroke-width":1.3}));
    for(var e = -12; e <= 3; e++){
      svg.appendChild(n("line", {x1:X(e), y1:ya, x2:X(e), y2:ya + (e % 3 ? 3 : 6), stroke:coul("ink3"), "stroke-width":1.1}));
      if(e % 3 === 0) t(X(e), ya + 24, "10" + String(e).split("").map(function(c){ return EXP_SUP[c]; }).join(""), {taille:10.5, fill:coul("ink2")});
    }
    t((G.x0 + G.x1)/2, ya + 42, "longueur d'onde λ (m) : chaque graduation multiplie λ par 10 →", {taille:10.5, fill:coul("ink2")});
    var yf = G.yb - 28;
    svg.appendChild(n("line", {x1:G.x0, y1:yf, x2:G.x1, y2:yf, stroke:coul("ink3"), "stroke-width":1.3}));
    [20, 17, 14, 11, 8].forEach(function(p){            // 10⁵ Hz tomberait à 3 km, hors de l'échelle
      var x = X(Math.log10(C_LUM/Math.pow(10, p)));
      svg.appendChild(n("line", {x1:x, y1:yf, x2:x, y2:yf - 5, stroke:coul("ink3"), "stroke-width":1.1}));
      t(x, yf - 9, "10" + String(p).split("").map(function(c){ return EXP_SUP[c]; }).join(""), {taille:10.5, fill:coul("ink2")});
    });
    t((G.x0 + G.x1)/2, yf - 22, "← fréquence f (Hz) : elle augmente vers la gauche", {taille:10.5, fill:coul("ink2")});
    /* le repère de la valeur choisie */
    var x = X(lg);
    /* le repère : un trait dans la bande et deux pointes, sur l'axe des f et sous
       celui des λ ; rien entre les deux, pour ne jamais masquer le nom « visible » */
    /* s'il passe sur le nom d'un domaine écrit dans la bande, le trait s'interrompt autour */
    var nomSous = DOMAINES_EM.filter(function(b){ return b.nom !== "visible" && Math.abs(x - (X(b.de) + X(b.a))/2) < (6.4*b.court.length + 4)/2 + 2; })[0];
    var yc = G.yb + G.hb/2 + 4;                                  // ligne de base des noms
    (nomSous ? [[G.yb, yc - 13], [yc + 5, ya]] : [[G.yb, ya]]).forEach(function(sg, k){
      var rep = n("line", {x1:x, y1:sg[0], x2:x, y2:sg[1], stroke:coul("ink"), "stroke-width":2.4});
      if(k === 0) rep.setAttribute("data-repere", "1");
      svg.appendChild(rep);
    });
    svg.appendChild(n("polygon", {points:(x - 5) + "," + (yf + 2) + " " + (x + 5) + "," + (yf + 2) + " " + x + "," + (yf + 10), fill:coul("ink")}));
    svg.appendChild(n("polygon", {points:(x - 5) + "," + (ya + 12) + " " + (x + 5) + "," + (ya + 12) + " " + x + "," + (ya + 3), fill:coul("ink")}));
    /* ce qu'on lit : λ et f, chacun arrondi à 3 chiffres depuis la valeur exacte ;
       pour un exemple donné par sa fréquence (four : 2,45 GHz), f exacte d'abord */
    var a = APPLIS_EM[ia], lgA = a ? Math.log10(a.lam || C_LUM/a.f) : null, surA = a && Math.abs(lgA - lg) < 1e-9;
    var lam = surA && a.f ? C_LUM/a.f : Math.pow(10, lg), fr_ = surA && a.f ? a.f : C_LUM/lam;
    var L = sci3(lam), F = sci3(fr_), d = domaineDe(lg);
    lecture.innerHTML = "λ = " + L.txt + " m · f = " + F.txt + " Hz · domaine : <b>" + d.nom + "</b>";
    note.innerHTML = T(surA ? a.note : "Fais glisser le repère : la longueur d'onde est multipliée par $10$ à chaque graduation, et la fréquence divisée par $10$. Les deux varient toujours en sens inverse, puisque $f = @f{c}{λ}$.");
    boite.setAttribute("data-etat", JSON.stringify({modele:"domaines-em", lg:lg, lam:lam, domaine:d.nom, appli:surA ? a.nom : null,
      affiche:{lam:[L.m, L.e], f:[F.m, F.e]}, x:x, bandes:DOMAINES_EM.map(function(b){ return {nom:b.nom, x0:X(b.de), x1:X(b.a)}; })}));
  }
  var c = curseur(curs, "longueur d'onde", -12, 3, 0.05, lg, function(v){ lg = v; ia = -1; dessine(); });
  boite.insertBefore(choix, svg); boite.appendChild(lecture); boite.appendChild(curs); boite.appendChild(note);
  dessine();
  return boite;
};

/* -- Structure des molécules (ch4, s8) : le schéma de Lewis, pas à pas ------
   Les 15 entités du programme (O2, H2, N2, H2O, CO2, NH3, CH4, HCl, H+, H3O+,
   Na+, NH4+, Cl-, OH-, O2-), plus BF3, exception à l'octet. Le schéma n'est
   PAS dessiné à la main : construireLewis() applique la méthode du cours
   (s2), étape par étape, à partir des seuls électrons de valence, de la
   charge et de l'atome central ; chaque étape publie ses comptes dans
   data-etat. outils/balayage-lewis.mjs les compare à une table de schémas
   attendus écrite indépendamment, et refait chaque calcul affiché. */
var VALENCE = {H:1, B:3, C:4, N:5, O:6, F:7, Na:1, Al:3, Cl:7};
var COUL_EL = {H:"bleu", B:"ink", C:"ink", N:"vert", O:"rouge", F:"vert", Na:"ink", Al:"ink", Cl:"vert"};
/* atomes : élément et position du schéma (le dessin n'a pas valeur de géométrie) ;
   le premier est l'atome central quand il y en a un */
var ENTITES_LEWIS = [
  {cle:"H2", nom:"H₂", atomes:[["H",-0.8,0],["H",0.8,0]], charge:0},
  {cle:"O2", nom:"O₂", atomes:[["O",-0.8,0],["O",0.8,0]], charge:0},
  {cle:"N2", nom:"N₂", atomes:[["N",-0.8,0],["N",0.8,0]], charge:0},
  {cle:"HCl", nom:"HCl", atomes:[["Cl",0.5,0],["H",-1.1,0]], charge:0},
  {cle:"H2O", nom:"H₂O", atomes:[["O",0,0.3],["H",-1.3,-0.6],["H",1.3,-0.6]], charge:0},
  {cle:"CO2", nom:"CO₂", atomes:[["C",0,0],["O",-1.6,0],["O",1.6,0]], charge:0},
  {cle:"NH3", nom:"NH₃", atomes:[["N",0,0.3],["H",-1.3,-0.5],["H",1.3,-0.5],["H",0,-1.3]], charge:0},
  {cle:"CH4", nom:"CH₄", atomes:[["C",0,0],["H",-1.4,0],["H",1.4,0],["H",0,1.25],["H",0,-1.25]], charge:0},
  {cle:"H+", nom:"H⁺", atomes:[["H",0,0]], charge:1},
  {cle:"Na+", nom:"Na⁺", atomes:[["Na",0,0]], charge:1},
  {cle:"Cl-", nom:"Cl⁻", atomes:[["Cl",0,0]], charge:-1},
  {cle:"O2-", nom:"O²⁻", atomes:[["O",0,0]], charge:-2},
  {cle:"OH-", nom:"OH⁻", atomes:[["O",-0.5,0],["H",1.0,0]], charge:-1},
  {cle:"H3O+", nom:"H₃O⁺", atomes:[["O",0,0.3],["H",-1.3,-0.5],["H",1.3,-0.5],["H",0,-1.3]], charge:1},
  {cle:"NH4+", nom:"NH₄⁺", atomes:[["N",0,0],["H",-1.4,0],["H",1.4,0],["H",0,1.25],["H",0,-1.25]], charge:1},
  {cle:"BF3", nom:"BF₃", atomes:[["B",0,0],["F",0,1.6],["F",-1.4,-0.8],["F",1.4,-0.8]], charge:0, horsListe:true}
];
var ETAPES_LEWIS = ["Compter les électrons", "L'atome central", "Les liaisons simples", "Les doublets non liants", "Compléter les octets", "Vérifier"];
function cibleLewis(el){ return el === "H" ? 2 : 8; }
/* applique la méthode du cours ; renvoie l'état après chaque étape */
function construireLewis(E){
  var at = E.atomes.map(function(a){ return {el:a[0], x:a[1], y:a[2], lp:0}; });
  var vals = at.map(function(a){ return VALENCE[a.el]; });
  var somme = vals.reduce(function(s, v){ return s + v; }, 0);
  var total = somme - E.charge, paires = total/2;
  var liaisons = [], etats = [];
  var autour = function(i){ return 2*liaisons.reduce(function(s, l){ return s + ((l.a === i || l.b === i) ? l.ordre : 0); }, 0) + 2*at[i].lp; };
  var copie = function(){ return {liaisons:liaisons.map(function(l){ return {a:l.a, b:l.b, ordre:l.ordre}; }), lp:at.map(function(a){ return a.lp; }), reste:reste}; };
  var reste = paires;
  etats.push(copie());                                   // 0 : compter
  etats.push(copie());                                   // 1 : atome central (rien de posé)
  for(var i = 1; i < at.length; i++){ liaisons.push({a:0, b:i, ordre:1}); reste--; }
  etats.push(copie());                                   // 2 : liaisons simples
  /* doublets non liants : d'abord les atomes extérieurs autres que H, jusqu'à l'octet, puis le central */
  for(var j = 1; j < at.length && reste > 0; j++){
    if(at[j].el === "H") continue;
    while(reste > 0 && autour(j) < 8){ at[j].lp++; reste--; }
  }
  while(reste > 0){ at[0].lp++; reste--; }
  etats.push(copie());                                   // 3 : doublets non liants
  /* compléter : tant que le central n'a pas son octet, un voisin met en commun un doublet de plus ;
     un atome à 3 électrons de valence (B, Al) n'en forme que 3 : il garde une lacune */
  var convertis = 0;
  if(at.length > 1 && at[0].el !== "H" && VALENCE[at[0].el] !== 3){
    var garde = 0;
    while(autour(0) < 8 && garde++ < 8){
      var v = -1, best = 0;
      liaisons.forEach(function(l){ if(at[l.b].lp > best){ best = at[l.b].lp; v = l.b; } });
      if(v < 0) break;
      at[v].lp--; liaisons.filter(function(l){ return l.b === v; })[0].ordre++; convertis++;
    }
  }
  var fin = copie(); fin.convertis = convertis;
  etats.push(fin);                                       // 4 : compléter
  etats.push(fin);                                       // 5 : vérifier
  var bilan = at.map(function(a, k){
    var e = autour(k), c = cibleLewis(a.el);
    var noble = a.el === "Na" && E.charge === 1;        // Na⁺ : la couche du dessous, pleine, devient externe
    return {el:a.el, electrons:e, cible:c, lacunes:noble ? 0 : Math.max(0, (c - e)/2), noble:noble,
      liaisons:liaisons.reduce(function(s, l){ return s + ((l.a === k || l.b === k) ? l.ordre : 0); }, 0), lp:a.lp};
  });
  return {atomes:at, vals:vals, somme:somme, total:total, paires:paires, etats:etats, bilan:bilan, convertis:convertis};
}
var EXP_CHG = {"1":"+", "-1":"−", "-2":"2−", "2":"2+"};       // en caractères normaux : un exposant Unicode est illisible à cette taille
MODELES["lewis-pas-a-pas"] = function(){
  var ie = 4, et = 0;                                    // H2O, étape « compter »
  var w = 400, h = 250, m = boiteManip(w, h), svg = m.svg, boite = m.boite;
  var choixM = el("div"), choixI = el("div"), nav = el("div","row"), lecture = el("div","figLecture"), note = el("div","figNote");
  var molecules = ENTITES_LEWIS.filter(function(e){ return !e.charge; }), ions = ENTITES_LEWIS.filter(function(e){ return e.charge; });
  var bM = rangeeChoix(choixM, "une molécule", molecules.map(function(e){ return e.nom + (e.horsListe ? " (exception)" : ""); }), function(k){ ie = ENTITES_LEWIS.indexOf(molecules[k]); et = 0; dessine(); });
  var bI = rangeeChoix(choixI, "un ion", ions.map(function(e){ return e.nom; }), function(k){ ie = ENTITES_LEWIS.indexOf(ions[k]); et = 0; dessine(); });
  nav.style.cssText = "justify-content:center;align-items:center;gap:8px;flex-wrap:wrap";
  var bP = el("button","btn gho sm","← étape précédente"); bP.type = "button"; bP.onclick = function(){ if(et > 0){ et--; dessine(); } };
  var lab = el("span","small",""); lab.style.color = "var(--ink2)";
  var bS = el("button","btn pri sm","étape suivante →"); bS.type = "button"; bS.onclick = function(){ if(et < ETAPES_LEWIS.length - 1){ et++; dessine(); } };
  nav.appendChild(bP); nav.appendChild(lab); nav.appendChild(bS);
  var fr2 = function(x){ return String(x).replace(".", ","); };
  function dessine(){
    var E = ENTITES_LEWIS[ie], L = construireLewis(E), S = L.etats[et], at = L.atomes, fin = et === 5;
    marquer(bM, molecules.indexOf(E)); marquer(bI, ions.indexOf(E));
    lab.textContent = "étape " + (et + 1) + "/6 : " + ETAPES_LEWIS[et];
    bP.disabled = et === 0; bS.disabled = et === ETAPES_LEWIS.length - 1;
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var R = repere([-3, -2.2, 3, 2.2], w, h, 14);
    var trace = function(o){ dessiner(svg, R, o); };
    /* liaisons, avec leur ordre à cette étape */
    S.liaisons.forEach(function(l){
      var g = svg.childNodes.length;
      trace({t:"liaison", de:[at[l.a].x, at[l.a].y], a:[at[l.b].x, at[l.b].y], n:l.ordre, marge:16});
      if(svg.childNodes[g]) svg.childNodes[g].setAttribute("data-liaison", l.a + "-" + l.b + ":" + l.ordre);
    });
    /* atomes ; l'atome central est entouré à l'étape 2 */
    at.forEach(function(a, k){
      if(et === 1 && k === 0 && at.length > 1) svg.appendChild(n("circle", {cx:R.X(a.x), cy:R.Y(a.y), r:21, fill:"none", stroke:coul("rouge"), "stroke-width":2.5, "stroke-dasharray":"4 3"}));
      var g0 = svg.childNodes.length;
      trace({t:"atome", x:a.x, y:a.y, nom:a.el, couleur:COUL_EL[a.el]});
      svg.childNodes[svg.childNodes.length - 1].setAttribute("data-atome", k);
    });
    /* doublets non liants et lacunes : dans les directions les plus éloignées des liaisons */
    var dirs = at.map(function(a, k){
      return S.liaisons.filter(function(l){ return l.a === k || l.b === k; }).map(function(l){
        var o = at[l.a === k ? l.b : l.a]; return Math.atan2(o.y - a.y, o.x - a.x)*180/Math.PI; });
    });
    var ecart = function(d, liste){ return liste.reduce(function(mn, x){ var e = Math.abs(((d - x) % 360 + 540) % 360 - 180); return Math.min(mn, e); }, 360); };
    var places = function(k, nb){
      var pris = dirs[k].slice(), out = [];
      for(var q = 0; q < nb; q++){
        var best = null;
        for(var d = 0; d < 360; d += 15){ var e = ecart(d, pris); if(best === null || e > best[1] + 1e-9 || (Math.abs(e - best[1]) < 1e-9 && Math.abs(d - 90) < Math.abs(best[0] - 90))) best = [d, e]; }
        pris.push(best[0]); out.push(best[0]);
      }
      return out;
    };
    at.forEach(function(a, k){
      var lacunes = fin ? L.bilan[k].lacunes : 0;
      var ds = places(k, S.lp[k] + lacunes);
      ds.forEach(function(d, q){
        if(q < S.lp[k]){
          var g = svg.childNodes.length;
          trace({t:"doublet", x:a.x, y:a.y, dir:d, d:22});
          svg.childNodes[g].setAttribute("data-doublet", k);
        } else {
          /* la lacune : une case vide, place d'un doublet absent */
          var r0 = d*Math.PI/180, cx = R.X(a.x) + Math.cos(r0)*24, cy = R.Y(a.y) - Math.sin(r0)*24;
          var rc = n("rect", {x:cx - 8, y:cy - 4.5, width:16, height:9, fill:"none", stroke:coul("rouge"), "stroke-width":1.6,
            transform:"rotate(" + (-d) + " " + cx + " " + cy + ")"});
          rc.setAttribute("data-lacune", k); svg.appendChild(rc);
        }
      });
    });
    /* un ion : schéma entre crochets, charge en haut à droite */
    if(E.charge && et >= 3){
      var xs = at.map(function(a){ return R.X(a.x); }), ys = at.map(function(a){ return R.Y(a.y); });
      /* crochets à 34 px des atomes, mais toujours dans le cadre, charge comprise */
      var x1 = Math.max(6, Math.min.apply(null, xs) - 34), x2 = Math.min(w - 22, Math.max.apply(null, xs) + 34),
          y1 = Math.max(18, Math.min.apply(null, ys) - 34), y2 = Math.min(h - 6, Math.max.apply(null, ys) + 34);
      [[x1, 1], [x2, -1]].forEach(function(c){
        svg.appendChild(n("path", {d:"M" + (c[0] + 7*c[1]) + " " + y1 + " H" + c[0] + " V" + y2 + " H" + (c[0] + 7*c[1]), fill:"none", stroke:coul("ink2"), "stroke-width":1.8}));
      });
      var tc = texteSvg(svg, x2 + 4, y1 + 4, EXP_CHG[String(E.charge)], {ancre:"start", taille:18, gras:true, fill:coul("ink")});
      tc.setAttribute("data-charge", E.charge);
    }
    /* ce qu'on lit à cette étape : chaque calcul est écrit avec ses nombres */
    var noms = at.map(function(a){ return a.el; });
    var t, nt;
    if(et === 0){
      var chaine = L.vals.join(" + ") + (L.vals.length > 1 ? " = " + L.somme : "");
      t = "électrons de valence (" + noms.join(", ") + ") : " + chaine;
      if(E.charge > 0) t += " ; ion chargé +" + E.charge + " : il a PERDU " + E.charge + " électron" + (E.charge > 1 ? "s" : "") + ", on retire : " + L.somme + " − " + E.charge + " = " + L.total;
      else if(E.charge < 0) t += " ; ion chargé −" + (-E.charge) + " : il a GAGNÉ " + (-E.charge) + " électron" + (E.charge < -1 ? "s" : "") + ", on ajoute : " + L.somme + " + " + (-E.charge) + " = " + L.total;
      t += " électrons, soit " + L.total + " ÷ 2 = " + fr2(L.paires) + " doublet" + (L.paires > 1 ? "s" : "") + " à placer";
      nt = E.charge ? "**Le piège des ions.** La charge compte des électrons : un ion **négatif** en a gagné, on les **ajoute** ; un ion **positif** en a perdu, on les **retire**. Le signe « − » veut dire « des électrons en plus »." : "On additionne les électrons de valence de tous les atomes (la colonne du tableau périodique), puis on divise par $2$ : les électrons vont toujours par paires.";
    } else if(et === 1){
      t = at.length === 1 ? "un seul atome : pas d'atome central, pas de liaison" : "atome central : " + noms[0] + (at.length === 2 ? " (deux atomes : l'un ou l'autre)" : " (celui qui forme le plus de liaisons ; jamais H)");
      nt = at.length === 1 ? "Un ion monoatomique n'a qu'un atome : tous ses doublets sont posés sur lui." : "L'atome central est celui qui forme le plus de liaisons. L'hydrogène, qui n'en forme qu'une, est toujours à l'extérieur.";
    } else if(et === 2){
      var nl = S.liaisons.length;
      t = nl ? nl + " liaison" + (nl > 1 ? "s" : "") + " simple" + (nl > 1 ? "s" : "") + " : " + nl + " doublet" + (nl > 1 ? "s" : "") + " ; il en reste " + fr2(L.paires) + " − " + nl + " = " + fr2(S.reste) : "pas de liaison ; il reste " + fr2(S.reste) + " doublet" + (S.reste > 1 ? "s" : "");
      nt = "Chaque trait est un doublet liant, deux électrons mis en commun.";
    } else if(et === 3){
      var poses = S.lp.reduce(function(s, x){ return s + x; }, 0);
      t = poses + " doublet" + (poses > 1 ? "s" : "") + " non liant" + (poses > 1 ? "s" : "") + " posé" + (poses > 1 ? "s" : "") + " ; il reste " + fr2(S.reste);
      nt = "Les doublets restants vont d'abord sur les atomes extérieurs (sauf H), jusqu'à leur octet, puis sur l'atome central.";
    } else if(et === 4){
      t = L.convertis ? noms[0] + " n'avait pas son octet : " + L.convertis + " doublet" + (L.convertis > 1 ? "s" : "") + " non liant" + (L.convertis > 1 ? "s" : "") + " d'un voisin deviennent liants (liaison " + (S.liaisons.some(function(l){ return l.ordre === 3; }) ? "triple" : "double") + ")" : (VALENCE[noms[0]] === 3 && at.length > 1 ? noms[0] + " n'a que 3 électrons de valence : il forme 3 liaisons et n'en forme pas plus" : "rien à compléter");
      nt = L.convertis ? "Un voisin met en commun un doublet de plus : la liaison devient double, puis triple si besoin." : "Chaque atome a déjà son compte, ou ne peut pas faire mieux.";
    } else {
      t = L.bilan.map(function(b, k){
        var calc = "2 × " + b.liaisons + " + 2 × " + b.lp + " = " + b.electrons;
        return b.el + "(" + (k + 1) + ") : " + calc + (b.noble ? " (sa couche du dessous, pleine, devient externe ✓)" : b.lacunes ? " → " + b.lacunes + " lacune" : " ✓");
      }).join(" · ");
      nt = NOTES_LEWIS[E.cle] || "Chaque atome a son octet (2 électrons pour H) : le schéma est complet.";
    }
    lecture.textContent = E.nom + " — " + t + ".";
    note.innerHTML = T(nt);
    boite.setAttribute("data-etat", JSON.stringify({modele:"lewis-pas-a-pas", cle:E.cle, etape:et, total:L.total, paires:L.paires, charge:E.charge,
      liaisons:S.liaisons, lp:S.lp, reste:S.reste, bilan:fin ? L.bilan : null}));
  }
  boite.insertBefore(choixI, svg); boite.insertBefore(choixM, choixI); boite.insertBefore(nav, svg);
  boite.appendChild(lecture); boite.appendChild(note);
  dessine();
  return boite;
};
var NOTES_LEWIS = {
  "H+": "**Une lacune.** $@c{H^+}$ n'a plus aucun électron : sa couche (2 places) est vide. On dessine cette place libre par une **case vide**, la **lacune électronique**. Ce n'est pas une erreur de schéma : c'est ce qui rend $@c{H^+}$ si avide d'un doublet. Il s'accroche au doublet non liant d'une molécule d'eau pour former $@c{H_3O^+}$.",
  "Na+": "**Pas de lacune pour $@c{Na^+}$.** Le sodium a perdu son unique électron externe ; la couche du dessous, pleine (8 électrons), devient sa couche externe : c'est la configuration du néon, un gaz noble. On écrit simplement $@c{Na^+}$, sans doublet.",
  "Cl-": "$@c{Cl^-}$ a gagné un électron : $7 + 1 = 8$, quatre doublets non liants, l'octet de l'argon. Le schéma se met entre crochets, la charge en haut à droite.",
  "O2-": "$@c{O^{2-}}$ a gagné deux électrons : $6 + 2 = 8$, quatre doublets non liants, l'octet du néon.",
  "OH-": "L'ion hydroxyde : l'oxygène porte la liaison avec H et **trois** doublets non liants. La charge appartient à l'ion entier : on l'écrit à l'extérieur des crochets.",
  "H3O+": "L'ion oxonium : c'est une molécule d'eau qui a accueilli un $@c{H^+}$ sur l'un de ses deux doublets non liants. Il n'en reste qu'un sur l'oxygène.",
  "NH4+": "L'ion ammonium : le doublet non liant de $@c{NH_3}$ a accueilli un $@c{H^+}$ et est devenu une quatrième liaison. Plus aucun doublet non liant sur l'azote.",
  "N2": "**La triple liaison.** Chaque azote met en commun trois électrons : six électrons partagés, plus un doublet non liant chacun. $2 × 3 + 2 × 1 = 8$ : l'octet est atteint des deux côtés.",
  "O2": "**Une double liaison** : chaque oxygène met en commun deux électrons et garde deux doublets non liants.",
  "BF3": "**Une exception légitime à l'octet.** Le bore n'a que 3 électrons de valence : il forme 3 liaisons et s'arrête à 6 électrons. Il lui reste une **lacune**. Ce n'est pas une erreur : $@c{BF_3}$ existe, et sa lacune le rend avide d'un doublet. L'aluminium ($@c{AlCl_3}$) fait de même. Hors de la liste du programme : pour comprendre que l'octet n'est pas une loi absolue."
};

window.FIGURE = figure;
window.FIGURE_MANIP = function(b){
  /* MODELES_EXT : modèles déclarés par un autre fichier (la figure 3D, 02-molecule-3d.js) */
  var m = MODELES[b.nom] || (window.MODELES_EXT && window.MODELES_EXT[b.nom]);
  return m ? m(b) : el("div","figNote","(figure indisponible)");
};
/* courbes nommées, utilisables dans les figures via {t:"courbe", f:"..."} */
window.COURBES = {
  "sinus":       function(x){ return 1.4*Math.sin(x); },
  "decroissance":function(x){ return 5*Math.exp(-0.5*x); },
  "carre":       function(x){ return x*x; },
  "proportion":  function(x){ return 0.8*x; }
};
})();
