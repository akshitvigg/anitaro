"use client";
import { CONSUMET_URL } from "@/config";
import { Button, Image } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import Link from "next/link";
import { Footer } from "./footer";

interface Anime {
  id: string;
  title: string;
  image: string;
  rating: number;
}

export const HomePageAnimes = () => {
  const [topanime, setTopanime] = useState<Anime[]>([]);
  const [activeButton, setActiveBtn] = useState("/top-airing");
  const [loading, setLoading] = useState<boolean>(true);
  const [btnLoading, setbtnLoading] = useState<boolean>(false);
  const [animeId, setAnimeid] = useState("");

  const getTrendinganime = async (path: string) => {
    try {
      setbtnLoading(true);
      const response = await axios.get<{ results: Anime[] }>(
        CONSUMET_URL + path
      );
      setTopanime(response.data.results);
      setActiveBtn(path);
    } catch (e) {
      console.log(e);
    } finally {
      setbtnLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getTrendinganime("/top-airing");
    setLoading(false);
  }, []);

  const getProxyImageUrl = (originalUrl: string) => {
    return `/api/manga-image?imageUrl=${encodeURIComponent(originalUrl)}`;
  };

  return (
    <div className=" min-h-screen mt-32  -translate-y-14 bg-[#0a0a0a]">
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
                activeButton === "/popular"
                  ? "bg-black text-white shadow-md"
                  : "bg-[#3f3f46] text-[#94949d] hover:bg-[#52525b] hover:text-white"
              }`}
              radius="sm"
              onPress={() => getTrendinganime("/popular")}
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
            <div className=" flex justify-center mt-10">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className=" flex justify-center">
              <div className=" sm:ml-[80px] ml-4 mr-4 sm:mr-[80px]   mt-16  grid gap-x-2 gap-y-4 sm:grid-cols-3">
                {topanime.map((anime) => (
                  <div className=" flex  col-span-1 " key={anime.id}>
                    <Link href={`/animeinfo/${anime.id}`}>
                      <div>
                        <Image
                          // isBlurred={true}
                          isZoomed
                          onClick={() => {
                            setAnimeid(anime.id);
                          }}
                          className=" hover:cursor-pointer mb-2 border border-[#3f3f46] object-cover"
                          loading="lazy"
                          width={440}
                          height={240}
                          radius="sm"
                          alt="anime images"
                          src={getProxyImageUrl(anime.image)}
                        />
                        <div className=" flex justify-between">
                          <div className=" mb-4 mt-1">
                            {anime.title.length > 60
                              ? anime.title.slice(0, 17) + "..."
                              : anime.title}
                          </div>
                          <div>
                            <Button
                              className=" bg-black border-[#3f3f46] border"
                              size="sm"
                            >
                              {anime.rating}
                            </Button>
                          </div>
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
