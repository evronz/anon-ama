"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
