"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Package, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { Sidebar, SidebarItem } from '@/components/layout/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // router.push('/login'); 
                // Commented out to allow viewing wrapper for demo purposes if not logged in
                // In prod, uncomment.
            }
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
            {/* Sidebar */}
            <Sidebar
                title="Adyam"
                footer={
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium">
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </button>
                }
            >
                <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
                <SidebarItem icon={Package} label="Shipments" href="/admin/table" />
                <SidebarItem icon={Users} label="Employees" href="/dashboard" />
            </Sidebar>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
