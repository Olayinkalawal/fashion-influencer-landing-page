"use client"

import { useAnimate } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "../../lib/utils"

interface NavItem {
  label: string
  href: string
}

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [topLineScope, topLineAnimate] = useAnimate()
  const [bottomLineScope, bottomLineAnimate] = useAnimate()
  const [navScope, navAnimate] = useAnimate()

  const navItems: NavItem[] = [
    { label: 'Home', href: '/#hero' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Shop', href: '/#shop' },
    { label: 'Contact', href: '/#footer' }
  ]

  useEffect(() => {
    if (isOpen) {
      // Disable body scroll when menu is open
      document.body.style.overflow = 'hidden'
      
      topLineAnimate([
        [
          topLineScope.current,
          {
            translateY: 4,
          },
        ],
        [
          topLineScope.current,
          {
            rotate: 45,
          },
        ],
      ])
      bottomLineAnimate([
        [
          bottomLineScope.current,
          {
            translateY: -4,
          },
        ],
        [
          bottomLineScope.current,
          {
            rotate: -45,
          },
        ],
      ])

      navAnimate(
        navScope.current,
        {
          height: "100vh",
          opacity: 1,
        },
        {
          duration: 0.7,
        }
      )
    } else {
      // Re-enable body scroll when menu is closed
      document.body.style.overflow = 'unset'
      
      topLineAnimate([
        [
          topLineScope.current,
          {
            rotate: 0,
          },
        ],
        [
          topLineScope.current,
          {
            translateY: 0,
          },
        ],
      ])
      bottomLineAnimate([
        [
          bottomLineScope.current,
          {
            rotate: 0,
          },
        ],
        [
          bottomLineScope.current,
          {
            translateY: 0,
          },
        ],
      ])

      navAnimate(
        navScope.current,
        { 
          height: "0",
          opacity: 0,
        },
        {
          duration: 0.3,
        }
      )
    }

    // Cleanup function to ensure body scroll is re-enabled
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, topLineAnimate, topLineScope, bottomLineAnimate, bottomLineScope, navScope, navAnimate])

  const handleClickMobileNavItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsOpen(false)

    const url = new URL(e.currentTarget.href)
    const hash = url.hash

    const target = document.querySelector(hash)
    if (!target) return
    target.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className={cn("md:hidden", className)}>
      {/* Navigation Overlay */}
      <div
        className="fixed inset-0 w-full h-0 overflow-hidden bg-black/95 backdrop-blur-lg z-40 opacity-0"
        ref={navScope}
      >
        <nav className="mt-20 flex flex-col">
          {navItems.map(({ label, href }) => (
            <a
              href={href}
              key={label}
              className="text-foreground border-t last:border-b border-border/20 py-8 group/nav-item relative isolate"
              onClick={handleClickMobileNavItem}
            >
              <div className="container !max-w-full flex items-center justify-between">
                <span className="text-3xl group-hover/nav-item:pl-4 transition-all duration-500">
                  {label}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </div>
              <div className="absolute w-full h-0 bg-primary/5 group-hover/nav-item:h-full transition-all duration-500 bottom-0 -z-10"></div>
            </a>
          ))}
        </nav>
      </div>

      {/* Hamburger Button */}
      <div
        className="fixed top-4 right-4 size-11 border border-border/40 rounded-full inline-flex items-center justify-center bg-black/50 backdrop-blur-lg cursor-pointer z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="7"
            width="18"
            height="2"
            fill="currentColor"
            ref={topLineScope}
            style={{
              transformOrigin: "12px 8px",
            }}
          />
          <rect
            x="3"
            y="15"
            width="18"
            height="2"
            fill="currentColor"
            ref={bottomLineScope}
            style={{
              transformOrigin: "12px 16px",
            }}
          />
        </svg>
      </div>
    </div>
  )
} 