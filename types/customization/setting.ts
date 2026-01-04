export interface Pengaturan {
  id: number | string;
  client_id: number | string;

  // General & SEO
  judul: string;
  deskripsi: string;
  kata_kunci?: string; // Optional based on common usage

  // Appearance / Theme
  tema?: string;
  warna_utama?: string;
  warna_kedua?: string;
  warna_ketiga?: string;
  font_style?: string;

  // Assets (URLs from API)
  logo: string | null;
  logo_footer: string | null;
  icon: string | null;

  // Contact & Social Media
  nomer_whatsapp?: string;
  email?: string;
  no_telepon?: string;
  alamat?: string;
  instagram?: string;
  tiktok?: string;

  status: number | string; // Often returned as 1 or "1"
}

export interface PengaturanListParams {
  client_code: string;
}

export interface PengaturanListResponse {
  success: boolean;
  message: string;
  data: {
    items: Pengaturan[];
    total: number;
    pageTotal: number;
    currentPage: number;
  };
}

export interface PengaturanDetailResponse {
  success: boolean;
  message: string;
  data: Pengaturan;
}