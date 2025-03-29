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

        // Send the response to the /api/question/cards/component endpoint
        const componentResponse = await fetch("http://localhost:3000/api/question/cards/component", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body), // Send the original body as is
        });

        if (!componentResponse.ok) {
            throw new Error(`Failed to send data to /api/question/cards/component: ${componentResponse.statusText}`);
        }

        const componentResponseData = await componentResponse.json();

        // Return the response from the /component endpoint
        return NextResponse.json({ componentResponse: componentResponseData });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
