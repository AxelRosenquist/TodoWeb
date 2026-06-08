import { useState } from "react";
import {
  Card,
  Badge,
  Button,
  ProgressBar,
  Form,
  InputGroup,
} from "react-bootstrap";
import type { Item, Task } from "../types/models";
import {
  createTask,
  updateItem,
  updateTask,
  deleteItem,
  deleteTask,
} from "../services/api";

interface Props {
  item: Item;
  onUpdated: () => void;
}

export default function ItemCard({ item, onUpdated }: Props) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const [editingItem, setEditingItem] = useState(false);
  const [itemTitle, setItemTitle] = useState(item.title);
  const [itemDescription, setItemDescription] = useState(item.description);

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");

  const tasks = item.tasks ?? [];

  const completedTasks = tasks.filter((task) => task.is_completed).length;

  const progress =
    tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const handleAddTask = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!taskTitle.trim()) return;

    await createTask(taskTitle, item.id, taskDescription);

    setTaskTitle("");
    setTaskDescription("");
    onUpdated();
  };

  const handleUpdateItem = async () => {
    await updateItem(item.id, itemTitle, itemDescription);
    setEditingItem(false);
    onUpdated();
  };

  const handleDeleteItem = async () => {
    await deleteItem(item.id);
    onUpdated();
  };

  const handleToggleTask = async (task: Task) => {
    await updateTask(
      task.id,
      task.title,
      task.description,
    );

    onUpdated();
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description ?? "");
  };

  const handleUpdateTask = async (task: Task) => {
    await updateTask(
      task.id,
      editTaskTitle,
      editTaskDescription,
    );

    setEditingTaskId(null);
    onUpdated();
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    onUpdated();
  };

  return (
    <Card bg="dark" text="light" className="border-secondary shadow-lg">
      <Card.Body>
        <div className="d-flex justify-content-between gap-3">
          <div className="w-100">
            {editingItem ? (
              <>
                <Form.Control
                  className="mb-2"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                />

                <Form.Control
                  className="mb-2"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                />

                <Button
                  size="sm"
                  variant="success"
                  className="me-2"
                  onClick={handleUpdateItem}
                >
                  Spara
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditingItem(false)}
                >
                  Avbryt
                </Button>
              </>
            ) : (
              <>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text className="text-secondary">
                  {item.description}
                </Card.Text>
              </>
            )}
          </div>

          <Badge
            bg={item.is_completed ? "success" : "warning"}
            className="h-25"
          >
            {item.is_completed ? "Klar" : "Aktiv"}
          </Badge>
        </div>

        {!editingItem && (
          <div className="mb-3">
            <Button
              size="sm"
              variant="outline-light"
              className="me-2"
              onClick={() => setEditingItem(true)}
            >
              Redigera
            </Button>

            <Button
              size="sm"
              variant="outline-danger"
              onClick={handleDeleteItem}
            >
              Ta bort
            </Button>
          </div>
        )}

        <ProgressBar
          now={progress}
          label={`${Math.round(progress)}%`}
          className="mb-3"
        />

        <div className="list-group mb-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="list-group-item bg-dark text-light border-secondary"
            >
              {editingTaskId === task.id ? (
                <>
                  <Form.Control
                    className="mb-2"
                    value={editTaskTitle}
                    onChange={(e) => setEditTaskTitle(e.target.value)}
                  />

                  <Form.Control
                    className="mb-2"
                    value={editTaskDescription}
                    onChange={(e) =>
                      setEditTaskDescription(e.target.value)
                    }
                  />

                  <Button
                    size="sm"
                    variant="success"
                    className="me-2"
                    onClick={() => handleUpdateTask(task)}
                  >
                    Spara
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditingTaskId(null)}
                  >
                    Avbryt
                  </Button>
                </>
              ) : (
                <div className="d-flex justify-content-between gap-3">
                  <div>
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      className="me-2"
                      onChange={() => handleToggleTask(task)}
                    />

                    <strong
                      className={
                        task.is_completed
                          ? "text-decoration-line-through"
                          : ""
                      }
                    >
                      {task.title}
                    </strong>

                    <p className="text-secondary mb-0 ms-4">
                      {task.description}
                    </p>
                  </div>

                  <div>
                    <Button
                      size="sm"
                      variant="outline-light"
                      className="me-2"
                      onClick={() => startEditingTask(task)}
                    >
                      Redigera
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Ta bort
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Form onSubmit={handleAddTask}>
          <InputGroup className="mb-2">
            <Form.Control
              placeholder="Ny uppgift..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Form.Control
              placeholder="Beskrivning..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />

            <Button type="submit" variant="outline-primary">
              Lägg till
            </Button>
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
  );
}