import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const REPO_OWNER = process.env.BLOG_REPO_OWNER || 'anishjha93';
const REPO_NAME = process.env.BLOG_REPO_NAME || 'mithilalegacy';
const REPO_BRANCH = process.env.BLOG_REPO_BRANCH || 'main';



export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');

    if (!path) {
        return new NextResponse('Missing path parameter', { status: 400 });
    }

    try {
        // Fetch using standard fetch to strictly handle binary data
        // Octokit's request method often tries to parse JSON or text, causing encoding issues for images
        const fileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${REPO_BRANCH}`;

        const fileResponse = await fetch(fileUrl, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3.raw', // Request raw content
            },
        });

        if (!fileResponse.ok) {
            console.error(`Proxy upstream error: ${fileResponse.status} ${fileResponse.statusText}`);
            return new NextResponse('Error fetching image from source', { status: fileResponse.status });
        }

        const arrayBuffer = await fileResponse.arrayBuffer();

        // Determine content type based on extension
        const extension = path.split('.').pop()?.toLowerCase();
        let contentType = 'application/octet-stream';
        if (extension === 'png') contentType = 'image/png';
        if (extension === 'jpg' || extension === 'jpeg') contentType = 'image/jpeg';
        if (extension === 'gif') contentType = 'image/gif';
        if (extension === 'webp') contentType = 'image/webp';
        if (extension === 'svg') contentType = 'image/svg+xml';

        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600, s-maxage=86400',
            },
        });

    } catch (error: any) {
        console.error('Proxy Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
