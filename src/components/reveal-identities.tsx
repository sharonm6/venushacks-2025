"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, User, ArrowRight, CheckCircle } from "lucide-react";

interface RevealIdentitiesProps {
  currentUserAvatar: string;
  currentUserName: string;
  otherUserAvatar: string;
  otherUserName: string;
  // FIXED: Change the function signature to include otherUserId
  onRevealComplete: (otherUserId: string) => void;
  // NEW: Add the missing otherUserId prop
  otherUserId: string;
  // NEW: Add props to simulate the state
  simulateUser2Ready?: boolean;
}

export default function RevealIdentities({
  currentUserAvatar,
  currentUserName,
  otherUserAvatar,
  otherUserName,
  onRevealComplete,
  otherUserId, // NEW: Now we have access to the other user's ID
  simulateUser2Ready = true, // Default to true for simulation
}: RevealIdentitiesProps) {
  const [animationStep, setAnimationStep] = useState(0);
  const [showUser2Ready, setShowUser2Ready] = useState(false);

  useEffect(() => {
    // Trigger animations in sequence
    const timeouts = [
      setTimeout(() => setAnimationStep(1), 500),
      setTimeout(() => setAnimationStep(2), 1500),
      // NEW: Show "User2 is ready" notification
      setTimeout(() => {
        if (simulateUser2Ready) {
          setShowUser2Ready(true);
        }
      }, 2000),
      setTimeout(() => setAnimationStep(3), 3000), // Delayed to show the notification
    ];

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [simulateUser2Ready]);

  // NEW: Handle the button click with the correct user ID
  const handleViewProfile = () => {
    onRevealComplete(otherUserId);
  };

  // Update the main container and add proper spacing

  return (
    <div className="p-8 min-h-full flex flex-col">
      {/* NEW: User2 Ready Notification */}
      {showUser2Ready && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-500">
          <Card className="bg-green-50 border-green-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-green-300">
                    <AvatarImage src={otherUserAvatar} alt={otherUserName} />
                    <AvatarFallback className="bg-green-100 text-green-600 font-semibold">
                      {otherUserName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-green-700">
                    {otherUserName} is ready to meet! 🎉
                  </p>
                  <p className="text-sm text-green-600">
                    Both of you agreed - revealing identities...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center space-y-8">
        {/* Celebration Header */}
        <div className="text-center space-y-4">
          <div
            className={`transition-all duration-1000 ${
              animationStep >= 1
                ? "opacity-100 scale-100"
                : "opacity-0 scale-50"
            }`}
          >
            <div className="flex justify-center space-x-2 text-4xl mb-4">
              <Sparkles className="h-12 w-12 text-yellow-500 animate-bounce" />
              <span>🎉</span>
              <Sparkles className="h-12 w-12 text-pink-500 animate-bounce delay-100" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Time to Meet!{" "}
            </h1>
            <p className="text-lg text-gray-600"></p>
          </div>
        </div>

        {/* Avatar Reveal Animation - FIXED: Consistent height structure */}
        <div className="flex items-start justify-center space-x-12">
          {/* Current User */}
          <div
            className={`flex flex-col items-center space-y-4 transition-all duration-1000 w-48 ${
              animationStep >= 2
                ? "opacity-100 transform translate-x-0"
                : "opacity-0 transform -translate-x-20"
            }`}
          >
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-purple-300 shadow-lg">
                <AvatarImage src={currentUserAvatar} alt={currentUserName} />
                <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl font-bold">
                  {currentUserName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Ready indicator for current user */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-medium">
                Ready!
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-purple-700">
                {currentUserName}
              </h3>
              <p className="text-sm text-gray-500">That's you!</p>
              <div className="h-6"></div>
            </div>
          </div>

          {/* Connection Arrow */}
          <div
            className={`transition-all duration-1000 delay-500 flex items-center ${
              animationStep >= 2
                ? "opacity-100 scale-100"
                : "opacity-0 scale-50"
            }`}
            style={{ marginTop: "4rem" }} // Align with avatar center
          >
            <div className="relative">
              <ArrowRight className="h-8 w-8 text-pink-500" />
              <div className="absolute -top-1 -left-1 animate-ping">
                <ArrowRight className="h-8 w-8 text-pink-300" />
              </div>
            </div>
          </div>

          {/* Other User */}
          <div
            className={`flex flex-col items-center space-y-4 transition-all duration-1000 w-48 ${
              animationStep >= 2
                ? "opacity-100 transform translate-x-0"
                : "opacity-0 transform translate-x-20"
            }`}
          >
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-pink-300 shadow-lg">
                <AvatarImage src={otherUserAvatar} alt={otherUserName} />
                <AvatarFallback className="bg-pink-100 text-pink-600 text-2xl font-bold">
                  {otherUserName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Ready indicator for other user with animation */}
              <div
                className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-medium transition-all duration-500 ${
                  showUser2Ready
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-50"
                }`}
              >
                Ready!
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-pink-700">
                {otherUserName}
              </h3>
              <p className="text-sm text-gray-500">Your match!</p>
              <div className="h-6 flex items-center justify-center">
                {showUser2Ready && (
                  <div className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs animate-pulse">
                    <CheckCircle className="h-3 w-3" />
                    <span>Just agreed to meet!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-12"></div>
      <div
        className={`transition-all duration-1000 pb-8 ${
          animationStep >= 3
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-10"
        }`}
      >
        <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 border-2 border-purple-200">
          <CardContent className="p-6 text-center space-y-4">
            <h3 className="text-xl font-semibold text-purple-700">
              🚀 Ready to Connect?
            </h3>
            <p className="text-gray-600">
              Amazing! {otherUserName} just agreed to meet up too! You can now
              view their full profile and start planning your meetup!
            </p>

            {/* Timeline of events */}
            <div className="bg-white/80 rounded-lg p-4 space-y-2 text-left">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">You agreed to meet up</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">
                  {otherUserName} agreed to meet up
                </span>
                <span className="text-xs text-gray-500 ml-auto">Just now!</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-600">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Identities revealed!
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleViewProfile}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 text-white text-lg py-3 animate-pulse"
                size="lg"
              >
                <User className="h-5 w-5 mr-2" />
                View {otherUserName}'s Profile
              </Button>

              <p className="text-xs text-gray-500">
                This will take you to their profile page where you can learn
                more about them and plan your meetup!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
