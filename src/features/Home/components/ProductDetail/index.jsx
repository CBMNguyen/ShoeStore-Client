import { PRODUCT_TOAST_OPTIONS } from "constants/globals";
import { addToCart } from "features/Cart/cartSlice";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "utils/common";
import "./productdetail.scss";

ProductDetail.propTypes = {
  product: PropTypes.object.isRequired,
  showModel: PropTypes.func.isRequired,
};

function ProductDetail(props) {
  const { product, showModel } = props;

  const { cart } = useSelector((state) => state.cart);

  const [select, setSelect] = useState({
    selectedSize: null,
    selectedColor: null,
    selectedQuantity: 1,
  });

  const dispatch = useDispatch();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleAddtoCart = (product) => {
    const index = cart.findIndex((c) => c._id === product._id);

    if (!select.selectedSize) {
      toast.warning("🧦 Please select size.", {
        ...PRODUCT_TOAST_OPTIONS,
      });
      return;
    }

    if (!select.selectedColor) {
      toast.warning("🧦 Please select color.", {
        ...PRODUCT_TOAST_OPTIONS,
      });
      return;
    }

    if (index >= 0) {
      toast.warning("🧦 Product already in the cart.", {
        ...PRODUCT_TOAST_OPTIONS,
      });
      return;
    }

    dispatch(addToCart({ ...product, ...select }));
  };

  return (
    <div className="ProductDetail">
      <Slider className="ProductDetail__list" {...settings}>
        {product.images.map((img) => (
          <img
            key={img}
            src={`${process.env.REACT_APP_API_URL}/${img}`}
            alt={img}
            onClick={() => showModel(product)}
          />
        ))}
      </Slider>

      <div className="ProductDetail__title">
        <div>{capitalizeFirstLetter(product.category.name)}</div>
        <div>{product.name}</div>
      </div>

      <div className="ProductDetail__size">
        <header>Select Size</header>
        <section>
          {product.size.map((s) => (
            <div
              className="shadow"
              key={s.size}
              onClick={() => setSelect({ ...select, selectedSize: s.size })}
              style={
                select.selectedSize === s.size
                  ? {
                      backgroundColor: "#000",
                      color: "white",
                      transform: "scale(1.08)",
                    }
                  : {}
              }
            >
              {s.size}
            </div>
          ))}
        </section>
      </div>

      <div className="ProductDetail__color">
        <header>Select Color</header>
        <section>
          {product.color.map((c) => (
            <div
              key={c.color}
              className="shadow"
              onClick={() => setSelect({ ...select, selectedColor: c.color })}
              style={
                select.selectedColor === c.color
                  ? {
                      backgroundColor: c.color,
                      border: "2px solid orange",
                      transform: "scale(1.05)",
                    }
                  : { backgroundColor: c.color }
              }
            />
          ))}
        </section>
      </div>

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
