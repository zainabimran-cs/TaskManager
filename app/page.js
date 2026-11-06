"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useTasks } from "../hooks/useTasks";
import TaskForm from "../components/TaskForm";
import TaskFilter from "../components/TaskFilter";
import TaskList from "../components/TaskList";

export default function Home() {
 const { data: session, status } = useSession();
  const {
    filteredTasks,
    isLoading,
    isError,
    error,
    filter,
    setFilter,
    input,
    setInput,
    validationError,
    setValidationError,
    editingId,
    setEditingId,
    editTitle,
    setEditTitle,
    editError,
    setEditError,
    addMutation,
    updateMutation,
    deleteMutation,
    editMutation,
  } = useTasks(status);


  
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm font-medium text-slate-600">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (status === "authenticated" && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-md">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
          <p className="text-sm font-medium text-slate-600">
            Loading tasks...
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-blue-950 px-3 py-6 sm:px-4 sm:py-10">
      <main className="mx-auto max-w-xl rounded-2xl border border-slate-100 bg-white p-6 shadow-xl sm:p-8">
        <h1 className="mb-1 bg-linear-to-r from-indigo-600 to-sky-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
          Task Manager
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Manage your daily tasks easily.
        </p>

        {isError && (
          <p className="mb-4 text-sm font-medium text-red-600">{error.message}</p>
        )}

        <div className="mb-6">
          {session ? (
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Sign Out ({session.user.name})
            </button>
          ) : (
            <button
              type="button"
              onClick={() => signIn("github")}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Sign In with GitHub
            </button>
          )}
        </div>

        <TaskForm
          input={input}
          setInput={setInput}
          validationError={validationError}
          setValidationError={setValidationError}
          addMutation={addMutation}
        />

        <div className="mb-4 mt-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">My Tasks</h2>
          <span className="rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-600">
            {filteredTasks.length}
          </span>
        </div>

        {deleteMutation.isError && (
          <p className="font-medium text-red-600 mb-2 text-sm">
            {deleteMutation.error.message}
          </p>
        )}
        {updateMutation.isError && (
          <p className="font-medium text-red-600 mb-2 text-sm">
            {updateMutation.error.message}
          </p>
        )}

        <TaskFilter filter={filter} setFilter={setFilter} />

        <TaskList
          tasks={filteredTasks}
          editingId={editingId}
          setEditingId={setEditingId}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          editError={editError}
          setEditError={setEditError}
          editMutation={editMutation}
          updateMutation={updateMutation}
          deleteMutation={deleteMutation}
        />
      </main>
    </div>
  );
}