import PropTypes from "prop-types";
import React from "react";
import { Badge } from "reactstrap";
import "./orderlist.scss";

OrderList.propTypes = {
  product: PropTypes.object.isRequired,
};

function OrderList(props) {
  const { product } = props;
  return (
    <tr className="OrderList">
      <td>
        <div
          className="d-flex align-items-center"
          style={{ overflow: "hidden" }}
        >
          <img
            className="OrderList__img"
            src={`${product.productDetail[0].images[0]}`}
            alt={product._id}
          />

          <div className="ms-4 mt-2">
            <Badge className="bg-dark d-block">{product.name}</Badge>
            <Badge className="bg-warning">{product.originalPrice}$</Badge>
          </div>
        </div>
      </td>

      <td>
        <Badge className="bg-dark ms-3">{product.selectedSize}</Badge>
      </td>

      <td>
        <Badge className="bg-info ms-3">{product.selectedQuantity}</Badge>
      </td>

      <td>
        <Badge className="bg-warning">
          {`$${(
            product.selectedQuantity *
            product.salePrice *
            ((100 - product.promotionPercent) / 100)
          ).toFixed(2)}`}
        </Badge>
      </td>
    </tr>
  );
}

export default OrderList;
