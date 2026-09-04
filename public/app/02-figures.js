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
function fleche(svg, R, de, a, couleur, nom, anime){
  var x1=R.X(de[0]), y1=R.Y(de[1]), x2=R.X(a[0]), y2=R.Y(a[1]);
  var dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy) || 1;
  var ux=dx/L, uy=dy/L, t=9;
  var g = n("g", {stroke:coul(couleur), fill:coul(couleur), "stroke-width":2.4,
                  "stroke-linecap":"round"});
  g.appendChild(n("line",{x1:x1,y1:y1,x2:x2-ux*t*0.8,y2:y2-uy*t*0.8}));
  g.appendChild(n("polygon",{ points:
    (x2)+","+(y2)+" "+
    (x2-ux*t-uy*t*0.45)+","+(y2-uy*t+ux*t*0.45)+" "+
    (x2-ux*t+uy*t*0.45)+","+(y2-uy*t-ux*t*0.45), stroke:"none"}));
  if(anime) animer(g, anime);
  svg.appendChild(g);
  if(nom){
    var e = txt(x1+dx/2 - uy*14, y1+dy/2 + ux*14 + 4, nom, "middle");
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
         objet qui chute — sans que la figure ait à calculer les pixels. */
      var animeP = o.anime ? o.anime.slice() : [];
      if(o.chute){
        var p0x=R.X(o.x), p0y=R.Y(o.y);
        var p1x=R.X(o.x+(o.chute[0]||0)), p1y=R.Y(o.y+(o.chute[1]||0));
        animeP.push({motion:"M"+p0x+" "+p0y+" L"+p1x+" "+p1y, dur:o.chuteDur||"1.2s"});
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
    case "vec": fleche(svg,R,o.de,o.a,o.couleur||"bleu",o.nom,o.anime); break;
    case "cercle":
      svg.appendChild(n("circle",{cx:R.X(o.c[0]), cy:R.Y(o.c[1]), r:o.r*R.k,
        fill: o.remplir ? coul(o.couleur||"bleu") : "none",
        "fill-opacity": o.remplir ? (o.opacite==null ? .1 : o.opacite) : null,
        stroke:coul(o.couleur||"bleu"), "stroke-width":2.2,
        "stroke-dasharray": o.pointille ? "5 5" : null}));
      break;
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
  fil.appendChild(n("line",{x1:x1, y1:y1, x2:cx-ux*demi, y2:cy-uy*demi}));
  fil.appendChild(n("line",{x1:cx+ux*demi, y1:cy+uy*demi, x2:x2, y2:y2}));
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
  var w=440, h=250, f=2, d=5;                       // distance focale, position objet
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    /* Les deux axes portent la même grandeur (des distances), mais l'objet
       et l'image sont bien plus petits que les distances à la lentille :
       une échelle verticale propre rend la construction lisible. */
    var R = repere([-9, -2.4, 9, 2.4], w, h, 14, true);
    var ho = 1.4;                                    // hauteur de l'objet
    // axe optique
    dessiner(svg, R, {t:"seg", de:[-9,0], a:[9,0], couleur:"line2", epais:1.6});
    dessiner(svg, R, {t:"lentille", x:0, h:5.4});
    // foyers
    dessiner(svg, R, {t:"point", x:f, y:0, nom:"F′", couleur:"ink3"});
    dessiner(svg, R, {t:"point", x:-f, y:0, nom:"F", couleur:"ink3"});
    // objet à gauche de la lentille
    dessiner(svg, R, {t:"objet", x:-d, h:ho, nom:"AB", couleur:"vert"});

    // relation de conjugaison : 1/OA' − 1/OA = 1/f'  avec OA = −d
    var oa = -d, denom = f + oa;
    // l'objet exactement au foyer (d = f) annule le dénominateur : l'image
    // part à l'infini, on ne trace pas de rayons vers des coordonnées infinies.
    if(Math.abs(denom) < 0.03){
      dessiner(svg, R, {t:"rayon", de:[-d, ho], a:[0, ho], couleur:"ambre"});
      dessiner(svg, R, {t:"rayon", de:[-d, ho], a:[0, 0], couleur:"bleu"});
      lecture.innerHTML =
        "OA = " + fr(-d, 1) + " · objet AU foyer F : les rayons émergents ressortent " +
        "parallèles, l'image part à l'infini (γ non défini).";
    } else {
      var oap = (f*oa)/denom;                          // position de l'image
      var g = oap/oa, hi = ho*g;                        // grandissement
      // les trois rayons qui construisent l'image
      dessiner(svg, R, {t:"rayon", de:[-d, ho], a:[0, ho], couleur:"ambre"});
      dessiner(svg, R, {t:"rayon", de:[0, ho], a:[oap, hi], couleur:"ambre"});
      dessiner(svg, R, {t:"rayon", de:[-d, ho], a:[0, 0], couleur:"bleu"});
      dessiner(svg, R, {t:"rayon", de:[0, 0], a:[oap, hi], couleur:"bleu"});
      if(oap > 0) dessiner(svg, R, {t:"objet", x:oap, h:hi, nom:"A′B′", couleur:"rouge"});
      else dessiner(svg, R, {t:"objet", x:oap, h:hi, nom:"A′B′ (virtuelle)", couleur:"rouge"});

      lecture.innerHTML =
        "OA = " + fr(-d, 1) + " · OA′ = " + fr(oap) +
        " · γ = " + fr(g) +
        (Math.abs(g) > 1 ? " (agrandie)" : " (réduite)") +
        (g < 0 ? " · renversée" : " · droite") +
        (oap > 0 ? " · réelle" : " · virtuelle");
    }
  }

  curseur(curs, "objet", 0.6, 8, 0.1, d, function(v){ d = v; dessine(); });
  curseur(curs, "focale f′", 0.8, 4, 0.1, f, function(v){ f = v; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(el("div","figNote",
    "Rapproche l’objet du foyer F : l’image part à l’infini. Passe entre F et la lentille, elle devient virtuelle et droite — c’est la loupe."));
  return m.boite;
};

/* -- 2. Onde périodique : période, longueur d'onde, célérité -- */
MODELES["onde"] = function(){
  var w=440, h=260, lam=3, amp=1.2;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var v = 340;                                        // célérité, en m/s

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var R = repere([-0.4, -2, 10, 2], w, h, 18);
    dessiner(svg, R, {t:"axes", x0:0, y0:0, ax:"x (m)", ay:"élongation"});
    var pts=[], i;
    for(i=0;i<=300;i++){
      var x = 10*i/300;
      pts.push([x, amp*Math.sin(2*Math.PI*x/lam)]);
    }
    dessiner(svg, R, {t:"courbeXY", pts:pts, couleur:"bleu"});
    // la longueur d'onde, mesurée d'une crête à la suivante
    var c1 = lam/4, c2 = c1 + lam;
    dessiner(svg, R, {t:"seg", de:[c1, amp], a:[c1, -1.7], couleur:"line2", pointille:true});
    dessiner(svg, R, {t:"seg", de:[c2, amp], a:[c2, -1.7], couleur:"line2", pointille:true});
    dessiner(svg, R, {t:"vec", de:[c1, -1.45], a:[c2, -1.45], couleur:"rouge"});
    dessiner(svg, R, {t:"texte", x:(c1+c2)/2, y:-1.9, txt:"λ = "+fr(lam,1)+" m", couleur:"rouge"});
    lecture.innerHTML =
      "λ = " + fr(lam, 1) + " m · v = " + v + " m/s · T = λ/v = " +
      fr(lam/v*1000, 1) + " ms · f = v/λ = " + Math.round(v/lam) + " Hz";
  }
  curseur(curs, "λ (m)", 1, 6, 0.1, lam, function(x){ lam=x; dessine(); });
  curseur(curs, "amplitude", 0.4, 1.8, 0.1, amp, function(x){ amp=x; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(el("div","figNote",
    "L’amplitude change la hauteur, jamais la fréquence. Seule λ change le son entendu : c’est la hauteur de la note."));
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
    /* La portée et la hauteur changent beaucoup avec les curseurs. Une vue
       fixe rendrait la trajectoire minuscule dans un coin : on l'ajuste. */
    var portee = vx*tf, haut = vy*vy/(2*g);
    var R = repere([-0.6, -0.5, portee*1.25 + 0.6, haut*2.1 + 0.5], w, h, 18, true);
    dessiner(svg, R, {t:"axes", x0:0, y0:0, ax:"x (m)", ay:"y (m)"});
    for(i=0;i<=60;i++){
      var t = tf*i/60;
      pts.push([vx*t, vy*t - 0.5*g*t*t]);
    }
    dessiner(svg, R, {t:"courbeXY", pts:pts, couleur:"bleu"});
    // le vecteur vitesse en trois instants, tangent à la trajectoire
    [0.25, 0.5, 0.75].forEach(function(part){
      var t = tf*part, x = vx*t, y = vy*t - 0.5*g*t*t;
      var wy = vy - g*t, e = 0.28;
      dessiner(svg, R, {t:"point", x:x, y:y, couleur:"ink"});
      dessiner(svg, R, {t:"vec", de:[x,y], a:[x+vx*e, y+wy*e], couleur:"vert"});
      dessiner(svg, R, {t:"vec", de:[x+vx*e, y+wy*e], a:[x+vx*e, y+wy*e-g*e*0.35], couleur:"rouge"});
    });
    lecture.innerHTML =
      "v₀ = " + fr(v0, 1) + " m/s · angle = " + ang + "° · portée = " +
      fr(portee) + " m · hauteur = " + fr(haut) + " m · durée = " + fr(tf) + " s";
  }
  curseur(curs, "v₀ (m/s)", 3, 14, 0.5, v0, function(x){ v0=x; dessine(); });
  curseur(curs, "angle (°)", 15, 85, 1, ang, function(x){ ang=x; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(el("div","figNote",
    "En vert le vecteur vitesse, toujours tangent à la trajectoire. En rouge sa variation : elle pointe toujours vers le bas, comme le poids."));
  return m.boite;
};

/* -- 4. Tableau d'avancement : on pousse la réaction et on regarde -- */
MODELES["avancement"] = function(){
  var w=430, h=280, x=0, nAl=0.80, nCl=0.90;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var xmax = Math.min(nAl/2, nCl/3);
    if(x > xmax) x = xmax;                    // on ne dépasse jamais l'épuisement
    var qAl = nAl - 2*x, qCl = nCl - 3*x, qPr = 2*x;
    var haut = Math.max(nAl, nCl, 2*xmax, 0.2) * 1.25;
    var R = repere([0, 0, 3, haut], w, h, 26, true);

    // trois barres : les deux réactifs qui descendent, le produit qui monte
    [[0.45, qAl, "bleu", "Al"], [1.5, qCl, "rouge", "Cl₂"], [2.55, qPr, "vert", "AlCl₃"]]
      .forEach(function(b){
        dessiner(svg, R, {t:"rect", x:b[0]-0.32, y:0, w:0.64, h:Math.max(b[1], 0.0001),
                          couleur:b[2], opacite:.55, rond:2});
        dessiner(svg, R, {t:"texte", x:b[0], y:-haut*0.055, txt:b[3], couleur:"ink2", taille:12.5});
        dessiner(svg, R, {t:"texte", x:b[0], y:b[1]+haut*0.045,
                          txt:b[1].toFixed(2).replace(".", ","), couleur:b[2], taille:12.5});
      });
    dessiner(svg, R, {t:"seg", de:[0,0], a:[3,0], couleur:"ink3", epais:1.8});

    lecture.innerHTML =
      "x = " + fr(x) + " mol · Al : " + fr(nAl) + " − 2x = " + fr(qAl) +
      " · Cl₂ : " + fr(nCl) + " − 3x = " + fr(qCl) + " · AlCl₃ : 2x = " + fr(qPr);
    note.innerHTML = (Math.abs(x - xmax) < 1e-9)
      ? "<b>La réaction est terminée.</b> " + (qCl < qAl
          ? "Le dichlore est tombé à zéro : c’est lui le réactif limitant. Il reste de l’aluminium."
          : "L’aluminium est tombé à zéro : c’est lui le réactif limitant. Il reste du dichlore.")
      : "Pousse le curseur : les deux réactifs descendent, chacun à la vitesse de son coefficient. Le premier qui touche zéro arrête tout.";
  }

  curseur(curs, "avancement x", 0, 0.40, 0.005, x, function(v){ x = v; dessine(); });
  curseur(curs, "Al au départ", 0.40, 1.40, 0.05, nAl, function(v){ nAl = v; dessine(); });
  curseur(curs, "Cl₂ au départ", 0.30, 1.50, 0.05, nCl, function(v){ nCl = v; dessine(); });
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

  curseur(curs, "volume versé", 0, 30, 0.5, vb, function(v){ vb = v; dessine(); });
  curseur(curs, "concentration inconnue", 0.02, 0.14, 0.005, CA, function(v){ CA = v; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 6. Loi d'Ohm : la lampe s'allume pour de vrai -- */
MODELES["ohm"] = function(){
  var w=380, h=250, U=12, R0=50;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var Rp = repere([0, 0, 8, 6], w, h, 22);
    var I = U/R0, P = U*I;

    dessiner(svg, Rp, {t:"dip", type:"pile", de:[1,1], a:[1,5], nom:"U"});
    dessiner(svg, Rp, {t:"dip", type:"resistor", de:[1,5], a:[7,5], nom:"R"});
    dessiner(svg, Rp, {t:"dip", type:"lampe", de:[7,5], a:[7,1], nom:"L"});
    dessiner(svg, Rp, {t:"dip", type:"fil", de:[7,1], a:[1,1]});

    // le halo de la lampe : son rayon suit la puissance dissipée
    var eclat = Math.min(1, P/8);
    if(eclat > 0.02){
      svg.insertBefore(n("circle", {
        cx: Rp.X(7), cy: Rp.Y(3), r: 14 + 26*eclat,
        fill: coul("ambre"), "fill-opacity": (0.10 + 0.35*eclat).toFixed(3)
      }), svg.firstChild);
    }
    dessiner(svg, Rp, {t:"texte", x:4, y:0.2,
      txt:"I = " + fr(I, 3) + " A", couleur:"bleu", taille:13});

    lecture.innerHTML = "U = " + fr(U, 1) + " V · R = " + R0 + " Ω · I = U/R = " +
      fr(I, 3) + " A · P = U×I = " + fr(P, 2) + " W";
    note.innerHTML = (I > 0.5)
      ? "Forte intensité : la lampe brille, mais la résistance chauffe d’autant — la puissance dissipée suit le <b>carré</b> de l’intensité."
      : "Augmente la tension, ou diminue la résistance : l’intensité monte et la lampe s’éclaire. C’est toute la loi d’Ohm, $U = R × I$.";
  }

  curseur(curs, "tension U (V)", 1.5, 24, 0.5, U, function(v){ U = v; dessine(); });
  curseur(curs, "résistance R (Ω)", 5, 100, 5, R0, function(v){ R0 = v; dessine(); });
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
    dessiner(svg, R, {t:"cercle", c:[1 + 7*pos, 0.6 + z + 0.22], r:0.22,
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
    if(frott > 0)
      dessiner(svg, R, {t:"seg", de:[11.44,0.6+Em*ech], a:[12.16,0.6+Em*ech],
                        couleur:"rouge", pointille:true, epais:2});

    var v = Math.sqrt(2*Ec/masse);
    lecture.innerHTML = "hauteur = " + fr(z, 2) + " m · Epp = " + fr(Epp, 0) +
      " J · Ec = " + fr(Ec, 0) + " J · Em = " + fr(Em, 0) + " J · v = " + fr(v, 1) + " m/s";
    note.innerHTML = (frott === 0)
      ? "Sans frottement, la barre verte ne bouge pas d’un pixel : l’énergie mécanique se conserve. Ce que la bille perd en hauteur, elle le gagne en vitesse."
      : "Avec frottement, la barre verte descend : une partie de l’énergie est partie en chaleur. Le trait rouge marque le niveau du départ.";
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
                      txt:"M"+(ipt-1)+"M"+(ipt+1)+" = "+fr(b-a)+" m", couleur:"rouge", taille:12});

    // le vecteur vitesse au point étudié
    var v = (b - a)/(2*t);
    dessiner(svg, R, {t:"vec", de:[pos[ipt],0.78], a:[pos[ipt] + v*t*0.9, 0.78],
                      couleur:"vert", nom:"v"});

    lecture.innerHTML = "v" + ipt + " = (M" + (ipt-1) + "M" + (ipt+1) + ") / 2τ = " +
      fr(b-a) + " / (2 × " + fr(t, 3) + ") = " + fr(v) + " m/s";
    note.innerHTML = (acc === 0)
      ? "Accélération nulle : les points sont <b>régulièrement espacés</b>, et le vecteur vitesse garde la même longueur d’un bout à l’autre."
      : "Les points s’écartent de plus en plus : le mobile accélère. Déplace le point étudié — la flèche verte s’allonge à chaque fois.";
  }

  curseur(curs, "point étudié", 1, 5, 1, ipt, function(x){ ipt = Math.round(x); dessine(); });
  curseur(curs, "accélération", 0, 8, 0.5, acc, function(x){ acc = x; dessine(); });
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
    var echV = 1.7/P;                 // les verticales gardent une taille fixe
    var echH = 3.0/120;               // les horizontales, elles, se comparent

    dessiner(svg, R, {t:"sol", de:0.5, a:9.5, y:2.0});
    dessiner(svg, R, {t:"rect", x:4.1, y:2.0, w:1.8, h:1.2, couleur:"bleu"});
    var cx = 5, cy = 2.6;

    // le poids et la réaction se compensent toujours ici
    dessiner(svg, R, {t:"vec", de:[cx,cy], a:[cx, cy - P*echV], couleur:"rouge", nom:"P"});
    dessiner(svg, R, {t:"vec", de:[cx,cy], a:[cx, cy + P*echV], couleur:"vert", nom:"R"});
    // la traction et le frottement, horizontaux
    if(F > 0)     dessiner(svg, R, {t:"vec", de:[cx,cy], a:[cx + F*echH, cy], couleur:"bleu", nom:"F"});
    if(frott > 0) dessiner(svg, R, {t:"vec", de:[cx,cy], a:[cx - frott*echH, cy], couleur:"ambre", nom:"f"});

    // la résultante horizontale, à l'écart pour rester lisible
    var somme = F - frott;
    dessiner(svg, R, {t:"seg", de:[0.8,6.6], a:[9.2,6.6], couleur:"line", epais:1});
    dessiner(svg, R, {t:"texte", x:1.6, y:7.2, txt:"somme des forces", couleur:"ink3", taille:11.5});
    if(Math.abs(somme) > 0.5){
      dessiner(svg, R, {t:"vec", de:[cx, 6.6], a:[cx + somme*echH, 6.6], couleur:"ink", nom:"ΣF"});
    } else {
      dessiner(svg, R, {t:"point", x:cx, y:6.6, couleur:"ink"});
      dessiner(svg, R, {t:"texte", x:cx + 1.1, y:6.6, txt:"ΣF = 0", couleur:"ink2", taille:13});
    }

    lecture.innerHTML = "F = " + fr(F, 0) + " N · f = " + fr(frott, 0) + " N · P = R = " +
      fr(P, 0) + " N · ΣF = " + fr(somme, 0) + " N";
    note.innerHTML = (Math.abs(somme) < 0.5)
      ? "<b>Les forces se compensent.</b> Le vecteur vitesse ne change pas : la caisse reste immobile, ou glisse en ligne droite à vitesse constante. C’est le principe d’inertie."
      : (somme > 0
         ? "<b>La traction l’emporte.</b> La somme des forces pointe vers l’avant, donc Δv aussi : la caisse accélère."
         : "<b>Le frottement l’emporte.</b> La somme pointe vers l’arrière : si la caisse avançait, elle ralentit.");
  }

  curseur(curs, "traction F (N)", 0, 120, 5, F, function(x){ F = x; dessine(); });
  curseur(curs, "frottement f (N)", 0, 120, 5, frott, function(x){ frott = x; dessine(); });
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
    if(l < 420) att = 0.3 + 0.7*(l-380)/(420-380);
    else if(l > 700) att = 0.3 + 0.7*(780-l)/(780-700);
    var f = function(c){ return Math.round(255*Math.pow(Math.max(0,c)*att, 0.8)); };
    return "rgb(" + f(r) + "," + f(v) + "," + f(b) + ")";
  }

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var R = repere([380, 0, 780, 10], w, h, 22, true);

    // la bande spectrale, tranche par tranche
    for(var l = 380; l < 780; l += 4){
      svg.appendChild(n("rect", {
        x: R.X(l), y: R.Y(9), width: Math.ceil(R.X(l+4) - R.X(l)) + 1,
        height: R.Y(4) - R.Y(9), fill: couleurDe(l), stroke:"none" }));
    }
    dessiner(svg, R, {t:"seg", de:[lam,9.6], a:[lam,3.4], couleur:"ink", epais:2.4});
    dessiner(svg, R, {t:"texte", x:lam, y:10.2, txt:Math.round(lam)+" nm", couleur:"ink", taille:12.5});
    [400,500,600,700].forEach(function(g){
      dessiner(svg, R, {t:"texte", x:g, y:2.2, txt:g, couleur:"ink3", taille:11});
    });
    dessiner(svg, R, {t:"texte", x:580, y:0.6, txt:"longueur d'onde (nm)", couleur:"ink3", taille:11.5});

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

  curseur(curs, "λ (nm)", 380, 780, 5, lam, function(x){ lam = x; dessine(); });
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
    var L = 1.15;                              // longueur dessinée du vecteur vitesse

    // les deux positions et leurs vecteurs vitesse, tangents
    dessiner(svg, R, {t:"point", x:p1[0], y:p1[1], couleur:"ink"});
    dessiner(svg, R, {t:"point", x:p2[0], y:p2[1], couleur:"ink3"});
    dessiner(svg, R, {t:"vec", de:p1, a:[p1[0]+u1[0]*L, p1[1]+u1[1]*L], couleur:"vert", nom:"v₁"});
    dessiner(svg, R, {t:"vec", de:p2, a:[p2[0]+u2[0]*L, p2[1]+u2[1]*L], couleur:"bleu", nom:"v₂"});

    // les deux mêmes vecteurs reportés d'un même point, et leur différence
    var o = [2.0, 2.0], Lr = 0.95;   // le report, assez haut pour ne pas mordre sa légende
    dessiner(svg, R, {t:"texte", x:2.0, y:0.3, txt:"les deux vitesses, reportées d’un même point", couleur:"ink3", taille:11});
    dessiner(svg, R, {t:"vec", de:o, a:[o[0]+u1[0]*Lr, o[1]+u1[1]*Lr], couleur:"vert"});
    dessiner(svg, R, {t:"vec", de:o, a:[o[0]+u2[0]*Lr, o[1]+u2[1]*Lr], couleur:"bleu"});
    dessiner(svg, R, {t:"vec", de:[o[0]+u1[0]*Lr, o[1]+u1[1]*Lr],
                      a:[o[0]+u2[0]*Lr, o[1]+u2[1]*Lr], couleur:"rouge", nom:"Δv"});

    // la même variation, reportée au point M₁ : elle pointe vers le centre
    var dx = (u2[0]-u1[0])*L, dy = (u2[1]-u1[1])*L;
    var n = Math.hypot(dx, dy) || 1;
    dessiner(svg, R, {t:"vec", de:p1, a:[p1[0]+dx/n*0.95, p1[1]+dy/n*0.95],
                      couleur:"rouge"});

    var dv = 2*v*Math.sin(ecart*Math.PI/360);
    lecture.innerHTML =
      "‖v₁‖ = ‖v₂‖ = " + fr(v,1) + " m/s — la valeur ne change pas · " +
      "angle parcouru : " + Math.round(ecart) + "° · ‖Δv‖ = " + fr(dv,2) + " m/s";
    note.innerHTML = (ecart < 15)
      ? "Sur un petit angle, Δv devient presque perpendiculaire à la vitesse, et pointe droit vers le <b>centre</b>. C’est la direction de la somme des forces."
      : "Les deux vecteurs verts et bleus ont exactement la même longueur : la valeur de la vitesse ne change pas. Ce qui change, c’est la <b>direction</b> — et cela suffit à faire un Δv non nul.";
  }

  curseur(curs, "position (°)", 0, 360, 5, ang, function(x){ ang = x; dessine(); });
  curseur(curs, "angle parcouru", 5, 90, 5, ecart, function(x){ ecart = x; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 12. Projectile : deux mouvements qui s'ignorent l'un l'autre -- */
MODELES["projectile"] = function(){
  var w=450, h=270, v0=15, alpha=45, G=9.81;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var a = alpha*Math.PI/180;
    var vx = v0*Math.cos(a), vy = v0*Math.sin(a);
    var T  = 2*vy/G;                              // durée du vol, retour au sol
    var P  = vx*T;                                // portée
    var H  = vy*vy/(2*G);                         // flèche, hauteur maximale

    /* Échelles indépendantes : la trajectoire remplit la boîte à tous les
       angles. Une parabole étirée reste une parabole, et les deux choses que
       la figure doit montrer — l'espacement au sol, l'étirement en hauteur —
       ne dépendent pas des échelles. */
    /* La fenêtre est calée sur ce que cette vitesse permet au mieux : la portée
       maximale (à 45°) et la flèche maximale (à 90°). Elle ne dépend donc pas de
       l'angle — et c'est ce qui rend le changement d'angle visible. */
    var xr = v0*v0/G, hr = v0*v0/(2*G);
    var R = repere([-0.20*xr, -0.18*hr, xr*1.06, hr*1.52], w, h, 20, true);

    dessiner(svg, R, {t:"sol", de:-0.20*xr, a:xr*1.06, y:0, couleur:"ink3"});

    // la trajectoire, tracée en continu
    var pts = [], i, t;
    for(i = 0; i <= 60; i++){
      t = T*i/60;
      pts.push([vx*t, vy*t - 0.5*G*t*t]);
    }
    dessiner(svg, R, {t:"courbeXY", pts:pts, couleur:"bleu", epais:2.4});

    // les positions à intervalles de temps égaux, comme sur une chronophotographie
    var N = 8, xs = -0.11*xr;
    for(i = 0; i <= N; i++){
      t = T*i/N;
      var x = vx*t, y = vy*t - 0.5*G*t*t;
      dessiner(svg, R, {t:"seg", de:[x,0], a:[x,y], couleur:"line2", pointille:true});
      dessiner(svg, R, {t:"point", x:x, y:y, couleur:"bleu"});
      dessiner(svg, R, {t:"point", x:x, y:0, couleur:"ink3"});
      // la même chose projetée sur une colonne : c'est une chute libre pure
      dessiner(svg, R, {t:"point", x:xs, y:y, couleur:"ambre"});
    }
    dessiner(svg, R, {t:"seg", de:[xs, 0], a:[xs, H*1.02], couleur:"line2"});
    // la légende suit le haut de la colonne, qui dépend de l'angle
    var yl = Math.max(H, hr*0.08);
    dessiner(svg, R, {t:"texte", x:xs, y:yl + 0.17*hr, txt:"chute", couleur:"ambre", taille:11});
    dessiner(svg, R, {t:"texte", x:xs, y:yl + 0.06*hr, txt:"libre", couleur:"ambre", taille:11});

    // la vitesse de départ, à l'échelle
    /* la flèche reste tangente à la courbe : on scale ses deux composantes du
       même facteur, choisi pour qu'elle tienne dans le cadre à tout angle. */
    var L = Math.min(0.26*xr/Math.max(Math.cos(a), 0.15),
                     0.60*Math.max(H, hr*0.06)/Math.max(Math.sin(a), 0.15));
    dessiner(svg, R, {t:"vec", de:[0,0], a:[vx/v0*L, vy/v0*L], couleur:"vert", nom:"v₀"});

    // la flèche, cotée
    dessiner(svg, R, {t:"seg", de:[P/2, 0], a:[P/2, H], couleur:"line2", pointille:true});

    lecture.innerHTML =
      "portée : " + fr(P,1) + " m · flèche : " + fr(H,1) + " m · durée du vol : " + fr(T,2) + " s";
    note.innerHTML = (alpha === 45)
      ? "45° donne la <b>portée maximale</b> : essaie de part et d’autre, elle diminue à chaque fois. Et remarque que 30° et 60° donnent exactement la même portée."
      : "Les points au sol sont <b>régulièrement espacés</b> : horizontalement, rien ne freine, le mouvement est uniforme. La colonne ambre, elle, s’étire de plus en plus : verticalement, c’est une <b>chute libre</b>, qui ne sait rien de l’horizontale.";
  }

  curseur(curs, "v₀ (m/s)", 5, 25, 1, v0, function(x){ v0 = x; dessine(); });
  curseur(curs, "angle (°)", 10, 80, 5, alpha, function(x){ alpha = x; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 13. Polarité : deux conditions, et il les faut toutes les deux -- */
MODELES["polarite"] = function(){
  var w=440, h=300, dchi=1.2, ang=105;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");

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

    /* Les charges partielles n'apparaissent que si la liaison est polarisée.
       On les fait grandir avec l'écart d'électronégativité. */
    if(dchi > 0.05){
      var t = 10 + 4*dchi;
      // au-dessus de l'atome central : la zone reste libre à tout angle
      dessiner(svg, R, {t:"texte", x:A[0]+0.34, y:A[1]+0.52, txt:"δ−", couleur:"rouge", taille:t});
      dessiner(svg, R, {t:"texte", x:X1[0]-0.55, y:X1[1]+0.28, txt:"δ+", couleur:"bleu", taille:t});
      dessiner(svg, R, {t:"texte", x:X2[0]+0.55, y:X2[1]+0.28, txt:"δ+", couleur:"bleu", taille:t});

      // un moment de liaison par liaison, du δ+ vers le δ−, donc vers l'atome central
      var q = 0.85*dchi;
      [[X1,d1],[X2,d2]].forEach(function(p){
        var u = [-Math.cos(p[1]), -Math.sin(p[1])];         // de X vers A
        var dep = [p[0][0] + u[0]*0.42, p[0][1] + u[1]*0.42];
        dessiner(svg, R, {t:"vec", de:dep, a:[dep[0]+u[0]*q, dep[1]+u[1]*q], couleur:"bleu"});
      });
    }

    // la résultante, portée par la bissectrice, vers le bas
    var res = 2*dchi*Math.cos(ang*Math.PI/360);
    var nul = res < 0.04;
    if(!nul){
      var bas = A[1] - 0.55 - res*0.75;
      dessiner(svg, R, {t:"vec", de:[A[0], A[1]-0.5], a:[A[0], bas], couleur:"rouge"});
      dessiner(svg, R, {t:"texte", x:A[0]+1.55, y:(A[1]-0.5+bas)/2, txt:"résultante",
                        couleur:"rouge", taille:12.5});
    } else {
      dessiner(svg, R, {t:"texte", x:A[0], y:A[1]-1.0, txt:"résultante nulle", couleur:"vert", taille:13});
    }

    lecture.innerHTML = "écart d’électronégativité : " + fr(dchi,1) +
      " · angle X–A–X : " + Math.round(ang) + "° · résultante : " + fr(res,2) +
      " — molécule <b>" + (nul ? "apolaire" : "polaire") + "</b>";

    if(dchi <= 0.05)
      note.innerHTML = "Écart nul : <b>aucune liaison n’est polarisée</b>. Les électrons sont partagés à parts égales, et la forme de la molécule n’y change rien — elle est apolaire quel que soit l’angle. C’est le cas du dioxygène O<sub>2</sub>.";
    else if(ang >= 178)
      note.innerHTML = "Les liaisons sont bel et bien polarisées, mais la molécule est <b>linéaire</b> : les deux moments sont exactement opposés et s’annulent. C’est le cas du dioxyde de carbone, apolaire malgré des liaisons très polarisées.";
    else
      note.innerHTML = "Liaisons polarisées <b>et</b> forme coudée : les deux moments ne se compensent plus, il en reste une résultante. Ramène l’angle à 105° et l’écart à 1,2 — tu obtiens la molécule d’eau.";
  }

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
  var w=440, h=300, type=3;
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");
  var NOMS = ["", "cubique simple", "cubique centrée", "cubique à faces centrées"];
  var PROPRE = [0, 1, 2, 4];
  var COMPAC = ["", "52", "68", "74"];

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var R = repere([0, 0, 10, 6.8], w, h, 18);
    var S = 3.5, ox = 2.5, oy = 1.2;
    /* projection oblique : l'axe z part vers le fond, en haut à droite */
    function P(x, y, z){ return [ox + S*x + S*0.42*z, oy + S*y + S*0.30*z]; }

    // les douze arêtes du cube
    var som = [];
    [0,1].forEach(function(x){ [0,1].forEach(function(y){ [0,1].forEach(function(z){ som.push([x,y,z]); }); }); });
    som.forEach(function(a){
      som.forEach(function(b){
        var d = Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]) + Math.abs(a[2]-b[2]);
        if(d === 1 && (a[0]+a[1]*2+a[2]*4) < (b[0]+b[1]*2+b[2]*4))
          dessiner(svg, R, {t:"seg", de:P(a[0],a[1],a[2]), a:P(b[0],b[1],b[2]),
                            couleur:"line2", epais:1.7});
      });
    });

    // les atomes de cette maille-ci
    var pos = som.map(function(s){ return {p:s, r:0.30, c:"bleu"}; });
    if(type === 2) pos.push({p:[0.5,0.5,0.5], r:0.34, c:"ambre"});
    if(type === 3) [[0.5,0.5,0],[0.5,0.5,1],[0.5,0,0.5],[0.5,1,0.5],[0,0.5,0.5],[1,0.5,0.5]]
      .forEach(function(f){ pos.push({p:f, r:0.34, c:"ambre"}); });

    // du fond vers l'avant, pour que les recouvrements soient corrects
    pos.sort(function(a,b){ return (a.p[2]+a.p[1]*0.01) - (b.p[2]+b.p[1]*0.01); });
    pos.forEach(function(a){
      var q = P(a.p[0], a.p[1], a.p[2]);
      dessiner(svg, R, {t:"cercle", c:q, r:a.r, couleur:a.c, remplir:true, opacite:.55});
    });

    lecture.innerHTML = "maille " + NOMS[type] + " · atomes en propre : <b>" + PROPRE[type] +
      "</b> · compacité : " + COMPAC[type] + " %";
    if(type === 1)
      note.innerHTML = "Huit atomes dessinés, mais chacun n’est là que pour <b>un huitième</b> : il est partagé entre les huit cubes qui se touchent en ce sommet. 8 × ⅛ = <b>1</b> atome en propre.";
    else if(type === 2)
      note.innerHTML = "Le neuvième atome, au centre, n’est partagé avec personne : il compte pour <b>un entier</b>. 8 × ⅛ + 1 = <b>2</b> atomes en propre. C’est la structure du fer à température ambiante.";
    else
      note.innerHTML = "Chaque atome de face est au milieu de deux cubes : il compte pour <b>une moitié</b>. 8 × ⅛ + 6 × ½ = 1 + 3 = <b>4</b> atomes en propre. C’est la structure du cuivre, de l’aluminium et de l’or — et la plus compacte des trois.";
  }

  curseur(curs, "type de maille", 1, 3, 1, type, function(x){ type = Math.round(x); dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 15. La droite d'étalonnage, et la lecture à l'envers -- */
MODELES["etalonnage"] = function(){
  var w=440, h=300, C=1.2, k=0.30;      // C en 10^-3 mol/L, k en L/mmol
  var m = boiteManip(w, h), svg = m.svg;
  var lecture = el("div","figLecture");
  var curs = el("div","figCurseurs");
  var note = el("div","figNote");

  function dessine(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var Cmax = 2.5, Amax = 1.0;
    var R = repere([-0.42, -0.20, Cmax*1.06, Amax*1.12], w, h, 24, true);
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

    // la cuve, dont la couleur suit la concentration
    var cx = Cmax*0.66, cy = Amax*0.72, cw = 0.36, ch = 0.30;
    dessiner(svg, R, {t:"rect", x:cx, y:cy, w:cw, h:ch, couleur:"rouge",
                      remplir:true, opacite:0.06 + 0.62*(C/Cmax)});
    dessiner(svg, R, {t:"texte", x:cx+cw/2, y:cy+ch+0.06, txt:"la cuve", couleur:"ink3", taille:11});

    lecture.innerHTML = "C = " + fr(C,2) + " mmol/L · k = " + fr(k,2) +
      " L/mmol · <b>A = k × C = " + fr(A,2) + "</b>";
    note.innerHTML = (k < 0.18)
      ? "Espèce peu colorée : pour une même concentration, l’absorbance est faible et la droite est presque plate. Un dosage y sera <b>imprécis</b> — on choisit toujours une longueur d’onde où l’espèce absorbe fort."
      : "Fais varier la concentration : le point rouge glisse <b>sur la droite</b>, jamais à côté. C’est ce qui permet la lecture à l’envers — on mesure A, on remonte à la droite, on redescend sur l’axe des concentrations.";
  }

  curseur(curs, "concentration C", 0, 2.5, 0.05, C, function(x){ C = x; dessine(); });
  curseur(curs, "espèce colorée (pente k)", 0.10, 0.40, 0.02, k, function(x){ k = x; dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 16. Semblable dissout semblable -- */
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
                    [5.3,3.1],[6.2,3.8],[3.9,2.5],[5.0,1.3],[6.4,1.4],[4.9,4.0]];
      grille.forEach(function(p, i2){
        dessiner(svg, R, {t:"cercle", c:p, r:0.17,
                          couleur: (sol===1 && i2%2) ? "rouge" : "vert",
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
                          couleur: (sol===1 && i%2) ? "rouge" : "vert",
                          remplir:true, opacite:.85});
      }
      dessiner(svg, R, {t:"texte", x:7.6, y:1.3, txt:"dépôt", couleur:"ink3", taille:11});
    }

    lecture.innerHTML = SOLUTES[sol] + " dans " + SOLVANTS[solv] + " → <b>" +
      (dissout ? "se dissout" : "ne se dissout pas") + "</b>";

    if(dissout && solv === 1 && sol === 1)
      note.innerHTML = "Les molécules d’eau, <b>polaires</b>, entourent chaque ion et le stabilisent autant que le faisait le cristal : celui-ci se disloque, ion par ion.";
    else if(dissout && solv === 1)
      note.innerHTML = "Le sucre porte de nombreux groupes <b>–OH</b> : il forme des <b>liaisons hydrogène</b> avec l’eau, aussi solides que celles que l’eau forme avec elle-même.";
    else if(dissout)
      note.innerHTML = "Deux espèces apolaires : seules des interactions de <b>van der Waals</b> sont en jeu, de part et d’autre. Rien ne s’oppose au mélange.";
    else if(solv === 1)
      note.innerHTML = "L’huile est <b>apolaire</b> : l’eau n’a rien à quoi s’accrocher. Les molécules d’eau préfèrent rester entre elles et repoussent l’huile, qui surnage.";
    else
      note.innerHTML = "Le cyclohexane est <b>apolaire</b> : il ne peut ni entourer un ion ni former de liaison hydrogène. Le soluté reste au fond, intact.";
  }

  curseur(curs, "soluté", 1, 3, 1, sol, function(x){ sol = Math.round(x); dessine(); });
  curseur(curs, "solvant", 1, 2, 1, solv, function(x){ solv = Math.round(x); dessine(); });
  dessine();
  m.boite.appendChild(lecture);
  m.boite.appendChild(curs);
  m.boite.appendChild(note);
  return m.boite;
};

/* -- 17. Pourquoi les alcools bouillent bien plus haut que les alcanes -- */
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
    dessiner(svg, R, {t:"cercle", c:[n,T], r:0.10, couleur:"ambre", remplir:true, opacite:.95});
    dessiner(svg, R, {t:"texte", x:n < 6 ? n+1.20 : n-1.20, y:T+28, txt:noms[n],
                      couleur:"ink", taille:12});

    lecture.innerHTML = noms[n] + " · " + n + " carbone" + (n>1?"s":"") +
      " · T<sub>ébullition</sub> = " + T + " °C — à 25 °C, c’est un <b>" +
      (T > 25 ? "liquide" : "gaz") + "</b>";
    note.innerHTML = (fam === 1)
      ? "Chaque carbone ajouté allonge la molécule : les forces de van der Waals augmentent, et la température d’ébullition monte régulièrement. En pointillé, la même chaîne portant un groupe <b>–OH</b> — <b>toujours bien plus haut</b>."
      : "Un seul groupe <b>–OH</b> suffit à faire gagner plus de <b>200 °C</b> au méthanol par rapport au méthane, à nombre de carbones égal. La cause est la <b>liaison hydrogène</b>, bien plus forte que van der Waals. C’est aussi pourquoi l’eau est liquide alors que le méthane est un gaz.";
  }

  curseur(curs, "nombre de carbones", 1, 8, 1, n, function(x){ n = Math.round(x); dessine(); });
  curseur(curs, "famille : alcane / alcool", 1, 2, 1, fam, function(x){ fam = Math.round(x); dessine(); });
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
