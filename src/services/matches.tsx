import { matchesCollection } from "@/utils/firebase.browser";
import { DocumentData, Query, getDocs } from "firebase/firestore";
import { Match } from "@/lib/types";

export async function index(userid: string, query?: Query): Promise<Match> {
  let querySnapshot = null;

  if (query) {
    querySnapshot = await getDocs(query);
  } else {
    querySnapshot = await getDocs(matchesCollection);
  }

  const localMatches = querySnapshot.docs.map((doc: DocumentData) => {
    return {
      ...doc.data(),
      id: doc.id,
      matches: doc.data().clubs || doc.data().matches,
    };
  });

  return localMatches
    .sort(
      (a: Match, b: Match) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .find((match: Match) => match.userid == userid);
}
