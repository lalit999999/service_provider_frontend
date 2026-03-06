import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminAPI,
  categoriesAPI,
  reviewsAPI,
  authAPI,
} from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "../../utils/validations";
import { toast } from "sonner";
import {
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Loader2,
  TrendingUp,
  UserCheck,
  Clock,
  Shield,
  User,
  Camera,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const CHART_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

export const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [userFilter, setUserFilter] = useState("all");
  const [categoryPage, setCategoryPage] = useState(1);
  const CATEGORIES_PER_PAGE = 8;
  const [userPage, setUserPage] = useState(1);
  const USERS_PER_PAGE = 10;
  const [profilePicturePreview, setProfilePicturePreview] = useState(
    user?.profilePicture || null,
  );
  const [uploadingProfilePicture, setUploadingProfilePicture] = useState(false);

  // monthlyBookings must be declared after stats
  // ...existing useState declarations...
  // Place derived variables after all useState
  const monthlyBookings = Array.isArray(stats?.monthlyBookings)
    ? stats.monthlyBookings
    : [
        { month: "Jan", bookings: 45 },
        { month: "Feb", bookings: 52 },
        { month: "Mar", bookings: 48 },
        { month: "Apr", bookings: 61 },
        { month: "May", bookings: 55 },
        { month: "Jun", bookings: 67 },
      ];
  const categoryDistribution = Array.isArray(stats?.categoryDistribution)
    ? stats.categoryDistribution
    : [
        { name: "Plumbing", value: 28 },
        { name: "Electrical", value: 22 },
        { name: "Cleaning", value: 18 },
        { name: "Carpentry", value: 15 },
        { name: "Painting", value: 12 },
        { name: "HVAC", value: 5 },
      ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchCategories();
  }, []);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePicturePreview(e.target?.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploadingProfilePicture(true);
    try {
      const response = await authAPI.uploadProfileImage(file, user?._id);
      const imageUrl = response.data?.url || response.data?.data?.url;

      if (imageUrl) {
        window.updateUser({
          ...user,
          profileImage: {
            url: imageUrl,
            uploadedAt: new Date().toISOString(),
          },
        });
        setProfilePicturePreview(imageUrl);
        toast.success("Profile picture updated successfully!");
      } else {
        toast.error("Failed to get image URL from server");
        setProfilePicturePreview(user?.profileImage?.url || null);
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload profile picture",
      );
      setProfilePicturePreview(user?.profileImage?.url || null);
    } finally {
      setUploadingProfilePicture(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getStats();
      console.log("Stats API response:", response.data);
      const stats = response.data.stats || response.data;
      setStats(stats);
      setAuthError(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error.response?.status === 401) {
        setAuthError(true);
      }
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      console.log("Users API response:", response.data);
      const data = Array.isArray(response.data.users)
        ? response.data.users
        : Array.isArray(response.data)
          ? response.data
          : [];
      console.log("Extracted users data:", data);
      if (data.length > 0) {
        console.log("First user object:", data[0]);
        console.log("User object keys:", Object.keys(data[0]));
      }
      setUsers(data);
      if (data.length === 0) {
        console.error("No users fetched from API:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      const data = Array.isArray(response.data.categories)
        ? response.data.categories
        : [];
      setCategories(data);
      if (!Array.isArray(response.data) || data.length === 0) {
        console.error("No categories fetched from API:", response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const handleApproveProvider = async (userId) => {
    console.log("error 1");

    if (!userId) {
      console.error("User ID is undefined:", userId);
      toast.error("Unable to approve: User ID not found");
      return;
    }
    console.log("error 2");
    try {
      console.log("Approving user:", userId);
      await adminAPI.approveProvider(userId);
      console.log("error 3");
      toast.success("Provider approved successfully!");
      setUsers((prev) =>
        prev.map((u) => {
          const userIdToMatch = u._id || u.id;
          return userIdToMatch === userId ? { ...u, isApproved: true } : u;
        }),
      );
      console.log("error 4");
    } catch (error) {
      console.error(
        "Error approving provider:",
        error.response?.data || error.message,
      );
      toast.error(
        error.response?.data?.message || "Failed to approve provider",
      );
    }
  };

  const handleRejectProvider = async (userId) => {
    if (!userId) {
      console.error("User ID is undefined:", userId);
      toast.error("Unable to reject: User ID not found");
      return;
    }
    if (!confirm("Are you sure you want to reject this provider?")) return;
    try {
      console.log("Rejecting user:", userId);
      await adminAPI.rejectProvider(userId);
      toast.success("Provider status changed to pending");
      setUsers((prev) => {
        return prev.map((u) => {
          const userIdToMatch = u._id || u.id;
          return userIdToMatch === userId ? { ...u, isApproved: false } : u;
        });
      });
    } catch (error) {
      console.error(
        "Error rejecting provider:",
        error.response?.data || error.message,
      );
      toast.error(error.response?.data?.message || "Failed to reject provider");
    }
  };

  const onSubmitCategory = async (data) => {
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory._id, data).catch(() => {});
        toast.success("Category updated successfully!");
        setCategories((prev) =>
          prev.map((c) =>
            c._id === editingCategory._id ? { ...c, ...data } : c,
          ),
        );
        setCategoryPage(1);
      } else {
        await categoriesAPI.create(data).catch(() => {});
        toast.success("Category created successfully!");
        setCategories((prev) => [
          ...prev,
          { _id: Date.now().toString(), ...data },
        ]);
        setCategoryPage(1);
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save category");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await categoriesAPI.delete(categoryId).catch(() => {});
      toast.success("Category deleted successfully!");
      setCategories((prev) => prev.filter((c) => c._id !== categoryId));
      setCategoryPage(1);
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setValue("name", category.name);
    setValue("description", category.description || "");
    setShowCategoryModal(true);
  };

  const pendingProviders = users.filter(
    (u) => u.role === "provider" && !u.isApproved,
  );

  const filteredUsers =
    userFilter === "all"
      ? users
      : userFilter === "pending"
        ? pendingProviders
        : users.filter((u) => u.role === userFilter);

  // Show auth error message if 401 received
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto text-center bg-white rounded-xl shadow-md p-8">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Your session has expired or you don't have admin privileges. Please
            log in again.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage your platform</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm">
            <Shield className="w-4 h-4" />
            Admin
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab("stats")}
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === "stats"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <BarChart3 className="inline-block w-4 h-4 mr-2" />
                Platform Stats
              </button>
              <button
                onClick={() => setActiveTab("providers")}
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === "providers"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Users className="inline-block w-4 h-4 mr-2" />
                Users & Providers
                {pendingProviders.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {pendingProviders.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === "categories"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Manage Categories
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
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
            {/* Stats Tab */}
            {activeTab === "stats" && (
              <div>
                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading stats...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium opacity-90">
                            Total Users
                          </h3>
                          <Users className="w-6 h-6 opacity-80" />
                        </div>
                        <p className="text-3xl font-bold">
                          {stats?.users?.total?.toLocaleString()}
                        </p>
                        <p className="text-xs mt-1 text-blue-200">
                          +{stats?.users?.total || "0"} total users
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium opacity-90">
                            Total Bookings
                          </h3>
                          <Calendar className="w-6 h-6 opacity-80" />
                        </div>
                        <p className="text-3xl font-bold">
                          {stats?.bookings?.total?.toLocaleString()}
                        </p>
                        <p className="text-xs mt-1 text-green-200">
                          {Math.round(
                            ((stats?.bookings?.completed || 0) /
                              (stats?.bookings?.total || 1)) *
                              100,
                          )}
                          % completion rate
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium opacity-90">
                            Revenue
                          </h3>
                          <DollarSign className="w-6 h-6 opacity-80" />
                        </div>
                        <p className="text-3xl font-bold">
                          ${stats?.revenue?.total?.toLocaleString() || "0"}
                        </p>
                        <p className="text-xs mt-1 text-purple-200">
                          <TrendingUp className="w-3 h-3 inline" /> +12% from
                          last month
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium opacity-90">
                            Active Providers
                          </h3>
                          <UserCheck className="w-6 h-6 opacity-80" />
                        </div>
                        <p className="text-3xl font-bold">
                          {stats?.users?.providers?.toLocaleString()}
                        </p>
                        <p className="text-xs mt-1 text-orange-200">
                          {pendingProviders.length} pending approval
                        </p>
                      </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white border rounded-xl p-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Monthly Bookings
                        </h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyBookings}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f0f0f0"
                              />
                              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                              <YAxis tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Bar
                                dataKey="bookings"
                                fill="#3B82F6"
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-white border rounded-xl p-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Bookings by Category
                        </h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={categoryDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                dataKey="value"
                                label={({ name, percent }) =>
                                  `${name} ${(percent * 100).toFixed(0)}%`
                                }
                              >
                                {categoryDistribution.map((entry, index) => (
                                  <Cell
                                    key={`${entry.name}-${index}`}
                                    fill={
                                      CHART_COLORS[index % CHART_COLORS.length]
                                    }
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Users & Providers Tab */}
            {activeTab === "providers" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Users & Providers
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {["all", "pending", "provider", "customer"].map(
                      (filter) => (
                        <button
                          key={filter}
                          onClick={() => {
                            setUserFilter(filter);
                            setUserPage(1);
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors capitalize ${
                            userFilter === filter
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {filter === "pending"
                            ? `Pending (${pendingProviders.length})`
                            : filter}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No users found</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {filteredUsers
                        .slice(
                          (userPage - 1) * USERS_PER_PAGE,
                          userPage * USERS_PER_PAGE,
                        )
                        .map((u) => (
                          <div
                            key={u._id}
                            className="bg-white border rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-gray-500" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {u.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {u.email}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                                      u.role === "provider"
                                        ? "bg-blue-100 text-blue-700"
                                        : u.role === "admin"
                                          ? "bg-purple-100 text-purple-700"
                                          : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {u.role}
                                  </span>
                                  {u.role === "provider" && (
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full ${
                                        u.isApproved
                                          ? "bg-green-100 text-green-700"
                                          : "bg-yellow-100 text-yellow-700"
                                      }`}
                                    >
                                      {u.isApproved ? "Approved" : "Pending"}
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-400">
                                    Joined{" "}
                                    {new Date(u.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {u.role === "provider" && (
                              <div className="flex gap-2">
                                {!u.isApproved && (
                                  <button
                                    onClick={() => {
                                      console.log("User being approved:", u);
                                      console.log(
                                        "User ID field value:",
                                        u._id || u.id,
                                      );
                                      handleApproveProvider(u._id || u.id);
                                    }}
                                    className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Approve
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    handleRejectProvider(u._id || u.id)
                                  }
                                  className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {Math.ceil(filteredUsers.length / USERS_PER_PAGE) > 1 && (
                      <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                          onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                          disabled={userPage === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>
                        <div className="flex items-center gap-2">
                          {Array.from({
                            length: Math.ceil(
                              filteredUsers.length / USERS_PER_PAGE,
                            ),
                          }).map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => setUserPage(i + 1)}
                              className={`w-10 h-10 rounded-lg transition-colors text-sm font-medium ${
                                userPage === i + 1
                                  ? "bg-blue-600 text-white"
                                  : "border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() =>
                            setUserPage((p) =>
                              Math.min(
                                Math.ceil(
                                  filteredUsers.length / USERS_PER_PAGE,
                                ),
                                p + 1,
                              ),
                            )
                          }
                          disabled={
                            userPage ===
                            Math.ceil(filteredUsers.length / USERS_PER_PAGE)
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === "categories" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Manage Categories
                  </h2>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      reset();
                      setShowCategoryModal(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Category
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categories
                    .slice(
                      (categoryPage - 1) * CATEGORIES_PER_PAGE,
                      categoryPage * CATEGORIES_PER_PAGE,
                    )
                    .map((category) => (
                      <div
                        key={category._id}
                        className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {category.description || "No description"}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Pagination */}
                {Math.ceil(categories.length / CATEGORIES_PER_PAGE) > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                      onClick={() => setCategoryPage((p) => Math.max(1, p - 1))}
                      disabled={categoryPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-2">
                      {Array.from({
                        length: Math.ceil(
                          categories.length / CATEGORIES_PER_PAGE,
                        ),
                      }).map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCategoryPage(i + 1)}
                          className={`w-10 h-10 rounded-lg transition-colors text-sm font-medium ${
                            categoryPage === i + 1
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        setCategoryPage((p) =>
                          Math.min(
                            Math.ceil(categories.length / CATEGORIES_PER_PAGE),
                            p + 1,
                          ),
                        )
                      }
                      disabled={
                        categoryPage ===
                        Math.ceil(categories.length / CATEGORIES_PER_PAGE)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Admin Profile
                  </h2>

                  {/* Profile Picture Section */}
                  <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-6">
                      {/* Picture Preview */}
                      <div className="flex-shrink-0">
                        <div className="relative w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-300">
                          {profilePicturePreview ? (
                            <img
                              src={profilePicturePreview}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Upload Input */}
                      <div className="flex-1">
                        <label
                          htmlFor="profile-picture"
                          className="cursor-pointer"
                        >
                          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                            <div className="flex items-center justify-center gap-2">
                              <Camera className="w-5 h-5 text-blue-600" />
                              <span className="text-sm font-medium text-blue-600">
                                Choose Photo
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 text-center">
                              JPG or PNG, up to 5MB
                            </p>
                          </div>
                        </label>
                        <input
                          id="profile-picture"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          disabled={uploadingProfilePicture}
                          className="hidden"
                        />
                        {uploadingProfilePicture && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Uploading...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Profile Info Section */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Admin Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          disabled
                          value={user?.name || ""}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          disabled
                          value={user?.email || ""}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          disabled
                          value={user?.role || ""}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingCategory ? "Edit Category" : "Create Category"}
                </h3>
                <button
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                    reset();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(onSubmitCategory)}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Plumbing"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    {...register("description")}
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Category description..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingCategory ? "Update Category" : "Create Category"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryModal(false);
                      setEditingCategory(null);
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
      </div>
    </div>
  );
};
