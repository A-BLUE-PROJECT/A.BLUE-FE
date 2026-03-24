export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans antialiased">
      {/* Global Navigation for Admin */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="flex h-16 items-center px-6 gap-8">
          <div className="font-bold text-xl tracking-tight">ALLBLUE Admin</div>
          <nav className="flex items-center gap-6 text-sm font-medium text-zinc-500">
            <a href="/admin" className="hover:text-zinc-900 transition-colors">Dashboard</a>
            <a href="/admin/inspect" className="text-zinc-900">Curation Inspector</a>
            <a href="/admin/products" className="hover:text-zinc-900 transition-colors">Products</a>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
