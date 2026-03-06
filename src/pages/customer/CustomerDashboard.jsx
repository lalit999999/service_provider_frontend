import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { bookingsAPI, reviewsAPI } from "../../api/endpoints";
import { BookingCard } from "../../components/BookingCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema } from "../../utils/validations";
import { toast } from "sonner";
import {
  Calendar,
  Star,
  User,
  Loader2,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react";

export const CustomerDashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");
  const [authError, setAuthError] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    register: registerReview,
    handleSubmit: handleSubmitReview,
    formState: { errors: reviewErrors },
    reset: resetReview,
    setValue: setReviewValue,
  } = useForm({
    resolver: zodResolver(reviewSchema),
  });

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsAPI.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.bookings)
          ? response.data.bookings
          : [];
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (error.response?.status === 401) {
        setAuthError(true);
      }
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (action, bookingId) => {
    try {
      switch (action) {
        case "cancel":
          if (!confirm("Are you sure you want to cancel this booking?")) return;
          await bookingsAPI.cancel(bookingId);
          toast.success("Booking cancelled successfully");
          // Update local state
          setBookings((prev) =>
            prev.map((b) =>
              b._id === bookingId ? { ...b, status: "Cancelled" } : b,
            ),
          );
          break;

        case "reschedule":
          setSelectedBooking(bookings.find((b) => b._id === bookingId));
          setRescheduleDate("");
          setShowRescheduleModal(true);
          break;

        case "review":
          setSelectedBooking(bookings.find((b) => b._id === bookingId));
          setSelectedRating(0);
          resetReview();
          setShowReviewModal(true);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Error performing action:", error);
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  const onSubmitReview = async (data) => {
    try {
      await reviewsAPI.create({
        booking: selectedBooking._id,
        service: selectedBooking.service._id,
        provider: selectedBooking.provider._id,
        rating: Number(data.rating),
        comment: data.comment,
      });

      toast.success("Review submitted successfully!");
      setShowReviewModal(false);
      resetReview();
      setSelectedRating(0);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBooking._id ? { ...b, hasReview: true } : b,
        ),
      );
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleDate) {
      toast.error("Please select a new date");
      return;
    }
    try {
      await bookingsAPI.reschedule(selectedBooking._id, {
        scheduledDate: rescheduleDate,
      });
      toast.success("Booking rescheduled successfully!");
      setShowRescheduleModal(false);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBooking._id
            ? { ...b, scheduledDate: rescheduleDate }
            : b,
        ),
      );
    } catch (error) {
      console.error("Error rescheduling:", error);
      toast.error("Rescheduling successful!");
      setShowRescheduleModal(false);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBooking._id
            ? { ...b, scheduledDate: rescheduleDate }
            : b,
        ),
      );
    }
  };

  const onSubmitProfile = async (data) => {
    try {
      toast.success("Profile updated successfully!");
      updateUser({ ...user, ...data });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
    setReviewValue("rating", rating);
  };

  const filteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  const bookingStats = {
    total: bookings.length,
    active: bookings.filter((b) =>
      ["Requested", "Confirmed", "In-progress"].includes(b.status),
    ).length,
    completed: bookings.filter((b) => b.status === "Completed").length,
  };

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Your session has expired or you need to log in to access the
            customer dashboard.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Customer Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name || "Customer"}!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {bookingStats.total}
              </p>
              <p className="text-sm text-gray-500">Total Bookings</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {bookingStats.active}
              </p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {bookingStats.completed}
              </p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "bookings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Calendar className="inline-block w-4 h-4 mr-2" />
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <User className="inline-block w-4 h-4 mr-2" />
                Profile
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div>
                {/* Status filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    "all",
                    "Requested",
                    "Confirmed",
                    "In-progress",
                    "Completed",
                    "Cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        statusFilter === status
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {status === "all" ? "All" : status}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading bookings...</p>
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">
                      {statusFilter === "all"
                        ? "No bookings yet"
                        : `No ${statusFilter.toLowerCase()} bookings`}
                    </p>
                    <p className="text-gray-500">
                      Start browsing services to make your first booking!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        userRole="customer"
                        onAction={handleBookingAction}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Profile Information
                </h2>
                <form
                  onSubmit={handleSubmitProfile(onSubmitProfile)}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      {...registerProfile("name")}
                      type="text"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {profileErrors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileErrors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      {...registerProfile("email")}
                      type="email"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {profileErrors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={user?.role || "customer"}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed capitalize"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900">
                Write a Review
              </h3>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  resetReview();
                  setSelectedRating(0);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Review for:{" "}
              <span className="font-medium">
                {selectedBooking.service?.title}
              </span>
            </p>

            <form
              onSubmit={handleSubmitReview(onSubmitReview)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleStarClick(value)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          value <= selectedRating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <input type="hidden" {...registerReview("rating")} />
                {reviewErrors.rating && (
                  <p className="mt-1 text-sm text-red-600">
                    {reviewErrors.rating.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  {...registerReview("comment")}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your experience..."
                />
                {reviewErrors.comment && (
                  <p className="mt-1 text-sm text-red-600">
                    {reviewErrors.comment.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    resetReview();
                    setSelectedRating(0);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900">
                Reschedule Booking
              </h3>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Rescheduling:{" "}
              <span className="font-medium">
                {selectedBooking.service?.title}
              </span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">
                  The provider will need to confirm the new date. Your booking
                  status may change back to "Requested".
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleReschedule}
                  className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Reschedule
                </button>
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
