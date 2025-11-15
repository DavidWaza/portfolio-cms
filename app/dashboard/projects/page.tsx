"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function ProjectsPage() {
  const [title, setTitle] = useState("");
  const [description, setShortDescription] = useState("");
  const [location, setLocation] = useState("");
  const [application_type, setApplication_type] = useState("");

  const [year, setYear] = useState<string>("");

  const [tools, setTools] = useState<string[]>([""]);
  const [logo, setLogo] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generate years from 1970 to current year
  const years = Array.from(
    { length: new Date().getFullYear() - 1970 + 1 },
    (_, i) => 1970 + i
  );

  const addToolField = () => setTools([...tools, ""]);
  const removeTool = (index: number) =>
    setTools(tools.filter((_, i) => i !== index));

  const handleToolChange = (index: number, value: string) => {
    const updated = [...tools];
    updated[index] = value;
    setTools(updated);
  };

  const uploadFile = async (file: File, bucket: string) => {
    const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const filePath = `${Date.now()}-${cleanName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!title.trim()) throw new Error("Title is required");
      if (!description.trim()) throw new Error("Short description required");
      if (!location.trim()) throw new Error("Location is required");
      if (!application_type.trim())
        throw new Error("Application type required");
      if (!year) throw new Error("Year is required");
      if (!logo) throw new Error("Logo is required");

      // Upload logo
      const logoUrl = await uploadFile(logo, "logo");

  

      // Insert into DB
      const { data, error: insertError } = await supabase
        .from("projects")
        .insert({
          title,
          description,
          location,
          application_type,
          year,
          tools,
          logo: logoUrl,
        })
        .select();

      if (insertError) throw insertError;

      if (data) {
        toast.success("Data sent successfully", {
          className: "p-2",
          position: "top-right",
        });
      }
      if (error) {
        toast.error("Failed uploading document", {
          className: "p-2",
          position: "top-right",
        });
      }
      // Reset fields
      setTitle("");
      setShortDescription("");
      setLocation("");
      setApplication_type("");
      setYear("");
      setTools([""]);
      setLogo(null);
      // setImages([]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-[#262624]">
      <h1 className="text-2xl font-semibold mb-6 text-[#262624]">
        Portfolio Form
      </h1>

      {error && (
        <p className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border border-[#C66140]  p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block font-medium mb-1">Short Description</label>
          <textarea
            rows={3}
            className="w-full border border-[#C66140]  p-2 rounded"
            value={description}
            onChange={(e) => setShortDescription(e.target.value)}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            type="text"
            className="w-full border border-[#C66140]  p-2 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Application Type */}
        <div>
          <label className="block font-medium mb-1">Application Type</label>
          <input
            type="text"
            className="w-full border border-[#C66140]  p-2 rounded"
            value={application_type}
            onChange={(e) => setApplication_type(e.target.value)}
          />
        </div>

        {/* Year */}
        <div>
          <label className="block font-medium mb-1">Year</label>
          <select
            className="w-full border border-[#C66140]  p-2 rounded"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">Select year</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        {/* Tools Stacks */}
        <div>
          <label className="block font-medium mb-2">Tools / Tech Stack</label>

          {tools.map((tool, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                className="border border-[#C66140]  p-2 rounded w-full"
                placeholder="e.g. React, Tailwind, Next.js"
                value={tool}
                onChange={(e) => handleToolChange(index, e.target.value)}
              />

              {tools.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTool(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  -
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addToolField}
            className="px-3 py-1 bg-[#1A1A18] text-white rounded"
          >
            + Add Tool
          </button>
        </div>

        {/* Logo */}
        <div>
          <label className="block font-medium mb-1">Upload Logo</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded"
            onChange={(e) => setLogo(e.target.files?.[0] || null)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[#C66140] text-white rounded disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Portfolio"}
        </button>
      </form>
    </div>
  );
}
