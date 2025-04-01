import { existsSync, mkdirSync, readdirSync, copyFileSync } from "fs";
import { join, basename, sep, dirname } from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const origenes = [
  "mocha",
  "jest",
  "javascript-testing-best-practices",
];

const extensionesPermitidas = [".test.js", ".spec.js"];
const carpetasPermitidas = ["test", "__tests__"];

const carpetaDestino = join(__dirname, "tests_filtrados");
if (!existsSync(carpetaDestino)) mkdirSync(carpetaDestino);

function esArchivoTest(filePath) {
  const nombre = basename(filePath).toLowerCase();
  return extensionesPermitidas.some(ext => nombre.endsWith(ext)) ||
         carpetasPermitidas.some(dir => filePath.toLowerCase().includes(`${sep}${dir}${sep}`));
}

function copiarTestsDesdeDirectorio(dir, repo) {
  readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      copiarTestsDesdeDirectorio(fullPath, repo);
    } else if (entry.isFile() && esArchivoTest(fullPath)) {
      const nombreArchivoDestino = `${repo}__${entry.name}`;
      const destino = join(carpetaDestino, nombreArchivoDestino);
      copyFileSync(fullPath, destino);
      console.log(`Copiado: ${destino}`);
    }
  });
}

origenes.forEach(repo => {
  const repoPath = join(__dirname, repo);
  if (existsSync(repoPath)) {
    copiarTestsDesdeDirectorio(repoPath, repo);
  } else {
    console.warn(`Repositorio no encontrado: ${repoPath}`);
  }
});

