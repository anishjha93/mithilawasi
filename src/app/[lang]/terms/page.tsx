
export default function TermsPage() {
    return (
        <div className="container pt-32 px-8 pb-16">
            <h1 className="text-3xl font-bold font-heading">Terms of Use</h1>
            <p className="text-lg mt-4 text-gray-500 dark:text-gray-400 font-medium">Last Updated: {new Date().getFullYear()}</p>

            <section className="mt-12">
                <h2 className="text-2xl font-bold font-heading mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">By accessing Mithilawasi, you agree to these terms. This website is a cultural archive provided "as is".</p>
            </section>

            <section className="mt-8">
                <h2 className="text-2xl font-bold font-heading mb-4">2. Intellectual Property</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Content on this site (text, images, folklore) is for educational use. Please credit "Mithilawasi" when sharing.</p>
            </section>

            <section className="mt-8">
                <h2 className="text-2xl font-bold font-heading mb-4">3. Disclaimer</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">While we strive for historical accuracy, some content is based on oral traditions and folklore. We do not claim academic infallibility.</p>
            </section>
        </div>
    );
}
