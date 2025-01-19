import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  mainImage: string;
  productName: string;
  onImageSelect: (image: string) => void;
}

export const ImageGallery = ({ images, mainImage, productName, onImageSelect }: ImageGalleryProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <div className="relative aspect-square group">
        <img
          src={mainImage}
          alt={productName}
          className="object-cover w-full h-full rounded-lg transition-transform group-hover:scale-105"
        />
      </div>
      <div className={cn(
        "grid gap-2 grid-flow-col auto-cols-[4rem]",
        isMobile ? "overflow-x-auto snap-x snap-mandatory" : "grid-flow-row grid-cols-2"
      )}>
        {images?.map((image, index) => (
          <button
            key={index}
            onClick={() => onImageSelect(image)}
            className={cn(
              "aspect-square rounded-md overflow-hidden border-2 transition-colors snap-start",
              mainImage === image ? "border-primary" : "border-transparent"
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
    </div>
  );
};