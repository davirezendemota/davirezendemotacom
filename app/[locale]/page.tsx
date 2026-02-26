import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Link as I18nLink } from "@/i18n/navigation";

export default async function HomePage() {
  const t = await getTranslations("home");
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4">
      <div className="flex max-w-4xl flex-col items-center gap-10 md:flex-row md:gap-16">
        <div className="relative h-80 w-80 shrink-0 overflow-hidden rounded-2xl md:h-[28rem] md:w-[28rem]">
          <Image
            src="/me.png"
            alt="Davi Rezende"
            width={448}
            height={448}
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col gap-4 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("title")}
          </h1>
          <p className="text-lg font-medium text-primary">{t("subtitle")}</p>
          <p className="max-w-xl text-muted-foreground">{t("bio")}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="https://docs.google.com/document/d/12krmk0uM7LOYOLSlCZlCGh0CYe3ZpfhVlmIoSFcj5Co/export?format=pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--primary-glow)] transition-opacity hover:opacity-90"
            >
              {t("downloadCv")}
            </Link>
            <I18nLink
              href="/quem-sou-eu"
              className="inline-flex items-center justify-center rounded-md border border-accent px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
            >
              {t("learnMore")}
            </I18nLink>
          </div>
        </div>
      </div>
    </div>
  );
}
