import HeroSection from "@/components/home/HeroSection";
import AboutPreview from "@/components/home/AboutPreview";
import ServicesSection from "@/components/home/ServicesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutPreview />
      <ServicesSection />
      <div className="bg-white" style={{ height: "clamp(80px, 10vw, 160px)" }} />
      <WhyChooseUs />
      <div className="bg-white" style={{ height: "clamp(60px, 8vw, 120px)" }} />
    </>
  );
}
