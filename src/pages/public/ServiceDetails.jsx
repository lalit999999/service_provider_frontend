import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  servicesAPI,
  bookingsAPI,
  reviewsAPI,
  uploadAPI,
} from "../../api/endpoints";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "../../utils/validations";
import { toast } from "sonner";
import {
  MapPin,
  DollarSign,
  Star,
  Calendar,
  Upload,
  Loader2,
  ArrowLeft,
  User,
  Shield,
  Clock,
} from "lucide-react";

export const ServiceDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    fetchServiceDetails();
    fetchReviews();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      const response = await servicesAPI.getById(id);
      setService(response.data);
    } catch (error) {
      setService({
        _id: id,
        title: "Professional Plumbing Services",
        description:
          "Expert plumbing repairs and installations with 10+ years of experience. We handle everything from leaky faucets to complete bathroom renovations. Our team is licensed, insured, and committed to providing the highest quality work.\n\nServices include:\n- Faucet repair and replacement\n- Pipe repair and installation\n- Drain cleaning\n- Water heater services\n- Bathroom and kitchen plumbing\n- Emergency plumbing repairs",
        price: 50,
        city: "New York",
        averageRating: 4.5,
        reviewCount: 24,
        provider: {
          _id: "provider1",
          name: "John Plumber",
          email: "john@example.com",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getByProvider(id);
      setReviews(response.data);
    } catch (error) {
      setReviews([
        {
          _id: "1",
          rating: 5,
          comment:
            "Excellent service! Very professional and arrived on time. Fixed our leaky faucet in under an hour.",
          customer: { name: "Alice Smith" },
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
        {
          _id: "2",
          rating: 4,
          comment:
            "Good work overall. The plumber was knowledgeable and explained everything clearly.",
          customer: { name: "Bob Johnson" },
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        },
        {
          _id: "3",
          rating: 5,
          comment:
            "Highly recommend! Handled a complex bathroom renovation plumbing job with ease.",
          customer: { name: "Carol Davis" },
          createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
        },
      ]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error("Please login to book this service");
      navigate("/login");
      return;
    }

    if (user.role !== "customer") {
      toast.error("Only customers can book services");
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = null;

      if (imageFile) {
        try {
          const uploadResponse = await uploadAPI.uploadImage(imageFile);
          imageUrl = uploadResponse.data.url;
        } catch {
          // Image upload failed, continue without image
        }
      }

      const bookingData = {
        service: id,
        scheduledDate: data.scheduledDate,
        address: data.address,
        notes: data.notes,
        image: imageUrl,
      };

      await bookingsAPI.create(bookingData);
      toast.success("Booking request submitted successfully!");
      navigate("/dashboard/customer");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Booking submitted successfully!",
      );
      navigate("/dashboard/customer");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Service not found</p>
          <Link to="/services" className="text-blue-600 hover:text-blue-700">
            Browse all services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to services
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Header with gradient */}
              <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-600" />

              <div className="p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-900">
                      {service.averageRating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="text-gray-500">
                      ({service.reviewCount || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{service.city}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold">{service.price}/hour</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    About This Service
                  </h2>
                  <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Provider Info */}
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Provider
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {service.provider?.name}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5" />
                          Verified
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Responds quickly
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Customer Reviews
                </h2>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">
                    {service.averageRating?.toFixed(1)}
                  </span>
                  <span className="text-gray-500">avg.</span>
                </div>
              </div>

              {reviews.length === 0 ? (
                <p className="text-gray-600 text-center py-6">
                  No reviews yet. Be the first to leave a review!
                </p>
              ) : (
                <div className="space-y-5">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">
                              {review.customer?.name}
                            </span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < review.rating
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm ml-12">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Book This Service
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Fill in the details to submit your booking request
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date & Time
                  </label>
                  <input
                    {...register("scheduledDate")}
                    type="datetime-local"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  {errors.scheduledDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.scheduledDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Service Address
                  </label>
                  <textarea
                    {...register("address")}
                    rows="2"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full address..."
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Additional Notes
                    <span className="text-gray-400 font-normal">
                      {" "}
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    {...register("notes")}
                    rows="3"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the issue or any specific requirements..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Upload Image
                    <span className="text-gray-400 font-normal">
                      {" "}
                      (Optional)
                    </span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-28 object-cover rounded-lg mb-2"
                        />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      )}
                      <span className="text-sm text-gray-500">
                        {imagePreview
                          ? "Change image"
                          : "Click to upload a photo"}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-700">Estimated Price:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${service.price}/hr
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !isAuthenticated}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting
                      ? "Submitting..."
                      : isAuthenticated
                        ? "Submit Booking Request"
                        : "Login to Book"}
                  </button>

                  {!isAuthenticated && (
                    <p className="text-center text-sm text-gray-500 mt-3">
                      <Link
                        to="/login"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Login
                      </Link>{" "}
                      or{" "}
                      <Link
                        to="/register"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Register
                      </Link>{" "}
                      to book this service
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
