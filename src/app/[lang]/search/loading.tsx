
import { HeritageHeading } from '@/components/ui/heritage/HeritageHeading';

export default function SearchLoading() {
    return (
        <main className="min-h-screen bg-parchment-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <HeritageHeading center as="h1">
                        Search Results
                    </HeritageHeading>
                    <div className="h-6 w-48 bg-mithila-gold/10 animate-pulse mx-auto rounded"></div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-mithila-gold/20 shadow-sm min-h-[400px] space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="border-b border-gray-100 pb-6 last:border-0 animate-pulse">
                            <div className="h-4 w-20 bg-gray-200 rounded mb-4"></div>
                            <div className="h-8 w-3/4 bg-gray-200 rounded mb-3"></div>
                            <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
                            <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
