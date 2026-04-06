// Legacy UI types (used by HeroSection / OrchestrationContainer)
export interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  initialPosition: { x: number; y: number; rotate: number };
}

export interface Lookbook {
  id: string;
  title: string;
  resultImage: string;
  items: Product[];
}

// BE API response types
export interface LookbookResponse {
  id: number;
  styleType: string;
  season: string;
  targetGender: string;
  tags: string | null;
  status: string;
  imageUrl: string;
  aiScore: number | null;
  createdAt: string;
}

export interface LookbookItemResponse {
  productId: number;
  position: string;
  brandName: string;
  productName: string;
  price: number;
  productImageUrl: string;
  originUrl: string;
}

export interface LookbookDetailResponse {
  id: number;
  styleType: string;
  season: string;
  targetGender: string;
  tags: string | null;
  status: string;
  originUrl: string;
  imageUrl: string;
  aiScore: number | null;
  items: LookbookItemResponse[];
}

export interface CursorPage<T> {
  items: T[];
  hasNext: boolean;
}
