
'use server';

import { z } from 'zod';
import { submissionSchema } from '@/lib/schemas/submission';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/db';

export type FormState = {
    message: string;
    errors?: {
        [key: string]: string[];
    };
    success?: boolean;
};

export async function submitStory(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = submissionSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        title: formData.get('title'),
        category: formData.get('category'),
        content: formData.get('content'),
        location: formData.get('location'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Missing Fields. Failed to Submit.',
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
        };
    }

    const { name, email, title, category, content, location } = validatedFields.data;

    try {
        console.log('Starting story submission for:', email);
        const db = getDb();
        if (!db) {
            console.error('CRITICAL: Database binding is missing in the current runtime context.');
            return {
                message: 'Server Configuration Error: Database not found.',
                success: false,
            };
        }
        
        // Use a safe ID generation for Edge
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const submittedAt = new Date().toISOString();

        console.log('Executing D1 query for table: stories');
        try {
            await db.prepare(
                `INSERT INTO stories (id, name, email, title, category, content, location, status, submitted_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(
                id,
                name,
                email,
                title,
                category,
                content,
                location || 'Unknown',
                'pending',
                submittedAt
            ).run();
        } catch (dbError: any) {
            if (dbError.message.includes('no such table')) {
                console.log('Table "stories" missing. Creating it now...');
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
                // Retry the insert
                await db.prepare(
                    `INSERT INTO stories (id, name, email, title, category, content, location, status, submitted_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
                ).bind(id, name, email, title, category, content, location || 'Unknown', 'pending', submittedAt).run();
            } else {
                throw dbError;
            }
        }

        console.log('D1 query successful.');

        // Temporarily disabled revalidation to see if it fixes the hang
        /*
        try {
            revalidatePath('/[lang]/community'); 
        } catch (revalidateError) {
            console.warn('Revalidation failed (non-critical):', revalidateError);
        }
        */

        return {
            message: 'Story submitted successfully! It will be reviewed shortly.',
            success: true,
        };

    } catch (error: any) {
        console.error('Submission error details:', error.message || error);
        return {
            message: `Database Error: ${error.message || 'Failed to Submit Story'}`,
            success: false,
        };
    }
}

