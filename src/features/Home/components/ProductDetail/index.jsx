import { PRODUCT_TOAST_OPTIONS } from "constants/globals";
import { addToCart, selectQuantity } from "features/Cart/cartSlice";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { toast } from "react-toastify";
import { capitalizeFirstLetter, sliderSettings } from "utils/common";
import "./productdetail.scss";

ProductDetail.propTypes = {
  product: PropTypes.object.isRequired,
  showModel: PropTypes.func.isRequired,
  selectProductDetail: PropTypes.object.isRequired,
  setSelectProductDetail: PropTypes.func.isRequired,
  productDetailModel: PropTypes.object.isRequired,
};

function ProductDetail(props) {
  const {
    product,
    showModel,
    selectProductDetail,
    setSelectProductDetail,
    productDetailModel,
  } = props;

  const { cart } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const handleAddtoCart = async (product) => {
    if (!selectProductDetail.selectedColor) {
      toast.warning("Please select color.", {
        ...PRODUCT_TOAST_OPTIONS,
      });
      return;
    }

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

    const cartItemIndex = cart.findIndex(
      (productItem) =>
        productItem._id === product._id &&
        productItem.selectedColor === selectProductDetail.selectedColor &&
        productItem.selectedSize === selectProductDetail.selectedSize
    );

    if (cartItemIndex >= 0) {
      const quantity = cart[cartItemIndex].selectedQuantity + 1;
      dispatch(selectQuantity({ cartItemIndex, quantity }));
      toast("Product added to cart", {
        ...PRODUCT_TOAST_OPTIONS,
      });

      return;
    }

    await dispatch(addToCart({ ...product, ...selectProductDetail }));
    toast("Product added to cart", {
      ...PRODUCT_TOAST_OPTIONS,
    });

    if (productDetailModel.model.show) {
      productDetailModel.closeModel();
    }
  };

  return (
    <div
      className={
        productDetailModel.model.show
          ? "ProductDetail ProductDetail__modal d-block"
          : "ProductDetail d-none d-xl-block"
      }
    >
      {/* Product Image List */}

      <Slider className="ProductDetail__list" {...sliderSettings}>
        {product.productDetail
          .find(
            ({ color }) => color.color === selectProductDetail.selectedColor
          )
          .images.map((img) => (
            <img
              key={img}
              src={img}
              alt={img}
              onClick={() =>
                !productDetailModel.model.show && showModel(product)
              }
            />
          ))}
      </Slider>

      {/* Product title */}

      <div className="ProductDetail__title">
        <div>{capitalizeFirstLetter(product.category.name)}</div>
        <div>{product.name}</div>
      </div>

      {/* Product color */}

      <div className="ProductDetail__color">
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

      <div className="ProductDetail__size">
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

      <div className="ProductDetail__description">
        <header>Description</header>
        <p>{product.description}</p>
      </div>

      <div
        onClick={() => handleAddtoCart(product)}
        className="ProductDetail__button"
      >
        <button>
          <div>
            <i className="bx bx-basket" />
            {`$${product.originalPrice} - Add to Cart`}
          </div>
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
