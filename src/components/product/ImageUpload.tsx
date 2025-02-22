
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images = [], onChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    try {
      if (images.length >= maxImages) {
        toast({
          title: "Maximum images reached",
          description: `You can only upload up to ${maxImages} images`,
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload only image files');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      if (!data) {
        throw new Error('Upload failed');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      onChange([...images, publicUrl]);

      toast({
        title: "Image uploaded",
        description: "The image was uploaded successfully",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || 'Failed to upload image',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index: number) => {
    try {
      const imageUrl = images[index];
      const fileName = imageUrl.split('/').pop();

      if (fileName) {
        await supabase.storage
          .from('product-images')
          .remove([fileName]);
      }

      const newImages = [...images];
      newImages.splice(index, 1);
      onChange(newImages);

      toast({
        title: "Image removed",
        description: "The image was removed successfully",
      });
    } catch (error: any) {
      console.error('Remove error:', error);
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
            <OptimizedImage
              src={image}
              alt={`Product image ${index + 1}`}
              className="rounded-lg object-cover w-full h-full"
              priority={index === 0}
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <div>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              uploadImage(file);
            }
          }}
          disabled={uploading || images.length >= maxImages}
          className="cursor-pointer"
        />
        <p className="text-sm text-muted-foreground mt-2">
          {images.length >= maxImages 
            ? `Maximum ${maxImages} images allowed`
            : `Upload up to ${maxImages} product images. The first image will be used as the main product image.`
          }
        </p>
      </div>
    </div>
  );
}
