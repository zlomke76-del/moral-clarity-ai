"use client";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

/** Uploads a File to the `uploads` bucket under userId/timestamp_filename and returns {key, url}. */
export async function uploadToUploads(file: File, userId = "anon") {
  const supabase = createSupabaseBrowser();
  const safeName = file.name.replace(/[^\w.\-.]+/g, "_");
  const key = `${userId}/${Date.now()}_${safeName}`; // no leading slash

  const { error } = await supabase.storage.from("uploads").upload(key, file, {
    upsert: false,
    contentType: file.type || "application/octet-stream",
  });
  if (error) throw error;

  const { data: pub } = supabase.storage.from("uploads").getPublicUrl(key);
  return { key, url: pub.publicUrl, name: file.name, type: file.type };
}
