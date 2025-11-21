import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { getSupabase } from "@/config/supabaseClient";
import { WorkExpProps } from "@/lib/types";

type EditExpModalProps = {
  isOpen: boolean;
  exp: WorkExpProps | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditExpModal({
  isOpen,
  exp,
  onClose,
  onSuccess,
}: EditExpModalProps) {
  const [title_role, setTitle_role] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [date_started, setDate_started] = useState("");
  const [date_ended, setDate_ended] = useState("");
  const [job_type, setJob_type] = useState<string>("");
  const [job_responsibility, setJob_responsibility] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  const supabase = getSupabase();

  useEffect(() => {
    if (exp) {
      setTitle_role(exp.title_role);
      setCompany(exp.company);
      setLocation(exp.location);
      setDate_started(exp.date_started);
      setDate_ended(exp.date_ended);
      setJob_type(exp.job_type);

      try {
        setJob_responsibility(
          typeof exp.job_responsibility === "string"
            ? JSON.parse(exp.job_responsibility)
            : exp.job_responsibility
        );
      } catch {
        setJob_responsibility([""]);
      }
    }
  }, [exp]);

  const addToolField = () => setJob_responsibility([...job_responsibility, ""]);

  const removeTool = (index: number) =>
    setJob_responsibility(job_responsibility.filter((_, i) => i !== index));

  const handleToolChange = (index: number, value: string) => {
    const updated = [...job_responsibility];
    updated[index] = value;
    setJob_responsibility(updated);
  };

  const handleUpdate = async () => {
    if (!exp) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("work_experiences")
        .update({
          title_role,
          company,
          date_started,
          date_ended,
          job_type,
          job_responsibility,
        })
        .eq("id", exp.id);

      if (error) throw error;

      toast.success("Work experience updated successfully!");
      onClose();
      onSuccess();
    } catch (err) {
      toast.error("Failed to update project");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !exp) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Fixed header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Edit Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role Title *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                  className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Ex. Meta"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="e.g. San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="e.g. Web App, Mobile App"
                  value={date_started}
                  onChange={(e) => setDate_started(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date *
              </label>
              <input
                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="End date"
                value={date_ended}
                onChange={(e) => setDate_ended(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type *
              </label>
              <input
                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Start date"
                value={job_type}
                onChange={(e) => setJob_type(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Responsibilities *
              </label>
              {job_responsibility.map((tool, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="e.g. React, Node.js, MongoDB"
                    value={tool}
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
                className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-2 mt-2"
                onClick={addToolField}
              >
                <Plus className="w-4 h-4" />
                Add Another Tool
              </button>
            </div>
          </form>
        </div>

        <div className="flex gap-3 p-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            className="flex-1 px-6 py-3 bg-[#C66140] hover:bg-green-700 text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Updating...
              </span>
            ) : (
              "Update Project"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
