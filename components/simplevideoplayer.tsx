"use client";
import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

type SimpleVideoPlayerProps = {
  m3u8Url: string;
  referer: string;
};

export const SimpleVideoPlayer: React.FC<SimpleVideoPlayerProps> = ({
  m3u8Url,
  referer,
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef<any>(null);

  const proxyUrl = `https://rust-proxy-m3u8.onrender.com/?url=${encodeURIComponent(
    m3u8Url
  )}&headers=${encodeURIComponent(JSON.stringify({ Referer: referer }))}`;

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      console.log("Initializing simple video player with URL:", proxyUrl);
      
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
            src: proxyUrl,
            type: "application/x-mpegURL",
          },
        ],
      });

      // Add error handling
      playerRef.current.on('error', (error: any) => {
        console.error('Video.js error:', error);
        console.error('Error details:', playerRef.current.error());
      });

      playerRef.current.on('loadedmetadata', () => {
        console.log('Video metadata loaded successfully');
      });

      playerRef.current.on('canplay', () => {
        console.log('Video can start playing');
      });

      playerRef.current.on('playing', () => {
        console.log('Video is now playing');
      });

      playerRef.current.on('waiting', () => {
        console.log('Video is waiting for data');
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [proxyUrl]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin w-full h-auto rounded-lg"
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default SimpleVideoPlayer; 