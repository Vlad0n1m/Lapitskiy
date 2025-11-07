import Link from 'next/link'
import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b px-4 py-3 flex items-center justify-between">
                <div className="font-bold">Admin</div>
                <nav className="flex gap-4 text-sm">
                    <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
                    <Link href="/admin/orders" className="hover:underline">Заказы</Link>
                    <Link href="/admin/menu" className="hover:underline">Меню</Link>
                </nav>
            </header>
            <main className="flex-1 px-4 py-4">{children}</main>
        </div>
    )
}




