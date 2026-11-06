import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL, // এই লাইনটি যোগ করতে হবে
});

export const { signIn, signUp, signOut, useSession } = authClient;
