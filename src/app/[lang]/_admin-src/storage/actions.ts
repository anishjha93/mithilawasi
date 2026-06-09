import { r2, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";
import { ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from 'next/cache';

export interface StorageObject {
    key: string;
    size: number;
    lastModified: Date;
    url: string;
    isUsed?: boolean;
    usages?: string[];
}

export async function listObjects() {
    try {
        const command = new ListObjectsV2Command({
            Bucket: R2_BUCKET_NAME,
        });
        const response = await r2.send(command);
        const contents = response.Contents || [];

        const objects: StorageObject[] = contents.map(item => {
            const key = item.Key || "";
            // Encode path segments but preserve slashes for URL
            const encodedKey = key.split('/').map(segment => encodeURIComponent(segment)).join('/');

            return {
                key: key,
                size: item.Size || 0,
                lastModified: item.LastModified || new Date(),
                url: `${R2_PUBLIC_URL}/${encodedKey}`,
                isUsed: false, // Usage scanning disabled in Edge runtime
                usages: []
            };
        });

        return { success: true, objects };
    } catch (error: any) {
        console.error("Error listing R2 objects:", error);
        return { success: false, error: error.message, objects: [] };
    }
}

export async function deleteObject(key: string) {
    console.log(`[R2] Attempting to delete object: "${key}"`);
    try {
        const command = new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
        });
        const result = await r2.send(command);
        console.log(`[R2] Delete success for "${key}". Metadata:`, result.$metadata);
        revalidatePath('/[lang]/admin/storage', 'page');
        revalidatePath('/[lang]/admin', 'page');
        return { success: true };
    } catch (error: any) {
        console.error(`[R2] Error deleting "${key}":`, error);
        return { success: false, error: error.message };
    }
}
