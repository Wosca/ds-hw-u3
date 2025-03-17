"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, ChevronRight, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100 py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <motion.div
                className="text-center md:text-left max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5 }}
              >
                <Badge
                  className="mb-6 py-1.5 px-4 text-sm font-semibold"
                  variant="secondary"
                >
                  Hey there, water lover! 🌊
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Swim Safely with{" "}
                  <span className="text-primary">SharkGuard</span>
                </h1>
                <p className="text-lg md:text-xl mb-8 text-muted-foreground">
                  Get real-time shark alerts right on your phone. No more
                  worrying about what's swimming beneath you!
                </p>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                  <Button
                    size="lg"
                    className="font-semibold w-full sm:w-auto"
                    asChild
                  >
                    <Link href="/reports">
                      View Reports <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-semibold w-full sm:w-auto"
                    asChild
                  >
                    <Link href={!session?.user ? "/signup" : "/profile"}>
                      {!session?.user ? "Create Account" : "View your profile"}
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                className="hidden md:block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                  <Shield className="h-32 w-32 text-primary mx-auto" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-8 md:py-12 bg-background border-y">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6">
              <p className="text-muted-foreground font-medium">
                Trusted by beach bums and surf pros alike
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
              {[
                "Surf City Lifeguards",
                "Beach Patrol Squad",
                "Ocean Safety Crew",
                "Coastal Guardians",
                "Wave Riders Association",
              ].map((partner) => (
                <div
                  key={partner}
                  className="text-muted-foreground/70 font-semibold text-sm md:text-base"
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App Demo Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="md:w-1/2 order-2 md:order-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Real-time Alerts When It Matters Most
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Our advanced detection system monitors coastal waters and
                  sends instant notifications when sharks are spotted near your
                  location.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Precise location tracking",
                    "Risk level assessment",
                    "Safety recommendations",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild>
                  <Link href="/features">Learn more about features</Link>
                </Button>
              </div>

              <motion.div
                className="md:w-1/2 order-1 md:order-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white shadow-xl max-w-md mx-auto">
                  <div className="text-center mb-6">
                    <Bell className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">SHARK ALERT!</h3>
                    <p className="text-blue-100">
                      Great White spotted at Sunshine Beach
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Location:</span>
                      <span>500m from shore</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Spotted:</span>
                      <span>2 minutes ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Risk Level:</span>
                      <Badge className="bg-red-500">High</Badge>
                    </div>
                  </div>
                  <div className="text-center">
                    <Button variant="secondary" size="sm" className="w-full">
                      View Details
                    </Button>
                    <p className="mt-4 text-sm text-blue-100">
                      Tap for safety recommendations
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
