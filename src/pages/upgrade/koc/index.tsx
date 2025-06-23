import Footer from "../../../components/share/Footer";
import Headerrr from "../../../components/share/Headerrr";
import KOC from "../../../components/upgrade/KOC";


export default function UngradeKOC() {
  return (
    <div className="bg-[#FBFBFB] min-h-screen">
      <Headerrr />
      <KOC />
      <div className="mt-[80px]">
        <Footer/>
      </div>
    </div>
  );
}
