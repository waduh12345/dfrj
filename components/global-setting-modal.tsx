"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { X, Upload, Loader2, Save } from "lucide-react";
import Swal from "sweetalert2";
import { useLanguage } from "@/contexts/LanguageContext";

// Services
import {
  useGetPengaturanListQuery,
  useUpdatePengaturanMutation,
  useCreatePengaturanMutation,
} from "@/services/customize/setting.service";

// Error Handler
import {
  extractApiErrorMessage,
  hasErrorString,
  isFetchBaseQueryError,
} from "@/lib/error-format";

const BASE_IMAGE_URL = "https://api-content-web.naditechno.id/media/";

interface GlobalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientCode: string;
}

export function GlobalSettingsModal({
  isOpen,
  onClose,
  clientCode,
}: GlobalSettingsModalProps) {
  // Fetch Data
  const { data: settingsData } = useGetPengaturanListQuery(
    { client_code: clientCode },
    { skip: !clientCode }
  );

  const [updateSettings, { isLoading: isUpdating }] =
    useUpdatePengaturanMutation();
  const [createSettings, { isLoading: isCreating }] =
    useCreatePengaturanMutation();

  const currentSettings = settingsData?.data?.items?.[0] || null;

  // Previews
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [footerLogoPreview, setFooterLogoPreview] = useState<string | null>(
    null
  );

  // Helper Safe Image for Preview
  const getPreviewUrl = (img: string | null) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `${BASE_IMAGE_URL}${img}`;
  };

  useEffect(() => {
    if (currentSettings) {
      setLogoPreview(getPreviewUrl(currentSettings.logo));
      setFooterLogoPreview(getPreviewUrl(currentSettings.logo_footer));
    }
  }, [currentSettings]);

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setPreview: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // --- 1. APPEND REQUIRED FIELDS (HIDDEN) ---
    formData.append("client_id", "8");
    formData.append("status", "1");

    // --- 2. HARDCODE THEME FIELDS (FIX ERROR) ---
    // Backend membutuhkan field ini, kita isi default saja
    formData.append("tema", "light");
    formData.append("warna_utama", "#2f4e9b");
    formData.append("warna_kedua", "#ffffff");
    formData.append("warna_ketiga", "#000000");
    formData.append("font_style", "sans-serif");

    // --- 3. FILE VALIDATION LOGIC ---
    // Cek apakah data yang didapat adalah File instance dan ukurannya > 0
    const logoFile = formData.get("logo");
    if (!(logoFile instanceof File) || logoFile.size === 0) {
      formData.delete("logo");
    }

    const footerFile = formData.get("logo_footer");
    if (!(footerFile instanceof File) || footerFile.size === 0) {
      formData.delete("logo_footer");
    }

    const iconFile = formData.get("icon");
    if (!(iconFile instanceof File) || iconFile.size === 0) {
      formData.delete("icon");
    }

    try {
      if (currentSettings?.id) {
        await updateSettings({
          id: currentSettings.id,
          data: formData,
        }).unwrap();
        Swal.fire("Success", "Global settings updated!", "success");
      } else {
        await createSettings(formData).unwrap();
        Swal.fire("Success", "Global settings created!", "success");
      }
      onClose();
    } catch (error) {
      // --- TYPE SAFE ERROR HANDLING ---
      console.error(error);
      let errorMsg = "Failed to save settings";

      if (isFetchBaseQueryError(error)) {
        const extracted = extractApiErrorMessage(error.data);
        if (extracted) errorMsg = extracted;
      } else if (hasErrorString(error)) {
        errorMsg = error.error;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }

      Swal.fire("Error", errorMsg, "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          Edit Global Settings (Header & Footer)
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* --- BRANDING --- */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-sm font-bold uppercase text-[#2f4e9b] tracking-wider">
              Branding
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Header Logo */}
              <div className="border border-dashed border-gray-300 p-4 rounded-lg text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Header Logo
                </label>
                <div className="relative h-20 w-full mb-2 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Header Logo"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No Image</span>
                  )}
                </div>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setLogoPreview)}
                  className="text-xs"
                />
              </div>

              {/* Footer Logo */}
              <div className="border border-dashed border-gray-300 p-4 rounded-lg text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Footer Logo
                </label>
                <div className="relative h-20 w-full mb-2 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                  {footerLogoPreview ? (
                    <Image
                      src={footerLogoPreview}
                      alt="Footer Logo"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No Image</span>
                  )}
                </div>
                <input
                  type="file"
                  name="logo_footer"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setFooterLogoPreview)}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          {/* --- GENERAL INFO --- */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-[#2f4e9b] tracking-wider">
              General Info
            </h3>
            <div>
              <label className="block text-sm text-gray-600">Site Title</label>
              <input
                name="judul"
                defaultValue={currentSettings?.judul || ""}
                className="w-full border p-2 rounded text-sm"
                placeholder="Radja Mart"
                required
              />
            </div>

            {/* Added: Tagline / Kata Kunci Input */}
            <div>
              <label className="block text-sm text-gray-600">
                Tagline / Keywords
              </label>
              <input
                name="kata_kunci"
                defaultValue={currentSettings?.kata_kunci || ""}
                className="w-full border p-2 rounded text-sm"
                placeholder="Ex: Trusted Online Store"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">
                Description (SEO)
              </label>
              <textarea
                name="deskripsi"
                defaultValue={currentSettings?.deskripsi || ""}
                className="w-full border p-2 rounded text-sm"
                rows={3}
                required
              />
            </div>
          </div>

          {/* --- CONTACT --- */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-[#2f4e9b] tracking-wider">
              Contact Details
            </h3>
            <div>
              <label className="block text-sm text-gray-600">Email</label>
              <input
                name="email"
                defaultValue={currentSettings?.email || ""}
                className="w-full border p-2 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Phone</label>
              <input
                name="no_telepon"
                defaultValue={currentSettings?.no_telepon || ""}
                className="w-full border p-2 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Address</label>
              <textarea
                name="alamat"
                defaultValue={currentSettings?.alamat || ""}
                className="w-full border p-2 rounded text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">
                WhatsApp Number
              </label>
              <input
                name="nomer_whatsapp"
                defaultValue={currentSettings?.nomer_whatsapp || ""}
                className="w-full border p-2 rounded text-sm"
                placeholder="628..."
              />
            </div>
          </div>

          {/* --- SOCIAL MEDIA --- */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-sm font-bold uppercase text-[#2f4e9b] tracking-wider">
              Social Media
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">
                  Instagram URL
                </label>
                <input
                  name="instagram"
                  defaultValue={currentSettings?.instagram || ""}
                  className="w-full border p-2 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">
                  TikTok URL
                </label>
                <input
                  name="tiktok"
                  defaultValue={currentSettings?.tiktok || ""}
                  className="w-full border p-2 rounded text-sm"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end pt-4 border-t mt-4">
            <button
              type="submit"
              disabled={isUpdating || isCreating}
              className="bg-[#2f4e9b] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition-all"
            >
              {isUpdating || isCreating ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}