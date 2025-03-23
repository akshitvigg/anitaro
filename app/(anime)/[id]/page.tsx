"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import "video.js/dist/video-js.css";
import videojs from "video.js";
import { CONSUMET_URL } from "@/config";

const M3U8_PROXY =
  "https://gogoanime-and-hianime-proxy-3.onrender.com/m3u8-proxy?url=";

type StreamingService = {
  name: string;
  id: string;
  hasSubtitles: boolean;
};

const STREAMING_SERVICES: StreamingService[] = [
  { name: "Default", id: "default", hasSubtitles: true },
  { name: "VidStreaming", id: "vidstreaming", hasSubtitles: true },
  { name: "VidCloud", id: "vidcloud", hasSubtitles: true },
];

type ParamsType = Promise<{ id: string }>;

const WatchEpisode = ({ params }: { params: ParamsType }) => {
  const [episodeData, setEpisodeData] = useState<any>(null);
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedSubtitle, setSelectedSubtitle] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>("default");
  const [serviceData, setServiceData] = useState<any>(null);

  const videoRef = useRef(null);
  const playerRef = useRef<any>(null);
  const playerInitialized = useRef(false);

  const findEnglishSubtitleIndex = (subtitles: any[]): number | null => {
    const engIndex = subtitles.findIndex(
      (sub) => sub.lang && sub.lang.toLowerCase() === "english"
    );
    if (engIndex !== -1) return engIndex;

    const engCodeIndex = subtitles.findIndex(
      (sub) => sub.lang && sub.lang.toLowerCase() === "eng"
    );
    if (engCodeIndex !== -1) return engCodeIndex;

    return null;
  };

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        setIsLoading(true);
        const { id } = await params;

        const response = await axios.get(`${CONSUMET_URL}/watch/${id}`);
        setEpisodeData(response.data);

        //@ts-ignore
        if (response.data.subtitles && response.data.subtitles.length > 0) {
          //@ts-ignore
          const engSubIndex = findEnglishSubtitleIndex(response.data.subtitles);
          if (engSubIndex !== null) {
            setSelectedSubtitle(engSubIndex);
          } else {
            setSelectedSubtitle(0);
          }
        }
      } catch (error) {
        console.error("Failed to fetch episode data:", error);
        setError("Failed to load episode. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpisode();
  }, [params]);

  useEffect(() => {
    const fetchServiceData = async () => {
      if (!episodeData || selectedService === "default") {
        setServiceData(null);
        return;
      }

      try {
        setIsLoading(true);

        if (playerRef.current && playerInitialized.current) {
          try {
            playerRef.current.pause();
            playerRef.current.dispose();
          } catch (e) {
            console.warn("Error disposing player:", e);
          }
          playerRef.current = null;
          playerInitialized.current = false;
        }

        const { id } = await params;

        const response = await axios.get(
          `${CONSUMET_URL}/watch/${id}?server=${selectedService}`
        );
        setServiceData(response.data);

        setSelectedServer(0);

        //@ts-ignore
        if (response.data.subtitles && response.data.subtitles.length > 0) {
          //@ts-ignore
          const engSubIndex = findEnglishSubtitleIndex(response.data.subtitles);
          if (engSubIndex !== null) {
            setSelectedSubtitle(engSubIndex);
          } else {
            setSelectedSubtitle(0);
          }
        } else {
          setSelectedSubtitle(null);
        }
      } catch (error) {
        console.error(`Failed to fetch data from ${selectedService}:`, error);
        setError(
          `Failed to load from ${selectedService}. Please try another source.`
        );

        setSelectedService("default");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceData();
  }, [params, selectedService]);

  useEffect(() => {
    const currentData =
      selectedService === "default" ? episodeData : serviceData;

    if (
      !currentData ||
      !currentData.sources ||
      currentData.sources.length === 0
    )
      return;

    const sourceUrl = currentData.sources[selectedServer]?.url;
    if (!sourceUrl) return;

    const proxiedUrl = `${M3U8_PROXY}${sourceUrl}`;

    const subtitleTrack =
      selectedSubtitle !== null && currentData.subtitles
        ? currentData.subtitles[selectedSubtitle]
        : null;

    if (playerRef.current && playerInitialized.current) {
      try {
        playerRef.current.pause();
        playerRef.current.dispose();
      } catch (e) {
        console.warn("Error disposing player:", e);
      }
      playerRef.current = null;
      playerInitialized.current = false;
    }

    if (!videoRef.current) {
      console.warn("Video element not found");
      return;
    }

    const playerOptions = {
      controls: true,
      responsive: true,
      fluid: true,
      autoplay: false,
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      sources: [{ src: proxiedUrl, type: "application/x-mpegURL" }],
      html5: {
        vhs: {
          overrideNative: true,
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false,
      },
    };

    try {
      playerRef.current = videojs(videoRef.current, playerOptions);
      playerInitialized.current = true;

      if (subtitleTrack) {
        playerRef.current.ready(() => {
          try {
            playerRef.current.addRemoteTextTrack(
              {
                kind: "subtitles",
                srclang: subtitleTrack.lang || "en",
                label:
                  subtitleTrack.label ||
                  subtitleTrack.lang ||
                  //@ts-ignore
                  `Subtitle ${selectedSubtitle + 1}`,
                src: subtitleTrack.url,
                default: true,
              },
              false
            );
          } catch (e) {
            console.error("Error adding subtitle track:", e);
          }
        });
      }
    } catch (error) {
      console.error("Error initializing video player:", error);
      setError("Failed to initialize video player. Please try another source.");
    }

    return () => {
      if (playerRef.current && playerInitialized.current) {
        try {
          playerRef.current.pause();
          playerRef.current.dispose();
        } catch (e) {
          console.warn("Error disposing player during cleanup:", e);
        }
        playerRef.current = null;
        playerInitialized.current = false;
      }
    };
  }, [episodeData, serviceData, selectedServer, selectedSubtitle]);

  const changeStreamingService = (serviceId: string) => {
    if (playerRef.current && playerInitialized.current) {
      try {
        playerRef.current.pause();
        playerRef.current.dispose();
      } catch (e) {
        console.warn("Error disposing player when changing service:", e);
      }
      playerRef.current = null;
      playerInitialized.current = false;
    }

    setSelectedService(serviceId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-red-100 rounded-lg">
          <h2 className="text-xl text-red-800 mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => {
              setError(null);
              changeStreamingService("default");
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Default Source
          </button>
        </div>
      </div>
    );
  }

  const currentData = selectedService === "default" ? episodeData : serviceData;

  return (
    <div className="min-h-screen font-mono font-bold bg-zinc-900">
      <main className="container mx-auto px-4 pt-16 pb-8">
        {currentData?.title && (
          <h1 className="text-2xl text-white mb-4">{currentData.title}</h1>
        )}

        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl">
          <video
            ref={videoRef}
            className="video-js vjs-big-play-centered vjs-theme-city w-full h-full"
            data-setup="{}"
          />
        </div>

        <div className="mt-6 bg-zinc-800 rounded-lg p-4 shadow-lg">
          <h2 className="text-xl text-white font-bold mb-3">
            Streaming Services
          </h2>
          <div className="flex flex-wrap gap-2">
            {STREAMING_SERVICES.map((service) => (
              <button
                key={`service-${service.id}`}
                onClick={() => changeStreamingService(service.id)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedService === service.id
                    ? "bg-white text-black font-bold"
                    : "bg-zinc-700 text-gray-200 hover:bg-zinc-600"
                }`}
              >
                {service.name}
              </button>
            ))}
          </div>
        </div>

        {currentData &&
          currentData.sources &&
          currentData.sources.length > 0 && (
            <div className="mt-4 bg-zinc-800 rounded-lg p-4 shadow-lg">
              <h2 className="text-xl text-white font-bold mb-3">
                Video Sources
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentData.sources.map((source: any, index: number) => (
                  <button
                    key={`server-${index}`}
                    onClick={() => setSelectedServer(index)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      selectedServer === index
                        ? "bg-white text-black font-bold"
                        : "bg-zinc-700 text-gray-200 hover:bg-zinc-600"
                    }`}
                  >
                    Server {index + 1}{" "}
                    {source.quality ? `(${source.quality})` : ""}
                  </button>
                ))}
              </div>
            </div>
          )}

        {currentData &&
          currentData.subtitles &&
          currentData.subtitles.length > 0 && (
            <div className="mt-4 bg-zinc-800 rounded-lg p-4 shadow-lg">
              <h2 className="text-xl text-white font-bold mb-3">Subtitles</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSubtitle(null)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedSubtitle === null
                      ? "bg-white text-black font-bold"
                      : "bg-zinc-700 text-gray-200 hover:bg-zinc-600"
                  }`}
                >
                  None
                </button>
                {currentData.subtitles.map((subtitle: any, index: number) => (
                  <button
                    key={`subtitle-${index}`}
                    onClick={() => setSelectedSubtitle(index)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      selectedSubtitle === index
                        ? "bg-white text-black font-bold"
                        : "bg-zinc-700 text-gray-200 hover:bg-zinc-600"
                    }`}
                  >
                    {subtitle.label || subtitle.lang || `Subtitle ${index + 1}`}
                  </button>
                ))}
              </div>
            </div>
          )}

        {currentData && currentData.description && (
          <div className="mt-4 bg-zinc-800 rounded-lg p-4 shadow-lg">
            <h2 className="text-xl text-white font-bold mb-2">Description</h2>
            <p className="text-gray-300">{currentData.description}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WatchEpisode;
