import React from "react";
import { Calendar, MapPin, Code, Layers } from "lucide-react";
import { ProjectProps } from "@/lib/types";

type StatsCardsProps = {
  rows: ProjectProps[];
};

export default function StatsCards({ rows }: StatsCardsProps) {
  const totalProjects = rows.length;
  
  const latestYear = rows.length > 0
    ? Math.max(...rows.map((r) => parseInt(r.year) || 0))
    : 0;

  const totalTechnologies = rows.reduce((acc, row) => {
    try {
      const t = typeof row.tools === "string" ? JSON.parse(row.tools) : row.tools;
      return acc + (Array.isArray(t) ? t.length : 0);
    } catch {
      return acc;
    }
  }, 0);

  const uniqueLocations = new Set(rows.map((r) => r.location)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Projects</p>
            <p className="text-3xl font-bold text-gray-900">{totalProjects}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Layers className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Latest Year</p>
            <p className="text-3xl font-bold text-gray-900">
              {latestYear || "-"}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Technologies</p>
            <p className="text-3xl font-bold text-gray-900">{totalTechnologies}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <Code className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Locations</p>
            <p className="text-3xl font-bold text-gray-900">{uniqueLocations}</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <MapPin className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}