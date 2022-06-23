import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { useAppContext } from "../context/appContext";

function Product({ product }) {
  const { addToCart, cart } = useAppContext();
  const addToCartHandler = (item) => {
    const existingItem = cart.cartItems.find((x) => x._id === product._id);
    let quantity = existingItem ? existingItem.quantity + 1 : 1;
    addToCart(product, quantity);
  };
  return (
    <Card key={product.slug}>
      <Link to={`/products/${product.slug}`}>
        <img
          src={product.image}
          className="card-img-top"
          alt={`${product.name}`}
        />
      </Link>

      <Card.Body>
        <Link to={`/products/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to Cart</Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;
