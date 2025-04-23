interface User {
  id: number;
  uid: string;
  name: string;
  gender: "male" | "female";
  totalAverageWeightRatings: number;
  numberOfRents: number;
  recentlyActive: number;
}

interface UpdateUserPayload {
  uid: string;
  name: string;
  gender: "male" | "female";
  totalAverageWeightRatings: number;
  numberOfRents: number;
}

export type { User, UpdateUserPayload };
