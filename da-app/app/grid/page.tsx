"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MedicalData, MedicalCategory } from "@/types";
import type { ReactElement } from "react";

// FontAwesome icons
import {
  FaTint,
  FaUtensils,
  FaToilet,
  FaBed,
  FaQuestionCircle,
  FaPills,
  FaTshirt,
  FaShower,
  FaWind,
  FaLightbulb,
  FaThermometerHalf,
  FaHeadSideCough,
  FaWalking,
  FaHeart,
  FaBone,
  FaLaugh,
  FaSadTear,
  FaAngry,
  FaFrown,
  FaSmile,
  FaMeh,
  FaBook,
  FaTv,
  FaTooth,
  FaPen,
  FaPaintBrush,
  FaHeadphones,
  FaComment,
  FaUser,
  FaSyncAlt,
  FaRunning,
  FaChair,
  FaSpa,
  FaLock,
  FaCouch,
  FaWheelchair,
  FaHandsHelping,
  FaHourglassHalf,
  FaExclamationTriangle,
  FaLungs,
  FaBrain,
  FaEye
} from "react-icons/fa";

// Game Icons
import { GiStomach, GiElbowPad, GiBarefoot, GiMorgueFeet, GiShoulderArmor } from "react-icons/gi";
import { TbHandFinger } from "react-icons/tb";
// Ionicons
import { IoEarOutline } from "react-icons/io5";
import { BsPersonStanding } from "react-icons/bs";
// Material Design icons for emotions
import { MdSentimentVeryDissatisfied, MdSentimentSatisfied, MdMoodBad, MdHelpOutline } from "react-icons/md";

