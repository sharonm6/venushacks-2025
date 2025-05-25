"use client";
import { useParams } from "next/navigation";
import { clubsDatabase, type Club } from "@/lib/clubDatabase";
import ClubBanner from "@/components/club-banner";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { index as indexProfiles } from "@/services/profiles";

export default function ClubPage() {
  const userid = "jZDLVSPOI9A3xQQhwEef";
  const params = useParams();
  const clubId = params.id as string;
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialJoined, setInitialJoined] = useState<boolean | null>(null);

  const loadClubInfo = async () => {
    const foundClub = clubsDatabase.getClubById(clubId);
    setClub(foundClub || null);

    const profile = await indexProfiles(userid);

    setInitialJoined(profile.clubs.includes(clubId) || false);
  };

  useEffect(() => {
    if (clubId) {
      loadClubInfo();

      setLoading(false);
    }
  }, [clubId]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-venus-light"
      >
        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          />
          <motion.p
            className="text-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading club details...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  if (!club) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="min-h-screen flex items-center justify-center bg-venus-light"
      >
        <motion.div
          className="text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <motion.h1
            className="text-2xl font-bold text-gray-600 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Club Not Found
          </motion.h1>
          <motion.p
            className="text-gray-500 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            The club you're looking for doesn't exist.
          </motion.p>
          <motion.button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium"
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={clubId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          staggerChildren: 0.1,
        }}
        className="mx-auto flex w-full flex-col space-y-8 bg-venus-light min-h-screen"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          <ClubBanner club={club} initialJoinStatus={initialJoined} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
