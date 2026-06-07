import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { createItem } from "../services/api";

interface Props {
  onCreated: () => void;
}

export default function CreateItemForm({
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    await createItem(title, description);

    setTitle("");
    setDescription("");

    onCreated();
  };

  return (
    <Card
      bg="dark"
      text="light"
      className="border-secondary"
    >
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              placeholder="Titel"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              placeholder="Beskrivning"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </Form.Group>

          <Button type="submit">
            Skapa kategori
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}