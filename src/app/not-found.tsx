
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold text-green-600">404</p>

      <h1 className="mt-4 text-2xl font-bold">
        পেজটি খুঁজে পাওয়া যায়নি!
      </h1>

      <p className="mt-2 text-gray-500">
        আপনি যে পেজটি খুঁজছেন, সেটি নেই অথবা সরিয়ে ফেলা হয়েছে।
      </p>

      <Link
        href="/"
        className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
      >
        হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}
