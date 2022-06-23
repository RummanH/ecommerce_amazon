import {
  CART_ADD_ITEM,
  FETCH_PRODUCTS_ERROR,
  FETCH_PRODUCTS_START,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCT_SUCCESS,
  CART_REMOVE_ITEM,
  USER_LOGIN_START,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_ERROR,
  USER_LOGOUT,
  SAVE_SHIPPING_ADDRESS,
  USER_SIGNUP_START,
  USER_SIGNUP_ERROR,
  SAVE_PAYMENT_METHOD,
  CART_CLEAR,
  UPDATE_USER,
  USER_SIGNUP_SUCCESS,
  UPDATE_PRODUCT_START,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  DELETE_PRODUCT_START,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
} from "./actions";

import { addToLocalStorage } from "../utils";

export const reducer = (state, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const newItem = action.payload;
      const existingItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existingItem
        ? state.cart.cartItems.map((item) =>
            item._id === existingItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      //very confusing now
      // console.log(cartItems, { ...state.cart });
      return { ...state, cart: { ...state.cart, cartItems } };

    case CART_REMOVE_ITEM: {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case FETCH_PRODUCTS_START:
      return { ...state, loading: true };
    case FETCH_PRODUCTS_SUCCESS:
      return { ...state, loading: false, products: action.payload, error: "" };
    case FETCH_PRODUCTS_ERROR:
      return { ...state, loading: false, error: action.payload };

    case FETCH_PRODUCT_SUCCESS: {
      const exist = state.products.find((x) => x._id === action.payload._id);
      let products = [];
      if (exist) {
        products = state.products.map((item) =>
          item._id === exist._id ? action.payload : item
        );
      } else {
        products = [...state.products, action.payload];
      }

      return {
        ...state,
        loading: false,
        error: "",
        products: [...products],
      };
    }

    case UPDATE_PRODUCT_START:
      return { ...state, loading: true };
    case UPDATE_PRODUCT_SUCCESS: {
      const exist = state.products.find((x) => x._id === action.payload._id);
      let products = [];
      if (exist) {
        products = state.products.map((item) =>
          item._id === exist._id ? action.payload : item
        );
      } else {
        products = [...state.products, action.payload];
      }

      return {
        ...state,
        loading: false,
        error: "",
        products: [...products],
      };
    }

    case UPDATE_PRODUCT_FAIL:
      return { ...state, loading: false, error: action.payload };

    case DELETE_PRODUCT_START:
      return { ...state, loading: true };
    case DELETE_PRODUCT_SUCCESS: {
      const products = state.products.filter(
        (item) => item._id !== action.payload._id
      );

      return {
        ...state,
        loading: false,
        error: "",
        products: [...products],
      };
    }

    case DELETE_PRODUCT_FAIL:
      return { ...state, loading: false, error: action.payload };

    case USER_LOGIN_START:
      return { ...state, loading: true };
    case USER_LOGIN_SUCCESS:
      return { ...state, loading: false, user: action.payload, error: "" };
    case USER_LOGIN_ERROR:
      return { ...state, loading: false, error: action.payload };

    case USER_SIGNUP_START:
      return { ...state, loading: true };
    case USER_SIGNUP_SUCCESS:
      return { ...state, loading: false, user: action.payload, error: "" };
    case USER_SIGNUP_ERROR:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_USER:
      const updatedUser = { ...state.user, ...action.payload };
      addToLocalStorage(updatedUser, "user");
      return { ...state, user: { ...state.user, ...action.payload } };

    case USER_LOGOUT:
      return {
        ...state,
        user: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: "",
        },
      };
    case SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };

    case SAVE_PAYMENT_METHOD:
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };

    case CART_CLEAR:
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    default:
      return state;
  }
};
