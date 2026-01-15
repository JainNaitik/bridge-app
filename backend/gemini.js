import { GoogleGenerativeAI } from "@google/generative-ai";
import keys from "./config/keys.js";

const genAI = new GoogleGenerativeAI(keys.geminiAPIKey);

export async function summarizeText(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are an expert educational assistant. 
      Please provide a concise, easy-to-understand summary of the following text.
      Use bullet points for key concepts.
      
      Text: "${text}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI API Error Details:", JSON.stringify(error, null, 2));
    console.error("Original Error:", error);
    return `Failed to generate summary. Error: ${error.message || "Unknown error"}`;
  }
}

export async function describeImage(imageBase64, mimeType = "image/jpeg") {
  try {
    // Using model alias found in listModels
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      Describe this educational image in detail. 
      If it contains text, extract it. 
      If it's a diagram, explain the concepts.
      Keep the tone helpful and accessible for a visually impaired student.
    `;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return `Failed to describe image. Error: ${error.message}`;
  }
}

export async function analyzeFile(fileBase64, mimeType) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }); // Using stable alias for better quota

    let prompt = "Analyze this file.";
    if (mimeType === "application/pdf") {
      prompt = `
        You are an expert reading assistant. 
        Summarize the key takeaways from this PDF document.
        Extract the main points, definitions, and any important dates or figures.
        Format the output with clear headings and bullet points.
      `;
    } else if (mimeType.startsWith("audio/")) {
      prompt = `
        You are an expert transcriber and summarizer.
        Listen to this audio file.
        1. Provide a verbatim transcript (if it's short) or a detailed summary of the conversation/speech.
        2. Highlight key action items or important information.
      `;
    }

    const filePart = {
      inlineData: {
        data: fileBase64,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return `Failed to analyze file. Error: ${error.message}`;
  }
}
