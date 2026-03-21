import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../utils/api";
import { CLOUDINARY_PRESETS } from "../utils/cloudinary";

const FALLBACK_VIDEO = "/mann-heritage.mp4";
const POSTER_IMAGE = "/Hero/slide1.png";

const WhyMannVideo = () => {
  const [videoUrl, setVideoUrl] = useState<string>(FALLBACK_VIDEO);
  const [showVideo, setShowVideo] = useState(false);

  // Get optimized poster image
  const optimizedPosterImage = CLOUDINARY_PRESETS.hero(POSTER_IMAGE, 1920);

  useEffect(() => {
    const controller = new AbortController();

    // Let poster + text paint first, then enable video
    const timer = window.setTimeout(() => {
      setShowVideo(true);
    }, 300);

    const fetchHeroVideo = async () => {
      try {
        const response = await API.get("/api/settings/hero-video", {
          timeout: 3000,
          signal: controller.signal,
        });

        if (response.data.success && response.data.heroVideo) {
          setVideoUrl(response.data.heroVideo);
        }
      } catch {
        // stay on fallback silently
      }
    };

    fetchHeroVideo();

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, []);

  const handleVideoError = () => {
    if (videoUrl !== FALLBACK_VIDEO) {
      setVideoUrl(FALLBACK_VIDEO);
    }
  };

  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden">
      <img
        src={optimizedPosterImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
      />

      {showVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={optimizedPosterImage}
          onError={handleVideoError}
        />
      )}

      <div className="absolute inset-0 bg-black/50 md:bg-black/40" />

      <div className="relative z-10 h-full min-h-[100svh] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Heading - Responsive typography */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight max-w-4xl drop-shadow-2xl text-center md:text-left font-script">
            <span className="text-white drop-shadow-md">Rooted in</span>{" "}
            <span className="text-[#C5A059]">Tradition</span>.<br />
            <span className="text-white drop-shadow-md">Styled for</span>{" "}
            <span className="text-[#C5A059]">Today</span>.
          </h1>

          {/* Sub-text - Responsive sizing and alignment */}
          <p className="mt-6 sm:mt-8 max-w-xl text-sm sm:text-base md:text-lg text-[#F5F5F5] leading-relaxed sm:leading-loose font-light tracking-wide drop-shadow-lg text-center md:text-left mx-auto md:mx-0">
            Mann is an expression of Indian heritage — handcrafted silhouettes,
            timeless textiles, and modern elegance designed for the woman who
            wears her story with confidence.
          </p>

          {/* CTA Buttons - Responsive layout and sizing */}
          <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 sm:gap-6 md:gap-8">
            <Link
              to="/collections"
              className="w-full sm:w-auto bg-[#1A1A1A] text-[#C5A059] px-8 sm:px-10 py-3 sm:py-4 rounded-full text-xs sm:text-sm font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 shadow-xl border border-[#C5A059] text-center min-h-[48px] flex items-center justify-center"
            >
              Explore Collections
            </Link>

            <Link
              to="/our-story"
              className="text-xs sm:text-sm font-medium tracking-widest uppercase text-white border-b border-[#C5A059] hover:text-[#C5A059] transition-all duration-300 pb-1 drop-shadow-md min-h-[48px] flex items-center"
            >
              Our Story
            </Link>
          </div>

          {/* MICRO LUXURY DETAIL - Responsive positioning */}
          <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 lg:left-6">
            <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#C5A059] font-medium drop-shadow-md text-center md:text-left">
              Handcrafted • Limited Editions • Made in India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyMannVideo;
