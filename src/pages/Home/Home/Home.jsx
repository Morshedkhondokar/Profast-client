import Banner from "../Banner/Banner";
import ClientLogosMarquee from "../clientLogosMarquee/ClientLogosMarquee";
import OurServices from "../Services/OurServices";
import Benefits from '../Benefits/Benefits.jsx'
import BeMerchant from "../BeMerchant/BeMerchant.jsx";
import HowItWorks from "../HowItWorks/HowItWorks.jsx";


const Home = () => {
  return (
    <div>
      <Banner />
      <HowItWorks/>
      <OurServices />
      <ClientLogosMarquee/>
      <Benefits/>
      <BeMerchant/>
    </div>
  );
};

export default Home;
