import { Suspense } from "react";
import ScrollToHash from "@/components/ScrollToHash";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Barbers from "@/components/Barbers";
import Hours from "@/components/Hours";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
        <ScrollToHash/>
        <Navbar />
        <Hero/>

        <section id="services">
          <Suspense fallback={<p>Loading Services...</p>}>
          <Services/>
          </Suspense>
        </section>
        
        <section id="barbers">
          <Suspense fallback={<p>Loading Barbers...</p>}>
          <Barbers/>
          </Suspense>
        </section>

        <section id="hours">
          <Suspense fallback={<p>Loading hours...</p>}>
          <Hours/>
          </Suspense>
        </section>

        <Footer/>
    </>
  );
}

