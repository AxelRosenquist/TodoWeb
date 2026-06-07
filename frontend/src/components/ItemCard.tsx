import { useState } from "react";
import { Card, Badge, Button, ProgressBar, Form, InputGroup } from "react-bootstrap";
import type { Item } from "../types/models";
import { createTask } from "../services/api";

interface Props {
  item: Item;
  onUpdated: () => void;
}

export default function ItemCard({ item, onUpdated }: Props) {
  const [taskTitle, setTaskTitle] = useState("");

  const tasks = item.tasks ?? [];

  const completedTasks = tasks.filter((task) => task.is_completed).length;

  const progress =
    tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const handleAddTask = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!taskTitle.trim()) return;
    await createTask(taskTitle, item.id);

    setTaskTitle("");
    onUpdated();
  };

  return (
    <Card bg="dark" text="light" className="border-secondary shadow-lg">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <Card.Title>{item.title}</Card.Title>

          <Badge bg={item.is_completed ? "success" : "warning"}>
            {item.is_completed ? "Klar" : "Aktiv"}
          </Badge>
        </div>

        <Card.Text className="text-secondary">{item.description}</Card.Text>

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
              <input
                type="checkbox"
                checked={task.is_completed}
                className="me-2"
                readOnly
              />
              {task.title}
            </div>
          ))}
        </div>

        <Form onSubmit={handleAddTask}>
          <InputGroup>
            <Form.Control
              placeholder="Ny uppgift..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />

            <Button type="submit" variant="outline-primary">
              Lägg till Uppgift
            </Button>
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
  );
}