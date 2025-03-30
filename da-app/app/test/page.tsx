"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QuestionNode, QuestionTree, SurveyAnswers } from "@/types";

// Our question flow:
const questionTree: QuestionTree = {
  1: {
    id: 1,
    question: "Does the patient require medication assistance?",
    options: ["Yes", "No"],
    getNext: (answers) => (answers.includes("Yes") ? 2 : 3),
  },
  2: {
    id: 2,
    question: "Which types of medications does the patient use?",
    options: [
      "Analgesic",
      "Antibiotic",
      "Sedative",
      "Antidepressant",
      "Other Medications",
    ],
    allowCustom: true,
    getNext: () => 3,
  },
  3: {
    id: 3,
    question: "Does the patient experience mobility challenges?",
    options: ["Yes", "No"],
    getNext: (answers) => (answers.includes("Yes") ? 4 : 5),
  },
  4: {
    id: 4,
    question: "What mobility aid does the patient prefer?",
    options: [
      "Walker",
      "Cane",
      "Orthosis",
      "Exoskeleton",
      "Other Mobility Aid",
    ],
    allowCustom: true,
    getNext: () => 5,
  },
  5: {
    id: 5,
    question: "Is nutritional support required?",
    options: ["Yes", "No"],
    getNext: (answers) => (answers.includes("Yes") ? 6 : 7),
  },
  6: {
    id: 6,
    question: "Which nutritional interventions are suitable?",
    options: [
      "Enteral Feeding",
      "Parenteral Nutrition",
      "Dietary Supplements",
      "Customized Diet",
      "Other Nutritional Support",
    ],
    allowCustom: true,
    getNext: () => 7,
  },
  7: {
    id: 7,
    question: "Does the patient use any communication aids?",
    options: ["Yes", "No"],
    getNext: (answers) => (answers.includes("Yes") ? 8 : 9),
  },
  8: {
    id: 8,
    question: "Which communication aid is preferred?",
    options: [
      "Picture Cards",
      "Augmentative Device",
      "Voice Output Communication",
      "Sign Language Support",
      "Other Communication Aid",
    ],
    allowCustom: true,
    getNext: () => 9,
  },
  9: {
    id: 9,
    question: "Is the patient experiencing discomfort or pain?",
    options: ["Yes", "No"],
    getNext: (answers) => (answers.includes("Yes") ? 10 : null),
  },
  10: {
    id: 10,
    question: "What best describes the nature of the patient's pain?",
    options: ["Acute", "Chronic", "Intermittent", "Severe", "Other Pain"],
    allowCustom: true,
    getNext: () => null,
  },
};

