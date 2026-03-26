import { ProductFilters } from '@/components/admin/ProductFilters';
import { ProductTable } from '@/components/admin/ProductTable';

export const metadata = {
  title: 'Products Management - ALLBLUE Admin',
};

export default function ProductsPage() {
  return (
    <div className="flex flex-col w-full h-full bg-[#F5F5F5]">
      {/* Header specific to this section */}
      <div className="px-8 py-6 bg-white shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Cafe24 Products</h1>
        <p className="text-sm text-zinc-500 mt-1">외부 쇼핑몰 API에서 연동된 상품 데이터 목록 및 상태 관리</p>
      </div>

      <ProductFilters />
      <ProductTable />
    </div>
  );
}
