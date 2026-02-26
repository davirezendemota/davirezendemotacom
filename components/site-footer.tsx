import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background py-6">
      <div className="container flex flex-col items-center justify-between gap-2 px-4 text-center text-sm text-muted-foreground sm:flex-row">
        <span>© {year} Davi Rezende</span>
        <div className="flex gap-4">
          <Link
            href="https://www.linkedin.com/in/davirezendemota/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            LinkedIn
          </Link>
          <Link
            href="https://github.com/davirezendemota"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
