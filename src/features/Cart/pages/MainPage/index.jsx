import Header from "components/Header";
import {
  removeProduct,
  selectColor,
  selectQuantity,
  selectSize,
} from "features/Cart/cartSlice";
import CartList from "features/Cart/components/CartList";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

MainPage.propTypes = {};

function MainPage(props) {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleSizeChange = (id, size) => {
    dispatch(selectSize({ id, size }));
  };

  const handleColorChange = (id, color) => {
    dispatch(selectColor({ id, color }));
  };

  const handleQuantityChange = (id, quantity) => {
    dispatch(selectQuantity({ id, quantity }));
  };

  const handleRemoveProduct = (id) => {
    dispatch(removeProduct({ id }));
  };

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
      <Header />
      <CartList
        cart={cart}
        total={total}
        onColorChange={handleColorChange}
        onSizeChange={handleSizeChange}
        onQuantityChange={handleQuantityChange}
        onProductRemove={handleRemoveProduct}
      />
    </div>
  );
}

export default MainPage;
