import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize Gemini API with API key
const API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

// In-memory store for questions and responses
let memoryStore = [];

// Function to update in-memory storage with new data
function updateMemory(dataToSave) {
    try {
        memoryStore.push(dataToSave);
        console.log("Current memory store:", memoryStore); // Log entire store
    } catch (err) {
        console.error("Error updating in-memory store:", err);
        throw err;
    }
}

// Unified route to process memory and generate response
export async function POST(req: Request) {
    try {
        // Concatenate all questions and responses from memoryStore
        const concatenatedData = memoryStore.map(item => `Q: ${item.question}\nA: ${item.response}`).join("\n\n");

        // Use the concatenated data as the prompt for Gemini
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: concatenatedData || "No data available in memory.",
        });

        console.log("Gemini Response:", response.text);

        // Optionally save the new response to memory
        const dataToSave = {
            question: "Generated from memory",
            response: response.text,
        };
        updateMemory(dataToSave);

        // Return the generated response
        return NextResponse.json({ generatedInfo: response.text });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
