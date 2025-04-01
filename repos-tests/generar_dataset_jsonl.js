import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const carpetaTests = join(__dirname, "tests_filtrados");
const archivoSalida = join(__dirname, "dataset.jsonl");

function generarPromptDesdeContenido(contenido) {
  const primeraLinea = contenido.split('\n').find(l => l.trim().startsWith("//") || l.trim().startsWith("describe") || l.trim().startsWith("it"));
  if (primeraLinea) {
    return primeraLinea.replace(/\/\//, "").replace(/describe|it/, "").replace(/[\(\)'"`]/g, "").trim();
  }
  return "Test generated from existing file";
}

const archivos = readdirSync(carpetaTests);
const dataset = [];

archivos.forEach(nombreArchivo => {
  const ruta = join(carpetaTests, nombreArchivo);
  const contenido = readFileSync(ruta, "utf-8").trim();

  if (contenido.length > 0) {
    const prompt = generarPromptDesdeContenido(contenido);
    dataset.push({ prompt, test: contenido });
  }
});

const jsonl = dataset.map(e => JSON.stringify(e)).join('\n');
writeFileSync(archivoSalida, jsonl, "utf-8");

console.log(`✅ Dataset generado: ${archivoSalida}`);
console.log(`Total de ejemplos: ${dataset.length}`);
