"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type TaskFormData = {
  title: string;
  description?: string;
  priority: string;
};

// Create a new task
export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;

  if (!title || title.trim() === "") {
    return { error: "Title is required" };
  }

  try {
    await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || "medium",
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { error: "Failed to create task" };
  }
}

export async function getTasks(priority?: string) {
  try {
    const where = priority && priority !== "all" ? { priority } : {};

    const tasks = await prisma.task.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });
    return tasks;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return [];
  }
}

// Toggle task completion status
export async function toggleTaskComplete(id: number) {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return { error: "Task not found" };
    }

    await prisma.task.update({
      where: { id },
      data: {
        completed: !task.completed,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle task:", error);
    return { error: "Failed to toggle task" };
  }
}

// Update a task status
export async function updateTaskStatus(id: number, status: string) {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return { error: "Task not found" };
    }

    // Still sync `completed` just to not break anything relying on it.
    const completed = status === "completed";

    await prisma.task.update({
      where: { id },
      data: {
        status,
        completed,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { error: "Failed to update status" };
  }
}

// Update a task
export async function updateTask(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;

  if (!title || title.trim() === "") {
    return { error: "Title is required" };
  }

  try {
    await prisma.task.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || "medium",
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update task:", error);
    return { error: "Failed to update task" };
  }
}

// Delete a task
export async function deleteTask(id: number) {
  try {
    await prisma.task.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { error: "Failed to delete task" };
  }
}
