"use client"; // Ensure this runs only on the client side

import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

//@ts-ignore
const VideoPlayer = ({ m3u8Url }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) {
      //@ts-ignore
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        sources: [
          {
            src: m3u8Url,
            type: "application/x-mpegURL",
          },
        ],
      });
    }

    return () => {
      if (playerRef.current) {
        //@ts-ignore
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [m3u8Url]);

  return (
    <div>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        width="640"
        height="360"
      ></video>
    </div>
  );
};

export default VideoPlayer;
