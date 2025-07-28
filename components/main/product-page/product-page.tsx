"use client";

import { useEffect, useState } from "react";
import { Heart, ShoppingCart, ReceiptText } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Product } from "@/types/product";
import useModal from "@/hooks/use-modal";
import ProductDetailModal from "./detail-product";
import useCart from "@/hooks/use-cart";

const ITEMS_PER_PAGE = 9;

export default function ProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    kategori: "all",
    kecamatan: "all",
    sort: "all",
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const { addItem, open: openCart } = useCart(); // ambil fungsi dari zustand

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchKategori =
      filter.kategori === "all" || product.kategori === filter.kategori;
    const matchKecamatan =
      filter.kecamatan === "all" || product.kecamatan === filter.kecamatan;
    const matchSort =
      filter.sort === "all"
        ? true
        : filter.sort === "terlaris"
        ? product.terlaris
        : product.terbaru;
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchKategori && matchKecamatan && matchSort && matchSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const handleAddToCart = (product: Product) => {
    addItem(product); // simpan ke store
    openCart(); // buka cart sidebar
  };

  return (
    <section className="min-h-screen py-10 px-6 md:px-12 bg-neutral-50">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-green-600 mb-4">
        Produk Koperasi
      </h2>
      <p className="text-center text-neutral-600 text-base md:text-lg mb-10 max-w-2xl mx-auto">
        Temukan berbagai produk unggulan dari koperasi desa kami, mulai dari
        sembako, pakaian, hingga kebutuhan sehari-hari. Dukung perekonomian
        lokal dengan belanja produk berkualitas dan harga terjangkau.
      </p>

      {/* Filter + Search */}
      <div className="w-full flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-4 w-full lg:w-1/2">
          <Select onValueChange={(val) => setFilter({ ...filter, sort: val })}>
            <SelectTrigger>
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="terlaris">Terlaris</SelectItem>
              <SelectItem value="terbaru">Terbaru</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(val) => setFilter({ ...filter, kategori: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kategori Produk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="Sembako">Sembako</SelectItem>
              <SelectItem value="Pakaian">Pakaian</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(val) => setFilter({ ...filter, kecamatan: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kecamatan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="Cibinong">Cibinong</SelectItem>
              <SelectItem value="Sukamakmur">Sukamakmur</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full lg:w-1/2">
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-neutral-300 rounded-md px-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl hover:-translate-y-2 transition relative"
          >
            <div className="relative">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={300}
                className="w-full h-52 object-cover"
              />
              <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-green-600 hover:text-white transition cursor-pointer">
                <Heart className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-[#1D1D1D]">
                {product.name}
              </h3>
              <p className="text-green-600 font-bold text-sm">
                Rp {product.price.toLocaleString()}
              </p>
              <div className="flex justify-between items-center pt-2">
                <p className="text-xs text-neutral-500">{product.kecamatan}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      setSelectedProduct(product);
                      openModal();
                    }}
                    className="text-sm bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                  >
                    <ReceiptText className="w-4 h-4" />
                    Details
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleAddToCart(product)}
                    className="text-sm bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Keranjang
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-4">
          <Button
            disabled={currentPage === 1}
            onClick={handlePrevPage}
            className="bg-white border text-green-600 hover:bg-green-600 hover:text-white"
          >
            Prev
          </Button>
          <span className="px-4 py-2 text-sm text-neutral-700">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
            className="bg-white border text-green-600 hover:bg-green-600 hover:text-white"
          >
            Next
          </Button>
        </div>
      )}

      {selectedProduct && (
        <ProductDetailModal
          isOpen={isOpen}
          onClose={closeModal}
          product={selectedProduct}
        />
      )}
    </section>
  );
}