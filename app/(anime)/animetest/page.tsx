import M3U8Player from "@/components/videoplayer";

const Play = () => {
  return (
    <div>
      <M3U8Player
        m3u8Url="https://cdn.dotstream.buzz/anime/a1d0c6e83f027327d8461063f4ac58a6/8b92f1aa1467d68404a9cca6a4895a32/master.m3u8"
        referer="https://megaplay.buzz/stream/s-2/"
        subtitles={[
          {
            url: "https://cdn.dotstream.buzz/anime/a1d0c6e83f027327d8461063f4ac58a6/8b92f1aa1467d68404a9cca6a4895a32/subtitles/eng-0.vtt",
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
