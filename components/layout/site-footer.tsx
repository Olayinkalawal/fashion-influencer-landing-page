export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} EYA Platform</p>
        <p>Internal Nexus Core (SchemeServe-style)</p>
      </div>
    </footer>
  );
}
