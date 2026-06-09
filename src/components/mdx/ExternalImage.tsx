import React from 'react';

interface ExternalImageProps {
    url: string;
    alt?: string;
}

export const ExternalImage: React.FC<ExternalImageProps> = ({ url, alt }) => {
    return (
        <figure className="my-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={url}
                alt={alt || ''}
                className="max-w-full h-auto rounded-lg block mx-auto shadow-sm border border-border-color"
            />
            {alt && <figcaption className="text-center text-gray-500 text-sm mt-3 italic">{alt}</figcaption>}
        </figure>
    );
};

export default ExternalImage;
