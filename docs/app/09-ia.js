/* =====================================================================
   Couche IA — active uniquement quand la page est servie par le serveur
   local (voir serveur/server.js). En Artifact, /api/ping échoue et
   l'application reste strictement déterministe et hors-ligne.
   ===================================================================== */
(function(){
"use strict";
var A = window.APP, T=A.T, el=A.el;

var CODE_KEY = "cahier-physique.code";
function code(){ try{ return localStorage.getItem(CODE_KEY)||""; }catch(e){ return ""; } }
function setCode(c){ try{ localStorage.setItem(CODE_KEY,c); }catch(e){} }

function api(route, corps){
  return fetch(route, {
    method:"POST",
    headers:{ "Content-Type":"application/json", "X-Code": code() },
    body: JSON.stringify(corps)
  }).then(function(r){
    return r.json().then(function(j){
      if(!r.ok) throw new Error(j && j.erreur ? j.erreur : ("erreur "+r.status));
      return j;
    }, function(){ throw new Error("réponse illisible du serveur"); });
  });
}

/* ---------------------------------------------------------------
   Détection : le serveur est-il là ?
   --------------------------------------------------------------- */
function sonder(){
  return fetch("/api/ping", { headers:{ "X-Code": code() } })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(j){
      if(!j || !j.ok) return;
      window.IA_MODELE = j.modele || "";
      if(j.codeRequis && !j.codeOk){
        window.IA_ACTIVE = false;
        demanderCode(!!code());     // code absent, ou code refusé
        return;
      }
      window.IA_ACTIVE = true;
      if(window.RENDER) window.RENDER();
      verifierStockage();           // prévient si la progression n'est pas durable
      return charger();             // le serveur détient la progression de référence
    })
    .catch(function(){ /* mode hors-ligne : rien à faire */ });
}
sonder();

/* Auto-vérification du stockage : l'élève doit savoir si son travail est
   réellement conservé. Le résultat est affiché dans « Mes cours ». */
window.IA_STOCKAGE = null;
function verifierStockage(){
  return fetch("/api/diag", { headers:{ "X-Code": code() } })
    .then(function(r){ return r.json(); })
    .then(function(j){
      window.IA_STOCKAGE = j;
      if(j && j.erreur){
        A.toast("Attention : ta progression n’est pas enregistrée sur le serveur.");
      } else if(j && /fichier/.test(j.stockage||"")){
        A.toast("Attention : progression en fichier local, elle peut être perdue.");
      }
      var z = document.getElementById("etatStockage");
      if(z) z.innerHTML = texteStockage();
      return j;
    })
    .catch(function(){ window.IA_STOCKAGE = { erreur:"vérification impossible" }; });
}
window.texteStockage = texteStockage;
function texteStockage(){
  var j = window.IA_STOCKAGE;
  if(!j) return '<span class="muted">vérification en cours…</span>';
  if(j.erreur)
    return '<span style="color:var(--rouge)">✗ La progression n’est pas enregistrée sur le serveur — '+
           A.esc(j.erreur)+'</span>';
  if(/fichier/.test(j.stockage||""))
    return '<span style="color:var(--ambre)">⚠ Progression dans un fichier sur le serveur : '+
           'elle sera perdue si l’hébergeur redémarre. Renseigne les deux variables Upstash.</span>';
  return '<span style="color:var(--vert)">✓ Progression conservée dans l’entrepôt, '+
         'synchronisée entre tes appareils.</span>';
}
window.IA_DIAG = verifierStockage;

/* Écran de saisie du code, affiché seulement si le serveur en exige un */
function demanderCode(refuse){
  if(document.getElementById("volet-code")) return;
  var volet = el("div");
  volet.id = "volet-code";
  volet.style.cssText = "position:fixed;inset:0;z-index:300;background:var(--paper);"+
    "display:grid;place-items:center;padding:24px";
  var carte = el("div","card pad");
  carte.style.cssText = "max-width:420px;width:100%";
  carte.innerHTML =
    '<div class="eyebrow" style="margin-bottom:8px">Cahier de physique-chimie</div>'+
    '<div style="font-family:var(--f-disp);font-weight:700;font-size:20px;margin-bottom:6px">'+
      (refuse ? "Ce code ne convient pas" : "Code d’accès")+'</div>'+
    '<p class="small muted">'+
      (refuse ? "Vérifie le code et réessaie."
              : "Entre le code d’accès pour activer l’aide de Claude. Il n’est demandé qu’une fois sur cet appareil.")+
    '</p>';
  var champ = el("input","inp");
  champ.type = "password";
  champ.autocomplete = "off";
  champ.placeholder = "Code d’accès";
  champ.style.cssText = "width:100%;margin-top:14px;font-family:var(--f-body);font-size:16px";
  var msg = el("div","small"); msg.style.cssText="color:var(--rouge);margin-top:8px;min-height:18px";
  var rangee = el("div","row"); rangee.style.marginTop="12px";
  var valider = el("button","btn pri","Valider");
  var sans = el("button","btn gho","Continuer sans l’IA");
  rangee.appendChild(valider); rangee.appendChild(sans);

  function essayer(){
    var v = champ.value.trim();
    if(!v){ champ.focus(); return; }
    valider.disabled = true; valider.textContent = "Vérification…";
    setCode(v);
    fetch("/api/ping", { headers:{ "X-Code": v } })
      .then(function(r){ return r.json(); })
      .then(function(j){
        if(j && j.codeOk){
          volet.remove();
          window.IA_ACTIVE = true;
          if(window.RENDER) window.RENDER();
          verifierStockage();
          charger();
          A.toast("Aide de Claude activée.");
        } else {
          setCode("");
          msg.textContent = "Code refusé.";
          valider.disabled = false; valider.textContent = "Valider";
          champ.value = ""; champ.focus();
        }
      })
      .catch(function(){
        msg.textContent = "Serveur injoignable.";
        valider.disabled = false; valider.textContent = "Valider";
      });
  }
  valider.onclick = essayer;
  champ.addEventListener("keydown", function(e){ if(e.key==="Enter") essayer(); });
  sans.onclick = function(){ volet.remove(); };

  carte.appendChild(champ); carte.appendChild(msg); carte.appendChild(rangee);
  volet.appendChild(carte);
  document.body.appendChild(volet);
  setTimeout(function(){ champ.focus(); }, 50);
}

/* ---------------------------------------------------------------
   Progression partagée entre les appareils
   Le serveur garde un seul cahier. Au démarrage on adopte sa version
   si elle est plus récente ; ensuite chaque changement y est renvoyé.
   --------------------------------------------------------------- */
var minuteur = null, adoption = false, dernierEchec = false;

function charger(){
  return fetch("/api/etat", { headers:{ "X-Code": code() } })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(j){
      if(!j || !j.etat) return pousser();          // serveur vide : on l'amorce
      if(!(j.maj > (A.S.maj || 0))) return pousser(); // le local est plus récent
      adopter(j);
    })
    .catch(function(){});
}

