/* =====================================================================
   Générateur d'exercices paramétrés
   ---------------------------------------------------------------------
   Chaque générateur tire des nombres au hasard PUIS calcule les
   distracteurs et leur explication : le diagnostic reste juste, quels
   que soient les nombres tirés. Aucune explication n'est générique.
   ===================================================================== */
(function(){
"use strict";
var A = window.APP;

function ri(a,b){ return a + Math.floor(Math.random()*(b-a+1)); }
function pick(t){ return t[Math.floor(Math.random()*t.length)]; }
function arr(n,d){ var k=Math.pow(10, d==null?3:d); return Math.round(n*k)/k; }
/* écriture française : virgule décimale, et un espace tous les trois chiffres
   au-delà de dix mille — 40 000 se lit d'un coup d'œil, 40000 non */
function fr(n){
  var t = String(n).split(".");
  if(Math.abs(+t[0]) >= 10000) t[0] = t[0].replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
  return t.length > 1 ? t[0] + "{,}" + t[1] : t[0];
}

/* ============================ CHIMIE ============================ */

var G_TRANSFO = [

{ id:"tr-mole-masse", titre:"Quantité de matière à partir d'une masse", niveau:1, chap:"transformation",
  gen:function(){
    var esp = pick([
      { f:"H_2O", nom:"eau", M:18 }, { f:"NaCl", nom:"chlorure de sodium", M:58.5 },
      { f:"CO_2", nom:"dioxyde de carbone", M:44 }, { f:"C_6H_{12}O_6", nom:"glucose", M:180 },
      { f:"CaCO_3", nom:"carbonate de calcium", M:100 }
    ]);
    var n = pick([0.1, 0.2, 0.25, 0.5, 2, 4]);
    var m = arr(esp.M * n, 2);
    return { type:"num", niveau:1, rep:n, tol:Math.max(0.001, n*0.01), unite:"mol",
      enonce:"Quelle quantité de matière représente $"+fr(m)+"$ @u{g} de "+esp.nom+" $@c{"+esp.f+"}$ ? On donne $M = "+fr(esp.M)+"$ @u{g/mol}.",
      diag:[{v:arr(m*esp.M,2), m:"Tu as multiplié la masse par la masse molaire. Une masse molaire est une masse **par mole** : pour compter les moles, on divise."},
            {v:arr(esp.M/m,4), m:"Tu as divisé dans le mauvais sens : $@f{M}{m}$ au lieu de $@f{m}{M}$."},
            {v:m, m:"Tu as recopié la masse. Une masse est en grammes, une quantité de matière en moles : il faut passer de l'une à l'autre."}],
      corr:["**Ce que donne l'énoncé.** Une masse en grammes et une masse molaire en @u{g/mol}. Ce qu'on cherche : une quantité de matière, en moles.",
            "La donnée est une masse et on connaît $M$ : la formule est $n = @f{m}{M}$.",
            "$n = @f{"+fr(m)+"}{"+fr(esp.M)+"}$.",
            "$n = "+fr(n)+"$ @u{mol}.",
            "**Je vérifie.** Une masse molaire dit « tant de grammes pour une mole » : diviser la masse par elle donne bien un nombre de moles. L'unité tombe juste."],
      indice:"$n = @f{m}{M}$ : la masse divisée par la masse molaire." };
  }},

{ id:"tr-mole-solution", titre:"Quantité de matière en solution", niveau:1, chap:"transformation",
  gen:function(){
    var C = pick([0.010, 0.020, 0.050, 0.10, 0.20, 0.50]);
    var Vml = pick([20, 25, 50, 100, 200, 250]);
    var n = arr(C * Vml/1000, 6);
    return { type:"num", niveau:1, rep:n, tol:Math.max(1e-5, n*0.01), unite:"mol",
      enonce:"On prélève $"+Vml+"$ @u{mL} d'une solution de concentration $C = "+fr(C)+"$ @u{mol/L}. Quelle quantité de matière a-t-on prélevée ?",
      diag:[{v:arr(C*Vml,4), m:"Tu as gardé le volume en millilitres. Dans $n = C × V$, le volume doit être en **litres** : $"+Vml+"$ @u{mL} $= "+fr(Vml/1000)+"$ @u{L}. Ton résultat est mille fois trop grand."},
            {v:arr(C/(Vml/1000),4), m:"Tu as divisé la concentration par le volume. Une concentration est un nombre de moles **par litre** : on la multiplie par le nombre de litres."},
            {v:arr((Vml/1000)/C,4), m:"Tu as inversé la fraction. La formule est $n = C × V$, une multiplication."}],
      corr:["**Ce que donne l'énoncé.** Un volume de solution et sa concentration. Ce qu'on cherche : la quantité de matière prélevée.",
            "La donnée est un volume de solution et une concentration : $n = C × V$.",
            "Je convertis : $"+Vml+"$ @u{mL} $= "+fr(Vml/1000)+"$ @u{L}.",
            "$n = "+fr(C)+" × "+fr(Vml/1000)+"$.",
            "$n = "+fr(n)+"$ @u{mol}.",
            "**Je vérifie.** Le résultat est en moles, et il vaut moins qu'une mole : normal pour quelques dizaines de millilitres d'une solution diluée."],
      indice:"Convertis le volume en litres **avant** de multiplier." };
  }},

{ id:"tr-limitant", titre:"Réactif limitant et avancement maximal", niveau:2, chap:"transformation",
  gen:function(){
    var a = pick([1,2]), b = pick([2,3]);
    var xa = arr(pick([0.10,0.20,0.30,0.40,0.60]),2);
    var xb = arr(xa + pick([0.05,0.10,0.20]),2);       // B n'est jamais limitant
    var nA = arr(a*xa,3), nB = arr(b*xb,3);
    return { type:"num", niveau:2, rep:xa, tol:0.005, unite:"mol",
      enonce:"Pour la réaction $"+(a>1?a+" ":"")+"@c{A} + "+b+" @c{B} → @c{C}$, on introduit $"+fr(nA)+"$ @u{mol} de $@c{A}$ et $"+fr(nB)+"$ @u{mol} de $@c{B}$. Quelle est la valeur de $x_{max}$ ?",
      diag:[{v:nA, m:"Tu as pris la quantité de $@c{A}$ sans la diviser par son nombre stœchiométrique. Il faut comparer $@f{n}{ν}$ : ici $@f{"+fr(nA)+"}{"+a+"} = "+fr(xa)+"$."},
            {v:xb, m:"Tu as pris le quotient de $@c{B}$, qui vaut $"+fr(xb)+"$. Mais c'est le **plus petit** quotient qui l'emporte, et celui de $@c{A}$ vaut $"+fr(xa)+"$."},
            {v:arr(nB,3), m:"Tu as pris la quantité de $@c{B}$ telle quelle. Il faut d'abord la diviser par son coefficient $"+b+"$."},
            {v:arr(nA+nB,3), m:"Tu as additionné les deux quantités. L'avancement n'est pas une somme : c'est le nombre de fois où la réaction peut se produire."}],
      corr:["**Ce que donne l'énoncé.** Deux quantités de réactifs et une équation ajustée. Ce qu'on cherche : jusqu'où la réaction peut aller, c'est-à-dire $x_{max}$.",
            "Je calcule le quotient de chaque réactif par son nombre stœchiométrique.",
            "Pour $@c{A}$ : $@f{"+fr(nA)+"}{"+a+"} = "+fr(xa)+"$.",
            "Pour $@c{B}$ : $@f{"+fr(nB)+"}{"+b+"} = "+fr(xb)+"$.",
            "Le plus petit est celui de $@c{A}$ : $@c{A}$ est limitant et $x_{max} = "+fr(xa)+"$ @u{mol}.",
            "**Je vérifie.** En remplaçant $x$ par $x_{max}$ dans la ligne du réactif limitant, sa quantité doit tomber exactement à zéro. C'est bien le cas."],
      indice:"Compare $@f{n}{ν}$ pour chaque réactif, et garde le plus petit." };
  }},

{ id:"tr-masse-produit", titre:"Masse de produit formé", niveau:3, chap:"transformation",
  gen:function(){
    var M1 = pick([24,40,56,64]), M2 = M1 + 16;        // un oxyde
    var n = pick([0.10,0.20,0.25,0.50]);
    var m1 = arr(M1*n,2), m2 = arr(M2*n,2);
    return { type:"num", niveau:3, rep:m2, tol:Math.max(0.05,m2*0.01), unite:"g",
      enonce:"Un métal $@c{X}$ brûle selon $2 @c{X} + @c{O_2} → 2 @c{XO}$. On fait brûler $"+fr(m1)+"$ @u{g} de $@c{X}$ dans un excès de dioxygène. Quelle masse d'oxyde obtient-on ? Données : $M(@c{X}) = "+M1+"$ @u{g/mol}, $M(@c{XO}) = "+M2+"$ @u{g/mol}.",
      diag:[{v:m1, m:"Tu as recopié la masse de métal. L'oxyde contient en plus l'oxygène capté : il est forcément plus lourd."},
            {v:arr(n,4), m:"$"+fr(n)+"$ @u{mol} est la quantité de matière, pas une masse. Il reste à multiplier par la masse molaire du produit."},
            {v:arr(2*m2,2), m:"Tu as doublé le résultat. Les coefficients de $@c{X}$ et de $@c{XO}$ valent tous deux 2 : une mole de métal donne **une** mole d'oxyde."}],
      corr:["**Ce que donne l'énoncé.** Une masse de réactif et deux masses molaires. Ce qu'on cherche : une masse de produit. On passera donc par les moles.",
            "Quantité de métal : $n = @f{"+fr(m1)+"}{"+M1+"} = "+fr(n)+"$ @u{mol}.",
            "Le rapport est de 2 pour 2 : il se forme autant de moles d'oxyde que de moles de métal consommées.",
            "Donc $n(@c{XO}) = "+fr(n)+"$ @u{mol}.",
            "$m = n × M = "+fr(n)+" × "+M2+" = "+fr(m2)+"$ @u{g}.",
            "**Je vérifie.** Le produit est plus lourd que le réactif de départ : c'est logique, il contient en plus l'oxygène capté."],
      indice:"Masse → quantité de matière → quantité de produit → masse de produit." };
  }}
];

var G_TITRAGE = [

{ id:"ti-simple", titre:"Concentration à l'équivalence", niveau:1, chap:"titrage",
  gen:function(){
    var CB = pick([0.010,0.020,0.050,0.10,0.20]);
    var VA = pick([10,20,25]), VB = pick([8,12,14,15,16,18,24]);
    var CA = arr(CB*VB/VA, 6);
    return { type:"num", niveau:1, rep:CA, tol:Math.max(1e-5,CA*0.01), unite:"mol/L",
      enonce:"On titre $V_A = "+fr(VA)+"$ @u{mL} de solution par une solution titrante de concentration $C_B = "+fr(CB)+"$ @u{mol/L}. La réaction se fait mole à mole et l'équivalence est atteinte pour $V_B = "+fr(VB)+"$ @u{mL}. Quelle est la concentration $C_A$ ?",
      diag:[{v:arr(CB*VA/VB,6), m:"Tu as inversé les volumes. Le volume **versé** ($"+fr(VB)+"$ @u{mL}) va au numérateur, le volume **prélevé** ($"+fr(VA)+"$ @u{mL}) au dénominateur."},
            {v:arr(CB*VB,6), m:"Tu as oublié de diviser par $V_A$. La relation $C_A V_A = C_B V_B$ donne $C_A = @f{C_B V_B}{V_A}$."},
            {v:CB, m:"Tu as recopié la concentration du titrant. Elle n'est égale à celle de la solution titrée que si les deux volumes sont égaux, ce qui n'est pas le cas ici."}],
      corr:["**Je range les données.** Titré : le volume prélevé, dont on cherche la concentration. Titrant : la concentration connue et le volume versé à l'équivalence.",
            "À l'équivalence, avec des coefficients égaux : $C_A × V_A = C_B × V_B$.",
            "J'isole : $C_A = @f{C_B × V_B}{V_A}$.",
            "$C_A = @f{"+fr(CB)+" × "+fr(VB)+"}{"+fr(VA)+"}$.",
            "$C_A = "+fr(CA)+"$ @u{mol/L}.",
            "**Je vérifie le sens.** Beaucoup de titrant versé signifie une solution titrée concentrée, et inversement. Compare les deux volumes pour contrôler ton résultat."],
      indice:"$C_A = @f{C_B V_B}{V_A}$ : le volume versé au numérateur." };
  }},

{ id:"ti-coeff", titre:"Équivalence avec des coefficients", niveau:3, chap:"titrage",
  gen:function(){
    var k = pick([2,3,5]);
    var CB = pick([0.020,0.050,0.10]);
    var VA = pick([10,20,25]), VB = pick([10,12,15,16,20]);
    var CA = arr(k*CB*VB/VA, 6);
    return { type:"num", niveau:3, rep:CA, tol:Math.max(1e-5,CA*0.01), unite:"mol/L",
      enonce:"On titre $V_A = "+fr(VA)+"$ @u{mL} d'une solution de $@c{A}$ selon $"+k+" @c{A} + @c{B} → produits$. Il faut $V_B = "+fr(VB)+"$ @u{mL} de solution de $@c{B}$ à $C_B = "+fr(CB)+"$ @u{mol/L}. Quelle est la concentration $C_A$ ?",
      diag:[{v:arr(CB*VB/VA,6), m:"Tu as oublié le coefficient $"+k+"$. Une mole de $@c{B}$ consomme $"+k+"$ moles de $@c{A}$ : il y en a donc $"+k+"$ fois plus."},
            {v:arr(CB*VB/(k*VA),6), m:"Tu as divisé par $"+k+"$ au lieu de multiplier. Écris d'abord $@f{n_A}{"+k+"} = @f{n_B}{1}$ : le coefficient se place sous l'espèce qui le porte, donc $n_A = "+k+" n_B$."},
            {v:arr(k*CB*VA/VB,6), m:"Tu as inversé les volumes. Le volume versé va au numérateur."}],
      corr:["**Je range les données, et je relève surtout les coefficients.** Ce sont eux qui distinguent cet exercice d'un titrage ordinaire.",
            "Relation d'équivalence : $@f{n_A}{"+k+"} = @f{n_B}{1}$.",
            "Donc $n_A = "+k+" × C_B × V_B$.",
            "$C_A = @f{"+k+" × "+fr(CB)+" × "+fr(VB)+"}{"+fr(VA)+"}$.",
            "$C_A = "+fr(CA)+"$ @u{mol/L}.",
            "**Je vérifie.** Sans tenir compte du coefficient, on trouverait un résultat faux d'exactement ce facteur. Écrire $@f{n_A}{a} = @f{n_B}{b}$ avant de remplacer évite cette erreur."],
      indice:"Écris $@f{n_A}{ν_A} = @f{n_B}{ν_B}$ avant de remplacer quoi que ce soit." };
  }}
];

var G_MESURES = [

{ id:"me-beer", titre:"Lecture sur une droite d'étalonnage", niveau:2, chap:"mesures",
  gen:function(){
    var C0 = pick([1,2,2.5,4,5]);
    var A0 = arr(pick([0.12,0.18,0.20,0.24,0.30]),3);
    var f  = pick([1.5,2,2.5,3]);
    var A1 = arr(A0*f,3), C1 = arr(C0*f,3);
    return { type:"num", niveau:2, rep:C1, tol:Math.max(0.005,C1*0.01), unite:"mmol/L",
      enonce:"Une droite d'étalonnage donne $A = "+fr(A0)+"$ pour $C = "+fr(C0)+"$ @u{mmol/L}. Une solution inconnue a une absorbance $A = "+fr(A1)+"$. Quelle est sa concentration ?",
      diag:[{v:arr(C0/f,3), m:"Tu as inversé le rapport. L'absorbance inconnue est plus **grande** : la solution est donc plus concentrée, pas moins."},
            {v:f, m:"$"+fr(f)+"$ est le rapport des absorbances, pas une concentration. Il reste à le multiplier par $"+fr(C0)+"$ @u{mmol/L}."},
            {v:arr(C0+(A1-A0),3), m:"Tu as ajouté la différence des absorbances. La loi de Beer-Lambert est une **proportionnalité** : on multiplie par un rapport, on n'additionne pas."}],
      corr:["**Ce que donne l'énoncé.** Un point connu de la droite d'étalonnage, et l'absorbance d'une solution inconnue.",
            "La loi $A = k C$ est une proportionnalité : je peux faire un produit en croix.",
            "Rapport des absorbances : $@f{"+fr(A1)+"}{"+fr(A0)+"} = "+fr(f)+"$.",
            "La concentration est multipliée par le même facteur.",
            "$C = "+fr(C0)+" × "+fr(f)+" = "+fr(C1)+"$ @u{mmol/L}.",
            "**Je vérifie le sens.** Absorbance plus grande, concentration plus grande. Si ton résultat va dans l'autre sens, tu as inversé la division."],
      indice:"Absorbance multipliée par un facteur, donc concentration multipliée par le même facteur." };
  }}
,

{ id:"me-dilution", titre:"Préparer une dilution", niveau:2, chap:"mesures",
  gen:function(){
    var Cm = pick([0.10, 0.20, 0.50, 1.0]);
    var F  = pick([2, 4, 5, 10, 20]);
    var Vf = pick([50, 100, 200, 250]);
    var Cf = arr(Cm/F, 6);
    var Vp = arr(Vf/F, 3);
    return { type:"num", niveau:2, rep:Vp, tol:Math.max(0.05, Vp*0.01), unite:"mL",
      enonce:"On veut préparer $"+fr(Vf)+"$ @u{mL} d'une solution à $"+fr(Cf)+"$ @u{mol/L} à partir d'une solution mère à $"+fr(Cm)+"$ @u{mol/L}. Quel volume de solution mère faut-il prélever ?",
      diag:[{v:arr(Vf*F,2), m:"Tu as inversé le rapport des concentrations. On prélève un **petit** volume de solution concentrée, qu'on complète ensuite : le volume prélevé est plus petit que le volume final."},
            {v:arr(Vf-Vp,3), m:"$"+fr(arr(Vf-Vp,3))+"$ @u{mL} est le volume d'eau à ajouter, pas le volume à prélever. Et on ne le mesure d'ailleurs pas : on complète jusqu'au trait de jauge."},
            {v:Vf, m:"$"+fr(Vf)+"$ @u{mL} est le volume **final**, celui de la fiole jaugée. On demande ce qu'il faut y verser de solution mère."}],
      corr:["**Ce que donne l'énoncé.** La concentration de la solution mère, et ce qu'on veut obtenir : un volume et une concentration précis.",
            "La dilution conserve la quantité de matière : $C_{mère} × V_{prélevé} = C_{fille} × V_{final}$.",
            "J'isole : $V_{prélevé} = @f{C_{fille} × V_{final}}{C_{mère}}$.",
            "$V_{prélevé} = @f{"+fr(Cf)+" × "+fr(Vf)+"}{"+fr(Cm)+"}$.",
            "$V_{prélevé} = "+fr(Vp)+"$ @u{mL}. C'est bien "+F+" fois moins que le volume final : cohérent avec une dilution "+F+" fois.",
            "**Je vérifie.** Le volume prélevé doit toujours être **plus petit** que le volume final : on part d'une solution concentrée pour l'étendre."],
      indice:"Le facteur de dilution vaut $@f{C_{mère}}{C_{fille}}$ : le volume prélevé est ce même nombre de fois plus petit que le volume final." };
  }}
];

var G_CRISTAUX = [

{ id:"cr-population", titre:"Population d'une maille", niveau:1, chap:"cristaux",
  gen:function(){
    var cfc = Math.random() < 0.5;
    var nom = cfc ? "cubique à faces centrées" : "cubique simple";
    var det = cfc ? "un atome à chaque sommet et un au centre de chaque face"
                  : "un atome à chaque sommet, et rien d'autre";
    return { type:"num", niveau:1, rep: cfc ? 4 : 1, tol:0.01,
      enonce:"Une maille "+nom+" porte "+det+". Combien d'atomes lui appartiennent en propre ?",
      diag:[{v:8, m:"$8$ est le nombre de **sommets**, donc d'atomes dessinés. Chacun est partagé entre les huit mailles qui se rejoignent en ce point : il ne compte que pour $@f{1}{8}$."},
            {v: cfc ? 14 : 6, m: cfc
              ? "$14$ est le nombre d'atomes dessinés ($8$ sommets et $6$ faces). Aucun ne compte en entier : tous sont partagés avec les mailles voisines."
              : "$6$ est le nombre de faces d'un cube, mais cette maille-ci n'a pas d'atome au centre des faces."},
            {v: cfc ? 3 : 0.125, m: cfc
              ? "$3$ est la part apportée par les seules faces ($6 × @f{1}{2}$). Il manque celle des sommets."
              : "$@f{1}{8}$ est la part d'un **seul** sommet. Il faut la multiplier par les $8$ sommets du cube."}],
      corr:["**Ce que demande la question.** Non pas le nombre d'atomes dessinés, mais le nombre de ceux qui appartiennent **en propre** à cette maille.",
            "**La règle du partage.** Un atome au sommet est partagé entre $8$ mailles : il compte pour $@f{1}{8}$. Un atome au centre d'une face est partagé entre $2$ mailles : il compte pour $@f{1}{2}$.",
            "**Les sommets.** Un cube en a toujours $8$ : $8 × @f{1}{8} = 1$ atome.",
            cfc ? "**Les faces.** Un cube en a $6$ : $6 × @f{1}{2} = 3$ atomes." : "**Les faces.** Cette maille n'en porte aucune : rien à ajouter.",
            "**Le total.** $N = "+(cfc ? "1 + 3 = 4" : "1")+"$ atome"+(cfc ? "s" : "")+" par maille.",
            "**Je vérifie.** Une population est toujours un nombre entier : c'est le contrôle le plus simple du chapitre."],
      indice:"Sommet : $@f{1}{8}$ chacun. Centre de face : $@f{1}{2}$ chacun. Additionne les deux parts." };
  }},

{ id:"cr-masse-volumique", titre:"Masse volumique d'un métal", niveau:3, chap:"cristaux",
  gen:function(){
    var met = pick([
      { nom:"l'aluminium", a:4.05, M:27.0 }, { nom:"le cuivre", a:3.61, M:63.5 },
      { nom:"le nickel",   a:3.52, M:58.7 }, { nom:"l'argent", a:4.09, M:108 },
      { nom:"l'or",        a:4.08, M:197 }
    ]);
    var NA = 6.02e23, N = 4;
    var vol = Math.pow(met.a * 1e-8, 3);
    var rho = arr(N * met.M / (NA * vol), 2);
    return { type:"num", niveau:3, rep:rho, tol:Math.max(0.05, rho*0.01), unite:"g/cm³",
      enonce:"Dans "+met.nom+", les atomes forment une maille cubique à faces centrées de paramètre $a = "+fr(met.a)+" × 10^{-8}$ @u{cm}. Quelle est sa masse volumique ? Données : $M = "+fr(met.M)+"$ @u{g/mol} et $N_A = 6{,}02 × 10^{23}$ @u{mol⁻¹}.",
      diag:[{v:arr(rho/4, 3), m:"Tu as oublié la population : une maille à faces centrées contient **quatre** atomes, pas un seul. Ton résultat est quatre fois trop petit."},
            {v:arr(rho*1000, 1), m:"Ce résultat est en @u{kg/m³}. La question demande des @u{g/cm³} : il y a un facteur $1000$ entre les deux."},
            {v:arr(N*met.M/(NA*met.a*1e-8), 2), m:"Tu as divisé par $a$ au lieu de $a^3$. Le volume d'un cube est le cube de son arête."}],
      corr:["**Ce que donne l'énoncé.** Le paramètre de maille, la masse molaire et la constante d'Avogadro. Ce qu'on cherche : une masse volumique.",
            "**La relation.** $ρ = @f{N × M}{N_A × a^3}$ : la masse d'une maille, divisée par son volume.",
            "**La population.** Une maille à faces centrées contient $N = 4$ atomes.",
            "**La masse d'une maille.** $@f{4 × "+fr(met.M)+"}{6{,}02 × 10^{23}} ≈ "+fr(arr(N*met.M/NA*1e22,3))+" × 10^{-22}$ @u{g}.",
            "**Le volume d'une maille.** $a^3 = ("+fr(met.a)+" × 10^{-8})^3 ≈ "+fr(arr(vol*1e23,2))+" × 10^{-23}$ @u{cm³}. Attention : le cube porte sur le nombre **et** sur la puissance de dix.",
            "**Je divise, et je confronte au réel.** $ρ ≈ "+fr(rho)+"$ @u{g/cm³} — c'est bien la valeur mesurée sur un morceau de ce métal, ce qui valide le modèle de la maille."],
      indice:"Masse d'une maille ($@f{4M}{N_A}$) divisée par son volume ($a^3$). Le cube porte aussi sur la puissance de dix." };
  }}
];

/* =========================== PHYSIQUE =========================== */

var G_VITESSE = [

{ id:"vi-conversion", titre:"Conversion km/h et m/s", niveau:1, chap:"vitesse",
  gen:function(){
    var vms = pick([5,10,15,20,25,30]);
    var vkmh = arr(vms*3.6,2);
    var versMs = Math.random() < 0.5;
    if(versMs) return { type:"num", niveau:1, rep:vms, tol:0.05, unite:"m/s",
      enonce:"Un véhicule roule à $"+fr(vkmh)+"$ @u{km/h}. Quelle est sa vitesse en @u{m/s} ?",
      diag:[{v:arr(vkmh*3.6,2), m:"Tu as multiplié par $3{,}6$ au lieu de diviser. Un nombre en @u{km/h} est toujours plus **grand** que le même en @u{m/s}."},
            {v:arr(vkmh/60,3), m:"Tu as divisé par 60. Le facteur entre @u{km/h} et @u{m/s} est $3{,}6$ : il combine les $1000$ mètres du kilomètre et les $3600$ secondes de l'heure."}],
      corr:["**Ce que donne l'énoncé.** Une vitesse dans une unité ; on la veut dans l'autre. Le facteur est $3{,}6$, qui vient des $1000$ mètres du kilomètre et des $3600$ secondes de l'heure.",
            "Pour passer des @u{km/h} aux @u{m/s}, on divise par $3{,}6$.",
            "$v = @f{"+fr(vkmh)+"}{3{,}6}$.",
            "$v = "+fr(vms)+"$ @u{m/s}.",
            "**Je vérifie.** Un même mouvement donne toujours un grand nombre en @u{km/h} et un petit en @u{m/s}. Refais la conversion en sens inverse pour contrôler."],
      indice:"Vers les @u{m/s}, on divise par $3{,}6$ : le nombre doit diminuer." };
    return { type:"num", niveau:1, rep:vkmh, tol:0.1, unite:"km/h",
      enonce:"Un mobile se déplace à $"+fr(vms)+"$ @u{m/s}. Quelle est sa vitesse en @u{km/h} ?",
      diag:[{v:arr(vms/3.6,3), m:"Tu as divisé par $3{,}6$ au lieu de multiplier. Vers les @u{km/h}, le nombre doit **augmenter**."},
            {v:arr(vms*60,2), m:"Tu as multiplié par 60. Le facteur correct est $3{,}6$."}],
      corr:["**Ce que donne l'énoncé.** Une vitesse en @u{m/s} ; on la veut en @u{km/h}. Le facteur est $3{,}6$, qui vient des $1000$ mètres du kilomètre et des $3600$ secondes de l'heure.",
            "**Dans quel sens ?** On va vers les @u{km/h} : le nombre doit **augmenter**, donc on multiplie.",
            "$v = "+fr(vms)+" × 3{,}6$.",
            "$v = "+fr(vkmh)+"$ @u{km/h}.",
            "**Je vérifie.** En divisant le résultat par $3{,}6$, je dois retomber sur la valeur de départ."],
      indice:"Vers les @u{km/h}, on multiplie par $3{,}6$." };
  }},

{ id:"vi-chrono", titre:"Vitesse sur une chronophotographie", niveau:2, chap:"vitesse",
  gen:function(){
    var tau = pick([20,25,40,50,100]);                 // en ms
    var v = pick([0.5,1,1.5,2,2.5,3]);
    var d = arr(v*2*tau/1000, 4);                      // distance M1M3 en m
    return { type:"num", niveau:2, rep:v, tol:Math.max(0.01,v*0.01), unite:"m/s",
      enonce:"Sur une chronophotographie prise toutes les $τ = "+tau+"$ @u{ms}, la distance réelle $M_1M_3$ vaut $"+fr(d)+"$ @u{m}. Quelle est la vitesse au point $M_2$ ?",
      diag:[{v:arr(2*v,3), m:"Tu as divisé par $τ$ au lieu de $2τ$. La distance $M_1M_3$ enjambe le point $M_2$ : elle a été parcourue en **deux** intervalles de temps."},
            {v:arr(v/2,3), m:"Tu as divisé une fois de trop, ou pris $4τ$. Il y a exactement deux intervalles entre $M_1$ et $M_3$."},
            {v:arr(1/v,4), m:"Tu as inversé la fraction. Une vitesse est une distance divisée par une durée."}],
      corr:["**Ce que donne l'énoncé.** L'intervalle de temps entre deux positions, et la distance qui encadre le point étudié.",
            "La formule est $v_2 = @f{M_1M_3}{2τ}$.",
            "Je convertis : $τ = "+tau+"$ @u{ms} $= "+fr(tau/1000)+"$ @u{s}, donc $2τ = "+fr(2*tau/1000)+"$ @u{s}.",
            "$v_2 = @f{"+fr(d)+"}{"+fr(2*tau/1000)+"}$.",
            "$v_2 = "+fr(v)+"$ @u{m/s}.",
            "**Je vérifie.** Diviser par $τ$ au lieu de $2τ$ donne exactement le double : c'est l'erreur la plus fréquente. Contrôle aussi l'ordre de grandeur du résultat."],
      indice:"Deux intervalles de temps séparent $M_1$ de $M_3$ : divise par $2τ$." };
  }}
];

var G_FORCES = [

{ id:"fo-poids", titre:"Calcul d'un poids", niveau:1, chap:"forces",
  gen:function(){
    var astre = pick([
      { nom:"sur Terre", g:9.81 }, { nom:"sur la Lune", g:1.6 },
      { nom:"sur Mars", g:3.7 }, { nom:"sur Jupiter", g:24.8 }
    ]);
    var m = pick([2,4,5,8,12,20,60]);
    var P = arr(m*astre.g, 2);
    return { type:"num", niveau:1, rep:P, tol:Math.max(0.1,P*0.01), unite:"N",
      enonce:"Quelle est la valeur du poids d'un objet de masse $m = "+fr(m)+"$ @u{kg} "+astre.nom+" ? On prend $g = "+fr(astre.g)+"$ @u{N/kg}.",
      diag:[{v:m, m:"Tu as recopié la masse. La masse est en @u{kg}, le poids en @u{N} : ils sont reliés par $P = m × g$."},
            {v:arr(m/astre.g,3), m:"Tu as divisé au lieu de multiplier. $P = m × g$."},
            {v:arr(astre.g/m,3), m:"Tu as calculé $@f{g}{m}$. La formule est $P = m × g$."}],
      corr:["**Ce que donne l'énoncé.** Une masse en kilogrammes et l'intensité de la pesanteur de l'astre. Ce qu'on cherche : une force, en newtons.",
            "Le poids se calcule par $P = m × g$.",
            "$P = "+fr(m)+" × "+fr(astre.g)+"$.",
            "$P = "+fr(P)+"$ @u{N}.",
            "**Je vérifie.** La masse ne change jamais d'un astre à l'autre ; le poids, si. Et le résultat doit s'exprimer en newtons, pas en kilogrammes."],
      indice:"$P = m × g$, avec le $g$ de l'astre indiqué." };
  }},

{ id:"fo-gravitation", titre:"Effet de la distance sur une force", niveau:2, chap:"forces",
  gen:function(){
    var k = pick([2,3,4,5]);
    var loin = Math.random() < 0.5;
    return { type:"num", niveau:2, rep:k*k, tol:0.001,
      enonce: loin
        ? "La distance entre deux corps est multipliée par $"+k+"$. Par combien la force gravitationnelle est-elle **divisée** ?"
        : "La distance entre deux corps est divisée par $"+k+"$. Par combien la force gravitationnelle est-elle **multipliée** ?",
      diag:[{v:k, m:"La distance intervient **au carré** au dénominateur : un facteur $"+k+"$ sur $d$ devient $"+k+"^2 = "+(k*k)+"$ sur $d^2$."},
            {v:arr(2*k,3), m:"Tu as multiplié par 2 au lieu d'élever au carré. Le carré de $"+k+"$ vaut $"+(k*k)+"$, pas $"+(2*k)+"$."},
            {v:arr(k*k*k,3), m:"Tu as pris le cube. La loi de gravitation fait intervenir le carré de la distance."}],
      corr:["**Ce que demande la question.** Comment la force varie quand la distance change. Je n'ai besoin d'aucun nombre : seule compte la façon dont $d$ intervient dans la loi.",
            "La force s'écrit $F = G @f{m_A m_B}{d^2}$.",
            "La distance est élevée au carré au dénominateur.",
            "Un facteur $"+k+"$ sur $d$ donne un facteur $"+k+"^2 = "+(k*k)+"$ sur $d^2$.",
            "La force varie donc d'un facteur $"+(k*k)+"$.",
            "**Je vérifie.** La distance est **au carré** au dénominateur : un facteur sur $d$ devient son carré sur la force. C'est ce qui rend la gravitation si vite négligeable."],
      indice:"La distance est au carré : élève le facteur au carré." };
  }},

{ id:"fo-newton", titre:"Deuxième loi de Newton", niveau:3, chap:"forces",
  gen:function(){
    var m = pick([2,4,5,10]);
    var v1 = pick([0,1,2,3]), dv = pick([4,6,8,10]);
    var dt = pick([2,4,5]);
    var v2 = v1+dv;
    var F = arr(m*dv/dt, 3);
    return { type:"num", niveau:3, rep:F, tol:Math.max(0.05,F*0.01), unite:"N",
      enonce:"Un chariot de masse $m = "+fr(m)+"$ @u{kg} voit sa vitesse passer de $"+fr(v1)+"$ à $"+fr(v2)+"$ @u{m/s} en $"+fr(dt)+"$ @u{s}, en ligne droite. Quelle est la valeur de la somme des forces ?",
      diag:[{v:arr(dv/dt,3), m:"Tu as trouvé la variation de vitesse par seconde ($"+fr(arr(dv/dt,3))+"$ @u{m/s²}) mais oublié de multiplier par la masse."},
            {v:arr(m*dv,3), m:"Tu as multiplié par la variation totale de vitesse sans diviser par la durée. La loi est $ΣF = m × @f{Δv}{Δt}$."},
            {v:arr(m*v2/dt,3), m:"Tu as utilisé la vitesse finale au lieu de la **variation** de vitesse. C'est le changement qui compte, pas la valeur."}],
      corr:["**Ce que donne l'énoncé.** Une masse, deux vitesses et une durée. Ce qu'on cherche : la somme des forces.",
            "Variation de vitesse : $Δv = "+fr(v2)+" - "+fr(v1)+" = "+fr(dv)+"$ @u{m/s}.",
            "Par seconde : $@f{Δv}{Δt} = @f{"+fr(dv)+"}{"+fr(dt)+"} = "+fr(arr(dv/dt,3))+"$ @u{m/s²}.",
            "Deuxième loi : $ΣF = m × @f{Δv}{Δt}$.",
            "$ΣF = "+fr(m)+" × "+fr(arr(dv/dt,3))+" = "+fr(F)+"$ @u{N}.",
            "**Je vérifie.** À variation de vitesse égale, un objet deux fois plus lourd demande une force deux fois plus grande : la masse mesure la résistance au changement de mouvement."],
      indice:"Variation de vitesse, puis division par la durée, puis multiplication par la masse." };
  }}
];

var G_ELEC = [

{ id:"el-puissance", titre:"Puissance électrique", niveau:1, chap:"electrique",
  gen:function(){
    var U = pick([5,6,12,24,230]);
    var I = pick([0.5,1.5,2,2.5,4]);
    var P = arr(U*I,2);
    return { type:"num", niveau:1, rep:P, tol:Math.max(0.05,P*0.01), unite:"W",
      enonce:"Un dipôle soumis à une tension $U = "+fr(U)+"$ @u{V} est traversé par une intensité $I = "+fr(I)+"$ @u{A}. Quelle est sa puissance ?",
      diag:[{v:arr(U/I,3), m:"Tu as divisé la tension par l'intensité : cela donne une résistance en ohms, pas une puissance. $P = U × I$."},
            {v:arr(U+I,3), m:"Tu as additionné. Une tension et une intensité ne s'additionnent pas : leur produit donne une puissance."},
            {v:arr(I/U,5), m:"Tu as inversé la division. La puissance est le produit $U × I$."}],
      corr:["**Ce que donne l'énoncé.** Une tension en volts et une intensité en ampères. Ce qu'on cherche : une puissance, en watts.",
            "La puissance reçue par un dipôle vaut $P = U × I$.",
            "$P = "+fr(U)+" × "+fr(I)+"$.",
            "$P = "+fr(P)+"$ @u{W}.",
            "**Je vérifie l'ordre de grandeur.** Quelques watts pour une lampe, quelques centaines pour un appareil de cuisine, quelques milliers pour un radiateur."],
      indice:"$P = U × I$." };
  }},

{ id:"el-energie", titre:"Énergie consommée", niveau:2, chap:"electrique",
  gen:function(){
    var P = pick([40,60,100,500,1200,2000]);
    var min = pick([2,5,10,15,30]);
    var E = arr(P*min*60,0);
    return { type:"num", niveau:2, rep:E, tol:Math.max(1,E*0.005), unite:"J",
      enonce:"Un appareil de puissance $P = "+fr(P)+"$ @u{W} fonctionne pendant $"+min+"$ minutes. Quelle énergie a-t-il consommée, en joules ?",
      diag:[{v:arr(P*min,0), m:"Tu as laissé la durée en minutes. Pour obtenir des joules, la durée doit être en **secondes** : $"+min+"$ min $= "+(min*60)+"$ @u{s}. Ton résultat est 60 fois trop petit."},
            {v:arr(P/(min*60),5), m:"Tu as divisé au lieu de multiplier. Plus l'appareil reste allumé, plus il consomme."},
            {v:arr(P*min*3600,0), m:"Tu as multiplié par $3600$ comme si la durée était en heures. Elle est en minutes : le facteur est $60$."}],
      corr:["**Ce que donne l'énoncé.** Une puissance et une durée. Ce qu'on cherche : l'énergie consommée, en joules.",
            "L'énergie consommée vaut $E = P × Δt$.",
            "Je convertis la durée : $"+min+"$ minutes $= "+(min*60)+"$ @u{s}.",
            "$E = "+fr(P)+" × "+(min*60)+"$.",
            "$E = "+fr(E)+"$ @u{J}.",
            "**Je vérifie.** Garder la durée en minutes donne un résultat soixante fois trop petit. En joules, un appareil courant consomme des milliers d'unités en quelques minutes."],
      indice:"La durée doit être en secondes pour obtenir des joules." };
  }},

{ id:"el-joule", titre:"Puissance dissipée par effet Joule", niveau:2, chap:"electrique",
  gen:function(){
    var R = pick([5,10,20,50,100]);
    var I = pick([0.2,0.5,1.5,2,3]);
    var P = arr(R*I*I,3);
    return { type:"num", niveau:2, rep:P, tol:Math.max(0.05,P*0.01), unite:"W",
      enonce:"Une résistance $R = "+fr(R)+"$ @u{Ω} est traversée par une intensité $I = "+fr(I)+"$ @u{A}. Quelle puissance dissipe-t-elle par effet Joule ?",
      diag:[{v:arr(R*I,3), m:"Tu as oublié le carré : la formule est $P = R × I^2$, et $"+fr(I)+"^2 = "+fr(arr(I*I,4))+"$."},
            {v:arr(R*R*I*I,3), m:"Tu as élevé le produit entier au carré. Le carré ne porte que sur l'**intensité**."},
            {v:arr(R/(I*I),4), m:"Tu as divisé au lieu de multiplier. $P = R × I^2$."}],
      corr:["**Ce que donne l'énoncé.** Une résistance et l'intensité qui la traverse. Ce qu'on cherche : la puissance qu'elle dissipe en chaleur.",
            "La puissance dissipée s'écrit $P = R × I^2$.",
            "Je calcule d'abord le carré : $"+fr(I)+"^2 = "+fr(arr(I*I,4))+"$.",
            "$P = "+fr(R)+" × "+fr(arr(I*I,4))+"$.",
            "$P = "+fr(P)+"$ @u{W}.",
            "**Je mesure la portée du carré.** Doubler l'intensité quadruplerait cette puissance. C'est la raison d'être des lignes à haute tension."],
      indice:"Élève d'abord l'intensité au carré, puis multiplie par la résistance." };
  }},

{ id:"el-rendement", titre:"Rendement d'un appareil", niveau:2, chap:"electrique",
  gen:function(){
    var Pr = pick([500,800,1000,1500,2000,2400]);
    var eta = pick([0.6,0.75,0.8,0.9]);
    var Pu = arr(Pr*eta,1);
    return { type:"num", niveau:2, rep:arr(eta*100,1), tol:0.5, unite:"%",
      enonce:"Un appareil reçoit une puissance de $"+fr(Pr)+"$ @u{W} et en fournit $"+fr(Pu)+"$ @u{W} d'utile. Quel est son rendement, en pourcentage ?",
      diag:[{v:arr(100*Pr/Pu,1), m:"Tu as inversé la fraction. La puissance **utile** va au numérateur, et un rendement ne dépasse jamais $100$ %."},
            {v:arr(eta,3), m:"Le calcul est juste, mais la réponse est demandée en pourcentage : multiplie par 100."},
            {v:arr(Pr-Pu,1), m:"$"+fr(arr(Pr-Pu,1))+"$ @u{W} est la puissance **perdue**, pas le rendement. Le rendement est un rapport, sans unité."}],
      corr:["**Ce que donne l'énoncé.** Ce que l'appareil reçoit, et ce qu'il fournit d'utile. Ce qu'on cherche : la part de l'un dans l'autre.",
            "Le rendement vaut $η = @f{P_{utile}}{P_{reçue}}$.",
            "$η = @f{"+fr(Pu)+"}{"+fr(Pr)+"} = "+fr(eta)+"$.",
            "En pourcentage : $"+fr(arr(eta*100,1))+"$ %.",
            "Le reste, soit $"+fr(arr(Pr-Pu,1))+"$ @u{W}, est perdu en chaleur.",
            "**Je vérifie.** Un rendement dépasse-t-il $100$ % ? Alors la fraction a été inversée : l'utile va toujours au numérateur."],
      indice:"Utile divisée par reçue, puis multiplié par 100." };
  }}
];

var G_MECA = [

{ id:"mc-cinetique", titre:"Énergie cinétique", niveau:1, chap:"mecanique",
  gen:function(){
    var m = pick([0.5,2,5,60,800,1200]);
    var v = pick([2,4,10,20,30]);
    var E = arr(0.5*m*v*v,2);
    return { type:"num", niveau:1, rep:E, tol:Math.max(0.05,E*0.005), unite:"J",
      enonce:"Quelle est l'énergie cinétique d'un objet de masse $m = "+fr(m)+"$ @u{kg} se déplaçant à $v = "+fr(v)+"$ @u{m/s} ?",
      diag:[{v:arr(2*E,2), m:"Tu as oublié le facteur $@f{1}{2}$. La formule est $E_c = @f{1}{2} m v^2$."},
            {v:arr(0.5*m*v,3), m:"Tu as oublié d'élever la vitesse au carré : $"+fr(v)+"^2 = "+fr(v*v)+"$."},
            {v:arr(m*v,3), m:"Tu as calculé $m × v$ : ni le carré, ni le facteur $@f{1}{2}$."}],
      corr:["**Ce que donne l'énoncé.** Une masse et une vitesse. Ce qu'on cherche : l'énergie que l'objet possède parce qu'il bouge.",
            "Formule : $E_c = @f{1}{2} m v^2$.",
            "Je calcule d'abord le carré : $"+fr(v)+"^2 = "+fr(v*v)+"$.",
            "$E_c = 0{,}5 × "+fr(m)+" × "+fr(v*v)+"$.",
            "$E_c = "+fr(E)+"$ @u{J}.",
            "**Je retiens la leçon du carré.** À vitesse doublée, cette énergie est multipliée par quatre. C'est ce qui rend les excès de vitesse si dangereux."],
      indice:"Le carré de la vitesse d'abord, puis le facteur $@f{1}{2}$." };
  }},

{ id:"mc-potentielle", titre:"Énergie potentielle de pesanteur", niveau:1, chap:"mecanique",
  gen:function(){
    var m = pick([0.5,2,5,10,50,70]);
    var h = pick([1.5,2,3,5,10,20]);
    var g = 9.81;
    var E = arr(m*g*h,2);
    return { type:"num", niveau:1, rep:E, tol:Math.max(0.1,E*0.01), unite:"J",
      enonce:"De combien varie l'énergie potentielle de pesanteur d'un objet de $"+fr(m)+"$ @u{kg} que l'on monte de $"+fr(h)+"$ @u{m} ? On prend $g = 9{,}81$ @u{N/kg}.",
      diag:[{v:arr(m*h,3), m:"Tu as oublié $g$. La formule est $E_{pp} = m × g × z$, avec $g = 9{,}81$ @u{N/kg}."},
            {v:arr(m*g,3), m:"Tu as oublié la hauteur. Il faut multiplier les trois facteurs."},
            {v:arr(g*h,3), m:"Tu as oublié la masse. Un objet plus lourd emmagasine plus d'énergie à la même hauteur."}],
      corr:["**Ce que donne l'énoncé.** Une masse et une hauteur. Ce qu'on cherche : l'énergie mise en réserve par cette hauteur.",
            "Formule : $E_{pp} = m × g × z$.",
            "$E_{pp} = "+fr(m)+" × 9{,}81 × "+fr(h)+"$.",
            "$E_{pp} = "+fr(E)+"$ @u{J}.",
            "**Je vérifie.** Trois facteurs doivent apparaître dans le calcul : la masse, $g$, et la hauteur. En oublier un est l'erreur habituelle."],
      indice:"Trois facteurs : la masse, $g$, et la hauteur." };
  }},

{ id:"mc-chute", titre:"Vitesse après une chute", niveau:3, chap:"mecanique",
  gen:function(){
    var h = pick([1.8,2,3.2,5,8,10,20]);
    var g = 9.81;
    var v = arr(Math.sqrt(2*g*h),2);
    return { type:"num", niveau:3, rep:v, tol:Math.max(0.05,v*0.01), unite:"m/s",
      enonce:"Un objet est lâché sans vitesse d'une hauteur de $"+fr(h)+"$ @u{m}, sans frottement. Quelle est sa vitesse en arrivant au sol ? On prend $g = 9{,}81$ @u{N/kg}.",
      diag:[{v:arr(2*g*h,2), m:"Tu as calculé $2gh$ mais oublié la racine carrée. Ce résultat est $v^2$, pas $v$."},
            {v:arr(g*h,2), m:"Tu as calculé $g × h$ : il manque le facteur 2 et la racine carrée. La formule est $v = @r{2 g h}$."},
            {v:arr(Math.sqrt(g*h),3), m:"Tu as oublié le facteur 2 sous la racine : $v = @r{2 g h}$."}],
      corr:["**Ce que donne l'énoncé.** Une hauteur de chute, sans vitesse initiale et sans frottement. Ce qu'on cherche : la vitesse d'arrivée.",
            "Sans frottement, l'énergie mécanique se conserve : $@f{1}{2} m v^2 = m g h$.",
            "La masse se simplifie : $v^2 = 2 g h$.",
            "$v^2 = 2 × 9{,}81 × "+fr(h)+" = "+fr(arr(2*g*h,2))+"$.",
            "$v = @r{"+fr(arr(2*g*h,2))+"} = "+fr(v)+"$ @u{m/s}.",
            "**Je remarque ce qui n'apparaît pas.** La masse ne figure nulle part : elle s'est simplifiée. Deux objets de masses différentes arrivent à la même vitesse."],
      indice:"$v = @r{2gh}$ — la racine carrée en dernier." };
  }},

{ id:"mc-travail", titre:"Travail d'une force", niveau:2, chap:"mecanique",
  gen:function(){
    var F = pick([20,30,50,60,80,100]);
    var d = pick([2,4,5,8,10]);
    var sens = pick(["moteur","resistant","perpendiculaire"]);
    var W = sens==="moteur" ? F*d : (sens==="resistant" ? -F*d : 0);
    var txt = sens==="moteur" ? "dans le sens du déplacement"
            : sens==="resistant" ? "en sens opposé au déplacement"
            : "perpendiculairement au déplacement";
    return { type:"num", niveau:2, rep:W, tol:0.5, unite:"J",
      enonce:"Une force de $"+fr(F)+"$ @u{N} s'exerce "+txt+" sur une distance de $"+fr(d)+"$ @u{m}. Quel est son travail ?",
      diag:[{v:-W, m: sens==="moteur"
              ? "Le signe est faux : la force est **dans le sens** du déplacement, l'angle vaut $0°$ et le travail est moteur, donc positif."
              : "Le signe est faux : la force s'oppose au déplacement, l'angle vaut $180°$ et le travail est résistant, donc négatif."},
            {v:F*d, m: sens==="perpendiculaire"
              ? "Tu as calculé $F × d$ sans tenir compte de l'angle. À $90°$, $cos(90°) = 0$ : le travail est nul."
              : "Attention au signe imposé par l'angle : $cos(180°) = -1$."},
            {v:arr(F/d,3), m:"Tu as divisé. Le travail est un produit : $W = F × d × cos(α)$."}],
      corr:["**Ce que donne l'énoncé.** Une force, une distance, et surtout l'**angle** entre les deux. C'est l'angle qui décide de tout.",
            sens==="moteur" ? "La force est parallèle au déplacement, de même sens : $α = 0°$ et $cos(α) = 1$."
           : sens==="resistant" ? "La force est opposée au déplacement : $α = 180°$ et $cos(α) = -1$."
           : "La force est perpendiculaire au déplacement : $α = 90°$ et $cos(α) = 0$.",
            "$W = F × d × cos(α)$.",
            "$W = "+fr(F)+" × "+fr(d)+" × "+(sens==="moteur"?"1":(sens==="resistant"?"(-1)":"0"))+"$.",
            "$W = "+fr(W)+"$ @u{J}.",
            "**Je relis le signe.** Positif : travail moteur, l'objet gagne de l'énergie. Négatif : travail résistant, il en perd. Nul : la force ne transfère rien."],
      indice:"Regarde l'angle entre la force et le déplacement avant de calculer." };
  }}
];

var G_ONDES = [

{ id:"on-lambda", titre:"Longueur d'onde", niveau:1, chap:"ondes",
  gen:function(){
    var v = pick([340,340,1500,5000]);
    var f = pick([100,200,250,340,500,850,1000]);
    var lam = arr(v/f,5);
    return { type:"num", niveau:1, rep:lam, tol:Math.max(1e-4,lam*0.01), unite:"m",
      enonce:"Une onde de fréquence $f = "+fr(f)+"$ @u{Hz} se propage à la célérité $v = "+fr(v)+"$ @u{m/s}. Quelle est sa longueur d'onde ?",
      diag:[{v:arr(f/v,5), m:"Tu as calculé $@f{f}{v}$ au lieu de $@f{v}{f}$. Contrôle par les unités : des @u{m/s} divisés par des @u{Hz} donnent des mètres."},
            {v:arr(v*f,2), m:"Tu as multiplié. La formule $λ = v × T$ utilise la **période**, pas la fréquence — et $T = @f{1}{f}$."},
            {v:arr(1/f,6), m:"Tu as calculé la période. Il reste à la multiplier par la célérité."}],
      corr:["**Ce que donne l'énoncé.** Une célérité et une fréquence. Ce qu'on cherche : la distance entre deux motifs de l'onde.",
            "La relation est $λ = @f{v}{f}$.",
            "$λ = @f{"+fr(v)+"}{"+fr(f)+"}$.",
            "$λ = "+fr(lam)+"$ @u{m}.",
            "**Je vérifie par les unités.** Des @u{m/s} divisés par des @u{Hz} donnent des mètres : c'est bien une longueur d'onde."],
      indice:"$λ = @f{v}{f}$ : la célérité au numérateur." };
  }},

{ id:"on-retard", titre:"Distance à partir d'un retard", niveau:1, chap:"ondes",
  gen:function(){
    var v = 340;
    var t = pick([1.5,2,3,4,5,6,8]);
    var d = arr(v*t,1);
    return { type:"num", niveau:1, rep:d, tol:1, unite:"m",
      enonce:"On voit un éclair, puis on entend le tonnerre $"+fr(t)+"$ @u{s} plus tard. À quelle distance la foudre est-elle tombée ? On prend $v = 340$ @u{m/s}.",
      diag:[{v:arr(v/t,2), m:"Tu as divisé la célérité par la durée. La distance s'obtient en multipliant : $d = v × Δt$."},
            {v:arr(t/v,5), m:"Tu as divisé la durée par la célérité, ce qui donnerait une durée."},
            {v:arr(v+t,1), m:"Tu as additionné. Une vitesse et une durée se multiplient pour donner une distance."}],
      corr:["**Ce que donne l'énoncé.** Le retard entre l'éclair, vu instantanément, et le tonnerre. Ce qu'on cherche : la distance parcourue par le son.",
            "La lumière arrive presque instantanément : le décalage mesure le trajet du son.",
            "$d = v × Δt$.",
            "$d = 340 × "+fr(t)+"$.",
            "$d = "+fr(d)+"$ @u{m}.",
            "**Je vérifie avec la règle de terrain.** Environ un kilomètre pour trois secondes. Compare ton résultat à cet ordre de grandeur."],
      indice:"$d = v × Δt$." };
  }},

{ id:"on-frequence", titre:"Période et fréquence", niveau:2, chap:"ondes",
  gen:function(){
    var Tms = pick([0.5,1,2,4,5,10,20]);
    var f = arr(1000/Tms, 2);
    return { type:"num", niveau:2, rep:f, tol:Math.max(0.1,f*0.01), unite:"Hz",
      enonce:"Un signal a une période $T = "+fr(Tms)+"$ @u{ms}. Quelle est sa fréquence ?",
      diag:[{v:arr(1/Tms,4), m:"Tu as gardé la période en millisecondes. $"+fr(Tms)+"$ @u{ms} $= "+fr(arr(Tms/1000,6))+"$ @u{s} : ton résultat est mille fois trop petit."},
            {v:Tms, m:"Tu as recopié la période. La fréquence en est l'**inverse** : $f = @f{1}{T}$."},
            {v:arr(Tms/1000,6), m:"C'est la période convertie en secondes, pas la fréquence. Il reste à prendre l'inverse."}],
      corr:["**Ce que donne l'énoncé.** Une période, en millisecondes. Ce qu'on cherche : la fréquence, en hertz.",
            "La fréquence est l'inverse de la période : $f = @f{1}{T}$.",
            "Je convertis : $T = "+fr(Tms)+"$ @u{ms} $= "+fr(arr(Tms/1000,6))+"$ @u{s}.",
            "$f = @f{1}{"+fr(arr(Tms/1000,6))+"}$.",
            "$f = "+fr(f)+"$ @u{Hz}.",
            "**Je vérifie par le sens.** Un motif court signifie beaucoup de motifs par seconde, donc une fréquence élevée. Période et fréquence varient en sens inverse."],
      indice:"Convertis en secondes, puis prends l'inverse." };
  }}
];

var G_LUMIERE = [

{ id:"lu-photon", titre:"Énergie d'un photon en électronvolts", niveau:2, chap:"lumiere",
  gen:function(){
    var eV = pick([1.5,2,2.5,3,3.5,4]);
    var J = arr(eV*1.6e-19, 22);
    return { type:"num", niveau:2, rep:eV, tol:0.05, unite:"eV",
      enonce:"Un photon transporte une énergie de $"+fr(arr(eV*1.6,3))+" × 10^{-19}$ @u{J}. Quelle est cette énergie en électronvolts ? On donne $1$ @u{eV} $= 1{,}6 × 10^{-19}$ @u{J}.",
      diag:[{v:arr(1/eV,4), m:"Tu as inversé la division. Un photon visible transporte quelques @u{eV} : un résultat inférieur à 1 doit alerter."},
            {v:arr(eV*1.6,3), m:"Tu as recopié le facteur devant la puissance de dix. Il faut le diviser par $1{,}6$."}],
      corr:["**Ce que donne l'énoncé.** L'énergie d'un photon en joules, et la valeur d'un électronvolt. Ce qu'on cherche : la même énergie dans l'autre unité.",
            "Un électronvolt vaut $1{,}6 × 10^{-19}$ @u{J}.",
            "Je divise l'énergie du photon par cette valeur.",
            "$@f{"+fr(arr(eV*1.6,3))+" × 10^{-19}}{1{,}6 × 10^{-19}} = "+fr(eV)+"$.",
            "L'énergie vaut $"+fr(eV)+"$ @u{eV}.",
            "**Je vérifie l'ordre de grandeur.** Un photon visible vaut entre $1{,}8$ et $3{,}1$ @u{eV}. En dehors, c'est de l'infrarouge, de l'ultraviolet — ou une erreur."],
      indice:"Combien de fois $1{,}6$ tient-il dans le facteur donné ?" };
  }},

{ id:"lu-niveaux", titre:"Photon émis entre deux niveaux", niveau:2, chap:"lumiere",
  gen:function(){
    var bas = pick([-13.6,-5.4,-3.4,-4.2]);
    var haut = arr(bas + pick([1.9,2.5,3.0,4.8,10.2]), 2);
    var dE = arr(haut - bas, 2);
    return { type:"num", niveau:2, rep:dE, tol:0.02, unite:"eV",
      enonce:"Un atome passe d'un niveau $E_2 = "+fr(haut)+"$ @u{eV} à un niveau $E_1 = "+fr(bas)+"$ @u{eV}. Quelle est l'énergie du photon émis ?",
      diag:[{v:-dE, m:"L'énergie d'un photon est toujours **positive**. L'atome perd de l'énergie, et c'est cette perte qui part dans le photon : $ΔE = E_2 - E_1$."},
            {v:arr(haut+bas,2), m:"Tu as additionné les deux niveaux. L'énergie émise est leur **écart**, donc une différence."},
            {v:Math.abs(haut), m:"Tu as pris la valeur du niveau de départ. C'est la différence entre les deux niveaux qui compte."}],
      corr:["**Ce que donne l'énoncé.** Deux niveaux d'énergie, tous deux négatifs. Ce qu'on cherche : l'énergie emportée par le photon émis.",
            "L'atome descend de $E_2$ vers $E_1$ : il perd de l'énergie.",
            "$ΔE = E_2 - E_1 = "+fr(haut)+" - ("+fr(bas)+")$.",
            "Attention aux signes : soustraire un nombre négatif revient à l'ajouter.",
            "$ΔE = "+fr(dE)+"$ @u{eV}.",
            "**Je vérifie le signe.** L'énergie d'un photon est toujours positive. Un résultat négatif signale une soustraction faite dans le mauvais sens."],
      indice:"Soustraire un nombre négatif revient à l'ajouter." };
  }},

{ id:"lu-grandissement", titre:"Grandissement d'une lentille", niveau:3, chap:"lumiere",
  gen:function(){
    var tailleObj = pick([2,3,4,5]);
    var g = pick([0.5,2,3,0.25]);
    var tailleImg = arr(tailleObj*g,2);
    return { type:"num", niveau:3, rep:arr(-g,3), tol:0.005,
      enonce:"Un objet de $"+fr(tailleObj)+"$ @u{cm} donne, à travers une lentille convergente, une image **renversée** de $"+fr(tailleImg)+"$ @u{cm}. Quelle est la valeur du grandissement $γ$ ?",
      diag:[{v:g, m:"La valeur est bonne mais le signe manque. Une image **renversée** correspond à un grandissement **négatif**."},
            {v:arr(-1/g,3), m:"Tu as inversé la fraction. Le grandissement est $@f{@u{A'B'}}{@u{AB}}$ : la taille de l'**image** au numérateur."},
            {v:arr(1/g,3), m:"Tu as inversé la fraction **et** oublié le signe."}],
      corr:["**Ce que donne l'énoncé.** La taille de l'objet, celle de l'image, et le fait qu'elle soit renversée. Ce qu'on cherche : le grandissement, signe compris.",
            "Le grandissement vaut $γ = @f{@u{A'B'}}{@u{AB}}$.",
            "En valeur absolue : $@f{"+fr(tailleImg)+"}{"+fr(tailleObj)+"} = "+fr(g)+"$.",
            "L'image est renversée, donc le grandissement est négatif.",
            "$γ = "+fr(arr(-g,3))+"$.",
            "**Je relis le résultat.** Le signe dit droite ou renversée ; la valeur absolue dit agrandie ou réduite. Deux informations dans un seul nombre."],
      indice:"Taille de l'image sur taille de l'objet, avec un signe négatif si l'image est renversée." };
  }}
];

/* =====================================================================
   Registre
   ===================================================================== */
var FAMILLES = [
  { id:"transformation", titre:"Quantité de matière", gens:G_TRANSFO },
  { id:"titrage",        titre:"Titrages",            gens:G_TITRAGE },
  { id:"mesures",        titre:"Étalonnage",          gens:G_MESURES },
  { id:"cristaux",       titre:"Cristaux",            gens:G_CRISTAUX },
  { id:"vitesse",        titre:"Vitesse",             gens:G_VITESSE },
  { id:"forces",         titre:"Forces",              gens:G_FORCES  },
  { id:"electrique",     titre:"Électricité",         gens:G_ELEC    },
  { id:"mecanique",      titre:"Énergie",             gens:G_MECA    },
  { id:"ondes",          titre:"Ondes",               gens:G_ONDES   },
  { id:"lumiere",        titre:"Lumière",             gens:G_LUMIERE }
];

function tousGens(){
  var out = [];
  FAMILLES.forEach(function(f){ out = out.concat(f.gens); });
  return out;
}
/* les générateurs rattachés à un chapitre donné */
function pourChapitre(id){
  return tousGens().filter(function(g){ return g.chap === id; });
}
function fabriquer(famId, niveauMax){
  var fam = FAMILLES.filter(function(f){return f.id===famId;})[0];
  var pool = famId==="mix" ? tousGens() : (fam ? fam.gens : pourChapitre(famId));
  if(!pool || !pool.length) pool = tousGens();
  if(niveauMax){
    var f2 = pool.filter(function(g){ return g.niveau<=niveauMax; });
    if(f2.length) pool = f2;
  }
  var g = pick(pool);
  var e = g.gen();
  e.id = "gen-"+g.id+"-"+Math.random().toString(36).slice(2,8);
  e.source = g.titre;
  if(e.tol==null && e.type==="num") e.tol = 0.0005;
  /* Selon les nombres tirés, un distracteur peut tomber pile sur la bonne
     réponse. On l'écarte, ainsi que les doublons, pour ne jamais déclarer
     fausse une réponse juste. */
  if(e.type==="num" && e.diag){
    var vus=[];
    e.diag = e.diag.filter(function(d){
      if(!isFinite(d.v)) return false;
      if(Math.abs(d.v - e.rep) <= e.tol) return false;
      for(var i=0;i<vus.length;i++) if(Math.abs(d.v-vus[i]) <= e.tol) return false;
      vus.push(d.v); return true;
    });
  }
  return e;
}
window.GEN = { fabriquer:fabriquer, FAMILLES:FAMILLES,
               pourChapitre:pourChapitre, tous:tousGens };

/* =====================================================================
   Vue « Entraînement illimité »
   ===================================================================== */
var ee = A.S.entrain || {};
var ent = { famille:"transformation", niveau:3, serie:0, exo:null,
            meilleure:ee.meilleure||0, faits:ee.faits||0, reussis:ee.reussis||0 };

window.VUE_ENTRAINEMENT = function(){
  var el=A.el, w=window.WRAPDIV();
  w.innerHTML =
    '<div class="eyebrow">Entraînement</div>'+
    '<h1 style="font-size:31px;margin:8px 0 8px">Exercices générés à la volée</h1>'+
    '<p class="muted" style="max-width:62ch">Les nombres changent à chaque tirage, mais les explications d\'erreur sont recalculées avec eux : tu auras toujours un diagnostic juste, jamais un message passe-partout.</p>';

  var reglages = el("div","card pad"); reglages.style.marginTop="22px";
  var r1 = el("div","row");
  r1.appendChild(el("span","small muted","Thème"));
  var seg = el("div","seg"); seg.style.flexWrap="wrap";
  window.GEN.FAMILLES.concat([{id:"mix",titre:"Mélange"}]).forEach(function(f){
    var b=el("button",null,f.titre);
    b.setAttribute("aria-pressed", ent.famille===f.id);
    b.onclick=function(){ ent.famille=f.id; ent.exo=null; window.RENDER(); };
    seg.appendChild(b);
  });
  r1.appendChild(seg);
  reglages.appendChild(r1);

  var r2 = el("div","row"); r2.style.marginTop="12px";
  r2.appendChild(el("span","small muted","Difficulté"));
  var seg2 = el("div","seg");
  [[1,"Bases"],[2,"Standard"],[3,"Tout"]].forEach(function(o){
    var b=el("button",null,o[1]);
    b.setAttribute("aria-pressed", ent.niveau===o[0]);
    b.onclick=function(){ ent.niveau=o[0]; ent.exo=null; window.RENDER(); };
    seg2.appendChild(b);
  });
  r2.appendChild(seg2);
  reglages.appendChild(r2);
  w.appendChild(reglages);

  var score = el("div","card pad"); score.style.marginTop="14px";
  score.innerHTML =
    '<div class="row" style="justify-content:space-between;align-items:flex-end">'+
      '<div class="stat"><div class="n">'+ent.serie+'</div><div class="l">Série en cours</div></div>'+
      '<div class="stat"><div class="n">'+ent.meilleure+'</div><div class="l">Meilleure série</div></div>'+
      '<div class="stat"><div class="n">'+(ent.faits?A.pct(ent.reussis,ent.faits):0)+'%</div><div class="l">Réussite ('+ent.faits+' faits)</div></div>'+
    '</div>';
  w.appendChild(score);

  if(!ent.exo) ent.exo = fabriquer(ent.famille, ent.niveau);
  var zone = el("div"); zone.style.marginTop="18px";
  zone.appendChild(bloc(ent.exo));
  w.appendChild(zone);

  function bloc(exo){
    var faux = { id:"entrainement", titre:"Entraînement", n:0, exos:[exo] };
    var holder = el("div");
    var lbl = el("div","row"); lbl.style.marginBottom="8px";
    lbl.innerHTML='<span class="tag b">'+A.esc(exo.source)+'</span>';
    holder.appendChild(lbl);
    holder.appendChild(window.EXONODE(faux, exo, null, function(ok, actions){
      ent.faits++;
      if(ok){ ent.reussis++; ent.serie++; if(ent.serie>ent.meilleure) ent.meilleure=ent.serie; }
      else ent.serie = 0;
      A.S.entrain = { meilleure:ent.meilleure, faits:ent.faits, reussis:ent.reussis };
      A.save();
      var suiv = el("button","btn pri sm","Exercice suivant →");
      suiv.onclick=function(){ ent.exo=fabriquer(ent.famille, ent.niveau); window.RENDER(); };
      actions.appendChild(suiv);
      var sc = document.querySelectorAll("#view .stat .n");
      if(sc[0]) sc[0].textContent=ent.serie;
      if(sc[1]) sc[1].textContent=ent.meilleure;
      if(sc[2]) sc[2].textContent=(ent.faits?A.pct(ent.reussis,ent.faits):0)+"%";
    }));
    return holder;
  }

  var passer = el("button","btn gho","Passer à un autre exercice");
  passer.style.marginTop="14px";
  passer.onclick=function(){ ent.serie=0; ent.exo=fabriquer(ent.famille, ent.niveau); window.RENDER(); };
  w.appendChild(passer);
  return w;
};
})();
