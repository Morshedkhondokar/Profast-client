import React from 'react';

const ServiceCard = ({ title, description, Icon }) => {
  return (
    <div className="card  shadow-md bg-white hover:bg-[#CAEB66] hover:shadow-xl transition duration-300 p-6 text-center ">
      <div className="flex flex-col items-center gap-4 mb-4">
        <Icon className="text-secondary  text-3xl " />
        <h3 className="text-lg font-semibold text-secondary ">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 ">{description}</p>
    </div>
  );
};

export default ServiceCard;