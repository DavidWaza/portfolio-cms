"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSupabase } from "@/config/supabaseClient";
import Image from "next/image";
import { Plus, X, Trash2, Layers } from "lucide-react";
// import ProjectTable from "../components/ProjectTableProps";
import { ProjectProps, ServiceProps } from "@/lib/types";
// import ServiceTable from "../components/ServiceTable";
// import CreateProjectModal from "../components/CreateProjectModal";
// import ViewProjectModal from "../components/ViewProjectModal";
import EditProjectModal from "../components/ProjectComp/EditProjectModal";
import ServiceTable from "../components/ServiceComp/ServiceTable";
import ViewServiceModal from "../components/ServiceComp/ViewServiceModal";
import EditServiceModal from "../components/ServiceComp/EditServiceModal";
import CreateServiceModal from "../components/ServiceComp/CreateServiceModal";

export default function ServicePage() {
  const [title, setTitle] = useState("");
  const [description, setShortDescription] = useState("");
  const [roles, setRoles] = useState([""]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [rows, setRows] = useState<ServiceProps[]>([]);
  const [fetching, setFetching] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ServiceProps | null>(
    null
  );
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);

  const supabase = getSupabase();

  // Add new roless
  const addNewRoles = () => setRoles([...roles, ""]);
  const removeRoleField = (index: number) =>
    setRoles(roles.filter((_, i) => i !== index));

  // Handle roles value
  const handleRoleChange = (index: number, value: string) => {
    const updated = [...roles];
    updated[index] = value;
    setRoles(updated);
  };
  const fetchServices = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch services");
    } else {
      setRows(data || []);
    }
    setFetching(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const deleteProject = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );
    if (!confirmed) return;

    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete service");
    } else {
      toast.success("Service deleted successfully");
      fetchServices();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!title.trim()) throw new Error("Title is required");
      if (!description.trim()) throw new Error("Short description required");
      if (!roles) throw new Error("Role/Roles required");

      const { error: insertError } = await supabase.from("services").insert({
        title,
        description,
        roles,
      });

      if (insertError) throw insertError;

      toast.success("Project created successfully!");

      setTitle("");
      setShortDescription("");
      setRoles([]);
      setShowModal(false);

      fetchServices();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (service: ServiceProps) => {
    setSelectedProject(service);
    setShowEditModal(true);
  };

  const openViewModal = (service: ServiceProps) => {
    setSelectedProject(service);
    setShowViewModal(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Service Management
          </h1>
          <p className="text-gray-600">Manage your portfolio services</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Service Records
            </h2>

            <div className="flex gap-3">
              <button
                onClick={fetchServices}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                {/* refresh icon */}
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
                <Plus className="w-5 h-5" /> Create Project
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
                <p className="text-gray-500 text-lg mb-2">No projects found</p>
                <p className="text-gray-400 text-sm mb-6">
                  Get started by creating your first project
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2 bg-[#C66140] hover:bg-[#b5563a] text-white rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Create Project
                </button>
              </div>
            ) : (
              <ServiceTable
                rows={rows}
                onView={openViewModal}
                onEdit={openEditModal}
                onDelete={deleteProject}
                onLogoClick={setSelectedLogo}
              />
            )}
          </div>
        </div>

        <CreateServiceModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchServices}
        />
        <ViewServiceModal
          isOpen={showViewModal}
          data={selectedProject}
          onClose={() => setShowViewModal(false)}
        />

        <EditServiceModal
          isOpen={showEditModal}
          services={selectedProject}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchServices}
        />
      </div>
    </div>
  );
}
