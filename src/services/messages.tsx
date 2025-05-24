import { messagesCollection } from "@/utils/firebase.browser";
import { DocumentData, Query, getDocs } from "firebase/firestore";
import { Message } from "@/lib/types";

export async function index(query?: Query): Promise<Message[]> {
  let querySnapshot = null;

  if (query) {
    querySnapshot = await getDocs(query);
  } else {
    querySnapshot = await getDocs(messagesCollection);
  }

  const localMessages = querySnapshot.docs.map((doc: DocumentData) => {
    return { ...doc.data(), id: doc.id };
  });

  return localMessages as Message[];
}
