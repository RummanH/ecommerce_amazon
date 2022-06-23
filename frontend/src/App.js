import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Badge from "react-bootstrap/Badge";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "./context/appContext";
import Button from "react-bootstrap/Button";

import {
  AddProductAdmin,
  AdminRoute,
  CartScreen,
  Dashboard,
  Home,
  OrderHistory,
  OrderListAdmin,
  OrderScreen,
  PaymentMethod,
  PlaceOrder,
  ProductScreen,
  ProfileScreen,
  SearchScreen,
  ShippingAddress,
  SignInScreen,
  SignupScreen,
} from "./pages";
import ProductListAdmin from "./pages/Admin/ProductListAdmin";
import ProductEditAdmin from "./pages/Admin/ProductEditAdmin";
import { Protected, SearchBox } from "./components";

function App() {
  const { cart, user, logout } = useAppContext();
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const signoutHandler = () => {
    logout();
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get("/api/v1/products/categories");
      setCategories(res.data.data.categories);

      try {
      } catch (err) {}
    };

    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? "d-flex flex-column site-container active-cont"
            : "d-flex flex-column site-container"
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" extend="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars" />
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>Rumman's Shop</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {user ? (
                    <NavDropdown title={user.name} id="basic-nav-dropdown">
                      <LinkContainer to="profile">
                        <NavDropdown.Item>Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="orderhistory">
                        <NavDropdown.Item>Previous order</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Signout
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Signin
                    </Link>
                  )}
                </Nav>

                {user && user.role === "admin" && (
                  <NavDropdown title="Admin" id="admin">
                    <LinkContainer to="/admin/dashboard">
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/productlist">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orderlist">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/userlist">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? "side-navbar active-nav d-flex justify-content-between flex-wrap flex-column"
              : " side-navbar d-flex justify-content-between flex-wrap flex-column"
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => {
              return (
                <Nav.Item key={category}>
                  <LinkContainer
                    to={`/search/?category=${category}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    <Nav.Link>{category}</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              );
            })}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products/:slug" element={<ProductScreen />} />
              <Route path="/signin" element={<SignInScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/shipping" element={<ShippingAddress />} />
              <Route path="/payment" element={<PaymentMethod />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route
                path="/orderhistory"
                element={
                  <Protected>
                    <OrderHistory />
                  </Protected>
                }
              />
              <Route
                path="/profile"
                element={
                  <Protected>
                    <ProfileScreen />
                  </Protected>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <Protected>
                    <OrderScreen />
                  </Protected>
                }
              />
              <Route path="/cart" element={<CartScreen />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/productlist"
                element={
                  <AdminRoute>
                    <ProductListAdmin />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/edit/:productId"
                element={
                  <AdminRoute>
                    <ProductEditAdmin />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/addproduct"
                element={
                  <AdminRoute>
                    <AddProductAdmin />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/orderlist"
                element={
                  <AdminRoute>
                    <OrderListAdmin />
                  </AdminRoute>
                }
              />
            </Routes>
          </Container>
        </main>

        <footer className="text-center">
          All right reserved by Jahid Hasan Rumman
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
