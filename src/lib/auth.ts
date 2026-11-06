import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as { mongo?: MongoClient };

const client =
  globalForMongo.mongo ?? new MongoClient(process.env.MONGODB_URI!);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongo = client;
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL, // <-- এই লাইনটি অবশ্যই যোগ করতে হবে
  database: mongodbAdapter(client.db("bazar-dor")),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