function adopter(j){
  adoption = true;
  for(var k in j.etat) A.S[k] = j.etat[k];
  A.S.maj = j.maj;
  A.save(true);                 // enregistre sans renvoyer au serveur
  A.applyTheme();
  adoption = false;
  if(window.RENDER) window.RENDER();
}

function pousser(){
  if(!window.IA_ACTIVE) return;
  return fetch("/api/etat", {
    method:"PUT",
    headers:{ "Content-Type":"application/json", "X-Code": code() },
    body: JSON.stringify({ maj: A.S.maj || Date.now(), etat: A.S })
  }).then(function(r){
    if(r.status === 409){                 // un autre appareil a fait mieux
      return r.json().then(adopter);
    }
    if(!r.ok) throw new Error("sync");
    if(dernierEchec){ dernierEchec = false; A.toast("Progression synchronisée."); }
  }).catch(function(){
    if(!dernierEchec){
      dernierEchec = true;
      A.toast("Progression enregistrée sur cet appareil seulement.");
    }
  });
}

/* appelé par A.save() à chaque changement, regroupé pour éviter le pilonnage */
window.APRES_SAVE = function(){
  if(adoption || !window.IA_ACTIVE) return;
  clearTimeout(minuteur);
  minuteur = setTimeout(pousser, 1500);
};

