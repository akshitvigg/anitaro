"use client";
import React, { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

type M3U8PlayerProps = {
  m3u8Url: string;
  referer: string;
  subtitles?: { url: string; lang: string }[];
};

export const M3U8Player: React.FC<M3U8PlayerProps> = ({
  m3u8Url,
  referer,
  subtitles = [],
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  console.log("M3U8Player initialized with:", {
    m3u8Url,
    referer,
    subtitles: subtitles.length,
  });

  const proxyUrl = `https://rust-proxy-m3u8.onrender.com/?url=${encodeURIComponent(
    m3u8Url
  )}&headers=${encodeURIComponent(JSON.stringify({ Referer: referer }))}`;

  // Filter out problematic subtitle tracks
  const validSubtitles = subtitles.filter(
    (track) =>
      track.lang !== "thumbnails" && // Remove thumbnail tracks that cause parsing errors
      track.url.includes(".vtt") && // Only include VTT files
      track.lang && // Must have a language
      track.url // Must have a URL
  );

  // Suppress Video.js subtitle parsing errors
  useEffect(() => {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.error = (...args) => {
      const message = args[0]?.toString?.() || "";
      const fullMessage = args.join(" ");
      
      if (
        message.includes("ParsingError: Malformed timestamp") ||
        message.includes('VIDEOJS: "ERROR:"') ||
        message.includes("VTT cue malformed") ||
        message.includes("VTT region malformed") ||
        fullMessage.includes("ParsingError: Malformed timestamp") ||
        fullMessage.includes("VTT") ||
        fullMessage.includes("subtitle") ||
        fullMessage.includes("cue")
      ) {
        return; // Ignore VTT parsing errors
      }
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args[0]?.toString?.() || "";
      const fullMessage = args.join(" ");
      
      if (
        message.includes("The element supplied is not included in the DOM") ||
        message.includes("VTT cue") ||
        message.includes("subtitle") ||
        fullMessage.includes("VTT") ||
        fullMessage.includes("subtitle") ||
        fullMessage.includes("cue")
      ) {
        return; // Ignore VTT and DOM warnings
      }
      originalConsoleWarn.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  // Wait for component to mount
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Add keyboard shortcuts for 10-second skip
  const handleKeyPress = (e: KeyboardEvent) => {
    if (!playerRef.current) return;

    // Prevent default if focused on video
    if (
      e.target === videoRef.current ||
      document.activeElement === videoRef.current
    ) {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          playerRef.current.currentTime(
            Math.max(0, playerRef.current.currentTime() - 10)
          );
          break;
        case "ArrowRight":
          e.preventDefault();
          playerRef.current.currentTime(
            playerRef.current.currentTime() + 10
          );
          break;
        case " ":
          e.preventDefault();
          if (playerRef.current.paused()) {
            playerRef.current.play();
          } else {
            playerRef.current.pause();
          }
          break;
      }
    }
  };

  // Initialize video player only after component is mounted
  useEffect(() => {
    if (!isMounted || !videoRef.current || playerRef.current) {
      return;
    }

    // Double-check the element is in the DOM
    if (!document.contains(videoRef.current)) {
      console.log("Video element not in DOM yet, waiting...");
      return;
    }

    try {
      console.log("Initializing Video.js player");

      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        fluid: true,
        preload: "auto",
        responsive: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2], // Add playback speed options
        sources: [
          {
            src: proxyUrl,
            type: "application/x-mpegURL",
          },
        ],
        html5: {
          vhs: {
            // HLS.js options to handle subtitle errors gracefully
            enableLowInitialPlaylist: true,
            smoothQualityChange: true,
            overrideNative: true,
          },
        },
      });

      // Add event listeners
      document.addEventListener("keydown", handleKeyPress);

      // Handle player ready event
      playerRef.current.ready(() => {
        console.log("Video.js player ready - stream should start playing");
      });

      // Handle errors gracefully
      playerRef.current.on("error", (error: any) => {
        const err = playerRef.current.error();
        if (err) {
          console.error("Video playback error:", err.message || err);
          // Don't show subtitle parsing errors to user
          if (
            !err.message?.includes("subtitle") &&
            !err.message?.includes("VTT")
          ) {
            // Only log serious playback errors
            console.error("Serious playback error:", err);
          }
        }
      });

      // Handle successful loading
      playerRef.current.on("loadstart", () => {
        console.log("Video loading started");
      });

      playerRef.current.on("canplay", () => {
        console.log("Video can start playing");
      });
    } catch (error) {
      console.error("Error initializing Video.js:", error);
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.dispose();
        } catch (error) {
          // Ignore disposal errors
        }
        playerRef.current = null;
      }
      // Remove keyboard event listener
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isMounted, proxyUrl]);

  // Update source when URL changes
  useEffect(() => {
    if (playerRef.current && proxyUrl) {
      try {
        playerRef.current.src({
          src: proxyUrl,
          type: "application/x-mpegURL",
        });
        console.log("Video source updated successfully");
      } catch (error) {
        console.error("Error updating video source:", error);
      }
    }
  }, [proxyUrl]);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-gray-700 border-t-white rounded-full animate-spin"></div>
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden relative group">
      <div data-vjs-player className="w-full h-full">
        <video
          ref={videoRef}
          className="video-js vjs-default-skin w-full h-full"
          crossOrigin="anonymous"
          playsInline
         
          tabIndex={0} // Make video focusable for keyboard events
        >
          {validSubtitles.map((track, index) => {
            const proxiedTrackUrl = `https://rust-proxy-m3u8.onrender.com/?url=${encodeURIComponent(
              track.url
            )}&headers=${encodeURIComponent(
              JSON.stringify({ Referer: referer })
            )}`;

            return (
              <track
                key={`${track.lang}-${index}`}
                src={proxiedTrackUrl}
                label={track.lang}
                kind="subtitles"
                srcLang={track.lang.slice(0, 2).toLowerCase()}
                default={track.lang === "English" && index === 0}
              />
            );
          })}
        </video>
      </div>

      {/* Keyboard shortcut hint - shows on hover */}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        ← → 10s | Space Play/Pause
      </div>
    </div>
  );
};

export default M3U8Player;
