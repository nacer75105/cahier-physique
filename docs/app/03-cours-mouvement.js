/* =====================================================================
   Programme — Spécialité physique-chimie, classe de Première générale
   Partie « Mouvement et interactions »
   ===================================================================== */
window.COURS = (window.COURS || []).concat([

/* ========= 7. LE VECTEUR VITESSE ET SA VARIATION ========= */
{
id:"vitesse", n:7, titre:"Le vecteur vitesse et sa variation",
sous:"Décrire un mouvement avec des flèches",
desc:"Référentiel, vecteur vitesse, construction sur une chronophotographie et variation du vecteur vitesse.",
duree:35,
sections:[
 {titre:"Aucun mouvement n'existe tout seul", blocs:[
  {t:"idee", x:"Un mouvement n'a de sens que **par rapport à quelque chose**. Ce quelque chose s'appelle le **référentiel**. Changer de référentiel change la description du mouvement — parfois du tout au tout."},
  {t:"p", x:"Assise dans un train, tu es immobile par rapport au wagon, et tu files à $300$ @u{km/h} par rapport aux rails. Les deux affirmations sont vraies en même temps : elles ne parlent simplement pas du même référentiel. C'est pour cela qu'un énoncé de physique commence toujours par préciser lequel il utilise."},
  {t:"tbl", head:["Référentiel","Ce à quoi il est lié","Quand l'utiliser"], rows:[
   ["Terrestre","Le sol","Presque tous les mouvements de la vie courante"],
   ["Géocentrique","Le centre de la Terre","Mouvement des satellites, de la Lune"],
   ["Héliocentrique","Le centre du Soleil","Mouvement des planètes"]
  ]},
  {t:"piege", titre:"« Immobile » n'est jamais une réponse complète", x:"Écrire « le sac est immobile » ne veut rien dire. Il faut écrire « le sac est immobile **dans le référentiel du train** ». Un correcteur attend cette précision, et elle vaut souvent un point."}
 ]},

 {titre:"Le vecteur vitesse : trois informations d'un coup", blocs:[
  {t:"idee", x:"La vitesse ne se résume pas à un nombre. Une voiture à $50$ @u{km/h} qui tourne et une voiture à $50$ @u{km/h} qui va tout droit n'ont pas le même mouvement. Il faut donc un **vecteur**, qui porte trois informations à la fois."},
  {t:"formule", titre:"Ce que contient le vecteur vitesse $@v{v}$",
   x:"**direction** : la tangente à la trajectoire<br>**sens** : celui du déplacement<br>**valeur** : $v = @f{d}{Δt}$, en @u{m/s}",
   note:"On note la valeur $v$ (sans flèche) et le vecteur $@v{v}$ (avec flèche). Les confondre coûte des points."},
  {t:"p", x:"La direction tangente mérite qu'on s'y arrête. Fais tourner une pierre au bout d'une ficelle, puis lâche : la pierre ne part ni vers le centre, ni en spirale. Elle part **droit devant**, dans la direction tangente au cercle à l'instant du lâcher. C'est la preuve la plus simple que le vecteur vitesse est tangent à la trajectoire."},
  {t:"formule", titre:"Conversion à connaître par cœur", x:"$1$ @u{m/s} $= 3{,}6$ @u{km/h}", note:"Pour passer des @u{km/h} aux @u{m/s}, on **divise** par 3,6. Dans l'autre sens, on multiplie."},
  {t:"exemple", titre:"Exemple guidé — passer d'une unité à l'autre", enonce:"Une voiture roule à $90$ @u{km/h}. Quelle est sa vitesse en @u{m/s} ? Un sprinteur court $100$ @u{m} en $10$ @u{s} : quelle est sa vitesse en @u{km/h} ?", etapes:[
   {q:"La voiture", r:"On passe des @u{km/h} aux @u{m/s} : on divise par $3{,}6$. $v = @f{90}{3{,}6} = 25$ @u{m/s}."},
   {q:"Le sprinteur, en @u{m/s}", r:"$v = @f{d}{Δt} = @f{100}{10} = 10$ @u{m/s}."},
   {q:"Le sprinteur, en @u{km/h}", r:"On multiplie par $3{,}6$ : $v = 10 × 3{,}6 = 36$ @u{km/h}."},
   {q:"Le contrôle de bon sens", r:"Un nombre en @u{km/h} est toujours **plus grand** que le même en @u{m/s}. Si ta conversion donne l'inverse, tu as multiplié au lieu de diviser."}
  ]}
 ]},

 {titre:"Construire le vecteur vitesse sur une chronophotographie", blocs:[
  {t:"p", x:"Une **chronophotographie** est une série de positions enregistrées à intervalles de temps égaux, notés $τ$ (tau). Les points sont d'autant plus espacés que le mobile va vite : la figure contient donc déjà toute l'information sur la vitesse, il ne reste qu'à la lire."},
  {t:"formule", titre:"Vitesse au point $M_i$",
   x:"$v_i ≈ @f{M_{i-1}M_{i+1}}{2τ}$",
   note:"On utilise les positions **encadrantes** : celle d'avant et celle d'après. C'est plus précis qu'un seul intervalle."},
  {t:"p", x:"Pourquoi encadrer plutôt que prendre le segment suivant ? Parce qu'on veut la vitesse **au point $M_i$**, pas entre $M_i$ et $M_{i+1}$. En prenant les deux voisins, le point d'intérêt se retrouve au milieu de l'intervalle de mesure : l'estimation est centrée, donc bien meilleure. Et comme on parcourt deux intervalles de temps, on divise par $2τ$ et non par $τ$."},
  {t:"fig", titre:"Lire une vitesse sur des positions successives",
   vue:[0,0,10,4], w:440, h:200, grille:false, axes:false,
   objets:[
    {t:"point", x:1, y:1.6, nom:"M₀", couleur:"ink3"},
    {t:"point", x:2.6, y:1.9, nom:"M₁", couleur:"ink3"},
    {t:"point", x:4.4, y:2.2, nom:"M₂", couleur:"ink"},
    {t:"point", x:6.4, y:2.5, nom:"M₃", couleur:"ink3"},
    {t:"point", x:8.6, y:2.8, nom:"M₄", couleur:"ink3"},
    {t:"seg", de:[2.6,1.9], a:[6.4,2.5], couleur:"line2", pointille:true},
    {t:"vec", de:[4.4,2.2], a:[6.3,2.5], couleur:"vert", nom:"v₂"},
    {t:"texte", x:4.5, y:0.9, txt:"on trace M₁M₃, on le reporte en M₂", couleur:"ink2", taille:12}
   ],
   note:"Les points s'écartent de plus en plus : le mobile accélère. Le vecteur vitesse en M₂ a la direction de M₁M₃."},
  {t:"exemple", titre:"Exemple guidé — calculer une vitesse ponctuelle", enonce:"Sur une chronophotographie prise toutes les $τ = 40$ @u{ms}, la distance $M_1M_3$ mesure $12$ @u{cm} en vraie grandeur. Quelle est la vitesse au point $M_2$ ?", etapes:[
   {q:"Convertir en unités du système", r:"$12$ @u{cm} $= 0{,}12$ @u{m} et $40$ @u{ms} $= 0{,}040$ @u{s}."},
   {q:"Écrire la formule", r:"$v_2 = @f{M_1M_3}{2τ}$."},
   {q:"Remplacer", r:"$v_2 = @f{0{,}12}{2 × 0{,}040} = @f{0{,}12}{0{,}080}$."},
   {q:"Calculer", r:"$v_2 = 1{,}5$ @u{m/s}, soit environ $5{,}4$ @u{km/h}."},
   {q:"L'erreur à ne pas faire", r:"Diviser par $τ$ au lieu de $2τ$ donnerait $3{,}0$ @u{m/s} : le double. La distance $M_1M_3$ a bien été parcourue en **deux** intervalles de temps."}
  ]},
  {t:"piege", titre:"L'échelle de la photo", x:"Sur une chronophotographie, les longueurs mesurées à la règle sont celles de l'image, pas de la réalité. L'énoncé donne toujours une **échelle** : $1$ @u{cm} sur la photo pour $10$ @u{cm} en réalité, par exemple. Oublier de l'appliquer fausse toutes les vitesses d'un même facteur."}
 ]},

 {titre:"La variation du vecteur vitesse", blocs:[
  {t:"idee", x:"Ce qui intéresse vraiment le physicien, ce n'est pas la vitesse elle-même, mais **comment elle change**. Cette variation se note $Δ@v{v}$ et se construit en soustrayant deux vecteurs vitesse successifs."},
  {t:"formule", titre:"Variation du vecteur vitesse",
   x:"$Δ@v{v} = @v{v_{i+1}} - @v{v_i}$",
   note:"C'est une **soustraction de vecteurs**, pas de nombres. On la construit géométriquement."},
  {t:"p", x:"La construction se fait en trois gestes, toujours les mêmes."},
  {t:"liste", items:[
   "**1.** Reporter les deux vecteurs $@v{v_i}$ et $@v{v_{i+1}}$ à partir d'un **même point d'origine**.",
   "**2.** Tracer la flèche qui va de la pointe de $@v{v_i}$ à la pointe de $@v{v_{i+1}}$.",
   "**3.** Cette flèche est $Δ@v{v}$ : elle va bien de l'ancien vers le nouveau."
  ]},
  {t:"fig", titre:"La construction de la variation de vitesse",
   vue:[0,0,8,5], w:400, h:250, grille:false, axes:false,
   objets:[
    {t:"vec", de:[1.5,1], a:[5,1.8], couleur:"vert", nom:"vᵢ"},
    {t:"vec", de:[1.5,1], a:[4,3.8], couleur:"bleu", nom:"vᵢ₊₁"},
    {t:"vec", de:[5,1.8], a:[4,3.8], couleur:"rouge", nom:"Δv"},
    {t:"point", x:1.5, y:1, couleur:"ink"},
    {t:"texte", x:6.4, y:4.6, txt:"de la pointe de vᵢ", couleur:"ink3", taille:11.5},
    {t:"texte", x:6.4, y:4.1, txt:"vers celle de vᵢ₊₁", couleur:"ink3", taille:11.5}
   ],
   note:"Les deux vecteurs partent du même point. La flèche rouge les relie, dans le sens de la chronologie."},
  {t:"piege", titre:"Le sens de la flèche", x:"$Δ@v{v} = @v{v_{i+1}} - @v{v_i}$ va de la pointe de **l'ancien** vers la pointe du **nouveau**. Tracer la flèche dans l'autre sens donne un vecteur exactement opposé — et une conclusion inverse sur la force qui agit."},
  {t:"p", x:"Cette variation peut être non nulle même quand la **valeur** de la vitesse ne change pas. Sur un manège qui tourne à allure constante, la vitesse vaut toujours, disons, $3$ @u{m/s} — mais sa direction change en permanence. Le vecteur vitesse change donc, et $Δ@v{v}$ n'est pas nul : il pointe vers le centre du manège."}
 ]},

 {titre:"Ce que la variation raconte du mouvement", blocs:[
  {t:"tbl", head:["Mouvement","Le vecteur vitesse…","$Δ@v{v}$"], rows:[
   ["Rectiligne uniforme","garde direction, sens et valeur","**nul**"],
   ["Rectiligne accéléré","garde la direction, sa valeur augmente","dans le sens du mouvement"],
   ["Rectiligne ralenti","garde la direction, sa valeur diminue","dans le sens **opposé**"],
   ["Circulaire uniforme","garde sa valeur, change de direction","dirigé vers le **centre**"],
   ["Chute libre","change de valeur et de direction","dirigé vers le **bas**"]
  ]},
  {t:"idee", x:"Voici pourquoi tout cela compte : la direction de $Δ@v{v}$ est **exactement celle de la somme des forces**. En regardant seulement une trajectoire, on peut donc dire dans quel sens l'objet est tiré. C'est le pont vers le chapitre suivant."},
  {t:"figi", nom:"chute"},
  {t:"p", x:"Sur cette figure, déplace les curseurs et observe : quelle que soit la vitesse de départ et l'angle choisi, le vecteur rouge — la variation de vitesse — pointe **toujours vers le bas**. Il ne change jamais de direction. C'est la signature du poids, la seule force en jeu."},
  {t:"check", q:"Une bille roule à vitesse constante sur un cercle horizontal. Que vaut $Δ@v{v}$ entre deux instants voisins ?",
   choix:["Un vecteur non nul, dirigé vers le centre du cercle","Le vecteur nul, puisque la vitesse ne change pas","Un vecteur tangent au cercle","Un vecteur dirigé vers l'extérieur"], bonne:0,
   expl:["Exact : la valeur de la vitesse ne change pas, mais sa direction, si. Le vecteur vitesse change donc, et sa variation pointe vers l'intérieur du cercle.",
         "Attention : c'est la **valeur** qui ne change pas. Le vecteur, lui, change de direction à chaque instant — il reste tangent à un cercle, donc il tourne.",
         "Le vecteur **vitesse** est tangent au cercle. Sa **variation**, elle, est perpendiculaire à la vitesse et rentre vers le centre.",
         "Vers l'extérieur, la bille s'éloignerait du centre et quitterait le cercle. C'est le contraire qui se produit : quelque chose la ramène vers l'intérieur — la ficelle, le rail ou le frottement."]}
 ]},

 {titre:"Récapitulatif", blocs:[
  {t:"liste", items:[
   "**1.** Préciser le référentiel avant toute description.",
   "**2.** Le vecteur vitesse est **tangent** à la trajectoire, orienté dans le sens du mouvement.",
   "**3.** Sur une chronophotographie : $v_i = @f{M_{i-1}M_{i+1}}{2τ}$, sans oublier l'échelle ni le facteur 2.",
   "**4.** $Δ@v{v}$ se construit de la pointe de l'ancien vecteur vers la pointe du nouveau.",
   "**5.** La direction de $Δ@v{v}$ est celle de la somme des forces : c'est ce qui rend cette construction si utile."
  ]},
  {t:"piege", titre:"Les erreurs les plus coûteuses", x:"**1.** Diviser par $τ$ au lieu de $2τ$ : la vitesse trouvée est doublée.<br>**2.** Oublier l'échelle de la chronophotographie.<br>**3.** Croire que $Δ@v{v}$ est nul dès que la valeur de la vitesse est constante — faux dans tout mouvement circulaire."}
 ]}
],
exos:[
 {id:"vi1", niveau:1, type:"num", enonce:"Une voiture roule à $108$ @u{km/h}. Quelle est sa vitesse en @u{m/s} ?",
  rep:30, tol:0.1, unite:"m/s",
  diag:[{v:388.8, m:"Tu as multiplié par $3{,}6$ au lieu de diviser. Un nombre en @u{km/h} est toujours plus grand que le même en @u{m/s} : la conversion doit donc **réduire** le nombre."},
        {v:1.8, m:"Tu as divisé par $60$, comme pour passer des heures aux minutes. Le facteur entre @u{km/h} et @u{m/s} est $3{,}6$ : il combine les $1000$ mètres du kilomètre et les $3600$ secondes de l'heure."},
        {v:10.8, m:"Tu as divisé par $10$. Le bon facteur est $3{,}6$."}],
  corr:["Pour passer des @u{km/h} aux @u{m/s}, on divise par $3{,}6$.",
        "$v = @f{108}{3{,}6}$.",
        "$v = 30$ @u{m/s}.",
        "Contrôle : $30 × 3{,}6 = 108$. On retrouve bien la valeur de départ."],
  indice:"$1$ @u{m/s} vaut $3{,}6$ @u{km/h} : la conversion vers les @u{m/s} donne un nombre plus petit."},

 {id:"vi2", niveau:1, type:"qcm", enonce:"Quelle est la direction du vecteur vitesse d'un point en mouvement ?",
  choix:["La tangente à la trajectoire","La perpendiculaire à la trajectoire","La droite qui joint le point au centre","Toujours l'horizontale"], bonne:0,
  diag:["",
        "La perpendiculaire à la trajectoire est la direction de la **variation** de vitesse dans un mouvement circulaire, pas celle de la vitesse elle-même.",
        "C'est la direction du rayon dans un mouvement circulaire. La vitesse, elle, lui est perpendiculaire.",
        "Un objet qui tombe a une vitesse verticale. La direction dépend du mouvement, pas d'une orientation fixe."],
  corr:["Le vecteur vitesse indique où va le point à l'instant considéré.",
        "Sur une trajectoire courbe, cette direction change en permanence.",
        "À chaque instant, elle est celle de la tangente à la trajectoire.",
        "C'est ce qu'on vérifie en lâchant une pierre qu'on faisait tourner : elle part droit devant, selon la tangente."],
  indice:"Pense à une pierre qu'on lâche au bout d'une ficelle qu'on faisait tourner."},

 {id:"vi3", niveau:2, type:"num", enonce:"Sur une chronophotographie prise toutes les $τ = 50$ @u{ms}, la distance réelle $M_1M_3$ vaut $0{,}20$ @u{m}. Quelle est la vitesse au point $M_2$, en @u{m/s} ?",
  rep:2, tol:0.02, unite:"m/s",
  diag:[{v:4, m:"Tu as divisé par $τ$ au lieu de $2τ$. La distance $M_1M_3$ est parcourue en **deux** intervalles de temps, puisqu'elle enjambe $M_2$."},
        {v:0.5, m:"Tu as inversé la fraction : tu as calculé $@f{2τ}{d}$. La vitesse est une distance divisée par une durée."},
        {v:0.002, m:"Tu as gardé la durée en millisecondes tout en divisant comme si c'étaient des secondes. $50$ @u{ms} $= 0{,}050$ @u{s}."}],
  corr:["La formule est $v_2 = @f{M_1M_3}{2τ}$.",
        "Je convertis : $50$ @u{ms} $= 0{,}050$ @u{s}, donc $2τ = 0{,}10$ @u{s}.",
        "$v_2 = @f{0{,}20}{0{,}10}$.",
        "$v_2 = 2{,}0$ @u{m/s}."],
  indice:"Entre $M_1$ et $M_3$, il s'est écoulé deux intervalles de temps, pas un."},

 {id:"vi4", niveau:2, type:"qcm", enonce:"Un objet a un mouvement rectiligne uniforme. Que vaut la variation de son vecteur vitesse entre deux instants ?",
  choix:["Le vecteur nul","Un vecteur dirigé vers l'avant","Un vecteur dirigé vers le bas","Un vecteur perpendiculaire au mouvement"], bonne:0,
  diag:["",
        "Ce serait le cas d'un mouvement **accéléré**. « Uniforme » signifie justement que la valeur de la vitesse ne change pas.",
        "Un $Δ@v{v}$ vers le bas caractérise une chute libre, où la vitesse change à cause du poids. Ici rien ne change.",
        "Une variation perpendiculaire au mouvement caractérise une trajectoire qui **tourne**. Ici la trajectoire est rectiligne."],
  corr:["« Rectiligne » signifie que la direction du vecteur vitesse ne change pas.",
        "« Uniforme » signifie que sa valeur ne change pas non plus.",
        "Le vecteur vitesse est donc rigoureusement identique d'un instant à l'autre.",
        "Sa variation $Δ@v{v} = @v{v_{i+1}} - @v{v_i}$ est donc le vecteur nul — et la somme des forces l'est aussi."],
  indice:"Décompose le mot : « rectiligne » parle de la direction, « uniforme » de la valeur."},

 {id:"vi5", niveau:2, type:"num", enonce:"Un cycliste parcourt $450$ @u{m} en $30$ @u{s}. Quelle est sa vitesse moyenne en @u{km/h} ?",
  rep:54, tol:0.5, unite:"km/h",
  diag:[{v:15, m:"$15$ @u{m/s} est le bon résultat, mais dans la mauvaise unité. La question demande des @u{km/h} : il reste à multiplier par $3{,}6$."},
        {v:4.17, m:"Tu as divisé par $3{,}6$ au lieu de multiplier. On part de @u{m/s} pour aller vers les @u{km/h} : le nombre doit **augmenter**."},
        {v:0.067, m:"Tu as calculé $@f{Δt}{d}$. La vitesse est une distance divisée par une durée."}],
  corr:["Vitesse moyenne : $v = @f{d}{Δt} = @f{450}{30} = 15$ @u{m/s}.",
        "Pour convertir en @u{km/h}, je multiplie par $3{,}6$.",
        "$v = 15 × 3{,}6$.",
        "$v = 54$ @u{km/h}."],
  indice:"Calcule d'abord en @u{m/s}, puis convertis."},

 {id:"vi6", niveau:3, type:"qcm", enonce:"Une bille tourne à vitesse constante sur un cercle. Vers où pointe la variation de son vecteur vitesse ?",
  choix:["Vers le centre du cercle","Dans le sens du mouvement","Vers l'extérieur du cercle","Elle est nulle"], bonne:0,
  diag:["",
        "Dans le sens du mouvement, la bille irait de plus en plus vite. Or sa vitesse garde la même valeur.",
        "Vers l'extérieur, la bille s'éloignerait et quitterait le cercle. C'est l'inverse qui la maintient sur sa trajectoire.",
        "Ce serait vrai si le vecteur vitesse ne changeait pas du tout. Mais sa **direction** change en permanence, même si sa valeur reste la même."],
  corr:["La valeur de la vitesse est constante, mais sa direction tourne sans cesse.",
        "Le vecteur vitesse change donc, et sa variation n'est pas nulle.",
        "En construisant $Δ@v{v}$ entre deux instants voisins, on obtient un vecteur perpendiculaire à la vitesse.",
        "Il est dirigé vers le centre du cercle : c'est de ce côté que quelque chose retient la bille."],
  indice:"Construis les deux vecteurs vitesse à partir d'un même point et regarde vers où pointe la flèche qui les relie."},

 {id:"vi7", niveau:3, type:"num", enonce:"Un mobile passe de $v_1 = 4{,}0$ @u{m/s} à $v_2 = 10{,}0$ @u{m/s} en ligne droite, en $2{,}0$ @u{s}. Quelle est la valeur de la variation de vitesse par seconde, en @u{m/s²} ?",
  rep:3, tol:0.05, unite:"m/s²",
  diag:[{v:6, m:"$6{,}0$ @u{m/s} est la variation **totale** de vitesse. La question demande la variation **par seconde** : il reste à diviser par la durée."},
        {v:7, m:"Tu as calculé la moyenne des deux vitesses. La variation est une différence, pas une moyenne."},
        {v:0.33, m:"Tu as inversé la fraction : $@f{Δt}{Δv}$. La variation par seconde est $@f{Δv}{Δt}$."}],
  corr:["Le mouvement est rectiligne : la variation de vitesse se calcule sur les valeurs.",
        "$Δv = 10{,}0 - 4{,}0 = 6{,}0$ @u{m/s}.",
        "Cette variation s'est produite en $2{,}0$ @u{s}.",
        "Par seconde : $@f{6{,}0}{2{,}0} = 3{,}0$ @u{m/s²}."],
  indice:"D'abord la variation totale, ensuite la division par la durée."},

 {id:"vi8", niveau:3, type:"txt", enonce:"Dans quel référentiel un passager assis dans un train en marche est-il immobile ? (un mot)",
  reps:["le train","train","referentiel du train","celui du train","wagon"],
  diag:[{r:"terrestre", m:"Dans le référentiel terrestre, lié au sol, le passager défile à la vitesse du train : il n'y est pas immobile du tout. Cherche le référentiel qui bouge **avec** lui."},
        {r:"sol", m:"Par rapport au sol, le passager avance à la vitesse du train. Le référentiel où il est immobile est celui qui l'accompagne."}],
  corr:["Un objet est immobile dans un référentiel si sa position n'y change pas au cours du temps.",
        "Par rapport au sol, le passager se déplace : il n'y est pas immobile.",
        "Par rapport au wagon, sa position ne change pas.",
        "Il est donc immobile dans le référentiel du train — et en mouvement dans le référentiel terrestre. Les deux sont vrais en même temps."],
  indice:"Cherche le référentiel qui se déplace en même temps que lui."}
]
},

/* ======= 8. FORCES ET DEUXIÈME LOI DE NEWTON ======= */
{
id:"forces", n:8, titre:"Forces et lois de Newton",
sous:"Ce qui met en mouvement, ce qui freine, ce qui fait tourner",
desc:"Modéliser une action par une force, principe d'inertie, deuxième loi de Newton, gravitation et interaction électrostatique.",
duree:40,
sections:[
 {titre:"Une force modélise une interaction", blocs:[
  {t:"idee", x:"Une **force** n'est jamais une propriété d'un objet : c'est la façon dont un objet **agit sur un autre**. Il faut donc toujours deux acteurs, et une force se nomme en les citant tous les deux."},
  {t:"p", x:"On écrit $@v{F}_{Terre/pomme}$ et jamais « la force de la pomme ». Cette écriture n'est pas un caprice de notation : elle oblige à identifier qui agit sur qui, ce qui évite d'inventer des forces qui n'existent pas."},
  {t:"p", x:"Une force se représente par un vecteur, avec les mêmes trois informations que le vecteur vitesse : une direction, un sens, et une valeur en **newtons** (@u{N})."},
  {t:"tbl", head:["Force","Direction et sens","Valeur"], rows:[
   ["Poids $@v{P}$","Verticale, vers le bas","$P = m × g$"],
   ["Réaction du support $@v{R}$","Perpendiculaire au support","Selon la situation"],
   ["Tension d'un fil $@v{T}$","Selon le fil, vers le point d'attache","Selon la situation"],
   ["Frottement $@v{f}$","Selon le mouvement, en sens **opposé**","Selon la situation"]
  ]},
  {t:"formule", titre:"Le poids", x:"$P = m × g$", note:"$P$ en @u{N} · $m$ en @u{kg} · $g ≈ 9{,}81$ @u{N/kg} sur Terre. On prend souvent $10$ pour un calcul rapide."},
  {t:"piege", titre:"Masse et poids ne sont pas la même chose", x:"La **masse** est une quantité de matière : elle se mesure en @u{kg} et ne change jamais. Le **poids** est une force : il se mesure en @u{N} et dépend de l'astre. Une élève de $50$ @u{kg} pèse $490$ @u{N} sur Terre et $80$ @u{N} sur la Lune — mais sa masse reste $50$ @u{kg} partout."},
  {t:"fig", titre:"Les forces sur un objet posé sur une table",
   vue:[0,0,8,6], w:340, h:250, grille:false, axes:false,
   objets:[
    {t:"sol", de:1, a:7, y:1.4},
    {t:"rect", x:3, y:1.4, w:2, h:1.2, couleur:"bleu", nom:"m"},
    {t:"vec", de:[4,2], a:[4,0.4], couleur:"rouge", nom:"P"},
    {t:"vec", de:[4,2], a:[4,4.4], couleur:"vert", nom:"R"},
    {t:"texte", x:6.4, y:4.2, txt:"R : la table pousse", couleur:"vert", taille:11.5},
    {t:"texte", x:6.3, y:0.7, txt:"P : la Terre attire", couleur:"rouge", taille:11.5}
   ],
   note:"Deux forces exactement opposées : leur somme est nulle, l'objet ne bouge pas."}
 ]},

 {titre:"Le principe d'inertie : rien ne change sans raison", blocs:[
  {t:"formule", titre:"Première loi de Newton",
   x:"Si $Σ@v{F} = @v{0}$, alors le vecteur vitesse **ne change pas**.<br>Et réciproquement.",
   note:"L'objet est soit immobile, soit en mouvement rectiligne uniforme. Les deux cas sont équivalents du point de vue des forces."},
  {t:"p", x:"Ce principe heurte l'intuition, et il a fallu deux mille ans pour l'admettre. Notre expérience quotidienne dit qu'il faut pousser pour qu'un objet continue d'avancer. Mais si l'objet ralentit dès qu'on cesse de pousser, ce n'est pas parce que le mouvement s'épuise : c'est parce que **les frottements agissent**. Sur une patinoire, où ils sont presque nuls, un palet lancé continue tout droit très longtemps."},
  {t:"astuce", titre:"La conséquence pratique", x:"Si tu constates qu'un objet va en ligne droite à vitesse constante, tu peux affirmer immédiatement que **la somme des forces est nulle**. Cela ne veut pas dire qu'il n'y a aucune force : cela veut dire qu'elles se compensent exactement, comme le poids et la réaction sur la table."},
  {t:"check", q:"Un parachutiste descend à vitesse constante. Que peut-on dire des forces qui s'exercent sur lui ?",
   choix:["Elles se compensent exactement","Seul le poids agit","La force de l'air est plus grande que le poids","Il n'y a aucune force"], bonne:0,
   expl:["Exact : vitesse constante et trajectoire rectiligne signifient $Σ@v{F} = @v{0}$. Le frottement de l'air compense exactement le poids.",
         "Si seul le poids agissait, il accélérerait sans cesse — c'est ce qui se passe juste après le saut, avant que le parachute ne s'ouvre.",
         "Si la force de l'air l'emportait, il **ralentirait**. Or sa vitesse ne change pas : les deux forces sont égales.",
         "Le poids agit toujours. Ce qui est nul, c'est leur **somme**, pas chacune d'elles."]}
 ]},

 {titre:"La deuxième loi : les forces changent la vitesse", blocs:[
  {t:"idee", x:"Quand la somme des forces n'est pas nulle, le vecteur vitesse change — et il change **dans la direction et le sens de cette somme**. C'est la deuxième loi de Newton, le principe le plus utile de toute la mécanique."},
  {t:"formule", titre:"Deuxième loi de Newton (version de Première)",
   x:"$Σ@v{F}$ et $Δ@v{v}$ ont **même direction et même sens**",
   note:"Plus précisément : $Σ@v{F} = m × @f{Δ@v{v}}{Δt}$. Une force plus grande, ou une masse plus petite, produit une variation de vitesse plus grande."},
  {t:"p", x:"Lis bien ce que dit cette loi, et surtout ce qu'elle ne dit pas. Elle ne dit **pas** que la force donne la direction du mouvement : elle dit qu'elle donne la direction du **changement** de mouvement. Une balle lancée vers le haut monte encore alors que son poids est déjà dirigé vers le bas — le poids ne la fait pas descendre immédiatement, il ralentit sa montée, puis inverse le mouvement."},
  {t:"tbl", head:["Situation","$Σ@v{F}$","Effet sur le vecteur vitesse"], rows:[
   ["Voiture qui démarre","Vers l'avant","Sa valeur augmente"],
   ["Voiture qui freine","Vers l'arrière","Sa valeur diminue"],
   ["Bille au bout d'une ficelle","Vers le centre","Sa direction tourne, sa valeur ne change pas"],
   ["Balle lancée en l'air","Vers le bas, toujours","Elle ralentit, s'arrête, puis redescend"]
  ]},
  {t:"astuce", titre:"Le raisonnement à double sens", x:"Cette loi se lit dans les deux sens, et c'est ce qui la rend si puissante. **Des forces vers les données** : je connais les forces, j'en déduis comment la vitesse va changer. **De la trajectoire vers les forces** : je vois une trajectoire courbée vers la gauche, j'en déduis qu'une force agit vers la gauche. C'est ainsi qu'on a découvert Neptune, à partir d'une trajectoire d'Uranus qui déviait."}
 ]},

 {titre:"Deux forces à distance : gravitation et électrostatique", blocs:[
  {t:"p", x:"Certaines forces agissent **sans contact**. Deux d'entre elles sont au programme, et leurs formules se ressemblent de façon frappante."},
  {t:"formule", titre:"Force d'interaction gravitationnelle",
   x:"$F = G × @f{m_A × m_B}{d^2}$",
   note:"$G = 6{,}67 × 10^{-11}$ @u{N·m²·kg⁻²} · masses en @u{kg} · $d$ en @u{m} · toujours **attractive**."},
  {t:"formule", titre:"Force d'interaction électrostatique (loi de Coulomb)",
   x:"$F = k × @f{|q_A × q_B|}{d^2}$",
   note:"$k = 9{,}0 × 10^{9}$ @u{N·m²·C⁻²} · charges en @u{C} · attractive si les charges sont de signes contraires, répulsive sinon."},
  {t:"p", x:"Les deux formules ont la même architecture : un produit des « quantités » en haut, le carré de la distance en bas. Cette dépendance en $@f{1}{d^2}$ a une conséquence marquante : **doubler la distance divise la force par quatre**, et non par deux. Tripler la distance la divise par neuf."},
  {t:"fig", titre:"Une force qui décroît en 1/d²",
   vue:[0,0,5.2,1.15], w:400, h:250, libre:true, grille:false, axes:false,
   objets:[
    {t:"axes", x0:0, y0:0, ax:"distance d", ay:"force F"},
    {t:"courbeXY", couleur:"bleu", pts:[[0.5,1.0],[0.7,0.51],[0.9,0.31],[1.1,0.21],[1.4,0.13],[1.8,0.077],[2.3,0.047],[3,0.028],[4,0.016],[5,0.010]]},
    {t:"seg", de:[1,0], a:[1,0.25], couleur:"line2", pointille:true},
    {t:"seg", de:[2,0], a:[2,0.0625], couleur:"line2", pointille:true},
    {t:"texte", x:1.05, y:0.35, txt:"d", couleur:"ink3"},
    {t:"texte", x:2.15, y:0.16, txt:"2d → F ÷ 4", couleur:"rouge", taille:12}
   ],
   note:"La force chute très vite avec la distance : c'est ce qui rend la gravitation négligeable dès qu'on s'éloigne un peu."},
  {t:"exemple", titre:"Exemple guidé — la force entre la Terre et la Lune", enonce:"Calculer la force gravitationnelle entre la Terre ($m_T = 6{,}0 × 10^{24}$ @u{kg}) et la Lune ($m_L = 7{,}3 × 10^{22}$ @u{kg}), distantes de $d = 3{,}8 × 10^{8}$ @u{m}.", etapes:[
   {q:"Écrire la formule", r:"$F = G × @f{m_T × m_L}{d^2}$, avec $G = 6{,}67 × 10^{-11}$."},
   {q:"Calculer le numérateur", r:"$m_T × m_L = 6{,}0 × 10^{24} × 7{,}3 × 10^{22} = 4{,}4 × 10^{47}$."},
   {q:"Calculer le dénominateur", r:"$d^2 = (3{,}8 × 10^{8})^2 = 1{,}4 × 10^{17}$. Attention : le carré porte sur le nombre **et** sur la puissance de dix."},
   {q:"Assembler", r:"$F = 6{,}67 × 10^{-11} × @f{4{,}4 × 10^{47}}{1{,}4 × 10^{17}} ≈ 2{,}1 × 10^{20}$ @u{N}."},
   {q:"Interpréter", r:"C'est cette force, et elle seule, qui maintient la Lune en orbite : elle courbe en permanence son vecteur vitesse vers la Terre."}
  ]},
  {t:"piege", titre:"Le carré au dénominateur", x:"Une erreur très fréquente : oublier de mettre la distance **au carré**, ou n'élever au carré que le nombre sans la puissance de dix. $(3 × 10^{8})^2 = 9 × 10^{16}$, et non $3 × 10^{16}$ ni $9 × 10^{8}$."}
 ]},

 {titre:"Récapitulatif : la méthode d'un exercice de mécanique", blocs:[
  {t:"liste", items:[
   "**1.** Choisir le système étudié (l'objet dont on parle) et le référentiel.",
   "**2.** Faire l'inventaire des forces : qui agit sur ce système ? Contact ou distance ?",
   "**3.** Les représenter par des vecteurs, à partir du centre de l'objet.",
   "**4.** Regarder si elles se compensent. Si oui, le vecteur vitesse ne change pas.",
   "**5.** Si non, la somme donne la direction et le sens de $Δ@v{v}$ — donc l'évolution du mouvement."
  ]},
  {t:"tbl", head:["La question ressemble à…","Ce qu'il faut faire"], rows:[
   ["« Calculer le poids »","$P = m × g$, la masse en @u{kg}"],
   ["« Le mouvement est rectiligne uniforme »","Conclure $Σ@v{F} = @v{0}$"],
   ["« Vers où pointe $Δ@v{v}$ ? »","Vers la somme des forces"],
   ["« Force gravitationnelle »","$G @f{m_A m_B}{d^2}$, distance **au carré**"],
   ["« Si la distance double »","La force est divisée par $4$"]
  ]},
  {t:"piege", titre:"Les erreurs les plus coûteuses", x:"**1.** Confondre masse ($@u{kg}$) et poids ($@u{N}$).<br>**2.** Croire que la force indique la direction du **mouvement** ; elle indique celle de son **changement**.<br>**3.** Oublier le carré de la distance dans les forces à distance."}
 ]}
],
exos:[
 {id:"fo1", niveau:1, type:"num", enonce:"Quelle est la valeur du poids d'un sac de $4{,}0$ @u{kg} sur Terre ? On prend $g = 9{,}81$ @u{N/kg}.",
  rep:39.24, tol:0.3, unite:"N",
  diag:[{v:4, m:"Tu as recopié la masse. La masse s'exprime en @u{kg}, le poids en @u{N} : ce sont deux grandeurs différentes, reliées par $P = m × g$."},
        {v:0.41, m:"Tu as divisé la masse par $g$ au lieu de multiplier. Le poids est plus grand que la masse en valeur numérique, puisque $g ≈ 10$."},
        {v:2.45, m:"Tu as calculé $@f{g}{m}$. La formule est $P = m × g$."}],
  corr:["Le poids se calcule par $P = m × g$.",
        "$P = 4{,}0 × 9{,}81$.",
        "$P ≈ 39{,}2$ @u{N}.",
        "Ordre de grandeur : environ $10$ @u{N} par kilogramme. Quatre kilos font donc à peu près $40$ @u{N}."],
  indice:"$P = m × g$, avec $g ≈ 9{,}81$ @u{N/kg}."},

 {id:"fo2", niveau:1, type:"qcm", enonce:"Un palet glisse en ligne droite à vitesse constante sur une patinoire. Que vaut la somme des forces qui s'exercent sur lui ?",
  choix:["Le vecteur nul","Un vecteur dirigé vers l'avant","Son poids","Un vecteur dirigé vers l'arrière"], bonne:0,
  diag:["",
        "Une force vers l'avant le ferait **accélérer**. Or sa vitesse ne change pas.",
        "Le poids s'exerce bien, mais la glace le compense exactement par sa réaction. C'est la **somme** qui est nulle, pas chaque force.",
        "Une force vers l'arrière le ferait ralentir. C'est ce qui arrive en réalité avec les frottements — mais l'énoncé précise une vitesse constante."],
  corr:["Le mouvement est rectiligne : la direction du vecteur vitesse ne change pas.",
        "Il est uniforme : sa valeur ne change pas non plus.",
        "Le vecteur vitesse est donc constant, et sa variation est nulle.",
        "D'après le principe d'inertie, la somme des forces est alors le vecteur nul : le poids et la réaction de la glace se compensent."],
  indice:"Principe d'inertie : vitesse constante en ligne droite signifie forces compensées."},

 {id:"fo3", niveau:2, type:"qcm", enonce:"Une balle est lancée verticalement vers le haut. Pendant sa montée, quelle est la direction de la somme des forces (on néglige l'air) ?",
  choix:["Vers le bas","Vers le haut, comme le mouvement","Nulle, car elle monte à vitesse constante","Elle change de sens au sommet"], bonne:0,
  diag:["",
        "C'est l'erreur la plus répandue en mécanique. La force n'indique pas le sens du **mouvement**, mais celui de son **changement**. La balle monte tout en ralentissant : la force est donc dirigée vers le bas.",
        "La balle ralentit pendant sa montée : sa vitesse n'est pas constante. La somme des forces n'est donc pas nulle.",
        "Le poids garde exactement la même direction et le même sens pendant tout le trajet, montée comprise. Rien ne change au sommet, sinon le sens du mouvement."],
  corr:["Une fois lancée, la balle n'est plus soumise qu'à son poids.",
        "Le poids est vertical, dirigé vers le bas, pendant toute la durée du vol.",
        "Pendant la montée, cette force est opposée au mouvement : la balle ralentit.",
        "Au sommet, sa vitesse s'annule, puis le poids l'accélère vers le bas. La force, elle, n'a jamais changé."],
  indice:"Sépare bien le sens du mouvement et le sens de son changement."},

 {id:"fo4", niveau:2, type:"num", enonce:"Sur la Lune, $g_L = 1{,}6$ @u{N/kg}. Quel est le poids d'une combinaison de $12$ @u{kg} sur la Lune ?",
  rep:19.2, tol:0.2, unite:"N",
  diag:[{v:117.7, m:"Tu as utilisé le $g$ terrestre ($9{,}81$). L'énoncé donne celui de la Lune : $1{,}6$ @u{N/kg}."},
        {v:12, m:"Tu as recopié la masse. La masse est la même partout ; c'est le poids qui change d'un astre à l'autre."},
        {v:7.5, m:"Tu as divisé la masse par $g_L$ au lieu de multiplier."}],
  corr:["Le poids se calcule toujours par $P = m × g$.",
        "Sur la Lune, $g_L = 1{,}6$ @u{N/kg}.",
        "$P = 12 × 1{,}6$.",
        "$P = 19{,}2$ @u{N} — environ six fois moins que sur Terre, alors que la masse n'a pas changé."],
  indice:"Même formule, mais avec le $g$ de l'astre concerné."},

 {id:"fo5", niveau:2, type:"qcm", enonce:"Si la distance entre deux corps est multipliée par 3, par combien la force gravitationnelle est-elle divisée ?",
  choix:["9","3","6","27"], bonne:0,
  diag:["",
        "La distance intervient **au carré** au dénominateur. Une distance triplée donne donc $3^2 = 9$ au dénominateur, pas 3.",
        "6 correspondrait à $3 × 2$, un raisonnement qui mélange le facteur et l'exposant. Le carré de 3 vaut 9.",
        "27 serait le cube de 3. La loi de gravitation fait intervenir le carré de la distance, pas son cube."],
  corr:["La force s'écrit $F = G @f{m_A m_B}{d^2}$.",
        "Si $d$ est multipliée par 3, alors $d^2$ est multipliée par $3^2 = 9$.",
        "Le dénominateur devient 9 fois plus grand.",
        "La force est donc divisée par 9."],
  indice:"La distance est au carré : un facteur 3 sur $d$ devient un facteur $3^2$ sur $d^2$."},

 {id:"fo6", niveau:3, type:"num", enonce:"Deux charges de $q_A = 2{,}0 × 10^{-6}$ @u{C} et $q_B = 3{,}0 × 10^{-6}$ @u{C} sont distantes de $d = 0{,}30$ @u{m}. Quelle est la valeur de la force électrostatique, en @u{N} ? On prend $k = 9{,}0 × 10^{9}$ @u{N·m²·C⁻²}.",
  rep:0.6, tol:0.01, unite:"N",
  diag:[{v:1.8, m:"Tu as oublié d'élever la distance au carré : tu as divisé par $0{,}30$ au lieu de $0{,}090$."},
        {v:0.054, m:"Tu as multiplié par $d^2$ au lieu de diviser. La distance est au **dénominateur** : plus les charges sont éloignées, plus la force est faible."},
        {v:6, m:"Une erreur d'un facteur 10 s'est glissée dans les puissances de dix. Reprends : $2{,}0×10^{-6} × 3{,}0×10^{-6} = 6{,}0×10^{-12}$."}],
  corr:["Loi de Coulomb : $F = k @f{|q_A q_B|}{d^2}$.",
        "Numérateur : $q_A × q_B = 2{,}0×10^{-6} × 3{,}0×10^{-6} = 6{,}0×10^{-12}$.",
        "Dénominateur : $d^2 = 0{,}30^2 = 0{,}090$ @u{m²}.",
        "$F = 9{,}0×10^{9} × @f{6{,}0×10^{-12}}{0{,}090} = 0{,}60$ @u{N}."],
  indice:"N'oublie pas d'élever la distance au carré avant de diviser."},

 {id:"fo7", niveau:3, type:"txt", enonce:"Une bille tourne à vitesse constante au bout d'une ficelle. Vers où pointe la somme des forces ? (deux mots)",
  reps:["vers le centre","le centre","centre du cercle","vers le centre du cercle"],
  diag:[{r:"vers l avant", m:"Vers l'avant, la bille irait de plus en plus vite. Or sa vitesse garde la même valeur : ce qui change, c'est sa direction."},
        {r:"vers l exterieur", m:"Si la somme des forces pointait vers l'extérieur, la bille s'éloignerait et quitterait le cercle. C'est la ficelle qui la retient — donc qui tire vers l'intérieur."},
        {r:"nulle", m:"Si elle était nulle, la bille irait en ligne droite d'après le principe d'inertie. Or sa trajectoire est un cercle : quelque chose la fait tourner en permanence."}],
  corr:["La valeur de la vitesse ne change pas, mais sa direction tourne sans cesse.",
        "Le vecteur vitesse varie donc, et $Δ@v{v}$ n'est pas nul.",
        "En construisant $Δ@v{v}$, on trouve un vecteur dirigé vers le centre du cercle.",
        "D'après la deuxième loi de Newton, la somme des forces a la même direction et le même sens : elle pointe vers le centre. C'est la tension de la ficelle."],
  indice:"Construis $Δ@v{v}$ : la somme des forces pointe dans la même direction."},

 {id:"fo8", niveau:3, type:"num", enonce:"Un chariot de masse $m = 2{,}0$ @u{kg} voit sa vitesse passer de $1{,}0$ à $5{,}0$ @u{m/s} en $2{,}0$ @u{s}, en ligne droite. Quelle est la valeur de la somme des forces, en @u{N} ?",
  rep:4, tol:0.05, unite:"N",
  diag:[{v:2, m:"Tu as calculé la variation de vitesse par seconde ($2{,}0$ @u{m/s²}) mais oublié de multiplier par la masse. La loi est $ΣF = m × @f{Δv}{Δt}$."},
        {v:8, m:"Tu as multiplié par la variation totale de vitesse sans diviser par la durée : $2{,}0 × 4{,}0 = 8$. La durée de $2{,}0$ @u{s} doit intervenir."},
        {v:10, m:"Tu as utilisé la vitesse finale au lieu de la variation. C'est le **changement** de vitesse qui compte, pas sa valeur."}],
  corr:["Variation de vitesse : $Δv = 5{,}0 - 1{,}0 = 4{,}0$ @u{m/s}.",
        "Variation par seconde : $@f{Δv}{Δt} = @f{4{,}0}{2{,}0} = 2{,}0$ @u{m/s²}.",
        "Deuxième loi de Newton : $ΣF = m × @f{Δv}{Δt}$.",
        "$ΣF = 2{,}0 × 2{,}0 = 4{,}0$ @u{N}."],
  indice:"Trois temps : la variation de vitesse, sa valeur par seconde, puis la multiplication par la masse."}
]
}

]);
