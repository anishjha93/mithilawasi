import React from 'react';

interface SpacerProps {
    height?: number | string;
}

export const Spacer: React.FC<SpacerProps> = ({ height = 20 }) => {
    const heightValue = typeof height === 'number' ? `${height}px` : height;
    return <div style={{ height: heightValue }} aria-hidden="true" />;
};

export default Spacer;
