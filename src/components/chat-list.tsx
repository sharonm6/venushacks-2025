import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Chat } from "@/lib/types";

interface ChatListProps {
  chats: Chat[];
  selectedChatId?: number;
  onChatSelect: (chat: Chat) => void;
}

export default function ChatList({
  chats,
  selectedChatId,
  onChatSelect,
}: ChatListProps) {
  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <Card
          key={chat.id}
          className={`p-3 cursor-pointer transition-colors ${
            selectedChatId === chat.id
              ? "bg-blue-50 border-blue-200"
              : "hover:bg-gray-50"
          }`}
          onClick={() => onChatSelect(chat)}
        >
          <CardContent className="p-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback>
                    {chat.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm truncate">{chat.name}</h4>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {chat.timestamp}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 flex-shrink-0 ml-2">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
