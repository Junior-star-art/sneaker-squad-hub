import { useState } from 'react';
import { Rotate3d, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product360ViewProps {
  images: string[];
  productName: string;
}

const Product360View = ({ images, productName }: Product360ViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsRotating(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isRotating) return;

    const diff = e.clientX - startX;
    if (Math.abs(diff) > 30) {
      const newIndex = (currentIndex + (diff > 0 ? 1 : -1) + images.length) % images.length;
      setCurrentIndex(newIndex);
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsRotating(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsRotating(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isRotating) return;

    const diff = e.touches[0].clientX - startX;
    if (Math.abs(diff) > 30) {
      const newIndex = (currentIndex + (diff > 0 ? 1 : -1) + images.length) % images.length;
      setCurrentIndex(newIndex);
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsRotating(false);
  };

  return (
    <div className="relative">
      <div
        className="aspect-square overflow-hidden rounded-lg bg-gray-100"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentIndex]}
          alt={`${productName} - View ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-center h-full">
            <Rotate3d className="w-12 h-12 text-white animate-spin-slow" />
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="absolute bottom-4 right-4"
        onClick={() => setCurrentIndex(0)}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset View
      </Button>
    </div>
  );
};

export default Product360View;
