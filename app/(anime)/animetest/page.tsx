import VideoPlayer from "@/components/videoplayer";

export default function Animetest() {
  const m3u8ProxyUrl =
    "https://m3u8proxy-dsu3.onrender.com/m3u8-proxy?url=https://ed.netmagcdn.com:2228/hls-playback/8ff4583ec989bfd91ed9f86b8ac537b6d4b1e0c5a2956301e856a768b38c60ef436e9b9a3d39225dbe7870795370e0e2cebfdf632d801a57f4f1250689575a2f3d53d9b6aad3b08054f9ce3f2beb913d89ed984d6795702f90e60bf4b346bdcf5d61c41613871176de9c41a13df375318e827583e69b1a54ad98093d35711396beb181f5b1cb5086d8a78936fd1cbe94/master.m3u8";

  return (
    <div>
      <h1>Next.js Video.js M3U8 Player</h1>
      <VideoPlayer m3u8Url={m3u8ProxyUrl} />
    </div>
  );
}
