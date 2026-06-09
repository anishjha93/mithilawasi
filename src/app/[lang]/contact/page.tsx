
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

export default async function ContactPage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang);
    const { contactPage } = dictionary;
    return (
        <div className="container pt-32 px-8 pb-16">
            <h1 className="text-3xl font-bold font-heading text-mithila-ink">{contactPage.title}</h1>
            <p className="text-lg mt-4 text-text-muted font-medium">
                {contactPage.subtitle}
            </p>

            <section className="mt-12">
                <div className="bg-card-bg p-8 rounded-xl border border-border-color shadow-sm">
                    <h3 className="text-xl font-bold font-heading text-mithila-ink">{contactPage.cardTitle}</h3>
                    <p className="mt-4">
                        <strong className="block text-foreground mb-1">{contactPage.emailLabel}:</strong>
                        <a href="mailto:contact@mithilawasi.com" className="text-primary-red hover:underline transition-all">contact@mithilawasi.com</a>
                    </p>
                    <p className="mt-6">
                        <strong className="block text-foreground mb-1">{contactPage.socialLabel}:</strong>
                        {contactPage.facebookText.split('Facebook').map((part: string, i: number) => (
                            <span key={i}>
                                {part}
                                {i === 0 && <a href="https://www.facebook.com/mithilawasi" target="_blank" rel="noopener noreferrer" className="text-primary-red hover:underline transition-all">Facebook</a>}
                            </span>
                        ))}
                    </p>
                </div>
            </section>
        </div>
    );
}
