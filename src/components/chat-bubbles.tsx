import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessage } from "@/lib/types";
import { useEffect, useRef } from "react";

interface ChatBubblesProps {
  messages: ChatMessage[];
  userPicture?: string;
  chatUserPicture?: string;
  isLoading?: boolean;
}

// Group messages by sender and consecutive timing
const groupMessages = (messages: ChatMessage[]) => {
  const groups = [];
  let currentGroup = null;

  for (const message of messages) {
    if (!currentGroup || currentGroup.senderId !== message.senderId) {
      // Start a new group
      if (currentGroup) groups.push(currentGroup);
      currentGroup = {
        senderId: message.senderId,
        senderName: message.senderName,
        senderAvatar: message.senderAvatar,
        isCurrentUser: message.isCurrentUser,
        messages: [message],
      };
    } else {
      // Add to current group
      currentGroup.messages.push(message);
    }
  }

  if (currentGroup) groups.push(currentGroup);
  return groups;
};

export default function ChatBubbles({
  messages,
  userPicture,
  chatUserPicture,
  isLoading = false,
}: ChatBubblesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messageGroups = groupMessages(messages);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current && !isLoading) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollAreaRef}
      className="flex flex-col space-y-3 p-4 w-full h-full max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
    >
      {messageGroups.map((group, groupIndex) => (
        <div
          key={`group-${groupIndex}`}
          className={`flex ${
            group.isCurrentUser ? "justify-end" : "justify-start"
          } items-end space-x-2`}
        >
          {/* Avatar on left for other user */}
          {!group.isCurrentUser && (
            <div className="flex-shrink-0 mb-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={chatUserPicture} alt={group.senderName} />
                <AvatarFallback>
                  {group.senderName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* Message group */}
          <div
            className={`flex flex-col space-y-1 max-w-md ${
              group.isCurrentUser ? "items-end" : "items-start"
            }`}
          >
            {/* Messages */}
            {group.messages.map((message, messageIndex) => (
              <div
                key={message.id}
                className={`px-4 py-2 rounded-2xl ${
                  group.isCurrentUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                } ${
                  // Adjust bottom corners for grouped messages
                  messageIndex === group.messages.length - 1
                    ? group.isCurrentUser
                      ? "rounded-br-md"
                      : "rounded-bl-md"
                    : ""
                }`}
              >
                <p className="text-sm">{message.message}</p>
              </div>
            ))}

            {/* Timestamp on last message */}
            <span
              className={`text-xs text-gray-400 px-2 ${
                group.isCurrentUser ? "text-right" : "text-left"
              }`}
            >
              {group.messages[group.messages.length - 1].timestamp}
            </span>
          </div>

          {/* Avatar on right for current user */}
          {group.isCurrentUser && (
            <div className="flex-shrink-0 mb-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userPicture} alt="You" />
                <AvatarFallback>Me</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
