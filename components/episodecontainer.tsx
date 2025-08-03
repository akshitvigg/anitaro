import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  Chip,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";

interface EpisodeContainerProps {
  anidata: any;
  episodes: any;
  loadingEpisodes: boolean;
}

const EpisodeContainer = ({
  anidata,
  episodes,
  loadingEpisodes,
}: EpisodeContainerProps) => {
  const [selectedGroup, setSelectedGroup] = useState(0);

  const getProxyImageUrl = (originalUrl: string) => {
    return `/api/manga-image?imageUrl=${encodeURIComponent(originalUrl)}`;
  };

  // Show loading spinner while episodes are being fetched
  if (loadingEpisodes) {
    return (
      <div className="w-full h-[600px] flex justify-center items-center">
        <div className="text-center">
          <Spinner size="lg" className="w-20 h-20" />
          <p className="mt-4 text-gray-400 text-lg">Loading episodes...</p>
        </div>
      </div>
    );
  }

  // Show message if no episodes are available
  if (!episodes || !episodes.episodes || episodes.episodes.length === 0) {
    return (
      <div className="w-full h-[600px] flex justify-center items-center">
        <p className="text-2xl text-gray-400">No episodes available</p>
      </div>
    );
  }

  const episodesList = episodes.episodes;
  const totalGroups = Math.ceil(episodesList.length / 100);

  const renderEpisodes = () => {
    const startIndex = selectedGroup * 100;
    const endIndex = Math.min(startIndex + 100, episodesList.length);

    return episodesList.slice(startIndex, endIndex).map((episode: any) => (
      <Link
        key={episode.number}
        href={`/watch/${encodeURIComponent(episode.episodeId)}`}
        className="group"
      >
        <Card
          className="w-full bg-default-100/50 backdrop-blur-md border border-default-200/50 hover:border-primary/50 transition-all duration-300 overflow-hidden"
          shadow="lg"
        >
          <div className="relative w-full aspect-video overflow-hidden">
            <img
              src={getProxyImageUrl(anidata.image)}
              alt={`Episode ${episode.number}`}
              className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3 z-10">
              <Chip
                color="primary"
                variant="solid"
                size="sm"
                className="bg-black/60 backdrop-blur-sm"
              >
                Ep {episode.number}
              </Chip>
            </div>
            {episode.isFiller && (
              <div className="absolute top-3 right-3 z-10">
                <Chip
                  color="warning"
                  variant="solid"
                  size="sm"
                  className="bg-orange-600/80 backdrop-blur-sm"
                >
                  Filler
                </Chip>
              </div>
            )}
          </div>
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large text-default-700 group-hover:text-primary transition-colors">
              {episode.title || `Episode ${episode.number}`}
            </h4>
            {episode.description && (
              <p className="text-small text-default-500 mt-1 line-clamp-2">
                {episode.description}
              </p>
            )}
          </CardHeader>
        </Card>
      </Link>
    ));
  };

  const groupOptions = Array.from({ length: totalGroups }, (_, index) => ({
    value: index,
    label: `${index * 100 + 1}-${Math.min(
      (index + 1) * 100,
      episodesList.length
    )}`,
  }));

  return (
    <div className="w-full h-[600px]">
      <div className="flex justify-between items-center mb-6 mt-10 px-4">
        <p className="text-4xl text-center flex-1">Episodes</p>
        <div className="text-right">
          <p className="text-lg text-gray-400">
            Total: {episodes.totalEpisodes || episodesList.length} episodes
          </p>
        </div>
      </div>

      {episodesList.length > 100 && (
        <div className="mb-4 px-4">
          <Select
            label="Select Episode Group"
            variant="bordered"
            color="primary"
            className="max-w-xs"
            selectedKeys={[selectedGroup.toString()]}
            onChange={(e) => setSelectedGroup(Number(e.target.value))}
          >
            {groupOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      )}

      <div className="h-[500px] overflow-y-auto pr-2">
        <div className="grid grid-cols-4 gap-4 px-4">{renderEpisodes()}</div>
      </div>
    </div>
  );
};

export default EpisodeContainer;
