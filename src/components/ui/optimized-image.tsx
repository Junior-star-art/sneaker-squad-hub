
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

  // Default blur placeholder - using a static SVG to avoid canvas security issues
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
      img.src = imageSrc;
      // Add crossOrigin attribute to prevent tainted canvas issues
      img.crossOrigin = "anonymous"; 
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

    // For placeholder generation - always use default blur
    if (placeholder === 'blur') {
      // Always use default blur to avoid CORS issues
      setBlurDataUrl(defaultBlurDataUrl);
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
        crossOrigin="anonymous" // Add crossOrigin attribute to prevent tainted canvas issues
        className={cn(
          "transition-opacity duration-300 object-cover",
          loading ? "opacity-0" : "opacity-100",
        )}
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
        {...props}
      />
    </div>
  );
}
