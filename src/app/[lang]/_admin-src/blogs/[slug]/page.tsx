"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { checkAuth } from "../../actions";
import { getBlog, saveBlog } from "../actions";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import SEOChecklist from '@/components/admin/SEOChecklist';
import MarkdownToolbar from '@/components/admin/MarkdownToolbar';
import ResizableImage from '@/components/admin/ResizableImage';
import { uploadImageToR2 } from "../upload-action";
import {
    ArrowLeft,
    Save,
    Eye,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Calendar,
    User,
    Image as ImageIcon,
    Upload,
    Type,
    FileText,
    Globe,
    Settings,
    Layout,
    Maximize2,
    Minimize2,
    Info,
    Languages
} from "lucide-react";
import Link from "next/link";


const preprocessMDX = (content: string) => {
    // 1. Handle explicit <Spacer /> tags (supports height="20px", height={20}, etc.)
    let processed = content
        .replace(/<Spacer\s+height={?(?:"|')?([^}\s"'>]+)(?:"|'|})?\s*\/?>/g, '<spacer height="$1"></spacer>')
        .replace(/<ExternalImage\s+src="([^"]+)"\s*(?:width="([^"]+)")?\s*(?:alt="([^"]+)")?\s*\/?>/g, '<externalimage src="$1" width="$2" alt="$3"></externalimage>')
        .replace(/<ExternalImage\s+url="([^"]+)"\s*(?:width="([^"]+)")?\s*(?:alt="([^"]+)")?\s*\/?>/g, '<externalimage src="$1" width="$2" alt="$3"></externalimage>');

    // 2. Convert multiple newlines (3 or more) into explicit uppercase spacers
    processed = processed.replace(/\r\n/g, '\n').replace(/\n{3,}/g, (match) => {
        const count = match.split('\n').length - 2;
        return `\n\n<spacer height="${count * 24}px"></spacer>\n\n`;
    });

    return processed;
};

