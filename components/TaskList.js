import TaskItem from "./TaskItem";

export default function TaskList({ tasks, ...itemProps }) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-400">
        No tasks found.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={String(task._id)} task={task} {...itemProps} />
      ))}
    </div>
  );
}