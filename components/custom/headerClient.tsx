"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
interface Session {
  session: {
    user: {
      firstName: string;
      surname: string;
      email: string;
      accessLevel: number;
    };
  };
}

export function DropdownMenuComponent(sessionObject: Session) {
  const session = sessionObject.session;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage alt={session.user?.firstName || "User"} />
            <AvatarFallback>
              {session.user?.firstName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {session.user?.firstName && (
              <p className="font-medium">{session.user.firstName}</p>
            )}
            {session.user?.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {session.user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const HeaderSignOut = () => {
  return (
    <Button variant="default" onClick={() => signIn()}>
      Sign In
    </Button>
  );
};

export function Links() {
  const pathname = usePathname();
  return (
    pathname === "/" && (
      <>
        <Link
          href="/reports"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Reports
        </Link>
      </>
    )
  );
}
