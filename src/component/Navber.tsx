
"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    setCurrentDate(new Date().toLocaleDateString("bn-BD", options));

    async function fetchCategories() {
      try {
        const res = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/categories"
        );

        if (!res.ok) {
          throw new Error("Category fetch failed");
        }

        const result = await res.json();

        if (Array.isArray(result)) {
          setCategories(result);
        } else if (Array.isArray(result.data)) {
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

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        console.error("Logout failed:", error);
        alert("লগ আউট করা যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      setMenuOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      alert("লগ আউট করার সময় সমস্যা হয়েছে।");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Logo and User Profile */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Image
              src={logo}
              alt="বাজার দর লোগো"
              height={45}
              width={45}
              className="rounded-lg object-contain"
            />

            <div>
              <Link
                href="/"
                className="text-xl font-bold text-gray-900 hover:text-emerald-600 transition"
              >
                বাজার দর
              </Link>

              <p className="text-xs text-gray-500 font-medium">
                {currentDate || "লোড হচ্ছে..."}
              </p>
            </div>
          </div>

          {/* Authentication */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {isPending ? (
              <span className="text-sm text-gray-400">
                লোড হচ্ছে...
              </span>
            ) : session?.user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-expanded={menuOpen}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 hover:bg-gray-50 transition"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">
                      {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}

                  <span className="max-w-[130px] truncate text-sm font-semibold text-gray-800">
                    {session.user.name || "আমার প্রোফাইল"}
                  </span>

                  <span className="text-gray-500">⌄</span>
                </button>

                {menuOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="fixed inset-0 z-10 cursor-default"
                      onClick={() => setMenuOpen(false)}
                    />

                    <div className="absolute right-0 top-full mt-2 z-20 w-56 rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
                      <div className="border-b border-gray-100 px-2 pb-3 mb-2">
                        <p className="text-sm font-semibold text-gray-800">
                          {session.user.name}
                        </p>
                        <p className="mt-1 break-all text-xs text-gray-500">
                          {session.user.email}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {loggingOut ? "লগ আউট হচ্ছে..." : "↪ লগ আউট"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className="rounded-lg border border-emerald-600 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition"
                >
                  লগইন
                </Link>

                <Link
                  href="/sign-up"
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                >
                  রেজিস্টার
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Categories Navigation */}
        <div className="flex items-center overflow-x-auto pt-3 pb-1 text-sm no-scrollbar">
          <div className="flex items-center space-x-6 whitespace-nowrap">
            <Link
              href="/"
              className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1"
            >
              <span>🏠</span> হোম
            </Link>

            {loading ? (
              <span className="text-gray-400 text-xs animate-pulse">
                ক্যাটাগরি লোড হচ্ছে...
              </span>
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
