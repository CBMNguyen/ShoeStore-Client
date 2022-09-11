import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { Col } from "reactstrap";
import "./color.scss";

ColorItem.propTypes = {
  color: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired,
  onColorChange: PropTypes.func,
};

ColorItem.defaultProps = {
  onColorChange: null,
};

function ColorItem(props) {
  const { color, filter, onColorChange } = props;
  const isSelectedColor = color["color"] === filter.color;
  const handleColorChange = (color) => {
    if (!onColorChange) return;
    onColorChange(color);
  };

  return (
    <Col className="col-md-auto col-lg-3">
      <div
        style={{
          backgroundColor: `${color["color"]}`,
          transform: isSelectedColor ? "scale(1.25)" : "",
        }}
        className={classNames("Color border shadow-sm", {
          "shadow-lg border-3": isSelectedColor,
        })}
        onClick={() => handleColorChange(color["color"])}
      />
    </Col>
  );
}

export default ColorItem;
