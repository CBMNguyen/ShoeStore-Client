import PropTypes from "prop-types";
import React from "react";
import { Badge } from "reactstrap";

OrderList.propTypes = {
  product: PropTypes.object.isRequired,
};

function OrderList(props) {
  const { product } = props;
  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          <img
            src={`${process.env.REACT_APP_API_URL}/${product.images[0]}`}
            alt={product._id}
          />

          <div className="ms-4 mt-3">
            <Badge className="bg-dark d-block">{product.name}</Badge>
            <Badge className="bg-warning">{product.originalPrice}$</Badge>
          </div>
        </div>
      </td>

      <td>
        <Badge className="bg-secondary ms-3">{product.selectedQuantity}</Badge>
      </td>

      <td>
        <Badge className="bg-warning">
          {product.selectedQuantity * product.originalPrice}$
        </Badge>
      </td>
    </tr>
  );
}

export default OrderList;
