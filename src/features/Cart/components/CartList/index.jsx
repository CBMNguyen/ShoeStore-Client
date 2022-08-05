import classNames from "classnames";
import { getOrderWithCart } from "features/Order/orderSlice";
import jwt from "jsonwebtoken";
import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Badge, Breadcrumb, BreadcrumbItem, Table } from "reactstrap";
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
  showModel: PropTypes.func.isRequired,
  showCartEditModal: PropTypes.func.isRequired,
};

CartList.defaultProps = {
  token: "",
  user: null,
};

function CartList(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    cart,
    total,
    token,
    user,

    onSizeChange,
    onColorChange,
    onQuantityChange,
    onProductRemove,
    showModel,
    showCartEditModal,
  } = props;

  // handle click when go to check out

  const handleCheckOutClick = async () => {
    try {
      await jwt.verify(token, process.env.REACT_APP_JWT_KEY);
      const order = cart.map((cart) => ({ ...cart, state: "" }));
      dispatch(getOrderWithCart({ order, userId: user._id }));

      history.push("/order");
    } catch (error) {
      showModel();
    }
  };

  return (
    <div
      className={classNames("CartList shadow", { "p-0": cart.length === 0 })}
    >
      {/* handle when order empty */}
      {cart.length === 0 && (
        <div className="CartList__empty">
          <i className="bx bx-basket animate__animated animate__swing">
            <Badge className="bg-danger rounded-circle">0</Badge>
          </i>
          <div onClick={() => history.push("/")} className="button">
            Go Back Shop
          </div>
        </div>
      )}

      {cart.length !== 0 && (
        <div>
          <header>
            <h2>My Shopping Cart 🛒</h2>
            {/* navigation */}
            <Breadcrumb>
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
