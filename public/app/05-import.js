/* =====================================================================
   Import de cours personnels : texte, PDF, document Word, image
   + passerelle vers Claude pour produire une fiche complète
   ===================================================================== */
(function(){
"use strict";
var A = window.APP, T=A.T, el=A.el, $=A.$, S=A.S;

/* ---------- brouillon en cours d'import ---------- */
var draft = { titre:"", source:"texte", texte:"", image:null, pdf:null, qualite:null };


/* ---------- extraction Word (.docx) et LibreOffice (.odt) ----------
   Un .docx est une archive ZIP qui contient un fichier XML. On l'ouvre
   sans bibliothèque externe : lecture de l'index du ZIP, puis
   décompression par DecompressionStream, présent dans les navigateurs
   récents. Le vieux format .doc (binaire, d'avant 2007) n'est pas
   lisible ainsi : il faut le réenregistrer en .docx ou en PDF.
   ------------------------------------------------------------------ */
function u16(dv, o){ return dv.getUint16(o, true); }
function u32(dv, o){ return dv.getUint32(o, true); }

/* renvoie le contenu brut d'un fichier de l'archive, ou null */
function zipEntree(buf, nomVoulu){
  var dv = new DataView(buf), u8 = new Uint8Array(buf);
  // l'index du ZIP se trouve à la fin : on cherche sa signature en remontant
  var fin = -1;
  for(var i = buf.byteLength - 22; i >= 0 && i > buf.byteLength - 66000; i--){
    if(u32(dv, i) === 0x06054b50){ fin = i; break; }
  }
  if(fin < 0) return null;
  var nb = u16(dv, fin + 10), pos = u32(dv, fin + 16);
  for(var k = 0; k < nb; k++){
    if(u32(dv, pos) !== 0x02014b50) return null;
    var methode = u16(dv, pos + 10);
    var taille  = u32(dv, pos + 20);          // taille compressée
    var lnom    = u16(dv, pos + 28);
    var lextra  = u16(dv, pos + 30);
    var lcom    = u16(dv, pos + 32);
    var debut   = u32(dv, pos + 42);          // position de l'en-tête local
    var nom = "";
    for(var j = 0; j < lnom; j++) nom += String.fromCharCode(u8[pos + 46 + j]);
    if(nom === nomVoulu){
      // l'en-tête local répète le nom et les extras, avec des longueurs à lui
      var ln2 = u16(dv, debut + 26), lx2 = u16(dv, debut + 28);
      var d0 = debut + 30 + ln2 + lx2;
      return { data: u8.subarray(d0, d0 + taille), methode: methode };
    }
    pos += 46 + lnom + lextra + lcom;
  }
  return null;
}

function inflater(entree){
  if(entree.methode === 0) return Promise.resolve(entree.data);   // non compressé
  if(typeof DecompressionStream !== "function")
    return Promise.reject(new Error("navigateur trop ancien"));
  var flux = new Blob([entree.data]).stream()
    .pipeThrough(new DecompressionStream("deflate-raw"));
  return new Response(flux).arrayBuffer().then(function(b){ return new Uint8Array(b); });
}

/* le XML de Word vers du texte lisible : un paragraphe par ligne */
function xmlVersTexte(xml){
  return xml
    .replace(/<w:tab[^>]*\/?>/g, " ")
    .replace(/<\/w:p>|<text:p[^>]*\/>|<\/text:p>/g, "\n")
    .replace(/<w:br[^>]*\/?>|<text:line-break[^>]*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extraireDocument(buf){
  var e = zipEntree(buf, "word/document.xml")     // Word
       || zipEntree(buf, "content.xml");          // LibreOffice / OpenOffice
  if(!e) return Promise.reject(new Error("format non reconnu"));
  return inflater(e).then(function(u8){
    return xmlVersTexte(new TextDecoder("utf-8").decode(u8));
  });
}

/* ---------- extraction PDF (sans bibliothèque externe) ---------- */
function latin1(u8){
  var s="", CH=8192;
  for(var i=0;i<u8.length;i+=CH) s+=String.fromCharCode.apply(null,u8.subarray(i,i+CH));
  return s;
}
function unesc(s){
  return s.replace(/\\([nrtbf()\\]|[0-7]{1,3})/g,function(m,g){
    if(g==="n") return "\n"; if(g==="r") return "\n"; if(g==="t") return " ";
    if(g==="b"||g==="f") return "";
    if(g==="("||g===")"||g==="\\") return g;
    return String.fromCharCode(parseInt(g,8));
  });
}
function opsToText(s){
  var res="", re=/\[((?:\\.|[^\]\\])*)\]\s*TJ|\(((?:\\.|[^\\()])*)\)\s*Tj|(T\*|Td|TD|ET)/g, m;
  while((m=re.exec(s))!==null){
    if(m[1]!=null){
      var r2=/\(((?:\\.|[^\\()])*)\)|(-?\d+(?:\.\d+)?)/g, m2;
      while((m2=r2.exec(m[1]))!==null){
        if(m2[1]!=null) res+=unesc(m2[1]);
        else if(parseFloat(m2[2]) < -130) res+=" ";
      }
    } else if(m[2]!=null){ res+=unesc(m[2]); }
    else res+="\n";
  }
  return res;
}
function inflate(u8){
  if(typeof DecompressionStream==="undefined") return Promise.reject();
  function go(fmt){
    var ds=new DecompressionStream(fmt);
    return new Response(new Blob([u8]).stream().pipeThrough(ds)).arrayBuffer();
  }
  return go("deflate").catch(function(){ return go("deflate-raw"); })
    .then(function(ab){ return latin1(new Uint8Array(ab)); });
}
function extrairePdf(buf){
  var bytes=new Uint8Array(buf), raw=latin1(bytes);
  var jobs=[], idx=0;
  while(true){
    var s=raw.indexOf("stream", idx); if(s<0) break;
    var e=raw.indexOf("endstream", s); if(e<0) break;
    var st=s+6;
    if(raw.charAt(st)==="\r") st++;
    if(raw.charAt(st)==="\n") st++;
    jobs.push(bytes.subarray(st,e));
    idx=e+9;
    if(jobs.length>900) break;
  }
  return Promise.all(jobs.map(function(sl){
    return inflate(sl).catch(function(){ return latin1(sl); });
  })).then(function(parts){
    var out=[];
    parts.forEach(function(p){
      if(p && (p.indexOf("Tj")>=0 || p.indexOf("TJ")>=0)) out.push(opsToText(p));
    });
    return nettoyer(out.join("\n"));
  });
}
function nettoyer(t){
  var s = String(t);
  s = s.split("").filter(function(ch){
    var c = ch.charCodeAt(0);
    return c > 31 || c === 9 || c === 10 || c === 13;
  }).join("");
  return s.replace(/\r/g,"\n").replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim();
}
/* qualité de l'extraction : lisible ou charabia ? */
function qualite(t){
  if(!t || t.length<40) return "vide";
  var lettres=(t.match(/[a-zA-ZÀ-ÿ]/g)||[]).length;
  var espaces=(t.match(/ /g)||[]).length;
  if(lettres/t.length < 0.45) return "faible";
  if(espaces/t.length < 0.06) return "faible";
  return "ok";
}

/* ---------- résumé automatique local (fonctionne sans IA) ---------- */
var MOTS_CLES = ["definition","théorème","theoreme","propriété","propriete","remarque",
                 "exemple","méthode","methode","formule","démonstration","demonstration","attention"];
function ficheLocale(texte, titre){
  var lignes = texte.split(/\n+/).map(function(l){return l.trim();}).filter(Boolean);
  var sections=[], cur=null;
  lignes.forEach(function(l){
    var court = l.length<70;
    var numerote = /^([IVX]+[\.\)]|\d+[\.\)]|[A-Z][\.\)])\s/.test(l);
    var majuscules = court && l===l.toUpperCase() && /[A-ZÀ-Ý]/.test(l);
    if((court && numerote) || majuscules){
      cur = { titre:l.replace(/^[IVX\d A-Z]+[\.\)]\s*/,"") || l, paras:[] };
      sections.push(cur);
    } else {
      if(!cur){ cur={ titre:"Contenu du cours", paras:[] }; sections.push(cur); }
      cur.paras.push(l);
    }
  });
  if(!sections.length) sections=[{titre:"Contenu du cours", paras:lignes}];
  var pointsCles=[];
  lignes.forEach(function(l){
    var bas=l.toLowerCase();
    for(var i=0;i<MOTS_CLES.length;i++){
      if(bas.indexOf(MOTS_CLES[i])===0 || bas.indexOf(MOTS_CLES[i]+" ")>=0){
        if(l.length>15 && l.length<320 && pointsCles.length<10) pointsCles.push(l);
        break;
      }
    }
  });
  return {
    resume: sections[0].paras.slice(0,2).join(" ").slice(0,420) || "Fiche construite à partir du document importé.",
    prerequis: [],
    auto: true,
    sections: sections.slice(0,12).map(function(s){
      return { titre:s.titre, idee:"", explication:s.paras.join("\n\n").slice(0,2600),
               formules:[], exemple:null, piege:"" };
    }),
    pointsCles: pointsCles,
    exercices: []
  };
}

