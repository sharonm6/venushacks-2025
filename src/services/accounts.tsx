import { accountsCollection } from "@/utils/firebase.browser";
import { DocumentData, Query, getDocs } from "firebase/firestore";
import { Account } from "@/lib/types";

export async function index(userid: string, query?: Query): Promise<Account> {
  let querySnapshot = null;

  if (query) {
    querySnapshot = await getDocs(query);
  } else {
    querySnapshot = await getDocs(accountsCollection);
  }

  const localAccounts = querySnapshot.docs.map((doc: DocumentData) => {
    return { ...doc.data(), id: doc.id };
  });

  return localAccounts.find((profile: Account) => profile.id == userid);
}
