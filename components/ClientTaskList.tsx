"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import TaskItem from "./TaskItem";
import { updateTaskStatus } from "@/app/actions";

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

export default function ClientTaskList({
  initialTasks,
}: {
  initialTasks: Task[];
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update local state when initialTasks changes (e.g. from server actions)
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = parseInt(draggableId);
    const task = tasks.find((t) => t.id === taskId);

    if (!task) return;

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    if (sourceStatus !== destStatus) {
      // Optimistic update
      setTasks((currentTasks) =>
        currentTasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: destStatus,
                completed: destStatus === "completed",
              }
            : t,
        ),
      );

      // Update in DB
      await updateTaskStatus(taskId, destStatus);
    }
  };

  const pendingTasks = tasks.filter(
    (t) => t.status === "pending" || (!t.status && !t.completed),
  );
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const completedTasks = tasks.filter(
    (t) => t.status === "completed" || (!t.status && t.completed),
  );

  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Pending Column */}
        <div className="bg-gray-100 p-4 rounded-xl min-h-[500px] w-full md:w-1/3 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center justify-between">
            <span>Pending</span>
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
              {pendingTasks.length}
            </span>
          </h2>

          <Droppable droppableId="pending">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-3 min-h-[400px]"
              >
                {pendingTasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskItem task={task} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* In Progress Column */}
        <div className="bg-blue-50 p-4 rounded-xl min-h-[500px] w-full md:w-1/3 shadow-sm border border-blue-100">
          <h2 className="text-lg font-bold text-blue-800 mb-4 flex items-center justify-between">
            <span>In Progress</span>
            <span className="bg-blue-200 text-blue-900 px-2 py-1 rounded-full text-xs">
              {inProgressTasks.length}
            </span>
          </h2>

          <Droppable droppableId="in_progress">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-3 min-h-[400px]"
              >
                {inProgressTasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskItem task={task} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Completed Column */}
        <div className="bg-green-50 p-4 rounded-xl min-h-[500px] w-full md:w-1/3 shadow-sm border border-green-100">
          <h2 className="text-lg font-bold text-green-800 mb-4 flex items-center justify-between">
            <span>Completed</span>
            <span className="bg-green-200 text-green-900 px-2 py-1 rounded-full text-xs">
              {completedTasks.length}
            </span>
          </h2>

          <Droppable droppableId="completed">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-3 min-h-[400px]"
              >
                {completedTasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskItem task={task} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
}