/* ---------- le prompt à donner à Claude ---------- */
function prompt(d){
  return [
"Tu es professeur de physique-chimie en classe de Première (spécialité physique-chimie, programme français).",
"À partir du cours ci-dessous, produis une fiche pédagogique complète pour une élève débutante qui a besoin d'explications très simples.",
"",
"Réponds UNIQUEMENT par un objet JSON valide, sans texte avant ni après, sans balises de code, au format exact suivant :",
"",
'{',
'  "titre": "titre court du cours",',
'  "resume": "3 à 5 phrases qui expliquent de quoi parle ce cours et à quoi ça sert",',
'  "prerequis": ["notion supposée connue 1", "notion 2"],',
'  "sections": [',
'    {',
'      "titre": "titre de la partie",',
'      "idee": "l\'idée centrale en une seule phrase très simple",',
'      "explication": "explication détaillée en langage courant, sans jargon inutile",',
'      "formules": [{"titre": "nom de la formule", "x": "la formule", "note": "quand l\'utiliser"}],',
'      "exemple": {"titre": "Exemple guidé", "enonce": "un énoncé concret",',
'                  "etapes": [{"q": "nom de l\'étape", "r": "ce qu\'on fait et pourquoi"}]},',
'      "piege": "l\'erreur classique à éviter sur cette partie"',
'    }',
'  ],',
'  "exercices": [',
'    {"type": "qcm", "niveau": 1, "enonce": "...", "choix": ["A","B","C","D"], "bonne": 0,',
'     "diag": ["", "pourquoi le choix B est faux et quel raisonnement l\'a produit",',
'              "idem pour C", "idem pour D"],',
'     "corr": ["étape 1", "étape 2", "étape 3"], "indice": "un coup de pouce sans donner la réponse"},',
'    {"type": "num", "niveau": 2, "enonce": "...", "rep": 12, "tol": 0.001,',
'     "diag": [{"v": 24, "m": "explication de l\'erreur qui mène à 24"}],',
'     "corr": ["étape 1", "étape 2"], "indice": "..."}',
'  ]',
'}',
"",
"Contraintes importantes :",
"- 3 à 6 sections, et 6 à 10 exercices allant du plus simple au plus complet.",
"- Pour CHAQUE mauvaise réponse, le champ diag doit expliquer l'erreur de raisonnement qui y mène, pas seulement dire que c'est faux. C'est le cœur de la fiche.",
"- Le champ bonne est l'indice (0, 1, 2 ou 3) de la bonne réponse dans le tableau choix.",
"- Pour les exercices de type num, rep est un nombre, pas une chaîne de caractères.",
"- Notation dans les textes : encadre les formules par des dollars, écris les fractions @f{numérateur}{dénominateur}, les racines @r{contenu}, les exposants ^{...}, les indices _{...} et les vecteurs @v{v}.",
"- Les unités s'écrivent @u{unité} et les formules chimiques @c{formule} : elles restent ainsi en caractères droits, comme le veut la convention scientifique.",
"  Exemples : \"La concentration vaut $C = @f{n}{V} = 0,20$ @u{mol/L}.\" et \"On verse de l'acide @c{HCl} sur du @c{CaCO_3}, il se dégage du @c{CO_2}.\"",
"- Donne toujours les unités des résultats numériques, et rappelle les conversions nécessaires (@u{mL} vers @u{L}, minutes vers secondes).",
"- Quand une donnée manque pour un calcul (masse molaire, constante), fournis-la dans l'énoncé de l'exercice.",
"- Tutoie l'élève, sois encourageante et concrète. Rattache chaque notion à une situation réelle observable.",
"- Vérifie chacun de tes calculs avant de l'écrire, unités comprises. Un exercice dont la réponse est fausse est pire qu'un exercice absent.",
"",
"=== COURS À TRAITER ===",
(d.titre ? ("Titre indiqué par l'élève : "+d.titre) : ""),
(d.image ? "(Le cours est une image : elle est jointe à ce message. Lis-la et travaille à partir de son contenu.)" : ""),
d.texte || ""
].join("\n");
}

