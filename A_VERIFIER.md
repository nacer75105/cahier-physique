# À vérifier

Notes de suivi entre deux chantiers : bugs identifiés mais reportés
volontairement à un moment où ils seront traités avec le reste du
contexte concerné, plutôt que corrigés isolément.

## Figure « Loi d'Ohm » — `$...$` non passé par `T()`

**Trouvé le** 2026-09-16, pendant la relecture du chantier Titrage
(chapitre 3), par l'agent `relecteur-physique`.

**Fichier** : `public/app/02-figures.js`, `MODELES["ohm"]`, ligne 929 :

```js
note.innerHTML = (I > 0.5)
  ? "Forte intensité : la lampe brille, mais la résistance chauffe d’autant — la puissance dissipée suit le <b>carré</b> de l’intensité."
  : "Augmente la tension, ou diminue la résistance : l’intensité monte et la lampe s’éclaire. C’est toute la loi d’Ohm, $U = R × I$.";
```

**Le problème.** Dans une figure manipulable (`figi`), `note` est un
`el("div","figNote")` rempli directement par `note.innerHTML = ...`,
sans passer par `T()` (voir `FIGURE_MANIP`, `02-figures.js`, qui
retourne le résultat de `MODELES[...]()` tel quel — seul le chemin des
figures statiques `fig` passe par `T()`, dans `figure()`). Le texte
`$U = R × I$` s'affichera donc **littéralement**, dollars visibles,
au lieu d'un rendu mathématique avec $U$ et $I$ en italique.

**Le correctif** (identique à celui déjà appliqué à
`MODELES["titrage-ph"]` le même jour, voir commit du chapitre 3) :
`T` est déjà en portée dans ce module IIFE
(`var A = window.APP, T = A.T, el = A.el;` en tête de fichier) — il
suffit d'écrire `note.innerHTML = T("...")` autour de la chaîne
concernée, comme fait pour `titrage-ph`.

**Pourquoi ce n'est pas corrigé maintenant.** Signalé pendant un
chantier sur un autre chapitre (Titrage, ch. 3). À traiter avec le
chapitre 10 (« Énergie et puissance électriques »,
`public/app/03-cours-energie.js`, id `"electrique"`), qui contient
cette figure, pour rester dans le même contexte de relecture plutôt
que de corriger un fichier isolément.

**Vérifié le 2026-09-16** : c'est un cas isolé. Les huit autres blocs
`note.innerHTML = (condition) ? ... : ...` de ce fichier (lignes 987,
1041, 1159, 1224, 1303, 1604, 1730, plus les affectations directes)
ne contiennent aucun `$` — seule la figure « ohm » est concernée.
