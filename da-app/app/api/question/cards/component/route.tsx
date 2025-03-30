import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize Gemini API with API key
const API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

const component_prompt = "Data is given below. Format final answer as JSON Pairs. For each idea, create a JSON pair of that idea with the name of an appropriate react-icons icon.";

interface MemoryData {
  question: string;
  response: string;
}

// In-memory store for questions and responses
let memoryStore: MemoryData[] = [];

const updateMemory = (dataToSave: MemoryData): void => {
    try {
        // Clear the existing memory store and replace it with the new data
        memoryStore = [dataToSave];
        console.log("Updated memory store:", memoryStore); // Log updated store
    } catch (err) {
        console.error("Error updating in-memory store:", err);
        throw err;
    }
}

// Unified route to process memory and generate response
export async function POST(req: Request) {
    try {
        // Parse the body of the POST request
        const body = await req.json();
        const rawData = body.data;

        // Concatenate the component prompt with the raw data
        const prompt = `${component_prompt}\n\n${rawData}`;

        // Fetch the response from Gemini
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        console.log("Gemini Response:", response.text);

        // Save the Gemini response into memory
        if (!response.text) {
            throw new Error("No response text received from Gemini");
        }

        const dataToSave: MemoryData = {
            question: rawData,
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
