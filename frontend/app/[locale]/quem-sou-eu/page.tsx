import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Link as I18nLink } from "@/i18n/navigation";

export default async function QuemSouEuPage() {
  const t = await getTranslations("about");
  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="mx-auto max-w-3xl space-y-12">
        <div className="flex flex-col items-center gap-6 border-b border-border pb-12 md:flex-row md:items-start md:gap-10">
          <div className="relative h-56 w-56 shrink-0 overflow-hidden rounded-2xl md:h-64 md:w-64">
            <Image
              src="/me.png"
              alt="Davi Rezende"
              width={256}
              height={256}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t("title")}</h1>
            <p className="text-primary">{t("subtitle")}</p>
            <p className="text-sm text-muted-foreground">{t("location")}</p>
            <Link
              href="https://docs.google.com/document/d/12krmk0uM7LOYOLSlCZlCGh0CYe3ZpfhVlmIoSFcj5Co/export?format=pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex w-fit items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--primary-glow)] transition-opacity hover:opacity-90"
            >
              {t("downloadCv")}
            </Link>
          </div>
        </div>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">{t("sectionAbout")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("aboutText")}</p>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">{t("sectionTrajectory")}</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="border-l-2 border-primary/50 pl-4">
              <span className="font-medium text-foreground">RM Consult</span> — {t("trajectory.rmconsult")}
            </li>
            <li className="border-l-2 border-primary/50 pl-4">
              <span className="font-medium text-foreground">Ferreira & Borzone</span> — {t("trajectory.ferreira")}
            </li>
            <li className="border-l-2 border-primary/50 pl-4">
              <span className="font-medium text-foreground">Hearts Couros</span> — {t("trajectory.hearts")}
            </li>
            <li className="border-l-2 border-primary/50 pl-4">
              <span className="font-medium text-foreground">Cefet/RJ</span> — {t("trajectory.cefet")}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">{t("sectionLanguages")}</h2>
          <ul className="flex flex-wrap gap-2">
            <li className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground">
              {t("languages.pt")}
            </li>
            <li className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground">
              {t("languages.en")}
            </li>
            <li className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground">
              {t("languages.de")}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">{t("sectionCerts")}</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{t("certs.scrum")}</li>
            <li>{t("certs.python")}</li>
          </ul>
        </section>

        <div className="flex flex-wrap gap-3 pt-4">
          <I18nLink
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            {t("backHome")}
          </I18nLink>
          <I18nLink
            href="/fale-comigo"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--primary-glow)] transition-opacity hover:opacity-90"
          >
            {t("contactMe")}
          </I18nLink>
        </div>
      </div>
    </div>
  );
}
