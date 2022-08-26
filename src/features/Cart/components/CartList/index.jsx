import classNames from "classnames";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import { Badge, Breadcrumb, BreadcrumbItem, Button, Table } from "reactstrap";
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
  const history = useHistory();
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
    <div
      className={classNames("CartList shadow", { "p-0": cart.length === 0 })}
    >
      {/* handle when order empty */}
      {cart.length === 0 && (
        <div className="CartList__empty">
          <i className="bx bx-basket animate__animated animate__swing">
            <Badge className="bg-warning rounded-circle">0</Badge>
          </i>
          <Button
            onClick={() => history.push("/")}
            className="button shadow-lg"
          >
            Go Back Shop
          </Button>
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
                  <th>FreeShip</th>
                  <th>Price</th>
                  <th className="text-end">actions</th>
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
          </div>

          <div className="CartList__payment">
            <div>
              <div>Total: </div>
              <div className="ms-3">{`$${total.toFixed(2)}`}</div>
              <div onClick={handleCheckOutClick}>Check out</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartList;
