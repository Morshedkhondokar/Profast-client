import BenefitCard from "./BenefitCard";
import { benefitsData } from "./benefitsData";


const Benefits = () => {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4">
      {/* Vertical Divider */}
        <div className="border-2 border-dashed border-secondary  my-14"></div>

    <div className="flex  flex-col gap-6">
          {benefitsData.map((benefit) => (
        <BenefitCard
          key={benefit.id}
          img={benefit.img}
          title={benefit.title}
          description={benefit.description}
        />
      ))}
    </div>
    </div>
  );
};

export default Benefits;

