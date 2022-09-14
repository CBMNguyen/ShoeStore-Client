import productApi from "api/product";
import { createUser, updateUser, userLogin } from "app/userSlice";
import Footer from "components/Footer";
import Header from "components/Header";
import LoginModel from "components/LoginModel";
import Profile from "components/Profile";
import SignUpModel from "components/SignUpModel";
import ProductDetailImage from "features/Product/components/ProductDetailImages";
import ProductReview from "features/Product/components/ProductReview";
import RecentViewProduct from "features/Product/components/RecentViewProduct";
import useModel from "hooks/useModel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { showToastError, showToastSuccess } from "utils/common";

function ProductDetail(props) {
  const dispatch = useDispatch();
  const { loading, token, user } = useSelector((state) => state.user);
  const [showInputMobile, setShowInputMobile] = useState(false);
  const { productId } = useParams();

  const { products } = useSelector((state) => state.products);
  const { favourites, loading: favouriteLoading } = useSelector(
    (state) => state.favourite
  );
  const [product, setProduct] = useState();

  // Scroll To Top

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  const recentProducts =
    JSON.parse(sessionStorage.getItem("recentProducts")) || [];

  const relatedProducts = products
    .slice()
    .filter(
      (productItem) =>
        productItem.category._id === product?.category?._id &&
        productItem._id !== product?._id
    );

  const [selectedProduct, setSelectedProduct] = useState(
    recentProducts[0]?._id || ""
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productApi.get(productId);
        const index = recentProducts.findIndex(
          (item) => data.product._id === item._id
        );
        if (index < 0) {
          recentProducts.push(data.product);
          const recentProductsStr = JSON.stringify(recentProducts);
          sessionStorage.setItem("recentProducts", recentProductsStr);
        }
        setProduct(data.product);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, [productId]);

  // Scroll on top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const loginModel = useModel();
  const signupModel = useModel();
  const profileModel = useModel();

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

  return (
    <div>
      <Header
        home="home"
        showModel={loginModel.showModel}
        showProfileModel={profileModel.showModel}
        showInputMobile={showInputMobile}
        setShowInputMobile={setShowInputMobile}
      />

      <ProductDetailImage
        token={token}
        user={user}
        product={product}
        favourites={favourites}
        favouriteLoading={favouriteLoading}
        showLoginModal={loginModel.showModel}
      />

      <RecentViewProduct
        title="Recently Viewed products"
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        products={recentProducts}
      />

      {relatedProducts.length > 0 && (
        <RecentViewProduct
          title="Related products"
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          products={relatedProducts}
        />
      )}

      <ProductReview product={product} />

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

export default ProductDetail;
