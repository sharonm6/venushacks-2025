import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { index as indexPosts } from "@/services/posts";
import { index as indexProfile } from "@/services/profiles";
import { Post, FeedItem } from "@/lib/types";
import { type Club } from "@/lib/clubDatabase";
import { parse } from "path";

// Mock comments data
const mockComments = {
  1: [
    {
      id: 1,
      user: {
        name: "Mike Johnson",
        avatar: "https://via.placeholder.com/32",
        username: "mike.j",
      },
      content:
        "This sounds amazing! Can't wait to participate. When will registration open?",
      timestamp: "1 hour ago",
      likes: 3,
    },
    {
      id: 2,
      user: {
        name: "Lisa Wang",
        avatar: "https://via.placeholder.com/32",
        username: "lisa.w",
      },
      content:
        "Looking forward to this! Will there be prizes for different categories?",
      timestamp: "45 minutes ago",
      likes: 2,
    },
  ],
  2: [
    {
      id: 3,
      user: {
        name: "Carlos Rodriguez",
        avatar: "https://via.placeholder.com/32",
        username: "carlos.r",
      },
      content:
        "Perfect timing! I've been wanting to learn ML. Will materials be provided?",
      timestamp: "3 hours ago",
      likes: 5,
    },
  ],
  3: [
    {
      id: 4,
      user: {
        name: "Anna Kim",
        avatar: "https://via.placeholder.com/32",
        username: "anna.k",
      },
      content:
        "I'm interested! What topics will you be covering in the study sessions?",
      timestamp: "6 hours ago",
      likes: 1,
    },
  ],
};

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
      "Join us for 48 hours of coding, innovation, and fun. Registration opens next week! This will be our biggest event yet with amazing prizes and mentors from top tech companies.",
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
      "Don't miss our ML workshop this Friday at 6 PM in the CS building. We'll cover the basics of neural networks and hands-on coding with Python.",
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
      "Looking for motivated students to join our weekly study sessions. We meet every Tuesday at 7 PM in the library.",
    timestamp: "1 day ago",
    likes: 15,
    comments: 6,
  },
  {
    id: 4,
    user: {
      name: "Alex Johnson",
      avatar: "https://via.placeholder.com/40",
      username: "alex.j",
    },
    title: "Great networking event last night!",
    content:
      "Thanks to everyone who attended our industry networking mixer. Amazing connections were made and we can't wait for the next one!",
    timestamp: "2 days ago",
    likes: 32,
    comments: 15,
  },
  {
    id: 5,
    user: {
      name: "Maya Patel",
      avatar: "https://via.placeholder.com/40",
      username: "maya.p",
    },
    title: "New member orientation this weekend",
    content:
      "Welcome all new members! Join us Saturday at 10 AM for orientation and team building activities. Lunch will be provided.",
    timestamp: "3 days ago",
    likes: 21,
    comments: 9,
  },
  {
    id: 6,
    user: {
      name: "David Wilson",
      avatar: "https://via.placeholder.com/40",
      username: "david.w",
    },
    title: "Project showcase submissions due soon",
    content:
      "Reminder: All project showcase submissions are due this Friday. Don't forget to include your demo video and project documentation.",
    timestamp: "4 days ago",
    likes: 28,
    comments: 7,
  },
];

interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

interface CommentProps {
  comment: Comment;
}

type CommentsType = Record<string, Comment[]>;

