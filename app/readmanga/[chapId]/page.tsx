"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ZoomIn,
  ZoomOut,
  Maximize,
} from "lucide-react";
import { MANGA_URL } from "@/config";
import { MangaNavbar } from "@/components/mangaNavbar";

interface Page {
  img: string;
  page: number;
}

const ReadManga = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [chapid, setChapid] = useState<string | undefined>(undefined);
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (pathname) {
      const chapidFromUrl = pathname.split("/")[2];
      setChapid(chapidFromUrl);
    }
  }, [pathname]);

  useEffect(() => {
    if (!chapid) return;

    const fetchMangaPages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${MANGA_URL}/mangadex/read/${chapid}`);
        const data: Page[] = await response.json();
        setPages(data);
      } catch (error) {
        console.error("Failed to fetch manga pages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMangaPages();
  }, [chapid]);

  const handleNextPage = () => {
    setImageLoading(true);
    setCurrentPageIndex((prev) => (prev < pages.length - 1 ? prev + 1 : prev));
    resetZoomAndPosition();
  };

  const handlePrevPage = () => {
    setImageLoading(true);
    setCurrentPageIndex((prev) => (prev > 0 ? prev - 1 : prev));
    resetZoomAndPosition();
  };

  const resetZoomAndPosition = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handleNextPage();
    } else if (e.key === "ArrowRight") {
      handlePrevPage();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPageIndex, pages.length]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      const newZoom = Math.min(Math.max(zoom + delta, 0.5), 3);
      setZoom(newZoom);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    resetZoomAndPosition();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-lg text-gray-300 animate-pulse">
            Loading manga...
          </p>
        </div>
      </div>
    );
  }

  if (!pages.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-xl text-gray-300 bg-zinc-900 p-8 rounded-lg">
          No pages found for this chapter.
        </div>
      </div>
    );
  }
  const getProxyImageUrl = (originalUrl: string) => {
    return `/api/manga-image?imageUrl=${encodeURIComponent(originalUrl)}`;
  };

  return (
    <div>
      <MangaNavbar />
      <div className="min-h-screen  py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-100 text-center mb-8">
            Chapter {chapid}
          </h1>

          <div
            ref={containerRef}
            className="relative bg-zinc-900 rounded-lg overflow-hidden"
            onWheel={handleWheel}
            style={{ height: "calc(100vh - 240px)" }}
          >
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              </div>
            )}

            <div
              className="w-full h-full flex items-center justify-center overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={getProxyImageUrl(pages[currentPageIndex]?.img)}
                alt={`Page ${pages[currentPageIndex]?.page}`}
                className="max-h-full transition-all duration-200"
                style={{
                  transform: `scale(${zoom}) translate(${
                    position.x / zoom
                  }px, ${position.y / zoom}px)`,
                  cursor: zoom > 1 ? "grab" : "default",
                  objectFit: "contain",
                }}
                onLoad={() => setImageLoading(false)}
                draggable={false}
              />
            </div>

            <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4 pointer-events-none">
              <button
                onClick={handleNextPage}
                disabled={currentPageIndex === pages.length - 1}
                className={`pointer-events-auto p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all transform hover:scale-110 ${
                  currentPageIndex === pages.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-100"
                }`}
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>

              <button
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0}
                className={`pointer-events-auto p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all transform hover:scale-110 ${
                  currentPageIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-100"
                }`}
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </div>

            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button
                onClick={handleZoomOut}
                className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all"
              >
                <ZoomOut className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all"
              >
                <Maximize className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all"
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center space-y-4">
            <div className="bg-gray-900 px-6 py-3 rounded-full">
              <span className="text-lg text-gray-300">
                Page {pages[currentPageIndex]?.page} of {pages.length}
              </span>
            </div>

            <div className="text-sm text-gray-400 space-y-1 text-center">
              <div>Use arrow keys (← next / → previous) to navigate</div>
              <div>Use Ctrl + Mouse wheel to zoom, drag to pan when zoomed</div>
              <div>Current zoom: {(zoom * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadManga;
