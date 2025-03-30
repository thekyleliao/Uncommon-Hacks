import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize Gemini API with API key
const API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

interface IconWordPair {
  icon: string;
  word: string;
}

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

// Handle POST request (for custom prompts)
export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // Ensure your prompt instructs the AI to output valid JSON.
    const fullPrompt = `${prompt}\n\nPlease return the output as valid JSON in the following format:
[
  { "icon": "URL_or_icon_identifier", "word": "Your Treatment Word" },
  ...
]
Ensure you provide 24 objects.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: fullPrompt,
    });

    if (!response.text) {
      throw new Error("No response text received from AI");
    }

    // Option 1: If the response.text is already valid JSON,
    // you can try to parse it before returning.
    let parsed: IconWordPair[];
    try {
      parsed = JSON.parse(response.text);
    } catch (err) {
      // If parsing fails, return the raw text for debugging.
      console.error("Error parsing AI response:", err);
      return NextResponse.json({ error: "Invalid JSON output from AI", raw: response.text }, { status: 500 });
    }

    return NextResponse.json({ message: parsed });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
  }
}
