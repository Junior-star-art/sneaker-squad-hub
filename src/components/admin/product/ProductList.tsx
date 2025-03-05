
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader2, Search, RefreshCw } from "lucide-react";
import { ProductRow } from "./ProductRow";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProductForm } from "../ProductForm";

export function ProductList() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products", search],
    queryFn: async () => {
      console.log("Fetching products with search:", search);
      let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      console.log("Products fetched:", data?.length || 0);
      return data as any[];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["products"] })}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : !products?.length ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <ProductRow 
                  key={product.id} 
                  product={product} 
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
