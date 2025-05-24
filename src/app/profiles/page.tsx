"use client";

import { useEffect, useState } from "react";
import { index } from "@/services/profiles";
import { Profile } from "@/lib/types";

export default function Posts() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const profiles = await index();

    console.log("Profiles", profiles);
    setProfiles(profiles);
  };

  return (
    <div className="mx-auto flex w-full flex-col space-y-8 pt-16">
      <h1 className="text-2xl font-bold">Profiles</h1>
      <div className="flex flex-col space-y-4">
        {profiles.map((profile) => (
          <div key={profile.name} className="p-4 border rounded">
            <h2 className="text-xl">{profile.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
