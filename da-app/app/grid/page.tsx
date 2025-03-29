"use client";
import Link from "next/link";
import { useState } from "react";

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

// Material Design icons for emotions
import { MdSentimentVeryDissatisfied, MdSentimentSatisfied, MdMoodBad, MdHelpOutline } from "react-icons/md";

export default function MedicalAACGrid() {
  // Icon mapping for the selected terms
  const iconMap = {
    // Basic Needs
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

    // Body Parts
    "Head": <FaUser className="text-pink-300" size={24} />,
    "Arm": <FaHandsHelping className="text-orange-300" size={24} />,
    "Leg": <FaWalking className="text-green-300" size={24} />,
    "Chest": <FaHeart className="text-red-300" size={24} />,
    "Stomach": <GiStomach className="text-yellow-300" size={24} />,
    "Back": <FaBone className="text-blue-300" size={24} />,
    "Throat": <FaComment className="text-gray-400" size={24} />,
    "Eye": <FaEye className="text-blue-400" size={24} />, // alternative choice
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

    // Emotions
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

    // Daily Activities
    "Walk": <FaWalking className="text-green-400" size={24} />,
    "Eat": <FaUtensils className="text-yellow-400" size={24} />,
    "Sleep": <FaBed className="text-purple-300" size={24} />,
    "Read": <FaBook className="text-blue-200" size={24} />,
    "Watch TV": <FaTv className="text-blue-400" size={24} />,
    "Shower": <FaShower className="text-blue-300" size={24} />,
    "Brush teeth": <FaTooth className="text-white" size={24} />,
    "Get dressed": <FaTshirt className="text-blue-300" size={24} />,
    "Exercise": <FaRunning className="text-green-500" size={24} />,
    "Meditate": <FaHeadSideCough className="text-purple-300" size={24} />, // alternative; you might choose another icon here
    "Write": <FaPen className="text-gray-500" size={24} />,
    "Draw": <FaPaintBrush className="text-pink-400" size={24} />,
    "Listen": <FaHeadphones className="text-gray-400" size={24} />,
    "Speak": <FaComment className="text-gray-400" size={24} />,
    "Stand": <FaUser className="text-gray-400" size={24} />,
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

  // Only the four categories you need
  const medicalData = {
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
    "Daily Activities": [
      "Walk", "Eat", "Sleep", "Read", "Watch TV", "Shower",
      "Brush teeth", "Get dressed", "Exercise", "Meditate", "Write",
      "Draw", "Listen", "Speak", "Stand", "Sit", "Lie down", "Turn",
      "Breathe", "Cough", "Swallow", "Stretch", "Massage", "Relax"
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
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-gray-300 transition-colors">
          ← MEDICAL AAC
        </Link>
        <button onClick={() => window.print()} className="text-xl font-bold tracking-tight hover:text-gray-300 transition-colors">
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
              className="border-2 border-gray-700 rounded-lg p-2 flex flex-col items-center justify-center 
                hover:border-white hover:bg-gray-900 transition-all duration-200
                h-full min-h-[90px]"
            >
              {iconMap[word] && (
                <div className="mb-1">
                  {iconMap[word]}
                </div>
              )}
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