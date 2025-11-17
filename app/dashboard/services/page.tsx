"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSupabase } from "@/config/supabaseClient";
import Image from "next/image";
import { Plus, X, Trash2, Layers } from "lucide-react";

type ServiceProps = {
  id: number;
  title: string;
  description: string;
  roles: string;
  created_at?: string;
};
export default function ServicePage() {
  const [title, setTitle] = useState("");
  const [description, setShortDescription] = useState("");
  const [roles, setRoles] = useState([""]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [rows, setRows] = useState<ServiceProps[]>([]);
  const [fetching, setFetching] = useState(false);

  const supabase = getSupabase();

  // Add new roless
  const addNewRoles = () => setRoles([...roles, ""]);
  const removeRoleField = (index: number) =>
    setRoles(roles.filter((_, i) => i !== index));

  // Handle roles value
  const handleRoleChange = (index: number, value: string) => {
    const updated = [...roles];
    updated[index] = value;
    setRoles(updated);
  };
  const fetchServices = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch services");
    } else {
      setRows(data || []);
    }
    setFetching(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const deleteProject = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );
    if (!confirmed) return;

    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete service");
    } else {
      toast.success("Service deleted successfully");
      fetchServices();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!title.trim()) throw new Error("Title is required");
      if (!description.trim()) throw new Error("Short description required");
      if (!roles) throw new Error("Role/Roles required");

      const { error: insertError } = await supabase.from("services").insert({
        title,
        description,
        roles,
      });

      if (insertError) throw insertError;

      toast.success("Project created successfully!");

      setTitle("");
      setShortDescription("");
      setRoles([]);
      setShowModal(false);

      fetchServices();
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
            Service Management
          </h1>
          <p className="text-gray-600">Manage your portfolio services</p>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Service</p>
                <p className="text-3xl font-bold text-gray-900">
                  {rows.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Layers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Latest Year</p>
                <p className="text-3xl font-bold text-gray-900">
                  {rows.length > 0
                    ? Math.max(...rows.map((r) => parseInt(r.year) || 0))
                    : "-"}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Technologies</p>
                <p className="text-3xl font-bold text-gray-900">
                  {rows.reduce((acc, row) => {
                    try {
                      const t =
                        typeof row.tools === "string"
                          ? JSON.parse(row.tools)
                          : row.tools;
                      return acc + (Array.isArray(t) ? t.length : 0);
                    } catch {
                      return acc;
                    }
                  }, 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Locations</p>
                <p className="text-3xl font-bold text-gray-900">
                  {new Set(rows.map((r) => r.location)).size}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div> */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Service Records
            </h2>

            <div className="flex gap-3">
              <button
                onClick={fetchServices}
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
                Create New Service
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
                  No Service(s) found
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  Get started by creating your first service
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2 bg-[#C66140] hover:bg-[#b5563a] text-white rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Service(s)
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role(s)
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
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {(() => {
                          try {
                            const roleList =
                              typeof item.roles === "string"
                                ? JSON.parse(item.roles)
                                : item.roles;

                            if (Array.isArray(roleList)) {
                              return (
                                <ul className="space-y-1">
                                  {roleList.map((role: string, idx: number) => (
                                    <li
                                      key={idx}
                                      className="bg-gray-200  px-2 py-1 rounded text-sm"
                                    >
                                      {role}
                                    </li>
                                  ))}
                                </ul>
                              );
                            }

                            return item.roles;
                          } catch {
                            return item.roles;
                          }
                        })()}
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
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create New Project
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
                      placeholder="Enter service title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all resize-none"
                    placeholder="Brief description of the service"
                    value={description}
                    onChange={(e) => setShortDescription(e.target.value)}
                  />
                </div>

                <div className="">
                  {roles.map((roleData, index) => (
                    <div key={index} className="flex gap-3 mb-3">
                      <input
                        type="text"
                        value={roleData}
                        className="flex-1 border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
                        placeholder="Enter Responsibilities"
                        onChange={(e) =>
                          handleRoleChange(index, e.target.value)
                        }
                      />
                      {roles.length > 1 && (
                        <button
                          type="button"
                          className="bg-red-100 text-red-600 hover:bg-red-200 p-3 rounded-lg transition-colors"
                          onClick={() => removeRoleField(index)}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="text-[#C66140] hover:text-[#b5563a] font-medium text-sm flex items-center gap-2 mt-2"
                    onClick={addNewRoles}
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Role
                  </button>
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
                      "Create Service(s)"
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
