import { AlertCircle, CheckCircle, Package, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TrackingUpdate } from "@/types/database";

interface TrackingStatusProps {
  status: TrackingUpdate['status'];
  description?: string;
  location?: string;
  timestamp: string;
}

const statusIcons = {
  pending: AlertCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export const TrackingStatus = ({ status, description, location, timestamp }: TrackingStatusProps) => {
  const Icon = statusIcons[status];

  return (
    <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
      <div className={`p-2 rounded-full ${statusColors[status]} bg-opacity-20`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="capitalize">
            {status}
          </Badge>
          <span className="text-sm text-gray-500">{timestamp}</span>
        </div>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
        {location && (
          <p className="mt-1 text-sm text-gray-500">{location}</p>
        )}
      </div>
    </div>
  );
};