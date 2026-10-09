/* =====================================================================
   Programme — Spécialité physique-chimie, classe de Première générale
   Partie « Constitution et transformations de la matière »,
   B) Suivi et modélisation de l'évolution d'un système chimique
   (référentiel .claude/referentiels/physique-1re-spe/, l. 222-229 et 254-265)
   ===================================================================== */
window.COURS = (window.COURS || []).concat([

/* ============= 16. L'OXYDORÉDUCTION ============= */
{
id:"oxydoreduction", n:16, titre:"L'oxydoréduction",
sous:"Quand des électrons passent d'une espèce à une autre",
desc:"Oxydant, réducteur, couple, demi-équations électroniques et leur ajustement, équation d'une réaction d'oxydoréduction, lien avec le titrage.",
duree:40,
sections:[
 {id:"s1", titre:"Un échange d'électrons", blocs:[
  {t:"idee", x:"Dans une réaction d'**oxydoréduction**, des **électrons passent** d'une espèce à une autre. Celle qui les **cède** est le **réducteur** ; celle qui les **capte** est l'**oxydant**."},
  {t:"p", x:"Plonge un clou en fer, bien décapé, dans une solution bleue de sulfate de cuivre. Au bout de quelques minutes, le clou se couvre d'un dépôt rouge-brun : du **cuivre** métallique. Et la solution pâlit : elle perd sa couleur bleue, due aux ions cuivre $@c{Cu^{2+}}$, et prend une teinte vert pâle. Ajoute quelques gouttes de soude à un prélèvement : un précipité vert apparaît, signe que la solution contient maintenant des ions fer(II) $@c{Fe^{2+}}$."},
  {t:"fig", titre:"Un clou de fer dans une solution d'ions cuivre",
   vue:[0,0,10,5.6], w:420, h:240, grille:false, axes:false,
   objets:[
    {t:"becher", x:0.6, y:0.6, w:3.2, h:3.6, niveau:.75, couleur:"ink3", liquide:"bleu"},
    {t:"rect", x:2.05, y:1.1, w:0.3, h:4.0, couleur:"ink3", opacite:.7, rond:1},
    {t:"texte", x:2.2, y:0.15, txt:"au début", couleur:"ink2", taille:12},
    {t:"texte", x:2.2, y:5.3, txt:"clou de fer", couleur:"ink3", taille:11},
    {t:"texte", x:0.9, y:2.0, txt:"Cu²⁺", couleur:"bleu", taille:11, ancre:"start"},
    {t:"becher", x:6.0, y:0.6, w:3.2, h:3.6, niveau:.75, couleur:"ink3", liquide:"vert"},
    {t:"rect", x:7.45, y:1.1, w:0.3, h:4.0, couleur:"ink3", opacite:.7, rond:1},
    {t:"rect", x:7.37, y:1.1, w:0.46, h:2.2, couleur:"rouge", opacite:.55, rond:1},
    {t:"texte", x:7.6, y:0.15, txt:"quelques minutes plus tard", couleur:"ink2", taille:12},
    {t:"texte", x:8.4, y:5.3, txt:"dépôt rouge de cuivre", couleur:"rouge", taille:11},
    {t:"texte", x:6.3, y:2.0, txt:"Fe²⁺", couleur:"vert", taille:11, ancre:"start"},
    {t:"vec", de:[4.2,2.6], a:[5.6,2.6], couleur:"ink3"}
   ],
   note:"À gauche, la solution bleue contient des ions cuivre $@c{Cu^{2+}}$. À droite, du cuivre s'est déposé sur la partie immergée du clou, et la solution, vert pâle, contient des ions fer(II) $@c{Fe^{2+}}$."},
  {t:"p", x:"**Ce que disent ces observations.** Des atomes de fer $@c{Fe}$, neutres, sont devenus des ions $@c{Fe^{2+}}$ : chacun a **perdu deux électrons**. Des ions $@c{Cu^{2+}}$ sont devenus des atomes de cuivre $@c{Cu}$, neutres : chacun a **gagné deux électrons**. Les électrons n'ont pas disparu, ils ne sont pas apparus de nulle part : ils sont **passés** du fer aux ions cuivre. C'est un transfert d'électrons, et c'est ce que modélise une réaction d'oxydoréduction."},
  {t:"formule", titre:"Oxydant, réducteur, oxydation, réduction",
   x:"Un **réducteur** est une espèce capable de **céder** des électrons ; un **oxydant**, une espèce capable d'en **capter**.",
   note:"Quand un réducteur cède des électrons, on dit qu'il est **oxydé** : il subit une **oxydation**. Quand un oxydant capte des électrons, il est **réduit** : il subit une **réduction**. Ici, le fer est le réducteur (il est oxydé), les ions cuivre sont l'oxydant (ils sont réduits). Les deux se produisent ensemble, toujours : pas d'électron cédé sans un autre pour le capter."},
  {t:"astuce", titre:"Pour ne jamais inverser : R-R, O-O", x:"**Le Réducteur Rend des électrons, l'Oxydant les Obtient.** Deux mots qui commencent par la même lettre, deux fois. Et pour le vocabulaire qui suit : celui qui **obtient** des électrons est **réduit**, celui qui les **rend** est **oxydé**. Pour un ion d'un seul atome, on le voit sur sa charge. $@c{Cu^{2+}}$ qui obtient deux électrons devient $@c{Cu}$ : sa charge passe de $+2$ à $0$, on l'a **réduite**, en lui ajoutant des charges négatives. Le fer $@c{Fe}$ qui rend deux électrons devient $@c{Fe^{2+}}$ : sa charge augmente, il est oxydé."},
  {t:"piege", titre:"Celui qui gagne est « réduit »", x:"C'est l'inversion la plus fréquente de tout le chapitre : on croit qu'« être réduit », c'est perdre quelque chose. Non : l'oxydant **gagne** des électrons, et c'est justement pour cela qu'il est **réduit** (sa charge baisse). Attention, l'image de la charge ne marche que pour un ion d'un seul atome. Pour un ion comme $@c{MnO_4^-}$, d'autres espèces ($@c{H^+}$, $@c{H_2O}$) s'en mêlent et la charge globale ne suffit plus à juger : on s'en tient alors à la règle des électrons. L'**oxydant est l'espèce qui capte**, toujours."},
  {t:"p", x:"**D'où viennent ces mots ?** Historiquement, « oxyder » voulait dire combiner avec l'oxygène (le fer qui rouille), et « réduire » voulait dire extraire un métal de son minerai (on « réduisait » un oxyde en métal). On a compris plus tard que, dans ces deux cas, ce sont des électrons qui changent de mains, et les mots ont été étendus à tous les transferts d'électrons, avec ou sans oxygène."},
  {t:"mots", items:[
   ["Oxydant","Espèce capable de capter un ou plusieurs électrons. Il est **réduit** au cours de la réaction."],
   ["Réducteur","Espèce capable de céder un ou plusieurs électrons. Il est **oxydé** au cours de la réaction."],
   ["Oxydation","Perte d'électrons, subie par le réducteur."],
   ["Réduction","Gain d'électrons, subi par l'oxydant."],
   ["Couple oxydant/réducteur","Deux espèces qui se transforment l'une en l'autre par gain ou perte d'électrons, notées Ox/Red : $@c{Cu^{2+}}$/$@c{Cu}$. Voir la section 2."],
   ["Demi-équation électronique","L'écriture de cet échange dans un couple : $Ox + n @c{e^-} = Red$. Voir les sections 2 et 3."],
   ["Réaction d'oxydoréduction","Un transfert d'électrons entre le réducteur d'un couple et l'oxydant d'un autre."]
  ]},
  {t:"check", q:"Dans l'expérience du clou, quelle espèce est l'oxydant ?",
   choix:["Le fer $@c{Fe}$, qui perd des électrons","Les ions fer(II) $@c{Fe^{2+}}$, qui apparaissent","Les ions cuivre $@c{Cu^{2+}}$, qui captent des électrons","Le cuivre $@c{Cu}$, qui se dépose"], bonne:2,
   expl:["Le fer **cède** des électrons : c'est le réducteur. Le Réducteur Rend.",
         "Les ions $@c{Fe^{2+}}$ sont **produits** par la réaction : ils ne réagissent pas ici.",
         "Exact. Chaque ion $@c{Cu^{2+}}$ capte deux électrons, cédés par le fer : c'est l'oxydant, et il est réduit en cuivre. L'Oxydant Obtient.",
         "Le cuivre déposé est **produit** par la réaction : c'est ce que devient l'oxydant une fois réduit."]}
 ]},

 {id:"s2", titre:"Couples et demi-équations", blocs:[
  {t:"idee", x:"Un oxydant et le réducteur qu'il devient en captant des électrons forment un **couple**, noté Ox/Red. La **demi-équation** écrit cet échange : $Ox + n @c{e^-} = Red$. Les électrons s'écrivent **toujours du côté de l'oxydant**."},
  {t:"p", x:"Les ions cuivre, en captant deux électrons, deviennent du cuivre. Le cuivre, en cédant deux électrons, redevient des ions cuivre. Ces deux espèces vont ensemble : elles forment le **couple** $@c{Cu^{2+}}$/$@c{Cu}$, l'oxydant toujours écrit en premier. La demi-équation résume ce lien : $@c{Cu^{2+}} + 2 @c{e^-} = @c{Cu}$."},
  {t:"formule", titre:"La demi-équation électronique d'un couple",
   x:"$Ox + n @c{e^-} = Red$",
   note:"$n$ : nombre d'électrons échangés. Le signe $=$ (et non une flèche) dit que l'échange peut se faire dans un sens ou dans l'autre : le sens dépend du partenaire. Avec le fer, les ions cuivre captent des électrons (sens $→$). Face à un oxydant plus puissant, le cuivre pourrait en céder (sens $←$). Une demi-équation n'est jamais une réaction à elle seule : il faut toujours un second couple pour fournir ou recevoir les électrons."},
  {t:"tbl", head:["Couple","Demi-équation","Électrons"], rows:[
   ["$@c{Cu^{2+}}$/$@c{Cu}$","$@c{Cu^{2+}} + 2 @c{e^-} = @c{Cu}$","$2$"],
   ["$@c{Fe^{2+}}$/$@c{Fe}$","$@c{Fe^{2+}} + 2 @c{e^-} = @c{Fe}$","$2$"],
   ["$@c{Fe^{3+}}$/$@c{Fe^{2+}}$","$@c{Fe^{3+}} + @c{e^-} = @c{Fe^{2+}}$","$1$"],
   ["$@c{Zn^{2+}}$/$@c{Zn}$","$@c{Zn^{2+}} + 2 @c{e^-} = @c{Zn}$","$2$"],
   ["$@c{Ag^+}$/$@c{Ag}$","$@c{Ag^+} + @c{e^-} = @c{Ag}$","$1$"],
   ["$@c{H^+}$/$@c{H_2}$","$2 @c{H^+} + 2 @c{e^-} = @c{H_2}$","$2$"],
   ["$@c{I_2}$/$@c{I^-}$","$@c{I_2} + 2 @c{e^-} = 2 @c{I^-}$","$2$"],
   ["$@c{S_4O_6^{2-}}$/$@c{S_2O_3^{2-}}$","$@c{S_4O_6^{2-}} + 2 @c{e^-} = 2 @c{S_2O_3^{2-}}$","$2$"]
  ]},
  {t:"p", x:"Deux remarques sur ce tableau. D'abord, une même espèce peut appartenir à deux couples : $@c{Fe^{2+}}$ est l'**oxydant** du couple $@c{Fe^{2+}}$/$@c{Fe}$, et le **réducteur** du couple $@c{Fe^{3+}}$/$@c{Fe^{2+}}$. « Oxydant » et « réducteur » sont des rôles, pas des étiquettes définitives. Ensuite, même dans ces cas simples, les atomes et les charges sont conservés : dans $@c{I_2} + 2 @c{e^-} = 2 @c{I^-}$, deux atomes d'iode et deux charges négatives de chaque côté."},
  {t:"check", q:"Dans la demi-équation $@c{Ag^+} + @c{e^-} = @c{Ag}$, de quel côté se trouve l'oxydant ?",
   choix:["À gauche, du côté des électrons : c'est $@c{Ag^+}$","À droite : c'est $@c{Ag}$","Des deux côtés","On ne peut pas savoir sans le partenaire"], bonne:0,
   expl:["Exact. Les électrons s'écrivent toujours du côté de l'oxydant : $@c{Ag^+}$ capte un électron pour devenir $@c{Ag}$.",
         "$@c{Ag}$ est le réducteur du couple : il peut céder un électron pour redevenir $@c{Ag^+}$.",
         "Chaque côté porte une espèce différente : l'oxydant d'un côté, le réducteur de l'autre.",
         "Le partenaire décide du **sens** de l'échange, pas du rôle de chaque espèce dans le couple : $@c{Ag^+}$ est toujours l'oxydant de ce couple."]}
 ]},

 {id:"s3", titre:"Ajuster une demi-équation, pas à pas", blocs:[
  {t:"idee", x:"Pour un ion comme le permanganate $@c{MnO_4^-}$, la demi-équation se construit en quatre étapes, **toujours dans le même ordre** : l'élément principal, puis l'oxygène avec de l'eau, puis l'hydrogène avec des ions $@c{H^+}$, puis les charges avec des électrons."},
  {t:"p", x:"Dans les couples de la section 2, il suffisait d'ajouter des électrons. Mais beaucoup d'oxydants contiennent de l'oxygène : l'ion permanganate $@c{MnO_4^-}$, violet, devient l'ion manganèse $@c{Mn^{2+}}$, incolore. Où passent les quatre atomes d'oxygène ? Dans de l'eau, $@c{H_2O}$, et l'hydrogène de cette eau est fourni par les ions $@c{H^+}$ d'un milieu **acide**. Ces réactions se font en effet en solution acidifiée."},
  {t:"methode", titre:"Ajuster une demi-équation en milieu acide", etapes:[
   "**Écrire le couple** : l'oxydant à gauche, le réducteur à droite, séparés par $=$.",
   "**Ajuster l'élément principal** (celui qui n'est ni O ni H) avec un coefficient. *Piège : commencer par O ou H, et devoir tout refaire.*",
   "**Ajuster l'oxygène avec des molécules d'eau** $@c{H_2O}$, du côté qui en manque. *Piège : ajuster O avec $@c{H^+}$ ou avec $@c{O_2}$ ; seule l'eau convient.*",
   "**Ajuster l'hydrogène avec des ions** $@c{H^+}$, du côté qui en manque. *Piège : retoucher l'eau à cette étape ; elle est déjà posée.*",
   "**Ajuster les charges avec des électrons** $@c{e^-}$, du côté où la charge est la plus grande, pour la faire baisser : c'est toujours le côté de l'oxydant. *Piège : compter les charges sans les ions $@c{H^+}$, ou oublier de multiplier la charge d'un ion par son coefficient.*",
   "**Vérifier** chaque élément et la charge totale, de chaque côté."
  ], exemple:"$@c{SO_4^{2-}}$/$@c{SO_2}$. Soufre : $1 = 1$. Oxygène : $4$ contre $2$, on ajoute $2 @c{H_2O}$ à droite. Hydrogène : $4$ à droite, on ajoute $4 @c{H^+}$ à gauche. Charges : $−2 + 4 = +2$ à gauche, $0$ à droite : $2 @c{e^-}$ à gauche. Donc $@c{SO_4^{2-}} + 4 @c{H^+} + 2 @c{e^-} = @c{SO_2} + 2 @c{H_2O}$."},
  {t:"exemple", titre:"Exemple guidé — le couple MnO₄⁻/Mn²⁺", enonce:"Ajuster la demi-équation du couple $@c{MnO_4^-}$/$@c{Mn^{2+}}$ en milieu acide.", etapes:[
   {q:"Écrire le couple", r:"$@c{MnO_4^-} = @c{Mn^{2+}}$."},
   {q:"L'élément principal", r:"Un atome de manganèse de chaque côté : rien à faire."},
   {q:"L'oxygène, avec de l'eau", r:"$4$ atomes O à gauche, aucun à droite : $@c{MnO_4^-} = @c{Mn^{2+}} + 4 @c{H_2O}$."},
   {q:"L'hydrogène, avec H⁺", r:"Les $4 @c{H_2O}$ apportent $8$ H à droite : $@c{MnO_4^-} + 8 @c{H^+} = @c{Mn^{2+}} + 4 @c{H_2O}$."},
   {q:"Les charges, avec des électrons", r:"À gauche : $−1 + 8 × (+1) = +7$. À droite : $+2$ (l'eau est neutre). Il faut $5$ charges négatives à gauche : $@c{MnO_4^-} + 8 @c{H^+} + 5 @c{e^-} = @c{Mn^{2+}} + 4 @c{H_2O}$."},
   {q:"Vérifier", r:"Mn : $1 = 1$. O : $4 = 4$. H : $8 = 8$. Charges : $−1 + 8 − 5 = +2$ à gauche, $+2$ à droite. Tout est conservé."}
  ]},
  {t:"figi", nom:"ajusteur"},
  {t:"p", x:"Choisis un couple et avance d'une étape à la fois. Le tableau compte, de chaque côté, l'élément principal, les atomes O et H, et la charge : chaque étape met une ligne au vert, sans défaire les précédentes. Regarde en particulier $@c{Cr_2O_7^{2-}}$/$@c{Cr^{3+}}$ : l'étape 1 n'est pas vide, il faut d'abord un $2$ devant $@c{Cr^{3+}}$."},
  {t:"check", q:"On ajuste $@c{NO_3^-}$/$@c{NO}$. Après avoir ajouté $2 @c{H_2O}$ à droite, que fait-on ?",
   choix:["On ajoute $2 @c{H_2O}$ à gauche pour compenser","On ajoute des électrons à droite","On ajoute $@c{O_2}$ à gauche","On ajoute $4 @c{H^+}$ à gauche"], bonne:3,
   expl:["L'oxygène est déjà ajusté : ajouter de l'eau à gauche le déséquilibrerait de nouveau.",
         "Les électrons viennent en dernier, et toujours du côté de l'oxydant (à gauche ici). Il reste d'abord l'hydrogène.",
         "On n'ajuste jamais avec $@c{O_2}$ : l'oxygène est ajusté avec l'eau, et il l'est déjà.",
         "Exact : les $2 @c{H_2O}$ ont apporté $4$ H à droite, on ajoute $4 @c{H^+}$ à gauche. Ensuite seulement viennent les charges : $−1 + 4 = +3$ à gauche, $0$ à droite, donc $3 @c{e^-}$ à gauche."]}
 ]},

 {id:"s4", titre:"L'équation de la réaction", blocs:[
  {t:"idee", x:"L'équation d'une réaction d'oxydoréduction s'obtient en **additionnant** deux demi-équations, après les avoir **multipliées** pour que les électrons cédés par le réducteur soient exactement ceux captés par l'oxydant. Les électrons disparaissent alors de l'équation."},
  {t:"p", x:"Reprends le clou. Le fer cède deux électrons : $@c{Fe} = @c{Fe^{2+}} + 2 @c{e^-}$. Les ions cuivre en captent deux : $@c{Cu^{2+}} + 2 @c{e^-} = @c{Cu}$. Chaque atome de fer fournit juste ce qu'il faut à un ion cuivre. On additionne : $@c{Cu^{2+}} + @c{Fe} + 2 @c{e^-} → @c{Cu} + @c{Fe^{2+}} + 2 @c{e^-}$, et les deux électrons, présents de chaque côté, se simplifient : $@c{Cu^{2+}} + @c{Fe} → @c{Cu} + @c{Fe^{2+}}$. Dans l'équation finale, il n'y a jamais d'électrons : ils ont été échangés entre les deux espèces, aucun n'est libre dans la solution."},
  {t:"methode", titre:"Écrire l'équation d'une réaction d'oxydoréduction", etapes:[
   "**Identifier** l'oxydant et le réducteur qui réagissent, d'après l'expérience ou l'énoncé. *En 1re, on ne cherche pas à prévoir lequel réagit : c'est donné.*",
   "**Écrire chaque demi-équation dans le sens où elle se produit** : celle de l'oxydant dans le sens où il capte ($Ox + n @c{e^-} → …$), celle du réducteur dans le sens où il cède ($… → Ox' + n' @c{e^-}$).",
   "**Multiplier pour égaliser les électrons** : chercher le plus petit nombre commun à $n$ et $n'$, et multiplier chaque demi-équation en conséquence. *Piège : additionner sans multiplier. L'équation obtenue ne conserve plus les charges.*",
   "**Additionner** : les électrons, en nombre égal des deux côtés, disparaissent.",
   "**Simplifier** les espèces qui figurent des deux côtés, s'il y en a ($@c{H^+}$, $@c{H_2O}$).",
   "**Vérifier** : chaque élément, et la charge totale, sont les mêmes de chaque côté ; aucun électron ne reste."
  ], exemple:"Le zinc dans un acide : $@c{Zn} = @c{Zn^{2+}} + 2 @c{e^-}$ et $2 @c{H^+} + 2 @c{e^-} = @c{H_2}$. Deux électrons de chaque côté : pas de multiplication. Somme : $@c{Zn} + 2 @c{H^+} → @c{Zn^{2+}} + @c{H_2}$. Charges : $+2$ de chaque côté."},
  {t:"exemple", titre:"Exemple guidé — les ions fer(II) et le permanganate", enonce:"Les ions permanganate $@c{MnO_4^-}$ oxydent les ions fer(II) $@c{Fe^{2+}}$ en milieu acide. Couples : $@c{MnO_4^-}$/$@c{Mn^{2+}}$ et $@c{Fe^{3+}}$/$@c{Fe^{2+}}$. Écrire l'équation de la réaction.", etapes:[
   {q:"Les rôles", r:"$@c{MnO_4^-}$ est l'oxydant (il capte), $@c{Fe^{2+}}$ le réducteur (il cède)."},
   {q:"Les deux demi-équations, dans le bon sens", r:"$@c{MnO_4^-} + 8 @c{H^+} + 5 @c{e^-} → @c{Mn^{2+}} + 4 @c{H_2O}$ (section 3), et $@c{Fe^{2+}} → @c{Fe^{3+}} + @c{e^-}$."},
   {q:"Égaliser les électrons", r:"$5$ d'un côté, $1$ de l'autre : on multiplie la demi-équation du fer par $5$ : $5 @c{Fe^{2+}} → 5 @c{Fe^{3+}} + 5 @c{e^-}$."},
   {q:"Additionner", r:"$@c{MnO_4^-} + 8 @c{H^+} + 5 @c{Fe^{2+}} → @c{Mn^{2+}} + 4 @c{H_2O} + 5 @c{Fe^{3+}}$. Les $5$ électrons ont disparu."},
   {q:"Vérifier", r:"Mn $1 = 1$, O $4 = 4$, H $8 = 8$, Fe $5 = 5$. Charges : $−1 + 8 + 10 = +17$ à gauche, $+2 + 15 = +17$ à droite. C'est exactement l'équation du titrage du fer du chapitre 3."}
  ]},
  {t:"piege", titre:"L'oubli de la multiplication", x:"Additionner sans multiplier donne $@c{MnO_4^-} + 8 @c{H^+} + @c{Fe^{2+}} → @c{Mn^{2+}} + 4 @c{H_2O} + @c{Fe^{3+}}$, où il resterait $4$ électrons « en trop ». Le contrôle des charges le révèle aussitôt : $+9$ à gauche, $+5$ à droite. Une équation d'oxydoréduction dont les charges ne sont pas conservées a presque toujours perdu une multiplication."},
  {t:"figi", nom:"combinaison"},
  {t:"p", x:"Choisis deux couples et avance pas à pas : les deux demi-équations dans le bon sens, la multiplication qui égalise les électrons, la somme, puis la vérification, élément par élément. Essaie le permanganate et l'oxalate : $5$ électrons d'un côté, $2$ de l'autre, il faut aller jusqu'à $10$."},
  {t:"check", q:"On combine $@c{Ag^+} + @c{e^-} = @c{Ag}$ et $@c{Cu} = @c{Cu^{2+}} + 2 @c{e^-}$. Quelle est l'équation ?",
   choix:["$@c{Ag^+} + @c{Cu} → @c{Ag} + @c{Cu^{2+}}$","$2 @c{Ag^+} + @c{Cu} → 2 @c{Ag} + @c{Cu^{2+}}$","$@c{Ag^+} + 2 @c{Cu} → @c{Ag} + 2 @c{Cu^{2+}}$","$2 @c{Ag} + @c{Cu^{2+}} → 2 @c{Ag^+} + @c{Cu}$"], bonne:1,
   expl:["La multiplication a été oubliée : $+1$ à gauche, $+2$ à droite, les charges ne sont pas conservées.",
         "Exact. Le cuivre cède $2$ électrons, chaque ion argent en capte $1$ : il faut deux ions argent par atome de cuivre. Charges : $+2 = +2$.",
         "C'est la mauvaise demi-équation qu'on a multipliée : il faut multiplier celle qui échange **le moins** d'électrons, celle de l'argent.",
         "C'est la réaction écrite à l'envers : ici, c'est le cuivre qui est oxydé par les ions argent, pas l'inverse."]}
 ]},

 {id:"s5", titre:"L'oxydoréduction autour de nous", blocs:[
  {t:"idee", x:"La rouille, les combustions, les titrages du chapitre 3 : ce sont des réactions d'oxydoréduction. Chaque fois, un réducteur cède des électrons à un oxydant."},
  {t:"p", x:"**La corrosion.** Le fer laissé à l'air humide rouille : il est **oxydé** par le dioxygène de l'air, qui est l'oxydant. Le fer cède des électrons, le dioxygène les capte. C'est le même transfert que dans le clou plongé dans le sulfate de cuivre, avec un autre oxydant, et c'est pourquoi on protège le fer par une peinture, qui l'isole de l'air."},
  {t:"p", x:"**La combustion.** Quand le méthane brûle, $@c{CH_4} + 2 @c{O_2} → @c{CO_2} + 2 @c{H_2O}$, le **dioxygène est l'oxydant** et le **combustible est le réducteur**. On ne l'écrit pas ici avec des demi-équations : c'est le dioxygène qui capte les électrons, et le combustible qui les cède. L'énergie libérée par une combustion est étudiée dans une autre partie du programme, celle de la chimie organique."},
  {t:"p", x:"**Les titrages du chapitre 3.** Le programme de 1re prend justement des réactions d'oxydoréduction comme support des titrages. Chaque équation de titrage du chapitre 3 s'obtient en combinant deux couples, comme à la section 4 :"},
  {t:"tbl", head:["Titrage du chapitre 3","Couples","Électrons échangés"], rows:[
   ["$5 @c{Fe^{2+}} + @c{MnO_4^-} + 8 @c{H^+} → 5 @c{Fe^{3+}} + @c{Mn^{2+}} + 4 @c{H_2O}$","$@c{MnO_4^-}$/$@c{Mn^{2+}}$ et $@c{Fe^{3+}}$/$@c{Fe^{2+}}$","$5$"],
   ["$@c{I_2} + 2 @c{S_2O_3^{2-}} → 2 @c{I^-} + @c{S_4O_6^{2-}}$","$@c{I_2}$/$@c{I^-}$ et $@c{S_4O_6^{2-}}$/$@c{S_2O_3^{2-}}$","$2$"],
   ["$5 @c{C_2O_4^{2-}} + 2 @c{MnO_4^-} + 16 @c{H^+} → 10 @c{CO_2} + 2 @c{Mn^{2+}} + 8 @c{H_2O}$","$@c{MnO_4^-}$/$@c{Mn^{2+}}$ et $@c{CO_2}$/$@c{C_2O_4^{2-}}$","$10$"],
   ["$@c{SO_2} + @c{I_2} + 2 @c{H_2O} → @c{SO_4^{2-}} + 2 @c{I^-} + 4 @c{H^+}$","$@c{I_2}$/$@c{I^-}$ et $@c{SO_4^{2-}}$/$@c{SO_2}$","$2$"]
  ]},
  {t:"p", x:"Ce sont les coefficients de ces équations qui donnent la relation à l'équivalence : à l'équivalence du titrage du fer, il faut $5$ ions $@c{Fe^{2+}}$ par ion $@c{MnO_4^-}$, donc $n(@c{Fe^{2+}}) = 5 × n(@c{MnO_4^-})$. Et la couleur aide à voir l'équivalence : le permanganate, violet, devient l'ion $@c{Mn^{2+}}$, incolore ; tant qu'il reste du fer(II), chaque goutte se décolore, et la première goutte qui reste violette signale l'équivalence."},
  {t:"p", x:"**Au laboratoire.** Un fil de cuivre plongé dans une solution d'ions argent se couvre de cristaux d'argent, et la solution bleuit : les ions $@c{Cu^{2+}}$ apparaissent. De l'eau oxygénée $@c{H_2O_2}$ versée sur une solution incolore d'ions iodure $@c{I^-}$ la colore en jaune-brun : du diiode $@c{I_2}$ se forme. Chaque fois, une couleur qui apparaît ou disparaît, un dépôt, un gaz, sont les **données expérimentales** qui permettent d'identifier qui a cédé et qui a capté des électrons."},
  {t:"check", q:"Dans la combustion du méthane, quelle espèce est l'oxydant ?",
   choix:["Le méthane $@c{CH_4}$","Le dioxyde de carbone $@c{CO_2}$","Le dioxygène $@c{O_2}$","L'eau $@c{H_2O}$"], bonne:2,
   expl:["Le méthane est le combustible : il cède des électrons, c'est le **réducteur**.",
         "Le dioxyde de carbone est produit par la combustion : il ne réagit pas.",
         "Exact : dans une combustion, le dioxygène est l'oxydant, il capte les électrons cédés par le combustible.",
         "L'eau est produite par la combustion : elle ne réagit pas."]}
 ]},

 {id:"s6", titre:"Atelier — le titrage du fer par le permanganate", blocs:[
  {t:"p", x:"Cet atelier relie tout le chapitre au titrage du chapitre 3 : on construit l'équation à partir des couples, puis on s'en sert pour trouver une concentration."},
  {t:"atelier", titre:"Combien de fer dans cette solution ?",
   enonce:"On titre $V_1 = 20{,}0$ @u{mL} d'une solution d'ions fer(II) $@c{Fe^{2+}}$, acidifiée, par une solution de permanganate de potassium de concentration $C_2 = 0{,}0200$ @u{mol/L}. L'équivalence est atteinte pour $V_E = 14{,}0$ @u{mL}. Couples : $@c{MnO_4^-}$/$@c{Mn^{2+}}$ et $@c{Fe^{3+}}$/$@c{Fe^{2+}}$.",
   etapes:[
    {q:"Dans la demi-équation ajustée du couple $@c{MnO_4^-}$/$@c{Mn^{2+}}$, combien de molécules d'eau faut-il ?",
     rep:4, tol:0.1,
     aide:"L'eau sert à ajuster l'oxygène : compte les atomes O de l'ion permanganate.",
     diag:[{v:8, m:"$8$, c'est le nombre d'ions $@c{H^+}$. L'eau, elle, ajuste l'**oxygène** : $4$ atomes O dans $@c{MnO_4^-}$, donc $4 @c{H_2O}$."},
           {v:5, m:"$5$, c'est le nombre d'électrons, qui vient à la dernière étape. L'eau ajuste l'oxygène : $4 @c{H_2O}$."}],
     expl:"$4$ atomes O dans $@c{MnO_4^-}$, aucun dans $@c{Mn^{2+}}$ : il faut $4 @c{H_2O}$ à droite. Puis $8 @c{H^+}$ à gauche pour l'hydrogène, et enfin $5 @c{e^-}$ pour les charges : $@c{MnO_4^-} + 8 @c{H^+} + 5 @c{e^-} = @c{Mn^{2+}} + 4 @c{H_2O}$."},

    {q:"Par quel nombre faut-il multiplier la demi-équation du fer, $@c{Fe^{2+}} = @c{Fe^{3+}} + @c{e^-}$, avant d'additionner ?",
     rep:5, tol:0.1,
     aide:"Chaque ion permanganate capte $5$ électrons ; chaque ion fer(II) n'en cède qu'un.",
     diag:[{v:1, m:"Sans multiplication, il resterait $4$ électrons captés sans personne pour les céder : les charges ne seraient pas conservées. Il faut $5$ ions fer pour fournir les $5$ électrons."},
           {v:8, m:"$8$, c'est le nombre d'ions $@c{H^+}$. On cherche à égaliser les **électrons** : $5$ d'un côté, $1$ de l'autre."}],
     expl:"L'oxydant capte $5$ électrons, le réducteur en cède $1$ : on multiplie la demi-équation du fer par $5$. L'équation devient $@c{MnO_4^-} + 8 @c{H^+} + 5 @c{Fe^{2+}} → @c{Mn^{2+}} + 4 @c{H_2O} + 5 @c{Fe^{3+}}$."},

    {q:"Quelle relation lie les quantités de matière à l'équivalence ?",
     choix:["$n(@c{Fe^{2+}}) = n(@c{MnO_4^-})$","$n(@c{MnO_4^-}) = 5 × n(@c{Fe^{2+}})$","$n(@c{Fe^{2+}}) = 8 × n(@c{MnO_4^-})$","$n(@c{Fe^{2+}}) = 5 × n(@c{MnO_4^-})$"],
     bonne:3,
     diag:["Les coefficients ne valent pas $1$ : il faut $5$ ions fer pour un ion permanganate.",
           "C'est la relation à l'envers. Il faut **plus** d'ions fer que d'ions permanganate : $5$ fois plus.",
           "$8$ est le coefficient de $@c{H^+}$, qui ne sont pas titrés.",
           ""],
     expl:"À l'équivalence, les réactifs sont dans les proportions de l'équation : $5$ ions $@c{Fe^{2+}}$ pour $1$ ion $@c{MnO_4^-}$, donc $n(@c{Fe^{2+}}) = 5 × n(@c{MnO_4^-})$. Le contrôle de bon sens : l'espèce qui a le plus grand coefficient est celle dont il faut le plus de moles."},

    {q:"Quelle est la concentration $C_1$ en ions fer(II), en @u{mol/L} ? (trois chiffres significatifs)",
     rep:0.0700, tol:0.0002, unite:"mol/L",
     aide:"$n(@c{MnO_4^-}) = C_2 × V_E$, puis la relation de l'étape précédente, puis $C_1 = @f{n(@c{Fe^{2+}})}{V_1}$.",
     diag:[{v:0.0140, m:"Tu as oublié le facteur $5$ : $C_1 = @f{C_2 V_E}{V_1}$ ne vaut que si les coefficients sont égaux. Ici, $n(@c{Fe^{2+}}) = 5 × n(@c{MnO_4^-})$."},
           {v:0.00280, m:"Tu as divisé par $5$ au lieu de multiplier : il faut **plus** d'ions fer que d'ions permanganate."},
           {v:0.1429, m:"Tu as inversé les volumes : $C_1 = @f{5 × C_2 × V_E}{V_1}$, avec $V_E = 14{,}0$ @u{mL} au numérateur."}],
     expl:"$n(@c{MnO_4^-}) = 0{,}0200 × 14{,}0 × 10^{-3} = 2{,}80 × 10^{-4}$ @u{mol}. Donc $n(@c{Fe^{2+}}) = 5 × 2{,}80 × 10^{-4} = 1{,}40 × 10^{-3}$ @u{mol}, et $C_1 = @f{1{,}40 × 10^{-3}}{20{,}0 × 10^{-3}} = 0{,}0700$ @u{mol/L}."}
   ],
   bilan:"De bout en bout : **ajuster** chaque demi-équation (élément, O avec $@c{H_2O}$, H avec $@c{H^+}$, charges avec $@c{e^-}$), **multiplier** pour égaliser les électrons, **additionner**, puis **lire** les coefficients pour écrire la relation à l'équivalence. Sans le facteur $5$ de la multiplication, la concentration serait fausse d'un facteur $5$."}
 ]},

 {id:"s7", titre:"Récapitulatif", blocs:[
  {t:"liste", items:[
   "**1.** Le Réducteur Rend des électrons (il est oxydé), l'Oxydant les Obtient (il est réduit).",
   "**2.** Un couple Ox/Red s'écrit $Ox + n @c{e^-} = Red$ : les électrons du côté de l'oxydant.",
   "**3.** Ajuster une demi-équation : l'élément principal, puis O avec $@c{H_2O}$, puis H avec $@c{H^+}$, puis les charges avec $@c{e^-}$.",
   "**4.** L'équation de la réaction : multiplier pour égaliser les électrons, additionner, simplifier, vérifier éléments et charges.",
   "**5.** Les coefficients de l'équation donnent la relation à l'équivalence d'un titrage."
  ]},
  {t:"tbl", head:["La question ressemble à…","Ce qu'il faut faire"], rows:[
   ["« Quelle espèce est l'oxydant ? »","Celle qui capte des électrons (elle est réduite)"],
   ["« Écrire la demi-équation du couple… »","Élément, O avec $@c{H_2O}$, H avec $@c{H^+}$, charges avec $@c{e^-}$"],
   ["« Écrire l'équation de la réaction »","Multiplier pour égaliser les électrons, puis additionner"],
   ["« Les charges ne sont pas conservées »","Une multiplication a probablement été oubliée"],
   ["« Relation à l'équivalence »","Lire les coefficients de l'équation : $@f{n_A}{a} = @f{n_B}{b}$"]
  ]},
  {t:"piege", titre:"Les erreurs les plus coûteuses", x:"**1.** Inverser oxydant et réducteur : l'oxydant **capte**.<br>**2.** Ajuster l'oxygène avec $@c{H^+}$ au lieu de $@c{H_2O}$.<br>**3.** Écrire les électrons du côté du réducteur.<br>**4.** Additionner deux demi-équations sans égaliser les électrons."}
 ]}
],
exos:[
 {id:"ox1", niveau:1, type:"qcm", enonce:"Dans la réaction $@c{Zn} + @c{Cu^{2+}} → @c{Zn^{2+}} + @c{Cu}$, quelle espèce est l'oxydant ?",
  choix:["Le zinc $@c{Zn}$","Les ions cuivre $@c{Cu^{2+}}$","Les ions zinc $@c{Zn^{2+}}$","Le cuivre $@c{Cu}$"], bonne:1,
  diag:["Le zinc devient $@c{Zn^{2+}}$ : il **cède** deux électrons. C'est le réducteur.",
        "",
        "Les ions $@c{Zn^{2+}}$ sont **produits** : ce que devient le réducteur une fois oxydé.",
        "Le cuivre est **produit** : ce que devient l'oxydant une fois réduit."],
  corr:["**Je cherche qui gagne et qui perd des électrons.** $@c{Zn} → @c{Zn^{2+}}$ : le zinc perd $2$ électrons. $@c{Cu^{2+}} → @c{Cu}$ : l'ion cuivre en gagne $2$.",
        "**Je nomme.** Celui qui capte des électrons est l'oxydant : $@c{Cu^{2+}}$. Celui qui les cède est le réducteur : $@c{Zn}$.",
        "**Je vérifie avec R-R, O-O.** Le Réducteur Rend : le zinc rend ses électrons. L'Oxydant Obtient : l'ion cuivre les obtient.",
        "**Je conclus.** L'oxydant est $@c{Cu^{2+}}$ ; il est réduit en cuivre."],
  indice:"Regarde, pour chaque réactif, s'il gagne ou perd des électrons en devenant le produit correspondant."},

 {id:"ox2", niveau:1, type:"qcm", enonce:"Qu'est-ce qu'un oxydant ?",
  choix:["Une espèce capable de céder des électrons","Une espèce capable de capter des électrons","Une espèce qui contient forcément de l'oxygène","Une espèce capable de céder des ions $@c{H^+}$"], bonne:1,
  diag:["C'est la définition du **réducteur** : le Réducteur Rend.",
        "",
        "Le mot vient de l'oxygène, mais aujourd'hui un oxydant n'en contient pas forcément : $@c{Cu^{2+}}$ ou $@c{Ag^+}$ sont des oxydants.",
        "Céder des ions $@c{H^+}$, c'est une autre propriété (celle des acides), sans rapport avec les électrons."],
  corr:["**La définition.** Un oxydant est une espèce capable de **capter** un ou plusieurs électrons.",
        "**Le moyen mnémotechnique.** L'Oxydant Obtient des électrons ; le Réducteur Rend.",
        "**Ce qui lui arrive.** En captant des électrons, l'oxydant est **réduit**."],
  indice:"R-R, O-O : le Réducteur Rend, l'Oxydant…"},

 {id:"ox3", niveau:2, type:"qcm", enonce:"Dans la réaction $@c{Zn} + 2 @c{H^+} → @c{Zn^{2+}} + @c{H_2}$, quelle espèce est **oxydée** ?",
  choix:["Le zinc $@c{Zn}$","Les ions $@c{H^+}$","Le dihydrogène $@c{H_2}$","Les ions $@c{Zn^{2+}}$"], bonne:0,
  diag:["",
        "Les ions $@c{H^+}$ captent des électrons pour former $@c{H_2}$ : ils sont **réduits**, ce sont l'oxydant.",
        "Le dihydrogène est **produit** : il ne réagit pas.",
        "Les ions $@c{Zn^{2+}}$ sont **produits** : c'est ce que devient le zinc une fois oxydé."],
  corr:["**Qui cède des électrons ?** $@c{Zn} → @c{Zn^{2+}} + 2 @c{e^-}$ : le zinc.",
        "**Le vocabulaire.** Celui qui cède des électrons est le réducteur, et il est **oxydé**.",
        "**Je conclus.** Le zinc est oxydé. Les ions $@c{H^+}$, qui captent ces électrons, sont réduits : c'est l'oxydant."],
  indice:"Être oxydé, c'est perdre des électrons. Qui en perd ici ?"},

 {id:"ox4", niveau:2, type:"num", enonce:"Combien d'électrons figurent dans la demi-équation ajustée du couple $@c{Cr_2O_7^{2-}}$/$@c{Cr^{3+}}$, en milieu acide ?",
  rep:6, tol:0.1,
  diag:[{v:3, m:"$3$, c'est ce que capte **un** atome de chrome. Il y en a deux dans $@c{Cr_2O_7^{2-}}$ : $2 × 3 = 6$ électrons."},
        {v:9, m:"Tu as oublié l'étape 1 : avec un seul $@c{Cr^{3+}}$ à droite, la charge y vaut $+3$ au lieu de $+6$. Il faut d'abord $2 @c{Cr^{3+}}$, pour les deux atomes de chrome."},
        {v:14, m:"$14$, c'est le nombre d'ions $@c{H^+}$. Les électrons ajustent les **charges** : $−2 + 14 = +12$ à gauche, $+6$ à droite, il en faut $6$."},
        {v:7, m:"$7$, c'est le nombre de molécules d'eau. Les électrons viennent à la dernière étape, pour ajuster les charges."}],
  corr:["**Étape 1, le chrome.** $2$ atomes à gauche : $@c{Cr_2O_7^{2-}} = 2 @c{Cr^{3+}}$.",
        "**Étape 2, l'oxygène.** $7$ atomes O : $+ 7 @c{H_2O}$ à droite.",
        "**Étape 3, l'hydrogène.** $14$ H à droite : $+ 14 @c{H^+}$ à gauche.",
        "**Étape 4, les charges.** À gauche : $−2 + 14 = +12$. À droite : $2 × (+3) = +6$. Il faut $6$ électrons à gauche.",
        "**Résultat.** $@c{Cr_2O_7^{2-}} + 14 @c{H^+} + 6 @c{e^-} = 2 @c{Cr^{3+}} + 7 @c{H_2O}$ : $6$ électrons."],
  indice:"N'oublie pas l'étape 1 : il y a deux atomes de chrome à gauche."},

 {id:"ox5", niveau:2, type:"num", enonce:"Dans la demi-équation ajustée du couple $@c{MnO_4^-}$/$@c{Mn^{2+}}$ en milieu acide, quel est le coefficient des ions $@c{H^+}$ ?",
  rep:8, tol:0.1,
  diag:[{v:4, m:"$4$, c'est le nombre de molécules d'eau. Chacune contient **deux** atomes d'hydrogène : $4 @c{H_2O}$ en apportent $8$."},
        {v:5, m:"$5$, c'est le nombre d'électrons. Les ions $@c{H^+}$ ajustent l'hydrogène apporté par l'eau."}],
  corr:["**Étape 2.** $4$ atomes O dans $@c{MnO_4^-}$ : on ajoute $4 @c{H_2O}$ à droite.",
        "**Étape 3.** Ces $4$ molécules d'eau contiennent $4 × 2 = 8$ atomes d'hydrogène. On ajoute donc $8 @c{H^+}$ à gauche.",
        "**Résultat.** $@c{MnO_4^-} + 8 @c{H^+} + 5 @c{e^-} = @c{Mn^{2+}} + 4 @c{H_2O}$."],
  indice:"Combien d'atomes d'hydrogène dans les molécules d'eau ajoutées à l'étape 2 ?"},

 {id:"ox6", niveau:2, type:"qcm", enonce:"Laquelle de ces demi-équations du couple $@c{SO_4^{2-}}$/$@c{SO_2}$ est correctement ajustée ?",
  choix:["$@c{SO_4^{2-}} + 4 @c{H^+} = @c{SO_2} + 2 @c{H_2O} + 2 @c{e^-}$","$@c{SO_4^{2-}} + 2 @c{H^+} + 2 @c{e^-} = @c{SO_2} + @c{H_2O} + @c{O_2}$","$@c{SO_4^{2-}} + 4 @c{H^+} + 2 @c{e^-} = @c{SO_2} + 2 @c{H_2O}$","$@c{SO_4^{2-}} + 4 @c{H^+} + 4 @c{e^-} = @c{SO_2} + 2 @c{H_2O}$"], bonne:2,
  diag:["Les électrons sont du mauvais côté : ils s'écrivent du côté de l'oxydant, $@c{SO_4^{2-}}$. Et les charges ne sont plus conservées : $+2$ à gauche, $−2$ à droite.",
        "On n'ajuste jamais l'oxygène avec $@c{O_2}$ : seulement avec des molécules d'eau.",
        "",
        "Les éléments sont bons, mais pas les charges : $−2 + 4 − 4 = −2$ à gauche, $0$ à droite. Il faut $2$ électrons, pas $4$."],
  corr:["**Soufre.** $1 = 1$.",
        "**Oxygène.** $4$ à gauche, $2$ dans $@c{SO_2}$ : on ajoute $2 @c{H_2O}$ à droite.",
        "**Hydrogène.** $4$ H à droite : $4 @c{H^+}$ à gauche.",
        "**Charges.** $−2 + 4 = +2$ à gauche, $0$ à droite : $2 @c{e^-}$ à gauche.",
        "**Résultat.** $@c{SO_4^{2-}} + 4 @c{H^+} + 2 @c{e^-} = @c{SO_2} + 2 @c{H_2O}$."],
  indice:"Vérifie, pour chaque proposition, l'oxygène, l'hydrogène, puis les charges."},

 {id:"ox7", niveau:2, type:"num", enonce:"On écrit l'équation de la réaction entre les ions permanganate et les ions fer(II), avec $@c{MnO_4^-} + 8 @c{H^+} + 5 @c{e^-} = @c{Mn^{2+}} + 4 @c{H_2O}$ et $@c{Fe^{3+}} + @c{e^-} = @c{Fe^{2+}}$. Quel est le coefficient des ions $@c{Fe^{2+}}$ dans l'équation ?",
  rep:5, tol:0.1,
  diag:[{v:1, m:"Tu as additionné sans multiplier. L'oxydant capte $5$ électrons, chaque ion fer n'en cède qu'un : il faut $5$ ions fer."},
        {v:8, m:"$8$ est le coefficient de $@c{H^+}$. On cherche celui des ions fer, fixé par l'égalité des électrons."}],
  corr:["**Les électrons.** L'oxydant en capte $5$, chaque ion $@c{Fe^{2+}}$ en cède $1$.",
        "**La multiplication.** On multiplie la demi-équation du fer par $5$.",
        "**L'équation.** $@c{MnO_4^-} + 8 @c{H^+} + 5 @c{Fe^{2+}} → @c{Mn^{2+}} + 4 @c{H_2O} + 5 @c{Fe^{3+}}$.",
        "**Le contrôle des charges.** $−1 + 8 + 10 = +17$ à gauche, $+2 + 15 = +17$ à droite."],
  indice:"Combien d'ions fer faut-il pour fournir les électrons captés par un ion permanganate ?"},

 {id:"ox8", niveau:3, type:"num", enonce:"Les ions permanganate oxydent les ions oxalate, selon les couples $@c{MnO_4^-}$/$@c{Mn^{2+}}$ ($5$ électrons) et $@c{CO_2}$/$@c{C_2O_4^{2-}}$ ($2$ électrons). Combien d'électrons sont échangés dans l'équation de la réaction ?",
  rep:10, tol:0.1,
  diag:[{v:7, m:"Tu as additionné $5$ et $2$. Il faut un nombre que l'on puisse obtenir **à la fois** en multipliant $5$ et en multipliant $2$ : le plus petit est $10$."},
        {v:2, m:"$2$, c'est le nombre d'électrons d'**une** demi-équation de l'oxalate. Il faut égaliser avec les $5$ électrons du permanganate."}],
  corr:["**Les deux nombres.** $5$ électrons pour le permanganate, $2$ pour l'oxalate.",
        "**Le plus petit multiple commun.** $10$ : $5 × 2$ et $2 × 5$.",
        "**Les multiplications.** Permanganate $× 2$, oxalate $× 5$.",
        "**L'équation.** $2 @c{MnO_4^-} + 16 @c{H^+} + 5 @c{C_2O_4^{2-}} → 2 @c{Mn^{2+}} + 8 @c{H_2O} + 10 @c{CO_2}$ : $10$ électrons ont été échangés. C'est l'équation de ce titrage au chapitre 3."],
  indice:"Cherche le plus petit nombre qui soit à la fois un multiple de 5 et de 2."},

 {id:"ox9", niveau:2, type:"num", enonce:"Un morceau de fer de masse $0{,}56$ @u{g} réagit entièrement avec un excès d'ions cuivre, selon $@c{Fe} + @c{Cu^{2+}} → @c{Fe^{2+}} + @c{Cu}$. Quelle masse de cuivre se dépose, en @u{g} ? On donne $M(@c{Fe}) = 55{,}8$ @u{g/mol} et $M(@c{Cu}) = 63{,}5$ @u{g/mol}. (trois chiffres significatifs)",
  rep:0.6373, tol:0.003, unite:"g",
  diag:[{v:0.56, m:"Tu as recopié la masse de fer. Ce sont les **quantités de matière** qui sont égales (une mole de fer donne une mole de cuivre), pas les masses."},
        {v:0.4921, m:"Tu as inversé les masses molaires : $m(@c{Cu}) = n × M(@c{Cu})$, avec $n = @f{m(@c{Fe})}{M(@c{Fe})}$."}],
  corr:["**La quantité de fer.** $n(@c{Fe}) = @f{0{,}56}{55{,}8} ≈ 1{,}00 × 10^{-2}$ @u{mol}.",
        "**L'équation.** Coefficients $1$ et $1$ : une mole de fer donne une mole de cuivre. $n(@c{Cu}) = 1{,}00 × 10^{-2}$ @u{mol}.",
        "**La masse de cuivre.** $m = 1{,}00 × 10^{-2} × 63{,}5 ≈ 0{,}637$ @u{g}.",
        "**Je vérifie.** Un peu plus que la masse de fer : normal, un atome de cuivre est plus lourd qu'un atome de fer."],
  indice:"Passe par les quantités de matière : $n = @f{m}{M}$."},

 {id:"ox10", niveau:3, type:"num", enonce:"On titre $V_1 = 10{,}0$ @u{mL} d'une solution d'ions fer(II) par du permanganate de concentration $C_2 = 0{,}020$ @u{mol/L}. L'équivalence est obtenue pour $V_E = 12{,}0$ @u{mL}. L'équation est $@c{MnO_4^-} + 8 @c{H^+} + 5 @c{Fe^{2+}} → @c{Mn^{2+}} + 4 @c{H_2O} + 5 @c{Fe^{3+}}$. Quelle est la concentration en ions fer(II), en @u{mol/L} ?",
  rep:0.120, tol:0.001, unite:"mol/L",
  diag:[{v:0.024, m:"Tu as oublié le coefficient $5$ : $n(@c{Fe^{2+}}) = 5 × n(@c{MnO_4^-})$ à l'équivalence."},
        {v:0.0048, m:"Tu as divisé par $5$ au lieu de multiplier : il faut **plus** d'ions fer que d'ions permanganate."},
        {v:0.0833, m:"Tu as inversé les volumes : $C_1 = @f{5 × C_2 × V_E}{V_1}$."}],
  corr:["**La quantité de permanganate versée.** $n(@c{MnO_4^-}) = 0{,}020 × 12{,}0 × 10^{-3} = 2{,}4 × 10^{-4}$ @u{mol}.",
        "**La relation à l'équivalence.** $n(@c{Fe^{2+}}) = 5 × n(@c{MnO_4^-}) = 1{,}2 × 10^{-3}$ @u{mol}.",
        "**La concentration.** $C_1 = @f{1{,}2 × 10^{-3}}{10{,}0 × 10^{-3}} = 0{,}120$ @u{mol/L}."],
  indice:"Le coefficient $5$ de l'équation passe dans la relation à l'équivalence."},

 {id:"ox11", niveau:1, type:"qcm", enonce:"Au cours d'une réaction d'oxydoréduction, que devient l'oxydant ?",
  choix:["Il est oxydé, car il cède des électrons","Il disparaît sans rien former","Il est oxydé, car il capte des électrons","Il est réduit, car il capte des électrons"], bonne:3,
  diag:["Céder des électrons, c'est le rôle du **réducteur**.",
        "Il se transforme en le réducteur de son couple : $@c{Cu^{2+}}$ devient $@c{Cu}$.",
        "Il capte bien des électrons, mais capter des électrons, c'est être **réduit**, pas oxydé.",
        ""],
  corr:["**Ce que fait l'oxydant.** Il capte des électrons (l'Oxydant Obtient).",
        "**Le nom de ce qu'il subit.** Gagner des électrons, c'est une **réduction**.",
        "**Je conclus.** L'oxydant est réduit, et devient le réducteur de son couple."],
  indice:"Celui qui gagne des électrons est-il oxydé ou réduit ?"},

 {id:"ox12", niveau:2, type:"qcm", enonce:"On plonge une lame de zinc dans une solution bleue de sulfate de cuivre. Un dépôt rouge apparaît sur la lame, la solution se décolore, et un test révèle des ions $@c{Zn^{2+}}$. Que s'est-il passé ?",
  choix:["Chaque atome de zinc a cédé deux électrons à un ion cuivre","Chaque ion cuivre a cédé deux électrons à un atome de zinc","Le cuivre s'est déposé sans échange d'électrons","Le zinc a capté des électrons de l'eau"], bonne:0,
  diag:["",
        "C'est l'inverse : les ions $@c{Cu^{2+}}$ sont devenus du cuivre neutre, ils ont donc **gagné** des électrons.",
        "Un ion $@c{Cu^{2+}}$ ne devient un atome de cuivre neutre qu'en gagnant deux électrons : il y a forcément un échange.",
        "Les ions $@c{Zn^{2+}}$ formés montrent que le zinc a **perdu** des électrons, pas qu'il en a gagné."],
  corr:["**Les données.** Du cuivre se dépose : les ions $@c{Cu^{2+}}$ sont devenus $@c{Cu}$. Des ions $@c{Zn^{2+}}$ apparaissent : le zinc est devenu $@c{Zn^{2+}}$.",
        "**Ce qu'elles disent.** $@c{Zn} → @c{Zn^{2+}} + 2 @c{e^-}$ et $@c{Cu^{2+}} + 2 @c{e^-} → @c{Cu}$.",
        "**Le transfert.** Chaque atome de zinc cède deux électrons, captés par un ion cuivre. Équation : $@c{Zn} + @c{Cu^{2+}} → @c{Zn^{2+}} + @c{Cu}$.",
        "**Les rôles.** Le zinc est le réducteur (oxydé), les ions cuivre l'oxydant (réduits)."],
  indice:"Pour chaque espèce, compare son état avant et après : a-t-elle gagné ou perdu des électrons ?"},

 {id:"ox13", niveau:3, type:"qcm", enonce:"Un élève écrit : $@c{MnO_4^-} + 8 @c{H^+} + @c{Fe^{2+}} → @c{Mn^{2+}} + 4 @c{H_2O} + @c{Fe^{3+}}$. Qu'est-ce qui ne va pas ?",
  choix:["Il manque des électrons dans l'équation finale","Le manganèse n'est pas conservé","Les charges ne sont pas conservées : il a oublié de multiplier la demi-équation du fer","Le permanganate ne peut pas oxyder les ions fer(II)"], bonne:2,
  diag:["Une équation d'oxydoréduction ne contient **jamais** d'électrons : ils ont été échangés.",
        "Un atome de manganèse de chaque côté : il est bien conservé.",
        "",
        "Si : c'est même la réaction du titrage du fer par le permanganate (chapitre 3)."],
  corr:["**Je vérifie les éléments.** Mn $1 = 1$, O $4 = 4$, H $8 = 8$, Fe $1 = 1$ : tout est bon.",
        "**Je vérifie les charges.** À gauche : $−1 + 8 + 2 = +9$. À droite : $+2 + 3 = +5$. Elles ne sont pas conservées.",
        "**La cause.** L'oxydant capte $5$ électrons, mais un seul ion fer n'en cède qu'un : il fallait multiplier la demi-équation du fer par $5$.",
        "**La bonne équation.** $@c{MnO_4^-} + 8 @c{H^+} + 5 @c{Fe^{2+}} → @c{Mn^{2+}} + 4 @c{H_2O} + 5 @c{Fe^{3+}}$, avec $+17$ de chaque côté."],
  indice:"Compte la charge totale de chaque côté."},

 {id:"ox14", niveau:2, type:"qcm", enonce:"Le fer rouille à l'air humide. Quel est le rôle du dioxygène de l'air ?",
  choix:["Il est le réducteur : il cède des électrons au fer","Il n'intervient pas : c'est l'eau qui oxyde le fer","Il est le catalyseur de la réaction","Il est l'oxydant : il capte les électrons cédés par le fer"], bonne:3,
  diag:["C'est l'inverse : le fer **cède** des électrons (il est oxydé) ; le dioxygène les capte.",
        "Le dioxygène est indispensable : un fer gardé à l'abri de l'air ne rouille pas, même humide.",
        "Le dioxygène est consommé par la réaction : c'est un réactif, pas un catalyseur.",
        ""],
  corr:["**Ce que devient le fer.** Il passe à l'état d'ion dans la rouille : il **cède** des électrons, il est oxydé. C'est le réducteur.",
        "**Qui capte ces électrons ?** Le dioxygène de l'air : c'est l'oxydant, et il est réduit.",
        "**Le lien avec le vocabulaire.** « Oxyder » voulait dire, à l'origine, combiner avec l'oxygène : la rouille en est l'exemple historique."],
  indice:"Le fer cède des électrons. Qui les capte ?"}
]
}

]);
