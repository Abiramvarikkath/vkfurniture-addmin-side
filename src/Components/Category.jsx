import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  Badge,
  Card,
  Container,
  Spinner,
} from "react-bootstrap";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3019/api/auth/getcategory");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Handle Add/Edit Modal Open
  const handleShowModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "", isActive: true });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Save (Add or Update)
  const handleSave = async (e) => {
    e.preventDefault();
    const method = editingCategory ? "PUT" : "POST";
    const url = editingCategory
      ? `http://localhost:3019/api/auth/category/${editingCategory._id}`
      : "http://localhost:3019/api/auth/addcategory";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchCategories();
        handleCloseModal();
      } else {
        const data = await res.json();
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  // ✅ Delete Category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`http://localhost:3019/api/auth/category/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  if (loading)
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h4 className="fw-semibold mb-0">Category Management</h4>
            <small className="text-muted">
              Manage all product categories and their status
            </small>
          </div>
          <Button variant="primary" onClick={() => handleShowModal()}>
            + Add Category
          </Button>
        </Card.Header>

        <Card.Body>
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((cat, i) => (
                    <tr key={cat._id} className="border-bottom">
                      <td>{i + 1}</td>
                      <td className="fw-medium">{cat.name}</td>
                      <td className="text-muted">{cat.description}</td>
                      <td>
                        {cat.isActive ? (
                          <Badge bg="success">Active</Badge>
                        ) : (
                          <Badge bg="secondary">Inactive</Badge>
                        )}
                      </td>
                      <td className="text-end">
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleShowModal(cat)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(cat._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* ✅ Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? "Edit Category" : "Add Category"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Active"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingCategory ? "Update" : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Category;
