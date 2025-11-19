"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSupabase } from "@/config/supabaseClient";
import Image from "next/image";
import {
  Plus,
  X,
  Upload,
  Trash2,
  Calendar,
  MapPin,
  Code,
  Layers,
} from "lucide-react";

type ProjectProps = {
  id: number;
  title: string;
  description: string;
  location: string;
  project_link: string;
  application_type: string;
  year: string;
  tools: string[];
  logo: string;
  created_at?: string;
};
export default function ProjectsPage() {
  const [title, setTitle] = useState("");
  const [description, setShortDescription] = useState("");
  const [location, setLocation] = useState("");
  const [project_link, setProject_link] = useState("");
  const [application_type, setApplication_type] = useState("");
  const [year, setYear] = useState<string>("");
  const [tools, setTools] = useState<string[]>([""]);
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [rows, setRows] = useState<ProjectProps[]>([]);
  const [fetching, setFetching] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);

  const supabase = getSupabase();

  const years = Array.from(
    { length: new Date().getFullYear() - 1970 + 1 },
    (_, i) => 1970 + i
  ).reverse();

  const fetchProjects = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch projects");
    } else {
      setRows(data || []);
    }
    setFetching(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const deleteProject = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmed) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete project");
    } else {
      toast.success("Project deleted successfully");
      fetchProjects();
    }
  };

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
      if (!project_link) throw new Error("project link is required");
      if (!logo) throw new Error("Logo is required");

      const logoUrl = await uploadFile(logo, "logo");

      const { error: insertError } = await supabase.from("projects").insert({
        title,
        description,
        location,
        application_type,
        year,
        tools,
        project_link,
        logo: logoUrl,
      });

      if (insertError) throw insertError;

      toast.success("Project created successfully!");

      setTitle("");
      setShortDescription("");
      setLocation("");
      setApplication_type("");
      setYear("");
      setTools([""]);
      setLogo(null);
      setProject_link("");
      setShowModal(false);

      fetchProjects();
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
            Projects Management
          </h1>
          <p className="text-gray-600">Manage your portfolio projects</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Projects</p>
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
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Project Records
            </h2>

            <div className="flex gap-3">
              <button
                onClick={fetchProjects}
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
                Create Project
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
                <p className="text-gray-500 text-lg mb-2">No projects found</p>
                <p className="text-gray-400 text-sm mb-6">
                  Get started by creating your first project
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2 bg-[#C66140] hover:bg-[#b5563a] text-white rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Project
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Logo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Link
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tools
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
                      <td className="px-6 py-4">
                        {item.logo ? (
                          <Image
                            src={item.logo}
                            alt={item.title}
                            width={50}
                            height={50}
                            className="rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setSelectedLogo(item.logo)}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Code className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-sm max-w-xs truncate underline text-blue-700">
                        {item.project_link}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {item.description}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                          {item.application_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 ">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {item.location}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600 ">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {item.year}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            try {
                              const toolsList =
                                typeof item.tools === "string"
                                  ? JSON.parse(item.tools)
                                  : item.tools;
                              return Array.isArray(toolsList)
                                ? toolsList.slice(0, 3).map((tool, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                                    >
                                      {tool}
                                    </span>
                                  ))
                                : null;
                            } catch {
                              return (
                                <span className="text-gray-400 text-xs">-</span>
                              );
                            }
                          })()}
                          {(() => {
                            try {
                              const toolsList =
                                typeof item.tools === "string"
                                  ? JSON.parse(item.tools)
                                  : item.tools;
                              if (
                                Array.isArray(toolsList) &&
                                toolsList.length > 3
                              ) {
                                return (
                                  <span className="text-xs text-gray-400">
                                    +{toolsList.length - 3}
                                  </span>
                                );
                              }
                            } catch {}
                            return null;
                          })()}
                        </div>
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

        {selectedLogo && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedLogo(null)}
          >
            <button
              onClick={() => setSelectedLogo(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src={selectedLogo}
              alt="Full size logo"
              width={600}
              height={600}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        )}

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
                      placeholder="Enter project title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {/* Project Link */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Link *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
                      placeholder="Enter project title"
                      value={project_link}
                      onChange={(e) => setProject_link(e.target.value)}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
                      placeholder="e.g. San Francisco, CA"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
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
                    placeholder="Brief description of the project"
                    value={description}
                    onChange={(e) => setShortDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Application Type *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
                      placeholder="e.g. Web App, Mobile App"
                      value={application_type}
                      onChange={(e) => setApplication_type(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Year *
                    </label>
                    <select
                      className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
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
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tools / Tech Stack *
                  </label>
                  {tools.map((tool, index) => (
                    <div key={index} className="flex gap-3 mb-3">
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
                        placeholder="e.g. React, Node.js, MongoDB"
                        value={tool}
                        onChange={(e) =>
                          handleToolChange(index, e.target.value)
                        }
                      />
                      {tools.length > 1 && (
                        <button
                          type="button"
                          className="bg-red-100 text-red-600 hover:bg-red-200 p-3 rounded-lg transition-colors"
                          onClick={() => removeTool(index)}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="text-[#C66140] hover:text-[#b5563a] font-medium text-sm flex items-center gap-2 mt-2"
                    onClick={addToolField}
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Tool
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Logo *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#C66140] transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogo(e.target.files?.[0] || null)}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <span className="text-[#C66140] hover:underline font-medium">
                        Click to upload
                      </span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </label>
                    {logo && (
                      <p className="text-sm text-gray-600 mt-2">{logo.name}</p>
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
                      "Create Project"
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
