export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string; // HTML content
    description: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
    {
        id: 'welcome',
        name: 'Welcome Email',
        subject: 'Welcome to the Mithilawasi Family! 🌿',
        description: 'Sent automatically to new subscribers.',
        body: `
# Mithilawasi
*Preserving the Soul of Mithila*

Namaskar,

Thank you for joining our community! We are thrilled to have you with us on this journey to preserve and celebrate the rich heritage of Mithila.

You can expect:
- Stories about lost history and traditions
- Updates on Maithili festivals and rituals
- Spotlights on Mithila Art an artists

If you have any topics you'd like us to cover, feel free to reply to this email.

---
© ${new Date().getFullYear()} Mithilawasi. All rights reserved.
        `
    },
    {
        id: 'newsletter_simple',
        name: 'Simple Newsletter',
        subject: 'Mithila Bulletin: New Story Update',
        description: 'Generic template for weekly updates.',
        body: `
## Mithila Bulletin
---

Dear Reader,

We have a new story for you to explore.

### [Article Title]
[Short excerpt or description implementation goes here...]

[Read Full Story](https://mithilawasi.com/blog)

---
Mithilawasi • Preserving Heritage
        `
    },
    {
        id: 'blog_active',
        name: 'Blog Spotlight (With Image)',
        subject: 'New on Mithilawasi: [Blog Title]',
        description: 'Visual template for promoting new articles.',
        body: `
# [Blog Title]

![Cover Image](https://cdn.mithilawasi.com/placeholder.jpg)

**[Engaging Subtitle or Hook goes here]**

Namaskar,

We have just published a new story that explores the heart of Mithila's heritage.

> "[Insert a compelling quote or short excerpt from the article here...]"

**Why read this?**
- 🌿 Discover hidden history
- 🕊️ Connect with ancient traditions
- 📜 Understand the deeper meaning

[Read Full Story](https://mithilawasi.com/blog/slug-here)

---
Mithilawasi
        `
    }
];
