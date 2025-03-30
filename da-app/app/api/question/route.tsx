import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize Gemini API with API key
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.error("API_KEY is not set in environment variables");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

interface MemoryData {
    question: string;
    response: string;
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

// Retry logic for API calls
async function retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;
            if (attempt < maxRetries - 1) {
                const delay = initialDelay * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw lastError;
}

// Helper function for the cards logic with timeout and retry
async function processCards(rawData: string): Promise<string | undefined> {
    try {
        const component_prompt = "Generate 24 short treatment ideas (1-5 words) based on these Q&A. Format as JSON list.";
        const prompt = `${component_prompt}\n\n${rawData}`;
        
        const response = await retryWithBackoff(async () => {
            return await Promise.race([
                ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: prompt,
                }),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("Request timeout")), 5000)
                )
            ]) as { text: string };
        });

        console.log("Cards Helper Response:", response.text);
        return response.text;
    } catch (error) {
        console.error("Error in processCards:", error);
        return undefined;
    }
}

// Helper function for the component logic with timeout and retry
async function processComponent(rawData: string): Promise<string | undefined> {
    try {
        const component_prompt = "Create 24 patient-friendly treatment words based on these ideas. Format as JSON list.";
        const prompt = `${component_prompt}\n\n${rawData}`;
        
        const response = await retryWithBackoff(async () => {
            return await Promise.race([
                ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: prompt,
                }),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("Request timeout")), 5000)
                )
            ]) as { text: string };
        });

        console.log("Component Helper Response:", response.text);
        return response.text;
    } catch (error) {
        console.error("Error in processComponent:", error);
        return undefined;
    }
}

// Handle POST request for questions
export async function POST(req: Request) {
    try {
        if (!API_KEY) {
            console.error("API_KEY is not set");
            return NextResponse.json(
                { error: "API key is not configured" },
                { status: 500 }
            );
        }

        const { prompt } = await req.json();
        
        // Check cache for similar questions
        const cachedResponse = memoryStore.find(item => 
            item.question.toLowerCase() === prompt.toLowerCase()
        );
        
        if (cachedResponse) {
            return NextResponse.json({ message: cachedResponse.response });
        }

        const response = await retryWithBackoff(async () => {
            return await Promise.race([
                ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: prompt || "What is AI?",
                }),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("Request timeout")), 5000)
                )
            ]) as { text: string };
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
                const cardsResponse = await processCards(JSON.stringify([dataToSave]));
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
            message: componentResponse || "Processing incomplete" 
        });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { 
                error: "Failed to process request",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
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
