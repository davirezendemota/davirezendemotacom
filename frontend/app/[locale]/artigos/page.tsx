import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type ArticleItem = {
  id: number;
  slug: string;
  title: string;
  published_at: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
};

async function getArticles(): Promise<ArticleItem[]> {
  const res = await fetch(`${API_URL}/articles`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return res.json();
}

type Props = { params: Promise<{ locale: string }> };

export default async function ArtigosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const articles = await getArticles();

  return (
    <div className="container flex min-h-[calc(100vh-3.5rem)] flex-col px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-foreground">Artigos</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.length === 0 ? (
          <p className="text-muted-foreground">Nenhum artigo publicado ainda.</p>
        ) : (
          articles.map((article) => (
            <Link
              key={article.id}
              href={`/artigos/${article.slug}`}
              className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary hover:bg-accent/5"
            >
              <h2 className="mb-2 font-semibold text-foreground group-hover:text-primary">
                {article.title}
              </h2>
              <time
                dateTime={article.published_at}
                className="mb-2 block text-sm text-muted-foreground"
              >
                {new Date(article.published_at).toLocaleDateString(locale, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              {article.summary && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.summary}
                </p>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
