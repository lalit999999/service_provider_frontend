import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../utils/validations";
import { authAPI } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { UserPlus, Mail, Lock, User, Wrench, ShoppingBag } from "lucide-react";

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authAPI.register(data);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
            <UserPlus className="w-7 h-7 text-blue-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-xl sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                {...register("city")}
                type="text"
                id="city"
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your city"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="area"
                className="block text-sm font-medium text-gray-700"
              >
                Area
              </label>
              <input
                {...register("area")}
                type="text"
                id="area"
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your area"
              />
              {errors.area && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.area.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("password")}
                  type="password"
                  id="password"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Minimum 6 characters"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedRole === "customer"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    {...register("role")}
                    type="radio"
                    value="customer"
                    className="sr-only"
                  />
                  <ShoppingBag
                    className={`w-8 h-8 mb-2 ${
                      selectedRole === "customer"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-medium text-sm ${
                      selectedRole === "customer"
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    Book Services
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5">
                    I need help
                  </span>
                </label>

                <label
                  className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedRole === "provider"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    {...register("role")}
                    type="radio"
                    value="provider"
                    className="sr-only"
                  />
                  <Wrench
                    className={`w-8 h-8 mb-2 ${
                      selectedRole === "provider"
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-medium text-sm ${
                      selectedRole === "provider"
                        ? "text-green-700"
                        : "text-gray-700"
                    }`}
                  >
                    Offer Services
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5">
                    I'm a pro
                  </span>
                </label>
              </div>
              {errors.role && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>
          </form>

          <p className="mt-4 text-xs text-gray-500 text-center">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
