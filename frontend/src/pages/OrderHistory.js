import axios from "axios";
import React, { useCallback, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "../context/appContext";
import { getError } from "../utils";

import Button from "react-bootstrap/Button";
import { LoadingBox, MessageBox } from "../components";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ORDER_START":
      return { ...state, loading: true };
    case "FETCH_ORDER_SUCCESS":
      return { ...state, loading: false, error: "", orders: action.payload };
    case "FETCH_ORDER_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function OrderHistory() {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
    orders: [],
  });

  const fetchOrder = useCallback(async () => {
    dispatch({ type: "FETCH_ORDER_START" });
    try {
      const res = await axios.get(`/api/v1/users/${user._id}/orders`, {
        headers: { authorization: `Bearer ${user.token}` },
      });
      dispatch({ type: "FETCH_ORDER_SUCCESS", payload: res.data.data.orders });
    } catch (err) {
      dispatch({ type: "FETCH_ORDER_ERROR", payload: getError(err) });
      toast.error(getError(err));
    }
  }, [user]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

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
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
                <td>{order.isPaid ? order.paidAt : "No"}</td>
                <td>
                  {order.isDelivered ? order.deliveredAt : "Not delivered"}
                </td>
                <td>
                  <Button
                    variant="light"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderHistory;
