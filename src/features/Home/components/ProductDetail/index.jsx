import { PRODUCT_TOAST_OPTIONS } from "constants/globals";
import { addToCart } from "features/Cart/cartSlice";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "utils/common";
import "./productdetail.scss";

ProductDetail.propTypes = {
  product: PropTypes.object.isRequired,
  showModel: PropTypes.func.isRequired,
  selectProductDetail: PropTypes.object.isRequired,
  setSelectProductDetail: PropTypes.func.isRequired,
};

function ProductDetail(props) {
  const { product, showModel, selectProductDetail, setSelectProductDetail } =
    props;

  const { cart } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleAddtoCart = async (product) => {
    const index = cart.findIndex((c) => c._id === product._id);

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

    if (index >= 0) {
      toast("Product already in the cart.", {
        ...PRODUCT_TOAST_OPTIONS,
      });
      return;
    }

    await dispatch(addToCart({ ...product, ...selectProductDetail }));
  };

  return (
    <div className="ProductDetail">
      {/* Product Image List */}

      <Slider className="ProductDetail__list" {...settings}>
        {product.productDetail[0].images.map((img) => (
          <img
            key={img}
            src={img}
            alt={img}
            onClick={() => showModel(product)}
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
                <span class="icon">&nbsp;</span>
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
            {`${product.originalPrice}$ - Add to Cart`}
          </div>
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
