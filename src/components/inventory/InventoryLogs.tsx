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
import { Badge } from "@/components/ui/badge";

interface InventoryLog {
  id: string;
  product_id: string;
  quantity_change: number;
  type: string;
  notes: string | null;
  created_at: string;
  products: {
    name: string;
  };
}

export function InventoryLogs() {
  const { data: logs } = useQuery({
    queryKey: ["inventory-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_logs")
        .select(`
          *,
          products (
            name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as InventoryLog[];
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Inventory Logs</h2>
      
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
              <TableCell>{log.products.name}</TableCell>
              <TableCell>
                <span className={log.quantity_change > 0 ? "text-green-600" : "text-red-600"}>
                  {log.quantity_change > 0 ? "+" : ""}{log.quantity_change}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={log.type === "restock" ? "default" : "secondary"}>
                  {log.type}
                </Badge>
              </TableCell>
              <TableCell>{log.notes || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}