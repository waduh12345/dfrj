export interface GaleriItem {
  id: number;
  title: string;
  description: string;
  published_at: string;
  image: File | string | null;
}