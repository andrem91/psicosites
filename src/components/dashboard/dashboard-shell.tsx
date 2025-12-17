"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { SkipLink } from "@/components/ui/skip-link";

interface DashboardShellProps {
    children: React.ReactNode;
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
}

export function DashboardShell({ children, user }: DashboardShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Skip link para acessibilidade */}
            <SkipLink />

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <Header user={user} onMenuClick={() => setSidebarOpen(true)} />

                {/* Page content */}
                <main id="main-content" className="flex-1 p-4 lg:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

