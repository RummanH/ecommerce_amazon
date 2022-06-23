import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FormRow, LoadingBox, MessageBox } from "../../components";
import { useAppContext } from "../../context/appContext";
import { getError } from "../../utils";

const AddProductAdmin = () => {
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);

  const navigate = useNavigate();
  const { user } = useAppContext();
  const [inputState, setInputState] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    countInStock: 0,
    brand: "",
    description: "",
  });

  const { name, price, image, category, countInStock, brand, description } =
    inputState;

  const inputChangeHandler = (e) => {
    setInputState({ ...inputState, [e.target.name]: e.target.value });
  };

  const addProductHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/v1/products",
        { ...inputState },
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      toast.success("Product created successful. Please edit ");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(getError(err));
    }
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
    <form className="form" onSubmit={addProductHandler}>
      <div>
        <h1>Add New Product</h1>
      </div>
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
      {errorUpload && <MessageBox variant="danger">{errorUpload}</MessageBox>}

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
          Add Product
        </button>
      </div>
    </form>
  );
};

export default AddProductAdmin;
