import PropTypes from "prop-types";
import React, { useState } from "react";
import { Col } from "reactstrap";
import { capitalizeFirstLetter } from "utils/common";
import "./productitem.scss";

ProductItem.propTypes = {
  product: PropTypes.object.isRequired,
  border: PropTypes.string.isRequired,
  setBorder: PropTypes.func.isRequired,
  onSelectProduct: PropTypes.func,
};

ProductItem.defaultProps = {
  onSelectProduct: null,
};

function ProductItem(props) {
  const [imageIndex, setImageIndex] = useState(0);

  const { product, border, setBorder, selectedProductId, onSelectProduct } =
    props;

  const handleSelectProduct = (product) => {
    if (!onSelectProduct) return;
    onSelectProduct(product);
  };

  return (
    <Col xl={4} lg={6} md={6} sm={12}>
      <div
        className="ProductItem shadow-sm"
        onClick={() => {
          setBorder(product._id);
          handleSelectProduct(product);
        }}
      >
        {/* Product header */}

        <header>
          <section
            style={
              border === product._id ? { borderLeft: "3px solid orange" } : {}
            }
          >
            <div>{product.name}</div>
            <div>{capitalizeFirstLetter(product.category.name)}</div>
          </section>
        </header>

        {/* Product Image */}

        <img
          className="ProductItem__image"
          src={product.productDetail[0].images[imageIndex]}
          alt={product._id}
        />

        {/* Product Price */}

        <div className="ProductItem__price">
          <section>
            {" "}
            <div>Price</div>
            <div>
              {product.promotionPercent !== 0 && (
                <div>${product.salePrice * ((100 - 5) / 100)}</div>
              )}
              <div className={`${product.promotionPercent !== 0 && "active"}`}>
                ${`${product.salePrice}`}
              </div>
            </div>
          </section>

          {/* Selected Product small image */}

          <section>
            {product.productDetail[0].images.map((image, index) => (
              <img
                key={image}
                style={
                  product._id === selectedProductId && imageIndex === index
                    ? { border: "2px solid #ccc" }
                    : {}
                }
                id={product._id}
                onClick={(e) => setImageIndex(index)}
                src={product.productDetail[0].images[index]}
                alt={product._id}
              />
            ))}
          </section>
        </div>
      </div>
    </Col>
  );
}

export default ProductItem;
