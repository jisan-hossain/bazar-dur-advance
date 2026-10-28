import React, { Suspense } from 'react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">লোড হচ্ছে...</div>}>
      <ProductDetailPage params={params} />
    </Suspense>
  );
}

async function ProductDetailPage({ params }: PageProps) {
  // এখানে অবশ্যই await করতে হবে
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let product: any = null;

  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/bazardor/products`, {
      cache: 'force-cache'
    });
    const data = await res.json();
    const allProducts = data.data || data;
    
    product = allProducts.find((item: any) => 
      item.id?.toString() === id?.toString() || item._id?.toString() === id?.toString()
    );
  } catch (error) {
    console.error("Error fetching product detail:", error);
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-700">পণ্যটি খুঁজে পাওয়া যায়নি!</h2>
        <p className="text-sm text-gray-400">অনুরোধকৃত আইডি: {id}</p>
        <Link href="/" className="inline-block px-6 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* টপ ব্যানার বা হেডার */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          {product.image ? (
            <img src={product.image} alt={product.nameBn} className="w-16 h-16 object-cover rounded-xl bg-gray-50 shrink-0" />
          ) : (
            <span className="text-4xl p-3 bg-gray-50 rounded-xl">🛒</span>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.nameBn || product.name}</h1>
            <p className="text-xs text-gray-500 mt-1">বাজারের সুলভ মূল্যের আজকের দাম ও পরিবর্তন</p>
          </div>
        </div>
        <div className="bg-[#EAF5F0] border border-[#CDEADF] px-6 py-3 rounded-xl text-right">
          <p className="text-xs text-gray-600">আজকের দাম</p>
          <p className="text-xl font-bold text-gray-900">{product.today || product.price || 0} টাকা <span className="text-xs font-normal">প্রতি {product.unit || 'kg'}</span></p>
        </div>
      </div>

      {/* সামারি সেকশন */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-400">গতকাল</p>
          <p className="text-lg font-bold text-gray-800 mt-1">{product.yesterday || 0} টাকা</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-400">গত সপ্তাহ</p>
          <p className="text-lg font-bold text-gray-800 mt-1">{product.lastWeek || 0} টাকা</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-400">গত মাস</p>
          <p className="text-lg font-bold text-gray-800 mt-1">{product.lastMonth || 0} টাকা</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-400">পরিবর্তন</p>
          <p className={`text-lg font-bold mt-1 ${product.change?.dir === 'up' ? 'text-red-600' : 'text-green-600'}`}>
            {product.change?.dir === 'up' ? '▲' : '▼'} {product.change?.pct || 0}%
          </p>
        </div>
      </div>

      {/* বাজারভিত্তিক আজকের দাম টেবিল */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-900">বাজারভিত্তিক আজকের দাম</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400">
                <th className="py-3 px-4">বাজারের নাম</th>
                <th className="py-3 px-4">অবস্থান</th>
                <th className="py-3 px-4">আজকের দাম</th>
                <th className="py-3 px-4">সর্বনিম্ন</th>
                <th className="py-3 px-4">সর্বাধিক</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {product.markets && product.markets.length > 0 ? (
                product.markets.map((m: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-gray-800">{m.marketName || m.name || 'কাওরান বাজার'}</td>
                    <td className="py-3 px-4 text-gray-500">{m.location || 'ঢাকা'}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{m.price || product.today} টাকা</td>
                    <td className="py-3 px-4 text-gray-600">{m.minPrice || (product.today - 5)} টাকা</td>
                    <td className="py-3 px-4 text-gray-600">{m.maxPrice || (product.today + 5)} টাকা</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-400 text-xs">এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}