import { generateTest } from './models/generateTest.js';

const description = process.argv.slice(2).join(" ");  // Capturar argumento desde terminal

if (!description) {
    console.log("⚠️  Debes ingresar una descripción del test.");
    process.exit(1);
}

generateTest(description);
