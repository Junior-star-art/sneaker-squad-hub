import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  mainImage: string;
  productName: string;
  onImageSelect: (image: string) => void;
}

export const ImageGallery = ({ images, mainImage, productName, onImageSelect }: ImageGalleryProps) => {
  const isMobile = useIsMobile();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    onImageSelect(images[currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1]);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    onImageSelect(images[currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0]);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-lg overflow-hidden group">
        <img
          src={mainImage}
          alt={productName}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        {isMobile && images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
      
      {!isMobile && (
        <div className={cn(
          "grid gap-2",
          isMobile ? "grid-flow-col auto-cols-[4rem] overflow-x-auto snap-x snap-mandatory" : "grid-cols-4"
        )}>
          {images?.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                onImageSelect(image);
                setCurrentImageIndex(index);
              }}
              className={cn(
                "aspect-square rounded-md overflow-hidden border-2 transition-all hover:scale-105",
                mainImage === image ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent"
              )}
            >
              <img 
                src={image} 
                alt={`${productName} view ${index + 1}`} 
                className="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};