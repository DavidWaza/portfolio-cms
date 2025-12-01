"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSupabase } from "@/config/supabaseClient";
import { Plus, Layers } from "lucide-react";
import { ProjectProps } from "@/lib/types";
import StatsCards from "../components/StatsCard";
import LogoPreviewModal from "../components/LogoPreviewModal";

import EditProjectModal from "../components/ProjectComp/EditProjectModal";
import CreateProjectModal from "../components/ProjectComp/CreateProjectModal";
import ViewProjectModal from "../components/ProjectComp/ViewProjectModal";
import ProjectTable from "../components/ProjectComp/ProjectTableProps";

export default function ProjectsPage() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectProps | null>(null);
  const [rows, setRows] = useState<ProjectProps[]>([]);
  const [fetching, setFetching] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchProjects = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setRows(data || []);
    } catch (err) {
      toast.error("Failed to fetch projects");
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openEditModal = (project: ProjectProps) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const openViewModal = (project: ProjectProps) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const deleteProject = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete project");
    } else {
      toast.success("Project deleted successfully");
      fetchProjects(); 
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Projects Management</h1>
          <p className="text-gray-600">Manage your portfolio projects</p>
        </div>

        <StatsCards rows={rows} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Project Records</h2>

            <div className="flex gap-3">
              <button
                onClick={fetchProjects}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                {/* refresh icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2 bg-[#8B5CF6] hover:bg-[#8B5CF6] text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-5 h-5" /> Create Project
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {fetching ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6]"></div>
              </div>
            ) : rows.length === 0 ? (
              <div className="text-center py-20">
                <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No projects found</p>
                <p className="text-gray-400 text-sm mb-6">Get started by creating your first project</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2 bg-[#8B5CF6] hover:bg-[#8B5CF6] text-white rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Create Project
                </button>
              </div>
            ) : (
              <ProjectTable
                rows={rows}
                onView={openViewModal}
                onEdit={openEditModal}
                onDelete={deleteProject}
                onLogoClick={setSelectedLogo}
              />
            )}
          </div>
        </div>

        <LogoPreviewModal logoUrl={selectedLogo} onClose={() => setSelectedLogo(null)} />

        <CreateProjectModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchProjects} 
        />

        <ViewProjectModal
          isOpen={showViewModal}
          project={selectedProject}
          onClose={() => setShowViewModal(false)}
        />

        <EditProjectModal
          isOpen={showEditModal}
          project={selectedProject}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchProjects}
        />
      </div>
    </div>
  );
}
