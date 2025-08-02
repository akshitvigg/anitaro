"use client";
import { Button, Image } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import Link from "next/link";
import { unique } from "next/dist/build/utils";

interface Anime {
  id: string;
  name: string;
  poster: string;
  episodes?: {
    sub: number;
    dub: number | null;
  };
}

export const HomePageAnimes = () => {
  const [topanime, setTopanime] = useState<Anime[]>([]);
  const [activeButton, setActiveBtn] = useState("/top-airing");
  const [loading, setLoading] = useState<boolean>(true);
  const [btnLoading, setbtnLoading] = useState<boolean>(false);
  const [animeId, setAnimeid] = useState("");

  const getTrendinganime = async (_path: string) => {
    try {
      setbtnLoading(true);
      const response = await axios.get("/api/home");
      //@ts-ignore
      const data = response.data.data;
      console.log(data);

      let animeGroup: Anime[] = [];

      if (_path === "/top-airing") {
        const combined = [
          ...data.spotlightAnimes,
          ...data.trendingAnimes,
          ...data.topAiringAnimes,
        ];
        animeGroup = removeDuplicateAnimes(combined);
      } else if (_path === "/most-popular") {
        const combined = [
          ...data.mostPopularAnimes,
          ...data.mostFavoriteAnimes,
          ...data.top10Animes.today,
          ...data.top10Animes.week,
          ...data.top10Animes.month,
        ];

        animeGroup = removeDuplicateAnimes(combined);
      } else if (_path === "/recent-episodes") {
        const combined = [
          ...data.latestEpisodeAnimes,
          ...data.latestCompletedAnimes,
          ...data.topUpcomingAnimes,
        ];
        animeGroup = removeDuplicateAnimes(combined);
      }

      setTopanime(animeGroup);
      setActiveBtn(_path);
    } catch (e) {
      console.log(e);
    } finally {
      setbtnLoading(false);
    }
  };

  function removeDuplicateAnimes(animes: Anime[]) {
    const uniqueMap = new Map();

    for (const anime of animes) {
      if (!uniqueMap.has(anime.id)) {
        uniqueMap.set(anime.id, anime);
      }
    }
    return Array.from(uniqueMap.values());
  }

  useEffect(() => {
    setLoading(true);
    getTrendinganime("/top-airing").then(() => setLoading(false));
  }, []);

  const getProxyImageUrl = (originalUrl: string) => {
    return `/api/manga-image?imageUrl=${encodeURIComponent(originalUrl)}`;
  };

  return (
    <div className="min-h-screen mt-32 -translate-y-14 bg-[#0a0a0a]">
      {loading ? (
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div>
          <div className="flex bg-[#3f3f46] sm:ml-[85px] ml-2 mr-2 sm:mr-[85px] rounded-xl py-2 px-2 shadow-lg justify-between">
            <Button
              className={`flex-1 py-2 transition-colors duration-300 ease-in-out rounded-lg text-center ${
                activeButton === "/top-airing"
                  ? "bg-black text-white shadow-md"
                  : "bg-[#3f3f46] text-[#94949d] hover:bg-[#52525b] hover:text-white"
              }`}
              radius="sm"
              onPress={() => getTrendinganime("/top-airing")}
            >
              Top Airing
            </Button>

            <Button
              className={`flex-1 py-2 transition-colors duration-300 ease-in-out rounded-lg text-center ${
                activeButton === "/most-popular"
                  ? "bg-black text-white shadow-md"
                  : "bg-[#3f3f46] text-[#94949d] hover:bg-[#52525b] hover:text-white"
              }`}
              radius="sm"
              onPress={() => getTrendinganime("/most-popular")}
            >
              Popular
            </Button>

            <Button
              className={`flex-1 py-2 transition-colors duration-300 ease-in-out rounded-lg text-center ${
                activeButton === "/recent-episodes"
                  ? "bg-black text-white shadow-md"
                  : "bg-[#3f3f46] text-[#94949d] hover:bg-[#52525b] hover:text-white"
              }`}
              radius="sm"
              onPress={() => getTrendinganime("/recent-episodes")}
            >
              Recent
            </Button>
          </div>

          {btnLoading ? (
            <div className="flex justify-center mt-10">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="sm:ml-[80px] ml-4 mr-4 sm:mr-[80px] mt-16 grid gap-x-2 gap-y-4 sm:grid-cols-3">
                {topanime.map((anime) => (
                  <div className="flex col-span-1" key={anime.id}>
                    <Link href={`/animeinfo/${anime.id}`}>
                      <div>
                        <Image
                          isZoomed
                          onClick={() => {
                            setAnimeid(anime.id);
                          }}
                          className="hover:cursor-pointer mb-2 border border-[#3f3f46] object-cover"
                          loading="lazy"
                          width={440}
                          height={240}
                          radius="sm"
                          alt="anime image"
                          src={getProxyImageUrl(anime.poster)}
                        />
                        <div className="mt-2">
                          {anime.name.length > 60
                            ? anime.name.slice(0, 17) + "..."
                            : anime.name}
                        </div>
                        <div className="text-gray-400">
                          {anime.episodes?.sub
                            ? `Episode ${anime.episodes.sub}`
                            : ""}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
