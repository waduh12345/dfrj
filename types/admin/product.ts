export interface Product {
  id: number;
  shop_id: number | string | null;
  product_category_id: number | string;
  product_merk_id: number | string;
  category_name: string;
  merk_name: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  total_reviews: number;
  stock: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  diameter: number;
  status: boolean | number;
  image: File | string;
  image_2: File | string;
  image_3: File | string;
  image_4: File | string;
  image_5: File | string;
  image_6: File | string;
  image_7: File | string;
}