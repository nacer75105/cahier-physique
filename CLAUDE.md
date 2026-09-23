# Cahier de Physique-Chimie — Première générale

Application de cours de physique-chimie (programme de Première),
avec figures manipulables, exercices corrigés et suivi de
progression stocké côté élève (`localStorage`, doublé côté serveur
si l'appli tourne avec la couche IA). Contenu dans
`public/app/03-cours-*.js` (un fichier par groupe de chapitres),
moteur de figures dans `public/app/02-figures.js`, état et rendu
dans `public/app/01-noyau.js` et `public/app/04-vue.js`.

`docs/` est une copie générée de `public/` (voir `build-pages.js`,
`npm run pages`) pour la version hors ligne sur GitHub Pages :
ne jamais éditer `docs/` à la main, toujours régénérer.

## Règle impérative : id de section, jamais de position

**Chaque section de cours porte un `id` stable et arbitraire**
(`id:"s1"`, `"s2"`, ...), assigné une fois pour toutes dans l'ordre
où la section a été créée. Exemple :

```js
{id:"s3", titre:"Compter les entités : la mole", blocs:[ ... ]}
```

**Pourquoi.** Le suivi de progression (`S.chap[id].lu` dans
`public/app/01-noyau.js`, coché via le bouton « Marquer comme
comprise » dans `sectionNode()`, `public/app/04-vue.js`) identifie
une section par son `id`, jamais par sa position dans le tableau
`sections:[...]`. Avant le 2026-09-16, il n'existait aucun `id` : la
progression se basait sur l'**index de position**. Insérer une
section n'importe où décalait silencieusement la progression déjà
cochée de toutes les sections suivantes — un bug de fond, découvert
après coup sur les chapitres Titrage (ch. 3) et Cristaux (ch. 6), qui
ont dû être réinitialisés faute de pouvoir reconstruire ce qui avait
réellement été lu avant l'insertion.

**Ce qu'il faut faire pour toute nouvelle section, dans n'importe quel
chapitre :**
- Lui donner un `id` **jamais utilisé auparavant dans ce chapitre**,
  qu'elle soit insérée en dernier, au milieu, ou en tout début. Le
  numéro suivant le plus haut déjà attribué dans le chapitre convient
  (`grep 'id:"s' <fichier>` pour vérifier avant de choisir).
- **Ne jamais renuméroter** les sections existantes pour « garder
  l'ordre propre ». Le numéro n'a pas à correspondre à la position :
  c'est justement ce qui le rend stable.
- **Ne jamais réutiliser** l'id d'une section supprimée.
- L'id est **indépendant du titre** : reformuler un titre ne doit
  jamais entraîner de changer son id.

Ce principe est déjà appliqué aux exercices (`id:"ti1"`, `"ti2"`...
dans `exos:[...]`) depuis l'origine — c'est pour ça qu'ils n'ont
jamais eu ce problème. Les sections l'ont maintenant aussi.

Avant de committer un chapitre modifié, vérifier qu'aucune section
n'a été oubliée :
```sh
node -e 'const fs=require("fs"),d=process.argv[1]||"public/app";let ko=0;for(const f of fs.readdirSync(d).filter(x=>/^03-cours-.*\.js$/.test(x))){const s=fs.readFileSync(d+"/"+f,"utf8"),c=[...s.matchAll(/id:"([a-z-]+)", n:(\d+)/g)];c.forEach((m,k)=>{const p=s.slice(m.index,k+1<c.length?c[k+1].index:s.length),ids=[...p.matchAll(/\{id:"(s\d+)"/g)].map(x=>x[1]),nb=(p.match(/blocs:\[/g)||[]).length,dbl=ids.filter((x,j)=>ids.indexOf(x)!==j);if(dbl.length||nb!==ids.length)ko=1;console.log("ch"+m[2]+" "+m[1]+" : "+nb+" sections, "+ids.length+" id"+(dbl.length?" — DOUBLON "+dbl.join(", "):"")+(nb!==ids.length?" — SECTION SANS ID":""))})}process.exit(ko)'
```

Elle vérifie **chapitre par chapitre** (un fichier `03-cours-*.js` en
contient souvent plusieurs, chacun avec ses `s1`, `s2`… : les mêmes id
dans deux chapitres ne sont pas un doublon), signale toute section sans
`id` et tout doublon au sein d'un chapitre, et sort en code `1` dans ces
deux cas. L'ancienne version (`grep … | sort | uniq -d` sur le fichier
entier) criait au doublon dès qu'un fichier portait deux chapitres —
une vérification qui se trompe finit ignorée.

