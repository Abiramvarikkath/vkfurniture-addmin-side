import React, { useState, useEffect, useMemo } from 'react';
import { Table, Card, Container, Form, Button, Badge, Spinner, Collapse } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductModal from './ProductModal';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all'); 
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null); 
  const navigate = useNavigate();

  const handleView = (id) => {
    setSelectedProductId(id);
    setShowModal(true);
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3019/api/auth/getall');
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Unique categories
  const uniqueCategories = useMemo(() => {
    const cats = products.map(p => p.category).filter(Boolean);
    const uniqueMap = new Map();
    cats.forEach(cat => {
      if (!uniqueMap.has(cat._id)) uniqueMap.set(cat._id, cat);
    });
    return [{ _id: 'all', name: 'All' }, ...Array.from(uniqueMap.values())];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === 'all' || product.category?._id === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  // Sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // ✅ Delete Product
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://localhost:3019/api/auth/deleteproduct/${productId}`);
      // Refresh products list
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product.');
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading products...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <p className="text-danger">{error}</p>
        <Button onClick={fetchProducts}>Retry</Button>
      </Container>
    );
  }

  return (
    <div className="container-fluid px-3">
      <Card className="w-100 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h4 className="mb-0">Product Inventory</h4>
            <p className="text-muted mb-0">Manage your product catalog</p>
          </div>
          <Link to="/products/new">
            <Button variant="outline-secondary">+ Add</Button>
          </Link>
        </Card.Header>

        <Card.Body className="p-4">
          {/* Filters */}
          <div className="d-flex flex-wrap gap-3 mb-4">
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
            <Form.Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ width: '180px' }}
            >
              {uniqueCategories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </div>

          {/* Products Table */}
          <div className="table-responsive">
            <Table bordered hover className="align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Sl. No</th>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    Product 
                  </th>
                  <th>Image</th>
                  <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                    Price 
                  </th>
                  <th onClick={() => handleSort('stock')} style={{ cursor: 'pointer' }}>
                    Stock 
                  </th>
                  <th>Category</th>
                  <th>Edit</th>
                  <th>View</th>
                  <th>Delete</th> {/* New column */}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <React.Fragment key={product._id}>
                      <tr
                        onClick={() =>
                          setExpandedRow(expandedRow === product._id ? null : product._id)
                        }
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{index + 1}</td>
                        <td className="fw-medium text-start">{product.name}</td>
                        <td>
                          <div
                            className="border rounded d-flex align-items-center justify-content-center mx-auto"
                            style={{ width: '60px', height: '60px', overflow: 'hidden' }}
                          >
                            <img
                              src={`http://localhost:3019${product.image}`}
                              alt={product.name}
                              className="img-fluid"
                              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            />
                          </div>
                        </td>
                        <td className="fw-bold">₹{product.price?.toFixed(2)}</td>
                        <td>
                          {product.stock > 10 ? (
                            <Badge bg="success">{product.stock}</Badge>
                          ) : product.stock > 0 ? (
                            <Badge bg="warning" text="dark">
                              {product.stock}
                            </Badge>
                          ) : (
                            <Badge bg="danger">Out</Badge>
                          )}
                        </td>
                        <td>
                          <Badge bg="info" text="dark">
                            {product.category?.name || 'No category'}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            className="btn btn-sm btn-secondary text-white me-2"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/products/edit/${product._id}`);
                            }}
                          >
                            Edit
                          </Button>
                        </td>
                        <td>
                          <Button
                            className="btn btn-sm text-white me-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(product._id);
                            }}
                          >
                            View
                          </Button>
                        </td>
                        <td>
                          <Button
                            className="btn btn-sm btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(product._id);
                            }}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>

                      {/* Expandable Description */}
                      <tr>
                        <td colSpan="9" className="p-0">
                          <Collapse in={expandedRow === product._id}>
                            <div className="bg-light p-3 border-top text-start small text-muted">
                              <strong>Description:</strong>{' '}
                              {product.description || 'No description available.'}
                            </div>
                          </Collapse>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-5">
                      <div className="text-muted">No products found</div>
                      <div className="mt-2">
                        <Button
                          variant="outline-success"
                          onClick={() => {
                            setSearchTerm('');
                            setCategoryFilter('all');
                          }}
                        >
                          Clear Filters
                        </Button>
                        <Link to="/products/new" className="ms-2 btn btn-success">
                          Add First Product
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <ProductModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        productId={selectedProductId}
      />
    </div>
  );
};

export default ProductList;
