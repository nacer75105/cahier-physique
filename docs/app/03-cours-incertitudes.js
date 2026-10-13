/* =====================================================================
   Programme — Spécialité physique-chimie, classe de Première générale
   Partie transversale « Mesure et incertitudes »
   (référentiel .claude/referentiels/physique-1re-spe/, l. 135-165)

   Ce qui est au programme de 1re, et rien d'autre : série de mesures
   (histogramme, moyenne, écart-type), incertitude-type définie
   qualitativement, évaluée par une approche statistique (type A) et par une
   autre approche (type B, nouveauté de la 1re), écriture du résultat,
   comparaison QUALITATIVE à une valeur de référence. Le critère chiffré de
   comparaison et les incertitudes composées sont de Terminale (BO, l. 139-143) :
   ils ne sont pas enseignés ici, seulement signalés comme tels.

   SOURCES (à ne pas remplacer par des valeurs de mémoire) :
   - formules et règles d'écriture : ressource éduscol « Mesure et incertitudes
     au lycée », mai 2021 (.claude/referentiels/mesure-incertitudes/, SOURCES.md
     y donne chaque formule avec sa page) : s avec N − 1 (élément 8),
     u(x) = s et u(x̄) = s/√N (éléments 16-17), intervalle [m − a ; m + a] et
     u = a/√3 (éléments 18-19), u à deux chiffres significatifs et valeur
     mesurée alignée sur u (élément 25), valeur de référence (élément 26),
     causes d'un désaccord (élément 29) ; vocabulaire : ni « erreur » ni
     « précision » (éléments 13-14), pas d'écart relatif comme critère
     (élément 22) ;
   - pipette jaugée « 25 mL ± 0,030 mL » et u = 0,017 mL : même ressource,
     p. 26-27 (normes ISO 648:2008 et ISO 384:2015) ;
   - notice de multimètre « ± (0,5 % + 8 digits) », un digit valant 0,01 V sur
     le calibre 20 V : même ressource, p. 26 (notice du Voltcraft VC 130) ;
   - masse volumique de l'eau pure à 20 °C et 1 atm : 998,207 kg/m³, soit
     0,9982 g/mL — NIST Chemistry WebBook, SRD 69, « Thermophysical Properties
     of Fluid Systems » (formulation IAPWS-95), consulté le 2026-10-13 ;
   - inscriptions d'instruments dans les questions (pipette « 10 mL ± 0,020 mL »,
     fiole jaugée « 100 mL ± 0,10 mL ») : données d'énoncé, que l'élève lit sur
     l'objet ; valeurs plausibles pour de la verrerie de classe A, non sourcées,
     et le cours ne les présente pas comme des normes ;
   - séries de mesures (eau à l'éprouvette et au bécher, titrage) : mesures
     de classe fictives, tirées d'un modèle réaliste (valeur centrale + bruit
     gaussien, lectures arrondies à la résolution du matériel) ; moyennes et
     écarts-types recalculés en Python et dans outils/diags/.
   ===================================================================== */
