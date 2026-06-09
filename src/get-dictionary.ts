import 'server-only';

const dictionaries = {
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    hi: () => import('./dictionaries/hi.json').then((module) => module.default),
    mai: () => import('./dictionaries/mai.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'en' | 'hi' | 'mai') => dictionaries[locale]();
