import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
    try {
        const db = getDb();
        if (!db) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Database binding not found in environment' 
            }, { status: 500 });
        }

        // Try a simple query
        const result = await db.prepare('SELECT 1 as test').first();
        
        return NextResponse.json({ 
            status: 'success', 
            message: 'Connected to D1!',
            data: result 
        });
    } catch (error: any) {
        return NextResponse.json({ 
            status: 'error', 
            message: error.message || 'Unknown database error'
        }, { status: 500 });
    }
}
