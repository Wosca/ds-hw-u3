"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  MapPin,
  Smartphone,
  ChevronRight,
  WavesIcon as Wave,
  Shield,
  AlertTriangle,
  LifeBuoy,
  ExternalLink,
  Instagram,
  Twitter,
  Facebook,
  Download,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LandingPage() {
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
            <div className="flex justify-center gap-12 items-center">
              <motion.div
                className="text-center max-w-xl"
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
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                  Swim Safely with{" "}
                  <span className="text-primary">SharkGuard</span>
                </h1>
                <p className="text-xl mb-8 text-muted-foreground">
                  Get real-time shark alerts right on your phone. No more
                  worrying about what's swimming beneath you!
                </p>
                <div className="flex flex-col justify-center sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="font-semibold w-full sm:w-auto"
                      asChild
                    >
                      <Link href="/reports">
                        View Reports <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="font-semibold w-full sm:w-auto"
                    >
                      <Link href="/signup">Create Account</Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-12 bg-background border-y">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                Trusted by beach bums and surf pros alike
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
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
        <section className="py-24 sm:py-32 bg-gradient-to-b from-blue-50 to-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
                transition={{ duration: 0.5 }}
                className="order-2 lg:order-1"
              >
                <Badge variant="outline" className="mb-4">
                  The App
                </Badge>
                <h2 className="text-4xl font-bold mb-6">
                  Shark Protection in Your Pocket
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Our app is super simple to use – just how beach days should
                  be. No complicated stuff, just the info you need.
                </p>

                <Tabs defaultValue="iphone" className="mb-8">
                  <TabsList className="mb-4">
                    <TabsTrigger value="iphone">iPhone</TabsTrigger>
                    <TabsTrigger value="android">Android</TabsTrigger>
                  </TabsList>
                  <TabsContent value="iphone" className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="text-green-500 h-5 w-5" />
                      <p>Works on all iPhones (even your old one)</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="text-green-500 h-5 w-5" />
                      <p>Alerts even when your phone's in your pocket</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="text-green-500 h-5 w-5" />
                      <p>Works with your Apple Watch too</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="android" className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="text-green-500 h-5 w-5" />
                      <p>Works on pretty much any Android phone</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="text-green-500 h-5 w-5" />
                      <p>Doesn't drain your battery (we promise!)</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="text-green-500 h-5 w-5" />
                      <p>Works with Android watches too</p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex flex-wrap gap-4">
                  <Button className="gap-2" size="lg">
                    <Download className="h-4 w-4" />
                    Get it on iPhone
                  </Button>
                  <Button className="gap-2" size="lg" variant="outline">
                    <Download className="h-4 w-4" />
                    Get it on Android
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="order-1 lg:order-2"
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white shadow-xl">
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

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 sm:py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">
                Easy as 1-2-3
              </Badge>
              <h2 className="text-4xl font-bold mb-4">How SharkGuard Works</h2>
              <p className="text-xl text-muted-foreground">
                No rocket science here, just a few simple steps
              </p>
            </div>

            <div className="max-w-4xl mx-auto relative">
              {/* Vertical Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block"></div>

              {[
                {
                  title: "Download the App",
                  description:
                    "Grab SharkGuard from your app store. It's free! Takes like 30 seconds.",
                  icon: Download,
                },
                {
                  title: "Let Us Know Where You Are",
                  description:
                    "Allow location access so we can tell you about sharks near YOU, not ones on the other side of the world.",
                  icon: MapPin,
                },
                {
                  title: "Set It Up How You Like",
                  description:
                    "Choose how you want to be notified. Loud sirens? Gentle nudge? You decide!",
                  icon: Smartphone,
                },
                {
                  title: "Get Alerts When It Matters",
                  description:
                    "We'll buzz you when there's shark activity nearby. Simple as that!",
                  icon: Bell,
                },
                {
                  title: "Enjoy the Water (Safely!)",
                  description:
                    "Now you can swim, surf, or splash around knowing you'll get a heads-up if any toothy friends show up.",
                  icon: Shield,
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 20,
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-12 relative"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10 border-4 border-background shadow-lg">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <Card className="flex-grow md:ml-8 border-none shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
