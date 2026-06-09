'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Send,
    FileText,
    LayoutTemplate,
    History,
    AlertCircle,
    CheckCircle2,
    ArrowLeft,
    Loader2,
    Smartphone,
    Tablet,
    Monitor,
    Sparkles,
    Settings,
    Eye
} from 'lucide-react';
import { getEmailContentImports, resolveLocalImageToBase64, EmailImportContent } from '@/app/actions/blog-import';
import { sendEmailCampaign, getEmailLogsAction } from '@/app/actions/email';

// Branding Constants for Consistency
const BRAND_HEADER = `
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 2px solid #f97316; background-color: #ffffff;">
  <tr>
    <td align="left" style="padding: 16px 24px;">
      <span style="color: #f97316; font-weight: 800; font-size: 16px; letter-spacing: 1px; text-transform: uppercase; font-family: sans-serif;">Mithilawasi</span>
    </td>
    <td align="right" style="padding: 16px 24px;">
      <span style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-family: sans-serif;">[CATEGORY] • 2026</span>
    </td>
  </tr>
</table>
`;

const BRAND_FOOTER = `
<div style="background-color: #fcfcfc; border-top: 1px solid #f1f5f9; padding: 40px 24px; text-align: center;">
  <h4 style="color: #475569; margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-family: sans-serif;">Explore More from Our Heritage</h4>
  <div style="display: table; width: 100%; margin: 10px 0;">
    <div style="display: table-cell; padding: 10px;">
      <a href="https://mithilawasi.com/en/blog" style="color: #ea580c; text-decoration: none; font-size: 13px; font-weight: 600; font-family: sans-serif;">Latest Stories</a>
    </div>
    <div style="display: table-cell; padding: 10px;">
      <a href="https://mithilawasi.com/en/food" style="color: #ea580c; text-decoration: none; font-size: 13px; font-weight: 600; font-family: sans-serif;">Flavors of Mithila</a>
    </div>
    <div style="display: table-cell; padding: 10px;">
      <a href="https://mithilawasi.com/en/art" style="color: #ea580c; text-decoration: none; font-size: 13px; font-weight: 600; font-family: sans-serif;">Art & Culture</a>
    </div>
  </div>
  <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 11px; font-family: sans-serif;">
    You are receiving this because you subscribed to Mithilawasi.<br />
    Darbhanga, Madhubani, Bihar • Janakpur, Nepal<br />
    <a href="[UNSUBSCRIBE_LINK]" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a>
  </div>
</div>
`;

