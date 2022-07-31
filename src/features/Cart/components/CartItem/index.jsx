import PropTypes from "prop-types";
import React from "react";
import { Badge, Input } from "reactstrap";
import "./cartitem.scss";

CartItem.propTypes = {
  product: PropTypes.object.isRequired,
  onColorChange: PropTypes.func,
  onSizeChange: PropTypes.func,
  onQuantityChange: PropTypes.func,
  onProductRemove: PropTypes.func,
};

CartItem.defaultProps = {
  onColorChange: null,
  onSizeChange: null,
  onQuantityChange: null,
  onProductRemove: null,
};

function CartItem(props) {
  const {
    product,
    onSizeChange,
    onColorChange,
    onQuantityChange,
    onProductRemove,
  } = props;

  // handle change attribute

  const handleColorChange = (id, color) => {
    if (!onColorChange) return;
    onColorChange(id, color);
  };

  const handleSizeChange = (id, size) => {
    if (!onSizeChange) return;
    onSizeChange(id, size);
  };

  const handleQuantityChange = (id, quantity) => {
    if (!onQuantityChange) return;
    onQuantityChange(id, quantity);
  };

  const handleRemoveProduct = (id) => {
    if (!onProductRemove) return;
    onProductRemove(id);
  };

  return (
    <tr className="CartItem">
      {/* Product name and image column */}

      <td className="pt-3">
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

      <td>
        <select
          onChange={(e) =>
            handleSizeChange(product._id, parseInt(e.target.value))
          }
          defaultValue={product.selectedSize}
        >
          {product.productDetail
            .find(({ color }) => color.color === product.selectedColor)
            .sizeAndQuantity.map(({ size }) => (
              <option key={size.size} value={size.size}>
                {size.size}
              </option>
            ))}
        </select>
      </td>

      {/* Color column */}

      <td>
        <select
          onChange={(e) => handleColorChange(product._id, e.target.value)}
          defaultValue={product.selectedColor}
        >
          {product.productDetail.map(({ color }) => (
            <option key={color.color} value={color.color}>
              {color.color}
            </option>
          ))}
        </select>
      </td>

      {/* Quantity Column */}

      <td>
        <div className="CartItem__quantity">
          <button className="btn" disabled={product.selectedQuantity === 1}>
            <i
              onClick={() =>
                handleQuantityChange(product._id, product.selectedQuantity - 1)
              }
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
              onClick={() =>
                handleQuantityChange(product._id, product.selectedQuantity + 1)
              }
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
          <Badge className="bg-warning">{`${(
            product.selectedQuantity *
            product.salePrice *
            ((100 - product.promotionPercent) / 100)
          ).toFixed(2)}$`}</Badge>
        </div>
      </td>

      {/* Action column */}

      <td>
        <div className="CartItem__action">
          <i
            onClick={() => handleRemoveProduct(product._id)}
            className="bx bx-trash text-danger"
          />
        </div>
      </td>
    </tr>
  );
}

export default CartItem;
