export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "Missing 'url' parameter" }, { status: 400 });
        }

        // Validate URL
        try {
            new URL(url);
        } catch {
            return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
        }

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mithila-Legacy-Bot/1.0",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }

        const html = await response.text();

        // Simple Regex scraping for MVP (robust enough for standard OG tags)
        const getMeta = (prop: string) => {
            const regex = new RegExp(`<meta[^>]+(?:property|name)=["'](?:og:)?${prop}["'][^>]+content=["']([^"']+)["']`, "i");
            const match = html.match(regex);
            return match ? match[1] : null;
        };

        const title = getMeta("title") || html.match(/<title>([^<]*)<\/title>/i)?.[1];
        const description = getMeta("description");
        const image = getMeta("image");

        return NextResponse.json({
            success: true,
            metadata: {
                title: title || "",
                description: description || "",
                image: image || "",
            }
        });

    } catch (error: any) {
        console.error("Metadata fetch error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch metadata" }, { status: 500 });
    }
}
