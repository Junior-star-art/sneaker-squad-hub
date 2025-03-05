
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

interface BulkImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BulkImportModal({ 
  open, 
  onOpenChange, 
  onSuccess 
}: BulkImportModalProps) {
  const { toast } = useToast();

  const bulkProductMutation = useMutation({
    mutationFn: async (file: File) => {
      const reader = new FileReader();
      
      try {
        const csvData = await new Promise<string>((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = (e) => reject(e);
          reader.readAsText(file);
        });

        const rows = csvData.split('\n').slice(1); // Skip header row
        const products = rows.map(row => {
          const [name, price, description, stock, category_id] = row.split(',');
          return {
            name: name.trim(),
            price: parseFloat(price),
            description: description.trim(),
            stock: parseInt(stock),
            category_id: category_id.trim(),
            slug: generateSlug(name.trim()),
          };
        });

        const { error } = await supabase
          .from('products')
          .insert(products);

        if (error) throw error;
      } catch (error: any) {
        throw new Error(`Failed to process CSV: ${error.message}`);
      }
    },
    onSuccess: () => {
      toast({
        title: "Products imported",
        description: "Successfully imported products from CSV",
      });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bulk Import Products</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with the following columns:
            name,price,description,stock,category_id
          </p>
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                bulkProductMutation.mutate(file);
              }
            }}
          />
          <a
            href="#"
            className="text-sm text-primary hover:underline"
            onClick={(e) => {
              e.preventDefault();
              const header = "name,price,description,stock,category_id\n";
              const example = "Example Product,19.99,A great product,10,category-uuid\n";
              const blob = new Blob([header, example], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'product_template.csv';
              a.click();
              window.URL.revokeObjectURL(url);
            }}
          >
            Download template
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
