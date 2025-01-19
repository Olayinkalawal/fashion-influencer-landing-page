"use client"

import { TiltedScroll } from "./ui/tilted-scroll"
import { GradientHeading } from "./ui/gradient-heading"

export default function Shop() {
  const customItems = [
    { 
      id: "1", 
      text: "Amazon Shop",
      href: "https://www.amazon.com/shop/jariatudanita"
    },
    { 
      id: "2", 
      text: "LTK",
      href: "https://www.shopltk.com/explore/jariatudanita"
    },
    { 
      id: "3", 
      text: "Urban Revivo",
      href: "https://urbanrevivo.com/collections/best-sellers-nv030000?utm_content=jariatudanita"
    },
    { 
      id: "4", 
      text: "Amazon Shop",
      href: "https://www.amazon.com/shop/jariatudanita"
    },
    { 
      id: "5", 
      text: "LTK",
      href: "https://www.shopltk.com/explore/jariatudanita"
    },
    { 
      id: "6", 
      text: "Urban Revivo",
      href: "https://urbanrevivo.com/collections/best-sellers-nv030000?utm_content=jariatudanita"
    },
    { 
      id: "7", 
      text: "Amazon Shop",
      href: "https://www.amazon.com/shop/jariatudanita"
    },
    { 
      id: "8", 
      text: "LTK",
      href: "https://www.shopltk.com/explore/jariatudanita"
    }
  ]

  return (
    <section id="shop" className="relative z-10 min-h-screen pt-8 pb-20">
      <GradientHeading 
        variant="light"
        size="lg"
        weight="bold"
        className="text-center mb-12"
      >
        Shop My Style
      </GradientHeading>
      <div className="space-y-8">
        <TiltedScroll items={customItems} className="mt-8 scale-125 md:scale-150" />
      </div>
    </section>
  )
} 