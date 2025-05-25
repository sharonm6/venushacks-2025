"use client";
import React, { useEffect, useState } from "react";
import { FlippableCards } from "@/components/ui/flip-cards";
import { clubsDatabase, type Club } from "@/lib/clubDatabase";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

// Define Club interface to match the testimonial structure
interface ClubTestimonial {
  description: string;
  name: string;
  designation: string;
  src: string;
  tags: string[];
  website: string;
  id: string;
  isJoined: boolean;
}

// TODO: Replace with actual user data from database
// Mock current user's joined clubs (hardcoded for now)
const userJoinedClubIds = ["wics", "hack", "icssc"];

// Function to convert Club to ClubTestimonial format
const convertClubToTestimonial = (
  club: Club,
  isJoined: boolean
): ClubTestimonial => {
  // Generate a placeholder image based on club category/name
  const getClubImage = (clubId: string): string => {
    const imageMap: Record<string, string> = {
      wics: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
      hack: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
      icssc: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
      acm: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
      ai: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
      blackInTech: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
      blockchain: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
      "commit-the-change": "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
      cyber: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
      data: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
      design: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
      quantum: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
      vgdc: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    };
    return (
      imageMap[clubId] ||
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3"
    );
  };

  return {
    description: club.description,
    name: club.fullName,
    designation: `${club.category} • ${club.meetingFrequency} • ${club.clubSize}`,
    src: getClubImage(club.id), // Fixed: Use club.id instead of clubId
    tags: club.tags,
    website: club.website,
    id: club.id,
    isJoined: isJoined,
  };
};

// Custom FlippableCards component that supports club data with join status
interface ClubFlippableCardsProps {
  clubs: ClubTestimonial[];
  autoplay?: boolean;
}

const ClubFlippableCards = React.memo(
  ({ clubs, autoplay = false }: ClubFlippableCardsProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const router = useRouter();

    // Memoize testimonials to prevent unnecessary re-renders
    const testimonials = React.useMemo(
      () =>
        clubs.map((club) => ({
          description: club.description,
          name: club.name,
          designation: club.designation,
          src: club.src,
          tags: club.tags,
          website: club.website,
          id: club.id,
          isJoined: club.isJoined,
        })),
      [clubs]
    );

    // Get current active club
    const currentClub = React.useMemo(
      () => clubs[activeIndex],
      [clubs, activeIndex]
    );

    const handleVisitWebsite = React.useCallback(() => {
      if (currentClub?.website) {
        window.open(currentClub.website, "_blank");
      }
    }, [currentClub?.website]);

    const handleViewClubPage = React.useCallback(() => {
      if (currentClub?.id) {
        router.push(`/club/${currentClub.id}`);
      }
    }, [currentClub?.id, router]);

    const handleViewYourClubs = React.useCallback(() => {
      router.push("/your-clubs");
    }, [router]);

    return (
      <div className="min-h-screen flex flex-col">
        {/* Compact Header */}
        <div className="text-center py-4">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-1">
            All UCI Clubs
          </h2>
          <p className="text-sm text-purple-600">
            Discover and explore all available clubs at UCI
          </p>
        </div>

        {/* Main Content - Flex Grow */}
        <div className="flex-1 flex items-center">
          <div className="w-full">
            <FlippableCards
              testimonials={testimonials}
              autoplay={autoplay}
              onActiveChange={setActiveIndex}
              onVisitWebsite={handleVisitWebsite}
              onViewClubPage={handleViewClubPage}
            />
          </div>
        </div>

        {/* View Your Clubs Button - Bottom Center */}
        <div className="py-4 text-center">
          <button
            onClick={handleViewYourClubs}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm bg-white border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200 font-medium shadow-sm"
          >
            View Your Clubs
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }
);

ClubFlippableCards.displayName = "ClubFlippableCards";

export function AllClubsList() {
  const [fadeIn, setFadeIn] = useState(false);
  const [clubTestimonials, setClubTestimonials] = useState<ClubTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load clubs data
    const loadClubs = async () => {
      try {
        console.log("Loading clubs from database..."); // Debug log
        
        // Get all clubs from the database
        const allClubs: Club[] = clubsDatabase.getAllClubs();
        console.log("All clubs loaded:", allClubs.length); // Debug log

        // Convert clubs to testimonial format with join status
        const testimonials: ClubTestimonial[] = allClubs.map((club) => {
          // TODO: Replace with actual database query to check if user has joined club
          const isJoined = userJoinedClubIds.includes(club.id);
          return convertClubToTestimonial(club, isJoined);
        });

        console.log("Testimonials created:", testimonials.length); // Debug log
        setClubTestimonials(testimonials);
      } catch (error) {
        console.error("Error loading clubs:", error);
        setClubTestimonials([]);
      } finally {
        setLoading(false);
        // Trigger fade-in animation after data is loaded
        setTimeout(() => {
          setFadeIn(true);
        }, 100);
      }
    };

    loadClubs();
  }, []);

  // Debug log to check current state
  console.log("Current state - Loading:", loading, "Club count:", clubTestimonials.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-venus-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading clubs...</p>
        </div>
      </div>
    );
  }

  if (clubTestimonials.length === 0) {
    return (
      <div
        className={`min-h-screen bg-venus-light transition-all duration-1000 ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-100 opacity-30"></div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-600 mb-3">
              No Clubs Available
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Check back later for club listings!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-venus-light transition-all duration-1000 ${
        fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-100 opacity-30"></div>
      <div className="relative z-10 mx-auto flex h-full w-full flex-col">
        <ClubFlippableCards clubs={clubTestimonials} autoplay={false} />
      </div>
    </div>
  );
}

// Export for backward compatibility
export const AllClubsDemo = AllClubsList;
