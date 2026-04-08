import HeroSection from "@/components/home/HeroSection";
import AboutPreview from "@/components/home/AboutPreview";
import ServicesSection from "@/components/home/ServicesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="h-64 md:h-80 lg:h-[420px] bg-white" aria-hidden="true" />
      <AboutPreview />
      <ServicesSection />
      <div className="h-36 md:h-52 lg:h-72 bg-white" aria-hidden="true" />
      <WhyChooseUs />
      <div className="h-36 md:h-52 lg:h-72 bg-white" aria-hidden="true" />
    </>
  );
}