// Email Templates
const EMAIL_TEMPLATES = [
    {
        id: 'welcome',
        name: 'Welcome Email',
        type: 'blog',
        description: 'New subscriber welcome email. Modern and warm.',
        body: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #f97316; border-radius: 24px; overflow: hidden; margin-top: 20px;">
  ${BRAND_HEADER}
  <div style="padding: 40px; text-align: center; background: linear-gradient(135deg, #fffaf5 0%, #fff1e6 100%);">
    <div style="font-size: 48px; margin-bottom: 16px;">🙏</div>
    <h1 style="color: #ea580c; margin: 0; font-size: 32px; font-family: serif;">Welcome to Mithilawasi</h1>
    <p style="color: #7c2d12; font-size: 18px; margin-top: 12px;">We're honored to have you in our community.</p>
  </div>
  <div style="padding: 40px;">
    <p style="font-size: 16px; color: #4a4a4a; line-height: 1.8; margin-bottom: 24px;">
      Hello! We are thrilled to welcome you to <b>Mithilawasi</b>. Our mission is to preserve and celebrate the vibrant heritage of Mithila—from its ancient history and sacred mantras to its world-famous art and culinary delights.
    </p>
    <div style="background: #fff7ed; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
      <h3 style="color: #92400e; margin: 0 0 12px 0;">What to expect:</h3>
      <ul style="color: #b45309; font-size: 14px; margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 8px;">Exclusive deep dives into Mithila's history.</li>
        <li style="margin-bottom: 8px;">Traditional recipes from our kitchens.</li>
        <li style="margin-bottom: 8px;">Updates on local art and festivals.</li>
      </ul>
    </div>
    <div style="text-align: center;">
      <a href="https://mithilawasi.com" style="display: inline-block; background-color: #ea580c; color: white; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; box-shadow: 0 10px 15px -3px rgba(234, 88, 12, 0.3);">Explore Our Archives</a>
    </div>
  </div>
  ${BRAND_FOOTER}
</div>
`
    },
    {
        id: 'blog_active',
        name: 'Standard Spotlight',
        type: 'blog',
        description: 'Perfect for general updates. Features a large hero image and excerpt.',
        body: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden;">
  ${BRAND_HEADER}
  <div style="padding: 24px; text-align: center; background-color: #fffaf5;">
    <h3 style="color: #ea580c; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; margin: 0 0 8px 0;">New Story</h3>
    <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-family: serif;">[TITLE]</h1>
  </div>
  <img src="[IMAGE]" alt="Cover" style="width: 100%; height: auto; display: block;">
  <div style="padding: 32px 24px;">
    <p style="font-size: 16px; color: #4a4a4a; line-height: 1.6; margin-bottom: 24px;">
      [EXCERPT]
    </p>
    <div style="text-align: center;">
      <a href="[LINK]" style="display: inline-block; background-color: #ea580c; color: white; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2);">Continue Reading</a>
    </div>
  </div>
  ${BRAND_FOOTER}
</div>
`
    },
    {
        id: 'personality',
        name: 'Personality Spotlight',
        type: 'personality',
        description: 'Showcasing the legends and figures of Mithila.',
        body: `
<div style="font-family: serif; max-width: 600px; margin: 0 auto; background-color: #fcf8f1; border: 1px solid #f1f5f9; border-top: 8px solid #b91c1c;">
  ${BRAND_HEADER}
  <div style="padding: 40px 24px; text-align: center;">
    <div style="display: inline-block; margin-bottom: 24px; border: 4px solid #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden; width: 180px; height: 180px; border-radius: 100px;">
       <img src="[IMAGE]" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
    <h3 style="color: #b91c1c; font-style: italic; margin: 0 0 12px 0;">Legendary Figure</h3>
    <h1 style="color: #1a1a1a; margin: 0; font-size: 32px; letter-spacing: -0.5px;">[TITLE]</h1>
    <div style="width: 40px; hieght: 2px; background: #b91c1c; margin: 24px auto;"></div>
    <p style="font-size: 18px; color: #374151; line-height: 1.8; margin-bottom: 32px;">
      [EXCERPT]
    </p>
    <a href="[LINK]" style="display: inline-block; border: 2px solid #1a1a1a; color: #1a1a1a; padding: 12px 28px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Discover Their Legacy</a>
  </div>
  ${BRAND_FOOTER}
</div>
`
    },
    {
        id: 'history',
        name: 'History & Heritage',
        type: 'blog',
        description: 'Deep dives into the rich past of our region.',
        body: `
<div style="font-family: serif; max-width: 600px; margin: 0 auto; color: #2d1a12; background-color: #ffffff; border: 1px solid #f1f5f9;">
  ${BRAND_HEADER}
  <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; text-align: center;">
    <span style="font-size: 10px; font-weight: bold; color: #92400e; letter-spacing: 3px; text-transform: uppercase;">Archives of Mithila</span>
  </div>
  <div style="padding: 40px 30px;">
    <h1 style="font-size: 36px; line-height: 1.1; margin: 0 0 20px 0; color: #1a1a1a;">[TITLE]</h1>
    <p style="font-size: 14px; color: #6b7280; font-style: italic; margin-bottom: 30px;">Chronicles from the heart of Bihar & Nepal</p>
    <img src="[IMAGE]" style="width: 100%; border-radius: 4px; margin-bottom: 30px;">
    <div style="font-size: 17px; line-height: 1.8; color: #4b5563;">
      [EXCERPT]
    </div>
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
       <a href="[LINK]" style="color: #b91c1c; font-weight: bold; text-decoration: none;">View Full Archive &rarr;</a>
    </div>
  </div>
  ${BRAND_FOOTER}
</div>
`
    },
    {
        id: 'food',
        name: 'Mithila Flavors',
        type: 'recipe',
        description: 'Tastes and recipes from our kitchen.',
        body: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #fffef2; border: 1px solid #fde68a;">
  ${BRAND_HEADER}
  <div style="padding: 40px 24px; text-align: center; background: linear-gradient(to bottom, #fef3c7, #fffef2);">
    <span style="display: inline-block; background: #ea580c; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 16px;">Tastes of Heritage</span>
    <h1 style="color: #451a03; font-size: 32px; font-family: serif; margin: 0 0 16px 0;">[TITLE]</h1>
  </div>
  <img src="[IMAGE]" style="width: 100%; height: auto;">
  <div style="padding: 32px 24px;">
    <div style="background: white; border: 1px solid #fde68a; padding: 24px; border-radius: 12px;">
      <p style="font-size: 16px; color: #78350f; line-height: 1.7; margin: 0;">
        [EXCERPT]
      </p>
    </div>
    <div style="margin-top: 32px; text-align: center;">
      <a href="[LINK]" style="background: #ea580c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">Get the Recipe</a>
    </div>
  </div>
  ${BRAND_FOOTER}
</div>
`
    },
    {
        id: 'spiritual',
        name: 'Mantra & Wisdom',
        type: 'mantra',
        description: 'Spiritual insights and traditional mantras.',
        body: `
<div style="font-family: serif; max-width: 600px; margin: 0 auto; background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 16px; overflow: hidden; margin-top: 20px;">
  ${BRAND_HEADER}
  <div style="background-color: #581c87; color: white; padding: 24px; text-align: center;">
     <div style="font-size: 32px; margin-bottom: 8px;">ॐ</div>
     <h2 style="margin: 0; font-weight: normal; letter-spacing: 1px;">Sacred Wisdom</h2>
  </div>
  <div style="padding: 40px 30px; text-align: center;">
    <h1 style="color: #1a1a1a; font-size: 26px; margin-bottom: 24px;">[TITLE]</h1>
    <div style="background: white; border-radius: 12px; padding: 32px; border: 1px dashed #d8b4fe; margin-bottom: 32px;">
      <p style="font-size: 20px; line-height: 1.6; color: #4c1d95; margin: 0; font-style: italic;">
        [EXCERPT]
      </p>
    </div>
    <a href="[LINK]" style="color: #7c3aed; font-weight: bold; text-decoration: underline;">Learn the deeper meaning</a>
  </div>
  ${BRAND_FOOTER}
</div>
`
    },
    {
        id: 'culture',
        name: 'Culture & Folklore',
        type: 'blog',
        description: 'Stories and traditions passed down through generations.',
        body: `
<div style="font-family: serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #1f2937; border: 1px solid #f1f5f9;">
  ${BRAND_HEADER}
  <div style="border-bottom: 4px double #d1d5db; padding: 24px; text-align: center;">
    <h3 style="color: #b91c1c; text-transform: uppercase; letter-spacing: 4px; font-size: 14px; margin-bottom: 8px;">Mithila Folklore</h3>
    <h1 style="font-size: 32px; margin: 0;">[TITLE]</h1>
  </div>
  <div style="padding: 24px;">
    <img src="[IMAGE]" style="width: 100%; border-radius: 20px 0 20px 0; margin-bottom: 24px;">
    <div style="font-size: 18px; line-height: 1.8; color: #374151;">
      [EXCERPT]
    </div>
    <div style="text-align: right; margin-top: 32px;">
       <a href="[LINK]" style="display: inline-block; background: #111827; color: white; padding: 12px 24px; text-decoration: none; border-radius: 2px;">Read full tale</a>
    </div>
  </div>
  ${BRAND_FOOTER}
</div>
`
    },
    {
        id: 'places',
        name: 'Places of Mithila',
        type: 'place',
        description: 'Exploring the geography and landmarks.',
        body: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border: 1px solid #f1f5f9;">
  ${BRAND_HEADER}
  <div style="position: relative; height: 300px; overflow: hidden;">
    <img src="[IMAGE]" style="width: 100%; height: 100%; object-fit: cover;">
    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); padding: 40px 24px 24px;">
      <h1 style="color: white; margin: 0; font-size: 28px;">[TITLE]</h1>
    </div>
  </div>
  <div style="padding: 32px 24px;">
    <div style="display: flex; align-items: center; margin-bottom: 20px; color: #64748b; font-size: 14px;">
       <span style="font-weight: bold; color: #0f172a; margin-right: 8px;">Explore</span> • Geography & Landscapes
    </div>
    <p style="font-size: 16px; color: #334155; line-height: 1.6;">
      [EXCERPT]
    </p>
    <a href="[LINK]" style="display: block; width: 100%; text-align: center; background: #0f172a; color: white; padding: 16px; margin-top: 32px; text-decoration: none; font-weight: bold; border-radius: 8px;">View Journey Details</a>
  </div>
  ${BRAND_FOOTER}
</div>
`
    },
    {
        id: 'vrat_katha',
        name: 'Vrat Katha & Rituals',
        type: 'blog',
        description: 'Sacred stories for festivals and fasting.',
        body: `
<div style="font-family: serif; max-width: 600px; margin: 0 auto; background-color: #fffaf0; border: 2px solid #f97316;">
  ${BRAND_HEADER}
  <div style="text-align: center; padding: 40px 24px; background: #fff7ed; border-bottom: 1px solid #ffedd5;">
    <h3 style="color: #c2410c; margin: 0 0 12px 0; font-weight: normal; letter-spacing: 2px;">Sacred Traditions</h3>
    <h1 style="color: #431407; font-size: 30px; margin: 0;">[TITLE]</h1>
  </div>
  <div style="padding: 40px 30px;">
    <div style="border-left: 2px solid #fb923c; padding-left: 24px;">
       <p style="font-size: 18px; line-height: 1.8; color: #7c2d12;">
         [EXCERPT]
       </p>
    </div>
    <div style="margin-top: 40px; text-align: center;">
      <a href="[LINK]" style="color: #ea580c; font-weight: bold; text-decoration: none; border-bottom: 1px solid #ea580c; padding-bottom: 4px;">Read Full Katha &rarr;</a>
    </div>
  </div>
  ${BRAND_FOOTER}
</div>
`
    },
    {
        id: 'knowledge',
        name: 'Knowledge & Wisdom',
        type: 'blog',
        description: 'Informative pieces and academic insights.',
        body: `
<div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
  ${BRAND_HEADER}
  <div style="padding: 32px;">
    <div style="margin-bottom: 24px;">
       <span style="background: #eff6ff; color: #1e40af; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: bold;">Educational</span>
    </div>
    <h1 style="font-size: 26px; color: #0f172a; margin: 0 0 16px 0; font-weight: 800; line-height: 1.2;">[TITLE]</h1>
    <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
      [EXCERPT]
    </p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #1e40af;">
       <a href="[LINK]" style="color: #1e40af; font-weight: bold; text-decoration: none; font-size: 14px;">Expand Research &rarr;</a>
    </div>
  </div>
  ${BRAND_FOOTER}
</div>
`
    }
];

