# Image Optimization Guide

## Current Issues Identified

### Large Files That Need Optimization:
1. **mann-heritage.mp4** (14.5MB) - Video file
2. **women-slide-1.png** (1.5MB) - Hero image
3. **women-hero.png** (1.3MB) - Women section
4. **slide1.png** (1.3MB) - Hero slider
5. **VisitOurStore.png** (696KB) - Store section

## Recommended Actions

### 1. Video Optimization
**mann-heritage.mp4 (14.5MB → Target: <3MB)**

```bash
# Using FFmpeg (install from https://ffmpeg.org/)
ffmpeg -i mann-heritage.mp4 -vcodec h264 -crf 28 -preset slow mann-heritage-optimized.mp4
```

Alternative: Use online tools like:
- https://www.freeconvert.com/video-compressor
- https://www.videosmaller.com/

### 2. PNG to WebP Conversion
**For all PNG files:**

```bash
# Using cwebp (install from https://developers.google.com/speed/webp/download)
cwebp -q 80 women-slide-1.png -o women-slide-1.webp
cwebp -q 80 women-hero.png -o women-hero.webp
cwebp -q 80 slide1.png -o slide1.webp
cwebp -q 80 VisitOurStore.png -o VisitOurStore.webp
```

Alternative online tools:
- https://squoosh.app/ (Google's image optimizer)
- https://tinypng.com/

### 3. Expected Results After Optimization

| File | Current Size | Target Size | Savings |
|------|-------------|-------------|---------|
| mann-heritage.mp4 | 14.5MB | 2-3MB | ~80% |
| women-slide-1.png | 1.5MB | 150-200KB | ~87% |
| women-hero.png | 1.3MB | 130-180KB | ~86% |
| slide1.png | 1.3MB | 130-180KB | ~86% |
| VisitOurStore.png | 696KB | 70-100KB | ~86% |

**Total Savings: ~17MB → ~3MB (82% reduction)**

### 4. Implementation Steps

1. **Optimize images** using tools above
2. **Replace original files** in `client/public/` folder
3. **Test the website** to ensure images load correctly
4. **Verify performance** using Chrome DevTools Network tab

### 5. Future Best Practices

- Always optimize images before uploading
- Use WebP format for better compression
- Keep images under 200KB when possible
- Use lazy loading for below-the-fold images (already implemented)
- Consider using a CDN for image delivery

## Performance Impact

After optimization, you should see:
- **Initial page load**: 3-5 seconds faster
- **Total page weight**: Reduced by ~80%
- **Better mobile experience**: Faster loading on slow connections
- **Improved SEO**: Better Core Web Vitals scores
