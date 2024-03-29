import Pagination from "components/Pagination";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Button, Row } from "reactstrap";
import noResultFound from "../../../../assets/images/noResultFound.png";
import ProductItem from "../ProductItem";
import "./productlist.scss";

ProductList.propTypes = {
  totalRow: PropTypes.number.isRequired,
  products: PropTypes.array.isRequired,
  filter: PropTypes.object.isRequired,
  onInCreasePriceChange: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onResetFilter: PropTypes.func.isRequired,
};

function ProductList(props) {
  const {
    totalRow,
    products,
    filter,
    onInCreasePriceChange,
    onPageChange,
    onResetFilter,
    showFilterModal,
    setShowFilterModal,
  } = props;

  const [selectedProduct, setSelectedProduct] = useState(
    products[0]?._id || ""
  );

  const handleSortPriceClick = () => {
    const price = 1;
    if (!onInCreasePriceChange) return;
    if (filter.isIncreasePrice === 0) onInCreasePriceChange(price);
    else onInCreasePriceChange(filter.isIncreasePrice * -1);
  };
  return (
    <div className="ProductList">
      <Breadcrumb className="ms-2" style={{ marginBottom: "0 !important" }}>
        <BreadcrumbItem>
          <Link to="/" className="text-decoration-none">
            <code>Home</code>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>
          <code>Products</code>
        </BreadcrumbItem>
      </Breadcrumb>

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

          <h3 className="mb-0">All Products</h3>
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
            className="btn btn-light btn-sm mx-4 ProductList__button shadow-sm"
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
            className="btn btn-dark btn-sm shadow-sm"
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
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
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
