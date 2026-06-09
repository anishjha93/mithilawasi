'use server';
import { sendEmail } from '@/lib/mail';

export async function sendStoryEmail(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const type = formData.get('storyType') as string;
    const message = formData.get('message') as string;

    if (!name || !message) {
        return { success: false, message: 'Name and Message are required.' };
    }

    const adminEmail = process.env.GMAIL_USER || 'anishjha93@gmail.com'; // Fallback for safety

    try {
        const subject = `New Mithilawasi Story: ${type} from ${name}`;
        const html = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #a01c29;">New Story Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email || 'Not provided'}</p>
                <p><strong>Category:</strong> <span style="background: #f3f4f6; padding: 2px 6px; rounded: 4px; text-transform: uppercase; font-size: 0.8em; font-weight: bold;">${type}</span></p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <h3 style="margin-bottom: 10px;">Story Content:</h3>
                <p style="white-space: pre-wrap; line-height: 1.6; color: #333;">${message}</p>
            </div>
        `;

        // Send using the existing utility
        const result = await sendEmail(adminEmail, subject, html);

        if (result) {
            return { success: true, message: 'Email sent successfully!' };
        } else {
            // Fallback log if sendEmail returns false (validation failure)
            console.log('--- NEW STORY SUBMISSION (Logged via Fallback) ---');
            console.log({ name, email, type, message });
            return { success: true, message: 'Story received (Logged - Email config check required)' };
        }

    } catch (error) {
        console.error('Error handling story:', error);
        return { success: false, message: 'Failed to process story.' };
    }
}
