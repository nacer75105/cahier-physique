/* =====================================================================
   Programme — Spécialité physique-chimie, classe de Première générale
   Partie « L'énergie : conversions et transferts »
   ===================================================================== */
window.COURS = (window.COURS || []).concat([

/* ========= 9. ÉNERGIE ET PUISSANCE ÉLECTRIQUES ========= */
{
id:"electrique", n:9, titre:"Énergie et puissance électriques",
sous:"Ce que consomme un appareil, et ce qu'il en fait",
desc:"Puissance, énergie, loi d'Ohm, effet Joule, bilan de puissance et rendement.",
duree:35,
sections:[
 {titre:"Puissance et énergie : deux mots, deux idées", blocs:[
  {t:"idee", x:"La **puissance** dit à quelle vitesse l'énergie est transférée. L'**énergie** dit combien a été transféré en tout. Confondre les deux est l'erreur la plus répandue de ce chapitre."},
  {t:"p", x:"Une comparaison qui règle la question une fois pour toutes : la puissance est le **débit du robinet**, l'énergie est le **volume dans le seau**. Un gros robinet ouvert une seconde peut remplir moins qu'un filet d'eau ouvert une heure. De même, un four très puissant allumé deux minutes consomme moins qu'une ampoule faible restée allumée toute la nuit."},
  {t:"formule", titre:"La relation entre les deux",
   x:"$E = P × Δt$",
   note:"$E$ en @u{J} (joules) · $P$ en @u{W} (watts) · $Δt$ en **secondes**. Un watt, c'est un joule par seconde."},
  {t:"piege", titre:"Le temps se compte en secondes", x:"Dans $E = P × Δt$, la durée doit être en **secondes** pour obtenir des joules. $30$ minutes valent $1800$ @u{s}, une heure vaut $3600$ @u{s}. Laisser des minutes donne un résultat 60 fois trop petit."},
  {t:"formule", titre:"L'unité des factures : le kilowattheure",
   x:"$1$ @u{kWh} $= 1000$ @u{W} $× 3600$ @u{s} $= 3{,}6 × 10^{6}$ @u{J}",
   note:"C'est l'énergie consommée par un appareil de $1000$ @u{W} pendant une heure."},
  {t:"p", x:"Le kilowattheure a mauvaise réputation auprès des élèves, mais il est très logique : c'est simplement une puissance multipliée par une durée, avec des unités pratiques plutôt que des joules. Une plaque de $2000$ @u{W} utilisée pendant une demi-heure consomme $2 × 0{,}5 = 1$ @u{kWh}."},
  {t:"check", q:"Un radiateur de $1500$ @u{W} fonctionne pendant $2$ heures. Quelle énergie a-t-il consommée, en @u{kWh} ?",
   choix:["$3$ @u{kWh}","$3000$ @u{kWh}","$750$ @u{kWh}","$1500$ @u{kWh}"], bonne:0,
   expl:["Exact : $1500$ @u{W} $= 1{,}5$ @u{kW}, et $1{,}5 × 2 = 3$ @u{kWh}.",
         "Tu as multiplié en watts sans convertir en kilowatts. Un kilowatt vaut $1000$ @u{W} : il faut diviser par 1000.",
         "Tu as divisé par la durée au lieu de multiplier. Plus l'appareil fonctionne longtemps, plus il consomme.",
         "C'est la puissance de l'appareil, pas l'énergie consommée. Il manque la durée d'utilisation."]}
 ]},

 {titre:"Le circuit électrique : tension, intensité, résistance", blocs:[
  {t:"p", x:"Dans un circuit, trois grandeurs se répondent en permanence. La **tension** $U$, en volts, mesure la « poussée » entre deux points. L'**intensité** $I$, en ampères, mesure le débit de charges qui passe. La **résistance** $R$, en ohms, mesure la difficulté à laisser passer."},
  {t:"formule", titre:"Loi d'Ohm", x:"$U = R × I$", note:"$U$ en @u{V} · $R$ en @u{Ω} · $I$ en @u{A}. Elle ne vaut que pour un conducteur ohmique — une résistance, pas une pile ni une diode."},
  {t:"fig", titre:"Un circuit simple, en série",
   vue:[0,0,8,6], w:360, h:270, grille:false, axes:false,
   objets:[
    {t:"dip", type:"pile", de:[1,1], a:[1,5], nom:"G"},
    {t:"dip", type:"resistor", de:[1,5], a:[7,5], nom:"R"},
    {t:"dip", type:"lampe", de:[7,5], a:[7,1], nom:"L"},
    {t:"dip", type:"inter", de:[7,1], a:[1,1], nom:"K", ferme:true, cote:-1}
   ],
   note:"En série, la même intensité traverse tous les dipôles. Le générateur fournit, les autres consomment."},
  {t:"formule", titre:"Puissance reçue par un dipôle", x:"$P = U × I$", note:"$P$ en @u{W} · $U$ en @u{V} · $I$ en @u{A}. Cette formule vaut pour **tout** dipôle, ohmique ou non."},
  {t:"exemple", titre:"Exemple guidé — lire une plaque signalétique", enonce:"Une bouilloire porte l'inscription « $230$ @u{V} — $2200$ @u{W} ». Quelle intensité la traverse ? Quelle énergie consomme-t-elle en $3$ minutes ?", etapes:[
   {q:"Trouver l'intensité", r:"$P = U × I$ donne $I = @f{P}{U} = @f{2200}{230} ≈ 9{,}6$ @u{A}."},
   {q:"Est-ce plausible ?", r:"Oui : les prises domestiques supportent jusqu'à $16$ @u{A}. Une bouilloire est parmi les appareils les plus gourmands de la maison."},
   {q:"Convertir la durée", r:"$3$ minutes $= 3 × 60 = 180$ @u{s}."},
   {q:"Calculer l'énergie", r:"$E = P × Δt = 2200 × 180 = 396 000$ @u{J}, soit environ $4{,}0 × 10^{5}$ @u{J}."},
   {q:"En kilowattheures", r:"$E = @f{396 000}{3{,}6 × 10^{6}} = 0{,}11$ @u{kWh}. À $0{,}20$ € le @u{kWh}, cela coûte environ deux centimes."}
  ]}
 ]},

 {titre:"L'effet Joule : quand l'électricité chauffe", blocs:[
  {t:"idee", x:"Tout conducteur parcouru par un courant **s'échauffe**. Ce phénomène s'appelle l'**effet Joule** : une partie de l'énergie électrique devient de l'énergie thermique, qu'on le veuille ou non."},
  {t:"formule", titre:"Puissance dissipée par effet Joule",
   x:"$P_{Joule} = R × I^2$",
   note:"Cette forme se déduit de $P = U I$ et $U = R I$. L'intensité est **au carré** : elle pèse beaucoup plus lourd que la résistance."},
  {t:"p", x:"Le carré change tout. Doubler l'intensité **quadruple** l'échauffement. C'est pour cette raison que les lignes à haute tension transportent l'électricité sous des centaines de milliers de volts : à puissance transportée égale, une tension élevée signifie une intensité faible, donc des pertes divisées par le carré du facteur gagné."},
  {t:"tbl", head:["Situation","L'effet Joule est…","Pourquoi"], rows:[
   ["Radiateur électrique","**voulu**","C'est exactement ce qu'on cherche : chauffer"],
   ["Grille-pain, bouilloire","**voulu**","Toute l'énergie sert à chauffer"],
   ["Câble d'alimentation","subi","L'énergie perdue ne sert à rien"],
   ["Moteur, téléphone","subi","Il échauffe l'appareil et réduit son rendement"]
  ]},
  {t:"astuce", titre:"Trois écritures d'une même puissance", x:"$P = U I$, $P = R I^2$ et $P = @f{U^2}{R}$ donnent le même résultat pour un conducteur ohmique. Choisis celle dont tu as **les deux données** : c'est ce qui évite un calcul intermédiaire inutile."}
 ]},

 {titre:"Bilan de puissance et rendement", blocs:[
  {t:"p", x:"Un appareil reçoit de l'énergie, en convertit une partie en ce qu'on lui demande, et perd le reste — presque toujours en chaleur. Le **bilan de puissance** décrit ce partage, et le **rendement** le résume en un nombre."},
  {t:"formule", titre:"Rendement d'un appareil",
   x:"$η = @f{P_{utile}}{P_{reçue}}$",
   note:"Sans unité, toujours compris entre 0 et 1. On l'exprime souvent en pourcentage."},
  {t:"fig", titre:"Le bilan de puissance d'un moteur",
   vue:[0,0,10,5], w:430, h:200, grille:false, axes:false,
   objets:[
    {t:"rect", x:3.4, y:1.6, w:3, h:1.9, couleur:"bleu", nom:"moteur"},
    {t:"vec", de:[0.4,2.5], a:[3.2,2.5], couleur:"ambre"},
    {t:"texte", x:1.8, y:3.1, txt:"reçue 1000 W", couleur:"ambre", taille:12},
    {t:"vec", de:[6.6,2.5], a:[9.4,2.5], couleur:"vert"},
    {t:"texte", x:8.1, y:3.1, txt:"utile 750 W", couleur:"vert", taille:12},
    {t:"vec", de:[4.9,1.4], a:[4.9,0.3], couleur:"rouge"},
    {t:"texte", x:6.9, y:0.6, txt:"perdue 250 W", couleur:"rouge", taille:12}
   ],
   note:"Tout ce qui entre ressort : ce qui n'est pas utile est perdu, presque toujours en chaleur."},
  {t:"formule", titre:"La conservation de l'énergie",
   x:"$P_{reçue} = P_{utile} + P_{perdue}$",
   note:"Rien ne se perd vraiment : l'énergie « perdue » est simplement partie sous une forme qui ne nous sert pas."},
  {t:"exemple", titre:"Exemple guidé — le rendement d'un moteur", enonce:"Un moteur reçoit $1000$ @u{W} et fournit $750$ @u{W} de puissance mécanique. Calculer son rendement et la puissance perdue.", etapes:[
   {q:"Le rendement", r:"$η = @f{P_{utile}}{P_{reçue}} = @f{750}{1000} = 0{,}75$, soit $75$ %."},
   {q:"La puissance perdue", r:"$P_{perdue} = P_{reçue} - P_{utile} = 1000 - 750 = 250$ @u{W}."},
   {q:"Sous quelle forme ?", r:"Essentiellement en chaleur, par effet Joule dans les bobinages, et un peu en frottements. C'est pour cela qu'un moteur chauffe."},
   {q:"Le contrôle", r:"Un rendement supérieur à 1 serait impossible : cela signifierait qu'un appareil fournit plus qu'il ne reçoit. Si tu en trouves un, reprends le calcul."}
  ]},
  {t:"piege", titre:"Utile sur reçue, et pas l'inverse", x:"Le rendement met **l'utile au numérateur**. Inverser la fraction donne un nombre supérieur à 1, ce qui n'a aucun sens physique. Ce contrôle repère l'erreur immédiatement."}
 ]},

 {titre:"Récapitulatif", blocs:[
  {t:"tbl", head:["La question ressemble à…","La formule à utiliser"], rows:[
   ["« Quelle énergie consommée ? »","$E = P × Δt$, avec $Δt$ en secondes"],
   ["« Quelle intensité traverse l'appareil ? »","$I = @f{P}{U}$"],
   ["« Quelle tension aux bornes de la résistance ? »","$U = R × I$"],
   ["« Quelle puissance dissipée par effet Joule ? »","$P = R × I^2$"],
   ["« Quel rendement ? »","$η = @f{P_{utile}}{P_{reçue}}$"],
   ["« Combien coûte cette consommation ? »","Passer en @u{kWh}, puis multiplier par le prix"]
  ]},
  {t:"idee", x:"Toute l'énergie reçue se retrouve quelque part : une partie fait ce qu'on demande, le reste chauffe l'air. C'est le seul principe de ce chapitre — tout le reste n'en est que la mise en équations."}
 ]}
],
exos:[
 {id:"el1", niveau:1, type:"num", enonce:"Un appareil branché sous $230$ @u{V} est traversé par une intensité de $2{,}0$ @u{A}. Quelle est sa puissance, en @u{W} ?",
  rep:460, tol:1, unite:"W",
  diag:[{v:115, m:"Tu as divisé la tension par l'intensité : cela donne une résistance en ohms, pas une puissance. La puissance est un **produit** : $P = U × I$."},
        {v:232, m:"Tu as additionné les deux valeurs. Une tension et une intensité ne s'additionnent pas — elles se multiplient pour donner une puissance."},
        {v:0.0087, m:"Tu as divisé l'intensité par la tension. La formule est $P = U × I$."}],
  corr:["La puissance reçue par un dipôle s'écrit $P = U × I$.",
        "$P = 230 × 2{,}0$.",
        "$P = 460$ @u{W}.",
        "Ordre de grandeur plausible : c'est la puissance d'un petit radiateur ou d'un sèche-cheveux."],
  indice:"$P = U × I$ : une multiplication."},

 {id:"el2", niveau:1, type:"num", enonce:"Une lampe de $60$ @u{W} reste allumée pendant $5$ minutes. Quelle énergie a-t-elle consommée, en @u{J} ?",
  rep:18000, tol:10, unite:"J",
  diag:[{v:300, m:"Tu as laissé la durée en minutes. Dans $E = P × Δt$, la durée doit être en **secondes** : $5$ min $= 300$ @u{s}. Ton résultat est 60 fois trop petit."},
        {v:12, m:"Tu as divisé la puissance par la durée. L'énergie est le produit des deux : plus l'appareil reste allumé, plus il consomme."},
        {v:0.005, m:"Tu as inversé la fraction. $E = P × Δt$ est une multiplication."}],
  corr:["L'énergie consommée s'écrit $E = P × Δt$.",
        "Je convertis la durée : $5$ minutes $= 5 × 60 = 300$ @u{s}.",
        "$E = 60 × 300$.",
        "$E = 18 000$ @u{J}, soit $1{,}8 × 10^{4}$ @u{J}."],
  indice:"Convertis la durée en secondes avant de multiplier."},

 {id:"el3", niveau:2, type:"num", enonce:"Une résistance de $20$ @u{Ω} est traversée par une intensité de $1{,}5$ @u{A}. Quelle puissance dissipe-t-elle par effet Joule, en @u{W} ?",
  rep:45, tol:0.5, unite:"W",
  diag:[{v:30, m:"Tu as calculé $R × I$ sans élever l'intensité au carré. La formule est $P = R × I^2$, et $1{,}5^2 = 2{,}25$."},
        {v:13.3, m:"Tu as divisé la résistance par l'intensité. La puissance dissipée est un produit."},
        {v:900, m:"Tu as élevé au carré le produit entier : $(20 × 1{,}5)^2$. Le carré ne porte que sur l'intensité."}],
  corr:["La puissance dissipée par effet Joule s'écrit $P = R × I^2$.",
        "Je calcule d'abord le carré : $1{,}5^2 = 2{,}25$.",
        "$P = 20 × 2{,}25$.",
        "$P = 45$ @u{W}."],
  indice:"Le carré porte uniquement sur l'intensité : calcule-le d'abord."},

 {id:"el4", niveau:2, type:"num", enonce:"Un moteur reçoit une puissance électrique de $800$ @u{W} et fournit $600$ @u{W} de puissance mécanique. Quel est son rendement, en pourcentage ?",
  rep:75, tol:0.5, unite:"%",
  diag:[{v:133, m:"Tu as inversé la fraction. Le rendement met la puissance **utile** au numérateur, et ne dépasse jamais $100$ %."},
        {v:0.75, m:"Le calcul est juste, mais la réponse est demandée en pourcentage : $0{,}75$ correspond à $75$ %."},
        {v:200, m:"$200$ @u{W} est la puissance **perdue** ($800 - 600$), pas le rendement. Le rendement est un rapport, sans unité."}],
  corr:["Le rendement s'écrit $η = @f{P_{utile}}{P_{reçue}}$.",
        "$η = @f{600}{800}$.",
        "$η = 0{,}75$.",
        "Soit $75$ %. Les $25$ % restants, soit $200$ @u{W}, sont perdus en chaleur."],
  indice:"Puissance utile divisée par puissance reçue, puis multiplié par 100."},

 {id:"el5", niveau:2, type:"num", enonce:"Une plaque de cuisson de $2000$ @u{W} fonctionne $45$ minutes. Le @u{kWh} coûte $0{,}20$ €. Combien cela coûte-t-il, en euros ?",
  rep:0.3, tol:0.005, unite:"€",
  diag:[{v:0.4, m:"Tu as compté une heure complète. La plaque fonctionne $45$ minutes, soit $0{,}75$ heure."},
        {v:300, m:"Tu as gardé les watts au lieu de convertir en kilowatts. $2000$ @u{W} $= 2$ @u{kW}."},
        {v:1.5, m:"Tu as calculé l'énergie en @u{kWh} ($1{,}5$) mais oublié de la multiplier par le prix du @u{kWh}."}],
  corr:["Puissance en kilowatts : $2000$ @u{W} $= 2{,}0$ @u{kW}.",
        "Durée en heures : $45$ min $= 0{,}75$ @u{h}.",
        "Énergie : $E = 2{,}0 × 0{,}75 = 1{,}5$ @u{kWh}.",
        "Coût : $1{,}5 × 0{,}20 = 0{,}30$ €."],
  indice:"Le kilowattheure se calcule avec des kilowatts et des heures — pas des watts ni des minutes."},

 {id:"el6", niveau:3, type:"num", enonce:"Une résistance de $50$ @u{Ω} est soumise à une tension de $12$ @u{V}. Quelle intensité la traverse, en @u{A} ?",
  rep:0.24, tol:0.005, unite:"A",
  diag:[{v:600, m:"Tu as multiplié la tension par la résistance. La loi d'Ohm s'écrit $U = R × I$ : pour trouver $I$, il faut **diviser** $U$ par $R$."},
        {v:4.17, m:"Tu as divisé la résistance par la tension. C'est l'inverse : $I = @f{U}{R}$."},
        {v:2.4, m:"Erreur d'un facteur 10 : $@f{12}{50} = 0{,}24$, et non $2{,}4$."}],
  corr:["Loi d'Ohm : $U = R × I$.",
        "J'isole l'intensité : $I = @f{U}{R}$.",
        "$I = @f{12}{50}$.",
        "$I = 0{,}24$ @u{A}, soit $240$ @u{mA}."],
  indice:"Isole $I$ dans $U = R × I$ avant de remplacer."},

 {id:"el7", niveau:3, type:"qcm", enonce:"Pourquoi transporte-t-on l'électricité sous très haute tension sur les lignes ?",
  choix:["Parce qu'à puissance égale, une tension élevée donne une intensité faible, donc moins de pertes par effet Joule",
         "Parce que la haute tension va plus vite",
         "Parce que les pertes augmentent avec la tension","Parce que cela permet d'augmenter la résistance des câbles"], bonne:0,
  diag:["",
        "L'électricité se propage à la même vitesse quelle que soit la tension. Ce n'est pas une question de rapidité.",
        "C'est l'inverse : à puissance transportée constante, augmenter la tension **réduit** l'intensité, et donc les pertes.",
        "Augmenter la résistance des câbles augmenterait les pertes. On cherche au contraire à les minimiser."],
  corr:["Les pertes dans un câble valent $P_{Joule} = R × I^2$ : elles dépendent de l'intensité, au carré.",
        "Or la puissance transportée vaut $P = U × I$ : à puissance fixée, augmenter $U$ diminue $I$ d'autant.",
        "Une intensité divisée par 100 divise les pertes par $100^2 = 10 000$.",
        "C'est pourquoi les lignes fonctionnent sous $400 000$ @u{V} plutôt que sous $230$ @u{V}."],
  indice:"Regarde de quelle grandeur dépendent les pertes, et à quelle puissance."},

 {id:"el8", niveau:3, type:"num", enonce:"Un chauffe-eau de $2400$ @u{W} a un rendement de $90$ %. Quelle puissance sert réellement à chauffer l'eau, en @u{W} ?",
  rep:2160, tol:5, unite:"W",
  diag:[{v:2667, m:"Tu as divisé par le rendement au lieu de multiplier. La puissance utile est forcément **inférieure** à la puissance reçue."},
        {v:240, m:"$240$ @u{W} est la puissance **perdue** ($10$ % de $2400$). La question porte sur la puissance utile, soit les $90$ % restants."},
        {v:216, m:"Erreur d'un facteur 10 : $2400 × 0{,}90 = 2160$, pas $216$."}],
  corr:["Le rendement s'écrit $η = @f{P_{utile}}{P_{reçue}}$.",
        "J'isole : $P_{utile} = η × P_{reçue}$.",
        "$P_{utile} = 0{,}90 × 2400$.",
        "$P_{utile} = 2160$ @u{W}. Les $240$ @u{W} restants s'échappent par les parois."],
  indice:"La puissance utile est une fraction de la puissance reçue : multiplie par le rendement."}
]
},

/* ======== 10. TRAVAIL ET ÉNERGIE MÉCANIQUE ======== */
{
id:"mecanique", n:10, titre:"Travail et énergie mécanique",
sous:"Compter l'énergie plutôt que suivre le mouvement",
desc:"Travail d'une force, énergie cinétique, énergie potentielle de pesanteur, conservation de l'énergie mécanique.",
duree:40,
sections:[
 {titre:"Le travail d'une force", blocs:[
  {t:"idee", x:"Une force ne « donne » de l'énergie à un objet que si celui-ci **se déplace**. Le **travail** mesure l'énergie transférée par une force au cours d'un déplacement."},
  {t:"p", x:"Le mot est trompeur : tenir un sac lourd à bout de bras fatigue énormément, mais si le sac ne bouge pas, le travail de la force est **nul** au sens de la physique. Sans déplacement, pas de transfert d'énergie."},
  {t:"formule", titre:"Travail d'une force constante",
   x:"$W = F × d × cos(α)$",
   note:"$W$ en @u{J} · $F$ en @u{N} · $d$ en @u{m} · $α$ est l'angle entre la force et le déplacement."},
  {t:"tbl", head:["Angle $α$","$cos(α)$","Travail","Nom"], rows:[
   ["$0°$ (force dans le sens du mouvement)","$1$","$W = F × d$, positif","**moteur**"],
   ["$90°$ (force perpendiculaire)","$0$","$W = 0$","nul"],
   ["$180°$ (force opposée au mouvement)","$-1$","$W = -F × d$, négatif","**résistant**"]
  ]},
  {t:"p", x:"Ces trois lignes suffisent presque toujours. Un travail **moteur** apporte de l'énergie à l'objet, qui accélère. Un travail **résistant** lui en retire, il ralentit — c'est le cas des frottements, toujours opposés au mouvement. Et une force perpendiculaire au déplacement ne transfère rien du tout : c'est pour cela que la réaction d'un support horizontal ne travaille jamais."},
  {t:"exemple", titre:"Exemple guidé — trois travaux à comparer", enonce:"Une caisse de $20$ @u{kg} est tirée horizontalement sur $5{,}0$ @u{m} par une force horizontale de $80$ @u{N}. Une force de frottement de $30$ @u{N} s'y oppose. Calculer le travail de chaque force. On prend $g = 9{,}81$ @u{N/kg}.", etapes:[
   {q:"La force de traction", r:"Elle est dans le sens du déplacement, donc $α = 0°$ : $W = 80 × 5{,}0 × 1 = 400$ @u{J}. Travail moteur."},
   {q:"Le frottement", r:"Il est opposé au déplacement, donc $α = 180°$ : $W = 30 × 5{,}0 × (-1) = -150$ @u{J}. Travail résistant."},
   {q:"Le poids", r:"Il est vertical, le déplacement est horizontal : $α = 90°$, donc $W = 0$ @u{J}. Le poids ne travaille pas ici."},
   {q:"La réaction du sol", r:"Perpendiculaire au déplacement elle aussi : $W = 0$ @u{J}."},
   {q:"Le bilan", r:"Travail total : $400 - 150 = 250$ @u{J}. C'est l'énergie réellement apportée à la caisse, qui va donc accélérer."}
  ]}
 ]},

 {titre:"L'énergie cinétique : celle du mouvement", blocs:[
  {t:"formule", titre:"Énergie cinétique",
   x:"$E_c = @f{1}{2} × m × v^2$",
   note:"$E_c$ en @u{J} · $m$ en @u{kg} · $v$ en @u{m/s}. La vitesse est **au carré** : c'est ce qui rend cette formule si importante."},
  {t:"p", x:"Le carré de la vitesse a une conséquence que tout conducteur devrait connaître : rouler deux fois plus vite ne double pas l'énergie à dissiper au freinage, il la **quadruple**. À $100$ @u{km/h}, une voiture emporte quatre fois plus d'énergie qu'à $50$ @u{km/h} — d'où des distances de freinage quatre fois plus longues, et des chocs incomparablement plus violents."},
  {t:"fig", titre:"L'énergie cinétique croît comme le carré de la vitesse",
   vue:[0,0,5.4,1.15], w:400, h:250, libre:true, grille:false, axes:false,
   objets:[
    {t:"axes", x0:0, y0:0, ax:"vitesse v", ay:"Ec"},
    {t:"courbeXY", couleur:"bleu", pts:[[0,0],[0.5,0.01],[1,0.04],[1.5,0.09],[2,0.16],[2.5,0.25],[3,0.36],[3.5,0.49],[4,0.64],[4.5,0.81],[5,1.0]]},
    {t:"seg", de:[2.5,0], a:[2.5,0.25], couleur:"line2", pointille:true},
    {t:"seg", de:[5,0], a:[5,1.0], couleur:"line2", pointille:true},
    {t:"texte", x:2.5, y:0.33, txt:"v", couleur:"ink3"},
    {t:"texte", x:4.55, y:1.07, txt:"2v → 4 fois plus", couleur:"rouge", taille:12}
   ],
   note:"La courbe s'envole : c'est pourquoi les excès de vitesse sont si dangereux."},
  {t:"formule", titre:"Théorème de l'énergie cinétique",
   x:"$ΔE_c = Σ W$",
   note:"La variation d'énergie cinétique est égale à la somme des travaux de toutes les forces."},
  {t:"p", x:"Ce théorème est un outil de comptable : il ne demande pas de suivre le mouvement instant par instant, seulement de comparer un état de départ et un état d'arrivée. Beaucoup de problèmes qui paraissent compliqués s'y résolvent en trois lignes."},
  {t:"check", q:"Une voiture roule deux fois plus vite. Par combien son énergie cinétique est-elle multipliée ?",
   choix:["4","2","8","1, elle ne change pas"], bonne:0,
   expl:["Exact : la vitesse est au carré dans $E_c = @f{1}{2}mv^2$. Doubler $v$ multiplie $v^2$ par $2^2 = 4$.",
         "Ce serait le cas si la vitesse intervenait simplement, sans carré. Or elle est élevée au carré.",
         "8 correspondrait au cube de 2. La formule fait intervenir un carré, pas un cube.",
         "L'énergie cinétique dépend directement de la vitesse : elle change forcément."]}
 ]},

 {titre:"L'énergie potentielle de pesanteur : celle de la hauteur", blocs:[
  {t:"formule", titre:"Énergie potentielle de pesanteur",
   x:"$E_{pp} = m × g × z$",
   note:"$z$ est l'altitude, mesurée à partir d'une origine que **l'on choisit**. Seules les différences d'altitude comptent."},
  {t:"p", x:"Cette énergie est dite « potentielle » parce qu'elle est en réserve : un objet en hauteur ne possède aucune énergie de mouvement, mais il en acquerra dès qu'on le lâchera. L'énergie est là, en attente."},
  {t:"astuce", titre:"L'origine des altitudes se choisit librement", x:"On peut placer le zéro au sol, sur la table, ou à n'importe quelle hauteur : cela change la valeur de $E_{pp}$, mais **jamais** sa variation entre deux points. Comme seules les variations interviennent dans les bilans, on choisit toujours l'origine qui simplifie les calculs — en général le point le plus bas."}
 ]},

 {titre:"L'énergie mécanique et sa conservation", blocs:[
  {t:"idee", x:"L'**énergie mécanique** est la somme des deux précédentes. En l'absence de frottements, elle **ne change pas** : l'énergie passe d'une forme à l'autre sans jamais se perdre."},
  {t:"formule", titre:"Énergie mécanique", x:"$E_m = E_c + E_{pp}$", note:"Sans frottements : $E_m$ est constante. Avec frottements : elle diminue."},
  {t:"fig", titre:"Une bille qui descend : l'énergie change de forme",
   vue:[0,0,10,5.5], w:440, h:250, grille:false, axes:false,
   objets:[
    {t:"courbeXY", couleur:"ink3", epais:3, pts:[[0.6,4.6],[1.6,4.3],[2.6,3.5],[3.6,2.4],[4.6,1.4],[5.6,0.8],[7,0.6],[9,0.6]]},
    {t:"cercle", c:[0.9,4.75], r:0.22, couleur:"bleu", remplir:true},
    {t:"cercle", c:[8.2,0.82], r:0.22, couleur:"bleu", remplir:true},
    {t:"seg", de:[0.6,0.6], a:[9.4,0.6], couleur:"line2", pointille:true},
    {t:"vec", de:[1.3,4.6], a:[1.3,0.7], couleur:"ambre"},
    {t:"texte", x:2.2, y:2.7, txt:"hauteur h", couleur:"ambre", taille:12},
    {t:"texte", x:1.1, y:5.2, txt:"Ec = 0, Epp max", couleur:"vert", taille:11.5},
    {t:"texte", x:8.1, y:1.5, txt:"Ec max, Epp = 0", couleur:"vert", taille:11.5}
   ],
   note:"En haut, toute l'énergie est en réserve. En bas, elle est entièrement passée en mouvement."},
  {t:"exemple", titre:"Exemple guidé — la vitesse au bas d'une pente", enonce:"Une bille part sans vitesse d'une hauteur $h = 1{,}8$ @u{m} et glisse sans frottement. Quelle est sa vitesse en bas ? On prend $g = 9{,}81$ @u{N/kg}.", etapes:[
   {q:"Choisir l'origine des altitudes", r:"Je la place en bas : ainsi $E_{pp} = 0$ à l'arrivée, ce qui simplifie tout."},
   {q:"Écrire l'énergie mécanique au départ", r:"La bille est immobile : $E_c = 0$. Donc $E_m = E_{pp} = m g h$."},
   {q:"Écrire l'énergie mécanique à l'arrivée", r:"L'altitude est nulle : $E_{pp} = 0$. Donc $E_m = E_c = @f{1}{2} m v^2$."},
   {q:"Égaler, puisqu'il n'y a pas de frottement", r:"$@f{1}{2} m v^2 = m g h$. La masse se simplifie des deux côtés — la vitesse ne dépend donc pas de la masse !"},
   {q:"Isoler la vitesse", r:"$v^2 = 2 g h = 2 × 9{,}81 × 1{,}8 ≈ 35{,}3$, donc $v = @r{35{,}3} ≈ 5{,}9$ @u{m/s}."},
   {q:"Ce qu'il faut retenir", r:"La masse disparaît du résultat : une bille lourde et une bille légère arrivent en bas à la même vitesse. C'est l'expérience de Galilée, retrouvée par un simple bilan d'énergie."}
  ]},
  {t:"formule", titre:"Le raccourci de la chute libre", x:"$v = @r{2 g h}$", note:"Valable pour un objet parti sans vitesse initiale, sans frottement. La masse n'intervient pas."}
 ]},

 {titre:"Quand les frottements entrent en jeu", blocs:[
  {t:"p", x:"Dans la réalité, l'énergie mécanique diminue toujours un peu : les frottements en convertissent une partie en chaleur. Cette énergie n'est pas détruite — elle a simplement quitté le domaine mécanique."},
  {t:"formule", titre:"Bilan avec frottements",
   x:"$E_{m,final} - E_{m,initial} = W_{frottements}$",
   note:"Ce travail est toujours **négatif** : les frottements retirent de l'énergie au système."},
  {t:"exemple", titre:"Exemple guidé — combien les frottements ont-ils pris ?", enonce:"Un skieur de $70$ @u{kg} descend $20$ @u{m} de dénivelé et arrive à $15$ @u{m/s}. Il partait sans vitesse. Quelle énergie les frottements ont-ils dissipée ? On prend $g = 9{,}81$ @u{N/kg}.", etapes:[
   {q:"L'énergie disponible au départ", r:"$E_{pp} = m g h = 70 × 9{,}81 × 20 ≈ 13 700$ @u{J}."},
   {q:"L'énergie de mouvement à l'arrivée", r:"$E_c = @f{1}{2} m v^2 = 0{,}5 × 70 × 15^2 = 0{,}5 × 70 × 225 ≈ 7 900$ @u{J}."},
   {q:"Comparer", r:"Il manque $13 700 - 7 900 = 5 800$ @u{J} : l'énergie mécanique a diminué."},
   {q:"Conclure", r:"Ces $5{,}8$ @u{kJ} ont été dissipés par les frottements de la neige et de l'air, sous forme de chaleur."},
   {q:"Le contrôle", r:"Sans frottement, il serait arrivé à $v = @r{2 × 9{,}81 × 20} ≈ 19{,}8$ @u{m/s}. Il n'atteint que $15$ @u{m/s} : cohérent avec des frottements bien réels."}
  ]},
  {t:"piege", titre:"L'énergie ne disparaît jamais", x:"Dire « l'énergie a été perdue » est un raccourci de langage. Elle a été **convertie** en chaleur, en bruit, en usure. Le principe de conservation de l'énergie n'est jamais mis en défaut : c'est seulement l'énergie **mécanique** qui diminue."}
 ]},

 {titre:"Récapitulatif", blocs:[
  {t:"tbl", head:["La question ressemble à…","Ce qu'il faut faire"], rows:[
   ["« Travail de cette force ? »","$W = F d cos(α)$ ; regarder l'angle avant tout"],
   ["« Le poids travaille-t-il ? »","Non si le déplacement est horizontal"],
   ["« Vitesse en bas d'une pente sans frottement ? »","$v = @r{2gh}$, la masse n'intervient pas"],
   ["« Énergie dissipée par les frottements ? »","$E_{m,final} - E_{m,initial}$, résultat négatif"],
   ["« La vitesse double, et l'énergie ? »","Multipliée par 4"]
  ]},
  {t:"liste", items:[
   "**La méthode énergétique évite de suivre le mouvement** : on compare seulement un état de départ et un état d'arrivée.",
   "**Sans frottement**, $E_m$ se conserve : ce que l'on perd en hauteur, on le gagne en vitesse.",
   "**Avec frottement**, $E_m$ diminue, et la différence mesure exactement l'énergie dissipée."
  ]},
  {t:"idee", x:"En haut d'une pente, l'énergie est en réserve. En bas, elle est en mouvement. Entre les deux, rien ne s'est créé ni perdu — tout s'est transformé."}
 ]}
],
exos:[
 {id:"mc1", niveau:1, type:"num", enonce:"Quelle est l'énergie cinétique d'une voiture de $1200$ @u{kg} roulant à $20$ @u{m/s} ? Réponds en @u{kJ}.",
  rep:240, tol:1, unite:"kJ",
  diag:[{v:12000, m:"Tu as oublié d'élever la vitesse au carré, ou de multiplier par $@f{1}{2}$. La formule est $E_c = @f{1}{2}mv^2$."},
        {v:480, m:"Tu as oublié le facteur $@f{1}{2}$. $E_c = 0{,}5 × 1200 × 400 = 240 000$ @u{J}."},
        {v:240000, m:"C'est le bon résultat, mais en joules. La question demande des kilojoules : $240 000$ @u{J} $= 240$ @u{kJ}."}],
  corr:["Formule : $E_c = @f{1}{2} m v^2$.",
        "Je calcule d'abord le carré : $20^2 = 400$.",
        "$E_c = 0{,}5 × 1200 × 400 = 240 000$ @u{J}.",
        "Soit $240$ @u{kJ}."],
  indice:"Élève d'abord la vitesse au carré, puis n'oublie pas le facteur $@f{1}{2}$ — et convertis en @u{kJ}."},

 {id:"mc2", niveau:1, type:"num", enonce:"Un sac de $5{,}0$ @u{kg} est monté de $3{,}0$ @u{m}. De combien son énergie potentielle de pesanteur augmente-t-elle, en @u{J} ? On prend $g = 9{,}81$ @u{N/kg}.",
  rep:147, tol:1, unite:"J",
  diag:[{v:15, m:"Tu as multiplié la masse par la hauteur en oubliant $g$. La formule est $E_{pp} = m × g × z$."},
        {v:1.7, m:"Tu as divisé au lieu de multiplier. L'énergie potentielle est un produit des trois grandeurs."},
        {v:49, m:"Tu as oublié un facteur : $5{,}0 × 9{,}81 = 49$, il reste à multiplier par la hauteur $3{,}0$ @u{m}."}],
  corr:["Formule : $E_{pp} = m × g × z$.",
        "$E_{pp} = 5{,}0 × 9{,}81 × 3{,}0$.",
        "$E_{pp} ≈ 147$ @u{J}.",
        "C'est exactement l'énergie qu'il faudra fournir pour le monter — et celle qu'il restituera en tombant."],
  indice:"Trois facteurs à multiplier : la masse, $g$, et la hauteur."},

 {id:"mc3", niveau:2, type:"num", enonce:"Une caisse est tirée sur $8{,}0$ @u{m} par une force horizontale de $50$ @u{N}, dans le sens du déplacement. Quel est le travail de cette force, en @u{J} ?",
  rep:400, tol:1, unite:"J",
  diag:[{v:6.25, m:"Tu as divisé la force par la distance. Le travail est un produit : $W = F × d$ quand la force est dans le sens du déplacement."},
        {v:58, m:"Tu as additionné force et distance. Ces deux grandeurs ne s'additionnent pas : elles se multiplient."},
        {v:-400, m:"Le signe est faux. La force est **dans le sens** du déplacement : l'angle vaut $0°$, son cosinus vaut $+1$, le travail est moteur donc positif."}],
  corr:["La force est parallèle au déplacement et de même sens : $α = 0°$, donc $cos(α) = 1$.",
        "$W = F × d × cos(α) = F × d$.",
        "$W = 50 × 8{,}0$.",
        "$W = 400$ @u{J}. Travail moteur : la force apporte de l'énergie à la caisse."],
  indice:"Force dans le sens du déplacement : le cosinus vaut 1."},

 {id:"mc4", niveau:2, type:"qcm", enonce:"Une personne porte une valise à bout de bras et marche horizontalement sur $20$ @u{m}. Quel est le travail de la force qu'elle exerce verticalement sur la valise ?",
  choix:["Nul, car la force est perpendiculaire au déplacement","Positif, car elle se fatigue","Négatif, car elle lutte contre le poids","Impossible à dire sans connaître la masse"], bonne:0,
  diag:["",
        "La fatigue physiologique n'est pas le travail au sens de la physique. Les muscles se contractent en permanence et consomment de l'énergie, mais aucune énergie n'est transférée **à la valise**, qui ne monte ni ne descend.",
        "Elle lutte bien contre le poids, mais sans déplacement vertical : l'énergie transférée à la valise est nulle. Un travail résistant supposerait un déplacement opposé à la force.",
        "La masse n'y change rien : quel que soit son poids, l'angle reste de $90°$ et le cosinus reste nul."],
  corr:["La force exercée est verticale, dirigée vers le haut.",
        "Le déplacement est horizontal.",
        "L'angle entre les deux vaut $90°$, et $cos(90°) = 0$.",
        "Le travail est donc nul : aucune énergie n'est transférée à la valise, qui reste à la même hauteur."],
  indice:"Regarde l'angle entre la direction de la force et celle du déplacement."},

 {id:"mc5", niveau:2, type:"num", enonce:"Une bille est lâchée sans vitesse d'une hauteur de $5{,}0$ @u{m}, sans frottement. Quelle est sa vitesse en arrivant au sol, en @u{m/s} ? On prend $g = 9{,}81$ @u{N/kg}.",
  rep:9.9, tol:0.15, unite:"m/s",
  diag:[{v:49.05, m:"Tu as calculé $g × h$ sans multiplier par 2 ni prendre la racine. La formule est $v = @r{2 g h}$."},
        {v:98.1, m:"Tu as calculé $2 g h$ mais oublié la racine carrée. Ce résultat est $v^2$, pas $v$."},
        {v:7, m:"Tu as pris la racine de $2h$ ou d'une autre combinaison. Reprends : $2 × 9{,}81 × 5{,}0 = 98{,}1$, puis $@r{98{,}1} ≈ 9{,}9$."}],
  corr:["Sans frottement, l'énergie mécanique se conserve : $@f{1}{2} m v^2 = m g h$.",
        "La masse se simplifie : $v^2 = 2 g h$.",
        "$v^2 = 2 × 9{,}81 × 5{,}0 = 98{,}1$.",
        "$v = @r{98{,}1} ≈ 9{,}9$ @u{m/s}, soit environ $36$ @u{km/h}."],
  indice:"$v = @r{2gh}$ — n'oublie pas la racine carrée à la fin."},

 {id:"mc6", niveau:3, type:"num", enonce:"Un skieur de $60$ @u{kg} descend $15$ @u{m} de dénivelé en partant sans vitesse, et arrive à $12$ @u{m/s}. Quelle énergie a été dissipée par les frottements, en @u{J} ? On prend $g = 9{,}81$ @u{N/kg}.",
  rep:4509, tol:30, unite:"J",
  diag:[{v:8829, m:"$8829$ @u{J} est l'énergie potentielle de départ. Il faut lui retrancher l'énergie cinétique effectivement acquise à l'arrivée."},
        {v:4320, m:"$4320$ @u{J} est l'énergie cinétique à l'arrivée. La question porte sur ce qui **manque** par rapport à l'énergie de départ."},
        {v:13149, m:"Tu as additionné les deux énergies au lieu de les soustraire. L'énergie dissipée est la différence entre celle de départ et celle d'arrivée."}],
  corr:["Énergie au départ : $E_{pp} = m g h = 60 × 9{,}81 × 15 ≈ 8829$ @u{J}, avec $E_c = 0$.",
        "Énergie à l'arrivée : $E_c = @f{1}{2} m v^2 = 0{,}5 × 60 × 144 = 4320$ @u{J}, avec $E_{pp} = 0$.",
        "L'énergie mécanique a diminué de $8829 - 4320 = 4509$ @u{J}.",
        "Cette différence a été dissipée par les frottements, sous forme de chaleur."],
  indice:"Compare l'énergie mécanique au départ et à l'arrivée : la différence est ce qu'ont pris les frottements."},

 {id:"mc7", niveau:3, type:"qcm", enonce:"Deux billes de masses différentes sont lâchées de la même hauteur, sans frottement. Laquelle arrive le plus vite en bas ?",
  choix:["Les deux arrivent à la même vitesse","La plus lourde","La plus légère","Cela dépend de leur forme"], bonne:0,
  diag:["",
        "La bille lourde possède bien plus d'énergie potentielle — mais il lui en faut aussi davantage pour atteindre une vitesse donnée. Les deux effets se compensent exactement : la masse se simplifie dans le calcul.",
        "La bille légère a moins d'énergie potentielle, mais elle a aussi besoin de moins d'énergie pour aller vite. Là encore, tout se compense.",
        "La forme intervient dès qu'il y a des frottements avec l'air. Ici l'énoncé précise qu'il n'y en a pas."],
  corr:["Conservation de l'énergie mécanique : $@f{1}{2} m v^2 = m g h$.",
        "La masse $m$ apparaît **des deux côtés** de l'égalité.",
        "Elle se simplifie : $v^2 = 2 g h$.",
        "La vitesse finale ne dépend que de la hauteur : les deux billes arrivent à la même vitesse. C'est ce que Galilée aurait montré du haut de la tour de Pise."],
  indice:"Écris la conservation de l'énergie et regarde si la masse survit à la simplification."},

 {id:"mc8", niveau:3, type:"num", enonce:"Une caisse est tirée sur $10$ @u{m} par une force de $60$ @u{N} dans le sens du mouvement, contre un frottement de $25$ @u{N}. De combien varie son énergie cinétique, en @u{J} ?",
  rep:350, tol:5, unite:"J",
  diag:[{v:600, m:"Tu n'as compté que la force de traction. Le théorème de l'énergie cinétique fait intervenir la somme des travaux de **toutes** les forces, frottement compris."},
        {v:850, m:"Tu as additionné les deux travaux sans tenir compte du signe. Le frottement s'oppose au mouvement : son travail est **négatif**."},
        {v:250, m:"Tu as soustrait les forces avant de multiplier, mais avec une erreur de calcul : $60 - 25 = 35$, puis $35 × 10 = 350$."}],
  corr:["Travail de la traction : $W_1 = 60 × 10 = 600$ @u{J}, moteur donc positif.",
        "Travail du frottement : $W_2 = -25 × 10 = -250$ @u{J}, résistant donc négatif.",
        "Théorème de l'énergie cinétique : $ΔE_c = W_1 + W_2$.",
        "$ΔE_c = 600 - 250 = 350$ @u{J} : la caisse accélère."],
  indice:"Additionne les travaux en respectant leur signe : le frottement travaille négativement."}
]
}

]);
