import { createUser, userLogin } from "app/userSlice";
import Header from "components/Header";
import LoginModel from "components/LoginModel";
import SignUpModel from "components/SignUpModel";
import { PRODUCT_TOAST_OPTIONS } from "constants/globals";
import {
  removeProduct,
  selectColor,
  selectQuantity,
  selectSize,
} from "features/Cart/cartSlice";
import CartList from "features/Cart/components/CartList";
import useModel from "hooks/useModel";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { showToastError, showToastSuccess } from "utils/common";

function MainPage(props) {
  const { cart } = useSelector((state) => state.cart);
  const { token, user } = useSelector((state) => state.user);

  const loginModel = useModel();
  const signupModel = useModel();

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
    toast.success("🧦 deleted a product.", {
      ...PRODUCT_TOAST_OPTIONS,
    });
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
        (1 - product.promotionPercent),
    0
  );

  return (
    <div>
      <Header showModel={loginModel.showModel} />

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

      {loginModel.model.show && (
        <LoginModel
          onLogin={handleLogin}
          closeModel={loginModel.closeModel}
          showModel={signupModel.showModel}
        />
      )}

      {signupModel.model.show && (
        <SignUpModel
          onCreateUser={handleCreateUser}
          closeModel={signupModel.closeModel}
        />
      )}
    </div>
  );
}

export default MainPage;
