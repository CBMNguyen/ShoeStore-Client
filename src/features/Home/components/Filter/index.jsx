import React, { useState } from "react";
import PropTypes from "prop-types";
import "./filter.scss";
import { Row, Col } from "reactstrap";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import { capitalizeFirstLetter } from "utils/common";

Filter.propTypes = {
  color: PropTypes.array.isRequired,
  category: PropTypes.array.isRequired,
  size: PropTypes.array.isRequired,
  minPrice: PropTypes.number.isRequired,
  maxPrice: PropTypes.number.isRequired,

  onColorChange: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onSizeChange: PropTypes.func.isRequired,
  onPriceChange: PropTypes.func.isRequired,
};

function Filter(props) {
  const [value, setValue] = useState({ min: 200, max: 800 });
  const {
    color,
    category,
    size,
    minPrice,
    maxPrice,
    onColorChange,
    onSizeChange,
    onCategoryChange,
    onPriceChange,
  } = props;

  return (
    <ul className="Filter">
      <li>
        <span className="d-block">Brand</span>
        {category.map((c, i) => (
          <div className="ms-2" key={c.name}>
            {i === 0 && (
              <div>
                {" "}
                <input
                  id=""
                  type="radio"
                  name="category"
                  defaultChecked={true}
                  onChange={(e) => onCategoryChange(e.target.id)}
                />
                <label className="ms-2" htmlFor={c.name}>
                  All
                </label>
              </div>
            )}
            <input
              id={c.name}
              type="radio"
              name="category"
              onChange={(e) => onCategoryChange(e.target.id)}
            />
            <label className="ms-2" htmlFor={c.name}>
              {capitalizeFirstLetter(c.name)}
            </label>
          </div>
        ))}
      </li>
      <li>
        <span className="d-block mb-5">Price Range</span>
        <InputRange
          minValue={minPrice}
          maxValue={maxPrice}
          value={value}
          onChange={(value) => {
            setValue(value);
            const price = {
              minPrice: value.min,
              maxPrice: value.max,
            };
            onPriceChange(price);
          }}
          formatLabel={(value) => `${value}$`}
        />
        <span className="d-block mt-5" />
      </li>
      <li className="Filter__color">
        <span className="d-block mb-2">Color</span>
        <Row>
          {color.map((c) => (
            <Col key={c.color} md="3">
              <div
                style={{
                  backgroundColor: `${c.color}`,
                  width: "2rem",
                  height: "2rem",
                  margin: "0.5rem 0",
                  borderRadius: "0.2rem",
                  cursor: "pointer",
                }}
                className="border shadow"
                onClick={() => onColorChange(c.color)}
              />
            </Col>
          ))}
        </Row>
        <span className="d-block mb-3" />
      </li>
      <li>
        <span className="d-block  mb-3">Size</span>
        <Row>
          {size.map((s) => (
            <Col key={s.size} md="3">
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  margin: "0.5rem 0",
                  borderRadius: "0.2rem",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                className="border shadow"
                onClick={() => onSizeChange(s.size)}
              >
                {s.size}
              </div>
            </Col>
          ))}
        </Row>
        <span className="d-block mb-2" />
      </li>
    </ul>
  );
}

export default Filter;
