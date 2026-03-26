'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-zinc-900 font-sans antialiased flex flex-col">
      {/* Global Navigation for Admin (Dark Solid) */}
      <header className="sticky top-0 z-50 w-full bg-zinc-950 text-white shadow-md">
        <div className="flex h-16 items-center px-6 gap-8">
          <Link href="/hq/curation" className="font-bold text-xl tracking-tight text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-lime-400">✦</span> ALLBLUE Admin
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {[
              { href: '/hq/curation', label: 'Curation' },
              { href: '/hq/generator', label: 'Generator' },
              { href: '/hq/products', label: 'Products' },
              { href: '/hq/settings', label: 'Settings' },
            ].map(link => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={clsx(
                    "transition-colors",
                    isActive ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
}
