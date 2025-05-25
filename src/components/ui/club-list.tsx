import { FlippableCards } from "@/components/ui/flip-cards";
import { clubsDatabase, type Club } from "@/lib/clubDatabase";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { index } from "@/services/profiles";

// Define Club interface to match the testimonial structure
interface ClubTestimonial {
  description: string;
  name: string;
  designation: string;
  src: string;
  tags: string[];
  website: string;
  id: string; // Add club ID for navigation
}

// Mock current user's joined clubs
const userJoinedClubIds = ["wics", "hack", "icssc"];

// Function to convert Club to ClubTestimonial format
const convertClubToTestimonial = (club: Club): ClubTestimonial => {
  // Generate a placeholder image based on club category/name
  const getClubImage = (clubName: string): string => {
    const imageMap: Record<string, string> = {
      wics: "wics_logo.png",
      hack: "hack_logo.png",
      icssc: "icssc_logo.png",
    };
    return (
      imageMap[club.id] ||
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3"
    );
  };

  return {
    description: club.description,
    name: club.fullName,
    designation: `${club.category} • ${club.meetingFrequency} • ${club.clubSize}`,
    src: getClubImage(club.name),
    tags: club.tags,
    website: club.website,
    id: club.id, // Include club ID
  };
};

// Custom FlippableCards component that supports club data
interface ClubFlippableCardsProps {
  clubs: ClubTestimonial[];
  autoplay?: boolean;
  joinedClubs: string[];
  setJoinedClubs: (clubs: string[] | ((prev: string[]) => string[])) => void;
}

const ClubFlippableCards = ({
  clubs,
  autoplay = false,
  joinedClubs = [],
  setJoinedClubs,
}: ClubFlippableCardsProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const router = useRouter();

  // Convert to testimonial format including tags, website, and id
  const testimonials = clubs.map((club) => ({
    description: club.description,
    name: club.name,
    designation: club.designation,
    src: club.src,
    tags: club.tags,
    website: club.website, // Add website
    id: club.id, // Add id
  }));

  // Get current active club
  const currentClub = clubs[activeIndex];

  const handleVisitWebsite = () => {
    if (currentClub?.website) {
      window.open(currentClub.website, "_blank");
    }
  };

  const handleViewClubPage = () => {
    if (currentClub?.id) {
      router.push(`/club/${currentClub.id}`);
    }
  };

  const handleViewAllClubs = () => {
    router.push("/all-clubs");
  };

  return (
    <div className="min-h-screen flex flex-col p-8">
      {/* Compact Header */}
      <div className="text-center py-4">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-1">
          Your Joined Clubs
        </h2>
        <p className="text-sm text-purple-600">Explore your UCI clubs</p>
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
            joinedClubs={joinedClubs}
            setJoinedClubs={setJoinedClubs}
          />
        </div>
      </div>

      {/* Only View All Clubs Button - Bottom Center */}
      <div className="py-4 text-center">
        <button
          onClick={handleViewAllClubs}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm bg-white border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200 font-medium shadow-sm"
        >
          View All Clubs
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export function UserJoinedClubs() {
  const userid = "jZDLVSPOI9A3xQQhwEef";
  const [joinedClubs, setJoinedClubs] = useState<string[]>([]);

  useEffect(() => {
    loadJoinedClubs();
  }, []);

  const loadJoinedClubs = async () => {
    const profile = await index(userid);

    setJoinedClubs(
      profile.clubs.split(",").map((club) => club.split("(")[0]) || []
    );
  };

  const userClubs: Club[] = joinedClubs
    .map((id: string) => clubsDatabase.getClubById(id))
    .filter((club): club is Club => club !== undefined);

  // Convert clubs to testimonial format
  const clubTestimonials: ClubTestimonial[] = userClubs.map(
    convertClubToTestimonial
  );

  if (clubTestimonials.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-600 mb-3">
            No Clubs Joined Yet
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Start exploring clubs to build your community!
          </p>
          <button className="px-4 py-2 text-sm bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium">
            Discover Clubs
          </button>
        </div>
      </div>
    );
  }

  return (
    <ClubFlippableCards
      clubs={clubTestimonials}
      autoplay={false}
      joinedClubs={joinedClubs}
      setJoinedClubs={setJoinedClubs}
    />
  );
}

// Export for backward compatibility
export const AnimatedTestimonialsDemo = UserJoinedClubs;
