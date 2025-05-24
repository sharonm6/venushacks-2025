"use client";
import { useEffect, useState } from "react";
import PostcardForm from "@/components/postcard-form";

export default function Page() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 100);
  }, []);

  return (
    <div
      className={`min-h-screen bg-venus-light transition-all duration-1000 ${
        fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-100 opacity-30"></div>

      <div className="relative z-10 mx-auto flex h-full w-full flex-col space-y-8 justify-center items-center">
        <PostcardForm />
      </div>
    </div>
  );
}
