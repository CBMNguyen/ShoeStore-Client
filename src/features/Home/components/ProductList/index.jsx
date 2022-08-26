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
  showProductDetailModel: PropTypes.func.isRequired,
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
    showProductDetailModel,
    showFilterModal,
    setShowFilterModal,
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
        <div className="d-flex align-items-center">
          <label htmlFor="nav-mobile-input" className="nav__mobile-btn me-2">
            <i
              onClick={() => setShowFilterModal(true)}
              className="bx bx-menu d-lg-none"
              style={{ fontSize: "2.2rem", marginLeft: "-4px" }}
            />

            <label
              onClick={() => setShowFilterModal(false)}
              htmlFor="nav-mobile-input"
              className={
                showFilterModal ? "nav__over-lay d-block" : "nav__over-lay"
              }
            ></label>
          </label>

          <h3 className="mb-1">New Arrivals</h3>
        </div>
        <div>
          <div className="d-none d-md-block">
            <Pagination
              filter={filter}
              totalRow={totalRow}
              onPageChange={onPageChange}
            />
          </div>

          <Button
            type="button"
            className="btn btn-light btn-sm mx-4 ProductList__button"
            onClick={handleSortPriceClick}
          >
            <div className="d-flex align-items-center">
              <span>Sort by Price</span>
              {filter.isIncreasePrice > 0 ? (
                <i className="bx bx-chevron-up" />
              ) : (
                <i className="bx bx-chevron-down" />
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
              showProductDetailModel={showProductDetailModel}
              key={product._id}
              product={product}
              border={border}
              setBorder={setBorder}
              onSelectProduct={onSelectProduct}
              selectedProductId={filter.selectedProduct?._id}
            />
          ))}
        {/*  */}
        <div className="d-md-none d-flex justify-content-center mt-4">
          <Pagination
            filter={filter}
            totalRow={totalRow}
            onPageChange={onPageChange}
          />
        </div>

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
