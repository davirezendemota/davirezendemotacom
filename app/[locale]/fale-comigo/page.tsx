import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function FaleComigoPage() {
  const t = await getTranslations("contact");
  return (
    <div className="container flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">{t("title")}</h1>
      <p className="mb-8 max-w-md text-muted-foreground">{t("description")}</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="https://www.linkedin.com/in/davirezendemota/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--primary-glow)] transition-opacity hover:opacity-90"
        >
          {t("linkedin")}
        </Link>
        <Link
          href="https://docs.google.com/document/d/12krmk0uM7LOYOLSlCZlCGh0CYe3ZpfhVlmIoSFcj5Co/export?format=pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md border border-accent bg-transparent px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent/10 hover:shadow-[var(--accent-glow)]"
        >
          {t("cvPdf")}
        </Link>
      </div>
    </div>
  );
}