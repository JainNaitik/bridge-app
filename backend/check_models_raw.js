import keys from "./config/keys.js";

async function getModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${keys.geminiAPIKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`Name: ${m.name}`);
                }
            });
        } else {
            console.log("No models found or error:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

getModels();
