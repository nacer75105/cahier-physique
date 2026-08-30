/* =====================================================================
   Tableau de bord — ce que les données déjà enregistrées permettent de
   dire, sans rien ajouter au suivi : progression par chapitre, activité
   des trente derniers jours, réussite du premier coup, contrôles passés.
   ===================================================================== */
(function(){
"use strict";
var A = window.APP, el = A.el, S = A.S;

function chapitres(){ return window.LES_COURS || []; }

/* --- statistiques d'un chapitre --- */
function bilanChapitre(c){
  var st = A.chapState(c.id), e = st.exos || {};
  var tentes = 0, reussis = 0, premierCoup = 0;
  c.exos.forEach(function(x){
    var r = e[x.id];
    if(!r) return;
    tentes++;
    if(r.ok){ reussis++; if(r.tries === 1) premierCoup++; }
  });
  var cartes = 0;
  for(var k in S.srs) if(S.srs[k].chapId === c.id) cartes++;
  return {
    lu: st.lu.length, sections: c.sections.length,
    tentes: tentes, total: c.exos.length,
    reussis: reussis, premierCoup: premierCoup,
    taux: tentes ? Math.round(100*reussis/tentes) : null,
    cartes: cartes,
    pct: A.pct(st.lu.length + reussis, c.sections.length + c.exos.length)
  };
}

/* --- toutes les tentatives horodatées, tous chapitres confondus --- */
function tentatives(){
  var out = [];
  chapitres().forEach(function(c){
    var e = A.chapState(c.id).exos || {};
    c.exos.forEach(function(x){
      var r = e[x.id];
      if(r && r.ts) out.push({ quand:new Date(r.ts), ok:r.ok, essais:r.tries,
                               niveau:x.niveau || 1, chap:c.titre });
    });
  });
  return out.sort(function(a,b){ return a.quand - b.quand; });
}

/* --- petit graphique en barres, en HTML pur --- */
function barres(valeurs, etiquettes, couleur){
  var max = Math.max.apply(null, valeurs.concat([1]));
  var g = el("div","statBarres");
  valeurs.forEach(function(v,i){
    var col = el("div","statCol");
    var b = el("div","statBar");
    b.style.height = Math.max(2, Math.round(100*v/max)) + "%";
    b.style.background = "var(--"+(v ? (couleur||"bleu") : "line2")+")";
    b.title = etiquettes[i] + " : " + v;
    col.appendChild(b);
    if(etiquettes[i]) col.appendChild(el("div","statEtiq", etiquettes[i]));
    g.appendChild(col);
  });
  return g;
}

window.VUE_STATS = function(){
  var w = window.WRAPDIV();
  var cs = chapitres();
  var tent = tentatives();

  w.innerHTML =
    '<div class="eyebrow">Suivi</div>'+
    '<h1 style="font-size:31px;margin:8px 0 8px">Où tu en es</h1>'+
    '<p class="muted" style="max-width:62ch">Tout ce qui suit est calculé à partir de ton travail réel. '+
    'Rien n\'est estimé : si une case est vide, c\'est que le chapitre n\'a pas encore été abordé.</p>';

  /* ---------- vue d'ensemble ---------- */
  var fait = 0, total = 0, reussis = 0, tentes = 0, premier = 0;
  cs.forEach(function(c){
    var b = bilanChapitre(c);
    fait += b.lu + b.reussis; total += b.sections + b.total;
    reussis += b.reussis; tentes += b.tentes; premier += b.premierCoup;
  });
  var entr = S.entrain || {};
  var res = el("div","card pad"); res.style.marginTop="22px";
  res.innerHTML =
    '<div class="row" style="justify-content:space-between;align-items:flex-end">'+
      '<div class="stat"><div class="n">'+A.pct(fait,total)+'%</div><div class="l">Programme parcouru</div></div>'+
      '<div class="stat"><div class="n">'+reussis+'</div><div class="l">Exercices réussis</div></div>'+
      '<div class="stat"><div class="n">'+(tentes ? Math.round(100*reussis/tentes) : 0)+'%</div><div class="l">Taux de réussite</div></div>'+
      '<div class="stat"><div class="n">'+(entr.faits||0)+'</div><div class="l">Exercices générés faits</div></div>'+
    '</div><div class="bar" style="margin-top:16px"><i style="width:'+A.pct(fait,total)+'%"></i></div>';
  w.appendChild(res);

  if(!tentes && !(entr.faits||0) && !(S.controles||[]).length){
    var vide = el("div","empty"); vide.style.marginTop="20px";
    vide.innerHTML = '<div class="big">Rien à afficher pour l\'instant</div>'+
      '<p>Fais quelques exercices : ce tableau se remplira tout seul.</p>';
    w.appendChild(vide);
    return w;
  }

  /* ---------- chapitre par chapitre ---------- */
  var h1 = el("div","secHead");
  h1.innerHTML = '<span class="n">1</span><h2>Chapitre par chapitre</h2>';
  w.appendChild(h1);
  var grille = el("div","grid"); grille.style.marginTop="16px";
  cs.forEach(function(c){
    var b = bilanChapitre(c);
    var ligne = el("button","statLigne");
    var couleur = b.taux === null ? "line2" : (b.taux >= 70 ? "vert" : (b.taux >= 40 ? "ambre" : "rouge"));
    ligne.innerHTML =
      '<div class="statNum">'+c.n+'</div>'+
      '<div class="statCorps">'+
        '<div class="statTitre">'+A.esc(c.titre)+'</div>'+
        '<div class="statDetail">'+
          b.lu+' / '+b.sections+' parties lues &nbsp;·&nbsp; '+
          b.reussis+' / '+b.total+' exercices réussis'+
          (b.premierCoup ? ' &nbsp;·&nbsp; '+b.premierCoup+' du premier coup' : '')+
          (b.cartes ? ' &nbsp;·&nbsp; <span style="color:var(--rouge)">'+A.plural(b.cartes,"carte")+' à revoir</span>' : '')+
        '</div>'+
        '<div class="bar" style="margin-top:8px"><i style="width:'+b.pct+'%"></i></div>'+
      '</div>'+
      '<div class="statTaux" style="color:var(--'+couleur+')">'+
        (b.taux === null ? '—' : b.taux+'%')+
        '<div class="statTauxL">réussite</div></div>';
    ligne.onclick = function(){ window.GOTO({page:"chap", chap:c.id, onglet:"cours"}); };
    grille.appendChild(ligne);
  });
  w.appendChild(grille);
  w.appendChild(el("p","small muted",
    "Le taux de réussite ne compte que les exercices déjà tentés. Un tiret signifie que le chapitre n'a pas encore été travaillé."));

  /* ---------- activité récente ---------- */
  if(tent.length){
    var h2 = el("div","secHead");
    h2.innerHTML = '<span class="n">2</span><h2>Ces trois dernières semaines</h2>';
    w.appendChild(h2);
    var jours = [], etiq = [], i, d, n;
    for(i = 20; i >= 0; i--){
      d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - i);
      var fin = new Date(d); fin.setDate(fin.getDate() + 1);
      n = tent.filter(function(t){ return t.quand >= d && t.quand < fin; }).length;
      jours.push(n);
      etiq.push(i === 0 ? "auj." : (i === 20 || i === 10 ? d.getDate()+"/"+(d.getMonth()+1) : ""));
    }
    var carte = el("div","card pad"); carte.style.marginTop="16px";
    carte.appendChild(barres(jours, etiq, "bleu"));
    var actifs = jours.filter(function(x){ return x > 0; }).length;
    carte.appendChild(el("div","small muted",
      actifs ? "Tu as travaillé <b>"+actifs+" jour"+(actifs>1?"s":"")+"</b> sur les 21 derniers. "+
               "La régularité compte davantage que la durée des séances."
             : "Aucune activité enregistrée sur cette période."));
    w.appendChild(carte);
  }

  /* ---------- réussite du premier coup ---------- */
  if(tentes){
    var h3 = el("div","secHead");
    h3.innerHTML = '<span class="n">3</span><h2>Du premier coup, ou après réflexion ?</h2>';
    w.appendChild(h3);
    var deuxieme = reussis - premier, rates = tentes - reussis;
    var c3 = el("div","card pad"); c3.style.marginTop="16px";
    c3.appendChild(el("div","statPart",
      '<span style="flex:'+Math.max(premier,0.01)+';background:var(--vert)"></span>'+
      '<span style="flex:'+Math.max(deuxieme,0.01)+';background:var(--ambre)"></span>'+
      '<span style="flex:'+Math.max(rates,0.01)+';background:var(--rouge)"></span>'));
    c3.appendChild(el("div","statLegende",
      '<span><i style="background:var(--vert)"></i>'+premier+' du premier coup</span>'+
      '<span><i style="background:var(--ambre)"></i>'+deuxieme+' au second essai</span>'+
      '<span><i style="background:var(--rouge)"></i>'+rates+' non réussis</span>'));
    c3.appendChild(el("div","small muted",
      premier >= reussis*0.7 && reussis > 3
        ? "La plupart de tes réussites sont immédiates : les notions sont acquises. Tu peux passer à des chapitres plus difficiles."
        : (rates > reussis
            ? "Beaucoup d'exercices restent à reprendre. La page <b>À revoir</b> te les ressert au bon moment — c'est là qu'il faut passer du temps."
            : "Tu réussis souvent au second essai : c'est bon signe, tu comprends l'erreur quand elle t'est expliquée. Vise maintenant le premier coup.")));
    w.appendChild(c3);
  }

  /* ---------- contrôles passés ---------- */
  var ctl = S.controles || [];
  if(ctl.length){
    var h4 = el("div","secHead");
    h4.innerHTML = '<span class="n">4</span><h2>Tes contrôles</h2>';
    w.appendChild(h4);
    var c4 = el("div","card pad"); c4.style.marginTop="16px";
    var notes = ctl.slice(0, 12).reverse();
    c4.appendChild(barres(
      notes.map(function(x){ return x.note; }),
      notes.map(function(x){ return new Date(x.date).getDate()+"/"+(new Date(x.date).getMonth()+1); }),
      "ambre"));
    var moy = Math.round(10*notes.reduce(function(a,x){ return a+x.note; },0)/notes.length)/10;
    var tendance = notes.length >= 3
      ? (notes[notes.length-1].note > notes[0].note ? "en progression" : (notes[notes.length-1].note < notes[0].note ? "en baisse" : "stable"))
      : null;
    c4.appendChild(el("div","small muted",
      "Moyenne : <b>"+String(moy).replace(".",",")+" / 20</b> sur "+A.plural(notes.length,"contrôle")+
      (tendance ? " &nbsp;·&nbsp; tendance "+tendance : "")+". Chaque barre est un contrôle, de gauche à droite dans l'ordre."));
    w.appendChild(c4);
  }
  return w;
};
})();
