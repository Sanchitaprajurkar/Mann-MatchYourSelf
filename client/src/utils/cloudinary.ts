/**
 * Cloudinary URL Optimization Utility
 * 
 * This utility provides functions to optimize Cloudinary URLs with:
 * - Automatic format selection (f_auto)
 * - Automatic quality optimization (q_auto)
 * - Responsive width sizing
 * - Proper loading attributes
 */

interface CloudinaryOptions {
  width?: number;
  quality?: 'auto' | 'good' | 'eco' | 'low';
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'scale' | 'fill' | 'crop' | 'thumb';
  aspectRatio?: string;
  gravity?: 'auto' | 'center' | 'face' | 'faces';
}

/**
 * Check if a URL is a Cloudinary URL
 */
export const isCloudinaryUrl = (url: string): boolean => {
  return url.includes('res.cloudinary.com') || url.includes('cloudinary.com');
};

/**
 * Add Cloudinary transformations to a URL
 */
export const optimizeCloudinaryUrl = (
  url: string, 
  options: CloudinaryOptions = {}
): string => {
  if (!url || !isCloudinaryUrl(url)) {
    return url;
  }

  const {
    width,
    quality = 'auto',
    format = 'auto',
    crop = 'scale',
    aspectRatio,
    gravity = 'auto'
  } = options;

  // Build transformation string
  const transformations: string[] = [];

  // Add transformations in the correct order
  if (width) transformations.push(`w_${width}`);
  if (aspectRatio) transformations.push(`ar_${aspectRatio}`);
  if (crop !== 'scale') transformations.push(`c_${crop}`);
  if (gravity !== 'auto') transformations.push(`g_${gravity}`);
  if (quality !== 'auto') transformations.push(`q_${quality}`);
  if (format !== 'auto') transformations.push(`f_${format}`);

  // Always add f_auto and q_auto for optimal performance
  if (!transformations.some(t => t.startsWith('f_'))) {
    transformations.push('f_auto');
  }
  if (!transformations.some(t => t.startsWith('q_'))) {
    transformations.push('q_auto');
  }

  // Insert transformations into the URL
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url; // Not a valid Cloudinary URL structure
  }

  const beforeUpload = url.substring(0, uploadIndex + 8); // include '/upload/'
  const afterUpload = url.substring(uploadIndex + 8);

  // Check if there are already transformations
  const existingTransforms = afterUpload.match(/^\/([^\/]+)\//);
  
  if (existingTransforms) {
    // Replace existing transformations
    const afterTransforms = afterUpload.substring(existingTransforms[0].length);
    return `${beforeUpload}${transformations.join(',')}${afterTransforms}`;
  } else {
    // Add new transformations
    return `${beforeUpload}${transformations.join(',')}/${afterUpload}`;
  }
};

/**
 * Get optimized image URL with responsive sizing
 */
export const getOptimizedImageUrl = (
  url: string,
  displayWidth: number,
  options: Omit<CloudinaryOptions, 'width'> = {}
): string => {
  // Use device pixel ratio for sharper images on high-DPI displays
  const dpr = window.devicePixelRatio || 1;
  const optimalWidth = Math.ceil(displayWidth * dpr);

  return optimizeCloudinaryUrl(url, {
    width: optimalWidth,
    ...options
  });
};

/**
 * Common preset configurations for different use cases
 */
export const CLOUDINARY_PRESETS = {
  // Hero/banner images - high quality, eager loading
  hero: (url: string, width: number = 1920) => optimizeCloudinaryUrl(url, {
    width,
    quality: 'auto',
    format: 'auto',
    crop: 'scale'
  }),

  // Product thumbnails - medium quality, smaller size
  thumbnail: (url: string, width: number = 300) => optimizeCloudinaryUrl(url, {
    width,
    quality: 'auto',
    format: 'auto',
    crop: 'fill'
  }),

  // Product gallery images - high quality for detail view
  gallery: (url: string, width: number = 800) => optimizeCloudinaryUrl(url, {
    width,
    quality: 'auto',
    format: 'auto',
    crop: 'scale'
  }),

  // Category cards - balanced quality/size
  category: (url: string, width: number = 400) => optimizeCloudinaryUrl(url, {
    width,
    quality: 'auto',
    format: 'auto',
    crop: 'fill'
  }),

  // Blog/post images - content optimized
  blog: (url: string, width: number = 1200) => optimizeCloudinaryUrl(url, {
    width,
    quality: 'auto',
    format: 'auto',
    crop: 'fill'
  })
};

/**
 * Generate responsive srcset for Cloudinary images
 */
export const generateSrcSet = (
  url: string,
  baseWidth: number,
  breakpoints: number[] = [320, 640, 768, 1024, 1280, 1536],
  options: Omit<CloudinaryOptions, 'width'> = {}
): string => {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  return breakpoints
    .map(width => `${optimizeCloudinaryUrl(url, { width, ...options })} ${width}w`)
    .join(', ');
};

/**
 * Get appropriate loading attributes based on image position
 */
export const getImageLoadingProps = (isAboveFold: boolean = false) => {
  if (isAboveFold) {
    return {
      loading: 'eager' as const,
      fetchPriority: 'high' as const
    };
  }
  
  return {
    loading: 'lazy' as const,
    fetchPriority: 'auto' as const
  };
};
