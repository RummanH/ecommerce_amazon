import Alert from "react-bootstrap/esm/Alert";

export default ({ children, variant }) => {
  return <Alert variant={variant || "info"}>{children}</Alert>;
};
