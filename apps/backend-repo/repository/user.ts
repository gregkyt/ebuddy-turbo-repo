import { findMax, findMin, normalize } from "../utils/sorting";
import { firebaseConfig } from "@repo/config/firebaseConfig";
import { UpdateUserPayload, User } from "@repo/entities/user";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const usersCollection = collection(db, "Users");

export class UserRepository {
  async getAllUsers(): Promise<User[]> {
    const usersDocs = await getDocs(usersCollection);
    const users = usersDocs.docs.map((user) => user.data() as User);

    const maxRatings = findMax(users, "totalAverageWeightRatings");
    const minRatings = findMin(users, "totalAverageWeightRatings");
    const maxRents = findMax(users, "numberOfRents");
    const minRents = findMin(users, "numberOfRents");
    const maxActivities = findMax(users, "recentlyActive");
    const minActivities = findMin(users, "recentlyActive");

    const results = users.map((item) => {
      const normalizedRating = normalize(
        item.totalAverageWeightRatings,
        minRatings,
        maxRatings
      );
      const normalizedRent = normalize(item.numberOfRents, minRents, maxRents);
      const normalizedActivity = normalize(
        item.recentlyActive,
        minActivities,
        maxActivities
      );

      const finalScore =
        normalizedRating * 0.5 +
        normalizedRent * 0.3 +
        normalizedActivity * 0.2;

      return { ...item, finalScore };
    });

    return results.sort((a, b) => b.finalScore - a.finalScore);
  }

  async getUser(uid: string): Promise<User | undefined> {
    const usersDocs = await getDocs(usersCollection);
    const userDoc = usersDocs.docs.find(
      (user) => (user.data() as User).uid === uid
    );
    if (userDoc) {
      return userDoc.data() as User;
    }
  }

  async updateUser(
    uid: string,
    user: UpdateUserPayload
  ): Promise<User | undefined> {
    const usersDocs = await getDocs(usersCollection);
    const userDoc = usersDocs.docs.find(
      (user) => (user.data() as User).uid === uid
    );
    if (userDoc?.exists) {
      const docRef = doc(db, "Users", userDoc.id);
      await updateDoc(docRef, {
        ...user,
      });
      const getUserDoc = await getDoc(docRef);
      return getUserDoc.data() as User;
    }
  }
}
