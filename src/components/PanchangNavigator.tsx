'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface PanchangNavigatorProps {
    currentDate: string; // YYYY-MM-DD
}

const PanchangNavigator: React.FC<PanchangNavigatorProps> = ({ currentDate }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleDateChange = (newDateStr: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('date', newDateStr);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const shiftDate = (days: number) => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + days);
        handleDateChange(d.toISOString().split('T')[0]);
    };

    const setToday = () => {
        const today = new Date().toISOString().split('T')[0];
        handleDateChange(today);
    };

    return (
        <div className="flex items-center justify-center gap-4 mb-8 flex-wrap max-md:gap-2">
            <button
                className="bg-card-bg border border-border-color text-foreground px-4 py-2 rounded-md cursor-pointer text-[0.9rem] font-medium transition-all duration-200 flex items-center gap-2 hover:border-primary-red hover:text-primary-red hover:bg-primary-red/5 disabled:opacity-50 disabled:cursor-not-allowed max-md:p-2 max-md:text-[0.8rem]"
                onClick={() => shiftDate(-1)}
            >
                ←
            </button>

            <input
                type="date"
                className="bg-card-bg border border-border-color text-foreground p-2 rounded-md font-inherit text-[0.9rem] outline-none focus:border-accent-gold"
                value={currentDate}
                onChange={(e) => handleDateChange(e.target.value)}
            />

            <button
                className="px-4 py-2 rounded-md cursor-pointer text-[0.9rem] font-medium transition-all duration-200 flex items-center gap-2 bg-primary-red text-white! border-primary-red hover:bg-[#8e1824] hover:text-white!"
                onClick={setToday}
            >
                Today
            </button>

            <button
                className="bg-card-bg border border-border-color text-foreground px-4 py-2 rounded-md cursor-pointer text-[0.9rem] font-medium transition-all duration-200 flex items-center gap-2 hover:border-primary-red hover:text-primary-red hover:bg-primary-red/5 disabled:opacity-50 disabled:cursor-not-allowed max-md:p-2 max-md:text-[0.8rem]"
                onClick={() => shiftDate(1)}
            >
                →
            </button>
        </div>
    );
};

export default PanchangNavigator;
