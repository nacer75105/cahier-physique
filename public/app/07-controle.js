/* =====================================================================
   Mode contrôle : devoir chronométré, sans correction en direct,
   noté sur 20, avec bilan détaillé et alimentation des révisions.
   ===================================================================== */
(function(){
"use strict";
var A = window.APP, T=A.T, el=A.el, S=A.S;
var COURS = window.LES_COURS || [];

var ctl = {
  phase:"reglage",              // reglage | epreuve | bilan
  chapitres:[], nb:10, minutes:20, generes:true,
  questions:[], reponses:[], index:0,
  debut:0, fin:0, restant:0, tick:null, bilan:null
};

/* ---------------- constitution du sujet ---------------- */
function tirerSujet(){
  var pool = [];
  var choisis = ctl.chapitres.length ? ctl.chapitres : COURS.map(function(c){ return c.id; });
  COURS.forEach(function(c){
    if(choisis.indexOf(c.id)<0) return;
    c.exos.forEach(function(x){ pool.push({ chap:c, exo:x }); });
  });
  pool = A.shuffle(pool);
  var q = pool.slice(0, ctl.nb);
  // si le vivier ne suffit pas, on complète avec des exercices générés
  if(ctl.generes && window.GEN){
    // on pioche dans toutes les familles de générateurs disponibles
    var fams = window.GEN.FAMILLES.map(function(f){ return f.id; }), i=0;
    while(q.length < ctl.nb){
      var e = window.GEN.fabriquer(fams[i++ % fams.length], 3);
      q.push({ chap:{ id:"controle", titre:e.source, n:0 }, exo:e });
    }
  }
  return A.shuffle(q).slice(0, ctl.nb);
}

/* ---------------- champ de réponse, sans verdict ---------------- */
function champ(item, idx){
  var exo = item.exo, box = el("div");
  if(exo.type==="qcm"){
    var ch = el("div","choices");
    exo.choix.forEach(function(c,i){
      var b = el("button","choice");
      b.innerHTML='<span class="k">'+"ABCD".charAt(i)+'</span><span>'+T(c)+'</span>';
      if(ctl.reponses[idx]===i) b.dataset.state="pick";
      b.onclick=function(){
        ctl.reponses[idx]=i;
        Array.prototype.forEach.call(ch.children,function(x){ delete x.dataset.state; });
        b.dataset.state="pick";
        majPastilles();
      };
      ch.appendChild(b);
    });
    box.appendChild(ch);
  } else {
    var row = el("div","inputRow");
    var inp = el("input","inp"); inp.type="text";
    inp.placeholder = exo.type==="num" ? "Ta réponse en chiffres…" : "Ta réponse…";
    inp.value = ctl.reponses[idx]==null ? "" : ctl.reponses[idx];
    inp.oninput=function(){ ctl.reponses[idx]=inp.value; majPastilles(); };
    row.appendChild(inp);
    if(exo.unite) row.appendChild(el("span","muted small",A.esc(exo.unite)));
    box.appendChild(row);
  }
  return box;
}
function repondu(i){
  var r = ctl.reponses[i];
  return !(r==null || (typeof r==="string" && !r.trim()));
}
function majPastilles(){
  var p = document.querySelectorAll(".qdot");
  Array.prototype.forEach.call(p,function(d,i){
    d.className = "qdot"+(i===ctl.index?" now":"")+(repondu(i)?" done":"");
  });
  var n = document.getElementById("nbRep");
  if(n) n.textContent = ctl.reponses.filter(function(_,i){ return repondu(i); }).length;
}

/* ---------------- correction ---------------- */
function corriger(){
  var res = ctl.questions.map(function(item,i){
    var exo=item.exo, r=ctl.reponses[i], ok=false, donne="—", diag="";
    if(!repondu(i)){
      diag = "Tu n'as pas répondu à cette question. Dans un devoir, mieux vaut toujours proposer quelque chose : une réponse fausse ne coûte pas plus qu'une case vide.";
    } else if(exo.type==="qcm"){
      donne = String(exo.choix[r]).replace(/\$/g,"");
      ok = (r===exo.bonne);
      if(!ok) diag = exo.diag[r] || "Ce choix ne convient pas.";
    } else if(exo.type==="num"){
      donne = String(r);
      var v=A.parseNum(r);
      ok = !isNaN(v) && Math.abs(v-exo.rep) <= (exo.tol!=null?exo.tol:0.0005);
      if(!ok) diag = window.DIAGNOSTIC(exo, r);
    } else {
      donne = String(r);
      var n=A.norm(r);
      ok = exo.reps.some(function(x){ return A.norm(x)===n || n.indexOf(A.norm(x))>=0; });
      if(!ok) diag = window.DIAGNOSTIC(exo, r);
    }
    if(item.chap.id!=="controle") A.srsMaj(item.chap.id, exo.id, ok, { titre:item.chap.titre });
    return { item:item, ok:ok, donne:donne, diag:diag, repondu:repondu(i) };
  });
  var justes = res.filter(function(r){ return r.ok; }).length;
  var note = Math.round(20*justes/res.length*2)/2;   // au demi-point
  var temps = Date.now()-ctl.debut;
  S.controles.unshift({ date:A.nowISO(), score:justes, total:res.length,
                        note:note, temps:temps,
                        chapitres:ctl.chapitres.slice() });
  S.controles = S.controles.slice(0,25);
  A.save();
  ctl.bilan = { res:res, justes:justes, note:note, temps:temps };
  ctl.phase = "bilan";
  if(ctl.tick){ clearInterval(ctl.tick); ctl.tick=null; }
  window.RENDER();
}

/* ---------------- chronomètre ---------------- */
function lancerChrono(){
  if(ctl.tick) clearInterval(ctl.tick);
  ctl.tick = setInterval(function(){
    ctl.restant = ctl.fin - Date.now();
    var e = document.getElementById("chrono");
    if(e){
      e.textContent = A.chrono(ctl.restant);
      e.className = "chronoBox"+(ctl.restant < 120000 ? " urgent" : "");
    }
    if(ctl.restant<=0){ clearInterval(ctl.tick); ctl.tick=null; A.toast("Temps écoulé."); corriger(); }
  },1000);
}

/* =====================================================================
   Vue
   ===================================================================== */
window.VUE_CONTROLE = function(){
  if(ctl.phase==="epreuve") return vueEpreuve();
  if(ctl.phase==="bilan")   return vueBilan();
  return vueReglage();
};

function vueReglage(){
  var w = window.WRAPDIV();
  w.innerHTML =
    '<div class="eyebrow">Mode contrôle</div>'+
    '<h1 style="font-size:31px;margin:8px 0 8px">Se mettre en conditions de devoir</h1>'+
    '<p class="muted" style="max-width:62ch">Pas de correction en direct, pas d\'indice, un chronomètre qui tourne. Tu peux naviguer entre les questions et revenir sur tes réponses. La correction complète arrive à la fin, question par question.</p>';

  var c1 = el("div","card pad"); c1.style.marginTop="22px";
  c1.innerHTML = '<div class="eyebrow" style="margin-bottom:12px">Sur quoi porte le contrôle ?</div>';
  var chips = el("div","row");
  COURS.forEach(function(c){
    var on = ctl.chapitres.indexOf(c.id)>=0;
    var b = el("button","btn sm"+(on?" pri":""), c.n+". "+c.titre);
    b.onclick=function(){
      var i=ctl.chapitres.indexOf(c.id);
      if(i>=0) ctl.chapitres.splice(i,1); else ctl.chapitres.push(c.id);
      window.RENDER();
    };
    chips.appendChild(b);
  });
  c1.appendChild(chips);
  c1.appendChild(el("p","small muted",
    ctl.chapitres.length ? "" : "Aucun chapitre sélectionné : le contrôle piochera dans tout le programme."));
  w.appendChild(c1);

  var c2 = el("div","card pad"); c2.style.marginTop="14px";
  var r1 = el("div","row");
  r1.appendChild(el("span","small muted","Nombre de questions"));
  var s1 = el("div","seg");
  [8,10,15,20].forEach(function(n){
    var b=el("button",null,String(n));
    b.setAttribute("aria-pressed", ctl.nb===n);
    b.onclick=function(){ ctl.nb=n; window.RENDER(); };
    s1.appendChild(b);
  });
  r1.appendChild(s1); c2.appendChild(r1);

  var r2 = el("div","row"); r2.style.marginTop="12px";
  r2.appendChild(el("span","small muted","Durée"));
  var s2 = el("div","seg");
  [10,20,30,45].forEach(function(n){
    var b=el("button",null,n+" min");
    b.setAttribute("aria-pressed", ctl.minutes===n);
    b.onclick=function(){ ctl.minutes=n; window.RENDER(); };
    s2.appendChild(b);
  });
  r2.appendChild(s2); c2.appendChild(r2);

  var r3 = el("div","row"); r3.style.marginTop="14px";
  var bg = el("button","btn sm"+(ctl.generes?" pri":""), ctl.generes?"✓ Compléter avec des questions générées":"Compléter avec des questions générées");
  bg.onclick=function(){ ctl.generes=!ctl.generes; window.RENDER(); };
  r3.appendChild(bg);
  c2.appendChild(r3);
  w.appendChild(c2);

  var go = el("button","btn pri","Commencer le contrôle");
  go.style.cssText="margin-top:20px;font-size:16px;padding:12px 22px";
  go.onclick=function(){
    ctl.questions = tirerSujet();
    if(!ctl.questions.length){ A.toast("Aucune question disponible avec ces réglages."); return; }
    ctl.reponses = ctl.questions.map(function(){ return null; });
    ctl.index=0; ctl.phase="epreuve";
    ctl.debut=Date.now(); ctl.fin=ctl.debut+ctl.minutes*60000; ctl.restant=ctl.minutes*60000;
    window.RENDER(); lancerChrono();
  };
  w.appendChild(go);

  if(S.controles && S.controles.length){
    var h=el("div","secHead");
    h.innerHTML='<span class="n">◷</span><h2>Tes contrôles précédents</h2>';
    w.appendChild(h);
    var g=el("div","grid"); g.style.marginTop="16px";
    S.controles.slice(0,8).forEach(function(c){
      var d=new Date(c.date);
      var row=el("div","row");
      row.style.cssText="justify-content:space-between;border:1px solid var(--line);border-radius:10px;padding:10px 14px";
      row.innerHTML='<div><div style="font-weight:600">'+c.note+' / 20</div>'+
        '<div class="small muted">'+c.score+' bonnes réponses sur '+c.total+' · '+A.duree(c.temps)+'</div></div>'+
        '<span class="pill">'+d.toLocaleDateString("fr-FR")+'</span>';
      g.appendChild(row);
    });
    w.appendChild(g);
  }
  return w;
}

function vueEpreuve(){
  var w = window.WRAPDIV();
  var item = ctl.questions[ctl.index];

  /* bandeau : chrono + avancement */
  var bar = el("div","card pad");
  bar.style.cssText="position:sticky;top:66px;z-index:20;margin-bottom:18px";
  var top = el("div","row"); top.style.justifyContent="space-between";
  top.innerHTML =
    '<div><div class="eyebrow">Question '+(ctl.index+1)+' sur '+ctl.questions.length+'</div>'+
    '<div class="small muted"><span id="nbRep">0</span> réponse(s) donnée(s)</div></div>'+
    '<div id="chrono" class="chronoBox">'+A.chrono(ctl.restant)+'</div>';
  bar.appendChild(top);
  var dots = el("div","qdots");
  ctl.questions.forEach(function(_,i){
    var d = el("button","qdot"+(i===ctl.index?" now":"")+(repondu(i)?" done":""));
    d.textContent = i+1;
    d.setAttribute("aria-label","Aller à la question "+(i+1));
    d.onclick=function(){ ctl.index=i; window.RENDER(); };
    dots.appendChild(d);
  });
  bar.appendChild(dots);
  w.appendChild(bar);

  var card = el("div","card pad");
  var tag = el("div","exoTop");
  tag.innerHTML = '<span class="tag b">'+A.esc(item.chap.titre)+'</span>'+
                  '<span class="pill">Niveau '+(item.exo.niveau||1)+'</span>';
  card.appendChild(tag);
  card.appendChild(el("div","enonce", T(item.exo.enonce)));
  card.appendChild(champ(item, ctl.index));
  w.appendChild(card);

  var nav = el("div","row"); nav.style.marginTop="18px";
  var prev = el("button","btn","← Précédente");
  prev.disabled = ctl.index===0;
  prev.onclick=function(){ ctl.index--; window.RENDER(); };
  var next = el("button","btn pri","Suivante →");
  next.disabled = ctl.index===ctl.questions.length-1;
  next.onclick=function(){ ctl.index++; window.RENDER(); };
  nav.appendChild(prev); nav.appendChild(next);
  var sp = el("div"); sp.style.flex="1"; nav.appendChild(sp);
  var fin = el("button","btn","Terminer et corriger");
  var prevenu = false;
  fin.onclick=function(){
    var manquantes = ctl.questions.filter(function(_,i){ return !repondu(i); }).length;
    if(manquantes && !prevenu){
      prevenu = true;
      fin.className = "btn pri";
      fin.textContent = "Terminer quand même";
      A.toast(A.plural(manquantes,"question")+" sans réponse. Reclique pour valider.");
      return;
    }
    corriger();
  };
  nav.appendChild(fin);
  w.appendChild(nav);

  setTimeout(majPastilles,0);
  return w;
}

function vueBilan(){
  var w = window.WRAPDIV();
  var b = ctl.bilan;
  var mention = b.note>=16?"Très bien":(b.note>=14?"Bien":(b.note>=12?"Assez bien":(b.note>=10?"Passable":"À retravailler")));
  var classe = b.note>=12?"v":(b.note>=10?"a":"r");

  w.innerHTML = '<div class="eyebrow">Contrôle terminé</div>'+
    '<h1 style="font-size:31px;margin:8px 0 14px">Ton bilan</h1>';

  var res = el("div","card pad");
  res.innerHTML =
    '<div class="row" style="justify-content:space-between;align-items:flex-end">'+
      '<div class="stat"><div class="n">'+b.note+' <span style="font-size:19px;color:var(--ink3)">/ 20</span></div>'+
        '<div class="l">'+mention+'</div></div>'+
      '<div class="stat"><div class="n">'+b.justes+' <span style="font-size:17px;color:var(--ink3)">/ '+b.res.length+'</span></div><div class="l">Bonnes réponses</div></div>'+
      '<div class="stat"><div class="n" style="font-size:22px">'+A.duree(b.temps)+'</div><div class="l">Temps utilisé</div></div>'+
    '</div>'+
    '<div class="bar '+(classe==="v"?"v":"")+'" style="margin-top:16px"><i style="width:'+(b.note/20*100)+'%"></i></div>';
  w.appendChild(res);

  var rates = b.res.filter(function(r){ return !r.ok && r.item.chap.id!=="controle"; }).length;
  if(rates){
    w.appendChild(el("div","callout co-idee",
      '<div class="ct">Ajouté à tes révisions</div><p>'+
      A.plural(rates,"question")+' sont parties dans <b>À revoir</b>. Elles te reviendront demain, puis de plus en plus espacées à chaque réussite.</p>'));
  }

  var h=el("div","secHead");
  h.innerHTML='<span class="n">→</span><h2>Question par question</h2>';
  w.appendChild(h);

  var g = el("div","grid"); g.style.marginTop="18px";
  b.res.forEach(function(r,i){
    var exo=r.item.exo;
    var card = el("div","card pad");
    var head = el("div","exoTop");
    head.innerHTML = '<span class="pill">Question '+(i+1)+'</span>'+
      (r.ok?'<span class="tag v">✓ juste</span>'
           :(r.repondu?'<span class="tag r">✗ faux</span>':'<span class="tag a">sans réponse</span>'))+
      '<span class="small muted">'+A.esc(r.item.chap.titre)+'</span>';
    card.appendChild(head);
    card.appendChild(el("div","enonce", T(exo.enonce)));

    var bonne = exo.type==="qcm" ? String(exo.choix[exo.bonne])
              : (exo.type==="num" ? String(exo.rep).replace(".",",") : String(exo.reps[0]));
    var rep = el("div","row"); rep.style.marginTop="14px";
    rep.innerHTML =
      '<div style="flex:1;min-width:150px"><div class="eyebrow">Ta réponse</div>'+
        '<div class="m" style="font-size:17px;color:var(--'+(r.ok?"vert":"rouge")+')">'+A.esc(r.donne)+'</div></div>'+
      '<div style="flex:1;min-width:150px"><div class="eyebrow">Attendu</div>'+
        '<div class="m" style="font-size:17px">'+T("$"+bonne.replace(/\$/g,"")+"$")+'</div></div>';
    card.appendChild(rep);

    if(!r.ok){
      var fb = el("div","fb bad");
      fb.innerHTML='<div class="fbt">Ce qui s’est passé</div><p>'+T(r.diag)+'</p>';
      card.appendChild(fb);
      var corr = el("div","corr");
      corr.innerHTML='<div class="ct">La méthode, étape par étape</div><ol>'+
        exo.corr.map(function(s){ return '<li>'+T(s)+'</li>'; }).join("")+'</ol>';
      card.appendChild(corr);
    }
    g.appendChild(card);
  });
  w.appendChild(g);

  var act = el("div","row"); act.style.marginTop="24px";
  var re = el("button","btn pri","Refaire un contrôle");
  re.onclick=function(){ ctl.phase="reglage"; ctl.bilan=null; window.RENDER(); };
  var rev = el("button","btn","Aller réviser les ratés");
  rev.onclick=function(){ ctl.phase="reglage"; ctl.bilan=null; window.GOTO({page:"revoir"}); };
  act.appendChild(re); act.appendChild(rev);
  w.appendChild(act);
  return w;
}
})();