export default function PatientQuestionnaire() {
  const router = useRouter();

  // Track the current question id.
  const [currentQId, setCurrentQId] = useState<number>(1);
  // History stack for back navigation.
  const [history, setHistory] = useState<number[]>([]);
  // Store answers as an object: key = question id, value = array of responses.
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  // Local state for current question's selections.
  const [currentSelection, setCurrentSelection] = useState<string[]>([]);
  // For questions that allow custom input.
  const [customInput, setCustomInput] = useState<string>("");
  // Loading flag for the API call.
  const [loading, setLoading] = useState<boolean>(false);

  const currentQuestion = questionTree[currentQId];

  // Toggle a selection.
  const toggleOption = (option: string): void => {
    // For yes/no questions, force single selection.
    if (
      currentQuestion.options.length === 2 &&
      currentQuestion.options.includes("Yes") &&
      currentQuestion.options.includes("No")
    ) {
      setCurrentSelection([option]);
    } else {
      if (currentSelection.includes(option)) {
        setCurrentSelection(currentSelection.filter((item) => item !== option));
      } else {
        setCurrentSelection([...currentSelection, option]);
      }
    }
  };

  // When the user clicks "Next" on a non-final question.
  const handleNext = async (): Promise<void> => {
    let combinedAnswers = currentSelection;
    if (currentQuestion.allowCustom && customInput.trim() !== "") {
      combinedAnswers = [...currentSelection, customInput.trim()];
    }

    // Save the current question's answers.
    setAnswers((prev) => ({
      ...prev,
      [currentQId]: combinedAnswers,
    }));

    // Determine next question.
    const nextQId = currentQuestion.getNext(combinedAnswers);
    // Push current question to history.
    setHistory((prev) => [...prev, currentQId]);
    // Reset selections.
    setCurrentSelection([]);
    setCustomInput("");

    if (nextQId) {
      // Proceed to the next question.
      setCurrentQId(nextQId);
    } else {
      // Final question reached; call handleSubmit.
      await handleSubmit(combinedAnswers);
    }
  };

  // This function is called when question 10 is answered.
  // It compiles all responses into one string and sends it to the API.
  const handleSubmit = async (lastAnswers: string[]): Promise<void> => {
    // Save last question's answers.
    const finalResponses = { ...answers, [currentQId]: lastAnswers };

    // Combine all answers into a summary string.
    let summaryString = "";
    Object.entries(finalResponses).forEach(([qId, responseArr]) => {
      summaryString += `Question ${qId}: ${responseArr.join(", ")}\n`;
    });

    try {
      setLoading(true);
      // Call the AI endpoint with the combined prompt.
      const res = await fetch("/api/generate-words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: summaryString }),
      });

      if (!res.ok) {
        throw new Error("AI API request failed");
      }

      const data = await res.json();
      console.log("AI Data from route:", data);

      // Navigate to grid page with the AI-generated JSON.
      router.push(
        `/grid?patientData=${encodeURIComponent(data.message)}`
      );
    } catch (err) {
      console.error("Error processing AI data:", err);
      // Fallback: send raw responses.
      router.push(
        `/grid?patientData=${encodeURIComponent(JSON.stringify(finalResponses))}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Back button press.
  const handleBack = (): void => {
    if (history.length > 0) {
      const previousQId = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentQId(previousQId);
      setCurrentSelection(answers[previousQId] || []);
      setCustomInput("");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col p-4">
      <header className="w-full max-w-4xl mx-auto mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Non-Verbal Patient Treatment Optimization
        </h1>
        <div className="flex justify-center mt-6 space-x-4">
          {Object.keys(questionTree).map((key) => {
            const id = parseInt(key);
            const answered = answers[id]?.length > 0;
            return (
              <div
                key={id}
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${answered ? "bg-blue-600" : "bg-gray-700"}
                  ${currentQId === id ? "ring-2 ring-blue-400" : ""}`}
              >
                {id}
              </div>
            );
          })}
        </div>
      </header>

      {loading && (
        <div className="text-center text-lg text-blue-400 mb-4">
          Processing AI Response...
        </div>
      )}

      <div className="flex-1 flex max-w-4xl w-full mx-auto">
        <div className="w-full">
          <div className="bg-gray-900 rounded-lg p-8">
            <h2 className="text-xl font-bold mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((option, idx) => {
                const selected = currentSelection.includes(option);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleOption(option)}
                    className={`w-full text-left py-3 px-4 rounded-lg border transition-colors
                      ${
                        selected
                          ? "border-blue-500 bg-blue-900/50"
                          : "border-gray-700 hover:border-gray-600 hover:bg-gray-800"
                      }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {currentQuestion.allowCustom && (
              <div className="mt-4">
                <label
                  className="block text-gray-400 mb-1"
                  htmlFor="customInput"
                >
                  Type your custom answer (if any):
                </label>
                <input
                  id="customInput"
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={history.length === 0}
                className="py-2 px-4 rounded-lg border border-gray-700 disabled:opacity-50 hover:border-gray-600 hover:bg-gray-800"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={
                  currentSelection.length === 0 &&
                  !(currentQuestion.allowCustom && customInput.trim() !== "")
                }
                className="py-2 px-4 rounded-lg border border-gray-700 disabled:opacity-50 hover:border-gray-600 hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
