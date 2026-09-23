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
function fleche(svg, R, de, a, couleur, nom, anime, nomEn){
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
    case "vec": fleche(svg,R,o.de,o.a,o.couleur||"bleu",o.nom,o.anime,o.nomEn); break;
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
      var gr = n("g", {stroke:coul(o.couleur||"ambre"), fill:coul(o.couleur||"ambre"),
                       "stroke-width":o.epais||2, "stroke-linecap":"round",
                       "stroke-dasharray": o.pointille ? "6 5" : null});
      gr.appendChild(n("line",{x1:rx1, y1:ry1, x2:rx2, y2:ry2}));
      var mx = rx1 + rdx*(o.pointe==null?.55:o.pointe), my = ry1 + rdy*(o.pointe==null?.55:o.pointe);
      gr.appendChild(n("polygon",{ "stroke-dasharray":null, stroke:"none", points:
        mx+","+my+" "+(mx-rux*9-ruy*4.5)+","+(my-ruy*9+rux*4.5)+" "+
        (mx-rux*9+ruy*4.5)+","+(my-ruy*9-rux*4.5) }));
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
      : "Pousse le curseur : les deux réactifs descendent, chacun à la vitesse de son coefficient. Le premier qui touche zéro arrête tout.";
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
        dessiner(svg, R, {t:"vec", de:dep, a:[dep[0]+u[0]*q, dep[1]+u[1]*q], couleur:"bleu"});
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
      dessiner(svg, R, {t:"vec", de:[A[0], y0], a:[A[0], y1], couleur:"rouge"});
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

window.FIGURE = figure;
window.FIGURE_MANIP = function(b){
  var m = MODELES[b.nom];
  return m ? m() : el("div","figNote","(figure indisponible)");
};
/* courbes nommées, utilisables dans les figures via {t:"courbe", f:"..."} */
window.COURBES = {
  "sinus":       function(x){ return 1.4*Math.sin(x); },
  "decroissance":function(x){ return 5*Math.exp(-0.5*x); },
  "carre":       function(x){ return x*x; },
  "proportion":  function(x){ return 0.8*x; }
};
})();
