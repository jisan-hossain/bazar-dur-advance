import React from 'react';

interface Product {
  [key: string]: any;
}

export default async function Marquee() {
  let products: Product[] = [];

  try {
    const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products", {
      next: { revalidate: 60 }
    });
    const data = await res.json();
    
    if (data && data.data) {
      products = data.data;
    } else if (Array.isArray(data)) {
      products = data;
    }
  } catch (error) {
    console.error("Error fetching marquee products:", error);
  }

  // স্মুথ ইনফিনিট লুপের জন্য ডেটা ডাবল করা হলো
  const duplicatedProducts = [...products, ...products];

  return (
    <div className="bg-emerald-50 border-y border-emerald-100 py-2.5 overflow-hidden whitespace-nowrap relative">
      <div className="inline-block animate-marquee">
        {products.length === 0 ? (
          <span className="mx-4 text-gray-400">বাজার দর লোড হচ্ছে...</span>
        ) : (
          duplicatedProducts.map((item, index) => (
            <span key={index} className="mx-6 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800">
              <span>{item.nameBn}</span>
              <span className="font-bold">
                {item.today || 0} টাকা/{item.unit || "kg"}
              </span>
              <span className={item.change?.dir === "up" ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                {item.change?.dir === "up" ? `▲ ${item.change?.pct || 0}%` : `▼ ${item.change?.pct || 0}%`}
              </span>
            </span>
          ))
        )}
      </div>
    </div>
  );
}