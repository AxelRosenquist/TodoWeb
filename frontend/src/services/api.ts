import type { Item, Task } from "../types/models";

const API_URL = "http://192.168.50.30:8000/api/v1"

export const getItems = async (): Promise<Item[]> => {
  const response = await fetch(`${API_URL}/items/all-items-with-tasks`);
  const result = await response.json();
  console.debug(result);
  return result.data.items;
};

export const createItem = async (
  title: string,
  description: string
): Promise<Item> => {
  const response = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });

  return response.json();
};


export const createTask = async (
  title: string,
  item_id: string,
  description?: string,
): Promise<Task> => {
    console.debug(JSON.stringify({
      title,
      item_id,
    }))
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      item_id,
      description,
    }),
  });

  return response.json();
};


export const updateItem = async (
  id: string,
  title?: string,
  description?: string,
): Promise<void> => {
  await fetch(`${API_URL}/items/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description }),
  });
};


export const updateTask = async (
  id: string,
  title?: string,
  description?: string,
): Promise<void> => {
  await fetch(`${API_URL}/tasks/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description }),
  });
};


export const toggleComplete = async (
  id: string,
  endpoint: "items" | "tasks",
  currentStatus: boolean,
): Promise<void> => {
  await fetch(`${API_URL}/${endpoint}/complete/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      is_completed: !currentStatus
    }),
  });
};


export const deleteItem = async (
  id: string
): Promise<void> => {
  await fetch(`${API_URL}/items/delete/${id}`, {
    method: "DELETE",
  });
};

export const deleteTask = async (
  id: string
): Promise<void> => {
  await fetch(`${API_URL}/tasks/delete/${id}`, {
    method: "DELETE",
  });
};