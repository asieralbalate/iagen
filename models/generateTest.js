import axios from 'axios';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = "http://localhost:11434/api/generate";  // URL del servidor local de Ollama u otro modelo
const MODEL_NAME = "qwen2.5-coder";  // Modelo de IA a usar

/**
 * Genera un test en JavaScript basado en una descripción en lenguaje natural.
 * @param {string} description - Descripción del test en lenguaje natural.
 */
async function generateTest(description) {
    try {
        // Petición a la IA para generar código
        const response = await axios.post(API_URL, {
            model: MODEL_NAME,
            prompt: `Genera un test automatizado en JavaScript usando Puppeteer basado en esta descripción: ${description}`,
            max_tokens: 300
        });

        const generatedCode = response.data.response;  // Extraer el código generado

        // Definir nombre del archivo basado en la descripción
        const fileName = `tests/generated_${Date.now()}.js`;

        // Guardar el código en un archivo dentro de la carpeta tests/
        await fs.writeFile(fileName, generatedCode, 'utf-8');

        console.log(`✅ Test generado con éxito: ${fileName}`);
    } catch (error) {
        console.error("❌ Error al generar el test:", error.message);
    }
}

// Para pruebas rápidas
// generateTest("Abrir Google y verificar que el título de la página es 'Google'");

export { generateTest };
