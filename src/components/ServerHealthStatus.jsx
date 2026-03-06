import React from "react";
import { useServerHealth } from "../../hooks/useServerHealth";
import { Server, AlertCircle, CheckCircle } from "lucide-react";

/**
 * Server Health Status Component
 * Displays the current server health status
 * Updates every minute automatically
 */
export const ServerHealthStatus = ({ showDetails = false }) => {
  const health = useServerHealth();

  if (health.isHealthy === null) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-500">
        <Server className="w-4 h-4 animate-spin" />
        <span>Checking...</span>
      </div>
    );
  }

  if (health.isHealthy) {
    return (
      <div
        className="flex items-center gap-2 px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded transition-colors"
        title={`Server healthy - Last checked: ${new Date(health.lastChecked).toLocaleTimeString()}`}
      >
        <CheckCircle className="w-4 h-4" />
        <span>
          {showDetails
            ? `Server OK (${Math.round(health.uptime)}s uptime)`
            : "Server OK"}
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
      title={`Server error: ${health.error}`}
    >
      <AlertCircle className="w-4 h-4" />
      <span>
        {showDetails ? `Server Error: ${health.error}` : "Server Error"}
      </span>
    </div>
  );
};

export default ServerHealthStatus;
