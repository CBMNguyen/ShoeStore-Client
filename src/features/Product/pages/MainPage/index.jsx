import { createUser, updateUser, userLogin } from "app/userSlice";
import Footer from "components/Footer";
import Header from "components/Header";
import Loading from "components/Loading";
import LoginModel from "components/LoginModel";
import Profile from "components/Profile";
import SignUpModel from "components/SignUpModel";
import { fetchCategory } from "features/Product/categorySlice";
import { fetchColor } from "features/Product/colorSlice";
import Filter from "features/Product/components/Filter";
import ProductList from "features/Product/components/ProductList";
import { fetchSize } from "features/Product/sizeSlice";
import useModel from "hooks/useModel";
import useQuery from "hooks/useQuery";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToastError, showToastSuccess } from "utils/common";

function MainPage(props) {
  const dispatch = useDispatch();

  // fetch data for home page
  useEffect(() => {
    dispatch(fetchColor());
    dispatch(fetchCategory());
    dispatch(fetchSize());
  }, [dispatch]);

  const { color } = useSelector((state) => state.color);
  const { category } = useSelector((state) => state.category);
  const { size } = useSelector((state) => state.size);
  const { products } = useSelector((state) => state.products);
  const { loading } = useSelector((state) => state.user);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showInputMobile, setShowInputMobile] = useState(false);

  const query = useQuery();
  const categoryQuery = query.get("category");

  // Filter Product
  const initialFilter = {
    category: "",
    color: "",
    size: "",
    price: {
      minPrice: 42.32,
      maxPrice: 2000,
    },
    isIncreasePrice: 0,
    selectedProduct: null,
    page: 1,
    limit: 8,
    totalRow: 44,
  };
  const [filter, setFilter] = useState(initialFilter);

  // Scroll To Top

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [filter]);

  useEffect(() => {
    if (categoryQuery) {
      setFilter({ ...initialFilter, category: categoryQuery });
    }
    if (!categoryQuery) {
      document.querySelector("#all")?.click();
      return;
    }
    const input = document.querySelector("#" + categoryQuery);

    if (!input) return;
    input.click();
  }, [categoryQuery]);

  const filterProduct = products.filter(
    (product) =>
      (filter["color"] === ""
        ? true
        : product.productDetail.findIndex(
            (c) => c.color.color === filter["color"]
          ) !== -1) &&
      (filter["size"] === ""
        ? true
        : product.productDetail.findIndex((s) =>
            s.sizeAndQuantity.some((s) => s.size.size === filter.size)
          ) !== -1) &&
      product.originalPrice >= filter["price"]["minPrice"] &&
      product.originalPrice <= filter["price"]["maxPrice"] &&
      product.category.name.indexOf(filter["category"]) !== -1 &&
      !product.state
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

  const loginModel = useModel();
  const signupModel = useModel();
  const profileModel = useModel();

  // handle change

  const handlePageChange = (page) => {
    setFilter({ ...filter, page });
  };

  const handleColorChange = (color) => {
    setFilter({ ...filter, color, page: 1 });
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

  const handleInCreasePriceChange = (isIncreasePrice) => {
    setFilter({ ...filter, isIncreasePrice });
  };

  // handle reset filter
  const handleResetFilter = () => {
    setFilter(initialFilter);
    query.set("category", "");
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

  const start = (filter["page"] - 1) * filter["limit"];
  const end = filter["page"] * filter["limit"];

  return products.length === 0 ? (
    <Loading />
  ) : (
    <div>
      <Header
        home="home"
        showModel={loginModel.showModel}
        showProfileModel={profileModel.showModel}
        showInputMobile={showInputMobile}
        setShowInputMobile={setShowInputMobile}
      />

      <div className="d-flex">
        {!showFilterModal && (
          <Filter
            color={color}
            category={category}
            size={size}
            filter={filter}
            minPrice={42.32}
            maxPrice={2000}
            onColorChange={handleColorChange}
            onSizeChange={handleSizeChange}
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
            showFilterModal={showFilterModal}
          />
        )}

        <ProductList
          products={sortProductByPrice.slice(start, end)}
          totalRow={sortProductByPrice.length}
          filter={filter}
          onInCreasePriceChange={handleInCreasePriceChange}
          onPageChange={handlePageChange}
          onResetFilter={handleResetFilter}
          showFilterModal={showFilterModal}
          setShowFilterModal={setShowFilterModal}
        />
      </div>

      {/* Show filter modal */}

      <div
        className="nav__mobile"
        style={
          showFilterModal ? { transform: "translateX(0)", opacity: 1 } : {}
        }
      >
        <label
          htmlFor="nav-mobile-input"
          className="nav_mobile-close"
          onClick={() => setShowFilterModal(false)}
        >
          <div className="ImageModel">
            <i
              className="bx bx-x"
              style={{ top: "-20px", right: "-24px", fontSize: "38px" }}
            />
          </div>
        </label>
        <Filter
          color={color}
          category={category}
          size={size}
          filter={filter}
          minPrice={42.32}
          maxPrice={2000}
          onColorChange={handleColorChange}
          onSizeChange={handleSizeChange}
          onCategoryChange={handleCategoryChange}
          onPriceChange={handlePriceChange}
          showFilterModal={showFilterModal}
        />
      </div>

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

      <Footer />
    </div>
  );
}

export default MainPage;
