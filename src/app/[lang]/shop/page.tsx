import { getDictionary } from '@/get-dictionary';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const dict = await getDictionary(resolvedParams.lang as 'en' | 'hi' | 'mai');
    return {
        title: dict.shopPage.title,
        description: dict.shopPage.description,
    };
}

export default async function ShopPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const lang = resolvedParams.lang;
    const dict = await getDictionary(lang as 'en' | 'hi' | 'mai');

    return (
        <div className="flex flex-col justify-center items-center min-height-[60vh] bg-[#fafafa] dark:bg-background text-center px-6 py-16">
            <h1 className="text-[3rem] font-bold text-[#e65100] dark:text-orange-500 mb-6">{dict.shopPage.title}</h1>
            <p className="text-[1.5rem] text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                {dict.shopPage.description}
            </p>
            <div className="text-[4rem] mb-8">🛍️</div>
            <button className="bg-[#e65100] text-white px-8 py-3 rounded-full text-[1.125rem] font-bold border-none cursor-pointer shadow-md transition-colors hover:bg-[#c2410c]">
                {dict.shopPage.button}
            </button>
            <Link href={`/${lang}`} className="mt-8 text-gray-500 dark:text-gray-400 underline transition-colors hover:text-[#e65100] dark:hover:text-orange-400">
                {lang === 'en' ? 'Back to Home' : (lang === 'hi' ? 'घर वापस जाएं' : 'घरा घुरु')}
            </Link>
        </div>
    );
}