/* ---------- lecture d'une réponse de Claude ---------- */
function lireReponse(txt){
  var t = String(txt||"").trim();
  t = t.replace(/^```(?:json)?\s*/i,"").replace(/```\s*$/,"").trim();
  var i=t.indexOf("{"), j=t.lastIndexOf("}");
  if(i>=0 && j>i){
    try{
      var o=JSON.parse(t.slice(i,j+1));
      if(o && (o.sections || o.exercices)) return normaliser(o);
    }catch(e){}
  }
  return markdownVersFiche(t);
}
function normaliser(o){
  var f = {
    resume:o.resume||"", prerequis:o.prerequis||[], auto:false,
    sections:(o.sections||[]).map(function(s){
      return { titre:s.titre||"Partie", idee:s.idee||"", explication:s.explication||"",
               formules:s.formules||[], exemple:s.exemple||null, piege:s.piege||"" };
    }),
    exercices:(o.exercices||[]).map(function(x,i){
      var e = {
        id:"p"+i+"_"+Math.random().toString(36).slice(2,6),
        type:x.type==="num"?"num":(x.type==="txt"?"txt":"qcm"),
        niveau:x.niveau||1, enonce:x.enonce||"",
        corr:x.corr||["Reprends l’énoncé et applique la méthode du cours."],
        indice:x.indice||"Relis la partie du cours qui traite de cette notion."
      };
      if(e.type==="qcm"){
        e.choix=x.choix||[]; e.bonne=(typeof x.bonne==="number")?x.bonne:0;
        e.diag=x.diag||e.choix.map(function(){return "Ce choix ne convient pas.";});
      } else if(e.type==="num"){
        e.rep=Number(x.rep); e.tol=(x.tol!=null)?Number(x.tol):0.001; e.diag=x.diag||[];
      } else {
        e.reps=x.reps||[x.rep||""]; e.diag=x.diag||[];
      }
      return e;
    })
  };
  if(o.titre) f.titreSuggere=o.titre;
  return f;
}
function markdownVersFiche(t){
  var secs=[], cur=null;
  t.split(/\n/).forEach(function(l){
    var m=l.match(/^#{1,4}\s+(.*)/);
    if(m){ cur={titre:m[1].trim(), idee:"", explication:"", formules:[], exemple:null, piege:""}; secs.push(cur); }
    else if(cur){ cur.explication += l+"\n"; }
  });
  if(!secs.length) secs=[{titre:"Fiche", idee:"", explication:t, formules:[], exemple:null, piege:""}];
  return { resume:"Fiche importée depuis une réponse en texte libre.", prerequis:[],
           auto:false, sections:secs, exercices:[] };
}

/* ---------- enregistrement ---------- */
function enregistrer(d, fiche){
  var f = {
    id:A.uid(), titre: fiche.titreSuggere || d.titre || "Cours importé",
    source:d.source, texte:d.texte, image:d.image, cree:A.nowISO(), fiche:fiche
  };
  S.perso.unshift(f);
  A.save();
  return f;
}
function supprimer(id){
  S.perso = S.perso.filter(function(f){ return f.id!==id; });
  A.save();
}

/* ---------- presse-papiers ---------- */
function copier(txt, ok){
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(function(){ A.toast(ok); },
      function(){ A.toast("Copie impossible — sélectionne le texte à la main."); });
  } else A.toast("Copie impossible — sélectionne le texte à la main.");
}

