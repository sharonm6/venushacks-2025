"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Heart,
  Users,
  Trophy,
  BookOpen,
  Zap,
  Star,
  MapPin,
} from "lucide-react";
import {
  matchesCollection,
  surveyAnswersCollection,
} from "@/utils/firebase.browser";
import { addDoc } from "firebase/firestore";

interface SurveyAnswer {
  questionId: string;
  answer: string | string[];
}

interface Question {
  id: string;
  title: string;
  subtitle?: string;
  type: "single" | "multiple" | "scale";
  options: { value: string; label: string; emoji?: string }[];
  required: boolean;
}

const surveyQuestions: Question[] = [
  {
    id: "major",
    title: "What's your major or field of study?",
    subtitle: "This helps us find academically relevant clubs",
    type: "single",
    options: [
      { value: "computer-science", label: "Computer Science", emoji: "💻" },
      { value: "engineering", label: "Engineering", emoji: "⚙️" },
      { value: "business", label: "Business", emoji: "💼" },
      { value: "design", label: "Design/Art", emoji: "🎨" },
      { value: "life-sciences", label: "Life Sciences", emoji: "🧬" },
      { value: "social-sciences", label: "Social Sciences", emoji: "📚" },
      { value: "other", label: "Other", emoji: "🌟" },
    ],
    required: true,
  },
  {
    id: "interests",
    title: "What activities interest you most?",
    subtitle:
      "Select all that apply - we'll find clubs that match your passions",
    type: "multiple",
    options: [
      { value: "workshops", label: "Workshops & Skill Building", emoji: "🛠️" },
      { value: "networking", label: "Social Events & Networking", emoji: "🤝" },
      {
        value: "competitions",
        label: "Competitions & Hackathons",
        emoji: "🏆",
      },
      { value: "volunteering", label: "Community Service", emoji: "❤️" },
      { value: "cultural", label: "Cultural Events", emoji: "🌍" },
      { value: "sports", label: "Sports & Fitness", emoji: "⚽" },
      { value: "research", label: "Research Opportunities", emoji: "🔬" },
      { value: "entrepreneurship", label: "Entrepreneurship", emoji: "🚀" },
    ],
    required: true,
  },
  {
    id: "commitment",
    title: "How much time can you dedicate per week?",
    subtitle: "Be honest - we'll match you with clubs that fit your schedule",
    type: "single",
    options: [
      { value: "1-2", label: "1-2 hours (Light involvement)", emoji: "⏰" },
      { value: "3-5", label: "3-5 hours (Regular participation)", emoji: "📅" },
      { value: "6-10", label: "6-10 hours (Active member)", emoji: "💪" },
      { value: "10+", label: "10+ hours (Leadership ready)", emoji: "🌟" },
    ],
    required: true,
  },
  {
    id: "social-style",
    title: "What's your preferred social environment?",
    subtitle: "This helps us find clubs with the right vibe for you",
    type: "single",
    options: [
      {
        value: "small-intimate",
        label: "Small, close-knit groups",
        emoji: "👥",
      },
      {
        value: "medium-balanced",
        label: "Medium-sized communities",
        emoji: "👫",
      },
      {
        value: "large-diverse",
        label: "Large, diverse organizations",
        emoji: "🎭",
      },
      { value: "flexible", label: "I'm flexible!", emoji: "🤷" },
    ],
    required: true,
  },
  {
    id: "goals",
    title: "What do you hope to gain from joining clubs?",
    subtitle: "Select your top priorities",
    type: "multiple",
    options: [
      { value: "friendships", label: "New friendships", emoji: "💕" },
      { value: "skills", label: "Professional skills", emoji: "📈" },
      { value: "leadership", label: "Leadership experience", emoji: "👑" },
      { value: "resume", label: "Resume building", emoji: "📄" },
      { value: "fun", label: "Fun & stress relief", emoji: "🎉" },
      { value: "networking", label: "Career networking", emoji: "🔗" },
      { value: "mentorship", label: "Mentorship opportunities", emoji: "🎯" },
    ],
    required: true,
  },
  {
    id: "leadership",
    title: "Are you interested in leadership roles?",
    subtitle: "No pressure - just helps us understand your ambitions",
    type: "single",
    options: [
      { value: "yes-immediately", label: "Yes, I want to lead!", emoji: "🚀" },
      { value: "yes-eventually", label: "Maybe in the future", emoji: "🌱" },
      {
        value: "no-participate",
        label: "Just want to participate",
        emoji: "👋",
      },
      { value: "unsure", label: "I'm not sure yet", emoji: "🤔" },
    ],
    required: true,
  },
];

