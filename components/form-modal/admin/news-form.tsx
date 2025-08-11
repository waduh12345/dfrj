"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { News } from "@/types/admin/news";
import Image from "next/image";

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

  // Initialize form if it's empty
  useEffect(() => {
    if (!form) {
      setForm({
        title: "",
        content: "",
        published_at: "",
      });
    }
  }, [form, setForm]);

  // Handle title change and auto-generate slug
  const handleTitleChange = (newTitle: string) => {
    const updatedForm = { ...form, title: newTitle };
  
    setForm(updatedForm);
  };


  if (!form) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {readonly
            ? "Detail News"
            : form.id
            ? "Edit News"
            : "Tambah News"}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Judul</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => handleTitleChange(e.target.value)}
            readOnly={readonly}
            placeholder="Masukkan judul news"
          />
        </div>

        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Deskripsi</Label>
          <Textarea
            value={form.content || ""}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            readOnly={readonly}
            placeholder="Masukkan deskripsi news"
            rows={4}
          />
        </div>

        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Published At</Label>
          <Input
            type="datetime-local"
            value={form.published_at || ""}
            onChange={(e) => setForm({ ...form, published_at: e.target.value })}
            readOnly={readonly}
          />
        </div>

        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Upload Gambar</Label>
          {readonly ? (
            form.image && typeof form.image === "string" ? (
              <div className="border rounded-lg p-2">
                <Image
                  src={form.image}
                  alt="Preview"
                  className="h-32 w-auto object-contain mx-auto"
                  width={300}
                  height={128}
                />
              </div>
            ) : (
              <span className="text-sm text-gray-500 p-2 border rounded-lg">
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
                <div className="border rounded-lg p-2">
                  {typeof form.image === "string" ? (
                    <Image
                      src={form.image}
                      alt="Current image"
                      className="h-20 w-auto object-contain"
                      width={200}
                      height={80}
                    />
                  ) : (
                    <span className="text-sm text-green-600">
                      File baru dipilih: {form.image.name}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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