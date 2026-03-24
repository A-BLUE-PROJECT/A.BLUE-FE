import LookbookGrid from "@/components/gallery/LookbookGrid";

export default function GalleryPage() {
  return (
    <main className="relative min-h-screen pt-32 pb-24 px-4 md:px-8 w-full">
      <header className="relative z-10 mb-16 max-w-[1600px] mx-auto text-zinc-900 dark:text-white">
        <h2 className="text-sm md:text-base font-bold tracking-widest uppercase mb-4 text-zinc-500">
          Vol. 1
        </h2>
        <p className="text-3xl md:text-5xl font-medium tracking-tight max-w-2xl leading-tight">
          AI-orchestrated <br className="hidden md:block" />
          <span className="italic font-serif">synergy</span> lookbooks
        </p>
      </header>
      
      <div className="relative z-20 max-w-[1600px] mx-auto">
        <LookbookGrid />
      </div>
    </main>
  );
}
