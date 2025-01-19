"use client"

import * as React from "react"
import { Input } from "./ui/input"
import { Instagram, Send, Mail } from "lucide-react"
import { GradientHeading } from "./ui/gradient-heading"

export default function Footer() {
  return (
    <footer id="footer" className="relative border-t bg-background/80 backdrop-blur-sm text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <GradientHeading 
              variant="light"
              size="md"
              weight="bold"
              className="mb-4"
            >
              Stay Connected
            </GradientHeading>
            <p className="mb-6 text-muted-foreground">
              Join my newsletter for the latest fashion updates and exclusive style tips.
            </p>
            <form className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>
          <div>
            <GradientHeading 
              variant="light"
              size="sm"
              weight="semi"
              className="mb-4"
            >
              Quick Links
            </GradientHeading>
            <nav className="space-y-2 text-sm">
              <a href="#hero" className="block transition-colors hover:text-primary">
                Home
              </a>
              <a href="#gallery" className="block transition-colors hover:text-primary">
                Gallery
              </a>
              <a href="#shop" className="block transition-colors hover:text-primary">
                Shop
              </a>
              <a href="mailto:jariatudanita@yahoo.com" className="block transition-colors hover:text-primary">
                Contact
              </a>
            </nav>
          </div>
          <div className="relative">
            <GradientHeading 
              variant="light"
              size="sm"
              weight="semi"
              className="mb-4"
            >
              Follow Me
            </GradientHeading>
            <div className="mb-6 flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <a
                  href="https://instagram.com/jariatudanita"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border/40 p-2 hover:bg-white/10 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
                <span className="text-sm text-muted-foreground">@jariatudanita</span>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="mailto:jariatudanita@yahoo.com"
                  className="rounded-full border border-border/40 p-2 hover:bg-white/10 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Email</span>
                </a>
                <span className="text-sm text-muted-foreground">jariatudanita@yahoo.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 Jariatu Danita. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
} 