import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./eCommerce/Login";
import Signup from "./eCommerce/Signup";
import ForgotPass from "./eCommerce/ForgotPass";
import Catagories from "./eCommerce/Catagories";
import AddProducts from "./eCommerce/AddProduct";
import ViewProducts from "./eCommerce/ViewProduct";
import EditProduct from "./eCommerce/EditProduct";
import ViewCatagory from "./eCommerce/ViewCatagory";
import Cart from "./eCommerce/Cart";
import BuyCart from "./eCommerce/BuyCart";
import Profile from "./eCommerce/Profile";
import BuyProduct from "./eCommerce/BuyProduct";
import Dashboard from "./eCommerce/Dashboards/MainDashboard";
import AdminDashboard from "./eCommerce/Dashboards/MainAdminDashboard";

import axios from "axios";

function Header() {
  function getLocallyStoredToken() {
    const token = localStorage.getItem("token");
    return "Bearer " + token;
  }

  const baseUrl = process.env.REACT_APP_API_URL;

  axios.defaults.baseURL = baseUrl;
  axios.defaults.headers["Authorization"] = getLocallyStoredToken();

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin_dashboard" element={<AdminDashboard />} />
          <Route path="/catagories" element={<Catagories />} />
          <Route path="/add_product" element={<AddProducts />} />
          <Route path="/view_product/:productId" element={<ViewProducts />} />
          <Route path="/edit_product/:productId" element={<EditProduct />} />
          <Route path="/purchase/:productId" element={<BuyProduct />} />

          <Route
            path="/view_catagory/:main_catagory/:catagory/:sub_catagory"
            element={<ViewCatagory />}
          />
          <Route
            path="/view_catagory/:main_catagory/:catagory"
            element={<ViewCatagory />}
          />
          <Route
            path="/view_catagory/:main_catagory"
            element={<ViewCatagory />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/buy_cart" element={<BuyCart />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot_pass" element={<ForgotPass />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Header;
