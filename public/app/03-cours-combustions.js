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
     et de 44,0 kJ/mol de vaporisation de l'eau (NIST, Chase 1998) ;
   - pouvoirs calorifiques de référence (gaz) : énergies ci-dessus divisées par
     les masses molaires exactes (16,04 ; 44,10 ; 46,07 g/mol) ;
   - monoxyde de carbone (gestes, numéros) : info.gouv.fr, « Intoxication au
     monoxyde de carbone : les gestes qui sauvent ».
   ===================================================================== */
window.COURS = (window.COURS || []).concat([

/* ============= 18. L'ÉNERGIE DES COMBUSTIONS ============= */
{
id:"combustions", n:18, titre:"L'énergie des combustions",
sous:"Rompre coûte, former libère",
desc:"Combustibles usuels, équation de combustion complète, énergie de liaison, énergie molaire de réaction, pouvoir calorifique, mesure en TP, risques et enjeux.",
duree:50,
sections:[
 {id:"s1", titre:"Brûler un combustible", blocs:[
  {t:"idee", x:"Une **combustion** est une transformation chimique entre un **combustible** (ce qui brûle) et un **comburant**, presque toujours le **dioxygène** de l'air. Quand elle est **complète**, un combustible organique (fait de carbone, d'hydrogène et parfois d'oxygène) ne donne que deux produits : du **dioxyde de carbone** $@c{CO_2}$ et de l'**eau** $@c{H_2O}$. Et elle **libère de l'énergie** : c'est pour cela qu'on brûle."},
  {t:"p", x:"Les **combustibles usuels** sont presque tous organiques : le **gaz naturel** (surtout du méthane $@c{CH_4}$) de la cuisinière et de la chaudière ; le **propane** et le **butane** des bouteilles de gaz ; l'**essence** et le **gazole**, mélanges d'alcanes plus longs (l'octane $@c{C_8H_{18}}$ en est un représentant) ; l'**éthanol** (un alcool) des carburants E10 ou E85 et des lampes à alcool ; le **bois**, le **fioul**, le **charbon**. Les alcanes et les alcools ont été présentés au chapitre 7."},
  {t:"p", x:"Pour qu'un feu démarre et continue, il faut trois choses à la fois : un **combustible**, un **comburant** et une **source d'énergie** pour amorcer (une flamme, une étincelle). C'est le **triangle du feu**. Retirer l'une des trois éteint le feu : c'est le principe de l'extincteur, qui étouffe la flamme ou la refroidit. Au chapitre 16, on a vu qu'une combustion est une **oxydoréduction** : le dioxygène est l'oxydant, le combustible le réducteur. Ici, on s'intéresse à l'**énergie** qu'elle libère."},
  {t:"check", q:"Dans la flamme d'une cuisinière à gaz, quel est le comburant ?",
   choix:["Le méthane","L'eau","Le dioxyde de carbone","Le dioxygène de l'air"], bonne:3,
   expl:["Le méthane est le combustible : c'est lui qui brûle.",
         "L'eau est un produit de la combustion, pas un réactif.",
         "Le dioxyde de carbone est un produit de la combustion.",
         "Exact : le comburant est le dioxygène, qui réagit avec le combustible."]}
 ]},

 {id:"s2", titre:"Écrire l'équation de combustion complète", blocs:[
  {t:"idee", x:"Pour ajuster l'équation de combustion complète d'un alcane ou d'un alcool, on suit toujours le même ordre : **le carbone**, puis **l'hydrogène**, puis **l'oxygène en dernier**. Si le nombre de molécules de dioxygène n'est pas entier, on multiplie tout par 2. Pourquoi cet ordre ? Le carbone ne se retrouve que dans le $@c{CO_2}$ et l'hydrogène que dans l'eau : chacun fixe directement son nombre. L'oxygène, lui, est partout ; on le garde pour la fin."},
  {t:"methode", titre:"Ajuster une combustion complète", etapes:[
   "**Écrire le squelette** : combustible + $@c{O_2}$ → $@c{CO_2}$ + $@c{H_2O}$.",
   "**Le carbone** : autant de $@c{CO_2}$ que d'atomes de carbone dans le combustible.",
   "**L'hydrogène** : chaque $@c{H_2O}$ emporte 2 atomes d'hydrogène, donc moitié moins de $@c{H_2O}$ que d'atomes H.",
   "**L'oxygène, en dernier** : compter les atomes O à droite, retirer ceux qu'apporte déjà le combustible (un alcool en a un), et diviser par 2 pour avoir le nombre de $@c{O_2}$. On le règle en dernier parce que $@c{O_2}$ ne contient que de l'oxygène : le changer ne dérègle rien d'autre.",
   "**Des entiers** : si ce nombre est une fraction ($@f{13}{2}$ par exemple), multiplier tous les nombres par 2. Une demi-molécule n'existe pas : c'est comme une recette qui demanderait six œufs et demi, on la fait en double, 13 œufs, et tout le reste aussi."
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
  {t:"idee", x:"Pendant une combustion, des **liaisons sont rompues** dans les réactifs et **d'autres sont formées** dans les produits. **Rompre une liaison coûte de l'énergie** : il faut en **fournir aux molécules**. **Former une liaison en libère** : la même quantité, que **les molécules rendent** à ce qui les entoure. L'**énergie de liaison** est l'énergie qu'il faut fournir pour rompre une mole de cette liaison, toutes les espèces étant à l'état **gazeux** (on verra pourquoi un peu plus bas)."},
  {t:"p", x:"Une liaison covalente, c'est un doublet d'électrons que deux atomes se partagent (chapitre 4) : elle les tient ensemble. Pour séparer les deux atomes, il faut tirer, donc fournir de l'énergie, comme pour séparer deux aimants collés. Inversement, quand deux atomes s'unissent, l'énergie est libérée, comme quand deux aimants se recollent d'un coup : ils claquent, et le choc peut pincer les doigts. Pour les aimants, cette énergie sort en mouvement et en bruit ; pour les molécules, elle sort en **chaleur et en lumière** : c'est la flamme. Et pour séparer les aimants, c'est toi qui fournis l'effort ; pour rompre les liaisons, c'est l'allumette au départ, puis la flamme elle-même. Une liaison est d'autant plus **forte** que son énergie de liaison est grande."},
  {t:"tbl", head:["Liaison","Énergie de liaison (kJ/mol)"], rows:[
   ["C–H","$413$"],
   ["C–C","$347$"],
   ["C–O","$358$"],
   ["O–H","$467$"],
   ["O=O (dioxygène)","$495$"],
   ["C=O (dans $@c{CO_2}$)","$799$"]
  ]},
  {t:"p", x:"Ces valeurs sont des **moyennes** (table « Average Bond Energies » de LibreTexts Chemistry) : une liaison C–H n'a pas exactement la même énergie dans le méthane et dans l'éthanol. Les calculs qui les utilisent sont donc des **estimations**, à quelques pour cent près."},
  {t:"piege", titre:"Pourquoi « à l'état gazeux » ?", x:"Les énergies de liaison ne comptent que les liaisons **à l'intérieur** des molécules. Dans un liquide, les molécules sont en plus retenues les unes aux autres (les interactions entre molécules, notamment les liaisons hydrogène, du chapitre 5) : passer de l'eau gazeuse à l'eau liquide libère encore de l'énergie, que les liaisons ne comptent pas. Tu as déjà senti cette énergie : une brûlure par la **vapeur** d'une casserole est pire qu'une brûlure par l'eau bouillante, parce qu'en se condensant sur ta peau, la vapeur te rend en plus l'énergie qu'il avait fallu pour l'évaporer. La méthode ne vaut donc que si **toutes les espèces sont gazeuses**. Dans les calculs d'énergie de ce chapitre, l'eau est toujours de la vapeur, $@c{H_2O}$(g), et le combustible est supposé gazeux lui aussi."}
 ]},

 {id:"s4", titre:"L'énergie molaire de réaction", blocs:[
  {t:"idee", x:"L'**énergie molaire de réaction** $E_r$ (« molaire » veut dire « par mole », comme dans « masse molaire ») est l'énergie échangée quand on brûle **une mole de combustible** : pour le méthane, 16 @u{g}, environ 24 litres de gaz à température ambiante. On l'estime à partir des énergies de liaison : **ce qu'il faut fournir aux molécules pour les ruptures, moins ce qu'elles rendent en formant**. Si elle est **négative**, la réaction **libère** de l'énergie : c'est le cas de toutes les combustions."},
  {t:"p", x:"**De quel côté on se place.** On compte l'énergie **du point de vue des molécules**, comme si elles avaient un porte-monnaie d'énergie. Rompre une liaison : on leur **donne** de l'énergie, le porte-monnaie se remplit, on compte **+**. Former une liaison : elles en **rendent** au monde extérieur (la flamme, la casserole), il se vide, on compte **−**. Sur le diagramme ci-dessous, la **hauteur** est ce que contient le porte-monnaie : on **monte** en rompant (barre rouge), on **redescend** en formant (barre verte), et on finit **plus bas** qu'au départ. Cet écart, c'est $E_r$ (barre bleue) : négatif, les molécules ont perdu l'énergie qui chauffe ta casserole."},
  {t:"formule", titre:"Énergie molaire de réaction (espèces gazeuses)",
   x:"$E_r = $ (somme des énergies des liaisons **rompues**) $-$ (somme des énergies des liaisons **formées**)",
   note:"$E_r$ en @u{kJ/mol}, comptée ici **pour une mole de combustible**. Négative : la réaction libère de l'énergie, on dit qu'elle est **exothermique** (exo = vers l'extérieur, thermique = chaleur : la chaleur sort, comme d'un feu de bois). Positive : elle en consomme, elle est **endothermique** (la chaleur rentre, comme dans une poche de froid instantané des trousses de secours, où un sel se dissout en absorbant de la chaleur). Chaque liaison est comptée **autant de fois qu'elle apparaît**, en tenant compte des coefficients de l'équation."},
  {t:"figi", nom:"bilan-liaisons"},
  {t:"exemple", titre:"Exemple guidé — la combustion du méthane", enonce:"Estimer l'énergie molaire de la réaction $@c{CH_4}$(g) $+ 2 @c{O_2}$(g) $→ @c{CO_2}$(g) $+ 2 @c{H_2O}$(g), à l'aide du tableau de la section 3.", etapes:[
   {q:"Les liaisons rompues", r:"Dans $@c{CH_4}$ : 4 liaisons C–H, soit $4 × 413 = 1652$ @u{kJ}. Dans $2 @c{O_2}$ : 2 liaisons O=O, soit $2 × 495 = 990$ @u{kJ}. Total : $1652 + 990 = 2642$ @u{kJ}, à **fournir**."},
   {q:"Les liaisons formées", r:"Dans $@c{CO_2}$ (O=C=O) : 2 liaisons C=O, soit $2 × 799 = 1598$ @u{kJ}. Dans $2 @c{H_2O}$ : $2 × 2 = 4$ liaisons O–H, soit $4 × 467 = 1868$ @u{kJ}. Total : $1598 + 1868 = 3466$ @u{kJ}, **libérés**."},
   {q:"Le bilan", r:"$E_r = 2642 - 3466 = -824$ @u{kJ/mol}. Négatif : la combustion du méthane libère environ $824$ @u{kJ} par mole de méthane brûlé. Sur le diagramme : on est monté de $2642$ @u{kJ}, redescendu de $3466$ @u{kJ}, et on arrive $824$ @u{kJ} plus bas qu'au départ. Négatif parce que les liaisons formées (C=O, O–H) sont plus fortes que celles qu'on a cassées : on récupère plus en formant qu'on ne paie en rompant."},
   {q:"Le contrôle", r:"La valeur de **référence**, obtenue à partir de mesures très précises (base de données du NIST, l'institut américain des mesures, eau gazeuse), est $-802$ @u{kJ/mol}. L'écart, environ 3 %, vient de ce que les énergies de liaison sont des moyennes. La méthode donne le bon ordre de grandeur et le bon signe."}
  ]},
  {t:"piege", titre:"Le signe et le sens du bilan", x:"On écrit toujours **rompues moins formées**. L'écrire à l'envers (formées moins rompues) donne $+824$ @u{kJ/mol} : une combustion qui consommerait de l'énergie, ce qui est absurde, puisqu'on brûle du gaz pour se chauffer. Le **contrôle de bon sens** est immédiat : une combustion a toujours un $E_r$ **négatif**. Et chaque molécule compte avec ses coefficients : $2 @c{O_2}$, c'est 2 liaisons O=O, et un $@c{CO_2}$ contient **deux** liaisons C=O. Pour ne rien oublier, dessine chaque molécule avec ses traits (chapitre 4) : un trait, une liaison. Si l'équation a été multipliée par 2 (butane : $2 @c{C_4H_{10}} + 13 @c{O_2}$…), calcule le bilan de l'équation entière puis divise-le par 2 : $E_r$ est toujours **par mole de combustible**. Tu peux aussi garder $@f{13}{2}$ : une demi-molécule n'existe pas, mais une demi-**mole** si. $6{,}5$ moles de $@c{O_2}$ par mole de butane, c'est $6{,}5$ moles de liaisons O=O à rompre."},
  {t:"check", q:"Pour une réaction, les liaisons rompues coûtent $3000$ @u{kJ} et les liaisons formées libèrent $3600$ @u{kJ}, par mole. Que vaut $E_r$ ?",
   choix:["$+600$ @u{kJ/mol}","$-600$ @u{kJ/mol}","$+6600$ @u{kJ/mol}","$-6600$ @u{kJ/mol}"], bonne:1,
   expl:["C'est formées moins rompues : le signe est inversé. On écrit rompues moins formées.",
         "Exact : $3000 - 3600 = -600$ @u{kJ/mol}. Plus d'énergie libérée que coûtée : la réaction est exothermique.",
         "On ne fait pas la somme : on retranche ce que libèrent les formations de ce que coûtent les ruptures.",
         "On ne fait pas la somme : $3000 - 3600$, pas $-(3000 + 3600)$."]}
 ]},

 {id:"s5", titre:"Pouvoir calorifique et énergie libérée", blocs:[
  {t:"idee", x:"Trois grandeurs, trois unités, reliées par la **masse molaire** $M$ : l'**énergie molaire de réaction** $E_r$ (@u{kJ/mol}), le **pouvoir calorifique** $PC$ (@u{MJ/kg}) et l'**énergie libérée** $Q$ (@u{kJ} ou @u{J}). Le tableau ci-dessous les compare."},
  {t:"p", x:"C'est comme au marché. Le **prix au kilo**, c'est le **pouvoir calorifique** : l'énergie pour 1 @u{kg} de combustible. Le **prix par lot** (un lot de $6{,}02 × 10^{23}$ molécules, une mole), c'est $E_r$. Et le **total au ticket de caisse**, pour ce que tu as vraiment brûlé, c'est $Q$. On passe du prix par lot au prix au kilo en connaissant la masse d'un lot : la masse molaire $M$."},
  {t:"tbl", head:["Grandeur","Ce qu'elle dit","Unité","Méthane"], rows:[
   ["$E_r$","énergie par mole brûlée, avec son signe","@u{kJ/mol}","$-824$"],
   ["$PC$","énergie libérée par kilogramme","@u{MJ/kg}","$51{,}5$"],
   ["$Q$","énergie libérée par ce qu'on a brûlé","@u{kJ} ou @u{J}","dépend de la masse"]
  ]},
  {t:"formule", titre:"Des moles aux kilogrammes",
   x:"$PC = @f{|E_r|}{M}$ &nbsp;&nbsp;et&nbsp;&nbsp; $Q = n × |E_r| = m × PC$",
   note:"$|E_r|$ se lit « valeur absolue de $E_r$ » : c'est $E_r$ sans son signe moins ($|-824| = 824$). Avec $E_r$ en @u{kJ/mol} et $M$ en @u{g/mol}, $@f{|E_r|}{M}$ est en @u{kJ/g}, ce qui est la même chose que des @u{MJ/kg} : si 1 gramme libère $51{,}5$ @u{kJ}, alors 1000 grammes (1 @u{kg}) libèrent 1000 fois plus, $51 500$ @u{kJ}, c'est-à-dire $51{,}5$ @u{MJ}. Le nombre ne bouge pas. $n = @f{m}{M}$ est la quantité de combustible brûlée. $Q$ et $PC$ sont **positifs** : ce sont des énergies libérées ; le signe n'est porté que par $E_r$."},
  {t:"tbl", head:["Combustible (gaz)","$E_r$ par les liaisons (kJ/mol)","$M$ (g/mol)","$PC$ calculé (MJ/kg)","$PC$ de référence (MJ/kg)"], rows:[
   ["méthane","$-824$","$16{,}0$","$51{,}5$","$50{,}0$"],
   ["propane","$-2057$","$44{,}0$","$46{,}8$","$46{,}3$"],
   ["éthanol","$-1276$","$46{,}0$","$27{,}7$","$27{,}8$"]
  ]},
  {t:"p", x:"La dernière colonne est calculée à partir des données du NIST (eau gazeuse) : les estimations par les liaisons tombent à 3 % près. L'éthanol libère près de deux fois moins d'énergie par kilogramme que le méthane : sa molécule contient déjà un atome d'oxygène, elle est en quelque sorte « déjà un peu brûlée ». C'est pour cela qu'à distance égale, un réservoir d'E85 se vide plus vite qu'un réservoir d'essence : l'essence (représentée par l'octane) donne environ $45$ @u{MJ/kg} par la même méthode des liaisons. Ces valeurs supposent le combustible **gazeux** ; un combustible liquide doit d'abord s'évaporer, ce qui coûte un peu d'énergie : l'éthanol liquide de la lampe à alcool donne $26{,}8$ @u{MJ/kg} (section 6), un peu moins que les $27{,}8$ de l'éthanol gazeux."},
  {t:"exemple", titre:"Exemple guidé — l'énergie d'une bouteille de propane", enonce:"Une bouteille de camping contient $500$ @u{g} de propane. Quelle énergie libère sa combustion complète ? On prend $E_r = -2057$ @u{kJ/mol} et $M(@c{C_3H_8}) = 44{,}0$ @u{g/mol}.", etapes:[
   {q:"La quantité de propane", r:"$n = @f{m}{M} = @f{500}{44{,}0} ≈ 11{,}4$ @u{mol}."},
   {q:"L'énergie libérée", r:"$Q = n × |E_r|$, calculée d'un seul coup : $Q = @f{500}{44{,}0} × 2057 ≈ 2{,}34 × 10^4$ @u{kJ}, soit environ $23$ @u{MJ}."},
   {q:"Par le pouvoir calorifique", r:"$PC = @f{2057}{44{,}0} ≈ 46{,}8$ @u{MJ/kg}, et $Q = 0{,}500 × 46{,}8 ≈ 23$ @u{MJ}. Les deux chemins donnent la même chose."}
  ]},
  {t:"piege", titre:"Les unités", x:"$@f{|E_r|}{M}$ avec $E_r$ en @u{kJ/mol} et $M$ en @u{g/mol} donne des @u{kJ/g}, c'est-à-dire des @u{MJ/kg} : **aucune conversion à faire**. Le piège classique est d'en faire une de trop (diviser ou multiplier par 1000) ou de multiplier par $M$ au lieu de diviser."}
 ]},

 {id:"s6", titre:"Atelier — mesurer le pouvoir calorifique de l'éthanol", blocs:[
  {t:"p", x:"Au laboratoire, on brûle de l'éthanol dans une **lampe à alcool** placée sous une **canette** en aluminium contenant de l'eau. On pèse la lampe avant et après, on mesure l'échauffement de l'eau. L'énergie reçue par l'eau se calcule avec $Q_{eau} = m_{eau} × c × Δθ$, une formule **donnée en TP** (elle n'est pas à connaître par cœur) : $c = 4{,}18$ @u{J/(g·°C)} est la capacité thermique massique de l'eau (l'énergie qu'il faut pour chauffer 1 @u{g} d'eau de 1 @u{°C}), et $Δθ$ (« delta thêta ») est l'**échauffement**, température finale moins température initiale ; le symbole $Δ$ signifie toujours « variation »."},
  {t:"astuce", titre:"Ce qu'on suppose", x:"$Q_{eau}$ est l'énergie que l'eau a **reçue**, pas celle que la flamme a **libérée**. On va faire comme si toute l'énergie de la flamme allait dans l'eau, et on verra à la fin que c'est loin d'être le cas."},
  {t:"atelier", titre:"Une lampe à alcool sous une canette",
   enonce:"Mesures d'un groupe : $200$ @u{g} d'eau dans la canette, température initiale $18{,}0$ @u{°C}, température finale $38{,}0$ @u{°C}. La lampe pèse $152{,}40$ @u{g} avant et $151{,}15$ @u{g} après. À la fin, le fond de la canette a noirci. Valeur de référence pour l'éthanol **liquide** : $PC = 26{,}8$ @u{MJ/kg} (un peu moins que pour le gaz, voir section 5).",
   etapes:[
    {q:"Quelle énergie l'eau a-t-elle reçue, en @u{kJ} ?",
     rep:16.72, tol:0.3,
     aide:"$Q_{eau} = m_{eau} × c × Δθ$, avec $Δθ = 38{,}0 - 18{,}0$. Le résultat sort en joules.",
     diag:[{v:16720, m:"C'est bien $Q_{eau}$, mais en **joules**. La question demande des kilojoules : divise par 1000."},
           {v:31.77, m:"Tu as pris la température finale $38{,}0$ @u{°C} au lieu de l'**échauffement** $Δθ = 38{,}0 - 18{,}0 = 20{,}0$ @u{°C}."},
           {v:0.836, m:"Tu as oublié de multiplier par l'échauffement $Δθ = 20{,}0$ @u{°C}."}],
     expl:"$Q_{eau} = 200 × 4{,}18 × 20{,}0 = 16 720$ @u{J}, soit $16{,}7$ @u{kJ}."},
    {q:"Quelle masse d'éthanol a brûlé, en @u{g} ?",
     rep:1.25, tol:0.01,
     aide:"Différence des deux pesées de la lampe.",
     diag:[{v:303.55, m:"On ne fait pas la somme des deux pesées : la masse brûlée, c'est ce que la lampe a **perdu**."}],
     expl:"$152{,}40 - 151{,}15 = 1{,}25$ @u{g} d'éthanol brûlé."},
    {q:"Quel pouvoir calorifique ce groupe mesure-t-il, en @u{MJ/kg} ?",
     rep:13.38, tol:0.4,
     aide:"On fait comme si toute l'énergie libérée par l'éthanol était passée dans l'eau : $PC = @f{Q_{eau}}{m}$. En @u{kJ/g}, c'est directement des @u{MJ/kg}.",
     diag:[{v:0.01338, m:"Des @u{kJ/g}, c'est déjà des @u{MJ/kg} : il n'y a rien à convertir. Tu as divisé par 1000 de trop."},
           {v:13376, m:"Tu as gardé $Q_{eau}$ en joules : $16 720$ @u{J} ÷ $1{,}25$ @u{g} = $13 376$ @u{J/g}, soit $13{,}4$ @u{kJ/g}, c'est-à-dire $13{,}4$ @u{MJ/kg}."},
           {v:20.9, m:"Tu as multiplié par $1{,}25$ au lieu de diviser : $PC = @f{Q_{eau}}{m}$."}],
     expl:"$PC = @f{16{,}72}{1{,}25} ≈ 13{,}4$ @u{kJ/g}, soit $13{,}4$ @u{MJ/kg}. C'est **la moitié** de la valeur de référence ($26{,}8$ @u{MJ/kg}) : un résultat tout à fait habituel en TP."},
    {q:"D'où vient surtout l'écart avec la valeur de référence ?",
     choix:["La balance est mal réglée","Une grande partie de l'énergie libérée ne va pas dans l'eau","L'éthanol de la lampe est un autre alcool","L'eau a gelé pendant l'expérience"], bonne:1,
     diag:["Une balance au centième de gramme se trompe de quelques centièmes, pas de moitié.",
           "",
           "Rien ne l'indique : c'est bien de l'éthanol, et un autre combustible ne diviserait pas le résultat par deux à coup sûr.",
           "L'eau est passée de $18$ à $38$ @u{°C} : elle n'a pas gelé."],
     expl:"Surtout des **fuites de chaleur**, toutes réelles. Souvent la plus importante : les **gaz chauds** de la flamme montent le long de la canette et s'échappent dans l'air sans la toucher. La flamme **rayonne** aussi : elle envoie de la chaleur en ligne droite tout autour d'elle, comme un feu de camp qui te chauffe le visage à un mètre ; ce qui part sur les côtés ne touche jamais la canette. La **canette** et le thermomètre sont chauffés eux aussi, et l'eau chaude **cède déjà de la chaleur** à l'air pendant la mesure ; un peu d'éthanol **s'évapore** de la mèche sans brûler. Dans une moindre mesure, une partie de l'énergie n'est même pas libérée : le fond froid de la canette refroidit la flamme, qui jaunit et laisse de la suie (le fond noirci) ; ces grains de carbone n'ont pas brûlé, la combustion est **incomplète**."}
   ],
   bilan:"Mesurer un pouvoir calorifique avec une canette donne typiquement **la moitié ou moins** de la valeur de référence. Le calcul est juste ; c'est le montage qui laisse fuir l'énergie. Pour s'approcher de la valeur vraie, il faudrait un calorimètre qui enferme la flamme et récupère toute la chaleur. Avec le même matériel, on gagne déjà beaucoup : un paravent en papier d'aluminium autour de la flamme, un couvercle sur la canette, la flamme réglée pour qu'elle lèche le fond sans l'écraser, et l'eau remuée avant chaque lecture de température."},
  {t:"astuce", titre:"Sécurité", x:"Lunettes, cheveux attachés, lampe à alcool sur un support stable, flacon d'éthanol **fermé et éloigné** de toute flamme (ses vapeurs s'enflamment facilement). Ne jamais remplir une lampe allumée ou encore chaude. La canette chauffée se manipule avec une pince."}
 ]},

 {id:"s7", titre:"Applications, risques et enjeux", blocs:[
  {t:"idee", x:"Les combustions chauffent nos logements, font tourner les moteurs et une partie des centrales électriques. Elles ont deux revers : un danger domestique bien réel, le **monoxyde de carbone**, et les **émissions de dioxyde de carbone**, qui modifient le climat."},
  {t:"p", x:"**La combustion incomplète.** Quand le dioxygène manque (une chaudière mal réglée, une pièce mal aérée), une partie du carbone ne devient pas du $@c{CO_2}$ : il reste du **carbone** (la suie, qui noircit) et il se forme du **monoxyde de carbone** $@c{CO}$. Un signe possible à surveiller : une flamme de gazinière ou de chaudière **jaune ou orangée** au lieu de **bleue** peut manquer d'air ; il faut la faire vérifier."},
  {t:"piege", titre:"Le monoxyde de carbone : le danger qu'on ne sent pas", x:"Le monoxyde de carbone est **invisible, inodore et n'irrite pas** : rien ne prévient.<br>**Ce qu'il fait** : dans le sang, il prend la place du dioxygène sur l'hémoglobine et s'y fixe bien plus fortement que lui, comme un passager qui s'assoit à ta place dans le bus et ne descend plus : le dioxygène reste à quai, et le corps en manque.<br>**Les signes** : maux de tête, nausées, vertiges, fatigue, somnolence, souvent chez plusieurs personnes du même logement en même temps.<br>**En cas de doute** : ouvrir les fenêtres, arrêter les appareils à combustion, sortir sans revenir à l'intérieur, et appeler les secours (le 15, le 18 ou le 112 ; le 114 pour les personnes sourdes ou malentendantes). Il faut voir un médecin même si l'on se sent mieux dehors : les effets peuvent être retardés.<br>**Pour prévenir** : un **détecteur de monoxyde de carbone** ; attention, le détecteur de **fumée**, obligatoire dans les logements, ne détecte **pas** le monoxyde de carbone. Aussi : l'entretien chaque année de la chaudière, du chauffe-eau et des conduits par un professionnel, ne jamais boucher les aérations (surtout en hiver, quand on veut garder la chaleur), et ne jamais utiliser à l'intérieur un barbecue, un brasero ou un groupe électrogène."},
  {t:"p", x:"**Les autres risques.** Une fuite de gaz peut provoquer un **incendie** ou une **explosion** : en cas d'odeur de gaz, on ne touche à aucun interrupteur, on ferme l'arrivée de gaz, on aère et on sort. Et les combustions rejettent aussi des **polluants** : des particules fines (la suie des moteurs diesel, des feux de bois) et des oxydes d'azote, qui irritent les poumons."},
  {t:"p", x:"**Les ressources et le climat.** Brûler un combustible **fossile** (gaz naturel, pétrole, charbon) libère du carbone qui était enfoui depuis des millions d'années : il s'ajoute au $@c{CO_2}$ de l'atmosphère et renforce l'effet de serre. Les recherches actuelles suivent plusieurs axes : des **carburants agro-sourcés** (le bioéthanol tiré de la betterave ou du blé) ou issus de déchets, comme le **biogaz** produit par la **méthanisation** des déchets agricoles et alimentaires ; un meilleur **rendement** des moteurs et des chaudières, pour brûler moins à service égal ; le **captage** du $@c{CO_2}$ à la sortie des grandes installations ; des combustibles sans carbone, comme le **dihydrogène**, dont la combustion donne de l'eau et pas de $@c{CO_2}$ (brûlé dans l'air à haute température, il forme tout de même des oxydes d'azote)."},
  {t:"astuce", titre:"Agro-sourcé ne veut pas dire « sans impact »", x:"Le $@c{CO_2}$ libéré par le bioéthanol a été prélevé dans l'air par les plantes quelques mois plus tôt : le cycle est **court**. Mais cultiver, récolter, transporter et transformer ces plantes consomme aussi de l'énergie, souvent fossile, et occupe des terres. Le bilan est en général meilleur que celui de l'essence, sans être nul. De même, le dihydrogène n'est « propre » que si on le fabrique sans énergie fossile."},
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
   ["« Mesure en TP »","$Q_{eau} = m_{eau} × c × Δθ$, puis $PC = @f{Q_{eau}}{m}$ ; s'attendre à beaucoup moins que la référence, et savoir dire pourquoi"]
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

 {id:"cb6", niveau:2, type:"num", unite:"kJ/mol", enonce:"Estimer l'énergie molaire de la réaction $@c{C_3H_8}$(g) $+ 5 @c{O_2}$(g) $→ 3 @c{CO_2}$(g) $+ 4 @c{H_2O}$(g), en @u{kJ/mol}. Le propane contient 8 liaisons C–H et 2 liaisons C–C. Énergies de liaison (@u{kJ/mol}) : C–H $413$ ; C–C $347$ ; O=O $495$ ; C=O (dans $@c{CO_2}$) $799$ ; O–H $467$.",
  rep:-2057, tol:45,
  diag:[{v:2057, m:"Le signe est inversé : tu as fait formées − rompues. On écrit **rompues − formées** ; une combustion libère de l'énergie, son $E_r$ est négatif."},
        {v:-4532, m:"Tu as oublié de rompre les liaisons O=O du dioxygène : $5 × 495 = 2475$ @u{kJ} à ajouter aux ruptures."},
        {v:-4037, m:"Tu as compté une seule liaison O=O. Il y a **cinq** molécules $@c{O_2}$, donc cinq liaisons O=O : $5 × 495$."},
        {v:340, m:"Une molécule $@c{CO_2}$ (O=C=O) contient **deux** liaisons C=O : pour $3 @c{CO_2}$, $6 × 799 = 4794$ @u{kJ}, et non $3 × 799$."}],
  corr:["**Rompues** : $8 × 413 + 2 × 347 + 5 × 495 = 3304 + 694 + 2475 = 6473$ @u{kJ}.",
        "**Formées** : $6 × 799 + 8 × 467 = 4794 + 3736 = 8530$ @u{kJ} (trois $@c{CO_2}$ à deux C=O, quatre $@c{H_2O}$ à deux O–H).",
        "**Bilan** : $E_r = 6473 - 8530 = -2057$ @u{kJ/mol}. Négatif, comme toute combustion ; la valeur de référence est $-2043$ @u{kJ/mol}."],
  indice:"Fais deux listes : liaisons rompues, liaisons formées, avec les coefficients."},

 {id:"cb7", niveau:3, type:"num", unite:"kJ/mol", enonce:"Estimer l'énergie molaire de la combustion de l'éthanol gazeux : $@c{C_2H_5OH}$(g) $+ 3 @c{O_2}$(g) $→ 2 @c{CO_2}$(g) $+ 3 @c{H_2O}$(g), en @u{kJ/mol}. L'éthanol contient 5 liaisons C–H, 1 liaison C–C, 1 liaison C–O et 1 liaison O–H. Énergies de liaison (@u{kJ/mol}) : C–H $413$ ; C–C $347$ ; C–O $358$ ; O–H $467$ ; O=O $495$ ; C=O (dans $@c{CO_2}$) $799$.",
  rep:-1276, tol:25,
  diag:[{v:1276, m:"Le signe est inversé : on écrit rompues − formées. Une combustion a un $E_r$ négatif."},
        {v:-1743, m:"Tu as oublié de rompre la liaison O–H de l'éthanol ($467$ @u{kJ}). Toutes les liaisons du combustible sont rompues."},
        {v:-2761, m:"Tu as oublié de rompre les trois liaisons O=O du dioxygène : $3 × 495 = 1485$ @u{kJ}."}],
  corr:["**Rompues** : $5 × 413 + 347 + 358 + 467 + 3 × 495 = 2065 + 347 + 358 + 467 + 1485 = 4722$ @u{kJ}.",
        "**Formées** : $4 × 799$ (deux $@c{CO_2}$, deux C=O chacun) $+ 6 × 467$ (trois $@c{H_2O}$, deux O–H chacune) $= 3196 + 2802 = 5998$ @u{kJ}.",
        "**Bilan** : $E_r = 4722 - 5998 = -1276$ @u{kJ/mol}. La valeur de référence est $-1278$ @u{kJ/mol} : l'estimation est excellente ici."],
  indice:"Toutes les liaisons de l'éthanol sont rompues, y compris O–H et C–O."},

 {id:"cb8", niveau:2, type:"num", unite:"MJ/kg", enonce:"La combustion du méthane a une énergie molaire de réaction $E_r = -824$ @u{kJ/mol}, et $M(@c{CH_4}) = 16{,}0$ @u{g/mol}. Quel est son pouvoir calorifique, en @u{MJ/kg} ?",
  rep:51.5, tol:0.6,
  diag:[{v:13184, m:"Tu as multiplié par la masse molaire. Le pouvoir calorifique est une énergie **par kilogramme** : on **divise** par $M$."},
        {v:0.0515, m:"$@f{824}{16{,}0} = 51{,}5$ @u{kJ/g}, et des @u{kJ/g} sont **déjà** des @u{MJ/kg}. Tu as divisé par 1000 de trop."},
        {v:51500, m:"$51{,}5$ @u{kJ/g} font $51{,}5$ @u{MJ/kg}, pas $51 500$ : multiplier le haut et le bas par 1000 ne change pas le nombre."}],
  corr:["**La formule** : $PC = @f{|E_r|}{M} = @f{824}{16{,}0} = 51{,}5$ @u{kJ/g}.",
        "**Les unités** : 1 @u{kJ/g} = 1000 @u{kJ} pour 1000 @u{g}, c'est 1 @u{MJ/kg}. Donc $PC = 51{,}5$ @u{MJ/kg}.",
        "**Le contrôle** : la valeur de référence est $50{,}0$ @u{MJ/kg} ; l'écart de 3 % vient des énergies de liaison moyennes."],
  indice:"Une énergie par kilogramme : on divise par la masse molaire."},

 {id:"cb9", niveau:3, type:"num", unite:"kJ", enonce:"Quelle énergie libère la combustion complète de $10{,}0$ @u{g} de propane ? On prend $E_r = -2057$ @u{kJ/mol} et $M(@c{C_3H_8}) = 44{,}0$ @u{g/mol}. Réponds en @u{kJ}.",
  rep:467.5, tol:6,
  diag:[{v:20570, m:"Tu as multiplié l'énergie molaire par la **masse**. Il faut d'abord la quantité de matière : $n = @f{m}{M}$."},
        {v:2057, m:"C'est l'énergie libérée par **une mole** de propane. Ici on n'en brûle que $@f{10{,}0}{44{,}0} ≈ 0{,}227$ @u{mol}."},
        {v:0.4675, m:"Le résultat est en @u{MJ}. La question demande des @u{kJ} : $Q ≈ 468$ @u{kJ}."}],
  corr:["**La quantité de propane** : $n = @f{10{,}0}{44{,}0} ≈ 0{,}227$ @u{mol}.",
        "**L'énergie libérée**, calculée d'un seul coup : $Q = @f{10{,}0}{44{,}0} × 2057 ≈ 468$ @u{kJ}.",
        "**Positive** : $Q$ est une énergie libérée ; le signe négatif reste porté par $E_r$."],
  indice:"Passe par la quantité de matière."},

 {id:"cb10", niveau:2, type:"qcm", enonce:"Pourquoi précise-t-on « eau à l'état gazeux » quand on estime une énergie de combustion avec les énergies de liaison ?",
  choix:["Parce que les énergies de liaison changent avec la température","Parce que l'eau liquide n'a pas de liaisons O–H","Pour simplifier le calcul de la masse molaire","Parce que les énergies de liaison ignorent les interactions entre molécules d'un liquide"], bonne:3,
  diag:["Les énergies de liaison varient très peu avec la température. Ce qui compte ici, c'est l'**état** des espèces : gazeux ou liquide.",
        "Une molécule d'eau a deux liaisons O–H, qu'elle soit liquide ou gazeuse.",
        "La masse molaire de l'eau est la même dans les deux états.",
        ""],
  corr:["**Les énergies de liaison** ne comptent que les liaisons à l'intérieur des molécules.",
        "**Dans un liquide**, les molécules sont aussi retenues entre elles : passer de la vapeur au liquide libère encore de l'énergie, que la méthode ignore.",
        "**Elle ne vaut donc que pour des espèces gazeuses** : l'eau produite doit être $@c{H_2O}$(g)."],
  indice:"Qu'est-ce qui retient les molécules d'eau entre elles dans un liquide ?"},

 {id:"cb11", niveau:3, type:"num", unite:"MJ/kg", enonce:"Un groupe chauffe $250$ @u{g} d'eau de $16{,}0$ @u{°C} à $31{,}0$ @u{°C} avec une lampe à alcool, qui perd $1{,}10$ @u{g} d'éthanol pendant l'expérience. On donne $c = 4{,}18$ @u{J/(g·°C)}. Quel pouvoir calorifique ce groupe mesure-t-il pour l'éthanol, en @u{MJ/kg} ?",
  rep:14.25, tol:0.3,
  diag:[{v:15.68, m:"C'est l'énergie reçue par l'eau, $Q_{eau}$ en @u{kJ}. Il reste à la diviser par la masse d'éthanol brûlée : $PC = @f{Q_{eau}}{m}$."},
        {v:0.01425, m:"$@f{15{,}68}{1{,}10}$ donne des @u{kJ/g}, qui sont déjà des @u{MJ/kg}. Tu as divisé par 1000 de trop."},
        {v:29.45, m:"Tu as pris la température finale au lieu de l'**échauffement** $Δθ = 31{,}0 - 16{,}0 = 15{,}0$ @u{°C}."}],
  corr:["**L'énergie reçue par l'eau** : $Q_{eau} = 250 × 4{,}18 × 15{,}0 = 15 675$ @u{J}, soit $15{,}7$ @u{kJ}.",
        "**Le pouvoir calorifique mesuré**, calculé d'un seul coup : $PC = @f{250 × 4{,}18 × 15{,}0}{1{,}10} ≈ 14 250$ @u{J/g} $= 14{,}25$ @u{kJ/g}, soit $14{,}3$ @u{MJ/kg} (des @u{kJ/g} sont des @u{MJ/kg}).",
        "**Le contrôle** : la valeur de référence de l'éthanol liquide est $26{,}8$ @u{MJ/kg}. Le groupe en mesure à peu près la moitié : les fuites d'énergie d'une flamme nue sous une canette sont importantes (voir l'atelier)."],
  indice:"$Q_{eau} = m_{eau} × c × Δθ$, puis $PC = @f{Q_{eau}}{m}$."},

 {id:"cb12", niveau:2, type:"qcm", enonce:"En TP, un groupe mesure pour l'éthanol un pouvoir calorifique de $13$ @u{MJ/kg}, alors que la valeur de référence est $26{,}8$ @u{MJ/kg}. Quelle explication est juste ?",
  choix:["La valeur de référence est fausse","Beaucoup de chaleur part dans l'air et la canette au lieu de l'eau","L'éthanol a perdu de l'énergie en restant dans son flacon","L'eau ne peut pas absorber plus de la moitié de l'énergie"], bonne:1,
  diag:["Les valeurs de référence sont mesurées dans des calorimètres qui récupèrent toute la chaleur : c'est le montage du TP qui en perd.",
        "",
        "Un combustible ne perd pas d'énergie en attendant dans un flacon fermé.",
        "Rien ne limite l'eau à la moitié : elle reçoit simplement moins d'énergie que la flamme n'en libère, parce que le reste s'échappe ailleurs."],
  corr:["**Surtout, l'énergie libérée ne va pas toute dans l'eau** : les gaz chauds s'échappent autour de la canette (souvent la plus grosse fuite), la flamme rayonne dans toutes les directions, la canette et le thermomètre chauffent, l'eau chaude refroidit déjà au contact de l'air.",
        "**Dans une moindre mesure, une partie n'est même pas libérée** : si la flamme jaunit et noircit la canette, c'est de la suie, du carbone qui n'a pas brûlé ; la combustion est incomplète.",
        "Obtenir la moitié de la valeur de référence est donc un résultat habituel avec ce montage."],
  indice:"Où va la chaleur de la flamme, à part dans l'eau ?"},

 {id:"cb13", niveau:1, type:"qcm", enonce:"Une famille ressent maux de tête et nausées, tous en même temps, un soir d'hiver où la chaudière fonctionne. Que faut-il faire en premier ?",
  choix:["Aérer, arrêter la chaudière, sortir et appeler les secours","Prendre un médicament contre le mal de tête et aller se coucher","Monter le chauffage pour se réchauffer","Attendre le lendemain pour voir si cela passe"], bonne:0,
  diag:["",
        "Ces signes chez plusieurs personnes à la fois font penser au monoxyde de carbone : dormir dans la pièce aggrave l'intoxication.",
        "Si la chaudière produit du monoxyde de carbone, la faire tourner davantage aggrave le danger.",
        "Le monoxyde de carbone agit vite : attendre peut être mortel."],
  corr:["**Plusieurs personnes, mêmes symptômes, un appareil à combustion en marche** : on pense au monoxyde de carbone.",
        "**Les bons gestes** : ouvrir les fenêtres, arrêter l'appareil, sortir sans revenir, appeler le 15, le 18 ou le 112 (le 114 pour les personnes sourdes ou malentendantes), et voir un médecin même si l'on se sent mieux dehors.",
        "**Pour éviter que cela arrive** : un détecteur de monoxyde de carbone et l'entretien annuel de la chaudière."],
  indice:"Quel gaz invisible une chaudière mal réglée peut-elle produire ?"},

 {id:"cb14", niveau:2, type:"qcm", enonce:"Le bioéthanol est tiré de plantes. Pourquoi son utilisation peut-elle réduire l'impact des carburants sur le climat ?",
  choix:["Sa combustion ne produit pas de dioxyde de carbone","Il libère plus d'énergie par kilogramme que l'essence","Son CO₂ a été prélevé dans l'air par les plantes peu de temps avant","Sa combustion ne produit pas d'eau"], bonne:2,
  diag:["Sa combustion produit bien du $@c{CO_2}$, comme n'importe quel éthanol : c'est la même molécule, qu'elle vienne d'une betterave ou d'ailleurs.",
        "C'est l'inverse : l'éthanol libère moins d'énergie par kilogramme que l'essence. Par les énergies de liaison, environ $28$ @u{MJ/kg} pour l'éthanol, contre environ $45$ @u{MJ/kg} pour l'octane, représentant de l'essence.",
        "",
        "Sa combustion complète donne du $@c{CO_2}$ **et** de l'eau, comme toute combustion d'un alcool."],
  corr:["**Le carbone du bioéthanol** vient du $@c{CO_2}$ que les plantes ont absorbé en poussant : le brûler le rend à l'air quelques mois plus tard, c'est un cycle court.",
        "**Le carbone d'un combustible fossile**, au contraire, était enfoui depuis des millions d'années : le brûler en ajoute à l'atmosphère.",
        "**Le bilan n'est pas nul pour autant** : cultiver, transporter et transformer les plantes consomme de l'énergie et occupe des terres."],
  indice:"D'où vient le carbone d'une plante ?"},

 {id:"cb15", niveau:1, type:"qcm", enonce:"Sur un diagramme d'énergie, les produits d'une réaction sont plus bas que ses réactifs. Que peut-on dire de son énergie molaire de réaction $E_r$ ?",
  choix:["Positive : la réaction consomme de l'énergie","Nulle : la barre rouge et la verte s'annulent","On ne peut rien dire sans les valeurs","Négative : la réaction libère de l'énergie"], bonne:3,
  diag:["Positive voudrait dire que les produits sont plus haut que les réactifs : les molécules auraient gagné de l'énergie.",
        "Les deux barres ne sont pas égales : la verte (former) descend plus bas que la rouge (rompre) n'est montée.",
        "Le signe se lit sans les valeurs : il suffit de savoir si l'on arrive plus haut ou plus bas qu'au départ.",
        ""],
  corr:["**La hauteur, c'est l'énergie stockée dans les molécules.**",
        "**Produits plus bas que les réactifs** : les molécules ont perdu de l'énergie, rendue à l'extérieur ; $E_r < 0$.",
        "**La réaction est exothermique** : c'est le cas de toutes les combustions."],
  indice:"Arrive-t-on plus haut ou plus bas qu'au départ ?"}
]
}

]);
