import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { getSupabase } from "@/config/supabaseClient";
import { TestimonialProps } from "@/lib/types";

type EditTestimonialProps = {
  isOpen: boolean;
  test: TestimonialProps | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditExpModal({
  isOpen,
  test,
  onClose,
  onSuccess,
}: EditTestimonialProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = getSupabase();

  useEffect(() => {
    if (test) {
      setName(test.name);
      setRole(test.role);
      setTestimonial(test.testimonial);
    }
  }, [test]);

  const handleUpdate = async () => {
    if (!test) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("testimonial")
        .update({
          name,
          role,
          testimonial,
        })
        .eq("id", test.id);

      if (error) throw error;

      toast.success("Testimonial updated successfully!");
      onClose();
      onSuccess();
    } catch (err) {
      toast.error("Failed to update testimonial");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !test) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Fixed header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Edit Testimonial</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form className="p-6 space-y-6">
            <div className="grid grid-cols-1  gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                  className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Ex. Meta"
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
            className="flex-1 px-6 py-3 bg-[#8B5CF6] hover:bg-green-700 text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Updating...
              </span>
            ) : (
              "Update Testimonial"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