/* ---------- sauvegarde du cahier ---------- */
function exporter(){
  var data = JSON.stringify({ version:1, exporte:A.nowISO(), etat:S }, null, 2);
  if(!window.claude || !window.claude.use){
    copier(data,"Sauvegarde copiée dans le presse-papiers."); return;
  }
  window.claude.use("downloads").then(function(dl){
    if(!dl){ copier(data,"Sauvegarde copiée dans le presse-papiers."); return; }
    return dl.save({ filename:"cahier-premiere-sauvegarde.json", data:data })
      .then(function(){ A.toast("Sauvegarde enregistrée."); })
      .catch(function(err){
        if(err && err.code==="declined") return;
        copier(data,"Sauvegarde copiée dans le presse-papiers.");
      });
  }).catch(function(){ copier(data,"Sauvegarde copiée dans le presse-papiers."); });
}
function importerSauvegarde(txt){
  try{
    var o=JSON.parse(txt);
    var e=o.etat||o;
    if(e.chap)      S.chap=e.chap;
    if(e.perso)     S.perso=e.perso;
    if(e.srs)       S.srs=e.srs;              // révision espacée
    if(e.controles) S.controles=e.controles;  // historique des contrôles
    if(e.entrain)   S.entrain=e.entrain;      // statistiques d'entraînement
    if(e.theme)     S.theme=e.theme;
    A.applyTheme();
    A.save(); A.toast("Sauvegarde restaurée."); window.RENDER();
  }catch(err){ A.toast("Ce fichier n’est pas une sauvegarde valide."); }
}

/* =====================================================================
   Vue « Mes cours »
   ===================================================================== */
function bloc4(n, titre, ok){
  var d = el("div","st4"+(ok?" ok":""));
  d.innerHTML = '<div class="n">'+(ok?"✓":n)+'</div><div><h4>'+A.esc(titre)+'</h4></div>';
  return d;
}

