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
  ,{t:"mots", items:[
   ["Espèce chimique","Un type d'entité bien précis : l'eau $@c{H_2O}$ est une espèce, le sel $@c{NaCl}$ en est une autre. Dans un bécher, il y en a presque toujours plusieurs à la fois."],
   ["Système","Ce qu'on décide d'observer : le contenu du bécher, et rien d'autre. On le délimite avant de commencer, sinon on ne sait plus de quoi on parle."],
   ["Réactif","Une espèce présente au départ et qui **disparaît** pendant la transformation. Elle s'écrit à gauche de la flèche."],
   ["Produit","Une espèce qui **apparaît** pendant la transformation. Elle s'écrit à droite de la flèche."],
   ["Transformation","Le passage de l'état initial à l'état final, dans la réalité, dans le bécher."],
   ["Réaction","L'écriture simplifiée qui modélise cette transformation : une ligne, une flèche, des nombres."]
  ]}
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
  {t:"astuce", titre:"L'ordre qui fait gagner du temps", x:"Ajuste dans cet ordre : le **carbone**, puis l'**hydrogène**, puis l'**oxygène** en dernier. L'oxygène est presque toujours l'élément le plus répandu dans l'équation : le laisser pour la fin évite de tout recommencer."}
  ,{t:"methode", titre:"Ajuster une équation, en quatre gestes", etapes:[
   "**Recopier l'équation** en laissant de la place devant chaque formule : c'est là que les nombres viendront.",
   "**Ajuster le carbone** d'abord, en changeant seulement les nombres devant les formules — jamais les indices à l'intérieur.",
   "**Ajuster l'hydrogène** ensuite, de la même façon.",
   "**Ajuster l'oxygène** en dernier, parce qu'il apparaît presque partout.",
   "**Recompter chaque élément** des deux côtés. Si un seul ne tombe pas juste, l'équation est fausse."
  ], exemple:"Sur $@c{C_2H_6} + @c{O_2} → @c{CO_2} + @c{H_2O}$ : 2 carbones à gauche, donc $2 @c{CO_2}$ ; 6 hydrogènes, donc $3 @c{H_2O}$ ; à droite on compte alors $2×2 + 3 = 7$ oxygènes, donc $@f{7}{2} @c{O_2}$ — ou, en doublant toute l'équation pour n'avoir que des entiers : $2 @c{C_2H_6} + 7 @c{O_2} → 4 @c{CO_2} + 6 @c{H_2O}$."},
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
  ,{t:"methode", titre:"Trouver une quantité de matière", etapes:[
   "**Lire l'énoncé et repérer la donnée** : est-ce une masse (des grammes) ? un volume de solution avec sa concentration ? un volume de gaz ?",
   "**En déduire la formule** : masse $→ n = @f{m}{M}$ ; solution $→ n = C × V$ ; gaz $→ n = @f{V}{V_m}$.",
   "**Convertir avant de calculer** : le volume en litres, la masse en grammes. C'est ici que se perdent la plupart des points.",
   "**Calculer**, puis vérifier que le résultat tombe entre $10^{-3}$ et quelques @u{mol} : c'est l'ordre de grandeur d'un laboratoire."
  ], exemple:"« $250$ @u{mL} d'une solution à $0{,}20$ @u{mol/L} » : la donnée est un volume de solution avec sa concentration, donc $n = C × V$. Je convertis, $250$ @u{mL} $= 0{,}250$ @u{L}, puis $n = 0{,}20 × 0{,}250 = 0{,}050$ @u{mol}."}

  ,{t:"check", q:"On dispose de $2{,}0$ @u{L} de dioxygène gazeux, avec $V_m = 24{,}0$ @u{L/mol}. Quelle formule faut-il utiliser ?",
   choix:["$n = @f{V}{V_m}$","$n = C × V$","$n = @f{m}{M}$","$n = V × V_m$"], bonne:0,
   expl:["Exact : la donnée est un volume de **gaz**, donc on divise par le volume molaire. $n = @f{2{,}0}{24{,}0} ≈ 0{,}083$ @u{mol}.",
         "$n = C × V$ sert pour une solution, quand on connaît sa concentration. Ici il n'y a pas de solution : c'est un gaz pur.",
         "$n = @f{m}{M}$ demande une masse en grammes. L'énoncé n'en donne pas.",
         "Multiplier donnerait $48$ @u{mol}, une quantité énorme pour deux litres de gaz. Le volume molaire est un volume **par mole** : pour compter les moles, on divise."]}
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
  ,{t:"exemple", titre:"Exemple guidé — remplir un tableau ligne par ligne", enonce:"On mélange $0{,}50$ @u{mol} de $@c{H_2}$ et $0{,}40$ @u{mol} de $@c{O_2}$ selon $2 @c{H_2} + @c{O_2} → 2 @c{H_2O}$. Écrire les trois lignes du tableau d'avancement.", etapes:[
   {q:"La ligne « état initial »", r:"J'y recopie simplement les quantités de départ : $0{,}50$ pour $@c{H_2}$, $0{,}40$ pour $@c{O_2}$, et $0$ pour l'eau, qui n'existe pas encore. L'avancement y vaut $0$."},
   {q:"La ligne « en cours » : les réactifs", r:"Chaque réactif **perd** son coefficient fois $x$. Pour $@c{H_2}$, coefficient 2 : $0{,}50 - 2x$. Pour $@c{O_2}$, coefficient 1 : $0{,}40 - x$."},
   {q:"La ligne « en cours » : le produit", r:"Le produit **gagne** son coefficient fois $x$. Pour l'eau, coefficient 2 : $0 + 2x$, que j'écris simplement $2x$."},
   {q:"La ligne « état final »", r:"C'est la même chose, avec $x_{max}$ à la place de $x$ : $0{,}50 - 2x_{max}$, $0{,}40 - x_{max}$, et $2x_{max}$."},
   {q:"Le réflexe qui évite l'erreur", r:"Avant d'écrire quoi que ce soit, entoure les coefficients dans l'équation ajustée. Ce sont eux, et eux seuls, qui multiplient le $x$. Un coefficient oublié fausse toute la suite de l'exercice."}
  ]}
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
  ,{t:"figi", nom:"avancement"}
  ,{t:"p", x:"Pousse le curseur d'avancement et regarde les trois barres. Les deux réactifs descendent — mais pas à la même vitesse : le dichlore, avec son coefficient 3, descend trois fois plus vite que l'aluminium n'en descend deux. Change ensuite les quantités de départ : tu verras le réactif limitant changer de camp."}
 ]},


 {titre:"Atelier — trouver le réactif limitant", blocs:[
  {t:"p", x:"Le tableau d'avancement est la méthode centrale du chapitre, et celle qui coûte le plus de points quand elle est bâclée. Cet atelier te la fait dérouler en entier : c'est toi qui calcules chaque ligne."},
  {t:"atelier", titre:"Aluminium et dichlore",
   enonce:"On fait réagir $0{,}40$ @u{mol} d'aluminium avec $0{,}45$ @u{mol} de dichlore, selon l'équation $2 @c{Al} + 3 @c{Cl_2} → 2 @c{AlCl_3}$.",
   etapes:[
    {q:"Si l'aluminium était entièrement consommé, quelle serait la valeur de l'avancement, en @u{mol} ?",
     rep:0.20, tol:0.005, unite:"mol",
     aide:"L'aluminium disparaît à raison de 2 moles par unité d'avancement. Combien d'unités faut-il pour en consommer 0,40 ?",
     diag:[{v:0.40, m:"$0{,}40$ @u{mol} est la quantité d'aluminium, pas l'avancement. Le coefficient $2$ n'a pas encore été utilisé."},
           {v:0.80, m:"Tu as multiplié par $2$ au lieu de diviser. À chaque unité d'avancement, l'aluminium **disparaît** deux fois plus vite."},
           {v:0.13, m:"Tu as divisé par $3$, le coefficient du dichlore. Celui de l'aluminium est $2$."}],
     expl:"L'aluminium est consommé selon $n = n_0 - 2x$. Il s'annule quand $0{,}40 - 2x = 0$, donc $x = @f{0{,}40}{2} = 0{,}20$ @u{mol}. **Comment lire un coefficient.** Le $2$ devant $@c{Al}$ ne dit pas « il y a deux moles » : il dit « pour une unité d'avancement, deux moles disparaissent ». Plus le coefficient est grand, plus le réactif s'épuise vite — donc plus l'avancement possible est petit."},

    {q:"Même question pour le dichlore : quel avancement l'épuiserait, en @u{mol} ?",
     rep:0.15, tol:0.005, unite:"mol",
     aide:"Le dichlore disparaît trois fois plus vite que l'avancement ne progresse.",
     diag:[{v:0.45, m:"$0{,}45$ @u{mol} est la quantité de dichlore. Il reste à diviser par son coefficient."},
           {v:1.35, m:"Tu as multiplié par $3$ au lieu de diviser."},
           {v:0.225, m:"Tu as divisé par $2$, le coefficient de l'aluminium. Celui du dichlore est $3$."}],
     expl:"$0{,}45 - 3x = 0$ donne $x = @f{0{,}45}{3} = 0{,}15$ @u{mol}. **Pourquoi on teste chaque réactif séparément.** Chacun impose sa propre limite : on calcule ce que chacun autoriserait s'il était seul en cause, puis on compare. Aucun raisonnement d'ensemble ne remplace ces deux petits calculs."},

    {q:"Quel est donc l'avancement maximal réel de la réaction, en @u{mol} ?",
     rep:0.15, tol:0.005, unite:"mol",
     aide:"La réaction s'arrête dès que l'un des deux réactifs vient à manquer. Lequel manque en premier ?",
     diag:[{v:0.20, m:"$0{,}20$ @u{mol} supposerait que le dichlore tienne jusque-là. Or il est épuisé dès $0{,}15$ : la réaction s'est déjà arrêtée."},
           {v:0.35, m:"Tu as additionné les deux valeurs. L'avancement maximal est le **plus petit** des deux, pas leur somme."}],
     expl:"$x_{max} = 0{,}15$ @u{mol}, la **plus petite** des deux valeurs. **Le raisonnement en une image.** Deux personnes marchent ensemble et doivent rester côte à côte : elles s'arrêtent quand la première fatigue, pas quand la seconde fatigue. La réaction s'arrête dès qu'un réactif manque, même s'il reste beaucoup de l'autre. Prendre la plus grande valeur reviendrait à consommer du dichlore qui n'existe plus."},

    {q:"Quelle quantité d'aluminium reste-t-il à la fin, en @u{mol} ?",
     rep:0.10, tol:0.005, unite:"mol",
     aide:"Pars de la quantité initiale et retire ce qui a été consommé, c'est-à-dire deux fois l'avancement maximal.",
     diag:[{v:0, m:"Zéro serait le cas où l'aluminium est limitant. Ici c'est le dichlore qui manque en premier : il reste donc de l'aluminium."},
           {v:0.25, m:"Tu as retiré $0{,}15$ une seule fois. Le coefficient de l'aluminium est $2$ : il en disparaît $2x$."},
           {v:0.05, m:"Tu as sans doute utilisé $x = 0{,}175$ ou retiré trois fois l'avancement. Reprends : $0{,}40 - 2 × 0{,}15$."}],
     expl:"$n(@c{Al}) = 0{,}40 - 2 × 0{,}15 = 0{,}40 - 0{,}30 = 0{,}10$ @u{mol}. **Ce que cela signifie concrètement.** Un quart de l'aluminium engagé n'a servi à rien : il est resté dans le bécher, intact. C'est le lot du réactif **en excès**, et c'est pourquoi, en industrie, on met délibérément en excès le réactif le moins cher — pour être certain de consommer entièrement le plus coûteux."},

    {q:"Enfin, quelle quantité de chlorure d'aluminium $@c{AlCl_3}$ s'est formée, en @u{mol} ?",
     rep:0.30, tol:0.005, unite:"mol",
     aide:"Le produit apparaît selon son propre coefficient, à partir de zéro.",
     diag:[{v:0.15, m:"Tu as pris l'avancement lui-même. Le coefficient de $@c{AlCl_3}$ est $2$ : il s'en forme $2x$."},
           {v:0.45, m:"Tu as multiplié par $3$, le coefficient du dichlore. Celui du produit est $2$."},
           {v:0.40, m:"$0{,}40$ @u{mol} était la quantité initiale d'aluminium, pas celle du produit formé."}],
     expl:"$n(@c{AlCl_3}) = 0 + 2 × 0{,}15 = 0{,}30$ @u{mol}. **Le contrôle qui ne trompe jamais.** Vérifions les atomes d'aluminium : au départ $0{,}40$ @u{mol}, à la fin $0{,}10$ @u{mol} libres plus $0{,}30$ @u{mol} enfermées dans $@c{AlCl_3}$, soit $0{,}40$ au total. Rien ne s'est perdu. Ce contrôle repère instantanément une erreur de coefficient, et il ne coûte que dix secondes."}
   ],
   bilan:"Le tableau d'avancement tient en quatre gestes : **écrire l'équation équilibrée**, **calculer l'avancement que chaque réactif autoriserait** ($@f{n_0}{coefficient}$), **garder le plus petit**, **en déduire toutes les quantités finales**. Le réactif limitant n'est jamais celui dont on a le moins : c'est celui dont le rapport quantité sur coefficient est le plus petit — ici le dichlore, alors qu'il y en avait pourtant davantage."}
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
  corr:["**Ce que dit l'énoncé.** On me donne une masse, $m = 9{,}0$ @u{g}, et une masse molaire, $M = 18{,}0$ @u{g/mol}. On me demande une quantité de matière, en moles.",
        "**Quelle formule ?** Trois formules donnent une quantité de matière. Celle qui part d'une masse est $n = @f{m}{M}$. C'est donc elle.",
        "**Pourquoi une division ?** La masse molaire dit « $18$ @u{g} pour une mole ». Chercher combien de moles il y a dans $9$ @u{g}, c'est chercher combien de fois $18$ tient dans $9$ : une division.",
        "**Je remplace les lettres par les nombres.** $n = @f{9{,}0}{18{,}0}$.",
        "**Je calcule.** $9$ divisé par $18$ donne $0{,}5$. Donc $n = 0{,}50$ @u{mol}.",
        "**Je vérifie.** Une mole d'eau pèse $18$ @u{g} ; j'en ai deux fois moins, donc une demi-mole. Le résultat est cohérent, et son unité est bien la mole."],
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
  corr:["**Ce que dit l'énoncé.** Le propane $@c{C_3H_8}$ brûle dans le dioxygène. Une combustion complète donne toujours du dioxyde de carbone et de l'eau.",
        "**J'écris l'équation non ajustée.** $@c{C_3H_8} + @c{O_2} → @c{CO_2} + @c{H_2O}$. Il ne reste qu'à trouver les nombres devant chaque formule.",
        "**Le carbone d'abord.** Il y a 3 carbones à gauche, dans $@c{C_3H_8}$. Il en faut donc 3 à droite : je mets un 3 devant $@c{CO_2}$.",
        "**L'hydrogène ensuite.** Il y a 8 hydrogènes à gauche. Chaque molécule d'eau en contient 2, il en faut donc $8 ÷ 2 = 4$ : je mets un 4 devant $@c{H_2O}$.",
        "**L'oxygène en dernier.** Je compte à droite : $3 × 2 = 6$ dans les $@c{CO_2}$, plus $4 × 1 = 4$ dans les $@c{H_2O}$, soit $10$ atomes. Chaque $@c{O_2}$ en apporte 2, il en faut donc $10 ÷ 2 = 5$.",
        "**Je recompte tout.** $@c{C_3H_8} + 5 @c{O_2} → 3 @c{CO_2} + 4 @c{H_2O}$ : 3 C, 8 H et 10 O de chaque côté. L'équation est ajustée."],
  indice:"Ajuste dans l'ordre : carbone, hydrogène, puis oxygène en dernier."},

 {id:"tr3", niveau:1, type:"num", enonce:"On prélève $250$ @u{mL} d'une solution de concentration $0{,}20$ @u{mol/L}. Quelle quantité de matière a-t-on prélevée ?",
  rep:0.05, tol:0.0005, unite:"mol",
  diag:[{v:50, m:"Tu as gardé le volume en millilitres. Dans $n = C × V$, le volume doit être en **litres** : $250$ @u{mL} $= 0{,}250$ @u{L}. Ton résultat est mille fois trop grand."},
        {v:1250, m:"Tu as divisé le volume par la concentration. La formule est une multiplication : $n = C × V$."},
        {v:0.0008, m:"Tu as divisé la concentration par le volume. Souviens-toi du sens : une concentration, c'est un nombre de moles **par litre** ; on la multiplie donc par le nombre de litres."}],
  corr:["**Ce que dit l'énoncé.** Un volume de solution, $V = 250$ @u{mL}, et sa concentration, $C = 0{,}20$ @u{mol/L}. On cherche la quantité de matière prélevée.",
        "**Quelle formule ?** La donnée est un volume **de solution** avec sa concentration : c'est $n = C × V$.",
        "**Attention à l'unité du volume.** La concentration est en moles **par litre**. Le volume doit donc être en litres, pas en millilitres.",
        "**Je convertis.** $250$ @u{mL} $= @f{250}{1000} = 0{,}250$ @u{L}.",
        "**Je remplace et je calcule.** $n = 0{,}20 × 0{,}250 = 0{,}050$ @u{mol}.",
        "**Je vérifie.** Un litre entier contiendrait $0{,}20$ @u{mol} ; j'en prends un quart, donc $0{,}05$ @u{mol}. Cohérent. En millimoles, cela fait $50$ @u{mmol}."],
  indice:"Convertis le volume en litres **avant** de multiplier."},

 {id:"tr4", niveau:2, type:"num", enonce:"On mélange $0{,}30$ @u{mol} de fer et $0{,}20$ @u{mol} de soufre selon $@c{Fe} + @c{S} → @c{FeS}$. Quelle est la valeur de l'avancement maximal $x_{max}$ ?",
  rep:0.2, tol:0.005, unite:"mol",
  diag:[{v:0.3, m:"Tu as pris la quantité du fer. Mais le fer est en excès : la réaction s'arrête quand le **premier** réactif est épuisé, donc au plus petit des deux quotients."},
        {v:0.5, m:"Tu as additionné les deux quantités. L'avancement n'est pas une somme : c'est le nombre de fois où la réaction peut avoir lieu, limité par le réactif le moins fourni."},
        {v:0.1, m:"Tu as fait la différence $0{,}30 - 0{,}20$. Cette différence est ce qui **reste** de fer à la fin, pas l'avancement."}],
  corr:["**Ce que dit l'énoncé.** Deux réactifs, $0{,}30$ @u{mol} de fer et $0{,}20$ @u{mol} de soufre, et l'équation $@c{Fe} + @c{S} → @c{FeS}$. On cherche $x_{max}$, l'avancement maximal.",
        "**Ce qu'est $x_{max}$.** C'est le nombre de fois où la réaction peut se produire avant de s'arrêter. Elle s'arrête quand le premier réactif est épuisé.",
        "**La méthode.** Pour chaque réactif, je calcule $@f{n}{ν}$, c'est-à-dire sa quantité divisée par son nombre stœchiométrique. Ce quotient dit combien de tours de réaction ce réactif peut alimenter à lui seul.",
        "**Je calcule les deux quotients.** Les deux coefficients valent 1, donc : pour le fer $@f{0{,}30}{1} = 0{,}30$, pour le soufre $@f{0{,}20}{1} = 0{,}20$.",
        "**Je prends le plus petit.** $0{,}20 < 0{,}30$ : le soufre s'épuise le premier, c'est lui le réactif limitant. Donc $x_{max} = 0{,}20$ @u{mol}.",
        "**Je vérifie.** Le limitant doit tomber exactement à zéro : $0{,}20 - 0{,}20 = 0$. C'est bon."],
  indice:"Compare $@f{n}{ν}$ pour chaque réactif et garde le plus petit."},

 {id:"tr5", niveau:2, type:"num", enonce:"Même mélange que précédemment ($0{,}30$ @u{mol} de fer, $0{,}20$ @u{mol} de soufre, $@c{Fe} + @c{S} → @c{FeS}$). Quelle quantité de fer reste-t-il à l'état final ?",
  rep:0.1, tol:0.005, unite:"mol",
  diag:[{v:0, m:"Le fer n'est pas le réactif limitant : c'est le soufre qui s'épuise le premier. Le fer, lui, est en excès, il en reste donc à la fin."},
        {v:0.2, m:"$0{,}20$ @u{mol} est la valeur de $x_{max}$, c'est-à-dire ce qui a été **consommé**. La question porte sur ce qui **reste**."},
        {v:0.3, m:"$0{,}30$ @u{mol} est la quantité initiale de fer. Une partie a réagi : il faut la retrancher."}],
  corr:["**Ce que dit l'énoncé.** Même mélange qu'avant. Cette fois on demande ce qu'il **reste** de fer à la fin, pas ce qui a réagi.",
        "**Ce que dit le tableau d'avancement.** Pour un réactif, la quantité restante s'écrit $n = n_{initial} - ν × x$. Ici le coefficient du fer vaut 1.",
        "**Quel avancement utiliser ?** À l'état final, la réaction est allée aussi loin que possible : $x = x_{max} = 0{,}20$ @u{mol}, trouvé à la question précédente.",
        "**Je remplace.** $n(@c{Fe}) = 0{,}30 - 0{,}20$.",
        "**Je calcule.** $n(@c{Fe}) = 0{,}10$ @u{mol}.",
        "**Je vérifie et j'interprète.** Il reste du fer : c'est normal, le fer était en excès. Ces $0{,}10$ @u{mol} restent dans le bécher sans avoir réagi, faute de soufre."],
  indice:"Reprends la ligne du fer dans le tableau d'avancement et remplace $x$ par $x_{max}$."},

 {id:"tr6", niveau:2, type:"qcm", enonce:"On mélange $0{,}80$ @u{mol} d'aluminium et $0{,}90$ @u{mol} de dichlore selon $2 @c{Al} + 3 @c{Cl_2} → 2 @c{AlCl_3}$. Quel est le réactif limitant ?",
  choix:["Le dichlore","L'aluminium","Aucun : le mélange est stœchiométrique","On ne peut pas savoir sans la masse molaire"], bonne:0,
  diag:["",
        "Attention : on ne compare pas les quantités brutes mais les quotients $@f{n}{ν}$. Pour l'aluminium $@f{0{,}80}{2} = 0{,}40$, pour le dichlore $@f{0{,}90}{3} = 0{,}30$. Le plus petit gagne, et c'est le dichlore — même s'il était plus abondant au départ.",
        "Le mélange serait stœchiométrique si les deux quotients étaient égaux. Ici $0{,}40 ≠ 0{,}30$ : l'un des deux s'épuise avant l'autre.",
        "Les masses molaires ne servent qu'à passer d'une masse à une quantité de matière. Ici les quantités sont déjà en moles : tout est disponible."],
  corr:["**Ce que dit l'énoncé.** $0{,}80$ @u{mol} d'aluminium, $0{,}90$ @u{mol} de dichlore, et l'équation $2 @c{Al} + 3 @c{Cl_2} → 2 @c{AlCl_3}$. On cherche lequel des deux s'épuise le premier.",
        "**Le piège à éviter.** Comparer directement $0{,}80$ et $0{,}90$ ne sert à rien : le dichlore est consommé **trois fois plus vite** que l'aluminium n'est consommé deux fois. Les deux ne partent pas à la même allure.",
        "**La bonne comparaison.** Je divise chaque quantité par son nombre stœchiométrique. Cela ramène les deux réactifs à la même échelle : celle du nombre de tours de réaction.",
        "**Pour l'aluminium.** $@f{n}{ν} = @f{0{,}80}{2} = 0{,}40$.",
        "**Pour le dichlore.** $@f{n}{ν} = @f{0{,}90}{3} = 0{,}30$.",
        "**Je conclus.** $0{,}30 < 0{,}40$ : c'est le dichlore qui s'épuise le premier, bien qu'il fût le plus abondant au départ. Il est limitant, et $x_{max} = 0{,}30$ @u{mol}."],
  indice:"Un réactif consommé 3 fois plus vite peut s'épuiser le premier, même s'il est le plus abondant. Divise par le coefficient."},

 {id:"tr7", niveau:3, type:"num", enonce:"Le magnésium brûle selon $2 @c{Mg} + @c{O_2} → 2 @c{MgO}$. On fait brûler $2{,}4$ @u{g} de magnésium en excès de dioxygène. Quelle masse d'oxyde de magnésium obtient-on ? Données : $M(@c{Mg}) = 24{,}0$ @u{g/mol}, $M(@c{MgO}) = 40{,}0$ @u{g/mol}.",
  rep:4, tol:0.05, unite:"g",
  diag:[{v:2.4, m:"Tu as recopié la masse de magnésium. Mais l'oxyde formé contient en plus l'oxygène capté dans l'air : sa masse est forcément plus grande."},
        {v:0.1, m:"$0{,}10$ @u{mol} est la **quantité de matière** de magnésium, pas une masse. Il reste à la convertir avec $m = n × M$."},
        {v:8, m:"Tu as compté deux fois le produit. Le rapport est de 2 pour 2 entre $@c{Mg}$ et $@c{MgO}$ : une mole de magnésium donne **une** mole d'oxyde, pas deux."},
        {v:96, m:"Tu as multiplié par $M(@c{Mg})$ au lieu de diviser au départ. Vérifie l'ordre : d'abord $n = @f{m}{M}$, ensuite seulement $m = n × M$ avec la masse molaire du **produit**."}],
  corr:["**Ce que dit l'énoncé.** $2{,}4$ @u{g} de magnésium brûlent dans un excès de dioxygène, selon $2 @c{Mg} + @c{O_2} → 2 @c{MgO}$. On cherche la masse d'oxyde obtenue.",
        "**Le plan de route.** Une masse ne se transforme jamais directement en une autre masse. Il faut passer par les moles : masse $→$ quantité de matière $→$ quantité de produit $→$ masse de produit.",
        "**Étape 1 — la quantité de magnésium.** $n(@c{Mg}) = @f{m}{M} = @f{2{,}4}{24{,}0} = 0{,}10$ @u{mol}.",
        "**Étape 2 — l'avancement.** Le dioxygène est en excès, donc le magnésium est limitant : $x_{max} = @f{n(@c{Mg})}{2} = @f{0{,}10}{2} = 0{,}050$ @u{mol}.",
        "**Étape 3 — la quantité d'oxyde.** Le coefficient de $@c{MgO}$ vaut 2, donc $n(@c{MgO}) = 2 × x_{max} = 2 × 0{,}050 = 0{,}10$ @u{mol}. Autrement dit, une mole de magnésium donne une mole d'oxyde.",
        "**Étape 4 — la masse.** $m = n × M = 0{,}10 × 40{,}0 = 4{,}0$ @u{g}. C'est plus lourd que les $2{,}4$ @u{g} de départ, et c'est normal : l'oxyde contient en plus l'oxygène capté dans l'air."],
  indice:"Trois étapes : masse → quantité de matière, quantité → quantité de produit par le tableau, puis quantité → masse."},

 {id:"tr8", niveau:3, type:"num", enonce:"On fait réagir $0{,}15$ @u{mol} de carbonate de calcium avec un acide selon $@c{CaCO_3} + 2 @c{HCl} → @c{CaCl_2} + @c{H_2O} + @c{CO_2}$. L'acide est en excès. Quel volume de dioxyde de carbone se dégage ? On prend $V_m = 24{,}0$ @u{L/mol}.",
  rep:3.6, tol:0.05, unite:"L",
  diag:[{v:0.15, m:"$0{,}15$ @u{mol} est la quantité de gaz formé, pas son volume. Pour passer d'une quantité de gaz à un volume, on multiplie par le volume molaire : $V = n × V_m$."},
        {v:0.00625, m:"Tu as divisé par $V_m$ au lieu de multiplier. La règle de sens : une mole de gaz occupe $24$ @u{L}, donc plus il y a de moles, plus le volume est grand."},
        {v:7.2, m:"Tu as doublé le résultat, sans doute à cause du 2 devant $@c{HCl}$. Ce coefficient concerne l'acide, pas le dioxyde de carbone : celui-ci a un coefficient 1."},
        {v:1.8, m:"Tu as divisé par 2. Le carbonate et le dioxyde de carbone ont tous deux un coefficient 1 : une mole de carbonate donne une mole de gaz."}],
  corr:["**Ce que dit l'énoncé.** $0{,}15$ @u{mol} de carbonate de calcium réagissent avec un acide en excès. On cherche le **volume** de gaz dégagé, avec $V_m = 24{,}0$ @u{L/mol}.",
        "**Le plan de route.** Comme pour une masse, on passe par les moles : quantité de réactif $→$ quantité de gaz $→$ volume de gaz.",
        "**Étape 1 — l'avancement.** L'acide est en excès, donc c'est le carbonate qui limite. Son coefficient vaut 1, donc $x_{max} = 0{,}15$ @u{mol}.",
        "**Étape 2 — la quantité de gaz.** Le coefficient du $@c{CO_2}$ vaut 1 lui aussi : $n(@c{CO_2}) = x_{max} = 0{,}15$ @u{mol}. Le 2 devant $@c{HCl}$ ne concerne que l'acide.",
        "**Étape 3 — le volume.** Pour un gaz, $V = n × V_m$. Le volume molaire dit « $24$ @u{L} pour une mole » : plus il y a de moles, plus le volume est grand, donc on multiplie.",
        "**Je calcule et je vérifie.** $V = 0{,}15 × 24{,}0 = 3{,}6$ @u{L}. Un ordre de grandeur plausible : quelques litres de gaz, soit une bouteille bien remplie."],
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
  ,{t:"mots", items:[
   ["Absorbance","Un nombre, sans unité, qui dit quelle part de la lumière la solution a retenue. Plus la solution est concentrée, plus l'absorbance est grande."],
   ["Spectrophotomètre","L'appareil qui mesure l'absorbance. On y glisse une petite cuve transparente contenant la solution."],
   ["Étalonner","Fabriquer soi-même des solutions dont on connaît la concentration, pour s'en servir ensuite de règle graduée."],
   ["Gamme d'étalonnage","La série de solutions de concentrations connues qu'on a préparées. Cinq ou six suffisent."],
   ["Solution mère","La solution concentrée de départ, celle qu'on va diluer pour fabriquer les autres."],
   ["Solution fille","Une solution obtenue en diluant la solution mère."],
   ["Conductivité","La capacité d'une solution à laisser passer le courant. Elle augmente avec la quantité d'ions présents."]
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
  ,{t:"methode", titre:"Exploiter une droite d'étalonnage", etapes:[
   "**Repérer un point connu** de la droite : un couple (concentration, absorbance) donné par l'énoncé ou lu sur le graphique.",
   "**Comparer les absorbances** : diviser l'absorbance inconnue par l'absorbance connue. On obtient un facteur.",
   "**Appliquer ce facteur à la concentration** connue. C'est un simple produit en croix, puisque la loi est une proportionnalité.",
   "**Vérifier le sens** : une absorbance plus grande doit donner une concentration plus grande. Si ce n'est pas le cas, la division a été faite à l'envers."
  ], exemple:"La droite donne $A = 0{,}18$ pour $C = 1{,}0$ @u{mmol/L}, et l'inconnue mesure $A = 0{,}45$. Le facteur vaut $@f{0{,}45}{0{,}18} = 2{,}5$, donc $C = 1{,}0 × 2{,}5 = 2{,}5$ @u{mmol/L}. L'absorbance est plus grande, la concentration aussi : c'est cohérent."}
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
  {t:"piege", titre:"La température compte", x:"La conductivité **augmente avec la température**. Toutes les mesures d'une même gamme doivent donc être faites à la même température, sinon les points ne s'alignent pas. C'est une source d'erreur classique en TP."}
  ,{t:"p", x:"Il reste une opération que tu rencontreras dans presque tous les TP, et qui mérite une partie à elle : **la dilution**."},
  {t:"check", q:"Une solution d'ion permanganate, violette, a une absorbance de $0{,}60$. La droite d'étalonnage donne $A = 0{,}24$ pour $C = 2{,}0 × 10^{-4}$ @u{mol/L}. Quelle est sa concentration ?",
   choix:["$5{,}0 × 10^{-4}$ @u{mol/L}","$8{,}0 × 10^{-5}$ @u{mol/L}","$2{,}4 × 10^{-4}$ @u{mol/L}","$1{,}4 × 10^{-4}$ @u{mol/L}"], bonne:0,
   expl:["Exact : l'absorbance est $0{,}60 ÷ 0{,}24 = 2{,}5$ fois plus grande, donc la concentration aussi : $2{,}0 × 10^{-4} × 2{,}5 = 5{,}0 × 10^{-4}$ @u{mol/L}.",
         "Tu as divisé au lieu de multiplier. Une absorbance **plus grande** signifie une solution **plus concentrée**.",
         "Tu as recopié la concentration de référence en changeant les chiffres de l'absorbance. Il faut faire le rapport des absorbances, puis l'appliquer à la concentration.",
         "Tu as soustrait au lieu de faire un rapport. La loi de Beer-Lambert est une proportionnalité : on travaille en multipliant, pas en ajoutant."]}
 ]},

 {titre:"Diluer une solution", blocs:[
  {t:"idee", x:"**Diluer, c'est ajouter du solvant sans rien ajouter d'autre.** La solution devient moins concentrée, mais la quantité de matière du soluté, elle, ne change pas d'un iota : on n'a rien retiré, rien versé de plus."},
  {t:"p", x:"C'est cette phrase qui contient toute la formule. Avant la dilution, le soluté représente une certaine quantité de matière. Après, cette quantité est exactement la même — simplement répartie dans un plus grand volume. Il suffit donc d'écrire deux fois $n = C × V$ et de les égaler."},
  {t:"formule", titre:"La relation de dilution",
   x:"$C_{mère} × V_{prélevé} = C_{fille} × V_{final}$",
   note:"Les deux membres valent la même quantité de matière $n$. Les volumes doivent être dans la même unité, mais pas forcément en litres."},
  {t:"formule", titre:"Le facteur de dilution",
   x:"$F = @f{C_{mère}}{C_{fille}} = @f{V_{final}}{V_{prélevé}}$",
   note:"« Diluer 10 fois » signifie $F = 10$ : la concentration est divisée par 10, le volume multiplié par 10."},
  {t:"methode", titre:"Préparer une solution diluée", etapes:[
   "**Calculer le volume à prélever** : $V_{prélevé} = @f{C_{fille} × V_{final}}{C_{mère}}$.",
   "**Prélever ce volume de solution mère** à la pipette jaugée — jamais à l'éprouvette, qui est trop imprécise.",
   "**Le verser dans une fiole jaugée** du volume final voulu.",
   "**Compléter avec de l'eau distillée** jusqu'au trait de jauge, puis boucher et retourner plusieurs fois pour homogénéiser."
  ], exemple:"Pour obtenir $100$ @u{mL} à $0{,}020$ @u{mol/L} à partir d'une solution mère à $0{,}10$ @u{mol/L} : $V = @f{0{,}020 × 100}{0{,}10} = 20$ @u{mL}. On prélève $20$ @u{mL} de mère, et on complète à $100$ @u{mL}."},
  {t:"piege", titre:"On ne complète pas, on complète **jusqu'au trait**", x:"Ajouter $80$ @u{mL} d'eau à $20$ @u{mL} de solution mère ne donne pas exactement $100$ @u{mL} : les volumes ne s'additionnent pas parfaitement. C'est pourquoi on utilise une **fiole jaugée** et qu'on complète jusqu'au trait, sans compter l'eau ajoutée."},
  {t:"astuce", titre:"Le sens de la dilution", x:"Une solution diluée est **moins** concentrée : si ton calcul donne une concentration plus grande après dilution, tu as inversé un rapport. Et pour remonter d'une solution diluée à la solution d'origine, on **multiplie** par le facteur de dilution."},
  {t:"check", q:"On dilue $10$ fois une solution. Que devient sa concentration ?",
   choix:["Elle est divisée par 10","Elle est multipliée par 10","Elle ne change pas","Elle diminue de 10 @u{mol/L}"], bonne:0,
   expl:["Exact : la même quantité de matière occupe dix fois plus de volume, donc la concentration est dix fois plus petite.",
         "Multiplier reviendrait à concentrer la solution, c'est-à-dire à retirer du solvant. Diluer, c'est le contraire : on en ajoute.",
         "La quantité de matière ne change pas, mais la concentration, elle, change : c'est un nombre de moles **par litre**, et le nombre de litres a augmenté.",
         "Une dilution est une **division**, pas une soustraction. « Dix fois moins » ne veut pas dire « dix de moins »."]}
 ]},


 {titre:"Atelier — d'une absorbance à une concentration", blocs:[
  {t:"p", x:"Doser par étalonnage, c'est comparer un inconnu à des références. La chaîne complète tient en quatre gestes : diluer, mesurer, tracer, lire. Tu vas la parcourir en calculant chaque valeur."},
  {t:"atelier", titre:"Le dosage d'un sirop coloré",
   enonce:"On dispose d'une solution mère de concentration $C_0 = 0{,}020$ @u{mol/L}. On en prélève $5{,}0$ @u{mL} que l'on complète à $50{,}0$ @u{mL} avec de l'eau distillée. La solution obtenue sert d'étalon : son absorbance mesurée vaut $A = 0{,}60$.",
   etapes:[
    {q:"Quel est le facteur de dilution ?",
     rep:10, tol:0.1, unite:"(sans unité)",
     aide:"Le facteur de dilution compare le volume final au volume prélevé.",
     diag:[{v:0.1, m:"La division est inversée. Le facteur de dilution est $@f{V_{final}}{V_{prélevé}}$, et il est toujours **supérieur à 1** : diluer, c'est étaler."},
           {v:45, m:"Tu as calculé le volume d'eau ajoutée, $50 - 5$. Le facteur est un rapport, pas une différence."},
           {v:250, m:"Tu as multiplié les deux volumes. C'est un quotient qu'il faut former."}],
     expl:"$F = @f{V_{fille}}{V_{prélevé}} = @f{50{,}0}{5{,}0} = 10$. **Ce qu'un facteur 10 veut dire.** Toutes les molécules prélevées sont toujours là — on n'en a ni ajouté ni retiré — mais elles occupent dix fois plus de place. La quantité de matière ne change pas ; c'est la concentration, qui est une quantité **par litre**, qui est divisée par dix."},

    {q:"Quelle est alors la concentration de la solution étalon, en @u{mol/L} ?",
     rep:2.0e-3, tol:5e-5, unite:"mol/L",
     aide:"Dix fois plus dilué, donc dix fois moins concentré. Écris ta réponse par exemple sous la forme 2,0e-3.",
     diag:[{v:0.2, m:"Tu as divisé par $0{,}1$, ce qui revient à multiplier par dix. Diluer **diminue** la concentration."},
           {v:0.020, m:"$0{,}020$ @u{mol/L} est la concentration de la solution **mère**, avant dilution."},
           {v:2e-4, m:"Il manque un facteur dix : $@f{0{,}020}{10} = 2{,}0 × 10^{-3}$, et non $2{,}0 × 10^{-4}$."}],
     expl:"$C = @f{C_0}{F} = @f{0{,}020}{10} = 2{,}0 × 10^{-3}$ @u{mol/L}. **Le contrôle de bon sens.** Une solution diluée est toujours **moins** concentrée que la mère. Si ton résultat est plus grand que $0{,}020$, l'erreur est certaine — inutile de relire le calcul, il faut inverser la division."},

    {q:"Cette solution donne $A = 0{,}60$. Quel est le coefficient $k$ de la droite d'étalonnage $A = k × C$, en @u{L/mol} ?",
     rep:300, tol:5, unite:"L/mol",
     aide:"Le coefficient est la pente : l'absorbance divisée par la concentration qui l'a produite.",
     diag:[{v:0.0012, m:"Tu as multiplié $A$ par $C$. La pente est un **quotient** : $k = @f{A}{C}$."},
           {v:0.0033, m:"La division est inversée : $@f{C}{A}$ au lieu de $@f{A}{C}$."},
           {v:30, m:"Erreur d'un facteur dix : $@f{0{,}60}{2{,}0 × 10^{-3}} = 300$."}],
     expl:"$k = @f{A}{C} = @f{0{,}60}{2{,}0 × 10^{-3}} = 300$ @u{L/mol}. **Pourquoi une seule mesure suffit ici.** Parce que la droite passe par l'origine : une solution sans colorant n'absorbe rien. Deux points sont donc connus — l'origine et l'étalon — et deux points définissent une droite. En pratique on en mesure cinq ou six, non pour trouver la pente, mais pour vérifier que les points sont bien alignés."},

    {q:"Un échantillon inconnu donne $A = 0{,}45$. Quelle est sa concentration, en @u{mol/L} ?",
     rep:1.5e-3, tol:5e-5, unite:"mol/L",
     aide:"La relation $A = k C$ se retourne pour donner $C$.",
     diag:[{v:135, m:"Tu as multiplié $A$ par $k$. Il faut diviser : $C = @f{A}{k}$."},
           {v:2e-3, m:"$2{,}0 × 10^{-3}$ @u{mol/L} est la concentration de l'**étalon**. L'échantillon absorbe moins : il est donc moins concentré."},
           {v:667, m:"La division est inversée : $@f{k}{A}$ au lieu de $@f{A}{k}$."}],
     expl:"$C = @f{A}{k} = @f{0{,}45}{300} = 1{,}5 × 10^{-3}$ @u{mol/L}. **Le contrôle par proportionnalité, sans calcul.** $0{,}45$ vaut les trois quarts de $0{,}60$ ; la concentration doit donc valoir les trois quarts de $2{,}0 × 10^{-3}$, soit $1{,}5 × 10^{-3}$. Quand la relation est une simple proportionnalité, ce raisonnement de tête vérifie le résultat plus vite que la calculatrice."},

    {q:"Pourquoi la droite d'étalonnage passe-t-elle nécessairement par l'origine ?",
     choix:["Parce qu'une solution sans colorant n'absorbe rien","Parce que le spectrophotomètre est réglé sur zéro au début","Parce que la droite est une droite, et que toute droite passe par l'origine","C'est une convention de tracé, sans signification physique"],
     bonne:0,
     diag:["","Le réglage du zéro sert bien à cela, mais il est le **moyen** ; la raison est physique : sans espèce colorée, il n'y a rien pour absorber la lumière.",
           "Une droite ne passe pas par l'origine en général — celle d'un thermomètre en degrés Fahrenheit, par exemple, ne le fait pas. Ici c'est la physique qui l'impose.",
           "Ce n'est pas une convention : c'est une propriété mesurable, et elle se vérifie expérimentalement."],
     expl:"S'il n'y a aucune espèce colorée, il n'y a rien pour absorber la lumière : $C = 0$ entraîne $A = 0$. **Ce que cela permet.** Le point $(0 ; 0)$ étant acquis gratuitement, la droite est entièrement déterminée par un seul autre point, et la relation devient une simple proportionnalité — d'où le mot « coefficient » plutôt que « équation de droite ». **Et attention à la limite** : cette proportionnalité cesse d'être vraie pour les solutions très concentrées, où la courbe s'infléchit. C'est pourquoi on dilue avant de doser."}
   ],
   bilan:"La chaîne complète d'un dosage par étalonnage : **diluer** (la concentration se divise par le facteur, la quantité de matière ne bouge pas), **mesurer** l'absorbance des étalons, **tracer** la droite qui passe par l'origine, **lire** l'inconnu dessus. La seule formule est $A = k C$ — tout le reste est de la proportionnalité."}
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
  corr:["**Ce que dit l'énoncé.** La solution est bleue. On demande sur quelle longueur d'onde régler le spectrophotomètre.",
        "**Ce que fait l'appareil.** Il mesure ce que la solution **absorbe**. Plus elle absorbe, plus la mesure est nette et précise.",
        "**Pourquoi la solution paraît bleue.** Elle nous paraît bleue parce qu'elle **laisse passer** le bleu. Ce qu'elle absorbe, c'est donc tout sauf le bleu — et surtout sa couleur complémentaire.",
        "**Je cherche la complémentaire du bleu.** C'est l'orange. C'est la couleur que la solution retient le plus.",
        "**Je traduis en longueur d'onde.** L'orange se situe vers $600$ @u{nm}.",
        "**Je conclus.** On règle l'appareil sur $600$ @u{nm} : c'est là que l'absorbance est maximale, donc la mesure la plus fiable."],
  indice:"On règle l'appareil sur la couleur que la solution **absorbe**, pas sur celle qu'elle renvoie."},

 {id:"me2", niveau:1, type:"num", enonce:"Une solution de concentration $C = 2{,}0$ @u{mmol/L} a une absorbance $A = 0{,}36$. Quelle est la valeur du coefficient $k$ de la loi $A = k × C$, en @u{L/mmol} ?",
  rep:0.18, tol:0.005,
  diag:[{v:5.56, m:"Tu as calculé $@f{C}{A}$, la division à l'envers. La loi s'écrit $A = k × C$, donc $k = @f{A}{C}$."},
        {v:0.72, m:"Tu as multiplié $A$ par $C$. Pour isoler $k$ dans $A = k × C$, il faut diviser les deux membres par $C$."}],
  corr:["**Ce que dit l'énoncé.** Une solution de concentration connue, $C = 2{,}0$ @u{mmol/L}, donne une absorbance $A = 0{,}36$. On cherche le coefficient $k$.",
        "**La loi en jeu.** La loi de Beer-Lambert s'écrit $A = k × C$ : l'absorbance est proportionnelle à la concentration, et $k$ est le coefficient de cette proportionnalité.",
        "**J'isole l'inconnue.** Dans $A = k × C$, pour isoler $k$ je divise les deux membres par $C$ : $k = @f{A}{C}$.",
        "**Je remplace.** $k = @f{0{,}36}{2{,}0}$.",
        "**Je calcule.** $k = 0{,}18$.",
        "**Je vérifie par les unités.** $A$ n'a pas d'unité et $C$ est en @u{mmol/L}, donc $k$ s'exprime en @u{L/mmol}. Et une concentration deux fois plus grande donnerait bien une absorbance deux fois plus grande."],
  indice:"Isole $k$ dans $A = k × C$ avant de remplacer les valeurs."},

 {id:"me3", niveau:2, type:"num", enonce:"Sur la même droite d'étalonnage ($A = 0{,}36$ pour $C = 2{,}0$ @u{mmol/L}), une solution inconnue donne $A = 0{,}54$. Quelle est sa concentration, en @u{mmol/L} ?",
  rep:3, tol:0.05, unite:"mmol/L",
  diag:[{v:1.33, m:"Tu as inversé le rapport. L'absorbance inconnue ($0{,}54$) est **plus grande** que celle de référence ($0{,}36$) : la solution est donc plus concentrée, pas moins."},
        {v:0.19, m:"Tu as divisé les absorbances entre elles sans les rapporter à la concentration connue. Le rapport $@f{0{,}54}{0{,}36} = 1{,}5$ doit ensuite multiplier $2{,}0$ @u{mmol/L}."},
        {v:1.5, m:"$1{,}5$ est le rapport des absorbances, pas une concentration. Il reste à le multiplier par la concentration de référence."}],
  corr:["**Ce que dit l'énoncé.** Sur la même droite, un point connu ($C = 2{,}0$ @u{mmol/L} pour $A = 0{,}36$) et une solution inconnue d'absorbance $A = 0{,}54$.",
        "**L'idée.** Puisque $A$ et $C$ sont proportionnelles, si l'absorbance est multipliée par un certain facteur, la concentration l'est par le même. Un produit en croix suffit, sans passer par $k$.",
        "**Je calcule le facteur.** $@f{0{,}54}{0{,}36} = 1{,}5$. L'absorbance inconnue est $1{,}5$ fois plus grande que celle de référence.",
        "**J'applique le même facteur à la concentration.** $C = 2{,}0 × 1{,}5$.",
        "**Je calcule.** $C = 3{,}0$ @u{mmol/L}.",
        "**Je vérifie le sens.** L'absorbance est plus grande, donc la solution est plus concentrée. $3{,}0 > 2{,}0$ : c'est cohérent. Si j'avais trouvé moins de $2{,}0$, j'aurais inversé la division."],
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
  corr:["**Ce que demande la question.** Pourquoi la droite d'étalonnage doit passer par le point $(0 ; 0)$.",
        "**Je pars de la loi.** $A = k × C$. C'est une proportionnalité : elle est représentée par une droite passant par l'origine, toujours.",
        "**Je regarde le cas $C = 0$.** Une concentration nulle signifie qu'il n'y a aucune espèce colorée dans la cuve — seulement du solvant.",
        "**Ce que mesure alors l'appareil.** Sans espèce absorbante, la lumière traverse sans être retenue : rien n'est absorbé, donc $A = 0$.",
        "**Je conclus.** Le couple $(C = 0 ; A = 0)$ appartient donc nécessairement à la droite : elle passe par l'origine.",
        "**Ce que cela sert en TP.** Si tes points ne s'alignent pas avec l'origine, c'est le signe d'une erreur : appareil non remis à zéro avec le solvant seul, ou cuve mal essuyée."],
  indice:"Demande-toi ce que mesure l'appareil quand la cuve ne contient que du solvant."},

 {id:"me5", niveau:2, type:"txt", enonce:"Une solution incolore d'eau salée doit être dosée. Quelle méthode faut-il utiliser ? (réponds par un mot)",
  reps:["conductimetrie","conductimétrie","la conductimetrie","conductimetrique"],
  diag:[{r:"spectrophotometrie", m:"La spectrophotométrie mesure une absorption de lumière : elle ne fonctionne que sur des solutions **colorées**. Une solution incolore n'absorbe rien dans le visible. Mais l'eau salée contient des ions : elle conduit le courant."},
        {r:"titrage", m:"Un titrage est possible, mais la question porte sur une mesure physique directe. Une solution ionique se dose très simplement en mesurant sa conductivité."}],
  corr:["**Ce que dit l'énoncé.** Il faut doser une solution d'eau salée, qui est **incolore**.",
        "**J'élimine la première méthode.** La spectrophotométrie mesure une absorption de lumière. Une solution incolore n'absorbe presque rien dans le visible : la mesure serait inexploitable.",
        "**Je cherche une autre propriété mesurable.** L'eau salée contient des ions sodium et chlorure, libres de se déplacer.",
        "**Ce que font ces ions.** Des ions mobiles transportent le courant électrique : la solution est conductrice, et d'autant plus qu'elle est concentrée.",
        "**Je nomme la méthode.** On mesure donc la conductivité de la solution : c'est la conductimétrie.",
        "**Comment on l'exploite.** Exactement comme l'absorbance : une gamme de solutions connues, une droite d'étalonnage, et une lecture de la concentration inconnue."],
  indice:"Si la couleur ne dit rien, cherche une autre propriété : ces ions font-ils passer le courant ?"},

 {id:"me6", niveau:3, type:"num", enonce:"Une gamme d'étalonnage donne $σ = 1{,}2$ @u{mS/cm} pour $C = 5{,}0$ @u{mmol/L}. Une solution inconnue a une conductivité $σ = 1{,}8$ @u{mS/cm}. Quelle est sa concentration, en @u{mmol/L} ?",
  rep:7.5, tol:0.05, unite:"mmol/L",
  diag:[{v:3.33, m:"Tu as inversé le rapport. La conductivité inconnue est plus grande, donc la solution est **plus concentrée** que celle de référence."},
        {v:1.5, m:"$1{,}5$ est le rapport des conductivités. Il faut encore le multiplier par la concentration de référence, $5{,}0$ @u{mmol/L}."},
        {v:6.5, m:"Tu as ajouté la différence des conductivités à la concentration. C'est une proportionnalité, pas une addition : on multiplie par un rapport."}],
  corr:["**Ce que dit l'énoncé.** Un point connu ($σ = 1{,}2$ @u{mS/cm} pour $C = 5{,}0$ @u{mmol/L}) et une solution inconnue de conductivité $σ = 1{,}8$ @u{mS/cm}.",
        "**La loi en jeu.** La conductivité est proportionnelle à la concentration : $σ = k' × C$. Même raisonnement qu'avec l'absorbance, seul l'appareil change.",
        "**Je calcule le facteur.** $@f{1{,}8}{1{,}2} = 1{,}5$.",
        "**J'applique ce facteur à la concentration.** $C = 5{,}0 × 1{,}5$.",
        "**Je calcule.** $C = 7{,}5$ @u{mmol/L}.",
        "**Je vérifie le sens.** Plus la solution conduit, plus elle contient d'ions, donc plus elle est concentrée. $7{,}5 > 5{,}0$ : cohérent."],
  indice:"Même raisonnement qu'avec l'absorbance : produit en croix sur la droite d'étalonnage."},

 {id:"me9", niveau:2, type:"num", enonce:"On veut préparer $100$ @u{mL} d'une solution à $0{,}020$ @u{mol/L} à partir d'une solution mère à $0{,}10$ @u{mol/L}. Quel volume de solution mère faut-il prélever, en @u{mL} ?",
  rep:20, tol:0.2, unite:"mL",
  diag:[{v:500, m:"Tu as inversé le rapport des concentrations. On part d'une solution **plus concentrée** pour en faire une plus diluée : le volume à prélever est forcément **plus petit** que le volume final."},
        {v:80, m:"$80$ @u{mL} est le volume d'eau à ajouter, pas le volume à prélever. Et encore : on ne compte pas l'eau, on complète jusqu'au trait de jauge."},
        {v:2, m:"Erreur d'un facteur 10 : $@f{0{,}020 × 100}{0{,}10} = @f{2{,}0}{0{,}10} = 20$, et non $2$."}],
  corr:["**Ce que dit l'énoncé.** On veut $100$ @u{mL} à $0{,}020$ @u{mol/L}, à partir d'une solution mère à $0{,}10$ @u{mol/L}. On cherche le volume de mère à prélever.",
        "**L'idée de la dilution.** Ajouter de l'eau ne change pas la quantité de matière du soluté. Celle qu'on prélève dans la mère est exactement celle qu'on retrouve dans la fille.",
        "**Je traduis en équation.** $n$ prélevée $=$ $n$ finale, donc $C_{mère} × V_{prélevé} = C_{fille} × V_{final}$.",
        "**J'isole l'inconnue.** $V_{prélevé} = @f{C_{fille} × V_{final}}{C_{mère}}$.",
        "**Je remplace et je calcule.** $V_{prélevé} = @f{0{,}020 × 100}{0{,}10} = @f{2{,}0}{0{,}10} = 20$ @u{mL}. Les deux volumes sont en @u{mL} des deux côtés : aucune conversion n'est nécessaire.",
        "**Je vérifie.** La concentration est divisée par $5$, le volume prélevé doit donc être $5$ fois plus petit que le volume final : $@f{100}{5} = 20$ @u{mL}. Cohérent."],
  indice:"Écris $C_{mère} V_{prélevé} = C_{fille} V_{final}$, puis isole le volume cherché."},

 {id:"me10", niveau:2, type:"num", enonce:"Une solution est diluée $20$ fois. Sa concentration après dilution vaut $2{,}5 × 10^{-3}$ @u{mol/L}. Quelle était sa concentration avant, en @u{mol/L} ?",
  rep:0.05, tol:0.0005, unite:"mol/L",
  diag:[{v:1.25e-4, m:"Tu as divisé par 20 au lieu de multiplier. La solution de départ est **plus concentrée** que la solution diluée : pour remonter, on multiplie."},
        {v:0.0225, m:"Tu as multiplié par 9, ou fait une addition. Le facteur de dilution s'applique par multiplication : $2{,}5 × 10^{-3} × 20$."},
        {v:20, m:"20 est le facteur de dilution, pas une concentration."}],
  corr:["**Ce que dit l'énoncé.** Une solution a été diluée $20$ fois, et la solution diluée titre $2{,}5 × 10^{-3}$ @u{mol/L}. On cherche la concentration **avant** dilution.",
        "**Ce que fait une dilution.** Elle rend la solution moins concentrée. Diluer $20$ fois divise la concentration par $20$.",
        "**Donc, pour revenir en arrière.** Si la dilution divise, remonter multiplie. Je multiplie la concentration diluée par $20$.",
        "**Je pose le calcul.** $C = 2{,}5 × 10^{-3} × 20$.",
        "**Je calcule.** $2{,}5 × 20 = 50$, donc $C = 50 × 10^{-3} = 5{,}0 × 10^{-2}$ @u{mol/L}, soit $0{,}050$ @u{mol/L}.",
        "**Je vérifie le sens.** La solution d'origine doit être **plus** concentrée que la diluée : $0{,}050 > 0{,}0025$. Cohérent."],
  indice:"Diluer divise, donc remonter multiplie."},

 {id:"me7", niveau:3, type:"num", enonce:"Une solution inconnue donne $A = 1{,}90$, alors que le point le plus concentré de la gamme donne $A = 0{,}80$. On la dilue 5 fois et on retrouve $A = 0{,}38$. Sachant que la gamme donne $A = 0{,}19$ pour $C = 1{,}0$ @u{mmol/L}, quelle était la concentration de la solution **avant** dilution, en @u{mmol/L} ?",
  rep:10, tol:0.1, unite:"mmol/L",
  diag:[{v:2, m:"$2{,}0$ @u{mmol/L} est la concentration de la solution **diluée**. La question porte sur la solution de départ : il faut multiplier par le facteur de dilution, 5."},
        {v:0.4, m:"Tu as divisé par 5 au lieu de multiplier. La dilution rend la solution **moins** concentrée : la solution d'origine est donc plus concentrée que celle qu'on a mesurée."},
        {v:5, m:"5 est le facteur de dilution, pas une concentration. Il sert à remonter de la solution diluée à la solution de départ."}],
  corr:["**Ce que dit l'énoncé.** La solution est trop concentrée pour la gamme ($A = 1{,}90$ contre $0{,}80$ au maximum), on la dilue $5$ fois, et la solution diluée donne $A = 0{,}38$.",
        "**Pourquoi diluer.** Au-delà de la gamme, la proportionnalité n'est plus vraie : la droite s'incurve. La seule solution est de ramener la mesure dans le domaine où la loi s'applique.",
        "**Étape 1 — la concentration de la solution diluée.** Sur la droite, $A = 0{,}19$ correspond à $C = 1{,}0$ @u{mmol/L}. Le facteur vaut $@f{0{,}38}{0{,}19} = 2{,}0$, donc $C_{diluée} = 1{,}0 × 2{,}0 = 2{,}0$ @u{mmol/L}.",
        "**Étape 2 — remonter à la solution d'origine.** La dilution a divisé la concentration par $5$. Pour revenir en arrière, je multiplie par $5$.",
        "**Je calcule.** $C = 2{,}0 × 5 = 10$ @u{mmol/L}.",
        "**Je vérifie.** $10$ @u{mmol/L} est bien au-delà du point le plus concentré de la gamme — ce qui explique pourquoi la mesure directe donnait une absorbance ininterprétable."],
  indice:"Deux étapes : lire la concentration de la solution diluée sur la droite, puis remonter à celle d'origine."},

 {id:"me8", niveau:3, type:"qcm", enonce:"Au cours d'une réaction, un réactif coloré disparaît. Comment évolue l'absorbance mesurée au fil du temps ?",
  choix:["Elle diminue et tend vers une valeur limite","Elle augmente régulièrement","Elle reste constante","Elle augmente puis diminue"], bonne:0,
  diag:["",
        "L'absorbance suit la concentration de l'espèce colorée. Si celle-ci **disparaît**, son absorbance ne peut pas augmenter.",
        "Une absorbance constante signifierait que la concentration ne change pas, donc qu'il ne se passe rien. Or le réactif est consommé.",
        "Ce profil correspondrait à une espèce qui se forme puis se consomme — un intermédiaire. Ici l'espèce colorée est un réactif : elle ne fait que disparaître."],
  corr:["**Ce que dit l'énoncé.** Une espèce **colorée** disparaît au cours de la réaction. On demande comment évolue l'absorbance.",
        "**Le lien à faire.** La loi de Beer-Lambert dit $A = k × C$ : l'absorbance est l'image directe de la concentration de l'espèce colorée. Ce que fait la concentration, l'absorbance le fait aussi.",
        "**Ce que fait la concentration ici.** L'espèce colorée est un réactif : elle est consommée, donc sa concentration diminue au fil du temps.",
        "**J'en déduis l'absorbance.** Elle diminue elle aussi, dans les mêmes proportions.",
        "**Ce qui se passe à la fin.** Quand la réaction s'arrête, la concentration ne change plus : l'absorbance se stabilise sur une valeur limite.",
        "**Le cas particulier.** Si le réactif coloré est entièrement consommé, cette valeur limite est zéro : la solution se décolore complètement."],
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
   note:"Avant : le réactif titrant est limitant. Après : c'est lui qui est en excès."}
  ,{t:"mots", items:[
   ["Titrer","Déterminer la concentration d'une solution en la faisant réagir, petit à petit, avec une solution de concentration connue."],
   ["Solution titrée","Celle dont on cherche la concentration. Elle attend dans le bécher."],
   ["Solution titrante","Celle qu'on verse, et dont la concentration est connue. Elle est dans la burette."],
   ["Équivalence","L'instant précis où les deux réactifs se sont exactement consommés l'un l'autre. Ni l'un ni l'autre n'est alors en excès."],
   ["Volume équivalent","Le volume de titrant versé à cet instant. C'est la seule mesure de tout le TP, et tout le calcul en dépend."],
   ["Indicateur coloré","Une espèce ajoutée en quelques gouttes, qui change de teinte au moment de l'équivalence pour la rendre visible."],
   ["Pipette jaugée","Un tube de verre qui prélève un volume précis et unique — $10{,}0$ @u{mL} par exemple. Bien plus précise qu'une éprouvette."]
  ]},
  {t:"p", x:"C'est l'instant charnière. Avant l'équivalence, chaque goutte versée est immédiatement consommée : le réactif titrant disparaît au fur et à mesure. Après l'équivalence, il n'y a plus rien pour le consommer : il s'accumule dans le bécher. Le changement de couleur signale précisément le passage de l'un à l'autre."}
 ]},

 {titre:"Repérer l'équivalence à l'œil", blocs:[
  {t:"p", x:"Dans un titrage colorimétrique, on repère l'équivalence par un **changement de couleur persistant**. Deux situations se présentent."},
  {t:"liste", items:[
   "**Un des réactifs est coloré** : la couleur disparaît (ou apparaît) d'elle-même à l'équivalence. Par exemple le permanganate violet, qui se décolore tant qu'il est consommé, et dont la première goutte en excès rose l'ensemble.",
   "**Aucun réactif n'est coloré** : on ajoute un **indicateur coloré**, une espèce qui change de teinte selon les conditions du milieu. C'est lui qui donne le signal."
  ]},
  {t:"astuce", titre:"La bonne technique de versement", x:"On verse vite jusqu'aux environs de l'équivalence, puis **goutte à goutte** en agitant entre chaque goutte. L'équivalence est atteinte à la **première goutte** qui donne une couleur persistante — pas quand la couleur est franche et intense : là, on a déjà dépassé."},
  {t:"piege", titre:"Une couleur fugace n'est pas l'équivalence", x:"Avant l'équivalence, chaque goutte crée une tache colorée qui **disparaît en agitant**. C'est normal : le réactif est encore consommé. Seule compte la couleur qui **reste** après agitation."}
  ,{t:"figi", nom:"titrage"}
  ,{t:"p", x:"Verse doucement avec le curseur. Tant que la courbe descend, chaque goutte est aussitôt consommée. Quand elle touche zéro, l'équivalence est atteinte : c'est ce volume-là qu'on relève. Une goutte de plus, et le bécher rosit pour de bon — trop tard, on a dépassé."},
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
  ,{t:"methode", titre:"Résoudre un exercice de titrage", etapes:[
   "**Ranger les données dans deux colonnes** : d'un côté la solution titrée ($V_A$ connu, $C_A$ cherchée), de l'autre la titrante ($C_B$ et $V_{éq}$ connus).",
   "**Relever les nombres stœchiométriques** des deux réactifs dans l'équation de titrage. S'ils valent tous les deux 1, la suite est plus simple.",
   "**Écrire la relation d'équivalence sous sa forme générale** : $@f{n_A}{a} = @f{n_B}{b}$, avant de remplacer quoi que ce soit.",
   "**Remplacer $n$ par $C × V$**, puis isoler la concentration cherchée.",
   "**Calculer, puis vérifier le sens** : beaucoup de titrant versé signifie une solution titrée concentrée."
  ], exemple:"Pour $V_A = 20{,}0$ @u{mL} titrés par $C_B = 0{,}10$ @u{mol/L} avec $V_{éq} = 15{,}0$ @u{mL} et des coefficients égaux à 1 : $C_A V_A = C_B V_{éq}$, donc $C_A = @f{0{,}10 × 15{,}0}{20{,}0} = 0{,}075$ @u{mol/L}. On a versé moins de titrant qu'on n'avait de solution : la solution titrée est bien moins concentrée. Cohérent."}
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
  ,{t:"check", q:"Pour un titrage suivant $@c{I_2} + 2 @c{S_2O_3^{2-}} → produits$, quelle relation est correcte à l'équivalence ?",
   choix:["$n(@c{I_2}) = @f{n(@c{S_2O_3^{2-}})}{2}$","$n(@c{I_2}) = 2 × n(@c{S_2O_3^{2-}})$","$n(@c{I_2}) = n(@c{S_2O_3^{2-}})$","$2 × n(@c{I_2}) = @f{n(@c{S_2O_3^{2-}})}{2}$"], bonne:0,
   expl:["Exact : il faut **deux** thiosulfates pour consommer un diiode, donc le diiode est deux fois moins nombreux.",
         "Le sens est inversé. Le coefficient 2 est devant le thiosulfate : c'est lui qui est le plus consommé, donc le plus nombreux.",
         "Cette relation ne vaut que si les deux coefficients sont égaux. Ici l'un vaut 1 et l'autre 2.",
         "Écris d'abord $@f{n_A}{a} = @f{n_B}{b}$, c'est-à-dire $@f{n(@c{I_2})}{1} = @f{n(@c{S_2O_3^{2-}})}{2}$ : chaque coefficient va sous l'espèce qui le porte, une seule fois."]}
 ]},


 {titre:"Atelier — un titrage de bout en bout", blocs:[
  {t:"p", x:"Un titrage se raisonne toujours dans le même ordre : la quantité versée à l'équivalence, la quantité titrée qui s'en déduit, puis la concentration cherchée. Trois lignes, et un piège à chaque."},
  {t:"atelier", titre:"Doser un acide par la soude",
   enonce:"On titre $V_A = 20{,}0$ @u{mL} d'une solution d'acide par une solution de soude de concentration $C_B = 0{,}100$ @u{mol/L}. L'équivalence est atteinte pour $V_B = 12{,}5$ @u{mL} versés. La réaction se fait mole à mole.",
   etapes:[
    {q:"Quelle quantité de soude a-t-on versée à l'équivalence, en @u{mol} ?",
     rep:1.25e-3, tol:2e-5, unite:"mol",
     aide:"Quantité de matière = concentration × volume, avec le volume en litres.",
     diag:[{v:1.25, m:"Tu as gardé le volume en millilitres. $12{,}5$ @u{mL} valent $12{,}5 × 10^{-3}$ @u{L} : le résultat est mille fois plus petit."},
           {v:125, m:"Tu as divisé la concentration par le volume, ou oublié deux conversions. Reprends : $0{,}100 × 0{,}0125$."},
           {v:8e-3, m:"La division est inversée. La quantité de matière est un **produit** : $n = C × V$."}],
     expl:"$n_B = C_B × V_B = 0{,}100 × 12{,}5 × 10^{-3} = 1{,}25 × 10^{-3}$ @u{mol}. **La conversion, toujours la même.** Une concentration s'exprime en moles **par litre** : le volume doit donc être en litres. Un millilitre étant un millième de litre, $12{,}5$ @u{mL} $= 0{,}0125$ @u{L}. Garder les millilitres donne un résultat mille fois trop grand — et $1{,}25$ mole de soude dans un bécher de laboratoire serait absurde."},

    {q:"Quelle quantité d'acide contenait donc la prise d'essai, en @u{mol} ?",
     rep:1.25e-3, tol:2e-5, unite:"mol",
     aide:"À l'équivalence, les deux réactifs ont été apportés dans les proportions de l'équation — ici mole à mole.",
     diag:[{v:2.5e-3, m:"Tu as doublé. La réaction se fait mole à mole : une mole de soude neutralise exactement une mole d'acide."},
           {v:6.25e-4, m:"Tu as divisé par deux. Les coefficients valent tous les deux $1$ : les quantités sont égales."},
           {v:0.1, m:"$0{,}100$ est la concentration de la soude, pas une quantité de matière."}],
     expl:"Mole à mole, donc $n_A = n_B = 1{,}25 × 10^{-3}$ @u{mol}. **Ce que veut dire « équivalence ».** C'est l'instant précis où les deux réactifs se sont exactement épuisés l'un l'autre : ni acide ni soude en excès. Une goutte avant, il reste de l'acide ; une goutte après, la soude s'accumule — et c'est ce qui fait virer l'indicateur coloré. **Attention** : l'égalité $n_A = n_B$ n'est vraie que parce que les coefficients valent $1$. Avec $2$ d'un côté, il faudrait diviser ou multiplier par deux."},

    {q:"Quelle est alors la concentration de l'acide, en @u{mol/L} ?",
     rep:0.0625, tol:0.0008, unite:"mol/L",
     aide:"La concentration est la quantité de matière divisée par le volume de la prise d'essai — celui de l'acide, pas celui de la soude.",
     diag:[{v:0.1, m:"$0{,}100$ @u{mol/L} est la concentration de la **soude**, celle qu'on connaissait déjà."},
           {v:16, m:"La division est inversée : $@f{V_A}{n_A}$ au lieu de $@f{n_A}{V_A}$."},
           {v:0.16, m:"Tu as divisé par $12{,}5$ @u{mL} au lieu de $20{,}0$. Le volume à utiliser est celui de la solution **titrée**."}],
     expl:"$C_A = @f{n_A}{V_A} = @f{1{,}25 × 10^{-3}}{20{,}0 × 10^{-3}} = 0{,}0625$ @u{mol/L}. **Le piège du volume.** Deux volumes traînent dans l'énoncé, et il faut le bon : $V_B$ a servi à compter la soude versée, $V_A$ sert à ramener l'acide à un litre. Les intervertir donne un résultat plausible mais faux, ce qui est le pire des cas. **Le contrôle** : il a fallu moins de soude ($12{,}5$ @u{mL}) que d'acide ($20{,}0$ @u{mL}) pour l'équivalence, donc l'acide est **moins** concentré que la soude — et $0{,}0625 < 0{,}100$ le confirme."},

    {q:"L'acide a une masse molaire de $60$ @u{g/mol}. Quelle est sa concentration en masse, en @u{g/L} ?",
     rep:3.75, tol:0.05, unite:"g/L",
     aide:"Une concentration en masse est une concentration en quantité de matière, convertie en grammes.",
     diag:[{v:0.00104, m:"La division est inversée : on **multiplie** par la masse molaire pour passer des moles aux grammes."},
           {v:0.075, m:"Tu as utilisé $1{,}25 × 10^{-3}$ @u{mol} au lieu de la concentration. La concentration en masse se calcule par litre."},
           {v:60, m:"$60$ @u{g/mol} est la masse molaire seule. Il reste à la multiplier par la concentration."}],
     expl:"$C_m = C_A × M = 0{,}0625 × 60 = 3{,}75$ @u{g/L}. **Pourquoi les deux unités coexistent.** Le chimiste raisonne en moles, parce que ce sont les moles qui réagissent entre elles. Mais une étiquette de bouteille, elle, annonce des grammes par litre — c'est ce qui se pèse. La masse molaire est le pont entre les deux mondes, et un titrage se termine presque toujours par cette conversion."},

    {q:"Que se passe-t-il si l'on continue à verser de la soude après l'équivalence ?",
     choix:["La soude s'accumule sans réagir, le mélange devient basique","L'acide continue d'être neutralisé, plus lentement","La réaction s'inverse et l'acide se reforme","Rien ne change, le mélange reste neutre"],
     bonne:0,
     diag:["","Il n'y a plus d'acide à neutraliser : il a été entièrement consommé à l'équivalence, par définition.",
           "Cette réaction ne s'inverse pas. Ce qui a réagi a réagi.",
           "Le mélange ne reste pas neutre : la soude en excès le rend franchement basique, ce que l'indicateur signale par un changement de couleur."],
     expl:"Tout l'acide ayant été consommé, la soude versée ensuite n'a plus de partenaire : elle s'accumule et le mélange devient basique. **C'est exactement ce qui rend le titrage lisible.** Avant l'équivalence, chaque goutte est aussitôt neutralisée et rien ne change à l'œil. Juste après, la première goutte en excès fait basculer le pH d'un coup, et l'indicateur change de couleur. Le virage n'est pas un phénomène progressif que l'on guette : c'est une bascule, et c'est pourquoi on verse goutte à goutte à l'approche de l'équivalence."}
   ],
   bilan:"Les trois lignes d'un titrage, dans l'ordre : $n_{versé} = C × V$ (volume en litres), puis $n_{titré}$ **par les coefficients de l'équation**, puis $C = @f{n}{V}$ avec le volume de la prise d'essai. Deux pièges et deux seulement : les millilitres, et le choix du volume à la dernière ligne."}
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
  corr:["**Je range les données.** Solution titrée : $V_A = 20{,}0$ @u{mL}, concentration $C_A$ cherchée. Solution titrante : $C_B = 0{,}10$ @u{mol/L}, $V_B = 15{,}0$ @u{mL} versés à l'équivalence.",
        "**Les coefficients.** L'énoncé précise que la réaction se fait mole à mole : les deux nombres stœchiométriques valent 1.",
        "**J'écris l'équivalence.** À l'équivalence, les deux réactifs se sont exactement consommés : $n_A = n_B$, ce qui s'écrit $C_A × V_A = C_B × V_B$.",
        "**J'isole l'inconnue.** $C_A = @f{C_B × V_B}{V_A}$. Le volume **versé** monte au numérateur, le volume **prélevé** reste au dénominateur.",
        "**Je remplace et je calcule.** $C_A = @f{0{,}10 × 15{,}0}{20{,}0} = @f{1{,}5}{20{,}0} = 0{,}075$ @u{mol/L}. Les deux volumes étant en @u{mL}, ils se simplifient : pas de conversion.",
        "**Je vérifie le sens.** Il a fallu **moins** de titrant ($15$ @u{mL}) que je n'avais de solution ($20$ @u{mL}) : la solution titrée est donc moins concentrée que la titrante. $0{,}075 < 0{,}10$. Cohérent."],
  indice:"$C_A = @f{C_B × V_B}{V_A}$ : le volume versé est au numérateur."},

 {id:"ti2", niveau:1, type:"qcm", enonce:"Dans un titrage, quelle solution se trouve dans la burette ?",
  choix:["La solution titrante, de concentration connue","La solution titrée, de concentration inconnue","L'indicateur coloré","De l'eau distillée"], bonne:0,
  diag:["",
        "C'est l'inverse. La solution dont on cherche la concentration est prélevée à la pipette et placée dans le bécher ; c'est elle qu'on titre, elle ne se verse pas.",
        "L'indicateur coloré s'ajoute en petite quantité dans le bécher, quelques gouttes seulement. Il ne participe pas à la réaction de titrage.",
        "L'eau distillée sert à rincer la verrerie et éventuellement à compléter le bécher, jamais à titrer : elle ne contient aucun réactif."],
  corr:["**Ce que demande la question.** Laquelle des deux solutions se trouve dans la burette.",
        "**À quoi sert une burette.** C'est un tube gradué muni d'un robinet : elle sert à **verser** un volume précis, goutte à goutte.",
        "**Qu'est-ce qu'on verse, dans un titrage ?** On verse progressivement la solution qui sert de référence, jusqu'à ce que la réaction soit complète.",
        "**Cette solution de référence, c'est la titrante.** Sa concentration doit être parfaitement connue, puisque tout le calcul repose dessus.",
        "**Et la solution titrée ?** Elle est prélevée à la pipette jaugée et placée dans le bécher, où elle attend. On ne la verse pas : c'est elle qu'on analyse.",
        "**Le repère à garder.** Burette = connue = versée. Bécher = inconnue = analysée."],
  indice:"On verse celle dont on connaît la concentration, sur celle qu'on veut déterminer."},

 {id:"ti3", niveau:2, type:"num", enonce:"On titre $V_A = 10{,}0$ @u{mL} d'une solution de diiode par du thiosulfate à $C_B = 0{,}20$ @u{mol/L} selon $@c{I_2} + 2 @c{S_2O_3^{2-}} → 2 @c{I^-} + @c{S_4O_6^{2-}}$. L'équivalence est à $V_B = 12{,}0$ @u{mL}. Quelle est la concentration en diiode, en @u{mol/L} ?",
  rep:0.12, tol:0.001, unite:"mol/L",
  diag:[{v:0.24, m:"Tu as oublié le coefficient 2 devant le thiosulfate. Il en faut **deux** moles pour consommer une mole de diiode : la quantité de diiode est donc la moitié de celle du thiosulfate versé, pas son égale."},
        {v:0.06, m:"Tu as divisé par 2 du mauvais côté. Écris d'abord $@f{n(@c{I_2})}{1} = @f{n(@c{S_2O_3^{2-}})}{2}$ : le 2 se place sous le thiosulfate, celui qui porte le coefficient 2."},
        {v:0.167, m:"Tu as inversé les volumes dans la division. Le volume versé ($12{,}0$ @u{mL}) va au numérateur, celui prélevé ($10{,}0$ @u{mL}) au dénominateur."}],
  corr:["**Je range les données.** Titré : $V_A = 10{,}0$ @u{mL} de diiode, $C_A$ cherchée. Titrant : $C_B = 0{,}20$ @u{mol/L} de thiosulfate, $V_B = 12{,}0$ @u{mL}.",
        "**Je relève les coefficients.** Dans $@c{I_2} + 2 @c{S_2O_3^{2-}} → …$, le diiode a un coefficient 1 et le thiosulfate un coefficient 2.",
        "**Ce que cela signifie concrètement.** Il faut **deux** ions thiosulfate pour consommer un seul diiode. Le diiode est donc deux fois moins nombreux que le thiosulfate versé.",
        "**J'écris l'équivalence sous sa forme générale.** $@f{n(@c{I_2})}{1} = @f{n(@c{S_2O_3^{2-}})}{2}$, c'est-à-dire $C_A V_A = @f{C_B V_B}{2}$. Chaque coefficient se place sous l'espèce qui le porte.",
        "**J'isole et je remplace.** $C_A = @f{C_B V_B}{2 V_A} = @f{0{,}20 × 12{,}0}{2 × 10{,}0} = @f{2{,}4}{20{,}0}$.",
        "**Je calcule et je vérifie.** $C_A = 0{,}12$ @u{mol/L}. Sans le coefficient 2, j'aurais trouvé $0{,}24$ : le double. C'est exactement l'erreur que la forme générale évite."],
  indice:"Écris $@f{n_A}{a} = @f{n_B}{b}$ avant de remplacer : le 2 se place sous l'espèce qui porte le coefficient 2."},

 {id:"ti4", niveau:2, type:"qcm", enonce:"Pendant un titrage, on ajoute par erreur $50$ @u{mL} d'eau distillée dans le bécher. Quelle conséquence sur le volume équivalent ?",
  choix:["Aucune : le volume équivalent est inchangé","Il est doublé","Il est divisé par deux","Le titrage est à recommencer entièrement"], bonne:0,
  diag:["",
        "L'eau ne contient aucun réactif : elle n'ajoute rien à consommer. Le volume de titrant nécessaire reste donc le même.",
        "Diluer ne fait pas disparaître de matière. La quantité d'espèce titrée dans le bécher est exactement la même qu'avant l'ajout d'eau.",
        "C'est justement le point remarquable de cette méthode : seule la **quantité de matière** compte, et elle n'a pas bougé. La manipulation reste valable."],
  corr:["**Ce que dit l'énoncé.** On ajoute par mégarde $50$ @u{mL} d'eau distillée dans le bécher, avant le titrage.",
        "**Ce que l'eau change.** Elle augmente le volume, donc elle **dilue** : la concentration de l'espèce titrée diminue dans le bécher.",
        "**Ce que l'eau ne change pas.** Elle n'apporte aucune espèce réactive et n'en retire aucune. La **quantité de matière** d'espèce titrée est exactement la même qu'avant.",
        "**Ce qui intervient dans l'équivalence.** La relation d'équivalence porte sur des quantités de matière, pas sur la concentration dans le bécher.",
        "**J'en déduis la conséquence.** Il faut donc exactement le même nombre de moles de titrant pour tout consommer, donc le même volume versé.",
        "**Je conclus.** Le volume équivalent est inchangé, et le résultat du titrage reste juste. C'est ce qui rend cette méthode si robuste."],
  indice:"Regarde ce qui intervient vraiment dans la relation d'équivalence : des concentrations, ou des quantités de matière ?"},

 {id:"ti5", niveau:2, type:"num", enonce:"Un titrage mole à mole donne $V_{éq} = 14{,}0$ @u{mL} pour $V_A = 20{,}0$ @u{mL} de solution titrée et $C_B = 0{,}050$ @u{mol/L}. Quelle quantité de matière, en @u{mmol}, l'espèce titrée représentait-elle dans le bécher ?",
  rep:0.7, tol:0.005, unite:"mmol",
  diag:[{v:0.035, m:"Tu as calculé la concentration ($0{,}035$ @u{mol/L}), pas la quantité de matière. La question demande $n$, en millimoles."},
        {v:1, m:"Tu as utilisé $V_A$ avec $C_B$. La quantité titrée est égale à celle du titrant versé à l'équivalence : $n = C_B × V_{éq}$."},
        {v:0.7e-3, m:"Ton résultat est en moles, pas en millimoles. $7{,}0 × 10^{-4}$ @u{mol} $= 0{,}70$ @u{mmol}."}],
  corr:["**Ce que dit l'énoncé.** $V_{éq} = 14{,}0$ @u{mL} de titrant à $C_B = 0{,}050$ @u{mol/L} ont été versés. On cherche la quantité de matière titrée, en millimoles.",
        "**Ce qui se passe à l'équivalence.** Les deux réactifs se sont exactement consommés. Avec des coefficients égaux à 1, la quantité titrée est égale à la quantité versée.",
        "**La quantité versée.** Elle se calcule comme n'importe quelle quantité en solution : $n = C_B × V_{éq}$.",
        "**Attention aux unités.** En litres : $14{,}0$ @u{mL} $= 14{,}0 × 10^{-3}$ @u{L}. Donc $n = 0{,}050 × 14{,}0 × 10^{-3} = 7{,}0 × 10^{-4}$ @u{mol}.",
        "**Je convertis en millimoles.** $7{,}0 × 10^{-4}$ @u{mol} $= 0{,}70$ @u{mmol}.",
        "**Le raccourci à retenir.** Une concentration en @u{mol/L} multipliée par un volume en @u{mL} donne directement des @u{mmol} : $0{,}050 × 14{,}0 = 0{,}70$ @u{mmol}, sans aucune conversion."],
  indice:"Une concentration en @u{mol/L} multipliée par un volume en @u{mL} donne un résultat en @u{mmol}."},

 {id:"ti6", niveau:3, type:"num", enonce:"On dose le fer d'un comprimé par du permanganate selon $5 @c{Fe^{2+}} + @c{MnO_4^-} + 8 @c{H^+} → 5 @c{Fe^{3+}} + @c{Mn^{2+}} + 4 @c{H_2O}$. Il faut $V_B = 12{,}0$ @u{mL} de permanganate à $C_B = 0{,}020$ @u{mol/L} pour titrer $V_A = 20{,}0$ @u{mL} de solution. Quelle est la concentration en ions fer (II), en @u{mol/L} ?",
  rep:0.06, tol:0.0005, unite:"mol/L",
  diag:[{v:0.012, m:"Tu as oublié le coefficient 5. Une mole de permanganate consomme **cinq** moles d'ions fer : la concentration en fer est donc cinq fois plus grande que ce que donne la relation simple."},
        {v:0.0024, m:"Tu as divisé par 5 au lieu de multiplier. Le 5 est du côté du fer : c'est le fer qui est le plus consommé, donc le plus concentré."},
        {v:0.1, m:"Tu as inversé les volumes. Le volume versé ($12{,}0$) va au numérateur, le volume prélevé ($20{,}0$) au dénominateur."}],
  corr:["**Je range les données.** Titré : $V_A = 20{,}0$ @u{mL} d'ions fer (II), $C_A$ cherchée. Titrant : $C_B = 0{,}020$ @u{mol/L} de permanganate, $V_B = 12{,}0$ @u{mL}.",
        "**Je relève les coefficients.** Dans $5 @c{Fe^{2+}} + @c{MnO_4^-} + … → …$, le fer porte un 5 et le permanganate un 1.",
        "**Ce que cela signifie.** Un seul ion permanganate consomme **cinq** ions fer. Le fer est donc cinq fois plus nombreux que le permanganate versé.",
        "**J'écris l'équivalence.** $@f{n(@c{Fe^{2+}})}{5} = @f{n(@c{MnO_4^-})}{1}$, donc $n(@c{Fe^{2+}}) = 5 × C_B × V_B$.",
        "**Je passe à la concentration et je remplace.** $C_A = @f{5 × C_B × V_B}{V_A} = @f{5 × 0{,}020 × 12{,}0}{20{,}0} = @f{1{,}20}{20{,}0}$.",
        "**Je calcule et je vérifie.** $C_A = 0{,}060$ @u{mol/L}. Le fer est bien plus concentré que le permanganate ($0{,}060$ contre $0{,}020$) : normal, puisqu'il en faut cinq fois plus."],
  indice:"Le coefficient 5 est du côté du fer : il en faut cinq fois plus. Écris $@f{n_A}{5} = @f{n_B}{1}$."},

 {id:"ti7", niveau:3, type:"txt", enonce:"Faut-il rincer la burette à l'eau distillée avant de la remplir de solution titrante ? (réponds par oui ou non)",
  reps:["non","non il ne faut pas","surtout pas"],
  diag:[{r:"oui", m:"Non : l'eau restée dans la burette diluerait la solution titrante, dont la concentration ne serait alors plus celle annoncée. On rince la burette **avec la solution titrante elle-même**. En revanche, on rince bien le bécher à l'eau distillée : là, l'eau ne change aucune quantité de matière."}],
  corr:["**Ce que demande la question.** S'il faut rincer la burette à l'eau distillée avant d'y verser la solution titrante.",
        "**Ce que contient la burette.** La solution titrante, dont la concentration doit être connue **exactement** : c'est la donnée sur laquelle tout le calcul repose.",
        "**Ce que ferait l'eau restée dedans.** Quelques gouttes d'eau se mélangeraient à la solution titrante et la dilueraient légèrement.",
        "**La conséquence.** Sa concentration réelle serait alors inférieure à celle annoncée. Le calcul, lui, utiliserait la valeur annoncée : le résultat serait faussé.",
        "**Ce qu'il faut faire à la place.** Rincer la burette **avec la solution titrante elle-même**, et jeter ce premier rinçage. Ainsi, ce qui reste sur les parois est déjà la bonne solution.",
        "**Et le bécher ?** Là, l'eau distillée ne pose aucun problème : elle ne change pas la quantité de matière de l'espèce titrée. On peut même rincer au-dessus du bécher."],
  indice:"Demande-toi ce que quelques gouttes d'eau feraient à la concentration de la solution titrante."},

 {id:"ti8", niveau:3, type:"num", enonce:"Un vinaigre est dilué 10 fois. On titre $10{,}0$ @u{mL} du vinaigre dilué par de la soude à $0{,}10$ @u{mol/L} ; l'équivalence est à $13{,}0$ @u{mL}. Quelle est la concentration en acide du vinaigre **non dilué**, en @u{mol/L} ?",
  rep:1.3, tol:0.01, unite:"mol/L",
  diag:[{v:0.13, m:"$0{,}13$ @u{mol/L} est la concentration du vinaigre **dilué**. Le vinaigre d'origine est dix fois plus concentré : il reste à multiplier par 10."},
        {v:0.013, m:"Tu as divisé par 10 au lieu de multiplier. La dilution a rendu la solution moins concentrée, donc l'originale est plus concentrée que celle qu'on a titrée."},
        {v:13, m:"Tu as multiplié deux fois par 10, ou oublié une division par $V_A$. Reprends : $@f{0{,}10 × 13{,}0}{10{,}0} = 0{,}13$, puis $× 10$."}],
  corr:["**Ce que dit l'énoncé.** Le vinaigre est d'abord dilué $10$ fois, puis on titre $10{,}0$ @u{mL} de ce vinaigre dilué. L'équivalence est à $13{,}0$ @u{mL} de soude à $0{,}10$ @u{mol/L}.",
        "**Pourquoi diluer d'abord.** Un vinaigre pur est trop concentré : il faudrait verser un volume énorme de soude, bien au-delà de la burette. On le dilue pour ramener le titrage à une taille raisonnable.",
        "**Étape 1 — le titrage porte sur la solution diluée.** $C_{dil} = @f{C_B × V_B}{V_A} = @f{0{,}10 × 13{,}0}{10{,}0}$.",
        "**Je calcule.** $C_{dil} = @f{1{,}30}{10{,}0} = 0{,}13$ @u{mol/L}. Attention : c'est la concentration du vinaigre **dilué**, pas celle du vinaigre.",
        "**Étape 2 — je remonte au vinaigre d'origine.** La dilution a divisé la concentration par $10$, donc je multiplie par $10$ : $C = 0{,}13 × 10 = 1{,}3$ @u{mol/L}.",
        "**Je vérifie l'ordre de grandeur.** Un vinaigre du commerce titre autour de $1$ @u{mol/L} d'acide éthanoïque. $1{,}3$ @u{mol/L} est tout à fait plausible."],
  indice:"Titre d'abord la solution diluée, puis remonte à l'originale en multipliant par le facteur de dilution."}
]
}

]);
