import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { ProductPreview } from "./ProductPreview";
import { z } from "zod";

interface ProductFormProps {
  product?: any;
  onSuccess?: () => void;
}

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  stock: number;
  category_id: string;
}

interface ProductDbData {
  name: string;
  price: number;
  description: string;
  stock: number;
  category_id: string;
  slug: string;
}

const productSchema = z.object({
  name: z.string()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must be less than 100 characters"),
  price: z.string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Price must be a positive number",
    }),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  stock: z.number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
  category_id: z.string().uuid("Please select a valid category"),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [uploading, setUploading] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, watch, setError } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: "",
      price: "",
      description: "",
      stock: 0,
      category_id: "",
    },
  });

  const productName = watch("name");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const checkSlugUniqueness = async (name: string) => {
    if (!name) return;
    
    setIsCheckingSlug(true);
    const slug = generateSlug(name);
    
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id")
        .eq("slug", slug)
        .neq("id", product?.id || '') // Exclude current product when editing
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw error;
      }

      if (data) {
        setError("name", {
          type: "manual",
          message: "A product with this name already exists",
        });
        return false;
      }
      
      return true;
    } catch (error: any) {
      console.error("Error checking slug uniqueness:", error);
      return false;
    } finally {
      setIsCheckingSlug(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (productName) {
        void checkSlugUniqueness(productName);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [productName]);

  const productMutation = useMutation({
    mutationFn: async (formData: ProductFormData) => {
      const isUnique = await checkSlugUniqueness(formData.name);
      if (!isUnique) {
        throw new Error("A product with this name already exists");
      }

      const dbData: ProductDbData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        stock: formData.stock,
        category_id: formData.category_id,
        slug: generateSlug(formData.name),
      };

      const { error } = product
        ? await supabase
            .from("products")
            .update(dbData)
            .eq("id", product.id)
        : await supabase
            .from("products")
            .insert([dbData]);
            
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: `Product ${product ? "updated" : "created"}`,
        description: `The product has been successfully ${
          product ? "updated" : "created"
        }`,
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
      setBulkUploadModalOpen(false);
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const files = Array.from(event.target.files || []);
      const imageUrls = [];

      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({ images: imageUrls })
        .eq("id", product?.id);

      if (updateError) throw updateError;

      toast({
        title: "Images uploaded",
        description: "Product images have been uploaded successfully",
      });
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: ProductFormData) => {
    productMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setBulkUploadModalOpen(true)}
        >
          Bulk Import
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPreview(true)}
        >
          Preview
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">
            Product Name
            {isCheckingSlug && (
              <span className="ml-2 text-sm text-muted-foreground">
                Checking availability...
              </span>
            )}
          </Label>
          <Input
            id="name"
            {...register("name", { 
              required: "Product name is required",
              minLength: {
                value: 3,
                message: "Product name must be at least 3 characters",
              },
            })}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{String(errors.name.message)}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register("price", { 
                required: "Price is required",
                min: {
                  value: 0,
                  message: "Price must be greater than 0",
                },
              })}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{String(errors.price.message)}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              {...register("stock", { 
                required: "Stock is required",
                min: {
                  value: 0,
                  message: "Stock cannot be negative",
                },
              })}
            />
            {errors.stock && (
              <p className="text-sm text-destructive">{String(errors.stock.message)}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={product?.category_id || ""}
            onValueChange={(value) =>
              register("category_id", { value, required: "Category is required" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category: any) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_id && (
            <p className="text-sm text-destructive">
              {String(errors.category_id.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
            })}
            rows={4}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {String(errors.description.message)}
            </p>
          )}
        </div>

        {product && (
          <div className="space-y-2">
            <Label>Images</Label>
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((image: string, index: number) => (
                <div key={index} className="relative">
                  <OptimizedImage
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={async () => {
                      try {
                        const newImages = [...product.images];
                        newImages.splice(index, 1);
                        const { error } = await supabase
                          .from("products")
                          .update({ images: newImages })
                          .eq("id", product.id);
                        if (error) throw error;
                        onSuccess?.();
                      } catch (error: any) {
                        toast({
                          title: "Error",
                          description: error.message,
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-4">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="image-upload"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer text-center"
                >
                  {uploading ? (
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Upload Images
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        )}
      </form>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Product Preview</DialogTitle>
          </DialogHeader>
          <ProductPreview {...watchedValues} images={product?.images} />
        </DialogContent>
      </Dialog>

      <Dialog open={bulkUploadModalOpen} onOpenChange={setBulkUploadModalOpen}>
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
    </div>
  );
}
