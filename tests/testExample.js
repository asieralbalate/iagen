import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

// Navegamos a Google
await page.goto('https://www.google.com');

// Tomamos una captura de pantalla
await page.screenshot({ path: 'tests/google_test.png' });

console.log('Test completado: Se ha generado una captura de pantalla en tests/google_test.png');

await browser.close();
