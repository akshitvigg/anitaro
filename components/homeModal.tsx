"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NavbarContainer } from "./navbar";

const images = [
  {
    src: "/aot.jpg",
    alt: "Attack on Titan",
    link: "/animeinfo/7ff2101d-5ff6-03f0-9584-e15c43fb8d7c",
    year: 2013,
    name: "Attack on Titan",
  },
  {
    src: "/dandadan.webp",
    alt: "Dandadan",
    link: "/animeinfo/f789184a-0479-abe3-14b9-155f323a125c",
    year: 2024,
    name: "Dandadan",
  },
  {
    src: "/saiki2.jpg",
    alt: "Saiki Kusuo",
    link: "/animeinfo/5ae6296f-20bd-cc99-7a3e-f4509075e2cc",
    year: 2016,
    name: "The Disastrous Life of Saiki K.",
  },
  {
    src: "/onepiece.jpeg",
    alt: "One Piece",
    link: "/animeinfo/d58fc9f8-582e-fdf0-3618-112cd54ed5ab",
    year: 1999,
    name: "One Piece",
  },
  {
    src: "/naruto.jpg",
    alt: "Naruto",
    link: "/animeinfo/78e38106-d9f3-a8b5-7974-9702f603dc96",
    year: 2002,
    name: "Naruto",
  },
  {
    src: "/ds.png",
    alt: "Demon Slayer",
    link: "/animeinfo/8d0c8929-47e2-a116-8c83-5b83afec7b1e",
    year: 2019,
    name: "Demon Slayer",
  },
];

export default function HomepageModal() {
  const [currImageIndex, setCurrImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <NavbarContainer />
      <div className=" pt-12 relative">
        <div className="flex justify-center">
          <div className="relative sm:w-[1350px] w-[340px] h-[470px]">
            <Image
              src={images[currImageIndex].src}
              alt={images[currImageIndex].alt}
              fill
              className="rounded-xl sm:object-cover sm:object-center"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>

            <div className="absolute bottom-8 left-8 z-10">
              <p className="text-white mb-1">{images[currImageIndex].year}</p>
              <p className="font-bold text-md sm:text-4xl text-white mb-3">
                {images[currImageIndex].name}
              </p>
              <Link
                href={images[currImageIndex].link}
                className="inline-block hover:bg-gray-300 active:scale-105 transition-all duration-300 font-semibold px-3 sm:px-4 rounded-md py-2 bg-white text-black"
              >
                Go To Show
              </Link>
            </div>

            <Link
              href={images[currImageIndex].link}
              className="absolute inset-0 rounded-xl"
              aria-label={`View ${images[currImageIndex].name}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
