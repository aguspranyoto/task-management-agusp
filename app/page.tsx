import AddTaskButton from "@/components/AddTaskButton";
import TaskList from "@/components/TaskList";
import TaskStats from "@/components/TaskStats";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="">
      <div className="max-w-5xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Task Management
          </h1>
          <p className="text-gray-600">Organize your tasks efficiently</p>
        </header>
        <TaskStats /> {/* show list of tasks */}
        <div className="space-y-6">
          <AddTaskButton />

          <Suspense
            fallback={
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading tasks...</p>
              </div>
            }
          >
            <TaskList />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
