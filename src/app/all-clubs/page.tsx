"use client";
import { AllClubsList } from "@/components/ui/all-clubs-list";

export default function AllClubsPage() {
  return (
    <div className="mx-auto flex w-full flex-col space-y-12 bg-venus-light min-h-screen">
      <div className="mx-auto flex h-screen w-full flex-col">
        <AllClubsList />
      </div>
    </div>
  );
}
