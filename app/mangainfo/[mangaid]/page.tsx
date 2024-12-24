"use client";

import { MANGA_URL } from "@/config";
import { Button, Image, Spinner } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState, use } from "react";
import MangaChapContainer from "@/components/mangaChapContainer";
import { MangaNavbar } from "@/components/mangaNavbar";

export default function MangaInfo({ params }: any) {
  const resolvedParams: any = use(params);
  const mangaid = resolvedParams.mangaid;
  const [mangadata, setMangadata] = useState<any>(null);

  const getAllaboutthatanime = async () => {
    try {
      const response = await axios.get(`${MANGA_URL}/mangadex/info/${mangaid}`);
      setMangadata(response.data);
    } catch (error) {
      console.error("Failed to fetch anime data:", error);
    }
  };

  useEffect(() => {
    if (mangaid) {
      getAllaboutthatanime();
    }
  }, [mangaid]);
  if (!mangadata) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <div className="relative">
          <Spinner size="lg" className="w-20 ml-9 h-20" />
          <div className="mt-4 text-gray-400 text-lg animate-pulse">
            Loading your manga...
          </div>
        </div>
      </div>
    );
  }

  const genres =
    mangadata && Array.isArray(mangadata.genres)
      ? mangadata.genres
      : typeof mangadata?.genres === "string"
      ? mangadata.genres.split(",").map((genre: string) => genre.trim())
      : [];

  const getProxyImageUrl = (originalUrl: string) => {
    return `/api/manga-image?imageUrl=${encodeURIComponent(originalUrl)}`;
  };
  console.log(mangadata);

  return (
    <div>
      <MangaNavbar />
      <div className="bg-gradient-to-b font-mono from-black to-neutral-900 min-h-screen">
        <div
          className="absolute top-0 left-0 w-full h-[400px] bg-cover bg-center opacity-10 blur-sm"
          style={{
            backgroundImage: `url(${getProxyImageUrl(mangadata.image)})`,
          }}
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
                    src={getProxyImageUrl(mangadata.image)}
                    width={350}
                    height={500}
                    alt={mangadata.title || "Manga cover"}
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
                  {mangadata.title || "Default Title"}
                </h1>

                <div className="bg-black backdrop-blur-sm rounded-lg p-6 shadow-xl border border-neutral-800">
                  <p className="text-gray-300 leading-relaxed">
                    {mangadata.description?.en || "No desc"}
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

                {(mangadata.rating ||
                  mangadata.status ||
                  mangadata.releaseDate) && (
                  <div
                    className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-black backdrop-blur-sm 
                               rounded-lg p-4 mt-6 border border-neutral-800"
                  >
                    {mangadata.rating && (
                      <div className="space-y-1">
                        <h3 className="text-amber-200 text-sm">Rating</h3>
                        <p className="text-white font-semibold">
                          {mangadata.rating}
                        </p>
                      </div>
                    )}
                    {mangadata.status && (
                      <div className="space-y-1">
                        <h3 className="text-gray-400 text-sm">Status</h3>
                        <p className="text-white font-semibold">
                          {mangadata.status}
                        </p>
                      </div>
                    )}
                    {mangadata.releaseDate && (
                      <div className="space-y-1">
                        <h3 className="text-gray-400 text-sm">Released</h3>
                        <p className="text-white font-semibold">
                          {mangadata.releaseDate}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <MangaChapContainer mangadata={mangadata} />
          </div>
        </div>
      </div>
    </div>
  );
}
