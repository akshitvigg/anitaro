"use client";
import React, { useEffect, useState } from "react";
import { CONSUMET_URL } from "@/config";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import { NavbarContainer } from "@/components/navbar";

type paramsType = Promise<{ id: string; episodes: string }>;

const WatchEpisode = ({ params }: { params: paramsType }) => {
  const [unwrappedParams, setUnwrappedParams] = useState<{
    id: string;
    episodes: string;
  } | null>(null);
  const [episodeData, setEpisodeData] = useState<any>(null);
  const [selectedServer, setSelectedServer] = useState(0);

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setUnwrappedParams(resolvedParams);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (unwrappedParams) {
      const { id, episodes } = unwrappedParams;
      const getEpisode = async () => {
        try {
          const response = await axios.get(
            `${CONSUMET_URL}/servers/${id}-episode-${episodes}`
          );
          setEpisodeData(response.data);
        } catch (error) {
          console.error("Failed to fetch episode data:", error);
        }
      };
      getEpisode();
    }
  }, [unwrappedParams]);

  if (!unwrappedParams) {
    return <p>Loading...</p>;
  }

  if (!episodeData) {
    return (
      <div>
        <NavbarContainer />
        <div className="flex justify-center mt-52">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-mono font-bold">
      <NavbarContainer />

      <main className="container mx-auto px-4 pt-20">
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-lg">
          <iframe
            src={episodeData[selectedServer]?.url}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen"
          />
        </div>

        <div className="mt-6 bg-zinc-800 rounded-lg p-4">
          <h1 className="text-xl text-white font-bold">
            Episode {unwrappedParams.episodes}
          </h1>

          <div className="mt-4">
            <h2 className="text-lg text-white mb-2">Available Servers:</h2>
            <div className="flex flex-wrap gap-2">
              {episodeData.map((server: any, index: number) => (
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
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            className="bg-white text-black  px-6 py-2 rounded hover:bg-gray-300"
            onClick={() => {
              const currentEp = parseInt(unwrappedParams.episodes);
              if (currentEp > 1) {
                window.location.href = `/${unwrappedParams.id}/${
                  currentEp - 1
                }`;
              }
            }}
          >
            Previous Episode
          </button>
          <button
            className="bg-white text-black  px-6 py-2 rounded hover:bg-gray-300"
            onClick={() => {
              const currentEp = parseInt(unwrappedParams.episodes);
              window.location.href = `/${unwrappedParams.id}/${currentEp + 1}`;
            }}
          >
            Next Episode
          </button>
        </div>
      </main>
    </div>
  );
};

export default WatchEpisode;
