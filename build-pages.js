/* =====================================================================
   Copie de secours hors ligne (docs/ pour GitHub Pages)
   ---------------------------------------------------------------------
   L'application fonctionne sans serveur : elle détecte l'absence de
   /api/ping et masque simplement les fonctions qui appellent Claude.
   Ce script recopie public/ dans docs/ pour publier cette version.

   Lancer :  npm run pages

   Attention : la progression de la version hors ligne est stockée dans
   le navigateur, séparément de celle du serveur. C'est un dépannage,
   pas un usage quotidien.
   ===================================================================== */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ICI = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ICI, "public");
const DST = path.join(ICI, "docs");

/* Le service worker sert les scripts du cours depuis son cache, et ne le
   renouvelle que si son nom (VERSION) change. Resté figé à « v8 » du
   31 août au 18 septembre 2026, il a laissé les appareils déjà installés
   sur l'ancien contenu malgré toutes les corrections. On calcule donc la
   version à partir du contenu lui-même : un fichier modifié donne une
   nouvelle version, sans rien à retenir. */
const SW = path.join(SRC, "sw.js");
const empreinte = crypto.createHash("sha256");
(function lire(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) lire(p);
    else if (p !== SW) empreinte.update(e.name).update(fs.readFileSync(p));
  }
})(SRC);
const version = "cahier-physique-" + empreinte.digest("hex").slice(0, 10);
const sw = fs.readFileSync(SW, "utf8");
const swNeuf = sw.replace(/const VERSION = "[^"]*";/, `const VERSION = "${version}";`);
if (swNeuf === sw && !sw.includes(version)) throw new Error("VERSION introuvable dans public/sw.js");
fs.writeFileSync(SW, swNeuf);

fs.rmSync(DST, { recursive: true, force: true });
fs.cpSync(SRC, DST, { recursive: true });

let n = 0;
(function compter(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) compter(path.join(d, e.name));
    else n++;
  }
})(DST);

console.log(`docs/ régénéré : ${n} fichiers copiés depuis public/ (service worker ${version})`);
