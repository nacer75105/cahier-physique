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
grep -c '{id:"s' public/app/03-cours-XXX.js   # doit égaler le nombre de sections
grep -o 'id:"s[0-9]*"' public/app/03-cours-XXX.js | sort | uniq -d   # doit ne rien renvoyer (pas de doublon)
```

## Autres rappels

- Après un chantier de contenu, lancer l'agent `relecteur-physique`
  sur le(s) chapitre(s) modifié(s) avant tout commit.
- Régénérer `docs/` (`npm run pages`) avant de committer si
  `public/` a changé.
- `A_VERIFIER.md` (racine) consigne les bugs identifiés mais reportés
  volontairement à un chantier ultérieur — le consulter et le
  compléter plutôt que de corriger un bug isolément hors contexte.
