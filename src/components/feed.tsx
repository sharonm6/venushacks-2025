import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { index as indexPosts } from "@/services/posts";
import { index as indexProfile } from "@/services/profiles";
import { Post, FeedItem } from "@/lib/types";
import { type Club } from "@/lib/clubDatabase";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heart, MessageCircle, Share, Send, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { postsCollection } from "@/utils/firebase.browser";

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

// interface CommentProps {
//   comment: Comment;
// }

type CommentsType = Record<string, Comment[]>;

function Comment({ comment }: { comment: Comment }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [commentLikes, setCommentLikes] = useState(comment.likes);

  const handleLike = () => {
    setLiked(!liked);
    setCommentLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleUserClick = () => {
    router.push(`/profile/${comment.user.id}`);
  };

  return (
    <div className="flex items-start space-x-3 py-2">
      <Avatar
        className="h-8 w-8 ring-1 ring-purple-100 cursor-pointer hover:ring-2 hover:ring-purple-300 transition-all duration-200"
        onClick={handleUserClick}
      >
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
            <span
              className="font-medium text-xs text-gray-900 cursor-pointer hover:text-purple-600 transition-colors duration-200"
              onClick={handleUserClick}
            >
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
        </div>
      </div>
    </div>
  );
}

// SHARON - new db structure
interface NewPostData {
  title: string;
  content: string;
  meetupLocations: {
    acc: string[];
    campus: string[];
  };
}

const ACC_LOCATIONS = [
  {
    id: "PV",
    name: "PV (Balls)",
    address: "41 Arroyo Dr, Irvine, CA 92617",
  },

  {
    id: "CDS",
    name: "CDS (Lodge)",
    address: "33000 Arroyo Dr, Irvine, CA 92617",
  },
  {
    id: "VDC",
    name: "VDC (Community Center)",
    address: "62600 Arroyo Dr, Irvine, CA 92617",
  },
  {
    id: "VDCN",
    name: "VDCN (Clubhouse)",
    address: "28700 Arroyo Dr, Irvine, CA 92617",
  },
  {
    id: "PDS",
    name: "PDS (Community Center)",
    address: "10000 Adobe Cir Rd, Irvine, CA 92617",
  },
];

const CAMPUS_LOCATIONS = [
  {
    id: "DBH",
    name: "Donald Bren Hall",
    address: "Donald Bren Hall, Irvine, CA 92697",
  },
  {
    id: "ALP",
    name: "Anteater Learning Pavilion",
    address: "Aldrich Park, Irvine, CA 92697",
  },
  {
    id: "Brandywine",
    name: "Brandywine",
    address: "557 E Peltason Dr, Irvine, CA 92617",
  },
  {
    id: "Flagpoles",
    name: "Flagpoles",
    address: "Bus Loop, Irvine, CA 92612",
  },
  {
    id: "SciLib",
    name: "Science Library",
    address:
      "Ayala Science Library, Receiving Dock Bldg. 520, Irvine, CA 92697",
  },
];

export default function Feed({ club }: { club: Club }) {
  const userid = "jZDLVSPOI9A3xQQhwEef";
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    avatar: string;
  }>({ id: userid, name: "", avatar: "" });

  const router = useRouter();

  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [postLikes, setPostLikes] = useState<Record<string, number>>({});
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );
  const [comments, setComments] = useState<CommentsType>([]);
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState<NewPostData>({
    title: "",
    content: "",
    meetupLocations: {
      acc: [],
      campus: [],
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getUserInfo = async (posterid: string) => {
    const profile = await indexProfile(posterid);

    return {
      id: posterid,
      name: profile ? profile.name : "Hidden User",
      avatar: profile ? profile.picture : "/avatar0.png",
    };
  };

  const loadUserInfo = async () => {
    const currentUser = await getUserInfo(userid);
    setCurrentUser(currentUser);
  };

  useEffect(() => {
    loadUserInfo();
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
                id: timestamp.toString(),
                user: {
                  id: userid,
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
                id: "unknown",
                name: "User",
                avatar: "/avatar0.png",
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
      posts.map(async (post: Post) => ({
        id: post.id,
        user: (await getUserInfo(post.posterid)) || {
          id: post.posterid,
          name: "Hidden User",
          avatar: "/avatar0.png",
        },
        title: post.title,
        content: post.content,
        timestamp: formatTimestamp(post.timestamp),
        likes: post.likes ? post.likes.split(",").length : 0,
        likedUsers: post.likes || "",
        comments: post.comments ? post.comments.split(";").length : 0,
        commentsString: post.comments || "",
      }))
    );

    setPostLikes(
      feedItems.reduce((acc, item) => {
        acc[item.id] = item.likes;
        return acc;
      }, {} as Record<string, number>)
    );

    setLikedPosts(
      feedItems.reduce((acc, item) => {
        if (item.likedUsers.includes(currentUser.id)) {
          acc.add(item.id);
        }
        return acc;
      }, new Set<string>())
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

  const handleLike = (postId: string) => {
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

    updateDoc(doc(postsCollection, postId), {
      likes: isLiked
        ? feedItems
            .find((item) => item.id === postId)
            ?.likedUsers.split(",")
            .filter((userId) => userId !== currentUser.id)
            .concat(isLiked ? [] : currentUser.id)
            .join(",")
        : feedItems
            .find((item) => item.id === postId)
            ?.likedUsers.split(",")
            .concat(currentUser.id)
            .join(","),
    })
      .then(() => {})
      .catch((error) => {
        console.error("Error updating post likes:", error);
      });
  };

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (expandedComments.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  const handleCommentChange = (postId: string, value: string) => {
    setNewComments((prev) => ({ ...prev, [postId]: value }));
  };

  const submitComment = async (postId: string) => {
    const commentText = newComments[postId] || "";
    if (!commentText.trim()) return;

    try {
      const postRef = doc(postsCollection, postId || "");

      const currentTimestamp = new Date().toISOString();

      const newCommentString = `${commentText.trim()}(${
        currentUser.id
      },${currentTimestamp},0)`;

      const currentPost = feedItems.find((item) => item.id === postId);
      const existingComments = currentPost?.commentsString || "";

      const updatedComments = existingComments
        ? `${existingComments};${newCommentString}`
        : newCommentString;

      await updateDoc(postRef, {
        comments: updatedComments,
      });

      const newComment = {
        id: Date.now().toString(),
        user: {
          id: currentUser.id || "currentUser",
          name: currentUser.name || "Hidden user",
          avatar: currentUser.avatar || "/avatar0.png",
        },
        content: commentText.trim(),
        timestamp: formatTimestamp({
          seconds: Math.floor(Date.now() / 1000),
          nanoseconds: 0,
        }),
        likes: 0,
      };

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));

      setNewComments((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, postId: string) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitComment(postId);
    }
  };

  const handleUserClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    setIsSubmitting(true);

    try {
      // Include meetup locations in the post creation
      const createdPost = {
        id: Date.now(),
        user: {
          name: currentUser.name || "Current User",
          avatar: currentUser.avatar || "/avatar0.png",
          username: currentUser.id || "current.user",
        },
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        meetupLocations: newPost.meetupLocations,
        timestamp: "Just now",
        likes: 0,
        comments: 0,
      };

      // Reset form and close dialog
      setNewPost({
        title: "",
        content: "",
        meetupLocations: { acc: [], campus: [] },
      });
      setIsCreatePostOpen(false);

      // TODO: make API call to create post with meetup data
      // await createPost(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add function to generate Google Maps URL
  const generateMapsUrl = () => {
    const allSelectedLocations = [
      ...newPost.meetupLocations.acc.map(
        (id) => ACC_LOCATIONS.find((loc) => loc.id === id)?.address
      ),
      ...newPost.meetupLocations.campus.map(
        (id) => CAMPUS_LOCATIONS.find((loc) => loc.id === id)?.address
      ),
    ].filter(Boolean);

    if (allSelectedLocations.length === 0) return "";

    if (allSelectedLocations.length === 1) {
      // Single location - just search for it
      return `https://www.google.com/maps/search/${encodeURIComponent(
        allSelectedLocations[0] || ""
      )}`;
    }

    // Multiple locations - create directions between them
    const baseUrl = "https://www.google.com/maps/dir/";
    const encodedLocations = allSelectedLocations.map((addr) =>
      encodeURIComponent(addr || "")
    );

    // Join all locations with '/' as seen in your example
    const directionsUrl = `${baseUrl}${encodedLocations.join("/")}`;

    return directionsUrl;
  };
  const copyMapsUrl = async () => {
    const url = generateMapsUrl();
    if (url) {
      try {
        await navigator.clipboard.writeText(url);
        // You could add a toast notification here
        alert("Maps link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
  };

  const handleLocationChange = (
    type: "acc" | "campus",
    locationId: string,
    checked: boolean
  ) => {
    setNewPost((prev) => ({
      ...prev,
      meetupLocations: {
        ...prev.meetupLocations,
        [type]: checked
          ? [...prev.meetupLocations[type], locationId]
          : prev.meetupLocations[type].filter((id) => id !== locationId),
      },
    }));
  };

  return (
    <Card className="w-full h-full bg-white/90 backdrop-blur-sm border-2 border-venus-200 shadow-lg flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-purple-700">Club Feed</CardTitle>

          {/* Create Post Button */}
          <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-purple-700">
                  Create New Post
                </DialogTitle>
                <DialogDescription>
                  Share something with your club members. What's on your mind?
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Post Title
                  </label>
                  <Input
                    placeholder="Enter a catchy title for your post..."
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="border-purple-200 focus:border-purple-400 focus:ring-purple-300"
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <Textarea
                    placeholder="What would you like to share with your club members?"
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    className="min-h-[120px] border-purple-200 focus:border-purple-400 focus:ring-purple-300 resize-none"
                  />
                </div>

                {/* Meet Up Section */}
                <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-purple-700">
                      🏠 Meet Up Locations
                    </h3>
                    {(newPost.meetupLocations.acc.length > 0 ||
                      newPost.meetupLocations.campus.length > 0) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={copyMapsUrl}
                        className="text-xs border-purple-300 text-purple-600 hover:bg-purple-100"
                      >
                        📍 Copy Maps Link
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">
                    Select all locations where you're willing to meet up
                    (optional)
                  </p>

                  {/* ACC Locations */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      🏠 ACC Housing
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {ACC_LOCATIONS.map((location) => (
                        <label
                          key={location.id}
                          className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-white/50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={newPost.meetupLocations.acc.includes(
                              location.id
                            )}
                            onChange={(e) =>
                              handleLocationChange(
                                "acc",
                                location.id,
                                e.target.checked
                              )
                            }
                            className="rounded border-purple-300 text-purple-600 focus:ring-purple-300"
                          />
                          <span className="text-gray-700">{location.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Campus Locations */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      🎓 Campus Locations
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {CAMPUS_LOCATIONS.map((location) => (
                        <label
                          key={location.id}
                          className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-white/50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={newPost.meetupLocations.campus.includes(
                              location.id
                            )}
                            onChange={(e) =>
                              handleLocationChange(
                                "campus",
                                location.id,
                                e.target.checked
                              )
                            }
                            className="rounded border-purple-300 text-purple-600 focus:ring-purple-300"
                          />
                          <span className="text-gray-700">{location.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Selected locations preview */}
                  {(newPost.meetupLocations.acc.length > 0 ||
                    newPost.meetupLocations.campus.length > 0) && (
                    <div className="mt-3 p-3 bg-white rounded border border-purple-200">
                      <p className="text-xs text-gray-600 mb-2">
                        Selected meetup locations:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {newPost.meetupLocations.acc.map((id) => {
                          const location = ACC_LOCATIONS.find(
                            (loc) => loc.id === id
                          );
                          return (
                            <span
                              key={id}
                              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                            >
                              🏠 {location?.name}
                            </span>
                          );
                        })}
                        {newPost.meetupLocations.campus.map((id) => {
                          const location = CAMPUS_LOCATIONS.find(
                            (loc) => loc.id === id
                          );
                          return (
                            <span
                              key={id}
                              className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                            >
                              🎓 {location?.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Character counts */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{newPost.title.length}/100 characters for title</span>
                  <span>
                    {newPost.content.length}/500 characters for content
                  </span>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewPost({
                      title: "",
                      content: "",
                      meetupLocations: { acc: [], campus: [] },
                    });
                    setIsCreatePostOpen(false);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={
                    !newPost.title.trim() ||
                    !newPost.content.trim() ||
                    isSubmitting ||
                    newPost.title.length > 100 ||
                    newPost.content.length > 500
                  }
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3 mr-1" />
                      Post
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
                  <Avatar
                    className="h-10 w-10 ring-2 ring-purple-100 cursor-pointer hover:ring-purple-300 transition-all duration-200"
                    onClick={() => handleUserClick(item.user.id)}
                  >
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
                      <h4
                        className="font-semibold text-sm text-gray-900 cursor-pointer hover:text-purple-600 transition-colors duration-200"
                        onClick={() => handleUserClick(item.user.username)}
                      >
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
                          item.likedUsers?.includes(currentUser.id)
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
                            <AvatarImage
                              src={currentUser.avatar || "/avatar0.png"}
                              alt="Current User"
                            />
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
