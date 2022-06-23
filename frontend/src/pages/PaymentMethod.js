import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { useAppContext } from "../context/appContext";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function PaymentMethod() {
  const navigate = useNavigate();
  const {
    cart: { shippingAddress, paymentMethod },
    savePaymentMethod,
    user,
  } = useAppContext();

  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || "PayPal"
  );

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
    if (!user) {
      navigate("/signin");
    }
  }, [shippingAddress, navigate, user]);

  const paymentSubmitHandler = (e) => {
    savePaymentMethod(paymentMethodName);
    navigate("/placeorder");
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <div className="container small-container">
        <Helmet>
          <title>Select Payment Method</title>
        </Helmet>
        <h1 className="my-3">Select PaymentMethod</h1>
        <Form onSubmit={paymentSubmitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === "PayPal"}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === "Stripe"}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default PaymentMethod;
