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
        // Simply push new data to the in-memory store
        memoryStore.push(dataToSave);
        console.log(memoryStore)
    } catch (err) {
        console.error("Error updating in-memory store:", err);
        throw err;
    }
}

// Handle POST request
export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt || "What is AI?",
        });

        console.log("AI Response:", response.text); // Log the response from AI

        const dataToSave = {
            question: prompt || "What is AI?",
            response: response.text,
        };

        // Save to in-memory storage
        updateMemory(dataToSave);

        // Check if memoryStore has more than 20 questions
        const questionsCount = memoryStore.reduce((count, item) => item.question ? count + 1 : count, 0);
        console.log(questionsCount, "cooked")
        if (questionsCount >= 3) {
            try {
            await fetch("http://localhost:3000/api/question/cards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(memoryStore),
            });
            console.log("Memory store sent to /api/cards");
            } catch (error) {
            console.error("Error sending memory store to /api/cards:", error);
            }
            // Clear the in-memory store after sending data
           // memoryStore = [];
           // console.log("Memory store cleared after sending to /api/cards");
        }

        return NextResponse.json({ message: response.text });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
    }
}

// Handle DELETE request to clear the in-memory storage
export async function DELETE(req: Request) {
    try {
        // Clear the in-memory store
        memoryStore = [];

        // Log the cleared memory store
        console.log("Memory store cleared:", memoryStore);
        console.log("Memory Store Content", memoryStore)

        // Return a success response
        return NextResponse.json({ message: "In-memory data cleared successfully" });
    } catch (error) {
        console.error("Error clearing in-memory data:", error);
        return NextResponse.json({ error: "Failed to clear data" }, { status: 500 });
    }
}