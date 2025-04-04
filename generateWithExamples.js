import fs from 'fs';
import ollama from 'ollama';

const dataset = fs.readFileSync('./repos-tests/dataset.jsonl', 'utf-8')
  .split('\n')
  .filter(line => line.trim())
  .map(line => JSON.parse(line));

const ejemplos = dataset.slice(0, 2);

const userInput = process.argv.slice(2).join(" ");

let prompt = ejemplos.map(e => {
  return `Descripción: ${e.prompt}\nCódigo:\n${e.test}\n`;
}).join('\n');

prompt += `\nAhora escribe un test para:\nDescripción: ${userInput}\nCódigo:\n`;

ollama.chat({
  model: "qwen2.5-coder",
  messages: [{ role: "user", content: prompt }]
}).then(response => {
  let code = response.message.content;

  const match = code.match(/```javascript([\s\S]*?)```/);
  if (match) code = match[1].trim();

  code = code
    .replace("const puppeteer = require('puppeteer');", "import { launch } from 'puppeteer';")
    .replace(/puppeteer\.launch/g, "launch");

  fs.writeFileSync('test.js', code);
  console.log("✅ Test generado con ejemplos y guardado en test.js:\n");
  console.log(code);
}).catch(err => {
  console.error("❌ Error al generar el test:", err.message);
});
