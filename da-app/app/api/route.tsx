import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize Gemini API with API key
const API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Handle GET request
export async function GET() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Explain how AI works in a few words",
    });

    return NextResponse.json({ message: response.text });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
  }
}

// Handle POST request (Optional: Use for custom prompts)
export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt || "What is AI?",
    });

    return NextResponse.json({ message: response.text });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
  }
}
