"use client";
import { MangaNavbar } from "@/components/mangaNavbar";
import { MANGA_URL } from "@/config";
import { Button, Image, Spinner } from "@nextui-org/react";
import axios from "axios";

import Link from "next/link";
import { useEffect, useState, use } from "react";

interface MangaData {
  id: string;
  title: string;
  image: string;
  status: string;
}

const GetsearchManga = ({ params }: any) => {
  const searchquery: any = use(params);
  const mangaid = searchquery.mangaid;
  const [loading, setLoading] = useState<boolean>(true);

  const [mangaData, setmangadata] = useState<MangaData[]>([]);
  const getMangadata = async () => {
    const response = await axios.get<{ results: any[] }>(
      `${MANGA_URL}/mangadex/${mangaid}`
    );
    setmangadata(response.data.results);
    setLoading(false);
  };

  useEffect(() => {
    getMangadata();
  }, [mangaid]);
  const getProxyImageUrl = (originalUrl: string) => {
    return `/api/manga-image?imageUrl=${encodeURIComponent(originalUrl)}`;
  };
  return (
    <div>
      <MangaNavbar />
      {loading ? (
        <div className=" flex justify-center mb-80 mt-52">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className=" flex justify-center">
          <div className=" sm:ml-[80px] ml-4 mr-4 sm:mr-[80px]   mt-32 mb-16  sm:mt-12  grid gap-x-5 gap-y-4 sm:grid-cols-3">
            {mangaData.map((manga) => (
              <div className="   col-span-1 " key={manga.id}>
                <Link href={`/mangainfo/${manga.id}`}>
                  <div>
                    <Image
                      // isBlurred={true}
                      isZoomed
                      className=" mb-2 border border-[#3f3f46] object-cover"
                      loading="lazy"
                      width={400}
                      height={240}
                      radius="sm"
                      src={getProxyImageUrl(manga.image)}
                    />

                    <div className=" flex justify-between">
                      <div className=" mb-4 mt-1">
                        {manga.title.length > 60
                          ? manga.title.slice(0, 17) + "..."
                          : manga.title}
                      </div>
                      <div>
                        <Button
                          className=" bg-black border-[#3f3f46] border"
                          size="sm"
                        >
                          {manga.status}
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
  );
};
export default GetsearchManga;
