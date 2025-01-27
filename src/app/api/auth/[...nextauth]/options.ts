import { NextAuthOptions } from "next-auth";
import Credentials, { CredentialInput } from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export type CredentialInputs = Pick<CredentialInput, "label" | "value">;

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials Login",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "johndoe@example.com",
        },
        username: {
          label: "Username",
          type: "text",
          placeholder: "johndoe",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "johndoe@123",
        },
      },
      async authorize(credentials): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials?.email },
              { username: credentials?.username },
            ],
          });

          if (!user) {
            throw new Error("No user found this email with this email.");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before signing in");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password || "",
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return user;
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: "somesecretKey",
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.isVerified = user.isVerified;
        token.username = user.username;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session._id = token._id;
        session.isAcceptingMessages = token.isAcceptingMessages;
        session.isVerified = token.isVerified;
        session.username = token.username;
      }

      return session;
    },
  },
};
