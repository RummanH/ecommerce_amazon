import axios from "axios";
import React, { useCallback, useEffect, useReducer } from "react";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoadingBox, MessageBox } from "../../components";
import { useAppContext } from "../../context/appContext";
import { getError } from "../../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ORDERS_START":
      return { ...state, loading: true };
    case "FETCH_ORDERS_SUCCESS":
      return { ...state, orders: action.payload, loading: false };
    case "DELETE_ORDER":
      const updatedOrders = state.orders.filter(
        (order) => order._id !== action.payload._id
      );

      console.log(updatedOrders);
      return { ...state, orders: updatedOrders };
    case "FETCH_ORDERS_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const OrderListAdmin = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
    orders: [],
  });

  console.log(orders);

  const fetchOrders = useCallback(async () => {
    dispatch({ type: "FETCH_ORDERS_START" });
    try {
      const res = await axios.get("/api/v1/orders", {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });
      dispatch({ type: "FETCH_ORDERS_SUCCESS", payload: res.data.data.orders });
    } catch (err) {
      dispatch({ type: "FETCH_ORDERS_ERROR", payload: getError(err) });
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const deleteHandler = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await axios.delete(`/api/v1/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        });
        console.log(res);
        dispatch({ type: "DELETE_ORDER", payload: res.data.data.order });
      } catch (err) {
        toast.error(getError(err));
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1>Order History</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">error</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user ? order.user.name : "Deleted"}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
                <td>{order.isPaid ? order.paidAt : "No"}</td>
                <td>
                  {order.isDelivered ? order.deliveredAt : "Not delivered"}
                </td>
                <td>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    Details
                  </Button>
                  <Button
                    variant="danger"
                    className="small"
                    onClick={() => deleteHandler(order._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderListAdmin;
