interface ImageGalleryProps {
  images: string[];
  mainImage: string;
  productName: string;
  onImageSelect: (image: string) => void;
}

export const ImageGallery = ({ images, mainImage, productName, onImageSelect }: ImageGalleryProps) => {
  return (
    <div className="space-y-4">
      <div className="relative aspect-square group">
        <img
          src={mainImage}
          alt={productName}
          className="object-cover w-full h-full rounded-lg transition-transform group-hover:scale-105"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {images?.map((image, index) => (
          <button
            key={index}
            onClick={() => onImageSelect(image)}
            className="w-20 h-20 rounded-md overflow-hidden border-2 transition-colors"
            style={{ borderColor: mainImage === image ? '#000' : 'transparent' }}
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