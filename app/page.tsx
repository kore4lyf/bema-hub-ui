"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { Navbar } from "@/components/custom/Navbar";
import { Hero } from "@/components/custom/Hero";
import { EchoLoopSection } from "@/components/custom/EchoLoopSection";
import { LiveSessionsSection } from "@/components/custom/LiveSessionsSection";
import { BlogSection } from "@/components/custom/BlogSection";
import { TestimonialsSection } from "@/components/custom/TestimonialsSection";
import { FAQSection } from "@/components/custom/FAQSection";
import { CTASection } from "@/components/custom/CTASection";
import { Footer } from "@/components/custom/Footer";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If user is authenticated, redirect to hub
    if (isAuthenticated) {
      router.push("/hub");
    }
  }, [isAuthenticated, router]);

  // Show loading state while checking auth
  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Redirecting to hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <EchoLoopSection />
        <LiveSessionsSection />
        <BlogSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}
