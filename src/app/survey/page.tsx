"use client";

import { useEffect, useState } from "react";
import { index } from "@/services/profiles";
import { Profile } from "@/lib/types";
import ClubMatchingSurvey from "@/components/club-match-form";
import ClubPostcard from "@/components/postcard-form";

export default function SurveyPage() {
  // Survey Page -> start -> switch state to question to match with clubs
  return (
    <div className="mx-auto flex w-full flex-col space-y-8 bg-venus-light">
      <ClubMatchingSurvey></ClubMatchingSurvey>
    </div>
  );
}
