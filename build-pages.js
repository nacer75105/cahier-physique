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
import { fileURLToPath } from "node:url";

const ICI = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ICI, "public");
const DST = path.join(ICI, "docs");

fs.rmSync(DST, { recursive: true, force: true });
fs.cpSync(SRC, DST, { recursive: true });

let n = 0;
(function compter(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) compter(path.join(d, e.name));
    else n++;
  }
})(DST);

console.log(`docs/ régénéré : ${n} fichiers copiés depuis public/`);
