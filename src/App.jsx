
import { Routes, Route, useLocation } from 'react-router-dom';
import ProductList from './Components/Prodectlist';
import ProductForm from './Components/Addprs';
import CustomerOrderList from './Components/Order';
import LoginPage from './Components/login';
import Sidebar from './Components/SideBar';

import './App.css'; 
import Category from './Components/Category';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="app-container">
    
      {!isLoginPage && <Sidebar />}
      
      <main className={`main-content ${!isLoginPage ? 'with-sidebar' : ''}`}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/productlist" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<ProductForm />} />
          <Route path="/order" element={<CustomerOrderList />} />
           <Route path="/category" element={<Category />} />
         
        </Routes>
      </main>
    </div>
  );
}

export default App;