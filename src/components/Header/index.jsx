import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Badge, Input } from "reactstrap";
import "./header.scss";

Header.propTypes = {
  onNameChange: PropTypes.func,
};

Header.defaultProps = {
  onNameChange: null,
};

function Header(props) {
  const [value, setValue] = useState();
  const history = useHistory();

  const timeoutId = useRef(null);
  const { onNameChange } = props;

  const { cart } = useSelector((state) => state.cart);

  const handleInputChange = (e) => {
    const productName = e.target.value;
    setValue(e.target.value);

    if (!onNameChange) return;
    if (timeoutId.current) clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(() => {
      onNameChange(productName);
    }, 500);
  };

  return (
    <div className="Header Container">
      <div className="Header__logo">
        <h2>
          <a href="/">Shoes Store🧦</a>
        </h2>
      </div>
      <div className="Header__input">
        <i className="bx bx-search" />
        <Input
          onChange={handleInputChange}
          value={value}
          placeholder="Search name product ... 🧦"
        />
      </div>
      <div className="Header__info">
        <div>
          <i
            onClick={() => history.push("/cart")}
            className="bx bx-basket animate__animated animate__swing"
          >
            <Badge className="bg-danger rounded-circle" size="sm">
              {cart.length}
            </Badge>
          </i>
        </div>
        <img
          src="data:image/jpeg;base64,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"
          alt="#"
        />
      </div>
    </div>
  );
}

export default Header;
