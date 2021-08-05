import PropTypes from "prop-types";
import React, { useState } from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import { Row } from "reactstrap";
import CategoryItem from "../CategoryItem";
import ColorItem from "../ColorItem";
import SizeItem from "../SizeItem";
import "./filter.scss";

Filter.propTypes = {
  color: PropTypes.array.isRequired,
  category: PropTypes.array.isRequired,
  size: PropTypes.array.isRequired,
  filter: PropTypes.object.isRequired,
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
    filter,
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
          <CategoryItem
            key={c.name}
            index={i}
            category={c}
            onCategoryChange={onCategoryChange}
          />
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
            <ColorItem
              key={c.color}
              color={c}
              onColorChange={onColorChange}
              filter={filter}
            />
          ))}
        </Row>
        <span className="d-block mb-3" />
      </li>

      <li>
        <span className="d-block  mb-2">Size</span>
        <Row>
          {size.map((s) => (
            <SizeItem
              key={s.size}
              size={s}
              filter={filter}
              onSizeChange={onSizeChange}
            />
          ))}
        </Row>
        <span className="d-block mb-1" />
      </li>
    </ul>
  );
}

export default Filter;
