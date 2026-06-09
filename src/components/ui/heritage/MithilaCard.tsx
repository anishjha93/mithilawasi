
import React from 'react';

interface MithilaCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'madhubani';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    style?: React.CSSProperties;
}

export const MithilaCard: React.FC<MithilaCardProps> = ({
    children,
    className = '',
    variant = 'default',
    padding = 'md',
    style
}) => {
    const baseStyles = 'rounded-2xl overflow-hidden transition-all duration-500';
    const variants = {
        default: 'glass-morphism border border-primary-red/5 shadow-premium hover:shadow-2xl hover:-translate-y-1',
        madhubani: 'border-madhubani glass shadow-premium hover:shadow-2xl hover:-translate-y-1',
        heritage: 'border-double-heritage glass shadow-premium hover:shadow-2xl hover:-translate-y-1',
    };

    const paddings = {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6 md:p-8',
        lg: 'p-8 md:p-12',
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`} style={style}>
            {children}
        </div>
    );
};
