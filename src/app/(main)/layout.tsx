import Header from "@/components/layout/Header";
import LoginModal from "@/components/auth/LoginModal";
import MenuOverlay from "@/components/layout/MenuOverlay";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Header />
      <MenuOverlay />
      <LoginModal />
      {children}
    </div>
  );
}
