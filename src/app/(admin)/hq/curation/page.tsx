import { CurationSidebar } from '@/components/admin/CurationSidebar';
import { CurationCanvas } from '@/components/admin/CurationCanvas';

export const metadata = {
  title: 'Admin Curation Dashboard - ALLBLUE',
};

export default function CurationPage() {
  return (
    <div className="flex w-full h-full flex-row">
      <CurationSidebar />
      <CurationCanvas />
    </div>
  );
}
