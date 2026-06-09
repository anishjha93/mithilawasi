import { NextRequest, NextResponse } from "next/server";
import { initAdmin } from "@/lib/firebase-admin";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { title, body, imageUrl, linkUrl, topic } = await req.json();

        if (!title || !body) {
            return NextResponse.json({ error: "Missing title or body" }, { status: 400 });
        }

        const targetTopic = topic || "all_users";

        const adminApp = await initAdmin();
        if (!adminApp) {
            return NextResponse.json({ error: "Firebase Admin not initialized. Check server configuration." }, { status: 503 });
        }
        const messaging = adminApp.messaging();

        const message: any = {
            notification: {
                title,
                body,
            },
            data: {
                title,
                body,
                url: linkUrl || "https://mithilawasi.com",
                click_action: linkUrl || "https://mithilawasi.com", // Legacy support
                imageUrl: imageUrl || ""
            },
            webpush: {
                fcm_options: {
                    link: linkUrl || "https://mithilawasi.com"
                }
            },
            topic: targetTopic,
        };

        if (imageUrl) {
            message.notification.imageUrl = imageUrl;
        }

        console.log(`🚀 Sending broadcast to topic: ${targetTopic}`);
        const response = await messaging.send(message);

        return NextResponse.json({ success: true, messageId: response });
    } catch (error: any) {
        console.error("❌ Send error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
