"use client";

import EpisodeContainer from "@/components/episodecontainer";
import { Button, Image, Spinner } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState, use } from "react";

export default function AnimeInfo({ params }: any) {
  const resolvedParams: any = use(params);
  const animeid = resolvedParams.animeid;
  const [anidata, setAnindata] = useState<any>(null);

  const getAllaboutthatanime = async () => {
    try {
      // Use your local API route instead of direct external API call
      const response = await axios.get(`/api/anime/${animeid}`);

      // Extract and restructure the data to match your existing component structure
      //@ts-ignore
      const apiData = response.data.data;
      const animeInfo = apiData.anime.info;
      const moreInfo = apiData.anime.moreInfo;

      // Map the new API structure to your existing structure
      const restructuredData = {
        title: animeInfo.name,
        image: animeInfo.poster,
        description: animeInfo.description,
        genres: moreInfo.genres, // This is already an array
        rating: animeInfo.stats.rating,
        status: moreInfo.status,
        releaseDate: moreInfo.aired,
        // Additional data you might want to use
        type: animeInfo.stats.type,
        duration: animeInfo.stats.duration,
        episodes: animeInfo.stats.episodes,
        malScore: moreInfo.malscore,
        studios: moreInfo.studios,
        premiered: moreInfo.premiered,
        japanese: moreInfo.japanese,
        seasons: apiData.seasons,
      };

      setAnindata(restructuredData);
    } catch (error) {
      console.error("Failed to fetch anime data:", error);
    }
  };

  useEffect(() => {
    if (animeid) {
      getAllaboutthatanime();
    }
  }, [animeid]);

  const getProxyImageUrl = (originalUrl: string) => {
    return `/api/manga-image?imageUrl=${encodeURIComponent(originalUrl)}`;
  };

  if (!anidata) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative">
          <Spinner size="lg" className="w-20 ml-9 h-20" />
          <div className="mt-4 text-gray-400 text-lg animate-pulse">
            Loading your anime...
          </div>
        </div>
      </div>
    );
  }

  // Since genres is already an array from the new API, we don't need the string processing
  const genres = Array.isArray(anidata.genres) ? anidata.genres : [];

  return (
    <div>
      <div className="bg-gradient-to-b font-mono from-black to-neutral-900 min-h-screen">
        <div
          className="absolute top-0 left-0 w-full h-[400px] bg-cover bg-center opacity-10 blur-sm"
          style={{ backgroundImage: `url(${getProxyImageUrl(anidata.image)})` }}
        />

        <div className="relative z-10">
          <div className="w-full h-48 bg-gradient-to-b from-black/90 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 -mt-24">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3">
                <div className="relative group">
                  <Image
                    className="object-cover rounded-lg shadow-2xl shadow-amber-500/10 
                           transition-transform duration-300 group-hover:scale-[1.02]"
                    src={getProxyImageUrl(anidata.image)}
                    width={350}
                    height={500}
                    alt={anidata.title || "Anime cover"}
                  />
                  <div
                    className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 via-transparent to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </div>

              <div className="lg:w-2/3 space-y-6">
                <h1
                  className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                           from-neutral-200 to-gray-400"
                >
                  {anidata.title}
                </h1>

                {/* Japanese title if available */}
                {anidata.japanese && (
                  <h2 className="text-xl text-gray-400 font-medium">
                    {anidata.japanese}
                  </h2>
                )}

                <div className="bg-black backdrop-blur-sm rounded-lg p-6 shadow-xl border border-neutral-800">
                  <p className="text-gray-300 leading-relaxed">
                    {anidata.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">Genres</h2>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre: string, index: number) => (
                      <Button
                        key={index}
                        className="bg-black hover:bg-neutral-800 
                               border border-amber-900/30 backdrop-blur-sm transition-all
                               hover:scale-105 hover:shadow-lg hover:shadow-amber-500/10"
                        variant="bordered"
                        size="sm"
                        radius="lg"
                      >
                        {genre}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Updated info grid with new fields */}
                <div
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-black backdrop-blur-sm 
                             rounded-lg p-4 mt-6 border border-neutral-800"
                >
                  {anidata.rating && (
                    <div className="space-y-1">
                      <h3 className="text-amber-200 text-sm">Rating</h3>
                      <p className="text-white font-semibold">
                        {anidata.rating}
                      </p>
                    </div>
                  )}
                  {anidata.status && (
                    <div className="space-y-1">
                      <h3 className="text-gray-400 text-sm">Status</h3>
                      <p className="text-white font-semibold">
                        {anidata.status}
                      </p>
                    </div>
                  )}
                  {anidata.releaseDate && (
                    <div className="space-y-1">
                      <h3 className="text-gray-400 text-sm">Aired</h3>
                      <p className="text-white font-semibold">
                        {anidata.releaseDate}
                      </p>
                    </div>
                  )}
                  {anidata.type && (
                    <div className="space-y-1">
                      <h3 className="text-gray-400 text-sm">Type</h3>
                      <p className="text-white font-semibold">{anidata.type}</p>
                    </div>
                  )}
                  {anidata.duration && (
                    <div className="space-y-1">
                      <h3 className="text-gray-400 text-sm">Duration</h3>
                      <p className="text-white font-semibold">
                        {anidata.duration}
                      </p>
                    </div>
                  )}
                  {anidata.studios && (
                    <div className="space-y-1">
                      <h3 className="text-gray-400 text-sm">Studio</h3>
                      <p className="text-white font-semibold">
                        {anidata.studios}
                      </p>
                    </div>
                  )}
                  {anidata.episodes && (
                    <div className="space-y-1">
                      <h3 className="text-gray-400 text-sm">Episodes</h3>
                      <p className="text-white font-semibold">
                        Sub: {anidata.episodes.sub} | Dub:{" "}
                        {anidata.episodes.dub}
                      </p>
                    </div>
                  )}
                  {anidata.malScore && anidata.malScore !== "?" && (
                    <div className="space-y-1">
                      <h3 className="text-amber-200 text-sm">MAL Score</h3>
                      <p className="text-white font-semibold">
                        {anidata.malScore}
                      </p>
                    </div>
                  )}
                  {anidata.premiered && (
                    <div className="space-y-1">
                      <h3 className="text-gray-400 text-sm">Premiered</h3>
                      <p className="text-white font-semibold">
                        {anidata.premiered}
                      </p>
                    </div>
                  )}
                </div>

                {/* Season selector if multiple seasons available */}
                {anidata.seasons && anidata.seasons.length > 1 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">
                      Seasons
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {anidata.seasons.map((season: any, index: number) => (
                        <Button
                          key={index}
                          className={`${
                            season.isCurrent
                              ? "bg-amber-900/50 border-amber-500"
                              : "bg-black hover:bg-neutral-800"
                          } border border-amber-900/30 backdrop-blur-sm transition-all
                               hover:scale-105 hover:shadow-lg hover:shadow-amber-500/10`}
                          variant="bordered"
                          size="sm"
                          radius="lg"
                        >
                          {season.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>{/* <EpisodeContainer anidata={anidata} /> */}</div>
        </div>
      </div>
    </div>
  );
}
