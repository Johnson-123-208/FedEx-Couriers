export const metadata = {
    title: 'Adyam Logistics | Admin',
    description: 'Admin Portal',
};

export default function AdminTablePage() {
    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shipment Records</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Sync Data
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-4">
                    <input
                        type="text"
                        placeholder="Search AWB..."
                        className="border rounded px-3 py-2 w-64 dark:bg-gray-900 dark:border-gray-600"
                    />
                    <select className="border rounded px-3 py-2 dark:bg-gray-900 dark:border-gray-600">
                        <option>All Statuses</option>
                        <option>In Transit</option>
                        <option>Delivered</option>
                    </select>
                </div>

                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AWB No</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Placeholder Rows */}
                        {[1, 2, 3].map((i) => (
                            <tr key={i}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">78623400{i}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">FedEx</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        In Transit
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mumbai Hub</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900 cursor-pointer">Edit</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-4 text-center text-gray-500 text-sm">
                    Placeholder Table - Connect to Supabase use `adyam_tracking`
                </div>
            </div>
        </div>
    );
}
