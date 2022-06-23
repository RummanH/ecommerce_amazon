import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";

const initialState = { name: "", email: "", password: "", passwordConfirm: "" };

function SignupScreen() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(initialState);
  const { user, register } = useAppContext();

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const inputChangeHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    register(userData);
  };

  useEffect(() => {
    if (user) {
      navigate(redirect || "/");
    }
  }, [user, navigate, redirect]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={userData.name}
            type="text"
            name="name"
            required
            onChange={inputChangeHandler}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={userData.email}
            type="email"
            name="email"
            required
            onChange={inputChangeHandler}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={userData.password}
            name="password"
            type="password"
            required
            onChange={inputChangeHandler}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="passwordConfirm">
          <Form.Label>Password Confirm</Form.Label>
          <Form.Control
            value={userData.passwordConfirm}
            name="passwordConfirm"
            type="password"
            required
            onChange={inputChangeHandler}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Signup</Button>
        </div>
        <div className="mb-3">
          already have an account?{" "}
          <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
        </div>
      </Form>
    </Container>
  );
}

export default SignupScreen;