/* on n'attend pas 1,5 s si la page se ferme ou passe en arrière-plan */
document.addEventListener("visibilitychange", function(){
  if(document.visibilityState === "hidden" && minuteur){
    clearTimeout(minuteur); minuteur = null; pousser();
  }
});

/* ---------------------------------------------------------------
   1. « Expliquer autrement » sous chaque exercice corrigé
   --------------------------------------------------------------- */
window.IA_BOUTON = function(exo, actions, box, ok){
  if(!window.IA_ACTIVE) return;
  var b = el("button","btn sm", ok ? "Approfondir" : "Expliquer autrement");
  b.onclick = function(){
    b.disabled = true; b.textContent = "Claude réfléchit…";
    var zone = el("div","fb"); zone.style.background="var(--surface2)";
    zone.innerHTML = '<div class="fbt" style="color:var(--ink2)">Explication de Claude</div>'+
                     '<p class="muted">Rédaction en cours…</p>';
    box.insertBefore(zone, actions);
    api("/api/expliquer", {
      enonce: exo.enonce,
      correction: exo.corr,
      reussi: !!ok,
      question: ok ? "Explique pourquoi cette méthode marche, et dans quels autres cas elle s'applique."
                   : "Je n'ai pas compris la correction. Reprends-la autrement, plus lentement, avec une image ou un exemple différent."
    }).then(function(j){
      zone.innerHTML = '<div class="fbt" style="color:var(--ink2)">Explication de Claude</div>'+
                       corpsTexte(j.texte);
      b.remove();
    }).catch(function(e){
      zone.className = "fb bad";
      zone.innerHTML = '<div class="fbt">Explication indisponible</div><p>'+A.esc(e.message)+'</p>';
      b.disabled=false; b.textContent="Réessayer";
    });
  };
  actions.appendChild(b);
};

/* rendu d'une réponse texte : paragraphes + notation maths du cahier */
function corpsTexte(t){
  return String(t||"").split(/\n{2,}/).map(function(p){
    p = p.trim(); if(!p) return "";
    if(/^[-•*]\s/.test(p)){
      return '<ul class="ul">'+p.split(/\n/).map(function(l){
        return '<li>'+T(l.replace(/^[-•*]\s*/,""))+'</li>';
      }).join("")+'</ul>';
    }
    return '<p style="margin-top:8px">'+T(p)+'</p>';
  }).join("");
}

/* ---------------------------------------------------------------
   2. Génération directe d'une fiche à partir d'un cours importé
   --------------------------------------------------------------- */
window.IA_GENERER_FICHE = function(draft, cb){
  api("/api/fiche", { titre:draft.titre, texte:draft.texte, image:draft.image,
                       // le PDF part tel quel : Claude le lit lui-même, y compris scanné
                       pdf:draft.pdf })
    .then(function(j){ cb(null, j.fiche); })
    .catch(function(e){ cb(e.message); });
};

/* ---------------------------------------------------------------
   3. Page « Corriger une photo »
   --------------------------------------------------------------- */
var photo = { image:null, question:"", reponse:null, enCours:false };

