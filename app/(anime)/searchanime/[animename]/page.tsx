"use client";
import { CONSUMET_URL } from "@/config";
import { Image, Spinner } from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState, use } from "react";

interface Anidata {
  id: string;
  name: string;
  poster: string;
  // releaseDate: string;
  // subOrDub: string;
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
        <div className=" flex justify-center mb-80 mt-52">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className=" flex justify-center">
          <div className=" sm:ml-[80px] ml-4 mr-4 sm:mr-[80px]  mt-32 mb-16  sm:mt-12  grid gap-x-5 gap-y-4 sm:grid-cols-3">
            {aniData.map((anime) => (
              <div className="   col-span-1 " key={anime.id}>
                <Link href={`/animeinfo/${anime.id}`}>
                  <div>
                    <Image
                      // isBlurred={true}
                      isZoomed
                      className=" mb-2 border border-[#3f3f46] object-cover"
                      loading="lazy"
                      width={400}
                      height={240}
                      radius="sm"
                      src={getProxyImageUrl(anime.poster)}
                    />

                    {anime.name.length > 60
                      ? anime.name.slice(0, 17) + "..."
                      : anime.name}
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
