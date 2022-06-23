import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { LoadingBox, MessageBox } from "../../components";
import { useAppContext } from "../../context/appContext";

const ProductListAdmin = () => {
  const navigate = useNavigate();
  const { fetchProducts, loading, error, products, deleteProduct } =
    useAppContext();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const deleteHandler = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
    }
  };
  const createHandler = async () => {
    navigate("/admin/addproduct");
  };
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Product list admin</title>
      </Helmet>
      <div className="row">
        <button type="button" className="primary" onClick={createHandler}>
          Create New Products
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            return (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product._category}</td>
                <td>{product._brand}</td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() => navigate(`/admin/edit/${product._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductListAdmin;
