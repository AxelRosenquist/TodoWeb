import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import type { Item } from "./types/models";
import { getItems } from "./services/api";
import ItemCard from "./components/ItemCard";
import CreateItemForm from "./components/CreateItemForm";

function App() {
  const [items, setItems] = useState<Item[]>([]);

  const loadItems = async () => {
    const data = await getItems();

    setItems(data);
    console.debug(data);
};

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div
      className="min-vh-100 text-light"
      style={{
        backgroundColor: "#0f172a",
      }}
    >
      <Container className="py-5">
        <h1 className="display-4 fw-bold mb-4">
          Göra på huset
        </h1>

        <CreateItemForm onCreated={loadItems} />

        <Row className="g-4 mt-2">
          {items.map((item) => (
            <Col md={6} key={item.id}>
              <ItemCard
                item={item}
                onUpdated={loadItems}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default App;