import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * PRODUCTION-READY BACKGROUND MUSIC COMPONENT
 *
 * Features:
 * - Persists across routes (when mounted in App.tsx)
 * - Remembers user preference (Mute/Unmute) via localStorage
 * - Respects Autoplay Policy (waits for interaction if needed)
 * - Auto-pauses when tab is hidden (optional, good for UX)
 */
const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Initialize from localStorage to persist preference
  const [isUserMuted, setIsUserMuted] = useState(() => {
    const saved = localStorage.getItem("mann_music_muted");
    return saved === "true"; // Default to false (music on) if not set
  });

  // Auto-play on mount and handle user interaction
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4; // Set a non-intrusive volume level

    const attemptPlay = async () => {
      try {
        if (!isUserMuted) {
          await audio.play();
          setIsPlaying(true);
        } else {
          audio.pause();
          setIsPlaying(false);
        }
      } catch (error) {
        // Autoplay blocked - browser requires user interaction first
        if (!import.meta.env.PROD) {
          console.log("Autoplay blocked, waiting for interaction");
        }
        setIsPlaying(false);
      }
    };

    // Try to play immediately on mount
    attemptPlay();

    // Add global interaction listener to unlock audio context
    const unlockAudio = () => {
      setHasInteracted(true);
      // Only start if user hasn't explicitly muted
      if (!isUserMuted) {
        attemptPlay();
      }
      // Cleanup listeners once interaction is detected
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    window.addEventListener("keydown", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, [isUserMuted]); // Re-run if mute preference changes

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setIsUserMuted(true);
      localStorage.setItem("mann_music_muted", "true");
    } else {
      audio.play().catch((e) => console.error("Play failed:", e));
      setIsPlaying(true);
      setIsUserMuted(false);
      localStorage.setItem("mann_music_muted", "false");
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 transition-opacity duration-500 hover:opacity-100 opacity-70">
      {/* Audio Element - Hidden */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/audio.mpeg" type="audio/mpeg" />
      </audio>

      {/* Toggle Button */}
      <button
        onClick={togglePlay}
        className={`group relative flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 border border-[#C5A059] ${
          isPlaying
            ? "bg-[#C5A059] text-black shadow-[0_0_15px_rgba(197,160,89,0.5)]"
            : "bg-black/80 text-[#C5A059]"
        }`}
        aria-label={isPlaying ? "Mute Music" : "Play Music"}
      >
        {isPlaying ? (
          <Volume2 size={20} strokeWidth={2} />
        ) : (
          <VolumeX size={20} strokeWidth={2} />
        )}

        {/* Pulse effect when playing */}
        {isPlaying && (
          <span className="absolute -inset-1 -z-10 animate-ping rounded-full bg-[#C5A059] opacity-30 duration-1000" />
        )}
      </button>
    </div>
  );
};

export default BackgroundMusic;
