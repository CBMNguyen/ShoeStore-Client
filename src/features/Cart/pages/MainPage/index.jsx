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
import CartList from "features/Cart/components/CartList";
import useModel from "hooks/useModel";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToastError, showToastSuccess } from "utils/common";

function MainPage(props) {
  const { cart } = useSelector((state) => state.cart);
  const { token, user } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.user);

  useEffect(() => window.scrollTo(0, 0), []);

  const loginModel = useModel();
  const signupModel = useModel();
  const profileModel = useModel();

  const dispatch = useDispatch();

  // handle change attribute

  const handleSizeChange = (id, size) => {
    dispatch(selectSize({ id, size }));
  };

  const handleColorChange = (id, color) => {
    dispatch(selectColor({ id, color }));
  };

  const handleQuantityChange = (id, quantity) => {
    dispatch(selectQuantity({ id, quantity }));
  };

  // handle remove product
  const handleRemoveProduct = (id) => {
    dispatch(removeProduct({ id }));
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

  // total price cart
  const total = cart.reduce(
    (sum, product) =>
      sum +
      product.originalPrice *
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
          token={token}
          user={user}
          showModel={loginModel.showModel}
          onColorChange={handleColorChange}
          onSizeChange={handleSizeChange}
          onQuantityChange={handleQuantityChange}
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

      <Footer />
    </div>
  );
}

export default MainPage;
