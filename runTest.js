import { exec } from 'child_process';
import fs from 'fs';

const userInput = process.argv.slice(2).join(" ");

console.log("🔄 Generando test para: " + userInput + "\n");

// Ejecutamos `generate.js` para generar el código del test
exec(`node generate.js "${userInput}"`, (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Error generando el test: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`⚠️ Advertencias:\n${stderr}`);
    }
    console.log(stdout);

    console.log("\n🚀 Ejecutando el test generado...\n");

    // ✅ Solo ejecutamos test.js UNA SOLA VEZ
    exec("node test.js", (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error ejecutando el test: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ Advertencias:\n${stderr}`);
        }
        console.log(`✅ Resultado del test:\n${stdout}`);

        // Guardamos el resultado en un archivo
        fs.writeFileSync("results.log", stdout || stderr);
        console.log("📄 Resultados guardados en results.log");
    });
});
