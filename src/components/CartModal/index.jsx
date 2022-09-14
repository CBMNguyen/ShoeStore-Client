import React from "react";
import { Link } from "react-router-dom";
import { Badge, Button } from "reactstrap";
import { capitalizeFirstLetter, total } from "utils/common";
import "./cartModal.scss";

function CartModal({
  carts,
  showCartModal,
  setShowCartModal,
  onRemoveCartItemClick,
  onCheckoutClick,
}) {
  return (
    <div
      className="shadow CartModal"
      style={showCartModal ? { transform: "translateX(0)", opacity: 1 } : {}}
    >
      <h6 className="mb-5">
        <code className="text-secondary fs-5">Cart</code>
      </h6>

      <div
        className="CartModal__closeIcon"
        onClick={() => setShowCartModal(false)}
      >
        <i className="bx bx-x text-secondary" />
      </div>

      {carts.length !== 0 &&
        carts.map((cartItem, index) => (
          <div
            className="d-flex  pb-4 mb-4 position-relative"
            style={{
              borderBottomStyle: "dashed",
              borderBottom:
                index + 1 !== carts.length ? "1px solid #dedede" : "unset",
            }}
            key={index}
          >
            <div
              className="CartModal__removeCartItem"
              onClick={() => onRemoveCartItemClick(cartItem)}
            >
              <i className="bx bx-x" />
            </div>
            <div className="position-relative">
              <img
                className="rounded-2 img-thumbnail img-fluid"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                }}
                src={
                  cartItem.productDetail.find(
                    ({ color }) => color.color === cartItem.selectedColor
                  ).images[0]
                }
                alt="img"
              />

              <Badge
                className="bg-secondary rounded-pill position-absolute"
                style={{ top: "-10px", right: "-10px" }}
              >
                {cartItem.selectedQuantity}
              </Badge>
            </div>
            <div className="flex-grow-1 ms-4">
              <Badge className="bg-secondary">{cartItem.name}</Badge>
              <h6>
                <Badge className="bg-dark">
                  {capitalizeFirstLetter(cartItem.category.name)}
                </Badge>
              </h6>
              <div>
                <Badge className="bg-success">{cartItem.selectedSize}</Badge>
              </div>
            </div>
            <div className="my-auto">
              <Badge className="bg-warning">
                $
                {cartItem.salePrice *
                  cartItem.selectedQuantity *
                  (1 - cartItem.promotionPercent)}
              </Badge>
            </div>
          </div>
        ))}

      {carts.length === 0 && (
        <div className="my-2">
          <code>There are currently no products</code>
        </div>
      )}

      <div
        style={{
          borderTop: "2px solid #000",
        }}
        className="py-4 d-flex justify-content-between"
      >
        <div>
          <code className="text-secondary fs-6">Total Amount:</code>{" "}
        </div>
        <div
          style={{
            borderBottom: "2px dotted #dedede",
          }}
        >
          <code className="text-secondary fs-6">
            ${total(carts).toFixed(2)}
          </code>{" "}
        </div>
      </div>

      <div className="d-flex">
        <Button
          style={{ backgroundColor: "#000" }}
          className="rounded-1 flex-grow-1 shadow"
        >
          <Link
            to="/cart"
            className="text-white text-decoration-none d-block p-2"
          >
            <code className="text-white fs-6">View cart</code>
          </Link>
        </Button>
        <Button
          disabled={carts.length === 0}
          style={{ backgroundColor: "#000" }}
          className="rounded-1 flex-grow-1 ms-2 shadow"
          onClick={() => onCheckoutClick()}
        >
          <code className="text-white fs-6">Check out</code>
        </Button>
      </div>
    </div>
  );
}

export default CartModal;
