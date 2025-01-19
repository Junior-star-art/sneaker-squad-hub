import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const EmailHistory = () => {
  const { user } = useAuth();

  const { data: emailLogs, isLoading } = useQuery({
    queryKey: ["email-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_logs")
        .select(`
          *,
          template:email_templates(name, subject)
        `)
        .eq("user_id", user?.id)
        .order("sent_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) return <div>Loading email history...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Email History</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emailLogs?.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {format(new Date(log.sent_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{log.template?.name}</TableCell>
              <TableCell>{log.template?.subject}</TableCell>
              <TableCell>
                <Badge
                  variant={log.status === "delivered" ? "success" : "destructive"}
                >
                  {log.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};