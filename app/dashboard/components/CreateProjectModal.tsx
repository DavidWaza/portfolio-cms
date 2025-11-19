import React, { useState } from "react";
import { X, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { getSupabase } from "@/config/supabaseClient";

type CreateProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [applicationType, setApplicationType] = useState("");
  const [year, setYear] = useState<string>("");
  const [tools, setTools] = useState<string[]>([""]);
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = getSupabase();

  const years = Array.from(
    { length: new Date().getFullYear() - 1970 + 1 },
    (_, i) => 1970 + i
  ).reverse();

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

    const { error } = await supabase.storage.from(bucket).upload(filePath, file);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl.publicUrl;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setApplicationType("");
    setYear("");
    setTools([""]);
    setLogo(null);
    setProjectLink("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!title.trim()) throw new Error("Title is required");
      if (!description.trim()) throw new Error("Description is required");
      if (!location.trim()) throw new Error("Location is required");
      if (!applicationType.trim()) throw new Error("Application type is required");
      if (!year) throw new Error("Year is required");
      if (!projectLink.trim()) throw new Error("Project link is required");
      if (!logo) throw new Error("Logo is required");

      const logoUrl = await uploadFile(logo, "logo");

      const { error: insertError } = await supabase.from("projects").insert({
        title,
        description,
        location,
        application_type: applicationType,
        year,
        tools,
        project_link: projectLink,
        logo: logoUrl,
      });

      if (insertError) throw insertError;

      toast.success("Project created successfully!");
      resetForm();
      onClose();
      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
                placeholder="Enter project title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Link *
              </label>
              <input
                type="url"
                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
                placeholder="https://example.com"
                value={projectLink}
                onChange={(e) => setProjectLink(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
                placeholder="e.g. San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Application Type *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
                placeholder="e.g. Web App, Mobile App"
                value={applicationType}
                onChange={(e) => setApplicationType(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all resize-none"
              placeholder="Brief description of the project"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Year *
            </label>
            <select
              className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tools / Tech Stack *
            </label>
            {tools.map((tool, index) => (
              <div key={index} className="flex gap-3 mb-3">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#C66140] focus:border-transparent transition-all"
                  placeholder="e.g. React, Node.js, MongoDB"
                  value={tool}
                  onChange={(e) => handleToolChange(index, e.target.value)}
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
              {logo && <p className="text-sm text-gray-600 mt-2">{logo.name}</p>}
            </div>
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
              type="submit"
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
        </form>
      </div>
    </div>
  );
}