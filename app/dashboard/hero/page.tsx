"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { sanitizeFileName } from "@/lib/helper";
import { toast } from "sonner";
import { getSupabase } from "@/lib/supabase";

export default function HeroPage() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [phones, setPhones] = useState<string[]>([""]);
  const [images, setImages] = useState<File[]>([]);
  const [resume, setResume] = useState<File | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const supabase = getSupabase()
//  Handle Phone input
  const handlePhoneChange = (index: number, value: string) => {
    if (value.length > 11) return;

    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  const addPhoneField = () => setPhones([...phones, ""]);

  const removePhoneField = (index: number) =>
    setPhones(phones.filter((_, i) => i !== index));

//   Upload file helper
  const uploadFile = async (file: File, bucket: string): Promise<string> => {
    const safeName = sanitizeFileName(file.name);
    const filePath = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

// Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validations
      if (!title.trim()) throw new Error("Title is required");
      if (!description.trim()) throw new Error("Description is required");

      phones.forEach((phone) => {
        if (phone.length !== 11) {
          throw new Error("Each phone number must be exactly 11 digits");
        }
      });

      // Upload Images
      const imageUrls: string[] = [];
      for (const img of images) {
        const url = await uploadFile(img, "images");
        imageUrls.push(url);
      }

      // Upload Resume
      let resumeUrl: string | null = null;
      if (resume) {
        resumeUrl = await uploadFile(resume, "resumes");
      }

      // Submit to Supabase
      const { data, error: insertError } = await supabase
        .from("hero")
        .insert({
          title,
          description,
          phones,
          images: imageUrls,
          resumes: resumeUrl,
        })
        .select();

      if (insertError) throw insertError;

      toast.success("Data sent successfully!", {
        className: "p-2",
        position: "top-right",
      });

      // Reset fields
      setTitle("");
      setDescription("");
      setPhones([""]);
      setImages([]);
      setResume(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);

      toast.error(message, {
        className: "p-2",
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 max-w-5xl mx-auto text-[#262624]">
      <h1 className="text-2xl font-semibold mb-6">Hero Form</h1>

      {error && (
        <p className="mb-4 p-3 bg-red-100 text-red-700 rounded-md ">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border border-[#C66140] p-3 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex. Software Engineer"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="w-full border border-[#C66140] p-3 rounded"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex. I am the greatest developer on earth"
            required
          />
        </div>

        {/* Phone Numbers */}
        <div>
          <label className="block font-medium mb-2">Phone Numbers</label>

          {phones.map((phone, index) => (
            <div key={index} className="flex items-center gap-3 mb-2">
              <input
                type="number"
                value={phone}
                onChange={(e) =>
                  handlePhoneChange(index, e.target.value.replace(/\D/g, ""))
                }
                className="border border-[#C66140] p-3 rounded w-full"
                placeholder="11-digit phone number"
              />

              {phones.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePhoneField(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  -
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addPhoneField}
            className="px-3 py-1 bg-[#1A1A18] text-white rounded"
          >
            + Add Phone
          </button>
        </div>

        {/* Upload Images */}
        <div>
          <label className="block font-medium mb-1">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files || []))}
            className="w-full border border-[#C66140] p-3 rounded"
          />
        </div>

        {/* Upload Resume */}
        <div>
          <label className="block font-medium mb-1">Upload Resume</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files?.[0] || null)}
            className="w-full border border-[#C66140] p-3 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[#C66140] text-white rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
