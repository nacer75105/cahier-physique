/* =====================================================================
   Programme — Spécialité physique-chimie, classe de Première générale
   « Des édifices ordonnés : les cristaux »
   ===================================================================== */
window.COURS = (window.COURS || []).concat([

{
id:"cristaux", n:6, titre:"Les cristaux",
sous:"Quand la matière s'empile avec méthode",
desc:"Maille, population, compacité, masse volumique, et les grandes familles de cristaux.",
duree:35,
sections:[
 {titre:"Un cristal, c'est un motif qui se répète", blocs:[
  {t:"idee", x:"Dans un **cristal**, les entités — atomes, ions ou molécules — ne sont pas rangées au hasard : elles occupent des positions régulières, et le même motif se répète à l'identique dans les trois directions de l'espace."},
  {t:"p", x:"Regarde un grain de sel de près, ou un flocon de neige, ou un cristal de quartz. Leurs faces planes et leurs angles constants ne sont pas un accident : ce sont la trace, visible à l'œil nu, d'un ordre qui règne à l'échelle des atomes. Un solide amorphe, comme le verre, n'a pas cet ordre — et il n'a pas non plus de faces nettes : il se casse en éclats quelconques."},
  {t:"mots", items:[
   ["Cristal","Un solide où les entités occupent des positions régulières et périodiques. Il se reconnaît à ses faces planes et à ses angles constants."],
   ["Solide amorphe","Un solide sans cet ordre : le verre, le plastique. Il se casse en éclats irréguliers et n'a pas de température de fusion nette."],
   ["Maille","Le plus petit volume qui, recopié dans toutes les directions, reconstitue le cristal entier. C'est le motif de base du papier peint."],
   ["Paramètre de maille $a$","La longueur de l'arête de la maille cubique. Elle se mesure en picomètres ou en nanomètres : $10^{-10}$ @u{m} environ."],
   ["Population","Le nombre d'entités qui appartiennent **en propre** à une maille. Un atome partagé entre plusieurs mailles ne compte que pour sa part."],
   ["Compacité","La part du volume de la maille réellement occupée par la matière. Le reste est du vide."],
   ["Masse volumique $ρ$","La masse par unité de volume, en @u{g/cm³} ou @u{kg/m³}. C'est ce qui se mesure au laboratoire, et qui permet de vérifier un modèle."]
  ]},
  {t:"p", x:"L'image la plus juste est celle du **papier peint**. Un motif, répété à l'infini dans deux directions, suffit à couvrir tout un mur. Le cristal fait la même chose en trois dimensions, et son motif de base s'appelle la **maille**. Décrire un cristal, c'est décrire une seule maille : tout le reste n'en est que la répétition."},
  {t:"piege", titre:"Tout solide n'est pas un cristal", x:"Le verre est un solide, mais **pas** un cristal : ses entités sont figées dans le désordre, comme un liquide qu'on aurait arrêté. C'est pour cela qu'il n'a pas de température de fusion nette — il ramollit progressivement au lieu de fondre d'un coup."}
 ]},

 {titre:"Compter les atomes d'une maille : la population", blocs:[
  {t:"idee", x:"Un atome placé au **sommet** d'un cube est partagé entre les huit mailles qui se rejoignent en ce point : il ne compte donc que pour $@f{1}{8}$. Un atome au **centre d'une face** est partagé entre deux mailles : il compte pour $@f{1}{2}$."},
  {t:"p", x:"C'est le seul point délicat du chapitre, et il devient évident avec une image. Imagine quatre carreaux de carrelage qui se rejoignent en un point. Si tu poses une bille exactement sur ce point, à quel carreau appartient-elle ? À aucun en entier : à chacun pour un quart. Dans l'espace, ce sont huit cubes qui se rejoignent en un sommet — d'où le huitième."},
  {t:"fig", titre:"Deux mailles cubiques à comparer",
   vue:[0,0,13,7], w:460, h:290, grille:false, axes:false,
   objets:[
    {t:"seg", de:[0.8,1], a:[4,1], couleur:"line2"},
    {t:"seg", de:[0.8,4.2], a:[4,4.2], couleur:"line2"},
    {t:"seg", de:[0.8,1], a:[0.8,4.2], couleur:"line2"},
    {t:"seg", de:[4,1], a:[4,4.2], couleur:"line2"},
    {t:"seg", de:[2,2.2], a:[5.2,2.2], couleur:"line2", pointille:true},
    {t:"seg", de:[2,5.4], a:[5.2,5.4], couleur:"line2"},
    {t:"seg", de:[2,2.2], a:[2,5.4], couleur:"line2", pointille:true},
    {t:"seg", de:[5.2,2.2], a:[5.2,5.4], couleur:"line2"},
    {t:"seg", de:[0.8,1], a:[2,2.2], couleur:"line2", pointille:true},
    {t:"seg", de:[4,1], a:[5.2,2.2], couleur:"line2"},
    {t:"seg", de:[0.8,4.2], a:[2,5.4], couleur:"line2"},
    {t:"seg", de:[4,4.2], a:[5.2,5.4], couleur:"line2"},
    {t:"cercle", c:[0.8,1], r:0.30, couleur:"bleu", remplir:true, opacite:.6},
    {t:"cercle", c:[4,1], r:0.30, couleur:"bleu", remplir:true, opacite:.6},
    {t:"cercle", c:[0.8,4.2], r:0.30, couleur:"bleu", remplir:true, opacite:.6},
    {t:"cercle", c:[4,4.2], r:0.30, couleur:"bleu", remplir:true, opacite:.6},
    {t:"cercle", c:[2,2.2], r:0.30, couleur:"bleu", remplir:true, opacite:.6},
    {t:"cercle", c:[5.2,2.2], r:0.30, couleur:"bleu", remplir:true, opacite:.6},
    {t:"cercle", c:[2,5.4], r:0.30, couleur:"bleu", remplir:true, opacite:.6},
    {t:"cercle", c:[5.2,5.4], r:0.30, couleur:"bleu", remplir:true, opacite:.6},
    {t:"texte", x:3, y:0.2, txt:"cubique simple — population 1", couleur:"ink2", taille:12},

    {t:"seg", de:[7.6,1], a:[10.8,1], couleur:"line2"},
    {t:"seg", de:[7.6,4.2], a:[10.8,4.2], couleur:"line2"},
    {t:"seg", de:[7.6,1], a:[7.6,4.2], couleur:"line2"},
    {t:"seg", de:[10.8,1], a:[10.8,4.2], couleur:"line2"},
    {t:"seg", de:[8.8,2.2], a:[12,2.2], couleur:"line2", pointille:true},
    {t:"seg", de:[8.8,5.4], a:[12,5.4], couleur:"line2"},
    {t:"seg", de:[8.8,2.2], a:[8.8,5.4], couleur:"line2", pointille:true},
    {t:"seg", de:[12,2.2], a:[12,5.4], couleur:"line2"},
    {t:"seg", de:[7.6,1], a:[8.8,2.2], couleur:"line2", pointille:true},
    {t:"seg", de:[10.8,1], a:[12,2.2], couleur:"line2"},
    {t:"seg", de:[7.6,4.2], a:[8.8,5.4], couleur:"line2"},
    {t:"seg", de:[10.8,4.2], a:[12,5.4], couleur:"line2"},
    {t:"cercle", c:[7.6,1], r:0.30, couleur:"bleu", remplir:true, opacite:.6},
    {t:"cercle", c:[10.8,1], r:0.30, couleur:"bleu", remplir:true, opacite:.6},
    {t:"cercle", c:[7.6,4.2], r:0.30, couleur:"bleu", remplir:true, opacite:.6},
    {t:"cercle", c:[10.8,4.2], r:0.30, couleur:"bleu", remplir:true, opacite:.6},
    {t:"cercle", c:[8.8,2.2], r:0.30, couleur:"bleu", remplir:true, opacite:.6},
    {t:"cercle", c:[12,2.2], r:0.30, couleur:"bleu", remplir:true, opacite:.6},
    {t:"cercle", c:[8.8,5.4], r:0.30, couleur:"bleu", remplir:true, opacite:.6},
    {t:"cercle", c:[12,5.4], r:0.30, couleur:"bleu", remplir:true, opacite:.6},
    {t:"cercle", c:[9.2,2.6], r:0.30, couleur:"rouge", remplir:true, opacite:.6},
    {t:"cercle", c:[10.4,3.8], r:0.30, couleur:"rouge", remplir:true, opacite:.6},
    {t:"cercle", c:[9.2,4.4], r:0.30, couleur:"rouge", remplir:true, opacite:.6},
    {t:"texte", x:9.8, y:0.2, txt:"faces centrées — population 4", couleur:"ink2", taille:12}
   ],
   note:"En bleu les sommets, partagés par huit mailles. En rouge les centres de faces, partagés par deux."},
  {t:"formule", titre:"Population d'une maille cubique",
   x:"$N = @f{n_{sommets}}{8} + @f{n_{faces}}{2} + n_{intérieur}$",
   note:"Un sommet compte pour $@f{1}{8}$, un centre de face pour $@f{1}{2}$, un atome entièrement à l'intérieur pour $1$."},
  {t:"tbl", head:["Type de maille","Sommets","Centres de faces","Population $N$"], rows:[
   ["Cubique simple","$8 × @f{1}{8} = 1$","aucun","$1$"],
   ["Cubique à faces centrées","$8 × @f{1}{8} = 1$","$6 × @f{1}{2} = 3$","$4$"]
  ]},
  {t:"methode", titre:"Compter la population d'une maille", etapes:[
   "**Repérer les sommets** : un cube en a toujours $8$. Chacun compte pour $@f{1}{8}$, ce qui fait $1$ atome en tout.",
   "**Repérer les centres de faces** : un cube en a $6$. Chacun compte pour $@f{1}{2}$, ce qui fait $3$ atomes.",
   "**Repérer les atomes entièrement à l'intérieur**, s'il y en a : ils comptent pour $1$ chacun.",
   "**Additionner.** Le résultat est toujours un nombre entier — c'est le meilleur contrôle qui soit."
  ], exemple:"Maille cubique à faces centrées : $8 × @f{1}{8} + 6 × @f{1}{2} = 1 + 3 = 4$ atomes par maille."},
  {t:"check", q:"Combien d'atomes appartiennent en propre à une maille cubique à faces centrées ?",
   choix:["4","14","8","6"], bonne:0,
   expl:["Exact : $8 × @f{1}{8} = 1$ pour les sommets, plus $6 × @f{1}{2} = 3$ pour les faces, soit $4$.",
         "$14$ est le nombre d'atomes **dessinés** sur la figure ($8$ sommets $+ 6$ faces). Mais la plupart sont partagés avec les mailles voisines : ils ne comptent pas en entier.",
         "$8$ est le nombre de sommets. Chacun n'appartient qu'au huitième à cette maille-ci.",
         "$6$ est le nombre de faces. Chaque centre de face n'appartient qu'à moitié à cette maille."]}
 ]},

 {titre:"La compacité : combien de vide dans un cristal ?", blocs:[
  {t:"idee", x:"La **compacité** est la fraction du volume de la maille réellement occupée par la matière. Elle vaut toujours moins que $1$ : des sphères, si bien rangées soient-elles, laissent toujours du vide entre elles."},
  {t:"formule", titre:"Compacité",
   x:"$C = @f{N × @f{4}{3} π r^3}{a^3}$",
   note:"$N$ la population · $r$ le rayon de l'entité · $a$ le paramètre de maille. Le résultat n'a pas d'unité."},
  {t:"p", x:"La formule se lit comme un partage : au numérateur le volume vraiment occupé — $N$ sphères de rayon $r$ — et au dénominateur le volume total du cube. Toute la difficulté consiste à relier $r$ et $a$, et cette relation dépend de la maille."},
  {t:"tbl", head:["Maille","Où les sphères se touchent","Relation","Compacité"], rows:[
   ["Cubique simple","le long de l'arête","$a = 2r$","$@f{π}{6} ≈ 0{,}52$"],
   ["Faces centrées","le long de la diagonale d'une face","$a@r{2} = 4r$","$@f{π@r{2}}{6} ≈ 0{,}74$"]
  ]},
  {t:"p", x:"Ces deux nombres méritent d'être retenus. Une maille cubique simple laisse près de la **moitié** de son volume vide ; une maille à faces centrées descend à un quart de vide. C'est le meilleur empilement possible pour des sphères identiques — celui que font spontanément les oranges d'un étal."},
  {t:"exemple", titre:"Exemple guidé — la compacité d'une maille cubique simple", enonce:"Démontrer que la compacité d'une maille cubique simple vaut environ $0{,}52$.", etapes:[
   {q:"La population", r:"$8$ sommets à $@f{1}{8}$ chacun : $N = 1$. Une seule sphère par maille."},
   {q:"Où les sphères se touchent-elles ?", r:"Dans cette maille, les atomes voisins sont ceux des sommets d'une même arête. Ils se touchent donc **le long de l'arête**."},
   {q:"J'en tire la relation entre $a$ et $r$", r:"L'arête contient deux demi-sphères, soit un diamètre entier : $a = 2r$."},
   {q:"Je remplace dans la formule", r:"$C = @f{1 × @f{4}{3} π r^3}{(2r)^3} = @f{@f{4}{3} π r^3}{8 r^3}$."},
   {q:"Je simplifie", r:"Les $r^3$ disparaissent : $C = @f{4π}{3 × 8} = @f{π}{6}$."},
   {q:"Je calcule et j'interprète", r:"$@f{π}{6} ≈ 0{,}52$. Autrement dit, $52$ % de matière et $48$ % de vide : un empilement médiocre, que peu de métaux adoptent."}
  ]},
  {t:"astuce", titre:"Le rayon disparaît toujours", x:"Dans un calcul de compacité, le rayon $r$ se simplifie systématiquement — il apparaît au cube en haut comme en bas. Si ton résultat contient encore un $r$, c'est qu'une erreur s'est glissée dans la relation entre $a$ et $r$."}
 ]},

 {titre:"De la maille à la masse volumique", blocs:[
  {t:"idee", x:"Une maille est un tout petit cube dont on connaît le contenu exact. Sa masse volumique est donc calculable — et comme le cristal n'est que la répétition de cette maille, c'est **la masse volumique du matériau entier**."},
  {t:"formule", titre:"Masse volumique d'un cristal",
   x:"$ρ = @f{N × M}{N_A × a^3}$",
   note:"$N$ la population · $M$ la masse molaire en @u{g/mol} · $N_A = 6{,}02 × 10^{23}$ @u{mol⁻¹} · $a$ en @u{cm} pour obtenir des @u{g/cm³}."},
  {t:"p", x:"Le raisonnement tient en une phrase : la masse d'une maille, c'est $N$ atomes, et un atome pèse $@f{M}{N_A}$. Le volume d'une maille, c'est $a^3$. La masse volumique est le quotient des deux, et rien de plus."},
  {t:"methode", titre:"Calculer une masse volumique à partir de la maille", etapes:[
   "**Trouver la population $N$** de la maille : $1$ pour une cubique simple, $4$ pour une cubique à faces centrées.",
   "**Convertir le paramètre de maille en centimètres** si l'on veut des @u{g/cm³} : $1$ @u{nm} $= 10^{-7}$ @u{cm}, et $1$ @u{pm} $= 10^{-10}$ @u{cm}.",
   "**Élever $a$ au cube.** C'est là que se perdent les puissances de dix : $(4 × 10^{-8})^3 = 64 × 10^{-24}$, et non $4 × 10^{-24}$.",
   "**Calculer la masse d'une maille** : $@f{N × M}{N_A}$, en grammes.",
   "**Diviser par le volume**, et comparer à la valeur réelle du matériau — c'est le contrôle qui valide tout le modèle."
  ], exemple:"Aluminium, maille cubique à faces centrées, $a = 405$ @u{pm} $= 4{,}05 × 10^{-8}$ @u{cm}, $M = 27{,}0$ @u{g/mol}. Masse d'une maille : $@f{4 × 27{,}0}{6{,}02 × 10^{23}} = 1{,}79 × 10^{-22}$ @u{g}. Volume : $(4{,}05 × 10^{-8})^3 = 6{,}64 × 10^{-23}$ @u{cm³}. Donc $ρ = 2{,}70$ @u{g/cm³} — exactement la valeur mesurée sur un lingot d'aluminium."},
  {t:"piege", titre:"Le cube des puissances de dix", x:"Élever $4{,}05 × 10^{-8}$ au cube demande deux opérations : $4{,}05^3 = 66{,}4$ **et** $(10^{-8})^3 = 10^{-24}$. On obtient $66{,}4 × 10^{-24} = 6{,}64 × 10^{-23}$. Oublier l'une des deux donne un résultat faux d'un facteur énorme."}
 ]},

 {titre:"Les grandes familles de cristaux", blocs:[
  {t:"p", x:"Ce qui occupe les nœuds du réseau, et ce qui les tient ensemble, change tout : la dureté, la température de fusion, la conduction du courant. Quatre familles suffisent à classer presque tout ce qu'on rencontre."},
  {t:"tbl", head:["Famille","Aux nœuds","Ce qui tient","Propriétés","Exemple"], rows:[
   ["**Ionique**","des ions","attraction entre charges opposées","dur, cassant, fond très haut, conduit une fois dissous","$@c{NaCl}$"],
   ["**Métallique**","des atomes de métal","des électrons libres, partagés par tous","conducteur, malléable, brillant","fer, aluminium"],
   ["**Covalent**","des atomes liés un à un","des liaisons covalentes dans tout le solide","extrêmement dur, fond très haut, isolant","diamant, quartz"],
   ["**Moléculaire**","des molécules entières","interactions faibles entre molécules","tendre, fond bas","glace, sucre"]
  ]},
  {t:"p", x:"Deux comparaisons éclairent tout le tableau. **Le diamant et la glace** sont tous deux des cristaux, mais le diamant fond vers $3500$ @u{°C} et raye tout, tandis que la glace fond à $0$ @u{°C} : dans l'un il faut casser des liaisons covalentes, dans l'autre seulement décoller des molécules. **Le sel et le cuivre** sont tous deux durs, mais le sel est cassant et le cuivre se plie : dans un métal, les couches d'atomes glissent les unes sur les autres sans que les électrons libres lâchent prise."},
  {t:"piege", titre:"Pourquoi le sel est cassant", x:"Dans un cristal ionique, un choc décale les couches d'un cran : des ions de **même charge** se retrouvent alors face à face, se repoussent violemment, et le cristal se fend net. C'est pour cela que le sel se clive en petits cubes parfaits au lieu de se déformer."},
  {t:"check", q:"Un solide est très dur, fond au-dessus de $3000$ @u{°C} et ne conduit pas le courant. De quelle famille est-il ?",
   choix:["Covalent","Métallique","Ionique","Moléculaire"], bonne:0,
   expl:["Exact : il faut casser des liaisons covalentes dans tout le solide, d'où la dureté et la température de fusion extrêmes. Et aucun électron n'est libre : il est isolant. C'est le diamant.",
         "Un métal conduit le courant — c'est même sa signature. Ici le solide est isolant.",
         "Un cristal ionique fond haut, mais il est **cassant** plutôt que très dur, et il conduit le courant une fois fondu ou dissous.",
         "Un cristal moléculaire fond bas : la glace à $0$ @u{°C}, le sucre vers $185$ @u{°C}. $3000$ @u{°C} est hors de portée."]},
  {t:"astuce", titre:"Les cristaux hors du laboratoire", x:"Les roches sont faites de cristaux, et leur taille raconte leur histoire : un refroidissement lent laisse de gros cristaux visibles (le granite), un refroidissement brutal n'en laisse que de minuscules (le basalte). Le vivant en fabrique aussi — le calcaire des coquilles, l'émail des dents, les cristaux d'oxalate des plantes."}
 ]},


 {titre:"Atelier — retrouver la masse volumique du cuivre", blocs:[
  {t:"p", x:"Voici l'un des plus beaux calculs du programme : à partir de la seule taille d'une maille, invisible et mesurée aux rayons X, on retrouve une grandeur qu'on peut vérifier à la balance. Si le modèle du cristal est juste, les deux nombres doivent coïncider."},
  {t:"atelier", titre:"Du picomètre au kilogramme par mètre cube",
   enonce:"Le cuivre cristallise dans une maille **cubique à faces centrées** d'arête $a = 361$ @u{pm}. Sa masse molaire vaut $M = 63{,}5$ @u{g/mol}, et $N_A = 6{,}02 × 10^{23}$ @u{mol^{-1}}. On rappelle que $1$ @u{pm} $= 10^{-12}$ @u{m}.",
   etapes:[
    {q:"Combien d'atomes une maille cubique à faces centrées contient-elle **en propre** ?",
     rep:4, tol:0.1, unite:"atomes",
     aide:"Un atome de sommet est partagé entre huit mailles, un atome de face entre deux. Il y a 8 sommets et 6 faces.",
     diag:[{v:14, m:"Tu as compté les atomes dessinés : $8$ sommets et $6$ faces. Mais aucun ne appartient entièrement à cette maille — il faut compter les parts."},
           {v:8, m:"$8$ est le nombre de sommets. Chacun n'appartient que pour un huitième à cette maille."},
           {v:1, m:"$1$ est la part apportée par les huit sommets. Il reste les six faces."},
           {v:6, m:"$6$ est le nombre de faces. Chaque atome de face compte pour une moitié."}],
     expl:"$8 × @f{1}{8} + 6 × @f{1}{2} = 1 + 3 = 4$ atomes. **Pourquoi ce partage.** Un cristal est un empilement de mailles jointives : un atome placé sur un sommet est au coin de huit cubes à la fois, il ne « compte » donc que pour un huitième dans chacun. Un atome au centre d'une face est partagé entre deux cubes seulement. Compter les atomes dessinés — quatorze — reviendrait à les compter plusieurs fois."},

    {q:"Quel est le volume de la maille, en @u{m^3} ?",
     rep:4.70e-29, tol:6e-31, unite:"m³",
     aide:"Convertis d'abord l'arête en mètres, puis élève au cube. Écris ta réponse par exemple sous la forme 4,7e-29.",
     diag:[{v:3.61e-10, m:"$3{,}61 × 10^{-10}$ @u{m} est l'**arête** convertie. Il reste à l'élever au cube pour obtenir un volume."},
           {v:4.7e-8, m:"Tu as élevé au cube le nombre sans sa puissance de dix, ou multiplié l'exposant par $3$ au mauvais endroit. $(10^{-10})^3 = 10^{-30}$."},
           {v:1.08e-9, m:"Tu as multiplié l'arête par $3$ au lieu de l'élever au cube. Un volume est un produit de trois longueurs."}],
     expl:"$a = 361 × 10^{-12} = 3{,}61 × 10^{-10}$ @u{m}, puis $V = a^3 = (3{,}61 × 10^{-10})^3 ≈ 4{,}70 × 10^{-29}$ @u{m^3}. **La règle sur les exposants.** Élever au cube élève **tout** au cube : le nombre, $3{,}61^3 ≈ 47{,}0$, et la puissance de dix, $(10^{-10})^3 = 10^{-30}$. On rassemble : $47{,}0 × 10^{-30} = 4{,}70 × 10^{-29}$. **Et pour se représenter** : un cube dont le côté fait moins d'un milliardième de mètre."},

    {q:"Quelle est la masse de cette maille, en kilogrammes ?",
     rep:4.22e-25, tol:6e-27, unite:"kg",
     aide:"La maille contient quatre atomes. La masse d'un atome est la masse molaire divisée par le nombre d'Avogadro — attention, elle sort en grammes.",
     diag:[{v:4.22e-22, m:"C'est le résultat en **grammes**. La question demande des kilogrammes : divise encore par mille."},
           {v:1.05e-25, m:"Tu as oublié de multiplier par les quatre atomes de la maille."},
           {v:2.54e-22, m:"Tu as multiplié $63{,}5$ par $4$ sans diviser par le nombre d'Avogadro."}],
     expl:"Un atome pèse $@f{63{,}5}{6{,}02 × 10^{23}} ≈ 1{,}055 × 10^{-22}$ @u{g}. La maille en contient quatre : $4{,}22 × 10^{-22}$ @u{g}, soit $4{,}22 × 10^{-25}$ @u{kg}. **Le rôle exact du nombre d'Avogadro.** Il est le pont entre le monde des balances et celui des atomes : la masse molaire pèse une mole, il faut donc diviser par le nombre d'entités qu'elle contient pour descendre à l'atome unique. **Et n'oublie pas les grammes** — c'est l'oubli le plus fréquent de ce calcul, et il fausse le résultat final d'un facteur mille."},

    {q:"Quelle masse volumique cela donne-t-il, en @u{kg/m^3} ?",
     rep:8970, tol:120, unite:"kg/m³",
     aide:"La masse volumique est la masse divisée par le volume — et la maille se répète à l'identique dans tout le cristal.",
     diag:[{v:8.97, m:"Erreur d'un facteur mille : tu as sans doute gardé les grammes au lieu des kilogrammes."},
           {v:1.11e-4, m:"La division est inversée : $@f{V}{m}$ au lieu de $@f{m}{V}$."},
           {v:2240, m:"Tu as sans doute oublié les quatre atomes de la maille et divisé la masse d'un seul par le volume."}],
     expl:"$ρ = @f{m}{V} = @f{4{,}22 × 10^{-25}}{4{,}70 × 10^{-29}} ≈ 8{,}97 × 10^{3}$ @u{kg/m^3}. **Pourquoi une seule maille suffit.** Le cristal n'est rien d'autre que cette maille répétée des milliards de milliards de fois, sans vide entre elles. Le rapport masse sur volume est donc le même pour une maille et pour un lingot entier : c'est tout l'intérêt du modèle."},

    {q:"La valeur mesurée à la balance pour le cuivre est $8960$ @u{kg/m^3}. Que peut-on en conclure ?",
     choix:["Le modèle de la maille cubique à faces centrées est validé","C'est une coïncidence, les deux méthodes n'ont aucun rapport","Le calcul est faux, puisqu'on ne retrouve pas exactement 8960","La mesure à la balance est plus fiable, le calcul est donc inutile"],
     bonne:0,
     diag:["","Ce n'est pas une coïncidence : deux méthodes totalement indépendantes — la diffraction des rayons X d'un côté, la balance de l'autre — tombent sur le même nombre à moins de $0{,}2$ % près.",
           "L'écart est de l'ordre du dixième de pour cent, ce qui est le niveau de précision des données de l'énoncé. En sciences, un accord de cette qualité vaut confirmation.",
           "Les deux se complètent : la balance donne la valeur, le calcul explique **pourquoi** elle vaut cela — et permet de la prévoir pour un métal qu'on n'a jamais pesé."],
     expl:"L'accord est excellent : $8970$ contre $8960$, soit un écart de $0{,}1$ %. **Ce que cet accord démontre vraiment.** Nous sommes partis d'une hypothèse sur l'arrangement invisible des atomes, et nous en avons tiré une prédiction sur une grandeur que n'importe qui peut vérifier avec une balance et une éprouvette. Elle se vérifie. **C'est exactement ainsi que fonctionne la physique** : un modèle qu'on ne peut pas voir directement se juge à la qualité des prédictions qu'il permet. Cette méthode, appliquée à des milliers de cristaux, a construit toute la science des matériaux — et c'est aussi ainsi qu'a été déterminée, en retour, la valeur du nombre d'Avogadro."}
   ],
   bilan:"Quatre étapes, et la même à chaque fois : **compter** les atomes en propre (les parts, pas les dessins), **cuber** l'arête convertie en mètres, **peser** la maille en passant par le nombre d'Avogadro, **diviser**. Les deux pièges sont ailleurs que dans la physique : la conversion des grammes en kilogrammes, et les puissances de dix élevées au cube."}
 ]},
 {titre:"Récapitulatif", blocs:[
  {t:"tbl", head:["La question ressemble à…","Ce qu'il faut faire"], rows:[
   ["« Quelle est la population de cette maille ? »","Sommets $× @f{1}{8}$, faces $× @f{1}{2}$, intérieur $× 1$"],
   ["« Calculer la compacité »","$C = @f{N @f{4}{3} π r^3}{a^3}$, après avoir relié $a$ et $r$"],
   ["« Calculer la masse volumique »","$ρ = @f{N M}{N_A a^3}$, avec $a$ en @u{cm}"],
   ["« De quelle famille est ce cristal ? »","Dureté, température de fusion, conduction"],
   ["« Pourquoi ce solide est-il cassant ? »","Cristal ionique : le décalage met face à face des charges de même signe"]
  ]},
  {t:"idee", x:"Tout ce chapitre tient dans une seule idée : **le cristal entier n'est qu'une maille recopiée**. Décrire une maille — ce qu'elle contient, sa taille — suffit donc à prédire la masse volumique du matériau, et à la confronter à la mesure."}
 ]}
],
exos:[
 {id:"cr1", niveau:1, type:"qcm", enonce:"Qu'appelle-t-on la **maille** d'un cristal ?",
  choix:["Le plus petit volume qui, répété, reconstitue tout le cristal",
         "Un atome isolé du cristal",
         "La face visible d'un cristal","La distance entre deux atomes voisins"], bonne:0,
  diag:["",
        "Un atome est une entité placée dans le cristal ; la maille est le petit volume qui les contient et qui se répète.",
        "Les faces planes sont une **conséquence** de l'ordre interne, elles n'en sont pas le motif de base.",
        "Cette distance est liée au paramètre de maille $a$, mais une maille est un volume, pas une longueur."],
  corr:["Un cristal est un empilement régulier : le même motif s'y répète à l'identique dans les trois directions.",
        "Décrire ce motif suffit donc à décrire tout le cristal, aussi gros soit-il.",
        "Ce motif de base, c'est la maille : le plus petit volume qui, recopié dans toutes les directions, reconstitue l'ensemble.",
        "L'image la plus juste est celle du papier peint : un motif, répété, couvre tout le mur.",
        "C'est pour cela qu'un exercice sur les cristaux se ramène toujours à un calcul sur une **seule** maille.",
        "Attention à ne pas confondre la maille (un volume) avec le paramètre de maille $a$ (la longueur de son arête)."],
  indice:"Pense au motif d'un papier peint : que suffit-il de connaître pour reconstituer tout le mur ?"},

 {id:"cr2", niveau:1, type:"num", enonce:"Combien d'atomes appartiennent en propre à une maille **cubique simple** (un atome à chaque sommet, et rien d'autre) ?",
  rep:1, tol:0.01,
  diag:[{v:8, m:"$8$ est le nombre de sommets, donc d'atomes **dessinés**. Mais chacun est partagé entre les huit mailles qui se rejoignent en ce point : il ne compte que pour $@f{1}{8}$."},
        {v:4, m:"$4$ est la population d'une maille à **faces centrées**. Ici il n'y a pas d'atome au centre des faces."},
        {v:0.125, m:"$@f{1}{8}$ est la part d'**un seul** sommet. Il faut encore multiplier par les $8$ sommets du cube."}],
  corr:["Je repère les positions occupées : uniquement les sommets du cube, il y en a $8$.",
        "Je me demande à qui appartient un atome placé sur un sommet.",
        "En ce point, **huit** cubes se rejoignent : l'atome est partagé entre eux tous, il ne compte donc que pour $@f{1}{8}$.",
        "Je totalise : $8 × @f{1}{8}$.",
        "$N = 1$ atome par maille.",
        "Je vérifie : une population est toujours un nombre **entier**. C'est le contrôle le plus simple de tout le chapitre."],
  indice:"Un atome au sommet est partagé entre les huit cubes qui se touchent en ce point."},

 {id:"cr3", niveau:2, type:"num", enonce:"Combien d'atomes appartiennent en propre à une maille **cubique à faces centrées** ?",
  rep:4, tol:0.01,
  diag:[{v:14, m:"$14$ est le nombre d'atomes dessinés : $8$ sommets $+ 6$ centres de faces. Mais aucun ne compte en entier — ils sont tous partagés avec les mailles voisines."},
        {v:1, m:"Tu n'as compté que les sommets, qui donnent $1$ atome. Il faut y ajouter les $6$ centres de faces."},
        {v:3, m:"$3$ est la part apportée par les faces seules ($6 × @f{1}{2}$). Il manque celle des sommets."},
        {v:7, m:"Tu as compté les faces en entier ($6$) et les sommets pour $1$. Un centre de face ne compte que pour $@f{1}{2}$."}],
  corr:["Je repère les positions occupées : les $8$ sommets, plus le centre de chacune des $6$ faces.",
        "Les sommets d'abord : $8 × @f{1}{8} = 1$ atome, comme dans toute maille cubique.",
        "Les centres de faces ensuite. Une face est partagée entre **deux** mailles voisines seulement : l'atome y compte pour $@f{1}{2}$.",
        "Cela donne $6 × @f{1}{2} = 3$ atomes.",
        "Je totalise : $N = 1 + 3 = 4$ atomes par maille.",
        "Je vérifie : le résultat est bien un entier. Les $14$ atomes dessinés ne pèsent en réalité que pour $4$."],
  indice:"Traite séparément les sommets ($@f{1}{8}$ chacun) et les centres de faces ($@f{1}{2}$ chacun), puis additionne."},

 {id:"cr4", niveau:2, type:"num", enonce:"Dans une maille cubique simple, les atomes se touchent le long de l'arête. Quelle est la compacité de cette maille ? (donne le résultat avec deux décimales)",
  rep:0.52, tol:0.01,
  diag:[{v:0.74, m:"$0{,}74$ est la compacité d'une maille à **faces centrées**, le meilleur empilement possible. Une cubique simple, elle, laisse bien plus de vide."},
        {v:1, m:"Une compacité de $1$ signifierait qu'il n'y a aucun vide. Des sphères, si bien rangées soient-elles, en laissent toujours."},
        {v:0.48, m:"$0{,}48$ est la part de **vide**, pas celle de matière. La compacité mesure la fraction occupée."}],
  corr:["La compacité s'écrit $C = @f{N × @f{4}{3} π r^3}{a^3}$ : le volume occupé, divisé par le volume total.",
        "Population d'une maille cubique simple : $N = 1$. Il n'y a qu'une sphère à compter.",
        "Les atomes se touchent le long de l'arête : celle-ci contient donc deux rayons, soit $a = 2r$.",
        "Je remplace : $C = @f{@f{4}{3} π r^3}{(2r)^3} = @f{@f{4}{3} π r^3}{8 r^3}$.",
        "Les $r^3$ se simplifient — ils disparaissent toujours dans ce calcul : $C = @f{4π}{24} = @f{π}{6}$.",
        "$@f{π}{6} ≈ 0{,}52$. Soit $52$ % de matière et $48$ % de vide : cet empilement est médiocre, et peu de métaux l'adoptent."],
  indice:"Écris d'abord la relation entre $a$ et $r$, puis remplace : les $r^3$ se simplifieront."},

 {id:"cr5", niveau:3, type:"num", enonce:"Dans une maille cubique à faces centrées, les atomes se touchent le long de la diagonale d'une face, ce qui donne $a@r{2} = 4r$. Quelle est la compacité ? (deux décimales)",
  rep:0.74, tol:0.01,
  diag:[{v:0.52, m:"$0{,}52$ est la compacité de la maille cubique **simple**. Ici la population vaut $4$, pas $1$, et la relation entre $a$ et $r$ est différente."},
        {v:0.26, m:"Tu as sans doute oublié la population : il y a **quatre** atomes dans cette maille, pas un seul."},
        {v:2.96, m:"Une compacité ne peut pas dépasser $1$ : ce serait plus de matière que de volume disponible. Vérifie l'élévation au cube de $a$."}],
  corr:["Formule : $C = @f{N × @f{4}{3} π r^3}{a^3}$, avec cette fois $N = 4$.",
        "J'exprime $a$ en fonction de $r$ à partir de la relation donnée : $a = @f{4r}{@r{2}} = 2r@r{2}$.",
        "J'élève au cube, sans oublier le facteur : $a^3 = (2@r{2})^3 r^3 = 8 × 2{,}83 × r^3 ≈ 22{,}6 r^3$.",
        "Je calcule le numérateur : $4 × @f{4}{3} π r^3 ≈ 16{,}76 r^3$.",
        "Je divise, et les $r^3$ se simplifient : $C ≈ @f{16{,}76}{22{,}6} ≈ 0{,}74$.",
        "Je conclus : $74$ % de matière, $26$ % de vide. C'est le meilleur empilement possible pour des sphères identiques — celui des oranges sur un étal."],
  indice:"Isole $a$ dans $a@r{2} = 4r$, puis élève au cube en n'oubliant pas le $@r{2}$."},

 {id:"cr6", niveau:3, type:"num", enonce:"L'aluminium cristallise en cubique à faces centrées, avec $a = 4{,}05 × 10^{-8}$ @u{cm} et $M = 27{,}0$ @u{g/mol}. Quelle est sa masse volumique, en @u{g/cm³} ? On donne $N_A = 6{,}02 × 10^{23}$ @u{mol⁻¹}.",
  rep:2.70, tol:0.05, unite:"g/cm³",
  diag:[{v:0.675, m:"Tu as oublié la population : il y a **quatre** atomes par maille, pas un seul. Le résultat est quatre fois trop petit."},
        {v:10.8, m:"Tu as multiplié par $N_A$ au lieu de diviser, ou oublié un facteur. Reprends la masse d'une maille : $@f{4 × 27{,}0}{6{,}02 × 10^{23}}$."},
        {v:2700, m:"$2700$ est la masse volumique en @u{kg/m³} : c'est la même chose, mais dans une autre unité. La question demande des @u{g/cm³}."}],
  corr:["La masse volumique d'un cristal vaut $ρ = @f{N × M}{N_A × a^3}$ : la masse d'une maille, divisée par son volume.",
        "Population d'une maille à faces centrées : $N = 4$.",
        "Masse d'une maille : $@f{4 × 27{,}0}{6{,}02 × 10^{23}} = @f{108}{6{,}02 × 10^{23}} ≈ 1{,}79 × 10^{-22}$ @u{g}.",
        "Volume d'une maille : $a^3 = (4{,}05 × 10^{-8})^3$. Deux opérations : $4{,}05^3 ≈ 66{,}4$ et $(10^{-8})^3 = 10^{-24}$, donc $a^3 ≈ 6{,}64 × 10^{-23}$ @u{cm³}.",
        "Je divise : $ρ = @f{1{,}79 × 10^{-22}}{6{,}64 × 10^{-23}} ≈ 2{,}70$ @u{g/cm³}.",
        "Je vérifie sur le réel : la masse volumique mesurée de l'aluminium est exactement $2{,}70$ @u{g/cm³}. Le modèle de la maille tombe juste — c'est ce qui le valide."],
  indice:"Masse d'une maille sur volume d'une maille. Attention au cube de la puissance de dix."},

 {id:"cr7", niveau:2, type:"qcm", enonce:"Le chlorure de sodium $@c{NaCl}$ est dur, cassant, fond à $801$ @u{°C} et conduit le courant une fois dissous dans l'eau. De quelle famille de cristal s'agit-il ?",
  choix:["Ionique","Métallique","Covalent","Moléculaire"], bonne:0,
  diag:["",
        "Un métal conduit le courant **à l'état solide**, grâce à ses électrons libres, et il est malléable plutôt que cassant. Le sel solide, lui, n'est pas conducteur.",
        "Un cristal covalent comme le diamant est extrêmement dur et reste isolant même dissous — d'ailleurs le diamant ne se dissout pas.",
        "Un cristal moléculaire fond bas : la glace à $0$ @u{°C}, le sucre vers $185$ @u{°C}. $801$ @u{°C} est bien trop élevé."],
  corr:["Je passe les indices en revue, un par un.",
        "**Il fond à $801$ @u{°C}** : très haut. Cela écarte les cristaux moléculaires, qui fondent bas.",
        "**Il conduit une fois dissous, mais pas à l'état solide** : les porteurs de charge existent, mais ils sont bloqués tant que le cristal tient. Ce sont des **ions**, immobilisés dans le réseau.",
        "**Il est cassant** : un choc décale les couches, des ions de même charge se retrouvent face à face, se repoussent, et le cristal se fend net.",
        "Ces trois indices désignent la même famille : c'est un cristal **ionique**.",
        "Ce qui le tient, ce sont les attractions entre $@c{Na^+}$ et $@c{Cl^-}$ — très fortes, d'où la température de fusion élevée."],
  indice:"Trois indices : la température de fusion, la conduction seulement en solution, et la fragilité."},

 {id:"cr8", niveau:3, type:"txt", enonce:"Un solide fondu à basse température, tendre, fait de molécules empilées : de quelle famille de cristal s'agit-il ? (un mot)",
  reps:["moleculaire","moléculaire","cristal moleculaire","un cristal moleculaire"],
  diag:[{r:"ionique", m:"Un cristal ionique fond très haut — $801$ @u{°C} pour le sel — parce qu'il faut vaincre l'attraction entre charges opposées. Une fusion à basse température indique des interactions bien plus faibles."},
        {r:"covalent", m:"Un cristal covalent comme le diamant est le plus dur et le plus réfractaire de tous : il faut casser des liaisons covalentes dans tout le solide. Ici le solide est tendre."},
        {r:"metallique", m:"Un métal est conducteur et malléable, et fond généralement haut. L'énoncé parle de **molécules** empilées, ce qui exclut un réseau métallique."}],
  corr:["Je pars de ce qui occupe les nœuds du réseau : ici, des **molécules** entières, neutres.",
        "Je me demande ensuite ce qui les tient ensemble.",
        "Entre molécules neutres, il n'y a que les interactions de van der Waals et, parfois, des liaisons hydrogène : c'est faible.",
        "Une cohésion faible se traduit par un solide **tendre**, qui fond à **basse température** — ce que décrit l'énoncé.",
        "C'est donc un cristal **moléculaire**.",
        "Deux exemples familiers : la glace, qui fond à $0$ @u{°C}, et le sucre. Dans les deux cas, fondre ne casse aucune molécule : on ne fait que les décoller les unes des autres."],
  indice:"Regarde ce qui occupe les nœuds du réseau, et demande-toi quelle force les retient."}
]
}

]);