window.VUE_IMPORT = function(){
  var w = window.WRAPDIV();
  w.innerHTML =
    '<div class="eyebrow">Mes cours</div>'+
    '<h1 style="font-size:31px;margin:8px 0 8px">Ajouter un cours à ton cahier</h1>'+
    '<p class="muted" style="max-width:62ch">Importe le cours de ta prof — texte collé, PDF, document Word ou photo du tableau — et transforme-le en fiche interactive avec résumé, schémas de méthode, exemples déroulés et exercices corrigés.</p>';

  /* --- étape 1 : la source --- */
  var c1 = el("div","card pad"); c1.style.marginTop="24px";
  c1.appendChild(bloc4(1,"D’où vient le cours ?"));
  var seg = el("div","seg");
  [["texte","Texte collé"],["fichier","Fichier PDF / Word"],["image","Image ou photo"]].forEach(function(o){
    var b=el("button",null,o[1]);
    b.setAttribute("aria-pressed", draft.source===o[0]);
    b.onclick=function(){ draft.source=o[0]; window.RENDER(); };
    seg.appendChild(b);
  });
  c1.appendChild(seg);

  var zone = el("div"); zone.style.marginTop="16px";
  if(draft.source==="texte"){
    var ta = el("textarea","inp");
    ta.placeholder="Colle ici le cours : définitions, propriétés, exemples… Tout ce que tu as.";
    ta.value = draft.texte;
    ta.oninput=function(){ draft.texte=ta.value; };
    zone.appendChild(ta);
  } else {
    var drop = el("div","drop");
    var accept = draft.source==="image" ? "image/*"
      : ".txt,.md,.pdf,.docx,.odt,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    drop.innerHTML='<div style="font-family:var(--f-disp);font-weight:700;font-size:17px">'+
      (draft.source==="image"?"Dépose une photo ou une capture d’écran":"Dépose un fichier .pdf, .docx, .odt, .txt ou .md")+'</div>'+
      '<p class="small muted" style="margin-top:6px">ou clique pour choisir un fichier</p>';
    var fi = el("input"); fi.type="file"; fi.accept=accept; fi.className="hidden";
    drop.appendChild(fi);
    drop.onclick=function(){ fi.click(); };
    drop.addEventListener("dragover",function(e){ e.preventDefault(); drop.classList.add("over"); });
    drop.addEventListener("dragleave",function(){ drop.classList.remove("over"); });
    drop.addEventListener("drop",function(e){
      e.preventDefault(); drop.classList.remove("over");
      if(e.dataTransfer.files[0]) lireFichier(e.dataTransfer.files[0]);
    });
    fi.onchange=function(){ if(fi.files[0]) lireFichier(fi.files[0]); };
    zone.appendChild(drop);
  }
  c1.appendChild(zone);

  var tit = el("input","inp"); tit.type="text"; tit.style.marginTop="12px";
  tit.placeholder="Titre du cours (facultatif) — ex. « Les fonctions affines »";
  tit.value=draft.titre; tit.oninput=function(){ draft.titre=tit.value; };
  c1.appendChild(tit);
  w.appendChild(c1);

  /* --- aperçu de ce qui a été lu --- */
  if(draft.image){
    var ci = el("div","card pad"); ci.style.marginTop="14px";
    ci.appendChild(bloc4(2,"Image chargée", true));
    var im = el("img","imgPrev"); im.src=draft.image; im.alt="Cours importé";
    ci.appendChild(im);
    ci.appendChild(el("p","small muted",
      "L’image est conservée dans ta fiche. Pour en tirer un résumé et des exercices, utilise la passerelle ci-dessous en joignant cette image à ta question."));
    w.appendChild(ci);
  }
  if(!draft.texte && draft.qualite==="vide"){
    var scanne = draft.pdf && window.IA_ACTIVE;
    w.appendChild(el("div","callout "+(scanne ? "co-astuce" : "co-piege"),
      scanne
        ? '<div class="ct">Ce PDF est un document scanné</div><p>Aucun texte à extraire : les pages sont des images. '+
          'Ce n’est pas grave — le PDF entier sera envoyé à Claude, qui sait lire les pages scannées. '+
          'Descends jusqu’au bouton <b>Générer la fiche</b>.</p>'
        : '<div class="ct">Aucun texte trouvé dans ce PDF</div><p>C’est probablement un document scanné : les pages sont des images, pas du texte. '+
          'Passe en mode « Image ou photo » et joins la page à Claude, ou recopie le passage important en mode « Texte collé ».</p>'));
  }
  if(draft.texte){
    var c2 = el("div","card pad"); c2.style.marginTop="14px";
    c2.appendChild(bloc4(2,"Texte extrait ("+draft.texte.length+" caractères)", true));
    if(draft.qualite==="faible"){
      c2.appendChild(el("div","callout co-piege",
        '<div class="ct">Extraction partielle</div><p>Ce PDF utilise des polices que je ne sais pas décoder entièrement. Le texte ci-dessous est incomplet ou déformé. '+
        'Le plus simple : ouvre le PDF, sélectionne le texte, copie-le, puis reviens en mode « Texte collé ».</p>'));
    }
    if(draft.qualite==="vide"){
      c2.appendChild(el("div","callout co-piege",
        '<div class="ct">Aucun texte trouvé</div><p>Ce PDF est probablement un scan (des images de pages, pas du texte). Passe en mode « Image ou photo », ou recopie le passage important en mode « Texte collé ».</p>'));
    }
    c2.appendChild(el("div","pre", A.esc(draft.texte.slice(0,4000))));
    w.appendChild(c2);
  }

  /* --- étape 3 : fabriquer la fiche --- */
  if(draft.texte || draft.image || draft.pdf){
    var c3 = el("div","card pad"); c3.style.marginTop="14px";
    c3.appendChild(bloc4(3,"Fabriquer la fiche complète"));
    c3.appendChild(el("p","muted",
      "Deux façons de faire. La première est immédiate, la seconde donne une vraie fiche pédagogique avec exercices corrigés."));

    var g = el("div","grid"); g.style.marginTop="14px";

    /* voie A : locale */
    var a1 = el("div","callout");
    a1.innerHTML = '<div class="ct">A · Fiche brute, tout de suite</div>'+
      '<p class="small">Le cours est découpé en parties et rangé dans ton cahier, sans reformulation ni exercices. Utile pour avoir le texte sous la main.</p>';
    var ba = el("button","btn","Créer la fiche brute"); ba.style.marginTop="10px";
    ba.onclick=function(){
      if(!draft.texte){ A.toast("Il faut du texte pour cette option."); return; }
      var f = enregistrer(draft, ficheLocale(draft.texte, draft.titre));
      draft={titre:"",source:"texte",texte:"",image:null,pdf:null,qualite:null};
      window.GOTO({page:"fiche", fiche:f.id});
    };
    a1.appendChild(ba); g.appendChild(a1);

    /* voie B : passerelle Claude */
    /* voie B bis : génération directe, seulement en version connectée */
    if(window.IA_ACTIVE && window.IA_GENERER_FICHE){
      var ab = el("div","callout co-astuce");
      ab.innerHTML = '<div class="ct">B · Fiche pédagogique complète, automatique</div>'+
        '<p class="small">Claude lit le cours et fabrique directement la fiche : résumé, explications, exemples déroulés et exercices avec analyse des erreurs. Rien à copier-coller.</p>';
      var bAuto = el("button","btn pri","Générer la fiche");
      bAuto.style.marginTop="10px";
      var etat = el("div","small muted"); etat.style.marginTop="10px";
      bAuto.onclick=function(){
        bAuto.disabled=true; bAuto.textContent="Claude travaille…";
        etat.textContent="Lecture du cours, rédaction des explications et des exercices. Cela prend en général 30 à 60 secondes.";
        window.IA_GENERER_FICHE(draft, function(err, fiche){
          if(err){ bAuto.disabled=false; bAuto.textContent="Réessayer";
                   etat.textContent="Échec : "+err; return; }
          var f = enregistrer(draft, fiche);
          draft={titre:"",source:"texte",texte:"",image:null,pdf:null,qualite:null};
          A.toast("Fiche créée : "+f.titre);
          window.GOTO({page:"fiche", fiche:f.id});
        });
      };
      ab.appendChild(bAuto); ab.appendChild(etat);
      g.appendChild(ab);
    }

    var b1 = el("div","callout co-idee");
    b1.innerHTML = '<div class="ct">'+(window.IA_ACTIVE?"C":"B")+' · Fiche pédagogique complète, via Claude</div>'+
      '<p class="small">Résumé, explications simples, exemples déroulés et exercices avec analyse des erreurs — le même format que les dix chapitres du programme.</p>'+
      '<ol class="small" style="margin:10px 0 0 18px;display:grid;gap:6px">'+
        '<li>Copie le prompt ci-dessous.</li>'+
        '<li>Colle-le dans une conversation avec Claude'+(draft.image?' et joins la photo du cours':'')+'.</li>'+
        '<li>Copie sa réponse en entier et colle-la dans le champ prévu.</li>'+
      '</ol>';
    var rowb = el("div","row"); rowb.style.marginTop="12px";
    var bp = el("button","btn pri","Copier le prompt");
    bp.onclick=function(){ copier(prompt(draft),"Prompt copié. Colle-le dans Claude."); };
    var bv = el("button","btn","Voir le prompt");
    rowb.appendChild(bp); rowb.appendChild(bv);
    b1.appendChild(rowb);
    var pv = el("div","pre hidden", A.esc(prompt(draft)));
    pv.style.marginTop="12px";
    bv.onclick=function(){ pv.classList.toggle("hidden"); bv.textContent = pv.classList.contains("hidden")?"Voir le prompt":"Masquer le prompt"; };
    b1.appendChild(pv);

    var lab = el("div","small muted"); lab.style.margin="14px 0 6px";
    lab.textContent="Colle ici la réponse de Claude :";
    b1.appendChild(lab);
    var rep = el("textarea","inp"); rep.placeholder='La réponse commence par une accolade { …';
    b1.appendChild(rep);
    var bb = el("button","btn pri","Construire la fiche"); bb.style.marginTop="10px";
    bb.onclick=function(){
      if(!rep.value.trim()){ A.toast("Colle d’abord la réponse de Claude."); return; }
      var fiche = lireReponse(rep.value);
      if(!fiche.sections.length && !fiche.exercices.length){
        A.toast("Je n’ai pas réussi à lire cette réponse."); return;
      }
      var f = enregistrer(draft, fiche);
      draft={titre:"",source:"texte",texte:"",image:null,pdf:null,qualite:null};
      A.toast("Fiche créée : "+f.titre);
      window.GOTO({page:"fiche", fiche:f.id});
    };
    b1.appendChild(bb);
    g.appendChild(b1);
    c3.appendChild(g);
    w.appendChild(c3);
  }

  /* --- fiches déjà créées --- */
  var c4 = el("div","card pad"); c4.style.marginTop="26px";
  c4.innerHTML='<div class="eyebrow" style="margin-bottom:12px">Mes fiches</div>';
  if(!S.perso.length){
    c4.appendChild(el("p","muted small","Aucune fiche pour l’instant. Elles apparaîtront ici et dans le menu de gauche."));
  } else {
    var lst = el("div","grid");
    S.perso.forEach(function(f){
      var r = el("div","row");
      r.style.cssText="justify-content:space-between;border:1px solid var(--line);border-radius:10px;padding:10px 14px";
      r.innerHTML='<div><div style="font-weight:600">'+A.esc(f.titre)+'</div>'+
        '<div class="small muted">'+f.fiche.sections.length+' parties · '+
        f.fiche.exercices.length+' exercices · '+A.esc(f.source)+'</div></div>';
      var rr=el("div","row");
      var bo=el("button","btn sm","Ouvrir");
      bo.onclick=function(){ window.GOTO({page:"fiche",fiche:f.id}); };
      var bd=el("button","btn sm","Supprimer");
      bd.onclick=function(){ supprimer(f.id); window.RENDER(); A.toast("Fiche supprimée."); };
      rr.appendChild(bo); rr.appendChild(bd); r.appendChild(rr);
      lst.appendChild(r);
    });
    c4.appendChild(lst);
  }
  w.appendChild(c4);

  /* --- sauvegarde --- */
  var c5 = el("div","card pad"); c5.style.marginTop="14px";
  c5.innerHTML='<div class="eyebrow" style="margin-bottom:8px">Sauvegarde</div>'+
    (window.IA_ACTIVE
      ? '<p class="small" id="etatStockage">'+(window.texteStockage?window.texteStockage():'vérification…')+'</p>'+
        '<p class="small muted" style="margin-top:8px">Un export reste utile comme copie de secours.</p>'
      : '<p class="small muted">Ta progression et tes fiches sont enregistrées dans ce navigateur uniquement. Exporte-les si tu changes d’appareil ou vides ton historique.</p>');
  var r5=el("div","row"); r5.style.marginTop="12px";
  var be=el("button","btn","Exporter mon cahier");
  be.onclick=exporter;
  var bi=el("button","btn","Restaurer une sauvegarde");
  var fi2=el("input"); fi2.type="file"; fi2.accept=".json,application/json"; fi2.className="hidden";
  bi.onclick=function(){ fi2.click(); };
  fi2.onchange=function(){
    var f=fi2.files[0]; if(!f) return;
    var fr=new FileReader();
    fr.onload=function(){ importerSauvegarde(fr.result); };
    fr.readAsText(f);
  };
  r5.appendChild(be); r5.appendChild(bi); r5.appendChild(fi2);
  c5.appendChild(r5);
  w.appendChild(c5);

  return w;
};