export default function ClubMatchingSurvey() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswer[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((currentQuestion + 1) / surveyQuestions.length) * 100;
  const question = surveyQuestions[currentQuestion];

  const getCurrentAnswer = () => {
    return answers.find((a) => a.questionId === question.id)?.answer;
  };

  const handleSingleAnswer = (value: string) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== question.id);
      return [...filtered, { questionId: question.id, answer: value }];
    });
  };

  const handleMultipleAnswer = (value: string, checked: boolean) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === question.id);
      let newAnswer: string[];

      if (existing && Array.isArray(existing.answer)) {
        newAnswer = checked
          ? [...existing.answer, value]
          : existing.answer.filter((v) => v !== value);
      } else {
        newAnswer = checked ? [value] : [];
      }

      const filtered = prev.filter((a) => a.questionId !== question.id);
      return [...filtered, { questionId: question.id, answer: newAnswer }];
    });
  };

  const canProceed = () => {
    const currentAnswer = getCurrentAnswer();
    if (!question.required) return true;
    if (question.type === "multiple") {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    return currentAnswer !== undefined && currentAnswer !== "";
  };

  const handleNext = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion(Math.max(0, currentQuestion - 1));
  };

  const handleSubmit = async () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsSubmitting(true);
      try {
        const userId = localStorage.getItem("userId");

        // NEW: Format answers properly for the matching algorithm
        const formattedAnswers = answers.map((answer) => ({
          questionId: answer.questionId,
          answer: answer.answer,
        }));

        console.log("📋 Formatted survey answers:", formattedAnswers); // DEBUG

        // Save survey answers for future matching
        await addDoc(surveyAnswersCollection, {
          userId: userId,
          answers: formattedAnswers,
          timestamp: new Date(),
        });

        console.log("✅ Survey answers saved to database"); // DEBUG

        // Navigate to home where matches will be generated
        router.push("/");
      } catch (error) {
        console.error("❌ Error submitting survey:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isComplete) {
    return (
      <div className="h-screen bg-venus-light flex items-center justify-center p-8">
        <div className="max-w-sm w-full">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex justify-center space-x-2 mb-3">
                <Star className="w-5 h-5 text-emerald-400 fill-current" />
                <Heart className="w-3 h-3 text-green-400 fill-current mt-1" />
                <Star className="w-5 h-5 text-emerald-400 fill-current" />
              </div>

              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-2">
                Survey Complete! 🎉
              </h2>
              <p className="text-emerald-700 text-sm mb-4">
                We're analyzing your responses to find perfect club matches...
              </p>

              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Check your mailbox!
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-venus-light p-12 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex flex-col h-full">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex justify-center space-x-2 mb-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Heart className="w-3 h-3 text-pink-400 fill-current mt-1" />
            <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
          </div>

          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-1">
            Find Your Perfect Clubs ✨
          </h1>
          <p className="text-purple-600 text-sm">
            Answer a few questions to get personalized club recommendations
          </p>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-purple-600">
              Question {currentQuestion + 1} of {surveyQuestions.length}
            </span>
            <span className="text-xs text-purple-600">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Question Card - flex-1 to fill remaining space */}
        <Card className="mb-4 flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-purple-900">
              {question.title}
            </CardTitle>
            {question.subtitle && (
              <p className="text-purple-600 text-xs">{question.subtitle}</p>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {question.type === "single" && (
                <RadioGroup
                  value={getCurrentAnswer() as string}
                  onValueChange={handleSingleAnswer}
                >
                  {question.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2 p-2 rounded-lg border border-purple-100 hover:border-purple-300 transition-colors cursor-pointer bg-purple-50/50 hover:bg-purple-100/50"
                      onClick={() => handleSingleAnswer(option.value)}
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="text-venus-primary"
                      />
                      <Label
                        htmlFor={option.value}
                        className="flex-1 cursor-pointer flex items-center"
                      >
                        <span className="text-lg mr-2">{option.emoji}</span>
                        <span className="text-purple-800 text-sm">
                          {option.label}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.type === "multiple" && (
                <div className="space-y-2">
                  {question.options.map((option) => {
                    const currentAnswer = getCurrentAnswer() as string[];
                    const isChecked =
                      currentAnswer?.includes(option.value) || false;

                    return (
                      <div
                        key={option.value}
                        className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors cursor-pointer ${
                          isChecked
                            ? "border-purple-400 bg-purple-100/70"
                            : "border-purple-100 hover:border-purple-300 bg-purple-50/50 hover:bg-purple-100/50"
                        }`}
                        onClick={() =>
                          handleMultipleAnswer(option.value, !isChecked)
                        }
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) =>
                            handleMultipleAnswer(
                              option.value,
                              checked as boolean
                            )
                          }
                          className="border-purple-300"
                        />
                        <Label className="flex-1 cursor-pointer flex items-center">
                          <span className="text-lg mr-2">{option.emoji}</span>
                          <span className="text-purple-800 text-sm">
                            {option.label}
                          </span>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="text-purple-700 border-purple-300 hover:bg-purple-50 text-sm px-3 py-2"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: surveyQuestions.length }).map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index <= currentQuestion
                    ? "bg-venus-primary"
                    : "bg-purple-200"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white text-sm px-3 py-2"
          >
            {currentQuestion === surveyQuestions.length - 1 ? (
              <>
                Complete
                <CheckCircle className="w-3 h-3 ml-1" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-3 h-3 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
