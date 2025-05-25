"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Heart, MapPin, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface MeetVerificationProps {
  agreedA: boolean;
  agreedB: boolean;
  handleMeetReady: (agreed: boolean) => void;
  currentUserAvatar: string;
  otherUserAvatar: string;
  otherUserName: string;
  // NEW: Add the missing user ID prop
  otherUserId: string;
}

export default function MeetVerification({
  agreedA,
  agreedB,
  handleMeetReady,
  currentUserAvatar,
  otherUserAvatar,
  otherUserName,
  otherUserId, // NEW: Now we have access to the other user's ID
}: MeetVerificationProps) {
  const router = useRouter();
  const [hasDecided, setHasDecided] = useState(agreedA || agreedB);

  const handleAgree = () => {
    setHasDecided(true);
    handleMeetReady(true);
  };

  const handleDecline = () => {
    setHasDecided(true);
    handleMeetReady(false);
  };

  // NEW: Handle clicking on other user's avatar/name to view profile
  const handleOtherUserClick = () => {
    router.push(`/profile/${otherUserId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with avatars */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-8">
          {/* Current User Avatar */}
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-20 w-20 border-4 border-purple-200">
              <AvatarImage src={currentUserAvatar} alt="You" />
              <AvatarFallback className="bg-purple-100 text-purple-600 text-lg font-semibold">
                You
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">You</span>
            {agreedA && (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs">Ready to meet!</span>
              </div>
            )}
          </div>

          {/* Heart Icon */}
          <div className="flex flex-col items-center">
            <Heart className="h-8 w-8 text-pink-500 animate-pulse" />
            <MapPin className="h-6 w-6 text-purple-500 mt-2" />
          </div>

          {/* Other User Avatar - NOW CLICKABLE */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative group">
              <Avatar
                className="h-20 w-20 border-4 border-pink-200 cursor-pointer hover:border-pink-300 transition-all duration-200 hover:shadow-lg"
                onClick={handleOtherUserClick}
              >
                <AvatarImage src={otherUserAvatar} alt={otherUserName} />
                <AvatarFallback className="bg-pink-100 text-pink-600 text-lg font-semibold">
                  {otherUserName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {/* NEW: Hover indicator */}
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-pink-500 text-white rounded-full p-1">
                <User className="h-3 w-3" />
              </div>
            </div>
            <span
              className="text-sm text-gray-600 cursor-pointer hover:text-pink-600 transition-colors duration-200"
              onClick={handleOtherUserClick}
            >
              {otherUserName}
            </span>
            {agreedB ? (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs">Ready to meet!</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-yellow-600">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Deciding...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-purple-700">
              🤝 Ready to Meet in Real Life?
            </h3>
            <p className="text-gray-600">
              Both of you need to agree before your identities are revealed and
              you can plan your meetup!
            </p>
            <p className="text-xs text-gray-500">
              💡 Click on {otherUserName}'s avatar to view their profile
              (limited info until you both agree)
            </p>
          </div>

          {/* Safety Information */}
          <div className="bg-white/80 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-purple-700 flex items-center">
              <span className="mr-2">🛡️</span>
              Safety First
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Meet in a public place</li>
              <li>• Tell a friend about your plans</li>
              <li>• Trust your instincts</li>
              <li>• You can report any issues to our support team</li>
            </ul>
          </div>

          {/* Action Buttons */}
          {!hasDecided ? (
            <div className="flex space-x-3">
              <Button
                onClick={handleAgree}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Yes, I'm Ready!
              </Button>
              <Button
                onClick={handleDecline}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Not Right Now
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-700 font-medium">
                  ✅ Your decision has been submitted!
                </p>
                {agreedB ? (
                  <p className="text-sm text-blue-600 mt-1">
                    🎉 {otherUserName} is also ready! Preparing to reveal
                    identities...
                  </p>
                ) : (
                  <p className="text-sm text-blue-600 mt-1">
                    ⏳ Waiting for {otherUserName} to decide...
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
