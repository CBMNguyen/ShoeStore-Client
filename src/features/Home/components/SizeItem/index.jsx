import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { Col } from "reactstrap";

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

  const handleSizeChange = (size) => {
    if (!onSizeChange) return;
    onSizeChange(size);
  };

  return (
    <Col key={size["size"]} md="3">
      <div
        style={{
          width: "2.2rem",
          height: "2.2rem",
          margin: "0.5rem 0",
          borderRadius: "0.2rem",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: "#eee",
          verticalAlign: "middle",
        }}
        className={classNames("border shadow", {
          "border-secondary border-2": size["size"] === filter["size"],
        })}
        onClick={() => handleSizeChange(size["size"])}
      >
        <span
          style={{
            textAlign: "center",
            fontSize: "0.9rem",
            fontWeight: "400",
          }}
        >
          {size["size"]}
        </span>
      </div>
    </Col>
  );
}

export default SizeItem;
