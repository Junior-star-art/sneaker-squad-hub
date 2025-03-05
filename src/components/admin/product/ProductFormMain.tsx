
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSlugGenerator } from "./useSlugGenerator";
import { ImageUploadSection } from "./ImageUploadSection";
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

interface ProductFormMainProps {
  product?: any;
  images: string[];
  setImages: (images: string[]) => void;
  onSuccess?: () => void;
}

export function ProductFormMain({ 
  product, 
  images, 
  setImages, 
  onSuccess 
}: ProductFormMainProps) {
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
  const { isCheckingSlug, generateAndCheckSlug } = useSlugGenerator(productName, product?.id);

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

  const productMutation = useMutation({
    mutationFn: async (formData: ProductFormData) => {
      const dbData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        stock: formData.stock,
        category_id: formData.category_id,
        slug: await generateAndCheckSlug(formData.name),
        images,
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

  const onSubmit = async (data: ProductFormData) => {
    productMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Product Images</Label>
          <ImageUploadSection 
            productId={product?.id}
            images={images}
            onChange={setImages}
            onSuccess={onSuccess}
          />
        </div>

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
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={productMutation.isPending || isCheckingSlug}>
          {product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
