
import { HeritageHeading } from '@/components/ui/heritage/HeritageHeading';

export default function BlogLoading() {
    return (
        <main className="min-h-screen bg-parchment-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <HeritageHeading center as="h1">
                        Cultural Journal
                    </HeritageHeading>
                    <div className="h-6 w-64 bg-mithila-gold/10 animate-pulse mx-auto rounded"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                            <div className="aspect-video bg-gray-200"></div>
                            <div className="p-6 space-y-4">
                                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                                <div className="h-8 w-full bg-gray-200 rounded"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                                    <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
