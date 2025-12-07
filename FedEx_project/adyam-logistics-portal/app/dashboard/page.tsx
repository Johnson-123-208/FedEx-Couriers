export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overlay</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Shipments</h3>
                    <p className="text-3xl font-bold mt-2">1,240</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">In Transit</h3>
                    <p className="text-3xl font-bold mt-2 text-blue-600">85</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Pending Actions</h3>
                    <p className="text-3xl font-bold mt-2 text-orange-500">12</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px] flex items-center justify-center border-dashed">
                <p className="text-gray-400">Activity Chart Placeholder</p>
            </div>
        </div>
    );
}
