import { useState, useRef, useEffect } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  placeholder?: string;
  fallback?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = "",
  loading = "lazy",
  priority = false,
  placeholder = "blur",
  fallback = "/placeholder.jpg"
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

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

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* ✅ PLACEHOLDER */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={placeholderStyle}
        />
      )}

      {/* ✅ OPTIMIZED IMAGE */}
      {isInView && (
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
      )}
    </div>
  );
};

export default OptimizedImage;
