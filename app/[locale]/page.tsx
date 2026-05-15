import { HomePage } from "@/components/home/HomePage";
import { Locale, LOCALES } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  return <HomePage locale={locale} path={`/${locale}`} />;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
