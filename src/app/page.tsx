import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProblemSection from "@/components/ProblemSection";
import FeatureDashboard from "@/components/FeatureDashboard";
import Calculator from "@/components/Calculator";
import WhoIsThisFor from "@/components/WhoIsThisFor";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import CoverageMap from "@/components/CoverageMap";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import ChatFAB from "@/components/ChatFAB";
import ChatPanel from "@/components/ChatPanel";
import ReportModal from "@/components/ReportModal";
import MicrogridModal from "@/components/MicrogridModal";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustBar />
      <ProblemSection />
      <FeatureDashboard />
      <Calculator />
      <WhoIsThisFor />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CoverageMap />
      <CTABanner />
      <Footer />
      
      {/* Agentic AI Components */}
      <ChatFAB />
      <ChatPanel />
      <ReportModal />
      <MicrogridModal />
    </>
  );
}
