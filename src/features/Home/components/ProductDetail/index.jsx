import PropTypes from "prop-types";
import React from "react";
import Slider from "react-slick";
import { capitalizeFirstLetter } from "utils/common";
import "./productdetail.scss";

ProductDetail.propTypes = {
  product: PropTypes.object.isRequired,
  showModel: PropTypes.func.isRequired,
};

function ProductDetail(props) {
  const { product, showModel } = props;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
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
            <div key={s.size}>{s.size}</div>
          ))}
        </section>
      </div>

      <div className="ProductDetail__color">
        <header>Select Color</header>
        <section>
          {product.color.map((c) => (
            <div
              key={c.color}
              className="border border-2"
              style={{ backgroundColor: c.color }}
            />
          ))}
        </section>
      </div>

      <div className="ProductDetail__description">
        <header>Description</header>
        <p>{product.description}</p>
      </div>

      <div className="ProductDetail__button">
        <button>
          <div>
            <i className="bx bx-cart" />
            {`${product.originalPrice}$ - Add to Cart`}
          </div>
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
