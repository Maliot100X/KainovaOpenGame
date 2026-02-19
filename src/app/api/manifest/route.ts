import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  // Read manifest from .well-known directory
  const manifestPath = join(process.cwd(), "src", "app", ".well-known", "farcaster.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  
  return NextResponse.json(manifest, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
}
