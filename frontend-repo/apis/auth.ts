import { firebaseConfig } from "@repo/config/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

async function signIn(email: string, password: string) {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  return await signInWithEmailAndPassword(auth, email, password);
}

export { signIn };
