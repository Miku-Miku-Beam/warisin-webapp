import React from "react";

interface StatusChipProps {
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | string;
  className?: string;
}

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  APPROVED: "bg-green-100 text-green-800 border-green-300",
  REJECTED: "bg-red-100 text-red-800 border-red-300",
  COMPLETED: "bg-blue-100 text-blue-800 border-blue-300",
};

const StatusChip: React.FC<StatusChipProps> = ({ status, className = "" }) => {
  const color = statusColor[status] || "bg-gray-100 text-gray-800 border-gray-300";
  return (
    <span
      className={`inline-block px-3 py-1 rounded border font-semibold text-xs ${color} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusChip;
