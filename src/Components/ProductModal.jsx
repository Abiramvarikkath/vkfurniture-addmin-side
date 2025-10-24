import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

const ProductModal = ({ show, handleClose, productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productId) {
      setLoading(true);
      axios
        .get(`http://localhost:3019/api/auth/product/${productId}`)
        .then((res) => {
          setProduct(res.data.product);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to fetch product details');
          setLoading(false);
        });
    }
  }, [productId]);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Product Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}
        {error && <p className="text-danger">{error}</p>}
        {product && (
          <div className="d-flex flex-wrap gap-3">
            <div style={{ flex: '1 1 300px', maxWidth: '300px' }}>
              <img
                src={`http://localhost:3019${product.image}`}
                alt={product.name}
                className="img-fluid rounded"
              />
            </div>
            <div style={{ flex: '2 1 400px' }}>
              <h5>{product.name}</h5>
              <p>{product.description}</p>
              <p>
                <strong>Price:</strong> ₹{product.price}
              </p>
              <p>
                <strong>Stock:</strong>{' '}
                {product.stock > 0 ? (
                  <Badge bg="success">{product.stock}</Badge>
                ) : (
                  <Badge bg="danger">Out of Stock</Badge>
                )}
              </p>
              <p>
                <strong>Category:</strong>{' '}
                <Badge bg="info" text="dark">
                  {product.category}
                </Badge>
              </p>
              <p>
                <strong>Created By:</strong> {product.createdBy?.name || 'N/A'}
              </p>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
