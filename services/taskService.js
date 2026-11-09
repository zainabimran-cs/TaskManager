async function handleError(res, fallback) {
  const data = await res.json().catch(()=>null);
  throw new Error(data?.error || fallback);
}

export async function fetchTasks() {
  const res = await fetch("/api/tasks");

  if(!res.ok){
    await handleError(res, "Failed to load tasks");
  }

  return res.json();
}

export async function addTask(title) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
  await handleError(res, "Failed to add task");
  }

  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    await handleError(res, "Failed to delete task");
  }
}

export async function updateTask(task) {
  const res = await fetch(`/api/tasks/${task._id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !task.completed }),
  });

  if (!res.ok){
    await handleError(res, "Failed to update task"); 
  }
  return res.json();
}

export async function editTask(id, title) {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
   await handleError(res, "Failed to edit task");
  }

  return res.json();
}