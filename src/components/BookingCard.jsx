import React from "react";
import {
  Calendar,
  MapPin,
  DollarSign,
  User,
  FileText,
  Wrench,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";

export const BookingCard = ({ booking, userRole, onAction }) => {
  const formatDate = (date) => {
    try {
      return format(new Date(date), "MMM dd, yyyy - hh:mm a");
    } catch {
      return date;
    }
  };

  const canCancel = booking.status === "Requested";
  const canReschedule = ["Requested", "Accepted"].includes(booking.status);
  const canAccept = userRole === "provider" && booking.status === "Requested";
  const canReject = userRole === "provider" && booking.status === "Requested";
  const canMarkInProgress =
    userRole === "provider" && booking.status === "Accepted";
  const canMarkCompleted =
    userRole === "provider" && booking.status === "In-progress";
  const canReview =
    userRole === "customer" &&
    booking.status === "Completed" &&
    !booking.hasReview;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {booking.service?.title || "Service"}
            </h3>
            <StatusBadge status={booking.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {userRole === "provider" && booking.customer && (
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4 text-gray-400" />
                <span>{booking.customer.name}</span>
              </div>
            )}

            {userRole === "customer" && booking.provider && (
              <div className="flex items-center gap-2 text-gray-600">
                <Wrench className="w-4 h-4 text-gray-400" />
                <span>{booking.provider.name}</span>
              </div>
            )}

            {booking.scheduledDate && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{formatDate(booking.scheduledDate)}</span>
              </div>
            )}

            {booking.address && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="line-clamp-1">{booking.address}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-blue-600 font-semibold text-lg bg-blue-50 px-3 py-1.5 rounded-lg flex-shrink-0">
          <DollarSign className="w-5 h-5" />
          <span>{booking.totalPrice || booking.service?.price}</span>
        </div>
      </div>

      {booking.notes && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg flex items-start gap-2">
          <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Notes:</span>{" "}
            {booking.notes}
          </p>
        </div>
      )}

      {booking.workNotes && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
          <Wrench className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700">
            <span className="font-medium text-blue-700">Work Notes:</span>{" "}
            {booking.workNotes}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
        {/* Customer Actions */}
        {userRole === "customer" && (
          <>
            {canCancel && (
              <button
                onClick={() => onAction?.("cancel", booking._id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
              >
                Cancel Booking
              </button>
            )}
            {canReschedule && (
              <button
                onClick={() => onAction?.("reschedule", booking._id)}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                Reschedule
              </button>
            )}
            {canReview && (
              <button
                onClick={() => onAction?.("review", booking._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Write Review
              </button>
            )}
          </>
        )}

        {/* Provider Actions */}
        {userRole === "provider" && (
          <>
            {canAccept && (
              <button
                onClick={() => onAction?.("accept", booking._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Accept
              </button>
            )}
            {canReject && (
              <button
                onClick={() => onAction?.("reject", booking._id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
              >
                Reject
              </button>
            )}
            {canMarkInProgress && (
              <button
                onClick={() => onAction?.("in-progress", booking._id)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Start Work
              </button>
            )}
            {canMarkCompleted && (
              <button
                onClick={() => onAction?.("completed", booking._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Mark Complete
              </button>
            )}
            {["Accepted", "In-progress"].includes(booking.status) && (
              <button
                onClick={() => onAction?.("add-notes", booking._id)}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                Add Notes
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
