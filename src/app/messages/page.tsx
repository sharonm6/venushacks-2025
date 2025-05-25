"use client";

import ChatBubbles from "@/components/chat-bubbles";
import ChatList from "@/components/chat-list";
import MeetVerification from "@/components/meet-verification";
import AvatarWithSpeechBubble from "@/components/avatar-speech-bubble";
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
import {
  conversationsCollection,
  messagesCollection,
} from "@/utils/firebase.browser";
import {
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [chatUserPicture, setChatUserPicture] = useState<string>("");
  const [userPicture, setUserPicture] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const [agreedA, setAgreedA] = useState(false);
  const [agreedB, setAgreedB] = useState(false);
  const [showMeetVerification, setShowMeetVerification] = useState(false);

  let currentUserId = "";

  useEffect(() => {
    currentUserId = localStorage.getItem("userId") || "";
  }, []);

  const loadUserProfile = async (userId: string) => {
    const chatUserProfile = await indexProfiles(userId);
    return chatUserProfile || null;
  };

  const loadConversations = async () => {
    const conversations = await indexConversations();
    setConversations(conversations);
    return conversations;
  };

  const loadChatMessageInfo = async (conversationid: string) => {
    const chatMessages = await indexMessages(
      query(
        messagesCollection,
        where("conversationid", "==", conversationid),
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
        timestamp: new Date(Date.now()).toLocaleDateString(),
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
        setChatUserPicture(chatUserProfile.picture || "");

        const userProfile = await loadUserProfile(currentUserId);
        setUserPicture(userProfile.picture || "");

        if (!chatUserProfile && !userProfile) {
          return null; // Skip if profiles not found
        }

        setUserName(userProfile!.name);

        const chatMessageInfo = await loadChatMessageInfo(conversation.id);

        return {
          id: idx,
          conversationid: conversation.id,
          userId: chatUserId,
          name: chatUserProfile.name,
          avatar: chatUserProfile.picture,
          lastMessage: chatMessageInfo.lastMessage,
          timestamp: chatMessageInfo.timestamp,
          isOnline: Math.random() > 0.5, // Add random online status for demo
          unreadCount: Math.floor(Math.random() * 3), // Add random unread count for demo
        };
      })
    );

    setChats(chats.filter((chat) => chat !== null));
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
        senderAvatar:
          chatMessage.senderid === currentUserId
            ? userPicture
            : chatUserPicture,
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

  const handleChatSelect = async (chat: Chat) => {
    setIsLoading(true);

    // Add loading delay to prevent avatar flicker
    await new Promise((resolve) => setTimeout(resolve, 300));

    const selectedConversation = conversations.find(
      (conversation) => conversation.id === chat.conversationid
    );
    if (selectedConversation) {
      setAgreedA(selectedConversation.agreedA);
      setAgreedB(selectedConversation.agreedB);
      setChatUserPicture(chat.avatar || "");
    }

    await loadChatMessages(chat.conversationid, chat.name);
    setSelectedChat(chat);
    setShowMeetVerification(false); // Close meet verification when switching chats
    setIsLoading(false);

    // Auto-focus on message input after a short delay
    setTimeout(() => {
      const messageInput = document.querySelector(
        'input[placeholder*="Message"]'
      ) as HTMLInputElement;
      if (messageInput) {
        messageInput.focus();
      }
    }, 100);
  };

  const handleMessageSend = async () => {
    if (messageToSend.trim() === "") return;

    await addDoc(messagesCollection, {
      conversationid: selectedChat?.conversationid,
      senderid: currentUserId,
      content: messageToSend,
      timestamp: new Date(),
    });
    setMessageToSend("");

    if (!selectedChat) return;

    await loadChatMessages(selectedChat.conversationid, selectedChat.name);

    const chatMessageInfo = await loadChatMessageInfo(
      selectedChat.conversationid
    );

    const updatedChat = {
      ...selectedChat,
      lastMessage: chatMessageInfo.lastMessage,
      timestamp: chatMessageInfo.timestamp,
    };

    setChats((prevChats) => {
      const filtered = prevChats.filter((chat) => chat.id !== selectedChat.id);
      return [updatedChat, ...filtered];
    });

    setSelectedChat(updatedChat);

    // Auto-focus back to input after sending
    setTimeout(() => {
      const messageInput = document.querySelector(
        'input[placeholder*="Message"]'
      ) as HTMLInputElement;
      if (messageInput) {
        messageInput.focus();
      }
    }, 50);
  };

  const handleMeetReady = async (agreedA: boolean) => {
    const conversationRef = doc(
      conversationsCollection,
      selectedChat?.conversationid || ""
    );

    await updateDoc(conversationRef, {
      agreedA: agreedA,
    });
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
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Right side - Chat area (70%) */}
        <div className="w-[70%] flex flex-col">
          {selectedChat ? (
            <>
              {/* Top section - Chat header with meet verification */}
              <Card className="flex-shrink-0 mb-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center space-x-3">
                    {/* Show loading indicator in header during chat switch */}
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    ) : null}
                    <div>
                      <CardTitle>{selectedChat.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        {isLoading ? "Loading..." : "Active now"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setShowMeetVerification(!showMeetVerification)
                      }
                      disabled={isLoading}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Meet Up
                    </Button>
                  </div>
                </CardHeader>

                {/* Meet Verification Section */}
                {showMeetVerification && !isLoading && (
                  <CardContent className="pt-0">
                    <MeetVerification
                      agreedA={agreedA || false}
                      agreedB={agreedB || false}
                      handleMeetReady={handleMeetReady}
                    />
                  </CardContent>
                )}
              </Card>

              {/* Chat messages area - Fill remaining space exactly */}
              <div className="flex-1 flex flex-col bg-white rounded-lg border shadow-sm overflow-hidden min-h-0">
                {/* Chat messages with scroll */}
                <div className="flex-1 overflow-y-auto">
                  <ChatBubbles
                    messages={chatMessages}
                    userPicture={userPicture}
                    chatUserPicture={chatUserPicture}
                    isLoading={isLoading}
                  />
                </div>

                {/* Message input - Fixed at bottom */}
                <div className="flex-shrink-0 p-4 border-t bg-white">
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      type="text"
                      placeholder={`Message ${selectedChat.name}...`}
                      className="flex-1"
                      value={messageToSend}
                      onChange={(e) => setMessageToSend(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleMessageSend();
                        }
                      }}
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      size="sm"
                      onClick={handleMessageSend}
                      disabled={isLoading || messageToSend.trim() === ""}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Card className="flex-1 flex items-center justify-center relative">
              {/* Avatar Speech Bubble - Centered in chat area */}
              {!selectedChat && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <AvatarWithSpeechBubble
                    message="Select a user to view chat!"
                    avatarSrc={userPicture || "/default-avatar.png"}
                    show={true}
                    persistent={true}
                    centered={true}
                  />
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
