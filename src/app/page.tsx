import { shop } from "@/config/shop.config"
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Barbers from "@/components/Barbers";
import Hours from "@/components/Hours";

export default function Home() {
  return (
    <>
        <Navbar />
        <Hero/>
        <Services/>
        <Barbers/>
        <Hours/>
    </>
  );
}