// Icon mapping
const iconMap: Record<string, ReactElement> = {
  "Water": <FaTint className="text-blue-400" size={24} />,
  "Food": <FaUtensils className="text-yellow-500" size={24} />,
  "Bathroom": <FaToilet className="text-gray-400" size={24} />,
  "Rest": <FaBed className="text-purple-400" size={24} />,
  "Help": <FaQuestionCircle className="text-red-400" size={24} />,
  "Medicine": <FaPills className="text-green-400" size={24} />,
  "Blanket": <FaBed className="text-brown-400" size={24} />,
  "Clothes": <FaTshirt className="text-blue-300" size={24} />,
  "Wash": <FaShower className="text-blue-200" size={24} />,
  "Air": <FaWind className="text-gray-300" size={24} />,
  "Light": <FaLightbulb className="text-yellow-300" size={24} />,
  "Temperature": <FaThermometerHalf className="text-red-300" size={24} />,
  "Sleep": <FaBed className="text-purple-300" size={24} />,
  "Position": <FaSyncAlt className="text-gray-500" size={24} />,
  "Privacy": <FaLock className="text-gray-500" size={24} />,
  "Comfort": <FaCouch className="text-green-500" size={24} />,
  "Oxygen": <FaWind className="text-blue-400" size={24} />,
  "Support": <FaHandsHelping className="text-green-400" size={24} />,
  "Emergency": <FaExclamationTriangle className="text-red-500" size={24} />,
  "Clean": <FaSpa className="text-teal-400" size={24} />,
  "Quiet": <FaHeadphones className="text-gray-400" size={24} />,
  "Stretcher": <FaBed className="text-purple-500" size={24} />,
  "Wheelchair": <FaWheelchair className="text-blue-500" size={24} />,
  "Assistance": <FaHandsHelping className="text-green-500" size={24} />,
  "Head": <FaUser className="text-pink-300" size={24} />,
  "Arm": <FaHandsHelping className="text-orange-300" size={24} />,
  "Leg": <FaWalking className="text-green-300" size={24} />,
  "Chest": <FaHeart className="text-red-300" size={24} />,
  "Stomach": <GiStomach className="text-yellow-300" size={24} />,
  "Back": <FaBone className="text-blue-300" size={24} />,
  "Throat": <FaComment className="text-gray-400" size={24} />,
  "Eye": <FaEye className="text-blue-400" size={24} />,
  "Ear": <IoEarOutline className="text-orange-300" size={24} />,
  "Mouth": <FaSmile className="text-orange-400" size={24} />,
  "Neck": <FaBone className="text-blue-300" size={24} />,
  "Shoulder": <GiShoulderArmor className="text-gray-400" size={24} />,
  "Elbow": <GiElbowPad className="text-gray-400" size={24} />,
  "Hand": <FaHandsHelping className="text-orange-400" size={24} />,
  "Finger": <TbHandFinger className="text-gray-500" size={24} />,
  "Hip": <FaUser className="text-gray-500" size={24} />,
  "Knee": <FaRunning className="text-green-400" size={24} />,
  "Foot": <GiBarefoot className="text-green-500" size={24} />,
  "Toe": <GiMorgueFeet className="text-green-500" size={24} />,
  "Skin": <FaTint className="text-pink-300" size={24} />,
  "Heart": <FaHeart className="text-red-400" size={24} />,
  "Lungs": <FaLungs className="text-blue-400" size={24} />,
  "Teeth": <FaTooth className="text-white" size={24} />,
  "Brain": <FaBrain className="text-purple-400" size={24} />,
  "Happy": <FaLaugh className="text-yellow-300" size={24} />,
  "Sad": <FaSadTear className="text-blue-300" size={24} />,
  "Angry": <FaAngry className="text-red-400" size={24} />,
  "Anxious": <MdSentimentVeryDissatisfied className="text-red-400" size={24} />,
  "Scared": <FaFrown className="text-gray-500" size={24} />,
  "Frustrated": <MdMoodBad className="text-orange-400" size={24} />,
  "Tired": <FaBed className="text-purple-400" size={24} />,
  "Confused": <MdHelpOutline className="text-gray-400" size={24} />,
  "Relieved": <FaSmile className="text-green-400" size={24} />,
  "Worried": <FaMeh className="text-gray-400" size={24} />,
  "Hopeful": <MdSentimentSatisfied className="text-blue-400" size={24} />,
  "Lonely": <FaUser className="text-gray-500" size={24} />,
  "Overwhelmed": <FaExclamationTriangle className="text-red-400" size={24} />,
  "Peaceful": <FaSpa className="text-green-400" size={24} />,
  "Uncomfortable": <FaFrown className="text-gray-400" size={24} />,
  "Embarrassed": <FaFrown className="text-gray-500" size={24} />,
  "Grateful": <FaHandsHelping className="text-green-400" size={24} />,
  "Impatient": <FaHourglassHalf className="text-orange-400" size={24} />,
  "Nervous": <FaExclamationTriangle className="text-red-400" size={24} />,
  "Pained": <FaAngry className="text-red-500" size={24} />,
  "Restless": <FaRunning className="text-green-400" size={24} />,
  "Secure": <FaLock className="text-blue-400" size={24} />,
  "Tense": <FaExclamationTriangle className="text-red-400" size={24} />,
  "Vulnerable": <FaFrown className="text-gray-500" size={24} />,
  "Walk": <FaWalking className="text-green-400" size={24} />,
  "Eat": <FaUtensils className="text-yellow-400" size={24} />,
  "Read": <FaBook className="text-blue-200" size={24} />,
  "Watch TV": <FaTv className="text-blue-400" size={24} />,
  "Shower": <FaShower className="text-blue-300" size={24} />,
  "Brush teeth": <FaTooth className="text-white" size={24} />,
  "Get dressed": <FaTshirt className="text-blue-300" size={24} />,
  "Exercise": <FaRunning className="text-green-500" size={24} />,
  "Meditate": <FaHeadSideCough className="text-purple-300" size={24} />,
  "Write": <FaPen className="text-gray-500" size={24} />,
  "Draw": <FaPaintBrush className="text-pink-400" size={24} />,
  "Listen": <FaHeadphones className="text-gray-400" size={24} />,
  "Speak": <FaComment className="text-gray-400" size={24} />,
  "Stand": <BsPersonStanding className="text-gray-400" size={24} />,
  "Sit": <FaChair className="text-gray-500" size={24} />,
  "Lie down": <FaBed className="text-purple-300" size={24} />,
  "Turn": <FaSyncAlt className="text-gray-500" size={24} />,
  "Breathe": <FaWind className="text-blue-400" size={24} />,
  "Cough": <FaHeadSideCough className="text-pink-300" size={24} />,
  "Swallow": <FaUtensils className="text-yellow-300" size={24} />,
  "Stretch": <FaSyncAlt className="text-gray-500" size={24} />,
  "Massage": <FaSpa className="text-green-400" size={24} />,
  "Relax": <FaSpa className="text-green-400" size={24} />
};

