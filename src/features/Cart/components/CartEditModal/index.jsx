import { PRODUCT_TOAST_OPTIONS, STYLE_MODEL } from "constants/globals";
import {
  selectQuantity,
  selectSize,
  updateToCart,
} from "features/Cart/cartSlice";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Slider from "react-slick";
import { toast } from "react-toastify";
import { capitalizeFirstLetter, sliderSettings } from "utils/common";
import "./carteditmodal.scss";

CartEditModal.propTypes = {
  model: PropTypes.object.isRequired,
  closeModel: PropTypes.func.isRequired,
  cart: PropTypes.array.isRequired,
};

function CartEditModal({ cart, model, closeModel }) {
  const [selectProductDetail, setSelectProductDetail] = useState(
    model.data.selectProductDetail
  );

  const dispatch = useDispatch();

  const { product } = model.data;

  const handleUpdateCartItemClick = () => {
    if (!selectProductDetail.selectedSize) {
      toast("Please select size.", {
        ...PRODUCT_TOAST_OPTIONS,
      });
      return;
    }

    const { quantity } = product.productDetail
      .find((item) => item.color.color === selectProductDetail.selectedColor)
      .sizeAndQuantity.find(
        (item) => item.size.size === selectProductDetail.selectedSize
      );

    if (quantity === 0) {
      toast("Current size are currently out of stock", {
        ...PRODUCT_TOAST_OPTIONS,
      });
      return;
    }

    // current cart item index
    const cartItemIndex = cart.findIndex(
      (item) =>
        item._id === product._id &&
        item.selectedColor === product.selectedColor &&
        item.selectedSize === product.selectedSize
    );

    if (
      product.selectedColor === selectProductDetail.selectedColor &&
      product.selectedSize !== selectProductDetail.selectedSize
    ) {
      // cart item index exist in cart
      const cartItemExistIndex = cart.findIndex(
        (productItem) =>
          productItem._id === product._id &&
          productItem.selectedColor === selectProductDetail.selectedColor &&
          productItem.selectedSize === selectProductDetail.selectedSize
      );

      if (cartItemExistIndex >= 0) {
        // change when has the same item
        // update cart item exist and remove item changed
        dispatch(
          selectQuantity({
            cartItemIndex: cartItemExistIndex,
            quantity:
              cart[cartItemIndex].selectedQuantity +
              cart[cartItemExistIndex].selectedQuantity,
            currentProductIndex: cartItemIndex,
          })
        );
      } else {
        const size = selectProductDetail.selectedSize;
        dispatch(selectSize({ cartItemIndex, size }));
      }
    }

    if (product.selectedColor !== selectProductDetail.selectedColor) {
      // cart item index exist in cart
      const cartItemExistIndex = cart.findIndex(
        (productItem) =>
          productItem._id === product._id &&
          productItem.selectedColor === selectProductDetail.selectedColor &&
          productItem.selectedSize === selectProductDetail.selectedSize
      );

      if (cartItemExistIndex >= 0) {
        // change when has the same item
        // update cart item exist and remove item changed
        dispatch(
          selectQuantity({
            cartItemIndex: cartItemExistIndex,
            quantity:
              cart[cartItemIndex].selectedQuantity +
              cart[cartItemExistIndex].selectedQuantity,
            currentProductIndex: cartItemIndex,
          })
        );
      } else {
        const color = selectProductDetail.selectedColor;
        const size = selectProductDetail.selectedSize;
        dispatch(updateToCart({ cartItemIndex, color, size }));
      }
    }

    toast("Product updated to cart", {
      ...PRODUCT_TOAST_OPTIONS,
    });

    closeModel();
  };

  return (
    <div className="animation-fade-in" style={{ ...STYLE_MODEL }}>
      <div className="CartEditModal">
        {/* close icon */}
        <div onClick={() => closeModel()} className="CartEditModal__close">
          <i className="bx bx-x" />
        </div>

        {/* Product Image List */}

        <Slider className="CartEditModal__list" {...sliderSettings}>
          {product.productDetail
            .find(
              ({ color }) => color.color === selectProductDetail.selectedColor
            )
            .images.map((img) => (
              <img key={img} src={img} alt={img} />
            ))}
        </Slider>

        {/* Product title */}

        <div className="CartEditModal__title">
          <div>{capitalizeFirstLetter(product.category.name)}</div>
          <div>{product.name}</div>
        </div>

        {/* Product color */}

        <div className="CartEditModal__color">
          <header>Select Color</header>
          <section>
            {product.productDetail.map(({ color }) => (
              <div
                key={color.color}
                className="shadow"
                onClick={() =>
                  setSelectProductDetail({
                    ...selectProductDetail,
                    selectedColor: color.color,
                    selectedSize: null,
                  })
                }
                style={
                  selectProductDetail.selectedColor === color.color
                    ? {
                        backgroundColor: color.color,
                        border: "2px solid orange",
                        transform: "scale(1.05)",
                      }
                    : { backgroundColor: color.color }
                }
              />
            ))}
          </section>
        </div>

        {/* Product size */}

        <div className="CartEditModal__size">
          <header>Select Size</header>
          <section>
            {product?.productDetail
              .find(
                (item) => item.color.color === selectProductDetail.selectedColor
              )
              .sizeAndQuantity.map(({ size }) => (
                <div
                  className="shadow"
                  key={size.size}
                  onClick={() =>
                    setSelectProductDetail({
                      ...selectProductDetail,
                      selectedSize: size.size,
                    })
                  }
                  style={
                    selectProductDetail?.selectedSize === size.size
                      ? {
                          backgroundColor: "#000",
                          color: "white",
                          transform: "scale(1.08)",
                        }
                      : {}
                  }
                >
                  {size.size}
                  <span className="icon">&nbsp;</span>
                </div>
              ))}
          </section>
        </div>

        {/* Product description */}

        <div className="CartEditModal__description">
          <header>Description</header>
          <p>{product.description}</p>
        </div>

        <div className="CartEditModal__button">
          <button onClick={handleUpdateCartItemClick}>
            <div>
              <i className="bx bx-basket" />
              {`$${(
                product.salePrice *
                ((100 - product.promotionPercent) / 100)
              ).toFixed(2)} - Update to Cart`}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartEditModal;
