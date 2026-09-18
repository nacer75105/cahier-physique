# Calculs refaits des diagnostics

Un fichier par fichier de cours (`03-cours-mouvement.js` → `03-cours-mouvement.mjs`),
lu par `outils/verifier-diags.mjs`.

```js
export default {
  // clé = "<id chapitre>:<id exercice>" ou "<id chapitre>:<id section>/atelier<k>/etape<j>"
  "forces:fo6": {
    rep: () => 9.0e9 * (2.0e-6 * 3.0e-6) / 0.30 ** 2,          // la bonne réponse, refaite
    diags: [                                                     // même ordre que `diag` dans le cours
      { erreur: "distance pas au carré", calc: () => 9.0e9 * 6.0e-12 / 0.30 },
      { erreur: "multiplie par d²",      calc: () => 9.0e9 * 6.0e-12 * 0.30 ** 2 },
      { erreur: "facteur 10 perdu",      calc: () => 6 },
    ],
  },
};
```

Règle d'or : **chaque `calc` refait l'erreur décrite par le message `m`, à partir
des données de l'énoncé — jamais en recopiant `v`.** Si le message ne décrit
aucun calcul reproductible (« tu as recopié la masse »), `calc` renvoie la
donnée recopiée ; s'il n'y a vraiment rien à refaire, mettre
`null` ou `{ note: "pourquoi" }` à la place.
