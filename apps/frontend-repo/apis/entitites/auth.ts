import { User } from "firebase/auth";

interface SignInPayload {
  email: string;
  password: string;
}

interface SignInResponse {
  user: User;
  accessToken: string;
}

export type { SignInPayload, SignInResponse };
