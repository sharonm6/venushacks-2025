import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Feed from "@/components/feed";

const club = {
  name: "wics",
  description: "Women in Information and Computer Science",
  content: "This is the content of the club.",
  imageUrl: "https://via.placeholder.com/150",
};

export default function ClubBanner() {
  return (
    <div className="flex w-full p-8">
      {/* Banner Section */}
      <section className="flex w-full flex-col space-y-4">
        {/* Club Banner */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex flex-row items-center space-x-4">
              <Avatar className="h-24 w-24 p-3">
                <AvatarImage src={club.imageUrl} alt={`${club.name} logo`} />
                <AvatarFallback>
                  {club.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle>{club.name}</CardTitle>
                <CardDescription>{club.description}</CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">Create Post</Button>
              <Button>Join Club</Button>
            </div>
          </CardHeader>
        </Card>

        {/* Important Links*/}
        {/* Scrollable Feed */}
        <Feed />
      </section>
    </div>
  );
}
