import fetch from 'node-fetch';

export async function generateTest(description) {
    console.log("🔄 Enviando petición a la IA...");

    try {
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen2.5-coder",
                prompt: `Escribe un test en JavaScript con Puppeteer para: ${description}`,
                max_tokens: 300
            })
        });

        if (!response.ok) {
            throw new Error(`❌ Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        // ✅ Leer la respuesta como texto
        const text = await response.text();
        console.log("📄 Respuesta bruta de la IA:\n", text); // Para depuración

        // La API devuelve NDJSON (líneas separadas de JSON), así que lo dividimos
        const jsonObjects = text.trim().split("\n").map(line => JSON.parse(line));

        // ✅ Concatenamos todas las respuestas parciales en un solo string
        const fullResponse = jsonObjects.map(obj => obj.response).join("");

        if (!fullResponse) {
            console.error("❌ Error al generar el test: La IA no devolvió código.");
            return;
        }

        console.log("✅ Código generado:\n", fullResponse);
    } catch (error) {
        console.error("❌ Error al generar el test:", error.message);
    }
}
