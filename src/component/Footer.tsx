"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [year, setYear] = useState<number | string>(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white font-bold px-2 py-1 rounded text-sm">
              বাজার
            </span>
            <span className="text-xl font-bold text-gray-800">বাজার দর</span>
          </div>

          <p className="text-sm text-gray-500">
            © {year} বাজার দর। সর্বস্বত্ব সংরক্ষিত।
          </p>

          <div className="flex space-x-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-emerald-600 transition">
              হোম
            </Link>
            <Link href="/privacy" className="hover:text-emerald-600 transition">
              প্রাইভেসি পলিসি
            </Link>
            <Link href="/terms" className="hover:text-emerald-600 transition">
              শর্তাবলী
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}