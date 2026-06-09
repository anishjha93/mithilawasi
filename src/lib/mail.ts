import "server-only";

/**
 * Edge-safe mail utility.
 * Uses dynamic imports for 'nodemailer' to prevent it from being bundled into Edge routes.
 */
export async function sendEmail(to: string, subject: string, html: string) {
    // Check if we are running in the Edge runtime
    const isEdge = (globalThis as any).EdgeRuntime === 'string';

    if (isEdge) {
        console.warn("⚠️ sendEmail called in Edge runtime. Nodemailer is not supported here.");
        // Cloudflare Workers/Edge should use a fetch-based API (like Resend, SendGrid, Mailgun)
        return false;
    }

    try {
        const nodemailer = (await import('nodemailer')).default;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"Mithilawasi" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log(`Email sent to ${to}`);
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
}

export async function sendWelcomeEmail(to: string) {
    const subject = 'Welcome to the Mithilawasi Family! 🌿';
    const html = `
        <div style="font-family: serif; color: #333; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #b91c1c; margin-bottom: 5px;">Mithilawasi</h1>
                <p style="font-style: italic; color: #666; margin-top: 0;">Preserving the Soul of Mithila</p>
            </div>
            
            <p>Namaskar,</p>
            
            <p>Thank you for joining our community! We are thrilled to have you with us on this journey to preserve and celebrate the rich heritage of Mithila.</p>
            
            <p>You can expect:</p>
            <ul>
                <li>Stories about lost history and traditions</li>
                <li>Updates on Maithili festivals and rituals</li>
                <li>Spotlights on Mithila Art an artists</li>
            </ul>

            <p>If you have any topics you'd like us to cover, feel free to reply to this email.</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999;">
                <p>&copy; ${new Date().getFullYear()} Mithilawasi. All rights reserved.</p>
            </div>
        </div>
    `;
    return await sendEmail(to, subject, html);
}
