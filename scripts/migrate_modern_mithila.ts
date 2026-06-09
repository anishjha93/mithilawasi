
import fs from 'fs';
import path from 'path';

const DICT_DIR = path.join(process.cwd(), 'src/dictionaries');
const TARGET_FILE = path.join(process.cwd(), 'src/data/modern_mithila.json');

function slugify(text: string) {
    return text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

function getCategoryFromSectionTitle(title: string) {
    if (title.includes('Infrastructure')) return 'Infrastructure';
    if (title.includes('Education')) return 'Education';
    if (title.includes('Economy')) return 'Economy';
    if (title.includes('Digital')) return 'Digital';
    return 'General';
}

async function migrate() {
    console.log('Reading dictionaries...');
    const en = JSON.parse(fs.readFileSync(path.join(DICT_DIR, 'en.json'), 'utf8'));
    const hi = JSON.parse(fs.readFileSync(path.join(DICT_DIR, 'hi.json'), 'utf8'));
    const mai = JSON.parse(fs.readFileSync(path.join(DICT_DIR, 'mai.json'), 'utf8'));

    const enPage = en.modernMithilaPage;
    const hiPage = hi.modernMithilaPage;
    const maiPage = mai.modernMithilaPage;

    if (!enPage || !enPage.sections) {
        console.error('No modernMithilaPage sections found in en.json');
        return;
    }

    const posts: any[] = [];
    const existingSlugs = new Set();

    enPage.sections.forEach((section: any, sIdx: number) => {
        const category = getCategoryFromSectionTitle(section.title);

        section.items.forEach((item: any, iIdx: number) => {
            // Safely access counterparts
            const hiItem = hiPage?.sections?.[sIdx]?.items?.[iIdx];
            const maiItem = maiPage?.sections?.[sIdx]?.items?.[iIdx];

            let slug = slugify(item.title);
            if (existingSlugs.has(slug)) {
                slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
            }
            existingSlugs.add(slug);

            const post = {
                slug,
                image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80", // Generic book/library image for now
                category,
                date: new Date().toISOString(),
                locales: {
                    en: {
                        title: item.title,
                        excerpt: item.desc,
                        content: `# ${item.title}\n\n${item.icon || ''} ${item.desc}\n\nThis is a major development in the ${category} sector of Mithila.`,
                        author: "Team Mithila"
                    },
                    hi: {
                        title: hiItem?.title || item.title,
                        excerpt: hiItem?.desc || item.desc,
                        content: `# ${hiItem?.title || item.title}\n\n${item.icon || ''} ${hiItem?.desc || item.desc}`,
                        author: "टीम मिथिला"
                    },
                    mai: {
                        title: maiItem?.title || item.title,
                        excerpt: maiItem?.desc || item.desc,
                        content: `# ${maiItem?.title || item.title}\n\n${item.icon || ''} ${maiItem?.desc || item.desc}`,
                        author: "टीम मिथिला"
                    }
                },
                published: true,
                tags: [category, "Mithila Development"]
            };

            // Custom image logic based on category/icon if desirable
            if (item.icon === '✈️') post.image = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"; // Airport
            if (item.icon === '🏥') post.image = "https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"; // Hospital
            if (item.icon === '🛣️') post.image = "https://images.unsplash.com/photo-1545173168-9f1947eebb8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"; // Road
            if (item.icon === '🌉') post.image = "https://images.unsplash.com/photo-1513828583688-c52646db42da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"; // Bridge

            posts.push(post);
        });
    });

    console.log(`Generated ${posts.length} posts.`);
    fs.writeFileSync(TARGET_FILE, JSON.stringify(posts, null, 2));
    console.log(`Wrote to ${TARGET_FILE}`);
}

migrate().catch(console.error);
