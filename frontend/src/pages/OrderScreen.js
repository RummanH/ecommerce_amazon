import React, { useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { usePayPalScriptReducer, PayPalButtons } from "@paypal/react-paypal-js";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import axios from "axios";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { LoadingBox, MessageBox } from "../components";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PRODUCT_START":
      return { ...state, loading: true, error: "" };

    case "FETCH_PRODUCT_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_PRODUCT_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "PAID_REQUEST":
      return { ...state, loadingPay: true };
    case "PAID_REQUEST_SUCCESS":
      return { ...state, loading: false, successPay: true };
    case "PAID_REQUEST_FAIL":
      return { ...state, loading: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
};

const OrderScreen = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const params = useParams();
  const { id: orderId } = params;

  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: false,
      error: "",
      order: {},
      loadingPay: false,
      successPay: false,
      errorPay: false,
    });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  };
  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAID_REQUEST" });
        const res = await axios.put(`/api/orders/${orderId}/pay`, details, {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        });
        dispatch({
          type: "PAID_REQUEST_SUCCESS",
          payload: res.data.data.order,
        });
        toast.success("Order Paid");
      } catch (err) {
        dispatch({
          type: "PAID_REQUEST_FAIL",
          payload: getError(err),
        });
        toast.err(getError(err));
      }
    });
  };
  const onError = (err) => {
    toast.error(getError(err));
  };

  useEffect(() => {
    const fetchOrder = async () => {
      dispatch({ type: "FETCH_PRODUCT_START" });
      try {
        const res = await axios.get(`/api/v1/orders/${orderId}`, {
          headers: { authorization: `Bearer ${user.token}` },
        });

        dispatch({
          type: "FETCH_PRODUCT_SUCCESS",
          payload: res.data.data.order,
        });
      } catch (err) {
        dispatch({ type: "FETCH_PRODUCT_ERROR", payload: getError(err) });
      }
    };

    if (!user) {
      return navigate("/signin");
    }

    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const res = await axios.get("/api/keys/paypal", {
          headers: { authorization: `Bearer ${user.token}` },
        });

        paypalDispatch({
          type: "resetOptions",
          value: { "client-id": res.data.data.clientID, currency: "USD" },
        });

        paypalDispatch({
          type: "setLoadingStatus",
          value: "pending",
        });
      };

      loadPaypalScript();
    }
  }, [user, order, navigate, orderId, successPay, paypalDispatch]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    order.orderItems && (
      <div>
        <Helmet>
          <title>Order {orderId}</title>
        </Helmet>
        <h1>Order {orderId}</h1>
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Shipping</Card.Title>
                <Card.Text>
                  <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                  <strong>Address</strong> {order.shippingAddress.address},
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalcode},{" "}
                  {order.shippingAddress.country}
                </Card.Text>
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Delivered at{order.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Delivered</MessageBox>
                )}
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Payment</Card.Title>
                <Card.Text>
                  <strong>Method:</strong> {order.paymentMethod} <br />
                </Card.Text>

                {order.isPaid ? (
                  <MessageBox variant="success">
                    Paid at{order.paidAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Paid</MessageBox>
                )}
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Items</Card.Title>
                <ListGroup variant="flush">
                  {order.orderItems.map((item) => {
                    return (
                      <ListGroup.Item key={item._id}>
                        <Row className="align-items-center">
                          <Col md={6}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="img-fluid rounded img-thumbnail"
                            />
                            {"  "}
                            <Link to={`/products/${item.slug}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={3}>
                            {" "}
                            <span>{item.quantity}</span>
                          </Col>
                          <Col md={3}>${item.price}</Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>${order.itemsPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${order.shippingPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${order.taxPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong> Order total :</strong>
                      </Col>
                      <Col>
                        <strong> ${order.totalPrice.toFixed(2)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>

                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                  </ListGroup.Item>
                )}

                {loadingPay && <LoadingBox />}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    )
  );
};

export default OrderScreen;
