import { unsubscribeSubscriber } from "@/app/actions/subscribe";
import Link from "next/link";

export const runtime = 'edge';

export default async function UnsubscribePage({
    searchParams,
}: {
    searchParams: Promise<{ email?: string }>;
}) {
    const params = await searchParams;
    const email = params.email;
    let message = "Invalid request.";
    let success = false;

    if (email) {
        const res = await unsubscribeSubscriber(email);
        success = res.success;
        message = res.success
            ? "You have been successfully unsubscribed."
            : res.message || "Failed to unsubscribe.";
    }

    return (
        <div className="min-h-screen bg-[#fdfbf7] dark:bg-background flex items-center justify-center p-4">
            <div className="bg-white dark:bg-card-bg p-8 rounded-3xl shadow-lg border border-orange-100 dark:border-zinc-800 max-w-md w-full text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${success ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                    {success ? (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                </div>

                <h1 className="text-2xl font-serif text-gray-900 dark:text-gray-100 mb-4">{success ? "Unsubscribed" : "Error"}</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                    {message}
                    {success && <br />}
                    {success && <span className="text-sm mt-2 block">We're sorry to see you go. You can always resubscribe on our website.</span>}
                </p>

                <div className="space-y-3">
                    <Link
                        href="/"
                        className="block w-full py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-xl font-bold text-sm hover:bg-black dark:hover:bg-gray-700 transition-colors"
                    >
                        Return to Website
                    </Link>
                </div>
            </div>
        </div>
    );
}
