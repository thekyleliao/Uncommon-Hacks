"use client";
import { useState } from 'react';
import Link from 'next/link';

const questions = [
  {
    id: 1,
    question: "What is the patient's primary communication need?",
    options: [
      "Basic needs (food, water, bathroom)",
      "Medical symptoms (pain, discomfort)",
      "Emotional states (happy, sad, anxious)",
      "Daily activities (walking, reading, TV)",
      "Social interaction (family, friends)"
    ]
  },
  {
    id: 2,
    question: "How does the patient typically communicate?",
    options: [
      "Verbal speech with difficulty",
      "Gestures/pointing",
      "Writing/drawing",
      "Communication board",
      "No consistent method"
    ]
  },
  {
    id: 3,
    question: "What are the patient's most frequent needs?",
    options: [
      "Physical comfort (positioning, temperature)",
      "Medical care (medication, treatment)",
      "Personal care (hygiene, dressing)",
      "Entertainment (TV, music, reading)",
      "Social interaction"
    ]
  },
  {
    id: 4,
    question: "What cognitive level best describes the patient?",
    options: [
      "Fully cognizant, just speech impaired",
      "Some cognitive impairment",
      "Significant cognitive challenges",
      "Fluctuating awareness",
      "Unknown"
    ]
  },
  {
    id: 5,
    question: "What environment will this be used in?",
    options: [
      "Hospital room",
      "Rehabilitation facility",
      "Home care",
      "Long-term care facility",
      "Multiple environments"
    ]
  }
];

export default function PatientQuestionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion + 1]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Store answers in localStorage for the grid page
      localStorage.setItem('patientResponses', JSON.stringify(newAnswers));
      setCompleted(true);
    }
  };

  const generatePatientSpecificItems = () => {
    // This would be more sophisticated based on actual responses
    const defaultItems = Array(24).fill().map((_, i) => `Custom ${i + 1}`);
    
    // Example customization based on answers
    if (answers[1]?.includes("Basic needs")) {
      return ["Water", "Food", "Bathroom", "Rest", ...defaultItems.slice(4)];
    }
    if (answers[1]?.includes("Medical symptoms")) {
      return ["Pain", "Discomfort", "Medication", "Help", ...defaultItems.slice(4)];
    }
    return defaultItems;
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gray-900 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-6">Questionnaire Complete</h1>
          <p className="mb-8">Your responses have been saved and will be used to personalize the communication board.</p>
          <Link 
            href={{
              pathname: '/grid',
              query: { patientData: JSON.stringify(generatePatientSpecificItems()) }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Continue to Communication Board
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col p-4">
      <header className="w-full max-w-4xl mx-auto mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Patient Assessment</h1>
        <div className="flex justify-center mt-6 space-x-4">
          {questions.map((_, index) => (
            <div 
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center
                ${index <= currentQuestion ? 'bg-blue-600' : 'bg-gray-700'}
                ${index === currentQuestion ? 'ring-2 ring-blue-400' : ''}`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </header>

      <div className="flex-1 flex max-w-4xl w-full mx-auto">
        <div className="w-full">
          <div className="bg-gray-900 rounded-lg p-8">
            <h2 className="text-xl font-bold mb-6">
              {questions[currentQuestion].question}
            </h2>
            
            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left py-3 px-4 rounded-lg border transition-colors
                    ${answers[currentQuestion + 1] === option 
                      ? 'border-blue-500 bg-blue-900/50' 
                      : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800'}`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="py-2 px-4 rounded-lg border border-gray-700 disabled:opacity-50"
              >
                Back
              </button>
              <div className="text-gray-400">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}