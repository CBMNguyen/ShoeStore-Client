import { createUser, updateUser, userLogin } from "app/userSlice";
import Footer from "components/Footer";
import Header from "components/Header";
import LoginModel from "components/LoginModel";
import Profile from "components/Profile";
import SignUpModel from "components/SignUpModel";
import {
  removeProduct,
  selectColor,
  selectQuantity,
  selectSize,
} from "features/Cart/cartSlice";
import CartEditModal from "features/Cart/components/CartEditModal";
import CartList from "features/Cart/components/CartList";
import { getOrderWithCart } from "features/Order/orderSlice";
import useModel from "hooks/useModel";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToastError, showToastSuccess } from "utils/common";
import jwt from "jsonwebtoken";
import { useHistory } from "react-router-dom";

function MainPage(props) {
  const { cart } = useSelector((state) => state.cart);
  const { token, user } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.user);

  useEffect(() => window.scrollTo(0, 0), []);

  const loginModel = useModel();
  const signupModel = useModel();
  const profileModel = useModel();
  const cartModal = useModel();

  const dispatch = useDispatch();
  const history = useHistory();

  // handle change attribute

  const handleSizeChange = (id, size) => {
    dispatch(selectSize({ id, size }));
  };

  const handleColorChange = (id, color) => {
    dispatch(selectColor({ id, color }));
  };

  const handleQuantityChange = (data) => {
    dispatch(selectQuantity(data));
  };

  // handle remove product
  const handleRemoveProduct = (product) => {
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

  // handle sign up add new user
  const handleCreateUser = async (data) => {
    try {
      await showToastSuccess(dispatch(createUser(data)));
      signupModel.closeModel();
      loginModel.showModel();
    } catch (error) {
      showToastError(error);
    }
  };

  // handle login
  const handleLogin = async (data) => {
    try {
      await showToastSuccess(dispatch(userLogin(data)));
      loginModel.closeModel();
    } catch (error) {
      showToastError(error);
    }
  };

  // handle click when go to check out

  const handleCheckOutClick = async () => {
    try {
      await jwt.verify(token, process.env.REACT_APP_JWT_KEY);
      const order = cart.map((cart) => ({ ...cart, state: "" }));
      dispatch(getOrderWithCart({ order, userId: user._id }));

      history.push("/order/");
    } catch (error) {
      loginModel.showModel();
    }
  };

  // total price cart
  const total = cart.reduce(
    (sum, product) =>
      sum +
      product.salePrice *
        product.selectedQuantity *
        ((100 - product.promotionPercent) / 100),
    0
  );

  // handle profile change
  const handleProfileChange = async (data) => {
    const formData = new FormData();
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("gender", data.gender.value);
    formData.append("image", data.image);
    formData.append("address", data.address);
    formData.append("birthdate", data.birthdate);
    try {
      await showToastSuccess(
        dispatch(
          updateUser({ _id: profileModel.model.data._id, user: formData })
        )
      );

      profileModel.closeModel();
    } catch (error) {
      showToastError(error);
    }
  };

  return (
    <div>
      <Header
        showModel={loginModel.showModel}
        showProfileModel={profileModel.showModel}
      />

      <div style={{ minHeight: "calc(100vh - 4.5rem)", padding: "4rem 0" }}>
        <CartList
          cart={cart}
          total={total}
          showCartEditModal={cartModal.showModel}
          onColorChange={handleColorChange}
          onSizeChange={handleSizeChange}
          onQuantityChange={handleQuantityChange}
          onCheckoutClick={handleCheckOutClick}
          onProductRemove={handleRemoveProduct}
        />
      </div>

      {/* Login Model */}
      {loginModel.model.show && (
        <LoginModel
          onLogin={handleLogin}
          closeModel={loginModel.closeModel}
          showModel={signupModel.showModel}
        />
      )}

      {/* Signup Model */}
      {signupModel.model.show && (
        <SignUpModel
          onCreateUser={handleCreateUser}
          closeModel={signupModel.closeModel}
        />
      )}

      {/* Profile Model */}
      {profileModel.model.show && (
        <Profile
          loading={loading}
          onSubmit={handleProfileChange}
          model={profileModel.model}
          closeModel={profileModel.closeModel}
        />
      )}

      {/* Profile Model */}
      {cartModal.model.show && (
        <CartEditModal
          cart={cart}
          model={cartModal.model}
          closeModel={cartModal.closeModel}
        />
      )}
      <Footer />
    </div>
  );
}

export default MainPage;
