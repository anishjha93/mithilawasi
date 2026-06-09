
import React from 'react';

interface HeritageHeadingProps {
    children: React.ReactNode;
    as?: 'h1' | 'h2' | 'h3' | 'h4';
    className?: string;
    center?: boolean;
}

export const HeritageHeading: React.FC<HeritageHeadingProps> = ({
    children,
    as: Tag = 'h2',
    className = '',
    center = false
}) => {
    const baseStyles = 'font-heading font-black text-mithila-ink header-heritage tracking-tight leading-tight';
    const alignment = center ? 'text-center mx-auto' : '';
    const sizes = {
        h1: 'text-4xl md:text-6xl mb-10',
        h2: 'text-3xl md:text-5xl mb-8',
        h3: 'text-2xl md:text-3xl mb-6',
        h4: 'text-xl md:text-2xl mb-4',
    };

    return (
        <Tag className={`${baseStyles} ${sizes[Tag]} ${alignment} ${className}`}>
            {children}
        </Tag>
    );
};
