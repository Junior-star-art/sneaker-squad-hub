
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

  useEffect(() => {
    // Handle both relative and absolute paths
    if (src.startsWith('/')) {
      // If it's a relative path from the public directory
      setImageSrc(window.location.origin + src);
    } else if (!src.startsWith('http')) {
      // If it's a relative path not starting with /
      setImageSrc(window.location.origin + '/' + src);
    } else {
      // If it's already an absolute URL
      setImageSrc(src);
    }

    setLoading(!priority);
    setError(false);

    if (priority) {
      const img = new Image();
      img.src = src;
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

    // Only attempt blur placeholder for same-origin images
    if (placeholder === 'blur' && !blurDataUrl) {
      const isSameOrigin = src.startsWith('/') || src.startsWith(window.location.origin);
      
      if (isSameOrigin) {
        generateBlurPlaceholder(src)
          .then(setBlurDataUrl)
          .catch((err) => {
            console.warn('Failed to generate blur placeholder:', err);
            setBlurDataUrl(null);
          });
      } else {
        // For cross-origin images, skip blur effect
        console.warn('Skipping blur effect for cross-origin image:', src);
        setBlurDataUrl(null);
      }
    }
  }, [src, priority, placeholder, onLoad, onError]);

  const generateBlurPlaceholder = async (imageSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // Set crossOrigin to anonymous before setting src
      if (!imageSrc.startsWith('/') && !imageSrc.startsWith(window.location.origin)) {
        img.crossOrigin = "anonymous";
      }
      
      img.onload = () => {
        try {
          canvas.width = 40;
          canvas.height = (40 * img.height) / img.width;

          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            try {
              const blurredDataUrl = canvas.toDataURL('image/jpeg', 0.5);
              resolve(blurredDataUrl);
            } catch (error) {
              if (error instanceof DOMException && error.name === 'SecurityError') {
                // If we can't generate blur due to CORS, return a light gray data URL
                resolve('data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==');
              } else {
                reject(error);
              }
            }
          } else {
            reject(new Error('Could not get canvas context'));
          }
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for blur placeholder'));
      };

      img.src = imageSrc;
    });
  };

  if (error) {
    console.error(`Failed to load image: ${src}`);
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
        crossOrigin={!imageSrc.startsWith('/') && !imageSrc.startsWith(window.location.origin) ? "anonymous" : undefined}
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
