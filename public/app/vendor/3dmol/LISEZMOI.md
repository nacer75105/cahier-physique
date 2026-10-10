# 3Dmol.js (bibliothèque tierce, vendorisée)

- **Nom** : 3Dmol.js — visualisation moléculaire WebGL.
- **Version exacte** : 2.5.5 (publiée le 2026-05-22).
- **Téléchargement** : paquet npm officiel
  `https://registry.npmjs.org/3dmol/-/3dmol-2.5.5.tgz`, fichier
  `build/3Dmol-min.js`, le 2026-10-10. Empreinte du paquet vérifiée contre le
  registre : sha1 `932bff7b1490bf5ef531a36f9af439eae942d7ed`.
- **Projet** : https://3dmol.org — https://github.com/3dmol/3Dmol.js
- **Licence** : BSD-3-Clause (fichier `LICENSE` ci-joint, et
  `3Dmol-min.js.LICENSE.txt` pour les composants inclus).

**Ne pas éditer.** Pour mettre à jour, remplacer les fichiers en bloc par ceux
d'une nouvelle version épinglée, et mettre à jour ce LISEZMOI.

Servi depuis `public/app/vendor/3dmol/` (pré-caché par le service worker pour
le fonctionnement hors ligne) et chargé à la demande par
`public/app/02-molecule-3d.js`, seulement quand une figure 3D s'affiche. Aucune
fonction réseau de la bibliothèque (téléchargement depuis RCSB ou PubChem)
n'est utilisée : les molécules viennent de `public/app/molecules/`.
