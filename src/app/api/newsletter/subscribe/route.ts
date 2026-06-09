import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        const db = getDb();
        if (!db) throw new Error('Database not found');

        // 1. Ensure table exists
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS subscribers (
                email TEXT PRIMARY KEY,
                date TEXT NOT NULL,
                source TEXT NOT NULL,
                status TEXT DEFAULT 'active'
            )
        `).run();

        // 2. Insert/Update
        await db.prepare(
            'INSERT INTO subscribers (email, date, source, status) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET status="active"'
        ).bind(
            email.toLowerCase(),
            new Date().toISOString(),
            'website_footer',
            'active'
        ).run();

        return NextResponse.json({ success: true, message: 'Subscribed successfully!' });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
