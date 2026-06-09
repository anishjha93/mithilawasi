import { getRequestContext } from '@cloudflare/next-on-pages';

/**
 * Helper to get the D1 database instance from the Cloudflare request context.
 * In development (local), this might be null if not using 'wrangler pages dev'.
 */
export function getDb(): any {
    try {
        const context = getRequestContext();
        // Try all possible binding names in order of preference
        const db = context?.env?.mithila_db || 
                   context?.env?.DB || 
                   (process.env as any).mithila_db || 
                   (process.env as any).DB;

        if (db) {
            console.log('Successfully resolved D1 database binding');
            return db;
        }

        console.error('Failed to resolve D1 database binding. Available env keys:', 
            context?.env ? Object.keys(context.env) : 'no-context-env'
        );
        return null;
    } catch (e) {
        console.error('Error in getDb:', e);
        return null;
    }
}