window.VUE_PHOTO = function(){
  var w = window.WRAPDIV();
  w.innerHTML =
    '<div class="eyebrow">Correction de ton travail</div>'+
    '<h1 style="font-size:31px;margin:8px 0 8px">Photographie ton exercice</h1>'+
    '<p class="muted" style="max-width:62ch">Prends en photo ce que tu as écrit sur ton cahier — même raturé, même incomplet. Claude lit ton raisonnement et te dit <b>à quelle ligne</b> ça dérape, sans donner la réponse tout de suite.</p>';

  var c1 = el("div","card pad"); c1.style.marginTop="22px";
  if(!photo.image){
    var drop = el("div","drop");
    drop.innerHTML = '<div style="font-family:var(--f-disp);font-weight:700;font-size:17px">Dépose une photo, ou clique pour la choisir</div>'+
      '<p class="small muted" style="margin-top:6px">Sur téléphone, cela ouvre directement l’appareil photo.</p>';
    var fi = el("input"); fi.type="file"; fi.accept="image/*";
    fi.setAttribute("capture","environment"); fi.className="hidden";
    drop.appendChild(fi);
    drop.onclick=function(){ fi.click(); };
    drop.addEventListener("dragover",function(e){ e.preventDefault(); drop.classList.add("over"); });
    drop.addEventListener("dragleave",function(){ drop.classList.remove("over"); });
    drop.addEventListener("drop",function(e){
      e.preventDefault(); drop.classList.remove("over");
      if(e.dataTransfer.files[0]) charger(e.dataTransfer.files[0]);
    });
    fi.onchange=function(){ if(fi.files[0]) charger(fi.files[0]); };
    c1.appendChild(drop);
  } else {
    var im = el("img","imgPrev"); im.src=photo.image; im.alt="Ton exercice";
    c1.appendChild(im);
    var rr = el("div","row"); rr.style.marginTop="12px";
    var bc = el("button","btn sm","Changer de photo");
    bc.onclick=function(){ photo.image=null; photo.reponse=null; window.RENDER(); };
    rr.appendChild(bc);
    c1.appendChild(rr);
  }
  w.appendChild(c1);

  if(photo.image){
    var c2 = el("div","card pad"); c2.style.marginTop="14px";
    c2.innerHTML = '<div class="eyebrow" style="margin-bottom:8px">Ta question (facultatif)</div>';
    var ta = el("textarea","inp");
    ta.style.minHeight="80px";
    ta.placeholder="Ex. : je ne comprends pas pourquoi je ne trouve pas le bon discriminant.";
    ta.value = photo.question;
    ta.oninput=function(){ photo.question=ta.value; };
    c2.appendChild(ta);
    var bEnv = el("button","btn pri","Envoyer à Claude");
    bEnv.style.marginTop="12px";
    bEnv.disabled = photo.enCours;
    bEnv.onclick=function(){
      photo.enCours = true; bEnv.disabled=true; bEnv.textContent="Claude lit ta copie…";
      api("/api/photo", { image:photo.image, question:photo.question })
        .then(function(j){ photo.reponse=j.texte; photo.enCours=false; window.RENDER(); })
        .catch(function(e){ photo.enCours=false; photo.reponse="ERREUR:"+e.message; window.RENDER(); });
    };
    c2.appendChild(bEnv);
    w.appendChild(c2);
  }

  if(photo.reponse){
    var err = photo.reponse.indexOf("ERREUR:")===0;
    var c3 = el("div", err ? "fb bad" : "card pad");
    c3.style.marginTop="14px";
    if(err){
      c3.innerHTML = '<div class="fbt">Correction indisponible</div><p>'+
        A.esc(photo.reponse.slice(7))+'</p>';
    } else {
      c3.innerHTML = '<div class="row" style="margin-bottom:10px"><span class="tag b">Correction</span></div>'+
        '<div class="lesson">'+corpsTexte(photo.reponse)+'</div>';
    }
    w.appendChild(c3);
  }

  w.appendChild(el("div","callout co-piege",
    '<div class="ct">À garder en tête</div><p>Cette correction est rédigée par un modèle de langage : elle est très utile pour comprendre, mais elle peut se tromper sur un calcul. '+
    'Les '+(window.COURS||[]).reduce(function(n,c){ return n+c.exos.length; },0)+
    ' exercices des chapitres, eux, sont vérifiés. En cas de désaccord entre les deux, c’est le cahier qui a raison.</p>'));

  function charger(file){
    if(file.size > 6*1024*1024){ A.toast("Photo trop lourde (6 Mo maximum)."); return; }
    var fr = new FileReader();
    fr.onload=function(){ photo.image=fr.result; photo.reponse=null; window.RENDER(); };
    fr.readAsDataURL(file);
  }
  return w;
};

/* ---------------------------------------------------------------
   4. Saisie du code d'accès si le serveur le refuse
   --------------------------------------------------------------- */
window.IA_CODE = function(){ demanderCode(false); };
})();
