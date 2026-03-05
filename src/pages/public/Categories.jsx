import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { categoriesAPI } from "../../api/endpoints";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
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
  Landscaping:
    "https://images.unsplash.com/photo-1724556295135-ff92b9aa0a55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGluZyUyMGdhcmRlbiUyMG1haW50ZW5hbmNlfGVufDF8fHx8MTc3MjY0OTM2NHww&ixlib=rb-4.1.0&q=80&w=1080",
  Moving:
    "https://images.unsplash.com/photo-1581578949510-fa7315c4c350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwcmVwYWlyJTIwc2VydmljZXMlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcyNjQ5MzYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
};

const defaultCategoryImg =
  "https://images.unsplash.com/photo-1581578949510-fa7315c4c350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwcmVwYWlyJTIwc2VydmljZXMlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcyNjQ5MzYwfDA&ixlib=rb-4.1.0&q=80&w=1080";

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      // Ensure categories is always an array
      const data = Array.isArray(response.data) ? response.data : [];
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([
        {
          _id: "1",
          name: "Plumbing",
          description: "Professional plumbing services for all your needs",
        },
        {
          _id: "2",
          name: "Electrical",
          description: "Licensed electricians for installations and repairs",
        },
        {
          _id: "3",
          name: "Cleaning",
          description: "Home and office cleaning services",
        },
        {
          _id: "4",
          name: "Carpentry",
          description: "Custom woodwork and furniture repairs",
        },
        {
          _id: "5",
          name: "Painting",
          description: "Interior and exterior painting services",
        },
        {
          _id: "6",
          name: "HVAC",
          description: "Heating, ventilation, and air conditioning services",
        },
        {
          _id: "7",
          name: "Landscaping",
          description: "Garden and outdoor space maintenance",
        },
        {
          _id: "8",
          name: "Moving",
          description: "Professional moving and relocation services",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Service Categories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse all available service categories and find the right
            professional for your needs
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 text-lg">
              No categories found. Please try again later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/services?category=${category._id}`}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="h-36 overflow-hidden">
                  <ImageWithFallback
                    src={categoryImages[category.name] || defaultCategoryImg}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {category.description ||
                      "Find the best services in this category"}
                  </p>
                  <div className="flex items-center text-blue-600 text-sm group-hover:translate-x-1 transition-transform">
                    <span>View services</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
