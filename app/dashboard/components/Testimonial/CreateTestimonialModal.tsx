import React, { useState } from "react";
import { X, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { getSupabase } from "@/config/supabaseClient";

type CreateExpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateTestimonialModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateExpModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = getSupabase();

  const resetForm = () => {
    setName("");
    setRole("");
    setTestimonial("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!name.trim()) throw new Error("Name is required");
      if (!role.trim()) throw new Error("Role is required");
      if (!testimonial.trim()) throw new Error("Testimonial is required");
      const { error: insertError } = await supabase
        .from("testimonial")
        .insert({
          name,
          role,
          testimonial,
        });

      if (insertError) throw insertError;

      toast.success("Testimonial created successfully!");
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
            Create New Testimonial
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

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all"
                  placeholder="Enter project title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role *
                </label>
                <input
                  type="url"
                  className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all"
                  placeholder="Ex. Software Engineering"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Testimonial *
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all"
                  placeholder="Type a testimonial"
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                />
              </div>
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
              "Create Testimonial"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
