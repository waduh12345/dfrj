"use client";

import dynamic from "next/dynamic";
import { useEffect, useCallback } from "react"; // Tambahkan useCallback
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { News } from "@/types/admin/news";
import { toDatetimeLocalInput } from "@/lib/format";
// PENTING: Import CSS SunEditor agar tampilan tidak berantakan
import "suneditor/dist/css/suneditor.min.css"; 

const SunEditor = dynamic(() => import("suneditor-react"), { 
  ssr: false,
  loading: () => <div className="h-32 w-full bg-muted animate-pulse rounded-md" /> // Loading skeleton opsional
});

interface FormNewsProps {
  form: Partial<News> | undefined;
  setForm: (data: Partial<News>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  readonly?: boolean;
  isLoading?: boolean;
}

export default function FormNews({
  form,
  setForm,
  onCancel,
  onSubmit,
  readonly = false,
  isLoading = false,
}: FormNewsProps) {
  
  // -- Setup Default Values --
  useEffect(() => {
    if (!form) {
      setForm({
        title: "",
        content: "",
        published_at: "",
      });
    }
  }, [form, setForm]);

  // -- Handler Upload Gambar di SunEditor --
  // Catatan: Pastikan function 'uploadFile', 'buildServiceUploadFormData', 
  // dan 'extractUrlFromResponse' sudah di-import atau didefinisikan di file ini 
  // atau dipassing via props jika ingin fitur ini berjalan.
  const handleSunUpload = useCallback(
    (
      files: File[],
      _info: object,
      uploadHandler: (data: {
        result?: { url: string; name?: string; size?: number }[];
        errorMessage?: string;
      }) => void
    ): boolean => {
      const file = files?.[0];
      if (!file) {
        uploadHandler({ errorMessage: "File tidak ditemukan" });
        return false;
      }

      // --- LOGIKA UPLOAD ---
      // Karena dependencies (uploadFile, dll) tidak ada di snippet asli,
      // pastikan Anda sudah memilikinya. Jika belum, uncomment kode di bawah
      // dan sesuaikan dengan API call Anda.
      
      /*
      uploadFile(buildServiceUploadFormData({ file }))
        .unwrap()
        .then((res) => {
          const url = extractUrlFromResponse(res);
          if (!url) {
            uploadHandler({ errorMessage: "Gagal dapat URL" });
            return;
          }
          uploadHandler({
            result: [{ url, name: file.name, size: file.size }],
          });
        })
        .catch((err) => {
          uploadHandler({ errorMessage: "Upload gagal" });
        });
      */

      // Return false untuk mematikan upload handler default (base64)
      // Ubah jadi true jika ingin pakai base64 default sementara waktu
      return true; 
    },
    [] // Masukkan dependencies [uploadFile] jika sudah ada
  );

  if (!form) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {readonly ? "Detail News" : form.id ? "Edit News" : "Tambah News"}
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
            placeholder="Masukkan judul news"
          />
        </div>

        {/* Konten (SunEditor) */}
        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Konten</Label>
          <div className="sun-editor-wrapper text-black"> 
            {/* Wrapper div berguna jika ingin override css dark mode khusus editor */}
            <SunEditor
              // Binding ke form.content
              setContents={form.content || ""} 
              onChange={(content) => {
                // Update state form saat diketik
                setForm({ ...form, content }); 
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
              // Sambungkan handler upload (opsional, jika logika upload sudah siap)
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

        {/* Upload Gambar Thumbnail */}
        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Thumbnail Gambar</Label>
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

      {/* Tombol Action */}
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