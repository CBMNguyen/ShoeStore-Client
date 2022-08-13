import PropTypes from "prop-types";
import React from "react";
import { Badge, Input } from "reactstrap";
import "./cartitem.scss";

CartItem.propTypes = {
  index: PropTypes.number.isRequired,
  cart: PropTypes.array.isRequired,
  product: PropTypes.object.isRequired,
  onColorChange: PropTypes.func,
  onSizeChange: PropTypes.func,
  onQuantityChange: PropTypes.func,
  onProductRemove: PropTypes.func,
  showCartEditModal: PropTypes.func.isRequired,
};

CartItem.defaultProps = {
  onColorChange: null,
  onSizeChange: null,
  onQuantityChange: null,
  onProductRemove: null,
};

function CartItem(props) {
  const {
    index,
    cart,
    product,
    onQuantityChange,
    onProductRemove,
    showCartEditModal,
  } = props;

  const { selectedColor, selectedSize, selectedQuantity } = product;

  // current cart item index
  const cartItemIndex = cart.findIndex(
    (item) =>
      item._id === product._id &&
      item.selectedColor === product.selectedColor &&
      item.selectedSize === product.selectedSize
  );

  const handleQuantityChange = (quantity) => {
    if (!onQuantityChange) return;
    onQuantityChange({
      cartItemIndex,
      quantity,
    });
  };

  const handleRemoveProduct = () => {
    if (!onProductRemove) return;
    onProductRemove(product);
  };

  const handleShowEditProductModal = () => {
    if (!showCartEditModal) return;
    const selectProductDetail = {
      selectedColor,
      selectedSize,
      selectedQuantity,
    };
    showCartEditModal({ product, selectProductDetail });
  };

  return (
    <tr className="CartItem">
      <td className="text-center">{index + 1}</td>
      {/* Product name and image column */}
      <td>
        <div className="CartItem__product">
          <img
            src={
              product.productDetail.find(
                ({ color }) => color.color === product.selectedColor
              ).images[0]
            }
            alt={product._id}
          />
          <div className="ps-4">
            <Badge className="bg-dark d-block">{product.name}</Badge>
            <Badge className="bg-warning">{`${product.originalPrice}$`}</Badge>
          </div>
        </div>
      </td>

      {/* Size Column */}

      <td className="text-center">{product.selectedSize}</td>

      {/* Color column */}

      <td className="text-center">{product.selectedColor}</td>

      {/* Quantity Column */}

      <td>
        <div className="CartItem__quantity">
          <button className="btn" disabled={product.selectedQuantity === 1}>
            <i
              onClick={() => handleQuantityChange(selectedQuantity - 1)}
              className="bx bx-minus"
            />
          </button>
          <div>{product.selectedQuantity}</div>
          <button
            className="btn"
            disabled={product.selectedQuantity === product.quantity}
          >
            {" "}
            <i
              onClick={() => handleQuantityChange(selectedQuantity + 1)}
              className="bx bx-plus"
            />
          </button>
        </div>
      </td>

      {/* Discount column */}

      <td>
        <div className="CartItem__discount">
          <Badge className="bg-info">{`${product.promotionPercent} %`}</Badge>
        </div>
      </td>

      {/* FreeShip column */}

      <td>
        <div className="CartItem__freeship">
          <Input
            className="d-block ms-4"
            style={{ backgroundColor: "#34ae11" }}
            type="checkbox"
            checked={product.isFreeShip}
            readOnly
          />
        </div>
      </td>

      {/* Subtotal column */}

      <td>
        <div className="CartItem__subtotal">
          <Badge className="bg-warning">{`$${(
            product.selectedQuantity *
            product.salePrice *
            ((100 - product.promotionPercent) / 100)
          ).toFixed(2)}`}</Badge>
        </div>
      </td>

      {/* Action column */}

      <td>
        <div className="CartItem__controls">
          <div className="CartItem__action">
            <i
              onClick={handleShowEditProductModal}
              className="bx bx-edit text-info"
            />
          </div>
          <div className="CartItem__action">
            <i
              onClick={handleRemoveProduct}
              className="bx bx-trash text-danger"
            />
          </div>
        </div>
      </td>
    </tr>
  );
}

export default CartItem;
