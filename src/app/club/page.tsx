import ClubBanner from "@/components/club-banner";

export default function Home() {
  return (
    <div className="mx-auto flex w-full flex-col space-y-8">
      <div className="mx-auto flex h-screen w-full flex-col">
        <ClubBanner />
      </div>
    </div>
  );
}
