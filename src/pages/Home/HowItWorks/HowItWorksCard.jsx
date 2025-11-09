
const HowItWorksCard = ({ img, title, description }) => {
  return (
    <div className="bg-base-100 shadow-md hover:shadow-xl rounded-2xl border border-gray-200 transition-all duration-300 p-6 flex flex-col ">
      <div className=" mb-4">
      <img src={img} alt="" />
      </div>

      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default HowItWorksCard;
