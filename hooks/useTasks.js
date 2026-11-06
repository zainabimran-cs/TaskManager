import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchTasks,
    addTask,
    deleteTask,
    updateTask,
    editTask,
} from "../services/taskService";

export  function useTasks(status) {
const [input, setInput] = useState("");
  const [validationError, setValidationError] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editError, setEditError] = useState("");

    const [filter, setFilter] = useState("All");

    const queryClient = useQueryClient();

    const { data: tasks = [], isLoading, isError, error } = useQuery({
        queryKey: ["tasks"],
        queryFn: fetchTasks,
        enabled: status === "authenticated",
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


    return {
     
    tasks, filteredTasks, isLoading, isError, error,

    filter, setFilter,
 
    input, setInput, validationError, setValidationError,
    
    editingId, setEditingId, editTitle, setEditTitle, editError, setEditError,
  
    addMutation, updateMutation, deleteMutation, editMutation,
    }
}

