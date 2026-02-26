// Página Projetos — comentada/desativada no menu (ver site-header.tsx)
import Link from "next/link";

export default function ProjetosPage() {
  return (
    <div className="container flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Projetos</h1>
      <p className="mb-6 text-muted-foreground">Em breve.</p>
      <Link
        href="/"
        className="text-sm text-primary hover:underline"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
