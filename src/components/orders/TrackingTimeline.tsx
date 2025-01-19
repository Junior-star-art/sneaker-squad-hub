import { format } from "date-fns";
import { TrackingUpdate } from "@/types/database";
import { TrackingStatus } from "./TrackingStatus";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TrackingTimelineProps {
  updates: TrackingUpdate[];
}

export const TrackingTimeline = ({ updates }: TrackingTimelineProps) => {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {updates.map((update) => (
          <TrackingStatus
            key={update.id}
            status={update.status}
            description={update.description}
            location={update.location}
            timestamp={format(new Date(update.created_at), "MMM d, yyyy h:mm a")}
          />
        ))}
      </div>
    </ScrollArea>
  );
};