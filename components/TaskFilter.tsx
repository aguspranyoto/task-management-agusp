"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TaskFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("priority") || "all";

  function handleFilterChange(priority: string) {
    const params = new URLSearchParams(searchParams);
    if (priority === "all") {
      params.delete("priority");
    } else {
      params.set("priority", priority);
    }
    router.push(`/?${params.toString()}`);
  }

  const filters = ["all", "high", "medium", "low"];

  return (
    <div className="flex gap-2 justify-center">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleFilterChange(filter)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentFilter === filter
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
}
