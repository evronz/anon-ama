"use client";

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:px-20 md:py-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          AnonAMA
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {session.username || user.email}
            </span>
            <Button
              onClick={() => {
                signOut();
                router.replace("/");
              }}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
