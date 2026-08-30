/* =====================================================================
   Vidéos de cours
   ---------------------------------------------------------------------
   Deux façons d'avoir une vidéo dans le cahier :

   - un bloc {t:"video", url:"…"} écrit directement dans un chapitre ;
   - un lien collé depuis l'application, rangé avec la progression et
     donc partagé entre les appareils.

   Aucun lien n'est fourni d'avance : une adresse inventée mène à une
   page morte, ce qui est pire que pas de vidéo du tout. C'est celui qui
   connaît la chaîne ou le cours filmé qui colle son adresse.

   Seuls quelques hébergeurs sont acceptés, et YouTube passe par son
   domaine sans cookie. Une vidéo demande une connexion : hors ligne,
   le cadre affiche simplement le titre et le lien.
   ===================================================================== */
(function(){
"use strict";
var A = window.APP, el = A.el, T = A.T, S = A.S;

if(!S.videos) S.videos = {};

/* ---------------------------------------------------------------
   Reconnaissance de l'adresse
   Renvoie {mode:"cadre"|"fichier", src, hote} ou null si l'adresse
   n'est pas d'une source acceptée.
   --------------------------------------------------------------- */
function analyser(url){
  var u = String(url || "").trim();
  if(!/^https?:\/\//i.test(u)) return null;

  var debut = 0;                                   // démarrage en secondes
  var mt = u.match(/[?&#]t=(\d+)m(\d+)s|[?&#](?:t|start)=(\d+)/i);
  if(mt) debut = mt[3] ? +mt[3] : (+mt[1])*60 + (+mt[2]);

  var m;
  // YouTube, sous toutes ses formes
  m = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i);
  if(m) return { mode:"cadre", hote:"YouTube",
    src:"https://www.youtube-nocookie.com/embed/"+m[1]+"?rel=0"+(debut?"&start="+debut:"") };

  // Vimeo
  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if(m) return { mode:"cadre", hote:"Vimeo",
    src:"https://player.vimeo.com/video/"+m[1]+(debut?"#t="+debut+"s":"") };

  // Lumni et les autres portails éducatifs publics passent par leur lecteur
  m = u.match(/^https:\/\/(?:www\.)?(lumni\.fr|dailymotion\.com|geo\.dailymotion\.com)\//i);
  if(m && /dailymotion/i.test(u)){
    var d = u.match(/dailymotion\.com\/(?:video\/|embed\/video\/)([A-Za-z0-9]+)/i);
    if(d) return { mode:"cadre", hote:"Dailymotion",
      src:"https://www.dailymotion.com/embed/video/"+d[1] };
  }

  // un fichier vidéo posé à côté de l'application, ou sur un serveur
  if(/\.(mp4|webm|ogv|ogg)(\?.*)?$/i.test(u)) return { mode:"fichier", hote:"fichier vidéo", src:u };

  return null;
}

/* ---------------------------------------------------------------
   Le lecteur lui-même
   --------------------------------------------------------------- */
function lecteur(v){
  var info = analyser(v.url);
  var boite = el("div","videoBoite");

  var titre = el("div","videoTitre", T(v.titre || "Vidéo"));
  boite.appendChild(titre);

  if(!info){
    boite.appendChild(el("div","callout co-piege",
      '<div class="ct">Adresse non reconnue</div><p class="small">Le cahier accepte les liens YouTube, Vimeo, Dailymotion, '+
      'et les fichiers vidéo (.mp4, .webm). Vérifie l’adresse, ou copie-la depuis la barre du navigateur '+
      'pendant que la vidéo est ouverte.</p>'));
    var brut = el("a", "small", A.esc(v.url));
    brut.href = v.url; brut.target = "_blank"; brut.rel = "noopener noreferrer";
    boite.appendChild(brut);
    return boite;
  }

  var cadre = el("div","videoCadre");
  if(info.mode === "fichier"){
    var vid = document.createElement("video");
    vid.src = info.src; vid.controls = true; vid.preload = "none";
    vid.setAttribute("playsinline", "");
    cadre.appendChild(vid);
  } else {
    var f = document.createElement("iframe");
    f.src = info.src;
    f.title = v.titre || "Vidéo de cours";
    f.loading = "lazy";
    // YouTube refuse l'affichage sans référent (erreur 153) : on envoie
    // l'origine seule, ce qui suffit à l'autorisation sans en dire plus.
    f.referrerPolicy = "origin";
    f.allow = "accelerometer; encrypted-media; picture-in-picture; fullscreen";
    f.setAttribute("allowfullscreen", "");
    cadre.appendChild(f);
  }
  boite.appendChild(cadre);

  if(v.note) boite.appendChild(el("div","videoNote", T(v.note)));
  var pied = el("div","videoPied");
  pied.innerHTML = '<span class="tag">'+A.esc(info.hote)+'</span>';
  boite.appendChild(pied);
  return boite;
}

/* bloc {t:"video"} écrit dans le contenu d'un chapitre */
window.VIDEO_BLOC = function(b){ return lecteur(b); };

/* ---------------------------------------------------------------
   Les vidéos ajoutées depuis l'application, chapitre par chapitre
   --------------------------------------------------------------- */
function liste(chapId){ return (S.videos && S.videos[chapId]) || []; }

window.VIDEOS_ZONE = function(chapId, titreChap){
  var zone = el("div");
  zone.style.marginTop = "40px";

  var vs = liste(chapId);
  var head = el("div","secHead");
  head.innerHTML = '<span class="n">▶</span><h2>Vidéos du chapitre</h2>';
  zone.appendChild(head);

  var intro = el("p","muted small");
  intro.style.margin = "10px 0 16px";
  intro.style.maxWidth = "62ch";
  intro.textContent = vs.length
    ? "Les vidéos que tu as ajoutées pour ce chapitre. Elles te suivent d’un appareil à l’autre."
    : "Aucune vidéo pour l’instant. Colle ici le lien d’une vidéo qui explique bien ce chapitre — "
      + "une capsule de ta prof, une vidéo de révision — et elle restera rangée avec le cours.";
  zone.appendChild(intro);

  vs.forEach(function(v, i){
    var boite = lecteur(v);
    var sup = el("button","btn gho sm","Retirer");
    sup.style.marginTop = "8px";
    sup.onclick = function(){
      if(!confirm("Retirer cette vidéo du chapitre ?")) return;
      S.videos[chapId].splice(i, 1);
      if(!S.videos[chapId].length) delete S.videos[chapId];
      A.save(); window.RENDER();
    };
    boite.appendChild(sup);
    zone.appendChild(boite);
  });

  /* --- le formulaire d'ajout --- */
  var carte = el("div","card pad");
  carte.style.marginTop = vs.length ? "18px" : "0";
  carte.appendChild(el("div","eyebrow","Ajouter une vidéo"));

  var champUrl = el("input","inp");
  champUrl.type = "url";
  champUrl.placeholder = "Colle ici l’adresse de la vidéo…";
  champUrl.style.marginTop = "12px";
  champUrl.style.fontFamily = "var(--f-body)";
  champUrl.style.fontSize = "14.5px";
  champUrl.style.width = "100%";
  carte.appendChild(champUrl);

  var champTitre = el("input","inp");
  champTitre.type = "text";
  champTitre.placeholder = "Un titre, pour t’y retrouver (facultatif)";
  champTitre.style.marginTop = "10px";
  champTitre.style.fontFamily = "var(--f-body)";
  champTitre.style.fontSize = "14.5px";
  champTitre.style.width = "100%";
  carte.appendChild(champTitre);

  var apercu = el("div");
  apercu.style.marginTop = "12px";
  carte.appendChild(apercu);

  var ligne = el("div","row");
  ligne.style.marginTop = "12px";
  var bAdd = el("button","btn pri","Ajouter au chapitre");
  ligne.appendChild(bAdd);
  var etat = el("div","small muted");
  ligne.appendChild(etat);
  carte.appendChild(ligne);

  /* l'aperçu se met à jour à la frappe : on voit tout de suite si le lien passe */
  champUrl.addEventListener("input", function(){
    apercu.innerHTML = "";
    var u = champUrl.value.trim();
    if(!u){ etat.textContent = ""; return; }
    var info = analyser(u);
    if(info){
      etat.textContent = "Lien reconnu (" + info.hote + ").";
      apercu.appendChild(lecteur({ titre: champTitre.value || "Aperçu", url: u }));
    } else {
      etat.textContent = "Adresse non reconnue — YouTube, Vimeo, Dailymotion ou un fichier .mp4.";
    }
  });

  bAdd.onclick = function(){
    var u = champUrl.value.trim();
    if(!u){ champUrl.focus(); return; }
    if(!analyser(u)){ A.toast("Cette adresse n’est pas reconnue."); return; }
    if(!S.videos[chapId]) S.videos[chapId] = [];
    S.videos[chapId].push({
      id: A.uid(),
      titre: champTitre.value.trim() || ("Vidéo — " + (titreChap || "chapitre")),
      url: u
    });
    A.save();
    A.toast("Vidéo ajoutée au chapitre.");
    window.RENDER();
  };

  zone.appendChild(carte);
  return zone;
};

/* combien de vidéos en tout, pour l'accueil */
window.VIDEOS_TOTAL = function(){
  var n = 0;
  for(var k in (S.videos || {})) n += S.videos[k].length;
  return n;
};
})();