/* ---------- lecture d'un fichier déposé ---------- */
function lireFichier(file){
  var nom = file.name.toLowerCase();
  draft.pdf = null;                 // un nouveau fichier remplace le précédent
  if(file.type.indexOf("image")===0){
    var fr=new FileReader();
    fr.onload=function(){ draft.image=fr.result; draft.source="image";
      if(!draft.titre) draft.titre=file.name.replace(/\.[^.]+$/,"");
      window.RENDER(); };
    fr.readAsDataURL(file); return;
  }
  if(/\.(docx|odt)$/.test(nom)){
    A.toast("Lecture du document…");
    file.arrayBuffer().then(extraireDocument).then(function(t){
      draft.texte=nettoyer(t); draft.qualite=qualite(draft.texte);
      if(!draft.titre) draft.titre=file.name.replace(/\.[^.]+$/,"");
      window.RENDER();
      A.toast(draft.qualite==="ok" ? "Document lu." : "Document lu, mais presque vide.");
    }).catch(function(){
      draft.texte=""; draft.qualite="vide"; window.RENDER();
      A.toast("Impossible de lire ce document — enregistre-le en .docx ou en PDF.");
    });
    return;
  }
  if(/\.docx?$/.test(nom) && !/\.docx$/.test(nom)){
    A.toast("Le format .doc (avant 2007) n’est pas lisible : réenregistre en .docx ou en PDF.");
    return;
  }
  if(nom.slice(-4)===".pdf" || file.type==="application/pdf"){
    A.toast("Lecture du PDF…");
    // on garde aussi le PDF entier : si l'extraction locale échoue (document
    // scanné), la couche IA l'enverra tel quel à Claude, qui sait le lire.
    var frPdf=new FileReader();
    frPdf.onload=function(){ draft.pdf=frPdf.result; };
    frPdf.readAsDataURL(file);
    file.arrayBuffer().then(extrairePdf).then(function(t){
      draft.texte=t; draft.qualite=qualite(t);
      if(!draft.titre) draft.titre=file.name.replace(/\.[^.]+$/,"");
      window.RENDER();
      A.toast(draft.qualite==="ok" ? "PDF lu." : "PDF lu partiellement.");
    }).catch(function(){
      draft.texte=""; draft.qualite="vide"; window.RENDER();
      A.toast("Impossible de lire ce PDF.");
    });
    return;
  }
  var fr2=new FileReader();
  fr2.onload=function(){
    draft.texte=nettoyer(String(fr2.result)); draft.qualite=qualite(draft.texte);
    if(!draft.titre) draft.titre=file.name.replace(/\.[^.]+$/,"");
    window.RENDER();
  };
  fr2.readAsText(file);
}

