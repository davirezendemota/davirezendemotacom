import { getTranslations } from "next-intl/server";
import { ProjetosSection } from "@/components/projetos/projetos-section";

export default async function ProjetosPage() {
  const t = await getTranslations("projetos");
  return (
    <div className="container px-4 py-8">
      <h1 id="projetos-heading" className="sr-only">
        {t("title")}
      </h1>
      <ProjetosSection />
    </div>
  );
}
