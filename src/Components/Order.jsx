
import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Card,
  Container,
  Form,
  Button,
  Badge,
  Spinner,
  Collapse
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert";

const CustomerOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://furniture-backend-yvpo.onrender.com/api/auth/getallorder"
        ); // adjust URL
        setOrders(response.data.orders);
      } catch (err) {
        setError("Failed to load orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      const matchesSearch =
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchTerm) ||
        order.shippingAddress.phone.includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const getStatusVariant = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Shipped":
        return "info";
      case "Processing":
        return "warning";
      case "Cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }


 const handleStatusChange = async (orderId, newStatus) => {
  try {
    // Show confirmation before update
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to change the order status to "${newStatus}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (!confirm.isConfirmed) return; // Stop if user cancelled

    // Send API request
    const res = await axios.put(
      `https://furniture-backend-yvpo.onrender.com/api/auth/updateorderstatus/${orderId}`,
      { status: newStatus }
    );

    // Update UI instantly
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );

    // Show success alert
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: `Order status changed to "${newStatus}".`,
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    Swal.fire({
      icon: "error",
      title: "Failed!",
      text: "Could not update order status. Please try again.",
    });
  }
};



  return (
    // <Container fluid className="py-4">
   <Container fluid className="py-4">
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h4 className="fw-semibold mb-0">All Customer Orders</h4>
            <small className="text-muted">
              Complete order history with customer details
            </small>
          </div>
        </Card.Header>

        <Card.Body>
          {/* Filters */}
          <div className="d-flex flex-wrap gap-3 mb-4">
            <Form.Control
              type="text"
              placeholder="Search by name, email, phone, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: "350px" }}
            />
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: "180px" }}
            >
              <option value="All">All Statuses</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
          </div>

          {/* Orders Table */}
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th></th>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <React.Fragment key={order._id}>
                      <tr
                        className="border-bottom"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order._id ? null : order._id
                          )
                        }
                      >
                        <td style={{ width: "50px" }}>
                          <Button
                            variant="light"
                            size="sm"
                            className="rounded-circle"
                          >
                            {expandedOrder === order._id ? "−" : "+"}
                          </Button>
                        </td>
                        <td>{index + 1}</td>
                        <td className="fw-semibold text-primary">
                          #{order.orderId}
                        </td>
                        <td>
                          <div className="fw-medium">{order.user.name}</div>
                          <div className="text-muted small">
                            {order.user.email}
                          </div>
                        </td>
                        <td>
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </td>
                        <td className="fw-bold text-success">
                          ₹{order.totalAmount.toFixed(2)}
                        </td>
                        <td>
                          <Form.Select
                            size="sm"
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            style={{
                              width: "130px",
                              background: "#f8f9fa",
                              borderRadius: "8px",
                            }}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </Form.Select>
                        </td>
                      </tr>

                      {/* Expanded Product Row */}
                      <tr>
                        <td colSpan={7} className="p-0 border-0">
                          <Collapse in={expandedOrder === order._id}>
                            <div className="bg-light px-4 py-3">
                              <h6 className="fw-semibold mb-3 text-secondary">
                                Products
                              </h6>
                              <div className="table-responsive">
                                <Table
                                  size="sm"
                                  bordered
                                  className="mb-0 bg-white rounded shadow-sm"
                                >
                                  <thead className="table-light">
                                    <tr>
                                      <th>#</th>
                                      <th>Product Name</th>
                                      <th>Qty</th>
                                      <th>Price</th>
                                      <th>Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((item, i) => (
                                      <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{item.productName}</td>
                                        <td>{item.quantity}</td>
                                        <td>₹{item.price}</td>
                                        <td>
                                          ₹{(item.price * item.quantity).toFixed(
                                            2
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          </Collapse>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
    
  );
};

export default CustomerOrderList;
