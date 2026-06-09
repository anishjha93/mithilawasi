import "server-only";

/**
 * Edge-compatible Firebase Admin initializer.
 * Uses dynamic imports to avoid bundling Node-only SDKs into Edge/Browser runtimes.
 */
export async function initAdmin() {
    // Check if we are running in the Edge runtime
    const isEdge = (globalThis as any).EdgeRuntime === 'string';
    
    if (isEdge) {
        console.warn("⚠️ initAdmin called in Edge runtime. Firebase Admin is partially limited here.");
        // We can't use the full 'firebase-admin' SDK in Edge.
        // If we strictly need Firestore, we'd use the REST API.
        // For now, return null to prevent crashes.
        return null;
    }

    try {
        // Dynamic import to prevent Edge bundler from seeing 'firebase-admin' as a dependency
        const admin = (await import("firebase-admin")).default;

        if (admin.apps.length > 0) {
            return admin.app();
        }

        // Global variable to prevent re-initialization in dev mode (hot reload)
        const globalWithFirebase = global as typeof globalThis & {
            firebaseAdminApp?: any;
        };

        if (globalWithFirebase.firebaseAdminApp) {
            return globalWithFirebase.firebaseAdminApp;
        }

        let serviceAccount;

        // Use Environment Variable for all environments (Cloudflare/Prod/Local)
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            console.log("Initializing Firebase Admin using environment variable.");
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } else {
            console.warn(`⚠️ FIREBASE_SERVICE_ACCOUNT environment variable not found. Some features may not work.`);
            return null;
        }

        if (serviceAccount) {
            const app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            globalWithFirebase.firebaseAdminApp = app;
            return app;
        }
        
        return null;
    } catch (error) {
        console.error("❌ Failed to initialize Firebase Admin:", error);
        return null;
    }
}
