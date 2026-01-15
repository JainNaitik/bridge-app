import { GoogleGenerativeAI } from "@google/generative-ai";
import keys from "./config/keys.js";

const genAI = new GoogleGenerativeAI(keys.geminiAPIKey);

async function listModels() {
    const modelsToTest = ["gemini-1.0-pro", "gemini-1.5-pro", "gemini-1.5-flash-latest"];

    for (const modelName of modelsToTest) {
        try {
            console.log(`Testing ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            console.log(`Success with ${modelName}!`);
            return;
        } catch (error) {
            console.error(`Error with ${modelName}:`, error.message);
        }
    }
}

listModels();
