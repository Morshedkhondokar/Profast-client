import { services } from "./servicesData";
import ServiceCard from "./ServicesCard";

const OurServices = () => {
  return (
    <section className="py-12 px-4 md:px-8 lg:px-16 bg-secondary my-5 mx-2 md:mx-0 rounded-2xl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4 ">Our Services</h2>
        <p className=" max-w-2xl mx-auto">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            description={service.description}
            Icon={service.icon}
          />
        ))}
      </div>
    </section>
  );
};

export default OurServices;
