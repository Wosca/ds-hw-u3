"use client";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div
          onClick={() => router.push("/")}
          className="hover:cursor-pointer flex items-center space-x-2"
        >
          <AlertTriangle className="text-blue-600" />
          <span className="text-xl font-bold">SharkGuard</span>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a
                href="#features"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
