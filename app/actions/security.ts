// app/actions/security.ts
"use server";

import { createCipheriv, randomBytes } from "crypto";

export async function encryptTransactionId(text: string) {
  // PENTING: Simpan Key ini di .env (process.env.APP_KEY)
  // Key harus tepat 32 karakter untuk AES-256
  const key = process.env.APP_KEY || "12345678901234567890123456789012"; 
  
  // Generate IV (Initialization Vector) 16 bytes
  const iv = randomBytes(16);
  
  // Buat Cipher AES-256-CBC
  const cipher = createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  
  // Enkripsi text
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  // Format output: IV dan Data digabung (misal dipisah titik dua), lalu di-base64 agar URL safe
  // Format: base64(iv_hex:encrypted_hex)
  const combined = iv.toString("hex") + ":" + encrypted.toString("hex");
  return Buffer.from(combined).toString("base64");
}