import type { Metadata } from "next";
import localFont from "next/font/local";
import { getLocale } from "next-intl/server";
import "./globals.css";

const mdlorien = localFont({
  src: [
    { path: "../public/fonts/mdlorien/MDLorien-Black.otf", weight: "900", style: "normal" },
    { path: "../public/fonts/mdlorien/MDLorien-BlackItalic.otf", weight: "900", style: "italic" },
    { path: "../public/fonts/mdlorien/MDLorien-Bold.otf", weight: "700", style: "normal" },
    { path: "../public/fonts/mdlorien/MDLorien-BoldItalic.otf", weight: "700", style: "italic" },
    { path: "../public/fonts/mdlorien/MDLorien-Book.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/mdlorien/MDLorien-BookItalic.otf", weight: "300", style: "italic" },
    { path: "../public/fonts/mdlorien/MDLorien-Italic.otf", weight: "400", style: "italic" },
    { path: "../public/fonts/mdlorien/MDLorien-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/mdlorien/MDLorien-Semibold.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/mdlorien/MDLorien-SemiboldItalic.otf", weight: "500", style: "italic" },
  ],
  variable: "--font-mdlorien",
});

export const metadata: Metadata = {
  title: "Davi Rezende",
  description: "Criado por Davi Rezende (no vibecoded)",
  icons: { icon: "/me.png", apple: "/me.png" },
  openGraph: {
    title: "Davi Rezende",
    description: "Criado por Davi Rezende (no vibecoded)",
    url: "https://davirezendemota.com",
    siteName: "Davi Rezende",
    images: [{ url: "https://davirezendemota.com/og-image.png", width: 500, height: 263 }],
    locale: "pt_BR",
    type: "website",
  },
};

function localeToHtmlLang(locale: string): string {
  if (locale === "pt-BR") return "pt-BR";
  return locale;
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={localeToHtmlLang(locale)} className="dark" suppressHydrationWarning>
      <body className={`${mdlorien.variable} font-sans antialiased min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
