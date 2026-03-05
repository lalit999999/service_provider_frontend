import React from 'react';
import { Link } from 'react-router';
import { Star, MapPin, DollarSign, User } from 'lucide-react';

export const ServiceCard = ({ service }) => {
  const averageRating = service.averageRating || 0;
  const reviewCount = service.reviewCount || 0;

  return (
    <Link
      to={`/services/${service._id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Color accent stripe */}
      <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 flex-1 mr-2">
            {service.title}
          </h3>
          <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg flex-shrink-0">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-blue-600">{service.price}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        <div className="flex items-center gap-3 mb-4 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{service.city || 'Location not specified'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500">({reviewCount})</span>
          </div>
        </div>

        {service.provider && (
          <div className="flex items-center gap-2 mb-4 pt-3 border-t border-gray-100">
            <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <span className="text-sm text-gray-600">
              {service.provider.name}
            </span>
          </div>
        )}

        <button className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
          View & Book
        </button>
      </div>
    </Link>
  );
};
