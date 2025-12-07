import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
    active?: boolean;
}

export function SidebarItem({ icon: Icon, label, href, active }: SidebarItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                active
                    ? "bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
        >
            <Icon className="mr-3 h-5 w-5" />
            {label}
        </Link>
    );
}

interface SidebarProps {
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export function Sidebar({ title, children, footer }: SidebarProps) {
    return (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col h-full">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{title}</h1>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {children}
            </nav>
            {footer && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    {footer}
                </div>
            )}
        </aside>
    );
}
