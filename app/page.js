"use client";

import {
  fetchTasks,
  addTask,
  deleteTask,
  updateTask,
  editTask,
} from "../services/taskService";


import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const [input, setInput] = useState("");
  const [validationError, setValidationError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editError, setEditError] = useState("");

  const [filter, setFilter] = useState("All");

  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Active") return !task.completed;
    if (filter === "Done") return task.completed;
    return true;
  });

  const addMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setInput("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, title }) => editTask(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setEditingId(null);
      setEditTitle("");
      setEditError("");
    },
  });

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-md">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
          <p className="text-sm font-medium text-slate-600">Loading tasks...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-6">
        <p className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-600 shadow-sm">
          Failed to load tasks. Check your API.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-blue-950 px-3 py-6 sm:px-4 sm:py-10">
      <main className="mx-auto max-w-xl rounded-2xl border border-slate-100 bg-white p-6 shadow-xl sm:p-8">
        <h1 className="mb-1 bg-linear-to-r from-indigo-600 to-sky-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
          Task Manager
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Manage your daily tasks easily.
        </p>

        <form
          className="mb-2 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();

            if (!input.trim()) {
              setValidationError("Please enter a task.");
              return;
            }

            setValidationError("");
            addMutation.mutate(input.trim());
          }}
        >
          <input
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (e.target.value.trim()) {
                setValidationError("");
              }
            }}
            placeholder="Enter your task"
          />
          <button className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95">
            Add Task
          </button>
        </form>

        {validationError && (
          <p className="mb-2 text-sm font-medium text-red-600">
            {validationError}
          </p>
        )}
        {addMutation.isError && (
          <p className="mb-2 text-sm font-medium text-red-600">
            Could not add task.
          </p>
        )}

        <div className="mb-4 mt-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">My Tasks</h2>
          <span className="rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-600">
            {filteredTasks.length}
          </span>
        </div>

        <div className="mb-4 flex gap-2">
          {["All", "Active", "Done"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                filter === item
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredTasks.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-400">
            No tasks found.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={String(task._id)}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition hover:border-indigo-100 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <span
                  className={`min-w-0 flex-1 wrap-break-word text-sm ${
                    task.completed
                      ? "text-slate-400 line-through"
                      : "text-slate-700"
                  }`}
                >
                  <span
                    className={`mr-2 inline-block rounded-md px-2 py-0.5 align-middle text-xs font-semibold no-underline ${
                      task.completed
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {task.completed ? "Completed: " : "Pending: "}
                  </span>

                  {editingId === String(task._id) ? (
                    <>
                      <input
                        value={editTitle}
                        onChange={(e) => {
                          setEditTitle(e.target.value);
                          if (e.target.value.trim()) setEditError("");
                        }}
                        className="ml-2 rounded border px-2 py-1"
                      />
                      {editError && (
                        <span className="mt-1 block text-xs font-medium text-red-600 no-underline">
                          {editError}
                        </span>
                      )}
                      {editMutation.isError && (
                        <span className="mt-1 block text-xs font-medium text-red-600 no-underline">
                          Could not edit task. Please try again.
                        </span>
                      )}
                    </>
                  ) : (
                    task.title
                  )}
                </span>

                <div className="flex w-full gap-2 sm:w-auto sm:shrink-0">
                  {editingId === String(task._id) ? (
                    <>
                      <button
                        type="button"
                        className="flex-1 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white sm:flex-none"
                        onClick={() => {
                          if (!editTitle.trim()) {
                            setEditError("Task title cannot be empty.");
                            return;
                          }

                          setEditError("");
                          editMutation.mutate({
                            id: String(task._id),
                            title: editTitle.trim(),
                          });
                        }}
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        className="flex-1 rounded-lg bg-gray-500 px-3 py-1.5 text-xs font-semibold text-white sm:flex-none"
                        onClick={() => {
                          setEditingId(null);
                          setEditTitle("");
                          setEditError("");
                          editMutation.reset();
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="flex-1 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white sm:flex-none"
                        onClick={() => {
                          setEditingId(String(task._id));
                          setEditTitle(task.title);
                          setEditError("");
                          editMutation.reset();
                        }}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="flex-1 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white sm:flex-none"
                        onClick={() => updateMutation.mutate(task)}
                      >
                        {task.completed ? "Undo" : "Complete"}
                      </button>

                      <button
                        type="button"
                        className="flex-1 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white sm:flex-none"
                        onClick={() => deleteMutation.mutate(String(task._id))}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// "use client";

// import { useState } from "react";

// export default function Home() {
//   const [tasks, setTasks] = useState([
//     { id: 1, title: "Learn Next.js", completed: false },
//     { id: 2, title: "Practice React", completed: false },
//     { id: 3, title: "Complete assignment", completed: false }
//   ]);

//   const [input, setInput] = useState("");
//   const [filter, setFilter] = useState("All");

//   function addTask() {
//     if (input.trim() === "") {
//       return;
//     }

//     const newTask = {
//       id: Date.now(),
//       title: input,
//       completed: false
//     };

//     setTasks([...tasks, newTask]);
//     setInput("");
//   }

//   function toggleTask(id) {
//     setTasks(
//       tasks.map((task) =>
//         task.id === id
//           ? { ...task, completed: !task.completed }
//           : task
//       )
//     );
//   }

//   function deleteTask(id) {
//     setTasks(tasks.filter((task) => task.id !== id));
//   }

//   const filteredTasks = tasks.filter((task) => {
//     if (filter === "Active") {
//       return !task.completed;
//     }

//     if (filter === "Done") {
//       return task.completed;
//     }

//     return true;
//   });

//   return (
//     <div>
//       <h1>Task Manager</h1>
//       <p>Manage your daily tasks easily.</p>

//       <input
//         type="text"
//         placeholder="Enter your task"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />

//       <button onClick={addTask}>Add Task</button>

//       <h2>My Tasks</h2>
      
// <div>
//   <button onClick={() => setFilter("All")}>All</button>
//   <button onClick={() => setFilter("Active")}>Active</button>
//   <button onClick={() => setFilter("Done")}>Done</button>
// </div>


//       {filteredTasks.map((task) => (
//         <div key={task.id}>
//           <span>
//             {task.completed ? "Completed: " : "Pending: "}
//             {task.title}
//           </span>

//           <button onClick={() => toggleTask(task.id)}>
//             {task.completed ? "Undo" : "Complete"}
//           </button>

//           <button onClick={() => deleteTask(task.id)}>
//             Delete
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }
