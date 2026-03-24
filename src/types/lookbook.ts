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
