import PropTypes from "prop-types";
import React from "react";
import { useHistory } from "react-router-dom";
import { Badge, Table } from "reactstrap";
import CartItem from "../CartItem";
import "./cartlist.scss";
CartList.propTypes = {
  cart: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,

  onSizeChange: PropTypes.func.isRequired,
  onColorChange: PropTypes.func.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onProductRemove: PropTypes.func.isRequired,
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
  } = props;

  return (
    <div className="CartList">
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
          <header>My Shopping Cart 🛒</header>
          <Table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Color</th>
                <th>Quantity</th>
                <th>Discount</th>
                <th>FreeShip</th>
                <th>Subtotal</th>
                <th>actions</th>
              </tr>
            </thead>

            <tbody>
              {cart.map((product) => (
                <CartItem
                  key={product._id}
                  product={product}
                  onSizeChange={onSizeChange}
                  onColorChange={onColorChange}
                  onQuantityChange={onQuantityChange}
                  onProductRemove={onProductRemove}
                />
              ))}
            </tbody>
          </Table>

          <div className="CartList__payment">
            <div>
              <div>Total: </div>
              <div className="ms-3">{`${total.toFixed(2)}$`}</div>
              <div>Check out</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartList;
