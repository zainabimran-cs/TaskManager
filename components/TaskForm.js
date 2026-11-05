export default function TaskForm({
  input,
  setInput,
  validationError,
  setValidationError,
  addMutation,
}) {
  return (
    <div>
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
         {addMutation.error.message}
          </p>
        )}
        </div>
  )
}

