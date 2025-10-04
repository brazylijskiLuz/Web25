import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.wnek.cc/report/get-all", {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Disable caching to always get fresh data
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch reports",
        isSuccess: false,
        isFailure: true,
        errors: [String(error)],
      },
      { status: 500 }
    );
  }
}
