/* =====================================================================
   Programme — Spécialité physique-chimie, classe de Première générale
   Partie « Constitution et transformations de la matière » (1/2)
   Blocs disponibles : p, idee, piege, astuce, formule, liste, tbl,
                       exemple, check, fig, figi, mb
   ===================================================================== */
window.COURS = (window.COURS || []).concat([

/* ============== 1. MODÉLISER UNE TRANSFORMATION ============== */
{
id:"transformation", n:1, titre:"Modéliser une transformation chimique",
sous:"Compter ce qui disparaît et ce qui apparaît",
desc:"Équation de réaction, quantité de matière, tableau d'avancement et réactif limitant.",
duree:40,
sections:[
 {titre:"Une transformation, c'est un système qui change d'état", blocs:[
  {t:"idee", x:"Une transformation chimique, c'est le passage d'un **état initial** à un **état final** : certaines espèces disparaissent, d'autres apparaissent, mais **les atomes, eux, ne disparaissent jamais**."},
  {t:"p", x:"Quand tu fais brûler du carbone dans l'air, tu n'as pas fait disparaître le carbone. Tu l'as **réarrangé** : chaque atome de carbone s'est associé à deux atomes d'oxygène pour former du dioxyde de carbone. Rien ne s'est perdu, rien ne s'est créé — les briques ont seulement changé d'assemblage. C'est l'idée fondatrice de toute la chimie, et elle date de Lavoisier."},
  {t:"p", x:"Pour décrire proprement ce qui se passe, les chimistes délimitent d'abord un **système** : ce qu'on met dans le bécher, et rien d'autre. Puis ils en décrivent deux photographies."},
  {t:"liste", items:[
   "**L'état initial** : quelles espèces sont présentes avant, et en quelle quantité.",
   "**L'état final** : quelles espèces restent à la fin, et en quelle quantité.",
   "Entre les deux, la **transformation**, qu'on modélise par une **réaction chimique** — c'est-à-dire par une équation."
  ]},
  {t:"p", x:"Le mot « modélise » est important. La réaction est un modèle, une écriture simplifiée. Dans le bécher, il se passe des milliards de chocs entre molécules ; l'équation, elle, résume tout cela en une ligne qui dit seulement ce qui est consommé et ce qui est produit, et dans quelles proportions."},
  {t:"fig", titre:"Les atomes se réarrangent, ils ne disparaissent pas",
   vue:[0,0,10,4], w:440, h:190, grille:false, axes:false,
   objets:[
    {t:"atome", x:1, y:3, nom:"H", couleur:"bleu"},
    {t:"atome", x:2, y:3, nom:"H", couleur:"bleu"},
    {t:"liaison", de:[1,3], a:[2,3], marge:13},
    {t:"atome", x:1, y:1.4, nom:"H", couleur:"bleu"},
    {t:"atome", x:2, y:1.4, nom:"H", couleur:"bleu"},
    {t:"liaison", de:[1,1.4], a:[2,1.4], marge:13},
    {t:"texte", x:3, y:2.2, txt:"+", taille:18},
    {t:"atome", x:3.9, y:2.2, nom:"O", couleur:"rouge"},
    {t:"atome", x:5, y:2.2, nom:"O", couleur:"rouge"},
    {t:"liaison", de:[3.9,2.2], a:[5,2.2], n:2, marge:13},
    {t:"vec", de:[5.8,2.2], a:[6.9,2.2], couleur:"ink3"},
    {t:"atome", x:7.6, y:3, nom:"H", couleur:"bleu"},
    {t:"atome", x:8.6, y:3, nom:"O", couleur:"rouge"},
    {t:"atome", x:9.6, y:3, nom:"H", couleur:"bleu"},
    {t:"liaison", de:[7.6,3], a:[8.6,3], marge:13},
    {t:"liaison", de:[8.6,3], a:[9.6,3], marge:13},
    {t:"atome", x:7.6, y:1.4, nom:"H", couleur:"bleu"},
    {t:"atome", x:8.6, y:1.4, nom:"O", couleur:"rouge"},
    {t:"atome", x:9.6, y:1.4, nom:"H", couleur:"bleu"},
    {t:"liaison", de:[7.6,1.4], a:[8.6,1.4], marge:13},
    {t:"liaison", de:[8.6,1.4], a:[9.6,1.4], marge:13}
   ],
   note:"Quatre H et deux O à gauche ; quatre H et deux O à droite. Les liaisons ont changé, pas les atomes."},
  {t:"p", x:"Compte les atomes sur la figure. À gauche : quatre hydrogènes et deux oxygènes. À droite : exactement les mêmes. Ce comptage, c'est tout ce que signifie « ajuster une équation »."},
  {t:"piege", titre:"Ne confonds pas transformation et changement d'état", x:"L'eau qui bout devient de la vapeur, mais reste $@c{H_2O}$ : c'est un **changement d'état physique**, pas une transformation chimique. Il y a transformation chimique seulement si de **nouvelles espèces** apparaissent."}
 ]},

 {titre:"L'équation de réaction, et comment l'ajuster", blocs:[
  {t:"p", x:"Une équation de réaction s'écrit avec les **réactifs** à gauche, les **produits** à droite, et une flèche entre les deux. Devant chaque formule, un nombre appelé **nombre stœchiométrique** indique dans quelles proportions les espèces réagissent."},
  {t:"formule", titre:"La forme générale", x:"$a$ @c{A} $+$ $b$ @c{B} $→$ $c$ @c{C} $+$ $d$ @c{D}", note:"Les lettres $a$, $b$, $c$, $d$ sont les nombres stœchiométriques. Quand un nombre vaut 1, on ne l'écrit pas."},
  {t:"p", x:"Ajuster une équation, c'est trouver ces nombres pour que **chaque élément soit en même quantité des deux côtés**. Deux règles, et deux seulement :"},
  {t:"liste", items:[
   "**Conservation des éléments** : autant d'atomes de chaque sorte à gauche qu'à droite.",
   "**Conservation de la charge** : la somme des charges est la même des deux côtés (utile pour les équations avec des ions)."
  ]},
  {t:"piege", titre:"L'erreur qui coûte le plus cher", x:"On ajuste **uniquement en changeant les nombres devant les formules**. On ne touche jamais aux indices dans les formules. Écrire $@c{H_2O_2}$ au lieu de $2$ $@c{H_2O}$ ne rééquilibre pas l'équation : ça change la substance ! $@c{H_2O}$ est de l'eau, $@c{H_2O_2}$ est de l'eau oxygénée."},
  {t:"exemple", titre:"Exemple guidé — ajuster la combustion du méthane", enonce:"Ajuster : $@c{CH_4} + @c{O_2} → @c{CO_2} + @c{H_2O}$", etapes:[
   {q:"Par quoi commencer ?", r:"Par l'élément qui apparaît dans **le moins de formules**, et on garde l'oxygène pour la fin : il est presque toujours partout. Ici, on commence par le carbone."},
   {q:"Le carbone", r:"Un atome de C à gauche (dans $@c{CH_4}$), un à droite (dans $@c{CO_2}$). C'est déjà équilibré."},
   {q:"L'hydrogène", r:"Quatre H à gauche, seulement deux à droite. Je mets un 2 devant l'eau : $@c{CH_4} + @c{O_2} → @c{CO_2} + 2 @c{H_2O}$. Maintenant quatre H de chaque côté."},
   {q:"L'oxygène, en dernier", r:"À droite : 2 dans $@c{CO_2}$ et 2 dans les deux $@c{H_2O}$, soit 4 au total. À gauche, chaque $@c{O_2}$ en apporte 2 : il en faut donc 2."},
   {q:"Équation finale", r:"$@c{CH_4} + 2 @c{O_2} → @c{CO_2} + 2 @c{H_2O}$. Vérification : 1 C, 4 H, 4 O de chaque côté. C'est bon."}
  ]},
  {t:"astuce", titre:"L'ordre qui fait gagner du temps", x:"Ajuste dans cet ordre : le **carbone**, puis l'**hydrogène**, puis l'**oxygène** en dernier. L'oxygène est presque toujours l'élément le plus répandu dans l'équation : le laisser pour la fin évite de tout recommencer."},
  {t:"check", q:"Dans l'équation ajustée $@c{C_3H_8} + 5 @c{O_2} → 3 @c{CO_2} + 4 @c{H_2O}$, combien y a-t-il d'atomes d'oxygène à droite ?",
   choix:["10","7","6","5"], bonne:0,
   expl:["Exact : $3 × 2 = 6$ dans les $@c{CO_2}$, plus $4 × 1 = 4$ dans les $@c{H_2O}$, soit 10. C'est bien ce qu'apportent les 5 $@c{O_2}$ de gauche.",
         "Tu as compté les molécules ($3 + 4 = 7$), pas les atomes d'oxygène. Chaque $@c{CO_2}$ en contient deux.",
         "Tu n'as compté que l'oxygène du $@c{CO_2}$. L'eau en contient aussi, un par molécule.",
         "5 est le nombre de molécules de dioxygène à **gauche**. Elles apportent $5 × 2 = 10$ atomes d'oxygène."]}
 ]},

 {titre:"Compter les entités : la mole", blocs:[
  {t:"idee", x:"Un chimiste ne peut pas compter les molécules une par une : il y en a des milliards de milliards. Il les compte donc **par paquets**. Le paquet s'appelle la **mole**, et il contient toujours le même nombre d'entités."},
  {t:"p", x:"C'est exactement l'idée de la douzaine, mais à une autre échelle. Une douzaine d'œufs, c'est 12 œufs ; une mole de molécules d'eau, c'est $6{,}02 × 10^{23}$ molécules d'eau. Ce nombre porte un nom : la **constante d'Avogadro**, notée $N_A$."},
  {t:"formule", titre:"Les trois formules de la quantité de matière",
   x:"$n = @f{m}{M}$ &nbsp;·&nbsp; $n = C × V$ &nbsp;·&nbsp; $n = @f{V}{V_m}$",
   note:"$n$ en @u{mol} · $m$ en @u{g} · $M$ en @u{g/mol} · $C$ en @u{mol/L} · $V$ en @u{L} · $V_m$ en @u{L/mol} (gaz)"},
  {t:"p", x:"Ces trois formules répondent à la même question — « combien d'entités ai-je ? » — mais à partir de trois informations différentes. La première part d'une **masse** pesée sur une balance. La deuxième part d'une **solution** dont on connaît la concentration. La troisième part d'un **volume de gaz**. Choisir la bonne formule, c'est simplement regarder de quelle donnée on dispose."},
  {t:"tbl", head:["Ce que l'énoncé donne","La formule à utiliser","Piège d'unité"], rows:[
   ["Une masse en grammes","$n = @f{m}{M}$","$M$ se lit dans le tableau périodique, en @u{g/mol}"],
   ["Un volume de solution et sa concentration","$n = C × V$","$V$ doit être en **litres**, pas en @u{mL}"],
   ["Un volume de gaz","$n = @f{V}{V_m}$","$V_m ≈ 24{,}0$ @u{L/mol} dans les conditions usuelles"],
   ["Un nombre d'entités","$n = @f{N}{N_A}$","$N_A = 6{,}02 × 10^{23}$ @u{mol⁻¹}"]
  ]},
  {t:"piege", titre:"Le piège des millilitres", x:"C'est l'erreur la plus fréquente de toute la chimie de Première. Dans $n = C × V$, le volume est en **litres**. $250$ @u{mL} $= 0{,}250$ @u{L}. Si tu tapes 250 dans ta calculatrice, ton résultat sera **mille fois trop grand**, et tu trouveras des quantités de matière absurdes."},
  {t:"exemple", titre:"Exemple guidé — trois calculs de quantité de matière", enonce:"Calculer la quantité de matière dans : (a) $5{,}85$ @u{g} de sel $@c{NaCl}$ ($M = 58{,}5$ @u{g/mol}) ; (b) $50$ @u{mL} d'une solution à $0{,}20$ @u{mol/L} ; (c) $12{,}0$ @u{L} de gaz ($V_m = 24{,}0$ @u{L/mol}).", etapes:[
   {q:"(a) Quelle formule ?", r:"On me donne une masse et une masse molaire : $n = @f{m}{M} = @f{5{,}85}{58{,}5} = 0{,}100$ @u{mol}."},
   {q:"(b) Quelle formule ?", r:"On me donne un volume de solution et une concentration : $n = C × V$. Je convertis d'abord : $50$ @u{mL} $= 0{,}050$ @u{L}."},
   {q:"(b) Le calcul", r:"$n = 0{,}20 × 0{,}050 = 0{,}010$ @u{mol}, soit $10$ @u{mmol}."},
   {q:"(c) Quelle formule ?", r:"On me donne un volume de gaz : $n = @f{V}{V_m} = @f{12{,}0}{24{,}0} = 0{,}500$ @u{mol}."},
   {q:"Ce qu'il faut retenir", r:"La difficulté n'est jamais le calcul : c'est de **reconnaître quelle donnée on a**. Masse → division par $M$. Solution → multiplication par $V$ en litres. Gaz → division par $V_m$."}
  ]},
  {t:"astuce", titre:"Le contrôle d'ordre de grandeur", x:"En chimie de laboratoire, les quantités de matière tournent presque toujours autour de $10^{-3}$ à $1$ @u{mol}. Si tu trouves $500$ @u{mol} ou $10^{-9}$ @u{mol}, tu as presque sûrement oublié une conversion d'unité."}
 ]},

 {titre:"L'avancement : une seule inconnue pour tout suivre", blocs:[
  {t:"idee", x:"L'**avancement**, noté $x$, est le nombre de « paquets de réaction » qui ont eu lieu. Il se mesure en moles. Une seule inconnue suffit à décrire l'état du système à n'importe quel moment."},
  {t:"p", x:"Voilà l'idée, et elle est très économique. Prends l'équation $@c{N_2} + 3 @c{H_2} → 2 @c{NH_3}$. Elle dit : « chaque fois que la réaction avance d'un cran, une mole de $@c{N_2}$ et trois moles de $@c{H_2}$ disparaissent, et deux moles de $@c{NH_3}$ apparaissent ». Si la réaction a avancé de $x$ crans, alors il a disparu $1×x$ mole de $@c{N_2}$, $3×x$ moles de $@c{H_2}$, et il s'est formé $2×x$ moles de $@c{NH_3}$."},
  {t:"p", x:"Autrement dit : **les nombres stœchiométriques deviennent les multiplicateurs de $x$**. C'est tout le secret du tableau d'avancement. Un réactif voit sa quantité diminuer de son coefficient fois $x$ ; un produit voit la sienne augmenter de son coefficient fois $x$."},
  {t:"formule", titre:"La règle du tableau",
   x:"réactif : $n = n_{initial} - ν × x$ &nbsp;&nbsp;·&nbsp;&nbsp; produit : $n = n_{initial} + ν × x$",
   note:"$ν$ (nu) est le nombre stœchiométrique de l'espèce dans l'équation ajustée."},
  {t:"p", x:"On range tout cela dans un tableau à trois lignes : l'état initial, l'état intermédiaire (celui qui contient $x$), et l'état final (celui qui contient $x_{max}$). Voici celui de la synthèse de l'ammoniac, avec $2{,}0$ @u{mol} de diazote et $9{,}0$ @u{mol} de dihydrogène au départ."},
  {t:"tbl", head:["État","Avancement","$@c{N_2}$","$3 @c{H_2}$","$2 @c{NH_3}$"], rows:[
   ["Initial","$0$","$2{,}0$","$9{,}0$","$0$"],
   ["En cours","$x$","$2{,}0 - x$","$9{,}0 - 3x$","$0 + 2x$"],
   ["Final","$x_{max}$","$2{,}0 - x_{max}$","$9{,}0 - 3x_{max}$","$2x_{max}$"]
  ]},
  {t:"piege", titre:"Le coefficient ne s'oublie pas", x:"Dans la colonne du $@c{H_2}$, on écrit $9{,}0 - 3x$ et non $9{,}0 - x$. Le 3 de l'équation dit que le dihydrogène est consommé **trois fois plus vite** que le diazote. Oublier ce facteur est l'erreur numéro un des tableaux d'avancement."},
  {t:"check", q:"Pour la réaction $2 @c{Al} + 3 @c{Cl_2} → 2 @c{AlCl_3}$, on part de $0{,}80$ @u{mol} d'aluminium. Quelle est la quantité d'aluminium restante à l'avancement $x$ ?",
   choix:["$0{,}80 - 2x$","$0{,}80 - x$","$0{,}80 + 2x$","$0{,}80 - 3x$"], bonne:0,
   expl:["Exact. L'aluminium est un réactif (donc on soustrait) et son nombre stœchiométrique est 2 (donc on soustrait $2x$).",
         "Tu as oublié le coefficient 2 devant $@c{Al}$. À chaque cran de réaction, ce sont **deux** moles d'aluminium qui partent.",
         "Le signe est faux : l'aluminium est un réactif, il est consommé. Sa quantité **diminue**.",
         "Le 3 est le coefficient du dichlore, pas celui de l'aluminium. Chaque espèce a le sien."]}
 ]},

 {titre:"Le réactif limitant : celui qui s'épuise le premier", blocs:[
  {t:"idee", x:"La réaction s'arrête quand **le premier réactif est entièrement consommé**. Ce réactif s'appelle le **réactif limitant**, et c'est lui qui fixe la valeur maximale de l'avancement, $x_{max}$."},
  {t:"p", x:"Une image : pour faire un sandwich il faut deux tranches de pain et une tranche de jambon. Avec dix tranches de pain et trois de jambon, tu ne feras pas cinq sandwichs mais **trois** : le jambon est limitant. Le pain restant ne sert à rien — il est en excès."},
  {t:"formule", titre:"Comment trouver le réactif limitant",
   x:"On compare $@f{n_{initial}}{ν}$ pour chaque réactif. **Le plus petit quotient désigne le limitant.**",
   note:"Et alors $x_{max}$ est justement égal à ce plus petit quotient."},
  {t:"p", x:"Pourquoi diviser par $ν$ ? Parce que comparer directement les quantités de matière serait injuste : un réactif consommé trois fois plus vite peut s'épuiser le premier même s'il était le plus abondant au départ. Diviser par le coefficient remet tout le monde à la même échelle — celle du nombre de crans de réaction que chacun peut alimenter."},
  {t:"exemple", titre:"Exemple guidé — qui limite, et jusqu'où ?", enonce:"On mélange $0{,}80$ @u{mol} d'aluminium et $0{,}90$ @u{mol} de dichlore selon $2 @c{Al} + 3 @c{Cl_2} → 2 @c{AlCl_3}$. Trouver le réactif limitant, $x_{max}$, et la quantité de $@c{AlCl_3}$ formée.", etapes:[
   {q:"Le quotient pour l'aluminium", r:"$@f{n(@c{Al})}{2} = @f{0{,}80}{2} = 0{,}40$."},
   {q:"Le quotient pour le dichlore", r:"$@f{n(@c{Cl_2})}{3} = @f{0{,}90}{3} = 0{,}30$."},
   {q:"Qui limite ?", r:"$0{,}30 < 0{,}40$ : c'est le **dichlore** qui s'épuise le premier, même s'il était initialement le plus abondant. Donc $x_{max} = 0{,}30$ @u{mol}."},
   {q:"Le produit formé", r:"$n(@c{AlCl_3}) = 2 × x_{max} = 2 × 0{,}30 = 0{,}60$ @u{mol}."},
   {q:"Ce qui reste d'aluminium", r:"$n(@c{Al}) = 0{,}80 - 2 × 0{,}30 = 0{,}80 - 0{,}60 = 0{,}20$ @u{mol}. Il en reste : l'aluminium était en excès."},
   {q:"Le contrôle final", r:"Le réactif limitant doit tomber **exactement** à zéro : $0{,}90 - 3 × 0{,}30 = 0$. C'est bon. Si aucune quantité ne tombe à zéro, c'est que $x_{max}$ est faux."}
  ]},
  {t:"fig", titre:"Comment les quantités évoluent avec l'avancement",
   vue:[0,0,0.45,1.05], w:430, h:290, libre:true, grille:false, axes:false,
   objets:[
    {t:"axes", x0:0, y0:0, ax:"avancement x (mol)", ay:"n (mol)"},
    {t:"courbeXY", pts:[[0,0.80],[0.30,0.20]], couleur:"bleu"},
    {t:"courbeXY", pts:[[0,0.90],[0.30,0.0]], couleur:"rouge"},
    {t:"courbeXY", pts:[[0,0],[0.30,0.60]], couleur:"vert"},
    {t:"seg", de:[0.30,0], a:[0.30,0.90], couleur:"line2", pointille:true},
    {t:"texte", x:0.36, y:0.24, txt:"Al (excès)", couleur:"bleu"},
    {t:"texte", x:0.36, y:0.04, txt:"Cl₂ (limitant)", couleur:"rouge"},
    {t:"texte", x:0.355, y:0.63, txt:"AlCl₃", couleur:"vert"},
    {t:"texte", x:0.30, y:0.96, txt:"x max", couleur:"ink3"}
   ],
   note:"La réaction s'arrête au trait pointillé : c'est là que la courbe rouge touche zéro. Au-delà, plus rien n'est possible."},
  {t:"p", x:"Cette figure résume tout le chapitre. Trois droites : les réactifs descendent, le produit monte, et tout s'arrête à l'instant où la première droite touche l'axe. L'aluminium, lui, s'arrête à $0{,}20$ @u{mol} : c'est ce qui reste dans le bécher à la fin, inutilisé."},
  {t:"astuce", titre:"Le cas des proportions stœchiométriques", x:"Si les deux quotients sont **égaux**, les deux réactifs disparaissent en même temps. On dit que le mélange est **stœchiométrique** : c'est le mélange le plus économique, il ne laisse aucun reste."}
 ]},

 {titre:"Récapitulatif : la méthode en quatre gestes", blocs:[
  {t:"idee", x:"Presque tous les exercices de ce chapitre se résolvent avec la même suite de quatre gestes, toujours dans le même ordre. Se tromper d'ordre, c'est ce qui fait perdre du temps."},
  {t:"liste", items:[
   "**1. Écrire l'équation ajustée.** Sans elle, aucun coefficient n'est disponible et tout le reste est faux.",
   "**2. Calculer les quantités de matière initiales**, en convertissant les unités ($@u{mL} → @u{L}$, $@u{mg} → @u{g}$).",
   "**3. Dresser le tableau d'avancement**, en n'oubliant aucun coefficient devant le $x$.",
   "**4. Chercher le réactif limitant** avec les quotients $@f{n}{ν}$, en déduire $x_{max}$, puis répondre à la question posée."
  ]},
  {t:"tbl", head:["La question ressemble à…","Ce qu'il faut faire"], rows:[
   ["« Ajuster l'équation »","Compter les atomes, C puis H puis O"],
   ["« Quelle quantité de matière ? »","Choisir entre $@f{m}{M}$, $C×V$ et $@f{V}{V_m}$"],
   ["« Quel est le réactif limitant ? »","Comparer les quotients $@f{n}{ν}$, prendre le plus petit"],
   ["« Quelle masse de produit ? »","Trouver $x_{max}$, puis $n = ν x_{max}$, puis $m = n × M$"],
   ["« Que reste-t-il de … ? »","$n_{initial} - ν x_{max}$ pour cette espèce"]
  ]},
  {t:"piege", titre:"Les trois erreurs les plus coûteuses", x:"**1. Le volume en millilitres** dans $n = C×V$. Facteur 1000 sur tout le reste de l'exercice.<br>**2. Le coefficient oublié** dans le tableau : $n - x$ au lieu de $n - 3x$.<br>**3. Le réactif limitant choisi « au plus petit $n$ »** sans diviser par le coefficient. C'est faux dès que les coefficients diffèrent."},
  {t:"astuce", titre:"La vérification qui ne coûte rien", x:"À la fin, remplace $x_{max}$ dans la ligne du réactif limitant : tu dois trouver **exactement zéro**. Si ce n'est pas zéro, l'erreur est en amont — inutile de continuer."}
 ]}
],
exos:[
 {id:"tr1", niveau:1, type:"num", enonce:"Quelle quantité de matière y a-t-il dans $9{,}0$ @u{g} d'eau ? On donne $M(@c{H_2O}) = 18{,}0$ @u{g/mol}.",
  rep:0.5, tol:0.005, unite:"mol",
  diag:[{v:162, m:"Tu as multiplié la masse par la masse molaire. La masse molaire est une masse **par mole** : pour savoir combien de moles il y a, on divise. $n = @f{m}{M}$."},
        {v:2, m:"Tu as calculé $@f{M}{m}$, la division à l'envers. Retiens le sens : une masse molaire de $18$ @u{g/mol} veut dire « $18$ @u{g} pour une mole », donc $9$ @u{g} c'est une demi-mole."},
        {v:9, m:"Tu as recopié la masse. La masse est en grammes, la quantité de matière en moles : il faut passer de l'une à l'autre par une division."}],
  corr:["La donnée est une masse, et on connaît la masse molaire : la formule est $n = @f{m}{M}$.",
        "Je remplace : $n = @f{9{,}0}{18{,}0}$.",
        "$n = 0{,}50$ @u{mol}.",
        "Contrôle : $18$ @u{g} feraient une mole, $9$ @u{g} en font donc la moitié. Cohérent."],
  indice:"Une masse et une masse molaire : la quantité de matière s'obtient en divisant l'une par l'autre."},

 {id:"tr2", niveau:1, type:"qcm", enonce:"Quelle est l'équation correctement ajustée de la combustion du propane $@c{C_3H_8}$ dans le dioxygène ?",
  choix:["$@c{C_3H_8} + 5 @c{O_2} → 3 @c{CO_2} + 4 @c{H_2O}$",
         "$@c{C_3H_8} + @c{O_2} → 3 @c{CO_2} + 4 @c{H_2O}$",
         "$@c{C_3H_8} + 5 @c{O_2} → @c{CO_2} + @c{H_2O}$",
         "$@c{C_3H_8} + 7 @c{O_2} → 3 @c{CO_2} + 4 @c{H_2O}$"], bonne:0,
  diag:["",
        "Le carbone et l'hydrogène sont bien ajustés, mais pas l'oxygène : il en faut 10 à droite ($3×2 + 4×1$) et un seul $@c{O_2}$ n'en apporte que 2. Il faut 5 $@c{O_2}$.",
        "Tu as ajusté l'oxygène de gauche sans ajuster les produits. À droite il n'y a qu'un carbone alors qu'il y en a trois dans le propane : le carbone ne se conserve pas.",
        "Compte l'oxygène à droite : $3 × 2 = 6$ dans les $@c{CO_2}$, plus $4$ dans les $@c{H_2O}$, soit 10. Il faut donc $10 ÷ 2 = 5$ molécules de $@c{O_2}$, pas 7."],
  corr:["Je commence par le carbone : 3 à gauche, donc 3 $@c{CO_2}$ à droite.",
        "Puis l'hydrogène : 8 à gauche, donc 4 $@c{H_2O}$ à droite (car chaque eau contient 2 H).",
        "L'oxygène en dernier : à droite, $3×2 + 4×1 = 10$ atomes.",
        "Chaque $@c{O_2}$ apporte 2 atomes, il en faut donc $10 ÷ 2 = 5$."],
  indice:"Ajuste dans l'ordre : carbone, hydrogène, puis oxygène en dernier."},

 {id:"tr3", niveau:1, type:"num", enonce:"On prélève $250$ @u{mL} d'une solution de concentration $0{,}20$ @u{mol/L}. Quelle quantité de matière a-t-on prélevée ?",
  rep:0.05, tol:0.0005, unite:"mol",
  diag:[{v:50, m:"Tu as gardé le volume en millilitres. Dans $n = C × V$, le volume doit être en **litres** : $250$ @u{mL} $= 0{,}250$ @u{L}. Ton résultat est mille fois trop grand."},
        {v:1250, m:"Tu as divisé le volume par la concentration. La formule est une multiplication : $n = C × V$."},
        {v:0.0008, m:"Tu as divisé la concentration par le volume. Souviens-toi du sens : une concentration, c'est un nombre de moles **par litre** ; on la multiplie donc par le nombre de litres."}],
  corr:["La donnée est un volume de solution et une concentration : $n = C × V$.",
        "Je convertis d'abord : $250$ @u{mL} $= 0{,}250$ @u{L}.",
        "$n = 0{,}20 × 0{,}250$.",
        "$n = 0{,}050$ @u{mol}, soit $50$ @u{mmol}."],
  indice:"Convertis le volume en litres **avant** de multiplier."},

 {id:"tr4", niveau:2, type:"num", enonce:"On mélange $0{,}30$ @u{mol} de fer et $0{,}20$ @u{mol} de soufre selon $@c{Fe} + @c{S} → @c{FeS}$. Quelle est la valeur de l'avancement maximal $x_{max}$ ?",
  rep:0.2, tol:0.005, unite:"mol",
  diag:[{v:0.3, m:"Tu as pris la quantité du fer. Mais le fer est en excès : la réaction s'arrête quand le **premier** réactif est épuisé, donc au plus petit des deux quotients."},
        {v:0.5, m:"Tu as additionné les deux quantités. L'avancement n'est pas une somme : c'est le nombre de fois où la réaction peut avoir lieu, limité par le réactif le moins fourni."},
        {v:0.1, m:"Tu as fait la différence $0{,}30 - 0{,}20$. Cette différence est ce qui **reste** de fer à la fin, pas l'avancement."}],
  corr:["Les deux coefficients valent 1, je compare donc directement les quantités.",
        "$@f{n(@c{Fe})}{1} = 0{,}30$ et $@f{n(@c{S})}{1} = 0{,}20$.",
        "Le plus petit quotient est celui du soufre : le soufre est limitant.",
        "Donc $x_{max} = 0{,}20$ @u{mol}. Vérification : $0{,}20 - 0{,}20 = 0$, le soufre est bien entièrement consommé."],
  indice:"Compare $@f{n}{ν}$ pour chaque réactif et garde le plus petit."},

 {id:"tr5", niveau:2, type:"num", enonce:"Même mélange que précédemment ($0{,}30$ @u{mol} de fer, $0{,}20$ @u{mol} de soufre, $@c{Fe} + @c{S} → @c{FeS}$). Quelle quantité de fer reste-t-il à l'état final ?",
  rep:0.1, tol:0.005, unite:"mol",
  diag:[{v:0, m:"Le fer n'est pas le réactif limitant : c'est le soufre qui s'épuise le premier. Le fer, lui, est en excès, il en reste donc à la fin."},
        {v:0.2, m:"$0{,}20$ @u{mol} est la valeur de $x_{max}$, c'est-à-dire ce qui a été **consommé**. La question porte sur ce qui **reste**."},
        {v:0.3, m:"$0{,}30$ @u{mol} est la quantité initiale de fer. Une partie a réagi : il faut la retrancher."}],
  corr:["Le tableau donne, pour le fer : $n = n_{initial} - x$.",
        "On a trouvé $x_{max} = 0{,}20$ @u{mol}.",
        "$n(@c{Fe}) = 0{,}30 - 0{,}20$.",
        "Il reste $0{,}10$ @u{mol} de fer, qui n'a pas réagi faute de soufre."],
  indice:"Reprends la ligne du fer dans le tableau d'avancement et remplace $x$ par $x_{max}$."},

 {id:"tr6", niveau:2, type:"qcm", enonce:"On mélange $0{,}80$ @u{mol} d'aluminium et $0{,}90$ @u{mol} de dichlore selon $2 @c{Al} + 3 @c{Cl_2} → 2 @c{AlCl_3}$. Quel est le réactif limitant ?",
  choix:["Le dichlore","L'aluminium","Aucun : le mélange est stœchiométrique","On ne peut pas savoir sans la masse molaire"], bonne:0,
  diag:["",
        "Attention : on ne compare pas les quantités brutes mais les quotients $@f{n}{ν}$. Pour l'aluminium $@f{0{,}80}{2} = 0{,}40$, pour le dichlore $@f{0{,}90}{3} = 0{,}30$. Le plus petit gagne, et c'est le dichlore — même s'il était plus abondant au départ.",
        "Le mélange serait stœchiométrique si les deux quotients étaient égaux. Ici $0{,}40 ≠ 0{,}30$ : l'un des deux s'épuise avant l'autre.",
        "Les masses molaires ne servent qu'à passer d'une masse à une quantité de matière. Ici les quantités sont déjà en moles : tout est disponible."],
  corr:["Pour chaque réactif, je calcule le quotient de sa quantité par son nombre stœchiométrique.",
        "Aluminium : $@f{0{,}80}{2} = 0{,}40$.",
        "Dichlore : $@f{0{,}90}{3} = 0{,}30$.",
        "Le plus petit quotient est celui du dichlore : c'est lui le réactif limitant, et $x_{max} = 0{,}30$ @u{mol}."],
  indice:"Un réactif consommé 3 fois plus vite peut s'épuiser le premier, même s'il est le plus abondant. Divise par le coefficient."},

 {id:"tr7", niveau:3, type:"num", enonce:"Le magnésium brûle selon $2 @c{Mg} + @c{O_2} → 2 @c{MgO}$. On fait brûler $2{,}4$ @u{g} de magnésium en excès de dioxygène. Quelle masse d'oxyde de magnésium obtient-on ? Données : $M(@c{Mg}) = 24{,}0$ @u{g/mol}, $M(@c{MgO}) = 40{,}0$ @u{g/mol}.",
  rep:4, tol:0.05, unite:"g",
  diag:[{v:2.4, m:"Tu as recopié la masse de magnésium. Mais l'oxyde formé contient en plus l'oxygène capté dans l'air : sa masse est forcément plus grande."},
        {v:0.1, m:"$0{,}10$ @u{mol} est la **quantité de matière** de magnésium, pas une masse. Il reste à la convertir avec $m = n × M$."},
        {v:8, m:"Tu as compté deux fois le produit. Le rapport est de 2 pour 2 entre $@c{Mg}$ et $@c{MgO}$ : une mole de magnésium donne **une** mole d'oxyde, pas deux."},
        {v:96, m:"Tu as multiplié par $M(@c{Mg})$ au lieu de diviser au départ. Vérifie l'ordre : d'abord $n = @f{m}{M}$, ensuite seulement $m = n × M$ avec la masse molaire du **produit**."}],
  corr:["Quantité de magnésium : $n(@c{Mg}) = @f{2{,}4}{24{,}0} = 0{,}10$ @u{mol}.",
        "Le dioxygène est en excès, donc c'est le magnésium qui limite : $x_{max} = @f{0{,}10}{2} = 0{,}050$ @u{mol}.",
        "Quantité d'oxyde formée : $n(@c{MgO}) = 2 × x_{max} = 2 × 0{,}050 = 0{,}10$ @u{mol}.",
        "Masse : $m = n × M = 0{,}10 × 40{,}0 = 4{,}0$ @u{g}."],
  indice:"Trois étapes : masse → quantité de matière, quantité → quantité de produit par le tableau, puis quantité → masse."},

 {id:"tr8", niveau:3, type:"num", enonce:"On fait réagir $0{,}15$ @u{mol} de carbonate de calcium avec un acide selon $@c{CaCO_3} + 2 @c{HCl} → @c{CaCl_2} + @c{H_2O} + @c{CO_2}$. L'acide est en excès. Quel volume de dioxyde de carbone se dégage ? On prend $V_m = 24{,}0$ @u{L/mol}.",
  rep:3.6, tol:0.05, unite:"L",
  diag:[{v:0.15, m:"$0{,}15$ @u{mol} est la quantité de gaz formé, pas son volume. Pour passer d'une quantité de gaz à un volume, on multiplie par le volume molaire : $V = n × V_m$."},
        {v:0.00625, m:"Tu as divisé par $V_m$ au lieu de multiplier. La règle de sens : une mole de gaz occupe $24$ @u{L}, donc plus il y a de moles, plus le volume est grand."},
        {v:7.2, m:"Tu as doublé le résultat, sans doute à cause du 2 devant $@c{HCl}$. Ce coefficient concerne l'acide, pas le dioxyde de carbone : celui-ci a un coefficient 1."},
        {v:1.8, m:"Tu as divisé par 2. Le carbonate et le dioxyde de carbone ont tous deux un coefficient 1 : une mole de carbonate donne une mole de gaz."}],
  corr:["L'acide est en excès : c'est le carbonate qui limite, donc $x_{max} = 0{,}15$ @u{mol}.",
        "Le coefficient du $@c{CO_2}$ vaut 1 : $n(@c{CO_2}) = x_{max} = 0{,}15$ @u{mol}.",
        "Volume d'un gaz : $V = n × V_m = 0{,}15 × 24{,}0$.",
        "$V = 3{,}6$ @u{L}."],
  indice:"Deux temps : le tableau d'avancement donne la quantité de gaz, puis $V = n × V_m$ donne son volume."}
]
},

/* ======= 2. SUIVRE UNE TRANSFORMATION PAR LA MESURE ======= */
{
id:"mesures", n:2, titre:"Suivre une transformation par la mesure",
sous:"Faire parler une couleur et une conductivité",
desc:"Spectrophotométrie, loi de Beer-Lambert, conductimétrie et droite d'étalonnage.",
duree:35,
sections:[
 {titre:"Pourquoi mesurer plutôt que peser", blocs:[
  {t:"idee", x:"On ne peut pas peser une espèce dissoute au milieu d'une solution. On mesure donc une **grandeur physique** qui dépend de sa concentration — une couleur, une conductivité — puis on remonte à la concentration."},
  {t:"p", x:"Imagine un sirop de menthe. Plus tu en mets dans l'eau, plus le vert est intense. Ton œil fait déjà, sans le savoir, une mesure : il associe une intensité de couleur à une concentration. Le spectrophotomètre ne fait rien d'autre, en beaucoup plus précis et en chiffres."},
  {t:"p", x:"L'avantage est décisif : la mesure est **non destructive** et **rapide**. On peut donc suivre une transformation minute par minute, sans arrêter la réaction ni prélever de matière. C'est comme ça qu'on trace l'évolution d'un système au cours du temps."},
  {t:"liste", items:[
   "L'espèce est **colorée** → spectrophotométrie (on mesure l'absorbance).",
   "L'espèce est **ionique** → conductimétrie (on mesure la conductivité de la solution).",
   "Dans les deux cas, la grandeur mesurée est **proportionnelle à la concentration**, dans un certain domaine."
  ]}
 ]},

 {titre:"La spectrophotométrie et la loi de Beer-Lambert", blocs:[
  {t:"p", x:"Un spectrophotomètre envoie un faisceau de lumière d'une couleur bien choisie à travers la solution, et compare ce qui entre à ce qui sort. La grandeur mesurée s'appelle l'**absorbance**, notée $A$. Elle n'a pas d'unité."},
  {t:"fig", titre:"Le trajet de la lumière dans la cuve",
   vue:[0,0,10,4], w:440, h:180, grille:false, axes:false,
   objets:[
    {t:"rect", x:0.3, y:1.2, w:1.4, h:1.6, couleur:"ambre", nom:"source"},
    {t:"rayon", de:[1.9,2], a:[3.6,2], couleur:"ambre"},
    {t:"rect", x:3.7, y:0.9, w:2.2, h:2.2, couleur:"vert", opacite:.3, nom:"cuve"},
    {t:"rayon", de:[6.0,2], a:[7.6,2], couleur:"ambre", epais:1.2},
    {t:"rect", x:7.7, y:1.2, w:2, h:1.6, couleur:"bleu", nom:"capteur"},
    {t:"texte", x:2.7, y:3.45, txt:"lumière entrante", couleur:"ink3", taille:11.5},
    {t:"texte", x:6.9, y:3.45, txt:"sortie affaiblie", couleur:"ink3", taille:11.5},
    {t:"texte", x:4.8, y:0.45, txt:"largeur ℓ", couleur:"ink2", taille:12}
   ],
   note:"Plus la solution est concentrée, plus la lumière ressort affaiblie : c'est cet affaiblissement que mesure l'absorbance."},
  {t:"formule", titre:"Loi de Beer-Lambert", x:"$A = k × C$", note:"$A$ sans unité · $C$ en @u{mol/L} · $k$ dépend de l'espèce, de la longueur d'onde et de la largeur de la cuve."},
  {t:"p", x:"C'est une simple **proportionnalité** : si tu doubles la concentration, tu doubles l'absorbance. Toute la difficulté pratique tient dans le coefficient $k$, qui n'est jamais donné : il faut le déterminer soi-même, avec une droite d'étalonnage."},
  {t:"piege", titre:"La couleur choisie n'est pas celle de la solution", x:"Une solution **bleue** absorbe surtout l'**orange** : elle nous paraît bleue justement parce qu'elle laisse passer le bleu. On règle donc l'appareil sur la longueur d'onde de la couleur **complémentaire**, celle qui est le plus absorbée — c'est là que la mesure est la plus sensible."},
  {t:"tbl", head:["Couleur de la solution","Couleur absorbée","Longueur d'onde de travail"], rows:[
   ["Bleue","Orange","≈ $600$ @u{nm}"],
   ["Verte","Rouge","≈ $650$ @u{nm}"],
   ["Jaune","Violet","≈ $420$ @u{nm}"],
   ["Rose / magenta","Vert","≈ $520$ @u{nm}"]
  ]}
 ]},

 {titre:"La droite d'étalonnage : la méthode reine", blocs:[
  {t:"idee", x:"Étalonner, c'est **fabriquer soi-même des solutions dont on connaît la concentration**, mesurer leur absorbance, et tracer la droite obtenue. Cette droite sert ensuite de règle de conversion pour n'importe quelle solution inconnue."},
  {t:"p", x:"La démarche est toujours la même, en trois temps."},
  {t:"liste", items:[
   "**Préparer une gamme** : cinq ou six solutions de concentrations connues, obtenues par dilution d'une solution mère.",
   "**Mesurer** l'absorbance de chacune, puis placer les points $(C ; A)$ sur un graphique.",
   "**Tracer la droite moyenne** passant par l'origine, puis y lire la concentration inconnue à partir de son absorbance."
  ]},
  {t:"fig", titre:"Lire une concentration sur la droite d'étalonnage",
   vue:[0,0,5.2,1.05], w:430, h:300, libre:true, grille:false, axes:false,
   objets:[
    {t:"axes", x0:0, y0:0, ax:"C (mmol/L)", ay:"A"},
    {t:"courbeXY", pts:[[0,0],[1,0.18],[2,0.36],[3,0.54],[4,0.72]], couleur:"bleu", points:true},
    {t:"seg", de:[0,0.45], a:[2.5,0.45], couleur:"rouge", pointille:true},
    {t:"seg", de:[2.5,0.45], a:[2.5,0], couleur:"rouge", pointille:true},
    {t:"point", x:2.5, y:0.45, couleur:"rouge"},
    {t:"texte", x:0.75, y:0.52, txt:"A mesurée = 0,45", couleur:"rouge", taille:12},
    {t:"texte", x:3.3, y:0.10, txt:"C = 2,5 mmol/L", couleur:"rouge", taille:12}
   ],
   note:"On part de l'absorbance mesurée sur l'axe vertical, on rejoint la droite, on redescend : la concentration se lit en bas."},
  {t:"p", x:"La droite doit **passer par l'origine** : une solution sans espèce colorée n'absorbe rien. Si tes points ne sont pas alignés avec l'origine, c'est un signe d'erreur expérimentale — souvent une cuve mal essuyée ou un appareil non remis à zéro avec le solvant seul."},
  {t:"exemple", titre:"Exemple guidé — exploiter une droite d'étalonnage", enonce:"Une gamme donne $A = 0{,}18$ pour $C = 1{,}0$ @u{mmol/L}. Une solution inconnue a une absorbance $A = 0{,}45$. Quelle est sa concentration ?", etapes:[
   {q:"Déterminer le coefficient", r:"La loi est $A = k × C$, donc $k = @f{A}{C} = @f{0{,}18}{1{,}0} = 0{,}18$ @u{L/mmol}."},
   {q:"Appliquer à l'inconnue", r:"$C = @f{A}{k} = @f{0{,}45}{0{,}18}$."},
   {q:"Calculer", r:"$C = 2{,}5$ @u{mmol/L}."},
   {q:"Le raccourci qui marche toujours", r:"Puisque c'est une proportionnalité, on peut aussi faire un produit en croix direct : $C = 1{,}0 × @f{0{,}45}{0{,}18} = 2{,}5$ @u{mmol/L}. Même résultat, une étape de moins."}
  ]},
  {t:"astuce", titre:"Rester dans le domaine de la droite", x:"On ne lit une concentration que **dans l'intervalle couvert par la gamme**. Au-delà, la proportionnalité cesse d'être vraie : la courbe s'incurve. Si l'absorbance mesurée dépasse celle du point le plus concentré, il faut diluer la solution inconnue et recommencer."}
 ]},

 {titre:"La conductimétrie : mesurer sans couleur", blocs:[
  {t:"p", x:"Beaucoup de solutions intéressantes sont **incolores** — l'eau salée, par exemple. La spectrophotométrie n'y sert à rien. Mais si l'espèce est **ionique**, elle rend la solution conductrice : plus il y a d'ions, mieux le courant passe."},
  {t:"formule", titre:"Conductivité d'une solution ionique", x:"$σ = k' × C$", note:"$σ$ (sigma) en @u{S/m} ou @u{mS/cm} · la conductivité augmente avec la concentration en ions."},
  {t:"p", x:"Le principe d'exploitation est **exactement le même** que pour l'absorbance : on prépare une gamme, on trace $σ$ en fonction de $C$, on obtient une droite passant par l'origine, et on y lit la concentration inconnue. Seul l'appareil change."},
  {t:"tbl", head:["","Spectrophotométrie","Conductimétrie"], rows:[
   ["Ce qu'on mesure","L'absorbance $A$","La conductivité $σ$"],
   ["Condition d'emploi","L'espèce doit être **colorée**","L'espèce doit être **ionique**"],
   ["Loi","$A = k × C$","$σ = k' × C$"],
   ["Exploitation","Droite d'étalonnage","Droite d'étalonnage"],
   ["Exemple typique","Ion permanganate, diiode","Eau salée, acide chlorhydrique"]
  ]},
  {t:"piege", titre:"La température compte", x:"La conductivité **augmente avec la température**. Toutes les mesures d'une même gamme doivent donc être faites à la même température, sinon les points ne s'alignent pas. C'est une source d'erreur classique en TP."},
  {t:"check", q:"Une solution d'ion permanganate, violette, a une absorbance de $0{,}60$. La droite d'étalonnage donne $A = 0{,}24$ pour $C = 2{,}0 × 10^{-4}$ @u{mol/L}. Quelle est sa concentration ?",
   choix:["$5{,}0 × 10^{-4}$ @u{mol/L}","$8{,}0 × 10^{-5}$ @u{mol/L}","$2{,}4 × 10^{-4}$ @u{mol/L}","$1{,}4 × 10^{-4}$ @u{mol/L}"], bonne:0,
   expl:["Exact : l'absorbance est $0{,}60 ÷ 0{,}24 = 2{,}5$ fois plus grande, donc la concentration aussi : $2{,}0 × 10^{-4} × 2{,}5 = 5{,}0 × 10^{-4}$ @u{mol/L}.",
         "Tu as divisé au lieu de multiplier. Une absorbance **plus grande** signifie une solution **plus concentrée**.",
         "Tu as recopié la concentration de référence en changeant les chiffres de l'absorbance. Il faut faire le rapport des absorbances, puis l'appliquer à la concentration.",
         "Tu as soustrait au lieu de faire un rapport. La loi de Beer-Lambert est une proportionnalité : on travaille en multipliant, pas en ajoutant."]}
 ]},

 {titre:"Récapitulatif : de la mesure à la concentration", blocs:[
  {t:"idee", x:"Toutes les méthodes de ce chapitre reposent sur une seule idée : une **grandeur mesurable proportionnelle à la concentration**, et une **droite d'étalonnage** pour faire la conversion."},
  {t:"tbl", head:["La question ressemble à…","Ce qu'il faut faire"], rows:[
   ["« Quelle longueur d'onde choisir ? »","Celle de la couleur **complémentaire** de la solution"],
   ["« Déterminer le coefficient $k$ »","$k = @f{A}{C}$ sur un point connu de la droite"],
   ["« Quelle concentration pour $A = …$ ? »","Produit en croix avec un point connu de la droite"],
   ["« Pourquoi la droite passe-t-elle par l'origine ? »","Sans espèce absorbante, l'absorbance est nulle"],
   ["« La solution est incolore »","Passer en conductimétrie, si l'espèce est ionique"]
  ]},
  {t:"astuce", titre:"Le réflexe du produit en croix", x:"Inutile de calculer $k$ si l'énoncé fournit déjà un couple $(C ; A)$ : la proportionnalité permet d'aller directement de l'un à l'autre. $C_{inconnue} = C_{connue} × @f{A_{inconnue}}{A_{connue}}$."}
 ]}
],
exos:[
 {id:"me1", niveau:1, type:"qcm", enonce:"Une solution de sulfate de cuivre est **bleue**. Sur quelle longueur d'onde faut-il régler le spectrophotomètre pour la doser ?",
  choix:["≈ $600$ @u{nm} (orange)","≈ $450$ @u{nm} (bleu)","≈ $520$ @u{nm} (vert)","Peu importe, le résultat est le même"], bonne:0,
  diag:["",
        "C'est le piège classique. Une solution bleue nous paraît bleue parce qu'elle **laisse passer** le bleu : elle en absorbe très peu. On travaille au contraire sur la couleur complémentaire, l'orange, celle qu'elle absorbe le plus.",
        "Le vert est la couleur complémentaire du magenta, pas du bleu. Le complémentaire du bleu est l'orange.",
        "La longueur d'onde change tout : mal choisie, l'absorbance est trop faible et la mesure devient imprécise, voire inexploitable."],
  corr:["Une solution absorbe la couleur **complémentaire** de celle qu'on lui voit.",
        "Le complémentaire du bleu est l'orange.",
        "L'orange correspond à une longueur d'onde d'environ $600$ @u{nm}.",
        "C'est à cette longueur d'onde que l'absorbance est maximale, donc la mesure la plus précise."],
  indice:"On règle l'appareil sur la couleur que la solution **absorbe**, pas sur celle qu'elle renvoie."},

 {id:"me2", niveau:1, type:"num", enonce:"Une solution de concentration $C = 2{,}0$ @u{mmol/L} a une absorbance $A = 0{,}36$. Quelle est la valeur du coefficient $k$ de la loi $A = k × C$, en @u{L/mmol} ?",
  rep:0.18, tol:0.005,
  diag:[{v:5.56, m:"Tu as calculé $@f{C}{A}$, la division à l'envers. La loi s'écrit $A = k × C$, donc $k = @f{A}{C}$."},
        {v:0.72, m:"Tu as multiplié $A$ par $C$. Pour isoler $k$ dans $A = k × C$, il faut diviser les deux membres par $C$."}],
  corr:["La loi de Beer-Lambert s'écrit $A = k × C$.",
        "J'isole $k$ : $k = @f{A}{C}$.",
        "$k = @f{0{,}36}{2{,}0}$.",
        "$k = 0{,}18$ @u{L/mmol}."],
  indice:"Isole $k$ dans $A = k × C$ avant de remplacer les valeurs."},

 {id:"me3", niveau:2, type:"num", enonce:"Sur la même droite d'étalonnage ($A = 0{,}36$ pour $C = 2{,}0$ @u{mmol/L}), une solution inconnue donne $A = 0{,}54$. Quelle est sa concentration, en @u{mmol/L} ?",
  rep:3, tol:0.05, unite:"mmol/L",
  diag:[{v:1.33, m:"Tu as inversé le rapport. L'absorbance inconnue ($0{,}54$) est **plus grande** que celle de référence ($0{,}36$) : la solution est donc plus concentrée, pas moins."},
        {v:0.19, m:"Tu as divisé les absorbances entre elles sans les rapporter à la concentration connue. Le rapport $@f{0{,}54}{0{,}36} = 1{,}5$ doit ensuite multiplier $2{,}0$ @u{mmol/L}."},
        {v:1.5, m:"$1{,}5$ est le rapport des absorbances, pas une concentration. Il reste à le multiplier par la concentration de référence."}],
  corr:["La loi est une proportionnalité : je peux faire un produit en croix.",
        "Rapport des absorbances : $@f{0{,}54}{0{,}36} = 1{,}5$.",
        "La concentration est donc 1,5 fois plus grande : $C = 2{,}0 × 1{,}5$.",
        "$C = 3{,}0$ @u{mmol/L}."],
  indice:"Absorbance 1,5 fois plus grande, donc concentration 1,5 fois plus grande."},

 {id:"me4", niveau:2, type:"qcm", enonce:"Pourquoi la droite d'étalonnage doit-elle passer par l'origine ?",
  choix:["Parce qu'une solution sans espèce absorbante a une absorbance nulle",
         "Parce que l'appareil est étalonné à zéro degré",
         "Parce que la cuve a une largeur nulle au départ",
         "Ce n'est pas obligatoire, elle peut couper l'axe n'importe où"], bonne:0,
  diag:["",
        "La température n'a rien à voir : l'origine du graphique, c'est le point où la concentration est nulle, pas une température.",
        "La largeur de la cuve est constante pendant toute l'expérience — c'est justement une des raisons pour lesquelles $k$ reste constant.",
        "Si la droite ne passe pas par l'origine, c'est le signe d'une erreur : l'appareil n'a pas été remis à zéro avec le solvant seul, ou la cuve est sale."],
  corr:["La loi de Beer-Lambert s'écrit $A = k × C$.",
        "Quand $C = 0$, il n'y a plus d'espèce colorée dans la cuve.",
        "La lumière traverse alors sans être absorbée : $A = 0$.",
        "Le point $(0 ; 0)$ appartient donc nécessairement à la droite."],
  indice:"Demande-toi ce que mesure l'appareil quand la cuve ne contient que du solvant."},

 {id:"me5", niveau:2, type:"txt", enonce:"Une solution incolore d'eau salée doit être dosée. Quelle méthode faut-il utiliser ? (réponds par un mot)",
  reps:["conductimetrie","conductimétrie","la conductimetrie","conductimetrique"],
  diag:[{r:"spectrophotometrie", m:"La spectrophotométrie mesure une absorption de lumière : elle ne fonctionne que sur des solutions **colorées**. Une solution incolore n'absorbe rien dans le visible. Mais l'eau salée contient des ions : elle conduit le courant."},
        {r:"titrage", m:"Un titrage est possible, mais la question porte sur une mesure physique directe. Une solution ionique se dose très simplement en mesurant sa conductivité."}],
  corr:["La solution est incolore : la spectrophotométrie est inutilisable.",
        "Mais l'eau salée contient des ions sodium et chlorure.",
        "Une solution ionique conduit le courant, d'autant mieux qu'elle est concentrée.",
        "On mesure donc sa conductivité : c'est la conductimétrie."],
  indice:"Si la couleur ne dit rien, cherche une autre propriété : ces ions font-ils passer le courant ?"},

 {id:"me6", niveau:3, type:"num", enonce:"Une gamme d'étalonnage donne $σ = 1{,}2$ @u{mS/cm} pour $C = 5{,}0$ @u{mmol/L}. Une solution inconnue a une conductivité $σ = 1{,}8$ @u{mS/cm}. Quelle est sa concentration, en @u{mmol/L} ?",
  rep:7.5, tol:0.05, unite:"mmol/L",
  diag:[{v:3.33, m:"Tu as inversé le rapport. La conductivité inconnue est plus grande, donc la solution est **plus concentrée** que celle de référence."},
        {v:1.5, m:"$1{,}5$ est le rapport des conductivités. Il faut encore le multiplier par la concentration de référence, $5{,}0$ @u{mmol/L}."},
        {v:6.5, m:"Tu as ajouté la différence des conductivités à la concentration. C'est une proportionnalité, pas une addition : on multiplie par un rapport."}],
  corr:["La conductivité est proportionnelle à la concentration : $σ = k' × C$.",
        "Rapport des conductivités : $@f{1{,}8}{1{,}2} = 1{,}5$.",
        "La concentration est donc multipliée par le même facteur : $C = 5{,}0 × 1{,}5$.",
        "$C = 7{,}5$ @u{mmol/L}."],
  indice:"Même raisonnement qu'avec l'absorbance : produit en croix sur la droite d'étalonnage."},

 {id:"me7", niveau:3, type:"num", enonce:"Une solution inconnue donne $A = 1{,}90$, alors que le point le plus concentré de la gamme donne $A = 0{,}80$. On la dilue 5 fois et on retrouve $A = 0{,}38$. Sachant que la gamme donne $A = 0{,}19$ pour $C = 1{,}0$ @u{mmol/L}, quelle était la concentration de la solution **avant** dilution, en @u{mmol/L} ?",
  rep:10, tol:0.1, unite:"mmol/L",
  diag:[{v:2, m:"$2{,}0$ @u{mmol/L} est la concentration de la solution **diluée**. La question porte sur la solution de départ : il faut multiplier par le facteur de dilution, 5."},
        {v:0.4, m:"Tu as divisé par 5 au lieu de multiplier. La dilution rend la solution **moins** concentrée : la solution d'origine est donc plus concentrée que celle qu'on a mesurée."},
        {v:5, m:"5 est le facteur de dilution, pas une concentration. Il sert à remonter de la solution diluée à la solution de départ."}],
  corr:["Sur la solution diluée : $C_{dil} = 1{,}0 × @f{0{,}38}{0{,}19} = 2{,}0$ @u{mmol/L}.",
        "La dilution a divisé la concentration par 5.",
        "Pour revenir à la solution de départ, je multiplie par 5 : $C = 2{,}0 × 5$.",
        "$C = 10$ @u{mmol/L}. C'est bien au-delà de la gamme, ce qui explique pourquoi la mesure directe était inexploitable."],
  indice:"Deux étapes : lire la concentration de la solution diluée sur la droite, puis remonter à celle d'origine."},

 {id:"me8", niveau:3, type:"qcm", enonce:"Au cours d'une réaction, un réactif coloré disparaît. Comment évolue l'absorbance mesurée au fil du temps ?",
  choix:["Elle diminue et tend vers une valeur limite","Elle augmente régulièrement","Elle reste constante","Elle augmente puis diminue"], bonne:0,
  diag:["",
        "L'absorbance suit la concentration de l'espèce colorée. Si celle-ci **disparaît**, son absorbance ne peut pas augmenter.",
        "Une absorbance constante signifierait que la concentration ne change pas, donc qu'il ne se passe rien. Or le réactif est consommé.",
        "Ce profil correspondrait à une espèce qui se forme puis se consomme — un intermédiaire. Ici l'espèce colorée est un réactif : elle ne fait que disparaître."],
  corr:["La loi de Beer-Lambert dit que $A$ est proportionnelle à la concentration de l'espèce colorée.",
        "Ici, l'espèce colorée est un réactif : sa concentration diminue au cours du temps.",
        "L'absorbance diminue donc elle aussi.",
        "Quand la réaction s'arrête, la concentration se stabilise : l'absorbance tend vers une valeur limite, nulle si le réactif est entièrement consommé."],
  indice:"L'absorbance est l'image directe de la concentration de l'espèce colorée."}
]
},

/* ============== 3. TITRAGE COLORIMÉTRIQUE ============== */
{
id:"titrage", n:3, titre:"Le titrage colorimétrique",
sous:"Verser goutte à goutte jusqu'au changement de couleur",
desc:"Réaction de titrage, équivalence, repérage colorimétrique et calcul de concentration.",
duree:35,
sections:[
 {titre:"Titrer, c'est faire réagir jusqu'à la disparition exacte", blocs:[
  {t:"idee", x:"Un **titrage** consiste à faire réagir la solution dont on cherche la concentration avec une solution de concentration connue, versée petit à petit, jusqu'au moment précis où les deux réactifs se sont exactement consommés l'un l'autre."},
  {t:"p", x:"Le vocabulaire est à retenir, parce qu'il revient dans tous les énoncés : la solution **titrée** est celle dont on cherche la concentration (dans le bécher) ; la solution **titrante** est celle qu'on verse (dans la burette), et sa concentration est connue."},
  {t:"fig", titre:"Le montage d'un titrage",
   vue:[0,0,7,9], w:290, h:340, grille:false, axes:false,
   objets:[
    {t:"seg", de:[3.2,9], a:[3.2,5.4], couleur:"ink3", epais:2.4},
    {t:"seg", de:[3.8,9], a:[3.8,5.4], couleur:"ink3", epais:2.4},
    {t:"seg", de:[3.2,5.4], a:[3.5,4.6], couleur:"ink3", epais:2.4},
    {t:"seg", de:[3.8,5.4], a:[3.5,4.6], couleur:"ink3", epais:2.4},
    {t:"rect", x:3.2, y:6.2, w:0.6, h:2.6, couleur:"bleu", opacite:.25},
    {t:"texte", x:5.4, y:7.6, txt:"burette", couleur:"ink2", taille:12},
    {t:"texte", x:5.9, y:6.9, txt:"solution titrante", couleur:"ink3", taille:11},
    {t:"point", x:3.5, y:4.0, couleur:"bleu"},
    {t:"becher", x:2.2, y:0.9, w:2.6, h:2.6, niveau:.55, couleur:"ink3", liquide:"rouge"},
    {t:"texte", x:0.9, y:2.0, txt:"solution", couleur:"ink2", taille:12},
    {t:"texte", x:0.75, y:1.4, txt:"titrée", couleur:"ink2", taille:12},
    {t:"seg", de:[2.6,0.65], a:[4.4,0.65], couleur:"ink3", epais:3},
    {t:"texte", x:3.5, y:0.15, txt:"agitateur magnétique", couleur:"ink3", taille:10.5}
   ],
   note:"On verse lentement, en agitant, et on surveille la couleur du bécher."},
  {t:"formule", titre:"Ce qui définit l'équivalence",
   x:"À l'équivalence, les réactifs ont été introduits dans les **proportions stœchiométriques**.",
   note:"Avant : le réactif titrant est limitant. Après : c'est lui qui est en excès."},
  {t:"p", x:"C'est l'instant charnière. Avant l'équivalence, chaque goutte versée est immédiatement consommée : le réactif titrant disparaît au fur et à mesure. Après l'équivalence, il n'y a plus rien pour le consommer : il s'accumule dans le bécher. Le changement de couleur signale précisément le passage de l'un à l'autre."}
 ]},

 {titre:"Repérer l'équivalence à l'œil", blocs:[
  {t:"p", x:"Dans un titrage colorimétrique, on repère l'équivalence par un **changement de couleur persistant**. Deux situations se présentent."},
  {t:"liste", items:[
   "**Un des réactifs est coloré** : la couleur disparaît (ou apparaît) d'elle-même à l'équivalence. Par exemple le permanganate violet, qui se décolore tant qu'il est consommé, et dont la première goutte en excès rose l'ensemble.",
   "**Aucun réactif n'est coloré** : on ajoute un **indicateur coloré**, une espèce qui change de teinte selon les conditions du milieu. C'est lui qui donne le signal."
  ]},
  {t:"astuce", titre:"La bonne technique de versement", x:"On verse vite jusqu'aux environs de l'équivalence, puis **goutte à goutte** en agitant entre chaque goutte. L'équivalence est atteinte à la **première goutte** qui donne une couleur persistante — pas quand la couleur est franche et intense : là, on a déjà dépassé."},
  {t:"piege", titre:"Une couleur fugace n'est pas l'équivalence", x:"Avant l'équivalence, chaque goutte crée une tache colorée qui **disparaît en agitant**. C'est normal : le réactif est encore consommé. Seule compte la couleur qui **reste** après agitation."},
  {t:"check", q:"Pendant un titrage par le permanganate (violet), la solution se décolore à chaque goutte, puis une goutte rose l'ensemble définitivement. Que s'est-il passé ?",
   choix:["L'équivalence vient d'être atteinte","La réaction est terminée depuis longtemps","Il faut continuer jusqu'à obtenir un violet foncé","La solution titrée était trop diluée"], bonne:0,
   expl:["Exact. Tant que le réducteur était présent, il consommait le permanganate et la couleur disparaissait. La première goutte qui persiste signale qu'il n'y a plus rien à consommer.",
         "Au contraire, c'est le moment précis où elle s'achève. Avant cette goutte, il restait encore du réactif à consommer.",
         "Ce serait un dépassement net de l'équivalence : le volume lu serait alors trop grand, et la concentration calculée fausse.",
         "La dilution influe sur le volume versé, pas sur la façon de repérer l'équivalence."]}
 ]},

 {titre:"La relation à l'équivalence, et son calcul", blocs:[
  {t:"idee", x:"À l'équivalence, les quantités de matière des deux réactifs sont dans le **rapport de leurs nombres stœchiométriques**. Cette égalité est la seule formule du chapitre."},
  {t:"formule", titre:"Cas le plus courant : coefficients égaux à 1",
   x:"$C_A × V_A = C_B × V_{B, éq}$",
   note:"Pour $@c{A} + @c{B} → produits$. Les volumes peuvent rester en @u{mL} des deux côtés : ils se simplifient."},
  {t:"formule", titre:"Cas général : coefficients différents",
   x:"$@f{n_A}{a} = @f{n_B}{b}$ &nbsp;&nbsp;soit&nbsp;&nbsp; $@f{C_A V_A}{a} = @f{C_B V_{B, éq}}{b}$",
   note:"Pour $a @c{A} + b @c{B} → produits$."},
  {t:"p", x:"Un détail précieux pour les calculs : dans $C_A V_A = C_B V_B$, les volumes apparaissent **des deux côtés**. On peut donc les laisser tous les deux en millilitres, à condition de ne pas en convertir un seul. C'est l'une des rares fois en chimie où l'on n'est pas obligé de passer aux litres."},
  {t:"exemple", titre:"Exemple guidé — doser un vinaigre", enonce:"On titre $V_A = 10{,}0$ @u{mL} d'une solution d'acide par de la soude à $C_B = 0{,}10$ @u{mol/L}. L'équivalence est atteinte pour $V_{B} = 12{,}5$ @u{mL}. La réaction est $@c{H_3O^+} + @c{HO^-} → 2 @c{H_2O}$. Quelle est la concentration de l'acide ?", etapes:[
   {q:"Écrire la relation d'équivalence", r:"Les deux coefficients valent 1, donc $n_A = n_B$ à l'équivalence, soit $C_A × V_A = C_B × V_B$."},
   {q:"Isoler l'inconnue", r:"$C_A = @f{C_B × V_B}{V_A}$."},
   {q:"Remplacer", r:"$C_A = @f{0{,}10 × 12{,}5}{10{,}0}$. Les deux volumes sont en @u{mL} : ils se simplifient, aucune conversion n'est nécessaire."},
   {q:"Calculer", r:"$C_A = @f{1{,}25}{10{,}0} = 0{,}125$ @u{mol/L}, soit environ $0{,}13$ @u{mol/L}."},
   {q:"Contrôle de bon sens", r:"Il a fallu un peu **plus** de volume de soude que d'acide, à concentration comparable : l'acide est donc un peu plus concentré que la soude. $0{,}125 > 0{,}10$ : cohérent."}
  ]},
  {t:"astuce", titre:"Le contrôle qui attrape les erreurs de division", x:"Compare les volumes. Si tu as versé **plus** de titrant que tu n'avais de solution titrée, alors la solution titrée est **plus concentrée** que le titrant. Si ton résultat dit le contraire, tu as inversé une division."}
 ]},

 {titre:"Quand les coefficients ne valent pas 1", blocs:[
  {t:"p", x:"Beaucoup de titrages réels font intervenir des coefficients différents de 1. La relation $C_A V_A = C_B V_B$ devient alors fausse, et il faut revenir à la forme générale."},
  {t:"exemple", titre:"Exemple guidé — un titrage avec des coefficients", enonce:"On titre $V_A = 20{,}0$ @u{mL} d'une solution de dioxyde de soufre par du diiode à $C_B = 0{,}050$ @u{mol/L}, selon $@c{SO_2} + @c{I_2} + 2 @c{H_2O} → @c{SO_4^{2-}} + 2 @c{I^-} + 4 @c{H^+}$. L'équivalence est à $V_B = 16{,}0$ @u{mL}. Quelle est la concentration en dioxyde de soufre ?", etapes:[
   {q:"Repérer les coefficients", r:"Devant $@c{SO_2}$ : 1. Devant $@c{I_2}$ : 1. Les deux valent 1, la relation simple s'applique."},
   {q:"Écrire l'équivalence", r:"$C_A × V_A = C_B × V_B$."},
   {q:"Isoler et remplacer", r:"$C_A = @f{0{,}050 × 16{,}0}{20{,}0}$."},
   {q:"Calculer", r:"$C_A = @f{0{,}80}{20{,}0} = 0{,}040$ @u{mol/L}."},
   {q:"Le réflexe à garder", r:"Ne conclus jamais que les coefficients valent 1 sans regarder l'équation. Ici c'était le cas, mais les $2$ et les $4$ de l'équation auraient pu porter sur les espèces titrées."}
  ]},
  {t:"tbl", head:["Équation de titrage","Relation à l'équivalence"], rows:[
   ["$@c{A} + @c{B} → …$","$C_A V_A = C_B V_B$"],
   ["$@c{A} + 2 @c{B} → …$","$2 C_A V_A = C_B V_B$"],
   ["$2 @c{A} + @c{B} → …$","$C_A V_A = 2 C_B V_B$"],
   ["$5 @c{A} + 2 @c{B} → …$","$@f{C_A V_A}{5} = @f{C_B V_B}{2}$"]
  ]},
  {t:"piege", titre:"Où placer le coefficient", x:"Le coefficient se place **au dénominateur de l'espèce à laquelle il appartient**. Écris toujours $@f{n_A}{a} = @f{n_B}{b}$ d'abord, puis remplace : tu ne te tromperas jamais de côté. Placer le coefficient au mauvais endroit donne un résultat faux d'un facteur 2 ou plus — l'erreur la plus fréquente de ce chapitre."}
 ]},

 {titre:"Récapitulatif : la méthode d'un titrage", blocs:[
  {t:"liste", items:[
   "**1. Identifier** qui est titré (bécher, concentration inconnue) et qui est titrant (burette, concentration connue).",
   "**2. Écrire l'équation** de la réaction de titrage et relever les nombres stœchiométriques.",
   "**3. Écrire l'équivalence** sous la forme $@f{n_A}{a} = @f{n_B}{b}$, avant tout remplacement.",
   "**4. Remplacer** $n$ par $C × V$, isoler l'inconnue, calculer.",
   "**5. Vérifier** la cohérence : plus de volume versé signifie une solution titrée plus concentrée."
  ]},
  {t:"astuce", titre:"Trois précautions de manipulation qui rapportent des points", x:"Rincer la burette avec la solution titrante (et non avec de l'eau, qui la diluerait) ; prélever la solution titrée à la **pipette jaugée**, plus précise que l'éprouvette ; ajouter de l'eau distillée dans le bécher ne change rien au résultat, car cela ne modifie pas la **quantité de matière** présente."},
  {t:"piege", titre:"Pourquoi ajouter de l'eau ne fausse rien", x:"C'est contre-intuitif mais essentiel : ajouter de l'eau dans le bécher dilue la solution, donc change sa concentration — mais la **quantité de matière** de l'espèce titrée, elle, ne change pas. Or c'est elle seule qui intervient dans la relation d'équivalence. Le volume équivalent est donc inchangé."}
 ]}
],
exos:[
 {id:"ti1", niveau:1, type:"num", enonce:"On titre $V_A = 20{,}0$ @u{mL} d'acide par de la soude à $C_B = 0{,}10$ @u{mol/L}. L'équivalence est atteinte pour $V_B = 15{,}0$ @u{mL}. La réaction se fait mole à mole. Quelle est la concentration de l'acide, en @u{mol/L} ?",
  rep:0.075, tol:0.0005, unite:"mol/L",
  diag:[{v:0.133, m:"Tu as inversé les volumes : tu as calculé $@f{C_B V_A}{V_B}$. La relation est $C_A V_A = C_B V_B$, donc $C_A = @f{C_B V_B}{V_A}$ — le volume de titrant va au numérateur."},
        {v:0.15, m:"Tu as oublié de diviser par $V_A$, ou tu as pris $V_A = 10$ au lieu de $20$. Relis les données."},
        {v:1.5, m:"Un facteur 10 s'est glissé dans le calcul : $0{,}10 × 15{,}0 = 1{,}5$, puis il faut encore diviser par $20{,}0$."}],
  corr:["À l'équivalence et à coefficients égaux : $C_A × V_A = C_B × V_B$.",
        "J'isole : $C_A = @f{C_B × V_B}{V_A}$.",
        "$C_A = @f{0{,}10 × 15{,}0}{20{,}0} = @f{1{,}5}{20{,}0}$.",
        "$C_A = 0{,}075$ @u{mol/L}. Contrôle : moins de titrant versé que de solution titrée, donc l'acide est moins concentré que la soude. Cohérent."],
  indice:"$C_A = @f{C_B × V_B}{V_A}$ : le volume versé est au numérateur."},

 {id:"ti2", niveau:1, type:"qcm", enonce:"Dans un titrage, quelle solution se trouve dans la burette ?",
  choix:["La solution titrante, de concentration connue","La solution titrée, de concentration inconnue","L'indicateur coloré","De l'eau distillée"], bonne:0,
  diag:["",
        "C'est l'inverse. La solution dont on cherche la concentration est prélevée à la pipette et placée dans le bécher ; c'est elle qu'on titre, elle ne se verse pas.",
        "L'indicateur coloré s'ajoute en petite quantité dans le bécher, quelques gouttes seulement. Il ne participe pas à la réaction de titrage.",
        "L'eau distillée sert à rincer la verrerie et éventuellement à compléter le bécher, jamais à titrer : elle ne contient aucun réactif."],
  corr:["La burette permet de verser un volume précis, goutte à goutte.",
        "On y met donc la solution que l'on **ajoute progressivement** : la solution titrante.",
        "Sa concentration doit être connue, puisque c'est elle qui sert de référence.",
        "La solution titrée, de concentration inconnue, attend dans le bécher."],
  indice:"On verse celle dont on connaît la concentration, sur celle qu'on veut déterminer."},

 {id:"ti3", niveau:2, type:"num", enonce:"On titre $V_A = 10{,}0$ @u{mL} d'une solution de diiode par du thiosulfate à $C_B = 0{,}20$ @u{mol/L} selon $@c{I_2} + 2 @c{S_2O_3^{2-}} → 2 @c{I^-} + @c{S_4O_6^{2-}}$. L'équivalence est à $V_B = 12{,}0$ @u{mL}. Quelle est la concentration en diiode, en @u{mol/L} ?",
  rep:0.12, tol:0.001, unite:"mol/L",
  diag:[{v:0.24, m:"Tu as oublié le coefficient 2 devant le thiosulfate. Il en faut **deux** moles pour consommer une mole de diiode : la quantité de diiode est donc la moitié de celle du thiosulfate versé, pas son égale."},
        {v:0.06, m:"Tu as divisé par 2 du mauvais côté. Écris d'abord $@f{n(@c{I_2})}{1} = @f{n(@c{S_2O_3^{2-}})}{2}$ : le 2 se place sous le thiosulfate, celui qui porte le coefficient 2."},
        {v:0.167, m:"Tu as inversé les volumes dans la division. Le volume versé ($12{,}0$ @u{mL}) va au numérateur, celui prélevé ($10{,}0$ @u{mL}) au dénominateur."}],
  corr:["Relation d'équivalence avec les coefficients : $@f{n(@c{I_2})}{1} = @f{n(@c{S_2O_3^{2-}})}{2}$.",
        "Soit $C_A V_A = @f{C_B V_B}{2}$.",
        "$C_A = @f{C_B V_B}{2 V_A} = @f{0{,}20 × 12{,}0}{2 × 10{,}0}$.",
        "$C_A = @f{2{,}4}{20{,}0} = 0{,}12$ @u{mol/L}."],
  indice:"Écris $@f{n_A}{a} = @f{n_B}{b}$ avant de remplacer : le 2 se place sous l'espèce qui porte le coefficient 2."},

 {id:"ti4", niveau:2, type:"qcm", enonce:"Pendant un titrage, on ajoute par erreur $50$ @u{mL} d'eau distillée dans le bécher. Quelle conséquence sur le volume équivalent ?",
  choix:["Aucune : le volume équivalent est inchangé","Il est doublé","Il est divisé par deux","Le titrage est à recommencer entièrement"], bonne:0,
  diag:["",
        "L'eau ne contient aucun réactif : elle n'ajoute rien à consommer. Le volume de titrant nécessaire reste donc le même.",
        "Diluer ne fait pas disparaître de matière. La quantité d'espèce titrée dans le bécher est exactement la même qu'avant l'ajout d'eau.",
        "C'est justement le point remarquable de cette méthode : seule la **quantité de matière** compte, et elle n'a pas bougé. La manipulation reste valable."],
  corr:["La relation d'équivalence porte sur des **quantités de matière**, pas sur des concentrations dans le bécher.",
        "Ajouter de l'eau dilue la solution : la concentration baisse.",
        "Mais la quantité de matière d'espèce titrée, elle, ne change pas — on n'a rien retiré ni ajouté.",
        "Il faut donc exactement le même volume de titrant pour la consommer : $V_{éq}$ est inchangé."],
  indice:"Regarde ce qui intervient vraiment dans la relation d'équivalence : des concentrations, ou des quantités de matière ?"},

 {id:"ti5", niveau:2, type:"num", enonce:"Un titrage mole à mole donne $V_{éq} = 14{,}0$ @u{mL} pour $V_A = 20{,}0$ @u{mL} de solution titrée et $C_B = 0{,}050$ @u{mol/L}. Quelle quantité de matière, en @u{mmol}, l'espèce titrée représentait-elle dans le bécher ?",
  rep:0.7, tol:0.005, unite:"mmol",
  diag:[{v:0.035, m:"Tu as calculé la concentration ($0{,}035$ @u{mol/L}), pas la quantité de matière. La question demande $n$, en millimoles."},
        {v:1, m:"Tu as utilisé $V_A$ avec $C_B$. La quantité titrée est égale à celle du titrant versé à l'équivalence : $n = C_B × V_{éq}$."},
        {v:0.7e-3, m:"Ton résultat est en moles, pas en millimoles. $7{,}0 × 10^{-4}$ @u{mol} $= 0{,}70$ @u{mmol}."}],
  corr:["À l'équivalence et à coefficients égaux, la quantité titrée est égale à la quantité versée.",
        "$n = C_B × V_{éq} = 0{,}050 × 14{,}0 × 10^{-3}$ @u{L}.",
        "$n = 7{,}0 × 10^{-4}$ @u{mol}.",
        "Soit $0{,}70$ @u{mmol}. Astuce : $C$ en @u{mol/L} multipliée par $V$ en @u{mL} donne directement des @u{mmol}."],
  indice:"Une concentration en @u{mol/L} multipliée par un volume en @u{mL} donne un résultat en @u{mmol}."},

 {id:"ti6", niveau:3, type:"num", enonce:"On dose le fer d'un comprimé par du permanganate selon $5 @c{Fe^{2+}} + @c{MnO_4^-} + 8 @c{H^+} → 5 @c{Fe^{3+}} + @c{Mn^{2+}} + 4 @c{H_2O}$. Il faut $V_B = 12{,}0$ @u{mL} de permanganate à $C_B = 0{,}020$ @u{mol/L} pour titrer $V_A = 20{,}0$ @u{mL} de solution. Quelle est la concentration en ions fer (II), en @u{mol/L} ?",
  rep:0.06, tol:0.0005, unite:"mol/L",
  diag:[{v:0.012, m:"Tu as oublié le coefficient 5. Une mole de permanganate consomme **cinq** moles d'ions fer : la concentration en fer est donc cinq fois plus grande que ce que donne la relation simple."},
        {v:0.0024, m:"Tu as divisé par 5 au lieu de multiplier. Le 5 est du côté du fer : c'est le fer qui est le plus consommé, donc le plus concentré."},
        {v:0.1, m:"Tu as inversé les volumes. Le volume versé ($12{,}0$) va au numérateur, le volume prélevé ($20{,}0$) au dénominateur."}],
  corr:["Relation d'équivalence : $@f{n(@c{Fe^{2+}})}{5} = @f{n(@c{MnO_4^-})}{1}$.",
        "Donc $n(@c{Fe^{2+}}) = 5 × n(@c{MnO_4^-}) = 5 × C_B × V_B$.",
        "$C_A = @f{5 × C_B × V_B}{V_A} = @f{5 × 0{,}020 × 12{,}0}{20{,}0}$.",
        "$C_A = @f{1{,}20}{20{,}0} = 0{,}060$ @u{mol/L}."],
  indice:"Le coefficient 5 est du côté du fer : il en faut cinq fois plus. Écris $@f{n_A}{5} = @f{n_B}{1}$."},

 {id:"ti7", niveau:3, type:"txt", enonce:"Faut-il rincer la burette à l'eau distillée avant de la remplir de solution titrante ? (réponds par oui ou non)",
  reps:["non","non il ne faut pas","surtout pas"],
  diag:[{r:"oui", m:"Non : l'eau restée dans la burette diluerait la solution titrante, dont la concentration ne serait alors plus celle annoncée. On rince la burette **avec la solution titrante elle-même**. En revanche, on rince bien le bécher à l'eau distillée : là, l'eau ne change aucune quantité de matière."}],
  corr:["La burette contient la solution dont la concentration doit être parfaitement connue.",
        "Des gouttes d'eau restées dans la burette la dilueraient légèrement.",
        "Sa concentration réelle serait alors inférieure à celle affichée, et le résultat faux.",
        "On rince donc la burette avec la solution titrante — et on jette ce premier rinçage."],
  indice:"Demande-toi ce que quelques gouttes d'eau feraient à la concentration de la solution titrante."},

 {id:"ti8", niveau:3, type:"num", enonce:"Un vinaigre est dilué 10 fois. On titre $10{,}0$ @u{mL} du vinaigre dilué par de la soude à $0{,}10$ @u{mol/L} ; l'équivalence est à $13{,}0$ @u{mL}. Quelle est la concentration en acide du vinaigre **non dilué**, en @u{mol/L} ?",
  rep:1.3, tol:0.01, unite:"mol/L",
  diag:[{v:0.13, m:"$0{,}13$ @u{mol/L} est la concentration du vinaigre **dilué**. Le vinaigre d'origine est dix fois plus concentré : il reste à multiplier par 10."},
        {v:0.013, m:"Tu as divisé par 10 au lieu de multiplier. La dilution a rendu la solution moins concentrée, donc l'originale est plus concentrée que celle qu'on a titrée."},
        {v:13, m:"Tu as multiplié deux fois par 10, ou oublié une division par $V_A$. Reprends : $@f{0{,}10 × 13{,}0}{10{,}0} = 0{,}13$, puis $× 10$."}],
  corr:["Sur la solution diluée : $C_{dil} = @f{C_B V_B}{V_A} = @f{0{,}10 × 13{,}0}{10{,}0} = 0{,}13$ @u{mol/L}.",
        "La dilution au dixième a divisé la concentration par 10.",
        "Pour revenir au vinaigre d'origine, je multiplie par 10.",
        "$C = 0{,}13 × 10 = 1{,}3$ @u{mol/L}."],
  indice:"Titre d'abord la solution diluée, puis remonte à l'originale en multipliant par le facteur de dilution."}
]
}

]);
