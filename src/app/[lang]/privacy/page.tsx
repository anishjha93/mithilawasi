
export const dynamic = 'force-static';

export default function PrivacyPage() {
    return (
        <div className="container pt-32 px-8 pb-16">
            <h1 className="text-3xl font-bold font-heading">Privacy Policy</h1>
            <p className="text-lg mt-4 text-gray-500 font-medium">Last Updated: {new Date().getFullYear()}</p>

            <section className="mt-12">
                <h2 className="text-2xl font-bold font-heading mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">We do not collect any personal information. This website is for informational and educational purposes only.</p>
            </section>

            <section className="mt-8">
                <h2 className="text-2xl font-bold font-heading mb-4">2. Cookies</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">We may use local storage or cookies to remember your theme preference (Dark/Light mode) and language selection.</p>
            </section>

            <section className="mt-8">
                <h2 className="text-2xl font-bold font-heading mb-4">3. Contact</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">If you have any questions, please reach out to us via the contact information in the footer.</p>
            </section>
        </div>
    );
}
