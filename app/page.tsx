"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Bell, MapPin, Router, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800">
      <main>
        <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Stay Safe in the Water
              </h1>
              <p className="text-xl mb-8">
                Real-time shark warnings to keep you informed and protected.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/auth/signup")}
                className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </motion.button>
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Bell,
                  title: "Real-time Alerts",
                  description:
                    "Receive instant notifications about shark sightings in your area.",
                },
                {
                  icon: MapPin,
                  title: "Location-based Warnings",
                  description:
                    "Get warnings specific to your current beach or coastal location.",
                },
                {
                  icon: Smartphone,
                  title: "User-friendly Interface",
                  description:
                    "Easy-to-use app interface for quick access to critical information.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 20,
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-md text-center"
                >
                  <feature.icon className="text-blue-600 w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-gray-100 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="max-w-3xl mx-auto">
              {[
                "Download the SharkGuard app from your app store.",
                "Enable location services to receive area-specific alerts.",
                "Set up your notification preferences.",
                "Receive real-time warnings about shark sightings and activity.",
                "Stay informed and make safe decisions when entering the water.",
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    x: isVisible ? 0 : -20,
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center mb-6"
                >
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                    {index + 1}
                  </div>
                  <p className="text-lg">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to Stay Safe?</h2>
            <p className="text-xl mb-8">
              Download SharkGuard now and swim with confidence.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Download App
            </motion.button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 SharkGuard. All rights reserved.</p>
          <div className="mt-4">
            <a href="#" className="text-blue-300 hover:text-blue-100 mx-2">
              Privacy Policy
            </a>
            <a href="#" className="text-blue-300 hover:text-blue-100 mx-2">
              Terms of Service
            </a>
            <a href="#" className="text-blue-300 hover:text-blue-100 mx-2">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
