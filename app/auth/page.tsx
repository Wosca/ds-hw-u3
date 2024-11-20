"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import SignIn from "./signin/page";
import SignUp from "./signup/page";

export default function AuthPage() {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      {pathname === "/auth/signin" && <SignIn key="signin" />}
      {pathname === "/auth/signup" && <SignUp key="signup" />}
    </AnimatePresence>
  );
}
