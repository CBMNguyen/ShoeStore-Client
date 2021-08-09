import PropTypes from "prop-types";
import React from "react";
import { capitalizeFirstLetter } from "utils/common";

CategoryItem.propTypes = {
  index: PropTypes.number.isRequired,
  category: PropTypes.object.isRequired,
  onCategoryChange: PropTypes.func,
};

CategoryItem.defaultProps = {
  onCategoryChange: null,
};

function CategoryItem(props) {
  const { index, category, onCategoryChange } = props;

  const handleCategoryChange = (id) => {
    if (!onCategoryChange) return;
    onCategoryChange(id);
  };

  return (
    <div className="ms-2">
      {index === 0 && (
        <div>
          {" "}
          <input
            id="all"
            type="radio"
            name="category"
            defaultChecked={true}
            onChange={() => handleCategoryChange("")}
          />
          <label className="ms-1" htmlFor="all">
            All
          </label>
        </div>
      )}

      <input
        id={category.name}
        type="radio"
        name="category"
        onChange={(e) => handleCategoryChange(e.target.id)}
      />

      <label className="ms-1" htmlFor={category.name}>
        {capitalizeFirstLetter(category.name)}
      </label>
    </div>
  );
}

export default CategoryItem;
