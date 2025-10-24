import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Card, Container, Alert, Row, Col } from 'react-bootstrap';
import './LoginPage.css'; 
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
const navigate = useNavigate();

 const handleSubmit = (event) => {
  const form = event.currentTarget;
  event.preventDefault();

  if (form.checkValidity() === false) {
    event.stopPropagation();
    setValidated(true);
    return;
  }

  setValidated(false);

  // Replace with your actual login API check later
  if (email === "admin@gmail.com" && password === "123") {
    console.log("Login successful!");
    setError("");
    navigate("/productlist"); // ✅ Navigate to product details
  } else {
    setError("Invalid email or password");
  }
};


  const handleGoogleLogin = () => {
    alert('Google login clicked!');
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 bg-beige">
      <Card className="login-card shadow-sm p-4 p-md-5" style={{ width: '100%', maxWidth: '420px' }}>
        <Card.Body>
          <h2 className="text-center mb-4 fw-bold text-brown">Login</h2>

          {error && <Alert variant="danger" className="text-center">{error}</Alert>}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label className="fw-medium text-muted">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Type your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label className="fw-medium text-muted">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Type your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a password
              </Form.Control.Feedback>
            </Form.Group>

            {/* Remember Me & Forgot Password */}
            <Row className="align-items-center mb-4">
              <Col xs="auto">
                <Form.Check
                  type="checkbox"
                  id="remember"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="text-muted"
                />
              </Col>
              <Col className="text-end">
                <a href="/forgot-password" className="text-decoration-none text-brown fw-medium">
                  Forgot password?
                </a>
              </Col>
            </Row>

            <Button variant="brown" className="w-100 py-2 mb-3" type="submit">
              Log in
            </Button>
          </Form>

          {/* Divider "Or" */}
          <div className="text-center my-3 position-relative">
            <span className="bg-white px-3 text-muted small">Or</span>
          </div>

          {/* Sign in with Google */}
         
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;