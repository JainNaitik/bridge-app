import { GoogleGenerativeAI } from "@google/generative-ai";
import keys from "./config/keys.js";

const genAI = new GoogleGenerativeAI(keys.geminiAPIKey);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init to get access, though not strictly needed for listModels usually, but SDK specifics vary. 
        // Actually the SDK doesn't expose listModels directly on the main class in all versions? 
        // Wait, typically it's specific.
        // Let's just try to infer from a simple test of 1.5-flash-001.
        // Or better, let's just try the generateContent on 'gemini-1.5-flash-001' directly in this script to see if it works.

        console.log("Testing gemini-1.5-flash-001...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        const result = await modelFlash.generateContent("Hello?");
        console.log("gemini-1.5-flash-001 worked!");
    } catch (error) {
        console.error("gemini-1.5-flash-001 failed:", error.message);

        try {
            console.log("Testing gemini-pro-vision...");
            const modelVision = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
            // gemini-pro-vision needs image, so this might fail validation if I don't send one, but let's see if 404 model not found.
            // Actually for vision model text-only prompt throws different error.
        } catch (err) {
            console.log("gemini-pro-vision error:", err.message);
        }
    }
}

listModels();
