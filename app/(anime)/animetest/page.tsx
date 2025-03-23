import VideoPlayer from "@/components/videoplayer";

export default function Animetest() {
  const m3u8ProxyUrl =
    "https://lightningspark77.pro/_v7/9c91e62b08efed2c227af0fd7162703c2d8ca95ecfe25bcda8cd02b8ca65c3bda9433b8f6439c28ef8ee52366062ce838407eb90be2cc46f8bbfee956c689a8ec476d6580918f4af9b7575a3fa38f2ed5501ecd242ce6aa5aa3678fc8b5d1f382185630706cf9c83962f4786b18b9392/master.m3u8";

  return (
    <div>
      <h1>Next.js Video.js M3U8 Player</h1>
      <VideoPlayer m3u8Url={m3u8ProxyUrl} />
    </div>
  );
}
