import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface InventoryLog {
  id: string;
  product_id: string;
  quantity_change: number;
  type: string;
  notes: string | null;
  created_at: string;
  product: {
    name: string;
  };
}

export const InventoryLogs = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["inventory-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_logs")
        .select(`
          *,
          product:products (
            name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as InventoryLog[];
    },
  });

  if (isLoading) {
    return <div>Loading inventory logs...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recent Inventory Changes</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Change</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs?.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
              </TableCell>
              <TableCell>{log.product?.name}</TableCell>
              <TableCell className={log.quantity_change > 0 ? "text-green-600" : "text-red-600"}>
                {log.quantity_change > 0 ? "+" : ""}{log.quantity_change}
              </TableCell>
              <TableCell className="capitalize">{log.type}</TableCell>
              <TableCell>{log.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};