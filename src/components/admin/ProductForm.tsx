
import { useState } from "react";
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

interface ProductFormProps {
  product?: any;
  onSuccess?: () => void;
}

interface ProductFormData {
  name: string;
  price: string; // Keep as string for form input
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

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ProductFormData>({
    defaultValues: product || {
      name: "",
      price: "",
      description: "",
      stock: 0,
      category_id: "",
    },
  });

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

  const productMutation = useMutation({
    mutationFn: async (formData: ProductFormData) => {
      // Transform form data to match database schema
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          {...register("name", { required: "Product name is required" })}
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
            {...register("price", { required: "Price is required" })}
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
            {...register("stock", { required: "Stock is required" })}
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
          {...register("description")}
          rows={4}
        />
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

      <Button
        type="submit"
        className="w-full"
        disabled={productMutation.isPending}
      >
        {productMutation.isPending && (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        )}
        {product ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
