"use client";

import Link from "next/link";
import { useState } from "react";

export default function MedicalAACGrid() {
  // Medical categories with 24 items each
  const medicalData = {
    "Basic Needs": [
      "Water", "Food", "Bathroom", "Rest", "Help", "Medicine", 
      "Blanket", "Pillow", "Clothes", "Wash", "Air", "Light",
      "Temperature", "Position", "Privacy", "Comfort", "Oxygen", "Support",
      "Emergency", "Clean", "Sleep", "Quiet", "Stretcher", "Wheelchair"
    ],
    "Body Parts": [
      "Head", "Arm", "Leg", "Chest", "Stomach", "Back",
      "Throat", "Eyes", "Ears", "Nose", "Mouth", "Neck",
      "Shoulder", "Elbow", "Hand", "Finger", "Hip", "Knee",
      "Foot", "Toe", "Skin", "Heart", "Lungs", "Abdomen"
    ],
    "Pain Description": [
      "Sharp", "Dull", "Throbbing", "Burning", "Constant", "Intermittent",
      "Mild", "Severe", "Localized", "Radiating", "Tingling", "Numbness",
      "Aching", "Stabbing", "Cramping", "Pressure", "Tenderness", "Stiffness",
      "Soreness", "Discomfort", "Pinching", "Gnawing", "Shooting", "Pulsating"
    ],
    "Medical Procedures": [
      "Blood test", "X-ray", "MRI", "Examination", "Dressing change", "Injection",
      "Surgery", "Physical therapy", "Ultrasound", "CT scan", "Biopsy", "Dialysis",
      "Catheter", "Intubation", "Ventilation", "Transfusion", "Radiation", "Chemotherapy",
      "Endoscopy", "Colonoscopy", "EKG", "Echocardiogram", "Angiogram", "Vaccination"
    ],
    "Emotions": [
      "Anxious", "Scared", "Frustrated", "Tired", "Happy", "Confused",
      "Relieved", "Sad", "Angry", "Worried", "Hopeful", "Lonely",
      "Overwhelmed", "Peaceful", "Uncomfortable", "Embarrassed", "Grateful", "Impatient",
      "Nervous", "Pained", "Restless", "Secure", "Tense", "Vulnerable"
    ],
    "Daily Activities": [
      "Walk", "Eat", "Sleep", "Read", "Watch TV", "Shower",
      "Brush teeth", "Get dressed", "Exercise", "Meditate", "Write", "Draw",
      "Listen", "Speak", "Stand", "Sit", "Lie down", "Turn",
      "Breathe", "Cough", "Swallow", "Stretch", "Massage", "Relax"
    ],
    "Staff Members": [
      "Doctor", "Nurse", "Therapist", "Assistant", "Technician", "Specialist",
      "Dietitian", "Pharmacist", "Surgeon", "Radiologist", "Anesthesiologist", "Intern",
      "Resident", "Attending", "Psychologist", "Counselor", "Social worker", "Chaplain",
      "Volunteer", "Administrator", "Cleaner", "Orderly", "Receptionist", "Security"
    ],
    "Patient Specific": Array(24).fill().map((_, i) => `Custom ${i + 1}`)
  };

  const [selectedCategory, setSelectedCategory] = useState("Basic Needs");
  const [currentWords, setCurrentWords] = useState(medicalData["Basic Needs"]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentWords(medicalData[category]);
  };

  const handleWordClick = (word) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    }

    if (selectedCategory === "Patient Specific") {
      // Replace Patient Specific grid with specialized words
      const specializedWords = Array(24).fill().map((_, i) => 
        `${word} ${i + 1}`
      );
      setCurrentWords(specializedWords);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col p-4">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto mb-6 flex justify-between items-center border-b border-gray-700 pb-4">
        <Link 
          href="/" 
          className="text-xl font-bold tracking-tight hover:text-gray-300 transition-colors"
        >
          ← MEDICAL AAC
        </Link>
        <button 
          onClick={() => window.print()}
          className="text-xl font-bold tracking-tight hover:text-gray-300 transition-colors"
        >
          PRINT
        </button>
      </header>

      {/* Main Grid Area */}
      <div className="flex-1 flex max-w-6xl w-full mx-auto">
        {/* Category Selector (First Column) */}
        <div className="w-48 flex-shrink-0 border-r border-gray-700 pr-4">
          {Object.keys(medicalData).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`w-full text-left py-3 px-2 my-1 text-lg font-bold tracking-tight
                ${selectedCategory === category 
                  ? "text-white bg-gray-800" 
                  : "text-gray-400 hover:text-white hover:bg-gray-900"}
                transition-all duration-200 rounded-lg`}
            >
              {category.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Word Grid (6 rows x 4 columns) */}
        <div className="flex-1 grid grid-cols-4 grid-rows-6 gap-3 p-4 ml-4">
          {currentWords.map((word, index) => (
            <button
              key={`${selectedCategory}-${index}`}
              onClick={() => handleWordClick(word)}
              className="border-2 border-gray-700 rounded-lg p-2 flex items-center justify-center 
                hover:border-white hover:bg-gray-900 transition-all duration-200
                h-full min-h-[90px]"
            >
              <span className="text-lg font-bold tracking-tight text-center">
                {word.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}