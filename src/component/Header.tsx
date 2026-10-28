import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import heroimg from "../image/bazar-hero.png"
export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">

      <div className="bg-[#EAF5F0] border border-[#CDEADF] rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm relative overflow-hidden">
        

        <div className="flex-1 space-y-4 text-left">
          
    
          <div className="inline-block bg-[#D6EFE5] text-[#2C7A51] text-xs font-semibold px-3 py-1 rounded-full">
            বুধবার, ২৮ অক্টোবর, ২০২৬
          </div>

       
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#1F2937] leading-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>

        
          <p className="text-sm md:text-base text-gray-600 max-w-xl">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন ও সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

       
          <div className="pt-2">
            <Link 
              href="/all-products" 
              className="inline-flex items-center justify-center bg-[#10B981] hover:bg-[#059669] text-white font-medium px-6 py-2.5 rounded-lg transition shadow-sm text-sm"
            >
              সব দ্রব্য দেখুন
            </Link>
          </div>

        </div>

   
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="w-56 h-48 md:w-64 md:h-56 relative flex items-center justify-center bg-white/50 rounded-2xl border border-emerald-100">
            <span className="text-6xl"> 

<Image src={heroimg} alt='hero image' height={400} width={400}></Image>

            </span>
          </div>
        </div>

      </div>
    </section>
  );
}