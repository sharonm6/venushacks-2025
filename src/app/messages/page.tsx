"use client";

import ChatBubbles from "@/components/chat-bubbles";
import ChatList from "@/components/chat-list";
import MeetVerification from "@/components/meet-verification";
import RevealIdentities from "@/components/reveal-identities";
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
import { Send, MapPin, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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

  // NEW: State management for the different views
  const [currentView, setCurrentView] = useState<"chat" | "meet" | "reveal">(
    "chat"
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentUserId = "jZDLVSPOI9A3xQQhwEef"; // This would come from your auth system

  // BACKEND NOTE: These functions remain the same but need to handle the new agreedA/agreedB logic
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
          return null;
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
        };
      })
    );

    setChats(chats.filter((chat) => chat !== null));
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
    setCurrentView("chat"); // Reset to chat view when selecting a new chat

    await new Promise((resolve) => setTimeout(resolve, 300));

    const selectedConversation = conversations.find(
      (conversation) => conversation.id === chat.conversationid
    );

    if (selectedConversation) {
      setAgreedA(selectedConversation.agreedA);
      setAgreedB(selectedConversation.agreedB);
      setChatUserPicture(chat.avatar || "");

      // BACKEND NOTE: Check if both users have agreed to meet
      // If so, automatically show the reveal view
      if (selectedConversation.agreedA && selectedConversation.agreedB) {
        setCurrentView("reveal");
      }
    }

    await loadChatMessages(chat.conversationid, chat.name);
    setSelectedChat(chat);
    setIsLoading(false);

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
    if (messageToSend.trim() === "" || currentView !== "chat") return;

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

    setTimeout(() => {
      const messageInput = document.querySelector(
        'input[placeholder*="Message"]'
      ) as HTMLInputElement;
      if (messageInput) {
        messageInput.focus();
      }
    }, 50);
  };

  // NEW: Handle meet up button click with animation
  const handleMeetUpClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView("meet");
      setIsTransitioning(false);
    }, 300);
  };

  // NEW: Handle back to chat with animation
  const handleBackToChat = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView("chat");
      setIsTransitioning(false);
    }, 300);
  };

  // UPDATED: Handle meet ready with transition to reveal
  const handleMeetReady = async (userAgreed: boolean) => {
    if (!selectedChat) return;

    const conversationRef = doc(
      conversationsCollection,
      selectedChat.conversationid
    );

    // BACKEND NOTE: Update the agreement status for the current user
    // You need to determine if this is userA or userB based on currentUserId
    const isUserA =
      conversations.find((c) => c.id === selectedChat.conversationid)
        ?.useridA === currentUserId;

    const updateData = isUserA
      ? { agreedA: userAgreed }
      : { agreedB: userAgreed };

    await updateDoc(conversationRef, updateData);

    // Update local state
    if (isUserA) {
      setAgreedA(userAgreed);
    } else {
      setAgreedB(userAgreed);
    }

    // BACKEND NOTE: If both users have now agreed, transition to reveal view
    const updatedConversation = conversations.find(
      (c) => c.id === selectedChat.conversationid
    );
    const bothAgreed = isUserA ? userAgreed && agreedB : agreedA && userAgreed;

    if (bothAgreed) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentView("reveal");
        setIsTransitioning(false);
      }, 500);
    }
  };

  // NEW: Handle reveal completion - route to user profile
  const handleRevealComplete = (otherUserId: string) => {
    router.push(`/profile/${otherUserId}`);
  };

  // NEW: Render the appropriate view with animations
  const renderChatArea = () => {
    if (!selectedChat) {
      return (
        <Card className="flex-1 flex items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <AvatarWithSpeechBubble
              message="Select a user to view chat!"
              avatarSrc={userPicture || "/default-avatar.png"}
              show={true}
              persistent={true}
              centered={true}
            />
          </div>
        </Card>
      );
    }

    return (
      <Card
        className={`flex-1 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden min-h-0 transition-all duration-300 ${
          isTransitioning ? "opacity-50 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {currentView === "chat" && (
          <>
            {/* Chat Header */}
            <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0 border-b">
              <div className="flex items-center space-x-3">
                {isLoading && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                )}
                <div>
                  <CardTitle>{selectedChat.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {isLoading ? "Loading..." : "Active now"}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMeetUpClick}
                disabled={isLoading}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 hover:from-pink-600 hover:to-purple-700"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Meet Up
              </Button>
            </CardHeader>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto">
              <ChatBubbles
                messages={chatMessages}
                userPicture={userPicture}
                chatUserPicture={chatUserPicture}
                isLoading={isLoading}
              />
            </div>

            {/* Message Input */}
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
          </>
        )}

        {currentView === "meet" && (
          <div className="flex-1 flex flex-col">
            {/* Meet Header */}
            <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0 border-b">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToChat}
                  className="mr-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle>Meet Up with {selectedChat.name}</CardTitle>
                  <CardDescription>
                    Arrange to meet in real life
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            {/* Meet Verification Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <MeetVerification
                agreedA={agreedA}
                agreedB={agreedB}
                handleMeetReady={handleMeetReady}
                currentUserAvatar={userPicture}
                otherUserAvatar={chatUserPicture}
                otherUserName={selectedChat.name}
                otherUserId={selectedChat.userId} // NEW: Pass the other user's ID
              />
            </div>
          </div>
        )}

        {currentView === "reveal" && (
          <div className="flex-1 flex flex-col">
            {/* Reveal Header */}
            <CardHeader className="flex-shrink-0 border-b">
              <div className="text-center">
                <CardTitle className="text-2xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  You're Set!
                </CardTitle>
                <CardDescription>You both want to meet up!</CardDescription>
              </div>
            </CardHeader>

            {/* Reveal Identities Content */}
            <div className="flex-1 overflow-y-auto">
              <RevealIdentities
                currentUserAvatar={userPicture}
                currentUserName={userName}
                otherUserAvatar={chatUserPicture}
                otherUserName={selectedChat.name}
                onRevealComplete={handleRevealComplete} // This now expects a parameter
                otherUserId={selectedChat.userId} // NEW: Pass the other user's ID
                simulateUser2Ready={true}
              />
            </div>
          </div>
        )}
      </Card>
    );
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

        {/* Right side - Dynamic content area (70%) */}
        <div className="w-[70%] flex flex-col">{renderChatArea()}</div>
      </div>
    </div>
  );
}
