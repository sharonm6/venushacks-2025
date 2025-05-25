"use client";
import { useParams } from "next/navigation";
import { clubsDatabase, type Club } from "@/lib/clubDatabase";
import ClubBanner from "@/components/club-banner";
import { useEffect, useState } from "react";

export default function ClubPage() {
  const params = useParams();
  const clubId = params.id as string;
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clubId) {
      const foundClub = clubsDatabase.getClubById(clubId);
      setClub(foundClub || null);
      setLoading(false);
    }
  }, [clubId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-venus-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading club details...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-venus-light">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            Club Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            The club you're looking for doesn't exist.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col space-y-8 bg-venus-light min-h-screen">
      <ClubBanner club={club} />
    </div>
  );
}
