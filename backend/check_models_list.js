import { GoogleGenerativeAI } from "@google/generative-ai";
import keys from "./config/keys.js";

const genAI = new GoogleGenerativeAI(keys.geminiAPIKey);

async function listModels() {
    try {
        // There isn't a direct "listModels" on the client instance in some versions,
        // but usually it's checked via GET request or we iterate known ones.
        // However, the error message says "Call ListModels".
        // The Node SDK usually exposes ModelService.
        console.log("Trying to check models...");

        // We will just try a few known ones and print success
        const candidates = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-flash-001",
            "gemini-1.5-pro",
            "gemini-1.5-pro-latest",
            "gemini-pro",
            "gemini-pro-vision",
            "gemini-2.0-flash-exp"
        ];

        for (const m of candidates) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Hello");
                console.log(`✅ ${m} is WORKING`);
            } catch (e) {
                console.log(`❌ ${m} FAILED: ${e.message.split(':')[2] || e.message}`);
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
