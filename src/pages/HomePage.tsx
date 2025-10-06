import { Demo } from "@/components/LandingPage/Demo";
import { FAQ } from "@/components/LandingPage/Faq";
import { Features } from "@/components/LandingPage/Features";
import { Footer } from "@/components/LandingPage/Footer";
import { Hero } from "@/components/LandingPage/Hero";
import { HowItWorks } from "@/components/LandingPage/HowItWorks";
import { Navbar } from "@/components/LandingPage/Navbar";
import { Pricing } from "@/components/LandingPage/Pricing";
import { SocialProof } from "@/components/LandingPage/SocialProof";
import { Testimonials } from "@/components/LandingPage/Testimonial";

const HomePage = () => {
  return (
    <>
      <div className="min-h-screen bg-[#0B0F14] text-white">
        <Navbar />
        <main>
          <Hero />
          <SocialProof />
          <Features />
          <HowItWorks />
          <Demo />
          <Pricing />
          <Testimonials />
          <FAQ />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
