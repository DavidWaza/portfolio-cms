import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { getSupabase } from "@/config/supabaseClient";
import { ServiceProps } from "@/lib/types";

type EditProjectModalProps = {
  isOpen: boolean;
  services: ServiceProps | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditProjectModal({
  isOpen,
  services,
  onClose,
  onSuccess,
}: EditProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roles, setRoles] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  const supabase = getSupabase();

  const addToolField = () => setRoles([...roles, ""]);

  const removeTool = (index: number) =>
    setRoles(roles.filter((_, i) => i !== index));

  const handleToolChange = (index: number, value: string) => {
    const updated = [...roles];
    updated[index] = value;
    setRoles(updated);
  };

  useEffect(() => {
    if (services) {
      setTitle(services.title);
      setDescription(services.description);
    }
    try {
      setRoles(
        typeof services?.roles === "string"
          ? JSON.parse(services.roles)
          : services?.roles
      );
    } catch {
      setRoles([""]);
    }
  }, [services]);

  const handleUpdate = async () => {
    if (!services) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("services")
        .update({
          title,
          description,
          roles,
        })
        .eq("id", services.id);

      if (error) throw error;

      toast.success("Project updated successfully!");
      onClose();
      onSuccess();
    } catch (err) {
      toast.error("Failed to update services");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !services) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Edit Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service Title *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter services title"
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
              className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              placeholder="Brief description of the services"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Roles *
            </label>
            {roles.map((role, index) => (
              <div key={index} className="flex gap-3 mb-3">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="e.g. React, Node.js, MongoDB"
                  value={role}
                  onChange={(e) => handleToolChange(index, e.target.value)}
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
              className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-2 mt-2"
              onClick={addToolField}
            >
              <Plus className="w-4 h-4" />
              Add Another Tool
            </button>
          </div>

          <div className="flex gap-3 pt-4">
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
    </div>
  );
}
