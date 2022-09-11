import React from "react";
import PropTypes from "prop-types";
import ProductItem from "../ProductItem";
import { Container, Row } from "reactstrap";

RecentViewProduct.propTypes = {
  products: PropTypes.array,
};

function RecentViewProduct({
  products,
  selectedProduct,
  setSelectedProduct,
  title,
}) {
  return (
    <div>
      {products.length > 0 && (
        <Container>
          <h3 className="text-uppercase mt-4">{title}</h3>
          <Row className="my-5">
            {products.map((product) => (
              <ProductItem
                key={product._id}
                product={product}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
              />
            ))}
          </Row>
        </Container>
      )}
    </div>
  );
}

export default RecentViewProduct;
