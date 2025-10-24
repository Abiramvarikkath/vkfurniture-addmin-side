// Components/Sidebar.js
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
     {
      path: "/category",
      icon: "🛒",
      label: "Category",
      active: location.pathname === "/category"
    },
     {
      path: "/products/new",
      icon: "➕",
      label: "Add Product",
      active: location.pathname === "/products/new" || location.pathname.includes("/products/edit/")
    },
    {
      path: "/productlist",
      icon: "📦",
      label: "Products",
      active: location.pathname === "/productlist"
    },
   
    {
      path: "/order",
      icon: "🛒",
      label: "Orders",
      active: location.pathname === "/order"
    },
   
  ];

  return (
    <div 
      className="sidebar bg-white shadow-lg position-fixed h-100"
      style={{ 
        width: "280px", 
        zIndex: 1000,
        background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)"
      }}
    >
      {/* Sidebar Header */}
      <div className="sidebar-header text-center py-4 border-bottom">
        <div className="d-flex align-items-center justify-content-center gap-3">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center shadow"
            style={{ 
              width: "50px", 
              height: "50px", 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              fontSize: "1.5rem"
            }}
          >
            🛍️
          </div>
          <div>
            <h4 className="fw-bold mb-0 text-dark">ShopHub</h4>
            <small className="text-muted">Admin Panel</small>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="user-info p-4 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <img
            src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            alt="User"
            className="rounded-circle border"
            width="45"
            height="45"
            style={{ objectFit: "cover" }}
          />
          <div className="flex-grow-1">
            <h6 className="fw-semibold mb-0 text-dark">{user?.name || "User"}</h6>
            <small className="text-muted">{user?.email || "user@example.com"}</small>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav p-3">
        <ul className="nav nav-pills flex-column gap-2">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.path}>
              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center gap-3 py-3 px-3 rounded-3 text-decoration-none ${
                  item.active ? "active" : ""
                }`}
                style={{
                  backgroundColor: item.active ? "#764ba2" : "transparent",
                  color: item.active ? "white" : "#6c757d",
                  border: "none",
                  transition: "all 0.3s ease",
                  fontWeight: "500"
                }}
                onMouseEnter={(e) => {
                  if (!item.active) {
                    e.target.style.backgroundColor = "#f8f9fa";
                    e.target.style.color = "#764ba2";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!item.active) {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#6c757d";
                  }
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                <span className="flex-grow-1">{item.label}</span>
                {item.active && (
                  <span 
                    className="badge rounded-pill"
                    style={{ 
                      backgroundColor: "rgba(255,255,255,0.3)",
                      fontSize: "0.7rem"
                    }}
                  >
                    ●
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="sidebar-footer p-3 mt-auto border-top">
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-semibold"
          style={{ border: "2px solid" }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;