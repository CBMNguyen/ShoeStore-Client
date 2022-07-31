import Map from "components/Map";
import useModel from "hooks/useModel";
import jwt from "jsonwebtoken";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Badge, Input } from "reactstrap";
import avt from "../../assets/images/avt.jpg";
import brandLogo from "../../assets/images/brandLogo.png";
import "./header.scss";

Header.propTypes = {
  onNameChange: PropTypes.func,
  showModel: PropTypes.func.isRequired,
  showProfileModel: PropTypes.func,
};

Header.defaultProps = {
  onNameChange: null,
  showProfileModel: null,
};

function Header(props) {
  const [value, setValue] = useState();
  const history = useHistory();

  const { cart } = useSelector((state) => state.cart);
  const { token, user } = useSelector((state) => state.user);

  const timeoutId = useRef(null);
  const { onNameChange, showModel, showProfileModel } = props;

  const mapModel = useModel();

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

  // handle user click when login

  const handleProfileClick = () => {
    try {
      jwt.verify(token, process.env.REACT_APP_JWT_KEY);
      showProfileModel(user);
    } catch (error) {
      showModel();
    }
  };

  return (
    <div className="Header Container">
      <div className="Header__logo">
        <h2>
          <Link to="/">
            Shoes Store <img src={brandLogo} alt="brandLogo" />
          </Link>
        </h2>
      </div>

      <div className="Header__input">
        <i className="bx bx-search" />
        <Input
          onChange={handleInputChange}
          value={value}
          placeholder="Search name product ..."
        />
        <img src={brandLogo} alt="branchLogo" />
      </div>

      <div className="Header__info">
        <div>
          <i
            onClick={() => history.push("/cart")}
            className="bx bx-basket animate__animated animate__swing"
            key={cart.length}
          >
            <Badge className="bg-danger rounded-circle" size="sm">
              {cart.length}
            </Badge>
          </i>
        </div>

        <div className="p-0 m-0" onClick={() => mapModel.showModel()}>
          <i className="bx bx-map" />
        </div>

        <img
          onClick={handleProfileClick}
          src={
            !token
              ? avt
              : user.image
              ? !user.test // test login firebase remember remove
                ? `${process.env.REACT_APP_API_URL}/${user.image}`
                : user.image
              : user.imageUrl
          }
          alt="#"
        />
      </div>

      {mapModel.model.show && <Map onClose={mapModel.closeModel} />}
    </div>
  );
}

export default Header;
