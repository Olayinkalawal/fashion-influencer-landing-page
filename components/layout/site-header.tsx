import Link from "next/link";
import { appConfig } from "@/lib/config/app";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-primary">
          {appConfig.name}
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          {appConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
