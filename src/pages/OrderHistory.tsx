import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const fetchOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (
          name,
          images
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => fetchOrders(user?.id || ''),
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-semibold mb-6">Order History</h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading orders. Please try again later.</p>
              </div>
            ) : orders?.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven't placed any orders yet.
                </p>
                <div className="mt-6">
                  <Button onClick={() => navigate('/')}>
                    Start Shopping
                  </Button>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Items</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                          }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>${order.total_amount}</TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {order.order_items.map((item: any) => (
                            <img
                              key={item.id}
                              src={item.product.images?.[0] || '/placeholder.svg'}
                              alt={item.product.name}
                              className="h-8 w-8 rounded-full ring-2 ring-white object-cover"
                              title={item.product.name}
                            />
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;