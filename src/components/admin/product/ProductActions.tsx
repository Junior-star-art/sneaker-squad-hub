
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Upload, Download } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProductForm } from "../ProductForm";

export function ProductActions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const products = JSON.parse(text);

      const { error } = await supabase.from("products").insert(products);
      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Import successful",
        description: "Products have been imported successfully",
      });
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "products.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Input
        type="file"
        accept=".json"
        className="hidden"
        id="import-file"
        onChange={handleImport}
      />
      <Button variant="outline" onClick={handleExport}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <label htmlFor="import-file">
        <Button variant="outline" asChild>
          <span>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </span>
        </Button>
      </label>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <ProductForm
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["products"] });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
