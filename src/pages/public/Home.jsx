import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Star,
  Shield,
  Clock,
  CheckCircle,
  Users,
  Wrench,
} from "lucide-react";
import { categoriesAPI } from "../../api/endpoints";
import { toast } from "sonner";
import { ImageWithFallback } from "../../app/components/figma/ImageWithFallback";

const categoryImages = {
  Plumbing:
    "https://images.unsplash.com/photo-1599463698367-11cb72775b67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmVyJTIwd29ya2luZyUyMHJlcGFpcnxlbnwxfHx8fDE3NzI2MTU4NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  Electrical:
    "https://images.unsplash.com/photo-1754620906571-9ba64bd3ffb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMHdvcmslMjBpbnN0YWxsYXRpb258ZW58MXx8fHwxNzcyNjQ5MzYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  Cleaning:
    "https://images.unsplash.com/photo-1581578949510-fa7315c4c350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMGNsZWFuaW5nJTIwcHJvZmVzc2lvbmFsJTIwc2VydmljZXxlbnwxfHx8fDE3NzI2NDkzNjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  Carpentry:
    "https://images.unsplash.com/photo-1590880795696-20c7dfadacde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJwZW50ZXIlMjB3b29kd29ya2luZyUyMHRvb2xzfGVufDF8fHx8MTc3MjYyMDg2MHww&ixlib=rb-4.1.0&q=80&w=1080",
  Painting:
    "https://images.unsplash.com/photo-1643804475756-ca849847c78a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwcGFpbnRpbmclMjBpbnRlcmlvciUyMHdhbGxzfGVufDF8fHx8MTc3MjU3NDgzOXww&ixlib=rb-4.1.0&q=80&w=1080",
  HVAC: "https://images.unsplash.com/photo-1758798157512-f0a864c696c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodmFjJTIwYWlyJTIwY29uZGl0aW9uaW5nJTIwdGVjaG5pY2lhbnxlbnwxfHx8fDE3NzI2NDkzNjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
};

const defaultCategoryImg =
  "https://images.unsplash.com/photo-1581578949510-fa7315c4c350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwcmVwYWlyJTIwc2VydmljZXMlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcyNjQ5MzYwfDA&ixlib=rb-4.1.0&q=80&w=1080";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Homeowner",
    rating: 5,
    comment:
      "Found an amazing plumber within minutes. The booking process was so easy, and the work was done perfectly!",
  },
  {
    id: 2,
    name: "David L.",
    role: "Business Owner",
    rating: 5,
    comment:
      "We use LocalServices for all our office maintenance. The providers are always professional and reliable.",
  },
  {
    id: 3,
    name: "Maria K.",
    role: "Service Provider",
    rating: 5,
    comment:
      "As a provider, this platform has helped me grow my client base significantly. Highly recommend joining!",
  },
];

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      // Ensure categories is always an array before slicing
      const data = Array.isArray(response.data)
        ? response.data.slice(0, 6)
        : [];
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      navigate(`/services?city=${encodeURIComponent(city)}`);
    } else {
      toast.error("Please enter a city name");
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Find Trusted Local
              <span className="block text-blue-200">Service Providers</span>
            </h1>
            <p className="text-lg sm:text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
              Book vetted professionals for plumbing, electrical, cleaning, and
              more. Quality service is just a click away.
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter your city..."
                    className="w-full px-6 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300/50 shadow-lg"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Search Services
                </button>
              </div>
            </form>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <Shield className="w-5 h-5" />
                <span>Verified Providers</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <Clock className="w-5 h-5" />
                <span>Quick Booking</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <Star className="w-5 h-5" />
                <span>Rated & Reviewed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting started is easy. Book a service in just three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div className="text-center group">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Search className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              1. Search
            </h3>
            <p className="text-gray-600">
              Browse services by category or search for specific providers in
              your area.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <CheckCircle className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              2. Book
            </h3>
            <p className="text-gray-600">
              Select a date, provide your address, and submit your booking
              request instantly.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Wrench className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              3. Get It Done
            </h3>
            <p className="text-gray-600">
              Your provider confirms and completes the work. Rate and review
              when finished.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Popular Service Categories
            </h2>
            <p className="text-lg text-gray-600">
              Browse services by category and find the right professional
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-xl overflow-hidden animate-pulse"
                >
                  <div className="h-40 bg-gray-200" />
                  <div className="p-5">
                    <div className="h-5 bg-gray-200 rounded mb-3 w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/services?category=${category._id}`}
                  className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white"
                >
                  <div className="h-40 overflow-hidden">
                    <ImageWithFallback
                      src={categoryImages[category.name] || defaultCategoryImg}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {category.description || "Find the best services"}
                    </p>
                    <div className="flex items-center text-blue-600 text-sm group-hover:translate-x-1 transition-transform">
                      <span>Browse services</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Categories
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <p className="text-3xl sm:text-4xl font-bold">1,200+</p>
              <p className="text-blue-200 mt-1">Service Providers</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold">15,000+</p>
              <p className="text-blue-200 mt-1">Bookings Completed</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold">50+</p>
              <p className="text-blue-200 mt-1">Service Categories</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold">4.8</p>
              <p className="text-blue-200 mt-1">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600">
            Trusted by thousands of customers and providers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-5 italic">"{t.comment}"</p>
              <div className="border-t pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Need a Service?
              </h3>
              <p className="text-gray-600 mb-6">
                Find and book trusted local service providers in minutes.
                Compare ratings and prices.
              </p>
              <Link
                to="/services"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Services
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Are You a Service Provider?
              </h3>
              <p className="text-gray-600 mb-6">
                Join our platform and grow your business with local customers.
                It's free to get started.
              </p>
              <Link
                to="/register"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Sign Up as Provider
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
