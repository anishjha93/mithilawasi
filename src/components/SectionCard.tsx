
import Link from 'next/link';

interface SectionCardProps {
    title: string;
    description: string;
    link: string;
    imageColor?: string;
    image?: string;
}

const SectionCard = ({ title, description, link, image, imageColor = 'var(--color-gray-soft)' }: SectionCardProps) => {
    return (
        <div className="group relative overflow-hidden rounded-[2.5rem] bg-paper-white shadow-premium hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border border-primary-red/5" aria-label={`Section: ${title}`}>
            <div className="h-[240px] w-full relative overflow-hidden" style={{ backgroundColor: imageColor }}>
                <div className="absolute inset-0 bg-gradient-to-t from-mithila-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
                {image ? (
                    <div className="w-full h-full relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={image}
                            alt={`Representative image for ${title}`}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10">
                        <div className="madhubani-pattern-bg w-full h-full"></div>
                    </div>
                )}
                {/* Decorative Pattern Overlay on Image */}
                <div className="absolute inset-0 madhubani-pattern-bg opacity-[0.03] pointer-events-none group-hover:opacity-10 transition-opacity duration-700"></div>
            </div>

            <div className="p-10 relative glass-morphism h-full">
                {/* Decorative flourish */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none transition-transform duration-700 group-hover:rotate-45"
                    style={{ backgroundImage: 'radial-gradient(var(--color-primary-red) 2px, transparent 2px)', backgroundSize: '16px 16px' }}>
                </div>

                <h3 className="font-heading text-3xl font-black text-mithila-ink mb-4 transition-colors duration-500 group-hover:text-primary-red italic tracking-tighter uppercase">{title}</h3>
                <p className="text-xl text-text-muted mb-8 leading-relaxed font-serif italic group-hover:text-mithila-ink transition-colors duration-500">{description}</p>

                <Link href={link} className="inline-flex items-center gap-3 font-black text-primary-red uppercase tracking-[0.2em] text-xs no-underline group/link transition-all duration-300" aria-label={`Explore ${title} section`}>
                    <span className="border-b-2 border-primary-red/20 group-hover/link:border-primary-red pb-1">Explore Now</span>
                    <span className="text-xl transition-transform duration-500 group-hover/link:translate-x-3" aria-hidden="true">
                        &rarr;
                    </span>
                </Link>
            </div>

            {/* Animated Bottom Border */}
            <div className="absolute bottom-0 left-0 w-0 h-2 bg-primary-red transition-all duration-1000 group-hover:w-full opacity-80 shadow-[0_0_15px_rgba(160,28,41,0.5)]"></div>
        </div>
    );
};

export default SectionCard;
