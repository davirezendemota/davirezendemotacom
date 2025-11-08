import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const mdlorien = localFont({
  src: [
    {
      path: '../public/fonts/mdlorien/MDLorien-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../public/fonts/mdlorien/MDLorien-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
    {
      path: '../public/fonts/mdlorien/MDLorien-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/mdlorien/MDLorien-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/fonts/mdlorien/MDLorien-Book.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/mdlorien/MDLorien-BookItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/fonts/mdlorien/MDLorien-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/mdlorien/MDLorien-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/mdlorien/MDLorien-Semibold.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/mdlorien/MDLorien-SemiboldItalic.otf',
      weight: '500',
      style: 'italic',
    },
  ],
  variable: '--font-mdlorien',
});

export const metadata: Metadata = {
  title: "Davi Rezende",
  description: "Criado por Davi Rezende (no vibecoded)",
  // LINK PREVIEW
  openGraph: {
    title: "Davi Rezende",
    description: "Criado por Davi Rezende (no vibecoded)",
    url: "https://davirezendemota.com",
    siteName: "Davi Rezende",
    images: [
      {
        url: "https://davirezendemota.com/og-image.png", // URL total da imagem
        width: 500,
        height: 263,
      },
    ],
    locale: "pt_BR",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${mdlorien.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
