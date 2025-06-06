"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ExternalLink,
  Check,
  UserMinus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Feed from "@/components/feed";
import { type Club } from "@/lib/clubDatabase";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { index as indexProfiles } from "@/services/profiles";
import { profilesCollection } from "@/utils/firebase.browser";
import { doc, updateDoc } from "firebase/firestore";

interface ClubBannerProps {
  club: Club;
  initialJoinStatus?: boolean;
}

export default function ClubBanner({
  club,
  initialJoinStatus = false,
}: ClubBannerProps) {
  let userid = "pdQPZmjZ3XFKxgjkUq3O";
  const router = useRouter();
  const [isJoined, setIsJoined] = useState(initialJoinStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [activitiesExpanded, setActivitiesExpanded] = useState(false);
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  const [bannerExpanded, setBannerExpanded] = useState(true);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    userid = localStorage.getItem("userId") || "";
  }, []);

  const loadJoined = async () => {
    const profile = await indexProfiles(userid);

    setIsJoined(profile.clubs.includes(club.id) || false);
  };

  useEffect(() => {
    loadJoined();
  }, []);

  // Calculate content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [club, activitiesExpanded, skillsExpanded]);

  // Helper function to get club image - now uses the logo field
  const getClubImage = (club: Club): string => {
    return club.logo || "https://via.placeholder.com/150"; // Fallback if logo is missing
  };

  // Helper function to extract social links from club data
  const getSocialLinks = (club: Club) => {
    const links: Record<string, string> = {};

    // Add website if available
    if (club.website) {
      links.website = club.website;
    }

    // Add social links if available
    if (club.socialLinks) {
      Object.entries(club.socialLinks).forEach(([platform, url]) => {
        if (url) {
          links[platform] = url;
        }
      });
    }

    return links;
  };

  // Function to handle joining a club
  const handleJoinClub = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const now = new Date();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const formattedDate = `${
        monthNames[now.getMonth()]
      } ${now.getFullYear()}`;

      const profileRef = doc(profilesCollection, userid || "");
      const profile = await indexProfiles(userid);

      updateDoc(profileRef, {
        clubs:
          profile.clubs.length > 0
            ? profile.clubs + "," + (club.id + "(" + formattedDate + ")")
            : club.id + "(" + formattedDate + ")",
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsJoined(true);

      // Optional: Show success toast
      console.log(`Successfully joined ${club.name}`);
    } catch (error) {
      console.error("Error joining club:", error);
      // TODO: Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle leaving a club
  const handleLeaveClub = async () => {
    setIsLoading(true);
    try {
      const profileRef = doc(profilesCollection, userid || "");
      const profile = await indexProfiles(userid);

      const updatedClubs = profile.clubs
        .split(",")
        .filter((clubEntry: string) => !clubEntry.startsWith(club.id))
        .join(",");

      updateDoc(profileRef, {
        clubs: updatedClubs,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsJoined(false);

      // Navigate to appropriate page after leaving
      // Options: matches page, dashboard, or clubs list
      router.push("/matches"); // or '/dashboard' or '/clubs'

      console.log(`Successfully left ${club.name}`);
    } catch (error) {
      console.error("Error leaving club:", error);
      // TODO: Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks = getSocialLinks(club);

  return (
    <div className="flex w-full h-full p-4">
      {/* Banner Section */}
      <section className="flex w-full flex-col space-y-3 h-full overflow-hidden">
        {/* Club Banner */}
        <Card className="w-full flex-shrink-0 bg-white/80 backdrop-blur-sm border-2 border-venus-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div className="flex flex-row items-center space-x-4">
              <Avatar className="h-16 w-16 p-2">
                <AvatarImage
                  src={getClubImage(club)}
                  alt={`${club.name} logo`}
                />
                <AvatarFallback>
                  {club.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-xl">{club.name}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {club.fullName}
                </CardDescription>
                <CardDescription className="text-xs text-purple-600">
                  {club.category} • {club.clubSize} • {club.meetingFrequency}
                </CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              {/* Join/Leave Club Button */}
              {isJoined !== null && !isJoined ? (
                <Button
                  size="sm"
                  onClick={handleJoinClub}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
                >
                  {isLoading ? "Joining..." : "Join Club"}
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isLoading}
                      className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Joined
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <UserMinus className="h-5 w-5 text-red-500" />
                        Leave {club.name}?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to leave{" "}
                        <strong>{club.fullName}</strong>? You'll lose access to
                        club posts, events, and resources. You can always rejoin
                        later.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLeaveClub}
                        disabled={isLoading}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        {isLoading ? "Leaving..." : "Leave Club"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-0">
            {/* About Section - Always visible */}
            <div>
              <h3 className="font-semibold text-base mb-2">About</h3>
              <p className="text-gray-700 text-xs leading-relaxed line-clamp-3">
                {club.description}
              </p>
            </div>

            {/* Collapsible Content */}
            <div
              ref={contentRef}
              className="overflow-hidden transition-all duration-700 ease-in-out"
              style={{
                height: bannerExpanded ? `${contentHeight}px` : "0px",
                opacity: bannerExpanded ? 1 : 0,
              }}
            >
              <div className="space-y-3 pb-3">
                {/* Club Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-1">
                      Time Commitment
                    </h4>
                    <p className="text-xs text-gray-600">
                      {club.timeCommitment}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">
                      Membership Level
                    </h4>
                    <p className="text-xs text-gray-600">
                      {club.membershipLevel}
                    </p>
                  </div>
                </div>

                {/* Key Activities */}
                <div>
                  <h3 className="font-semibold text-base mb-2">
                    Key Activities
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {(activitiesExpanded
                      ? club.activities
                      : club.activities.slice(0, 4)
                    ).map((activity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs"
                      >
                        {activity}
                      </span>
                    ))}
                    {club.activities.length > 4 && (
                      <button
                        onClick={() =>
                          setActivitiesExpanded(!activitiesExpanded)
                        }
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-md text-xs transition-colors cursor-pointer"
                      >
                        {activitiesExpanded
                          ? "Show less"
                          : `+${club.activities.length - 4} more`}
                      </button>
                    )}
                  </div>
                </div>

                {/* Skills Offered */}
                <div>
                  <h3 className="font-semibold text-base mb-2">
                    Skills You'll Gain
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {(skillsExpanded
                      ? club.skillsOffered
                      : club.skillsOffered.slice(0, 4)
                    ).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-pink-100 text-pink-700 rounded-md text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {club.skillsOffered.length > 4 && (
                      <button
                        onClick={() => setSkillsExpanded(!skillsExpanded)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-md text-xs transition-colors cursor-pointer"
                      >
                        {skillsExpanded
                          ? "Show less"
                          : `+${club.skillsOffered.length - 4} more`}
                      </button>
                    )}
                  </div>
                </div>

                {/* Important Links */}
                {Object.keys(socialLinks).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-base mb-2">
                      Important Links
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(socialLinks).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded-md text-blue-700 text-xs transition-colors"
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Programs */}
                {club.keyPrograms.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-base mb-2">
                      Key Programs
                    </h3>
                    <div className="space-y-1">
                      {club.keyPrograms.map((program, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
                          <span className="text-xs text-gray-700">
                            {program}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Expand/Collapse Button */}
            <div className="flex justify-center pt-3 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBannerExpanded(!bannerExpanded)}
                className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 transition-all duration-200"
              >
                {bannerExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show More
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scrollable Feed */}
        <div
          className={`min-h-0 transition-all duration-700 ease-in-out ${
            bannerExpanded ? "flex-1" : "flex-[3]"
          }`}
          data-feed
        >
          <Feed club={club} />
        </div>
      </section>
    </div>
  );
}
