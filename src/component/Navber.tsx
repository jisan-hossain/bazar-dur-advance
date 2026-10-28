"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import logo from "../image/Stack (1).png";

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const Navber = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const formattedDate = new Date().toLocaleDateString('bn-BD', options);
    setCurrentDate(formattedDate);

    async function fetchCategories() {
      try {
        const res = await fetch("https://openapi.programming-hero.com/api/bazardor/categories");
        const result = await res.json();
        if (Array.isArray(result)) {
          setCategories(result);
        } else if (result.data) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Image src={logo} alt='logo' height={45} width={45} className="rounded-lg object-contain" />
            <div>
              <Link href="/" className="text-xl font-bold text-gray-900 hover:text-emerald-600 transition">
                বাজার দর
              </Link>
              <p className="text-xs text-gray-500 font-medium">
                {currentDate || "লোড হচ্ছে..."}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          </div>
        </div>

        <div className="flex items-center overflow-x-auto pt-3 pb-1 text-sm no-scrollbar">
          <div className="flex items-center space-x-6 whitespace-nowrap">
            <Link href="/" className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1">
              <span>🏠</span> হোম
            </Link>
            
            {loading ? (
              <span className="text-gray-400 text-xs animate-pulse">ক্যাটাগরি লোড হচ্ছে...</span>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="text-gray-600 hover:text-emerald-600 font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameBn}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navber;