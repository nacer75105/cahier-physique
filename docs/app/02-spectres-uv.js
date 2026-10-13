/* =====================================================================
   Spectres d'absorption UV-visible RÉELS (ch2, s2), jamais dessinés à la main.
   Sources : base PhotochemCAD 2.1a (H. Du et al., Photochem. Photobiol. 68,
   141, 1998 ; J. M. Dixon et al., Photochem. Photobiol. 81, 212, 2005),
   fichiers diffusés par S. Prahl (Oregon Medical Laser Center, omlc.org,
   2017) ; bleu de méthylène mesuré par S. Prahl (omlc.org/spectra/mb).
   Téléchargés le 2026-10-13 (outils/spectres-uv/donnees/).
   a = absorbance rapportée à sa valeur au maximum du visible, en pour mille,
   tous les 2 nm de 380 à 700 nm (moyenne des mesures à ±1 nm ; celles de
   la rhodamine B s'arrêtent à 700 nm). La figure
   la multiplie par l'absorbance maximale choisie : toute la courbe est
   proportionnelle à la concentration (loi de Beer-Lambert).
   Fabriqué par outils/spectres-uv/fabriquer.py (voir son LISEZMOI) :
   ne pas éditer à la main.
   ===================================================================== */
window.SPECTRES_UV = {
  "bleu-methylene": {nom:"bleu de méthylène", solvant:"eau", source:"S. Prahl, Oregon Medical Laser Center (omlc.org/spectra/mb), solution à 10 µmol/L, cuve de 1 cm", lmax:664, l0:380, pas:2,
   a:[15,15,16,16,17,17,17,17,17,17,15,15,13,12,10,9,9,8,8,7,8,8,8,8,9,10,9,10,11,12,12,13,14,14,15,16,17,18,19,21,20,22,24,23,25,25,28,27,29,30,31,33,36,41,34,37,37,37,39,39,38,40,39,39,39,39,39,39,39,40,40,40,42,45,45,47,50,52,53,59,60,65,69,73,79,84,91,96,103,109,118,127,137,147,155,162,169,180,191,202,217,229,249,259,281,297,324,343,362,389,413,435,454,476,487,505,515,522,525,529,532,536,538,545,553,564,580,597,623,646,672,701,738,774,814,846,892,931,989,949,966,986,1000,1000,987,960,915,856,776,688,605,521,431,368,307,249,202,165,133,107,88]},
  "rhodamine-b": {nom:"rhodamine B", solvant:"éthanol", source:"PhotochemCAD (Du 1998, Dixon 2005), mesure de R.-C. A. Fuh sur Cary 3, via omlc.org", lmax:542, l0:380, pas:2,
   a:[18,16,19,20,20,21,20,21,22,22,21,20,19,19,19,19,18,18,17,15,13,11,10,8,5,4,2,1,0,0,0,0,1,2,3,4,6,8,10,14,18,22,26,31,36,41,47,53,60,67,76,86,97,109,124,142,161,181,202,224,248,269,289,307,323,339,355,373,396,423,454,493,539,591,651,714,780,839,896,947,984,1000,995,967,917,847,764,671,567,476,390,315,247,190,142,103,73,53,36,23,13,7,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
  "proflavine": {nom:"proflavine", solvant:"eau (pH 7)", source:"PhotochemCAD (Du 1998, Dixon 2005), mesure de R.-C. A. Fuh sur Cary 3, via omlc.org", lmax:444, l0:380, pas:2,
   a:[161,175,189,205,221,239,257,277,299,322,345,368,393,419,449,481,514,549,582,624,667,711,754,794,833,869,901,930,955,975,989,999,1000,996,983,958,922,875,825,756,681,601,522,447,379,318,264,219,177,143,118,97,80,67,56,47,40,34,30,27,24,22,20,20,19,18,17,17,16,16,16,16,16,15,15,16,16,15,15,15,15,15,14,14,14,14,14,15,15,15,15,14,14,14,14,13,13,12,12,12,12,12,12,12,11,12,12,11,11,11,11,11,11,11,11,12,11,11,11,11,11,11,10,11,11,11,11,10,10,10,10,11,10,10,10,10,10,10,9,9,9,9,9,9,9,9,10,9,9,9,9,9,9,9,9,9,8,9,9,9,9]},
};
