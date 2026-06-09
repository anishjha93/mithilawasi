
import { HeritageHeading } from '@/components/ui/heritage/HeritageHeading';
import { getCollectionData } from '@/lib/data-service';

type Submission = {
    id: string;
    name: string;
    email: string;
    title: string;
    category: string;
    content: string;
    status: string;
    submittedAt: string;
    location: string;
};

async function getSubmissions(): Promise<Submission[]> {
    return getCollectionData<Submission>('submissions', 'id');
}

export default async function AdminSubmissionsPage() {
    const submissions = await getSubmissions();

    return (
        <div className="space-y-8 p-6">
            <div className="mb-8">
                <HeritageHeading as="h1">Community Submissions</HeritageHeading>
                <p className="text-gray-600">Review and Approve Stories</p>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {submissions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                                    No submissions yet.
                                </td>
                            </tr>
                        ) : (
                            submissions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(sub.submittedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {sub.name}
                                        <div className="text-xs text-gray-400">{sub.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {sub.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 max-w-xs truncate">
                                        {sub.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {sub.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button disabled className="text-indigo-600 hover:text-indigo-900 opacity-50 cursor-not-allowed">Review</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
