import WebHarmonium from "@/components/web-harmonium/WebHarmonium";
import { siteConfig } from "@/config/site";
import { DEFAULT_LOCALE, Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });
  const path = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const pageUrl = `${siteConfig.url}${path}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${pageUrl}#web-application`,
    name: t("seoTitle"),
    alternateName: ["Free Harmonium", "Web Harmonium"],
    description: t("seoDescription"),
    url: pageUrl,
    applicationCategory: "MusicApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern browser with Web Audio support",
    isAccessibleForFree: true,
    inLanguage: locale,
    image: `${siteConfig.url}/webharmonium/webharmonium.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Person",
      name: siteConfig.authors[0]?.name || siteConfig.name,
      url: siteConfig.authors[0]?.url || siteConfig.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WebHarmonium />
    </>
  );
}
