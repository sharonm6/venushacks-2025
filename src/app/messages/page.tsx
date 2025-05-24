"use client";

import ChatBubbles from "@/components/chat-bubbles";
import ChatList from "@/components/chat-list";
import MeetVerification from "@/components/meet-verification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Send, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

import { index as indexConversations } from "@/services/conversations";
import { index as indexProfiles } from "@/services/profiles";
import { index as indexMessages } from "@/services/messages";

import { Chat, Conversation, Message, ChatMessage } from "@/lib/types";
import { messagesCollection } from "@/utils/firebase.browser";
import { query, where, orderBy } from "firebase/firestore";

// const mockMessages: Record<number, Message[]> = {
//   1: [
//     {
//       id: 1,
//       senderId: "user1",
//       senderName: "Sarah Chen",
//       senderAvatar: "https://via.placeholder.com/40",
//       message: "Hey! How's the project going?",
//       timestamp: "10:30 AM",
//       isCurrentUser: false,
//     },
//     {
//       id: 2,
//       senderId: "user1",
//       senderName: "Sarah Chen",
//       senderAvatar: "https://via.placeholder.com/40",
//       message: "I finished the frontend mockups",
//       timestamp: "10:31 AM",
//       isCurrentUser: false,
//     },
//     {
//       id: 3,
//       senderId: "currentUser",
//       senderName: "You",
//       senderAvatar: "https://via.placeholder.com/40",
//       message: "Looks great! I love the color scheme",
//       timestamp: "10:35 AM",
//       isCurrentUser: true,
//     },
//   ],
//   2: [
//     {
//       id: 4,
//       senderId: "user2",
//       senderName: "Emily Rodriguez",
//       senderAvatar: "https://via.placeholder.com/40",
//       message: "Thanks for the help with the project!",
//       timestamp: "Yesterday",
//       isCurrentUser: false,
//     },
//   ],
//   3: [
//     {
//       id: 5,
//       senderId: "user3",
//       senderName: "Jessica Kim",
//       senderAvatar: "https://via.placeholder.com/40",
//       message: "See you at the meeting tomorrow",
//       timestamp: "Yesterday",
//       isCurrentUser: false,
//     },
//   ],
// };

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  // const [conversations, setConversations] = useState<Conversation[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showMeetVerification, setShowMeetVerification] = useState(false);
  const currentUserId = "9SDq83UWnqdtcUFKeYUZ"; // This would come from your auth system

  const loadUserProfile = async (chatUserId: string) => {
    const profiles = await indexProfiles();
    const chatUserProfile = profiles.find(
      (profile) => profile.id === chatUserId
    );

    return chatUserProfile || null;
  };

  const loadConversations = async () => {
    const conversations = await indexConversations();

    // setConversations(conversations);
    return conversations;
  };

  const loadChatMessageInfo = async (conversation: Conversation) => {
    const chatMessages = await indexMessages(
      query(
        messagesCollection,
        where("conversationid", "==", conversation.id),
        orderBy("timestamp", "desc")
      )
    );

    const lastChatMessage = chatMessages[0];

    return chatMessages.length > 0
      ? {
          lastMessage: lastChatMessage.content,
          timestamp: new Date(
            lastChatMessage.timestamp.seconds * 1000
          ).toLocaleDateString(),
        }
      : {
          lastMessage: "",
          timestamp: Date.now(),
        };
  };

  const loadChats = async () => {
    const conversations = await loadConversations();

    const chats = await Promise.all(
      conversations.map(async (conversation, idx) => {
        const chatUserId =
          conversation.useridA === currentUserId
            ? conversation.useridB
            : conversation.useridA;

        const chatUserProfile = await loadUserProfile(chatUserId);

        if (!chatUserProfile) {
          return null; // Skip if profile not found
        }

        const chatMessageInfo = await loadChatMessageInfo(conversation);

        return {
          id: idx,
          conversationid: conversation.id,
          userId: chatUserId,
          name: chatUserProfile.name,
          avatar: "avatar",
          lastMessage: chatMessageInfo.lastMessage,
          timestamp: chatMessageInfo.timestamp,
        };
      })
    );

    setChats(chats.filter((chat) => chat !== null));

    // console.log("CONVERSATIONS", conversations);
    console.log("CHATS", chats);
  };

  useEffect(() => {
    loadChats();
  }, []);

  const loadChatMessages = async (conversationid: string) => {
    const chatMessages = await indexMessages(
      query(
        messagesCollection,
        where("conversationid", "==", conversationid),
        orderBy("timestamp", "desc")
      )
    );

    setChatMessages(
      chatMessages.map((chatMessage) => ({
        id: chatMessage.id,
        senderId: chatMessage.senderid,
        senderName: "User",
        senderAvatar: "https://via.placeholder.com/40",
        message: chatMessage.content,
        timestamp: new Date(
          chatMessage.timestamp.seconds * 1000
        ).toLocaleTimeString(),
        isCurrentUser: chatMessage.senderid === currentUserId,
      }))
    );
  };

  const handleChatSelect = (chat: Chat) => {
    loadChatMessages(chat.conversationid);
    setSelectedChat(chat);
    setShowMeetVerification(false); // Close meet verification when switching chats
  };

  return (
    <div className="h-screen w-full p-4">
      <div className="flex h-full w-full gap-4">
        {/* Left side - User list (30%) */}
        <Card className="w-[30%] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle>Messages</CardTitle>
            <CardDescription>Your conversations</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <ChatList
              chats={chats}
              selectedChatId={selectedChat?.id}
              onChatSelect={handleChatSelect}
            />
          </CardContent>
        </Card>

        {/* Right side - Chat area (70%) */}
        <div className="w-[70%] flex flex-col gap-4">
          {selectedChat ? (
            <>
              {/* Top section - Chat header with meet verification */}
              <Card className="flex-shrink-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>{selectedChat.name}</CardTitle>
                    {/* <CardDescription></CardDescription> */}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setShowMeetVerification(!showMeetVerification)
                      }
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Meet Up
                    </Button>
                  </div>
                </CardHeader>

                {/* Meet Verification Section */}
                {showMeetVerification && (
                  <CardContent className="pt-0">
                    <MeetVerification />
                  </CardContent>
                )}
              </Card>

              {/* Chat area */}
              <Card className="flex-1 flex flex-col">
                <CardContent className="flex-1 overflow-y-auto p-0">
                  <ChatBubbles
                    messages={chatMessages}
                    currentUserId={currentUserId}
                  />
                </CardContent>
                <CardFooter className="flex-shrink-0 p-4">
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      type="text"
                      placeholder={`Message ${selectedChat.name}...`}
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </>
          ) : (
            <Card className="flex-1 flex items-center justify-center">
              <CardContent>
                <p className="text-gray-500 text-center">
                  Select a conversation to start messaging
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
