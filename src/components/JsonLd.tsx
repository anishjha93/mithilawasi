type JsonLdProps = {
    type?: 'Website' | 'Organization' | 'Article' | 'Place' | 'BreadcrumbList' | 'CollectionPage' | 'Event'; // Added CollectionPage and Event
    data?: any;
    override?: boolean; // If true, only renders the passed data. If false (default), appends to global schema.
};

export default function JsonLd({ type, data, override = false }: JsonLdProps) {
    const websiteJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Mithilawasi',
        alternateName: 'Mithila Heritage',
        url: 'https://mithilawasi.com',
        description: 'Discover the ancient civilization of Mithila. Art, Culture, History, and Philosophy.',
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://mithilawasi.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
        },
    };

    const organizationJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Mithilawasi',
        url: 'https://mithilawasi.com',
        logo: 'https://mithilawasi.comhttps://cdn.mithilawasi.com/logo.webp',
        sameAs: [
            'https://facebook.com/mithilawasi',
            'https://twitter.com/mithilawasi',
            'https://instagram.com/mithilawasi',
            'https://youtube.com/mithilawasi'
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-XXX-XXXXXXX',
            contactType: 'customer service',
            areaServed: 'IN',
            availableLanguage: ['en', 'hi', 'Maithili']
        }
    };

    if (!type && !data) {
        // Default Global Schema
        return (
            <>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
                />
            </>
        );
    }

    // Dynamic Schema Handling
    let schemaData = {};

    if (override && data) {
        schemaData = data;
    } else if (type === 'Article' && data) {
        schemaData = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: data.headline,
            description: data.description,
            image: data.image,
            datePublished: data.datePublished,
            dateModified: data.dateModified || data.datePublished,
            author: {
                '@type': 'Organization', // Or Person if available
                name: 'Mithilawasi Team'
            },
            publisher: organizationJsonLd
        };
    } else if (type === 'Place' && data) {
        schemaData = {
            '@context': 'https://schema.org',
            '@type': 'Place',
            name: data.name,
            description: data.description,
            image: data.image,
            address: {
                '@type': 'PostalAddress',
                addressLocality: data.addressLocality || 'Mithila Region',
                addressCountry: 'IN' // Or NP depending on data
            }
        };
    } else if (type === 'CollectionPage' && data) { // For category pages like Culture, History
        schemaData = {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: data.name,
            description: data.description,
            url: data.url,
            mainEntity: data.mainEntity // Optional ItemList
        };
    } else if (type === 'Event' && data) {
        schemaData = {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: data.name,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            location: data.location || {
                '@type': 'Place',
                name: 'Mithila Region',
                address: {
                    '@type': 'PostalAddress',
                    addressRegion: 'Mithila',
                    addressCountry: 'IN'
                }
            },
            image: data.image
        };
    } else {
        // Generic fallback or direct pass-through
        schemaData = {
            '@context': 'https://schema.org',
            '@type': type,
            ...data
        };
    }


    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
    );
}