function Comment({ comment }: CommentProps) {
  const [liked, setLiked] = useState(false);
  const [commentLikes, setCommentLikes] = useState(comment.likes);

  const handleLike = () => {
    setLiked(!liked);
    setCommentLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="flex items-start space-x-3 py-2">
      <Avatar className="h-8 w-8 ring-1 ring-purple-100">
        <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
        <AvatarFallback className="bg-purple-50 text-purple-600 text-xs">
          {comment.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-xs text-gray-900">
              {comment.user.name}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {comment.content}
          </p>
        </div>

        <div className="flex items-center space-x-4 px-3">
          <span className="text-xs text-gray-500">{comment.timestamp}</span>
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 text-xs transition-colors ${
              liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <Heart className={`h-3 w-3 ${liked ? "fill-current" : ""}`} />
            <span>{commentLikes}</span>
          </button>
          <button className="text-xs text-gray-500 hover:text-purple-600 transition-colors">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Feed({ club }: { club: Club }) {
  const userid = "jZDLVSPOI9A3xQQhwEef";

  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [postLikes, setPostLikes] = useState<Record<string, number>>({});
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set()
  );
  const [comments, setComments] = useState<CommentsType>([]);
  const [newComments, setNewComments] = useState<Record<number, string>>({});

  useEffect(() => {
    loadFeed();
  }, []);

  function formatTimestamp(timestamp: {
    seconds: number;
    nanoseconds: number;
  }): string {
    const now = Date.now();
    const postTime = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const diffInMs = now - postTime;

    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  }

  const getUserInfo = async (posterid: string) => {
    const profile = await indexProfile(posterid);

    return {
      name: profile ? profile.name : "Hidden User",
      avatar: profile ? profile.picture : "/avatar0.png",
    };
  };

  const parseComments = (posts: Post[]) => {
    const parsedComments: CommentsType = {};
    posts.forEach(async (post) => {
      if (post.comments) {
        const commentStrings = post.comments.split(";");
        parsedComments[post.id] = await Promise.all(
          commentStrings.map(async (commentStr, index) => {
            const match = commentStr.match(/^(.+)\(([^,]+),([^,]+),(\d+)\)$/);
            if (match) {
              const [, content, userid, timestamp, numlikes] = match;
              const commenterInfo = await getUserInfo(userid);

              return {
                id: index + 1,
                user: {
                  name: commenterInfo.name || "Hidden user",
                  avatar: commenterInfo.avatar || "/avatar0.png",
                },
                content: content.trim(),
                timestamp: formatTimestamp({
                  seconds: parseInt(new Date(timestamp).getTime() / 1000 + ""),
                  nanoseconds: 0,
                }),
                likes: parseInt(numlikes),
              };
            }
            return {
              id: index + 1,
              user: {
                name: "User",
                avatar: "/avatar0.png",
                username: "user",
              },
              content: commentStr,
              timestamp: "1 hour ago",
              likes: 0,
            };
          })
        );
      }
    });
    return parsedComments;
  };

  const loadFeed = async () => {
    const posts = await indexPosts(club.id);

    const feedItems: FeedItem[] = await Promise.all(
      posts.map(async (post) => ({
        id: post.id,
        user: (await getUserInfo(post.posterid)) || {
          name: "Hidden User",
          avatar: "/avatar0.png",
        },
        title: post.title,
        content: post.content,
        timestamp: formatTimestamp(post.timestamp),
        likes: post.likes ? post.likes.split(",").length : 0,
        comments: post.comments ? post.comments.split(";").length : 0,
      }))
    );

    setPostLikes(
      feedItems.reduce((acc, item) => {
        acc[item.id] = item.likes;
        return acc;
      }, {} as Record<string, number>)
    );

    const parsedComments = parseComments(posts);
    setComments(parsedComments);

    setPostLikes(
      feedItems.reduce((acc, item) => {
        acc[item.id] = item.likes;
        return acc;
      }, {} as Record<string, number>)
    );

    setFeedItems(feedItems);

    console.log("Feed items loaded:", feedItems);
  };

  const handleLike = (postId: number) => {
    const newLikedPosts = new Set(likedPosts);
    const isLiked = likedPosts.has(postId);

    if (isLiked) {
      newLikedPosts.delete(postId);
      setPostLikes((prev) => ({ ...prev, [postId]: prev[postId] - 1 }));
    } else {
      newLikedPosts.add(postId);
      setPostLikes((prev) => ({ ...prev, [postId]: prev[postId] + 1 }));
    }

    setLikedPosts(newLikedPosts);
  };

  const toggleComments = (postId: number) => {
    const newExpanded = new Set(expandedComments);
    if (expandedComments.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  const handleCommentChange = (postId: number, value: string) => {
    setNewComments((prev) => ({ ...prev, [postId]: value }));
  };

  const submitComment = (postId: number) => {
    const commentText = newComments[postId]?.trim();
    if (!commentText) return;

    const newComment = {
      id: Date.now(),
      user: {
        name: "Current User",
        avatar: "https://via.placeholder.com/32",
        username: "current.user",
      },
      content: commentText,
      timestamp: "Just now",
      likes: 0,
    };

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    setNewComments((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, postId: number) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitComment(postId);
    }
  };

  return (
    <Card className="w-full h-full bg-white/90 backdrop-blur-sm border-2 border-venus-200 shadow-lg flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="text-lg text-purple-700">Club Feed</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full overflow-y-auto px-6 pb-6 space-y-4">
          {feedItems.map((item) => (
            <Card
              key={item.id}
              className="border border-purple-100 hover:shadow-md transition-all duration-200 hover:border-purple-200"
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10 ring-2 ring-purple-100">
                    <AvatarImage src={item.user.avatar} alt={item.user.name} />
                    <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-medium">
                      {item.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2 min-w-0">
                    {/* User info and timestamp */}
                    <div className="flex items-center space-x-2 flex-wrap">
                      <h4 className="font-semibold text-sm text-gray-900">
                        {item.user.name}
                      </h4>
                      <span className="text-gray-400 text-xs">•</span>
                      <span className="text-gray-500 text-xs">
                        {item.timestamp}
                      </span>
                    </div>

                    {/* Post content */}
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm text-gray-900 leading-relaxed">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.content}
                      </p>
                    </div>

                    {/* Interaction buttons */}
                    <div className="flex items-center space-x-6 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleLike(item.id)}
                        className={`flex items-center space-x-2 transition-colors group ${
                          likedPosts.has(item.id)
                            ? "text-red-500"
                            : "text-gray-500 hover:text-red-500"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            likedPosts.has(item.id)
                              ? "fill-current"
                              : "group-hover:fill-current"
                          }`}
                        />
                        <span className="text-xs font-medium">
                          {postLikes[item.id]}
                        </span>
                      </button>

                      <button
                        onClick={() => toggleComments(item.id)}
                        className={`flex items-center space-x-2 transition-colors ${
                          expandedComments.has(item.id)
                            ? "text-blue-500"
                            : "text-gray-500 hover:text-blue-500"
                        }`}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          {item.comments}
                        </span>
                      </button>

                      <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                        <Share className="h-4 w-4" />
                        <span className="text-xs font-medium">Share</span>
                      </button>
                    </div>

                    {/* Comments Section */}
                    {expandedComments.has(item.id) && (
                      <div className="pt-3 space-y-3 border-t border-gray-100">
                        {/* Existing Comments */}
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {comments[item.id]?.map((comment) => (
                            <Comment key={comment.id} comment={comment} />
                          ))}
                          {(!comments[item.id] ||
                            comments[item.id].length === 0) && (
                            <p className="text-gray-500 text-sm text-center py-4">
                              No comments yet. Be the first to comment!
                            </p>
                          )}
                        </div>

                        {/* Add Comment */}
                        <div className="flex items-start space-x-3 pt-2">
                          <Avatar className="h-8 w-8 ring-1 ring-purple-100">
                            <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                              CU
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder="Write a comment..."
                              value={newComments[item.id] || ""}
                              onChange={(e) =>
                                handleCommentChange(item.id, e.target.value)
                              }
                              onKeyPress={(e) => handleKeyPress(e, item.id)}
                              className="min-h-[80px] text-sm border-purple-200 focus:border-purple-400 focus:ring-purple-300 resize-none"
                            />
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                Press Enter to post, Shift+Enter for new line
                              </span>
                              <Button
                                onClick={() => submitComment(item.id)}
                                disabled={!newComments[item.id]?.trim()}
                                size="sm"
                                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
                              >
                                <Send className="h-3 w-3 mr-1" />
                                Post
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
