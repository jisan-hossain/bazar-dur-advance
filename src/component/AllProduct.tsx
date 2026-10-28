import React from 'react';
import Link from 'next/link';

interface Product {
  [key: string]: any;
}

const toBn = (n: number | string) => Number(n).toLocaleString('bn-BD');

export default async function AllProducts() {
  let products: Product[] = [];

  try {
    const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products", {
      cache: 'force-cache',
    });
    const data = await res.json();

    if (data && Array.isArray(data.data)) {
      products = data.data;
    } else if (Array.isArray(data)) {
      products = data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <h2 className="text-lg md:text-xl font-bold text-gray-800">সব পণ্য</h2>
      <p className="text-xs text-gray-400 mb-4">
        মোট {toBn(products.length)}টি পণ্য দেখানো হচ্ছে
      </p>

      {products.length === 0 ? (
        <p className="text-sm text-gray-400">কোনো পণ্য পাওয়া যায়নি...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((item, index) => {
            const productId = item.id || item._id;
            const dir = item.change?.dir;
            const pct = Math.abs(item.change?.pct || 0);

            const badge =
              dir === 'up'
                ? { text: `▲ ${toBn(pct)}%`, cls: 'text-red-600 bg-red-50' }
                : dir === 'down'
                ? { text: `▼ ${toBn(pct)}%`, cls: 'text-green-600 bg-green-50' }
                : { text: `— ${toBn(0)}%`, cls: 'text-gray-500 bg-gray-50' };

            return (
              <Link key={productId || index} href={`/product/${productId}`} className="block">
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 flex items-center justify-center text-2xl bg-gray-50 rounded-lg shrink-0">
                      {item.image || '🛒'}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {item.nameBn || item.name || "নাম নেই"}
                      </h3>
                      <p className="text-xs text-gray-400">প্রতি {item.unit || 'kg'}</p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    <div>
                      <p className="text-[11px] text-gray-400">আজকের দাম</p>
                      <p className="text-sm font-bold text-gray-900">
                        {toBn(item.today || 0)} টাকা
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${badge.cls}`}>
                      {badge.text}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}