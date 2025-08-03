# Anime Streaming System Guide

## Overview
This application implements a complete anime streaming system that fetches episodes from external APIs and streams them using HLS (HTTP Live Streaming) format.

## Architecture

### 1. Episode Container Component (`components/episodecontainer.tsx`)
- Displays a grid of available episodes for an anime
- Each episode card links to `/watch/{episodeId}`
- Handles episode grouping (100 episodes per group)
- Shows episode information including filler status

### 2. Watch Page (`app/(anime)/watch/[episodeId]/page.tsx`)
- Main streaming interface
- Fetches available servers for the episode
- Allows selection between Sub/Dub/Raw audio
- Provides server selection (HD-1, HD-2, HD-3, etc.)
- Integrates with M3U8Player for video playback

### 3. M3U8Player Component (`components/videoplayer.tsx`)
- Video.js based HLS player
- Handles subtitle tracks
- Uses proxy service for CORS handling
- Supports multiple subtitle languages

## API Flow

### Step 1: Fetch Servers
```
GET /api/episode/servers?animeEpisodeId={episodeId}
```
Returns available servers for different audio types:
```json
{
  "status": 200,
  "data": {
    "sub": [{"serverName": "hd-1", "serverId": 4}],
    "dub": [{"serverName": "hd-1", "serverId": 4}],
    "raw": [],
    "episodeId": "great-teacher-onizuka-42?ep=1225",
    "episodeNo": 43
  }
}
```

### Step 2: Fetch Streaming Sources
```
GET /api/episode/sources?animeEpisodeId={episodeId}&server={server}&category={category}
```
Returns streaming data:
```json
{
  "status": 200,
  "data": {
    "headers": {"Referer": "https://megaplay.buzz/stream/s-2/great-teacher-onizuka-42?ep=1225/sub"},
    "tracks": [{"url": "https://.../eng-0.vtt", "lang": "English"}],
    "sources": [{"url": "https://.../master.m3u8", "type": "hls"}],
    "anilistID": 245,
    "malID": 245
  }
}
```

## Features

### ✅ Implemented
- Episode listing with pagination
- Server selection (HD-1, HD-2, HD-3)
- Audio type selection (Sub/Dub/Raw)
- HLS video streaming
- Subtitle support
- Error handling
- Loading states
- Responsive design
- Navigation back button

### 🎯 Key Components
1. **EpisodeContainer**: Displays episode grid
2. **WatchPage**: Main streaming interface
3. **M3U8Player**: Video player component
4. **API Routes**: Server and source fetching

## Usage

1. Navigate to an anime's detail page
2. Click on any episode from the episode container
3. Select your preferred audio type (Sub/Dub/Raw)
4. Choose a server (HD-1, HD-2, HD-3)
5. The video will automatically start streaming

## Technical Details

- **Video Format**: HLS (HTTP Live Streaming)
- **Player**: Video.js with HLS.js
- **Proxy**: Uses external proxy for CORS handling
- **Styling**: Tailwind CSS with NextUI components
- **State Management**: React hooks (useState, useEffect)
- **Error Handling**: Comprehensive error states and retry mechanisms

## Dependencies

- `video.js`: Video player
- `hls.js`: HLS streaming support
- `@nextui-org/react`: UI components
- `lucide-react`: Icons
- `next`: React framework

## Error Handling

The system handles various error scenarios:
- Network failures
- Missing servers
- No streaming sources
- Invalid episode IDs
- CORS issues (handled by proxy)

Each error state provides user-friendly messages and retry options. 