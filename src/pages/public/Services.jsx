import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { servicesAPI, categoriesAPI } from "../../api/endpoints";
import { ServiceCard } from "../../components/ServiceCard";
import { Loader2, Filter, X, SlidersHorizontal } from "lucide-react";

export const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    city: searchParams.get("city") || "",
    sortBy: searchParams.get("sort") || "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      // Ensure categories is always an array
      const data = Array.isArray(response.data) ? response.data : [];
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([
        { _id: "1", name: "Plumbing" },
        { _id: "2", name: "Electrical" },
        { _id: "3", name: "Cleaning" },
        { _id: "4", name: "Carpentry" },
        { _id: "5", name: "Painting" },
        { _id: "6", name: "HVAC" },
        { _id: "7", name: "Landscaping" },
        { _id: "8", name: "Moving" },
      ]);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.city) params.city = filters.city;

      const response = await servicesAPI.getAll(params);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.services || [];
      
      // Transform API response to match frontend expectations
      const transformedData = data.map(service => ({
        ...service,
        price: service.basePrice || service.price,
        city: service.provider?.city || service.city || 'Location not specified'
      }));
      
      setServices(transformedData);
    } catch (error) {
      console.error("Error fetching services:", error);
      // Optional mock data fallback
      let mockServices = [
        {
          _id: "1",
          title: "Professional Plumbing Services",
          description:
            "Expert plumbing repairs and installations. Licensed and insured with 10+ years of experience.",
          price: 50,
          city: "New York",
          averageRating: 4.5,
          reviewCount: 24,
          provider: { name: "John Plumber", _id: "p1" },
          category: { _id: "1", name: "Plumbing" },
        },
        // ...other mock services...
      ];
      if (filters.city) {
        mockServices = mockServices.filter((s) =>
          s.city.toLowerCase().includes(filters.city.toLowerCase()),
        );
      }
      if (filters.category) {
        mockServices = mockServices.filter(
          (s) => s.category?._id === filters.category,
        );
      }
      // Apply sorting
      if (filters.sortBy === "price-low") {
        mockServices.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === "price-high") {
        mockServices.sort((a, b) => b.price - a.price);
      } else if (filters.sortBy === "rating") {
        mockServices.sort((a, b) => b.averageRating - a.averageRating);
      }
      setServices(mockServices);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.city) params.set("city", newFilters.city);
    if (newFilters.sortBy) params.set("sort", newFilters.sortBy);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ category: "", city: "", sortBy: "" });
    setSearchParams({});
  };

  const activeFilterCount = [
    filters.category,
    filters.city,
    filters.sortBy,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Available Services
            </h1>
            <p className="text-gray-600 mt-1">
              {loading
                ? "Loading..."
                : `${services.length} service${services.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`${showFilters ? "block" : "hidden"} md:block md:w-72 flex-shrink-0`}
          >
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="md:hidden text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                    placeholder="Enter city..."
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-16">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-md">
                <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">No services found</p>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
