import React from "react";
import Marquee from "react-fast-marquee";

// import your logo images
import logo1 from '../../../assets/brands/amazon.png'
import logo2 from '../../../assets/brands/amazon_vector.png'
import logo3 from '../../../assets/brands/casio.png'
import logo4 from '../../../assets/brands/moonstar.png'
import logo5 from '../../../assets/brands/randstad.png'
import logo6 from '../../../assets/brands/start.png'
import logo7 from '../../../assets/brands/start-people1.png'

//  
const logos = [logo1, logo2, logo3,  logo4,  logo5,  logo6,  logo7];

const ClientLogosMarquee = () => {
  return (
    <section className="py-14 bg-gray-100">
      <h2 className="text-xl text-[#03373D] font-extrabold text-center mb-8">We've helped thousands of sales teams</h2>

      <Marquee speed={45} gradient={false} pauseOnHover={true}>
        <div className="flex items-center gap-24">
          {logos.map((logo, i) => (
            <img
              key={i}
              src={logo}
              alt="client logo"
              className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition"
            />
          ))}
        </div>
      </Marquee>
    </section>
  );
};

export default ClientLogosMarquee;
