
"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "../image/Stack (1).png";
import { authClient } from "@/lib/auth-client";

type Category = {
  id: string | number;
  slug: string;
  icon: string;
  nameBn: string;
};

const Navber = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("bn-BD", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    async function fetchCategories() {
      try {
        const res = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/categories"
        );

        if (!res.ok) throw new Error("Category fetch failed");

        const result = await res.json();

        if (Array.isArray(result)) {
          setCategories(result as Category[]);
        } else if (Array.isArray(result.data)) {
          setCategories(result.data as Category[]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      setMenuOpen(false);

      const { error } = await authClient.signOut();

      if (error) {
        console.error("Logout failed:", error);
        alert("লগআউট করা যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      alert("লগআউট করতে সমস্যা হয়েছে।");
    } finally {
      setLoggingOut(false);
    }
  }

  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src={logo}
              alt="বাজার দর লোগো"
              height={45}
              width={45}
              className="shrink-0 rounded-lg object-contain"
            />

            <div>
              <Link
                href="/"
                className="text-xl font-bold text-gray-900 transition hover:text-emerald-600"
              >
                বাজার দর
              </Link>

              <p className="text-xs font-medium text-gray-500">
                {currentDate || "লোড হচ্ছে..."}
              </p>
            </div>
          </div>

          <div className="relative shrink-0">
            {isPending ? (
              <span className="text-sm text-gray-400">লোড হচ্ছে...</span>
            ) : user ? (
              <>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-expanded={menuOpen}
                  aria-label="User menu"
                  className="flex items-center gap-2 rounded-xl border border-gray-100 px-2 py-2 transition hover:bg-gray-50 sm:px-3"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                    {initial}
                  </span>

                  <span className="hidden max-w-32 truncate text-sm font-semibold text-gray-800 sm:block">
                    {user.name || user.email}
                  </span>

                  <span className="text-xs text-gray-500">
                    {menuOpen ? "▲" : "▼"}
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full z-[60] mt-2 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {user.name || "ব্যবহারকারী"}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <span>👤</span>
                        আমার প্রোফাইল
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <span>↪</span>
                        {loggingOut ? "লগআউট হচ্ছে..." : "লগআউট"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className="rounded-lg border border-emerald-600 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  লগইন
                </Link>

                <Link
                  href="/sign-up"
                  className="hidden rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:inline-block"
                >
                  রেজিস্টার
                </Link>
              </div>
            )}
          </div>
        </div>

        <nav className="flex items-center overflow-x-auto pt-3 pb-1 text-sm">
          <div className="flex items-center gap-6 whitespace-nowrap">
            <Link
              href="/"
              className="flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700"
            >
              <span>🏠</span>
              হোম
            </Link>

            {loading ? (
              <span className="animate-pulse text-xs text-gray-400">
                ক্যাটাগরি লোড হচ্ছে...
              </span>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat.id || cat.slug}
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-1.5 font-medium text-gray-600 transition-colors hover:text-emerald-600"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameBn}</span>
                </Link>
              ))
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navber;
