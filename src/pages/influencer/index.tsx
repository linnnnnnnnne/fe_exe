import Headerrr from "../../components/share/Headerrr";
import ExploreInflu from "../../components/influencer/ExploreInflu";
import Footer from "../../components/share/Footer";

export default function Influencer() {
  return (
    <div className="bg-[#FBFBFB] min-h-screen">
      <Headerrr />
      <ExploreInflu />
      <div className="mt-[80px]">
        <Footer />
      </div>
    </div>
  );
}
