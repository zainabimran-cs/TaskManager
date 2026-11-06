export default function TaskFilter({ filter, setFilter }) {
  return (
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
  )
}
