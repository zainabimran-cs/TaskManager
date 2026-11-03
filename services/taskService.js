export async function fetchTasks() {
  const res = await fetch("/api/tasks");

  // if (!res.ok) {
  //   throw new Error("Failed to fetch tasks");
  // }

  if(!res.ok){
    const error = await res.json();
    throw new Error(error.error);
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
   const error = await res.json();
   throw new Error(error.error);
  }

  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error);
  }
}

export async function updateTask(task) {
  const res = await fetch(`/api/tasks/${task._id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !task.completed }),
  });

  if (!res.ok){
    const error = await res.json();
    throw new Error(error.error); 
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
    const error =await res.json();
    throw new Error(error.error);
  }

  return res.json();
}