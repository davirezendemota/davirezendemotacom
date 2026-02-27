import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type ArticleDetail = {
  id: number;
  slug: string;
  title: string;
  published_at: string;
  summary: string | null;
  content: string;
  created_at: string;
  updated_at: string;
};

async function getArticle(slug: string): Promise<ArticleDetail | null> {
  const res = await fetch(`${API_URL}/articles/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ArtigoPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <article className="container flex min-h-[calc(100vh-3.5rem)] flex-col px-4 py-12">
      <header className="mb-8 max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
          {article.title}
        </h1>
        <time
          dateTime={article.published_at}
          className="text-sm text-muted-foreground"
        >
          {new Date(article.published_at).toLocaleDateString(locale, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
        {article.summary && (
          <p className="mt-2 text-muted-foreground">{article.summary}</p>
        )}
      </header>
      <div className="prose prose-invert max-w-3xl prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
      </div>
    </article>
  );
}
