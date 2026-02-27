"use client";

import { useCallback, useRef } from "react";
import { projetos } from "@/data/projetos";
import { ProjectList } from "./project-list";
import { useTranslations } from "next-intl";

export function ProjetosSection() {
  const t = useTranslations("projetos");
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const getLabel = useCallback(
    (nameKey: string) => t(`titles.${nameKey}` as never),
    [t]
  );
  const getDescription = useCallback(
    (descriptionKey: string) => t(`descriptions.${descriptionKey}` as never),
    [t]
  );

  return (
    <section
      className="container flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-4 py-16"
      aria-labelledby="projetos-heading"
    >
      <div className="w-full max-w-2xl">
        <ProjectList
          projects={projetos}
          getLabel={getLabel}
          getDescription={getDescription}
          headingRecent={t("headingRecent")}
          headingProjects={t("headingProjects")}
          selectedId={null}
          itemRefs={itemRefs}
        />
      </div>
    </section>
  );
}
