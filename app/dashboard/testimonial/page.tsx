"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSupabase } from "@/config/supabaseClient";
import { Plus, X, Trash2, Layers, FileText } from "lucide-react";

type WorkExpProps = {
  id: number;
  name: string;
  role: string;
  testimonial: string;
  created_at?: string;
};
export default function TestimonialPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [testimonial, setTestimonial] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [rows, setRows] = useState<WorkExpProps[]>([]);
  const [fetching, setFetching] = useState(false);

  const supabase = getSupabase();

  const fetchWorkExp = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("testimonial")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch testimonial");
    } else {
      setRows(data || []);
    }
    setFetching(false);
  };

  useEffect(() => {
    fetchWorkExp();
  }, []);

  const deleteProject = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );
    if (!confirmed) return;

    const { error } = await supabase.from("testimonial").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete testimonial");
    } else {
      toast.success("Testimonial deleted successfully");
      fetchWorkExp();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!name.trim()) throw new Error("Title is required");
      if (!role.trim()) throw new Error("Role required");
      if (!testimonial) throw new Error("Testimonial required");

      const { error: insertError } = await supabase.from("testimonial").insert({
        name,
        role,
        testimonial,
      });

      if (insertError) throw insertError;

      toast.success("Testimonial created successfully!");

      setName("");
      setRole("");
      setTestimonial("");
      setShowModal(false);

      fetchWorkExp();
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Experience Management
          </h1>
          <p className="text-gray-600">Manage your portfolio exp.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Work Exp.</p>
                <p className="text-3xl font-bold text-gray-900">
                  {rows.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Testimonial Records
            </h2>

            <div className="flex gap-3">
              <button
                onClick={fetchWorkExp}
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
                Create New Testimonial.
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
                <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  No Testimonial(s) found
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  Get started by creating your first service
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2 bg-[#C66140] hover:bg-[#b5563a] text-white rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Testimonial
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Testimonial
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
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {item.role}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {item.testimonial}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          onClick={() => deleteProject(item.id)}
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

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create New Testimonial
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div
                onSubmit={handleSubmit}
                className="p-6 space-y-6 overflow-y-auto"
              >
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
                      placeholder="Ex. David Waza"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role *
                  </label>
                  <input
                    className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all resize-none"
                    placeholder="Ex. CEO Meta"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>

                <div className="">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Testimonial *
                    </label>
                    <textarea
                      rows={4}
                      className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all resize-none"
                      placeholder="Ex. I love his ability to work"
                      value={testimonial}
                      onChange={(e) => setTestimonial(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex gap-3 bg-white shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-[#C66140] hover:bg-[#b5563a] text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Creating...
                      </span>
                    ) : (
                      "Create Testimonial"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
