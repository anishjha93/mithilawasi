import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, title, category, content, location } = body;

        const db = getDb();
        if (!db) throw new Error('Database not found');

        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const submittedAt = new Date().toISOString();

        // 1. Ensure table exists
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS stories (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                content TEXT NOT NULL,
                location TEXT,
                status TEXT DEFAULT 'pending',
                submitted_at TEXT NOT NULL
            )
        `).run();

        // 2. Insert data
        await db.prepare(
            `INSERT INTO stories (id, name, email, title, category, content, location, status, submitted_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            id, name, email, title, category, content, location || 'Unknown', 'pending', submittedAt
        ).run();

        return NextResponse.json({ success: true, message: 'Story submitted successfully!' });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
