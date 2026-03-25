import { useState, useRef, useEffect } from "react";

interface PerformanceOptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  fallback?: string;
  webpSrc?: string;
  preload?: boolean;
}

const PerformanceOptimizedImage: React.FC<PerformanceOptimizedImageProps> = ({
  src,
  alt,
  className = "",
  loading = "lazy",
  priority = false,
  fallback = "/placeholder.jpg",
  webpSrc,
  preload = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // ✅ PRELOAD CRITICAL IMAGES
  useEffect(() => {
    if (preload && priority && !isInView) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = webpSrc || src;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [preload, priority, webpSrc, src, isInView]);

  // ✅ INTERSECTION OBSERVER FOR LAZY LOADING
  useEffect(() => {
    if (priority || loading === "eager") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  // ✅ BLUR-UP PLACEHOLDER
  const placeholderStyle = {
    filter: isLoaded ? "none" : "blur(20px)",
    transition: "filter 0.3s ease",
    backgroundColor: "#f0f0f0"
  };

  // ✅ FALLBACK HANDLING
  const handleError = () => {
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // ✅ WEBP FALLBACK WITH <picture>
  if (isInView) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* ✅ PLACEHOLDER */}
        {!isLoaded && !hasError && (
          <div
            className="absolute inset-0 bg-gray-200 animate-pulse"
            style={placeholderStyle}
          />
        )}

        {/* ✅ OPTIMIZED PICTURE ELEMENT */}
        <picture>
          {/* ✅ WEBP SOURCE */}
          {webpSrc && (
            <source
              srcSet={hasError ? fallback : webpSrc}
              type="image/webp"
            />
          )}
          
          {/* ✅ FALLBACK IMAGE */}
          <img
            ref={imgRef}
            src={hasError ? fallback : src}
            alt={alt}
            loading={loading}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={placeholderStyle}
          />
        </picture>
      </div>
    );
  }

  // ✅ PLACEHOLDER WHILE NOT IN VIEW
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 bg-gray-200 animate-pulse"
        style={placeholderStyle}
      />
    </div>
  );
};

export default PerformanceOptimizedImage;
