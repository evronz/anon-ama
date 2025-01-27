import "next-auth";

declare module "next-auth" {
  interface User {
    _id: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    username: boolean;
  }

  interface Session {
    _id: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    username: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    username: boolean;
  }
}
