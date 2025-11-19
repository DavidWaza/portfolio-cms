"use client";

import React, { useEffect, useState } from "react";
import { sanitizeFileName } from "@/lib/helper";
import { toast } from "sonner";
import { getSupabase } from "@/config/supabaseClient";
import Image from "next/image";
import {
  Plus,
  X,
  Upload,
  Phone,
  FileText,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

type HeroRow = {
  id: number;
  title: string;
  description: string;
  phones: string[];
  images: string[];
  resumes: string | null;
  created_at?: string;
};


export default function HeroPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phones, setPhones] = useState([""]);
  const [images, setImages] = useState<File[]>([]);
  const [resume, setResume] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ⇢ TABLE DATA
  const [rows, setRows] = useState<HeroRow[]>([]);
  const [fetching, setFetching] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);

  const supabase = getSupabase();

  // Fetch hero from supabase
  const fetchData = async () => {
    setFetching(true);
    const { data, error } = await supabase.from("hero").select("*");

    if (error) {
      toast.error("Failed to fetch data");
    } else {
      setRows(data);
    }

    setFetching(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Delete item from table
  const deleteRow = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hero?"
    );
    if (!confirmed) return;

    const { error } = await supabase.from("hero").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete record");
    } else {
      toast.success("Record deleted");
      fetchData();
    }
  };

  const handlePhoneChange = (index: number, value: string) => {
    if (value.length > 11) return;
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  const addPhoneField = () => setPhones([...phones, ""]);
  const removePhoneField = (index: number) =>
    setPhones(phones.filter((_, i) => i !== index));

  // upload helper
  const uploadFile = async (file: File, bucket: string): Promise<string> => {
    const safeName = sanitizeFileName(file.name);
    const filePath = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  // SUBMIT FORM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!title.trim()) throw new Error("Title is required");
      if (!description.trim()) throw new Error("Description is required");

      phones.forEach((p) => {
        if (p.length !== 11)
          throw new Error("Each phone number must be 11 digits");
      });

      // Upload images
      const imageUrls: string[] = [];
      for (const img of images) {
        const url = await uploadFile(img, "images");
        imageUrls.push(url);
      }

      // Upload resume
      let resumeUrl: string | null = null;
      if (resume) resumeUrl = await uploadFile(resume, "resumes");

      // Insert data
      const { error: insertError } = await supabase.from("hero").insert({
        title,
        description,
        phones,
        images: imageUrls,
        resumes: resumeUrl,
      });

      if (insertError) throw insertError;

      toast.success("Hero created successfully!");

      setTitle("");
      setDescription("");
      setPhones([""]);
      setImages([]);
      setResume(null);
      setShowModal(false);

      fetchData();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Hero Management
          </h1>
          <p className="text-gray-600">Manage your portfolio hero sections</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Heroes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {rows.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Images</p>
                <p className="text-3xl font-bold text-gray-900">
                  {rows.reduce((acc, row) => {
                    try {
                      const imgs =
                        typeof row.images === "string"
                          ? JSON.parse(row.images)
                          : row.images;
                      return acc + (Array.isArray(imgs) ? imgs.length : 0);
                    } catch {
                      return acc;
                    }
                  }, 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <ImageIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Phones</p>
                <p className="text-3xl font-bold text-gray-900">
                  {rows.reduce((acc, row) => {
                    try {
                      const ph =
                        typeof row.phones === "string"
                          ? JSON.parse(row.phones)
                          : row.phones;
                      return acc + (Array.isArray(ph) ? ph.length : 0);
                    } catch {
                      return acc;
                    }
                  }, 0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Hero Records
            </h2>

            <div className="flex gap-3">
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2 bg-[#C66140] hover:bg-[#b5563a] text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Create Hero
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {fetching ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C66140]"></div>
              </div>
            ) : rows.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No heroes found</p>
                <p className="text-gray-400 text-sm mb-6">
                  Get started by creating your first hero
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2 bg-[#C66140] hover:bg-[#b5563a] text-white rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Hero
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phones
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Resume
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {rows.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        #{item.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {(() => {
                          try {
                            const phoneList =
                              typeof item.phones === "string"
                                ? JSON.parse(item.phones)
                                : item.phones;
                            return Array.isArray(phoneList)
                              ? phoneList.join(", ")
                              : item.phones;
                          } catch {
                            return item.phones;
                          }
                        })()}
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          try {
                            const imageUrls =
                              typeof item.images === "string"
                                ? JSON.parse(item.images)
                                : item.images;
                            const firstImage = imageUrls?.[0];

                            return firstImage ? (
                              <Image
                                src={firstImage}
                                alt={item.title}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setSelectedImage(firstImage)}
                              />
                            ) : (
                              <span className="text-gray-400 text-sm">
                                No image
                              </span>
                            );
                          } catch (error) {
                            return (
                              <span className="text-gray-400 text-sm">
                                Invalid image
                              </span>
                            );
                          }
                        })()}
                      </td>
                      <td className="px-6 py-4">
                        {item.resumes ? (
                          <button
                            onClick={() => setSelectedResume(item.resumes)}
                            className="text-[#C66140] hover:underline text-sm flex items-center gap-1"
                          >
                            <FileText className="w-4 h-4" />
                            View
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No resume
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          onClick={() => deleteRow(item.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src={selectedImage}
              alt="Full size"
              width={1200}
              height={1200}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        )}

        {/* Resume Modal */}
        {selectedResume && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedResume(null)}
          >
            <button
              onClick={() => setSelectedResume(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
              <h3 className="text-xl font-bold mb-4">Resume</h3>
              <a
                href={selectedResume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C66140] hover:underline"
              >
                Open Resume in New Tab
              </a>
            </div>
          </div>
        )}

        {/* Create Hero Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create New Hero
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
                    placeholder="Enter hero title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all resize-none"
                    rows={4}
                    placeholder="Enter hero description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Numbers *
                  </label>
                  {phones.map((phone, index) => (
                    <div key={index} className="flex gap-3 mb-3">
                      <input
                        type="text"
                        value={phone}
                        className="flex-1 border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
                        placeholder="Enter 11-digit phone number"
                        onChange={(e) =>
                          handlePhoneChange(
                            index,
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                      />
                      {phones.length > 1 && (
                        <button
                          type="button"
                          className="bg-red-100 text-red-600 hover:bg-red-200 p-3 rounded-lg transition-colors"
                          onClick={() => removePhoneField(index)}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="text-[#C66140] hover:text-[#b5563a] font-medium text-sm flex items-center gap-2 mt-2"
                    onClick={addPhoneField}
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Phone
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#C66140] transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        setImages(Array.from(e.target.files || []))
                      }
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-[#C66140] hover:underline font-medium">
                        Click to upload
                      </span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </label>
                    {images.length > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        {images.length} file(s) selected
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resume (PDF)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#C66140] transition-colors">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResume(e.target.files?.[0] || null)}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <span className="text-[#C66140] hover:underline font-medium">
                        Click to upload
                      </span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </label>
                    {resume && (
                      <p className="text-sm text-gray-600 mt-2">
                        {resume.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-[#C66140] hover:bg-[#b5563a] text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Creating...
                      </span>
                    ) : (
                      "Create Hero"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
