import { postsCollection } from "@/utils/firebase.browser";
import { DocumentData, Query, getDocs } from "firebase/firestore";
import { Post } from "@/lib/types";

export async function index(clubid: string, query?: Query): Promise<Post[]> {
  let querySnapshot = null;

  if (query) {
    querySnapshot = await getDocs(query);
  } else {
    querySnapshot = await getDocs(postsCollection);
  }

  const localPosts = querySnapshot.docs.map((doc: DocumentData) => {
    return { ...doc.data(), id: doc.id };
  });

  return localPosts.filter((post: Post) => post.clubid == clubid);
}
