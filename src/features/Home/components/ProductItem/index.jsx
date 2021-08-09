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
  const [imageIndex, setImageIndex] = useState({ id: "", index: null });

  const { product, border, setBorder, onSelectProduct, showModel } = props;

  const handleSelectProduct = (product) => {
    if (!onSelectProduct) return;
    onSelectProduct(product);
  };

  const handleShowModel = (data) => {
    if (!showModel) return;
    showModel(data);
  };

  return (
    <Col md={4} className="mb-4">
      <div
        className="ProductItem"
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
          src={`${process.env.REACT_APP_API_URL}/${
            product.images[product._id === imageIndex.id ? imageIndex.index : 0]
          }`}
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
            <img
              style={
                product._id === imageIndex.id && imageIndex.index === 0
                  ? { border: "2px solid black" }
                  : {}
              }
              id={product._id}
              onClick={(e) => setImageIndex({ id: e.target.id, index: 0 })}
              src={`${process.env.REACT_APP_API_URL}/${product.images[0]}`}
              alt={product._id}
            />

            <img
              style={
                product._id === imageIndex.id && imageIndex.index === 1
                  ? { border: "2px solid black" }
                  : {}
              }
              id={product._id}
              onClick={(e) => setImageIndex({ id: e.target.id, index: 1 })}
              src={`${process.env.REACT_APP_API_URL}/${product.images[1]}`}
              alt={product._id}
            />

            <img
              style={
                product._id === imageIndex.id && imageIndex.index === 2
                  ? { border: "2px solid black" }
                  : {}
              }
              id={product._id}
              onClick={(e) => setImageIndex({ id: e.target.id, index: 2 })}
              src={`${process.env.REACT_APP_API_URL}/${product.images[2]}`}
              alt={product._id}
            />
          </section>
        </div>
      </div>
    </Col>
  );
}

export default ProductItem;