const initialMedicalData: MedicalData = {
  "Basic Needs": [
    "Water", "Food", "Bathroom", "Rest", "Help", "Medicine",
    "Blanket", "Clothes", "Wash", "Air", "Light", "Temperature",
    "Sleep", "Position", "Privacy", "Comfort", "Oxygen", "Support",
    "Emergency", "Clean", "Quiet", "Stretcher", "Wheelchair", "Assistance"
  ],
  "Body Parts": [
    "Head", "Arm", "Leg", "Chest", "Stomach", "Back", "Throat",
    "Eye", "Ear", "Mouth", "Neck", "Shoulder", "Elbow", "Hand",
    "Finger", "Hip", "Knee", "Foot", "Toe", "Skin", "Heart",
    "Lungs", "Teeth", "Brain"
  ],
  "Emotions": [
    "Happy", "Sad", "Angry", "Anxious", "Scared", "Frustrated",
    "Tired", "Confused", "Relieved", "Worried", "Hopeful", "Lonely",
    "Overwhelmed", "Peaceful", "Uncomfortable", "Embarrassed",
    "Grateful", "Impatient", "Nervous", "Pained", "Restless",
    "Secure", "Tense", "Vulnerable"
  ],
  "Actions": [
    "Walk", "Eat", "Sleep", "Read", "Watch TV", "Shower",
    "Brush teeth", "Get dressed", "Exercise", "Meditate", "Write",
    "Draw", "Listen", "Speak", "Stand", "Sit", "Lie down", "Turn",
    "Breathe", "Cough", "Swallow", "Stretch", "Massage", "Relax"
  ],
  "Patient Specific": Array(24).fill("").map((_, i) => `Custom ${i + 1}`),
  "Custom": Array(24).fill("")
};

