import { GeneratorSidebar } from '@/components/admin/GeneratorSidebar';
import { GeneratorCanvas } from '@/components/admin/GeneratorCanvas';

export const metadata = {
  title: 'AI Generator - ALLBLUE Admin',
};

export default function GeneratorPage() {
  return (
    <div className="flex w-full h-full flex-row">
      <GeneratorSidebar />
      <GeneratorCanvas />
    </div>
  );
}
