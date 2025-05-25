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

import { Chat, Conversation, ChatMessage } from "@/lib/types";
import { messagesCollection } from "@/utils/firebase.browser";
import { query, where, orderBy, addDoc } from "firebase/firestore";

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  // const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>("");

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

    if (chatMessages.length > 0) {
      const lastChatMessage = chatMessages[chatMessages.length - 1];
      return {
        lastMessage: lastChatMessage.content,
        timestamp: new Date(
          lastChatMessage.timestamp.seconds * 1000
        ).toLocaleDateString(),
      };
    } else
      return {
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
        const userProfile = await loadUserProfile(currentUserId);

        if (!chatUserProfile && !userProfile) {
          return null; // Skip if profiles not found
        }

        setUserName(userProfile!.name);

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

  const loadChatMessages = async (
    conversationid: string,
    chatUserName: string
  ) => {
    const chatMessages = await indexMessages(
      query(
        messagesCollection,
        where("conversationid", "==", conversationid),
        orderBy("timestamp", "asc")
      )
    );

    setChatMessages(
      chatMessages.map((chatMessage) => ({
        id: chatMessage.id,
        senderId: chatMessage.senderid,
        senderName:
          chatMessage.senderid === currentUserId ? userName : chatUserName,
        senderAvatar: "https://via.placeholder.com/40",
        message: chatMessage.content,
        timestamp: new Date(
          chatMessage.timestamp.seconds * 1000
        ).toLocaleTimeString(navigator.language, {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isCurrentUser: chatMessage.senderid === currentUserId,
      }))
    );
  };

  const handleChatSelect = (chat: Chat) => {
    loadChatMessages(chat.conversationid, chat.name);
    setSelectedChat(chat);
    setShowMeetVerification(false); // Close meet verification when switching chats
  };

  const handleMessageSend = async () => {
    await await addDoc(messagesCollection, {
      conversationid: selectedChat?.conversationid,
      senderid: currentUserId,
      content: messageToSend,
      timestamp: new Date(),
    });
    setMessageToSend("");
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
                      value={messageToSend}
                      onChange={(e) => setMessageToSend(e.target.value)}
                    />
                    <Button type="submit" size="sm" onClick={handleMessageSend}>
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
