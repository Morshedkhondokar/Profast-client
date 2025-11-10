import Banner from "../Banner/Banner";
import ClientLogosMarquee from "../clientLogosMarquee/ClientLogosMarquee";
import OurServices from "../Services/OurServices";
import Benefits from '../Benefits/Benefits.jsx'
import BeMerchant from "../BeMerchant/BeMerchant.jsx";
import HowItWorks from "../HowItWorks/HowItWorks.jsx";
import ReviewSection from "../../reviews/ReviewSection.jsx";
import FAQ from "../FAQ/FAQ.jsx";


const Home = () => {
  return (
    <div>
      <Banner />
      <HowItWorks/>
      <OurServices />
      <ClientLogosMarquee/>
      <Benefits/>
      <BeMerchant/>
      <ReviewSection/>
      <FAQ/>
    </div>
  );
};

export default Home;
