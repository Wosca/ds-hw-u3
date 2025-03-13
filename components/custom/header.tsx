import { Shield } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

import { auth } from "@/auth";
import { DropdownMenuComponent, HeaderSignOut } from "./headerClient";

export default async function Header() {
  const session = await auth();
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="text-primary h-6 w-6" />
          <span className="text-xl font-bold">SharkGuard</span>
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#testimonials"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Testimonials
          </Link>
          <Link
            href="#faq"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {session?.user ? (
            <DropdownMenuComponent session={session} />
          ) : (
            <HeaderSignOut />
          )}
        </div>
      </div>
    </header>
  );
}
