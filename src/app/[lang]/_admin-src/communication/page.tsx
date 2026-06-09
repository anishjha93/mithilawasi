import { checkAuth } from "@/app/[lang]/_admin-src/actions";
import { getSubscribersForAdmin } from "@/app/actions/subscribe";
import { redirect } from "next/navigation";
import CommunicationHub from "./CommunicationHub";

export default async function AdminCommunicationPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const isAuth = await checkAuth();
    if (!isAuth) {
        redirect(`/${lang}/admin`);
    }

    const subscribers = await getSubscribersForAdmin();

    return <CommunicationHub initialSubscribers={subscribers} lang={lang} />;
}
