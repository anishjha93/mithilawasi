import { NextRequest, NextResponse } from "next/server";
import { initAdmin } from "@/lib/firebase-admin";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { token, topic } = await req.json();

        if (!token || !topic) {
            return NextResponse.json({ error: "Missing token or topic" }, { status: 400 });
        }

        const adminApp = await initAdmin();
        if (!adminApp) {
            return NextResponse.json({ error: "Firebase Admin not initialized. Check server configuration." }, { status: 503 });
        }
        const messaging = adminApp.messaging();

        await messaging.subscribeToTopic(token, topic);

        console.log(`✅ Subscribed ${token.slice(0, 10)}... to topic: ${topic}`);

        return NextResponse.json({ success: true, message: `Subscribed to ${topic}` });
    } catch (error: any) {
        console.error("❌ Subscription error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
