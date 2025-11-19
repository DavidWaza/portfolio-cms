import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { getSupabase } from "@/config/supabaseClient";
import { ProjectProps } from "@/lib/types";

type EditProjectModalProps = {
  isOpen: boolean;
  project: ProjectProps | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditProjectModal({
  isOpen,
  project,
  onClose,
  onSuccess,
}: EditProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [applicationType, setApplicationType] = useState("");
  const [year, setYear] = useState<string>("");
  const [tools, setTools] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  const supabase = getSupabase();

  const years = Array.from(
    { length: new Date().getFullYear() - 1970 + 1 },
    (_, i) => 1970 + i
  ).reverse();

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setLocation(project.location);
      setApplicationType(project.application_type);
      setYear(project.year);
      setProjectLink(project.project_link);

      try {
        setTools(
          typeof project.tools === "string"
            ? JSON.parse(project.tools)
            : project.tools
        );
      } catch {
        setTools([""]);
      }
    }
  }, [project]);

  const addToolField = () => setTools([...tools, ""]);
  
  const removeTool = (index: number) =>
    setTools(tools.filter((_, i) => i !== index));

  const handleToolChange = (index: number, value: string) => {
    const updated = [...tools];
    updated[index] = value;
    setTools(updated);
  };

  const handleUpdate = async () => {
    if (!project) return;
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from("projects")
        .update({
          title,
          description,
          location,
          application_type: applicationType,
          year,
          project_link: projectLink,
          tools,
        })
        .eq("id", project.id);

      if (error) throw error;

      toast.success("Project updated successfully!");
      onClose();
      onSuccess();
    } catch (err) {
      toast.error("Failed to update project");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !project) return null;

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
                Project Title *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
              className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
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
              className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                  className="flex-1 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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