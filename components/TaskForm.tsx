"use client";

import { createTask, updateTask } from "@/app/actions";
import { useState } from "react";

type TaskFormProps = {
  task?: {
    id: number;
    title: string;
    description: string | null;
    priority: string;
  };
  onSuccess?: () => void;
};

export default function TaskForm({ task, onSuccess }: TaskFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!task;

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsSubmitting(true);

    try {
      const result = isEditing
        ? await updateTask(task.id, formData)
        : await createTask(formData);

      if (result.error) {
        setError(result.error);
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={task?.title || ""}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={task?.description || ""}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task description (optional)"
        />
      </div>

      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          defaultValue={task?.priority || "medium"}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? "Saving..." : isEditing ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}
