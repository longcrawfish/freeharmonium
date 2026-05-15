import { LOCALES } from "@/i18n/routing";

export default function UnsubscribePage() {
  return (
    <div className="max-w-md mx-auto my-16 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Email Subscription Management</h1>
      <p className="mb-4">
        Email subscription management is not available on the static site.
      </p>
      <p>
        Please contact support if you want to unsubscribe from email
        notifications.
      </p>
    </div>
  );
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
