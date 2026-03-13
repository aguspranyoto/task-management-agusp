import { getTasks } from "@/app/actions";
import ClientTaskList from "./ClientTaskList";

export default async function TaskList() {
  const tasks = await getTasks();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No tasks yet. Add your first task above!
        </p>
      </div>
    );
  }

  return <ClientTaskList initialTasks={tasks} />;
}
