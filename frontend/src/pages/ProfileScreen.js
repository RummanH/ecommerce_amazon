import React, { useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useAppContext } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { LoadingBox } from "../components";

const reducer = (state, action) => {
  switch (action.payload) {
    case "UPDATE_REQUEST_START":
      return { ...state, loading: true };
    case "UPDATE_REQUEST_SUCCESS":
      return { ...state, loading: false };
    case "UPDATE_REQUEST_ERROR":
      return { ...state, loading: false };
    default:
      return state;
  }
};

const ProfileScreen = () => {
  const { user, updateUser } = useAppContext();
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const [inputData, setInputData] = useState({
    name: user.name,
    email: user.email,
  });

  const inputChangeHandler = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };
  const formSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(inputData);
    dispatch({ type: "UPDATE_REQUEST_START" });
    try {
      const res = await axios.patch("/api/v1/users/updateMe", inputData, {
        headers: { authorization: `Bearer ${user.token}` },
      });
      dispatch({ type: "UPDATE_REQUEST_SUCCESS" });
      updateUser(res.data.data.user);
      toast.success("Profile Updated successfully");
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1>User Profile</h1>
      <form onSubmit={formSubmitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={inputData.name}
            name="name"
            onChange={inputChangeHandler}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={inputData.email}
            name="email"
            onChange={inputChangeHandler}
          />
        </Form.Group>
        <div className="mb-3">
          {loading ? <LoadingBox /> : <Button type="submit">Update</Button>}
        </div>
      </form>
    </div>
  );
};

export default ProfileScreen;
