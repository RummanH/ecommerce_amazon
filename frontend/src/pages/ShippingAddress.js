import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
import { CheckoutSteps } from "../components";

function ShippingAddress() {
  const navigate = useNavigate();
  const {
    user,
    saveShippingAddress,
    cart: { shippingAddress },
  } = useAppContext();

  useEffect(() => {
    if (!user) {
      navigate("/signin?redirect=/shipping");
    }
  }, [user, navigate]);

  const initialState = {
    fullName: shippingAddress.fullName || "",
    address: shippingAddress.address || "",
    city: shippingAddress.city || "",
    postalcode: shippingAddress.postalcode || "",
    country: shippingAddress.country || "",
  };

  const [shippingData, setShippingData] = useState(initialState);
  const { fullName, address, city, postalcode, country } = shippingData;

  const inputChangeHandler = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveShippingAddress(shippingData);
    navigate("/payment");
  };

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>

      <CheckoutSteps step1 step2 />

      <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>full Name</Form.Label>
            <Form.Control
              name="fullName"
              value={fullName}
              onChange={inputChangeHandler}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              name="address"
              value={address}
              onChange={inputChangeHandler}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              value={city}
              onChange={inputChangeHandler}
              required
              name="city"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="postalcode">
            <Form.Label>Postal code</Form.Label>
            <Form.Control
              name="postalcode"
              value={postalcode}
              onChange={inputChangeHandler}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              name="country"
              value={country}
              onChange={inputChangeHandler}
              required
            />
          </Form.Group>

          <div className="mb-3">
            <Button variant="primary" type="submit">
              continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ShippingAddress;
