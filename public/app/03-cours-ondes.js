/* =====================================================================
   Programme — Spécialité physique-chimie, classe de Première générale
   Partie « Ondes et signaux »
   ===================================================================== */
window.COURS = (window.COURS || []).concat([

/* ============= 11. LES ONDES MÉCANIQUES ============= */
{
id:"ondes", n:11, titre:"Les ondes mécaniques",
sous:"Ce qui se propage sans rien emporter",
desc:"Propagation, célérité, retard, période, fréquence, longueur d'onde et propriétés du son.",
duree:35,
sections:[
 {titre:"Une onde transporte de l'énergie, pas de la matière", blocs:[
  {t:"idee", x:"Une **onde** est une perturbation qui se propage de proche en proche. Elle transporte de l'**énergie** et de l'**information**, mais **pas de matière** : le milieu, lui, revient à sa position de départ."},
  {t:"p", x:"L'exemple le plus parlant est le bouchon de pêche. Une vague arrive, le bouchon monte, redescend — et reste exactement au même endroit. La vague, elle, a continué son chemin. Ce qui voyage, c'est la déformation, pas l'eau."},
  {t:"p", x:"Même chose dans un stade : la « ola » traverse les tribunes à vive allure, alors qu'aucun spectateur ne change de place. Chacun se lève, s'assoit, et c'est tout. Le mouvement d'ensemble n'existe que parce que chacun imite son voisin avec un léger retard — et ce retard est précisément ce qui fait la propagation."},
  {t:"tbl", head:["Type d'onde","Le milieu bouge…","Exemple"], rows:[
   ["**Transversale**","perpendiculairement à la propagation","vague, corde secouée"],
   ["**Longitudinale**","dans la direction de la propagation","son, ressort comprimé"]
  ]},
  {t:"piege", titre:"Une onde mécanique a besoin d'un milieu", x:"Le son ne se propage pas dans le vide : il lui faut de la matière à bousculer. C'est pourquoi il n'y a aucun bruit dans l'espace — contrairement à ce que montrent les films. La lumière, elle, n'est pas une onde mécanique et traverse le vide sans difficulté."}
  ,{t:"mots", items:[
   ["Onde","Une perturbation qui se propage de proche en proche. Elle transporte de l'énergie, jamais de la matière."],
   ["Célérité ($v$, en @u{m/s})","La vitesse de propagation de l'onde. Elle ne dépend que du **milieu** traversé, pas de la source."],
   ["Retard ($τ$, en @u{s})","Le temps que met l'onde pour aller d'un point à un autre : $τ = @f{d}{v}$."],
   ["Période ($T$, en @u{s})","La durée d'un motif, la durée au bout de laquelle tout se répète."],
   ["Fréquence ($f$, en @u{Hz})","Le nombre de motifs par seconde. C'est l'inverse de la période."],
   ["Longueur d'onde ($λ$, en @u{m})","La distance entre deux motifs identiques : entre deux crêtes, par exemple."],
   ["Amplitude","La hauteur de la perturbation. Pour un son, c'est le volume — et cela n'a rien à voir avec la fréquence."]
  ]}
 ]},

 {titre:"Célérité et retard", blocs:[
  {t:"formule", titre:"Célérité d'une onde",
   x:"$v = @f{d}{Δt}$",
   note:"$v$ en @u{m/s} · $d$ la distance parcourue en @u{m} · $Δt$ la durée en @u{s}. On dit « célérité » plutôt que « vitesse » pour rappeler qu'aucune matière ne se déplace."},
  {t:"formule", titre:"Retard entre deux points",
   x:"$τ = @f{d}{v}$",
   note:"Le retard $τ$ est le temps que met l'onde pour aller d'un point à l'autre."},
  {t:"tbl", head:["Milieu","Célérité du son"], rows:[
   ["Air ($20$ @u{°C})","$≈ 340$ @u{m/s}"],
   ["Eau","$≈ 1500$ @u{m/s}"],
   ["Acier","$≈ 5000$ @u{m/s}"],
   ["Vide","le son ne s'y propage pas"]
  ]},
  {t:"p", x:"Contrairement à l'intuition, **le son va plus vite dans les solides que dans l'air**. C'est logique quand on y pense : plus les entités du milieu sont proches et liées, plus vite chacune transmet la bousculade à sa voisine. Les Indiens d'Amérique qui collaient l'oreille au rail entendaient le train bien avant les autres — pour cette raison exacte."},
  {t:"exemple", titre:"Exemple guidé — à quelle distance est tombée la foudre ?", enonce:"On voit un éclair, puis on entend le tonnerre $3{,}0$ @u{s} plus tard. À quelle distance l'éclair est-il tombé ? On prend $v_{son} = 340$ @u{m/s}.", etapes:[
   {q:"Pourquoi ce décalage ?", r:"La lumière parcourt quelques kilomètres en quelques microsecondes : on peut considérer qu'on la voit instantanément. Le son, bien plus lent, arrive nettement après."},
   {q:"Écrire la relation", r:"$v = @f{d}{Δt}$, donc $d = v × Δt$."},
   {q:"Remplacer", r:"$d = 340 × 3{,}0$."},
   {q:"Calculer", r:"$d = 1020$ @u{m}, soit environ un kilomètre."},
   {q:"Le raccourci de terrain", r:"Trois secondes pour environ un kilomètre. C'est la règle que retiennent les randonneurs pour estimer si l'orage se rapproche."}
  ]},
  {t:"astuce", titre:"Vérifier une célérité par son ordre de grandeur", x:"Si un calcul te donne une célérité du son de $34$ ou de $3400$ @u{m/s} dans l'air, c'est qu'une puissance de dix s'est perdue. Dans l'air, la réponse doit tourner autour de $340$ @u{m/s}."}
 ]},

 {titre:"Ondes périodiques : période, fréquence, longueur d'onde", blocs:[
  {t:"idee", x:"Quand la perturbation se répète identique à elle-même, l'onde est **périodique**. Elle possède alors une période dans le temps, et une période dans l'espace."},
  {t:"formule", titre:"Période et fréquence",
   x:"$f = @f{1}{T}$",
   note:"$T$ en @u{s} : la durée d'un motif. $f$ en @u{Hz} : le nombre de motifs par seconde. Les deux sont inverses l'une de l'autre."},
  {t:"formule", titre:"La relation centrale du chapitre",
   x:"$λ = v × T = @f{v}{f}$",
   note:"$λ$ (lambda) est la **longueur d'onde**, en @u{m} : la distance parcourue par l'onde pendant une période."},
  {t:"p", x:"Cette formule dit une chose simple. Pendant qu'une source effectue une oscillation complète (durée $T$), l'onde a le temps de parcourir une distance $v × T$. Cette distance est justement l'espace qui sépare deux crêtes : la longueur d'onde. Rien de plus."},
  {t:"figi", nom:"onde"},
  {t:"p", x:"Sur cette figure, fais varier la longueur d'onde et regarde la fréquence changer. Fais ensuite varier l'amplitude : la fréquence, elle, ne bouge pas. C'est exactement ce qui distingue, pour un son, la **hauteur** de la note (fréquence) de son **volume** (amplitude). Chanter plus fort ne fait pas chanter plus aigu."},
  {t:"tbl", head:["Grandeur","Symbole","Unité","Ce qu'elle mesure"], rows:[
   ["Période","$T$","@u{s}","La durée d'un motif"],
   ["Fréquence","$f$","@u{Hz}","Le nombre de motifs par seconde"],
   ["Longueur d'onde","$λ$","@u{m}","La distance entre deux motifs"],
   ["Célérité","$v$","@u{m/s}","La vitesse de propagation"],
   ["Amplitude","—","selon le cas","L'intensité de la perturbation"]
  ]},
  {t:"piege", titre:"La célérité ne dépend pas de la fréquence", x:"Changer la fréquence d'un son ne change **pas** sa vitesse dans l'air : les graves et les aigus arrivent en même temps — sinon un orchestre entendu de loin serait inaudible. Ce qui change, c'est la longueur d'onde : $λ = @f{v}{f}$. La célérité, elle, ne dépend que du **milieu**."}
  ,{t:"methode", titre:"Choisir la bonne relation, sans se tromper", etapes:[
   "**Écrire les données avec leur unité.** C'est l'unité qui trahit la grandeur : des @u{Hz} → une fréquence, des @u{m} → une longueur d'onde, des @u{s} → une période ou un retard.",
   "**Écrire ce qui est cherché**, avec son unité elle aussi.",
   "**Choisir la relation qui contient les deux** : $λ = @f{v}{f}$ relie longueur d'onde et fréquence ; $f = @f{1}{T}$ relie fréquence et période ; $d = v × Δt$ relie distance et durée.",
   "**Isoler l'inconnue avant de remplacer** par les nombres. C'est plus sûr que de manipuler les chiffres directement.",
   "**Contrôler par les unités** : des @u{m/s} divisés par des @u{Hz} donnent bien des mètres. Si l'unité ne tombe pas juste, la formule est à l'envers."
  ], exemple:"« $f = 850$ @u{Hz}, $v = 340$ @u{m/s}, trouver $λ$ » : la relation qui contient $λ$, $v$ et $f$ est $λ = @f{v}{f}$, donc $λ = @f{340}{850} = 0{,}40$ @u{m}. Contrôle : @u{m/s} ÷ @u{Hz} = @u{m}. C'est bien une longueur."}

  ,{t:"exemple", titre:"Exemple guidé — un aller-retour à ne pas oublier", enonce:"Une chauve-souris émet un cri et perçoit son écho $30$ @u{ms} plus tard. À quelle distance se trouve l'obstacle ? On prend $v = 340$ @u{m/s}.", etapes:[
   {q:"Quelle distance le son a-t-il parcourue ?", r:"$d = v × Δt = 340 × 0{,}030 = 10{,}2$ @u{m}. Attention : $30$ @u{ms} valent $0{,}030$ @u{s}."},
   {q:"Est-ce la réponse ?", r:"Non. Le son est allé jusqu'à l'obstacle **et** en est revenu. Ces $10{,}2$ @u{m} comptent les deux trajets."},
   {q:"La distance à l'obstacle", r:"C'est la moitié : $@f{10{,}2}{2} = 5{,}1$ @u{m}."},
   {q:"Le réflexe à garder", r:"Dès qu'un énoncé parle d'**écho**, de **sonar** ou de **radar**, il y a un aller-retour, donc une division par 2 à la fin. C'est l'erreur la plus fréquente sur ce type d'exercice."}
  ]},
  {t:"check", q:"Un son de fréquence $f = 500$ @u{Hz} se propage dans l'air à $340$ @u{m/s}. Quelle est sa longueur d'onde ?",
   choix:["$0{,}68$ @u{m}","$1{,}5$ @u{m}","$170\\ 000$ @u{m}","$1{,}47$ @u{m}"], bonne:0,
   expl:["Exact : $λ = @f{v}{f} = @f{340}{500} = 0{,}68$ @u{m}.",
         "Tu as calculé $@f{f}{v}$ en inversant : $@f{500}{340} ≈ 1{,}5$. La longueur d'onde est une distance, obtenue en divisant une vitesse par une fréquence.",
         "Tu as multiplié $340$ par $500$. La formule $λ = v × T$ utilise la **période**, pas la fréquence. Ici $T = @f{1}{500} = 0{,}002$ @u{s}.",
         "C'est un mélange de calculs. Reprends simplement $@f{340}{500}$."]}
 ]},

 {titre:"Le son : hauteur, timbre et intensité", blocs:[
  {t:"p", x:"Un son est une onde mécanique longitudinale : l'air se comprime et se dilate en alternance. Trois caractéristiques permettent de le décrire, et il faut savoir laquelle correspond à quelle grandeur physique."},
  {t:"tbl", head:["Ce qu'on perçoit","Grandeur physique","Si elle augmente…"], rows:[
   ["La **hauteur** (grave ou aigu)","la fréquence $f$","le son devient plus aigu"],
   ["Le **volume**","l'amplitude","le son devient plus fort"],
   ["Le **timbre**","la forme du signal","on distingue un piano d'une flûte"]
  ]},
  {t:"p", x:"Le timbre est le plus subtil des trois. Une flûte et un violon jouant le même la ont exactement la même fréquence fondamentale — et pourtant on les reconnaît sans hésiter. La différence tient à la **forme** du signal, faite d'harmoniques qui s'ajoutent à la fréquence de base."},
  {t:"formule", titre:"Niveau sonore",
   x:"$L = 10 × log@f{I}{I_0}$",
   note:"$L$ en décibels (@u{dB}) · $I_0 = 10^{-12}$ @u{W/m²} est le seuil d'audibilité."},
  {t:"p", x:"L'échelle des décibels est **logarithmique**, et cela réserve une surprise : ajouter $10$ @u{dB} correspond à une intensité multipliée par **dix**. Un son de $80$ @u{dB} n'est pas « un peu plus fort » qu'un son de $70$ @u{dB} : il transporte dix fois plus d'énergie. Au-delà de $85$ @u{dB} de façon prolongée, l'oreille s'abîme durablement — d'où les limites sur les baladeurs."},
  {t:"tbl", head:["Situation","Niveau sonore"], rows:[
   ["Seuil d'audibilité","$0$ @u{dB}"],
   ["Conversation normale","$60$ @u{dB}"],
   ["Rue passante","$80$ @u{dB}"],
   ["Concert","$110$ @u{dB}"],
   ["Seuil de douleur","$120$ @u{dB}"]
  ]}
 ]},

 {titre:"Récapitulatif", blocs:[
  {t:"tbl", head:["La question ressemble à…","La formule à utiliser"], rows:[
   ["« À quelle distance ? » avec une durée","$d = v × Δt$"],
   ["« Quel retard ? »","$τ = @f{d}{v}$"],
   ["« Quelle longueur d'onde ? »","$λ = @f{v}{f}$"],
   ["« Quelle fréquence ? »","$f = @f{v}{λ}$ ou $f = @f{1}{T}$"],
   ["« Le son est plus aigu »","La fréquence augmente, la longueur d'onde diminue"]
  ]},
  {t:"piege", titre:"Les erreurs les plus coûteuses", x:"**1.** Inverser $λ = @f{v}{f}$ : une longueur d'onde s'exprime en mètres, vérifie l'unité de ton résultat.<br>**2.** Confondre période et fréquence : elles sont **inverses** l'une de l'autre.<br>**3.** Croire que la célérité dépend de la fréquence : elle ne dépend que du milieu."}
 ]}
],
exos:[
 {id:"on1", niveau:1, type:"num", enonce:"Un son de fréquence $f = 850$ @u{Hz} se propage dans l'air à $v = 340$ @u{m/s}. Quelle est sa longueur d'onde, en @u{m} ?",
  rep:0.4, tol:0.005, unite:"m",
  diag:[{v:2.5, m:"Tu as calculé $@f{f}{v}$ au lieu de $@f{v}{f}$. Vérifie par les unités : des @u{m/s} divisés par des @u{Hz} (des « par seconde ») donnent bien des mètres."},
        {v:289000, m:"Tu as multiplié $v$ par $f$. La formule $λ = v × T$ fait intervenir la **période**, pas la fréquence — et $T = @f{1}{f}$."},
        {v:0.0012, m:"Tu as calculé la période ($@f{1}{850}$), pas la longueur d'onde. Il reste à la multiplier par la célérité."}],
  corr:["**Ce que dit l'énoncé.** Une fréquence $f = 850$ @u{Hz} et une célérité $v = 340$ @u{m/s}. On cherche la longueur d'onde.",
        "**Ce qu'est la longueur d'onde.** La distance parcourue par l'onde pendant **une** période : l'espace qui sépare deux crêtes.",
        "**La relation.** $λ = v × T$, et comme $T = @f{1}{f}$, cela s'écrit aussi $λ = @f{v}{f}$. C'est cette seconde forme qui est directement utilisable ici.",
        "**Je remplace.** $λ = @f{340}{850}$.",
        "**Je calcule.** $λ = 0{,}40$ @u{m}.",
        "**Je vérifie par les unités.** Des @u{m/s} divisés par des @u{Hz} — c'est-à-dire des « par seconde » — donnent bien des mètres. Si l'unité ne tombait pas juste, la formule serait à l'envers."],
  indice:"$λ = @f{v}{f}$ : la célérité au numérateur."},

 {id:"on2", niveau:1, type:"num", enonce:"Un éclair est suivi du tonnerre $5{,}0$ @u{s} plus tard. À quelle distance la foudre est-elle tombée, en @u{m} ? On prend $v_{son} = 340$ @u{m/s}.",
  rep:1700, tol:5, unite:"m",
  diag:[{v:68, m:"Tu as divisé la célérité par la durée. La distance est un produit : $d = v × Δt$."},
        {v:0.0147, m:"Tu as divisé la durée par la célérité, ce qui donnerait une durée, pas une distance."},
        {v:345, m:"Tu as additionné les deux valeurs. Une vitesse et une durée ne s'additionnent pas : elles se multiplient."}],
  corr:["**Ce que dit l'énoncé.** Le tonnerre est entendu $5{,}0$ @u{s} après l'éclair, avec $v_{son} = 340$ @u{m/s}.",
        "**Pourquoi ce décalage existe.** La lumière parcourt quelques kilomètres en quelques microsecondes : on la voit pratiquement à l'instant même. Le son, un million de fois plus lent, arrive nettement après.",
        "**Ce que mesure donc le décalage.** Exactement la durée du trajet du son, de l'éclair jusqu'à mon oreille.",
        "**La relation.** $v = @f{d}{Δt}$, que j'inverse pour obtenir la distance : $d = v × Δt$.",
        "**Je remplace et je calcule.** $d = 340 × 5{,}0 = 1700$ @u{m}.",
        "**Je vérifie avec la règle de terrain.** Trois secondes pour environ un kilomètre : cinq secondes donnent donc un peu plus d'un kilomètre et demi. $1{,}7$ @u{km} : cohérent."],
  indice:"Le retard mesuré est le temps de trajet du son : $d = v × Δt$."},

 {id:"on3", niveau:2, type:"num", enonce:"Une onde a une période $T = 4{,}0$ @u{ms}. Quelle est sa fréquence, en @u{Hz} ?",
  rep:250, tol:1, unite:"Hz",
  diag:[{v:0.25, m:"Tu as gardé la période en millisecondes. $4{,}0$ @u{ms} $= 0{,}0040$ @u{s}, et $@f{1}{0{,}0040} = 250$ @u{Hz}."},
        {v:4, m:"Tu as recopié la période. La fréquence est son **inverse** : $f = @f{1}{T}$."},
        {v:0.004, m:"C'est la période exprimée en secondes, pas la fréquence. Il reste à prendre l'inverse."}],
  corr:["**Ce que dit l'énoncé.** Une période $T = 4{,}0$ @u{ms}. On cherche la fréquence, en hertz.",
        "**Ce que sont ces deux grandeurs.** La période est la durée d'un motif. La fréquence est le nombre de motifs par seconde. Elles sont **inverses** l'une de l'autre : $f = @f{1}{T}$.",
        "**Le piège des unités.** Un hertz vaut « un par **seconde** ». La période doit donc être en secondes, pas en millisecondes.",
        "**Je convertis.** $4{,}0$ @u{ms} $= 4{,}0 × 10^{-3}$ @u{s} $= 0{,}0040$ @u{s}.",
        "**Je remplace et je calcule.** $f = @f{1}{0{,}0040} = 250$ @u{Hz}.",
        "**Je vérifie par le sens.** Un motif dure $4$ millièmes de seconde ; en une seconde entière, il y en a donc $250$. Cohérent — et $250$ @u{Hz} est bien un son audible, plutôt grave."],
  indice:"Convertis la période en secondes, puis prends l'inverse."},

 {id:"on4", niveau:2, type:"qcm", enonce:"Pourquoi n'entend-on aucun son dans l'espace ?",
  choix:["Parce qu'une onde mécanique a besoin d'un milieu matériel pour se propager",
         "Parce que le son y va trop vite","Parce qu'il fait trop froid","Parce que les fréquences y sont trop basses"], bonne:0,
  diag:["",
        "Il ne s'y propage pas du tout : ce n'est pas une question de vitesse. Sans matière, il n'y a rien à mettre en mouvement.",
        "La température modifie légèrement la célérité du son dans l'air, mais ce n'est pas la raison. Même à température ambiante, le vide ne transmet aucun son.",
        "La fréquence est fixée par la source. Le problème n'est pas la fréquence, mais l'absence de milieu."],
  corr:["**Ce que demande la question.** Pourquoi il n'y a aucun son dans l'espace.",
        "**Comment une onde mécanique se propage.** De proche en proche : une portion de matière est bousculée, elle bouscule sa voisine, qui bouscule la suivante. La perturbation avance de relais en relais.",
        "**Ce que cela exige.** Il faut de la matière à chaque relais. Sans milieu matériel, la chaîne n'a rien à transmettre.",
        "**Ce qu'est le vide spatial.** Précisément l'absence de matière — ou si peu qu'aucun relais n'est possible.",
        "**Je conclus.** Le son ne peut pas s'y propager. Une explosion dans l'espace est parfaitement silencieuse, contrairement à ce que montrent les films.",
        "**La comparaison qui éclaire.** La lumière, elle, n'est pas une onde mécanique : elle n'a besoin d'aucun support et traverse le vide sans difficulté. C'est pour cela qu'on voit les étoiles sans les entendre."],
  indice:"Demande-toi ce qui, concrètement, se transmet la perturbation."},

 {id:"on5", niveau:2, type:"num", enonce:"Une onde à la surface de l'eau a une longueur d'onde $λ = 0{,}25$ @u{m} et une fréquence $f = 2{,}0$ @u{Hz}. Quelle est sa célérité, en @u{m/s} ?",
  rep:0.5, tol:0.005, unite:"m/s",
  diag:[{v:8, m:"Tu as calculé $@f{f}{λ}$. La relation est $v = λ × f$ : une multiplication."},
        {v:0.125, m:"Tu as divisé la longueur d'onde par la fréquence. Vérifie par les unités : des mètres multipliés par des « par seconde » donnent des @u{m/s}."},
        {v:2.25, m:"Tu as additionné les deux valeurs. Elles se multiplient."}],
  corr:["**Ce que dit l'énoncé.** Une onde à la surface de l'eau, de longueur d'onde $λ = 0{,}25$ @u{m} et de fréquence $f = 2{,}0$ @u{Hz}. On cherche la célérité.",
        "**La relation de départ.** $λ = @f{v}{f}$ : c'est la seule relation qui contienne à la fois les trois grandeurs.",
        "**J'isole l'inconnue.** En multipliant les deux membres par $f$ : $v = λ × f$.",
        "**Je remplace.** $v = 0{,}25 × 2{,}0$.",
        "**Je calcule.** $v = 0{,}50$ @u{m/s}.",
        "**Je vérifie par les unités.** Des mètres multipliés par des « par seconde » donnent des @u{m/s} : c'est bien une vitesse. Et une vague qui avance d'un demi-mètre par seconde, c'est une allure de bassin plausible."],
  indice:"Isole $v$ dans $λ = @f{v}{f}$."},

 {id:"on6", niveau:3, type:"num", enonce:"Un sonar émet une impulsion vers le fond marin et reçoit l'écho $0{,}40$ @u{s} plus tard. La célérité du son dans l'eau est de $1500$ @u{m/s}. Quelle est la profondeur, en @u{m} ?",
  rep:300, tol:2, unite:"m",
  diag:[{v:600, m:"Tu as oublié que le son fait l'aller **et** le retour. La distance parcourue est le double de la profondeur : il faut diviser par 2."},
        {v:3750, m:"Tu as divisé la célérité par la durée. La distance s'obtient en multipliant."},
        {v:150, m:"Tu as divisé deux fois, ou pris la moitié de la durée puis encore la moitié du résultat. Une seule division par 2 suffit."}],
  corr:["**Ce que dit l'énoncé.** Un sonar reçoit son écho $0{,}40$ @u{s} après l'émission, dans une eau où $v = 1500$ @u{m/s}.",
        "**Le mot qui doit alerter.** « Écho ». Le son est allé jusqu'au fond **et** en est revenu : la durée mesurée couvre un aller-retour.",
        "**Étape 1 — la distance totale parcourue par le son.** $d = v × Δt = 1500 × 0{,}40 = 600$ @u{m}.",
        "**Étape 2 — ce que représentent ces $600$ mètres.** L'aller **plus** le retour, c'est-à-dire deux fois la profondeur.",
        "**Étape 3 — je divise par deux.** Profondeur $= @f{600}{2} = 300$ @u{m}.",
        "**Le réflexe à garder.** Sonar, radar, écho : il y a toujours un aller-retour, donc toujours une division par $2$ à la fin. C'est l'erreur la plus fréquente sur ce type d'exercice."],
  indice:"L'écho a fait deux fois le trajet : aller, puis retour."},

 {id:"on7", niveau:3, type:"qcm", enonce:"On chante la même note, mais plus fort. Qu'est-ce qui change dans le signal sonore ?",
  choix:["L'amplitude augmente, la fréquence ne change pas",
         "La fréquence augmente","La longueur d'onde diminue","La célérité augmente"], bonne:0,
  diag:["",
        "Une fréquence plus élevée donnerait un son plus **aigu**, donc une autre note. Or l'énoncé précise qu'il s'agit de la même note.",
        "La longueur d'onde est liée à la fréquence par $λ = @f{v}{f}$. Comme la fréquence ne change pas et la célérité non plus, la longueur d'onde reste identique.",
        "La célérité du son ne dépend que du milieu — ici l'air. Chanter plus fort ne fait pas voyager le son plus vite."],
  corr:["**Ce que dit l'énoncé.** On chante **la même note**, mais plus fort. Qu'est-ce qui change dans le signal ?",
        "**Étape 1 — ce que fixe la note.** La hauteur d'une note — grave ou aiguë — est fixée par la **fréquence** du signal. Un la reste un la.",
        "**Étape 2 — donc ce qui ne change pas.** Chanter la même note signifie garder exactement la même fréquence.",
        "**Étape 3 — et la longueur d'onde ?** Elle vaut $λ = @f{v}{f}$. La célérité du son dans l'air ne dépend que de l'air, et la fréquence ne change pas : la longueur d'onde reste donc identique elle aussi.",
        "**Étape 4 — ce qui change alors.** Chanter plus fort, c'est envoyer plus d'énergie : la perturbation de l'air est plus ample. C'est l'**amplitude** qui augmente.",
        "**Je conclus.** Seule l'amplitude change. Hauteur et volume sont deux caractéristiques indépendantes : c'est pour cela qu'on peut chanter fort et faux, ou juste et doucement."],
  indice:"Sépare bien ce qui fait la hauteur d'un son et ce qui en fait le volume."},

 {id:"on8", niveau:3, type:"num", enonce:"Un son passe de $60$ à $90$ @u{dB}. Par combien son intensité sonore est-elle multipliée ?",
  rep:1000, tol:1,
  diag:[{v:30, m:"$30$ @u{dB} est l'écart de niveau sonore, pas le facteur d'intensité. L'échelle des décibels est logarithmique : chaque tranche de $10$ @u{dB} correspond à un facteur 10."},
        {v:100, m:"Tu as compté deux tranches de $10$ @u{dB} au lieu de trois. De $60$ à $90$, il y a $30$ @u{dB}, soit trois tranches : $10 × 10 × 10$."},
        {v:1.5, m:"Tu as fait le rapport $@f{90}{60}$. Les décibels ne se divisent pas comme des grandeurs ordinaires : ils s'ajoutent quand l'intensité, elle, est multipliée."}],
  corr:["**Ce que dit l'énoncé.** Un son passe de $60$ à $90$ @u{dB}. Par combien son intensité est-elle multipliée ?",
        "**Pourquoi le calcul n'est pas direct.** L'échelle des décibels est **logarithmique** : les décibels s'**ajoutent** quand l'intensité, elle, se **multiplie**. Faire le rapport $@f{90}{60}$ n'a aucun sens ici.",
        "**La règle à connaître.** Chaque tranche de $+10$ @u{dB} correspond à une intensité multipliée par $10$.",
        "**Étape 1 — je mesure l'écart.** $90 - 60 = 30$ @u{dB}.",
        "**Étape 2 — je compte les tranches.** $30 ÷ 10 = 3$ tranches de $10$ @u{dB}.",
        "**Étape 3 — je multiplie.** $10 × 10 × 10 = 1000$. L'intensité est mille fois plus grande. C'est pourquoi $30$ @u{dB} de plus, qui semblent peu sur le cadran, changent tout pour l'oreille."],
  indice:"Chaque tranche de $10$ @u{dB} multiplie l'intensité par 10. Combien de tranches y a-t-il ?"}
]
},

/* ====== 12. LA LUMIÈRE : LENTILLES, IMAGES ET PHOTONS ====== */
{
id:"lumiere", n:12, titre:"La lumière : images et photons",
sous:"Deux modèles pour un même phénomène",
desc:"Lentille convergente, construction d'image, relation de conjugaison, photon et niveaux d'énergie.",
duree:40,
sections:[
 {titre:"La lentille convergente et son foyer", blocs:[
  {t:"idee", x:"Une **lentille convergente** rassemble en un point les rayons qui lui arrivent parallèlement à son axe. Ce point s'appelle le **foyer image**, noté $F'$, et sa distance au centre est la **distance focale** $f'$."},
  {t:"p", x:"C'est cette propriété qui permet de brûler une feuille avec une loupe au soleil : les rayons du Soleil arrivent pratiquement parallèles, la lentille les concentre en un point minuscule, et toute leur énergie s'y retrouve rassemblée. La distance entre la loupe et ce point brillant est exactement la distance focale."},
  {t:"formule", titre:"Les trois rayons de la construction",
   x:"1. Le rayon parallèle à l'axe ressort **par $F'$**<br>2. Le rayon passant par le **centre** $O$ n'est pas dévié<br>3. Le rayon passant par $F$ ressort **parallèle** à l'axe",
   note:"Deux rayons suffisent pour construire l'image ; le troisième sert de vérification."},
  {t:"p", x:"Le deuxième rayon est le plus commode : il file tout droit. Le premier est le plus caractéristique de la lentille. Avec ces deux-là, on trouve l'image en quelques secondes — leur intersection donne le point image, et il ne reste qu'à descendre à la verticale pour trouver l'axe."},
  {t:"figi", nom:"lentille"},
  {t:"p", x:"Déplace l'objet et observe. Loin de la lentille, l'image est petite, renversée et proche du foyer. En rapprochant l'objet du foyer, l'image s'éloigne et grandit. Et si l'objet passe **entre le foyer et la lentille**, l'image devient droite, agrandie et virtuelle : c'est le fonctionnement d'une loupe."}
  ,{t:"mots", items:[
   ["Lentille convergente","Un verre plus épais au centre qu'aux bords, qui rassemble les rayons parallèles en un point."],
   ["Axe optique","La droite horizontale qui traverse le centre de la lentille. Tout se repère par rapport à elle."],
   ["Foyer image $F'$","Le point où se rassemblent les rayons arrivés parallèles à l'axe. Il est **après** la lentille."],
   ["Distance focale $f'$","La distance du centre de la lentille à ce foyer. Plus elle est courte, plus la lentille est puissante."],
   ["Image réelle","Une image qu'on peut recueillir sur un écran. Elle se forme après la lentille, et elle est renversée."],
   ["Image virtuelle","Une image qu'on voit en regardant à travers la lentille, mais qu'aucun écran ne peut recueillir. C'est ce que donne une loupe."],
   ["Grandissement $γ$","Le rapport de la taille de l'image à celle de l'objet. Négatif si l'image est renversée."],
   ["Photon","Un grain de lumière, qui transporte une quantité d'énergie bien précise, ni plus ni moins."],
   ["Quantification","Le fait qu'un atome ne puisse prendre que certaines valeurs d'énergie, comme les marches d'un escalier."]
  ]}
 ]},

 {titre:"Relation de conjugaison et grandissement", blocs:[
  {t:"formule", titre:"Relation de conjugaison",
   x:"$@f{1}{@u{OA'}} - @f{1}{@u{OA}} = @f{1}{f'}$",
   note:"Toutes les distances sont **algébriques** : comptées positivement dans le sens de propagation de la lumière, donc $@u{OA}$ est négative pour un objet réel placé avant la lentille."},
  {t:"formule", titre:"Grandissement",
   x:"$γ = @f{@u{OA'}}{@u{OA}} = @f{@u{A'B'}}{@u{AB}}$",
   note:"$γ$ négatif : image **renversée**. $|γ| > 1$ : image **agrandie**."},
  {t:"p", x:"Les signes rebutent souvent, mais ils portent toute l'information. Le signe du grandissement dit si l'image est droite ou renversée ; sa valeur absolue dit si elle est agrandie ou réduite. Un $γ = -0{,}5$ se lit ainsi : image renversée, deux fois plus petite que l'objet."},
  {t:"exemple", titre:"Exemple guidé — où se forme l'image ?", enonce:"Un objet est placé à $30$ @u{cm} devant une lentille de distance focale $f' = 10$ @u{cm}. Où se forme l'image, et quel est le grandissement ?", etapes:[
   {q:"Écrire les données en valeurs algébriques", r:"L'objet est **avant** la lentille : $@u{OA} = -30$ @u{cm}. Et $f' = +10$ @u{cm}."},
   {q:"Appliquer la relation", r:"$@f{1}{@u{OA'}} = @f{1}{f'} + @f{1}{@u{OA}} = @f{1}{10} + @f{1}{-30}$."},
   {q:"Mettre au même dénominateur", r:"$@f{1}{@u{OA'}} = @f{3}{30} - @f{1}{30} = @f{2}{30} = @f{1}{15}$."},
   {q:"Conclure sur la position", r:"$@u{OA'} = +15$ @u{cm} : l'image se forme $15$ @u{cm} **après** la lentille. Elle est réelle, on peut la recueillir sur un écran."},
   {q:"Le grandissement", r:"$γ = @f{@u{OA'}}{@u{OA}} = @f{15}{-30} = -0{,}5$. L'image est renversée et deux fois plus petite."},
   {q:"Le contrôle", r:"L'objet est au-delà de $2f' = 20$ @u{cm} : on **doit** trouver une image réelle, renversée et réduite. C'est bien le cas."}
  ]},
  {t:"tbl", head:["Position de l'objet","Image obtenue"], rows:[
   ["Au-delà de $2f'$","Réelle, renversée, **réduite**"],
   ["Entre $2f'$ et $f'$","Réelle, renversée, **agrandie**"],
   ["Au foyer $F$","Pas d'image : les rayons ressortent parallèles"],
   ["Entre $F$ et la lentille","**Virtuelle**, droite, agrandie (la loupe)"]
  ]},
  {t:"piege", titre:"Le signe de $@u{OA}$", x:"Oublier que $@u{OA}$ est **négative** pour un objet réel est l'erreur la plus fréquente. Elle donne une image du mauvais côté de la lentille, et un grandissement de signe faux. Écris toujours $@u{OA} = -30$ @u{cm} avant de commencer le calcul."}
  ,{t:"methode", titre:"Trouver l'image d'un objet", etapes:[
   "**Écrire les données en valeurs algébriques** : $@u{OA}$ **négative** pour un objet placé avant la lentille, $f'$ positive pour une lentille convergente.",
   "**Écrire la relation de conjugaison** sous la forme qui isole l'inconnue : $@f{1}{@u{OA'}} = @f{1}{f'} + @f{1}{@u{OA}}$.",
   "**Mettre au même dénominateur** et calculer — sans oublier qu'on obtient d'abord $@f{1}{@u{OA'}}$, et qu'il faut ensuite prendre l'inverse.",
   "**Lire le résultat** : $@u{OA'}$ positive → image réelle, après la lentille ; négative → image virtuelle, du même côté que l'objet.",
   "**Calculer le grandissement** $γ = @f{@u{OA'}}{@u{OA}}$ : son signe dit si l'image est renversée, sa valeur absolue si elle est agrandie."
  ], exemple:"$@u{OA} = -30$ @u{cm} et $f' = 10$ @u{cm} : $@f{1}{@u{OA'}} = @f{1}{10} - @f{1}{30} = @f{2}{30}$, donc $@u{OA'} = 15$ @u{cm} (image réelle) et $γ = @f{15}{-30} = -0{,}5$ (renversée, deux fois plus petite)."}
 ]},

 {titre:"L'autre visage de la lumière : le photon", blocs:[
  {t:"idee", x:"La lumière se comporte tantôt comme une onde, tantôt comme un flux de grains d'énergie appelés **photons**. Les deux modèles sont vrais : on choisit celui qui explique le phénomène qu'on étudie."},
  {t:"p", x:"Pour les lentilles, les couleurs, les interférences, le modèle ondulatoire suffit. Mais certains phénomènes lui résistent : quand une lumière très faible arrache des électrons à un métal alors qu'une lumière intense d'une autre couleur n'y arrive pas, l'onde n'explique rien. Il faut alors admettre que l'énergie arrive par **paquets indivisibles**, et que c'est l'énergie de chaque paquet qui compte."},
  {t:"formule", titre:"Énergie d'un photon",
   x:"$E = h × ν = @f{h × c}{λ}$",
   note:"$h = 6{,}63 × 10^{-34}$ @u{J·s} (constante de Planck) · $c = 3{,}00 × 10^{8}$ @u{m/s} · $λ$ en **mètres**."},
  {t:"p", x:"Lis bien la seconde forme : la longueur d'onde est au **dénominateur**. Une lumière de courte longueur d'onde transporte donc des photons **plus énergétiques**. C'est pourquoi les ultraviolets, invisibles et de petite longueur d'onde, abîment la peau, alors que la lumière rouge, bien visible, ne fait rien."},
  {t:"formule", titre:"L'électronvolt", x:"$1$ @u{eV} $= 1{,}6 × 10^{-19}$ @u{J}", note:"Unité commode à l'échelle atomique : les énergies des photons visibles valent quelques @u{eV}."}
  ,{t:"methode", titre:"Passer d'une couleur à une énergie, et retour", etapes:[
   "**Repérer ce qu'on donne et ce qu'on cherche** : une longueur d'onde en @u{nm} ? une énergie en @u{J} ou en @u{eV} ?",
   "**Convertir les longueurs d'onde en mètres** : $500$ @u{nm} $= 500 × 10^{-9}$ @u{m}. C'est ici que se perdent les puissances de dix.",
   "**Appliquer $E = @f{h c}{λ}$** pour aller de la couleur à l'énergie, ou $λ = @f{h c}{E}$ dans l'autre sens.",
   "**Convertir en électronvolts si besoin** : diviser les joules par $1{,}6 × 10^{-19}$.",
   "**Contrôler** : un photon visible vaut entre $1{,}8$ et $3{,}1$ @u{eV}. En dehors, c'est de l'infrarouge ou de l'ultraviolet — ou une erreur de calcul."
  ], exemple:"Pour $λ = 500$ @u{nm} : $E = @f{6{,}63×10^{-34} × 3{,}00×10^{8}}{500×10^{-9}} ≈ 4{,}0×10^{-19}$ @u{J}, soit $@f{4{,}0×10^{-19}}{1{,}6×10^{-19}} = 2{,}5$ @u{eV}. C'est bien dans le visible."},
  {t:"tbl", head:["Rayonnement","Longueur d'onde","Énergie du photon"], rows:[
   ["Ultraviolet","$300$ @u{nm}","$≈ 4{,}1$ @u{eV}"],
   ["Bleu","$450$ @u{nm}","$≈ 2{,}8$ @u{eV}"],
   ["Rouge","$700$ @u{nm}","$≈ 1{,}8$ @u{eV}"],
   ["Infrarouge","$1000$ @u{nm}","$≈ 1{,}2$ @u{eV}"]
  ]}
 ]},

 {titre:"Des niveaux d'énergie quantifiés", blocs:[
  {t:"idee", x:"Un atome ne peut pas prendre n'importe quelle énergie : seules certaines valeurs, appelées **niveaux d'énergie**, lui sont permises. C'est ce qu'on appelle la **quantification**."},
  {t:"p", x:"L'image classique est celle d'un escalier : on peut se tenir sur la première ou la deuxième marche, jamais entre les deux. Un atome passe d'un niveau à un autre d'un seul coup, jamais progressivement."},
  {t:"formule", titre:"Émission et absorption",
   x:"$ΔE = E_{haut} - E_{bas} = h × ν = @f{h c}{λ}$",
   note:"L'atome n'émet ou n'absorbe que des photons dont l'énergie correspond **exactement** à un écart entre deux de ses niveaux."},
  {t:"fig", titre:"Un atome descend d'un niveau et émet un photon",
   vue:[0,0,10,6], w:420, h:250, grille:false, axes:false,
   objets:[
    {t:"seg", de:[1,5], a:[5,5], couleur:"ink", epais:2.6},
    {t:"seg", de:[1,3.2], a:[5,3.2], couleur:"ink", epais:2.6},
    {t:"seg", de:[1,1], a:[5,1], couleur:"ink", epais:2.6},
    {t:"texte", x:6.1, y:5, txt:"E₂ = −1,5 eV", couleur:"ink2", taille:12},
    {t:"texte", x:6.1, y:3.2, txt:"E₁ = −3,4 eV", couleur:"ink2", taille:12},
    {t:"texte", x:6.2, y:1, txt:"E₀ = −13,6 eV", couleur:"ink2", taille:12},
    {t:"vec", de:[3,5], a:[3,3.35], couleur:"rouge"},
    {t:"texte", x:1.95, y:4.1, txt:"ΔE", couleur:"rouge", taille:13},
    {t:"rayon", de:[3.4,4.1], a:[9.2,4.1], couleur:"ambre"},
    {t:"texte", x:8.4, y:4.6, txt:"photon émis", couleur:"ambre", taille:12}
   ],
   note:"L'énergie perdue par l'atome part exactement dans le photon : rien ne se perd."},
  {t:"exemple", titre:"Exemple guidé — quelle couleur émet cet atome ?", enonce:"Un atome passe d'un niveau $E_2 = -1{,}5$ @u{eV} à un niveau $E_1 = -3{,}4$ @u{eV}. Quelle est la longueur d'onde du photon émis ? On donne $h c = 1{,}99 × 10^{-25}$ @u{J·m} et $1$ @u{eV} $= 1{,}6 × 10^{-19}$ @u{J}.", etapes:[
   {q:"Calculer l'écart d'énergie", r:"$ΔE = -1{,}5 - (-3{,}4) = 1{,}9$ @u{eV}. Attention aux deux signes moins : l'écart est bien positif."},
   {q:"Convertir en joules", r:"$ΔE = 1{,}9 × 1{,}6 × 10^{-19} ≈ 3{,}0 × 10^{-19}$ @u{J}."},
   {q:"Utiliser la relation", r:"$ΔE = @f{h c}{λ}$, donc $λ = @f{h c}{ΔE}$."},
   {q:"Calculer", r:"$λ = @f{1{,}99 × 10^{-25}}{3{,}0 × 10^{-19}} ≈ 6{,}5 × 10^{-7}$ @u{m}, soit $650$ @u{nm}."},
   {q:"Interpréter", r:"$650$ @u{nm} correspond au **rouge**. C'est effectivement la raie rouge caractéristique de l'hydrogène, visible dans son spectre."}
  ]},
  {t:"check", q:"Un photon d'énergie $2{,}0$ @u{eV} arrive sur un atome dont l'écart entre les deux premiers niveaux vaut $3{,}0$ @u{eV}. Que se passe-t-il ?",
   choix:["Rien : le photon n'est pas absorbé","Le photon est absorbé et l'atome monte d'un niveau","L'atome absorbe une partie de l'énergie","L'atome émet un second photon"], bonne:0,
   expl:["Exact : l'absorption n'a lieu que si l'énergie du photon correspond **exactement** à un écart entre deux niveaux. $2{,}0 ≠ 3{,}0$ : le photon poursuit son chemin.",
         "Pour monter d'un niveau, il faudrait exactement $3{,}0$ @u{eV}. Avec $2{,}0$ @u{eV}, l'atome ne peut pas atteindre la marche suivante.",
         "C'est justement ce que la quantification interdit : l'atome ne peut pas prendre « un peu » d'énergie et rester entre deux niveaux. C'est tout ou rien.",
         "L'atome est dans son état de plus basse énergie : il n'a rien à émettre."]}
 ]},

 {titre:"Récapitulatif", blocs:[
  {t:"tbl", head:["La question ressemble à…","Ce qu'il faut faire"], rows:[
   ["« Où se forme l'image ? »","Relation de conjugaison, avec $@u{OA} < 0$"],
   ["« L'image est-elle renversée ? »","Signe de $γ$ : négatif = renversée"],
   ["« Quelle énergie transporte ce photon ? »","$E = @f{hc}{λ}$, avec $λ$ en mètres"],
   ["« Quelle longueur d'onde émise ? »","$λ = @f{hc}{ΔE}$, après conversion des @u{eV} en @u{J}"],
   ["« Ce photon sera-t-il absorbé ? »","Seulement si son énergie égale exactement un écart de niveaux"]
  ]},
  {t:"idee", x:"Un même rayonnement se décrit par une longueur d'onde (modèle ondulatoire) et par une énergie de photon (modèle particulaire). Passer de l'un à l'autre, c'est simplement appliquer $E = @f{hc}{λ}$."}
 ]}
],
exos:[
 {id:"lu1", niveau:1, type:"qcm", enonce:"Un rayon lumineux arrive sur une lentille convergente parallèlement à son axe optique. Par où ressort-il ?",
  choix:["Par le foyer image $F'$","Sans être dévié","Par le centre $O$","Parallèlement à lui-même"], bonne:0,
  diag:["",
        "C'est le rayon passant par le **centre** de la lentille qui n'est pas dévié. Un rayon parallèle à l'axe, lui, est bien dévié.",
        "Il passe par le centre seulement s'il y arrive. Un rayon parallèle à l'axe arrive en général ailleurs sur la lentille.",
        "C'est le comportement d'une vitre, pas d'une lentille. Une lentille convergente rassemble justement les rayons parallèles en un point."],
  corr:["**Ce que dit l'énoncé.** Un rayon arrive sur une lentille convergente **parallèlement à son axe optique**. Par où ressort-il ?",
        "**Ce qui définit une lentille convergente.** Elle rassemble en un seul point tous les rayons qui lui arrivent parallèlement à l'axe.",
        "**Comment s'appelle ce point.** Le **foyer image**, noté $F'$. Il se situe après la lentille, à une distance $f'$ appelée distance focale.",
        "**J'applique au rayon de l'énoncé.** Il arrive parallèlement à l'axe : il fait donc partie de ceux qui se rassemblent en $F'$.",
        "**Je conclus.** Il ressort en passant par le foyer image $F'$.",
        "**L'expérience qui l'illustre.** C'est ce qui permet de brûler une feuille avec une loupe au soleil : les rayons solaires arrivent parallèles, la lentille les concentre en un point unique — et ce point est justement le foyer."],
  indice:"C'est la propriété qui définit une lentille convergente."},

 {id:"lu2", niveau:1, type:"num", enonce:"Une image mesure $2{,}0$ @u{cm} et l'objet $8{,}0$ @u{cm}. L'image est renversée. Quelle est la valeur du grandissement ?",
  rep:-0.25, tol:0.005,
  diag:[{v:0.25, m:"La valeur est bonne mais le signe manque. Une image **renversée** correspond à un grandissement **négatif**."},
        {v:4, m:"Tu as inversé la fraction. Le grandissement est $@f{@u{A'B'}}{@u{AB}}$ : la taille de l'**image** au numérateur."},
        {v:-4, m:"Le signe est correct, mais la fraction est inversée : l'image est plus petite que l'objet, le grandissement doit donc être compris entre $-1$ et $0$."}],
  corr:["**Ce que dit l'énoncé.** Un objet de $8{,}0$ @u{cm} donne une image de $2{,}0$ @u{cm}, et cette image est **renversée**.",
        "**Ce que mesure le grandissement.** Le rapport de la taille de l'image à celle de l'objet : $γ = @f{@u{A'B'}}{@u{AB}}$. La taille de l'**image** va au numérateur.",
        "**Étape 1 — la valeur absolue.** $@f{2{,}0}{8{,}0} = 0{,}25$. L'image est quatre fois plus petite que l'objet.",
        "**Étape 2 — le signe.** C'est lui qui porte l'information « droite ou renversée ». Une image **renversée** correspond à un grandissement **négatif**.",
        "**Je conclus.** $γ = -0{,}25$.",
        "**Comment relire ce résultat.** Le signe moins dit « renversée » ; la valeur $0{,}25$, inférieure à 1, dit « réduite ». Deux informations dans un seul nombre."],
  indice:"Taille de l'image divisée par taille de l'objet, avec un signe négatif si l'image est renversée."},

 {id:"lu3", niveau:2, type:"num", enonce:"Un objet est placé à $30$ @u{cm} devant une lentille de distance focale $f' = 10$ @u{cm}. À quelle distance de la lentille se forme l'image, en @u{cm} ?",
  rep:15, tol:0.2, unite:"cm",
  diag:[{v:7.5, m:"Tu as sans doute additionné les inverses au lieu de les soustraire, ou oublié le signe négatif de $@u{OA}$. Reprends : $@f{1}{@u{OA'}} = @f{1}{10} + @f{1}{-30}$."},
        {v:40, m:"Tu as additionné les distances. La relation de conjugaison porte sur les **inverses** des distances, pas sur les distances elles-mêmes."},
        {v:20, m:"$20$ @u{cm} vaut $2f'$ : c'est la position particulière où objet et image sont symétriques. Ici l'objet est plus loin, donc l'image est plus proche que $2f'$."}],
  corr:["**Ce que dit l'énoncé.** Un objet à $30$ @u{cm} devant une lentille de distance focale $f' = 10$ @u{cm}. On cherche où se forme l'image.",
        "**Étape 1 — j'écris les données en valeurs algébriques.** L'objet est **avant** la lentille, donc $@u{OA} = -30$ @u{cm}, avec le signe moins. La lentille est convergente, donc $f' = +10$ @u{cm}. C'est ici que se joue la moitié des erreurs.",
        "**Étape 2 — j'écris la relation de conjugaison sous la forme utile.** $@f{1}{@u{OA'}} - @f{1}{@u{OA}} = @f{1}{f'}$, que je réarrange en $@f{1}{@u{OA'}} = @f{1}{f'} + @f{1}{@u{OA}}$.",
        "**Étape 3 — je remplace.** $@f{1}{@u{OA'}} = @f{1}{10} + @f{1}{-30} = @f{1}{10} - @f{1}{30}$.",
        "**Étape 4 — je mets au même dénominateur.** $@f{3}{30} - @f{1}{30} = @f{2}{30} = @f{1}{15}$.",
        "**Étape 5 — je prends l'inverse et j'interprète.** $@u{OA'} = 15$ @u{cm}. Le résultat est **positif** : l'image se forme après la lentille, elle est **réelle** et peut être recueillie sur un écran."],
  indice:"N'oublie pas que $@u{OA}$ est négative pour un objet placé avant la lentille."},

 {id:"lu4", niveau:2, type:"qcm", enonce:"Deux photons, l'un bleu ($450$ @u{nm}), l'autre rouge ($700$ @u{nm}). Lequel transporte le plus d'énergie ?",
  choix:["Le bleu, car sa longueur d'onde est plus petite","Le rouge, car sa longueur d'onde est plus grande",
         "Les deux transportent la même énergie","Cela dépend de l'intensité de la source"], bonne:0,
  diag:["",
        "Dans $E = @f{hc}{λ}$, la longueur d'onde est au **dénominateur** : une grande longueur d'onde donne une petite énergie.",
        "L'énergie dépend directement de la longueur d'onde : deux couleurs différentes correspondent forcément à deux énergies différentes.",
        "L'intensité fixe le **nombre** de photons émis par seconde, pas l'énergie de chacun d'eux. C'est justement la découverte que le modèle du photon a apportée."],
  corr:["**Ce que dit l'énoncé.** Deux photons, l'un bleu ($450$ @u{nm}), l'autre rouge ($700$ @u{nm}). Lequel transporte le plus d'énergie ?",
        "**La relation à utiliser.** $E = @f{h c}{λ}$ : l'énergie d'un photon dépend de sa longueur d'onde.",
        "**Où se trouve $λ$ ?** Au **dénominateur**. C'est le point décisif : plus la longueur d'onde est **petite**, plus l'énergie est **grande**. Les deux varient en sens inverse.",
        "**Je compare les deux longueurs d'onde.** $450$ @u{nm} $< 700$ @u{nm} : le bleu a la plus petite.",
        "**Je conclus.** Le photon **bleu** est le plus énergétique.",
        "**La vérification par le réel.** C'est cohérent avec ce qu'on observe : les ultraviolets, de longueur d'onde encore plus courte, abîment la peau — alors que la lumière rouge, bien visible, ne fait rien. L'énergie de chaque grain augmente quand la longueur d'onde diminue."],
  indice:"Regarde où se trouve $λ$ dans la formule : au numérateur ou au dénominateur ?"},

 {id:"lu5", niveau:2, type:"num", enonce:"Quelle est l'énergie, en @u{eV}, d'un photon dont l'énergie vaut $4{,}8 × 10^{-19}$ @u{J} ? On donne $1$ @u{eV} $= 1{,}6 × 10^{-19}$ @u{J}.",
  rep:3, tol:0.05, unite:"eV",
  diag:[{v:7.68e-19, m:"Tu as multiplié par $1{,}6 × 10^{-19}$ au lieu de diviser. Pour convertir des joules en électronvolts, on divise par la valeur d'un électronvolt."},
        {v:0.333, m:"Tu as inversé la division. Un photon visible a une énergie de quelques @u{eV} : un résultat inférieur à 1 doit alerter."}],
  corr:["**Ce que dit l'énoncé.** Un photon d'énergie $4{,}8 × 10^{-19}$ @u{J}. On la veut en électronvolts, sachant que $1$ @u{eV} $= 1{,}6 × 10^{-19}$ @u{J}.",
        "**Ce qu'est une conversion d'unité.** Chercher combien de fois l'unité tient dans la valeur. Ici : combien de fois $1{,}6 × 10^{-19}$ @u{J} tient dans $4{,}8 × 10^{-19}$ @u{J}. C'est donc une division.",
        "**Je pose la division.** $@f{4{,}8 × 10^{-19}}{1{,}6 × 10^{-19}}$.",
        "**Je simplifie les puissances de dix.** Elles sont identiques en haut et en bas : elles s'annulent. Il ne reste que $@f{4{,}8}{1{,}6}$.",
        "**Je calcule.** $4{,}8 ÷ 1{,}6 = 3$. Donc $E = 3{,}0$ @u{eV}.",
        "**Je vérifie l'ordre de grandeur.** Un photon visible vaut entre $1{,}8$ et $3{,}1$ @u{eV}. $3{,}0$ @u{eV} tombe tout en haut de cet intervalle : c'est un photon violet. Plausible."],
  indice:"Combien de fois $1{,}6 × 10^{-19}$ tient-il dans $4{,}8 × 10^{-19}$ ?"},

 {id:"lu6", niveau:3, type:"num", enonce:"Un atome passe d'un niveau $E_2 = -0{,}9$ @u{eV} à un niveau $E_1 = -3{,}4$ @u{eV}. Quelle est l'énergie du photon émis, en @u{eV} ?",
  rep:2.5, tol:0.05, unite:"eV",
  diag:[{v:-2.5, m:"L'énergie d'un photon est toujours **positive**. L'atome perd $2{,}5$ @u{eV}, et c'est cette énergie qui part dans le photon : $ΔE = E_2 - E_1 = -0{,}9 - (-3{,}4) = +2{,}5$ @u{eV}."},
        {v:4.3, m:"Tu as additionné les deux niveaux au lieu de les soustraire. L'énergie émise est l'**écart** entre les deux."},
        {v:0.9, m:"Tu as pris la valeur du niveau de départ. C'est la différence entre les deux niveaux qui part dans le photon."}],
  corr:["**Ce que dit l'énoncé.** Un atome descend du niveau $E_2 = -0{,}9$ @u{eV} au niveau $E_1 = -3{,}4$ @u{eV}. On cherche l'énergie du photon émis.",
        "**Ce qui se passe physiquement.** L'atome perd de l'énergie en descendant. Cette énergie ne disparaît pas : elle part entièrement dans le photon émis.",
        "**La relation.** $ΔE = E_{départ} - E_{arrivée} = E_2 - E_1$.",
        "**Je remplace, en gardant les parenthèses.** $ΔE = -0{,}9 - (-3{,}4)$.",
        "**Je traite le double signe.** Soustraire un nombre négatif revient à l'ajouter : $-0{,}9 + 3{,}4 = 2{,}5$.",
        "**Je conclus et je vérifie.** $ΔE = 2{,}5$ @u{eV}. L'énergie d'un photon est toujours **positive** : si j'avais trouvé $-2{,}5$, j'aurais soustrait dans le mauvais sens."],
  indice:"Soustraire un nombre négatif revient à l'ajouter."},

 {id:"lu7", niveau:3, type:"num", enonce:"Un objet de $4{,}0$ @u{cm} donne une image renversée de $12$ @u{cm}. L'objet est à $15$ @u{cm} de la lentille. À quelle distance de la lentille se forme l'image, en @u{cm} ?",
  rep:45, tol:0.5, unite:"cm",
  diag:[{v:5, m:"Tu as divisé au lieu de multiplier. L'image est **trois fois plus grande** que l'objet : elle est donc trois fois plus loin de la lentille, pas trois fois plus près."},
        {v:15, m:"Tu as recopié la distance de l'objet. Elle serait égale seulement si le grandissement valait 1 en valeur absolue."},
        {v:180, m:"Tu as multiplié par 12 au lieu de multiplier par le grandissement 3. Le grandissement vaut $@f{12}{4{,}0} = 3$."}],
  corr:["**Ce que dit l'énoncé.** Un objet de $4{,}0$ @u{cm} à $15$ @u{cm} de la lentille donne une image renversée de $12$ @u{cm}. On cherche la distance de l'image.",
        "**La propriété qui sert ici.** Le grandissement se lit de deux façons : par les tailles, $γ = @f{@u{A'B'}}{@u{AB}}$, et par les distances, $γ = @f{@u{OA'}}{@u{OA}}$. Les deux rapports sont égaux.",
        "**Étape 1 — je calcule le grandissement par les tailles.** En valeur absolue : $@f{12}{4{,}0} = 3$. L'image est trois fois plus grande que l'objet.",
        "**Étape 2 — j'applique le même rapport aux distances.** Si l'image est trois fois plus grande, elle est aussi trois fois plus loin de la lentille : $|@u{OA'}| = 3 × |@u{OA}|$.",
        "**Étape 3 — je calcule.** $|@u{OA'}| = 3 × 15 = 45$ @u{cm}.",
        "**Je vérifie la cohérence.** Image agrandie et réelle : l'objet devait donc se trouver entre $f'$ et $2f'$. Avec $@u{OA} = -15$ et $@u{OA'} = +45$, la relation de conjugaison donne $f' = 11{,}25$ @u{cm}, et $15$ est bien compris entre $11{,}25$ et $22{,}5$. Tout se tient."],
  indice:"Le rapport des distances est le même que le rapport des tailles."},

 {id:"lu8", niveau:3, type:"txt", enonce:"Comment appelle-t-on le fait qu'un atome ne puisse prendre que certaines valeurs d'énergie bien précises ? (un mot)",
  reps:["quantification","la quantification","quantifiee","quantification de l energie"],
  diag:[{r:"absorption", m:"L'absorption est le fait de capter un photon. Le mot recherché décrit le fait que les énergies possibles forment un escalier, avec des marches et rien entre elles."},
        {r:"emission", m:"L'émission est le fait d'envoyer un photon. Le mot recherché décrit la structure même des énergies permises."}],
  corr:["**Ce que demande la question.** Le nom du fait qu'un atome ne puisse prendre que certaines valeurs d'énergie.",
        "**Ce qu'on observe.** Un atome ne peut pas avoir n'importe quelle énergie. Seules certaines valeurs bien précises, appelées **niveaux**, lui sont accessibles.",
        "**L'image qui aide.** Un escalier : on se tient sur la première marche ou sur la deuxième, jamais entre les deux. L'atome saute d'un niveau à l'autre d'un seul coup, jamais progressivement.",
        "**Le mot.** On dit que son énergie est **quantifiée** : c'est la **quantification**. Le mot vient de « quantité » — l'énergie ne vient que par quantités déterminées.",
        "**Ce que cela entraîne.** Un atome n'émet et n'absorbe que des photons dont l'énergie correspond **exactement** à un écart entre deux de ses niveaux. Tous les autres passent sans rien faire.",
        "**Pourquoi c'est si utile.** Chaque élément a ses propres niveaux, donc son propre jeu de raies. C'est ainsi qu'on identifie la composition d'une étoile à des années-lumière, rien qu'en analysant sa lumière."],
  indice:"Le mot vient de « quantité » : l'énergie ne vient que par quantités déterminées."}
]
}

]);
