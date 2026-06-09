"use client";

import Link from 'next/link';
import Image from 'next/image';

type Place = {
    name: string;
    location?: string;
    image: string;
    slug: string;
};

type Props = {
    currentSlug: string;
    places: Place[];
    lang: string;
};

export default function ReadNext({ currentSlug, places, lang }: Props) {
    if (!places || places.length === 0) return null;

    // Find current index
    const currentIndex = places.findIndex(p => p.slug === currentSlug);

    // Get next 2 items (loop back to start if at end)
    const nextPlaces = [];
    if (currentIndex !== -1) {
        nextPlaces.push(places[(currentIndex + 1) % places.length]);
        nextPlaces.push(places[(currentIndex + 2) % places.length]);
    } else {
        // Fallback if slug not found
        nextPlaces.push(places[0]);
        nextPlaces.push(places[1]);
    }

    const title = lang === 'en' ? 'You May Also Like' : lang === 'hi' ? 'आपको यह भी पसंद आ सकता है' : 'अहाँक ई हो पसंद आबि सकैत अछि';

    return (
        <section className="mt-12 pt-8 border-t border-border-color max-md:mt-8 max-md:pt-6">
            <h3 className="text-2xl font-bold mb-6 text-foreground max-md:text-xl max-md:mb-4">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-md:gap-4">
                {nextPlaces.map((place, index) => (
                    <Link key={place.slug || index} href={`/${lang}/places/${place.slug}`} className="block rounded-xl overflow-hidden bg-card-bg shadow-md transition-all duration-200 no-underline text-inherit hover:-translate-y-1 hover:shadow-lg">
                        <div className="w-full h-40 relative bg-gray-100 dark:bg-black/20 max-md:h-48">
                            <Image
                                src={place.image || 'https://cdn.mithilawasi.com/logo.webp'}
                                alt={place.name}
                                width={300}
                                height={200}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h4 className="text-lg font-semibold mb-2 text-foreground line-clamp-2 leading-snug">{place.name}</h4>
                            <p className="text-[0.9rem] text-text-secondary flex items-center gap-1">📍 {place.location}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
