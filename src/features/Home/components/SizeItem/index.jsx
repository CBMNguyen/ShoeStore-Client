import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { Col } from "reactstrap";
import "./size.scss";

SizeItem.propTypes = {
  size: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired,
  onSizeChange: PropTypes.func,
};

SizeItem.defaultProps = {
  onSizeChange: null,
};

function SizeItem(props) {
  const { size, filter, onSizeChange } = props;
  const isSelectedSize = size["size"] === filter["size"];

  const handleSizeChange = (size) => {
    if (!onSizeChange) return;
    onSizeChange(size);
  };

  return (
    <Col key={size["size"]} className="col-md-auto col-lg-3">
      <div
        className={classNames("Size border shadow-sm", {
          "bg-dark text-white shadow-lg": isSelectedSize,
        })}
        onClick={() => handleSizeChange(size["size"])}
      >
        {size["size"]}
      </div>
    </Col>
  );
}

export default SizeItem;
