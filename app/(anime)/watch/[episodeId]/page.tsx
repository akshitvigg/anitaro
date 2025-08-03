"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Spinner } from "@nextui-org/react";
import { ArrowLeft, Play, AlertCircle } from "lucide-react";
import M3U8Player from "@/components/videoplayer";

interface StreamingData {
  headers: {
    Referer: string;
  };
  tracks: Array<{
    url: string;
    lang: string;
  }>;
  sources: Array<{
    url: string;
    type: string;
  }>;
  intro?: {
    start: number;
    end: number;
  };
  outro?: {
    start: number;
    end: number;
  };
}

const WatchPage = () => {
  const params = useParams();
  const router = useRouter();
  const episodeId = decodeURIComponent(params.episodeId as string);

  const [streamingData, setStreamingData] = useState<StreamingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchStreamingData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching data for episode:", episodeId);

      // Step 1: Get servers
      const serversResponse = await fetch(
        `/api/episode/servers?animeEpisodeId=${encodeURIComponent(episodeId)}`
      );

      if (!serversResponse.ok) {
        throw new Error(`Server request failed: ${serversResponse.status}`);
      }

      const serversData = await serversResponse.json();
      console.log("Servers data:", serversData);

      if (serversData.status !== 200 || !serversData.data) {
        throw new Error("No servers found for this episode");
      }

      // Step 2: Get first available server (prioritize sub > dub > raw)
      let selectedServer = "";
      let selectedCategory = "sub";

      if (serversData.data.sub && serversData.data.sub.length > 0) {
        selectedServer = serversData.data.sub[0].serverName;
        selectedCategory = "sub";
      } else if (serversData.data.dub && serversData.data.dub.length > 0) {
        selectedServer = serversData.data.dub[0].serverName;
        selectedCategory = "dub";
      } else if (serversData.data.raw && serversData.data.raw.length > 0) {
        selectedServer = serversData.data.raw[0].serverName;
        selectedCategory = "raw";
      } else {
        throw new Error("No servers available for this episode");
      }

      console.log("Selected server:", selectedServer, "Category:", selectedCategory);

      // Step 3: Get streaming sources
      const sourcesResponse = await fetch(
        `/api/episode/sources?animeEpisodeId=${encodeURIComponent(
          episodeId
        )}&server=${encodeURIComponent(
          selectedServer
        )}&category=${encodeURIComponent(selectedCategory)}`
      );

      if (!sourcesResponse.ok) {
        throw new Error(`Sources request failed: ${sourcesResponse.status}`);
      }

      const sourcesData = await sourcesResponse.json();
      console.log("Sources data:", sourcesData);

      if (sourcesData.status !== 200 || !sourcesData.data || !sourcesData.data.sources?.length) {
        throw new Error("No streaming sources found");
      }

      setStreamingData(sourcesData.data);
      console.log("✅ Stream ready:", {
        url: sourcesData.data.sources[0].url,
        referer: sourcesData.data.headers.Referer,
        subtitles: sourcesData.data.tracks?.length || 0
      });

    } catch (err) {
      console.error("❌ Streaming error:", err);
      setError(err instanceof Error ? err.message : "Failed to load episode");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (episodeId) {
      fetchStreamingData();
    }
  }, [episodeId]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchStreamingData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-800 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-xl mb-2">Loading Episode</h2>
          <p className="text-gray-500">Fetching streaming sources...</p>
          {retryCount > 0 && (
            <p className="text-gray-600 text-sm mt-2">Retry: {retryCount}</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-4">Playback Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-y-3">
            <Button
              color="primary"
              size="lg"
              onClick={handleRetry}
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              Try Again
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="w-full text-gray-400 hover:text-white hover:bg-gray-900"
            >
              Go Back
            </Button>
          </div>
          {retryCount > 2 && (
            <p className="text-gray-500 text-sm mt-4">
              If this keeps happening, try a different episode or check your connection.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:bg-gray-900 border border-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Video Player */}
        <div className="mb-8">
          <div className="w-full aspect-video bg-black rounded-lg border border-gray-800 overflow-hidden">
            {streamingData && streamingData.sources.length > 0 ? (
              <M3U8Player
                m3u8Url={streamingData.sources[0].url}
                referer={streamingData.headers.Referer}
                subtitles={streamingData.tracks || []}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <div className="text-center">
                  <Play className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">Unable to load video</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Episode Info */}
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h1 className="text-white text-xl font-medium">Now Playing</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="text-gray-500 block mb-1">Episode ID</span>
              <p className="text-white font-mono text-xs bg-gray-800 p-2 rounded border border-gray-700">
                {episodeId}
              </p>
            </div>
            
            {streamingData && (
              <>
                <div>
                  <span className="text-gray-500 block mb-1">Quality</span>
                  <p className="text-white">
                    {streamingData.sources[0]?.type?.includes('mpegURL') ? 'HLS Stream' : 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <span className="text-gray-500 block mb-1">Subtitles</span>
                  <p className="text-white">
                    {streamingData.tracks?.filter(t => t.lang !== 'thumbnails').length || 0} available
                  </p>
                </div>
              </>
            )}
          </div>
          
          {streamingData && ((streamingData.intro?.end ?? 0) > 0 || (streamingData.outro?.end ?? 0) > 0) && (
            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex gap-4 text-sm">
                {streamingData.intro && streamingData.intro.end > 0 && (
                  <div>
                    <span className="text-gray-500">Intro: </span>
                    <span className="text-white">{streamingData.intro.start}s - {streamingData.intro.end}s</span>
                  </div>
                )}
                {streamingData.outro && streamingData.outro.end > 0 && (
                  <div>
                    <span className="text-gray-500">Outro: </span>
                    <span className="text-white">{streamingData.outro.start}s - {streamingData.outro.end}s</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchPage;