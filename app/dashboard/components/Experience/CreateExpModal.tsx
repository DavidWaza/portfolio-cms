import React, { useState } from "react";
import { X, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { getSupabase } from "@/config/supabaseClient";

type CreateExpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateExpModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateExpModalProps) {
  const [title_role, setTitle_role] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [date_started, setDate_started] = useState("");
  const [date_ended, setDate_ended] = useState("");
  const [job_type, setJob_type] = useState("");
  const [job_responsibility, setJob_responsibility] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = getSupabase();

  const addToolField = () => setJob_responsibility([...job_responsibility, ""]);

  const removeTool = (index: number) =>
    setJob_responsibility(job_responsibility.filter((_, i) => i !== index));

  const handleToolChange = (index: number, value: string) => {
    const updated = [...job_responsibility];
    updated[index] = value;
    setJob_responsibility(updated);
  };

  const resetForm = () => {
    setTitle_role("");
    setDate_started("");
    setJob_type("");
    setJob_responsibility([]);
    setDate_ended("");
    setCompany("");
    setLocation("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!title_role.trim()) throw new Error("Title is required");
      if (!company.trim()) throw new Error("Description is required");
      if (!location.trim()) throw new Error("Location is required");
      if (!date_started.trim()) throw new Error("Application type is required");
      if (!date_ended) throw new Error("Year is required");
      if (!job_type.trim()) throw new Error("Project link is required");
      if (!job_responsibility) throw new Error("Logo is required");

      const { error: insertError } = await supabase
        .from("work_experiences")
        .insert({
          title_role,
          company,
          location,
          date_started,
          date_ended,
          job_type,
          job_responsibility,
        });

      if (insertError) throw insertError;

      toast.success("Experience created successfully!");
      resetForm();
      onClose();
      onSuccess();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">
            Create New Work Experience
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable comp */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role Title *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all"
                  placeholder="Enter project title"
                  value={title_role}
                  onChange={(e) => setTitle_role(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company *
                </label>
                <input
                  type="url"
                  className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all"
                  placeholder="Ex. Meta"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all"
                  placeholder="Ex. Mar, 2000"
                  value={date_started}
                  onChange={(e) => setDate_started(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all resize-none"
                  placeholder="Ex. Mar, 2002"
                  value={date_ended}
                  onChange={(e) => setDate_ended(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all"
                placeholder="e.g. San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type *
              </label>
              <input
                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all resize-none"
                placeholder="Ex. Remote"
                value={job_type}
                onChange={(e) => setJob_type(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Descriptions *
              </label>
              {job_responsibility.map((des, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all"
                    placeholder="Ex. I handled the api integration with axios"
                    value={des}
                    onChange={(e) => handleToolChange(index, e.target.value)}
                  />
                  {job_responsibility.length > 1 && (
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
                className="text-[#8B5CF6] hover:text-[#8B5CF6] font-medium text-sm flex items-center gap-2 mt-2"
                onClick={addToolField}
              >
                <Plus className="w-4 h-4" />
                Add Another Responsibility
              </button>
            </div>
          </form>
        </div>

        {/* Fixed button */}
        <div className="p-6 border-t border-gray-100 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-[#8B5CF6] hover:bg-[#8B5CF6] text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}
