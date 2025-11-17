"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSupabase } from "@/config/supabaseClient";
import { Plus, X, Trash2, Layers, FileText} from "lucide-react";

type WorkExpProps = {
  id: number;
  title_role: string;
  company: string;
  date_started: string;
  date_ended: string;
  location: string;
  job_type: string;
  job_responsibility: string[];
  created_at?: string;
};
export default function ExperiencePage() {
  const [title_role, setTitle_role] = useState("");
  const [company, setCompany] = useState("");
  const [date_started, setDate_started] = useState("");
  const [date_ended, setDate_ended] = useState("");
  const [location, setLocation] = useState("");
  const [job_type, setJob_type] = useState("");
  const [job_responsibility, setJob_responsibility] = useState([""]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [rows, setRows] = useState<WorkExpProps[]>([]);
  const [fetching, setFetching] = useState(false);

  const supabase = getSupabase();

  // Add new roless
  const addNewExperience = () =>
    setJob_responsibility([...job_responsibility, ""]);
  const removeRoleField = (index: number) =>
    setJob_responsibility(job_responsibility.filter((_, i) => i !== index));

  // Handle roles value
  const handleRoleChange = (index: number, value: string) => {
    const updated = [...job_responsibility];
    updated[index] = value;
    setJob_responsibility(updated);
  };
  const fetchWorkExp = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("work_experiences")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch work experiences");
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

    const { error } = await supabase
      .from("work_experiences")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete experience");
    } else {
      toast.success("Work experience deleted successfully");
      fetchWorkExp();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!title_role.trim()) throw new Error("Title is required");
      if (!company.trim()) throw new Error("Company required");
      if (!date_started) throw new Error("Date started required");
      if (!date_ended) throw new Error("Date ended required");
      if (!location) throw new Error("Location is required");
      if (!job_type) throw new Error("Job type required");
      if (!job_responsibility) throw new Error("Job role required");

      const { error: insertError } = await supabase
        .from("work_experiences")
        .insert({
          title_role,
          company,
          date_started,
          date_ended,
          location,
          job_type,
          job_responsibility,
        });

      if (insertError) throw insertError;

      toast.success("Work Experiences created successfully!");

      setTitle_role("");
      setCompany("");
      setDate_started("");
      setDate_ended("");
      setLocation("");
      setJob_type("");
      setJob_responsibility([]);
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
              Work Experience Records
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
                Create New Work Exp.
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
                  No work experiences found
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  Get started by creating your first service
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2 bg-[#C66140] hover:bg-[#b5563a] text-white rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Work Exp.
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Job Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Responsibilities
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
                        {item.title_role}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {item.company}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {item.date_started}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {item.date_ended}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {item.job_type}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {(() => {
                          try {
                            const roleList =
                              typeof item.job_responsibility === "string"
                                ? JSON.parse(item.job_responsibility)
                                : item.job_responsibility;

                            if (Array.isArray(roleList)) {
                              return (
                                <ul className="space-y-1">
                                  {roleList.map((role: string, idx: number) => (
                                    <li
                                      key={idx}
                                      className="bg-gray-200  px-2 py-1 rounded text-sm"
                                    >
                                      {role.slice(10, 1)}
                                    </li>
                                  ))}
                                </ul>
                              );
                            }

                            return item.job_responsibility;
                          } catch {
                            return item.job_responsibility;
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
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create New Work Exp.
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
                      Title Role*
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
                      placeholder="Ex. Senior Software Developer"
                      value={title_role}
                      onChange={(e) => setTitle_role(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all resize-none"
                    placeholder="Ex. Meta"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all resize-none"
                      placeholder="Ex. 19 Mar, 2019"
                      value={date_started}
                      onChange={(e) => setDate_started(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all resize-none"
                      placeholder="Ex. 22nd Dec, 2025"
                      value={date_ended}
                      onChange={(e) => setDate_ended(e.target.value)}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all resize-none"
                    placeholder="Ex. Silicon Valley"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Type*
                  </label>
                  <input
                    className="w-full border border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all resize-none"
                    placeholder="Ex. Remote"
                    value={job_type}
                    onChange={(e) => setJob_type(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  {job_responsibility.map((roleData, index) => (
                    <div key={index} className="mb-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Job Responsibilities*
                      </label>
                      <textarea
                        rows={4}
                        value={roleData}
                        className="border w-full border-gray-300 text-[#262624] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
                        placeholder="Enter Responsibilities"
                        onChange={(e) =>
                          handleRoleChange(index, e.target.value)
                        }
                      />
                      {job_responsibility.length > 1 && (
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
                    onClick={addNewExperience}
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Role
                  </button>
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
                      "Create Experience"
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
