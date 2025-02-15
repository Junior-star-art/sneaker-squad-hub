
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

  useEffect(() => {
    setLoading(!priority);
    setError(false);

    if (priority) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        setLoading(false);
        onLoad?.();
      };
      img.onerror = () => {
        setError(true);
        setLoading(false);
        onError?.();
      };
    }

    if (placeholder === 'blur' && !blurDataUrl) {
      generateBlurPlaceholder(src).then(setBlurDataUrl).catch((err) => {
        console.warn('Failed to generate blur placeholder:', err);
        setBlurDataUrl(null);
      });
    }
  }, [src, priority, placeholder, onLoad, onError]);

  const generateSrcSet = () => {
    const widths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
    return widths
      .map((w) => {
        const finalSrc = appendImageOptimization(src, w, quality);
        return `${finalSrc} ${w}w`;
      })
      .join(', ');
  };

  const appendImageOptimization = (url: string, width: number, quality: number) => {
    if (url.startsWith('http')) return url;

    const params = new URLSearchParams({
      w: width.toString(),
      q: quality.toString(),
      fit: 'crop',
      auto: 'format',
    });

    return `${url}?${params.toString()}`;
  };

  const generateBlurPlaceholder = async (imageSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        try {
          canvas.width = 40;
          canvas.height = (40 * img.height) / img.width;

          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.5));
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

      // Add a random query parameter to bypass cache
      const cacheBuster = `${imageSrc}${imageSrc.includes('?') ? '&' : '?'}_=${Date.now()}`;
      img.src = cacheBuster;
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
        src={appendImageOptimization(src, 1080, quality)}
        alt={alt}
        sizes={sizes}
        srcSet={!error ? generateSrcSet() : undefined}
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
