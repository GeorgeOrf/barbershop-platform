import { Suspense } from "react";
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

        <Suspense fallback={<p>Loading Services...</p>}>
        <Services/>
        </Suspense>
        
        <Suspense fallback={<p>Loading Barbers...</p>}>
        <Barbers/>
        </Suspense>

        <Suspense fallback={<p>Loading hours...</p>}>
        <Hours/>
        </Suspense>
    </>
  );
}

