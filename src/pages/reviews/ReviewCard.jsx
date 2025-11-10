
import { FaQuoteRight } from "react-icons/fa";

const ReviewCard = ({ img, name, review }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between h-full">
      
      {/* Quote Icon */}
      <FaQuoteRight className="text-teal-300 text-3xl mb-4" />

      {/* Review Text */}
      <p className="text-gray-600 leading-relaxed mb-6">
        {review}
      </p>

      {/* Divider */}
      <div className="border-t border-dashed border-gray-300 my-4"></div>

      {/* User Info */}
      <div className="flex items-center gap-4">
        {/* User Image */}
        <img
          src={img}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />

        <div>
          <h3 className="text-lg font-semibold text-teal-900">{name}</h3>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
