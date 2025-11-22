"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, LayoutDashboard, User, Settings } from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    if (!user) return null;

    const links = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        // Add more links here as needed
    ];

    return (
        <aside className="sticky top-0 z-40 h-screen w-64 bg-[var(--bg-card)] border-r border-[var(--border-dark)] flex-shrink-0">
            <div className="flex h-full flex-col px-3 py-4">
                <div className="mb-5 flex items-center pl-2.5">
                    <span className="self-center whitespace-nowrap text-xl font-semibold text-[var(--text-light)]">
                        WFRP Manager
                    </span>
                </div>
                <ul className="space-y-2 font-medium">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`flex items-center rounded-lg p-2 group ${isActive
                                        ? "bg-[var(--accent-green)] text-white"
                                        : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-light)]"
                                        }`}
                                >
                                    <Icon className="h-5 w-5 flex-shrink-0 transition duration-75" />
                                    <span className="ml-3">{link.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <div className="mt-auto">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <button
                                onClick={() => logout()}
                                className="flex w-full items-center rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-light)] group"
                            >
                                <LogOut className="h-5 w-5 flex-shrink-0 transition duration-75" />
                                <span className="ml-3">Sign Out</span>
                            </button>
                        </li>
                    </ul>
                    <div className="mt-4 border-t border-[var(--border-dark)] pt-4">
                        <div className="flex items-center px-2">
                            <div className="flex-shrink-0">
                                <User className="h-8 w-8 rounded-full bg-[var(--bg-hover)] p-1 text-[var(--text-muted)]" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-[var(--text-light)]">
                                    {user.email?.split("@")[0]}
                                </p>
                                <p className="text-xs text-[var(--text-muted)] truncate max-w-[140px]">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
