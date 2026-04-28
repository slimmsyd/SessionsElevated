import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import WhatIsASession from "@/components/sections/WhatIsASession";
import UpcomingSessions from "@/components/sections/UpcomingSessions";
import Practitioners from "@/components/sections/Practitioners";
import Partners from "@/components/sections/Partners";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import RevealProvider from "@/components/RevealProvider";
import StickyReserve from "@/components/StickyReserve";

export default function Home() {
  return (
    <RevealProvider>
      <Nav />
      <main>
        <Hero />
        <WhatIsASession />
        <UpcomingSessions />
        <Practitioners />
        <Partners />
        <FAQ />
      </main>
      <Footer />
      <StickyReserve />
    </RevealProvider>
  );
}
