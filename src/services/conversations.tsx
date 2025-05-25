import { conversationsCollection } from "@/utils/firebase.browser";
import { DocumentData, Query, getDocs } from "firebase/firestore";
import { Conversation } from "@/lib/types";

export async function index(query?: Query): Promise<Conversation[]> {
  let querySnapshot = null;

  if (query) {
    querySnapshot = await getDocs(query);
  } else {
    querySnapshot = await getDocs(conversationsCollection);
  }

  const localConversations = querySnapshot.docs.map((doc: DocumentData) => {
    return { ...doc.data(), id: doc.id };
  });

  return localConversations as Conversation[];
}
