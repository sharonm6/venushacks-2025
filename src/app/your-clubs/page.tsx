"use client";
import { AnimatedTestimonialsDemo } from "@/components/ui/club-list";

export default function YourClubsPage() {
  return (
    <div className="mx-auto flex w-full flex-col space-y-8 bg-venus-light">
      <div className="mx-auto flex h-screen w-full flex-col">
        <AnimatedTestimonialsDemo />
      </div>
    </div>
  );
}
