

const BenefitCard = ({ img, title, description }) => {
  return (
    <div className="w-full shadow-md hover:shadow-xl rounded-2xl   border border-gray-200 transition-all duration-300 p-6">
      <div className="flex flex-col md:flex-row items-stretch gap-3">

        {/* Left: Image */}
        <img src={img} alt={title} className="h-28 md:h-26 md:w-26 object-contain md:m-3" />

        {/* Vertical Divider */}
        <div className="border-2 border-dashed border-secondary md:my-6"></div>

        {/* Right: Content */}
        <div className="md:p-6">
          <h3 className="text-xl text-secondary font-bold">{title}</h3>
          <p className="text-gray-600 md:text-xl leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default BenefitCard;
