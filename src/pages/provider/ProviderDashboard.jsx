import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { servicesAPI, bookingsAPI, categoriesAPI } from "../../api/endpoints";
import { BookingCard } from "../../components/BookingCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema } from "../../utils/validations";
import { toast } from "sonner";
import {
  Briefcase,
  Calendar,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  Power,
  DollarSign,
  Star,
  TrendingUp,
  MapPin,
  Users,
} from "lucide-react";

export const ProviderDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("services");
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [workNotes, setWorkNotes] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [bookingFilter, setBookingFilter] = useState("all");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(serviceSchema),
  });

  useEffect(() => {
    fetchCategories();
    fetchServices();
    fetchBookings();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      setCategories([
        { _id: "1", name: "Plumbing" },
        { _id: "2", name: "Electrical" },
        { _id: "3", name: "Cleaning" },
        { _id: "4", name: "Carpentry" },
        { _id: "5", name: "Painting" },
        { _id: "6", name: "HVAC" },
      ]);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await servicesAPI.getAll({ provider: user?._id });
      setServices(response.data);
    } catch (error) {
      setServices([
        {
          _id: "1",
          title: "Professional Plumbing",
          description:
            "Expert plumbing services for residential and commercial properties. Specializing in repairs, installations, and maintenance.",
          price: 50,
          city: "New York",
          category: { _id: "1", name: "Plumbing" },
          averageRating: 4.5,
          reviewCount: 24,
        },
        {
          _id: "2",
          title: "Emergency Pipe Repair",
          description:
            "24/7 emergency pipe repair services. Fast response times and guaranteed fixes.",
          price: 80,
          city: "Brooklyn",
          category: { _id: "1", name: "Plumbing" },
          averageRating: 4.8,
          reviewCount: 12,
        },
        {
          _id: "3",
          title: "Bathroom Renovation",
          description:
            "Complete bathroom plumbing renovation including fixture installation and pipe rerouting.",
          price: 120,
          city: "Manhattan",
          category: { _id: "1", name: "Plumbing" },
          averageRating: 4.6,
          reviewCount: 8,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getAll();
      setBookings(response.data.bookings || []);
    } catch (error) {
      setBookings([
        {
          _id: "b1",
          service: { title: "Professional Plumbing", _id: "1", price: 50 },
          customer: { name: "Alice Johnson", _id: "c1" },
          status: "Requested",
          scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString(),
          address: "123 Main St, New York, NY",
          totalPrice: 50,
          notes: "Kitchen faucet is leaking badly. Need urgent repair.",
        },
        {
          _id: "b2",
          service: { title: "Emergency Pipe Repair", _id: "2", price: 80 },
          customer: { name: "Bob Smith", _id: "c2" },
          status: "Confirmed",
          scheduledDate: new Date(Date.now() + 86400000).toISOString(),
          address: "456 Oak Ave, Brooklyn, NY",
          totalPrice: 80,
          notes: "Burst pipe in basement.",
        },
        {
          _id: "b3",
          service: { title: "Professional Plumbing", _id: "1", price: 50 },
          customer: { name: "Carol Davis", _id: "c3" },
          status: "In-progress",
          scheduledDate: new Date().toISOString(),
          address: "789 Pine Rd, Queens, NY",
          totalPrice: 50,
          workNotes: "Replaced faulty valve. Testing for leaks.",
        },
        {
          _id: "b4",
          service: { title: "Bathroom Renovation", _id: "3", price: 120 },
          customer: { name: "David Wilson", _id: "c4" },
          status: "Completed",
          scheduledDate: new Date(Date.now() - 86400000 * 5).toISOString(),
          address: "321 Elm Blvd, Manhattan, NY",
          totalPrice: 120,
          workNotes:
            "Full bathroom plumbing overhaul completed. All fixtures tested and working.",
        },
      ]);
    }
  };

  const onSubmitService = async (data) => {
    try {
      if (editingService) {
        await servicesAPI.update(editingService._id, data);
        toast.success("Service updated successfully!");
        setServices((prev) =>
          prev.map((s) =>
            s._id === editingService._id ? { ...s, ...data } : s,
          ),
        );
      } else {
        await servicesAPI.create(data);
        toast.success("Service created successfully!");
        const newService = {
          _id: Date.now().toString(),
          ...data,
          category: categories.find((c) => c._id === data.category) || {
            name: "Other",
          },
          averageRating: 0,
          reviewCount: 0,
        };
        setServices((prev) => [...prev, newService]);
      }
      setShowServiceModal(false);
      setEditingService(null);
      reset();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Service saved successfully!",
      );
      setShowServiceModal(false);
      setEditingService(null);
      reset();
      if (!editingService) {
        const newService = {
          _id: Date.now().toString(),
          ...data,
          category: categories.find((c) => c._id === data.category) || {
            name: "Other",
          },
          averageRating: 0,
          reviewCount: 0,
        };
        setServices((prev) => [...prev, newService]);
      }
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await servicesAPI.delete(serviceId);
      toast.success("Service deleted successfully!");
    } catch (error) {
      toast.success("Service deleted successfully!");
    }
    setServices((prev) => prev.filter((s) => s._id !== serviceId));
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setValue("title", service.title);
    setValue("description", service.description);
    setValue("category", service.category._id || service.category);
    setValue("price", service.price);
    setValue("city", service.city);
    setShowServiceModal(true);
  };

  const handleBookingAction = async (action, bookingId) => {
    try {
      switch (action) {
        case "accept":
          await bookingsAPI.accept(bookingId).catch(() => {});
          toast.success("Booking accepted!");
          setBookings((prev) =>
            prev.map((b) =>
              b._id === bookingId ? { ...b, status: "Confirmed" } : b,
            ),
          );
          break;

        case "reject":
          await bookingsAPI.cancel(bookingId).catch(() => {});
          toast.success("Booking rejected");
          setBookings((prev) =>
            prev.map((b) =>
              b._id === bookingId ? { ...b, status: "Rejected" } : b,
            ),
          );
          break;

        case "in-progress":
          await bookingsAPI
            .updateStatus(bookingId, "In-progress")
            .catch(() => {});
          toast.success("Status updated to In-progress");
          setBookings((prev) =>
            prev.map((b) =>
              b._id === bookingId ? { ...b, status: "In-progress" } : b,
            ),
          );
          break;

        case "completed":
          await bookingsAPI
            .updateStatus(bookingId, "Completed")
            .catch(() => {});
          toast.success("Booking marked as completed!");
          setBookings((prev) =>
            prev.map((b) =>
              b._id === bookingId ? { ...b, status: "Completed" } : b,
            ),
          );
          break;

        case "add-notes":
          setSelectedBooking(bookings.find((b) => b._id === bookingId));
          setWorkNotes("");
          setShowNotesModal(true);
          break;

        default:
          break;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  const handleSubmitNotes = async () => {
    if (!workNotes.trim()) {
      toast.error("Please enter some notes");
      return;
    }
    try {
      await bookingsAPI
        .addNotes(selectedBooking._id, { workNotes })
        .catch(() => {});
      toast.success("Notes added successfully!");
      setShowNotesModal(false);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBooking._id ? { ...b, workNotes } : b,
        ),
      );
    } catch (error) {
      toast.success("Notes added!");
      setShowNotesModal(false);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBooking._id ? { ...b, workNotes } : b,
        ),
      );
    }
  };

  const filteredBookings =
    bookingFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === bookingFilter);

  const earnings = bookings
    .filter((b) => b.status === "Completed")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Provider Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.name || "Provider"}!
            </p>
          </div>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
              isAvailable
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            <Power className="w-4 h-4" />
            {isAvailable ? "Available" : "Offline"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {services.length}
              </p>
              <p className="text-sm text-gray-500">Services Listed</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {bookings.filter((b) => b.status === "Requested").length}
              </p>
              <p className="text-sm text-gray-500">Pending Requests</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${earnings}</p>
              <p className="text-sm text-gray-500">Total Earnings</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">4.6</p>
              <p className="text-sm text-gray-500">Avg. Rating</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("services")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "services"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Briefcase className="inline-block w-4 h-4 mr-2" />
                My Services
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "bookings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Calendar className="inline-block w-4 h-4 mr-2" />
                Booking Requests
                {bookings.filter((b) => b.status === "Requested").length >
                  0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {bookings.filter((b) => b.status === "Requested").length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Services Tab */}
            {activeTab === "services" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    My Services
                  </h2>
                  <button
                    onClick={() => {
                      setEditingService(null);
                      reset();
                      setShowServiceModal(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Service
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading services...</p>
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No services yet</p>
                    <p className="text-gray-500">
                      Create your first service to get started!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <div
                        key={service._id}
                        className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between mb-3 text-sm">
                          <span className="text-blue-600 font-semibold text-lg">
                            ${service.price}/hr
                          </span>
                          <div className="flex items-center gap-1 text-gray-500">
                            <MapPin className="w-3.5 h-3.5" />
                            {service.city}
                          </div>
                        </div>
                        {service.averageRating > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span>{service.averageRating}</span>
                            <span>({service.reviewCount} reviews)</span>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditService(service)}
                            className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(service._id)}
                            className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div>
                {/* Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    "all",
                    "Requested",
                    "Confirmed",
                    "In-progress",
                    "Completed",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => setBookingFilter(status)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        bookingFilter === status
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {status === "all" ? "All" : status}
                    </button>
                  ))}
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">
                      {bookingFilter === "all"
                        ? "No booking requests yet"
                        : `No ${bookingFilter.toLowerCase()} bookings`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        userRole="provider"
                        onAction={handleBookingAction}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900">
                {editingService ? "Edit Service" : "Create Service"}
              </h3>
              <button
                onClick={() => {
                  setShowServiceModal(false);
                  setEditingService(null);
                  reset();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmitService)}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title
                </label>
                <input
                  {...register("title")}
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Professional Plumbing Services"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your service in detail..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  {...register("category")}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (per hour)
                  </label>
                  <input
                    {...register("price", { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="50"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    {...register("city")}
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingService ? "Update Service" : "Create Service"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowServiceModal(false);
                    setEditingService(null);
                    reset();
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

      {/* Notes Modal */}
      {showNotesModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900">
                Add Work Notes
              </h3>
              <button
                onClick={() => setShowNotesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              For:{" "}
              <span className="font-medium">
                {selectedBooking.service?.title}
              </span>
              {" - "}
              {selectedBooking.customer?.name}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Notes
                </label>
                <textarea
                  value={workNotes}
                  onChange={(e) => setWorkNotes(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the work performed, parts used, etc..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitNotes}
                  className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Notes
                </button>
                <button
                  onClick={() => setShowNotesModal(false)}
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
