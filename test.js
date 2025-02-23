import { launch } from 'puppeteer';

(async () => {
  // Lanza la instancia de Chrome (o Chromium)
  const browser = await launch({ headless: false }); // Cambia a true si no quieres ver la interfaz gráfica

  // Abre una nueva pestaña
  const page = await browser.newPage();

  // Navega hasta Google
  await page.goto('https://www.google.com');

  // Espera a que el título de la página sea 'Google'
  await page.waitForSelector('title', { timeout: 5000 });

  // Verifica si el título es 'Google'
  const title = await page.title();
  if (title === 'Google') {
    console.log('Test pasado: El título de la página es "Google"');
  } else {
    console.error('Test fallido: El título de la página no es "Google". Es: ' + title);
  }

  // Cierra el navegador
  await browser.close();
})();