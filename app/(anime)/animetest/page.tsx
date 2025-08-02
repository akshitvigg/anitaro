import M3U8Player from "@/components/videoplayer";

const Play = () => {
  return (
    <div>
      <M3U8Player
        m3u8Url="https://cdn.dotstream.buzz/anime/eccbc87e4b5ce2fe28308fd9f2a7baf3/8f4a8ca728cd7a9ac1d2853d1c1c3d9b/master.m3u8"
        referer="https://megaplay.buzz/stream/s-2/steinsgate-3?ep=230/dub"
        subtitles={[
          {
            url: "https://cdn.dotstream.buzz/anime/eccbc87e4b5ce2fe28308fd9f2a7baf3/8f4a8ca728cd7a9ac1d2853d1c1c3d9b/subtitles/eng-0.vtt",
            lang: "English",
          },
          {
            url: "https://cdn.dotstream.buzz/anime/eccbc87e4b5ce2fe28308fd9f2a7baf3/bec16b94c40f9ae5fecb59a446769a44/subtitles/spa-1.vtt",
            lang: "Spanish",
          },
        ]}
      />
    </div>
  );
};

export default Play;
