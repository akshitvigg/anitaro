import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, Chip, Select, SelectItem } from "@nextui-org/react";

const EpisodeContainer = ({ anidata }: any) => {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const episodes = anidata.episodes;

  const totalGroups = Math.ceil(episodes.length / 100);

  const getProxyImageUrl = (originalUrl: string) => {
    return `/api/manga-image?imageUrl=${encodeURIComponent(originalUrl)}`;
  };

  const renderEpisodes = () => {
    const startIndex = selectedGroup * 100;
    const endIndex = Math.min(startIndex + 100, episodes.length);

    return episodes.slice(startIndex, endIndex).map((episode: any) => (
      <Link
        key={episode.number}
        href={`/${anidata.id}/${episode.number.toString().replace(/\./g, "-")}`}
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
    label: `${index * 100 + 1}-${Math.min((index + 1) * 100, episodes.length)}`,
  }));

  return (
    <div className="w-full h-[600px]">
      <p className="flex justify-center mb-6 mt-10 text-4xl">Episodes</p>

      {episodes.length > 100 && (
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
        <div className="grid grid-cols-4 gap-4">{renderEpisodes()}</div>
      </div>
    </div>
  );
};

export default EpisodeContainer;
