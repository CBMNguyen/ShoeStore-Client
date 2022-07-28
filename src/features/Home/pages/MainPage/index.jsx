import { createUser, updateUser, userLogin } from "app/userSlice";
import Header from "components/Header";
import Loading from "components/Loading";
import LoginModel from "components/LoginModel";
import Profile from "components/Profile";
import SignUpModel from "components/SignUpModel";
import { fetchCategory } from "features/Home/categorySlice";
import { fetchColor } from "features/Home/colorSlice";
import Filter from "features/Home/components/Filter";
import ImageModel from "features/Home/components/ImageModel";
import ProductDetail from "features/Home/components/ProductDetail";
import ProductList from "features/Home/components/ProductList";
import { fetchProduct } from "features/Home/productSlice";
import { fetchSize } from "features/Home/sizeSlice";
import useModel from "hooks/useModel";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToastError, showToastSuccess } from "utils/common";

function MainPage(props) {
  const dispatch = useDispatch();

  // fetch data for home page
  useEffect(() => {
    dispatch(fetchProduct());
    dispatch(fetchColor());
    dispatch(fetchCategory());
    dispatch(fetchSize());
  }, [dispatch]);

  const { color } = useSelector((state) => state.color);
  const { category } = useSelector((state) => state.category);
  const { size } = useSelector((state) => state.size);
  const { products } = useSelector((state) => state.products);
  const { loading } = useSelector((state) => state.user);

  const [selectProductDetail, setSelectProductDetail] = useState({
    selectedSize: null,
    selectedColor: null,
    selectedQuantity: 1,
  });

  // Filter Product
  const initialFilter = {
    category: "",
    color: "",
    size: "",
    name: "",
    price: {
      minPrice: 42.32,
      maxPrice: 1082.23,
    },
    isIncreasePrice: 0,
    selectedProduct: null,
    page: 1,
    limit: 6,
    totalRow: 44,
  };
  const [filter, setFilter] = useState(initialFilter);

  const filterProduct = products.filter(
    (product) =>
      (filter["color"] === ""
        ? true
        : product.color.findIndex((c) => c.color === filter["color"]) !== -1) &&
      (filter["size"] === ""
        ? true
        : product.size.findIndex((c) => c.size === filter["size"]) !== -1) &&
      product.originalPrice >= filter["price"]["minPrice"] &&
      product.originalPrice <= filter["price"]["maxPrice"] &&
      product.category.name.indexOf(filter["category"]) !== -1 &&
      product.name.toLowerCase().indexOf(filter["name"].toLowerCase()) !== -1
  );

  // Sort product
  let sortProductByPrice = filterProduct;

  // Sort Increase Product
  filter.isIncreasePrice === 1 &&
    (sortProductByPrice = filterProduct
      .slice()
      .sort((a, b) => a.originalPrice - b.originalPrice));

  // Sort Decrease Product
  filter.isIncreasePrice === -1 &&
    (sortProductByPrice = filterProduct
      .slice()
      .sort((a, b) => b.originalPrice - a.originalPrice));

  const { model, showModel, closeModel } = useModel();
  const loginModel = useModel();
  const signupModel = useModel();
  const profileModel = useModel();

  // handle change

  const handlePageChange = (page) => {
    setFilter({ ...filter, page });
  };

  const handleColorChange = (color) => {
    setFilter({ ...filter, color });
  };

  const handleSizeChange = (size) => {
    setFilter({ ...filter, size, page: 1 });
  };

  const handlePriceChange = (price) => {
    setFilter({ ...filter, price, page: 1 });
  };

  const handleCategoryChange = (category) => {
    setFilter({ ...filter, category, page: 1 });
  };

  const handleNameChange = (name) => {
    setFilter({ ...filter, name, page: 1 });
  };

  const handleInCreasePriceChange = (isIncreasePrice) => {
    setFilter({ ...filter, isIncreasePrice });
  };

  // take current product
  const handleSelectProduct = (selectedProduct) => {
    setFilter({ ...filter, selectedProduct });
    setSelectProductDetail({
      selectedSize: null,
      selectedColor: null,
      selectedQuantity: 1,
    });
  };

  // handle reset filter
  const handleResetFilter = () => {
    setFilter(initialFilter);
  };

  // handle sign up add user
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

  return products.length === 0 ? (
    <Loading />
  ) : (
    <div>
      <Header
        showModel={loginModel.showModel}
        onNameChange={handleNameChange}
        showProfileModel={profileModel.showModel}
      />

      <Filter
        color={color}
        category={category}
        size={size}
        filter={filter}
        minPrice={42.32}
        maxPrice={1083}
        onColorChange={handleColorChange}
        onSizeChange={handleSizeChange}
        onCategoryChange={handleCategoryChange}
        onPriceChange={handlePriceChange}
      />

      <ProductList
        products={sortProductByPrice.slice(
          (filter.page - 1) * filter.limit,
          filter.page * filter.limit
        )}
        totalRow={sortProductByPrice.length}
        filter={filter}
        onInCreasePriceChange={handleInCreasePriceChange}
        onSelectProduct={handleSelectProduct}
        onPageChange={handlePageChange}
        onResetFilter={handleResetFilter}
        showModel={showModel}
      />

      <ProductDetail
        product={
          !filter["selectedProduct"] ? products[0] : filter["selectedProduct"]
        }
        selectProductDetail={selectProductDetail}
        setSelectProductDetail={setSelectProductDetail}
        showModel={showModel}
      />

      {/* Show image model  */}
      {model.show && (
        <ImageModel product={model.data} closeModel={closeModel} />
      )}

      {/* Show login model */}
      {loginModel.model.show && (
        <LoginModel
          onLogin={handleLogin}
          closeModel={loginModel.closeModel}
          showModel={signupModel.showModel}
        />
      )}

      {/* Show sign up model */}
      {signupModel.model.show && (
        <SignUpModel
          onCreateUser={handleCreateUser}
          closeModel={signupModel.closeModel}
        />
      )}

      {profileModel.model.show && (
        <Profile
          loading={loading}
          onSubmit={handleProfileChange}
          model={profileModel.model}
          closeModel={profileModel.closeModel}
        />
      )}
    </div>
  );
}

export default MainPage;
