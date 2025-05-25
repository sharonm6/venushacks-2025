"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AvatarWithSpeechBubble from "@/components/avatar-speech-bubble";
import LoadingAnimation from "@/components/loader/loadingAnimation";

export default function Home() {
  const [mailStatus, setMailStatus] = useState<
    "loading" | "empty" | "received"
  >("loading");
  const [showAvatar, setShowAvatar] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Check database for mail status
    fetchUserMailStatus().then((status) => {
      setMailStatus(status);
      if (status === "received") {
        // Show avatar with speech bubble slightly delayed
        setTimeout(() => setShowAvatar(true), 500);
        // Hide avatar after 6 seconds
        setTimeout(() => setShowAvatar(false), 6500);
      }
    });
  }, []);

  const handleMailboxClick = () => {
    if (mailStatus === "received") {
      // Start navigation sequence
      setIsNavigating(true);
      setShowAvatar(false); // Hide avatar immediately

      // Show Lottie animation after short delay
      setTimeout(() => {
        setShowGif(true);
      }, 300);

      // Start fade out animation
      setTimeout(() => {
        setFadeOut(true);
      }, 3000); // Start fade after 3 seconds

      // Navigate to matches after fade completes
      setTimeout(() => {
        router.push("/matches");
      }, 3500); // Navigate 0.5s after fade starts
    } else if (mailStatus === "empty") {
      // Go to survey to get matched
      router.push("/survey");
    }
  };

  return (
    <div className="mx-auto flex w-full flex-col space-y-8 pt-8 relative overflow-hidden">
      {/* Avatar with Speech Bubble */}
      <AvatarWithSpeechBubble
        message="You Received Mail!"
        avatarSrc="/avatar0.png"
        show={showAvatar}
        persistent={true}
        centered={false}
      />

      {/* Lottie Animation Overlay with Fade */}
      {showGif && (
        <div
          className={`transition-opacity duration-500 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <LoadingAnimation
            text="Opening Letter..."
            subtext="Taking you to your club matches ✨"
          />
        </div>
      )}

      <img
        className={`mx-auto w-1/2 object-contain transition-all duration-500 ${
          isNavigating ? "scale-110 opacity-50" : ""
        }`}
        src={
          mailStatus === "received"
            ? "mailbox_mail_down.png"
            : "mailbox_closed.png"
        }
        alt={
          mailStatus === "received"
            ? "Open mailbox with mail"
            : "Closed mailbox"
        }
        onClick={
          mailStatus !== "loading" && !isNavigating
            ? handleMailboxClick
            : undefined
        }
        style={{
          cursor:
            mailStatus !== "loading" && !isNavigating ? "pointer" : "default",
        }}
      />

      <h1 className="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
        Welcome to ClubPal
      </h1>
      <p className="text-center text-lg text-purple-600">
        {isNavigating
          ? "Opening your matches... ✨"
          : mailStatus === "received"
          ? "Looks like you've got mail! 📬"
          : mailStatus === "empty"
          ? "Click the mailbox to find your clubs! 📮"
          : "Loading..."}
      </p>
    </div>
  );
}

function fetchUserMailStatus(): Promise<"loading" | "empty" | "received"> {
  // Simulate fetching mail status from a database
  return new Promise((resolve) => {
    setTimeout(() => {
      // Force "received" for testing the avatar
      resolve("received");
    }, 1000);
  });
}
