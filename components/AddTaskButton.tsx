"use client";

import { useState } from "react";
import TaskForm from "./TaskForm";

export default function AddTaskButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors font-medium cursor-pointer"
        >
          + Add New Task
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Add New Task
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <TaskForm onSuccess={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
