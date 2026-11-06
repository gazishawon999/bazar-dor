import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://bazar-dor-h23v.vercel.app",
});

export const { signIn, signUp, signOut, useSession } = authClient;