// Create a client component that uses useSearchParams
function GridContent() {
  const [selectedCategory, setSelectedCategory] = useState<MedicalCategory>("Basic Needs");
  const [medicalData, setMedicalData] = useState<MedicalData>(JSON.parse(JSON.stringify(initialMedicalData)));
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const currentWords = medicalData[selectedCategory];

  // Add effect to handle high contrast mode
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // On mount, if survey responses exist, process them via API
  useEffect(() => {
    const patientDataParam = searchParams.get("patientData");
    if (patientDataParam) {
      (async () => {
        try {
          // Parse survey responses (output from your survey)
          const surveyResponses = JSON.parse(patientDataParam);
          // Replace the prompt with the survey output: here we simply pass the JSON string
          const prompt = `Process the following survey responses and generate 24 patient-specific treatment words: ${JSON.stringify(surveyResponses)}`;
          setLoading(true);
          const res = await fetch("/api/question", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt })
          });
          const data = await res.json();
          if (res.ok && data.message) {
            // Assume the API returns a comma-separated string or an array of words
            const words = typeof data.message === "string"
              ? data.message.match(/"([^"]+)"/g)?.map((word: string) => word.replace(/"/g, "").trim()) || []
              : [];
            setMedicalData(prev => ({
              ...prev,
              "Patient Specific": words.slice(0, 24)
            }));
          } else {
            console.error("API Error:", data.error);
          }
        } catch (e) {
          console.error("Error processing survey responses", e);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [searchParams]);

  const handleCategoryClick = (category: MedicalCategory): void => {
    setSelectedCategory(category);
    setEditingIndex(null);
  };

  const handleWordClick = (word: string, index: number): void => {
    if (editingIndex !== null || !word) return;
    
    // Create and configure the speech utterance
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.9; // Slightly slower rate for better clarity
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume
    
    // Stop any ongoing speech before starting new one
    window.speechSynthesis.cancel();
    
    // Speak the word
    window.speechSynthesis.speak(utterance);
  };

  const startEditing = (index: number): void => {
    setEditingIndex(index);
    setEditValue(currentWords[index] || "");
  };

  const saveEdit = (): void => {
    const newWords = [...currentWords];
    if (editingIndex !== null) {
      newWords[editingIndex] = editValue;
      setMedicalData(prev => ({
        ...prev,
        [selectedCategory]: newWords
      }));
      setEditingIndex(null);
    }
  };

  const resetAll = (): void => {
    if (confirm("Are you sure you want to reset all boxes to their default values?")) {
      setMedicalData(JSON.parse(JSON.stringify(initialMedicalData)));
      setEditingIndex(null);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-yellow-400');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-yellow-400');
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newWords = [...currentWords];
    const [draggedWord] = newWords.splice(draggedIndex, 1);
    newWords.splice(dropIndex, 0, draggedWord);

    // Update the medical data while preserving the icon mapping
    setMedicalData(prev => ({
      ...prev,
      [selectedCategory]: newWords
    }));

    // If we're in a non-custom category, update the initial data to match
    if (selectedCategory !== "Custom") {
      const newInitialWords = [...initialMedicalData[selectedCategory]];
      const [draggedInitialWord] = newInitialWords.splice(draggedIndex, 1);
      newInitialWords.splice(dropIndex, 0, draggedInitialWord);
      initialMedicalData[selectedCategory] = newInitialWords;
    }

    setDraggedIndex(null);
  };

  const generateNewCards = async () => {
    if (generating) return; // Prevent multiple simultaneous requests
    
    try {
      setGenerating(true);
      setLoading(true); // Show loading state
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const res = await fetch("/api/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          prompt: "Generate 24 random medical communication words that are commonly needed in a hospital setting. Format as a JSON list of strings."
        })
      });
      
      if (!res.ok) {
        throw new Error("Failed to generate new cards");
      }

      const data = await res.json();
      if (data.message) {
        const words = typeof data.message === "string"
          ? data.message.match(/"([^"]+)"/g)?.map((word: string) => word.replace(/"/g, "").trim()) || []
          : [];
        
        // Only update state if we have valid words
        if (words.length > 0) {
          setMedicalData(prev => ({
            ...prev,
            "Patient Specific": words.slice(0, 24)
          }));
        } else {
          throw new Error("No valid words generated");
        }
      }
    } catch (error) {
      console.error("Error generating new cards:", error);
      alert("Failed to generate new cards. Please try again.");
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col p-4">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto mb-6 flex justify-between items-center border-b border-gray-700 pb-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold tracking-tight hover:text-gray-300 transition-colors">
            ← MEDICAL AAC
          </Link>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className="px-3 py-1 text-sm font-bold rounded-full border-2 transition-colors
              ${highContrast 
                ? 'bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-500' 
                : 'bg-transparent text-white border-white hover:bg-white hover:text-black'}"
          >
            {highContrast ? 'HIGH CONTRAST ON' : 'HIGH CONTRAST OFF'}
          </button>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={generateNewCards}
            disabled={generating}
            className="text-xl font-bold tracking-tight hover:text-gray-300 transition-colors disabled:opacity-50"
          >
            {generating ? 'GENERATING...' : 'NEW CARDS'}
          </button>
          <button 
            onClick={resetAll}
            className="text-xl font-bold tracking-tight hover:text-gray-300 transition-colors"
          >
            RESET ALL
          </button>
          <button onClick={() => window.print()} className="text-xl font-bold tracking-tight hover:text-gray-300 transition-colors">
            PRINT
          </button>
        </div>
      </header>

      {loading && (
        <div className="text-center text-lg text-blue-400 mb-4">
          Loading patient-specific treatments...
        </div>
      )}

      {/* Main Grid Area */}
      <div className="flex-1 flex max-w-6xl w-full mx-auto">
        {/* Category Selector */}
        <div className="w-48 flex-shrink-0 border-r border-gray-700 pr-4">
          {Object.keys(medicalData).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category as MedicalCategory)}
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

        {/* Word Grid */}
        <div className="flex-1 grid grid-cols-4 grid-rows-6 gap-3 p-4 ml-4">
          {currentWords.map((word: string, index: number): ReactElement => (
            <div
              key={`${selectedCategory}-${index}`}
              draggable={!!word}
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(index)}
              className={`border-2 rounded-lg p-2 flex flex-col items-center justify-center 
                hover:border-white hover:bg-gray-900 transition-all duration-200
                h-full min-h-[90px] relative cursor-move
                ${word ? "border-gray-700" : "border-dashed border-gray-500"}
                ${draggedIndex === index ? "opacity-50" : ""}
                ${editingIndex === index ? "cursor-text" : ""}`}
              onClick={() => handleWordClick(word, index)}
            >
              {editingIndex === index ? (
                <div className="w-full">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full bg-gray-800 text-white text-center font-bold mb-2 p-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") setEditingIndex(null);
                    }}
                  />
                  <div className="flex justify-center space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        saveEdit();
                      }}
                      className="px-2 py-1 bg-green-600 rounded text-sm"
                    >
                      Save
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingIndex(null);
                      }}
                      className="px-2 py-1 bg-red-600 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {selectedCategory !== "Custom" && 
                   initialMedicalData[selectedCategory][index] === word && 
                   iconMap[word] && (
                    <div className="mb-1">
                      {iconMap[word]}
                    </div>
                  )}
                  <span className="text-lg font-bold tracking-tight text-center break-words max-w-full">
                    {word ? word.toUpperCase() : "[EMPTY]"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(index);
                    }}
                    className="absolute top-1 right-1 text-xs bg-gray-700 px-1 rounded opacity-0 hover:opacity-100 transition-opacity"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// Main component with Suspense boundary
export default function MedicalAACGrid() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GridContent />
    </Suspense>
  );
}