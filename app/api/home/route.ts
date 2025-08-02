import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get(
      "https://aniwatch-api-production-b308.up.railway.app/api/v2/hianime/home"
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime data" },
      { status: 500 }
    );
  }
}
