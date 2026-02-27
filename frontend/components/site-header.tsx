"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", labelKey: "home" as const },
  { href: "/quem-sou-eu", labelKey: "about" as const },
  { href: "/artigos", labelKey: "articles" as const },
  { href: "/fale-comigo", labelKey: "contact" as const },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <div className="container relative flex h-14 items-center px-4">
        <Menubar className="flex-1 border-0 bg-transparent shadow-none justify-center items-center">
          {navItems.map(({ href, labelKey }) => {
            const isActive =
              href === "/" ? pathname === "/" || pathname === "" : pathname.startsWith(href);
            return (
              <MenubarMenu key={href}>
                <MenubarTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "border-primary bg-primary !text-primary-foreground"
                        : "border-transparent text-foreground hover:border-primary hover:text-primary focus:bg-transparent focus-visible:border-primary focus-visible:text-primary focus-visible:outline-none data-[state=open]:bg-transparent"
                    )}
                  >
                    {t(labelKey)}
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>
            );
          })}
        </Menubar>
      </div>
      <div className="fixed right-4 top-3 z-[60]">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
