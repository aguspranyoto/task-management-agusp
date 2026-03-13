"use client";

import { deleteTask } from "@/app/actions";
import { useState } from "react";
import TaskForm from "./TaskForm";
import { Pencil, Trash2, Loader2 } from "lucide-react";

type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
};

type TaskItemProps = {
  task: Task;
};

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export default function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this task?")) {
      setIsDeleting(true);
      await deleteTask(task.id);
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Edit Task</h3>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
        <TaskForm task={task} onSuccess={() => setIsEditing(false)} />
      </div>
    );
  }

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-md border border-gray-200 transition-opacity ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2 gap-4">
            <h3
              className={`font-bold truncate ${
                task.completed ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full uppercase shrink-0 ${
                priorityColors[task.priority as keyof typeof priorityColors]
              }`}
            >
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Created:{" "}
              {new Date(task.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                title="Edit task"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                title="Delete task"
              >
                {isDeleting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
