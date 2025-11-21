import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { getSupabase } from "@/config/supabaseClient";

type CreateProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateServiceModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roles, setRoles] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = getSupabase();

  const addToolField = () => setRoles([...roles, ""]);

  const removeTool = (index: number) =>
    setRoles(roles.filter((_, i) => i !== index));

  const handleRoleChange = (index: number, value: string) => {
    const updated = [...roles];
    updated[index] = value;
    setRoles(updated);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRoles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!title.trim()) throw new Error("Title is required");
      if (!description.trim()) throw new Error("Description is required");
      if (!roles) throw new Error("Roles is required");

      const { error: insertError } = await supabase.from("services").insert({
        title,
        description,
        roles,
      });

      if (insertError) throw insertError;

      toast.success("Project created successfully!");
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
            Create New Project
          </h2>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" onClick={onClose} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Title *
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
                onChange={(e) => setDescription(e.target.value)}
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
                    onChange={(e) => handleRoleChange(index, e.target.value)}
                  />
                  {roles.length > 1 && (
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
                Add Another Role
              </button>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
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
  );
}
