"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projetos";
import { cn } from "@/lib/utils";
import type { RefObject } from "react";

interface ProjectListProps {
  projects: Project[];
  getLabel: (nameKey: string) => string;
  getDescription: (descriptionKey: string) => string;
  headingRecent: string;
  headingProjects: string;
  selectedId: string | null;
  itemRefs: RefObject<Record<string, HTMLDivElement | null>>;
  className?: string;
}

function sortByDateNewestFirst(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => b.date.localeCompare(a.date));
}

export function ProjectList({
  projects,
  getLabel,
  getDescription,
  headingRecent,
  headingProjects,
  selectedId,
  itemRefs,
  className,
}: ProjectListProps) {
  const sortedProjects = sortByDateNewestFirst(projects);

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <header className="flex flex-col">
        <span className="text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
          {headingRecent}
        </span>
        <span className="text-xl font-bold uppercase tracking-tight text-muted-foreground sm:text-2xl">
          {headingProjects}
        </span>
      </header>

      <ul
        className="flex flex-col gap-6"
        role="list"
        aria-label="Projetos recentes"
      >
        {sortedProjects.map((p) => {
          const isSelected = selectedId === p.id;
          const content = (
            <>
              <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg border border-border bg-muted sm:h-28 sm:w-40">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center text-2xl font-bold uppercase text-muted-foreground"
                    aria-hidden
                  >
                    {getLabel(p.nameKey).slice(0, 2)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold uppercase tracking-tight text-foreground sm:text-lg">
                  {getLabel(p.nameKey)}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {getDescription(p.descriptionKey)}
                </p>
              </div>
              <span className="shrink-0 text-primary" aria-hidden>
                <ArrowUpRight className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
            </>
          );

          return (
            <li key={p.id}>
              <div
                ref={(el) => {
                  if (itemRefs.current) itemRefs.current[p.id] = el;
                }}
                role="article"
                aria-current={isSelected ? "true" : undefined}
                className={cn(
                  "flex items-center gap-4 rounded-xl border-2 py-4 pl-4 pr-4 transition-colors sm:gap-5 sm:py-5 sm:pl-5 sm:pr-5",
                  "border-border bg-card text-card-foreground",
                  isSelected &&
                    "border-primary bg-accent/20 ring-2 ring-primary/20"
                )}
              >
                {p.url ? (
                  <Link
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
                    {content}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
