import classNames from "classnames";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Col,
  Container,
  Row,
  Table,
} from "reactstrap";
import CartItem from "../CartItem";
import "./cartlist.scss";
CartList.propTypes = {
  cart: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  token: PropTypes.string,

  onSizeChange: PropTypes.func.isRequired,
  onColorChange: PropTypes.func.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onProductRemove: PropTypes.func.isRequired,
  onCheckoutClick: PropTypes.func.isRequired,
  showCartEditModal: PropTypes.func.isRequired,
};

CartList.defaultProps = {
  token: "",
  user: null,
};

function CartList(props) {
  const {
    cart,
    total,
    onSizeChange,
    onColorChange,
    onQuantityChange,
    onProductRemove,
    onCheckoutClick,
    showCartEditModal,
  } = props;

  const handleCheckOutClick = () => {
    if (!onCheckoutClick) return;
    onCheckoutClick();
  };

  return (
    <Container>
      <div
        className={classNames("CartList shadow rounded-1", {
          "p-0": cart.length === 0,
        })}
      >
        {/* handle when order empty */}
        {cart.length === 0 && (
          <div className="CartList__empty">
            <i className="bx bx-basket animate__animated animate__swing">
              <Badge className="bg-warning rounded-circle">0</Badge>
            </i>
            <Row className="w-75">
              <Col md={6}>
                <Link to="/" className="button shadow-lg text-decoration-none">
                  Home
                </Link>
              </Col>
              <Col md={6}>
                <Link
                  to="/products"
                  className="button shadow-lg text-decoration-none"
                >
                  See other products
                </Link>
              </Col>
            </Row>
          </div>
        )}

        {cart.length !== 0 && (
          <div>
            <header>
              <h2>My Shopping Cart 🛒</h2>
              {/* navigation */}
              <Breadcrumb className="mt-2">
                <BreadcrumbItem>
                  <Link style={{ textDecoration: "none" }} to="/">
                    Home
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>Cart</BreadcrumbItem>
              </Breadcrumb>
            </header>
            <div style={{ maxHeight: "460px", overflowY: "auto" }}>
              <Table>
                <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <tr>
                    <th className="text-center">#</th>
                    <th>Product</th>
                    <th className="text-center">Size</th>
                    <th className="text-center">Color</th>
                    <th>Quantity</th>
                    <th>Discount</th>
                    <th>Price</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {cart.map((product, index) => (
                    <CartItem
                      key={index}
                      index={index}
                      cart={cart}
                      product={product}
                      onSizeChange={onSizeChange}
                      onColorChange={onColorChange}
                      onQuantityChange={onQuantityChange}
                      onProductRemove={onProductRemove}
                      showCartEditModal={showCartEditModal}
                    />
                  ))}
                </tbody>
              </Table>
              <div className="CartList__payment mt-2">
                <div>
                  <div>Total: </div>
                  <div className="ms-3">{`$${total.toFixed(2)}`}</div>
                  <div className="shadow" onClick={handleCheckOutClick}>
                    Check out
                  </div>
                  <Link
                    className="btn btn-sm d-block rounded-1 shadow"
                    style={{
                      backgroundColor: "deeppink",
                      color: "#fff",
                      fontWeight: "500",
                      paddingTop: "5px",
                      paddingBottom: "5px",
                    }}
                    to="/products"
                  >
                    See other products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

export default CartList;
