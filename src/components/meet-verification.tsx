import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

// Mock user data
const users = {
  currentUser: {
    name: "You",
    avatar: "https://via.placeholder.com/40",
  },
  otherUser: {
    name: "Anonymous User",
    avatar: "https://via.placeholder.com/40",
  },
};

export default function MeetVerification({
  agreedA,
  agreedB,
  handleMeetReady,
}: {
  agreedA: boolean;
  agreedB: boolean;
  handleMeetReady: (ready: boolean) => void;
}) {
  const [currentUserReady, setCurrentUserReady] = useState(agreedA);
  const [otherUserReady, setOtherUserReady] = useState(agreedB);

  const handleCurrentUserReady = () => {
    handleMeetReady(!currentUserReady);
    setCurrentUserReady(!currentUserReady);
  };

  const bothReady = currentUserReady && otherUserReady;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-lg flex items-center justify-center gap-2">
          <MapPin className="h-5 w-5" />
          Meet in Real Life?
        </CardTitle>
        <p className="text-sm text-gray-600">
          Both users must agree to reveal identities and meet in person
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Indicators */}
        <div className="flex justify-center items-center space-x-8">
          {/* Current User Status */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={users.currentUser.avatar}
                  alt={users.currentUser.name}
                />
                <AvatarFallback>Me</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-sm font-medium">
              {users.currentUser.name}
            </span>
            <span
              className={`text-xs ${
                currentUserReady ? "text-green-600" : "text-gray-500"
              }`}
            >
              {currentUserReady ? "Ready to meet" : "Considering..."}
            </span>
          </div>

          {/* VS Indicator */}
          <div className="text-gray-400 font-bold text-lg">+</div>

          {/* Other User Status */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={users.otherUser.avatar}
                  alt={users.otherUser.name}
                />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-white flex items-center justify-center ${
                  otherUserReady ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {otherUserReady ? (
                  <Check className="h-3 w-3 text-white" />
                ) : (
                  <Clock className="h-3 w-3 text-gray-600" />
                )}
              </div>
            </div>
            <span className="text-sm font-medium">{users.otherUser.name}</span>
            <span
              className={`text-xs ${
                otherUserReady ? "text-green-600" : "text-gray-500"
              }`}
            >
              {otherUserReady ? "Ready to meet" : "Considering..."}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Current User Ready Button */}
          <Button
            onClick={handleCurrentUserReady}
            className={`w-full ${
              currentUserReady
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {currentUserReady ? "I want to meet!" : "Agree to meet in person"}
          </Button>

          {/* Simulate Other User Button (for demo purposes) */}
          <Button
            onClick={() => setOtherUserReady(!otherUserReady)}
            variant="outline"
            className="w-full text-xs"
          >
            Simulate other user agreement (Demo)
          </Button>

          {/* Reveal Identities Button */}
          {bothReady && (
            <Button className="w-full bg-blue-500 hover:bg-blue-600">
              Reveal Identities & Exchange Contact Info 🎉
            </Button>
          )}
        </div>

        {/* Status Message */}
        <div className="text-center">
          {bothReady ? (
            <div className="space-y-2">
              <p className="text-green-600 text-sm font-medium">
                Both users agreed to meet!
              </p>
              <p className="text-xs text-gray-600">
                You can now see each other's real identities and coordinate a
                meetup
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Waiting for{" "}
              {!currentUserReady && !otherUserReady
                ? "both users"
                : !currentUserReady
                ? "you"
                : "the other user"}{" "}
              to agree to meet in person...
            </p>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-800">
            <strong>Privacy Notice:</strong> Once both users agree, your real
            names and contact information will be revealed to coordinate an
            in-person meeting.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
