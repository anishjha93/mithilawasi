/**
 * Compresses an image file and converts it to WebP format.
 * @param file The original image file
 * @param maxWidth content max width (default 1920)
 * @param quality quality from 0 to 1 (default 0.8)
 * @returns Promise resolving to the compressed File
 */
export async function compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            image.src = e.target?.result as string;
        };

        reader.onerror = (e) => reject(e);

        image.onload = () => {
            const canvas = document.createElement('canvas');
            let width = image.width;
            let height = image.height;

            // Maintain aspect ratio if resizing needed
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            // High quality smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(image, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Canvas to Blob conversion failed'));
                        return;
                    }

                    // Create new file with .webp extension
                    const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                    const newFile = new File([blob], newFileName, {
                        type: 'image/webp',
                        lastModified: Date.now(),
                    });

                    resolve(newFile);
                },
                'image/webp',
                quality
            );
        };

        reader.readAsDataURL(file);
    });
}
