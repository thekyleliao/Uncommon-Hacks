"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from 'react';

const Home = () => {
  const videoAssets = [
    {
      id: 'effervescent-tablet',
      src: "/videos/effervescent-tablet.mp4",
      fallback: "/images/tablet-fallback.jpg",
      attribution: "Stock Footage provided by VikStrel, from Pond5",
      link: "https://www.pond5.com/stock-footage/item/72618253-throwing-effervescent-tablet-glass",
      alt: "Effervescent tablet dissolving in water"
    },
    {
      id: 'mri-scan',
      src: "/videos/brain-mri-scan.mp4",
      fallback: "/images/mri-fallback.jpg",
      attribution: "Stock Footage provided by Fanta, from Pond5",
      link: "https://www.pond5.com/stock-footage/item/61744311-doctor-examines-human-brain-mri-scan-touch-screen-computer",
      alt: "Doctor analyzing brain MRI scan"
    },
    {
      id: 'tomographic',
      src: "/videos/tomographic-image.mp4",
      fallback: "/images/scan-fallback.jpg",
      attribution: "Stock Footage provided by Oleg2d, from Pond5",
      link: "https://www.pond5.com/stock-footage/item/111317542-doctor-eyes-examining-tomographic-image-close",
      alt: "Medical tomography scan being reviewed"
    },
    {
      id: 'coronavirus',
      src: "/videos/coronavirus.mp4",
      fallback: "/images/virus-fallback.jpg",
      attribution: "Stock Footage provided by Groosha, from Pond5",
      link: "https://www.pond5.com/stock-footage/item/127958812-microscopic-coronavirus-covid-19-enlarged-macro-shot-4k",
      alt: "Microscopic view of coronavirus"
    }
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoState, setVideoState] = useState({
    status: 'loading',
    error: null
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video playback management
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentVideo = videoAssets[currentVideoIndex];

    const handleLoadStart = () => {
      setVideoState({ status: 'loading', error: null });
    };

    const handleCanPlay = () => {
      video.play()
        .then(() => {
          setVideoState({ status: 'playing', error: null });
        })
        .catch(error => {
          setVideoState({ status: 'autoplay-blocked', error: error.message });
        });
    };

    const handleError = () => {
      const error = video.error || new Error('Video playback error');
      setVideoState({ status: 'error', error: error.message });
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    video.load();

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [currentVideoIndex]);

  // Video rotation
  useEffect(() => {
    if (videoAssets.length <= 1) return;

    const rotationInterval = setInterval(() => {
      setCurrentVideoIndex(prev => (prev + 1) % videoAssets.length);
    }, 10000);

    return () => clearInterval(rotationInterval);
  }, []);

  const currentVideo = videoAssets[currentVideoIndex];

  return (
    <main className="flex flex-col items-center font-[family-name:var(--font-geist-sans)]">
      {/* Hero Section */}
      <section className="w-full min-h-screen relative overflow-hidden">
        {/* Video Container */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            key={currentVideo.id}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover ${
              videoState.status === 'error' ? 'hidden' : 'block'
            }`}
          >
            <source src={currentVideo.src} type="video/mp4" />
          </video>

          {/* Fallback Image */}
          {videoState.status === 'error' && (
            <img
              src={currentVideo.fallback}
              alt={currentVideo.alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Loading Indicator */}
          {videoState.status === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-pulse text-white">Loading video...</div>
            </div>
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Gradient Overlay at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-50 bg-gradient-to-t from-black to-transparent z-10"></div>
        </div>

        {/* Attribution */}
        {videoState.status === 'playing' && (
          <div className="absolute bottom-4 right-4 z-20 text-white text-[10px] opacity-70 hover:opacity-100 transition-opacity">
            <a
              href={currentVideo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {currentVideo.attribution}
            </a>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white">
            MedBoard.Design
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 mt-4">
            Patient communication done better
          </p>

          <div className="mt-20 flex justify-center">
            <Link
              href="/survey"
              className="rounded-full bg-white hover:bg-gray-200 text-black font-medium text-lg px-8 py-4 transition-colors duration-200"
            >
              Take Your Survey Now
            </Link>
          </div>
        </div>
      </section>

      {/* Gradient Transition */}
      <div className="w-full h-50 bg-gradient-to-b from-black to-black -mt-32 pointer-events-none"></div>

      {/* Stats Section with Purpose Header */}
      <section className="w-full bg-black text-white">
        {/* Purpose Header */}
        <div className="max-w-4xl mx-auto pt-20 px-8 sm:px-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Our Purpose
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Bridging communication gaps in critical care through innovative solutions
            that empower patients and clinicians alike.
          </p>
        </div>

        {/* Stats Content */}
        <div className="max-w-4xl mx-auto pb-20 pt-20 px-8 sm:px-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            The Communication Crisis in Critical Care
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-900 p-6 rounded-xl">
              <div className="text-2xl font-semibold mb-3 text-blue-400">62%</div>
              <p className="text-lg text-gray-300">
                of ventilated patients experience <span className="text-white font-medium">severe frustration</span> when unable to communicate (Happ et al., 2006).
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl">
              <div className="text-2xl font-semibold mb-3 text-blue-400">76% → 30%</div>
              <p className="text-lg text-gray-300">
                Projected frustration reduction with communication boards <span className="text-white font-medium">(P &lt; .001)</span>.
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl">
              <div className="text-2xl font-semibold mb-3 text-blue-400">69%</div>
              <p className="text-lg text-gray-300">
                of patients requested <span className="text-white font-medium">personalized communication aids</span>.
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl">
              <div className="text-2xl font-semibold mb-3 text-blue-400">Evidence-Based</div>
              <div className="text-lg text-gray-300">
                Our solution implements <a href="https://pubmed.ncbi.nlm.nih.gov/17098155/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:no-underline">clinical research</a>:
              </div>
              <ul className="list-disc pl-5 mt-3 space-y-2 text-lg text-gray-300">
                <li>Dynamic pain assessment</li>
                <li>Emotion recognition</li>
                <li>Personalized needs matrices</li>
              </ul>
            </div>
          </div>

          <div className="mt-20 flex justify-center">
            <Link
              href="/survey"
              className="rounded-full bg-white hover:bg-gray-200 text-black font-medium text-lg px-8 py-4 transition-colors duration-200"
            >
              See Our Solution
            </Link>
          </div>
        </div>

        {/* How It Works Section - Updated layout */}
               <div className="w-full bg-black py-20">
          <div className="max-w-2xl mx-auto px-8 sm:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
              How It Works
            </h2>
            
            {/* Vertical stack of wider boxes */}
            <div className="space-y-6 w-full">
              <div className="bg-gray-900 p-8 rounded-xl w-full">
                <div className="text-2xl font-semibold mb-4 text-blue-400">1. Simple Questionnaire</div>
                <p className="text-lg text-gray-300">
                  Complete our straightforward questionnaire at your own pace. Continue answering questions until you're completely satisfied with your responses. You can revisit and modify any answers at any time.
                </p>
              </div>

              <div className="bg-gray-900 p-8 rounded-xl w-full">
                <div className="text-2xl font-semibold mb-4 text-blue-400">2. Intelligent Customization</div>
                <p className="text-lg text-gray-300">
                  Your personalized communication sheet generates immediately. Click any term to reveal related phrases and adjacent concepts. Fine-tune your sheet by manually editing any elements that need adjustment.
                </p>
              </div>

              <div className="bg-gray-900 p-8 rounded-xl w-full">
                <div className="text-2xl font-semibold mb-4 text-blue-400">3. Print & Use Immediately</div>
                <p className="text-lg text-gray-300">
                  Select your preferred terms and print your customized communication sheet at no cost. While other services charge up to $50 per sheet, we believe essential communication tools should be freely accessible to everyone in need.
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-16">
              <Link
                href="/survey"
                className="rounded-full bg-white hover:bg-gray-200 text-black font-medium text-lg px-8 py-4 transition-colors duration-200"
              >
                Begin Your Questionnaire
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
