"use client";

import { Button, Image, Spinner } from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState, use } from "react";

interface Anidata {
  id: string;
  name: string;
  poster: string;
  type: string;
  episodes?: {
    sub: number;
    dub: number | null;
  };
}

const Animedata = ({ params }: any) => {
  const searchquery: any = use(params);
  const animename = searchquery.animename;
  const [loading, setLoading] = useState<boolean>(true);
  const [aniData, setanidata] = useState<Anidata[]>([]);

  const getAnidata = async () => {
    const response = await axios.get(`/api/search?q=${animename}`);
    //@ts-ignore
    setanidata(response.data.data.animes);
    setLoading(false);
  };

  useEffect(() => {
    getAnidata();
  }, [animename]);

  const getProxyImageUrl = (originalUrl: string) => {
    return `/api/manga-image?imageUrl=${encodeURIComponent(originalUrl)}`;
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center mb-80 mt-52">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex font-mono justify-center">
          <div className="ml-4 mr-4 sm:ml-[80px] sm:mr-[80px] mt-32 mb-16 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 gap-y-5">
            {aniData.map((anime) => (
              <div key={anime.id}>
                <Link href={`/animeinfo/${anime.id}`}>
                  <div>
                    <Image
                      isZoomed
                      className="mb-3 border border-[#3f3f46] object-cover"
                      loading="lazy"
                      width={400}
                      height={240}
                      radius="sm"
                      src={getProxyImageUrl(anime.poster)}
                    />
                    <div className="mb-2 text-sm">
                      {anime.name.length > 50
                        ? anime.name.slice(0, 50) + "..."
                        : anime.name}
                    </div>
                    <div className="flex  items-center ">
                      <Button
                        className="bg-black border-[#3f3f46] border"
                        size="sm"
                      >
                        {anime.type}
                      </Button>
                      {anime.episodes?.sub && (
                        <span className="text-sm text-gray-400 pl-52 sm:pl-[247px]">
                          Episodes {anime.episodes.sub}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Animedata;
