"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSupabase } from "@/config/supabaseClient";
import { Plus, Layers, FileText } from "lucide-react";
import { WorkExpProps } from "@/lib/types";
import EditProjectModal from "../components/ProjectComp/EditProjectModal";
import ExpTable from "../components/Experience/ExpTable";
import CreateExpModal from "../components/Experience/CreateExpModal";
import ViewExpModal from "../components/Experience/ViewExpModal";
import EditExpModal from "../components/Experience/EditExpModal";

export default function ExperiencePage() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExp, setSelectedExp] = useState<WorkExpProps | null>(null);
  const [rows, setRows] = useState<WorkExpProps[]>([]);
  const [fetching, setFetching] = useState(false);

  const supabase = getSupabase();

  const fetchExp = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from("work_experiences")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setRows(data || []);
    } catch (err) {
      toast.error("Failed to fetch work experiences");
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchExp();
  }, []);

  const openEditModal = (exp: WorkExpProps) => {
    setSelectedExp(exp);
    setShowEditModal(true);
  };

  const openViewModal = (exp: WorkExpProps) => {
    setSelectedExp(exp);
    setShowViewModal(true);
  };

  const deleteExp = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from("work_experiences")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete project");
    } else {
      toast.success("Project deleted successfully");
      fetchExp();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Work Experience Management
          </h1>
          <p className="text-gray-600">
            Manage your portfolio work experiences
          </p>
        </div>

        {/* Stats  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Work Exp.</p>
                <p className="text-3xl font-bold text-gray-900">
                  {rows.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Project Records
            </h2>

            <div className="flex gap-3">
              <button
                onClick={fetchExp}
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
                <Plus className="w-5 h-5" /> Create Experience
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
                <p className="text-gray-500 text-lg mb-2">
                  No work_experiences found
                </p>
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
              <ExpTable
                rows={rows}
                onView={openViewModal}
                onEdit={openEditModal}
                onDelete={deleteExp}
              />
            )}
          </div>
        </div>
        <CreateExpModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchExp}
        />

        <ViewExpModal
          isOpen={showViewModal}
          service={selectedExp}
          onClose={() => setShowViewModal(false)}
        />

        <EditExpModal
          isOpen={showEditModal}
          exp={selectedExp}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchExp}
        />
      </div>
    </div>
  );
}
