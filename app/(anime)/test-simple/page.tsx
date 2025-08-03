import M3U8Player from "@/components/videoplayer";

const TestSimplePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Simple Working Test</h1>
        
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
          <M3U8Player
            m3u8Url="https://cdn.dotstream.buzz/anime/a1d0c6e83f027327d8461063f4ac58a6/8b92f1aa1467d68404a9cca6a4895a32/master.m3u8"
            referer="https://megaplay.buzz/stream/s-2/steinsgate-3?ep=230/dub"
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
        
        <div className="mt-6 p-4 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Test Information</h2>
          <div className="space-y-2 text-gray-300">
            <p><span className="font-medium">Test Type:</span> Exact working structure from your example</p>
            <p><span className="font-medium">Expected:</span> Video should play smoothly with subtitles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSimplePage; 