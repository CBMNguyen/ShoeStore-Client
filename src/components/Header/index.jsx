import { logOut } from "app/userSlice";
import { PRODUCT_TOAST_OPTIONS } from "constants/globals";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Badge, Input, Tooltip } from "reactstrap";
import avt from "../../assets/images/avt.jpg";
import "./header.scss";

Header.propTypes = {
  onNameChange: PropTypes.func,
  showModel: PropTypes.func.isRequired,
};

Header.defaultProps = {
  onNameChange: null,
};

function Header(props) {
  const dispatch = useDispatch();
  const [value, setValue] = useState();
  const history = useHistory();

  // tooltip log out
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  const timeoutId = useRef(null);
  const { onNameChange, showModel } = props;

  const { cart } = useSelector((state) => state.cart);
  const { token, user } = useSelector((state) => state.user);

  // Search Input filter product

  const handleInputChange = (e) => {
    const productName = e.target.value;
    setValue(e.target.value);

    if (!onNameChange) return;
    if (timeoutId.current) clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(() => {
      onNameChange(productName);
    }, 500);
  };

  // handle log out

  const handleLogout = () => {
    dispatch(logOut());
    toast.warning("🦄 See you a gain ... 🐱‍🏍", { ...PRODUCT_TOAST_OPTIONS });
  };

  return (
    <div className="Header Container">
      <div className="Header__logo">
        <h2>
          <Link to="/">Shoes Store🧦</Link>
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
          onClick={() => showModel()}
          src={
            !token
              ? avt
              : user.image
              ? `${process.env.REACT_APP_API_URL}/${user.image}`
              : user.imageUrl
          }
          alt="#"
        />

        <i
          onClick={handleLogout}
          className="bx bx-power-off"
          id="TooltipExample"
        />

        <Tooltip
          placement="bottom"
          isOpen={tooltipOpen}
          target="TooltipExample"
          toggle={toggle}
        >
          Log out.
        </Tooltip>
      </div>
    </div>
  );
}

export default Header;