window.COURS = (window.COURS || []).concat([

/* ============= 19. MESURE ET INCERTITUDES ============= */
{
id:"incertitudes", n:19, titre:"Mesure et incertitudes",
sous:"Toute mesure varie : dire de combien",
desc:"Série de mesures, histogramme, moyenne et écart-type ; incertitude-type, évaluée par la statistique (type A) ou à partir de l'instrument (type B) ; écriture d'un résultat ; comparaison à une valeur de référence, appliquée aux TP du cahier.",
duree:45,
sections:[
 {id:"s1", titre:"Une mesure varie : série, histogramme, moyenne", blocs:[
  {t:"idee", x:"Mesure plusieurs fois la même chose : tu ne trouves pas toujours le même nombre. Ce n'est pas une faute, c'est la nature de toute mesure. Le travail du physicien n'est pas de faire disparaître cette **variabilité**, c'est de dire **de combien** elle est."},
  {t:"p", x:"**Une expérience de classe.** Seize binômes mesurent la masse volumique de l'eau distillée, à $20$ @u{°C}, tous de la même façon : ils versent l'eau dans une **éprouvette graduée** jusqu'au trait $50$ @u{mL}, la pèsent sur une balance au centième de gramme (éprouvette tarée), puis calculent $ρ = @f{m}{V}$ (chapitre 1, section 8). Voici leurs seize résultats, en @u{g/mL} :"},
  {t:"tbl", head:["Binômes","Masses volumiques mesurées (@u{g/mL})","","","","","","",""], rows:[
   ["1 à 8","$1{,}006$","$1{,}000$","$1{,}001$","$1{,}002$","$0{,}993$","$0{,}989$","$0{,}991$","$0{,}999$"],
   ["9 à 16","$1{,}003$","$0{,}998$","$0{,}990$","$1{,}005$","$0{,}989$","$0{,}995$","$0{,}994$","$0{,}999$"]
  ]},
  {t:"p", x:"Personne ne s'est trompé, et pourtant les seize valeurs diffèrent. Chaque binôme a lu le bas du ménisque un peu plus haut ou un peu plus bas, a laissé une goutte de plus ou de moins sur la paroi, et deux éprouvettes fabriquées en série ne sont pas graduées exactement pareil. Ces petits écarts, nombreux et imprévisibles, font tomber chaque **observation** un peu à côté des autres. L'ensemble des seize observations forme une **série de mesures** ; elles sont **indépendantes** : chaque binôme a sa propre éprouvette, sa propre lecture, et l'écart de l'un ne dépend pas de celui de l'autre. Le **protocole** compte aussi : lire le ménisque l'œil à sa hauteur, attendre que l'éprouvette ait fini de s'égoutter, réduit la dispersion."},
  {t:"p", x:"**Une autre classe**, seize autres binômes, a fait exactement la même chose, mais en mesurant les $50$ @u{mL} avec un **bécher** de $100$ @u{mL} rempli jusqu'à sa graduation $50$ @u{mL}. Ses seize résultats, arrondis au centième, sont dans la figure ci-dessous (bouton « bécher »)."},
  {t:"p", x:"**L'histogramme.** Seize nombres en vrac ne se lisent pas d'un coup d'œil. On découpe l'axe des valeurs en intervalles de même largeur, les **classes**, et on dresse au-dessus de chaque classe une barre dont la hauteur est l'**effectif** : le nombre d'observations qui y tombent. Les barres se touchent, parce que les valeurs possibles remplissent l'axe sans trou. Une valeur posée pile sur une borne va dans la classe de droite."},
  {t:"figi", nom:"histogramme"},
  {t:"p", x:"Change la largeur des classes. Trop étroites, beaucoup restent vides ou ne contiennent qu'une valeur : le dessin suit le hasard de chaque mesure, pas la série. Trop larges, tout tient dans deux ou trois barres et on ne voit plus rien. Il n'y a pas de règle absolue ; pour seize valeurs, quatre ou cinq classes conviennent bien."},
  {t:"p", x:"**Construire un écart-type, sur trois valeurs** : $2$, $4$ et $6$, de moyenne $4$. Les écarts à la moyenne valent $-2$, $0$ et $+2$ : leur somme fait toujours $0$, elle ne mesure donc pas l'étalement. On les élève au carré pour qu'ils soient tous positifs : $4$, $0$, $4$, de somme $8$. On divise par $N - 1 = 2$ : $4$. On reprend la racine pour revenir à l'unité de départ : $s = @r{4} = 2$. C'est bien l'écart typique : deux valeurs sont à $2$ de la moyenne, une est dessus. La formule ci-dessous fait exactement ces quatre gestes."},
  {t:"formule", titre:"Moyenne et écart-type d'une série de N observations", x:"$@m{x} = @f{x_1 + x_2 + … + x_N}{N}$<br><br>$s = @r{@f{(x_1 - @m{x})^2 + (x_2 - @m{x})^2 + … + (x_N - @m{x})^2}{N - 1}}$",
   note:"La **moyenne** $@m{x}$ (« x barre ») dit **où** se trouvent les valeurs. L'**écart-type** $s$ dit **à quel point elles sont étalées** : c'est l'ordre de grandeur de l'écart d'une observation à la moyenne. Pourquoi $N - 1$ et pas $N$ ? Avec une seule observation, on ne voit aucun étalement : diviser par $N = 1$ donnerait $s = 0$, comme si la mesure ne variait pas, alors qu'on n'en sait rien ; diviser par $N - 1 = 0$ donne un calcul impossible, et c'est la bonne réponse. La justification complète dépasse le programme : on l'admet. On ne fait pas ce calcul à la main : la calculatrice et le tableur le font."},
  {t:"p", x:"Pour l'éprouvette : $@m{ρ} = 0{,}9971$ @u{g/mL} et $s = 0{,}0057$ @u{g/mL}. Neuf des seize observations tombent à moins d'un écart-type de la moyenne, et toutes à moins de deux : $s$ décrit l'écart **typique**, pas le plus grand. Pour le bécher : $@m{ρ} = 0{,}9906$ @u{g/mL} et $s = 0{,}031$ @u{g/mL}, un écart-type environ cinq fois plus grand : avec la même eau et les mêmes balances, c'est l'**instrument** qui disperse les résultats. Choisir l'instrument et le protocole, c'est choisir la dispersion."},
  {t:"methode", titre:"Moyenne, écart-type et histogramme avec la calculatrice ou le tableur", etapes:[
   "**Calculatrice** : entre les valeurs dans une liste, puis lance les statistiques à une variable. Lis $@m{x}$, puis l'écart-type noté **Sx**, **s** ou **σn−1** selon les modèles. L'autre écart-type affiché (noté **σx** ou **σn**) divise par $N$ au lieu de $N - 1$ : ce n'est pas celui qu'on veut.",
   "**Tableur** : valeurs dans une colonne (de A1 à A16), puis `=MOYENNE(A1:A16)` et `=ECARTYPE(A1:A16)`.",
   "**Histogramme au tableur** : sélectionne la colonne et insère un graphique de type **histogramme**, puis règle la largeur des classes. Attention : un graphique « en colonnes » ou « en barres » dessine une barre par valeur, séparée des autres ; il ne regroupe pas les valeurs en classes, ce n'est pas un histogramme."],
   exemple:"Les seize valeurs de l'éprouvette donnent $@m{ρ} = 0{,}997125$ @u{g/mL} et $s = 0{,}005667$ @u{g/mL}. Avec σn, on lirait $0{,}005487$ @u{g/mL} : un peu trop petit."},
  {t:"check", q:"Deux séries de mesures de la même grandeur ont la même moyenne, mais l'écart-type de la première est trois fois plus petit. Que peut-on dire ?",
   choix:["La seconde série contient des fautes","La première a forcément été faite avec plus de mesures","Les observations de la première série sont moins étalées autour de la moyenne","Les deux séries sont aussi dispersées, puisqu'elles ont la même moyenne"], bonne:2,
   expl:["Pas forcément : un écart-type plus grand dit que les résultats sont plus étalés, par exemple parce que l'instrument est plus grossier. Aucune faute n'est nécessaire.",
         "Ajouter des mesures ne rend pas une série moins étalée : seize mesures au bécher restent bien plus étalées que seize mesures à l'éprouvette. (Ce qui diminue avec le nombre de mesures, c'est l'incertitude-type de la **moyenne**, section 2.)",
         "Exact : l'écart-type mesure l'étalement des observations autour de la moyenne. Trois fois plus petit, trois fois moins étalé.",
         "La moyenne dit où sont les valeurs, pas à quel point elles sont étalées : c'est le rôle de l'écart-type."]}
 ]},

 {id:"s2", titre:"L'incertitude-type : évaluation de type A", blocs:[
  {t:"idee", x:"Le résultat d'une mesure n'est pas un nombre seul. C'est une **valeur mesurée** accompagnée de son **incertitude-type**, qui dit de combien cette valeur aurait pu varier si on avait refait toute la mesure."},
  {t:"p", x:"**La valeur mesurée.** Quand on dispose de plusieurs observations, on annonce leur **moyenne** : les écarts vers le haut et vers le bas se compensent en partie. Quand on n'a qu'une observation, c'est elle qu'on annonce."},
  {t:"p", x:"**L'incertitude-type**, notée $u$, dit de combien notre résultat pourrait s'écarter : si quelqu'un refaisait la mesure avec une méthode **bien meilleure**, on s'attend à ce que son résultat diffère du nôtre d'environ une incertitude-type. C'est un écart-type, donc un écart **typique**, pas un écart maximal. Les deux façons de le dire reviennent au même : une méthode bien meilleure tombe pratiquement sur la valeur de la grandeur, alors que refaire **notre** mesure ferait bouger notre résultat d'environ $u$ autour d'elle. (Définition officielle : l'estimation, sous forme d'écart-type, de l'étalement des valeurs qu'on peut raisonnablement attribuer à la grandeur mesurée.) Quand $u$ se calcule à partir d'une série d'observations, comme ici, on parle d'une **évaluation de type A**, c'est-à-dire statistique."},
  {t:"formule", titre:"Évaluation de type A (série de N observations, écart-type s)", x:"une observation seule : $u(x) = s$<br><br>la moyenne des $N$ observations : $u(@m{x}) = @f{s}{@r{N}}$",
   note:"La moyenne de seize observations varie bien moins qu'une observation seule : les écarts vers le haut et vers le bas se compensent en partie. En partie seulement, car le hasard ne les fait pas alterner parfaitement : avec $16$ observations, l'incertitude est divisée par $@r{16} = 4$, pas par $16$. Pour la diviser par $10$, il faudrait $100$ observations. Le facteur $@r{N}$ vient d'un théorème de mathématiques : on l'admet. Il suppose des observations **indépendantes** : seize lectures d'une même éprouvette mal graduée seraient toutes décalées pareil, et la moyenne ne corrigerait pas ce décalage."},
  {t:"astuce", titre:"Pourquoi √N : un modèle volontairement simplifié", x:"Imagine que chaque observation tombe soit un cran au-dessus de la valeur de la grandeur, soit un cran au-dessous, au hasard, comme à pile ou face, et indépendamment des autres. Une observation seule est toujours à un cran. Pour la moyenne de **deux** observations, il y a $4$ cas également possibles : dans $2$, les écarts se compensent exactement ; dans les $2$ autres, ils tombent du même côté, et la moyenne reste à un cran. Pour la moyenne de **quatre** observations, $16$ cas : $6$ compensent tout, $8$ laissent un demi-cran, et $2$ seulement ne compensent rien. Calculé comme un écart-type (racine de la moyenne des carrés des écarts), l'écart typique de cette moyenne vaut exactement un demi-cran : deux fois moins qu'une observation seule, et $@r{4} = 2$. Pas quatre fois moins : les cas où tout tombe du même côté pèsent encore."},
  {t:"exemple", titre:"L'incertitude-type de la masse volumique mesurée à l'éprouvette",
   enonce:"Les seize observations de la section 1, en @u{g/mL}. Quel résultat annoncer, avec quelle incertitude-type ?",
   etapes:[
    {q:"Quelle valeur mesurée annoncer ?", r:"La moyenne des seize observations, à la calculatrice : $@m{ρ} = 0{,}997125$ @u{g/mL}. On l'arrondira à la section 4."},
    {q:"Quel est l'écart-type de la série ?", r:"Touche Sx (ou σn−1) : $s = 0{,}005667$ @u{g/mL}. C'est l'incertitude-type d'**une** observation : grâce à la série de la classe, on sait maintenant qu'un binôme seul, avec ce protocole, s'écarte typiquement de $0{,}0057$ @u{g/mL}."},
    {q:"Quelle est l'incertitude-type de la moyenne ?", r:"$u(@m{ρ}) = @f{s}{@r{16}} = @f{0{,}005667}{4} ≈ 0{,}00142$ @u{g/mL}."},
    {q:"Que veut dire ce nombre ?", r:"Notre moyenne s'écarte typiquement d'environ $0{,}0014$ @u{g/mL} de ce que donnerait une mesure bien meilleure. Elle a une incertitude-type quatre fois plus petite que le résultat d'un binôme seul."}
   ]},
  {t:"piege", titre:"Incertitude ne veut dire ni faute, ni mauvaise mesure", x:"Une grande incertitude-type ne veut pas dire que la mesure est ratée : elle dit honnêtement ce que la méthode permet. Une mesure **mal faite**, c'est autre chose : une balance qu'on a oublié de tarer, une éprouvette lue au **haut** du ménisque au lieu du bas, un protocole non respecté. On évite d'ailleurs le mot « précis », trop vague : on dit plutôt qu'une méthode donne une **petite** ou une **grande incertitude-type**."},
  {t:"check", q:"Une série de $25$ observations a un écart-type $s = 0{,}40$ @u{mL}. Que vaut l'incertitude-type de la moyenne ?",
   choix:["$0{,}40$ @u{mL}","$0{,}016$ @u{mL}","$2{,}0$ @u{mL}","$0{,}080$ @u{mL}"], bonne:3,
   expl:["$0{,}40$ @u{mL}, c'est l'incertitude-type d'**une** observation seule. La moyenne de $25$ observations varie moins.",
         "On a divisé par $N = 25$ : l'incertitude-type de la moyenne est divisée par $@r{N} = 5$, pas par $N$.",
         "On a multiplié par $@r{25}$ au lieu de diviser : la moyenne de plusieurs observations varie moins qu'une seule, pas plus.",
         "Exact : $u = @f{0{,}40}{@r{25}} = @f{0{,}40}{5} = 0{,}080$ @u{mL}."]}
 ]},

 {id:"s3", titre:"Une seule mesure : évaluation de type B", blocs:[
  {t:"idee", x:"Quand on ne mesure qu'une fois, on ne peut pas calculer d'écart-type ; quand l'appareil affiche toujours la même chose, l'écart-type vaut zéro, ce qui ne veut pas dire que la mesure est parfaite : l'affichage cache la variabilité. On raisonne alors sur l'**instrument** : on encadre la valeur par un intervalle dont on est sûr, et on en déduit l'incertitude-type. C'est l'**évaluation de type B**."},
  {t:"p", x:"Monte sur un pèse-personne : il affiche $71$ @u{kg}. Descends, remonte : encore $71$ @u{kg}, toujours $71$ @u{kg}. La variabilité n'a pas disparu, l'affichage la cache : une masse de $70{,}6$ ou de $71{,}4$ @u{kg} aurait aussi affiché $71$. Le chapitre 2, section 3, partait de la même idée : une mesure n'est jamais plus fine que le plus petit cran de l'instrument."},
  {t:"methode", titre:"Évaluer une incertitude-type de type B", etapes:[
   "**Construire un intervalle** $[m - a ; m + a]$ qui contient à coup sûr la grandeur mesurée ; $m$ est la valeur mesurée, au centre. L'**étendue** est la largeur totale de l'intervalle, $2a$ ; la **demi-étendue** $a$ en est la moitié, la distance du centre au bord. Trois façons de trouver $a$ : la notice ou l'instrument donne une **tolérance** (« ± … ») ; ou bien c'est ton **jugement** sur la lecture (pour un affichage ou une graduation bien lue, la moitié du dernier cran) ; plus rarement, la notice donne directement l'incertitude-type, et c'est fini.",
   "**Calculer** $u = @f{a}{@r{3}}$, en supposant toutes les valeurs de l'intervalle également possibles (voir la figure ci-dessous).",
   "**Dire le choix fait** : deux personnes peuvent choisir des intervalles un peu différents. Tant que le choix est raisonnable et écrit, c'est correct."],
   exemple:"Le pèse-personne affiche $71$ @u{kg}, au kilogramme près : $a = 0{,}5$ @u{kg}, donc $u = @f{0{,}5}{@r{3}} ≈ 0{,}29$ @u{kg}. Une balance au centième affiche $49{,}86$ @u{g} : toute masse entre $49{,}855$ et $49{,}865$ @u{g} afficherait la même chose, donc $a = 0{,}005$ @u{g} et $u = @f{0{,}005}{@r{3}} ≈ 0{,}0029$ @u{g}."},
  {t:"fig", titre:"Le modèle de l'évaluation de type B",
   vue:[0,0,10,5], w:380, h:190, libre:true, grille:false, axes:false,
   objets:[
    {t:"rect", x:2, y:1, w:6, h:2.2, couleur:"bleu", rond:0},
    {t:"seg", de:[0.8,1], a:[9.2,1], couleur:"ink3", epais:1.5},
    {t:"seg", de:[2,0.8], a:[2,1.2], couleur:"ink", epais:1.5},
    {t:"seg", de:[5,0.8], a:[5,1.2], couleur:"ink", epais:1.5},
    {t:"seg", de:[8,0.8], a:[8,1.2], couleur:"ink", epais:1.5},
    {t:"texte", x:2, y:0.25, txt:"m − a", taille:13},
    {t:"texte", x:5, y:0.25, txt:"m", taille:13},
    {t:"texte", x:8, y:0.25, txt:"m + a", taille:13},
    {t:"seg", de:[5,1.8], a:[8,1.8], couleur:"ambre", epais:2.5},
    {t:"texte", x:6.5, y:2.05, txt:"a", couleur:"ambre", taille:14},
    {t:"texte", x:5, y:3.8, txt:"toutes les valeurs également possibles", couleur:"bleu", taille:12}
   ],
   note:"On suppose que toutes les valeurs de l'intervalle $[m - a ; m + a]$ sont également possibles : l'histogramme serait un rectangle. D'où vient le $@r{3}$ ? L'écart au centre va de $0$ (au milieu) à $a$ (aux bords) : en moyenne, une valeur est à $@f{a}{2}$ du centre. Mais l'écart-type élève les écarts au carré, ce qui donne plus de poids aux grands : il est un peu plus grand que $@f{a}{2}$. Le calcul, admis, donne $@f{a}{@r{3}}$, environ $0{,}58$ fois $a$. L'incertitude-type n'est donc pas $a$ : c'est un écart **typique**, pas l'écart maximal."},
  {t:"p", x:"Sur un afficheur, un **digit** est une unité du dernier chiffre affiché : sur le calibre $20$ @u{V}, l'appareil affiche $4{,}71$, donc un digit vaut $0{,}01$ @u{V}. Une notice « $± (0{,}5$ % $+ 8$ digits) » se lit en deux morceaux qu'on additionne : $0{,}5$ % de la valeur affichée, $0{,}005 × 4{,}71 ≈ 0{,}024$ @u{V}, plus $8$ digits, $8 × 0{,}01 = 0{,}08$ @u{V}, soit $a ≈ 0{,}104$ @u{V}. C'est la dernière ligne du tableau."},
  {t:"tbl", head:["Instrument","Intervalle","Incertitude-type"], rows:[
   ["Balance au centième, affichage $49{,}86$ @u{g}","jugement : $a = 0{,}005$ @u{g}","$@f{0{,}005}{@r{3}} ≈ 0{,}0029$ @u{g}"],
   ["Pipette jaugée gravée « $25$ @u{mL} $± 0{,}030$ @u{mL} »","tolérance gravée : $a = 0{,}030$ @u{mL}","$@f{0{,}030}{@r{3}} ≈ 0{,}017$ @u{mL}"],
   ["Multimètre, calibre $20$ @u{V}, notice « $± (0{,}5$ % $+ 8$ digits) », un digit $= 0{,}01$ @u{V} ; il affiche $4{,}71$ @u{V}","$a = 0{,}005 × 4{,}71 + 8 × 0{,}01 ≈ 0{,}104$ @u{V}","$@f{0{,}005 × 4{,}71 + 8 × 0{,}01}{@r{3}} ≈ 0{,}060$ @u{V}"]
  ]},
  {t:"p", x:"La dernière ligne est la tension à vide de la pile plate du chapitre 10, section 5 : lue sur un tel multimètre, $E = 4{,}71$ @u{V}, avec une incertitude-type de $0{,}060$ @u{V}. Le « $8$ digits » compte : sans lui, on trouverait une incertitude-type plus de quatre fois trop petite."},
  {t:"check", q:"Une pipette jaugée porte l'inscription « $10$ @u{mL} $± 0{,}020$ @u{mL} ». Quelle est l'incertitude-type du volume qu'elle délivre ?",
   choix:["$0{,}012$ @u{mL}","$0{,}020$ @u{mL}","$0{,}035$ @u{mL}","$0{,}0067$ @u{mL}"], bonne:0,
   expl:["Exact : la tolérance gravée est la demi-étendue $a = 0{,}020$ @u{mL}, et $u = @f{0{,}020}{@r{3}} ≈ 0{,}012$ @u{mL}.",
         "$0{,}020$ @u{mL}, c'est la demi-étendue $a$ de l'intervalle, pas l'incertitude-type : il reste à diviser par $@r{3}$.",
         "On a multiplié $a$ par $@r{3}$ au lieu de diviser.",
         "On a divisé par $3$ au lieu de $@r{3} ≈ 1{,}73$."]}
 ]},

 {id:"s4", titre:"Écrire un résultat avec son incertitude", blocs:[
  {t:"idee", x:"Un résultat de mesure s'écrit avec trois choses : la **valeur mesurée** avec son unité, son **incertitude-type** dans la même unité, et la façon dont on les a obtenues. Le nombre de chiffres de la valeur n'est pas libre : c'est l'incertitude-type qui le fixe."},
  {t:"methode", titre:"Écrire le résultat d'une mesure", etapes:[
   "**Arrondir l'incertitude-type à deux chiffres significatifs** (au plus proche ; un 5 final s'arrondit vers le haut). Elle-même n'est qu'une estimation : plus de chiffres ne voudraient rien dire. Rappel : les zéros de tête ne comptent pas ($0{,}0014$ a deux chiffres significatifs), les zéros de fin comptent ($0{,}060$ en a deux, $4{,}710$ en a quatre).",
   "**Arrondir la valeur mesurée au même rang**, c'est-à-dire dans la même colonne (dixièmes, centièmes, millièmes…) : son dernier chiffre tombe à la même position que le dernier chiffre de l'incertitude-type. Au besoin, on ajoute un zéro à droite.",
   "**Écrire** : $ρ = 0{,}9971$ @u{g/mL} et $u(ρ) = 0{,}0014$ @u{g/mL}. On peut aussi écrire $ρ = (0{,}9971 ± 0{,}0014)$ @u{g/mL}, **à condition de préciser** que ce qui suit le ± est l'incertitude-type.",
   "**Dire comment** : « moyenne de $16$ observations, incertitude-type de type A »."],
   exemple:"La pile plate : $E = 4{,}71$ @u{V} et $u = 0{,}0598$ @u{V}. Deux chiffres significatifs pour $u$ : $0{,}060$ @u{V}, qui s'arrête aux millièmes. On écrit donc $E = 4{,}710$ @u{V}, $u(E) = 0{,}060$ @u{V} ; l'un sous l'autre, $4{,}710$ et $0{,}060$ s'arrêtent tous deux dans la colonne des millièmes. Le zéro ajouté à $4{,}71$ n'invente rien, il aligne la valeur sur son incertitude."},
  {t:"tbl", head:["Valeur calculée","Incertitude-type calculée","Résultat écrit"], rows:[
   ["$0{,}997125$ @u{g/mL}","$0{,}001417$ @u{g/mL}","$0{,}9971$ @u{g/mL}, $u = 0{,}0014$ @u{g/mL}"],
   ["$4{,}71$ @u{V}","$0{,}0598$ @u{V}","$4{,}710$ @u{V}, $u = 0{,}060$ @u{V}"],
   ["$25$ @u{mL} (pipette)","$0{,}0173$ @u{mL}","$25{,}000$ @u{mL}, $u = 0{,}017$ @u{mL}"],
   ["$623{,}5$ @u{cm^2}","$11{,}3$ @u{cm^2}","$624$ @u{cm^2}, $u = 11$ @u{cm^2}"]
  ]},
  {t:"piege", titre:"Les chiffres en trop font croire à une mesure exacte", x:"Écrire $ρ = 0{,}997125$ @u{g/mL} quand $u = 0{,}0014$ @u{g/mL}, c'est annoncer trois chiffres qui changeraient à la mesure suivante. À l'inverse, ne garder qu'un chiffre pour $u$ peut fausser une comparaison : $0{,}0014$ arrondi à $0{,}001$ perd presque un tiers de sa valeur, et un écart de $0{,}0011$, qui lui était inférieur, deviendrait plus grand qu'elle. Deux chiffres, c'est le bon compromis."},
  {t:"check", q:"Un calcul donne $V = 8{,}23333$ @u{mL} et $u(V) = 0{,}04166$ @u{mL}. Quelle écriture respecte les règles ?",
   choix:["$V = 8{,}23333$ @u{mL}, $u = 0{,}042$ @u{mL}","$V = 8{,}233$ @u{mL}, $u = 0{,}042$ @u{mL}","$V = 8{,}23$ @u{mL}, $u = 0{,}042$ @u{mL}","$V = 8{,}233$ @u{mL}, $u = 0{,}04166$ @u{mL}"], bonne:1,
   expl:["L'incertitude est bien arrondie, mais la valeur garde des chiffres sans signification : son dernier chiffre doit tomber aux millièmes, comme celui de $u$.",
         "Exact : $u$ à deux chiffres significatifs, $0{,}042$ @u{mL}, et la valeur arrondie au même rang, $8{,}233$ @u{mL}.",
         "La valeur est arrondie trop tôt, aux centièmes, alors que $u = 0{,}042$ @u{mL} s'arrête aux millièmes.",
         "L'incertitude-type garde quatre chiffres significatifs : on l'arrondit à deux, $0{,}042$ @u{mL}."]}
 ]},

 {id:"s5", titre:"Comparer à une valeur de référence", blocs:[
  {t:"idee", x:"Une **valeur de référence** est obtenue par une méthode bien meilleure que la nôtre : son incertitude est négligeable devant la nôtre. Comparer, c'est regarder si l'écart entre notre résultat et elle est **au plus du même ordre** que notre incertitude-type (les deux sont **compatibles**) ou **bien plus grand** (ils ne le sont pas)."},
  {t:"p", x:"Pourquoi ce critère ? Par définition, l'incertitude-type dit de combien notre résultat aurait pu varier. Si la méthode est bonne, notre valeur tombe à côté de la référence, mais pas plus loin que de l'ordre d'une incertitude-type. Un écart de dix ou de cent incertitudes-types, lui, ne s'explique plus par la variabilité : quelque chose d'autre s'est passé. En pratique, prends $u$ comme une règle et compte combien de fois elle tient dans l'écart. Une fois, ou moins : du même ordre. Une dizaine de fois ou plus : bien plus grand. Entre les deux, la 1re ne tranche pas (il faudra le critère chiffré de Terminale) : on écrit simplement que l'écart vaut, par exemple, « environ trois incertitudes-types »."},
  {t:"p", x:"**Quelle valeur de référence ?** Le chapitre 1 donne pour l'eau $1{,}00$ @u{g/mL} : c'est une valeur arrondie, suffisante pour un calcul de quantité de matière. Pour juger une mesure dont l'incertitude-type vaut $0{,}0014$ @u{g/mL}, il faut une référence bien plus fine : $0{,}9982$ @u{g/mL} pour l'eau pure à $20$ @u{°C} (tables du NIST, l'institut de métrologie des États-Unis)."},
  {t:"tbl", head:["Mesure","Résultat","Référence","Écart","Conclusion"], rows:[
   ["Eau, éprouvette (section 2)","$0{,}9971$ @u{g/mL}, $u = 0{,}0014$ @u{g/mL}","$0{,}9982$ @u{g/mL} (eau pure à $20$ @u{°C})","$0{,}0011$ @u{g/mL}, plus petit que $u$","compatible"],
   ["Eau, bécher : $s = 0{,}031$ @u{g/mL}, $u = @f{s}{@r{16}}$","$0{,}9906$ @u{g/mL}, $u = 0{,}0077$ @u{g/mL}","$0{,}9982$ @u{g/mL}","$0{,}0076$ @u{g/mL}, de l'ordre de $u$","compatible, mais bien moins informatif"],
   ["Canette (chapitre 18, section 6)","$13{,}4$ @u{MJ/kg}","$26{,}8$ @u{MJ/kg}","la moitié de la référence","pas compatible"]
  ]},
  {t:"p", x:"Le bécher est compatible lui aussi : son écart à la référence est du même ordre que son incertitude-type, qui est grande. Être compatible ne veut pas dire être utile : face à un liquide de masse volumique $0{,}983$ @u{g/mL}, l'écart du bécher serait encore d'environ une incertitude-type ($0{,}9906 - 0{,}983 = 0{,}0076$ @u{g/mL}), et le bécher ne le distinguerait pas de l'eau. L'écart de l'éprouvette, lui, vaudrait une dizaine de ses incertitudes-types ($0{,}9971 - 0{,}983 = 0{,}0141$ @u{g/mL}) : elle les distingue."},
  {t:"p", x:"**La canette.** Le groupe a pesé au centième de gramme et lu ses températures au dixième de degré. Même en comptant très large, un dixième de gramme sur les $1{,}25$ @u{g} brûlés, c'est moins d'un dixième de la masse ; un degré sur $20$ @u{°C} d'échauffement, un vingtième. Rien qui approche la moitié qui manque. L'écart ne vient donc pas de la variabilité des mesures. Calculer l'incertitude-type du pouvoir calorifique, qui dépend de plusieurs mesures à la fois, est hors programme (voir plus bas) : ici, la comparaison qualitative suffit à conclure."},
  {t:"liste", items:[
   "**Que faire quand ce n'est pas compatible ?** Chercher la cause, parmi trois familles :",
   "**l'incertitude-type a été sous-estimée**, ou une source d'incertitude oubliée ;",
   "**l'expérience n'a pas été réalisée correctement** : un volume lu de travers, une valeur mal recopiée, un rayon mesuré au lieu d'un diamètre ;",
   "**la modélisation est incomplète** : le calcul suppose quelque chose de faux. Pour la canette, il suppose que toute l'énergie libérée chauffe l'eau, alors qu'une grande partie s'échappe dans l'air (chapitre 18, section 6).",
   "Un désaccord n'est pas un échec : il apprend quelque chose sur le montage ou sur le modèle."]},
  {t:"astuce", titre:"Variabilité ou tendance ?", x:"Regarde **comment** les mesures s'écartent du modèle. Sur la caractéristique de la pile plate (chapitre 10, section 5), les points tombent tantôt au-dessus, tantôt au-dessous de la droite, sans ordre : c'est la variabilité. Avec la seringue (chapitre 14, section 3), le produit $P × V$ ne s'agite pas au hasard : il **baisse régulièrement** quand le volume diminue, de $60 780$ à $58 980$ @u{hPa·mL}. Le volume lu sur la seringue n'est pas tout le volume d'air : il manque celui du tuyau, toujours le même. Plus on enfonce le piston, plus ce volume oublié compte par rapport au volume lu, et plus le produit $P × V$ calculé avec le seul volume lu reste en dessous de la constante, toujours dans le même sens. Le hasard, lui, ne pousse pas toujours dans le même sens. Une baisse aussi régulière signale donc une **modélisation incomplète** : très probablement l'air enfermé dans le tuyau."},
  {t:"astuce", titre:"Un écart en pourcentage est un repère, pas un critère", x:"On lit parfois « l'écart à la référence est de 3 %, donc c'est bon ». Un pourcentage seul ne dit pas si l'écart est grand **par rapport à l'incertitude-type** : 3 %, c'est énorme pour une mesure à $0{,}1$ % près, et rien du tout pour une mesure au bécher. Ce n'est pas le critère du programme ; c'est l'incertitude-type qui sert de mètre-étalon."},
  {t:"piege", titre:"Hors programme de 1re : vu en Terminale", x:"Deux outils attendent la Terminale, et ne sont **pas** au programme de 1re. Le premier est un **critère chiffré** de compatibilité : en 1re, la comparaison reste qualitative (« du même ordre », « bien plus grand »). Le second est l'**incertitude composée**, celle d'une grandeur calculée à partir de plusieurs mesures qui ont chacune leur incertitude, comme le pouvoir calorifique de la canette. En 1re, on ne combine pas des incertitudes."},
  {t:"check", q:"Un groupe mesure la masse volumique de l'eau : $ρ = 1{,}0120$ @u{g/mL}, $u(ρ) = 0{,}0015$ @u{g/mL}. Référence à $20$ @u{°C} : $0{,}9982$ @u{g/mL}. Que conclure ?",
   choix:["Compatible : $1{,}012$ et $0{,}9982$ sont presque égaux","Compatible : l'écart ne fait que 1,4 %","On ne peut rien dire sans refaire la mesure","Pas compatible : l'écart, environ $0{,}014$ @u{g/mL}, vaut environ neuf fois l'incertitude-type"], bonne:3,
   expl:["« Presque égaux » ne veut rien dire tout seul : il faut comparer l'écart à l'incertitude-type, et ici il est bien plus grand qu'elle.",
         "Un écart en pourcentage n'est pas le critère : c'est l'incertitude-type qui fixe ce qui est « petit ». Ici, l'écart vaut environ neuf incertitudes-types.",
         "On peut conclure : l'écart est bien plus grand que l'incertitude-type. Refaire la mesure servira ensuite à chercher la cause.",
         "Exact : $1{,}0120 - 0{,}9982 ≈ 0{,}014$ @u{g/mL}, soit environ neuf fois $0{,}0015$ @u{g/mL}. Il faut chercher la cause : une erreur de lecture, une incertitude sous-estimée, ou un liquide qui n'est pas de l'eau pure."]}
 ]},

 {id:"s6", titre:"Atelier — un titrage refait par douze binômes", blocs:[
  {t:"p", x:"Un titrage se fait d'habitude une fois. Ici, douze binômes titrent **la même** solution, avec le même protocole (chapitre 3, section 2), et notent chacun le volume versé à l'équivalence. La calculatrice est permise : c'est ainsi qu'on travaille en TP."},
  {t:"atelier", titre:"Douze volumes à l'équivalence",
   enonce:"Volumes à l'équivalence relevés à la burette, en @u{mL} : $12{,}40$ ; $12{,}45$ ; $12{,}50$ ; $12{,}40$ ; $12{,}40$ ; $12{,}45$ ; $12{,}25$ ; $12{,}60$ ; $12{,}55$ ; $12{,}55$ ; $12{,}50$ ; $12{,}55$. La professeure a préparé les solutions avec une verrerie de laboratoire bien plus fine que celle des élèves : d'après ses concentrations, le volume attendu est $V_{réf} = 12{,}48$ @u{mL}, la valeur de référence.",
   etapes:[
    {q:"Quelle est la valeur mesurée $@m{V}$, en @u{mL} ?",
     rep:12.4667, tol:0.004,
     aide:"La moyenne des douze volumes : leur somme, divisée par $12$.",
     diag:[{v:149.6, m:"C'est la **somme** des douze volumes. Il reste à la diviser par leur nombre, $12$."},
           {v:13.6, m:"Tu as divisé la somme par $11$. Il y a douze volumes : on divise par $12$."}],
     expl:"$@m{V} = @f{149{,}60}{12} ≈ 12{,}4667$ @u{mL}."},
    {q:"Quel est l'écart-type $s$ de la série, en @u{mL} ?",
     rep:0.09614, tol:0.0012,
     aide:"Statistiques à une variable : l'écart-type noté Sx, s ou σn−1.",
     diag:[{v:0.09205, m:"C'est l'écart-type **σn** (ou σx), qui divise par $N$. Celui qu'on veut est noté Sx, s ou σn−1 : il divise par $N - 1$."},
           {v:0.009242, m:"C'est le **carré** de l'écart-type (la variance). Il manque la racine carrée."}],
     expl:"La calculatrice donne $s ≈ 0{,}0961$ @u{mL} : une observation s'écarte typiquement de la moyenne d'un dixième de millilitre, deux gouttes environ."},
    {q:"Quelle est l'incertitude-type $u(@m{V})$ de la moyenne, en @u{mL} ?",
     rep:0.02775, tol:0.0006,
     aide:"Évaluation de type A pour une moyenne de $N$ observations : $u = @f{s}{@r{N}}$.",
     diag:[{v:0.09614, m:"$0{,}096$ @u{mL}, c'est l'incertitude-type d'**une** observation seule. Celle de la moyenne des douze est plus petite : divise par $@r{12}$."},
           {v:0.008012, m:"Tu as divisé par $12$ au lieu de $@r{12} ≈ 3{,}46$."},
           {v:0.02657, m:"Tu es parti de σn (division par $N$) au lieu de Sx : reprends $s = 0{,}0961$ @u{mL}, puis divise par $@r{12}$."},
           {v:0.333, m:"Tu as multiplié par $@r{12}$ au lieu de diviser : la moyenne de douze observations varie moins qu'une seule."}],
     expl:"$u(@m{V}) = @f{s}{@r{12}} = @f{0{,}09614}{@r{12}} ≈ 0{,}0278$ @u{mL}."},
    {q:"Comment écrire le résultat ?",
     choix:["$@m{V} = 12{,}4667$ @u{mL}, $u = 0{,}0278$ @u{mL}","$@m{V} = 12{,}467$ @u{mL}, $u = 0{,}096$ @u{mL}","$@m{V} = 12{,}467$ @u{mL}, $u = 0{,}028$ @u{mL}","$@m{V} = 12{,}5$ @u{mL}, $u = 0{,}028$ @u{mL}"], bonne:2,
     diag:["Trop de chiffres : l'incertitude-type s'arrondit à deux chiffres significatifs, et la valeur au même rang qu'elle.",
           "$0{,}096$ @u{mL} est l'écart-type de la série, l'incertitude d'une observation seule. Le résultat annoncé est la moyenne : son incertitude est $0{,}028$ @u{mL}.",
           "",
           "La valeur est arrondie trop tôt, aux dixièmes : $u = 0{,}028$ @u{mL} s'arrête aux millièmes, la valeur aussi."],
     expl:"$u = 0{,}028$ @u{mL} (deux chiffres significatifs), et la valeur au même rang : $@m{V} = 12{,}467$ @u{mL}, moyenne de douze observations, incertitude-type de type A."},
    {q:"Le résultat est-il compatible avec la valeur attendue $V_{réf} = 12{,}48$ @u{mL} ?",
     choix:["Oui : l'écart, $0{,}013$ @u{mL}, est plus petit que l'incertitude-type","Non : $12{,}467$ n'est pas égal à $12{,}48$","Oui, parce que l'écart est inférieur à 1 %","On ne peut pas savoir sans un treizième titrage"], bonne:0,
     diag:["",
           "Deux valeurs ne sont presque jamais exactement égales : la question est de savoir si leur écart est grand **par rapport à l'incertitude-type**.",
           "La conclusion est juste, mais pas la raison : un pourcentage seul n'est pas le critère. C'est l'écart comparé à l'incertitude-type qui compte.",
           "Douze observations suffisent : l'incertitude-type de la moyenne est connue, on peut comparer."],
     expl:"$12{,}48 - 12{,}467 = 0{,}013$ @u{mL}, moins que $u = 0{,}028$ @u{mL} : le résultat de la classe est **compatible** avec la valeur attendue."}
   ],
   bilan:"Un résultat de mesure, c'est une valeur **et** une incertitude-type, obtenues par une méthode qu'on sait dire. Ici, la moyenne de douze titrages : $@m{V} = 12{,}467$ @u{mL}, $u = 0{,}028$ @u{mL}, compatible avec la valeur attendue. Un binôme seul aurait annoncé son volume avec une incertitude-type d'environ $0{,}096$ @u{mL} : rassembler les mesures de la classe la divise par $@r{12}$, soit environ $3{,}5$."}
 ]},

 {id:"s7", titre:"Récapitulatif", blocs:[
  {t:"idee", x:"Toute mesure varie. On annonce une **valeur mesurée** et son **incertitude-type** : un écart-type qui dit de combien le résultat aurait pu varier. On l'évalue par la statistique sur une série (type A) ou à partir de l'instrument pour une mesure unique (type B), on écrit le résultat avec les bons chiffres, et on le compare qualitativement à une valeur de référence."},
  {t:"tbl", head:["La question ressemble à…","Ce qu'il faut faire"], rows:[
   ["« Exploiter une série de mesures »","Histogramme ; moyenne $@m{x}$ ; écart-type $s$ (Sx ou σn−1, jamais σn)"],
   ["« Incertitude-type, plusieurs mesures »","Type A : $u(x) = s$ pour une observation, $u(@m{x}) = @f{s}{@r{N}}$ pour la moyenne"],
   ["« Incertitude-type, une seule mesure »","Type B : intervalle $[m - a ; m + a]$ (tolérance, notice ou jugement), puis $u = @f{a}{@r{3}}$"],
   ["« Écrire le résultat »","$u$ à deux chiffres significatifs, la valeur au même rang, l'unité, la méthode"],
   ["« Comparer à la référence »","Écart du même ordre que $u$ : compatible ; bien plus grand : chercher la cause (incertitude sous-estimée, expérience mal faite, modélisation incomplète)"]
  ]},
  {t:"mots", items:[
   ["Observation","Une des valeurs obtenues en mesurant ; plusieurs observations forment une série."],
   ["Histogramme","Barres jointives : en abscisse les classes de valeurs, en hauteur l'effectif de chaque classe."],
   ["Écart-type","L'ordre de grandeur de l'écart d'une observation à la moyenne : il mesure l'étalement de la série."],
   ["Incertitude-type","L'écart-type qui dit de combien la valeur mesurée aurait pu varier."],
   ["Type A, type B","Deux façons d'évaluer l'incertitude-type : par la statistique sur une série (A), ou autrement, à partir de l'instrument (B)."],
   ["Valeur de référence","Une valeur obtenue par une méthode bien meilleure que la nôtre."],
   ["Compatible","L'écart à la référence n'est pas plus grand que de l'ordre de l'incertitude-type."],
   ["Demi-étendue","La distance $a$ entre le centre $m$ et le bord de l'intervalle $[m - a ; m + a]$."],
   ["Classe, effectif","Un intervalle de l'axe des valeurs, et le nombre d'observations qui y tombent."]
  ]},
  {t:"piege", titre:"Les quatre erreurs les plus coûteuses", x:"**1. Le mauvais écart-type** : σn (ou σx) divise par $N$ ; celui du cours, Sx ou σn−1, divise par $N - 1$.<br>**2. Le √N oublié, ou mal placé** : l'incertitude de la moyenne est $@f{s}{@r{N}}$, ni $s$, ni $@f{s}{N}$.<br>**3. Trop de chiffres** : $u$ à deux chiffres significatifs, la valeur au même rang.<br>**4. Conclure sur « égal » ou « pas égal »** : deux valeurs ne sont presque jamais exactement égales ; c'est l'écart comparé à l'incertitude-type qui décide."}
 ]}
],
exos:[
 {id:"mi1", niveau:1, type:"qcm", enonce:"Seize binômes mesurent la même grandeur, avec le même protocole, et trouvent seize valeurs un peu différentes. Que faut-il en conclure ?",
  choix:["Au moins quinze binômes se sont trompés","C'est la variabilité normale de toute mesure","Le matériel de la salle est défectueux","Il faut garder la valeur la plus fréquente et oublier les autres"], bonne:1,
  diag:["Personne ne s'est forcément trompé : une mesure refaite donne presque toujours une valeur un peu différente.",
        "",
        "Rien ne l'indique : même avec du bon matériel, chaque lecture et chaque instrument fluctuent un peu.",
        "Les seize valeurs sont toutes des informations : on les résume par leur moyenne et leur écart-type, on n'en garde pas une seule."],
  corr:["**Toute mesure varie** : la lecture, le geste, l'instrument changent un peu d'une fois à l'autre.",
        "On ne cherche pas la « bonne » valeur parmi les seize : on les **résume** par la moyenne (où elles sont) et l'écart-type (à quel point elles sont étalées)."],
  indice:"Une mesure refaite donne-t-elle toujours exactement le même nombre ?"},

 {id:"mi2", niveau:1, type:"num", enonce:"Cinq mesures de la période d'un pendule, en secondes : $1{,}98$ ; $2{,}03$ ; $2{,}01$ ; $1{,}97$ ; $2{,}02$. Quelle valeur mesurée annonce-t-on, en @u{s} (garde trois décimales) ?",
  rep:2.002, unite:"s", tol:0.0006,
  diag:[{v:10.01, m:"C'est la **somme** des cinq mesures : il reste à la diviser par $5$."},
        {v:2.5025, m:"Tu as divisé la somme par $4$ : il y a cinq mesures, on divise par $5$."}],
  corr:["**La valeur mesurée est la moyenne** des observations : les écarts vers le haut et vers le bas se compensent en partie.",
        "$@m{T} = @f{1{,}98 + 2{,}03 + 2{,}01 + 1{,}97 + 2{,}02}{5} = @f{10{,}01}{5} ≈ 2{,}002$ @u{s}."],
  indice:"Somme des mesures, divisée par leur nombre."},

 {id:"mi3", niveau:2, type:"num", enonce:"Une série de $N = 9$ observations d'une longueur a un écart-type $s = 0{,}6$ @u{mm}. Quelle est l'incertitude-type de la moyenne, en @u{mm} ?",
  rep:0.2, unite:"mm", tol:0.004,
  diag:[{v:0.6, m:"$0{,}6$ @u{mm}, c'est l'incertitude-type d'**une** observation. Celle de la moyenne est plus petite : divise par $@r{9}$."},
        {v:0.06667, m:"Tu as divisé par $N = 9$ au lieu de $@r{9} = 3$."},
        {v:1.8, m:"Tu as multiplié par $@r{9}$ au lieu de diviser : la moyenne de plusieurs observations varie moins qu'une seule."}],
  corr:["**Type A, pour une moyenne** : $u(@m{x}) = @f{s}{@r{N}}$.",
        "$u = @f{0{,}6}{@r{9}} = @f{0{,}6}{3} = 0{,}2$ @u{mm}."],
  indice:"L'incertitude de la moyenne diminue comme la racine du nombre d'observations."},

 {id:"mi4", niveau:2, type:"num", enonce:"Un thermomètre est gradué de degré en degré. Le liquide s'arrête en face de la graduation $38$ @u{°C}, et tu juges que la température est sûrement comprise entre $37{,}5$ et $38{,}5$ @u{°C}. Quelle incertitude-type de type B associer à cette lecture, en @u{°C} ?",
  rep:0.2887, unite:"°C", tol:0.003,
  diag:[{v:0.5, m:"$0{,}5$ @u{°C}, c'est la demi-étendue $a$ de l'intervalle. L'incertitude-type vaut $@f{a}{@r{3}}$."},
        {v:0.5774, m:"Tu as divisé l'étendue entière ($1$ @u{°C}) par $@r{3}$. La formule utilise la **demi**-étendue : $a = 0{,}5$ @u{°C}."},
        {v:0.1667, m:"Tu as divisé par $3$ au lieu de $@r{3} ≈ 1{,}73$."}],
  corr:["**L'intervalle** : $[37{,}5 ; 38{,}5]$ @u{°C}, centré sur $m = 38$ @u{°C}, de demi-étendue $a = 0{,}5$ @u{°C}.",
        "**Type B** : $u = @f{a}{@r{3}} = @f{0{,}5}{@r{3}} ≈ 0{,}29$ @u{°C}."],
  indice:"Quelle est la demi-étendue de l'intervalle ? Puis $u = @f{a}{@r{3}}$."},

 {id:"mi5", niveau:2, type:"num", enonce:"Une fiole jaugée porte l'inscription « $100$ @u{mL} $± 0{,}10$ @u{mL} ». Quelle est l'incertitude-type du volume qu'elle contient, en @u{mL} ?",
  rep:0.05774, unite:"mL", tol:0.0008,
  diag:[{v:0.1, m:"$0{,}10$ @u{mL} est la tolérance gravée, c'est-à-dire la demi-étendue $a$. L'incertitude-type vaut $@f{a}{@r{3}}$."},
        {v:0.1732, m:"Tu as multiplié par $@r{3}$ au lieu de diviser."},
        {v:0.03333, m:"Tu as divisé par $3$ au lieu de $@r{3} ≈ 1{,}73$."}],
  corr:["**Ce qui est gravé** après le ± est la demi-étendue de l'intervalle : $a = 0{,}10$ @u{mL}.",
        "**Type B** : $u = @f{0{,}10}{@r{3}} ≈ 0{,}058$ @u{mL}."],
  indice:"Le « ± » gravé donne la demi-étendue $a$."},

 {id:"mi6", niveau:3, type:"num", enonce:"La notice d'un multimètre indique, sur le calibre $20$ @u{V} : « $± (0{,}5$ % de la valeur affichée $+ 8$ digits) », un digit valant $0{,}01$ @u{V} sur ce calibre. Il affiche $10{,}00$ @u{V}. Quelle est l'incertitude-type de cette mesure, en @u{V} ?",
  rep:0.07506, unite:"V", tol:0.0008,
  diag:[{v:0.13, m:"$0{,}13$ @u{V} est la demi-étendue $a$ que donne la notice. L'incertitude-type vaut $@f{a}{@r{3}}$."},
        {v:0.02887, m:"Tu as oublié les $8$ digits : $a = 0{,}5$ % $× 10{,}00 + 8 × 0{,}01$ @u{V}."},
        {v:0.04619, m:"Tu as oublié les $0{,}5$ % de la valeur affichée : $a = 0{,}005 × 10{,}00 + 8 × 0{,}01$ @u{V}."}],
  corr:["**La demi-étendue** donnée par la notice : $a = 0{,}005 × 10{,}00 + 8 × 0{,}01 = 0{,}05 + 0{,}08 = 0{,}13$ @u{V}.",
        "**Type B** : $u = @f{0{,}13}{@r{3}} ≈ 0{,}075$ @u{V}."],
  indice:"D'abord la demi-étendue $a$ (les deux termes de la notice), puis $u = @f{a}{@r{3}}$."},

 {id:"mi7", niveau:2, type:"qcm", enonce:"Un calcul donne une aire $A = 1 386{,}5$ @u{cm^2} avec une incertitude-type $u(A) = 23{,}4$ @u{cm^2}. Quelle écriture respecte les règles ?",
  choix:["$A = 1 387$ @u{cm^2}, $u(A) = 23$ @u{cm^2}","$A = 1 386{,}5$ @u{cm^2}, $u(A) = 23{,}4$ @u{cm^2}","$A = 1 390$ @u{cm^2}, $u(A) = 20$ @u{cm^2}","$A = 1 386{,}5$ @u{cm^2}, $u(A) = 23$ @u{cm^2}"], bonne:0,
  diag:["",
        "L'incertitude-type garde trois chiffres significatifs : on l'arrondit à deux, $23$ @u{cm^2}, et la valeur au même rang.",
        "L'incertitude-type n'a gardé qu'un chiffre significatif : on en garde deux, $23$ @u{cm^2}.",
        "L'incertitude est bien arrondie, mais la valeur garde une décimale : son dernier chiffre doit tomber aux unités, comme celui de $23$."],
  corr:["**L'incertitude-type à deux chiffres significatifs** : $23{,}4$ devient $23$ @u{cm^2}.",
        "**La valeur au même rang**, les unités : $1 386{,}5$ devient $1 387$ @u{cm^2} (un 5 final s'arrondit vers le haut).",
        "$A = 1 387$ @u{cm^2}, $u(A) = 23$ @u{cm^2}."],
  indice:"D'abord l'incertitude-type, à deux chiffres significatifs ; ensuite la valeur."},

 {id:"mi8", niveau:2, type:"qcm", enonce:"Un compte rendu écrit : $E = 4{,}710$ @u{V}, $u(E) = 0{,}060$ @u{V}. Que penser du zéro final de $4{,}710$ ?",
  choix:["Il est inutile : il faudrait écrire $4{,}71$ @u{V}","Il indique que la tension est connue exactement au millième","Il place le dernier chiffre de $E$ au même rang que celui de $u(E)$","Il signale que la valeur a été arrondie vers le haut"], bonne:2,
  diag:["Sans ce zéro, la valeur s'arrêterait aux centièmes alors que l'incertitude-type s'arrête aux millièmes : les deux ne seraient plus alignées.",
        "Aucune mesure n'est connue exactement : c'est justement $u(E) = 0{,}060$ @u{V} qui dit de combien elle pourrait varier.",
        "",
        "Ajouter un zéro n'arrondit rien : la valeur ne change pas, seule son écriture s'aligne sur l'incertitude-type."],
  corr:["**L'incertitude-type** $0{,}060$ @u{V} a deux chiffres significatifs et s'arrête aux millièmes.",
        "**La valeur mesurée s'écrit au même rang** : on complète $4{,}71$ par un zéro, $4{,}710$ @u{V}. Le zéro n'invente rien, il aligne."],
  indice:"Où s'arrête l'incertitude-type ?"},

 {id:"mi9", niveau:2, type:"qcm", enonce:"Une classe mesure la masse volumique de l'eau à $20$ @u{°C} : $ρ = 0{,}9965$ @u{g/mL}, $u(ρ) = 0{,}0021$ @u{g/mL}. La valeur de référence est $0{,}9982$ @u{g/mL}. Que conclure ?",
  choix:["Pas compatible : $0{,}9965$ n'est pas égal à $0{,}9982$","Compatible : l'écart, $0{,}0017$ @u{g/mL}, est plus petit que l'incertitude-type","Compatible, parce que l'écart est inférieur à 1 %","On ne peut pas conclure sans connaître le nombre de binômes"], bonne:1,
  diag:["Deux valeurs ne sont presque jamais exactement égales : c'est l'écart comparé à l'incertitude-type qui décide.",
        "",
        "La conclusion est juste, mais pas la raison : un pourcentage seul n'est pas le critère, c'est l'incertitude-type qui fixe ce qui est « petit ».",
        "Le nombre de binômes est déjà pris en compte dans l'incertitude-type de la moyenne : on peut conclure."],
  corr:["**L'écart** : $0{,}9982 - 0{,}9965 = 0{,}0017$ @u{g/mL}.",
        "**Comparé à l'incertitude-type** $0{,}0021$ @u{g/mL}, il est plus petit : le résultat est **compatible** avec la référence."],
  indice:"Compare l'écart à l'incertitude-type, pas à zéro."},

 {id:"mi10", niveau:2, type:"qcm", enonce:"Un groupe mesure le pouvoir calorifique de l'éthanol avec une lampe à alcool sous une canette d'eau (chapitre 18, section 6). Pesées au centième de gramme, températures au dixième de degré, calcul juste : il trouve la moitié de la valeur de référence. Quelle est la cause la plus plausible ?",
  choix:["La balance au centième de gramme","Le hasard des mesures : un autre essai donnerait la bonne valeur","La valeur de référence, qui est sans doute fausse","Une modélisation incomplète : toute l'énergie libérée ne chauffe pas l'eau"], bonne:3,
  diag:["La lecture d'une balance au centième ne varie que de quelques centièmes de gramme, sur plus d'un gramme brûlé : de quoi déplacer le résultat d'un tout petit peu, pas de moitié.",
        "La variabilité des lectures déplace le résultat d'une petite fraction, pas de moitié : un écart aussi grand vient d'autre chose.",
        "Une valeur de référence est obtenue par une méthode bien meilleure que la nôtre : c'est notre montage qu'il faut examiner d'abord.",
        ""],
  corr:["**L'écart est énorme** devant ce que les lectures peuvent faire varier : il ne vient pas de la variabilité des mesures.",
        "**Le calcul suppose** que toute l'énergie libérée par la flamme chauffe l'eau. C'est faux : les gaz chauds et le rayonnement s'échappent, la canette chauffe aussi. C'est une **modélisation incomplète**."],
  indice:"Qu'est-ce que le calcul suppose, et qui n'est pas vrai dans le montage ?"},

 {id:"mi11", niveau:1, type:"qcm", enonce:"Une mesure a une grande incertitude-type. Qu'est-ce que cela veut dire ?",
  choix:["Que la méthode laisse les résultats varier beaucoup, ce qui n'est pas une faute","Que la mesure a été ratée","Que l'expérimentateur s'est trompé dans son calcul","Que le résultat est forcément loin de la valeur de référence"], bonne:0,
  diag:["",
        "Une mesure ratée, c'est un protocole non respecté (balance non tarée, lecture de travers). Une grande incertitude dit seulement ce que la méthode permet.",
        "L'incertitude-type ne dit rien d'une faute de calcul : elle dit de combien le résultat aurait pu varier.",
        "Pas forcément : avec le bécher, la masse volumique de l'eau a une grande incertitude-type et reste compatible avec la référence."],
  corr:["**L'incertitude-type** dit de combien le résultat aurait pu varier : c'est une propriété de la méthode, pas un jugement.",
        "**Grande ou petite**, elle est honnête ; une mesure ratée, c'est un protocole qu'on n'a pas respecté."],
  indice:"L'incertitude-type est-elle un défaut, ou une information ?"},

 {id:"mi12", niveau:2, type:"qcm", enonce:"Deux séries de $16$ mesures de la masse volumique de l'eau : à l'éprouvette graduée, écart-type $0{,}0057$ @u{g/mL} ; au bécher, écart-type $0{,}031$ @u{g/mL}. Que peut-on dire ?",
  choix:["Les deux moyennes ont la même incertitude-type, puisqu'il y a autant de mesures","La moyenne du bécher est forcément plus loin de la référence","Le bécher a été mal utilisé par tous les binômes","L'éprouvette disperse moins les résultats : sa moyenne a une incertitude-type plus petite"], bonne:3,
  diag:["L'incertitude-type de la moyenne est $@f{s}{@r{N}}$ : même $N$, mais pas le même $s$, donc pas la même incertitude.",
        "Pas forcément : une série dispersée peut avoir une moyenne proche de la référence. Elle est seulement moins sûre.",
        "Rien ne l'indique : un bécher est gradué grossièrement, il disperse les résultats même bien utilisé.",
        ""],
  corr:["**Même nombre de mesures**, mais l'écart-type du bécher est environ cinq fois plus grand.",
        "**L'incertitude-type de la moyenne**, $@f{s}{@r{16}} = @f{s}{4}$, est donc cinq fois plus grande au bécher : l'instrument fixe la dispersion."],
  indice:"Que vaut l'incertitude-type d'une moyenne, et de quoi dépend-elle ?"},

 {id:"mi13", niveau:1, type:"qcm", enonce:"Tu mesures **une seule fois** la longueur d'une paillasse avec un mètre ruban gradué au millimètre, bien posé. Comment évaluer l'incertitude-type de cette lecture ?",
  choix:["Type A : $u = @f{s}{@r{N}}$","Impossible : il faut au moins deux mesures","Type B : un intervalle de demi-étendue $a = 0{,}5$ @u{mm}, puis $u = @f{a}{@r{3}}$","$u = 1$ @u{mm}, la valeur d'une graduation"], bonne:2,
  diag:["Avec une seule mesure, il n'y a pas d'écart-type à calculer : le type A demande une série d'observations.",
        "Une seule mesure suffit : on raisonne alors sur l'instrument, c'est l'évaluation de type B.",
        "",
        "Une graduation entière, c'est l'étendue de l'intervalle ; la demi-étendue vaut $0{,}5$ @u{mm}, et il reste à diviser par $@r{3}$."],
  corr:["**Une seule mesure** : pas de série, donc pas de type A. On raisonne sur l'instrument : c'est le **type B**.",
        "**L'intervalle** : un mètre gradué au millimètre, bien lu, encadre la longueur à un demi-millimètre près de chaque côté : $a = 0{,}5$ @u{mm}.",
        "**L'incertitude-type** : $u = @f{0{,}5}{@r{3}} ≈ 0{,}29$ @u{mm}."],
  indice:"Une série, ou une seule lecture ?"}
]
}

]);