export default function BlogEditorPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const slug = params.slug as string;
    const lang = params.lang as string;

    const isNew = slug === "new";
    const editLang = searchParams.get("lang") || lang;
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [showDraftRestore, setShowDraftRestore] = useState(false);
    const [draftData, setDraftData] = useState<any>(null);

    const [isSlugTouched, setIsSlugTouched] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [leftPaneWidth, setLeftPaneWidth] = useState(50); // percentage
    const [isResizing, setIsResizing] = useState(false);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [form, setForm] = useState({
        title: "",
        slug: isNew ? "" : slug,
        lang: editLang,
        date: new Date().toISOString().split('T')[0],
        author: "Mithilawasi Team",
        excerpt: "",
        image: "",
        content: "",
        status: "draft" as 'draft' | 'published' | 'archived'
    });

    const updateImageWidthInMarkdown = useCallback((targetSrc: string, newWidth: string) => {
        setForm(prev => {
            const content = prev.content;
            // Catch both <ExternalImage /> and <externalimage /> 
            const regex = new RegExp(`(<ExternalImage\\s+[^>]*src="${targetSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*?)(width="[^"]*")?([^>]*\\/?>)`, 'gi');

            const newContent = content.replace(regex, (match, before, widthAttr, after) => {
                if (widthAttr) {
                    return `${before}width="${newWidth}"${after}`;
                } else {
                    return `${before}width="${newWidth}" ${after}`;
                }
            });

            return { ...prev, content: newContent };
        });
    }, []);

    const previewComponents = useMemo(() => ({
        img: ({ node, ...props }: any) => (
            <figure className="my-8 group relative">
                <img
                    {...props}
                    className="max-width-full h-auto rounded-lg block mx-auto shadow-sm border border-orange-50"
                />
                {props.alt && <figcaption className="text-center text-gray-400 text-xs mt-3 italic">{props.alt}</figcaption>}
            </figure>
        ),
        hr: () => (
            <div className="py-6 border-b border-orange-50/50 mb-8" aria-hidden="true" />
        ),
        spacer: ({ node, height, ...props }: any) => {
            const h = typeof height === 'number' ? `${height}px` : height || '20px';
            return <div style={{ height: h }} aria-hidden="true" {...props} />;
        },
        externalimage: ({ node, src, url, alt, width, ...props }: any) => {
            const imageUrl = src || url;
            return (
                <ResizableImage
                    src={imageUrl}
                    alt={alt}
                    initialWidth={width}
                    onResizeStop={(newWidth) => updateImageWidthInMarkdown(imageUrl, newWidth)}
                />
            );
        },
        h1: ({ node, ...props }: any) => <h1 className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4 border-b border-gray-100 pb-2 leading-tight" {...props} />,
        h2: ({ node, ...props }: any) => <h2 className="text-xl font-serif font-bold text-gray-900 mt-8 mb-4 leading-tight" {...props} />,
        h3: ({ node, ...props }: any) => <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3" {...props} />,
        p: ({ node, ...props }: any) => <div className="text-gray-700 leading-relaxed mb-6 text-base" {...props} />,
        ul: ({ node, ...props }: any) => <ul className="list-disc ml-6 mb-4 space-y-2 text-gray-700" {...props} />,
        ol: ({ node, ...props }: any) => <ol className="list-decimal ml-6 mb-4 space-y-2 text-gray-700" {...props} />,
        blockquote: ({ node, ...props }: any) => (
            <blockquote className="border-l-4 border-red-800 pl-4 py-1 my-6 italic text-gray-600 bg-red-50/20 rounded-r font-serif text-lg" {...props} />
        ),
        code: ({ node, ...props }: any) => <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm text-red-700" {...props} />,
    }), [updateImageWidthInMarkdown]);

    const fetchBlogData = useCallback(async (targetLang: string) => {
        setIsFetchingData(true);
        setStatus("idle");
        setMessage("");
        try {
            const blog = await getBlog(slug, targetLang);
            if (blog) {
                setForm({
                    ...blog,
                    date: blog.date.split('T')[0]
                });
            } else {
                // If not found, clear fields for new translation
                setForm({
                    title: "",
                    slug: slug,
                    lang: targetLang,
                    date: new Date().toISOString().split('T')[0],
                    author: "Mithilawasi Team",
                    excerpt: "",
                    image: "",
                    content: "",
                    status: "draft"
                });
            }
        } catch (error) {
            console.error("Failed to fetch blog:", error);
            setStatus("error");
            setMessage("Failed to load language version");
        } finally {
            setIsFetchingData(false);
        }
    }, [slug]);

    useEffect(() => {
        const init = async () => {
            const isAuth = await checkAuth();
            setIsAuthenticated(isAuth);
            setIsLoadingAuth(false);
            if (isAuth && !isNew) {
                fetchBlogData(editLang);
            }

            // Check for existing drafts
            const draftId = `blog_draft_${slug}_${editLang}`;
            const savedDraft = localStorage.getItem(draftId);
            if (savedDraft) {
                const parsed = JSON.parse(savedDraft);
                setDraftData(parsed);
                setShowDraftRestore(true);
            }
        };
        init();
    }, [isNew, editLang, fetchBlogData]);

    // Auto-save effect
    useEffect(() => {
        if (!isAuthenticated || isLoadingAuth) return;

        const timeout = setTimeout(() => {
            const draftId = `blog_draft_${slug}_${editLang}`;
            localStorage.setItem(draftId, JSON.stringify(form));
            setLastSaved(new Date());
            console.log("Draft auto-saved to localStorage");
        }, 1000); // Debounce save

        return () => clearTimeout(timeout);
    }, [form, slug, editLang, isAuthenticated, isLoadingAuth]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "lang") {
            if (isNew) {
                setForm(prev => ({ ...prev, [name]: value }));
            } else {
                // Trigger data load for existing post translation
                fetchBlogData(value);
            }
            return;
        }

        if (name === "slug") {
            setIsSlugTouched(true);
            const slugValue = value.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
            setForm(prev => ({ ...prev, [name]: slugValue }));
            return;
        }

        setForm(prev => ({ ...prev, [name]: value }));

        if (name === "title" && isNew && !isSlugTouched) {
            const slugValue = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setForm(prev => ({ ...prev, slug: slugValue }));
        }
    };

    const handleInsert = (prefix: string, suffix: string = "") => {
        if (!contentRef.current) return;

        const textarea = contentRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selection = text.substring(start, end);

        const before = text.substring(0, start);
        const after = text.substring(end);

        const newContent = before + prefix + selection + suffix + after;

        setForm(prev => ({ ...prev, content: newContent }));

        // Focus and set selection back
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + prefix.length + selection.length + suffix.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsResizing(true);
        e.preventDefault();
    };


    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !containerRef.current) return;
            const containerRect = containerRef.current.getBoundingClientRect();
            const relativeX = e.clientX - containerRect.left;
            const newWidth = (relativeX / containerRect.width) * 100;

            if (newWidth > 15 && newWidth < 85) {
                setLeftPaneWidth(newWidth);
            }
        };
        const handleMouseUp = () => setIsResizing(false);

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);

        try {
            let fileToUpload = file;

            // Compress if not WebP or if size > 1MB
            if (file.type !== 'image/webp' || file.size > 1024 * 1024) {
                console.log("Compressing image...");
                // Dynamically import to avoid server-side issues if any
                const { compressImage } = await import('@/lib/image-utils');
                fileToUpload = await compressImage(file);
                console.log(`Compressed: ${file.size} -> ${fileToUpload.size} bytes`);
            }

            const formData = new FormData();
            formData.append('file', fileToUpload);

            const res = await uploadImageToR2(formData);
            if (res.success && res.url) {
                setForm(prev => ({ ...prev, image: res.url }));
                setStatus("success");
                setMessage("Image uploaded successfully!");
                setTimeout(() => setStatus("idle"), 2000);
            } else {
                setStatus("error");
                setMessage(res.error || "Upload failed");
            }
        } catch (error) {
            console.error("Compression/Upload error:", error);
            setStatus("error");
            setMessage("Failed to process image. Please try a smaller file.");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        setStatus("idle");
        setMessage("");

        const blogToSave = {
            ...form,
            date: new Date(form.date).toISOString()
        };

        const res = await saveBlog(blogToSave);
        if (res.success) {
            setStatus("success");
            setMessage("Blog post saved successfully!");
            // Clear auto-save draft on success
            const draftId = `blog_draft_${slug}_${editLang}`;
            localStorage.removeItem(draftId);

            setTimeout(() => setStatus("idle"), 2000);

            if (isNew) {
                setTimeout(() => router.push(`/${lang}/admin/blogs`), 1500);
            }
        } else {
            setStatus("error");
            setMessage(res.error || "Failed to save blog post");
        }
        setIsSaving(false);
    };

    if (isLoadingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
                <Loader2 className="animate-spin text-red-800" size={32} />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <div className="p-10 text-center">Unauthorized</div>;
    }

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-sans flex flex-col h-screen overflow-hidden">
            <header className="bg-white border-b border-orange-100 h-16 shrink-0 z-40 shadow-sm flex items-center px-4 md:px-8 justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-orange-50 rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-base font-bold font-serif text-gray-900 leading-tight">
                                {isNew ? "New Blog" : "Edit Blog"}
                            </h1>
                            <div className="flex items-center gap-2">
                                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                                    {form.slug || "mithila-legacy"}
                                </p>
                                {lastSaved && (
                                    <span className="text-[9px] text-green-600 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-left-1">
                                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                        Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                        </div>
                        {isFetchingData && <Loader2 className="animate-spin text-orange-400" size={14} />}
                    </div>
                </div>

                {/* Mobile Tabs & Save */}
                <div className="flex items-center gap-3">
                    {status !== 'idle' && (
                        <div className={`absolute top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 z-50 ${status === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'
                            }`}>
                            {status === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="font-bold text-sm">{message}</span>
                        </div>
                    )}

                    <div className="flex md:hidden bg-gray-100 p-0.5 rounded-lg mr-2">
                        <button
                            onClick={() => setActiveTab('write')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeTab === 'write' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                        >
                            Write
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeTab === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                        >
                            Preview
                        </button>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSaving || isFetchingData}
                        className="bg-gradient-to-r from-red-700 to-red-900 text-white px-3 md:px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-70"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        <span className="hidden md:inline">Save Post</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                <form onSubmit={handleSubmit} className="contents">
                    {/* TOP SETTINGS BAR */}
                    <div className="bg-white border-b border-orange-100 p-3 px-1 md:px-6 shrink-0 flex flex-wrap items-center gap-x-6 gap-y-3 z-30 shadow-sm relative">
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Languages size={10} className="text-orange-600" /> Language
                                </label>
                                <select
                                    name="lang"
                                    value={form.lang}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-200 px-2 py-1 rounded outline-none focus:border-red-500 font-medium text-[11px] w-24"
                                >
                                    <option value="en">English</option>
                                    <option value="hi">Hindi</option>
                                    <option value="mai">Maithili</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Slug</label>
                                <input
                                    name="slug"
                                    value={form.slug}
                                    onChange={handleChange}
                                    placeholder="url-slug..."
                                    className="bg-gray-50 border border-gray-200 px-2 py-1 rounded outline-none focus:border-red-500 font-medium text-[11px] w-32"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className={`px-2 py-1 rounded border outline-none font-bold text-[11px] w-24 ${form.status === 'published' ? 'bg-green-50 border-green-200 text-green-700' :
                                        form.status === 'draft' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-gray-50 border-gray-200 text-gray-500'
                                        }`}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-200 px-2 py-1 rounded outline-none focus:border-red-500 font-medium text-[11px]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-6 flex-1 min-w-[300px]">
                            <div className="flex items-center gap-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Author</label>
                                <input
                                    name="author"
                                    value={form.author}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-200 px-2 py-1 rounded outline-none focus:border-red-500 font-medium text-[11px] w-32"
                                />
                            </div>

                            <div className="flex items-center gap-2 flex-1 relative">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                    <ImageIcon size={10} /> Image
                                </label>
                                <div className="flex-1 flex items-center gap-1">
                                    <input
                                        name="image"
                                        value={form.image}
                                        onChange={handleChange}
                                        placeholder="Image URL..."
                                        className="bg-gray-50 border border-gray-200 px-2 py-1 rounded outline-none focus:border-red-500 font-medium text-[11px] w-full"
                                    />
                                    <label className={`shrink-0 cursor-pointer p-1 rounded border border-orange-100 hover:bg-orange-50 transition-colors ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        {isUploadingImage ? <Loader2 className="animate-spin text-orange-400" size={14} /> : <Upload className="text-orange-600" size={14} />}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={isUploadingImage}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEO CHECKLIST - HORIZONTAL BAR */}
                    <SEOChecklist
                        title={form.title}
                        excerpt={form.excerpt}
                        content={form.content}
                        image={form.image}
                        slug={form.slug}
                    />

                    <div
                        ref={containerRef}
                        className={`flex-1 flex overflow-hidden relative ${isResizing ? 'cursor-col-resize select-none' : ''}`}
                    >
                        {/* EDITOR COLUMN */}
                        <div
                            className={`flex-shrink-0 flex flex-col p-4 md:p-6 pb-20 border-r border-orange-100 bg-[#fdfbf7] overflow-y-auto ${isResizing ? 'pointer-events-none' : ''} ${activeTab === 'write' ? 'w-full md:w-auto block' : 'hidden md:flex'}`}
                            style={{ width: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : `${leftPaneWidth}%` }}
                        >
                            {isFetchingData && (
                                <div className="absolute inset-0 bg-[#fdfbf7]/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
                                    <div className="bg-white p-4 rounded-2xl shadow-xl border border-orange-100 flex items-center gap-3">
                                        <Loader2 className="animate-spin text-red-800" size={20} />
                                        <span className="text-sm font-bold text-gray-900">Loading version...</span>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm flex flex-col shrink-0 relative">
                                <div className="p-4 border-b border-gray-50 flex flex-col gap-4">
                                    <input
                                        required
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full text-lg font-serif font-bold text-gray-900 bg-transparent outline-none placeholder:text-gray-200"
                                        placeholder="Post Title..."
                                    />
                                    <MarkdownToolbar onInsert={handleInsert} />
                                </div>
                                <div className="relative">
                                    <textarea
                                        ref={contentRef}
                                        required
                                        name="content"
                                        value={form.content}
                                        onChange={handleChange}
                                        rows={Math.max(30, form.content.split('\n').length + 2)}
                                        className="w-full bg-gray-50/10 p-6 outline-none font-mono text-sm leading-relaxed resize-none overflow-hidden"
                                        placeholder="Start writing..."
                                    />
                                    <div className="absolute bottom-4 right-6 group">
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-orange-400 bg-white shadow-sm border border-orange-50 px-2 py-0.5 rounded-full cursor-help hover:text-orange-600 transition-colors">
                                            <Info size={10} /> Markdown
                                        </div>
                                        <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-gray-900 text-white rounded-xl text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-2xl">
                                            <p className="mb-2 font-bold text-orange-400">Pro Tip:</p>
                                            <ul className="space-y-1 text-gray-300">
                                                <li>• Use `---` for space</li>
                                                <li>• `![alt](url)` for images</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-orange-50/30 border-t border-orange-50 shrink-0 flex items-start gap-3">
                                    <label className="text-[9px] font-extrabold text-orange-400 uppercase tracking-tighter pt-1">Excerpt</label>
                                    <textarea
                                        name="excerpt"
                                        value={form.excerpt}
                                        onChange={handleChange}
                                        rows={2}
                                        className="flex-1 bg-transparent outline-none text-[11px] text-gray-600 border-none resize-none min-h-[40px] leading-relaxed"
                                        placeholder="A short summary for search results..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RESIZER */}
                        <div
                            onMouseDown={handleMouseDown}
                            className={`hidden md:block w-1.5 h-full hover:bg-orange-200 transition-colors cursor-col-resize z-30 shrink-0 ${isResizing ? 'bg-orange-300' : 'bg-transparent'}`}
                        />

                        {/* PREVIEW COLUMN */}
                        <div
                            className={`flex-1 flex flex-col p-4 md:p-6 pb-20 min-w-0 bg-[#fdfbf7] border-l border-orange-50 overflow-y-auto ${isResizing ? 'pointer-events-none opacity-40 grayscale-[0.5]' : ''} ${activeTab === 'preview' ? 'w-full block' : 'hidden md:flex'}`}
                            style={{ width: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : `${100 - leftPaneWidth}%` }}
                        >
                            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm flex flex-col min-h-fit">
                                <div className="h-10 px-4 flex items-center justify-between border-b border-gray-50 bg-gray-50/20 shrink-0">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Eye size={12} /> Live Preview
                                    </span>
                                </div>
                                <div className="p-8 md:p-12 prose prose-orange prose-sm max-w-none flex-1">
                                    <div className="mb-6 shrink-0">
                                        {form.image && (
                                            <img src={form.image} alt="Featured" className="w-full aspect-video object-cover rounded-xl mb-6 shadow-sm border border-orange-50" />
                                        )}
                                        <h1 className="text-2xl font-serif font-extrabold text-gray-900 mb-4 leading-tight">
                                            {form.title || "Your Blog Post"}
                                        </h1>
                                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium">
                                            <Calendar size={10} className="text-orange-700" />
                                            {new Date(form.date).toLocaleDateString()}
                                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                                            <User size={10} className="text-red-800" />
                                            {form.author}
                                        </div>
                                    </div>

                                    <div className="blog-content">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm, remarkBreaks]}
                                            rehypePlugins={[rehypeRaw]}
                                            components={previewComponents as any}
                                        >
                                            {preprocessMDX(form.content)}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>

            {/* Draft Restore Modal */}
            {showDraftRestore && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in duration-200 text-center">
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="text-orange-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Draft Found</h3>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            A saved draft was found for this post from your previous session.
                            Would you like to restore it?
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => {
                                    localStorage.removeItem(`blog_draft_${slug}_${editLang}`);
                                    setShowDraftRestore(false);
                                }}
                                className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-xl transition-colors"
                            >
                                Discard
                            </button>
                            <button
                                onClick={() => {
                                    setForm(draftData);
                                    setShowDraftRestore(false);
                                }}
                                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-900/20 transition-all active:scale-[0.98]"
                            >
                                Restore
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
