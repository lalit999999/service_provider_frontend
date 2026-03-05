import React from 'react';
import { Link } from 'react-router';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-white">
              LocalServices
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              Connecting you with trusted local service providers for all your home and business needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-sm hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm hover:text-white transition-colors">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm hover:text-white transition-colors">
                  Become a Provider
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm">Help Center</span>
              </li>
              <li>
                <span className="text-sm">Terms of Service</span>
              </li>
              <li>
                <span className="text-sm">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm">FAQs</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-blue-400" />
                support@localservices.com
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-blue-400" />
                1-800-555-0199
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-blue-400" />
                New York, NY 10001
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} LocalServices. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
