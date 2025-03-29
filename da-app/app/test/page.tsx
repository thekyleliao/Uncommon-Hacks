"use client";

import { useState } from "react";

export default function Home() {
    const [prompt, setPrompt] = useState("");
    const [aiResponse, setAiResponse] = useState("");

    // Function to send the prompt to the API
    const handleSubmit = async () => {
        if (!prompt) {
            alert("Please provide a prompt!");
            return;
        }

        const res = await fetch("/api/question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        const data = await res.json();
        if (res.ok) {
            setAiResponse(data.message); // Store the AI response
        } else {
            console.error(data.error);
            setAiResponse("Error: " + data.error);
        }
    };

    // Function to send a DELETE request to the API
    const handleDelete = async () => {
        const res = await fetch("/api/question", {
            method: "DELETE",
        });

        if (res.ok) {
            setAiResponse("Deleted successfully!");
        } else {
            const data = await res.json();
            console.error(data.error);
            setAiResponse("Error: " + data.error);
        }
    };

    async function getCardsData() {
        try {
            const testBody = {
                query: "example query",
                filters: {
                    category: "example category",
                },
            };

            const response = await fetch('/api/question/cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testBody),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Related topics:', result.relatedTopics); // Logs the topics from Gemini
        } catch (error) {
            console.error('Failed to fetch cards data:', error);
        }
    }

    // Function to call the /api/question/cards/component endpoint
    const handleComponentCall = async () => {
        try {
            const response = await fetch('/api/question/cards/component', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Component data:', result); // Logs the component data
            setAiResponse(JSON.stringify(result)); // Display the component data
        } catch (error) {
            console.error('Failed to fetch component data:', error);
            setAiResponse('Error: Failed to fetch component data');
        }
    };

    return (
        <div>
            <h1>AI Prompt Runner</h1>

            {/* Input for the user to provide a prompt */}
            <textarea
                placeholder="Enter your prompt here"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                cols={40}
            ></textarea>

            {/* Button to submit the prompt */}
            <button onClick={handleSubmit}>Run</button>

            {/* Button to send a DELETE request */}
            <button onClick={handleDelete}>Delete</button>

            {/* Button to call getCardsData */}
            <button onClick={getCardsData}>Cards</button>

            {/* Button to call handleComponentCall */}
            <button onClick={handleComponentCall}>Component</button>

            {/* Display the response from AI */}
            <div>
                <h2>AI Response:</h2>
                <p>{aiResponse}</p>
            </div>
        </div>
    );
}