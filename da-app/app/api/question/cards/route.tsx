import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize Gemini API with API key
const API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });
const component_prompt = "Data is given below. The data is formatted as questions and answers. You will come up with a list of 20 short ideas(1-5 words) related to these questions and answers. Format final answer as JSON LIST.";

// Unified route to process memory and generate response
export async function POST(req: Request) {
    try {
        // Parse the incoming request body
        const body = await req.json();
        const inputData = body.rawData;

        // Use raw data as input for Gemini
        const prompt = `${component_prompt}\n\n${inputData}`;

        // Fetch the response from Gemini
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        console.log("Gemini Response:", response.text);

        // Return the generated response
        return NextResponse.json({ generatedInfo: response.text });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
