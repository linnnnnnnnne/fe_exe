import Header from "../../components/trangCh/Header";
import Hero from "../../components/trangCh/Hero";
import PopularJobs from "../../components/trangCh/PopularJobs";
import BusinessPlan from "../../components/trangCh/BusinessPlan";
import ImpactSection from "../../components/trangCh/ImpactSection";
import Footer from "../../components/share/Footer";
import AIchat from "../../components/trangCh/AIchat";

export default function TrangCh1() {
  return (
    <div className="font-montserrat text-darkslategray-900">
      <Header />
      <Hero />
      <PopularJobs />
      <BusinessPlan />
      <ImpactSection />
      <Footer />
      <AIchat />
    </div>
  );
}
