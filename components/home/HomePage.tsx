import WebHarmonium from "@/components/web-harmonium/WebHarmonium";
import { siteConfig } from "@/config/site";
import { Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

type SeoSection = {
  title: string;
  body: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

export async function HomePage({ locale, path }: { locale: Locale; path: string }) {
  const t = await getTranslations({ locale, namespace: "Home" });
  const seo = await getTranslations({ locale, namespace: "HomeSeo" });
  const sections = seo.raw("sections") as SeoSection[];
  const faqItems = seo.raw("faq") as FaqItem[];
  const featureList = seo.raw("featureList") as string[];
  const pageUrl = `${siteConfig.url}${path}`;

  const applicationJsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "@id": `${pageUrl}#web-application`,
    name: t("seoTitle"),
    alternateName: ["Free Harmonium", "Web Harmonium"],
    description: t("seoDescription"),
    url: pageUrl,
    applicationCategory: "MusicApplication",
    operatingSystem: "Any",
    browserRequirements: seo("browserRequirements"),
    featureList,
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <WebHarmonium />
      <HomeSeoContent sections={sections} faqItems={faqItems} faqTitle={seo("faqTitle")} />
    </>
  );
}

function HomeSeoContent({
  sections,
  faqItems,
  faqTitle,
}: {
  sections: SeoSection[];
  faqItems: FaqItem[];
  faqTitle: string;
}) {
  return (
    <section className="w-full bg-white text-neutral-950">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="border-t border-neutral-300 pt-5">
              <h2 className="text-xl font-semibold tracking-normal">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-neutral-700">{section.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 border-t border-neutral-300 pt-6">
          <h2 className="text-xl font-semibold tracking-normal">{faqTitle}</h2>
          <div className="mt-4 divide-y divide-neutral-200">
            {faqItems.map((item) => (
              <details key={item.question} className="group py-4">
                <summary className="cursor-pointer text-base font-medium text-neutral-900">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-7 text-neutral-700">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
