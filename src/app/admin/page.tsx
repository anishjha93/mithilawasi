"use client";

export const runtime = 'edge';

import { useState } from "react";

export default function AdminNotificationPage() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

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
                    topic: "all_users",
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to send");

            setStatus("success");
            setMessage(`✅ Sent! Message ID: ${data.messageId.split("/").pop()}`);
        } catch (err: any) {
            setStatus("error");
            setMessage(`❌ Error: ${err.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-red-700 p-6 text-white text-center">
                    <h1 className="text-2xl font-bold font-serif">📢 Mithila Admin</h1>
                    <p className="text-red-100 text-sm">Send Broadcast Notifications</p>
                </div>

                <form onSubmit={handleSend} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. 🪔 Maithili Class Today"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message Body
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="e.g. Join us live at 5 PM for the event..."
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL (Optional)
                        </label>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.png"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-red-700 text-white py-3 rounded-lg font-bold hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {status === "loading" ? (
                            <>🚀 Sending...</>
                        ) : (
                            <>🔔 Send Notification</>
                        )}
                    </button>

                    {message && (
                        <div
                            className={`p-3 rounded-lg text-sm text-center ${status === "success"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                        >
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
