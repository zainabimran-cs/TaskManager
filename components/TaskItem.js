export default function TaskItem({
  task,
  editingId,
  setEditingId,
  editTitle,
  setEditTitle,
  editError,
  setEditError,
  editMutation,
  updateMutation,
  deleteMutation,
}) {
  const isEditing = editingId === String(task._id);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition hover:border-indigo-100 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      <span
        className={`min-w-0 flex-1 wrap-break-word text-sm ${
          task.completed ? "text-slate-400 line-through" : "text-slate-700"
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

        {isEditing ? (
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
                {editMutation.error.message}
              </span>
            )}
          </>
        ) : (
          task.title
        )}
      </span>

      <div className="flex w-full gap-2 sm:w-auto sm:shrink-0">
        {isEditing ? (
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
  );
}