"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AvatarWithSpeechBubble from "@/components/avatar-speech-bubble";
import LoadingAnimation from "@/components/loader/loadingAnimation";
import { addDoc } from "firebase/firestore";
import {
  matchesCollection,
  surveyAnswersCollection,
} from "@/utils/firebase.browser";
import { index } from "@/services/matches";
import { generateClubMatches } from "@/lib/matchingAlgorithm";
import { getDocs, where, query } from "firebase/firestore";
import clubsDatabase from "@/lib/clubDatabase";

interface SurveyAnswer {
  questionId: string;
  answer: string | string[];
}

export default function Home() {
  const [userId, setUserId] = useState<string | null>("");
  const [mailStatus, setMailStatus] = useState<
    "loading" | "empty" | "received"
  >("loading");
  const [showAvatar, setShowAvatar] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      setUserId(localStorage.getItem("userId"));
    }

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

  const handleMailboxClick = async () => {
    if (userId) {
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

      const userid = localStorage.getItem("userId") || "";

      try {
        // NEW: Generate matches using the algorithm
        const surveyAnswers = await getUserSurveyAnswers(userid);
        console.log("📋 Survey answers found:", surveyAnswers); // DEBUG

        if (surveyAnswers.length > 0) {
          // User has survey data - generate smart matches
          const clubNames = await generateClubMatches(userid, surveyAnswers);
          console.log("🎯 Generated club names:", clubNames); // DEBUG

          console.log(
            clubNames
              .map((a) => {
                return clubsDatabase.getidfromname(a)?.id || a;
              })
              .join(",")
          ); // DEBUG')
          // Save as simple format
          const docRef = await addDoc(matchesCollection, {
            userid: userid,
            clubs: clubNames
              .map((a) => {
                return clubsDatabase.getidfromname(a)?.id || a;
              })
              .join(","), // Array of 3 club name strings
            timestamp: new Date(),
          });

          console.log("✅ Match document created with ID:", docRef.id); // DEBUG
        } else {
          // Fallback matches
          await addDoc(matchesCollection, {
            userid: userid,
            clubs: [
              "Women in Computer Science",
              "Hack at UCI",
              "ICS Student Council",
            ],
            timestamp: new Date(),
          });
        }
      } catch (error) {
        console.error("❌ Error generating matches:", error);
        // Fallback on error...
      }

      // Navigate to matches after fade completes
      setTimeout(() => {
        router.push("/matches");
      }, 3500); // Navigate 0.5s after fade starts
    } else if (!userId) {
      // Go to survey to get matched
      router.push("/signup");
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
            text="Analyzing your interests..."
            subtext="Finding your perfect club matches ✨"
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
          ? "Analyzing your perfect matches... ✨"
          : mailStatus === "received"
          ? "Looks like you've got mail! 📬"
          : mailStatus === "empty"
          ? "Click the mailbox to find your clubs! 📮"
          : "Loading..."}
      </p>
    </div>
  );
}

// NEW: Function to get user's survey answers
const getUserSurveyAnswers = async (
  userid: string
): Promise<SurveyAnswer[]> => {
  try {
    const q = query(surveyAnswersCollection, where("userId", "==", userid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return data.answers || [];
    }

    return [];
  } catch (error) {
    console.error("Error fetching survey answers:", error);
    return [];
  }
};

const getMatchesExist = async (userid: string): Promise<boolean> => {
  const matches = await index(userid);
  return matches?.clubs && matches.clubs.length > 0;
};

async function fetchUserMailStatus(): Promise<
  "loading" | "empty" | "received"
> {
  const userid = localStorage.getItem("userId");
  try {
    const matchesExist = await getMatchesExist(userid || "");
    return matchesExist ? "received" : "empty";
  } catch (error) {
    console.error("Error fetching mail status:", error);
    return "empty";
  }
}
