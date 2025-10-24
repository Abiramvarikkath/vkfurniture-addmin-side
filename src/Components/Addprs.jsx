








import React, { useEffect, useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ✅ Fetch categories
  useEffect(() => {
    axios.get('https://furniture-backend-yvpo.onrender.com/api/auth/getcategory')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to fetch categories', err));
  }, []);

  // ✅ Fetch product if editing
  useEffect(() => {
    if (id) {
      axios.get(`https://furniture-backend-yvpo.onrender.com/api/auth/product/${id}`)
        .then(res => {
          const product = res.data.product;
          setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category?._id || '',
            stock: product.stock,
            image: null
          });
          setImagePreview(product.image ? `https://furniture-backend-yvpo.onrender.com${product.image}` : null);
        })
        .catch(err => setError('Failed to fetch product'));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData({ ...formData, image: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else setImagePreview(null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== null) data.append(key, val);
    });

    try {
      const url = id
        ? `https://furniture-backend-yvpo.onrender.com/api/auth/updateproduct/${id}`
        : 'https://furniture-backend-yvpo.onrender.com/api/auth/add';
      const method = id ? 'put' : 'post';

      const res = await axios({ method, url, data, headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(res.data.message);
      setTimeout(() => navigate('/productlist'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit product');
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h4>{id ? 'Edit Product' : 'Add New Product'}</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name *</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price *</Form.Label>
              <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map(cat => (
      <option key={cat._id} value={cat._id}>
        {cat.name} {/* Only render the category name */}
      </option>
    ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={4} name="description" value={formData.description} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock *</Form.Label>
              <Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image *</Form.Label>
              <Form.Control type="file" name="image" onChange={handleChange} accept="image/*" required={!imagePreview} />
            </Form.Group>

            {imagePreview && <div className="mb-3 text-center">
              <img src={imagePreview} alt="Preview" className="img-fluid" style={{ maxHeight: '200px' }} />
            </div>}

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">{id ? 'Update Product' : 'Add Product'}</Button>
              <Button variant="secondary" onClick={() => navigate('/productlist')}>Cancel</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductForm;