## Autres rappels

- Après un chantier de contenu, lancer l'agent `relecteur-physique`
  sur le(s) chapitre(s) modifié(s) avant tout commit.
- Régénérer `docs/` (`npm run pages`) avant de committer si
  `public/` a changé.
- `A_VERIFIER.md` (racine) consigne les bugs identifiés mais reportés
  volontairement à un chantier ultérieur — le consulter et le
  compléter plutôt que de corriger un bug isolément hors contexte.

## Diagnostics numériques : deux scripts d'audit, à lancer tous les deux

```sh
node outils/verifier-diags.mjs         # questions écrites dans 03-cours-*.js
node outils/verifier-generateurs.mjs   # générateurs de 06-generateurs.js
```

Ils ne se recouvrent pas. `verifier-diags` refait chaque calcul erroné
des questions **écrites en dur** ; `verifier-generateurs` rejoue 3 000
tirages par générateur, parce qu'un générateur calcule ses distracteurs
au hasard et qu'un défaut peut n'apparaître qu'une fois sur mille —
`verifier-diags` ne voit rien de ce code. Tous deux acceptent un ou
plusieurs identifiants en argument pour se limiter (`… titrage`,
`… fo-poids`) et sortent en code `1` si un défaut est trouvé.

**Les lancer après toute modification d'un générateur ou du moteur de
diagnostics** — `fabriquer()` dans `06-generateurs.js`, `fenetreDiag()`
dans `01-noyau.js`, `diagnostic()` dans `04-vue.js`.

`fenetreDiag()` (`01-noyau.js`, exposée par `window.APP`) est la
**définition unique** de « à quelle distance d'un distracteur faut-il
tomber pour recevoir son message ». `04-vue.js` et `06-generateurs.js`
l'appellent ; les deux scripts d'audit l'**extraient** du fichier et
s'arrêtent si l'extraction échoue. Ne jamais en recopier une version
locale : elle a vécu en trois copies, elles ont divergé, et le filtre
de `fabriquer()` écartait alors des diagnostics justes.

Même règle pour `diagnostic()` (`04-vue.js`) : les deux scripts
l'**extraient** du fichier (arrêt en code `2` si l'extraction échoue),
ils n'en recopient jamais les seuils ni les messages. Si l'extraction
casse, corriger l'extraction — pas recopier la règle.

Ce que les audits contrôlent, par défaut compté dans le code de sortie :
- **MORT / MASQUÉ / FAUX / FENÊTRE** : les fenêtres des distracteurs
  de `exo.diag`, à leur valeur exacte.
- **GÉNÉRIQUE** (les deux scripts) : les messages « mauvais signe »,
  « double », « moitié » de `diagnostic()`. −r, 2r et r/2 arrondis ou
  tronqués de 1 à 4 chiffres, qui auraient été acceptés au signe ou au
  facteur 2 près, doivent recevoir leur message ; r × 10ⁿ (n de −3 à 3)
  ne doit jamais le recevoir.
- **ARRONDI** (`verifier-generateurs`) : chaque distracteur conservé,
  arrondi ou tronqué à **2 ou 3** chiffres — ce que l'élève tape
  vraiment —, doit garder son propre message, et la bonne réponse
  arrondie ne doit capter aucun distracteur. À **1 chiffre**, c'est
  affiché pour information seulement (`--tout`), jamais compté : deux
  erreurs à moins d'un facteur 2 s'y confondent forcément.

Avant le 2026-09-23, les audits ne testaient que les valeurs exactes de
`exo.diag` : ils étaient aveugles aux messages génériques et aux
arrondis, et deux défauts ont dormi faute d'être mesurés (voir
`A_VERIFIER.md`, « Moteur — défauts de `diagnostic()` »).

**Ordre imposé quand on ajoute un contrôle d'audit** : corriger d'abord
les générateurs ou questions qu'il signalerait, **puis** activer son
comptage dans le code de sortie — sinon l'audit échoue dès son ajout et
masque toute autre régression. Et vérifier qu'il mord : sur une copie,
réintroduire l'ancien défaut doit le faire sortir en code `1`.
