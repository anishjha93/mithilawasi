import { SubmissionForm } from '@/components/community/SubmissionForm';
import { HeritageHeading } from '@/components/ui/heritage/HeritageHeading';
import JsonLd from '@/components/JsonLd';
import Image from 'next/image';

export const runtime = 'edge';

export const metadata = {
    title: 'Share Your Story | Mithilawasi',
    description: 'Contribute your memories, folktales, and traditions to the Mithilawasi archives.',
};

export default async function ShareStoryPage({ params }: { params: Promise<{ lang: string }> }) {
    const communitySchema = {
        '@context': 'https://schema.org',
        '@type': 'CommunityHealth',
        name: 'Mithilawasi Community Archives',
        description: 'A community-driven archive for preserving Mithila heritage.',
        publisher: {
            '@type': 'Organization',
            name: 'Mithilawasi'
        }
    };

    return (
        <main className="min-h-screen bg-parchment-100 py-12 px-4 sm:px-6 lg:px-8">
            <JsonLd override={true} data={communitySchema} />
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <HeritageHeading center as="h1">
                        Community Archives
                    </HeritageHeading>
                    <p className="text-xl md:text-2xl text-mithila-gold font-serif italic">
                        Be a part of the living history of Mithila
                    </p>

                    <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border-4 border-mithila-gold shadow-lg">
                        <Image
                            src="https://cdn.mithilawasi.com/hero-bg.webp"
                            alt="Community Gathering"
                            fill
                            className="object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-8">
                            <p className="text-white text-lg md:text-xl font-serif italic max-w-2xl px-4">
                                "A civilization lives as long as its stories are told."
                            </p>
                        </div>
                    </div>

                    <div className="prose prose-lg mx-auto text-gray-700">
                        <p>
                            Mithilawasi is built by people like you. Whether it's a
                            forgotten folk song, a grandmother's recipe, or a memory of a village festival,
                            your contribution helps preserve our culture for future generations.
                        </p>
                    </div>
                </div>

                {/* Submission Form */}
                <SubmissionForm />

            </div>
        </main>
    );
}
