
"use client";

import React, { Suspense, use, useEffect, useState } from "react";

interface Product {
  [key: string]: any;
}

type SortOrder = "default" | "low-to-high" | "high-to-low";

const categoryNames: Record<string, string> = {
  chal: "চাল",
  dal: "ডাল",
  tel: "তেল",
  sobji: "সবজি",
  mach: "মাছ",
  mangsho: "মাংস",
  "dim-dui": "ডিম-দুধ",
  mosla: "মসলা",
};

async function fetchProducts(slug: string): Promise<Product[]> {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/bazardor/products?category=${slug}`
  );

  if (!res.ok) {
    throw new Error("পণ্য লোড করা যায়নি");
  }

  const data = await res.json();

  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data)) return data;

  return [];
}

function CategoryContent({ slug }: { slug: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchProducts(slug);

        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching category products:", err);

        if (!cancelled) {
          setError("পণ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const sortedProducts = [...products].sort((a, b) => {
    const priceA = Number(a.today ?? a.price ?? 0);
    const priceB = Number(b.today ?? b.price ?? 0);

    if (sortOrder === "low-to-high") {
      return priceA - priceB;
    }

    if (sortOrder === "high-to-low") {
      return priceB - priceA;
    }

    return 0;
  });

  return (
    <>
      {/* Category heading */}
      <section className="rounded-2xl border border-[#CDEADF] bg-[#EAF5F0] p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {categoryNames[slug] || slug}
        </h1>

        <p className="mt-1 text-xs text-gray-600">
          প্রতি পণ্যের আজকের দাম ও পরিবর্তন
        </p>
      </section>

      {/* Sort dropdown */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4">
        <p className="text-sm text-gray-500">
          {loading
            ? "পণ্য লোড হচ্ছে..."
            : `মোট ${products.length}টি পণ্য দেখানো হচ্ছে`}
        </p>

        <div className="flex items-center gap-2">
          <label
            htmlFor="price-sort"
            className="text-sm text-gray-500"
          >
            সাজান
          </label>

          <select
            id="price-sort"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as SortOrder)
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-to-high">দাম কম থেকে বেশি</option>
            <option value="high-to-low">দাম বেশি থেকে কম</option>
          </select>
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <p className="py-8 text-center text-sm text-gray-400">
          পণ্য লোড হচ্ছে...
        </p>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="space-y-3 py-8 text-center">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => {
              setSortOrder("default");
              setLoading(true);
              setError("");
              fetchProducts(slug)
                .then(setProducts)
                .catch((err) => {
                  console.error(err);
                  setError("পণ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
                })
                .finally(() => setLoading(false));
            }}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-400">
          এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
        </p>
      )}

      {/* Product cards */}
      {!loading && !error && sortedProducts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {sortedProducts.map((item, index) => {
            const isUp = item.change?.dir === "up";
            const isDown = item.change?.dir === "down";

            return (
              <article
                key={item.id ?? item._id ?? index}
                className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {item.image &&
                  String(item.image).startsWith("http") ? (
                    <img
                      src={item.image}
                      alt={item.nameBn || item.name || "পণ্য"}
                      className="h-12 w-12 shrink-0 rounded-xl bg-gray-50 object-cover"
                    />
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F0] text-2xl">
                      {item.image || "🛒"}
                    </span>
                  )}

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-gray-800">
                      {item.nameBn || item.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      প্রতি {item.unit || "kg"}
                    </p>

                    <p className="mt-2 text-sm font-bold text-gray-900">
                      {item.today ?? item.price ?? 0} টাকা
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {isUp ? (
                    <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                      ▲ {item.change?.pct ?? 0}%
                    </span>
                  ) : isDown ? (
                    <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                      ▼ {item.change?.pct ?? 0}%
                    </span>
                  ) : (
                    <span className="rounded-md bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-500">
                      − 0%
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

function CategoryFallback() {
  return (
    <p className="py-8 text-center text-sm text-gray-400">
      লোড হচ্ছে...
    </p>
  );
}

function CategoryPageContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return <CategoryContent slug={slug} />;
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <Suspense fallback={<CategoryFallback />}>
        <CategoryPageContent params={params} />
      </Suspense>
    </main>
  );
}
