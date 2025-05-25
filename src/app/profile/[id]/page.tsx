"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Eye,
  EyeOff,
  Edit3,
  Save,
  X,
  Users,
  GraduationCap,
  BookOpen,
  User,
  Heart,
  Calendar,
  Pencil,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import { index } from "@/services/profiles";
import { Profile, JoinedClub } from "@/lib/types";
import { profilesCollection } from "@/utils/firebase.browser";
import { doc, updateDoc } from "firebase/firestore";
import { clubsData } from "@/lib/clubDatabase";

const AVAILABLE_AVATARS = [
  "/avatar0.png",
  "/avatar1.png",
  "/avatar2.png",
  "/avatar3.png",
  "/avatar4.png",
  "/avatar5.png",
  "/avatar6.png",
  "/avatar7.png",
];

export default function ProfilePage() {
  let userid = "pdQPZmjZ3XFKxgjkUq3O";

  useEffect(() => {
    userid = localStorage.getItem("userId") || "";
  }, []);

  const [profile, setProfile] = useState<Profile>({
    id: "",
    picture: "",
    name: "",
    pronouns: "",
    year: "",
    major: "",
    bio: "",
    isHidden: false,
    clubs: "",
  });
  const [joinedClubs, setJoinedClubs] = useState<JoinedClub[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const getClubsInfo = (clubIds: string): JoinedClub[] => {
    if (!clubIds.trim()) return [];

    const idsArray = clubIds.split(",").map((id) => id.trim());
    if (idsArray.length === 0) return [];

    return idsArray
      .map((item) => {
        const match = item.match(/^([^(]+)\(([^)]+)\)$/);
        if (!match) return null;

        const clubId = match[1].trim();
        const joinDate = match[2].trim();

        const club = clubsData.find((club) => club.id === clubId);
        if (!club) return null;

        return {
          id: club.id,
          name: club.name,
          category: club.category,
          avatar: "/avatar0.png",
          joinDate: joinDate,
        };
      })
      .filter((club): club is JoinedClub => club !== null);
  };

  const getJoinedClubsInfo = async (profile: Profile) => {
    if (!profile.clubs || profile.clubs.trim() === "") return [];

    const clubsInfo = getClubsInfo(profile.clubs);

    return clubsInfo.map((club) => ({
      id: club.id,
      name: club.name,
      category: club.category,
      avatar: club.id + "_logo.png" || "",
      joinDate:
        club.joinDate ||
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        }),
    }));
  };

  const loadProfiles = async () => {
    const profile = await index(userid);
    setProfile(profile);

    const joinedClubs = await getJoinedClubsInfo(profile);
    setJoinedClubs(joinedClubs);
  };

  const toggleVisibility = () => {
    setProfile((prev) => ({ ...prev, isHidden: !prev.isHidden }));
  };

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSaveWrite = async (editedProfile: Profile) => {
    const conversationRef = doc(profilesCollection, userid || "");

    await updateDoc(conversationRef, {
      picture: editedProfile.picture,
      name: editedProfile.name,
      pronouns: editedProfile.pronouns,
      year: editedProfile.year,
      major: editedProfile.major,
      bio: editedProfile.bio,
      isHidden: editedProfile.isHidden,
    });
  };

  const handleSave = () => {
    handleSaveWrite(editedProfile);
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setEditedProfile((prev) => ({ ...prev, picture: avatarUrl }));
    setIsAvatarDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-venus-light p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with Privacy Controls */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-venus-purple-900">
            My Profile
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleVisibility}
              className={`${
                profile.isHidden
                  ? "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                  : "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
              }`}
            >
              {profile.isHidden ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hidden
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Visible
                </>
              )}
            </Button>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="text-venus-purple-700 border-venus-purple-300"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="text-red-700 border-red-300 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-venus-primary hover:bg-venus-secondary text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Privacy Notice */}
        {profile.isHidden && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center text-red-700">
                <EyeOff className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">
                  Your profile is hidden. Other users cannot see your name or
                  picture.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Profile Card */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-2 border-venus-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture */}
              <div className="flex justify-center md:justify-start">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    {profile.isHidden ? (
                      <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center border-4 border-venus-200">
                        <User className="w-8 h-8 text-gray-500" />
                      </div>
                    ) : (
                      <Avatar className="w-24 h-24 border-4 border-venus-300 shadow-lg">
                        <AvatarImage
                          src={
                            isEditing ? editedProfile.picture : profile.picture
                          }
                          alt={profile.name}
                        />
                        <AvatarFallback className="bg-venus-primary text-white text-xl">
                          {profile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  {/* Pencil button appears to the right of avatar when editing and profile is not hidden */}
                  {isEditing && !profile.isHidden && (
                    <Dialog
                      open={isAvatarDialogOpen}
                      onOpenChange={setIsAvatarDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="rounded-full w-8 h-8 p-0 bg-venus-primary hover:bg-venus-secondary"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-venus-purple-900">
                            Choose Your Avatar
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-4 gap-3 mt-4">
                          {AVAILABLE_AVATARS.map((avatarUrl, index) => (
                            <div
                              key={index}
                              className="relative cursor-pointer group"
                              onClick={() => handleAvatarSelect(avatarUrl)}
                            >
                              <Avatar className="w-16 h-16 border-2 border-venus-200 group-hover:border-venus-400 transition-colors">
                                <AvatarImage
                                  src={avatarUrl}
                                  alt={`Avatar ${index + 1}`}
                                />
                                <AvatarFallback className="bg-venus-100">
                                  {index + 1}
                                </AvatarFallback>
                              </Avatar>
                              {editedProfile.picture === avatarUrl && (
                                <div className="absolute inset-0 bg-venus-primary/20 rounded-full flex items-center justify-center">
                                  <Check className="w-6 h-6 text-venus-primary" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                {/* Name */}
                {isEditing ? (
                  <div className="mb-3">
                    <Label htmlFor="name" className="text-venus-purple-700">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={editedProfile.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="mt-1"
                      placeholder="Name"
                    />
                  </div>
                ) : (
                  <>
                    {profile.id ? (
                      <>
                        <h2 className="text-2xl font-bold text-venus-purple-900 mb-2">
                          {profile.isHidden
                            ? "Hidden User"
                            : profile.name || "Anonymous"}
                        </h2>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}

                {/* Pronouns */}
                {isEditing ? (
                  <div className="mb-3">
                    <Label htmlFor="pronouns" className="text-venus-purple-700">
                      Pronouns
                    </Label>
                    <Input
                      id="pronouns"
                      value={editedProfile.pronouns}
                      onChange={(e) =>
                        handleInputChange("pronouns", e.target.value)
                      }
                      className="mt-1"
                      placeholder="e.g., she/her, he/him, they/them"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center md:justify-start mb-3">
                    {profile.id && (
                      <Badge
                        variant="outline"
                        className="text-venus-purple-600 border-venus-purple-300"
                      >
                        {profile.pronouns || "Pronouns not set"}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Academic Info */}
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="year" className="text-venus-purple-700">
                        Year
                      </Label>
                      <Input
                        id="year"
                        value={editedProfile.year}
                        onChange={(e) =>
                          handleInputChange("year", e.target.value)
                        }
                        className="mt-1"
                        placeholder="e.g., Freshman, Sophomore"
                      />
                    </div>
                    <div>
                      <Label htmlFor="major" className="text-venus-purple-700">
                        Major
                      </Label>
                      <Input
                        id="major"
                        value={editedProfile.major}
                        onChange={(e) =>
                          handleInputChange("major", e.target.value)
                        }
                        className="mt-1"
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center justify-center md:justify-start">
                      {profile.id && (
                        <>
                          <Calendar className="w-4 h-4 text-venus-purple-600 mr-2" />

                          <span className="text-venus-purple-700 font-medium">
                            {profile.year || "Year not set"}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      {profile.id && (
                        <>
                          <GraduationCap className="w-4 h-4 text-venus-purple-600 mr-2" />

                          <span className="text-venus-purple-700 font-medium">
                            {profile.major || "Major not set"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Section */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-2 border-venus-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-venus-purple-900">
              <BookOpen className="w-5 h-5 mr-2" />
              About Me
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div>
                <Label htmlFor="bio" className="text-venus-purple-700">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={editedProfile.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="mt-1 min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
              </div>
            ) : (
              <p className="text-venus-purple-700 leading-relaxed">
                {profile.bio}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Joined Clubs Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-venus-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-venus-purple-900">
              <Heart className="w-5 h-5 mr-2" />
              My Clubs
              <Badge className="ml-2 bg-venus-200 text-venus-purple-800">
                {joinedClubs.length} clubs
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {joinedClubs.map((club) => (
                <div
                  key={club.id}
                  className="flex items-center p-4 rounded-xl border-2 border-venus-100 hover:border-venus-300 transition-all duration-300 hover:shadow-md bg-venus-50/50"
                >
                  {/* Club Avatar */}
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage src={club.avatar} alt={club.name} />
                    <AvatarFallback className="bg-venus-300 text-venus-purple-800">
                      {club.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Club Info */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-venus-purple-900 mb-1">
                      {club.name}
                    </h4>
                    <p className="text-sm text-venus-purple-600">
                      {club.category}
                    </p>
                  </div>

                  {/* Join Date */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-venus-purple-900">
                      Member since
                    </p>
                    <p className="text-xs text-venus-purple-600">
                      {club.joinDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Browse Clubs Button */}
            <div className="mt-6 text-center">
              <Button className="bg-venus-primary hover:bg-venus-secondary text-white">
                <Users className="w-4 h-4 mr-2" />
                Browse More Clubs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 pb-6">
          <p className="text-xs text-venus-purple-600">
            Profile visibility can be toggled anytime in settings
          </p>
        </div>
      </div>
    </div>
  );
}
