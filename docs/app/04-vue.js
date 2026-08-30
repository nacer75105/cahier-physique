(function(){
"use strict";
var A = window.APP, COURS = window.COURS || [];
var T=A.T, M=A.M, el=A.el, $=A.$, $$=A.$$, S=A.S;

/* fonctions traçables (pas d'eval : compatible avec la politique de sécurité) */
var PLOTS = {
  "carre":     function(x){ return x*x; },              // énergie cinétique
  "inverse2":  function(x){ return x>0 ? 1/(x*x) : NaN; }, // force en 1/d²
  "sinus":     function(x){ return Math.sin(x); },      // signal périodique
  "decroit":   function(x){ return Math.exp(-x); }      // décroissance
};

/* les chapitres s'affichent dans l'ordre du programme, pas dans l'ordre
   où les fichiers de contenu ont été chargés */
COURS.sort(function(a,b){ return a.n - b.n; });

var route = { page:"accueil", chap:null, onglet:"cours", fiche:null };
var recherche = "";

/* ===================================================================
   Totaux et progression
   =================================================================== */
function totalSections(c){ return c.sections.length; }
function nbLu(c){ return A.chapState(c.id).lu.length; }
function nbExoOk(c){
  var e=A.chapState(c.id).exos, n=0;
  c.exos.forEach(function(x){ if(e[x.id] && e[x.id].ok) n++; });
  return n;
}
function progChap(c){
  var tot = totalSections(c) + c.exos.length;
  return A.pct(nbLu(c) + nbExoOk(c), tot);
}
function progGlobale(){
  var f=0,t=0;
  COURS.forEach(function(c){ t += totalSections(c)+c.exos.length; f += nbLu(c)+nbExoOk(c); });
  return { fait:f, total:t, pct:A.pct(f,t) };
}
/* cartes de révision espacée, résolues en couples chapitre/exercice */
function carteVersExo(c){
  var ch = COURS.filter(function(x){ return x.id===c.chapId; })[0];
  if(!ch){
    var f = (S.perso||[]).filter(function(p){ return "perso:"+p.id===c.chapId; })[0];
    if(!f) return null;
    ch = { id:c.chapId, n:0, titre:f.titre, exos:f.fiche.exercices };
  }
  var ex = ch.exos.filter(function(x){ return x.id===c.exoId; })[0];
  return ex ? { chap:ch, exo:ex, carte:c } : null;
}
function dues(){ return A.srsDues().map(carteVersExo).filter(Boolean); }
function planifiees(){ return A.srsCartes().map(carteVersExo).filter(Boolean); }

/* ===================================================================
   Rendu des blocs de cours
   =================================================================== */
function bloc(b){
  switch(b.t){
    case "p":     return '<p>'+T(b.x)+'</p>';
    case "idee":  return callout("co-idee","L'idée en une phrase",b.x);
    case "piege": return callout("co-piege",b.titre||"Attention",b.x);
    case "astuce":return callout("co-astuce",b.titre||"Astuce",b.x);
    case "formule":
      return '<div class="formula'+(b.code?" fcode":"")+'"><div class="ft">'+T(b.titre||"À retenir")+'</div>'+
             '<div class="mblock">'+T(b.x)+'</div>'+
             (b.note?'<div class="fn2">'+T(b.note)+'</div>':'')+'</div>';
    case "liste":
      return '<ul class="ul">'+b.items.map(function(i){return '<li>'+T(i)+'</li>';}).join("")+'</ul>';
    case "tbl":
      return '<div class="tblWrap"><table class="tbl"><thead><tr>'+
        b.head.map(function(x){return '<th>'+T(x)+'</th>';}).join("")+'</tr></thead><tbody>'+
        b.rows.map(function(r){return '<tr>'+r.map(function(x){return '<td>'+T(x)+'</td>';}).join("")+'</tr>';}).join("")+
        '</tbody></table></div>';
    case "mb":    return '<div class="mblock">'+T(b.x)+'</div>';
    default:      return "";
  }
}
function callout(cls,titre,x){
  return '<div class="callout '+cls+'"><div class="ct">'+T(titre)+'</div><p>'+T(x)+'</p></div>';
}

/* exemple guidé : les étapes se dévoilent une par une */
function demoNode(b){
  var box = el("div","demo");
  box.innerHTML = '<div class="demoHead"><div class="dt">'+T(b.titre||"Exemple guidé")+'</div>'+
                  '<div style="margin-top:4px">'+T(b.enonce)+'</div></div>';
  var body = el("div","demoBody");
  var revealed = 0;
  b.etapes.forEach(function(e,i){
    var st = el("div","step hidden");
    st.innerHTML = '<div class="sn">'+(i+1)+'</div><div><div class="sq">'+T(e.q)+'</div>'+
                   '<div class="sr">'+T(e.r)+'</div></div>';
    body.appendChild(st);
  });
  var act = el("div","row");
  var bNext = el("button","btn pri","Montrer l'étape 1");
  var bAll  = el("button","btn gho","Tout afficher");
  act.appendChild(bNext); act.appendChild(bAll);
  body.appendChild(act);
  function show(n){
    var steps = $$(".step", body);
    for(var i=0;i<n;i++){ steps[i].classList.remove("hidden"); steps[i].classList.add("on"); }
    revealed = n;
    if(revealed >= b.etapes.length){ bNext.remove(); bAll.remove(); }
    else bNext.textContent = "Montrer l'étape "+(revealed+1);
  }
  bNext.onclick=function(){ show(revealed+1); };
  bAll.onclick =function(){ show(b.etapes.length); };
  box.appendChild(body);
  return box;
}

/* mini-question intégrée au cours */
function checkNode(b){
  var box = el("div","card pad");
  box.innerHTML = '<div class="row" style="margin-bottom:8px"><span class="tag b">Vérification rapide</span></div>'+
                  '<div class="enonce">'+T(b.q)+'</div>';
  var ch = el("div","choices");
  b.choix.forEach(function(c,i){
    var btn = el("button","choice");
    btn.innerHTML = '<span class="k">'+"ABCD".charAt(i)+'</span><span>'+T(c)+'</span>';
    btn.onclick = function(){
      $$(".choice",ch).forEach(function(x){ x.disabled=true; });
      btn.dataset.state = (i===b.bonne) ? "good" : "bad";
      if(i!==b.bonne) $$(".choice",ch)[b.bonne].dataset.state="good";
      var fb = el("div","fb "+(i===b.bonne?"good":"bad"));
      fb.innerHTML = '<div class="fbt">'+(i===b.bonne ? "✓ C’est ça" : "✗ Pas tout à fait")+'</div><p>'+T(b.expl[i])+'</p>';
      box.appendChild(fb);
    };
    ch.appendChild(btn);
  });
  box.appendChild(ch);
  return box;
}

/* petite courbe tracée au canvas */
function plotNode(b){
  var wrap = el("div","card pad");
  wrap.innerHTML = '<div class="eyebrow" style="margin-bottom:10px">'+T(b.titre||"Courbe")+'</div>';
  var cv = el("canvas","plot");
  var W=460, H=300; cv.width=W*2; cv.height=H*2; cv.style.height=H+"px";
  wrap.appendChild(cv);
  if(b.note) wrap.appendChild(el("div","small muted",'<div style="text-align:center;margin-top:10px">'+T(b.note)+'</div>'));
  var f = PLOTS[b.f];
  if(!f) return wrap;
  var cs = getComputedStyle(document.body);
  var cLine = cs.getPropertyValue("--line2").trim() || "#ccc";
  var cInk  = cs.getPropertyValue("--ink3").trim()  || "#888";
  var cAcc  = cs.getPropertyValue("--bleu").trim()  || "#2B49CF";
  var ctx = cv.getContext("2d"); ctx.scale(2,2);
  var x0=b.xmin, x1=b.xmax, ys=[], i;
  for(i=0;i<=200;i++){ var v=f(x0+(x1-x0)*i/200); if(isFinite(v)) ys.push(v); }
  var y0=Math.min.apply(null,ys), y1=Math.max.apply(null,ys);
  var pad=(y1-y0)*0.15||1; y0-=pad; y1+=pad;
  function px(x){ return 30+(x-x0)/(x1-x0)*(W-45); }
  function py(y){ return H-28-(y-y0)/(y1-y0)*(H-45); }
  ctx.strokeStyle=cLine; ctx.lineWidth=1;
  for(i=Math.ceil(x0);i<=x1;i++){ ctx.beginPath(); ctx.moveTo(px(i),8); ctx.lineTo(px(i),H-20); ctx.stroke(); }
  ctx.strokeStyle=cInk; ctx.lineWidth=1.5;
  if(y0<0&&y1>0){ ctx.beginPath(); ctx.moveTo(px(x0),py(0)); ctx.lineTo(px(x1),py(0)); ctx.stroke(); }
  if(x0<0&&x1>0){ ctx.beginPath(); ctx.moveTo(px(0),py(y0)); ctx.lineTo(px(0),py(y1)); ctx.stroke(); }
  ctx.strokeStyle=cAcc; ctx.lineWidth=2.6; ctx.beginPath();
  for(i=0;i<=300;i++){
    var x=x0+(x1-x0)*i/300, y=f(x);
    if(!isFinite(y)) continue;
    if(i===0) ctx.moveTo(px(x),py(y)); else ctx.lineTo(px(x),py(y));
  }
  ctx.stroke();
  ctx.fillStyle=cInk; ctx.font="11px system-ui";
  ctx.fillText(String(x0), px(x0)-4, H-8); ctx.fillText(String(x1), px(x1)-8, H-8);
  return wrap;
}

function sectionNode(c, sec, idx){
  var wrap = el("section");
  var head = el("div","secHead");
  head.innerHTML = '<span class="n">'+(idx+1)+'</span><h2>'+T(sec.titre)+'</h2>';
  wrap.appendChild(head);
  var body = el("div","lesson"); body.style.marginTop="14px";
  sec.blocs.forEach(function(b){
    if(b.t==="exemple") body.appendChild(demoNode(b));
    else if(b.t==="check") body.appendChild(checkNode(b));
    else if(b.t==="plot") body.appendChild(plotNode(b));
    else if(b.t==="fig" && window.FIGURE) body.appendChild(window.FIGURE(b));
    else if(b.t==="figi" && window.FIGURE_MANIP) body.appendChild(window.FIGURE_MANIP(b));
    else { var d=el("div"); d.innerHTML=bloc(b); if(d.firstChild) body.appendChild(d.firstChild); }
  });
  wrap.appendChild(body);
  // marquer la section comme comprise
  var st = A.chapState(c.id);
  var done = st.lu.indexOf(idx)>=0;
  var b2 = el("button","btn "+(done?"":"pri"), done? "✓ Section comprise" : "Marquer comme comprise");
  b2.style.marginTop="20px";
  b2.onclick=function(){
    var k=st.lu.indexOf(idx);
    if(k>=0){ st.lu.splice(k,1); b2.className="btn pri"; b2.textContent="Marquer comme comprise"; }
    else { st.lu.push(idx); b2.className="btn"; b2.textContent="✓ Section comprise"; A.toast("Section validée"); }
    A.save(); paintRail();
  };
  wrap.appendChild(b2);
  return wrap;
}

/* ===================================================================
   Moteur d'exercices
   =================================================================== */
function diagnostic(exo, saisie){
  // 1. diagnostic précis prévu par le cours
  if(exo.type==="num"){
    var v = A.parseNum(saisie);
    if(isNaN(v)) return "Je n'ai pas réussi à lire ce nombre. Écris-le en chiffres, par exemple <b>3,5</b> ou <b>7/2</b>.";
    if(exo.diag) for(var i=0;i<exo.diag.length;i++){
      if(Math.abs(v - exo.diag[i].v) < (exo.tol||0.0005)) return exo.diag[i].m;
    }
    // 2. diagnostics génériques
    var r = exo.rep;
    if(Math.abs(v + r) < 0.001 && r!==0) return "Ton résultat est le bon nombre, mais avec le mauvais signe. Reprends ton calcul en surveillant chaque « moins » : c'est presque toujours là que ça se joue.";
    if(r!==0 && Math.abs(v - 2*r) < 0.001) return "Ton résultat est exactement le double de la bonne réponse. Tu as probablement oublié une division par 2 quelque part.";
    if(r!==0 && Math.abs(v - r/2) < 0.001) return "Ton résultat est la moitié de la bonne réponse. Il manque un facteur 2 dans ton calcul.";
    if(r!==0 && Math.abs(v - r) < Math.abs(r)*0.05) return "Tu es tout près : l'erreur vient d'un arrondi ou d'une petite imprécision de calcul. Refais la dernière étape sans arrondir en cours de route.";
    return "Ce n'est pas la bonne valeur. Reprends la correction ci-dessous étape par étape et compare avec ton propre calcul : repère la première ligne où vous divergez.";
  }
  if(exo.type==="txt"){
    var n = A.norm(saisie);
    if(exo.diag) for(var j=0;j<exo.diag.length;j++){
      if(n.indexOf(A.norm(exo.diag[j].r))>=0) return exo.diag[j].m;
    }
    return "Ce n'est pas la réponse attendue. Regarde la correction : la formulation exacte compte ici.";
  }
  return "";
}

/* Correction dévoilée étape par étape : on lit une ligne, on la comprend,
   on demande la suivante. Tout afficher d'un coup ne se lit pas. */
function correctionProgressive(exo){
  var boite = el("div","corr");
  boite.innerHTML = '<div class="ct">La méthode, étape par étape</div>';
  var liste = el("ol","corrList");
  boite.appendChild(liste);
  var etapes = exo.corr || [], vues = 0;
  var barre = el("div","row"); barre.style.marginTop="12px";
  var suivante = el("button","btn sm pri","Première étape");
  var tout = el("button","btn sm gho","Tout afficher");
  barre.appendChild(suivante); barre.appendChild(tout);
  boite.appendChild(barre);
  var jauge = el("div","small muted"); jauge.style.marginLeft="auto";
  barre.appendChild(jauge);

  function montrer(n){
    while(vues < n && vues < etapes.length){
      var li = el("li",null,T(etapes[vues]));
      li.style.animation = "pop .25s ease";
      liste.appendChild(li);
      vues++;
    }
    jauge.textContent = vues+" / "+etapes.length;
    if(vues >= etapes.length){
      suivante.remove(); tout.remove();
      jauge.textContent = "";
      var fin = el("div","small muted");
      fin.style.marginTop="6px";
      fin.textContent = "C’est toute la méthode. Reprends ton brouillon et compare ligne à ligne : "+
                        "cherche la première où vous divergez.";
      boite.appendChild(fin);
    } else {
      suivante.textContent = "Étape suivante";
    }
  }
  suivante.onclick = function(){ montrer(vues+1); };
  tout.onclick = function(){ montrer(etapes.length); };
  jauge.textContent = "0 / "+etapes.length;
  return boite;
}

function exoNode(c, exo, onDone, onResult){
  var box = el("div","card pad");
  var st = A.chapState(c.id);
  var etat = st.exos[exo.id] || { ok:false, tries:0 };
  var essais = 0, fini = false;

  var top = el("div","exoTop");
  top.innerHTML = '<span class="tag b">Exercice</span>'+
    '<span class="pill">Niveau '+exo.niveau+'</span>'+
    (etat.ok?'<span class="tag v">✓ Déjà réussi</span>':'');
  box.appendChild(top);
  box.appendChild(el("div","enonce", T(exo.enonce)));

  var zone = el("div");
  box.appendChild(zone);
  var actions = el("div","row"); actions.style.marginTop="14px";
  var bIndice = el("button","btn gho sm","Un indice ?");
  actions.appendChild(bIndice);
  box.appendChild(actions);

  bIndice.onclick = function(){
    if($(".hint",box)) return;
    var hn = el("div","hint");
    hn.innerHTML = '<div class="ct">Indice</div><p>'+T(exo.indice)+'</p>';
    box.insertBefore(hn, actions);
  };

  function fin(ok, message){
    fini = true;
    etat = { ok:ok, tries:essais, ts:A.nowISO() };
    st.exos[exo.id] = etat;
    // Les exercices générés à la volée ne sont pas rejouables : leurs nombres
    // sont tirés au hasard et l'énoncé n'existe plus après coup. Les mettre en
    // révision espacée créerait des cartes impossibles à retrouver.
    if(c.id !== "entrainement") A.srsMaj(c.id, exo.id, ok, { titre:c.titre });
    A.save(); paintRail();
    var fb = el("div","fb "+(ok?"good":"bad"));
    fb.innerHTML = '<div class="fbt">'+(ok ? "✓ Bonne réponse" : "✗ Ce n’est pas ça")+'</div><p>'+T(message)+'</p>';
    box.insertBefore(fb, actions);
    box.insertBefore(correctionProgressive(exo), actions);
    actions.innerHTML="";
    var bRe = el("button","btn sm","Refaire cet exercice");
    bRe.onclick=function(){ var p=box.parentNode, nb=exoNode(c,exo,onDone); p.replaceChild(nb,box); };
    actions.appendChild(bRe);
    if(onDone){ var bN=el("button","btn pri sm","Exercice suivant →"); bN.onclick=onDone; actions.appendChild(bN); }
    // point d'accroche pour la couche IA (présente seulement en version connectée)
    if(window.IA_BOUTON) window.IA_BOUTON(exo, actions, box, ok);
    if(onResult) onResult(ok, actions);
  }

  function faux(msg){
    var fb = el("div","fb bad");
    fb.innerHTML = '<div class="fbt">✗ Regarde de plus près</div><p>'+T(msg)+'</p>'+
      '<p class="small" style="margin-top:8px;opacity:.85">Il te reste un essai. Corrige et retente.</p>';
    box.insertBefore(fb, actions);
    setTimeout(function(){ fb.scrollIntoView({behavior:"smooth", block:"nearest"}); },60);
  }

  if(exo.type==="qcm"){
    var ch = el("div","choices");
    exo.choix.forEach(function(cx,i){
      var btn = el("button","choice");
      btn.innerHTML='<span class="k">'+"ABCD".charAt(i)+'</span><span>'+T(cx)+'</span>';
      btn.onclick=function(){
        if(fini) return;
        essais++;
        if(i===exo.bonne){
          $$(".choice",ch).forEach(function(x){x.disabled=true;});
          btn.dataset.state="good";
          fin(true, essais===1 ? "Du premier coup, et avec la bonne méthode." : "C'est la bonne réponse. Relis la méthode ci-dessous pour la retrouver plus vite la prochaine fois.");
        } else {
          btn.dataset.state="bad"; btn.disabled=true;
          var msg = exo.diag[i] || "Ce choix ne convient pas.";
          if(essais>=2){
            $$(".choice",ch).forEach(function(x){x.disabled=true;});
            $$(".choice",ch)[exo.bonne].dataset.state="good";
            fin(false, msg);
          } else faux(msg);
        }
      };
      ch.appendChild(btn);
    });
    zone.appendChild(ch);
  } else {
    var rowIn = el("div","inputRow");
    var inp = el("input","inp");
    inp.type="text";
    inp.placeholder = exo.type==="num" ? "Ta réponse en chiffres…" : "Ta réponse…";
    inp.setAttribute("aria-label","Ta réponse");
    var bOk = el("button","btn pri","Vérifier");
    rowIn.appendChild(inp); rowIn.appendChild(bOk);
    if(exo.unite) rowIn.appendChild(el("span","muted small",A.esc(exo.unite)));
    zone.appendChild(rowIn);
    function verifier(){
      if(fini) return;
      var val = inp.value.trim();
      if(!val){ inp.focus(); return; }
      essais++;
      var ok;
      if(exo.type==="num"){
        var v=A.parseNum(val);
        ok = !isNaN(v) && Math.abs(v-exo.rep) <= (exo.tol!=null?exo.tol:0.0005);
      } else {
        var n=A.norm(val);
        ok = exo.reps.some(function(r){ return A.norm(r)===n || n.indexOf(A.norm(r))>=0; });
      }
      if(ok){
        inp.className="inp good"; inp.disabled=true; bOk.disabled=true;
        fin(true, essais===1 ? "Exact, du premier coup." : "C'est la bonne réponse.");
      } else {
        inp.className="inp bad";
        var msg = diagnostic(exo, val);
        if(essais>=2){ inp.disabled=true; bOk.disabled=true; fin(false, msg); }
        else faux(msg);
      }
    }
    bOk.onclick=verifier;
    inp.addEventListener("keydown",function(e){ if(e.key==="Enter") verifier(); });
  }
  return box;
}

/* ===================================================================
   Vues
   =================================================================== */
function setView(node){
  var v=$("#view"); v.innerHTML=""; v.appendChild(node);
  window.scrollTo(0,0);
}
function wrap(cls){ return el("div","wrap"+(cls?" "+cls:"")); }

function vueAccueil(){
  var w = wrap();
  var p = progGlobale();
  var hero = el("div");
  hero.innerHTML =
    '<div class="eyebrow">Spécialité physique-chimie · Première générale</div>'+
    '<h1 style="font-size:38px;margin:8px 0 10px;letter-spacing:-.02em">Ton cahier de physique-chimie</h1>'+
    '<p class="muted" style="max-width:56ch;font-size:17px">Tout le programme expliqué simplement — '+
      COURS.length+' chapitres, avec des exemples déroulés étape par étape et des exercices qui te disent '+
      '<b>où</b> tu t'+"'"+'es trompée, pas seulement que c'+"'"+'est faux.</p>';
  w.appendChild(hero);

  var duj = dues();
  var dernier = (S.controles && S.controles[0]) || null;
  var stats = el("div","card pad"); stats.style.marginTop="26px";
  stats.innerHTML =
    '<div class="row" style="justify-content:space-between;align-items:flex-end">'+
      '<div class="stat"><div class="n">'+p.pct+'%</div><div class="l">Progression générale</div></div>'+
      '<div class="stat"><div class="n">'+p.fait+' <span style="font-size:17px;color:var(--ink3)">/ '+p.total+'</span></div><div class="l">Étapes validées</div></div>'+
      '<div class="stat"><div class="n">'+duj.length+'</div><div class="l">Cartes à réviser</div></div>'+
      (dernier?'<div class="stat"><div class="n">'+dernier.note+' <span style="font-size:17px;color:var(--ink3)">/20</span></div><div class="l">Dernier contrôle</div></div>':'')+
    '</div><div class="bar" style="margin-top:16px"><i style="width:'+p.pct+'%"></i></div>';
  w.appendChild(stats);

  /* trois façons de travailler */
  var modes = el("div","cards"); modes.style.marginTop="14px";
  [
    { t:"Révision espacée", d: duj.length
        ? A.plural(duj.length,"carte")+" arrive"+(duj.length>1?"nt":"")+" à échéance aujourd'hui."
        : "Aucune carte à échéance. Les exercices ratés reviennent d'eux-mêmes, de plus en plus espacés.",
      b:"Réviser", page:"revoir", tag: duj.length?'<span class="tag r">'+duj.length+'</span>':'' },
    { t:"Entraînement illimité", d:"Des exercices générés à la volée sur les quantités de matière, les titrages, les forces, l'énergie et les ondes. Jamais deux fois les mêmes nombres.",
      b:"S'entraîner", page:"entrainement", tag:'<span class="tag b">∞</span>' },
    { t:"Mode contrôle", d:"Un devoir chronométré, sans correction en direct, noté sur 20 avec un bilan détaillé à la fin.",
      b:"Lancer un contrôle", page:"controle", tag:'<span class="tag a">chrono</span>' }
  ].forEach(function(m){
    var card = el("div","chapCard");
    card.innerHTML = '<div class="row" style="justify-content:space-between">'+
      '<span class="eyebrow">'+A.esc(m.t)+'</span>'+m.tag+'</div>'+
      '<div class="d">'+A.esc(m.d)+'</div>';
    var b = el("button","btn"+(m.page==="revoir"&&duj.length?" pri":""), m.b);
    b.onclick=function(){ route={page:m.page}; render(); };
    card.appendChild(b);
    modes.appendChild(card);
  });
  w.appendChild(modes);

  w.appendChild(el("div","eyebrow","Les chapitres du programme"))
   .style.margin="34px 0 12px";
  var cards = el("div","cards");
  COURS.forEach(function(c){
    var pc = progChap(c);
    var b = el("button","chapCard");
    b.innerHTML =
      '<div class="row" style="justify-content:space-between">'+
        '<span class="pill">Chapitre '+c.n+'</span>'+
        (pc===100?'<span class="tag v">terminé</span>':(pc>0?'<span class="tag a">'+pc+' %</span>':''))+
      '</div>'+
      '<h3>'+A.esc(c.titre)+'</h3>'+
      '<div class="d">'+A.esc(c.desc)+'</div>'+
      '<div class="bar'+(pc===100?" v":"")+'"><i style="width:'+pc+'%"></i></div>'+
      '<div class="small muted">'+c.sections.length+' parties · '+c.exos.length+' exercices · ~'+c.duree+' min</div>';
    b.onclick=function(){ route={page:"chap", chap:c.id, onglet:"cours"}; render(); };
    cards.appendChild(b);
  });
  w.appendChild(cards);
  return w;
}

/* Les exercices du cours sont en nombre fini. Ceux-ci sont générés :
   tant qu'elle en veut, elle en a, avec des nombres toujours différents. */
function exercicesSansFin(c){
  var zone = el("div");
  if(!window.GEN || !window.GEN.pourChapitre(c.id).length) return zone;
  var tete = el("div","secHead");
  tete.innerHTML = '<span class="n">∞</span><h2>Continuer à s\'entraîner</h2>';
  zone.appendChild(tete);
  var intro = el("div","callout co-astuce");
  intro.style.marginTop = "16px";
  intro.innerHTML = '<div class="ct">Autant d\'exercices que tu veux</div>'+
    '<p>Ceux-ci sont fabriqués à la demande sur ce chapitre : les nombres changent à chaque fois, '+
    'mais l\'explication de l\'erreur est recalculée avec eux. Tu ne retomberas jamais deux fois sur le même énoncé.</p>';
  zone.appendChild(intro);

  var boite = el("div"); boite.style.marginTop="16px";
  zone.appendChild(boite);
  var barre = el("div","row"); barre.style.marginTop="14px";
  var bGo = el("button","btn pri","Me donner un exercice");
  var compteur = el("span","small muted");
  var faits = 0, reussis = 0;
  barre.appendChild(bGo); barre.appendChild(compteur);
  zone.appendChild(barre);

  function suivant(){
    boite.innerHTML = "";
    var exo = window.GEN.fabriquer(c.id, 3);
    var faux = { id:"entrainement", titre:c.titre, n:c.n, exos:[exo] };
    var etiq = el("div","row"); etiq.style.marginBottom="8px";
    etiq.innerHTML = '<span class="tag b">'+A.esc(exo.source)+'</span>'+
                     '<span class="pill">Niveau '+exo.niveau+'</span>';
    boite.appendChild(etiq);
    boite.appendChild(exoNode(faux, exo, null, function(ok, actions){
      faits++; if(ok) reussis++;
      compteur.textContent = faits+" fait"+(faits>1?"s":"")+", "+reussis+" réussi"+(reussis>1?"s":"");
      var b = el("button","btn pri sm","Un autre →");
      b.onclick = function(){ suivant(); boite.scrollIntoView({behavior:"smooth", block:"center"}); };
      actions.appendChild(b);
    }));
    bGo.textContent = "Changer d'exercice";
  }
  bGo.onclick = suivant;
  return zone;
}

function vueChapitre(){
  var c = COURS.filter(function(x){return x.id===route.chap;})[0];
  if(!c) return vueAccueil();
  var w = wrap();
  var head = el("div");
  head.innerHTML =
    '<div class="row"><span class="pill">Chapitre '+c.n+'</span><span class="muted small">'+A.esc(c.sous)+'</span></div>'+
    '<h1 style="font-size:33px;margin:10px 0 6px;letter-spacing:-.02em">'+A.esc(c.titre)+'</h1>'+
    '<p class="muted" style="max-width:60ch">'+A.esc(c.desc)+'</p>';
  w.appendChild(head);

  var seg = el("div","seg"); seg.style.margin="20px 0 6px";
  var bc = el("button",null,"Cours"), be = el("button",null,"Exercices ("+c.exos.length+")");
  bc.setAttribute("aria-pressed", route.onglet==="cours");
  be.setAttribute("aria-pressed", route.onglet==="exos");
  bc.onclick=function(){ route.onglet="cours"; render(); };
  be.onclick=function(){ route.onglet="exos"; render(); };
  seg.appendChild(bc); seg.appendChild(be);
  w.appendChild(seg);

  if(route.onglet==="cours"){
    c.sections.forEach(function(sec,i){ w.appendChild(sectionNode(c,sec,i)); });
    var fin = el("div","card pad"); fin.style.marginTop="40px";
    fin.innerHTML = '<div style="font-family:var(--f-disp);font-weight:700;font-size:18px">Le cours est lu. À toi de jouer.</div>'+
      '<p class="muted small" style="margin-top:4px">On ne retient vraiment une méthode qu\'en la pratiquant. '+c.exos.length+' exercices t\'attendent, du plus simple au plus complet.</p>';
    var b=el("button","btn pri","Passer aux exercices →"); b.style.marginTop="14px";
    b.onclick=function(){ route.onglet="exos"; render(); };
    fin.appendChild(b); w.appendChild(fin);
  } else {
    var list = el("div","grid"); list.style.marginTop="20px";
    c.exos.forEach(function(x,i){
      var holder = el("div");
      holder.appendChild(exoNode(c,x,function(){
        var next = list.children[i+1];
        if(next) next.scrollIntoView({behavior:"smooth", block:"start"});
      }));
      list.appendChild(holder);
    });
    w.appendChild(list);
    w.appendChild(exercicesSansFin(c));
  }
  return w;
}

function vueRevoir(){
  var w = wrap();
  var duj = dues(), tous = planifiees();
  var plusTard = tous.filter(function(r){ return r.carte.du > Date.now(); });
  w.innerHTML = '<div class="eyebrow">Révision espacée</div>'+
    '<h1 style="font-size:31px;margin:8px 0 8px">Ce qu\'il faut revoir aujourd\'hui</h1>'+
    '<p class="muted" style="max-width:62ch">Chaque exercice raté devient une carte. Quand tu la réussis, elle revient de plus en plus tard : d\'abord le lendemain, puis 3 jours, une semaine, deux semaines… Au bout de cinq réussites espacées, elle disparaît : c\'est acquis.</p>';

  var barre = el("div","card pad"); barre.style.marginTop="20px";
  barre.innerHTML =
    '<div class="row" style="justify-content:space-between;align-items:flex-end">'+
      '<div class="stat"><div class="n">'+duj.length+'</div><div class="l">À réviser maintenant</div></div>'+
      '<div class="stat"><div class="n">'+plusTard.length+'</div><div class="l">Programmées plus tard</div></div>'+
      '<div class="stat"><div class="n">'+tous.filter(function(r){return r.carte.palier>=3;}).length+
        '</div><div class="l">Presque acquises</div></div>'+
    '</div>';
  w.appendChild(barre);

  if(!tous.length){
    var e=el("div","empty");
    e.innerHTML='<div class="big">Aucune carte pour l\'instant</div>'+
      '<p>Les exercices que tu rates atterrissent ici automatiquement, avec un calendrier de reprise.</p>';
    w.appendChild(e); return w;
  }

  if(duj.length){
    var h=el("div","secHead");
    h.innerHTML='<span class="n">→</span><h2>Séance du jour</h2>';
    w.appendChild(h);
    var list = el("div","grid"); list.style.marginTop="18px";
    duj.forEach(function(r){
      var holder = el("div");
      var lbl = el("div","row"); lbl.style.marginBottom="6px";
      lbl.innerHTML = '<span class="small muted">'+
        (r.chap.n?("Chapitre "+r.chap.n+" — "):"")+A.esc(r.chap.titre)+'</span>'+
        '<span class="pill">palier '+r.carte.palier+' / '+(A.PALIERS.length-1)+'</span>'+
        (r.carte.ratages>1?'<span class="tag r">raté '+r.carte.ratages+' fois</span>':'');
      holder.appendChild(lbl);
      holder.appendChild(exoNode(r.chap, r.exo, null));
      list.appendChild(holder);
    });
    w.appendChild(list);
  } else {
    var ok=el("div","callout co-astuce");
    ok.innerHTML='<div class="ct">Séance terminée</div><p>Rien à réviser dans l\'immédiat. '+
      'Reviens quand les cartes ci-dessous arriveront à échéance, ou va t\'entraîner sur des exercices générés.</p>';
    ok.style.marginTop="24px";
    w.appendChild(ok);
  }

  if(plusTard.length){
    var h2=el("div","secHead");
    h2.innerHTML='<span class="n">◷</span><h2>Le calendrier</h2>';
    w.appendChild(h2);
    var g=el("div","grid"); g.style.marginTop="16px";
    plusTard.forEach(function(r){
      var row=el("div","row");
      row.style.cssText="justify-content:space-between;border:1px solid var(--line);border-radius:10px;padding:10px 14px";
      row.innerHTML='<div style="min-width:0"><div class="small" style="font-weight:600;overflow:hidden;text-overflow:ellipsis">'+
        A.esc(r.chap.titre)+'</div><div class="small muted">'+
        A.esc(String(r.exo.enonce).replace(/\$/g,"").slice(0,74))+'…</div></div>'+
        '<span class="pill">'+A.srsQuand(r.carte)+'</span>';
      g.appendChild(row);
    });
    w.appendChild(g);
  }
  return w;
}

function vueMemo(){
  var w = wrap();
  w.innerHTML = '<div class="eyebrow">Aide-mémoire</div>'+
    '<h1 style="font-size:31px;margin:8px 0 8px">Toutes les formules du programme</h1>'+
    '<p class="muted" style="max-width:60ch">Rassemblées automatiquement depuis les chapitres. À relire la veille d\'un contrôle.</p>';
  COURS.forEach(function(c){
    var fs=[];
    c.sections.forEach(function(s){ s.blocs.forEach(function(b){ if(b.t==="formule") fs.push(b); }); });
    if(!fs.length) return;
    var h = el("div","secHead");
    h.innerHTML='<span class="n">'+c.n+'</span><h2>'+A.esc(c.titre)+'</h2>';
    w.appendChild(h);
    var g = el("div","grid"); g.style.marginTop="14px";
    fs.forEach(function(b){ var d=el("div"); d.innerHTML=bloc(b); g.appendChild(d.firstChild); });
    w.appendChild(g);
  });
  return w;
}

/* ===================================================================
   Barre latérale
   =================================================================== */
function paintRail(){
  var r = $("#railScroll");
  r.innerHTML = "";
  var nav = [
    { id:"accueil",     label:"Accueil", ic:"⌂" },
    { id:"revoir",      label:"À revoir", ic:"↻", badge:dues().length },
    { id:"entrainement",label:"Entraînement", ic:"∞" },
    { id:"controle",    label:"Mode contrôle", ic:"◷" },
    { id:"stats",       label:"Mes statistiques", ic:"▤" },
    { id:"memo",        label:"Aide-mémoire", ic:"∑" },
    { id:"import",      label:"Mes cours", ic:"+" }
  ];
  // la page photo n'existe qu'en version connectée
  if(window.IA_ACTIVE) nav.splice(4, 0, { id:"photo", label:"Corriger une photo", ic:"◉" });
  nav.forEach(function(n){
    var b = el("button","navBtn");
    b.innerHTML = '<span class="ic">'+n.ic+'</span><span style="flex:1">'+n.label+'</span>'+
      (n.badge?'<span class="pill">'+n.badge+'</span>':'');
    b.setAttribute("aria-current", route.page===n.id);
    b.onclick=function(){ route={page:n.id}; document.body.classList.remove("nav"); render(); };
    r.appendChild(b);
  });
  r.appendChild(el("div","railLabel","Programme"));

  /* recherche : filtre les chapitres et affiche les parties qui répondent */
  var champ = el("input","rechChamp");
  champ.type = "search";
  champ.placeholder = "Chercher une notion…";
  champ.setAttribute("aria-label","Chercher une notion dans le programme");
  champ.value = recherche;
  r.appendChild(champ);
  var resultats = el("div");
  r.appendChild(resultats);

  function peindreChapitres(){
    resultats.innerHTML = "";
    var q = A.norm(recherche);
    var trouve = 0;
    COURS.forEach(function(c){
      var pc = progChap(c);
      var secs = [];
      if(q){
        if(A.norm(c.titre+" "+c.sous+" "+c.desc).indexOf(q) < 0){
          c.sections.forEach(function(s,i){
            if(A.norm(s.titre).indexOf(q) >= 0) secs.push({ t:s.titre, i:i });
          });
          if(!secs.length) return;      // ce chapitre ne correspond pas
        }
      }
      trouve++;
      var b = el("button","chapBtn");
      b.innerHTML = '<span class="chapNum">'+c.n+'</span><span class="t">'+A.esc(c.titre)+'</span>'+
        '<span class="dot'+(pc===100?" done":(pc>0?" part":""))+'"></span>';
      b.setAttribute("aria-current", route.page==="chap" && route.chap===c.id);
      b.onclick=function(){ route={page:"chap",chap:c.id,onglet:"cours"}; document.body.classList.remove("nav"); render(); };
      resultats.appendChild(b);
      secs.forEach(function(s){
        var sb = el("button","secBtn", A.esc(s.t));
        sb.onclick=function(){
          route={page:"chap",chap:c.id,onglet:"cours"};
          document.body.classList.remove("nav"); render();
          setTimeout(function(){
            var h = $$("#view .secHead")[s.i];
            if(h) h.scrollIntoView({behavior:"smooth", block:"start"});
          }, 80);
        };
        resultats.appendChild(sb);
      });
    });
    if(!trouve) resultats.appendChild(el("div","railVide","Aucune partie ne correspond."));
  }
  champ.oninput = function(){ recherche = champ.value; peindreChapitres(); };
  peindreChapitres();
  if(S.perso && S.perso.length){
    r.appendChild(el("div","railLabel","Mes fiches"));
    S.perso.forEach(function(f){
      var b = el("button","chapBtn");
      b.innerHTML = '<span class="chapNum">·</span><span class="t">'+A.esc(f.titre)+'</span><span></span>';
      b.setAttribute("aria-current", route.page==="fiche" && route.fiche===f.id);
      b.onclick=function(){ route={page:"fiche",fiche:f.id}; document.body.classList.remove("nav"); render(); };
      r.appendChild(b);
    });
  }
  var p=progGlobale(), d=dues().length;
  $("#railStat").innerHTML = p.pct+" % du programme"+(d?(" · "+A.plural(d,"carte")+" à réviser"):"");
}

function paintCrumb(){
  var c = COURS.filter(function(x){return x.id===route.chap;})[0];
  var txt = { accueil:"Accueil", revoir:"À revoir", memo:"Aide-mémoire",
              import:"Mes cours", fiche:"Ma fiche", photo:"Corriger une photo", stats:"Mes statistiques",
              entrainement:"Entraînement", controle:"Mode contrôle" }[route.page];
  if(route.page==="chap" && c) txt = "<b>Chapitre "+c.n+"</b> · "+A.esc(c.titre)+
    " · "+(route.onglet==="cours"?"Cours":"Exercices");
  $("#crumb").innerHTML = txt || "";
}

/* ===================================================================
   Rendu principal
   =================================================================== */
function render(){
  paintRail(); paintCrumb();
  var n;
  switch(route.page){
    case "chap":   n = vueChapitre(); break;
    case "revoir": n = vueRevoir();  break;
    case "memo":   n = vueMemo();    break;
    case "stats":  n = window.VUE_STATS ? window.VUE_STATS() : vueAccueil(); break;
    case "entrainement": n = window.VUE_ENTRAINEMENT ? window.VUE_ENTRAINEMENT() : vueAccueil(); break;
    case "controle":     n = window.VUE_CONTROLE ? window.VUE_CONTROLE() : vueAccueil(); break;
    case "photo":        n = window.VUE_PHOTO ? window.VUE_PHOTO() : vueAccueil(); break;
    case "import": n = window.VUE_IMPORT ? window.VUE_IMPORT() : vueAccueil(); break;
    case "fiche":  n = window.VUE_FICHE ? window.VUE_FICHE(route.fiche) : vueAccueil(); break;
    default:       n = vueAccueil();
  }
  setView(n);
}

/* barre d'outils et navigation mobile */
$("#burger").onclick=function(){ document.body.classList.toggle("nav"); };
document.addEventListener("click",function(e){
  if(document.body.classList.contains("nav") &&
     !e.target.closest("#rail") && !e.target.closest("#burger")){
    document.body.classList.remove("nav");
  }
});
$("#theme").onclick=function(){
  var cur = document.documentElement.getAttribute("data-theme");
  var sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if(!cur) S.theme = sysDark ? "light" : "dark";
  else S.theme = cur==="dark" ? "light" : "dark";
  A.applyTheme(); A.save(); render();
};

window.RENDER = render;
window.GOTO   = function(r){ route = r; document.body.classList.remove("nav"); render(); };
window.EXONODE = exoNode;
window.BLOC = bloc;
window.DEMONODE = demoNode;
window.WRAPDIV = wrap;
window.SETVIEW = setView;
window.LES_COURS = COURS;
window.DIAGNOSTIC = diagnostic;

/* Mode hors ligne : une fois la page ouverte une première fois, elle
   reste utilisable sans connexion — dans le bus, au lycée, en vacances.
   Les appels au serveur, eux, ne sont jamais mis en cache. */
if("serviceWorker" in navigator && location.protocol.indexOf("http")===0){
  window.addEventListener("load", function(){
    navigator.serviceWorker.register("sw.js").catch(function(){});
  });
}
render();
})();
