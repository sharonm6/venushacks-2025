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
import { ExternalLink } from "lucide-react";
import Feed from "@/components/feed";
import { type Club } from "@/lib/clubDatabase";

interface ClubBannerProps {
  club: Club;
}

export default function ClubBanner({ club }: ClubBannerProps) {
  // Helper function to get club image
  const getClubImage = (clubId: string): string => {
    const imageMap: Record<string, string> = {
      wics: "https://via.placeholder.com/150?text=WICS",
      "hack-uci": "https://via.placeholder.com/150?text=HACK",
      icssc: "https://via.placeholder.com/150?text=ICSSC",
      "blockchain-uci": "https://via.placeholder.com/150?text=BLOCKCHAIN",
      // Add more club images as needed
    };
    return imageMap[clubId] || "https://via.placeholder.com/150";
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
                  src={getClubImage(club.id)}
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
              <Button variant="outline" size="sm">
                Create Post
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Join Club
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-0">
            {/* About Section */}
            <div>
              <h3 className="font-semibold text-base mb-2">About</h3>
              <p className="text-gray-700 text-xs leading-relaxed line-clamp-3">
                {club.description}
              </p>
            </div>

            {/* Club Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-1">Time Commitment</h4>
                <p className="text-xs text-gray-600">{club.timeCommitment}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Membership Level</h4>
                <p className="text-xs text-gray-600">{club.membershipLevel}</p>
              </div>
            </div>

            {/* Key Activities */}
            <div>
              <h3 className="font-semibold text-base mb-2">Key Activities</h3>
              <div className="flex flex-wrap gap-1">
                {club.activities.slice(0, 4).map((activity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs"
                  >
                    {activity}
                  </span>
                ))}
                {club.activities.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                    +{club.activities.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Skills Offered */}
            <div>
              <h3 className="font-semibold text-base mb-2">
                Skills You'll Gain
              </h3>
              <div className="flex flex-wrap gap-1">
                {club.skillsOffered.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-pink-100 text-pink-700 rounded-md text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {club.skillsOffered.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                    +{club.skillsOffered.length - 4} more
                  </span>
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
                <h3 className="font-semibold text-base mb-2">Key Programs</h3>
                <div className="space-y-1">
                  {club.keyPrograms.map((program, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
                      <span className="text-xs text-gray-700">{program}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scrollable Feed */}
        <div className="flex-1 min-h-0">
          <Feed />
        </div>
      </section>
    </div>
  );
}
