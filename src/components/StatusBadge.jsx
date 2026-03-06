import React from "react";

const statusConfig = {
  Requested: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-300",
  },
  Accepted: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-300",
  },
  "In-progress": {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-300",
  },
  Completed: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
  },
  Cancelled: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-300",
  },
  Rejected: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-300",
  },
};

export const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.Requested;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${config.bg} ${config.text} ${config.border}`}
    >
      {status}
    </span>
  );
};
