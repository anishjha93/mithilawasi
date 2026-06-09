/**
 * Estimates reading time based on content length.
 * Average reading speed: 200 words per minute.
 */
export function estimateReadingTime(title: string, content: string): number {
    const wordCount = (title.split(/\s+/).length + content.split(/\s+/).length);
    const wordsPerMinute = 200;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