/* =====================================================================
   Vue d'une fiche personnelle
   ===================================================================== */
window.VUE_FICHE = function(id){
  var f = S.perso.filter(function(x){ return x.id===id; })[0];
  var w = window.WRAPDIV();
  if(!f){ w.innerHTML='<div class="empty"><div class="big">Fiche introuvable</div></div>'; return w; }
  var fi = f.fiche;

  w.innerHTML =
    '<div class="row"><span class="pill">Ma fiche</span>'+
    '<span class="muted small">importé depuis : '+A.esc(f.source)+'</span></div>'+
    '<h1 style="font-size:31px;margin:10px 0 8px;letter-spacing:-.02em">'+A.esc(f.titre)+'</h1>';

  if(fi.resume) w.appendChild(el("div","callout co-idee",
    '<div class="ct">Résumé</div><p>'+T(fi.resume)+'</p>'));

  if(fi.prerequis && fi.prerequis.length){
    w.appendChild(el("div","card pad",
      '<div class="eyebrow" style="margin-bottom:8px">À savoir avant de commencer</div>'+
      '<ul class="ul">'+fi.prerequis.map(function(p){return '<li>'+T(p)+'</li>';}).join("")+'</ul>'));
  }
  if(fi.auto){
    w.appendChild(el("div","callout co-piege",
      '<div class="ct">Fiche brute</div><p>Ce texte a été rangé automatiquement, sans reformulation ni exercices. '+
      'Pour obtenir une vraie fiche pédagogique, retourne dans <b>Mes cours</b> et utilise la passerelle vers Claude.</p>'));
  }
  if(f.image){
    var im=el("img","imgPrev"); im.src=f.image; im.alt="Cours importé"; im.style.marginTop="16px";
    w.appendChild(im);
  }
  if(fi.pointsCles && fi.pointsCles.length){
    w.appendChild(el("div","card pad",
      '<div class="eyebrow" style="margin-bottom:10px">Passages repérés comme importants</div>'+
      '<ul class="ul">'+fi.pointsCles.map(function(p){return '<li>'+A.esc(p)+'</li>';}).join("")+'</ul>'));
  }

  fi.sections.forEach(function(s,i){
    var head=el("div","secHead");
    head.innerHTML='<span class="n">'+(i+1)+'</span><h2>'+T(s.titre)+'</h2>';
    w.appendChild(head);
    var body=el("div","lesson"); body.style.marginTop="14px";
    if(s.idee) body.appendChild(el("div","callout co-idee",
      '<div class="ct">L’idée en une phrase</div><p>'+T(s.idee)+'</p>'));
    if(s.explication) String(s.explication).split(/\n{2,}/).forEach(function(p){
      if(p.trim()) body.appendChild(el("p",null,T(p.trim())));
    });
    (s.formules||[]).forEach(function(fo){
      var d=el("div");
      d.innerHTML=window.BLOC({t:"formule",titre:fo.titre,x:fo.x,note:fo.note});
      if(d.firstChild) body.appendChild(d.firstChild);
    });
    if(s.exemple && s.exemple.etapes && s.exemple.etapes.length)
      body.appendChild(window.DEMONODE(s.exemple));
    if(s.piege) body.appendChild(el("div","callout co-piege",
      '<div class="ct">Attention</div><p>'+T(s.piege)+'</p>'));
    w.appendChild(body);
  });

  if(fi.exercices && fi.exercices.length){
    var h=el("div","secHead");
    h.innerHTML='<span class="n">→</span><h2>Exercices</h2>';
    w.appendChild(h);
    var faux = { id:"perso:"+f.id, titre:f.titre, n:0, exos:fi.exercices };
    var g=el("div","grid"); g.style.marginTop="16px";
    fi.exercices.forEach(function(x){ g.appendChild(window.EXONODE(faux,x,null)); });
    w.appendChild(g);
  }
  return w;
};
})();
