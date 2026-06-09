import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sendEmail } from '@/lib/mail';

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, storyType, message } = body;

        const db = getDb();
        if (!db) throw new Error('Database not found');

        // 1. Save to D1 Database (Ensures no data loss)
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS community_stories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT,
                category TEXT NOT NULL,
                title TEXT,
                content TEXT NOT NULL,
                location TEXT,
                date TEXT NOT NULL,
                status TEXT DEFAULT 'pending'
            )
        `).run();

        await db.prepare(
            'INSERT INTO community_stories (name, email, category, title, content, date) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(
            name,
            email || 'Anonymous',
            storyType,
            `Story from Home Page (${storyType})`,
            message,
            new Date().toISOString()
        ).run();

        // 2. Attempt Email (Might fail on Edge, but we have the data in D1 now)
        try {
            const adminEmail = process.env.GMAIL_USER || 'anishjha93@gmail.com';
            const subject = `New Mithilawasi Story: ${storyType} from ${name}`;
            const html = `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                    <h2 style="color: #a01c29;">New Home Page Story</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email || 'Not provided'}</p>
                    <p><strong>Category:</strong> ${storyType}</p>
                    <hr/>
                    <p>${message}</p>
                    <p><em>(This story was also saved to your D1 Database)</em></p>
                </div>
            `;
            await sendEmail(adminEmail, subject, html);
        } catch (e) {
            console.warn('Email delivery skipped/failed on Edge, but story is saved in D1.');
        }

        return NextResponse.json({ success: true, message: 'Story received and saved! Thank you.' });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
