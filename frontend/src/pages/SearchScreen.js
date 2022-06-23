import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { getError } from "../utils";

import { toast } from "react-toastify";
import { LoadingBox, MessageBox, Product, Rating } from "../components";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PRODUCT_START":
      return { ...state, loading: true };
    case "FETCH_PRODUCT_SUCCESS":
      return {
        ...state,
        loading: false,
        products: action.payload,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
      };
    case "FETCH_PRODUCT_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const SearchScreen = () => {
  const [{ loading, error, products, countProducts }, dispatch] = useReducer(
    reducer,
    {
      loading: false,
      error: "",
      products: [],
    }
  );

  console.log(products);

  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") | "all";

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: "FETCH_PRODUCT_START" });
      try {
        const res = await axios.get(
          `/api/v1/products?page=${page}&query=${query}&category=${category}&order=${order}&price=${price}&rating=${rating}`
        );
        dispatch({
          type: "FETCH_PRODUCT_SUCCESS",
          payload: res.data.data.products,
        });
      } catch (err) {
        dispatch({ type: "FETCH_PRODUCT_FAIL", payload: getError(err) });
      }
    };
    fetchProducts();
  }, [page, category, query, order, price, rating]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get("/api/v1/products/categories");
      setCategories(res.data.data.categories);

      try {
      } catch (err) {
        toast.err(getError(err));
      }
    };

    fetchCategories();
  }, []);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?category=${filterCategory}&page=${filterPage}&query=${filterQuery}&rating=${filterRating}&price=${filterPrice}&order=${sortOrder}`;
  };

  const ratings = [
    { name: "4stars & up", value: 4 },
    { name: "3stars & up", value: 3 },
    { name: "2stars & up", value: 2 },
    { name: "1star & up", value: 1 },
  ];

  const prices = [
    { name: "$1 to $50", value: "1-50" },
    { name: "$51 to $200", value: "51-200" },
    { name: "$201 to $1000", value: "201-1000" },
  ];

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h3>Departments</h3>{" "}
          <div>
            <ul>
              <li>
                <Link
                  className={"all" === category ? "text-bold" : ""}
                  to={getFilterUrl({ category: "all" })}
                >
                  any
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={c === category ? "text-bold" : ""}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Price</h3>
            {"  "}
            <ul>
              <li>
                <Link
                  className={"all" === price ? "text-bold" : ""}
                  to={getFilterUrl({ price: "all" })}
                >
                  any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    className={p.value === price ? "text-bold" : ""}
                    to={getFilterUrl({ price: p.value })}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Avg. Customer Review</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.value}>
                  <Link
                    className={`${r.value}` === `${rating}` ? "text-bold" : ""}
                    to={getFilterUrl({ rating: r.value })}
                  >
                    <Rating caption=" & up" rating={r.value} />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className={"all" === rating.value ? "text-bold" : ""}
                  to={getFilterUrl({ rating: "all" })}
                >
                  <Rating caption=" & up" rating={0} />
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {countProducts === 0 ? "No" : countProducts} Results
                    {query !== "all" && " : " + query}
                    {category !== "all" && " : " + category}
                    {price !== "all" && " : " + price}
                    {rating !== "all" && " : " + rating + " & up"}
                    {query !== "all" ||
                    category !== "all" ||
                    rating !== "all" ||
                    price !== "all" ? (
                      <Button
                        variant="light"
                        onClick={() => navigate("/search")}
                      >
                        <i className="fas fa-times-circle" />
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="text-extend">
                  Sort By
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">New Arrival</option>
                    <option value="lowest">Price low to high</option>
                    <option value="highest">Price Highest to low</option>
                    <option value="toprated">Avg. Customer review</option>
                  </select>
                </Col>
              </Row>
              {products.length === 0 && (
                <MessageBox>No Product found</MessageBox>
              )}
              <Row>
                {products.map((prod) => {
                  return (
                    <Col sm={6} lg={4} className="mb-3" key={prod._id}>
                      <Product product={prod} />
                    </Col>
                  );
                })}
              </Row>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SearchScreen;
