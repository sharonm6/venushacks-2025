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
    return { ...doc.data(), id: doc.id };
  });

  return localMatches.find((match: Match) => match.userid == userid);
}
