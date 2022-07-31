import Pagination from "components/Pagination";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Button, Row } from "reactstrap";
import ProductItem from "../ProductItem";
import "./productlist.scss";
import noResultFound from "../../../../assets/images/noResultFound.png";

ProductList.propTypes = {
  totalRow: PropTypes.number.isRequired,
  products: PropTypes.array.isRequired,
  filter: PropTypes.object.isRequired,
  onInCreasePriceChange: PropTypes.func.isRequired,
  onSelectProduct: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onResetFilter: PropTypes.func.isRequired,
};

function ProductList(props) {
  const {
    totalRow,
    products,
    filter,
    onInCreasePriceChange,
    onSelectProduct,
    onPageChange,
    onResetFilter,
    showModel,
  } = props;

  const [border, setBorder] = useState(products[0]?._id || "");

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
          <Pagination
            filter={filter}
            totalRow={totalRow}
            onPageChange={onPageChange}
          />

          <Button
            type="button"
            className="btn btn-light btn-sm mx-4"
            onClick={handleSortPriceClick}
          >
            <div className="d-flex align-items-center">
              <span>Sort by Price</span>
              {filter.isIncreasePrice > 0 ? (
                <i className="bx bx-chevron-down" />
              ) : (
                <i className="bx bx-chevron-up" />
              )}
            </div>
          </Button>

          <Button
            onClick={() => onResetFilter()}
            type="button"
            className="btn btn-dark btn-sm"
          >
            Clear
          </Button>
        </div>
      </header>
      <Row className="gx-2 gy-2">
        {products.length > 0 &&
          products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              border={border}
              setBorder={setBorder}
              onSelectProduct={onSelectProduct}
              selectedProductId={filter.selectedProduct?._id}
            />
          ))}

        {products.length === 0 && (
          <img
            style={{
              width: "100%",
              height: "400px",
              objectFit: "contain",
              marginTop: "5rem",
            }}
            src={noResultFound}
            alt="noResultFound"
          />
        )}
      </Row>
    </div>
  );
}

export default ProductList;
