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
    // Reset states when src changes
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
        setError(true);
        setLoading(false);
        onError?.();
      };
    }

    // Generate blur placeholder if needed
    if (placeholder === 'blur' && !blurDataUrl) {
      generateBlurPlaceholder(src).then(setBlurDataUrl);
    }
  }, [src, priority, placeholder, onLoad, onError]);

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    const widths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
    return widths
      .map((w) => {
        const finalSrc = appendImageOptimization(src, w, quality);
        return `${finalSrc} ${w}w`;
      })
      .join(', ');
  };

  // Append image optimization parameters
  const appendImageOptimization = (url: string, width: number, quality: number) => {
    // If it's an external URL (like Unsplash), return as is
    if (url.startsWith('http')) return url;

    // For local images, append optimization parameters
    const params = new URLSearchParams({
      w: width.toString(),
      q: quality.toString(),
      fit: 'crop',
      auto: 'format',
    });

    return `${url}?${params.toString()}`;
  };

  // Generate blur placeholder (simple implementation)
  const generateBlurPlaceholder = async (imageSrc: string): Promise<string> => {
    // This is a simplified version. In production, you might want to
    // generate this server-side or use a service
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = 40;
        canvas.height = (40 * img.height) / img.width;

        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.5));
        }
      };

      img.src = imageSrc;
    });
  };

  // If there's an error, show fallback
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