export async function getCollectionData<T>(collectionName: string, idField: string = 'slug'): Promise<T[]> {
    // 1. Try Firestore First (ONLY if not on Edge/Cloudflare)
    const isEdge = process.env.NEXT_RUNTIME === 'edge' || !!process.env.CF_PAGES;

    if (!isEdge) {
        try {
            const { initAdmin } = await import('./firebase-admin');
            const adminApp = await initAdmin();
            if (adminApp) {
                const db = adminApp.firestore();
                const snapshot = await db.collection(collectionName).get();
                
                if (!snapshot.empty) {
                    console.log(`✅ Loaded ${collectionName} from Firestore (${snapshot.size} items)`);
                    return snapshot.docs.map((doc: any) => ({
                    [idField]: doc.id,
                    ...doc.data()
                })) as T[];
                }
            }
        } catch (e) {
            console.warn(`⚠️ Firestore failed or empty for ${collectionName}. Falling back to local JSON.`, e);
        }
    }

    // 2. Fallback to bundled JSON (Initial state / Dev)
    try {
        // Dynamic import to allow bundling on Cloudflare Pages/Vercel Edge
        // The bundler will include all JSON files in src/data that match this pattern
        const data = await import(`@/data/${collectionName}.json`);
        
        // Dynamic imports for JSON return a module with a 'default' property
        return (data.default || data) as T[];
    } catch (error) {
        console.error(`Error loading ${collectionName}.json:`, error);
        
        // Fallback for types that might be .ts files (though current usage seems to favor .json)
        try {
           const data = await import(`@/data/${collectionName}`);
           return (data.default || data) as T[];
        } catch (e) {
           console.error(`Failed fallback for ${collectionName}:`, e);
           return [];
        }
    }
}

export async function getDocumentByField<T>(collectionName: string, field: string, value: string): Promise<T | null> {
    const data = await getCollectionData<T>(collectionName, field);
    return (data as any[]).find(doc => doc[field] === value) || null;
}
