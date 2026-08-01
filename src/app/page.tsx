import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/landing/Hero';
import ServiceCategories from '@/components/landing/ServiceCategories';
import FeaturedServices from '@/components/landing/FeaturedServices';
import HowItWorks from '@/components/landing/HowItWorks';
import FeaturedProducts from '@/components/landing/FeaturedProducts';
import ProviderCta from '@/components/landing/ProviderCta';
import Testimonials from '@/components/landing/Testimonials';
import PartnersMarquee from '@/components/landing/PartnersMarquee';
import FaqSection from '@/components/landing/FaqSection';

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col bg-white font-arabic text-right selection:bg-[#22BC9F] selection:text-white"
      dir="rtl"
    >
      <Header />

      <main className="w-full overflow-hidden">
        <Hero />
        <PartnersMarquee />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-24">
          <HowItWorks />
          <ServiceCategories />
          <FeaturedServices />
          <FeaturedProducts />
        </div>

        <ProviderCta />
        <Testimonials />
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
