"use client";

// Reusing the dashboard logic logic (In a real app, strict refactor to components/Sidebar)
// For this foundation, we duplicate the shell to ensure Admin has navigation
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Package, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Admin Check could go here
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            // if (!session) router.push('/login');
            // Verify role == admin?
            setLoading(false);
        };
        checkUser();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col text-white">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-white">Adyam Admin</h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-lg">
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        Emp. View
                    </Link>
                    <Link href="/admin/table" className="flex items-center px-4 py-2 text-white bg-gray-800 rounded-lg">
                        <Package className="mr-3 h-5 w-5" />
                        Shipments
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg">
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
