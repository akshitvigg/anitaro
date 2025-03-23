import VideoPlayer from "@/components/videoplayer";

export default function Animetest() {
  const m3u8ProxyUrl =
    "https://m3u8proxy-dsu3.onrender.com/m3u8-proxy?url=https://eh.netmagcdn.com:2228/hls-playback/462f0ad7b60573e9fceb9391a56938ef1a2f5b224bf5ecc273c50df25aa3619f364e68a109158ef83abf922fbe6416e074fda870f63afcae80f54f92afb10fa517fe87278e7763a42f13cdcc4286c75f0c9c59fb206491f4356a118f02a0e3856a39bef1a39c7f0cda8de2f5a9bd424fea54d2b5c87ea3c0e367fafb248cfbbffb9e3f793526007ae2a4e84fa1f4bc25/master.m3u8";

  return (
    <div>
      <h1>Next.js Video.js M3U8 Player</h1>
      <VideoPlayer m3u8Url={m3u8ProxyUrl} />
    </div>
  );
}
