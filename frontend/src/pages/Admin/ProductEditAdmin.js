import axios from "axios";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FormRow, LoadingBox, MessageBox } from "../../components";
import { useAppContext } from "../../context/appContext";
import { getError } from "../../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductEditAdmin = () => {
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);

  const navigate = useNavigate();
  const { updateProduct, user } = useAppContext();
  const { productId } = useParams();
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
    product: {},
  });

  const [inputState, setInputState] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    countInStock: 0,
    brand: "",
    description: "",
    slug: "",
  });

  const { name, price, image, category, countInStock, brand, description } =
    inputState;

  const fetchProduct = useCallback(async () => {
    try {
      dispatch({ type: "FETCH_START" });
      const res = await axios.get(`/api/v1/products/${productId}`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });
      dispatch({ type: "FETCH_SUCCESS", payload: res.data.data.product });
      setInputState({ ...res.data.data.product });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: getError(err) });
    }
  }, [productId, user]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);
  const editProductHandler = async (e) => {
    e.preventDefault();
    await updateProduct(inputState, productId);
    navigate("/admin/productlist");
  };

  const inputChangeHandler = (e) => {
    setInputState({ ...inputState, [e.target.name]: e.target.value });
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFromData = new FormData();
    bodyFromData.append("image", file);

    setLoadingUpload(true);
    try {
      const res = await axios.post("/api/v1/upload", bodyFromData, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });

      setLoadingUpload(false);
      setInputState({ ...inputState, [e.target.name]: res.data.data.image });
      setErrorUpload("");
    } catch (err) {
      setLoadingUpload(false);
      setErrorUpload(getError(err));
      toast.error(getError(err));
    }
  };

  return (
    <form className="form" onSubmit={editProductHandler}>
      <div>
        <h1>Edit {product._id}</h1>
      </div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <FormRow
            id="name"
            name="name"
            type="text"
            value={name}
            inputChangeHandler={inputChangeHandler}
            labelText="Name"
          />

          <FormRow
            id="price"
            name="price"
            type="text"
            value={price}
            inputChangeHandler={inputChangeHandler}
            labelText="Price"
          />

          <FormRow
            id="image"
            name="image"
            type="text"
            value={image}
            inputChangeHandler={inputChangeHandler}
            labelText="Image"
          />

          <FormRow
            id="photo"
            name="image"
            type="file"
            inputChangeHandler={uploadFileHandler}
            labelText="Choose a photo"
          />

          {loadingUpload && <LoadingBox />}
          {errorUpload && (
            <MessageBox variant="danger">{errorUpload}</MessageBox>
          )}

          <FormRow
            id="category"
            name="category"
            type="text"
            value={category}
            inputChangeHandler={inputChangeHandler}
            labelText="Category"
          />

          <FormRow
            id="countInStock"
            name="countInStock"
            type="text"
            value={countInStock}
            inputChangeHandler={inputChangeHandler}
            labelText="Count In Stock"
          />

          <FormRow
            id="brand"
            name="brand"
            type="text"
            value={brand}
            inputChangeHandler={inputChangeHandler}
            labelText="Brand"
          />

          <FormRow
            id="description"
            name="description"
            type="text"
            value={description}
            inputChangeHandler={inputChangeHandler}
            labelText="Description"
          />

          <div>
            <label></label>
            <button className="primary" type="submit">
              Update
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default ProductEditAdmin;
