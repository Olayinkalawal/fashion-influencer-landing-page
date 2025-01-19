"use client"

import { FC } from 'react';
import { Home, Camera, ShoppingBag, Mail } from 'lucide-react';
import { NavBar } from "./ui/tubelight-navbar";
import { MobileNav } from "./ui/mobile-nav";
import Link from 'next/link';
import { GradientHeading } from './ui/gradient-heading';

const Header: FC = () => {
  const navItems = [
    { name: 'Home', url: '/#hero', icon: Home },
    { name: 'Gallery', url: '/#gallery', icon: Camera },
    { name: 'Shop', url: '/#shop', icon: ShoppingBag },
    { name: 'Contact', url: '/#footer', icon: Mail }
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="w-full flex items-center justify-between px-4 py-4 bg-black/50 backdrop-blur-sm">
        <div>
          <Link href="/#hero">
            <GradientHeading 
              variant="light"
              size="md"
              weight="bold"
              className="m-0 p-0"
            >
              Jariatu Danita
            </GradientHeading>
          </Link>
        </div>
        <div>
          <NavBar items={navItems} className="hidden md:block !static !translate-x-0 !mb-0 !pt-0" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

export default Header; 