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
  {t:"tbl", head:["Binômes 1 à 8","$1{,}006$","$1{,}000$","$1{,}001$","$1{,}002$","$0{,}993$","$0{,}989$","$0{,}991$","$0{,}999$"], rows:[
   ["Binômes 9 à 16","$1{,}003$","$0{,}998$","$0{,}990$","$1{,}005$","$0{,}989$","$0{,}995$","$0{,}994$","$0{,}999$"]
  ]},
  {t:"p", x:"Personne ne s'est trompé, et pourtant les seize valeurs diffèrent. Chaque binôme a lu le bas du ménisque un peu plus haut ou un peu plus bas, a laissé une goutte de plus ou de moins sur la paroi, et deux éprouvettes fabriquées en série ne sont pas graduées exactement pareil. Ces petits écarts, nombreux et imprévisibles, font tomber chaque **observation** un peu à côté des autres. L'ensemble des seize observations forme une **série de mesures**."},
  {t:"p", x:"**L'histogramme.** Seize nombres en vrac ne se lisent pas d'un coup d'œil. On découpe l'axe des valeurs en intervalles de même largeur, les **classes**, et on dresse au-dessus de chaque classe une barre dont la hauteur est l'**effectif** : le nombre d'observations qui y tombent. Les barres se touchent, parce que les valeurs possibles remplissent l'axe sans trou. Une valeur posée pile sur une borne va dans la classe de droite."},
  {t:"figi", nom:"histogramme"},
  {t:"p", x:"Change la largeur des classes. Trop étroites, beaucoup restent vides ou ne contiennent qu'une valeur : le dessin suit le hasard de chaque mesure, pas la série. Trop larges, tout tient dans deux ou trois barres et on ne voit plus rien. Il n'y a pas de règle absolue ; pour seize valeurs, quatre ou cinq classes conviennent bien."},
  {t:"formule", titre:"Moyenne et écart-type d'une série de N observations", x:"$@m{x} = @f{x_1 + x_2 + … + x_N}{N}$<br><br>$s = @r{@f{(x_1 - @m{x})^2 + (x_2 - @m{x})^2 + … + (x_N - @m{x})^2}{N - 1}}$",
   note:"La **moyenne** $@m{x}$ (« x barre ») dit **où** se trouvent les valeurs. L'**écart-type** $s$ dit **à quel point elles sont étalées** : c'est l'ordre de grandeur de l'écart d'une observation à la moyenne. Le $N - 1$ au dénominateur n'est pas une faute de frappe. On ne fait pas ce calcul à la main : la calculatrice et le tableur le font."},
  {t:"p", x:"Pour l'éprouvette : $@m{ρ} = 0{,}9971$ @u{g/mL} et $s = 0{,}0057$ @u{g/mL}. Aucune des seize observations ne s'écarte de la moyenne de plus de $0{,}009$ @u{g/mL}. Pour le bécher, l'écart-type est environ cinq fois plus grand : avec la même eau et les mêmes balances, c'est l'**instrument** qui disperse les résultats. Choisir l'instrument et le protocole, c'est choisir la dispersion."},
  {t:"methode", titre:"Moyenne, écart-type et histogramme avec la calculatrice ou le tableur", etapes:[
   "**Calculatrice** : entre les valeurs dans une liste, puis lance les statistiques à une variable. Lis $@m{x}$, puis l'écart-type noté **Sx**, **s** ou **σn−1** selon les modèles. L'autre écart-type affiché (noté **σx** ou **σn**) divise par $N$ au lieu de $N - 1$ : ce n'est pas celui qu'on veut.",
   "**Tableur** : valeurs dans une colonne (de A1 à A16), puis `=MOYENNE(A1:A16)` et `=ECARTYPE(A1:A16)`.",
   "**Histogramme au tableur** : sélectionne la colonne, puis Insertion, Graphique, type **Histogramme** (Excel, ou Google Sheets dans « Autres ») ; règle ensuite la largeur des classes. Attention, un « histogramme 2D » d'Excel est un diagramme en bâtons, pas un histogramme."],
   exemple:"Les seize valeurs de l'éprouvette donnent $@m{ρ} = 0{,}997125$ et $s = 0{,}005667$ @u{g/mL}. Avec σn, on lirait $0{,}005487$ : un peu trop petit."},
  {t:"check", q:"Deux séries de mesures de la même grandeur ont la même moyenne, mais l'écart-type de la première est trois fois plus petit. Que peut-on dire ?",
   choix:["La seconde série contient des fautes","La première a forcément été faite avec plus de mesures","Les observations de la première série sont moins étalées autour de la moyenne","Les deux séries sont aussi dispersées, puisqu'elles ont la même moyenne"], bonne:2,
   expl:["Pas forcément : un écart-type plus grand dit que les résultats sont plus étalés, par exemple parce que l'instrument est plus grossier. Aucune faute n'est nécessaire.",
         "L'écart-type ne dépend pas du nombre de mesures de cette façon : seize mesures au bécher restent bien plus étalées que seize mesures à l'éprouvette.",
         "Exact : l'écart-type mesure l'étalement des observations autour de la moyenne. Trois fois plus petit, trois fois moins étalé.",
         "La moyenne dit où sont les valeurs, pas à quel point elles sont étalées : c'est le rôle de l'écart-type."]}
 ]},

 {id:"s2", titre:"L'incertitude-type : évaluation de type A", blocs:[
  {t:"idee", x:"Le résultat d'une mesure n'est pas un nombre seul. C'est une **valeur mesurée** accompagnée de son **incertitude-type**, qui dit de combien cette valeur aurait pu varier si on avait refait toute la mesure."},
  {t:"p", x:"**La valeur mesurée.** Quand on dispose de plusieurs observations, on annonce leur **moyenne** : les écarts vers le haut et vers le bas se compensent en partie. Quand on n'a qu'une observation, c'est elle qu'on annonce."},
  {t:"p", x:"**L'incertitude-type**, notée $u$, est une estimation, sous forme d'écart-type, de l'étalement des valeurs qu'on peut raisonnablement attribuer à la grandeur mesurée. Dit simplement : si quelqu'un refaisait la mesure avec soin, on s'attend à ce que son résultat diffère du nôtre d'environ une incertitude-type. Quand $u$ se calcule à partir d'une série d'observations, comme ici, on parle d'une **évaluation de type A**, c'est-à-dire statistique."},
  {t:"formule", titre:"Évaluation de type A (série de N observations, écart-type s)", x:"une observation seule : $u(x) = s$<br><br>la moyenne des $N$ observations : $u(@m{x}) = @f{s}{@r{N}}$",
   note:"La moyenne de seize observations varie bien moins qu'une observation seule : ses fluctuations se compensent. Mais pas autant qu'on pourrait le croire : avec $16$ observations, l'incertitude est divisée par $@r{16} = 4$, pas par $16$. Pour la diviser par $10$, il faudrait $100$ observations."},
  {t:"exemple", titre:"L'incertitude-type de la masse volumique mesurée à l'éprouvette",
   enonce:"Les seize observations de la section 1, en @u{g/mL}. Quel résultat annoncer, avec quelle incertitude-type ?",
   etapes:[
    {q:"Quelle valeur mesurée annoncer ?", r:"La moyenne des seize observations, à la calculatrice : $@m{ρ} = 0{,}997125$ @u{g/mL}. On l'arrondira à la section 4."},
    {q:"Quel est l'écart-type de la série ?", r:"Touche Sx (ou σn−1) : $s = 0{,}005667$ @u{g/mL}. C'est l'incertitude-type d'**une** observation : un binôme seul aurait dû annoncer environ $0{,}006$ @u{g/mL}."},
    {q:"Quelle est l'incertitude-type de la moyenne ?", r:"$u(@m{ρ}) = @f{s}{@r{16}} = @f{0{,}005667}{4} ≈ 0{,}00142$ @u{g/mL}."},
    {q:"Que veut dire ce nombre ?", r:"Si une autre classe refaisait les seize mesures de la même façon, sa moyenne différerait typiquement de la nôtre d'environ $0{,}0014$ @u{g/mL}. Toute la classe ensemble en sait quatre fois plus qu'un binôme seul."}
   ]},
  {t:"piege", titre:"Incertitude ne veut dire ni faute, ni mauvaise mesure", x:"Une grande incertitude-type ne veut pas dire que la mesure est ratée : elle dit honnêtement ce que la méthode permet. Une mesure **mal faite**, c'est autre chose : une balance qu'on a oublié de tarer, une éprouvette lue de travers, un protocole non respecté. On évite d'ailleurs le mot « précis », trop vague : on dit plutôt qu'une méthode donne une **petite** ou une **grande incertitude-type**."},
  {t:"check", q:"Une série de $25$ observations a un écart-type $s = 0{,}40$ @u{mL}. Que vaut l'incertitude-type de la moyenne ?",
   choix:["$0{,}40$ @u{mL}","$0{,}016$ @u{mL}","$2{,}0$ @u{mL}","$0{,}080$ @u{mL}"], bonne:3,
   expl:["$0{,}40$ @u{mL}, c'est l'incertitude-type d'**une** observation seule. La moyenne de $25$ observations varie moins.",
         "On a divisé par $N = 25$ au lieu de $@r{25} = 5$ : l'incertitude de la moyenne diminue moins vite que ça.",
         "On a multiplié par $@r{25}$ au lieu de diviser : la moyenne de plusieurs observations varie moins qu'une seule, pas plus.",
         "Exact : $u = @f{0{,}40}{@r{25}} = @f{0{,}40}{5} = 0{,}080$ @u{mL}."]}
 ]},

 {id:"s3", titre:"Une seule mesure : évaluation de type B", blocs:[
  {t:"idee", x:"Quand on ne mesure qu'une fois, ou quand l'appareil affiche toujours la même chose, on ne peut pas calculer d'écart-type. On raisonne alors sur l'**instrument** : on encadre la valeur par un intervalle dont on est sûr, et on en déduit l'incertitude-type. C'est l'**évaluation de type B**."},
  {t:"p", x:"Monte sur un pèse-personne : il affiche $71$ @u{kg}. Descends, remonte : encore $71$ @u{kg}, toujours $71$ @u{kg}. La variabilité n'a pas disparu, l'affichage la cache : un poids de $70{,}6$ ou de $71{,}4$ @u{kg} aurait aussi affiché $71$. Le chapitre 2, section 3, partait de la même idée : une mesure n'est jamais plus fine que le plus petit cran de l'instrument."},
  {t:"methode", titre:"Évaluer une incertitude-type de type B", etapes:[
   "**Construire un intervalle** $[m - a ; m + a]$ qui contient à coup sûr la grandeur mesurée ; $m$ est la valeur mesurée, au centre, et $a$ la **demi-étendue**. Trois façons de trouver $a$ : la notice ou l'instrument donne une **tolérance** (« ± … ») ; ou bien c'est ton **jugement** sur la lecture (pour un affichage ou une graduation bien lue, la moitié du dernier cran) ; plus rarement, la notice donne directement l'incertitude-type, et c'est fini.",
   "**Calculer** $u = @f{a}{@r{3}}$, en supposant toutes les valeurs de l'intervalle également possibles.",
   "**Dire le choix fait** : deux personnes peuvent choisir des intervalles un peu différents. Tant que le choix est raisonnable et écrit, c'est correct."],
   exemple:"Une balance au centième affiche $49{,}86$ @u{g} : toute masse entre $49{,}855$ et $49{,}865$ @u{g} afficherait la même chose, donc $a = 0{,}005$ @u{g} et $u = @f{0{,}005}{@r{3}} ≈ 0{,}0029$ @u{g}."},
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
   note:"On suppose que toutes les valeurs de l'intervalle $[m - a ; m + a]$ sont également possibles : l'histogramme serait un rectangle. Son écart-type vaut $@f{a}{@r{3}}$, environ $0{,}58$ fois $a$. L'incertitude-type n'est donc pas $a$ : c'est un écart **typique**, pas l'écart maximal."},
  {t:"tbl", head:["Instrument","Intervalle","Incertitude-type"], rows:[
   ["Balance au centième, affichage $49{,}86$ @u{g}","jugement : $a = 0{,}005$ @u{g}","$@f{0{,}005}{@r{3}} ≈ 0{,}0029$ @u{g}"],
   ["Pipette jaugée gravée « $25$ @u{mL} $± 0{,}030$ @u{mL} »","tolérance gravée : $a = 0{,}030$ @u{mL}","$@f{0{,}030}{@r{3}} ≈ 0{,}017$ @u{mL}"],
   ["Multimètre, calibre $20$ @u{V}, notice « $± (0{,}5$ % $+ 8$ digits) », un digit $= 0{,}01$ @u{V} ; il affiche $4{,}71$ @u{V}","$a = 0{,}005 × 4{,}71 + 8 × 0{,}01 ≈ 0{,}104$ @u{V}","$@f{0{,}005 × 4{,}71 + 8 × 0{,}01}{@r{3}} ≈ 0{,}060$ @u{V}"]
  ]},
  {t:"p", x:"La dernière ligne est la tension à vide de la pile plate du chapitre 10, section 5 : lue sur un tel multimètre, $E = 4{,}71$ @u{V} est connue à $0{,}060$ @u{V} près, typiquement. Le « $8$ digits » compte : sans lui, on trouverait une incertitude-type plus de quatre fois trop petite."},
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
   "**Arrondir l'incertitude-type à deux chiffres significatifs** (au plus proche ; un 5 final s'arrondit vers le haut). Elle-même n'est qu'une estimation : plus de chiffres ne voudraient rien dire.",
   "**Arrondir la valeur mesurée au même rang** : son dernier chiffre tombe à la même position que le dernier chiffre de l'incertitude-type. Au besoin, on ajoute un zéro à droite.",
   "**Écrire** : $ρ = 0{,}9971$ @u{g/mL} et $u(ρ) = 0{,}0014$ @u{g/mL}. On peut aussi écrire $ρ = (0{,}9971 ± 0{,}0014)$ @u{g/mL}, **à condition de préciser** que ce qui suit le ± est l'incertitude-type.",
   "**Dire comment** : « moyenne de $16$ observations, incertitude-type de type A »."],
   exemple:"La pile plate : $E = 4{,}71$ @u{V} et $u = 0{,}0598$ @u{V}. Deux chiffres significatifs pour $u$ : $0{,}060$ @u{V}, qui s'arrête aux millièmes. On écrit donc $E = 4{,}710$ @u{V}, $u(E) = 0{,}060$ @u{V} : le zéro ajouté à $4{,}71$ n'invente rien, il aligne la valeur sur son incertitude."},
  {t:"tbl", head:["Valeur calculée","Incertitude-type calculée","Résultat écrit"], rows:[
   ["$0{,}997125$ @u{g/mL}","$0{,}001417$ @u{g/mL}","$0{,}9971$ @u{g/mL}, $u = 0{,}0014$ @u{g/mL}"],
   ["$4{,}71$ @u{V}","$0{,}0598$ @u{V}","$4{,}710$ @u{V}, $u = 0{,}060$ @u{V}"],
   ["$25$ @u{mL} (pipette)","$0{,}0173$ @u{mL}","$25{,}000$ @u{mL}, $u = 0{,}017$ @u{mL}"],
   ["$623{,}5$ @u{cm^2}","$11{,}3$ @u{cm^2}","$624$ @u{cm^2}, $u = 11$ @u{cm^2}"]
  ]},
  {t:"piege", titre:"Les chiffres en trop font croire à une mesure exacte", x:"Écrire $ρ = 0{,}997125$ @u{g/mL} quand $u = 0{,}0014$ @u{g/mL}, c'est annoncer trois chiffres qui changeraient à la mesure suivante. À l'inverse, ne garder qu'un chiffre pour $u$ peut fausser une comparaison par un arrondi trop brutal : deux chiffres, c'est le bon compromis. Rappel : les zéros de tête ne comptent pas ($0{,}0014$ a deux chiffres significatifs), les zéros de fin comptent ($0{,}060$ en a deux, $4{,}710$ en a quatre)."},
  {t:"check", q:"Un calcul donne $V = 12{,}46667$ @u{mL} et $u(V) = 0{,}02775$ @u{mL}. Quelle écriture respecte les règles ?",
   choix:["$V = 12{,}46667$ @u{mL}, $u = 0{,}028$ @u{mL}","$V = 12{,}467$ @u{mL}, $u = 0{,}028$ @u{mL}","$V = 12{,}47$ @u{mL}, $u = 0{,}028$ @u{mL}","$V = 12{,}467$ @u{mL}, $u = 0{,}02775$ @u{mL}"], bonne:1,
   expl:["L'incertitude est bien arrondie, mais la valeur garde des chiffres sans signification : son dernier chiffre doit tomber aux millièmes, comme celui de $u$.",
         "Exact : $u$ à deux chiffres significatifs, $0{,}028$ @u{mL}, et la valeur arrondie au même rang, $12{,}467$ @u{mL}.",
         "La valeur est arrondie trop tôt, aux centièmes, alors que $u = 0{,}028$ s'arrête aux millièmes.",
         "L'incertitude-type garde quatre chiffres significatifs : on l'arrondit à deux, $0{,}028$ @u{mL}."]}
 ]},

 {id:"s5", titre:"Comparer à une valeur de référence", blocs:[
  {t:"idee", x:"Une **valeur de référence** est obtenue par une méthode bien meilleure que la nôtre : son incertitude est négligeable devant la nôtre. Comparer, c'est regarder si l'écart entre notre résultat et elle est **du même ordre** que notre incertitude-type (les deux sont **compatibles**) ou **bien plus grand** (ils ne le sont pas)."},
  {t:"p", x:"Pourquoi ce critère ? Par définition, l'incertitude-type dit de combien notre résultat aurait pu varier. Si la méthode est bonne, notre valeur tombe à côté de la référence, mais pas plus loin que de l'ordre d'une incertitude-type. Un écart de dix ou de cent incertitudes-types, lui, ne s'explique plus par la variabilité : quelque chose d'autre s'est passé."},
  {t:"tbl", head:["Mesure","Résultat","Référence","Écart","Conclusion"], rows:[
   ["Eau, éprouvette (section 2)","$0{,}9971$ @u{g/mL}, $u = 0{,}0014$","$0{,}9982$ @u{g/mL} (eau pure à $20$ @u{°C})","$0{,}0011$ @u{g/mL}, plus petit que $u$","compatible"],
   ["Eau, bécher (même calcul)","$0{,}9906$ @u{g/mL}, $u = 0{,}0077$","$0{,}9982$ @u{g/mL}","$0{,}0076$ @u{g/mL}, de l'ordre de $u$","compatible, mais bien moins informatif"],
   ["Canette (chapitre 18, section 6)","$13{,}4$ @u{MJ/kg}","$26{,}8$ @u{MJ/kg}","la moitié de la référence","pas compatible"]
  ]},
  {t:"p", x:"Le bécher est compatible lui aussi : son incertitude est grande, et la référence tombe dedans. Être compatible ne veut pas dire être utile : avec le bécher, une eau salée à $1{,}005$ @u{g/mL} serait elle aussi « compatible ». L'éprouvette, cinq fois moins dispersée, permet de les distinguer."},
  {t:"p", x:"**La canette.** Le groupe a pesé au centième de gramme et lu ses températures au dixième de degré. Même en comptant très large (un dixième de gramme sur la masse brûlée, un degré sur l'échauffement), ces lectures ne déplacent le résultat que d'une petite fraction, jamais de moitié. L'écart ne vient donc pas de la variabilité des mesures. Calculer l'incertitude-type du pouvoir calorifique, qui dépend de plusieurs mesures à la fois, est hors programme (voir plus bas) : ici, la comparaison qualitative suffit à conclure."},
  {t:"liste", items:[
   "**Que faire quand ce n'est pas compatible ?** Chercher la cause, parmi trois familles :",
   "**l'incertitude-type a été sous-estimée**, ou une source d'incertitude oubliée ;",
   "**l'expérience n'a pas été réalisée correctement** : un volume lu de travers, une valeur mal recopiée, un rayon mesuré au lieu d'un diamètre ;",
   "**la modélisation est incomplète** : le calcul suppose quelque chose de faux. Pour la canette, il suppose que toute l'énergie libérée chauffe l'eau, alors qu'une grande partie s'échappe dans l'air (chapitre 18, section 6).",
   "Un désaccord n'est pas un échec : il apprend quelque chose sur le montage ou sur le modèle."]},
  {t:"astuce", titre:"Variabilité ou tendance ?", x:"Regarde **comment** les mesures s'écartent du modèle. Sur la caractéristique de la pile plate (chapitre 10, section 5), les points tombent tantôt au-dessus, tantôt au-dessous de la droite, sans ordre : c'est la variabilité. Avec la seringue (chapitre 14, section 3), le produit $P × V$ ne s'agite pas au hasard : il **baisse régulièrement** quand le volume diminue, de $60 780$ à $58 980$ @u{hPa·mL}. Une baisse aussi régulière signale une **modélisation incomplète** : on a oublié l'air enfermé dans le tuyau."},
  {t:"astuce", titre:"Un écart en pourcentage est un repère, pas un critère", x:"On lit parfois « l'écart à la référence est de 3 %, donc c'est bon ». Un pourcentage seul ne dit pas si l'écart est grand **par rapport à l'incertitude-type** : 3 %, c'est énorme pour une mesure à $0{,}1$ % près, et rien du tout pour une mesure au bécher. Ce n'est pas le critère du programme ; c'est l'incertitude-type qui sert de mètre-étalon."},
  {t:"piege", titre:"Hors programme de 1re : vu en Terminale", x:"Deux outils attendent la Terminale, et ne sont **pas** au programme de 1re. Le premier est un **critère chiffré** de compatibilité : en 1re, la comparaison reste qualitative (« du même ordre », « bien plus grand »). Le second est l'**incertitude composée**, celle d'une grandeur calculée à partir de plusieurs mesures qui ont chacune leur incertitude, comme le pouvoir calorifique de la canette. En 1re, on ne combine pas des incertitudes."},
  {t:"check", q:"Un groupe mesure la masse volumique de l'eau : $ρ = 1{,}012$ @u{g/mL}, $u(ρ) = 0{,}0015$ @u{g/mL}. Référence à $20$ @u{°C} : $0{,}9982$ @u{g/mL}. Que conclure ?",
   choix:["Compatible : $1{,}012$ et $0{,}9982$ sont presque égaux","Compatible : l'écart ne fait que 1,4 %","On ne peut rien dire sans refaire la mesure","Pas compatible : l'écart, environ $0{,}014$ @u{g/mL}, vaut une dizaine de fois l'incertitude-type"], bonne:3,
   expl:["« Presque égaux » ne veut rien dire tout seul : il faut comparer l'écart à l'incertitude-type, et ici il est bien plus grand qu'elle.",
         "Un écart en pourcentage n'est pas le critère : c'est l'incertitude-type qui fixe ce qui est « petit ». Ici, l'écart vaut une dizaine d'incertitudes-types.",
         "On peut conclure : l'écart est bien plus grand que l'incertitude-type. Refaire la mesure servira ensuite à chercher la cause.",
         "Exact : $1{,}012 - 0{,}9982 ≈ 0{,}014$ @u{g/mL}, soit environ neuf fois $0{,}0015$. Il faut chercher la cause : une erreur de lecture, une incertitude sous-estimée, ou un liquide qui n'est pas de l'eau pure."]}
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
           {v:0.333, m:"Tu as multiplié par $@r{12}$ au lieu de diviser : la moyenne de douze observations varie moins qu'une seule."}],
     expl:"$u(@m{V}) = @f{s}{@r{12}} = @f{0{,}09614}{@r{12}} ≈ 0{,}0278$ @u{mL}."},
    {q:"Comment écrire le résultat ?",
     choix:["$@m{V} = 12{,}4667$ @u{mL}, $u = 0{,}0278$ @u{mL}","$@m{V} = 12{,}467$ @u{mL}, $u = 0{,}096$ @u{mL}","$@m{V} = 12{,}467$ @u{mL}, $u = 0{,}028$ @u{mL}","$@m{V} = 12{,}5$ @u{mL}, $u = 0{,}028$ @u{mL}"], bonne:2,
     diag:["Trop de chiffres : l'incertitude-type s'arrondit à deux chiffres significatifs, et la valeur au même rang qu'elle.",
           "$0{,}096$ @u{mL} est l'écart-type de la série, l'incertitude d'une observation seule. Le résultat annoncé est la moyenne : son incertitude est $0{,}028$ @u{mL}.",
           "",
           "La valeur est arrondie trop tôt, aux dixièmes : $u = 0{,}028$ s'arrête aux millièmes, la valeur aussi."],
     expl:"$u = 0{,}028$ @u{mL} (deux chiffres significatifs), et la valeur au même rang : $@m{V} = 12{,}467$ @u{mL}, moyenne de douze observations, incertitude-type de type A."},
    {q:"Le résultat est-il compatible avec la valeur attendue $V_{réf} = 12{,}48$ @u{mL} ?",
     choix:["Oui : l'écart, $0{,}013$ @u{mL}, est plus petit que l'incertitude-type","Non : $12{,}467$ n'est pas égal à $12{,}48$","Oui, parce que l'écart est inférieur à 1 %","On ne peut pas savoir sans un treizième titrage"], bonne:0,
     diag:["",
           "Deux valeurs ne sont jamais exactement égales : la question est de savoir si leur écart est grand **par rapport à l'incertitude-type**.",
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
   ["Compatible","L'écart à la référence est du même ordre que l'incertitude-type."]
  ]},
  {t:"piege", titre:"Les quatre erreurs les plus coûteuses", x:"**1. Le mauvais écart-type** : σn (ou σx) divise par $N$ ; celui du cours, Sx ou σn−1, divise par $N - 1$.<br>**2. Le √N oublié, ou mal placé** : l'incertitude de la moyenne est $@f{s}{@r{N}}$, ni $s$, ni $@f{s}{N}$.<br>**3. Trop de chiffres** : $u$ à deux chiffres significatifs, la valeur au même rang.<br>**4. Conclure sur « égal » ou « pas égal »** : deux valeurs ne sont jamais égales ; c'est l'écart comparé à l'incertitude-type qui décide."}
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

 {id:"mi5", niveau:2, type:"num", enonce:"Une pipette jaugée porte l'inscription « $25$ @u{mL} $± 0{,}030$ @u{mL} ». Quelle est l'incertitude-type du volume qu'elle délivre, en @u{mL} ?",
  rep:0.01732, unite:"mL", tol:0.0004,
  diag:[{v:0.03, m:"$0{,}030$ @u{mL} est la tolérance gravée, c'est-à-dire la demi-étendue $a$. L'incertitude-type vaut $@f{a}{@r{3}}$."},
        {v:0.05196, m:"Tu as multiplié par $@r{3}$ au lieu de diviser."},
        {v:0.01, m:"Tu as divisé par $3$ au lieu de $@r{3} ≈ 1{,}73$."}],
  corr:["**Ce qui est gravé** après le ± est la demi-étendue de l'intervalle : $a = 0{,}030$ @u{mL}.",
        "**Type B** : $u = @f{0{,}030}{@r{3}} ≈ 0{,}017$ @u{mL}."],
  indice:"Le « ± » gravé donne la demi-étendue $a$."},

 {id:"mi6", niveau:3, type:"num", enonce:"La notice d'un multimètre indique, sur le calibre $20$ @u{V} : « $± (0{,}5$ % de la valeur affichée $+ 8$ digits) », un digit valant $0{,}01$ @u{V} sur ce calibre. Il affiche $10{,}00$ @u{V}. Quelle est l'incertitude-type de cette mesure, en @u{V} ?",
  rep:0.07506, unite:"V", tol:0.0008,
  diag:[{v:0.13, m:"$0{,}13$ @u{V} est la demi-étendue $a$ que donne la notice. L'incertitude-type vaut $@f{a}{@r{3}}$."},
        {v:0.02887, m:"Tu as oublié les $8$ digits : $a = 0{,}5$ % $× 10{,}00 + 8 × 0{,}01$ @u{V}."},
        {v:0.04619, m:"Tu as oublié les $0{,}5$ % de la valeur affichée : $a = 0{,}005 × 10{,}00 + 8 × 0{,}01$ @u{V}."}],
  corr:["**La demi-étendue** donnée par la notice : $a = 0{,}005 × 10{,}00 + 8 × 0{,}01 = 0{,}05 + 0{,}08 = 0{,}13$ @u{V}.",
        "**Type B** : $u = @f{0{,}13}{@r{3}} ≈ 0{,}075$ @u{V}."],
  indice:"D'abord la demi-étendue $a$ (les deux termes de la notice), puis $u = @f{a}{@r{3}}$."},

 {id:"mi7", niveau:2, type:"qcm", enonce:"Un calcul donne une aire $A = 623{,}5$ @u{cm^2} avec une incertitude-type $u(A) = 11{,}3$ @u{cm^2}. Quelle écriture respecte les règles ?",
  choix:["$A = 624$ @u{cm^2}, $u(A) = 11$ @u{cm^2}","$A = 623{,}5$ @u{cm^2}, $u(A) = 11{,}3$ @u{cm^2}","$A = 620$ @u{cm^2}, $u(A) = 10$ @u{cm^2}","$A = 623{,}5$ @u{cm^2}, $u(A) = 11$ @u{cm^2}"], bonne:0,
  diag:["",
        "L'incertitude-type garde trois chiffres significatifs : on l'arrondit à deux, $11$ @u{cm^2}, et la valeur au même rang.",
        "L'incertitude-type n'a gardé qu'un chiffre significatif : on en garde deux, $11$ @u{cm^2}.",
        "L'incertitude est bien arrondie, mais la valeur garde une décimale : son dernier chiffre doit tomber aux unités, comme celui de $11$."],
  corr:["**L'incertitude-type à deux chiffres significatifs** : $11{,}3$ devient $11$ @u{cm^2}.",
        "**La valeur au même rang**, les unités : $623{,}5$ devient $624$ @u{cm^2} (un 5 final s'arrondit vers le haut).",
        "$A = 624$ @u{cm^2}, $u(A) = 11$ @u{cm^2}."],
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

 {id:"mi9", niveau:2, type:"qcm", enonce:"Une classe mesure la masse volumique de l'eau à $20$ @u{°C} : $ρ = 0{,}9971$ @u{g/mL}, $u(ρ) = 0{,}0014$ @u{g/mL}. La valeur de référence est $0{,}9982$ @u{g/mL}. Que conclure ?",
  choix:["Pas compatible : $0{,}9971$ n'est pas égal à $0{,}9982$","Compatible : l'écart, $0{,}0011$ @u{g/mL}, est plus petit que l'incertitude-type","Compatible, parce que l'écart est inférieur à 1 %","On ne peut pas conclure sans connaître le nombre de binômes"], bonne:1,
  diag:["Deux valeurs ne sont jamais exactement égales : c'est l'écart comparé à l'incertitude-type qui décide.",
        "",
        "La conclusion est juste, mais pas la raison : un pourcentage seul n'est pas le critère, c'est l'incertitude-type qui fixe ce qui est « petit ».",
        "Le nombre de binômes est déjà pris en compte dans l'incertitude-type de la moyenne : on peut conclure."],
  corr:["**L'écart** : $0{,}9982 - 0{,}9971 = 0{,}0011$ @u{g/mL}.",
        "**Comparé à l'incertitude-type** $0{,}0014$ @u{g/mL}, il est plus petit : le résultat est **compatible** avec la référence."],
  indice:"Compare l'écart à l'incertitude-type, pas à zéro."},

 {id:"mi10", niveau:3, type:"qcm", enonce:"Un groupe mesure le pouvoir calorifique de l'éthanol avec une lampe à alcool sous une canette d'eau (chapitre 18, section 6). Pesées au centième de gramme, températures au dixième de degré, calcul juste : il trouve la moitié de la valeur de référence. Quelle est la cause la plus plausible ?",
  choix:["La balance au centième de gramme","Le hasard des mesures : un autre essai donnerait la bonne valeur","La valeur de référence, qui est sans doute fausse","Une modélisation incomplète : toute l'énergie libérée ne chauffe pas l'eau"], bonne:3,
  diag:["Une balance au centième se trompe de quelques centièmes de gramme sur plus d'un gramme brûlé : de quoi déplacer le résultat d'un tout petit peu, pas de moitié.",
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
  indice:"Que vaut l'incertitude-type d'une moyenne, et de quoi dépend-elle ?"}
]
}

]);
