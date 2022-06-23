import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";

const initialState = { email: "", password: "" };

function SignInScreen() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(initialState);
  const { login, user } = useAppContext();

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const inputChangeHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    login(userData);
  };

  useEffect(() => {
    if (user) {
      navigate(redirect || "/");
    }
  }, [user, navigate, redirect]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={submitHandler}>
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
        <div className="mb-3">
          <Button type="submit">SignIn</Button>
        </div>
        <div className="mb-3">
          New Customer?{" "}
          <Link to={`/signup?redirect=${redirect}`}>Create Account</Link>
        </div>
      </Form>
    </Container>
  );
}

export default SignInScreen;
