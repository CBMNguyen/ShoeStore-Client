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
  showModel: PropTypes.func,
};

ProductItem.defaultProps = {
  onSelectProduct: null,
  showModel: null,
};

function ProductItem(props) {
  const [imageIndex, setImageIndex] = useState(0);

  const {
    product,
    border,
    setBorder,
    selectedProductId,
    onSelectProduct,
    showModel,
  } = props;

  const handleSelectProduct = (product) => {
    if (!onSelectProduct) return;
    onSelectProduct(product);
  };

  const handleShowModel = (data) => {
    if (!showModel) return;
    showModel(data);
  };

  return (
    <Col md={4} className="mb-3">
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
          onClick={() => handleShowModel(product)}
          className="ProductItem__image"
          src={`${process.env.REACT_APP_API_URL}/${product.images[imageIndex]}`}
          alt={product._id}
        />

        {/* Product Price */}

        <div className="ProductItem__price">
          <section>
            {" "}
            <div>Price</div>
            <div>{`${product.originalPrice}$`}</div>
          </section>

          {/* Selected Product small image */}

          <section>
            {product.images.map((image, index) => (
              <img
                key={image}
                style={
                  product._id === selectedProductId && imageIndex === index
                    ? { border: "2px solid black" }
                    : {}
                }
                id={product._id}
                onClick={(e) => setImageIndex(index)}
                src={`${process.env.REACT_APP_API_URL}/${product.images[index]}`}
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