export default function EmailCampaignsView() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');

    // Form State
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isMarkdown, setIsMarkdown] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(EMAIL_TEMPLATES[0].id);
    const [mode, setMode] = useState<'test' | 'campaign'>('test');
    const [testEmail, setTestEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

    // History State
    const [logs, setLogs] = useState<any[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    const refreshLogs = async () => {
        setLoadingLogs(true);
        try {
            const data = await getEmailLogsAction();
            setLogs(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingLogs(false);
        }
    };

    const [availableContent, setAvailableContent] = useState<EmailImportContent[]>([]);
    const [selectedContentImport, setSelectedContentImport] = useState('');

    useEffect(() => {
        // Load content on mount
        getEmailContentImports().then(setAvailableContent);

        // Load real logs
        refreshLogs();
    }, []);

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = e.target.value;
        setSelectedTemplate(templateId);
        const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
        if (template) {
            setBody(template.body);
            // Default to HTML for defined complex templates
            setIsMarkdown(false);
        }
    };

    const handleSend = async () => {
        setSending(true);
        setMessage(null);

        try {
            const res = await sendEmailCampaign(
                subject,
                body,
                mode === 'test' ? testEmail : undefined
            );

            if (res.success) {
                setMessage({ type: 'success', text: res.message || 'Operation successful' });
                if (mode === 'campaign') {
                    refreshLogs();
                }
            } else {
                setMessage({ type: 'error', text: res.message || 'Failed to send' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setSending(false);
            setTimeout(() => setMessage(cur => cur?.type === 'success' ? null : cur), 5000);
        }
    };

    const previewHtml = isMarkdown
        ? body
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
            .replace(/\*(.*)\*/gim, '<i>$1</i>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-orange-600 hover:underline">$1</a>')
            .replace(/\n/gim, '<br />')
        : body;

    const handleContentImport = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedContentImport(value);

        if (!value) return;

        const [type, lang, slug] = value.split('|');
        const item = availableContent.find(i => i.type === type && i.slug === slug && i.lang === lang);

        if (item) {
            // Apply data to the currently SELECTed template base
            const currentTpl = EMAIL_TEMPLATES.find(t => t.id === selectedTemplate) || EMAIL_TEMPLATES[0];

            // Resolve Image to Base64 (Direct Insertion) before updating body
            const embeddedImage = await resolveLocalImageToBase64(item.image);

            // Generate link based on type
            let baseLink = "https://mithilawasi.com";
            if (item.type === 'blog') baseLink += `/${item.lang}/blog/${item.slug}`;
            else if (item.type === 'personality') baseLink += `/${item.lang}/personalities/${item.slug}`;
            else if (item.type === 'place') baseLink += `/${item.lang}/places/${item.slug}`;
            else if (item.type === 'recipe') baseLink += `/${item.lang}/recipes/${item.slug}`;
            else if (item.type === 'mantra') baseLink += `/${item.lang}/mantras/${item.slug}`;

            setSubject(`Mithilawasi: ${item.title}`);

            let filledBody = currentTpl.body;
            filledBody = filledBody.replace(/\[TITLE\]/g, item.title);
            filledBody = filledBody.replace(/\[IMAGE\]/g, embeddedImage);
            filledBody = filledBody.replace(/\[EXCERPT\]/g, item.excerpt);
            filledBody = filledBody.replace(/\[LINK\]/g, baseLink);
            filledBody = filledBody.replace(/\[CATEGORY\]/g, item.lang.toUpperCase());

            setBody(filledBody);
            setIsMarkdown(false); // Always HTML after template filling
        }
    };

    return (
        <div className="font-sans pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toast Message */}
            {message && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-white border-green-100 text-green-800' : 'bg-white border-red-100 text-red-800'
                    }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                        {message.type === 'success' ? <CheckCircle2 size={18} className="text-green-600" /> : <AlertCircle size={18} className="text-red-600" />}
                    </div>
                    <span className="font-bold text-sm text-gray-800">{message.text}</span>
                </div>
            )}

            {/* Navigation Tabs - Refined */}
            <div className="max-w-4xl mx-auto mb-10">
                <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-orange-100 shadow-sm flex gap-1">
                    <button
                        onClick={() => setActiveTab('compose')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'compose' ? 'bg-white text-orange-900 shadow-md ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}`}
                    >
                        <Sparkles size={16} className={activeTab === 'compose' ? 'text-orange-500' : ''} />
                        Create Campaign
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'history' ? 'bg-white text-orange-900 shadow-md ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}`}
                    >
                        <History size={16} className={activeTab === 'history' ? 'text-orange-500' : ''} />
                        Campaign History
                    </button>
                </div>
            </div>

            <div className={`grid grid-cols-1 gap-8 ${activeTab === 'compose' ? 'lg:grid-cols-[1fr_1.1fr] xl:grid-cols-[1fr_1.3fr]' : ''}`}>

                {/* Left Column: Editor or History */}
                <div className="space-y-6">
                    {activeTab === 'compose' ? (
                        <>
                            {/* Content Settings Section */}
                            <div className="bg-white rounded-[2.5rem] border border-orange-100 shadow-xl shadow-orange-900/5 p-8 space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-inner">
                                        <Settings size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 leading-none">Campaign Setup</h2>
                                        <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">Select style and source</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">1. Choose Template</label>
                                        <div className="relative group">
                                            <select
                                                value={selectedTemplate}
                                                onChange={handleTemplateChange}
                                                className="w-full pl-4 pr-10 py-3.5 bg-gray-50/50 border border-orange-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all font-medium text-gray-700 text-sm appearance-none cursor-pointer"
                                            >
                                                {EMAIL_TEMPLATES.map(t => (
                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange-400 group-hover:text-orange-600 transition-colors">
                                                <LayoutTemplate size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">2. Import Content</label>
                                        <div className="relative group">
                                            <select
                                                value={selectedContentImport}
                                                onChange={handleContentImport}
                                                className="w-full pl-4 pr-10 py-3.5 bg-gray-50/50 border border-orange-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all font-medium text-gray-700 text-sm appearance-none cursor-pointer"
                                            >
                                                <option value="">Recent stories...</option>
                                                {(() => {
                                                    const currentTpl = EMAIL_TEMPLATES.find(t => t.id === selectedTemplate);
                                                    const allowedTypes = currentTpl ? [currentTpl.type] : ['blog', 'personality', 'place', 'recipe', 'mantra'];

                                                    return allowedTypes.map(type => {
                                                        const items = availableContent.filter(i => i.type === type);
                                                        if (items.length === 0) return null;
                                                        return (
                                                            <optgroup key={type} label={type.charAt(0).toUpperCase() + type.slice(1) + 's'}>
                                                                {items.map(item => (
                                                                    <option key={`${item.type}-${item.lang}-${item.slug}`} value={`${item.type}|${item.lang}|${item.slug}`}>
                                                                        {`${item.lang.toUpperCase()} - ${item.title}`}
                                                                    </option>
                                                                ))}
                                                            </optgroup>
                                                        );
                                                    });
                                                })()}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange-400 group-hover:text-orange-600 transition-colors">
                                                <FileText size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Composer Section */}
                            <div className="bg-white rounded-[2.5rem] border border-orange-100 shadow-xl shadow-orange-900/5 p-8 flex flex-col gap-8 min-h-[500px]">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                        placeholder="Enter a compelling subject..."
                                        className="w-full px-6 py-4 bg-gray-50/50 border border-orange-100 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all font-serif text-xl placeholder:text-gray-300"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Message Content</label>
                                        <button
                                            onClick={() => setIsMarkdown(!isMarkdown)}
                                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${isMarkdown ? 'bg-orange-600 text-white shadow-md shadow-orange-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            Markdown {isMarkdown ? 'On' : 'Off'}
                                        </button>
                                    </div>
                                    <div className="relative group flex-1">
                                        <textarea
                                            value={body}
                                            onChange={e => setBody(e.target.value)}
                                            className="w-full h-full min-h-[350px] p-6 bg-gray-50/50 border border-orange-100 rounded-[2rem] outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all font-mono text-sm resize-none leading-relaxed text-gray-700"
                                            placeholder={isMarkdown ? "# Start writing your story...\n\nUse **bold** for emphasis." : "Enter HTML content here..."}
                                        />
                                        <div className="absolute bottom-4 right-6 text-[10px] font-bold text-gray-300 pointer-events-none">
                                            {body.length} characters
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* History Section - Full Width */
                        <div className="bg-white rounded-[2.5rem] border border-orange-100 shadow-xl shadow-orange-900/5 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                            <div className="p-8 border-b border-orange-50 flex items-center justify-between bg-gradient-to-r from-white to-orange-50/30">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Broadcast History</h2>
                                    <p className="text-xs text-gray-500 font-medium">Tracking your reach across Mithila</p>
                                </div>
                                <div className="p-3 bg-white rounded-2xl border border-orange-100 shadow-sm text-orange-600 font-bold text-xs flex items-center gap-2">
                                    <History size={16} /> {logs.length} Campaigns
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50 border-b border-orange-50">
                                        <tr>
                                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Timestamp</th>
                                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Subject Line</th>
                                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">Reach</th>
                                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-orange-50/50">
                                        {loadingLogs ? (
                                            <tr>
                                                <td colSpan={4} className="p-24 text-center">
                                                    <Loader2 className="animate-spin text-orange-400 mx-auto mb-4" size={32} />
                                                    <p className="text-sm text-gray-400 font-medium">Retrieving archives...</p>
                                                </td>
                                            </tr>
                                        ) : logs.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="p-24 text-center">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                                        <History size={32} />
                                                    </div>
                                                    <p className="text-sm text-gray-400 font-medium whitespace-nowrap">No broadcast history found.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            logs.map(log => (
                                                <tr key={log.id} className="hover:bg-orange-50/20 transition-colors group">
                                                    <td className="px-8 py-6 text-sm font-medium text-gray-500 whitespace-nowrap">
                                                        <div className="font-bold text-gray-700">{new Date(log.sentAt).toLocaleDateString()}</div>
                                                        <div className="text-[10px] text-gray-400">{new Date(log.sentAt).toLocaleTimeString()}</div>
                                                    </td>
                                                    <td className="px-8 py-6 text-sm font-bold text-gray-900 whitespace-nowrap">
                                                        <div className="truncate max-w-md group-hover:text-orange-700 transition-colors">{log.subject}</div>
                                                    </td>
                                                    <td className="px-8 py-6 text-sm text-right text-gray-600 font-mono whitespace-nowrap">
                                                        <span className="font-bold">{log.recipientCount}</span>
                                                        <span className="text-[10px] ml-1 text-gray-400 uppercase">Users</span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right whitespace-nowrap">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ring-1 ${log.status === 'sent' ? 'bg-green-50 text-green-700 ring-green-100' : 'bg-red-50 text-red-700 ring-red-100'
                                                            }`}>
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Preview & Actions */}
                {activeTab === 'compose' && (
                    <div className="flex flex-col gap-6 h-full relative">

                        {/* Static Header for Preview */}
                        <div className="flex justify-center items-center gap-6 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-orange-100 shadow-sm w-full">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Eye size={14} className="text-orange-400" /> Preview Window
                            </h3>
                            <div className="h-4 w-[1px] bg-orange-100" />
                            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                                <button
                                    onClick={() => setPreviewDevice('mobile')}
                                    className={`p-2 rounded-lg transition-all ${previewDevice === 'mobile' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:bg-white/50'}`}
                                    title="Mobile View"
                                >
                                    <Smartphone size={16} />
                                </button>
                                <button
                                    onClick={() => setPreviewDevice('tablet')}
                                    className={`p-2 rounded-lg transition-all ${previewDevice === 'tablet' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:bg-white/50'}`}
                                    title="Tablet View"
                                >
                                    <Tablet size={16} />
                                </button>
                                <button
                                    onClick={() => setPreviewDevice('desktop')}
                                    className={`p-2 rounded-lg transition-all ${previewDevice === 'desktop' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:bg-white/50'}`}
                                    title="Desktop View"
                                >
                                    <Monitor size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Device Frame */}
                        <div className={`
                            bg-white rounded-[3rem] border-[12px] border-gray-900 shadow-2xl overflow-hidden flex-1 relative min-h-[550px] mx-auto transition-all duration-500 ease-in-out
                            ${previewDevice === 'mobile' ? 'w-[320px]' : previewDevice === 'tablet' ? 'w-[500px]' : 'w-full'}
                        `}>
                            <div className="absolute top-0 w-full h-10 bg-gray-100/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-center z-10">
                                <div className="w-16 h-1.5 bg-gray-300 rounded-full" />
                            </div>
                            <div className="h-full pt-10 overflow-y-auto bg-white custom-scrollbar">
                                <div className="p-6 border-b border-orange-50 bg-gradient-to-b from-orange-50/30 to-white">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Subject</div>
                                    <div className="font-bold text-gray-900 text-lg leading-tight font-serif italic text-orange-950">
                                        {subject || '(Untitled Campaign)'}
                                    </div>
                                </div>
                                <div className="p-6 prose prose-sm max-w-none text-gray-800"
                                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                                />
                                <div className="h-20 flex items-center justify-center border-t border-gray-50 opacity-20">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">End of Preview</span>
                                </div>
                            </div>
                        </div>

                        {/* Compact Actions Panel */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-orange-100 shadow-xl shadow-orange-900/5">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                    <Send size={16} className="text-orange-600" /> Dispatch
                                </h3>
                                {/* Mode Toggle - Refined */}
                                <div className="bg-gray-100 p-1 rounded-xl flex shadow-inner">
                                    <button
                                        onClick={() => setMode('test')}
                                        className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all duration-300 ${mode === 'test' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                                    >
                                        Validation
                                    </button>
                                    <button
                                        onClick={() => setMode('campaign')}
                                        className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all duration-300 ${mode === 'campaign' ? 'bg-red-800 text-white shadow-md' : 'text-gray-400'}`}
                                    >
                                        Live Broadcast
                                    </button>
                                </div>
                            </div>

                            {mode === 'test' ? (
                                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Internal Test Address</label>
                                        <input
                                            type="email"
                                            value={testEmail}
                                            onChange={e => setTestEmail(e.target.value)}
                                            placeholder="admin@mithilawasi.com"
                                            className="w-full px-5 py-3.5 bg-gray-50/50 border border-orange-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all font-medium"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSend}
                                        disabled={sending || !testEmail}
                                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all hover:shadow-lg active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-2"
                                    >
                                        {sending ? <Loader2 className="animate-spin" size={18} /> : 'Dispatch Test Draft'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100 flex items-start gap-4 ring-4 ring-red-50/20">
                                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                                            <AlertCircle size={20} className="text-red-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-red-900 uppercase tracking-widest mb-1">Confirmation Required</h4>
                                            <p className="text-[11px] text-red-700 leading-relaxed font-medium">
                                                You are initiating a global broadcast to all subscribers. This action registers in the public ledger and cannot be reversed.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSend}
                                        disabled={sending || !subject || !body}
                                        className="w-full py-5 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-2xl font-bold text-sm transition-all shadow-xl shadow-red-900/20 hover:shadow-red-900/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-30 flex items-center justify-center gap-2"
                                    >
                                        {sending ? <Loader2 className="animate-spin" size={18} /> : 'Authorize Broadcast'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
