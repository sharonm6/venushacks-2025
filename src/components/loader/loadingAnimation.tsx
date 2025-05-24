"use client";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
// Import your animation data
import planeAnimation from "../../../public/plane-loading.json"; // Adjust path

interface LoadingAnimationProps {
  text?: string;
  subtext?: string;
}

const LoadingAnimation = ({ text, subtext }: LoadingAnimationProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [displayedSubtext, setDisplayedSubtext] = useState("");
  const [textComplete, setTextComplete] = useState(false);

  // Typewriter effect for main text
  useEffect(() => {
    if (!text) return;

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setTextComplete(true);
      }
    }, 70); // Adjust speed here

    return () => clearInterval(timer);
  }, [text]);

  // Typewriter effect for subtext (starts after main text completes)
  useEffect(() => {
    if (!subtext || !textComplete) return;

    let index = 0;
    const timer = setInterval(() => {
      if (index < subtext.length) {
        setDisplayedSubtext(subtext.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50); // Slightly faster for subtext

    return () => clearInterval(timer);
  }, [subtext, textComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-venus-light/95 backdrop-blur-sm transition-opacity duration-1000">
      {/* Lottie Animation */}
      <div className="h-fit w-36 sm:w-40 mb-8">
        <Lottie animationData={planeAnimation} loop={true} autoplay={true} />
      </div>

      {/* Text with Typewriter Effect */}
      {text && (
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-400 mb-3 font-display relative">
            {displayedText}
            {!textComplete && (
              <span className="animate-pulse text-purple-500">|</span>
            )}
          </h2>

          {subtext && textComplete && (
            <p className="text-lg text-purple-600 dark:text-purple-300 font-medium relative">
              {displayedSubtext}
              {displayedSubtext.length < subtext.length && (
                <span className="animate-pulse text-purple-400">|</span>
              )}
            </p>
          )}
        </div>
      )}

      {/* Loading Dots Animation */}
      <div className="mt-6 flex items-center space-x-2">
        <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
