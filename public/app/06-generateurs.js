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

/* Élision : « de » devient « d' » et « du » devient « de l' » devant une
   voyelle ou un h muet. Sans cela on lit « de eau » ou « du éthanol ». */
function voyelle(n){ return /^[aeiouyâàéèêëîïôöûü]/i.test(n) || /^h/i.test(n); }
function de_(n){ return (voyelle(n) ? "d'" : "de ") + n; }
function du_(n){ return (voyelle(n) ? "de l'" : "du ") + n; }

/* ============================ CHIMIE ============================ */

var G_TRANSFO = [

{ id:"tr-mole-masse", titre:"Quantité de matière à partir d'une masse", niveau:1, chap:"transformation",
  gen:function(){
    var esp = pick([
      { f:"H_2O", nom:"eau", M:18 }, { f:"NaCl", nom:"chlorure de sodium", M:58.5 },
      { f:"CO_2", nom:"dioxyde de carbone", M:44 }, { f:"C_6H_{12}O_6", nom:"glucose", M:180 },
      { f:"CaCO_3", nom:"carbonate de calcium", M:100 }
    ]);
    /* pas de n = 0,1 : pour CaCO₃ (M = 100), m = 10 = M/m, et « masse
       recopiée » se confondait avec « divisé à l'envers » */
    var n = pick([0.2, 0.25, 0.3, 0.5, 2, 4]);
    var m = arr(esp.M * n, 2);
    return { type:"num", niveau:1, rep:n, tol:Math.max(0.001, n*0.01), unite:"mol",
      enonce:"Quelle quantité de matière représente $"+fr(m)+"$ @u{g} "+de_(esp.nom)+" $@c{"+esp.f+"}$ ? On donne $M = "+fr(esp.M)+"$ @u{g/mol}.",
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
    /* si C (en mol/L) vaut V (en L), C/V et V/C donnent le même nombre et
       les deux messages se confondent */
    if(Math.abs(C - Vml/1000) < 1e-9) Vml = 250;
    var n = arr(C * Vml/1000, 6);
    return { type:"num", niveau:1, rep:n, tol:n*0.01, unite:"mol",
      enonce:"On prélève $"+Vml+"$ @u{mL} d'une solution de concentration $C = "+fr(C)+"$ @u{mol/L}. Quelle quantité de matière a-t-on prélevée ?",
      diag:[{v:arr(C*Vml,4), m:"Tu as gardé le volume en millilitres. Dans $n = C × V$, le volume doit être en **litres** : $"+Vml+"$ @u{mL} $= "+fr(Vml/1000)+"$ @u{L}. Ton résultat est mille fois trop grand."},
            {v:arr(C/(Vml/1000),4), m:"Tu as divisé la concentration par le volume. Une concentration est un nombre de moles **par litre** : on la multiplie par le nombre de litres."},
            {v:arr((Vml/1000)/C,4), m:"Tu as inversé la fraction. La formule est $n = C × V$, une multiplication."}],
      corr:["**Ce que donne l'énoncé.** Un volume de solution et sa concentration. Ce qu'on cherche : la quantité de matière prélevée.",
            "La donnée est un volume de solution et une concentration : $n = C × V$.",
            "Je convertis : $"+Vml+"$ @u{mL} $= "+fr(Vml/1000)+"$ @u{L}.",
            "$n = "+fr(C)+" × "+fr(Vml/1000)+"$.",
            "$n = "+fr(n)+"$ @u{mol}.",
            "**Je vérifie.** Le résultat est en moles, et il vaut moins qu'une mole : normal pour quelques dizaines ou centaines de millilitres d'une solution diluée."],
      indice:"Convertis le volume en litres **avant** de multiplier." };
  }},

{ id:"tr-limitant", titre:"Réactif limitant et avancement maximal", niveau:2, chap:"transformation",
  gen:function(){
    /* coefficients réduits (jamais « 2 A + 2 B »), et le limitant tiré au
       sort : sinon c'était toujours A, ce qui s'apprend par cœur */
    /* on retire tant que deux erreurs différentes donneraient le même
       nombre (quantités égales, quantité de A égale au quotient de
       l'autre…) : l'élève recevrait le message d'une autre erreur */
    var a, b, xl, xo, aLim, xa, xb, nA, nB, essai, vals;
    for(essai = 0; essai < 30; essai++){
      a = pick([1,2]); b = (a === 2) ? 3 : pick([2,3]);
      xl = pick([0.10,0.20,0.30,0.40,0.60]);
      xo = arr(xl + pick([0.05,0.10,0.20]), 2);
      aLim = pick([true,false]);
      xa = aLim ? xl : xo; xb = aLim ? xo : xl;
      nA = arr(a*xa,3); nB = arr(b*xb,3);
      vals = [xl, xo, nB, arr(nA+nB,3)].concat(a > 1 ? [nA] : []);
      if(vals.every(function(v, i){ return vals.every(function(w, j){ return i === j || Math.abs(v - w) > 0.02; }); })) break;
    }
    var L = aLim ? "A" : "B", O = aLim ? "B" : "A";
    var diag = [];
    if(a > 1) diag.push({v:nA, m:"Tu as pris la quantité de $@c{A}$ telle quelle. Il faut d'abord la diviser par son nombre stœchiométrique $"+a+"$ : $@f{"+fr(nA)+"}{"+a+"} = "+fr(xa)+"$ @u{mol}."});
    diag.push({v:nB, m:"Tu as pris la quantité de $@c{B}$ telle quelle. Il faut d'abord la diviser par son nombre stœchiométrique $"+b+"$ : $@f{"+fr(nB)+"}{"+b+"} = "+fr(xb)+"$ @u{mol}."});
    diag.push({v:xo, m:"Tu as pris le quotient de $@c{"+O+"}$, qui vaut $"+fr(xo)+"$ @u{mol}. Mais c'est le **plus petit** quotient qui l'emporte, et celui de $@c{"+L+"}$ vaut $"+fr(xl)+"$ @u{mol}."});
    diag.push({v:arr(nA+nB,3), m:"Tu as additionné les deux quantités. L'avancement n'est pas une somme : c'est le nombre de fois où la réaction peut se produire."});
    return { type:"num", niveau:2, rep:xl, tol:0.005, unite:"mol",
      enonce:"Pour la réaction $"+(a>1?a+" ":"")+"@c{A} + "+b+" @c{B} → @c{C}$, on introduit $"+fr(nA)+"$ @u{mol} de $@c{A}$ et $"+fr(nB)+"$ @u{mol} de $@c{B}$. Quelle est la valeur de $x_{max}$ ?",
      diag:diag,
      corr:["**Ce que donne l'énoncé.** Deux quantités de réactifs et une équation ajustée. Ce qu'on cherche : jusqu'où la réaction peut aller, c'est-à-dire $x_{max}$.",
            "Je calcule le quotient de chaque réactif par son nombre stœchiométrique.",
            "Pour $@c{A}$ : $@f{"+fr(nA)+"}{"+a+"} = "+fr(xa)+"$ @u{mol}.",
            "Pour $@c{B}$ : $@f{"+fr(nB)+"}{"+b+"} = "+fr(xb)+"$ @u{mol}.",
            "Le plus petit est celui de $@c{"+L+"}$ : $@c{"+L+"}$ est limitant et $x_{max} = "+fr(xl)+"$ @u{mol}.",
            "**Je vérifie.** En remplaçant $x$ par $x_{max}$ dans la ligne du réactif limitant, sa quantité doit tomber exactement à zéro. C'est bien le cas."],
      indice:"Compare $@f{n}{ν}$ pour chaque réactif, et garde le plus petit." };
  }},

{ id:"tr-masse-produit", titre:"Masse de produit formé", niveau:3, chap:"transformation",
  gen:function(){
    var M1 = pick([24,40,56,64]), M2 = M1 + 16;        // un oxyde
    var n = pick([0.10,0.20,0.25,0.50]);
    var m1 = arr(M1*n,2), m2 = arr(M2*n,2);
    return { type:"num", niveau:3, rep:m2, tol:Math.max(0.05,m2*0.01), unite:"g",
      enonce:"Un métal $@c{X}$ brûle selon $2 @c{X} + @c{O_2} → 2 @c{XO}$. On fait brûler $"+fr(m1)+"$ @u{g} de $@c{X}$ dans un excès de dioxygène. On suppose la transformation totale. Quelle masse d'oxyde obtient-on ? Données : $M(@c{X}) = "+M1+"$ @u{g/mol}, $M(@c{XO}) = "+M2+"$ @u{g/mol}.",
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
  }},

{ id:"tr-avancement-final", titre:"Avancement final à partir d'une mesure", niveau:2, chap:"transformation",
  gen:function(){
    var r = pick([
      /* pas H2 + I2 : ce système s'arrête vers 70 à 97 % de x_max, les fractions tirées ici seraient irréalistes */
      { eq:"@c{N_2} + 3 @c{H_2} → 2 @c{NH_3}", A:"@c{N_2}", nuA:1, B:"@c{H_2}", nuB:3, P:"@c{NH_3}", nom:"d'ammoniac", ou:"conditions industrielles : vers $500$ @u{°C}, environ $200$ fois la pression atmosphérique, avec un catalyseur",
        /* vers 500 °C et 200 bar, x_f/x_max vaut environ 0,3 (0,29 à 0,36 selon la composition ;
           constante d'équilibre de mémoire, à ±30 %) : on tire autour, jamais au-delà de 0,4 */ fr:[0.2, 0.3, 0.4] },
      { eq:"2 @c{SO_2} + @c{O_2} → 2 @c{SO_3}", A:"@c{SO_2}", nuA:2, B:"@c{O_2}", nuB:1, P:"@c{SO_3}", nom:"de trioxyde de soufre", ou:"vers $700$ @u{°C}, sous la pression atmosphérique",
        /* vers 700 °C sous 1 bar, x_f/x_max vaut 0,53 à 0,69 selon la composition (estimation) */ fr:[0.6, 0.7] }
    ]);
    var nA = pick([1.0, 2.0, 3.0]), nB = pick([1.5, 2.0, 3.0, 4.0]);
    var xmax = Math.min(nA/r.nuA, nB/r.nuB);
    /* la mesure a deux chiffres, comme au laboratoire ; pas de fraction 0,5 : 2 x_f vaudrait x_max */
    var nP = Number((2*pick(r.fr)*xmax).toPrecision(2));
    var xf = arr(nP/2, 4);
    /* affichages : la mesure à deux chiffres (0,40 et pas 0,4), x_f et x_max à trois */
    var mes = fr(nP.toPrecision(2)), qA = nA/r.nuA, qB = nB/r.nuB;
    var eg = function(v){ return (Number(v.toPrecision(3)) === v ? "= " : "≈ ") + fr(v.toPrecision(3)); };
    var aff = function(v){ return fr(Number(v.toPrecision(2)) === v ? v.toPrecision(2) : v.toPrecision(3)); };
    return { type:"num", niveau:2, rep:xf, tol:Math.max(0.002, xf*0.01), unite:"mol",
      enonce:"On introduit $"+fr(nA.toFixed(1))+"$ @u{mol} de $"+r.A+"$ et $"+fr(nB.toFixed(1))+"$ @u{mol} de $"+r.B+"$ dans un récipient fermé, où ils réagissent selon $"+r.eq+"$ ("+r.ou+"). À l'état final, on mesure $"+mes+"$ @u{mol} "+r.nom+". Quel est l'avancement final $x_f$ ?",
      diag:[{v:nP, m:"Tu as recopié la quantité mesurée. Le produit a un coefficient $2$ : $n("+r.P+") = 2 x_f$, donc $x_f = @f{"+mes+"}{2}$."},
            {v:arr(4*xf,3), m:"Tu as multiplié par le coefficient au lieu de diviser : $n("+r.P+") = 2 x_f$, donc $x_f = @f{n}{2}$."},
            {v:arr(xmax,3), m:"C'est $x_{max}$, calculé comme si la transformation était totale. L'avancement final se déduit de la **mesure**."}],
      corr:["**La ligne du produit**, absent au départ : $n("+r.P+") = 2 x_f$.",
            "**J'isole $x_f$.** $x_f = @f{"+mes+"}{2} = "+aff(xf)+"$ @u{mol}.",
            "**Je calcule $x_{max}$** à partir de l'état initial. Quotients : $@f{"+fr(nA.toFixed(1))+"}{"+r.nuA+"} "+eg(qA)+"$ @u{mol} pour $"+r.A+"$, $@f{"+fr(nB.toFixed(1))+"}{"+r.nuB+"} "+eg(qB)+"$ @u{mol} pour $"+r.B+"$. "+(qA === qB ? "Les deux sont égaux (mélange stœchiométrique)" : "Le plus petit l'emporte")+" : $x_{max} "+eg(xmax)+"$ @u{mol}.",
            "**Je conclus.** $x_f < x_{max}$ : la transformation est non totale ; l'état final se calcule avec $x_f$."],
      indice:"Écris la ligne du produit dans le tableau d'avancement, avec $x_f$." };
  }}
];

var G_TITRAGE = [

{ id:"ti-simple", titre:"Concentration à l'équivalence", niveau:1, chap:"titrage",
  gen:function(){
    var CB = pick([0.010,0.020,0.050,0.10,0.20]);
    /* pas de V_B = 24 avec V_A = 25 : les volumes inversés donnent alors
       C_B × 25/24, à 4 % de C_B seulement, et l'élève qui arrondit à deux
       chiffres retombe pile sur C_B (C_B = 0,010 : 0,010417 s'écrit « 0,010 »)
       et reçoit le message « tu as recopié la concentration du titrant »
       (5 combinaisons sur 105 retirées) */
    var VA = pick([10,20,25]);
    var VB = pick(VA === 25 ? [8,12,14,15,16,18] : [8,12,14,15,16,18,24]);
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
    /* On retire tant que deux des valeurs {réponse, rapport inversé, rapport
       seul, différence ajoutée} sont trop proches : sinon fabriquer() en
       écarte une comme doublon, ou fenetreDiag() donne à une erreur le
       message d'une autre (ex. C0 = 4, f = 2 : C0/f = f = 2). */
    var C0, A0, f, A1, C1, vals, proches, i, j;
    do {
      C0 = pick([1,2,2.5,4,5]);
      A0 = arr(pick([0.12,0.18,0.20,0.24,0.30]),3);
      f  = pick([1.5,2,2.5,3]);
      A1 = arr(A0*f,3); C1 = arr(C0*f,3);
      vals = [C1, arr(C0/f,3), f, arr(C0+(A1-A0),3)];
      proches = false;
      for(i=0;i<vals.length;i++) for(j=i+1;j<vals.length;j++)
        if(Math.abs(vals[i]-vals[j]) < Math.max(0.2, 0.1*Math.max(Math.abs(vals[i]),Math.abs(vals[j])))) proches = true;
    } while(proches);
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
    /* Couples (volume final, facteur) choisis pour que le volume à prélever
       existe en pipette jaugée courante : 5, 10, 20, 25 ou 50 mL. */
    /* pas de F = 2 : le volume d'eau ajouté égalerait alors la réponse */
    var c  = pick([[50,5],[50,10],[100,4],[100,5],[100,10],[100,20],
                   [200,4],[200,10],[200,20],[250,5],[250,10]]);
    var Cm = pick([0.10, 0.20, 0.50, 1.0]);
    var Vf = c[0], F = c[1];
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
    /* pas v = 1 : d = 2τ, et la fraction inversée donnait la bonne réponse */
    var v = pick([0.5,1.5,2,2.5,3,4]);
    /* durées écrites avec leurs chiffres significatifs : 0,020 s, pas 0,02 s */
    function sec(ms){ return (ms >= 100 ? (ms/1000).toFixed(2) : (ms/1000).toFixed(3)).replace(".", "{,}"); }
    var d = arr(v*2*tau/1000, 4);                      // distance M1M3 en m
    /* distance écrite avec ses chiffres significatifs, comme les durées */
    function met(x){ var dec = (Math.abs(x*100 - Math.round(x*100)) > 1e-9 || x < 0.1) ? 3 : 2; return x.toFixed(dec).replace(".", "{,}"); }
    return { type:"num", niveau:2, rep:v, tol:Math.max(0.01,v*0.01), unite:"m/s",
      enonce:"Sur une chronophotographie prise toutes les $τ = "+tau+"$ @u{ms}, la distance réelle $M_1M_3$ vaut $"+met(d)+"$ @u{m}. Quelle est la vitesse au point $M_2$ ?",
      diag:[{v:arr(2*v,3), m:"Tu as divisé par $τ$ au lieu de $2τ$. La distance $M_1M_3$ enjambe le point $M_2$ : elle a été parcourue en **deux** intervalles de temps."},
            {v:arr(v/2,3), m:"Tu as divisé une fois de trop, ou pris $4τ$. Il y a exactement deux intervalles entre $M_1$ et $M_3$."},
            {v:arr(1/v,4), m:"Tu as inversé la fraction. Une vitesse est une distance divisée par une durée."}],
      corr:["**Ce que donne l'énoncé.** L'intervalle de temps entre deux positions, et la distance qui encadre le point étudié.",
            "La formule est $v_2 = @f{M_1M_3}{2τ}$.",
            "Je convertis : $τ = "+tau+"$ @u{ms} $= "+sec(tau)+"$ @u{s}, donc $2τ = "+sec(2*tau)+"$ @u{s}.",
            "$v_2 = @f{"+met(d)+"}{"+sec(2*tau)+"}$.",
            "$v_2 = "+(v < 1 ? v.toFixed(2) : v.toFixed(1)).replace(".", "{,}")+"$ @u{m/s}.",
            "**Je vérifie.** Diviser par $τ$ au lieu de $2τ$ donne exactement le double : c'est l'erreur la plus fréquente. Contrôle aussi l'ordre de grandeur du résultat."],
      indice:"Deux intervalles de temps séparent $M_1$ de $M_3$ : divise par $2τ$." };
  }}
];

var G_FORCES = [

{ id:"fo-poids", titre:"Calcul d'un poids", niveau:1, chap:"forces",
  gen:function(){
    var astre = pick([
      { nom:"sur Terre", g:9.81 }, { nom:"sur la Lune", g:1.6 },
      { nom:"sur Mars", g:3.7 }, { nom:"sur Vénus", g:8.9 }
    ]);
    /* pas de m = 4 sur Mars : m/g = 1,081 et g/m = 0,925 sont trop proches,
       et l'élève qui tronque m/g à deux chiffres (« 1,0 ») tombe dans la
       fenêtre de g/m et reçoit le message de l'autre erreur (1 combinaison
       sur 28 retirée) */
    var m = pick(astre.g === 3.7 ? [2,5,8,12,20,60] : [2,4,5,8,12,20,60]);
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
    var k = pick([3,4,5]);            // pas 2 : 2×2 = 2², le diagnostic « ×2 » tomberait sur la bonne réponse
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
            "**Je vérifie.** La distance est **au carré** au dénominateur : un facteur sur $d$ devient son carré sur la force. C'est ce qui fait décroître la force si vite avec la distance, sans jamais l'annuler."],
      indice:"La distance est au carré : élève le facteur au carré." };
  }},

{ id:"fo-newton", titre:"Deuxième loi de Newton", niveau:3, chap:"forces",
  gen:function(){
    var m = pick([2,4,5,10]);
    var v1 = pick([1,2,3]), dv = pick([4,6,8,10]);
    var dt = pick([2,4,5]);
    var v2 = v1+dv;
    var F = arr(m*dv/dt, 3);
    return { type:"num", niveau:3, rep:F, tol:Math.max(0.05,F*0.01), unite:"N",
      enonce:"Un chariot de masse $m = "+fr(m)+"$ @u{kg} voit sa vitesse passer de $"+fr(v1)+"$ à $"+fr(v2)+"$ @u{m/s} en $"+fr(dt)+"$ @u{s}, en ligne droite. On suppose la somme des forces constante pendant cette durée. Quelle est la valeur de la somme des forces ?",
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
    /* pas de η = 0,75 avec P = 500 W : la puissance perdue (125) et la
       fraction inversée (133,3) sont trop proches, et 125 arrondi à deux
       chiffres (« 130 ») reçoit le message de la fraction inversée
       (1 combinaison sur 24 retirée) */
    var eta = pick(Pr === 500 ? [0.6,0.8,0.9] : [0.6,0.75,0.8,0.9]);
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
  }},

{ id:"el-source", titre:"Tension délivrée par une source réelle", niveau:2, chap:"electrique",
  gen:function(){
    /* r et R du même ordre : sinon rI est si petit que U, arrondi, retombe sur E
       et les erreurs ne se distinguent plus (audit ARRONDI) */
    var E = pick([4.5, 6.0, 9.0, 12.0]), r = pick([1.0, 1.5, 2.0]), R = pick([2.0, 3.0, 4.0]);
    var I = E/(R + r), U = E - r*I;
    return { type:"num", niveau:2, rep:U, tol:U*0.02, unite:"V",
      enonce:"Une source de tension à vide $E = " + fr(E.toFixed(1)) + "$ @u{V} et de résistance interne $r = " + fr(r.toFixed(1)) + "$ @u{Ω} alimente une résistance $R = " + fr(R.toFixed(1)) + "$ @u{Ω}. Quelle tension $U$ délivre-t-elle, en @u{V} ?",
      diag:[{v:E, m:"$" + fr(E.toFixed(1)) + "$ @u{V}, c'est la tension **à vide**. La source débite un courant : une partie de la tension est perdue dans $r$."},
            {v:E + r*I, m:"Le signe est faux : la part $rI$ est **perdue**, elle se retranche. $U = E - rI$."},
            {v:E - r*E/R, m:"Tu as calculé le courant sans la résistance interne ($@f{E}{R}$). Le courant traverse aussi la source : $I = @f{E}{R + r}$."}],
      corr:["**L'intensité** : $I = @f{E}{R + r} = @f{" + fr(E.toFixed(1)) + "}{" + fr((R + r).toFixed(1)) + "} ≈ " + sig3(I) + "$ @u{A}.",
            "**La tension délivrée**, calculée d'un seul coup : $U = E - rI = " + fr(E.toFixed(1)) + " - " + fr(r.toFixed(1)) + " × @f{" + fr(E.toFixed(1)) + "}{" + fr((R + r).toFixed(1)) + "} ≈ " + sig3(U) + "$ @u{V}.",
            "**Le contrôle** : $U = R × I$ donne la même valeur."],
      indice:"Calcule d'abord I = E/(R + r), puis U = E − rI." };
  }}
];

var G_MECA = [

{ id:"mc-cinetique", titre:"Énergie cinétique", niveau:1, chap:"mecanique",
  gen:function(){
    var m = pick([0.5,2,5,60,800,1200]);
    /* pas de v = 2 : m × v y vaut ½ m v², et la mauvaise méthode passait */
    var v = pick([3,4,10,20,30]);
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
    /* ni 10 kg ni 10 m (m × h ≈ m × g ou g × h), ni m = h : sinon
       « g oublié » et « hauteur oubliée » se confondent */
    var m = pick([0.5,2,4,40,60,70]);
    var h = pick([1.5,3,5,6,15,20]);
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
            "$v^2 = 2 × 9{,}81 × "+fr(h)+" = "+fr(arr(2*g*h,2))+"$ @u{m²/s²}.",
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
      /* diagnostics construits cas par cas : un tableau commun donnait,
         selon le cas, un diagnostic égal à la réponse ou à un autre */
      diag: sens==="moteur"
        ? [{v:-F*d, m:"Le signe est faux : la force est **dans le sens** du déplacement, l'angle vaut $0°$ et le travail est moteur, donc positif."},
           {v:arr(F/d,3), m:"Tu as divisé. Le travail est un produit : $W = F × d × cos(α)$."}]
        : sens==="resistant"
        ? [{v:F*d, m:"Le signe est faux : la force s'oppose au déplacement, $cos(180°) = -1$, et le travail est résistant, donc négatif."},
           {v:arr(F/d,3), m:"Tu as divisé. Le travail est un produit : $W = F × d × cos(α)$."}]
        : [{v:F*d, m:"Tu as calculé $F × d$ sans tenir compte de l'angle. À $90°$, $cos(90°) = 0$ : le travail est nul."},
           {v:-F*d, m:"À $90°$, le cosinus vaut $0$, pas $-1$ : une force perpendiculaire au déplacement ne travaille pas du tout."},
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
,
{ id:"mc-puissance", titre:"Puissance mécanique", niveau:1, chap:"mecanique",
  gen:function(){
    var P = pick([200, 400, 750, 1200, 2000, 3000]);
    var dt = pick([10, 20, 30, 60]);
    var W = P*dt;
    return { type:"num", niveau:1, rep:P, tol:1, unite:"W",
      enonce:"Un moteur fournit un travail de $"+fr(W)+"$ @u{J} en $"+fr(dt)+"$ @u{s}. Quelle puissance développe-t-il ?",
      diag:[{v:W*dt, m:"Tu as multiplié au lieu de diviser. La puissance est une énergie **par** seconde : $P = @f{W}{Δt}$."},
            {v:arr(dt/W, 6), m:"La division est à l'envers. C'est l'énergie qui va au numérateur : $@f{"+fr(W)+"}{"+fr(dt)+"}$."},
            {v:W, m:"$"+fr(W)+"$ @u{J} est le travail fourni, une énergie. La puissance dit à quelle vitesse ce travail est fourni."}],
      corr:["**Ce que donne l'énoncé.** Un travail en joules et une durée en secondes. On cherche une puissance, en watts.",
            "Une puissance est une énergie rapportée au temps : $P = @f{W}{Δt}$. Un watt, c'est un joule fourni chaque seconde.",
            "$P = @f{"+fr(W)+"}{"+fr(dt)+"}$.",
            "$P = "+fr(P)+"$ @u{W}.",
            "**Je vérifie à l'envers.** $"+fr(P)+"$ joules chaque seconde pendant $"+fr(dt)+"$ secondes redonnent bien $"+fr(W)+"$ @u{J}. La multiplication retombe sur l'énoncé."],
      indice:"Divise l'énergie par la durée, en secondes." };
  }},

{ id:"mc-force-vitesse", titre:"Force à partir d'une puissance", niveau:2, chap:"mecanique",
  gen:function(){
    /* puissances réalistes pour un cycliste : au plus 400 W */
    var F = pick([15, 20, 25, 30, 40]);
    var v = pick([4, 5, 6, 8, 10]);
    var P = F*v;
    return { type:"num", niveau:2, rep:F, tol:0.5, unite:"N",
      enonce:"Un cycliste développe une puissance de $"+fr(P)+"$ @u{W} en roulant à la vitesse constante de $"+fr(v)+"{,}0$ @u{m/s}. Quelle est la valeur de sa force de traction ?",
      diag:[{v:P*v, m:"Tu as multiplié $"+fr(P)+"$ par $"+fr(v)+"$. C'est la **puissance** qui vaut $F × v$ : pour trouver $F$, il faut diviser."},
            {v:arr(v/P, 5), m:"La division est inversée : $F = @f{P}{v} = @f{"+fr(P)+"}{"+fr(v)+"}$, et non $@f{v}{P}$."},
            {v:P, m:"$"+fr(P)+"$ @u{W} est la puissance. Une force se mesure en newtons : il reste à diviser par la vitesse."}],
      corr:["**Ce que donne l'énoncé.** Une puissance et une vitesse constante. On cherche la force.",
            "Quand une force tire dans le sens du mouvement, $P = F × v$. C'est le raccourci qui évite de passer par la distance et la durée.",
            "J'isole la force : $F = @f{P}{v} = @f{"+fr(P)+"}{"+fr(v)+"{,}0}$.",
            "$F = "+fr(F)+"$ @u{N}.",
            "**Ce que la formule raconte.** À puissance égale, rouler deux fois plus vite ne laisse plus que la moitié de la force. C'est exactement pour cela qu'on change de vitesse en côte : le dérailleur rend de la force en retirant de l'allure."],
      indice:"$P = F × v$, et ici c'est $F$ l'inconnue." };
  }}
];

var G_ONDES = [

{ id:"on-lambda", titre:"Longueur d'onde", niveau:1, chap:"ondes",
  gen:function(){
    /* Couples (v, f) vérifiés un à un (balayage de tous les tirages) : la
       réponse et les trois distracteurs restent assez écartés pour que
       fabriquer() n'en écarte aucun comme doublon, et que chaque erreur
       reçoive son propre message. Avec v = 5000 m/s et f petite, f/v et
       1/f se confondaient à la tolérance d'une grande λ. */
    var c = pick([[340,100],[340,200],[340,250],[340,500],[340,850],[340,1000],
                  [1500,200],[1500,250],[1500,500],[1500,1000],[5000,1000],[5000,2000]]);
    var v = c[0], f = c[1];
    var sig = function(x){ return Number(x.toPrecision(3)); };   // 3 chiffres significatifs
    var lam = sig(v/f);
    return { type:"num", niveau:1, rep:lam, tol:lam*0.01, unite:"m",
      enonce:"Une onde de fréquence $f = "+fr(f)+"$ @u{Hz} se propage à la célérité $v = "+fr(v)+"$ @u{m/s}. Quelle est sa longueur d'onde ? Donne le résultat avec trois chiffres significatifs.",
      diag:[{v:sig(f/v), m:"Tu as calculé $@f{f}{v}$ au lieu de $@f{v}{f}$. Contrôle par les unités : des @u{m/s} divisés par des @u{Hz} donnent des mètres."},
            {v:v*f, m:"Tu as multiplié. La formule $λ = v × T$ utilise la **période**, pas la fréquence — et $T = @f{1}{f}$."},
            {v:sig(1/f), m:"Tu as calculé la période, en secondes. Il reste à la multiplier par la célérité."}],
      corr:["**Ce que donne l'énoncé.** Une célérité et une fréquence. Ce qu'on cherche : la distance entre deux motifs de l'onde.",
            "La relation est $λ = @f{v}{f}$.",
            "$λ = @f{"+fr(v)+"}{"+fr(f)+"}$.",
            "$λ "+(lam===v/f ? "=" : "≈")+" "+fr(lam.toPrecision(3))+"$ @u{m}.",
            "**Je vérifie par les unités.** Des @u{m/s} divisés par des @u{Hz} donnent des mètres : c'est bien une longueur d'onde."],
      indice:"$λ = @f{v}{f}$ : la célérité au numérateur." };
  }},

{ id:"on-retard", titre:"Distance à partir d'un retard", niveau:1, chap:"ondes",
  gen:function(){
    var v = 340;
    var t = pick([1.5,2,3,4,5,6,8]);
    var d = arr(v*t,1);
    // 3 % : accepte l'arrondi à 2 chiffres (1360 → 1400, 2040 → 2000),
    // loin des pièges de diag (v/t, t/v, v+t) et des erreurs d/2, 2d
    // que traite diagnostic()
    return { type:"num", niveau:1, rep:d, tol:Math.max(1, d*0.03), unite:"m",
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
    /* Pas de T = 1 ms : garder les ms et recopier la période donneraient
       tous deux 1, deux erreurs pour un seul message. Tolérance petite (les
       fréquences tirées sont des nombres entiers) : avec 1 % de f (jusqu'à
       20 Hz), fabriquer() écartait comme doublons les distracteurs, tous
       plus petits que 20. */
    var Tms = pick([0.5,2,4,5,10,20]);
    var f = arr(1000/Tms, 2);
    return { type:"num", niveau:2, rep:f, tol:0.01, unite:"Hz",
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
            "$@f{"+fr(arr(eV*1.6,3))+" × 10^{-19}}{1{,}6 × 10^{-19}} = "+fr(eV,1)+"$.",
            "L'énergie vaut $"+fr(eV,1)+"$ @u{eV}.",
            "**Je vérifie l'ordre de grandeur.** Un photon visible vaut entre environ $1{,}6$ et $3{,}1$ @u{eV}. " +
              (eV < 1.6 ? "Ici $"+fr(eV,1)+"$ @u{eV} est en dessous : c'est un photon **infrarouge**, invisible."
               : eV > 3.1 ? "Ici $"+fr(eV,1)+"$ @u{eV} est au-dessus : c'est un photon **ultraviolet**, invisible."
               : "Ici $"+fr(eV,1)+"$ @u{eV} est dedans : c'est un photon visible.")],
      indice:"Combien de fois $1{,}6$ tient-il dans le facteur donné ?" };
  }},

{ id:"lu-niveaux", titre:"Photon émis entre deux niveaux", niveau:2, chap:"lumiere",
  gen:function(){
    /* des paires de niveaux réalistes, toutes deux négatives : un niveau
       d'énergie positif n'a pas de sens pour un électron lié à l'atome */
    var paire = pick([[-13.6,-3.4],[-3.4,-1.5],[-3.4,-0.85],[-1.5,-0.85],[-13.6,-1.5],[-5.4,-3.0],[-4.2,-1.7]]);
    var bas = paire[0], haut = paire[1];
    var dE = arr(haut - bas, 2);
    return { type:"num", niveau:2, rep:dE, tol:0.02, unite:"eV",
      enonce:"Un atome passe d'un niveau $E_2 = "+fr(haut)+"$ @u{eV} à un niveau $E_1 = "+fr(bas)+"$ @u{eV}. Quelle est l'énergie du photon émis ?",
      diag:[{v:-dE, m:"L'énergie d'un photon est toujours **positive**. L'atome perd de l'énergie, et c'est cette perte qui part dans le photon : $ΔE = E_2 - E_1$."},
            {v:arr(haut+bas,2), m:"Tu as additionné les deux niveaux au lieu de les soustraire, et ton résultat est négatif, alors que l'énergie d'un photon est toujours positive. L'énergie émise est leur **écart** : $ΔE = E_2 - E_1$."},
            {v:haut, m:"Tu as pris la valeur du niveau de départ, qui est négative. L'énergie d'un photon est toujours positive : c'est la **différence** entre les deux niveaux qui part dans le photon."}],
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
            {v:arr(-1/g,3), m:"Tu as inversé la fraction. Le grandissement est $@f{@a{A'B'}}{@a{AB}}$ : la taille de l'**image** au numérateur."},
            {v:arr(1/g,3), m:"Tu as inversé la fraction **et** oublié le signe."}],
      corr:["**Ce que donne l'énoncé.** La taille de l'objet, celle de l'image, et le fait qu'elle soit renversée. Ce qu'on cherche : le grandissement, signe compris.",
            "Le grandissement vaut $γ = @f{@a{A'B'}}{@a{AB}}$ (sans unité).",
            "En valeur absolue : $@f{"+fr(tailleImg)+"}{"+fr(tailleObj)+"} = "+fr(g)+"$.",
            "L'image est renversée, donc le grandissement est négatif.",
            "$γ = "+fr(arr(-g,3))+"$.",
            "**Je relis le résultat.** Le signe dit droite ou renversée ; la valeur absolue dit agrandie ou réduite. Deux informations dans un seul nombre."],
      indice:"Taille de l'image sur taille de l'objet, avec un signe négatif si l'image est renversée." };
  }}
];


/* --- chapitre 4 : schémas de Lewis et polarité --- */
var G_LEWIS = [

{ id:"le-doublets", titre:"Nombre de doublets d'une molécule", niveau:1, chap:"lewis",
  gen:function(){
    var mol = pick([
      { f:"H_2O", nom:"eau", e:8 }, { f:"NH_3", nom:"ammoniac", e:8 },
      { f:"CH_4", nom:"méthane", e:8 }, { f:"HCl", nom:"chlorure d'hydrogène", e:8 },
      { f:"CO_2", nom:"dioxyde de carbone", e:16 }, { f:"N_2", nom:"diazote", e:10 },
      { f:"O_2", nom:"dioxygène", e:12 }, { f:"Cl_2", nom:"dichlore", e:14 },
      { f:"CH_3Cl", nom:"chlorométhane", e:14 }
    ]);
    var d = mol.e/2;
    return { type:"num", niveau:1, rep:d, tol:0.1, unite:"doublets",
      enonce:"La molécule "+de_(mol.nom)+" $@c{"+mol.f+"}$ compte $"+fr(mol.e)+"$ électrons de valence en tout. Combien de doublets cela représente-t-il ?",
      diag:[{v:mol.e, m:"$"+fr(mol.e)+"$ est le nombre d'**électrons**. Un doublet en contient deux : il faut diviser par 2."},
            {v:mol.e*2, m:"Tu as multiplié par 2 au lieu de diviser. Un doublet regroupe deux électrons, il y a donc moins de doublets que d'électrons."},
            {v:arr(mol.e/4, 2), m:"Tu as divisé par 4. Un doublet, c'est **deux** électrons."}],
      corr:["**Ce que donne l'énoncé.** Le nombre total d'électrons de valence de la molécule. On cherche le nombre de doublets.",
            "Dans un schéma de Lewis, les électrons vont toujours par paires : on ne dessine jamais d'électron isolé. Chaque doublet vaut deux électrons.",
            "$@f{"+fr(mol.e)+"}{2}$.",
            "$"+fr(d)+"$ doublets, liants et non liants confondus.",
            "**Pourquoi les électrons s'apparient.** Dans le modèle de Lewis, on admet que les électrons de valence se regroupent par paires, plus stables qu'un électron isolé (la raison profonde relève de la physique quantique, hors programme). C'est ce qui rend le schéma de Lewis lisible : des traits et des paires de points, jamais des points isolés."],
      indice:"Un doublet vaut deux électrons : divise par 2." };
  }},

{ id:"le-nonliants", titre:"Doublets non liants", niveau:2, chap:"lewis",
  gen:function(){
    var mol = pick([
      { f:"NH_3", nom:"ammoniac", d:4, l:3 },
      { f:"HCl", nom:"chlorure d'hydrogène", d:4, l:1 },
      { f:"Cl_2", nom:"dichlore", d:7, l:1 },
      { f:"CH_3Cl", nom:"chlorométhane", d:7, l:4 },
      { f:"HF", nom:"fluorure d'hydrogène", d:4, l:1 },
      { f:"PH_3", nom:"phosphine", d:4, l:3 }
    ]);
    var nl = mol.d - mol.l;
    return { type:"num", niveau:2, rep:nl, tol:0.1, unite:"doublets non liants",
      enonce:"La molécule "+de_(mol.nom)+" $@c{"+mol.f+"}$ compte $"+fr(mol.d)+"$ doublets en tout, dont $"+fr(mol.l)+"$ engagés dans des liaisons. Combien porte-t-elle de doublets **non liants** ?",
      diag:[{v:mol.d, m:"$"+fr(mol.d)+"$ est le nombre **total** de doublets. Ceux qui forment les liaisons n'en font pas partie."},
            {v:mol.l, m:"$"+fr(mol.l)+"$ est le nombre de doublets **liants**, ceux dessinés en traits. On demande les autres."},
            {v:mol.d + mol.l, m:"Tu as additionné au lieu de soustraire. Les doublets liants font partie du total : on les retire."}],
      corr:["**Ce que donne l'énoncé.** Le total des doublets, et combien d'entre eux forment des liaisons.",
            "Tout doublet est soit **liant** — un trait entre deux atomes, partagé — soit **non liant** — une paire de points portée par un seul atome. Il n'y a pas de troisième cas.",
            "$"+fr(mol.d)+" - "+fr(mol.l)+"$.",
            "$"+fr(nl)+"$ doublet"+(nl > 1 ? "s" : "")+" non liant"+(nl > 1 ? "s" : "")+".",
            "**Pourquoi ils comptent.** Les doublets non liants prennent de la place autour de l'atome et referment les angles : ce sont eux qui rendent l'eau coudée et l'ammoniac pyramidal. Sans eux, ces molécules seraient plates ou linéaires — et ne seraient pas polaires."],
      indice:"Retire les doublets liants du nombre total." };
  }},

{ id:"le-electroneg", titre:"Écart d'électronégativité", niveau:2, chap:"lewis",
  gen:function(){
    var p = pick([
      { a:"H", xa:2.2, b:"O", xb:3.4 }, { a:"C", xa:2.6, b:"O", xb:3.4 },
      { a:"H", xa:2.2, b:"Cl", xb:3.2 }, { a:"C", xa:2.6, b:"H", xb:2.2 },
      { a:"N", xa:3.0, b:"H", xb:2.2 }, { a:"C", xa:2.6, b:"Cl", xb:3.2 },
      { a:"H", xa:2.2, b:"F", xb:4.0 }
    ]);
    var e = arr(Math.abs(p.xb - p.xa), 1);
    var haut = p.xb > p.xa ? p.b : p.a;
    return { type:"num", niveau:2, rep:e, tol:0.05, unite:"(sans unité)",
      enonce:"Dans la liaison $@c{"+p.a+"}$–$@c{"+p.b+"}$, l'électronégativité de $@c{"+p.a+"}$ vaut $"+fr(p.xa)+"$ et celle de $@c{"+p.b+"}$ vaut $"+fr(p.xb)+"$. Quel est l'écart d'électronégativité de cette liaison ?",
      diag:[{v:arr(p.xa + p.xb, 1), m:"Tu as additionné les deux électronégativités. L'écart est une **différence**."},
            {v:arr(p.xa * p.xb, 2), m:"Tu as multiplié les deux valeurs. L'écart se calcule par soustraction."},
            {v:Math.max(p.xa, p.xb), m:"$"+fr(Math.max(p.xa,p.xb))+"$ est l'électronégativité du plus attractif des deux atomes, pas l'écart entre eux."}],
      corr:["**Ce que donne l'énoncé.** Les deux électronégativités, et une liaison entre les deux atomes.",
            "L'électronégativité mesure la capacité d'un atome à attirer à lui les électrons de la liaison. Ce qui polarise la liaison, c'est la **différence** entre les deux.",
            "$|"+fr(p.xb)+" - "+fr(p.xa)+"|$.",
            e <= 0.4
              ? "L'écart vaut $"+fr(e)+"$ : c'est très peu. Comme le dit le cours ($@c{C} ≈ @c{H}$), on considère cette liaison comme très peu polarisée."
              : "L'écart vaut $"+fr(e)+"$, et c'est $@c{"+haut+"}$, le plus électronégatif, qui porte la charge partielle négative $δ^-$.",
            "**Comment lire ce nombre.** Plus l'écart est grand, plus la liaison est polarisée. Pour $@c{C}$–$@c{H}$ (écart $0{,}4$), on considère la liaison comme très peu polarisée ; pour $@c{O}$–$@c{H}$ ($1{,}2$) ou $@c{H}$–$@c{F}$ ($1{,}8$), elle l'est nettement."],
      indice:"L'écart est la différence des deux électronégativités, en valeur absolue." };
  }}
];

/* --- chapitre 5 : cohésion et solubilité --- */
var G_COHESION = [

{ id:"co-masse-peser", titre:"Masse à peser pour une solution", niveau:1, chap:"cohesion",
  gen:function(){
    var esp = pick([
      { nom:"chlorure de sodium", M:58.5 }, { nom:"glucose", M:180 },
      { nom:"sulfate de cuivre anhydre", M:160, secu:"**Sécurité.** Le sulfate de cuivre est nocif s'il est avalé, irrite la peau et les yeux et est très toxique pour les organismes aquatiques : gants et lunettes, et les restes vont dans le bidon de récupération, jamais à l'évier." },
      { nom:"saccharose", M:342 },
      { nom:"hydroxyde de sodium", M:40, secu:"**Sécurité.** L'hydroxyde de sodium (soude) est **corrosif** : gants, lunettes, blouse fermée. On le pèse à la spatule sans jamais le toucher. Sa dissolution chauffe : on le verse dans la fiole déjà à moitié remplie d'eau, en agitant, et on attend le retour à température ambiante avant de compléter au trait. En cas de projection, rincer longuement à l'eau." }
    ]);
    var C = pick([0.05, 0.10, 0.20, 0.50]);
    var Vml = pick([100, 200, 250, 500]);
    var V = Vml/1000;
    var m = arr(C*V*esp.M, 2);
    return { type:"num", niveau:1, rep:m, tol:Math.max(0.02, m*0.01), unite:"g",
      enonce:"Quelle masse "+de_(esp.nom)+" faut-il peser pour préparer $"+fr(Vml)+"$ @u{mL} d'une solution à $"+fr(C)+"$ @u{mol/L} ? On donne $M = "+fr(esp.M)+"$ @u{g/mol}.",
      diag:[{v:arr(C*V, 4), m:"$"+fr(arr(C*V,4))+"$ @u{mol} est la quantité de matière. La question porte sur une **masse** : il reste à multiplier par $M$."},
            {v:arr(C*Vml*esp.M, 1), m:"Tu as gardé le volume en millilitres. Une concentration s'exprime par **litre** : $"+fr(Vml)+"$ @u{mL} $= "+fr(V)+"$ @u{L}."},
            {v:esp.M, m:"$"+fr(esp.M)+"$ @u{g} est la masse d'**une mole**. Il en faut bien moins ici."}],
      corr:["**Ce que donne l'énoncé.** Un volume, une concentration et une masse molaire. On cherche la masse à peser.",
            "Deux étapes, toujours dans le même ordre : la concentration et le volume donnent la quantité de matière, puis la masse molaire donne la masse.",
            "$n = C × V = "+fr(C)+" × "+fr(V)+" = "+fr(arr(C*V,4))+"$ @u{mol}.",
            "$m = n × M = "+fr(arr(C*V,4))+" × "+fr(esp.M)+" = "+fr(m)+"$ @u{g}.",
            "**L'ordre des gestes, en pratique.** On pèse cette masse, on la verse dans une fiole jaugée de $"+fr(Vml)+"$ @u{mL}, on dissout, **puis** on complète au trait. Ajouter $"+fr(Vml)+"$ @u{mL} d'eau au solide donnerait un volume final plus grand, donc une solution trop diluée."].concat(esp.secu ? [esp.secu] : []),
      indice:"D'abord $n = C × V$ avec le volume en litres, ensuite $m = n × M$." };
  }},

{ id:"co-massique-molaire", titre:"De la concentration en masse à la concentration molaire", niveau:2, chap:"cohesion",
  gen:function(){
    var esp = pick([
      { nom:"glucose", M:180 }, { nom:"chlorure de sodium", M:58.5 },
      { nom:"saccharose", M:342 }, { nom:"urée", M:60 }
    ]);
    var C = pick([0.01, 0.02, 0.05, 0.10, 0.25]);
    var Cm = arr(C*esp.M, 2);
    return { type:"num", niveau:2, rep:C, tol:Math.max(0.0005, C*0.02), unite:"mol/L",
      enonce:"Une solution "+de_(esp.nom)+" a une concentration en masse de $"+fr(Cm)+"$ @u{g/L}. Quelle est sa concentration en @u{mol/L} ? On donne $M = "+fr(esp.M)+"$ @u{g/mol}.",
      diag:[{v:arr(Cm*esp.M, 1), m:"Tu as multiplié par la masse molaire. Pour passer des grammes aux moles, il faut **diviser**."},
            {v:arr(esp.M/Cm, 2), m:"La division est inversée : $@f{"+fr(Cm)+"}{"+fr(esp.M)+"}$, et non l'inverse."},
            {v:Cm, m:"$"+fr(Cm)+"$ @u{g/L} est la concentration en masse, celle que l'énoncé donnait déjà."}],
      corr:["**Ce que donne l'énoncé.** Une concentration exprimée en grammes par litre. On la veut en moles par litre.",
            "C'est la même solution, dans le même litre : seule l'unité de comptage change. La masse molaire est le pont entre les grammes et les moles.",
            "$C = @f{C_m}{M} = @f{"+fr(Cm)+"}{"+fr(esp.M)+"}$.",
            "$C = "+fr(C)+"$ @u{mol/L}.",
            "**Le contrôle par les unités.** Des @u{g/L} divisés par des @u{g/mol} donnent des @u{mol/L} : les grammes se simplifient. Une multiplication aurait donné une unité qui n'existe pas — c'est le repère le plus sûr pour vérifier le sens de l'opération."],
      indice:"Divise la concentration en masse par la masse molaire, et vérifie les unités du résultat." };
  }},

{ id:"co-solubilite", titre:"Masse maximale dissoute", niveau:2, chap:"cohesion",
  gen:function(){
    var esp = pick([
      { nom:"chlorure de sodium", s:360 }, { nom:"sulfate de cuivre anhydre", s:200 },
      { nom:"nitrate de potassium", s:320 }, { nom:"sucre", s:2000 }
    ]);
    var Vml = pick([50, 100, 250, 500]);
    var V = Vml/1000;
    var m = arr(esp.s*V, 1);
    return { type:"num", niveau:2, rep:m, tol:Math.max(0.1, m*0.01), unite:"g",
      enonce:"La solubilité "+du_(esp.nom)+" dans l'eau à $20$ @u{°C} est de $"+fr(esp.s)+"$ @u{g/L}. Quelle masse peut-on dissoudre au maximum dans $"+fr(Vml)+"$ @u{mL} d'eau ?",
      diag:[{v:esp.s, m:"$"+fr(esp.s)+"$ @u{g} est la masse dissoute dans **un litre**. On n'en a que $"+fr(Vml)+"$ @u{mL}."},
            {v:arr(esp.s*Vml, 0), m:"Tu as gardé le volume en millilitres. La solubilité s'exprime par **litre** : $"+fr(Vml)+"$ @u{mL} $= "+fr(V)+"$ @u{L}."},
            {v:arr(esp.s/V, 0), m:"Tu as divisé au lieu de multiplier. Un volume plus petit dissout **moins**, pas plus."}],
      corr:["**Ce que donne l'énoncé.** Une solubilité en grammes par litre, et un volume d'eau. On cherche la masse maximale.",
            "Une solubilité dit combien de grammes un litre peut accueillir avant saturation. Pour un autre volume, c'est une simple proportionnalité.",
            "$m = s × V = "+fr(esp.s)+" × "+fr(V)+"$.",
            "$m = "+fr(m)+"$ @u{g}.",
            "**Ce qui se passe si l'on dépasse.** Au-delà de cette masse, le solide en trop ne se dissout pas : il reste au fond, et la solution est dite **saturée**. Ajouter davantage ne change plus rien à la concentration — seul le dépôt grossit."],
      indice:"Convertis le volume en litres, puis multiplie par la solubilité." };
  }}
];

/* --- chapitre 7 : chimie organique et synthèse --- */
var G_ORGANIQUE = [

{ id:"or-masse-molaire", titre:"Masse molaire d'une molécule organique", niveau:1, chap:"organique",
  gen:function(){
    var mol = pick([
      { f:"CH_4", nom:"méthane", c:1, h:4, o:0 },
      { f:"C_2H_6", nom:"éthane", c:2, h:6, o:0 },
      { f:"C_3H_8", nom:"propane", c:3, h:8, o:0 },
      { f:"C_4H_{10}", nom:"butane", c:4, h:10, o:0 },
      { f:"CH_4O", nom:"méthanol", c:1, h:4, o:1 },
      { f:"C_2H_6O", nom:"éthanol", c:2, h:6, o:1 },
      { f:"C_3H_8O", nom:"propan-1-ol", c:3, h:8, o:1 },
      { f:"C_2H_4O_2", nom:"acide éthanoïque", c:2, h:4, o:2 }
    ]);
    var M = mol.c*12 + mol.h*1 + mol.o*16;
    return { type:"num", niveau:1, rep:M, tol:0.5, unite:"g/mol",
      enonce:"Quelle est la masse molaire "+du_(mol.nom)+" $@c{"+mol.f+"}$ ? On donne $M(@c{C}) = 12$, $M(@c{H}) = 1{,}0$ et $M(@c{O}) = 16$ @u{g/mol}.",
      diag:[{v:mol.c + mol.h + mol.o, m:"Tu as compté le **nombre d'atomes**, sans tenir compte de leurs masses. Chaque carbone pèse $12$, chaque hydrogène $1$."}].concat(
            /* éthanol (30) et acide éthanoïque (28) : « oxygène oublié »
               tombe dans la fenêtre de « une masse de chaque » (29) — on
               fusionne les deux en un seul message */
            mol.o && Math.abs((12 + 1 + 16) - (mol.c*12 + mol.h)) < 3
            ? [{v:12 + 1 + 16, m:"Soit tu as oublié les atomes d'oxygène, soit tu as additionné une seule masse de chaque élément : reprends atome par atome."}]
            : [{v:12 + 1 + (mol.o ? 16 : 0), m:"Tu as additionné une seule masse de chaque élément, sans multiplier par le nombre d'atomes présents."},
               {v: mol.o ? mol.c*12 + mol.h*1 : mol.c*12, m: mol.o ? "Tu as oublié les atomes d'oxygène." : "Tu as oublié les hydrogènes : il y en a "+fr(mol.h)+"."}]),
      corr:["**Ce que dit la formule.** $@c{"+mol.f+"}$ : "+fr(mol.c)+" atome"+(mol.c>1?"s":"")+" de carbone, "+fr(mol.h)+" d'hydrogène"+(mol.o ? " et "+fr(mol.o)+" d'oxygène" : "")+".",
            "La masse molaire d'une molécule est la somme des masses molaires de ses atomes, chacun compté autant de fois qu'il apparaît.",
            "Les carbones : $"+fr(mol.c)+" × 12 = "+fr(mol.c*12)+"$ ; les hydrogènes : $"+fr(mol.h)+" × 1{,}0 = "+fr(mol.h)+"$"+(mol.o ? " ; les oxygènes : $"+fr(mol.o)+" × 16 = "+fr(mol.o*16)+"$" : "")+".",
            "$M = "+fr(M)+"$ @u{g/mol}.",
            "**Le contrôle d'ordre de grandeur.** Le carbone pèse douze fois l'hydrogène : dans une molécule organique, ce sont presque toujours les carbones et les oxygènes qui font la masse. Ici, les hydrogènes n'apportent que $"+fr(arr(mol.h/M*100,0))+"$ % du total."],
      indice:"Multiplie chaque masse molaire par le nombre d'atomes, puis additionne." };
  }},

{ id:"or-rendement", titre:"Rendement d'une synthèse", niveau:2, chap:"organique",
  gen:function(){
    var n = pick([0.020, 0.040, 0.050, 0.060, 0.10]);
    var M = pick([88, 100, 122, 138, 180]);
    var eta = pick([50, 60, 65, 70, 75, 80]);
    var mTh = arr(n*M, 2);
    var mObt = arr(mTh*eta/100, 2);
    var r = arr(mObt/mTh*100, 1);
    return { type:"num", niveau:2, rep:r, tol:1.5, unite:"%",
      enonce:"Une synthèse part de $"+fr(n)+"$ @u{mol} de réactif limitant et la réaction se fait mole à mole. On recueille $"+fr(mObt)+"$ @u{g} de produit, de masse molaire $"+fr(M)+"$ @u{g/mol}. Quel est le rendement, en pourcentage ?",
      diag:[{v:arr(mTh/mObt*100, 1), m:"La fraction est inversée. Le rendement met l'**obtenu** au numérateur, et il ne peut jamais dépasser $100$ %."},
            {v:arr(mObt/mTh, 3), m:"C'est le bon rapport, mais en fraction. La question demande un pourcentage : multiplie par cent."},
            {v:mTh, m:"$"+fr(mTh)+"$ @u{g} est la masse que l'on pouvait obtenir au mieux. Il reste à lui comparer la masse réellement recueillie."}],
      corr:["**Ce que donne l'énoncé.** La quantité de réactif limitant, la masse molaire du produit, et ce qu'on a réellement recueilli.",
            "**La masse maximale possible.** Mole à mole : au mieux $"+fr(n)+"$ @u{mol} de produit, soit $m_{max} = "+fr(n)+" × "+fr(M)+" = "+fr(mTh)+"$ @u{g}.",
            "**Le rendement compare l'obtenu au maximum.** $η = @f{"+fr(mObt)+"}{"+fr(mTh)+"} × 100$.",
            "$η ≈ "+fr(r)+"$ %.",
            "**Où est passé le reste.** Une part n'a pas eu le temps de réagir, une part est restée dissoute dans le liquide qui traverse le filtre (les « eaux mères »), une part s'est perdue dans les transferts. Un rendement supérieur à $100$ % est impossible : s'il apparaît, le produit est encore humide ou le maximum a été mal calculé."],
      indice:"Calcule d'abord la masse que l'on pouvait espérer au mieux, puis compare-lui la masse obtenue." };
  }},

{ id:"or-rf", titre:"Rapport frontal en chromatographie", niveau:2, chap:"organique",
  gen:function(){
    /* distances au millimètre près, comme sur une vraie règle ; et pas de
       rf = 0,50, pour lequel « solvant − tache » redonnerait la tache ; pas
       de front à 6,0 cm, où « inversée » capte la tache ou l'écart */
    var front = pick([5.0, 8.0, 10.0]);
    var rf = pick([0.20, 0.40, 0.60, 0.80]);
    var d = arr(front*rf, 1);
    return { type:"num", niveau:2, rep:rf, tol:0.02, unite:"(sans unité)",
      enonce:"Sur un chromatogramme, le solvant a migré de $"+fr(front)+"$ @u{cm} depuis la ligne de dépôt, et une tache de $"+fr(d)+"$ @u{cm}. Quel est le rapport frontal de cette tache ?",
      diag:[{v:arr(front/d, 2), m:"La fraction est inversée. Une tache ne peut pas dépasser le front du solvant : le rapport frontal est toujours **inférieur à 1**."},
            {v:d, m:"$"+fr(d)+"$ @u{cm} est la distance parcourue par la tache. Le rapport frontal est un **quotient**, sans unité."},
            {v:arr(front - d, 2), m:"Tu as calculé la différence des deux distances. Le rapport frontal est un rapport, pas un écart."}],
      corr:["**Ce que donne l'énoncé.** Deux distances mesurées depuis la même ligne de dépôt : celle du solvant et celle de la tache.",
            "Le rapport frontal compare la distance parcourue par la **tache** à celle parcourue par le **solvant** : $R_f = @f{d_{tache}}{d_{solvant}}$.",
            "$R_f = @f{"+fr(d)+"}{"+fr(front)+"}$.",
            "$R_f = "+fr(rf)+"$, sans unité.",
            "**Ce que ce nombre permet.** Il ne dépend ni de la durée de l'élution ni de la taille de la plaque : c'est une signature de l'espèce, à condition de comparer dans des conditions identiques (même plaque, même éluant). Deux taches de même $R_f$, sur la même plaque, correspondent très probablement à la même espèce — c'est ainsi qu'on vérifie qu'une synthèse a bien donné le produit attendu."],
      indice:"Divise la distance de la tache par celle du solvant. Le résultat est compris entre 0 et 1." };
  }}
];

/* ============================ FLUIDES ============================ */
/* Constantes du cahier : P_atm = 1,013 × 10⁵ Pa, g = 9,81 N/kg,
   ρ(eau douce) = 1,00 × 10³ kg/m³, ρ(eau de mer) = 1,03 × 10³ kg/m³. */
var PATM = 101300, GFL = 9.81;

var G_FLUIDES = [

{ id:"fl-force-pressante", titre:"Force pressante", niveau:1, chap:"fluides",
  gen:function(){
    var X = pick([1.2, 1.5, 2.0, 2.5, 3.0, 4.0]);      // P = X × 10⁵ Pa
    var Scm = pick([20, 40, 50, 80, 120, 200, 250]);   // aire en cm²
    var P = X*1e5, S = Scm*1e-4;
    var F = arr(P*S, 2);
    return { type:"num", niveau:1, rep:F, tol:F*0.01, unite:"N",
      enonce:"Un gaz enfermé exerce une pression $P = "+fr(X.toFixed(1))+" × 10^5$ @u{Pa} sur un piston plan d'aire $S = "+fr(Scm)+"$ @u{cm²}. Quelle est la valeur de la force pressante exercée par le gaz sur le piston ? Donne le résultat avec trois chiffres significatifs.",
      diag:[{v:arr(P*Scm,2), m:"Tu as laissé l'aire en @u{cm²}. La formule $F = P × S$ attend des @u{m²} : $"+fr(Scm)+"$ @u{cm²} $= "+fr(Scm)+" × 10^{-4}$ @u{m²}."},
            {v:arr(P*Scm*1e-2,2), m:"Erreur de conversion : $1$ @u{cm²} $= 10^{-4}$ @u{m²}, et non $10^{-2}$. Un carré de $1$ @u{cm} de côté mesure $0{,}01 × 0{,}01 = 0{,}0001$ @u{m²}."},
            {v:arr(P/S,0), m:"Tu as divisé la pression par l'aire. La force pressante est le **produit** $F = P × S$."}],
      corr:["**Ce que donne l'énoncé.** Une pression en pascals et une aire en centimètres carrés. Ce qu'on cherche : une force, en newtons.",
            "**Je convertis l'aire.** $S = "+fr(Scm)+"$ @u{cm²} $= "+fr(Scm)+" × 10^{-4}$ @u{m²} $= "+fr(arr(S,6))+"$ @u{m²}.",
            "La force pressante vaut $F = P × S$.",
            "$F = "+fr(X.toFixed(1))+" × 10^5 × "+fr(arr(S,6))+" = "+fr(F)+"$ @u{N}.",
            "**Je vérifie.** Une pression de l'ordre de $10^5$ @u{Pa} sur quelques dizaines de @u{cm²} donne des centaines, voire des milliers de newtons : c'est l'ordre de grandeur attendu."],
      indice:"$F = P × S$, avec l'aire en @u{m²} : $1$ @u{cm²} $= 10^{-4}$ @u{m²}." };
  }},

{ id:"fl-profondeur", titre:"Pression à une profondeur", niveau:2, chap:"fluides",
  gen:function(){
    var liq = pick([
      { lieu:"au fond d'un lac d'eau douce", rho:1000, donnee:"ρ_{eau} = 1{,}00 × 10^3" },
      { lieu:"en mer", rho:1030, donnee:"ρ_{mer} = 1{,}03 × 10^3" }
    ]);
    var h = pick([2, 3, 5, 8, 12, 15, 20, 25, 30, 40]);
    var dP = liq.rho*GFL*h;
    var P = arr(PATM + dP, 0);
    return { type:"num", niveau:2, rep:P, tol:P*0.005, unite:"Pa",
      enonce:"Quelle est la pression "+liq.lieu+", à $"+fr(h)+"$ @u{m} de profondeur ? On donne $P_{atm} = 1{,}013 × 10^5$ @u{Pa}, $"+liq.donnee+"$ @u{kg/m³} et $g = 9{,}81$ @u{N/kg}. Donne le résultat avec trois chiffres significatifs.",
      diag:[{v:arr(dP,0), m:"C'est l'**écart** avec la surface, $ρ g h$. La pression totale comprend aussi la pression de l'air qui appuie sur la surface : $P = P_{atm} + ρ g h$."},
            {v:arr(PATM - dP,0), m:"Tu as soustrait $ρ g h$ au lieu de l'ajouter. Plus on descend, plus la pression est **grande**."}],
      /* pas de diagnostic « mauvaise masse volumique » : eau douce et eau de
         mer ne diffèrent que de 3 %, et la bonne réponse arrondie à deux
         chiffres tombait dans sa fenêtre (1 833 tirages sur 3 000) */
      corr:["**Ce que donne l'énoncé.** Une profondeur, la masse volumique du liquide et la pression atmosphérique. Ce qu'on cherche : la pression totale à cette profondeur.",
            "**La loi.** $P = P_{atm} + ρ g h$ : c'est $P_2 − P_1 = ρ g (z_1 − z_2)$ appliquée entre la surface ($z_1 = 0$) et le point cherché ($z_2 = −"+fr(h)+"$ @u{m}).",
            "**L'écart dû au liquide.** $ρ g h = "+fr(liq.rho)+" × 9{,}81 × "+fr(h)+" = "+fr(arr(dP,0))+"$ @u{Pa}.",
            "**J'ajoute la pression de surface.** $P = "+fr(PATM)+" + "+fr(arr(dP,0))+" = "+fr(P)+"$ @u{Pa}.",
            "**Je vérifie.** Environ $1$ bar ($10^5$ @u{Pa}) tous les $10$ @u{m} : à $"+fr(h)+"$ @u{m}, on attend à peu près $"+fr(arr(1 + h/10,1))+"$ bar. C'est bien l'ordre de grandeur trouvé."],
      indice:"$P = P_{atm} + ρ g h$, la profondeur en mètres." };
  }},

{ id:"fl-mariotte", titre:"Loi de Mariotte", niveau:2, chap:"fluides",
  gen:function(){
    var P2 = pick([800, 1200, 1500, 1800, 2000, 2500, 3000]);
    /* en tirant le piston, on ne dépasse pas la capacité d'une seringue de 60 mL */
    var V1 = P2 < 1013 ? pick([20, 30, 40]) : pick([20, 30, 40, 50, 60]);
    var V2 = arr(V1*1013/P2, 2);
    var pousse = P2 > 1013;
    return { type:"num", niveau:2, rep:V2, tol:Math.max(0.05, V2*0.01), unite:"mL",
      enonce:"Une seringue bouchée contient $"+fr(V1)+"$ @u{mL} d'air à $1013$ @u{hPa}. On "+(pousse ? "enfonce" : "tire")+" lentement le piston, à température constante, jusqu'à ce que la pression de l'air enfermé vaille $"+fr(P2)+"$ @u{hPa}. Quel est alors son volume ? Donne le résultat avec trois chiffres significatifs.",
      diag:[{v:arr(V1*P2/1013,2), m:"Tu as inversé la proportion : $V_1 × @f{P_2}{P_1}$. Avec elle, le gaz "+(pousse ? "gagnerait du volume alors qu'on le comprime" : "perdrait du volume alors qu'on le détend")+". C'est $V_2 = @f{P_1 × V_1}{P_2}$."},
            {v:V1, m:"Le volume a changé : la seringue est fermée, donc la **quantité** d'air est la même, mais le piston a bougé. La loi de Mariotte donne le nouveau volume : $P_1 V_1 = P_2 V_2$."}],
      corr:["**Ce que donne l'énoncé.** État 1 : $P_1 = 1013$ @u{hPa}, $V_1 = "+fr(V1)+"$ @u{mL}. État 2 : $P_2 = "+fr(P2)+"$ @u{hPa}, $V_2$ inconnu. Gaz enfermé, température constante : la loi de Mariotte s'applique.",
            "$P_1 × V_1 = P_2 × V_2$, donc $V_2 = @f{P_1 × V_1}{P_2}$.",
            "Les deux pressions sont en @u{hPa}, le volume en @u{mL} : pas de conversion nécessaire.",
            "$V_2 = @f{1013 × "+fr(V1)+"}{"+fr(P2)+"} = "+fr(V2)+"$ @u{mL}.",
            "**Je vérifie le sens.** La pression a "+(pousse ? "augmenté : le volume doit diminuer" : "diminué : le volume doit augmenter")+". C'est bien le cas."],
      indice:"$P_1 V_1 = P_2 V_2$ : isole $V_2$, puis vérifie le sens." };
  }},

{ id:"fl-plongee", titre:"Volume d'un ballon en plongée", niveau:3, chap:"fluides",
  gen:function(){
    var V0 = pick([2, 3, 4, 5, 6, 8]);
    /* pas de h = 10 m : ρ g h vaut alors presque P_atm, et l'erreur « écart
       de pression au lieu de la pression totale » donnerait presque V0,
       le volume inchangé */
    var h = pick([5, 15, 20, 25, 30, 40]);
    var dP = 1030*GFL*h, P = PATM + dP;
    var V = arr(V0*PATM/P, 3);
    return { type:"num", niveau:3, rep:V, tol:Math.max(0.02, V*0.01), unite:"L",
      enonce:"Un plongeur emporte en mer un ballon souple et fermé, gonflé en surface avec $"+fr(V0)+"$ @u{L} d'air. Quel est le volume du ballon à $"+fr(h)+"$ @u{m} de profondeur ? On donne $P_{atm} = 1{,}013 × 10^5$ @u{Pa}, $ρ_{mer} = 1{,}03 × 10^3$ @u{kg/m³}, $g = 9{,}81$ @u{N/kg}, et on suppose la température constante. Donne le résultat avec trois chiffres significatifs.",
      diag:[{v:arr(V0*P/PATM,3), m:"Tu as inversé la proportion : le ballon **grossirait** en descendant, alors que la pression augmente. C'est $V = V_0 × @f{P_{atm}}{P}$."},
            {v:arr(V0*PATM/dP,3), m:"Tu as utilisé l'écart de pression $ρ g h$ au lieu de la pression totale. L'air du ballon subit **toute** la pression de l'eau : $P = P_{atm} + ρ g h$."},
            {v:arr(V0/h,3), m:"Tu as divisé le volume par la profondeur. La loi de Mariotte relie le volume à la **pression**, et la pression n'est pas proportionnelle à la profondeur : il faut ajouter $P_{atm}$."}],
      corr:["**Deux lois à enchaîner.** La statique des fluides donne la pression à la profondeur voulue ; la loi de Mariotte en déduit le volume.",
            "**La pression à $"+fr(h)+"$ @u{m}.** $P = P_{atm} + ρ g h = 1{,}013 × 10^5 + 1{,}03 × 10^3 × 9{,}81 × "+fr(h)+" = "+fr(arr(P,0))+"$ @u{Pa}.",
            "**La loi de Mariotte entre la surface et le fond.** $P_{atm} × V_0 = P × V$, donc $V = V_0 × @f{P_{atm}}{P}$.",
            "$V = "+fr(V0)+" × @f{"+fr(PATM)+"}{"+fr(arr(P,0))+"} = "+fr(V)+"$ @u{L}.",
            "**Je vérifie le sens.** La pression a augmenté, le volume a diminué. Et l'ordre de grandeur : environ $1$ bar de plus tous les $10$ @u{m}, donc une pression multipliée par environ $"+fr(arr(1 + h/10,1))+"$, et un volume divisé d'autant."],
      indice:"D'abord $P = P_{atm} + ρ g h$, puis $P_{atm} V_0 = P V$." };
  }}
];

/* ============================ CHAMPS ============================ */
/* Constantes du cahier : k = 9,0 × 10⁹, G = 6,67 × 10⁻¹¹,
   m_T = 6,0 × 10²⁴ kg, R_T = 6,4 × 10⁶ m. */
var KC = 9.0e9, GG = 6.67e-11, MT = 6.0e24, RTM = 6.4e6;
/* un résultat à trois chiffres significatifs, comme le demande l'énoncé :
   « 1{,}13 × 10^{5} », « 8{,}92 », « 0{,}223 » */
function sig3(x){
  x = x*(1 + 1e-12);                     // 0,4125 vaut 0,41249999… en flottant
  var a = Math.abs(x);
  var virg = function(t){ return t.replace(".", "{,}"); };
  if(a >= 0.01 && a < 1000) return virg(x.toPrecision(3));
  var e = Math.floor(Math.log10(a)), m = x/Math.pow(10, e);
  if(Math.abs(+m.toPrecision(3)) >= 10){ e++; m = x/Math.pow(10, e); }
  return virg(m.toPrecision(3)) + " × 10^{" + e + "}";
}

var G_CHAMPS = [

{ id:"cp-champ-charge", titre:"Champ d'une charge ponctuelle", niveau:2, chap:"champs",
  gen:function(){
    var Qn = pick([1, 2, 4, 5, 8]), neg = Math.random() < 0.5;
    var dcm = pick([2, 3, 4, 5, 10]);
    var Q = Qn*1e-9, d = dcm/100;
    var E = arr(KC*Q/(d*d), 2);
    return { type:"num", niveau:2, rep:E, tol:E*0.005, unite:"N/C",
      enonce:"Une charge ponctuelle $Q = "+(neg ? "−" : "")+fr(Qn)+"$ @u{nC} est placée en A. Quelle est la valeur du champ électrostatique qu'elle crée en un point M situé à $"+fr(dcm)+"$ @u{cm} de A ? On donne $k = 9{,}0 × 10^9$ @u{N·m²·C⁻²}. Donne le résultat avec trois chiffres significatifs.",
      diag:[{v:arr(KC*Q/d,2), m:"Tu as divisé par $d$ au lieu de $d^2$. La distance est **au carré** : $"+fr(arr(d,4))+"^2 = "+fr(arr(d*d,6))+"$ @u{m²}."},
            {v:arr(KC*Q/(dcm*dcm),4), m:"Tu as laissé la distance en centimètres. Il faut des mètres : $d = "+fr(arr(d,4))+"$ @u{m}."},
            {v:arr(KC*Q*1e3/(d*d),2), m:"Erreur de préfixe : un nanocoulomb vaut $10^{-9}$ @u{C}, pas $10^{-6}$."}],
      corr:["**Ce que donne l'énoncé.** Une charge en nanocoulombs et une distance en centimètres. Ce qu'on cherche : la **valeur** du champ, en @u{N/C}.",
            "**Je convertis.** $|Q| = "+fr(Qn)+" × 10^{-9}$ @u{C} et $d = "+fr(arr(d,4))+"$ @u{m}.",
            "La valeur du champ d'une charge ponctuelle : $E = k @f{|Q|}{d^2}$.",
            "$E = 9{,}0 × 10^9 × @f{"+fr(Qn)+" × 10^{-9}}{"+fr(arr(d,4))+"^2} ≈ "+sig3(E)+"$ @u{N/C}.",
            "**Le sens, pour compléter.** $Q$ est "+(neg ? "négative : en M, le champ pointe **vers** A." : "positive : en M, le champ **s'éloigne** de A.")+" La valeur, elle, ne dépend pas du signe."],
      indice:"$E = k @f{|Q|}{d^2}$, la charge en coulombs et la distance en mètres." };
  }},

{ id:"cp-force-champ", titre:"Force dans un champ électrostatique", niveau:1, chap:"champs",
  gen:function(){
    var qu = pick([0.5, 1, 2, 5]), neg = Math.random() < 0.5;
    var E = pick([1000, 5000, 20000, 100000]);
    var q = qu*1e-6, F = arr(q*E, 9);
    return { type:"num", niveau:1, rep:F, tol:F*0.005, unite:"N",
      enonce:"Une charge $q = "+(neg ? "−" : "")+fr(qu)+"$ @u{µC} est placée en un point où le champ électrostatique vaut $E = "+fr(E)+"$ @u{N/C}. Quelle est la valeur de la force qu'elle subit ? Donne le résultat avec trois chiffres significatifs.",
      diag:[{v:arr(E/q,2), m:"Tu as divisé le champ par la charge. La force est un **produit** : $F = |q| × E$."},
            {v:arr(qu*E,6), m:"Tu as gardé la charge en microcoulombs. Il faut des coulombs : $1$ @u{µC} $= 10^{-6}$ @u{C}."},
            {v:E, m:"Tu as recopié la valeur du champ. Le champ est en @u{N/C} ; la force s'obtient en le multipliant par la charge."}],
      corr:["**Ce que donne l'énoncé.** Une charge et la valeur du champ là où elle se trouve. Ce qu'on cherche : la valeur de la force.",
            "**Je convertis.** $|q| = "+fr(qu)+" × 10^{-6}$ @u{C}.",
            "$@v{F} = q @v{E}$, donc en valeur $F = |q| × E$.",
            "$F = "+fr(qu)+" × 10^{-6} × "+fr(E)+" ≈ "+sig3(F)+"$ @u{N}.",
            "**Le sens.** $q$ est "+(neg ? "négative : la force est **de sens opposé** au champ." : "positive : la force est **dans le sens** du champ.")],
      indice:"$F = |q| × E$, la charge en coulombs." };
  }},

{ id:"cp-g-altitude", titre:"Champ de gravitation en altitude", niveau:3, chap:"champs",
  gen:function(){
    var hkm = pick([300, 400, 800, 2000, 20000, 36000]);
    var d = RTM + hkm*1e3;
    var g = arr(GG*MT/(d*d), 5);
    return { type:"num", niveau:3, rep:g, tol:g*0.005, unite:"N/kg",
      enonce:"Quelle est la valeur du champ de gravitation terrestre à $"+fr(hkm)+"$ @u{km} d'altitude ? On donne $m_T = 6{,}0 × 10^{24}$ @u{kg}, $R_T = 6{,}4 × 10^6$ @u{m} et $G = 6{,}67 × 10^{-11}$ @u{N·m²·kg⁻²}. Donne le résultat avec trois chiffres significatifs.",
      diag:[{v:arr(GG*MT/(RTM*RTM),5), m:"C'est la valeur au **sol** : tu as pris $d = R_T$, ou laissé l'altitude en kilomètres. La distance au centre vaut $R_T + h = "+fr(arr(d/1e6,4))+" × 10^6$ @u{m}."},
            {v:arr(GG*MT/Math.pow(hkm*1e3,2),5), m:"Tu as pris $d = h$. La distance se compte depuis le **centre** de la Terre : $d = R_T + h$."},
            {v:arr(GG*MT/d,2), m:"Tu as divisé par $d$ au lieu de $d^2$. La distance est **au carré**."}],
      corr:["**Ce que donne l'énoncé.** Une altitude, la masse et le rayon de la Terre. Ce qu'on cherche : la valeur de $g$ à cette altitude.",
            "**La distance au centre.** $d = R_T + h = 6{,}4 × 10^6 + "+fr(hkm)+" × 10^3 = "+fr(arr(d/1e6,4))+" × 10^6$ @u{m}.",
            "$g = G @f{m_T}{d^2}$.",
            "$g = 6{,}67 × 10^{-11} × @f{6{,}0 × 10^{24}}{("+fr(arr(d/1e6,4))+" × 10^6)^2} ≈ "+sig3(g)+"$ @u{N/kg}.",
            "**Je vérifie.** Plus haut, le champ est plus faible qu'au sol ($9{,}8$ @u{N/kg}) : il diminue comme $@f{1}{d^2}$."],
      indice:"La distance se compte depuis le centre de la Terre : $d = R_T + h$, en mètres." };
  }},

{ id:"cp-g-astre", titre:"Champ de gravitation à la surface d'un astre", niveau:2, chap:"champs",
  gen:function(){
    var a = pick([
      { nom:"la Lune", M:7.3e22, Mt:"7{,}3 × 10^{22}", R:1.74e6, Rt:"1{,}74 × 10^6" },
      { nom:"Mars", M:6.4e23, Mt:"6{,}4 × 10^{23}", R:3.4e6, Rt:"3{,}4 × 10^6" },
      { nom:"Vénus", M:4.87e24, Mt:"4{,}87 × 10^{24}", R:6.05e6, Rt:"6{,}05 × 10^6" },
      { nom:"Jupiter", M:1.9e27, Mt:"1{,}9 × 10^{27}", R:7.0e7, Rt:"7{,}0 × 10^7", ou:"au niveau de ses nuages (Jupiter n'a pas de sol)" }
    ]);
    var g = arr(GG*a.M/(a.R*a.R), 4);
    /* 0,6 % : 1,60 (troncature) doit passer pour 1,608 sur la Lune */
    return { type:"num", niveau:2, rep:g, tol:g*0.006, unite:"N/kg",
      enonce:"La masse de "+a.nom+" vaut $"+a.Mt+"$ @u{kg} et son rayon $"+a.Rt+"$ @u{m}. Quelle est la valeur du champ de gravitation "+(a.ou || "à sa surface")+" ? On donne $G = 6{,}67 × 10^{-11}$ @u{N·m²·kg⁻²}. Donne le résultat avec trois chiffres significatifs.",
      diag:[{v:arr(GG*a.M/a.R,2), m:"Tu as divisé par le rayon au lieu de son carré. La distance est **au carré** dans $g = G @f{M}{R^2}$."},
            {v:arr(a.M/(a.R*a.R),2), m:"Tu as oublié $G$ : $@f{M}{R^2}$ ne suffit pas, il faut multiplier par $G = 6{,}67 × 10^{-11}$."},
            {v:9.81, m:"C'est la valeur sur **Terre**. Il faut la calculer pour "+a.nom+", avec sa masse et son rayon."}],
      corr:["**Ce que donne l'énoncé.** La masse et le rayon de l'astre. Ce qu'on cherche : $g$ "+(a.ou ? "au niveau de ses nuages" : "à sa surface")+".",
            "À cette distance du centre, égale au rayon : $g = G @f{M}{R^2}$.",
            "$R^2 = ("+a.Rt+")^2 = "+fr(arr(a.R*a.R/Math.pow(10, Math.floor(Math.log10(a.R*a.R))),3))+" × 10^{"+Math.floor(Math.log10(a.R*a.R))+"}$ @u{m²}.",
            "$g = 6{,}67 × 10^{-11} × @f{"+a.Mt+"}{R^2} ≈ "+sig3(g)+"$ @u{N/kg}.",
            "**Je compare avec la Terre**, où $g ≈ 9{,}8$ @u{N/kg} : un astre plus massif, ou plus petit, a un champ plus intense à sa surface."],
      indice:"$g = G @f{M}{R^2}$ : le rayon en mètres, et au carré." };
  }}
];

/* ========================= OXYDORÉDUCTION ========================= */
function ppcm(a, b){ var x = a, y = b; while(y){ var t = y; y = x % y; x = t; } return a*b/x; }

var G_OXYDO = [

{ id:"ox-electrons", titre:"Électrons d'une demi-équation", niveau:1, chap:"oxydoreduction",
  gen:function(){
    /* la demi-équation est donnée ajustée en éléments, sans ses électrons */
    var c = pick([
      { couple:"@c{MnO_4^-}/@c{Mn^{2+}}", eq:"@c{MnO_4^-} + 8 @c{H^+} + n @c{e^-} = @c{Mn^{2+}} + 4 @c{H_2O}", n:5, gauche:"−1 + 8 = +7", droite:"+2", nH:8 },
      { couple:"@c{Cr_2O_7^{2-}}/@c{Cr^{3+}}", eq:"@c{Cr_2O_7^{2-}} + 14 @c{H^+} + n @c{e^-} = 2 @c{Cr^{3+}} + 7 @c{H_2O}", n:6, gauche:"−2 + 14 = +12", droite:"2 × (+3) = +6", nH:14 },
      { couple:"@c{NO_3^-}/@c{NO}", eq:"@c{NO_3^-} + 4 @c{H^+} + n @c{e^-} = @c{NO} + 2 @c{H_2O}", n:3, gauche:"−1 + 4 = +3", droite:"0", nH:4 },
      { couple:"@c{O_2}/@c{H_2O}", eq:"@c{O_2} + 4 @c{H^+} + n @c{e^-} = 2 @c{H_2O}", n:4, gauche:"+4", droite:"0", nH:4 },
      { couple:"@c{SO_4^{2-}}/@c{SO_2}", eq:"@c{SO_4^{2-}} + 4 @c{H^+} + n @c{e^-} = @c{SO_2} + 2 @c{H_2O}", n:2, gauche:"−2 + 4 = +2", droite:"0", nH:4 },
      { couple:"@c{H_2O_2}/@c{H_2O}", eq:"@c{H_2O_2} + 2 @c{H^+} + n @c{e^-} = 2 @c{H_2O}", n:2, gauche:"+2", droite:"0", nH:2 }
    ]);
    return { type:"num", niveau:1, rep:c.n, tol:0.1,
      enonce:"La demi-équation du couple $"+c.couple+"$ est ajustée en éléments : $"+c.eq+"$. Combien vaut $n$, le nombre d'électrons ?",
      diag:[{v:c.nH, m:"$"+c.nH+"$, c'est le nombre d'ions $@c{H^+}$. Les électrons, eux, ajustent les **charges** : à gauche $"+c.gauche+"$, à droite $"+c.droite+"$."}],
      corr:["**Ce qu'on cherche.** Le nombre d'électrons qui rend la charge égale des deux côtés.",
            "**La charge à gauche, sans les électrons.** $"+c.gauche+"$.",
            "**La charge à droite.** $"+c.droite+"$.",
            "**L'écart.** Il faut $"+c.n+"$ charges négatives à gauche : $n = "+c.n+"$.",
            "**Je vérifie le côté.** Les électrons sont du côté de l'oxydant, à gauche : c'est bien là que la charge était la plus grande."],
      indice:"Compte la charge totale de chaque côté, ions $@c{H^+}$ compris." };
  }},

{ id:"ox-echange", titre:"Électrons échangés dans une réaction", niveau:2, chap:"oxydoreduction",
  gen:function(){
    var c = pick([
      { ox:"@c{MnO_4^-}", nOx:5, red:"@c{Fe^{2+}}", nRed:1 },
      { ox:"@c{MnO_4^-}", nOx:5, red:"@c{C_2O_4^{2-}}", nRed:2 },
      { ox:"@c{Cr_2O_7^{2-}}", nOx:6, red:"@c{Fe^{2+}}", nRed:1 },
      { ox:"@c{NO_3^-}", nOx:3, red:"@c{Cu}", nRed:2 },
      { ox:"@c{O_2}", nOx:4, red:"@c{Fe^{2+}}", nRed:1 },
      { ox:"@c{Cr_2O_7^{2-}}", nOx:6, red:"@c{Zn}", nRed:2 },
      { ox:"@c{Ag^+}", nOx:1, red:"@c{Cu}", nRed:2 }
    ]);
    var L = ppcm(c.nOx, c.nRed);
    return { type:"num", niveau:2, rep:L, tol:0.1,
      enonce:"L'oxydant "+"$"+c.ox+"$ capte $"+c.nOx+"$ électron"+(c.nOx > 1 ? "s" : "")+" dans sa demi-équation ; le réducteur $"+c.red+"$ en cède $"+c.nRed+"$ dans la sienne. Combien d'électrons sont échangés dans l'équation de la réaction ?",
      diag:[{v:c.nOx + c.nRed, m:"Tu as additionné $"+c.nOx+"$ et $"+c.nRed+"$. Il faut un nombre qu'on obtienne **à la fois** en multipliant $"+c.nOx+"$ et en multipliant $"+c.nRed+"$ : le plus petit est $"+L+"$."},
            {v:c.nOx*c.nRed, m:"$"+c.nOx+" × "+c.nRed+" = "+(c.nOx*c.nRed)+"$ convient, mais ce n'est pas le plus petit : $"+L+"$ suffit. Les coefficients de l'équation seraient tous deux fois trop grands."}],
      corr:["**Ce qu'il faut.** Que les électrons cédés par le réducteur soient exactement ceux captés par l'oxydant.",
            "**Le plus petit multiple commun** de $"+c.nOx+"$ et $"+c.nRed+"$ : $"+L+"$.",
            "**Les multiplications.** Oxydant $× "+(L/c.nOx)+"$, réducteur $× "+(L/c.nRed)+"$.",
            "**Je vérifie.** $"+c.nOx+" × "+(L/c.nOx)+" = "+c.nRed+" × "+(L/c.nRed)+" = "+L+"$."],
      indice:"Le plus petit nombre qui soit un multiple des deux." };
  }},

{ id:"ox-titrage", titre:"Titrage d'oxydoréduction", niveau:3, chap:"oxydoreduction",
  gen:function(){
    var s = pick([
      { titre:"@c{Fe^{2+}}", titrant:"@c{MnO_4^-}", eq:"@c{MnO_4^-} + 8 @c{H^+} + 5 @c{Fe^{2+}} → @c{Mn^{2+}} + 4 @c{H_2O} + 5 @c{Fe^{3+}}", r:5, rel:"n(@c{Fe^{2+}}) = 5 × n(@c{MnO_4^-})" },
      { titre:"@c{C_2O_4^{2-}}", titrant:"@c{MnO_4^-}", eq:"2 @c{MnO_4^-} + 16 @c{H^+} + 5 @c{C_2O_4^{2-}} → 2 @c{Mn^{2+}} + 8 @c{H_2O} + 10 @c{CO_2}", r:2.5, rel:"n(@c{C_2O_4^{2-}}) = @f{5}{2} × n(@c{MnO_4^-})" },
      { titre:"@c{I_2}", titrant:"@c{S_2O_3^{2-}}", eq:"@c{I_2} + 2 @c{S_2O_3^{2-}} → 2 @c{I^-} + @c{S_4O_6^{2-}}", r:0.5, rel:"n(@c{I_2}) = @f{n(@c{S_2O_3^{2-}})}{2}" }
    ]);
    /* on écarte les tirages où deux des quatre valeurs (réponse, coefficients
       oubliés, rapport inversé, volumes inversés) sont à moins de 15 % l'une
       de l'autre : arrondies, elles se confondraient */
    var VA, CB, VE, CA, vals, proches, essais = 0;
    do {
      VA = pick([10.0, 20.0, 25.0]); CB = pick([0.0100, 0.0200, 0.0500]); VE = pick([8.0, 12.0, 14.0, 16.5]);
      CA = arr(s.r*CB*VE/VA, 6);
      vals = [CA, CB*VE/VA, CB*VE/VA/s.r, s.r*CB*VA/VE];
      proches = false;
      for(var i=0;i<4;i++) for(var j=i+1;j<4;j++) if(Math.abs(vals[i] - vals[j]) < 0.15*Math.max(vals[i], vals[j])) proches = true;
    } while(proches && ++essais < 200);
    return { type:"num", niveau:3, rep:CA, tol:CA*0.005, unite:"mol/L",
      enonce:"On titre $V_A = "+fr(VA.toFixed(1))+"$ @u{mL} d'une solution de $"+s.titre+"$ par une solution de $"+s.titrant+"$ de concentration $C_B = "+fr(CB.toFixed(4))+"$ @u{mol/L}. L'équivalence est obtenue pour $V_E = "+fr(VE.toFixed(1))+"$ @u{mL}. L'équation est $"+s.eq+"$. Quelle est la concentration de la solution titrée ? Donne le résultat avec trois chiffres significatifs.",
      diag:[{v:arr(CB*VE/VA,6), m:"Tu as oublié les coefficients de l'équation : à l'équivalence, $"+s.rel+"$."},
            {v:arr(CB*VE/VA/s.r,6), m:"Tu as pris le rapport des coefficients à l'envers. À l'équivalence, $"+s.rel+"$."},
            {v:arr(s.r*CB*VA/VE,6), m:"Tu as inversé les volumes : $V_E$ est au numérateur, $V_A$ au dénominateur."}],
      corr:["**La quantité de titrant versée.** $n = C_B × V_E = "+fr(CB.toFixed(4))+" × "+fr(VE.toFixed(1))+" × 10^{-3} ≈ "+sig3(CB*VE*1e-3)+"$ @u{mol}.",
            "**La relation à l'équivalence**, lue sur les coefficients : $"+s.rel+"$, soit $n_{titré} ≈ "+sig3(s.r*CB*VE*1e-3)+"$ @u{mol}.",
            "**La concentration.** $C_A = @f{n_{titré}}{V_A}$, calculée d'un seul coup à partir des données, sans arrondi en route : $C_A ≈ "+sig3(CA)+"$ @u{mol/L}.",
            "**Je vérifie le sens du rapport.** L'espèce qui a le plus grand coefficient dans l'équation est celle dont il faut le plus de moles."],
      indice:"Lis les coefficients de l'équation avant d'écrire la relation à l'équivalence." };
  }},

{ id:"ox-depot", titre:"Masse de métal déposée", niveau:2, chap:"oxydoreduction",
  gen:function(){
    /* pas de zinc et cuivre : leurs masses molaires (65,4 et 63,5) sont si
       proches que la masse recopiée tombait sur la bonne réponse arrondie */
    var s = pick([
      { met:"fer", Mm:55.8, sym:"Fe", dep:"cuivre", Md:63.5, symd:"Cu", eq:"@c{Fe} + @c{Cu^{2+}} → @c{Fe^{2+}} + @c{Cu}", k:1 },
      { met:"cuivre", Mm:63.5, sym:"Cu", dep:"argent", Md:107.9, symd:"Ag", eq:"@c{Cu} + 2 @c{Ag^+} → @c{Cu^{2+}} + 2 @c{Ag}", k:2 }
    ]);
    var m = pick([0.200, 0.350, 0.500, 0.800, 1.20]);      // trois chiffres significatifs
    var md = arr(s.k*m/s.Mm*s.Md, 6);
    var d = [{v:m, m:"Tu as recopié la masse de "+s.met+". Ce sont les **quantités de matière** qui sont reliées par l'équation, pas les masses."},
             {v:arr(s.k*m*s.Mm/s.Md,6), m:"Tu as inversé les masses molaires : $n = @f{m}{M("+s.sym+")}$, puis $m = n × M("+s.symd+")$."}];
    if(s.k === 2) d.push({v:arr(m/s.Mm*s.Md,6), m:"Tu as oublié le coefficient $2$ : un atome de cuivre réduit **deux** ions argent, il se dépose donc $2$ moles d'argent par mole de cuivre."});
    return { type:"num", niveau:2, rep:md, tol:md*0.005, unite:"g",
      enonce:"Un morceau de "+s.met+" de masse $"+sig3(m)+"$ @u{g} réagit entièrement selon $"+s.eq+"$. Quelle masse de "+s.dep+" se dépose ? On donne $M(@c{"+s.sym+"}) = "+fr(s.Mm)+"$ @u{g/mol} et $M(@c{"+s.symd+"}) = "+fr(s.Md)+"$ @u{g/mol}. Donne le résultat avec trois chiffres significatifs.",
      diag:d,
      corr:["**La quantité de "+s.met+".** $n = @f{"+sig3(m)+"}{"+fr(s.Mm)+"} ≈ "+sig3(m/s.Mm)+"$ @u{mol}.",
            "**L'équation.** "+(s.k === 1 ? "Une mole de "+s.met+" donne une mole de "+s.dep+"." : "Une mole de cuivre donne **deux** moles d'argent."),
            "**La masse déposée**, calculée d'un seul coup sans arrondir $n$ : $m = "+(s.k === 1 ? "" : "2 × ")+"@f{"+sig3(m)+"}{"+fr(s.Mm)+"} × "+fr(s.Md)+" ≈ "+sig3(md)+"$ @u{g}."],
      indice:"Passe par les quantités de matière, et lis les coefficients de l'équation." };
  }}
];


/* ============================ COULEURS (ch17) ============================
   Générateurs de QCM. Une couleur est un triplet [rouge, vert, bleu] de 0/1.
   Ils sont contrôlés par outils/verifier-generateurs.mjs (contrôle QCM) :
   bonne réponse recalculée par une règle indépendante, messages, position.
   Tout nouveau générateur de QCM doit apporter sa règle dans
   outils/qcm-generateurs.mjs. */
var NOMS_C = {"000":"noir","100":"rouge","010":"vert","001":"bleu","110":"jaune","011":"cyan","101":"magenta","111":"blanc"};
function cNom(t){ return NOMS_C[t.join("")]; }
function cDe(nom){ for(var k in NOMS_C) if(NOMS_C[k] === nom) return k.split("").map(Number); }
function cEt(a, b){ return [a[0]&b[0], a[1]&b[1], a[2]&b[2]]; }
function cOu(a, b){ return [a[0]|b[0], a[1]|b[1], a[2]|b[2]]; }
function cListe(t){
  var l = ["rouge","vert","bleu"].filter(function(x, i){ return t[i]; }).map(function(x){ return "le " + x; });
  return !l.length ? "rien" : l.length === 1 ? l[0] : l.slice(0, -1).join(", ") + " et " + l[l.length - 1];
}
function cLumiere(nom){ return "lumière " + ({blanc:"blanche", vert:"verte", bleu:"bleue"}[nom] || nom); }
function maj(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
/* range la bonne réponse et trois distracteurs distincts (dans l'ordre des
   candidats, les plus instructifs d'abord), la bonne à une place tirée au hasard */
function qcmCouleur(bonne, candidats, generique){
  var vus = {}, d = []; vus[bonne] = 1;
  candidats.forEach(function(c){ if(d.length < 3 && !vus[c.nom]){ vus[c.nom] = 1; d.push(c); } });
  ["noir","blanc","rouge","vert","bleu","jaune","cyan","magenta"].forEach(function(nm){
    if(d.length < 3 && !vus[nm]){ vus[nm] = 1; d.push({nom:nm, m:generique}); } });
  var k = ri(0, 3), choix = [], diag = [];
  d.splice(k, 0, {nom:bonne, m:""});
  d.forEach(function(c){ choix.push(maj(c.nom)); diag.push(c.m); });
  return {choix:choix, bonne:k, diag:diag};
}

var G_COULEURS = [

{ id:"co-objet", titre:"Couleur d'un objet sous un éclairage", niveau:2, chap:"couleurs",
  gen:function(){
    var objN = pick(["blanc","rouge","vert","bleu","jaune","cyan","magenta"]);
    var lumN = pick(["rouge","vert","bleu","jaune","cyan","magenta"]);
    var obj = cDe(objN), lum = cDe(lumN), vu = cEt(obj, lum), vuN = cNom(vu), mixN = cNom(cOu(obj, lum));
    var calcul = "Il reçoit " + cListe(lum) + " et sait renvoyer " + cListe(obj) + " : il ne renvoie que ce qui figure dans les deux, " + cListe(vu) + ".";
    /* la couleur de la lumière d'abord : quand elle coïncide avec la somme objet +
       lumière, c'est le plus souvent elle que l'élève a recopiée */
    var q = qcmCouleur(vuN, [
      {nom:objN, m:maj(objN) + " est sa couleur en lumière **blanche**. Ici, il n'est éclairé qu'en " + cLumiere(lumN) + ". " + calcul},
      {nom:lumN, m:"C'est la couleur de la lumière qui l'éclaire. " + (vuN === "noir" ? "L'objet l'absorbe entièrement. " : "L'objet en absorbe une partie. ") + calcul},
      {nom:mixN, m:"Tu as additionné la couleur de l'objet et celle de la lumière, comme deux lumières superposées. L'objet ne fait que renvoyer une **partie** de ce qu'il reçoit. " + calcul},
      {nom:"noir", m:"Il paraîtrait noir s'il absorbait tout ce qu'il reçoit. " + calcul}
    ], "Recompte. " + calcul);
    return { type:"qcm", niveau:2, choix:q.choix, bonne:q.bonne, diag:q.diag,
      enonce:"Un objet est **" + objN + "** en lumière blanche. Dans une salle obscure, on l'éclaire uniquement en " + cLumiere(lumN).replace(/^lumière (.*)$/, "lumière **$1**") + ". De quelle couleur paraît-il ?",
      corr:["**Ce qu'il reçoit** : la " + cLumiere(lumN) + ", c'est-à-dire " + cListe(lum) + ".",
            "**Ce qu'il sait renvoyer** : un objet " + objN + " renvoie " + cListe(obj) + (objN === "blanc" ? " ; il n'absorbe rien." : " et absorbe le reste."),
            "**En commun** : " + cListe(vu) + ". Il paraît **" + vuN + "**." + (vuN === "noir" ? " Il n'a pas changé : il absorbe tout ce qu'il reçoit." : "")],
      indice:"Décompose la lumière et la couleur de l'objet en rouge, vert, bleu, puis garde ce qui est commun." };
  }},

{ id:"co-filtres", titre:"Lumière blanche à travers deux filtres", niveau:2, chap:"couleurs",
  gen:function(){
    var f1N = pick(["rouge","vert","bleu","jaune","cyan","magenta"]);
    var f2N = pick(["rouge","vert","bleu","jaune","cyan","magenta"].filter(function(x){ return x !== f1N; }));
    var f1 = cDe(f1N), f2 = cDe(f2N), t = cEt(f1, f2), tN = cNom(t), mixN = cNom(cOu(f1, f2));
    var calcul = "Le filtre " + f1N + " transmet " + cListe(f1) + " ; le filtre " + f2N + " transmet " + cListe(f2) + ". Ne passe que ce qui figure dans les deux : " + cListe(t) + ".";
    var q = qcmCouleur(tN, [
      {nom:f1N, m:"C'est la couleur du premier filtre. Mais le second filtre, derrière, retire encore des composantes. " + calcul},
      {nom:f2N, m:"C'est la couleur du second filtre. Mais il ne transmet que ce qui lui arrive, et le premier filtre a déjà retiré des composantes. " + calcul},
      {nom:mixN, m:"Tu as additionné les couleurs des deux filtres, comme deux lumières superposées. Un filtre **retire** : c'est la synthèse soustractive. " + calcul},
      {nom:"blanc", m:"Un filtre ne peut que retirer de la lumière : derrière deux filtres colorés, on ne retrouve jamais tout le blanc. " + calcul},
      {nom:"noir", m:"Une composante passe les deux filtres. " + calcul}
    ], "Suis la lumière filtre par filtre. " + calcul);
    return { type:"qcm", niveau:2, choix:q.choix, bonne:q.bonne, diag:q.diag,
      enonce:"Une lumière blanche traverse un filtre **" + f1N + "**, puis un filtre **" + f2N + "**. Quelle couleur arrive sur l'écran ?",
      corr:["**Le filtre " + f1N + "** transmet " + cListe(f1) + " et absorbe le reste.",
            "**Le filtre " + f2N + "** ne laisse passer, de ce qui lui arrive, que ce qui figure dans " + cListe(f2) + ".",
            "**Il reste** " + cListe(t) + " : l'écran paraît **" + tN + "**." + (tN === "noir" ? " Aucune composante ne passe les deux filtres." : "")],
      indice:"Écris ce que chaque filtre laisse passer, et garde ce qui passe les deux." };
  }}
];


/* ============================ COMBUSTIONS (ch18) ============================
   Énergies de liaison moyennes (kJ/mol, phase gazeuse) : table « Average Bond
   Energies » de LibreTexts Chemistry, avec C=O dans CO2 = 799 ; voir l'en-tête
   de 03-cours-combustions.js pour les sources et le contrôle croisé (NIST). */
var EL = {"C–H":413, "C–C":347, "C–O":358, "O–H":467, "O=O":495, "C=O":799};
var COMB = [
  { nom:"méthane",  f:"CH_4",     C:1, H:4,  O:0, l:{"C–H":4} },
  { nom:"éthane",   f:"C_2H_6",   C:2, H:6,  O:0, l:{"C–H":6, "C–C":1} },
  { nom:"propane",  f:"C_3H_8",   C:3, H:8,  O:0, l:{"C–H":8, "C–C":2} },
  { nom:"butane",   f:"C_4H_10",  C:4, H:10, O:0, l:{"C–H":10, "C–C":3} },
  { nom:"pentane",  f:"C_5H_12",  C:5, H:12, O:0, l:{"C–H":12, "C–C":4} },
  { nom:"méthanol", f:"CH_3OH",   C:1, H:4,  O:1, l:{"C–H":3, "C–O":1, "O–H":1} },
  { nom:"éthanol",  f:"C_2H_5OH", C:2, H:6,  O:1, l:{"C–H":5, "C–C":1, "C–O":1, "O–H":1} }
];
/* pour UNE mole de combustible : coefficients, liaisons rompues et formées, Er, M */
function bilanComb(c){
  var co2 = c.C, h2o = c.H/2, o2 = (2*co2 + h2o - c.O)/2, R = o2*EL["O=O"], F = 2*co2*EL["C=O"] + 2*h2o*EL["O–H"];
  for(var k in c.l) R += c.l[k]*EL[k];
  return { co2:co2, h2o:h2o, o2:o2, R:R, F:F, E:R - F, M:12.0*c.C + 1.0*c.H + 16.0*c.O };
}
function coefC(x){ return x === 1 ? "" : fr(x) + " "; }
function equationC(c, b){ return "@c{" + c.f + "}$(g) $+ " + coefC(b.o2) + "@c{O_2}$(g) $→ " + coefC(b.co2) + "@c{CO_2}$(g) $+ " + coefC(b.h2o) + "@c{H_2O}"; }
function liaisonsTxt(c){
  var out = []; for(var k in c.l) out.push(c.l[k] + " liaison" + (c.l[k] > 1 ? "s" : "") + " " + k);
  return out.length > 1 ? out.slice(0, -1).join(", ") + " et " + out[out.length - 1] : out[0];
}
function tableTxt(c){
  var cles = Object.keys(c.l).concat(["O=O", "C=O", "O–H"]), vus = {}, out = [];
  cles.forEach(function(k){ if(!vus[k]){ vus[k] = 1; out.push(k + (k === "C=O" ? " (dans $@c{CO_2}$)" : "") + " $" + EL[k] + "$"); } });
  return out.join(" ; ");
}

var G_COMBUSTIONS = [

{ id:"cb-oxygene", titre:"Dioxygène d'une combustion complète", niveau:1, chap:"combustions",
  gen:function(){
    var c = pick(COMB), b = bilanComb(c);
    var d = [{v:2*b.o2, m:"$" + fr(2*b.o2) + "$, c'est le nombre d'**atomes** d'oxygène à fournir. Chaque molécule $@c{O_2}$ en apporte 2 : il en faut $" + fr(b.o2) + "$."},
             {v:b.co2, m:"$" + b.co2 + "$, c'est le nombre de $@c{CO_2}$ (un par atome de carbone). Il reste à compter tous les atomes O à droite."}];
    if(c.O) d.push({v:b.o2 + 0.5, m:"Tu as oublié l'atome d'oxygène que l'alcool apporte déjà : le dioxygène n'a à fournir que $" + fr(2*b.o2) + "$ atomes O, soit $" + fr(b.o2) + "$ $@c{O_2}$."});
    return { type:"num", niveau:1, rep:b.o2, tol:0.1,
      enonce:"Pour brûler complètement **une** molécule " + de_(c.nom) + " $@c{" + c.f + "}$, combien de molécules de dioxygène faut-il ? Le résultat peut ne pas être entier : écris-le en décimal.",
      diag:d,
      corr:["**Le carbone** : " + c.C + " atome" + (c.C > 1 ? "s" : "") + ", donc $" + b.co2 + "$ $@c{CO_2}$.",
            "**L'hydrogène** : " + c.H + " atomes, donc $" + fr(b.h2o) + "$ $@c{H_2O}$.",
            "**L'oxygène** : à droite, $" + (2*b.co2) + " + " + fr(b.h2o) + " = " + fr(2*b.co2 + b.h2o) + "$ atomes O" + (c.O ? ", moins celui " + du_(c.nom) : "") + ", soit $" + fr(2*b.o2) + "$ à fournir, donc $" + fr(b.o2) + "$ $@c{O_2}$."],
      indice:"Carbone, puis hydrogène, puis oxygène en dernier." };
  }},

{ id:"cb-energie", titre:"Énergie molaire de combustion par les liaisons", niveau:2, chap:"combustions",
  gen:function(){
    var c = pick(COMB), b = bilanComb(c);
    var d = [{v:-b.E, m:"Le signe est inversé : tu as fait formées − rompues. On écrit **rompues − formées** ; une combustion a un $E_r$ négatif."},
             {v:b.E - b.o2*EL["O=O"], m:"Tu as oublié de rompre les liaisons O=O du dioxygène : $" + fr(b.o2) + " × 495$ @u{kJ} à ajouter aux ruptures."},
             {v:b.E + b.co2*EL["C=O"], m:"Une molécule $@c{CO_2}$ (O=C=O) contient **deux** liaisons C=O : $" + (2*b.co2) + " × 799$, et non $" + b.co2 + " × 799$."}];
    if(b.o2 !== 1) d.push({v:b.E - (b.o2 - 1)*EL["O=O"], m:"Tu as compté une seule liaison O=O. Il y a $" + fr(b.o2) + "$ moles de $@c{O_2}$ par mole de combustible, donc $" + fr(b.o2) + "$ moles de liaisons O=O."});
    return { type:"num", niveau:2, rep:b.E, tol:5, unite:"kJ/mol",
      enonce:"Estimer l'énergie molaire de la combustion d'une mole " + de_(c.nom) + " gazeux, en @u{kJ/mol} : $" + equationC(c, b) + "$(g). La molécule " + de_(c.nom) + " contient " + liaisonsTxt(c) + ". Énergies de liaison (@u{kJ/mol}) : " + tableTxt(c) + ".",
      diag:d,
      corr:["**Rompues** (le combustible et $" + fr(b.o2) + "$ $@c{O_2}$) : $" + Object.keys(c.l).map(function(k){ return c.l[k] + " × " + EL[k]; }).join(" + ") + " + " + fr(b.o2) + " × 495 = " + fr(b.R) + "$ @u{kJ}.",
            "**Formées** : $" + (2*b.co2) + "$ liaisons C=O et $" + (2*b.h2o) + "$ liaisons O–H, soit $" + (2*b.co2) + " × 799 + " + (2*b.h2o) + " × 467 = " + fr(b.F) + "$ @u{kJ}.",
            "**Bilan** : $E_r = " + fr(b.R) + " - " + fr(b.F) + " = " + fr(b.E) + "$ @u{kJ/mol}, négatif comme toute combustion."],
      indice:"Fais deux listes, liaisons rompues et liaisons formées, avec les coefficients." };
  }},

{ id:"cb-pouvoir", titre:"Pouvoir calorifique", niveau:2, chap:"combustions",
  gen:function(){
    var c = pick(COMB), b = bilanComb(c), E = Math.abs(b.E), pc = E/b.M;
    /* 3,5 % : l'élève qui arrondit à deux chiffres (21 pour 20,6) doit être accepté */
    return { type:"num", niveau:2, rep:pc, tol:pc*0.035, unite:"MJ/kg",
      enonce:"La combustion d'une mole " + de_(c.nom) + " (à l'état gazeux) a une énergie molaire de réaction $E_r = " + fr(b.E) + "$ @u{kJ/mol}, et $M(@c{" + c.f + "}) = " + fr(b.M.toFixed(1)) + "$ @u{g/mol}. Quel est son pouvoir calorifique, en @u{MJ/kg} ?",
      /* quand M² est proche de 1000 (éthane, méthanol), |Er| × M et |Er|/M × 1000
         tombent presque sur le même nombre : le second message ne pourrait plus
         être attribué à la bonne erreur, on le retire */
      diag:[{v:E*b.M, m:"Tu as multiplié par la masse molaire. Le pouvoir calorifique est une énergie **par kilogramme** : on **divise** par $M$."},
            {v:pc/1000, m:"$@f{|E_r|}{M}$ est en @u{kJ/g}, ce qui est **déjà** des @u{MJ/kg}. Tu as divisé par 1000 de trop."}]
            .concat(Math.abs(b.M*b.M/1000 - 1) > 0.4 ? [{v:pc*1000, m:"Des @u{kJ/g} sont des @u{MJ/kg} : il n'y a rien à multiplier par 1000."}] : []),
      corr:["**La formule** : $PC = @f{|E_r|}{M}$, en @u{kJ/g} si $E_r$ est en @u{kJ/mol} et $M$ en @u{g/mol}.",
            "**Le calcul** : $PC = @f{" + fr(E) + "}{" + fr(b.M.toFixed(1)) + "} ≈ " + sig3(pc) + "$ @u{kJ/g}, soit $" + sig3(pc) + "$ @u{MJ/kg}."],
      indice:"Une énergie par kilogramme : on divise par la masse molaire." };
  }},

{ id:"cb-liberee", titre:"Énergie libérée par une masse de combustible", niveau:2, chap:"combustions",
  gen:function(){
    var c = pick(COMB), b = bilanComb(c), E = Math.abs(b.E), m = pick([5.0, 10.0, 20.0, 50.0, 100]), Q = m/b.M*E;
    return { type:"num", niveau:2, rep:Q, tol:Q*0.035, unite:"kJ",
      enonce:"Quelle énergie libère la combustion complète de $" + fr(m.toFixed(m >= 100 ? 0 : 1)) + "$ @u{g} " + de_(c.nom) + " (supposé gazeux) ? On prend $E_r = " + fr(b.E) + "$ @u{kJ/mol} et $M(@c{" + c.f + "}) = " + fr(b.M.toFixed(1)) + "$ @u{g/mol}. Réponds en @u{kJ}.",
      diag:[{v:m*E, m:"Tu as multiplié l'énergie molaire par la **masse**. Il faut d'abord la quantité de matière : $n = @f{m}{M}$."},
            {v:Q/1000, m:"Ce résultat est en @u{MJ}. La question demande des @u{kJ}."}],
      corr:["**La quantité " + de_(c.nom) + "** : $n = @f{" + fr(m.toFixed(m >= 100 ? 0 : 1)) + "}{" + fr(b.M.toFixed(1)) + "} ≈ " + sig3(m/b.M) + "$ @u{mol}.",
            "**L'énergie libérée**, calculée d'un seul coup : $Q = @f{" + fr(m.toFixed(m >= 100 ? 0 : 1)) + "}{" + fr(b.M.toFixed(1)) + "} × " + fr(E) + " ≈ " + sig3(Q) + "$ @u{kJ}.",
            "**Positive** : $Q$ est une énergie libérée ; le signe négatif reste porté par $E_r$."],
      indice:"Passe par la quantité de matière." };
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
  { id:"lumiere",        titre:"Lumière",             gens:G_LUMIERE },
  { id:"lewis",         titre:"Molécules",         gens:G_LEWIS },
  { id:"cohesion",      titre:"Solutions",         gens:G_COHESION },
  { id:"organique",     titre:"Chimie organique",  gens:G_ORGANIQUE },
  { id:"fluides",       titre:"Fluides",           gens:G_FLUIDES },
  { id:"champs",        titre:"Champs",            gens:G_CHAMPS },
  { id:"oxydoreduction", titre:"Oxydoréduction",   gens:G_OXYDO },
  { id:"couleurs",       titre:"Couleurs",         gens:G_COULEURS },
  { id:"combustions",    titre:"Combustions",      gens:G_COMBUSTIONS }
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
     réponse : on l'écarte, pour ne jamais déclarer fausse une réponse juste.
     On écarte ensuite ceux qu'un diagnostic déjà retenu capterait de toute
     façon à l'affichage — inutile de garder un message qui ne pourra jamais
     apparaître. Le critère est donc la fenêtre réelle de `diagnostic()`,
     A.fenetreDiag(), et non la tolérance absolue de la réponse : comparer
     deux distracteurs avec `e.tol` écartait des erreurs sans rapport dès
     que la réponse était grande devant elles (le poids vaut 196 N, mais
     m/g et g/m valent 2,04 et 0,49). Pendant ce filtre, `e.diag` est
     encore la liste COMPLÈTE des candidats : c'est elle que fenetreDiag()
     lit pour sa borne « moitié de la distance à chaque autre
     distracteur ». */
  if(e.type==="num" && e.diag){
    var vus=[];
    e.diag = e.diag.filter(function(d){
      if(!isFinite(d.v)) return false;
      if(Math.abs(d.v - e.rep) <= e.tol) return false;
      for(var i=0;i<vus.length;i++) if(Math.abs(d.v-vus[i]) <= A.fenetreDiag(e, vus[i])) return false;
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
