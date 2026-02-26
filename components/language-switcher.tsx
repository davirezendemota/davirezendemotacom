"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCALES = [
  { value: "pt-BR" as const, flag: "🇧🇷", labelKey: "ptBR" },
  { value: "en" as const, flag: "🇬🇧", labelKey: "en" },
  { value: "es" as const, flag: "🇪🇸", labelKey: "es" },
  { value: "de" as const, flag: "🇩🇪", labelKey: "de" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("locale");
  const current = LOCALES.find((l) => l.value === locale) ?? LOCALES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title={t(current.labelKey)}
        aria-label={t(current.labelKey)}
        className={cn(
          "group flex items-center justify-center gap-0 rounded-full border border-border bg-background/80 min-h-9 min-w-9 p-2 text-sm font-medium shadow-sm backdrop-blur-sm outline-none transition-[padding,gap] duration-200",
          "hover:bg-accent/50 hover:gap-1.5 hover:pl-3 hover:pr-3 hover:py-1.5 focus:bg-accent/50",
          "data-[state=open]:bg-accent/50 data-[state=open]:gap-1.5 data-[state=open]:pl-3 data-[state=open]:pr-3 data-[state=open]:py-1.5"
        )}
      >
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center text-base leading-[0]"
          role="img"
          aria-hidden
        >
          {current.flag}
        </span>
        <span
          className={cn(
            "max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200",
            "group-hover:max-w-[8rem] group-hover:opacity-100",
            "group-data-[state=open]:max-w-[8rem] group-data-[state=open]:opacity-100"
          )}
        >
          {t(current.labelKey)}
        </span>
        <ChevronDownIcon
          className={cn(
            "size-4 shrink-0 w-0 overflow-hidden opacity-0 transition-all duration-200",
            "group-hover:w-4 group-hover:opacity-70",
            "group-data-[state=open]:w-4 group-data-[state=open]:opacity-70"
          )}
          aria-hidden
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="min-w-[10rem]">
        {LOCALES.map((loc) => (
          <DropdownMenuItem key={loc.value} asChild>
            <Link
              href={pathname}
              locale={loc.value}
              className={cn(
                "flex cursor-pointer items-center gap-2 focus:outline-none",
                loc.value === locale && "bg-accent/50"
              )}
            >
              <span className="text-base" role="img" aria-hidden>
                {loc.flag}
              </span>
              <span>{t(loc.labelKey)}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
