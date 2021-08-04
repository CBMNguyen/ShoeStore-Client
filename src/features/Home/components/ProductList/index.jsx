import PropTypes from "prop-types";
import React, { useState } from "react";
import { Row } from "reactstrap";
import ProductItem from "../ProductItem";
import "./productlist.scss";

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  filter: PropTypes.object.isRequired,
  onInCreasePriceChange: PropTypes.func,
};

function ProductList(props) {
  const [border, setBorder] = useState("61056d6d691a953968d55bc2");
  const { products, filter, onInCreasePriceChange } = props;

  const handleSortPriceClick = () => {
    const price = 1;
    if (!onInCreasePriceChange) return;
    if (filter.isIncreasePrice === 0) onInCreasePriceChange(price);
    else onInCreasePriceChange(filter.isIncreasePrice * -1);
  };

  return (
    <div className="ProductList">
      <header>
        <h3>New Arrivals</h3>
        <div>
          <span>Sort by Price</span>
          {filter.isIncreasePrice > 0 ? (
            <i onClick={handleSortPriceClick} className="bx bx-chevron-down" />
          ) : (
            <i onClick={handleSortPriceClick} className="bx bx-chevron-up" />
          )}
        </div>
      </header>
      <Row>
        {products.map((product) => (
          <ProductItem
            key={product._id}
            product={product}
            border={border}
            setBorder={setBorder}
          />
        ))}
      </Row>
    </div>
  );
}

export default ProductList;
