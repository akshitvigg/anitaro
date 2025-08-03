import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const animeEpisodeId = searchParams.get("animeEpisodeId");
  const server = searchParams.get("server") || "hd-1";
  const category = searchParams.get("category") || "sub";

  if (!animeEpisodeId) {
    return NextResponse.json(
      { error: "animeEpisodeId is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://aniwatch-api-production-b308.up.railway.app/api/v2/hianime/episode/sources?animeEpisodeId=${encodeURIComponent(
        animeEpisodeId
      )}&server=${server}&category=${category}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Error fetching sources data:", error);
    return NextResponse.json(
      { error: "Failed to fetch sources data" },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
