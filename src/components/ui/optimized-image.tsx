
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  sizes = "100vw",
  className,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(!priority);
  const [error, setError] = useState(false);
  const [blurDataUrl, setBlurDataUrl] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string>(src);

  // Default blur placeholder for cross-origin or failed blur generation
  const defaultBlurDataUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3Atb3BhY2l0eT0iLjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3Atb3BhY2l0eT0iLjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==';

  useEffect(() => {
    // Handle both relative and absolute paths
    if (src.startsWith('/')) {
      setImageSrc(window.location.origin + src);
    } else if (!src.startsWith('http')) {
      setImageSrc(window.location.origin + '/' + src);
    } else {
      setImageSrc(src);
    }

    setLoading(!priority);
    setError(false);

    if (priority) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      img.onload = () => {
        setLoading(false);
        onLoad?.();
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        setError(true);
        setLoading(false);
        onError?.();
      };
    }

    // For placeholder generation
    if (placeholder === 'blur') {
      // For cross-origin images, use default blur
      if (!src.startsWith('/') && !src.startsWith(window.location.origin)) {
        setBlurDataUrl(defaultBlurDataUrl);
        return;
      }

      // For same-origin images, try to generate blur
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            console.warn('Failed to get canvas context');
            setBlurDataUrl(defaultBlurDataUrl);
            return;
          }

          // Set canvas size to small dimensions for blur effect
          canvas.width = 40;
          canvas.height = Math.round((40 * img.height) / img.width);

          // Draw and get data URL
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          try {
            const blurUrl = canvas.toDataURL('image/jpeg', 0.5);
            setBlurDataUrl(blurUrl);
          } catch (error) {
            console.warn('Failed to generate blur from canvas:', error);
            setBlurDataUrl(defaultBlurDataUrl);
          }
        } catch (error) {
          console.warn('Failed to generate blur:', error);
          setBlurDataUrl(defaultBlurDataUrl);
        }
      };
      img.onerror = () => {
        console.warn('Failed to load image for blur');
        setBlurDataUrl(defaultBlurDataUrl);
      };
    }
  }, [src, priority, placeholder, onLoad, onError]);

  if (error) {
    return (
      <div 
        className={cn(
          "bg-gray-100 flex items-center justify-center",
          className
        )}
        {...props}
      >
        <span className="text-gray-400">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "relative overflow-hidden",
      loading && "animate-pulse bg-gray-200",
      className
    )}>
      {loading && <Skeleton className="absolute inset-0" />}
      
      {placeholder === 'blur' && blurDataUrl && (
        <img
          src={blurDataUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110 transform"
          style={{ opacity: loading ? 1 : 0 }}
        />
      )}

      <img
        src={imageSrc}
        alt={alt}
        sizes={sizes}
        loading={priority ? undefined : "lazy"}
        decoding="async"
        crossOrigin="anonymous"
        onLoad={() => {
          setLoading(false);
          onLoad?.();
        }}
        onError={() => {
          setError(true);
          setLoading(false);
          onError?.();
          console.error(`Failed to load image: ${imageSrc}`);
        }}
        className={cn(
          "transition-opacity duration-300 object-cover",
          loading ? "opacity-0" : "opacity-100",
        )}
        {...props}
      />
    </div>
  );
}
