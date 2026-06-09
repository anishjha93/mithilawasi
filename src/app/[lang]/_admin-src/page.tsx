import Link from "next/link";

export const runtime = 'edge';

export default function AdminPage({ params }: { params: { lang: string } }) {
    const { lang } = params;

    return (
        <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-md bg-white p-8 rounded-3xl border border-orange-100 shadow-sm">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🏗️</span>
                </div>
                <h1 className="text-2xl font-bold font-serif text-gray-900 mb-4">Admin Dashboard</h1>
                <p className="text-gray-600 mb-8">
                    The administrative dashboard is currently restricted to local development to ensure high-performance Edge delivery for our visitors.
                </p>
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-sm text-blue-700 text-left font-medium">
                        <p className="flex gap-2">
                            <span>ℹ️</span>
                            <span>To manage content, please run the application locally using <code>npm run dev</code>.</span>
                        </p>
                    </div>
                    <Link 
                        href={`/${lang}/`}
                        className="block w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
            <p className="mt-8 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                Mithilawasi &bull; Edge Delivery Active
            </p>
        </div>
    );
}
