"use client";

import dynamic from "next/dynamic";
import { useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { GaleriItem } from "@/types/gallery";
import { toDatetimeLocalInput } from "@/lib/format";
// PENTING: Import CSS SunEditor
import "suneditor/dist/css/suneditor.min.css"; 

// Setup SunEditor dengan dynamic import (No SSR)
const SunEditor = dynamic(() => import("suneditor-react"), { 
  ssr: false,
  loading: () => <div className="h-32 w-full bg-muted animate-pulse rounded-md" />
});

interface FormGalleryProps {
  form: Partial<GaleriItem> | undefined;
  setForm: (data: Partial<GaleriItem>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  readonly?: boolean;
  isLoading?: boolean;
}

export default function FormGallery({
  form,
  setForm,
  onCancel,
  onSubmit,
  readonly = false,
  isLoading = false,
}: FormGalleryProps) {
  
  useEffect(() => {
    if (!form) {
      setForm({
        title: "",
        description: "",
        published_at: "",
      });
    }
  }, [form, setForm]);

  // Handler Upload Gambar untuk SunEditor
  const handleSunUpload = useCallback(
    (
      files: File[],
      _info: object,
      uploadHandler: (data: {
        result?: { url: string; name?: string; size?: number }[];
        errorMessage?: string;
      }) => void
    ): boolean => {
      // Logic upload sama seperti di FormNews. 
      // Jika ingin upload ke server, uncomment dan import helper API Anda.
      
      /* const file = files?.[0];
      if (file) {
         uploadFile(buildServiceUploadFormData({ file })).then(...) 
         return false; // Stop default handler
      }
      */

      // Return true agar fallback menggunakan Base64 (default behavior)
      // Ubah ke false jika Anda sudah menyambungkan API upload di atas
      return true; 
    },
    []
  );

  if (!form) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {readonly
            ? "Detail Galeri"
            : form.id
            ? "Edit Galeri"
            : "Tambah Galeri"}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Judul */}
        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Judul</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            readOnly={readonly}
            placeholder="Masukkan judul galeri"
          />
        </div>

        {/* Deskripsi (SunEditor) */}
        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Deskripsi</Label>
          <div className="sun-editor-wrapper text-black">
            <SunEditor
              // Binding ke form.description
              setContents={form.description || ""} 
              onChange={(description) => {
                // Update state form saat diketik
                setForm({ ...form, description }); 
              }}
              setOptions={{
                minHeight: "200px",
                maxHeight: "500px",
                buttonList: [
                  ["undo", "redo"],
                  ["bold", "italic", "underline", "strike"],
                  ["fontColor", "hiliteColor"],
                  ["align", "list"],
                  ["link", "image", "video"],
                  ["codeView"],
                  ["fullScreen", "showBlocks"]
                ],
              }}
              onImageUploadBefore={handleSunUpload}
            />
          </div>
        </div>

        {/* Published At */}
        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Published At</Label>
          <Input
            type="datetime-local"
            value={toDatetimeLocalInput(form.published_at)}
            onChange={(e) => setForm({ ...form, published_at: e.target.value })}
            readOnly={readonly}
          />
        </div>

        {/* Upload Gambar Utama */}
        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Upload Gambar</Label>
          {readonly ? (
            form.image && typeof form.image === "string" ? (
              <div className="border rounded-lg p-2 bg-gray-50 dark:bg-zinc-800">
                <Image
                  src={form.image}
                  alt="Preview"
                  className="h-32 w-auto object-contain mx-auto"
                  width={300}
                  height={128}
                />
              </div>
            ) : (
              <span className="text-sm text-gray-500 p-2 border rounded-lg block">
                Tidak ada gambar
              </span>
            )
          ) : (
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setForm({ ...form, image: file });
                }}
              />
              {form.image && (
                <div className="border rounded-lg p-2 bg-gray-50 dark:bg-zinc-800">
                  {typeof form.image === "string" ? (
                    <Image
                      src={form.image}
                      alt="Current image"
                      className="h-20 w-auto object-contain"
                      width={200}
                      height={80}
                    />
                  ) : (
                    <span className="text-sm text-green-600 font-medium">
                      File baru dipilih: {form.image.name}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      {!readonly && (
        <div className="pt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Batal
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      )}
    </div>
  );
}