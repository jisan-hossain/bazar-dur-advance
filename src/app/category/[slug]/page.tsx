import React, { Suspense } from 'react';

interface Product {
  [key: string]: any;
}

export async function generateStaticParams() {
  return [
    { slug: 'chal' },
    { slug: 'dal' },
    { slug: 'tel' },
    { slug: 'sobji' },
    { slug: 'mach' },
    { slug: 'mangsho' },
    { slug: 'dim-dui' },
    { slug: 'mosla' },
  ];
}

async function CategoryContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let products: Product[] = [];

  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/bazardor/products?category=${slug}`
    );
    const data = await res.json();

    if (data && Array.isArray(data.data)) {
      products = data.data;
    } else if (Array.isArray(data)) {
      products = data;
    }
  } catch (error) {
    console.error("Error fetching category products:", error);
  }

  return (
    <>
      <div className="bg-[#EAF5F0] border border-[#CDEADF] rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-900 uppercase">{slug}</h1>
        <p className="text-xs text-gray-600 mt-1">প্রতি পণ্যের আজকের দাম ও পরিবর্তন</p>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-gray-400">
          এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি...
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((item, index) => {
            const isUp = item.change?.dir === 'up';
            const isDown = item.change?.dir === 'down';

            return (
              <div key={index} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.image || '🛒'}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{item.nameBn || item.name}</h3>
                    <p className="text-xs text-gray-400">প্রতি {item.unit || 'kg'}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{item.today || 0} টাকা</p>
                  </div>
                </div>
                <div className="text-right">
                  {isUp && (
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                      ▲ {item.change?.pct || 0}%
                    </span>
                  )}
                  {isDown && (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                      ▼ {item.change?.pct || 0}%
                    </span>
                  )}
                  {!isUp && !isDown && (
                    <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                      - 0%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <Suspense
        fallback={<p className="text-sm text-gray-400">লোড হচ্ছে...</p>}
      >
        <CategoryContent params={params} />
      </Suspense>
    </main>
  );
}