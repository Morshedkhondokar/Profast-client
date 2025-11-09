import HowItWorksCard from "./HowItWorksCard";
import { howItWorksData } from "./howItWorksData";


const HowItWorks = () => {
  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-secondary">How It Works</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {howItWorksData.map((item) => (
          <HowItWorksCard
            key={item.id}
            img={item.img}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
