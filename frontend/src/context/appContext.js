import axios from "axios";
import React, { useCallback, useContext, useReducer } from "react";
import { getError } from "../utils";
import { toast } from "react-toastify";
import { addToLocalStorage } from "../utils";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  FETCH_PRODUCTS_ERROR,
  FETCH_PRODUCTS_START,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCT_SUCCESS,
  SAVE_SHIPPING_ADDRESS,
  USER_LOGIN_ERROR,
  USER_LOGIN_START,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_SIGNUP_START,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_ERROR,
  SAVE_PAYMENT_METHOD,
  CART_CLEAR,
  UPDATE_USER,
  UPDATE_PRODUCT_START,
  UPDATE_PRODUCT_FAIL,
  UPDATE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
} from "./actions";
import { reducer } from "./reducer";

const initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},
    paymentMethod: localStorage.getItem("paymentMethod")
      ? JSON.parse(localStorage.getItem("paymentMethod"))
      : "",
  },
  products: [],
  loading: false,
  error: "",
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchProducts = useCallback(async () => {
    dispatch({ type: FETCH_PRODUCTS_START });
    try {
      const res = await axios.get("/api/v1/products");
      dispatch({
        type: FETCH_PRODUCTS_SUCCESS,
        payload: res.data.data.products,
      });
    } catch (err) {
      dispatch({ type: FETCH_PRODUCTS_ERROR, payload: getError(err) });
    }
  }, []);

  const fetchProduct = useCallback(async (slug) => {
    dispatch({ type: FETCH_PRODUCTS_START });
    try {
      const res = await axios.get(`/api/v1/products/slug/${slug}`);

      dispatch({
        type: FETCH_PRODUCT_SUCCESS,
        payload: res.data.data.product,
      });
    } catch (err) {
      dispatch({ type: FETCH_PRODUCTS_ERROR, payload: getError(err) });
    }
  }, []);

  const updateProduct = async (updated, productId) => {
    dispatch({ type: UPDATE_PRODUCT_START });
    try {
      const res = await axios.patch(`/api/v1/products/${productId}`, updated, {
        headers: {
          authorization: `Bearer ${state.user.token}`,
        },
      });
      dispatch({
        type: UPDATE_PRODUCT_SUCCESS,
        payload: res.data.data.product,
      });
    } catch (err) {
      dispatch({ type: UPDATE_PRODUCT_FAIL, payload: getError(err) });
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const res = await axios.delete(`/api/v1/products/${productId}`, {
        headers: {
          authorization: `Bearer ${state.user.token}`,
        },
      });
      dispatch({
        type: DELETE_PRODUCT_SUCCESS,
        payload: res.data.data.product,
      });
    } catch (err) {
      dispatch({ type: DELETE_PRODUCT_FAIL, payload: getError(err) });
    }
  };

  const addToCart = (product, quantity) => {
    if (product.countInStock < quantity) {
      window.alert("Sorry Product is out of stock");
      return;
    }
    dispatch({ type: CART_ADD_ITEM, payload: { ...product, quantity } });
  };

  const removeItemToCart = (item) => {
    dispatch({ type: CART_REMOVE_ITEM, payload: item });
  };

  const saveShippingAddress = (shippingAddress) => {
    dispatch({ type: SAVE_SHIPPING_ADDRESS, payload: shippingAddress });
    addToLocalStorage(shippingAddress, "shippingAddress");
  };

  const register = async (userData) => {
    dispatch({ type: USER_SIGNUP_START });
    try {
      const res = await axios.post("/api/v1/users/signup", userData);

      dispatch({ type: USER_SIGNUP_SUCCESS, payload: res.data.data.user });
      addToLocalStorage(res.data.data.user, "user");
    } catch (err) {
      dispatch({ type: USER_SIGNUP_ERROR, payload: getError(err) });
      toast.error(getError(err));
    }
  };

  const login = async (userData) => {
    dispatch({ type: USER_LOGIN_START });
    try {
      const res = await axios.post("/api/v1/users/login", userData);

      dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data.data.user });
      addToLocalStorage(res.data.data.user, "user");
    } catch (err) {
      dispatch({ type: USER_LOGIN_ERROR, payload: getError(err) });
      toast.error(getError(err));
    }
  };

  const logout = () => {
    dispatch({ type: USER_LOGOUT });
    localStorage.removeItem("user");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };

  const savePaymentMethod = (paymentMethod) => {
    dispatch({ type: SAVE_PAYMENT_METHOD, payload: paymentMethod });
    addToLocalStorage(paymentMethod, "paymentMethod");
  };

  const deleteCart = () => {
    dispatch({ type: CART_CLEAR });
    localStorage.removeItem("cartItems");
  };

  const updateUser = (updatedUser) => {
    dispatch({ type: UPDATE_USER, payload: updatedUser });
  };
  return (
    <AppContext.Provider
      value={{
        ...state,
        addToCart,
        fetchProducts,
        fetchProduct,
        removeItemToCart,
        login,
        logout,
        saveShippingAddress,
        register,
        savePaymentMethod,
        deleteCart,
        updateUser,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useAppContext };
