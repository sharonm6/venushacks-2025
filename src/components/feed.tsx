import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle } from "lucide-react";

// Mock feed data
const feedItems = [
  {
    id: 1,
    user: {
      name: "Sarah Chen",
      avatar: "https://via.placeholder.com/40",
      username: "sarah.chen",
    },
    title: "Excited to announce our upcoming hackathon!",
    content:
      "Join us for 48 hours of coding, innovation, and fun. Registration opens next week!",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
  },
  {
    id: 2,
    user: {
      name: "Emily Rodriguez",
      avatar: "https://via.placeholder.com/40",
      username: "emily.r",
    },
    title: "Workshop: Introduction to Machine Learning",
    content:
      "Don't miss our ML workshop this Friday at 6 PM in the CS building.",
    timestamp: "5 hours ago",
    likes: 18,
    comments: 12,
  },
  {
    id: 3,
    user: {
      name: "Jessica Kim",
      avatar: "https://via.placeholder.com/40",
      username: "jess.kim",
    },
    title: "Study group forming for algorithms class",
    content:
      "Looking for motivated students to join our weekly study sessions.",
    timestamp: "1 day ago",
    likes: 15,
    comments: 6,
  },
];

export default function Feed() {
  return (
    <div className="flex w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Feed</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[400px] w-full">
          <CardContent className="space-y-4">
            {feedItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={item.user.avatar} alt={item.user.name} />
                    <AvatarFallback>
                      {item.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm">
                        {item.user.name}
                      </h4>
                      <span className="text-gray-500 text-xs">
                        @{item.user.username}
                      </span>
                      <span className="text-gray-400 text-xs">•</span>
                      <span className="text-gray-500 text-xs">
                        {item.timestamp}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.content}</p>
                    </div>

                    <div className="flex items-center space-x-4 pt-2">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="h-4 w-4" />
                        <span className="text-xs">{item.likes}</span>
                      </button>

                      <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs">{item.comments}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
