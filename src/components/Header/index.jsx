import CartModal from "components/CartModal";
import Map from "components/Map";
import { removeProduct } from "features/Cart/cartSlice";
import { getOrderWithCart } from "features/Order/orderSlice";
import useModel from "hooks/useModel";
import jwt from "jsonwebtoken";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Badge, Input } from "reactstrap";
import { capitalizeFirstLetter } from "utils/common";
import avt from "../../assets/images/avt.jpg";
import brandLogo from "../../assets/images/brandLogo.png";
import noResultFound from "../../assets/images/noResultFound.png";
import "./header.scss";

Header.propTypes = {
  showModel: PropTypes.func.isRequired,
  showProfileModel: PropTypes.func,
  showInputMobile: PropTypes.bool,
  setShowInputMobile: PropTypes.func,
};

Header.defaultProps = {
  onNameChange: null,
  showProfileModel: null,
  showInputMobile: false,
  setShowInputMobile: null,
};

function Header(props) {
  const { showModel, showProfileModel, showInputMobile, setShowInputMobile } =
    props;

  const history = useHistory();
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const [showCartModal, setShowCartModal] = useState(false);

  const { cart } = useSelector((state) => state.cart);
  const { token, user } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const { favourites } = useSelector((state) => state.favourite);

  let filterProducts = products.filter(
    (product) =>
      product.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
      product.category.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
  );

  if (value === "") filterProducts = [];

  const mapModel = useModel();

  // handle user click when login

  const handleProfileClick = () => {
    try {
      jwt.verify(token, process.env.REACT_APP_JWT_KEY);
      showProfileModel(user);
    } catch (error) {
      showModel();
    }
  };

  // handle remove cart item
  const handleRemoveCartItem = (product) => {
    dispatch(removeProduct({ id: product._id }));
    const order = cart
      .filter(
        (item) =>
          !(
            item._id === product._id &&
            item.selectedColor === product.selectedColor &&
            item.selectedSize === product.selectedSize
          )
      )
      .map((cart) => ({ ...cart, state: "" }));
    dispatch(getOrderWithCart({ order, userId: user._id }));
  };

  // handle click when go to check out

  const handleCheckOutClick = async () => {
    try {
      await jwt.verify(token, process.env.REACT_APP_JWT_KEY);
      const order = cart.map((cart) => ({ ...cart, state: "" }));
      dispatch(getOrderWithCart({ order, userId: user._id }));

      history.push("/order/");
    } catch (error) {
      showModel();
    }
  };

  return (
    <div className="Header Container">
      <div className="Header__logo">
        <h2>
          <Link to="/">
            Shoes Store{" "}
            <img className="img-fluid" src={brandLogo} alt="brandLogo" />
          </Link>
        </h2>
      </div>

      <div className="Header__navigation">
        <nav className="d-flex justify-content-between w-75 m-auto">
          <Link to="/products">
            <h5>All Products</h5>
          </Link>
          <Link to="/products?category=nike">
            <h5>Nike</h5>
          </Link>
          <Link to="/products?category=adidas">
            <h5>Adidas</h5>
          </Link>
          <Link to="/products?category=balenciaga">
            <h5>Balenciaga</h5>
          </Link>
          <Link to="/products?category=converse">
            <h5>Converse</h5>
          </Link>
          <Link to="/products?category=vans">
            <h5>Vans</h5>
          </Link>
        </nav>
      </div>
      <div
        className={showInputMobile ? "Header__input d-block" : "Header__input"}
      >
        <i className="bx bx-search" />
        <Input
          onChange={(e) => setValue(e.target.value)}
          value={value}
          placeholder="Search name product ..."
        />
        <img
          className="img-fluid search-logo"
          src={brandLogo}
          alt="branchLogo"
        />

        {/* Search Products */}
        <div className="Header__search shadow">
          {filterProducts.length > 0 && (
            <div>
              <ul>
                {filterProducts.map((product) => (
                  <Link
                    className="text-decoration-none text-dark"
                    to={`/products/${product._id}`}
                  >
                    <li key={product._id}>
                      <img
                        src={product.productDetail[0].images[0]}
                        alt={product._id}
                      />
                      <div>
                        <h6>
                          {capitalizeFirstLetter(product.category.name) +
                            " " +
                            product.name}
                        </h6>
                        <div className="text-danger">${product.salePrice}</div>
                      </div>
                    </li>
                  </Link>
                ))}
              </ul>
              <Link
                className="text-info py-2 text-center d-block"
                to="/products"
              >
                View all products ...
              </Link>
            </div>
          )}
          {filterProducts.length === 0 && value !== "" && (
            <img
              style={{
                width: "100%",
                height: "200px",
                objectFit: "contain",
                marginTop: "2rem",
              }}
              src={noResultFound}
              alt="noResultFound"
            />
          )}
        </div>
      </div>

      <div className="Header__info">
        <div className="p-0 m-0 d-md-none">
          <i
            className="bx bx-search"
            onClick={() => setShowInputMobile?.(!showInputMobile)}
          ></i>
        </div>

        <div className="p-0 m-0" onClick={() => mapModel.showModel()}>
          <i className="bx bx-map" />
        </div>

        {token && (
          <div className="p-0 m-0">
            <Link className="text-dark" to={"/favourite/" + user._id}>
              <i className="bx bx-heart">
                <Badge className="bg-danger rounded-circle" size="sm">
                  {favourites.length}
                </Badge>
              </i>
            </Link>
          </div>
        )}

        <div>
          <label htmlFor="nav-mobile-input" className="nav__mobile-btn me-2">
            <i
              className="bx bx-basket animate__animated animate__swing"
              key={cart.length}
              onClick={() => setShowCartModal(true)}
            >
              <Badge className="bg-danger rounded-circle" size="sm">
                {cart.reduce(
                  (sum, cartItem) => (sum += cartItem.selectedQuantity),
                  0
                )}
              </Badge>
            </i>

            <label
              onClick={() => setShowCartModal(false)}
              htmlFor="nav-mobile-input"
              className={
                showCartModal ? "nav__over-lay d-block" : "nav__over-lay"
              }
            ></label>
          </label>
        </div>

        {token && (
          <div>
            <i
              onClick={() => history.push(`/order/:${user._id}`)}
              className="bx bxl-shopify"
              key={cart.length}
            ></i>
          </div>
        )}

        <img
          className="img-fluid Header__avatar"
          onClick={handleProfileClick}
          src={!token ? avt : user.image}
          alt="#"
        />
      </div>

      {mapModel.model.show && <Map onClose={mapModel.closeModel} />}

      <CartModal
        carts={cart}
        showCartModal={showCartModal}
        setShowCartModal={setShowCartModal}
        onRemoveCartItemClick={handleRemoveCartItem}
        onCheckoutClick={handleCheckOutClick}
      />
    </div>
  );
}

export default Header;
