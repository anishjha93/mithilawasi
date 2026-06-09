"use client";

import { useState } from "react";
import {
    Bell,
    Send,
    Image as ImageIcon,
    Loader2,
    Smartphone,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { getTodayPanchang } from "@/app/[lang]/_admin-src/actions";
import { useRouter } from 'next/navigation';

export default function PushNotificationsView() {
    const router = useRouter();

    // Notification State
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [uiStatus, setUiStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: '' });

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    body,
                    imageUrl,
                    linkUrl,
                    topic: "all_users",
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to send");

            setStatus("success");
            setMessage(`✅ Sent! Message ID: ${data.messageId?.split("/").pop()}`);
            setUiStatus({ type: 'success', message: "Broadcast sent successfully!" });
            setTimeout(() => setUiStatus({ type: 'idle', message: '' }), 3000);
        } catch (err: any) {
            setStatus("error");
            setMessage(`❌ Error: ${err.message}`);
            setUiStatus({ type: 'error', message: err.message || "Failed to send" });
        }
    };

    return (
        <div className="font-sans pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {uiStatus.type !== 'idle' && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 z-50 ${uiStatus.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'
                    }`}>
                    {uiStatus.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-bold text-sm">{uiStatus.message}</span>
                </div>
            )}

            <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 xl:gap-16 items-start">

                {/* Form Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 md:p-8 relative">
                    {status === "loading" && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 rounded-2xl flex items-center justify-center">
                            {/* Loading overlay */}
                        </div>
                    )}
                    <form onSubmit={handleSend} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                Notification Title
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. 🪔 Shubho Vivah Panchami"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder-gray-400 text-lg font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                Message Body
                            </label>
                            <textarea
                                required
                                rows={4}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Type your broadcast message clearly..."
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none placeholder-gray-400 text-lg"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
                                    <ImageIcon size={16} />
                                    Image URL <span className="text-gray-400 font-normal normal-case">(Optional)</span>
                                </label>
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
                                    🔗 Link URL <span className="text-gray-400 font-normal normal-case">(Optional)</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        placeholder="https://mithilawasi.com/blog..."
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!linkUrl) return;
                                            const btn = document.getElementById('magic-btn');
                                            if (btn) btn.innerHTML = '⏳';

                                            try {
                                                const res = await fetch('/api/fetch-metadata', {
                                                    method: 'POST',
                                                    body: JSON.stringify({ url: linkUrl })
                                                });
                                                const data = await res.json();
                                                if (data.success) {
                                                    if (data.metadata.image) setImageUrl(data.metadata.image);
                                                    // Use description for body if available, otherwise title
                                                    if (data.metadata.description) setBody(data.metadata.description);
                                                    else if (data.metadata.title) setBody(data.metadata.title);

                                                    // Set title if empty
                                                    if (!title && data.metadata.title) setTitle(data.metadata.title);
                                                }
                                            } catch (e) {
                                                console.error(e);
                                            }
                                            if (btn) btn.innerHTML = '✨';
                                        }}
                                        id="magic-btn"
                                        disabled={!linkUrl}
                                        className="bg-orange-100 hover:bg-orange-200 text-orange-700 p-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Auto-fill content from URL"
                                    >
                                        ✨
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={status === "loading" || !title || !body}
                                className="w-full bg-gradient-to-r from-red-700 to-red-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-900/20 hover:shadow-xl hover:shadow-red-900/30 transition-all active:scale-[0.99] disabled:opacity-70 disabled:grayscale flex items-center justify-center gap-3"
                            >
                                {status === "loading" ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        Sending Broadcast...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Send Broadcast
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Templates Section */}
                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                            Quick Templates
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={async () => {
                                    const res = await getTodayPanchang();
                                    if (res) {
                                        setTitle(res.title);
                                        setBody(res.body);
                                    }
                                }}
                                className="p-3 rounded-xl border border-red-50 bg-red-50/50 hover:bg-red-50 text-red-800 text-sm font-medium transition-colors text-left flex flex-col gap-1 items-start group"
                            >
                                <span className="text-lg group-hover:scale-110 transition-transform">🪔</span>
                                <span>Azuk Panchang</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setTitle("🌞 सुप्रभात (Good Morning)");
                                    setBody("सुप्रभात मिथिला! अपने दिन की शुरुआत सकारात्मक ऊर्जा के साथ करें। जय मिथिला, जय मैथिली!");
                                }}
                                className="p-3 rounded-xl border border-orange-50 bg-orange-50/50 hover:bg-orange-50 text-orange-800 text-sm font-medium transition-colors text-left flex flex-col gap-1 items-start group"
                            >
                                <span className="text-lg group-hover:scale-110 transition-transform">🌞</span>
                                <span>Suprabhat</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="space-y-6 lg:sticky lg:top-8 mt-8 lg:mt-0">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                        <Smartphone size={14} />
                        Live Preview
                    </div>

                    {/* Android Notification Preview */}
                    <div className="bg-[#f0f2f5] rounded-[32px] p-6 shadow-inner border border-gray-200/50 relative overflow-hidden">
                        {/* Phone Status Bar Mock */}
                        <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium mb-6 px-2 opacity-50">
                            <span>9:41</span>
                            <div className="flex gap-1">
                                <span>📶</span>
                                <span>🔋</span>
                            </div>
                        </div>

                        {/* Notification Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-4 relative overflow-hidden transform transition-all hover:scale-[1.02] cursor-default">
                            <div className="flex gap-3 items-start">
                                <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-700">
                                    <Bell size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h4 className="text-sm font-bold text-gray-900 truncate pr-2">Mithilawasi</h4>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap">now</span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 leading-snug mb-1 line-clamp-1">
                                        {title || "Notification Title"}
                                    </p>
                                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                        {body || "Your message body will appear here as a preview of what the user receives."}
                                    </p>
                                    {imageUrl && (
                                        <div className="mt-3 rounded-xl overflow-hidden h-40 bg-gray-100 border border-gray-100 relative shadow-sm">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    {linkUrl && (
                                        <div className="mt-2 flex items-center gap-2 text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 max-w-full">
                                            <span className="flex-shrink-0">🔗</span>
                                            <span className="truncate">{linkUrl}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100/50 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                            <div className="text-2xl pt-1">💡</div>
                            <div>
                                <h3 className="font-serif font-bold text-orange-900 mb-1">Best Practices</h3>
                                <ul className="text-sm text-orange-800/80 space-y-2 list-disc pl-4 leading-relaxed">
                                    <li>Keep titles short and punchy (under 40 chars).</li>
                                    <li>Use emojis 🪔 sparingly to catch attention.</li>
                                    <li>Send messages at appropriate local times.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
