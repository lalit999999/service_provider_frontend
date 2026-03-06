import React, { useState, useEffect } from "react";
import { useServerHealth } from "../../hooks/useServerHealth";
import { healthAPI } from "../../api/endpoints";
import {
  Server,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export const ServerHealth = () => {
  const health = useServerHealth();
  const [healthHistory, setHealthHistory] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update history when health changes
  useEffect(() => {
    if (health.lastChecked) {
      setHealthHistory((prev) => [
        {
          timestamp: health.lastChecked,
          isHealthy: health.isHealthy,
          status: health.status,
          uptime: health.uptime,
        },
        ...prev.slice(0, 9), // Keep last 10 checks
      ]);
    }
  }, [health.lastChecked]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await healthAPI.check();
      toast.success("Health check completed!");
      console.log("Manual health check:", response.data);
    } catch (error) {
      toast.error("Health check failed: " + error.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusColor = (isHealthy) => {
    return isHealthy
      ? "bg-green-50 border-green-200"
      : "bg-red-50 border-red-200";
  };

  const getStatusBadgeColor = (isHealthy) => {
    return isHealthy
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Server className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Server Health Monitor
            </h1>
          </div>
          <p className="text-gray-600">
            Real-time monitoring of your backend server status
          </p>
        </div>

        {/* Current Status Card */}
        <div
          className={`bg-white rounded-xl border-2 p-6 mb-6 ${getStatusColor(
            health.isHealthy,
          )}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {health.isHealthy ? (
                <CheckCircle className="w-12 h-12 text-green-600" />
              ) : (
                <AlertCircle className="w-12 h-12 text-red-600" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {health.isHealthy ? "Server Online" : "Server Offline"}
                </h2>
                <p className="text-gray-600 mt-1">
                  Status: {health.status || "Checking..."}
                </p>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full font-semibold ${getStatusBadgeColor(
                health.isHealthy,
              )}`}
            >
              {health.isHealthy ? "Healthy" : "Error"}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Uptime */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Server Uptime</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {health.uptime ? `${Math.round(health.uptime)}s` : "--"}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {health.uptime
                ? `${(health.uptime / 3600).toFixed(2)} hours`
                : "Calculating..."}
            </p>
          </div>

          {/* Last Checked */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Last Checked</h3>
            </div>
            <p className="text-lg font-mono text-gray-700">
              {health.lastChecked
                ? new Date(health.lastChecked).toLocaleTimeString()
                : "--"}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {health.lastChecked
                ? new Date(health.lastChecked).toLocaleDateString()
                : "Never checked"}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {health.error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                <p className="text-red-700 text-sm">{health.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Manual Refresh Button */}
        <div className="mb-6">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Checking..." : "Check Now"}
          </button>
        </div>

        {/* Health Check History */}
        {healthHistory.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent History ({healthHistory.length} checks)
            </h3>
            <div className="space-y-3">
              {healthHistory.map((check, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(
                    check.isHealthy,
                  )}`}
                >
                  <div className="flex items-center gap-3">
                    {check.isHealthy ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {check.status || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(check.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  {check.uptime && (
                    <p className="text-sm font-mono text-gray-600">
                      {Math.round(check.uptime)}s
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">How it Works</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>
              ✓ Server health is automatically checked every{" "}
              <strong>60 seconds</strong>
            </li>
            <li>✓ Status badge updates in real-time on the navbar</li>
            <li>
              ✓ History shows the last <strong>10 health checks</strong>
            </li>
            <li>✓ Click "Check Now" for an immediate manual health check</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServerHealth;
