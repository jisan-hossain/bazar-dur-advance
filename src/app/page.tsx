import AllProducts from "@/component/AllProduct";
import Header from "@/component/Header";
import Marquee from "@/component/Marquee";
import ProductDown from "@/component/ProductDown";
import ProductUp from "@/component/productUp";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
   
      <Marquee />
      <Header/>
    <ProductUp/>
    <ProductDown/>
    <AllProducts/>
    </div>
  );
}