import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  sizes = "100vw",
  className,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(!priority);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (priority) {
      const img = new Image();
      img.src = src;
    }
  }, [src, priority]);

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    const widths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
    const srcSet = widths
      .map((w) => `${src}?width=${w} ${w}w`)
      .join(', ');
    return srcSet;
  };

  return (
    <div className={cn(
      "relative overflow-hidden",
      loading && "animate-pulse bg-gray-200",
      className
    )}>
      <img
        src={error ? '/placeholder.svg' : src}
        alt={alt}
        sizes={sizes}
        srcSet={!error ? generateSrcSet() : undefined}
        loading={priority ? undefined : "lazy"}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        className={cn(
          "transition-opacity duration-300",
          loading ? "opacity-0" : "opacity-100",
          className
        )}
        {...props}
      />
    </div>
  );
}