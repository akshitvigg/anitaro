"use client";
import React, { useEffect, useState, useRef } from "react";
import { CONSUMET_URL } from "@/config";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import "video.js/dist/video-js.css";
import videojs from "video.js";

type paramsType = Promise<{ id: string }>;

const WatchEpisode = ({ params }: { params: paramsType }) => {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(
    null
  );
  const [episodeData, setEpisodeData] = useState<any>(null);
  const [selectedServer, setSelectedServer] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setUnwrappedParams(resolvedParams);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (unwrappedParams) {
      const { id } = unwrappedParams;
      const getEpisode = async () => {
        try {
          const response = await axios.get(`${CONSUMET_URL}/watch/${id}`);
          setEpisodeData(response.data);
        } catch (error) {
          console.error("Failed to fetch episode data:", error);
        }
      };
      getEpisode();
    }
  }, [unwrappedParams]);

  useEffect(() => {
    if (episodeData && episodeData.sources?.length > 0) {
      const player = videojs(videoRef.current!, {
        controls: true,
        responsive: true,
        fluid: true,
        autoplay: true,
        sources: [
          {
            src: `https://m3u8proxy-dsu3.onrender.com/m3u8-proxy?url=${episodeData.sources[selectedServer]?.url}`,
            type: "application/x-mpegURL",
          },
        ],
      });

      return () => {
        if (player) {
          player.dispose();
        }
      };
    }
  }, [episodeData, selectedServer]);

  if (!unwrappedParams) {
    return <p>Loading...</p>;
  }

  if (!episodeData) {
    return (
      <div className="flex justify-center mt-52">
        <Spinner size="lg" className="mb-72" />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-mono font-bold">
      <main className="container mx-auto px-4 pt-20">
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-lg">
          <video
            ref={videoRef}
            className="video-js vjs-default-skin w-full h-full"
          />
        </div>

        <div className="mt-6 bg-zinc-800 rounded-lg p-4">
          <h1 className="text-xl text-white font-bold">Available Servers</h1>

          <div className="mt-4">
            {episodeData.sources?.length > 1 ? (
              <div className="flex flex-wrap gap-2">
                {episodeData.sources.map((server: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedServer(index)}
                    className={`px-4 py-2 rounded ${
                      selectedServer === index
                        ? "bg-white text-black"
                        : "bg-zinc-700 text-gray-200 hover:bg-gray-600"
                    }`}
                  >
                    Server {index + 1}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-white">Only one server available</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WatchEpisode;
