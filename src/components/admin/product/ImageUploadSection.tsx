
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ImageUpload } from "@/components/product/ImageUpload";

interface ImageUploadSectionProps {
  productId?: string;
  images: string[];
  onChange: (images: string[]) => void;
  onSuccess?: () => void;
}

export function ImageUploadSection({ 
  productId, 
  images, 
  onChange, 
  onSuccess 
}: ImageUploadSectionProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

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

      if (productId) {
        const { error: updateError } = await supabase
          .from("products")
          .update({ images: imageUrls })
          .eq("id", productId);

        if (updateError) throw updateError;
      }

      onChange(imageUrls);
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

  return (
    <div className="space-y-2">
      <ImageUpload 
        images={images}
        onChange={onChange}
      />
    </div>
  );
}
