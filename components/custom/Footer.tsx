"use client";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Mail, MapPin, Phone, Twitter, Instagram, Facebook, Youtube } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";

export function Footer() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const navItems = [
    { name: "Blog", href: "/blog" },
    { name: "Events", href: "/events" },
    { name: "Campaigns", href: "/campaigns" },
    { name: "Leaderboard", href: "/leaderboard" },
  ];

  const contactItem = { name: "Contact", href: "/contact" };

  const protectedNavRoutesName = ["Campaigns", "Leaderboard"];
  
  const filteredNavItems = navItems.filter((item) => 
    (!isAuthenticated && !protectedNavRoutesName.includes(item.name)) || isAuthenticated
  );

  return (
    <footer className="border-t py-12">
      <div className="container max-w-7xl px-4 sm:px-6 mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Bema Hub</h3>
            <p className="text-muted-foreground">
              Empowering supporters through direct community engagement.
            </p>
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2">Contact Us</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href="mailto:bemamarketing@bemamusic.com" className="text-muted-foreground hover:text-primary text-sm">
                    bemamarketing@bemamusic.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href="tel:+2349162944753" className="text-muted-foreground hover:text-primary text-sm">
                    +234 916 2944 753
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    244 5th Ave, suite 2510 New York, NY 10001
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2">Follow Us</h4>
              <div className="flex gap-3">
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              {filteredNavItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-muted-foreground hover:text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={contactItem.href} className="text-muted-foreground hover:text-primary">
                  {contactItem.name}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Community Guidelines
                </a>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-primary">
                  Support Center
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-muted-foreground hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Copyright Notice
                </a>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 Bema Hub. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary text-sm">
              Terms
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-primary text-sm">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
