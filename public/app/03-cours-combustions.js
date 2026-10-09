/* =====================================================================
   Programme — Spécialité physique-chimie, classe de Première générale
   Partie « Constitution et transformations de la matière »,
   3. C) Conversion de l'énergie stockée dans la matière organique
   (référentiel .claude/referentiels/physique-1re-spe/, l. 333-362 et 405-420)

   SOURCES DES DONNÉES (à ne pas remplacer par des valeurs de mémoire) :
   - énergies de liaison moyennes (kJ/mol, phase gazeuse) : LibreTexts
     Chemistry, module « Bond Energies », tableau 1 « Average Bond Energies »
     (C–H 413, C–C 347, C–O 358, C=O dans CO2 799, O–H 467, O=O 495) ;
   - contrôle croisé, enthalpies de formation du NIST Chemistry WebBook
     (CO2 −393,52 et H2O gaz −241,83 kJ/mol, Chase 1998 ; méthane −74,87 ;
     propane −104,7, Pittam et Pilcher 1972 ; pentane −146,8, Good 1970 ;
     éthanol gaz −234) : énergies de combustion, eau gazeuse, méthane −802,
     propane −2043, pentane −3272, éthanol −1278 kJ/mol ; la table donne
     −824, −2057, −3290, −1276 (écarts de 3 % au plus) ;
   - pouvoir calorifique de l'éthanol liquide, eau gazeuse : 26,8 MJ/kg,
     à partir de ΔcH°(liquide) = −1367,6 kJ/mol (Chao et Rossini 1965, NIST)
     et de 44,0 kJ/mol de vaporisation de l'eau (NIST, Chase 1998).
   ===================================================================== */
