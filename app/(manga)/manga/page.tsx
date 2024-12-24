"use client";
import { MANGA_URL } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Spinner, Button, Image } from "@nextui-org/react";
import Link from "next/link";
import MangaHomepageModal from "@/components/mangaHomeModal";

const MangaHomePage = () => {
  const [mangaData, setMangadata] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeButton, setActiveBtn] = useState("/trending");
  const [btnLoading, setbtnLoading] = useState<boolean>(false);
  const [mangaId, setMangaId] = useState<string>("");

  const getManga = async (path: string) => {
    setbtnLoading(true);
    const response: any = await axios.get(`${MANGA_URL}/mangadex/${path}`);
    setMangadata(response.data.results);
    setActiveBtn(path);
    setbtnLoading(false);
  };

  useEffect(() => {
    getManga("popular").then(() => setLoading(false));
  }, []);

  const getProxyImageUrl = (originalUrl: string) => {
    return `/api/manga-image?imageUrl=${encodeURIComponent(originalUrl)}`;
  };

  return (
    <div>
      <div className=" min-h-screen font-mono  -translate-y-14 bg-[#0a0a0a]">
        <MangaHomepageModal />
        {loading ? (
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div>
            <div className="flex bg-[#3f3f46] sm:ml-[85px] ml-2 mr-2 sm:mr-[85px] rounded-xl py-2 px-2 shadow-lg justify-between">
              <Button
                className={`flex-1 py-2 transition-colors duration-300 ease-in-out rounded-lg text-center ${
                  activeButton === "trending"
                    ? "bg-black text-white shadow-md"
                    : "bg-[#3f3f46] text-[#94949d] hover:bg-[#52525b] hover:text-white"
                }`}
                radius="sm"
                onPress={() => getManga("trending")}
              >
                Trending
              </Button>

              <Button
                className={`flex-1 py-2 transition-colors duration-300 ease-in-out rounded-lg text-center ${
                  activeButton === "popular"
                    ? "bg-black text-white shadow-md"
                    : "bg-[#3f3f46] text-[#94949d] hover:bg-[#52525b] hover:text-white"
                }`}
                radius="sm"
                onPress={() => getManga("popular")}
              >
                Popular
              </Button>

              <Button
                className={`flex-1 py-2 transition-colors duration-300 ease-in-out rounded-lg text-center ${
                  activeButton === "recent"
                    ? "bg-black text-white shadow-md"
                    : "bg-[#3f3f46] text-[#94949d] hover:bg-[#52525b] hover:text-white"
                }`}
                radius="sm"
                onPress={() => getManga("recent")}
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
                <div className=" sm:ml-[80px] ml-4 mr-4 sm:mr-[80px] mt-16 grid gap-x-4 gap-y-4 sm:grid-cols-3">
                  {mangaData.map((manga) => (
                    <div
                      className="flex col-span-1"
                      key={`${manga.id}-${manga.title}`}
                    >
                      <Link href={`/mangainfo/${manga.id}`}>
                        <div>
                          <Image
                            isZoomed
                            onClick={() => setMangaId(manga.id)}
                            className="hover:cursor-pointer mb-2 border border-[#3f3f46] object-cover"
                            loading="lazy"
                            width={440}
                            height={240}
                            radius="sm"
                            alt="manga images"
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
        )}
      </div>
    </div>
  );
};

export default MangaHomePage;
