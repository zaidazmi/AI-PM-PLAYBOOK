/**
 * Inline JSON-LD structured data. Use for individual doc pages so search
 * engines and AI crawlers get clean Article/BreadcrumbList signals.
 */
type Crumb = { name: string; href: string };

const SITE_URL = "https://ai-pm-playbook.com";

type ArticleProps = {
  kind: "article";
  url: string;
  title: string;
  description?: string;
  section?: string;
  breadcrumbs: Crumb[];
};

type Props = ArticleProps;

export function JsonLd(props: Props) {
  const article = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: props.title,
    description: props.description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${props.url}`,
    },
    author: {
      "@type": "Person",
      name: "Zaid Azmi",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "AI PM Playbook",
      url: SITE_URL,
    },
    ...(props.section ? { articleSection: props.section } : {}),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: props.breadcrumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.href.startsWith("http") ? c.href : `${SITE_URL}${c.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
