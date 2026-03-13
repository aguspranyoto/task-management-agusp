import { prisma } from "@/lib/prisma";

export default async function TaskStats() {
  const [total, completed, highPriority] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { completed: true } }),
    prisma.task.count({ where: { priority: "high", completed: false } }),
  ]);

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        <p className="text-2xl font-bold text-gray-800">{total}</p>
        <p className="text-sm text-gray-500">Total Tasks</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
        <p className="text-sm text-gray-500">Completed</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        <p className="text-2xl font-bold text-red-600">{highPriority}</p>
        <p className="text-sm text-gray-500">High Priority</p>
      </div>
    </div>
  );
}
