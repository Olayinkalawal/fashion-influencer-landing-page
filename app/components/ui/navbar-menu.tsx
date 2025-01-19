"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface MenuItemProps {
  setActive: (item: string | null) => void;
  active: string | null;
  item: string;
  url: string;
  children?: React.ReactNode;
}

interface ShopItemProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  iconOnly?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  setActive,
  active,
  item,
  url,
  children,
}) => {
  const isExternalLink = url.startsWith('http') || url.startsWith('mailto');
  const content = (
    <motion.p
      animate={{
        color: active === item ? "rgb(255, 255, 255)" : "rgb(153, 153, 153)",
      }}
      className="cursor-pointer text-sm"
    >
      {item}
    </motion.p>
  );

  return (
    <div
      onMouseEnter={() => setActive(item)}
      onMouseLeave={() => setActive(null)}
      className="relative"
    >
      {isExternalLink ? (
        <a href={url} className="block">
          {content}
        </a>
      ) : (
        <Link href={url} className="block">
          {content}
        </Link>
      )}
      {active === item && children && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 backdrop-blur-sm p-4 rounded-lg"
          >
            {children}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export const Menu: React.FC<{
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}> = ({ children, setActive }) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full bg-black/50 backdrop-blur-sm px-8 py-4"
    >
      <div className="flex gap-6 items-center justify-center">{children}</div>
    </nav>
  );
};

export const ShopItem: React.FC<ShopItemProps> = ({
  title,
  description,
  href,
  icon: Icon,
  iconOnly = false,
}) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
    >
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10">
        <Icon className="w-4 h-4" />
      </div>
      {!iconOnly && (
        <div>
          {title && <p className="text-sm font-medium">{title}</p>}
          <p className="text-xs text-white/50">{description}</p>
        </div>
      )}
    </Link>
  );
}; 