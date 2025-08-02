"use client";
import React, { useRef, useEffect } from "react";
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
  const videoRef = useRef(null);
  const playerRef = useRef<any>(null);

  const proxyUrl = `https://rust-proxy-m3u8.onrender.com/?url=${encodeURIComponent(
    m3u8Url
  )}&headers=${encodeURIComponent(JSON.stringify({ Referer: referer }))}`;

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        fluid: true,
        preload: "auto",
        sources: [
          {
            src: proxyUrl,
            type: "application/x-mpegURL",
          },
        ],
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
      >
        {subtitles.map((track, index) => (
          <track
            key={index}
            src={track.url}
            label={track.lang}
            kind="subtitles"
            srcLang={track.lang.slice(0, 2).toLowerCase()}
            default={track.lang === "English"}
          />
        ))}
      </video>
    </div>
  );
};

export default M3U8Player;
