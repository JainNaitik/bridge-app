import { GoogleGenerativeAI } from "@google/generative-ai";
import keys from "./config/keys.js";

const genAI = new GoogleGenerativeAI(keys.geminiAPIKey);

// A minimal valid blank mp3 base64 (very short) - actually just sending random bytes might fail validation, 
// so let's try to send a text prompt first to check existence, then valid mime check.
// Better: assume "gemini-1.5-flash" IS the right one but maybe needs "gemini-1.5-flash-001".

const models = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro",
    "gemini-1.5-pro-001"
];

async function testVisions() {
    console.log("Testing models for existence...");
    for (const modelName of models) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            console.log(`Testing ${modelName}...`);
            // Simple text test first
            const result = await model.generateContent("Hello?");
            console.log(`✅ ${modelName} responded to text:`, result.response.text().slice(0, 20));

            // If text works, it likely exists. 1.5-flash supports audio.
        } catch (e) {
            console.log(`❌ ${modelName} FAILED:`, e.message);
        }
    }
}

testVisions();
