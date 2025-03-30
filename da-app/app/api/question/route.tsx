import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize Gemini API with API key
const API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

interface MemoryData {
    question: string;
    response: string | undefined;
}

// In-memory store for questions and responses
let memoryStore: MemoryData[] = [];

// Function to update in-memory storage with new data
function updateMemory(dataToSave: MemoryData): void {
    try {
        memoryStore.push(dataToSave);
        console.log(memoryStore);
    } catch (err) {
        console.error("Error updating in-memory store:", err);
        throw err;
    }
}

// Helper function for the cards logic
async function processCards(rawData: string): Promise<string | undefined> {
    const component_prompt = "Data is given below. The data is formatted as questions and answers. You will come up with a list of 24 short ideas(1-5 words) related to these questions and answers. Format final answer as JSON LIST.";

    const prompt = `${component_prompt}\n\n${rawData}`;
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });

    console.log("Cards Helper Response:", response.text);
    return response.text;
}

// Helper function for the component logic
async function processComponent(rawData: string): Promise<string | undefined> {
    const component_prompt = "Data is given below. For each idea, create a JSON List with 24 appropriate words. Be less scientific. Be more patient friendly.";

    const prompt = `${component_prompt}\n\n${rawData}`;
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });

    console.log("Component Helper Response:", response.text);
    return response.text;
}

// Handle POST request for questions
export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt || "What is AI?",
        });

        console.log("AI Response:", response.text);

        const dataToSave: MemoryData = {
            question: prompt || "What is AI?",
            response: response.text,
        };

        // Save to in-memory storage
        updateMemory(dataToSave);

        // Check if memoryStore has more than 20 questions
        const questionsCount = memoryStore.reduce((count, item) => (item.question ? count + 1 : count), 0);
        console.log(questionsCount, "cooked");

        let componentResponse: string | undefined = undefined;

        if (questionsCount >= 1) {
            try {
                const cardsResponse = await processCards(JSON.stringify(memoryStore));
                console.log("Cards Processed:", cardsResponse);

                if (cardsResponse) {
                    componentResponse = await processComponent(cardsResponse);
                    console.log("Component Processed:", componentResponse);
                }
            } catch (error) {
                console.error("Error processing cards or component:", error);
            }
        }

        return NextResponse.json({ 
            message: componentResponse  
        });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
    }
}

// Handle DELETE request to clear the in-memory storage
export async function DELETE(req: Request) {
    try {
        memoryStore = [];
        console.log("Memory store cleared:", memoryStore);

        return NextResponse.json({ message: "In-memory data cleared successfully" });
    } catch (error) {
        console.error("Error clearing in-memory data:", error);
        return NextResponse.json({ error: "Failed to clear data" }, { status: 500 });
    }
}
