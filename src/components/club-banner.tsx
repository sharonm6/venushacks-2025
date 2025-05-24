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
import { ExternalLink } from "lucide-react";
import Feed from "@/components/feed";

const club = {
  name: "WICS",
  description:
    "WICS is a social and professional nonprofit organization at UCI established to encourage women to pursue a college degree and a successful career in the computer science field. WICS does all of the following and more: provides support for women and other minorities through various activities, such as mentorship, socials, study sessions, company tours, professional workshops, and hackathons. hosts company networking opportunities in multiple events, including Mock Technical Interviews, a day-long event that provides students with a formal and growth-oriented interview environment, and WICS Games, a fun-filled night of puzzle-solving and networking. organizes a sponsored trip to the Grace Hopper Celebration in partnership with the Office of Access and Inclusion at UCI. outreaches to middle and high school students through several events, such as NetWICS, a day-long conference for high school girls, and IrisHacks, a small-scale hackathon hosted in collaboration with PCWOC. hosts VenusHacks, UCI's women-centric hackathon, in collaboration with Hack at UCI. WICS is open to people of all genders and we'd love to see you at our meetings!",
  imageUrl: "https://via.placeholder.com/150",
  links: {
    website: "https://wics.uci.edu",
    facebook: "https://facebook.com/wicsuci",
    twitter: "https://twitter.com/wicsuci",
    instagram: "https://instagram.com/wicsuci",
  },
};

export default function ClubBanner() {
  return (
    <div className="flex w-full h-full p-4">
      {/* Banner Section */}
      <section className="flex w-full flex-col space-y-3 h-full overflow-hidden">
        {/* Club Banner */}
        <Card className="w-full flex-shrink-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div className="flex flex-row items-center space-x-4">
              <Avatar className="h-16 w-16 p-2">
                <AvatarImage src={club.imageUrl} alt={`${club.name} logo`} />
                <AvatarFallback>
                  {club.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-xl">{club.name}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Women in Information and Computer Science
                </CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Create Post
              </Button>
              <Button size="sm">Join Club</Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-0">
            <div>
              <h3 className="font-semibold text-base mb-2">About</h3>
              <p className="text-gray-700 text-xs leading-relaxed line-clamp-3">
                {club.description}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-2">Important Links</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(club.links).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded-md text-blue-700 text-xs transition-colors"
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scrollable Feed */}
        <div className="flex-1 min-h-0">
          <Feed />
        </div>
      </section>
    </div>
  );
}
