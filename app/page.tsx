import AddTaskButton from "@/components/AddTaskButton";
import TaskList from "@/components/TaskList";
import TaskStats from "@/components/TaskStats";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AuthForm from "@/components/AuthForm";
import SignoutButton from "@/components/SignoutButton";

export default async function Home() {
  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Error getting session during Server Components render:", error);
    const digest = (error as any)?.digest ?? "unknown";
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold text-red-700">Server render error</h1>
        <p className="mt-2 text-gray-700">An error occurred while rendering the page.</p>
        <p className="mt-4 text-sm text-gray-500">Error digest: {digest}</p>
      </main>
    );
  }

  if (!session) {
    return <AuthForm />;
  }

  return (
    <main className="">
      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Task Management
            </h1>
            <p className="text-gray-600">Welcome, {session.user.name}</p>
          </div>
          <div>
            <SignoutButton />
          </div>
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
            {/**
             * Call the async server component directly and catch errors so
             * we can log the underlying error and show the digest in UI.
             */}
            {await (async () => {
              try {
                return await TaskList();
              } catch (error) {
                console.error("Error rendering TaskList (Server Component):", error);
                const digest = (error as any)?.digest ?? "unknown";
                return (
                  <div className="text-center py-12">
                    <p className="text-red-600">Failed to load tasks.</p>
                    <p className="text-sm text-gray-500 mt-2">Error digest: {digest}</p>
                  </div>
                );
              }
            })()}
          </Suspense>
        </div>
      </div>
    </main>
  );
}
