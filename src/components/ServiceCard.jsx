import React from 'react';
import { FaMobileAlt, FaGift, FaDatabase, FaCoins, FaLaptop, FaHeadphones } from 'react-icons/fa';

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="p-5 py-7 bg-radial-[at_0%_25%] from-primary-700/50 to-transparent to-65% rounded-lg backdrop-blur-lg border border-primary-500/80">
      {/* Icon */}
      <div className="p-3 bg-primary-600/20 rounded-lg inline-block">
        {icon}
      </div>
      {/* Title */}
      <p className="font-heading text-xl mt-4">{title}</p>
      {/* Description */}
      <p className="text-primary-200 text-sm mt-2">{description}</p>
    </div>
  );
};

export default ServiceCard;