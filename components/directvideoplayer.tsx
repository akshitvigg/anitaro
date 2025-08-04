"use client";
import React, { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

type DirectVideoPlayerProps = {
  m3u8Url: string;
  referer: string;
};

export const DirectVideoPlayer: React.FC<DirectVideoPlayerProps> = ({
  m3u8Url,
  referer,
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      console.log("Initializing direct video player with URL:", m3u8Url);
      setIsLoading(true);
      setError(null);

      try {
        playerRef.current = videojs(videoRef.current, {
          controls: true,
          autoplay: false,
          fluid: true,
          preload: "auto",
          html5: {
            hls: {
              enableLowInitialPlaylist: true,
              smoothQualityChange: true,
              overrideNative: true,
            },
          },
          sources: [
            {
              src: m3u8Url,
              type: "application/x-mpegURL",
            },
          ],
        });

        playerRef.current.on("error", (error: any) => {
          console.error("Video.js error:", error);
          const errorDetails = playerRef.current.error();
          console.error("Error details:", errorDetails);
          setError(`Video Error: ${errorDetails?.message || "Unknown error"}`);
          setIsLoading(false);
        });

        playerRef.current.on("loadedmetadata", () => {
          console.log("Video metadata loaded successfully");
          setIsLoading(false);
        });

        playerRef.current.on("canplay", () => {
          console.log("Video can start playing");
          setIsLoading(false);
        });

        playerRef.current.on("playing", () => {
          console.log("Video is now playing");
          setIsLoading(false);
        });

        playerRef.current.on("waiting", () => {
          console.log("Video is waiting for data");
        });

        playerRef.current.on("loadstart", () => {
          console.log("Video loading started");
        });

        playerRef.current.on("loadeddata", () => {
          console.log("Video data loaded");
          setIsLoading(false);
        });
      } catch (err) {
        console.error("Error initializing video player:", err);
        setError("Failed to initialize video player");
        setIsLoading(false);
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [m3u8Url]);

  return (
    <div className="relative">
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-default-skin w-full h-auto rounded-lg"
          crossOrigin="anonymous"
        />
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-2">Loading video...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg">
          <div className="text-center p-4">
            <p className="text-red-400 mb-2">{error}</p>
            <p className="text-gray-300 text-sm">
              Try refreshing the page or selecting a different server
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectVideoPlayer;
