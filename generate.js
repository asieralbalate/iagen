import ollama from 'ollama';
import fs from 'fs';

const userInput = process.argv.slice(2).join(" ");

console.log("🔄 Enviando petición a la IA...");

ollama.chat({ model: "qwen2.5-coder", messages: [{ role: "user", content: `Escribe un test en JavaScript con Puppeteer para: ${userInput}` }] })
  .then(response => {
    let testCode = response.message.content;

    // 🧹 Extraer solo el código limpio
    const match = testCode.match(/```javascript([\s\S]*?)```/);
    if (match) {
      testCode = match[1].trim();
    }

    // 🛠 Reemplazar `require('puppeteer')` con `import { launch } from 'puppeteer'`
    testCode = testCode
      .replace("const puppeteer = require('puppeteer');", "import { launch } from 'puppeteer';")
      .replace(/puppeteer\.launch/g, "launch"); // Reemplazar `puppeteer.launch()` por `launch()`

    // Guardar el código modificado en test.js
    fs.writeFileSync("test.js", testCode);
    console.log("✅ Test generado y guardado en test.js");
  })
  .catch(error => {
    console.error("❌ Error al generar el test:", error);
  });