window.COURS = (window.COURS || []).concat([

/* ============= 18. L'ÉNERGIE DES COMBUSTIONS ============= */
{
id:"combustions", n:18, titre:"L'énergie des combustions",
sous:"Rompre coûte, former libère",
desc:"Combustibles usuels, équation de combustion complète, énergie de liaison, énergie molaire de réaction, pouvoir calorifique, mesure en TP, risques et enjeux.",
duree:40,
sections:[
 {id:"s1", titre:"Brûler un combustible", blocs:[
  {t:"idee", x:"Une **combustion** est une transformation chimique entre un **combustible** (ce qui brûle) et un **comburant**, presque toujours le **dioxygène** de l'air. Quand elle est **complète**, un combustible organique (fait de carbone, d'hydrogène et parfois d'oxygène) ne donne que deux produits : du **dioxyde de carbone** $@c{CO_2}$ et de l'**eau** $@c{H_2O}$. Et elle **libère de l'énergie** : c'est pour cela qu'on brûle."},
  {t:"p", x:"Les **combustibles usuels** sont presque tous organiques : le **gaz naturel** (surtout du méthane $@c{CH_4}$) de la cuisinière et de la chaudière ; le **propane** et le **butane** des bouteilles de gaz ; l'**essence** et le **gazole**, mélanges d'alcanes plus longs (l'octane $@c{C_8H_{18}}$ en est un représentant) ; l'**éthanol** (un alcool) des carburants E10 ou E85 et des lampes à alcool ; le **bois**, le **fioul**, le **charbon**. Les alcanes et les alcools ont été présentés au chapitre 7."},
  {t:"p", x:"Pour qu'un feu démarre et continue, il faut trois choses à la fois : un **combustible**, un **comburant** et une **source d'énergie** pour amorcer (une flamme, une étincelle). Retirer l'une des trois éteint le feu : c'est le principe de l'extincteur, qui étouffe la flamme ou la refroidit. Au chapitre 16, on a vu qu'une combustion est une **oxydoréduction** : le dioxygène est l'oxydant, le combustible le réducteur. Ici, on s'intéresse à l'**énergie** qu'elle libère."},
  {t:"check", q:"Dans la flamme d'une cuisinière à gaz, quel est le comburant ?",
   choix:["Le méthane","L'eau","Le dioxyde de carbone","Le dioxygène de l'air"], bonne:3,
   expl:["Le méthane est le combustible : c'est lui qui brûle.",
         "L'eau est un produit de la combustion, pas un réactif.",
         "Le dioxyde de carbone est un produit de la combustion.",
         "Exact : le comburant est le dioxygène, qui réagit avec le combustible."]}
 ]},

 {id:"s2", titre:"Écrire l'équation de combustion complète", blocs:[
  {t:"idee", x:"Pour ajuster l'équation de combustion complète d'un alcane ou d'un alcool, on suit toujours le même ordre : **le carbone**, puis **l'hydrogène**, puis **l'oxygène en dernier**. Si le nombre de dioxygène n'est pas entier, on multiplie tout par 2."},
  {t:"methode", titre:"Ajuster une combustion complète", etapes:[
   "**Écrire le squelette** : combustible + $@c{O_2}$ → $@c{CO_2}$ + $@c{H_2O}$.",
   "**Le carbone** : autant de $@c{CO_2}$ que d'atomes de carbone dans le combustible.",
   "**L'hydrogène** : chaque $@c{H_2O}$ emporte 2 atomes d'hydrogène, donc moitié moins de $@c{H_2O}$ que d'atomes H.",
   "**L'oxygène, en dernier** : compter les atomes O à droite, retirer ceux qu'apporte déjà le combustible (un alcool en a un), et diviser par 2 pour avoir le nombre de $@c{O_2}$. On le règle en dernier parce que $@c{O_2}$ ne contient que de l'oxygène : le changer ne dérègle rien d'autre.",
   "**Des entiers** : si ce nombre est une fraction ($@f{13}{2}$ par exemple), multiplier tous les nombres par 2."
  ], exemple:"Le propane $@c{C_3H_8}$ : 3 C donnent $3 @c{CO_2}$ ; 8 H donnent $4 @c{H_2O}$ ; à droite, $3×2 + 4 = 10$ atomes O, donc $5 @c{O_2}$. $@c{C_3H_8} + 5 @c{O_2} → 3 @c{CO_2} + 4 @c{H_2O}$."},
  {t:"figi", nom:"combustion"},
  {t:"piege", titre:"L'oxygène de l'alcool", x:"Un alcool contient déjà un atome d'oxygène. Pour l'éthanol $@c{C_2H_5OH}$ : à droite, $2 @c{CO_2} + 3 @c{H_2O}$ portent $4 + 3 = 7$ atomes O ; l'éthanol en apporte 1, le dioxygène doit donc en fournir 6, soit $3 @c{O_2}$, et non $@f{7}{2}$. Oublier cet atome est l'erreur la plus fréquente."},
  {t:"check", q:"Combien de molécules de dioxygène faut-il pour brûler complètement une molécule de méthane, $@c{CH_4}$ ?",
   choix:["1","2","4","3"], bonne:1,
   expl:["Avec un seul $@c{O_2}$, il n'y aurait que 2 atomes O à gauche, alors que $@c{CO_2} + 2 @c{H_2O}$ en portent 4.",
         "Exact : $@c{CH_4} + 2 @c{O_2} → @c{CO_2} + 2 @c{H_2O}$ ; 4 atomes O de chaque côté.",
         "4, c'est le nombre d'atomes d'oxygène à fournir. Chaque molécule $@c{O_2}$ en apporte 2 : il en faut 2.",
         "Recompte les atomes O à droite : 2 dans $@c{CO_2}$ et 2 dans $2 @c{H_2O}$, soit 4, donc $2 @c{O_2}$."]}
 ]},

 {id:"s3", titre:"L'énergie de liaison : rompre coûte, former libère", blocs:[
  {t:"idee", x:"Pendant une combustion, des **liaisons sont rompues** dans les réactifs et **d'autres sont formées** dans les produits. **Rompre une liaison coûte de l'énergie** : il faut en fournir. **Former une liaison en libère** : la même quantité, rendue. L'**énergie de liaison** est l'énergie qu'il faut fournir pour rompre une mole de cette liaison, toutes les espèces étant à l'état **gazeux**."},
  {t:"p", x:"Une liaison covalente, c'est un doublet d'électrons que deux atomes se partagent (chapitre 4) : elle les tient ensemble. Pour séparer les deux atomes, il faut tirer, donc fournir de l'énergie, comme pour séparer deux aimants collés. Inversement, quand deux atomes s'unissent, l'énergie est libérée, comme quand les deux aimants se recollent d'un coup. Une liaison est d'autant plus **forte** que son énergie de liaison est grande."},
  {t:"tbl", head:["Liaison","Énergie de liaison (kJ/mol)"], rows:[
   ["C–H","$413$"],
   ["C–C","$347$"],
   ["C–O","$358$"],
   ["O–H","$467$"],
   ["O=O (dioxygène)","$495$"],
   ["C=O (dans $@c{CO_2}$)","$799$"]
  ]},
  {t:"p", x:"Ces valeurs sont des **moyennes** (table « Average Bond Energies » de LibreTexts Chemistry) : une liaison C–H n'a pas exactement la même énergie dans le méthane et dans l'éthanol. Les calculs qui les utilisent sont donc des **estimations**, à quelques pour cent près."},
  {t:"piege", titre:"Pourquoi « à l'état gazeux » ?", x:"Les énergies de liaison ne comptent que les liaisons **à l'intérieur** des molécules. Dans un liquide, les molécules sont en plus retenues les unes aux autres (les interactions du chapitre 5) : passer de l'eau gazeuse à l'eau liquide libère encore de l'énergie, que les liaisons ne comptent pas. La méthode ne vaut donc que si **toutes les espèces sont gazeuses**. Dans ce chapitre, l'eau produite est toujours notée $@c{H_2O}$(g), à l'état de vapeur."}
 ]},

 {id:"s4", titre:"L'énergie molaire de réaction", blocs:[
  {t:"idee", x:"L'**énergie molaire de réaction** $E_r$ est l'énergie mise en jeu quand la réaction se fait une fois « par mole ». On l'estime à partir des énergies de liaison : **ce que coûtent les ruptures, moins ce que libèrent les formations**. Si elle est **négative**, la réaction **libère** de l'énergie : c'est le cas de toutes les combustions."},
  {t:"formule", titre:"Énergie molaire de réaction (espèces gazeuses)",
   x:"$E_r = $ (somme des énergies des liaisons **rompues**) $-$ (somme des énergies des liaisons **formées**)",
   note:"$E_r$ en @u{kJ/mol}, comptée ici **pour une mole de combustible**. Négative : la réaction libère de l'énergie (exothermique) ; positive : elle en consomme (endothermique). Chaque liaison est comptée **autant de fois qu'elle apparaît**, en tenant compte des coefficients de l'équation."},
  {t:"figi", nom:"bilan-liaisons"},
  {t:"exemple", titre:"Exemple guidé — la combustion du méthane", enonce:"Estimer l'énergie molaire de la réaction $@c{CH_4}$(g) $+ 2 @c{O_2}$(g) $→ @c{CO_2}$(g) $+ 2 @c{H_2O}$(g), à l'aide du tableau de la section 3.", etapes:[
   {q:"Les liaisons rompues", r:"Dans $@c{CH_4}$ : 4 liaisons C–H, soit $4 × 413 = 1652$ @u{kJ}. Dans $2 @c{O_2}$ : 2 liaisons O=O, soit $2 × 495 = 990$ @u{kJ}. Total : $1652 + 990 = 2642$ @u{kJ}, à **fournir**."},
   {q:"Les liaisons formées", r:"Dans $@c{CO_2}$ (O=C=O) : 2 liaisons C=O, soit $2 × 799 = 1598$ @u{kJ}. Dans $2 @c{H_2O}$ : $2 × 2 = 4$ liaisons O–H, soit $4 × 467 = 1868$ @u{kJ}. Total : $1598 + 1868 = 3466$ @u{kJ}, **libérés**."},
   {q:"Le bilan", r:"$E_r = 2642 - 3466 = -824$ @u{kJ/mol}. Négatif : la combustion du méthane libère environ $824$ @u{kJ} par mole de méthane brûlé."},
   {q:"Le contrôle", r:"La valeur mesurée (calculée à partir des données du NIST, eau gazeuse) est $-802$ @u{kJ/mol}. L'écart, environ 3 %, vient de ce que les énergies de liaison sont des moyennes. La méthode donne le bon ordre de grandeur et le bon signe."}
  ]},
  {t:"piege", titre:"Le signe et le sens du bilan", x:"On écrit toujours **rompues moins formées**. L'écrire à l'envers (formées moins rompues) donne $+824$ @u{kJ/mol} : une combustion qui consommerait de l'énergie, ce qui est absurde, puisqu'on brûle du gaz pour se chauffer. Le **contrôle de bon sens** est immédiat : une combustion a toujours un $E_r$ **négatif**. Et chaque molécule compte avec ses coefficients : $2 @c{O_2}$, c'est 2 liaisons O=O, et un $@c{CO_2}$ contient **deux** liaisons C=O."},
  {t:"check", q:"Pour une réaction, les liaisons rompues coûtent $3000$ @u{kJ} et les liaisons formées libèrent $3600$ @u{kJ}, par mole. Que vaut $E_r$ ?",
   choix:["$+600$ @u{kJ/mol}","$-600$ @u{kJ/mol}","$+6600$ @u{kJ/mol}","$-6600$ @u{kJ/mol}"], bonne:1,
   expl:["C'est formées moins rompues : le signe est inversé. On écrit rompues moins formées.",
         "Exact : $3000 - 3600 = -600$ @u{kJ/mol}. Plus d'énergie libérée que coûtée : la réaction est exothermique.",
         "On ne fait pas la somme : on retranche ce que libèrent les formations de ce que coûtent les ruptures.",
         "On ne fait pas la somme : $3000 - 3600$, pas $-(3000 + 3600)$."]}
 ]},

 {id:"s5", titre:"Pouvoir calorifique et énergie libérée", blocs:[
  {t:"idee", x:"Trois grandeurs, trois unités : l'**énergie molaire de réaction** $E_r$, en @u{J/mol} (par mole de combustible) ; le **pouvoir calorifique** $PC$, en @u{J/kg}, l'énergie libérée par **un kilogramme** de combustible ; l'**énergie libérée** $Q$, en @u{J}, pour la quantité réellement brûlée. Pour passer de l'une à l'autre, on utilise la **masse molaire** $M$."},
  {t:"formule", titre:"Des moles aux kilogrammes",
   x:"$PC = @f{|E_r|}{M}$ &nbsp;&nbsp;et&nbsp;&nbsp; $Q = n × |E_r| = m × PC$",
   note:"Avec $E_r$ en @u{kJ/mol} et $M$ en @u{g/mol}, $@f{|E_r|}{M}$ est en @u{kJ/g}, ce qui est la même chose que des @u{MJ/kg} (on multiplie le haut et le bas par 1000). $n = @f{m}{M}$ est la quantité de combustible brûlée. $Q$ et $PC$ sont **positifs** : ce sont des énergies libérées ; le signe n'est porté que par $E_r$."},
  {t:"tbl", head:["Combustible (gaz)","$E_r$ par les liaisons (kJ/mol)","$M$ (g/mol)","$PC$ calculé (MJ/kg)","$PC$ de référence (MJ/kg)"], rows:[
   ["méthane","$-824$","$16{,}0$","$51{,}5$","$50{,}0$"],
   ["propane","$-2057$","$44{,}0$","$46{,}8$","$46{,}3$"],
   ["éthanol","$-1276$","$46{,}0$","$27{,}7$","$27{,}8$"]
  ]},
  {t:"p", x:"La dernière colonne est calculée à partir des données du NIST (eau gazeuse) : les estimations par les liaisons tombent à 3 % près. L'éthanol libère près de deux fois moins d'énergie par kilogramme que le méthane : sa molécule contient déjà un atome d'oxygène, elle est en quelque sorte « déjà un peu brûlée ». C'est pour cela qu'un réservoir d'E85 se vide plus vite qu'un réservoir d'essence."},
  {t:"exemple", titre:"Exemple guidé — l'énergie d'une bouteille de propane", enonce:"Une bouteille de camping contient $500$ @u{g} de propane. Quelle énergie libère sa combustion complète ? On prend $E_r = -2057$ @u{kJ/mol} et $M(@c{C_3H_8}) = 44{,}0$ @u{g/mol}.", etapes:[
   {q:"La quantité de propane", r:"$n = @f{m}{M} = @f{500}{44{,}0} ≈ 11{,}4$ @u{mol}."},
   {q:"L'énergie libérée", r:"$Q = n × |E_r|$, calculée d'un seul coup : $Q = @f{500}{44{,}0} × 2057 ≈ 2{,}34 × 10^4$ @u{kJ}, soit environ $23$ @u{MJ}."},
   {q:"Par le pouvoir calorifique", r:"$PC = @f{2057}{44{,}0} ≈ 46{,}8$ @u{MJ/kg}, et $Q = 0{,}500 × 46{,}8 ≈ 23$ @u{MJ}. Les deux chemins donnent la même chose."}
  ]},
  {t:"piege", titre:"Les unités", x:"$@f{|E_r|}{M}$ avec $E_r$ en @u{kJ/mol} et $M$ en @u{g/mol} donne des @u{kJ/g}, c'est-à-dire des @u{MJ/kg} : **aucune conversion à faire**. Le piège classique est d'en faire une de trop (diviser ou multiplier par 1000) ou de multiplier par $M$ au lieu de diviser."}
 ]},

 {id:"s6", titre:"Atelier — mesurer le pouvoir calorifique de l'éthanol", blocs:[
  {t:"p", x:"Au laboratoire, on brûle de l'éthanol dans une **lampe à alcool** placée sous une **canette** en aluminium contenant de l'eau. On pèse la lampe avant et après, on mesure l'échauffement de l'eau. L'énergie reçue par l'eau se calcule avec $Q = m_{eau} × c × Δθ$, où $c = 4{,}18$ @u{J/(g·°C)} est la capacité thermique massique de l'eau (l'énergie qu'il faut pour chauffer 1 @u{g} d'eau de 1 @u{°C})."},
  {t:"atelier", titre:"Une lampe à alcool sous une canette",
   enonce:"Mesures d'un groupe : $200$ @u{g} d'eau dans la canette, température initiale $18{,}0$ @u{°C}, température finale $38{,}0$ @u{°C}. La lampe pèse $152{,}40$ @u{g} avant et $151{,}15$ @u{g} après. Valeur de référence pour l'éthanol liquide : $PC = 26{,}8$ @u{MJ/kg}.",
   etapes:[
    {q:"Quelle énergie l'eau a-t-elle reçue, en @u{kJ} ?",
     rep:16.72, tol:0.1,
     aide:"$Q = m_{eau} × c × Δθ$, avec $Δθ = 38{,}0 - 18{,}0$. Le résultat sort en joules.",
     diag:[{v:16720, m:"C'est bien $Q$, mais en **joules**. La question demande des kilojoules : divise par 1000."},
           {v:31.77, m:"Tu as pris la température finale $38{,}0$ @u{°C} au lieu de l'**échauffement** $Δθ = 38{,}0 - 18{,}0 = 20{,}0$ @u{°C}."},
           {v:0.836, m:"Tu as oublié de multiplier par l'échauffement $Δθ = 20{,}0$ @u{°C}."}],
     expl:"$Q = 200 × 4{,}18 × 20{,}0 = 16\ 720$ @u{J}, soit $16{,}7$ @u{kJ}."},
    {q:"Quelle masse d'éthanol a brûlé, en @u{g} ?",
     rep:1.25, tol:0.01,
     aide:"Différence des deux pesées de la lampe.",
     diag:[{v:303.55, m:"On ne fait pas la somme des deux pesées : la masse brûlée, c'est ce que la lampe a **perdu**."}],
     expl:"$152{,}40 - 151{,}15 = 1{,}25$ @u{g} d'éthanol brûlé."},
    {q:"Quel pouvoir calorifique ce groupe mesure-t-il, en @u{MJ/kg} ?",
     rep:13.38, tol:0.15,
     aide:"$PC = @f{Q}{m}$ ; en @u{kJ/g}, c'est directement des @u{MJ/kg}.",
     diag:[{v:0.01338, m:"Des @u{kJ/g}, c'est déjà des @u{MJ/kg} : il n'y a rien à convertir. Tu as divisé par 1000 de trop."},
           {v:13376, m:"Tu as gardé $Q$ en joules : $16\ 720$ @u{J} ÷ $1{,}25$ @u{g} = $13\ 376$ @u{J/g}, soit $13{,}4$ @u{kJ/g}, c'est-à-dire $13{,}4$ @u{MJ/kg}."},
           {v:20.9, m:"Tu as multiplié par $1{,}25$ au lieu de diviser : $PC = @f{Q}{m}$."}],
     expl:"$PC = @f{16{,}72}{1{,}25} ≈ 13{,}4$ @u{kJ/g}, soit $13{,}4$ @u{MJ/kg}. C'est **la moitié** de la valeur de référence ($26{,}8$ @u{MJ/kg}) : un résultat tout à fait habituel en TP."},
    {q:"D'où vient surtout l'écart avec la valeur de référence ?",
     choix:["La balance est mal réglée","L'énergie libérée ne va pas toute dans l'eau, et une partie n'est même pas libérée","L'éthanol de la lampe est un autre alcool","L'eau a gelé pendant l'expérience"], bonne:1,
     diag:["Une balance au centième de gramme se trompe de quelques centièmes, pas de moitié.",
           "",
           "Rien ne l'indique : c'est bien de l'éthanol, et un autre combustible ne diviserait pas le résultat par deux à coup sûr.",
           "L'eau est passée de $18$ à $38$ @u{°C} : elle n'a pas gelé."],
     expl:"Plusieurs fuites d'énergie, toutes réelles : les **gaz chauds** de la flamme montent le long de la canette et s'échappent dans l'air sans la toucher ; la flamme **rayonne** dans toutes les directions ; la **canette** et le thermomètre sont chauffés eux aussi ; l'eau chaude **cède déjà de la chaleur** à l'air pendant la mesure ; un peu d'éthanol **s'évapore** de la mèche sans brûler. Enfin, la flamme est **jaune** : ce jaune vient de grains de carbone (de la suie) qui n'ont pas brûlé et qui noircissent le fond de la canette. La combustion est **incomplète**, et l'énergie de ce carbone n'est jamais libérée."}
   ],
   bilan:"Mesurer un pouvoir calorifique avec une canette donne typiquement **la moitié ou moins** de la valeur de référence. Le calcul est juste ; c'est le montage qui laisse fuir l'énergie. Pour s'approcher de la valeur vraie, il faudrait un calorimètre qui enferme la flamme et récupère toute la chaleur."},
  {t:"astuce", titre:"Sécurité", x:"Lunettes, cheveux attachés, lampe à alcool sur un support stable, flacon d'éthanol **fermé et éloigné** de toute flamme (ses vapeurs s'enflamment facilement). Ne jamais remplir une lampe allumée ou encore chaude. La canette chauffée se manipule avec une pince."}
 ]},

 {id:"s7", titre:"Applications, risques et enjeux", blocs:[
  {t:"idee", x:"Les combustions chauffent nos logements, font tourner les moteurs et une partie des centrales électriques. Elles ont deux revers : un danger domestique bien réel, le **monoxyde de carbone**, et les **émissions de dioxyde de carbone**, qui modifient le climat."},
  {t:"p", x:"**La combustion incomplète.** Quand le dioxygène manque (une chaudière mal réglée, une pièce mal aérée, une flamme jaune), une partie du carbone ne devient pas du $@c{CO_2}$ : il reste du **carbone** (la suie, qui noircit) et il se forme du **monoxyde de carbone** $@c{CO}$."},
  {t:"piege", titre:"Le monoxyde de carbone : le danger qu'on ne sent pas", x:"Le monoxyde de carbone est **invisible, inodore et n'irrite pas** : rien ne prévient. Dans le sang, il prend la place du dioxygène sur l'hémoglobine et s'y fixe bien plus fortement que lui : le corps manque d'oxygène. Les **signes** : maux de tête, nausées, vertiges, fatigue, somnolence, souvent chez plusieurs personnes du même logement en même temps. **En cas de doute** : ouvrir les fenêtres, arrêter les appareils à combustion, sortir, et appeler les secours (le 112, le 15 ou le 18). **Pour prévenir** : un **détecteur de monoxyde de carbone**, l'entretien chaque année de la chaudière et du chauffe-eau par un professionnel, ne jamais boucher les aérations, et ne jamais utiliser à l'intérieur un barbecue, un brasero ou un groupe électrogène."},
  {t:"p", x:"**Les ressources et le climat.** Brûler un combustible **fossile** (gaz naturel, pétrole, charbon) libère du carbone qui était enfoui depuis des millions d'années : il s'ajoute au $@c{CO_2}$ de l'atmosphère et renforce l'effet de serre. Les recherches actuelles suivent plusieurs axes : des **carburants agro-sourcés** (le bioéthanol tiré de la betterave ou du blé) ou issus de déchets, comme le **biogaz** produit par la **méthanisation** des déchets agricoles et alimentaires ; un meilleur **rendement** des moteurs et des chaudières, pour brûler moins à service égal ; le **captage** du $@c{CO_2}$ à la sortie des grandes installations ; des combustibles sans carbone, comme le **dihydrogène**, dont la combustion ne donne que de l'eau."},
  {t:"astuce", titre:"Agro-sourcé ne veut pas dire « sans impact »", x:"Le $@c{CO_2}$ libéré par le bioéthanol a été prélevé dans l'air par les plantes quelques mois plus tôt : le cycle est **court**. Mais cultiver, récolter, transporter et transformer ces plantes consomme aussi de l'énergie, souvent fossile, et occupe des terres. Le bilan est meilleur que celui de l'essence, sans être nul. De même, le dihydrogène n'est « propre » que si on le fabrique sans énergie fossile."},
  {t:"check", q:"Pourquoi le monoxyde de carbone est-il si dangereux dans un logement ?",
   choix:["Parce qu'on ne peut ni le voir ni le sentir","Parce qu'il sent très fort et irrite les yeux","Parce qu'il explose au contact de l'eau","Parce qu'il colore l'air en gris"], bonne:0,
   expl:["Exact : il est invisible, inodore et non irritant. Seul un détecteur le signale.",
         "C'est l'inverse : il n'a aucune odeur et n'irrite pas, c'est ce qui le rend traître.",
         "Ce n'est pas son danger : il empêche le sang de transporter le dioxygène.",
         "Il est invisible. La fumée grise vient de la suie, pas du monoxyde de carbone."]}
 ]},

 {id:"s8", titre:"Récapitulatif", blocs:[
  {t:"idee", x:"Une combustion complète transforme un combustible et du dioxygène en $@c{CO_2}$ et en eau. Elle **libère** de l'énergie parce que les liaisons **formées** dans les produits sont plus fortes que les liaisons **rompues** dans les réactifs : former libère plus que rompre ne coûte."},
  {t:"tbl", head:["La question ressemble à…","Ce qu'il faut faire"], rows:[
   ["« Écrire l'équation de combustion »","Carbone, puis hydrogène, puis oxygène en dernier (sans oublier l'O d'un alcool) ; multiplier par 2 si une fraction reste"],
   ["« Estimer l'énergie molaire de réaction »","Tout gazeux ; $E_r$ = rompues − formées, chaque liaison comptée avec les coefficients ; contrôle : négatif pour une combustion"],
   ["« Pouvoir calorifique »","$PC = @f{|E_r|}{M}$ ; des @u{kJ/g} sont des @u{MJ/kg}"],
   ["« Énergie libérée par une masse $m$ »","$Q = @f{m}{M} × |E_r|$, ou $Q = m × PC$"],
   ["« Mesure en TP »","$Q = m_{eau} × c × Δθ$, puis $PC = @f{Q}{m}$ ; s'attendre à beaucoup moins que la référence, et savoir dire pourquoi"]
  ]},
  {t:"piege", titre:"Les trois erreurs les plus coûteuses", x:"**1. Le bilan à l'envers** : formées − rompues donne un $E_r$ positif pour une combustion, ce qui est absurde.<br>**2. Les liaisons mal comptées** : oublier les coefficients ($2 @c{O_2}$, c'est 2 liaisons O=O), oublier qu'un $@c{CO_2}$ a deux liaisons C=O, oublier l'oxygène de l'alcool.<br>**3. Une conversion de trop** : des @u{kJ/g} sont déjà des @u{MJ/kg}."}
 ]}
],
exos:[
 {id:"cb1", niveau:1, type:"qcm", enonce:"Parmi ces espèces, laquelle n'est pas un combustible ?",
  choix:["Le butane","L'éthanol","Le dioxygène","Le bois"], bonne:2,
  diag:["Le butane des bouteilles de gaz est un combustible : il brûle.",
        "L'éthanol est un combustible : il brûle dans une lampe à alcool ou dans un moteur.",
        "",
        "Le bois est un combustible : il brûle dans une cheminée."],
  corr:["**Le combustible** est ce qui brûle ; le **comburant** est ce qui le fait brûler.",
        "Le **dioxygène** est le comburant de toutes ces combustions : il ne brûle pas lui-même."],
  indice:"Une combustion demande deux réactifs : lequel n'est pas ce qui brûle ?"},

 {id:"cb2", niveau:1, type:"num", enonce:"On ajuste l'équation de combustion complète du propane : $@c{C_3H_8} + … @c{O_2} → … @c{CO_2} + … @c{H_2O}$. Quel nombre faut-il placer devant $@c{O_2}$ ?",
  rep:5, tol:0.1,
  diag:[{v:10, m:"$10$ est le nombre d'**atomes** d'oxygène à fournir. Chaque molécule $@c{O_2}$ en apporte 2 : il en faut $5$."},
        {v:3, m:"$3$ est le nombre devant $@c{CO_2}$ (un par atome de carbone). Il reste à compter tous les atomes O à droite."},
        {v:7, m:"Recompte les atomes O à droite : $3 @c{CO_2}$ en portent 6 et $4 @c{H_2O}$ en portent 4, soit 10, donc $5 @c{O_2}$."}],
  corr:["**Le carbone** : 3 atomes, donc $3 @c{CO_2}$.",
        "**L'hydrogène** : 8 atomes, donc $4 @c{H_2O}$.",
        "**L'oxygène** : à droite, $3 × 2 + 4 = 10$ atomes, donc $5 @c{O_2}$. $@c{C_3H_8} + 5 @c{O_2} → 3 @c{CO_2} + 4 @c{H_2O}$."],
  indice:"Carbone, puis hydrogène, puis oxygène en dernier."},

 {id:"cb3", niveau:2, type:"num", enonce:"Combustion complète de l'éthanol : $@c{C_2H_5OH} + … @c{O_2} → 2 @c{CO_2} + 3 @c{H_2O}$. Quel nombre faut-il placer devant $@c{O_2}$ ?",
  rep:3, tol:0.1,
  diag:[{v:3.5, m:"Tu as oublié l'atome d'oxygène que l'éthanol apporte déjà. À droite, 7 atomes O ; l'éthanol en fournit 1, le dioxygène doit donc en fournir 6 : $3 @c{O_2}$."},
        {v:7, m:"$7$ est le nombre d'atomes O à droite. Retire celui de l'éthanol, puis divise par 2 : $3 @c{O_2}$."},
        {v:6, m:"$6$ est le nombre d'atomes O que doit fournir le dioxygène. Chaque $@c{O_2}$ en apporte 2 : il en faut 3."}],
  corr:["**À droite** : $2 @c{CO_2}$ portent 4 atomes O, $3 @c{H_2O}$ en portent 3, soit 7.",
        "**L'éthanol en apporte déjà 1** : le dioxygène doit en fournir $7 - 1 = 6$.",
        "**Donc $3 @c{O_2}$** : $@c{C_2H_5OH} + 3 @c{O_2} → 2 @c{CO_2} + 3 @c{H_2O}$."],
  indice:"Un alcool contient déjà un atome d'oxygène."},

 {id:"cb4", niveau:2, type:"qcm", enonce:"Quelle est l'équation correctement ajustée, avec des nombres entiers, de la combustion complète du butane $@c{C_4H_{10}}$ ?",
  choix:["$2 @c{C_4H_{10}} + 13 @c{O_2} → 8 @c{CO_2} + 10 @c{H_2O}$","$@c{C_4H_{10}} + 13 @c{O_2} → 4 @c{CO_2} + 5 @c{H_2O}$","$@c{C_4H_{10}} + 6 @c{O_2} → 4 @c{CO_2} + 5 @c{H_2O}$","$2 @c{C_4H_{10}} + 13 @c{O_2} → 8 @c{CO_2} + 5 @c{H_2O}$"], bonne:0,
  diag:["",
        "Compte les atomes O : 26 à gauche, $8 + 5 = 13$ à droite. Le 13 est le nombre d'atomes O à fournir, pas de molécules.",
        "Compte les atomes O : 12 à gauche, 13 à droite. Il faudrait $@f{13}{2} @c{O_2}$, d'où la multiplication par 2.",
        "Compte les atomes H : 20 à gauche, 10 à droite. Après la multiplication par 2, il faut $10 @c{H_2O}$."],
  corr:["**Pour une molécule** : 4 C donnent $4 @c{CO_2}$, 10 H donnent $5 @c{H_2O}$ ; à droite, $8 + 5 = 13$ atomes O, donc $@f{13}{2} @c{O_2}$.",
        "**On multiplie tout par 2** : $2 @c{C_4H_{10}} + 13 @c{O_2} → 8 @c{CO_2} + 10 @c{H_2O}$.",
        "**On vérifie** : 8 C, 20 H et 26 O de chaque côté."],
  indice:"Ajuste pour une molécule, puis fais disparaître la fraction."},

 {id:"cb5", niveau:1, type:"qcm", enonce:"Que se passe-t-il, du point de vue de l'énergie, quand on rompt une liaison covalente ?",
  choix:["Elle libère de l'énergie","Il faut fournir de l'énergie","Aucune énergie n'est mise en jeu","Cela dépend de la liaison : certaines en libèrent"], bonne:1,
  diag:["C'est la **formation** d'une liaison qui libère de l'énergie. La rompre en coûte.",
        "",
        "Une liaison tient deux atomes ensemble : pour les séparer, il faut fournir de l'énergie.",
        "Rompre une liaison coûte toujours de l'énergie, quelle qu'elle soit ; seule la quantité change."],
  corr:["**Rompre coûte** : il faut fournir l'énergie de liaison pour séparer les deux atomes.",
        "**Former libère** : la même énergie est rendue quand la liaison se forme."],
  indice:"Pense à deux aimants collés qu'on sépare."},

 {id:"cb6", niveau:2, type:"num", unite:"kJ/mol", enonce:"Estimer l'énergie molaire de la réaction $@c{CH_4}$(g) $+ 2 @c{O_2}$(g) $→ @c{CO_2}$(g) $+ 2 @c{H_2O}$(g), en @u{kJ/mol}. Énergies de liaison (@u{kJ/mol}) : C–H $413$ ; O=O $495$ ; C=O (dans $@c{CO_2}$) $799$ ; O–H $467$.",
  rep:-824, tol:5,
  diag:[{v:824, m:"Le signe est inversé : tu as fait formées − rompues. On écrit **rompues − formées** ; une combustion libère de l'énergie, son $E_r$ est négatif."},
        {v:-1814, m:"Tu as oublié de rompre les liaisons O=O du dioxygène : $2 × 495 = 990$ @u{kJ} à ajouter aux ruptures."},
        {v:-1319, m:"Tu as compté une seule liaison O=O. Il y a **deux** molécules $@c{O_2}$, donc deux liaisons O=O : $2 × 495$."},
        {v:-25, m:"Une molécule $@c{CO_2}$ (O=C=O) contient **deux** liaisons C=O : $2 × 799 = 1598$ @u{kJ}, et non $799$."}],
  corr:["**Rompues** : $4 × 413 + 2 × 495 = 1652 + 990 = 2642$ @u{kJ}.",
        "**Formées** : $2 × 799 + 4 × 467 = 1598 + 1868 = 3466$ @u{kJ}.",
        "**Bilan** : $E_r = 2642 - 3466 = -824$ @u{kJ/mol}. Négatif, comme toute combustion."],
  indice:"Fais deux listes : liaisons rompues, liaisons formées, avec les coefficients."},

 {id:"cb7", niveau:3, type:"num", unite:"kJ/mol", enonce:"Estimer l'énergie molaire de la combustion de l'éthanol gazeux : $@c{C_2H_5OH}$(g) $+ 3 @c{O_2}$(g) $→ 2 @c{CO_2}$(g) $+ 3 @c{H_2O}$(g), en @u{kJ/mol}. L'éthanol contient 5 liaisons C–H, 1 liaison C–C, 1 liaison C–O et 1 liaison O–H. Énergies de liaison (@u{kJ/mol}) : C–H $413$ ; C–C $347$ ; C–O $358$ ; O–H $467$ ; O=O $495$ ; C=O (dans $@c{CO_2}$) $799$.",
  rep:-1276, tol:5,
  diag:[{v:1276, m:"Le signe est inversé : on écrit rompues − formées. Une combustion a un $E_r$ négatif."},
        {v:-1743, m:"Tu as oublié de rompre la liaison O–H de l'éthanol ($467$ @u{kJ}). Toutes les liaisons du combustible sont rompues."},
        {v:-2761, m:"Tu as oublié de rompre les trois liaisons O=O du dioxygène : $3 × 495 = 1485$ @u{kJ}."}],
  corr:["**Rompues** : $5 × 413 + 347 + 358 + 467 + 3 × 495 = 2065 + 347 + 358 + 467 + 1485 = 4722$ @u{kJ}.",
        "**Formées** : $4 × 799$ (deux $@c{CO_2}$, deux C=O chacun) $+ 6 × 467$ (trois $@c{H_2O}$, deux O–H chacune) $= 3196 + 2802 = 5998$ @u{kJ}.",
        "**Bilan** : $E_r = 4722 - 5998 = -1276$ @u{kJ/mol}. La valeur de référence est $-1278$ @u{kJ/mol} : l'estimation est excellente ici."],
  indice:"Toutes les liaisons de l'éthanol sont rompues, y compris O–H et C–O."},

 {id:"cb8", niveau:2, type:"num", unite:"MJ/kg", enonce:"La combustion du méthane a une énergie molaire de réaction $E_r = -824$ @u{kJ/mol}, et $M(@c{CH_4}) = 16{,}0$ @u{g/mol}. Quel est son pouvoir calorifique, en @u{MJ/kg} ?",
  rep:51.5, tol:0.3,
  diag:[{v:13184, m:"Tu as multiplié par la masse molaire. Le pouvoir calorifique est une énergie **par kilogramme** : on **divise** par $M$."},
        {v:0.0515, m:"$@f{824}{16{,}0} = 51{,}5$ @u{kJ/g}, et des @u{kJ/g} sont **déjà** des @u{MJ/kg}. Tu as divisé par 1000 de trop."},
        {v:51500, m:"$51{,}5$ @u{kJ/g} font $51{,}5$ @u{MJ/kg}, pas $51\ 500$ : multiplier le haut et le bas par 1000 ne change pas le nombre."}],
  corr:["**La formule** : $PC = @f{|E_r|}{M} = @f{824}{16{,}0} = 51{,}5$ @u{kJ/g}.",
        "**Les unités** : 1 @u{kJ/g} = 1000 @u{kJ} pour 1000 @u{g}, c'est 1 @u{MJ/kg}. Donc $PC = 51{,}5$ @u{MJ/kg}.",
        "**Le contrôle** : la valeur de référence est $50{,}0$ @u{MJ/kg} ; l'écart de 3 % vient des énergies de liaison moyennes."],
  indice:"Une énergie par kilogramme : on divise par la masse molaire."},

 {id:"cb9", niveau:3, type:"num", unite:"kJ", enonce:"Quelle énergie libère la combustion complète de $10{,}0$ @u{g} de propane ? On prend $E_r = -2057$ @u{kJ/mol} et $M(@c{C_3H_8}) = 44{,}0$ @u{g/mol}. Réponds en @u{kJ}.",
  rep:467.5, tol:2,
  diag:[{v:20570, m:"Tu as multiplié l'énergie molaire par la **masse**. Il faut d'abord la quantité de matière : $n = @f{m}{M}$."},
        {v:2057, m:"C'est l'énergie libérée par **une mole** de propane. Ici on n'en brûle que $@f{10{,}0}{44{,}0} ≈ 0{,}227$ @u{mol}."},
        {v:0.4675, m:"Le résultat est en @u{MJ}. La question demande des @u{kJ} : $Q ≈ 468$ @u{kJ}."}],
  corr:["**La quantité de propane** : $n = @f{10{,}0}{44{,}0} ≈ 0{,}227$ @u{mol}.",
        "**L'énergie libérée**, calculée d'un seul coup : $Q = @f{10{,}0}{44{,}0} × 2057 ≈ 468$ @u{kJ}.",
        "**Positive** : $Q$ est une énergie libérée ; le signe négatif reste porté par $E_r$."],
  indice:"Passe par la quantité de matière."},

 {id:"cb10", niveau:2, type:"qcm", enonce:"Pourquoi précise-t-on « eau à l'état gazeux » quand on estime une énergie de combustion avec les énergies de liaison ?",
  choix:["Parce que la flamme est trop chaude pour de l'eau liquide","Parce que l'eau liquide n'a pas de liaisons O–H","Pour simplifier le calcul de la masse molaire","Parce que la méthode ne compte que les liaisons internes, valable pour des gaz"], bonne:3,
  diag:["La température de la flamme ne change pas la méthode : c'est l'état des espèces dans le bilan qui compte.",
        "Une molécule d'eau a deux liaisons O–H, qu'elle soit liquide ou gazeuse.",
        "La masse molaire de l'eau est la même dans les deux états.",
        ""],
  corr:["**Les énergies de liaison** ne comptent que les liaisons à l'intérieur des molécules.",
        "**Dans un liquide**, les molécules sont aussi retenues entre elles : passer de la vapeur au liquide libère encore de l'énergie, que la méthode ignore.",
        "**Elle ne vaut donc que pour des espèces gazeuses** : l'eau produite doit être $@c{H_2O}$(g)."],
  indice:"Qu'est-ce qui retient les molécules d'eau entre elles dans un liquide ?"},

 {id:"cb11", niveau:3, type:"num", unite:"MJ/kg", enonce:"Un groupe chauffe $250$ @u{g} d'eau de $16{,}0$ @u{°C} à $31{,}0$ @u{°C} avec une lampe à alcool, qui perd $1{,}10$ @u{g} d'éthanol pendant l'expérience. On donne $c = 4{,}18$ @u{J/(g·°C)}. Quel pouvoir calorifique ce groupe mesure-t-il pour l'éthanol, en @u{MJ/kg} ?",
  rep:14.25, tol:0.15,
  diag:[{v:15.68, m:"C'est l'énergie reçue par l'eau, en @u{kJ}. Il reste à la diviser par la masse d'éthanol brûlée : $PC = @f{Q}{m}$."},
        {v:0.01425, m:"$@f{15{,}68}{1{,}10}$ donne des @u{kJ/g}, qui sont déjà des @u{MJ/kg}. Tu as divisé par 1000 de trop."},
        {v:29.45, m:"Tu as pris la température finale au lieu de l'**échauffement** $Δθ = 31{,}0 - 16{,}0 = 15{,}0$ @u{°C}."}],
  corr:["**L'énergie reçue par l'eau** : $Q = 250 × 4{,}18 × 15{,}0 = 15\ 675$ @u{J}, soit $15{,}7$ @u{kJ}.",
        "**Le pouvoir calorifique mesuré**, calculé d'un seul coup : $PC = @f{250 × 4{,}18 × 15{,}0}{1{,}10} ≈ 14\ 250$ @u{J/g}, soit $14{,}3$ @u{MJ/kg}.",
        "**Le contrôle** : la valeur de référence de l'éthanol liquide est $26{,}8$ @u{MJ/kg}. Le groupe en mesure à peu près la moitié : les fuites d'énergie d'une flamme nue sous une canette sont importantes (voir l'atelier)."],
  indice:"$Q = m_{eau} × c × Δθ$, puis $PC = @f{Q}{m}$."},

 {id:"cb12", niveau:2, type:"qcm", enonce:"En TP, un groupe mesure pour l'éthanol un pouvoir calorifique de $13$ @u{MJ/kg}, alors que la valeur de référence est $26{,}8$ @u{MJ/kg}. Quelle explication est juste ?",
  choix:["La valeur de référence est fausse","Une partie de l'énergie chauffe l'air et la canette, et la flamme jaune laisse du carbone non brûlé","L'éthanol a perdu de l'énergie en restant dans son flacon","L'eau ne peut pas absorber plus de la moitié de l'énergie"], bonne:1,
  diag:["Les valeurs de référence sont mesurées dans des calorimètres qui récupèrent toute la chaleur : c'est le montage du TP qui en perd.",
        "",
        "Un combustible ne perd pas d'énergie en attendant dans un flacon fermé.",
        "Rien ne limite l'eau à la moitié : elle reçoit simplement moins d'énergie que la flamme n'en libère, parce que le reste s'échappe ailleurs."],
  corr:["**L'énergie libérée ne va pas toute dans l'eau** : les gaz chauds s'échappent autour de la canette, la flamme rayonne dans toutes les directions, la canette et le thermomètre chauffent, l'eau chaude refroidit déjà au contact de l'air.",
        "**Une partie n'est même pas libérée** : la flamme jaune contient du carbone (de la suie) qui ne brûle pas, la combustion est incomplète.",
        "Obtenir la moitié de la valeur de référence est donc un résultat habituel avec ce montage."],
  indice:"Où va la chaleur de la flamme, à part dans l'eau ?"},

 {id:"cb13", niveau:1, type:"qcm", enonce:"Une famille ressent maux de tête et nausées, tous en même temps, un soir d'hiver où la chaudière fonctionne. Que faut-il faire en premier ?",
  choix:["Aérer, arrêter la chaudière, sortir et appeler les secours","Prendre un médicament contre le mal de tête et aller se coucher","Monter le chauffage pour se réchauffer","Attendre le lendemain pour voir si cela passe"], bonne:0,
  diag:["",
        "Ces signes chez plusieurs personnes à la fois font penser au monoxyde de carbone : dormir dans la pièce aggrave l'intoxication.",
        "Si la chaudière produit du monoxyde de carbone, la faire tourner davantage aggrave le danger.",
        "Le monoxyde de carbone agit vite : attendre peut être mortel."],
  corr:["**Plusieurs personnes, mêmes symptômes, un appareil à combustion en marche** : on pense au monoxyde de carbone.",
        "**Les bons gestes** : ouvrir les fenêtres, arrêter l'appareil, sortir, appeler le 112, le 15 ou le 18.",
        "**Pour éviter que cela arrive** : un détecteur de monoxyde de carbone et l'entretien annuel de la chaudière."],
  indice:"Quel gaz invisible une chaudière mal réglée peut-elle produire ?"},

 {id:"cb14", niveau:2, type:"qcm", enonce:"Le bioéthanol est tiré de plantes. Pourquoi son utilisation peut-elle réduire l'impact des carburants sur le climat ?",
  choix:["Sa combustion ne produit pas de dioxyde de carbone","Il libère plus d'énergie par kilogramme que l'essence","Son CO₂ a été prélevé dans l'air par les plantes peu de temps avant","Sa combustion ne produit pas d'eau"], bonne:2,
  diag:["Sa combustion produit bien du $@c{CO_2}$, comme celle de l'éthanol fossile : la molécule est la même.",
        "C'est l'inverse : l'éthanol libère moins d'énergie par kilogramme que l'essence. Par les énergies de liaison, environ $28$ @u{MJ/kg} pour l'éthanol, contre environ $45$ @u{MJ/kg} pour l'octane, représentant de l'essence.",
        "",
        "Sa combustion complète donne du $@c{CO_2}$ **et** de l'eau, comme toute combustion d'un alcool."],
  corr:["**Le carbone du bioéthanol** vient du $@c{CO_2}$ que les plantes ont absorbé en poussant : le brûler le rend à l'air quelques mois plus tard, c'est un cycle court.",
        "**Le carbone d'un combustible fossile**, au contraire, était enfoui depuis des millions d'années : le brûler en ajoute à l'atmosphère.",
        "**Le bilan n'est pas nul pour autant** : cultiver, transporter et transformer les plantes consomme de l'énergie et occupe des terres."],
  indice:"D'où vient le carbone d'une plante ?"}
]
}

]);
