"use client";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Heart, Star, Users, Trophy, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Club {
  id: number;
  name: string;
  avatar: string;
  description: string;
  members: number;
  category: string;
}

export default function ClubPostcard() {
  // Sample data for each club: Must be taken from DB
  // Only take top 3 clubs for the postcard
  const clubs: Club[] = [
    {
      id: 1,
      name: "WICS",
      avatar: "wics_logo.png?height=80&width=80",
      description:
        "WICS is a social and professional nonprofit organization at UCI established to encourage women to pursue a college degree and a successful career in the computer science field. We provide mentorship, socials, study sessions, company tours, professional workshops, and hackathons. WICS is open to people of all genders!",
      members: 124,
      category: "Computer Science",
    },
    {
      id: 2,
      name: "ICS Student Council",
      avatar: "icssc_logo.png?height=80&width=80",
      description:
        "The official student government for the School of Information and Computer Sciences. We advocate for student interests, organize events, and bridge the gap between students and faculty.",
      members: 89,
      category: "Student Government",
    },
    {
      id: 3,
      name: "Hack at UCI",
      avatar: "hack_logo.png?height=80&width=80",
      description:
        "Hack at UCI is a student-run organization established to provide students with a platform to learn, grow, and develop technology of the future. We host hackathons, technical workshops, career panels, and events bringing in over 1000+ attendees annually. We organize Orange County's biggest annual hackathon, HackUCI, with 500+ students and ZotHacks for beginners.",
      members: 500,
      category: "Technology",
    },
  ];

  return (
    <div className="w-full min-h-screen p-20 flex items-center justify-center">
      <CardContainer
        className="inter-var w-full max-w-6xl"
        containerClassName="w-full max-w-6xl m-8"
      >
        <CardBody className="bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 relative group/card hover:shadow-2xl hover:shadow-pink-500/[0.1] dark:bg-gradient-to-br dark:from-purple-900 dark:via-pink-900 dark:to-indigo-900 border-2 border-pink-200 dark:border-pink-700 w-full h-auto rounded-2xl p-8 shadow-lg overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 opacity-30 group-hover/card:opacity-60 transition-opacity duration-300 pointer-events-none">
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
          </div>
          <div className="absolute top-8 right-12 opacity-20 group-hover/card:opacity-40 transition-opacity duration-300 pointer-events-none">
            <Heart className="w-4 h-4 text-pink-400 fill-current" />
          </div>

          {/* Postcard Header */}
          <CardItem
            translateZ="60"
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-400 mb-2 text-center pointer-events-none"
          >
            Your Perfect Club Matches! 🎯
          </CardItem>

          <CardItem
            as="p"
            translateZ="40"
            className="text-purple-600 dark:text-purple-300 text-sm mb-8 font-medium text-center pointer-events-none"
          >
            Here are 3 amazing clubs just for you ✨
          </CardItem>

          {/* Clubs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clubs.map((club, index) => (
              <CardItem
                key={club.id}
                translateZ={80 + index * 20}
                className="group/club"
              >
                <div
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-pink-200 dark:border-pink-700 hover:border-pink-400 dark:hover:border-pink-500 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                  onMouseMove={(e) => e.stopPropagation()}
                  onMouseEnter={(e) => e.stopPropagation()}
                  onMouseLeave={(e) => e.stopPropagation()}
                >
                  {/* Club Avatar - Main Focus */}
                  <div className="flex justify-center mb-4">
                    <div className="relative group/avatar">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 p-1 group-hover/avatar:from-pink-400 group-hover/avatar:to-purple-500 transition-all duration-300 transform group-hover/avatar:scale-110 group-hover/avatar:rotate-3">
                        <img
                          src={club.avatar || "/placeholder.svg"}
                          alt={`${club.name} avatar`}
                          className="w-full h-full rounded-full object-cover bg-white"
                        />
                      </div>
                      {/* Hover effect ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-pink-400 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Club Name */}
                  <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200 text-center mb-2 group-hover/club:text-pink-600 dark:group-hover/club:text-pink-400 transition-colors duration-300">
                    {club.name}
                  </h3>

                  {/* Club Stats */}
                  <div className="flex justify-center items-center gap-4 mb-3">
                    <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                      <Users className="w-3 h-3" />
                      <span>{club.members}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                      <Trophy className="w-3 h-3" />
                      <span>{club.category}</span>
                    </div>
                  </div>

                  {/* Club Description */}
                  <p className="text-sm text-purple-700 dark:text-purple-300 text-center leading-relaxed group-hover/club:text-purple-800 dark:group-hover/club:text-purple-200 transition-colors duration-300 line-clamp-4">
                    {club.description}
                  </p>

                  {/* Join Button */}
                  <div className="mt-4 flex justify-center">
                    <button className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                      Join Club 💫
                    </button>
                  </div>
                </div>
              </CardItem>
            ))}
          </div>

          {/* Bottom Message */}
          <CardItem
            translateZ={40}
            className="text-center mt-8 pointer-events-none w-full"
          >
            <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">
              Click on any club to learn more! 🌟
            </p>
          </CardItem>

          {/* Bottom decoration */}
          <CardItem
            translateZ={20}
            className="absolute bottom-4 right-4 text-xs text-purple-400 dark:text-purple-300 font-medium opacity-60 pointer-events-none"
          >
            {/* View all club buttons */}
            <Button>
              View all clubs!
              <MoveRight></MoveRight>
            </Button>
          </CardItem>
        </CardBody>
      </CardContainer>
    </div>
  );
}
