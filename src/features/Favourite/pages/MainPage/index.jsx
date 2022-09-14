import { createUser, updateUser, userLogin } from "app/userSlice";
import Footer from "components/Footer";
import Header from "components/Header";
import LoginModel from "components/LoginModel";
import Profile from "components/Profile";
import SignUpModel from "components/SignUpModel";
import ProductItem from "features/Product/components/ProductItem";
import useModel from "hooks/useModel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Button, Container, Row } from "reactstrap";
import { showToastError, showToastSuccess } from "utils/common";
import NoResultImage from "../../../../assets/images/noResultFound.png";

function Favourite(props) {
  const { loading, user } = useSelector((state) => state.user);
  const favouritesData = useSelector((state) => state.favourite);
  const dispatch = useDispatch();

  // Scroll To Top

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showInputMobile, setShowInputMobile] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

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
    <div className="Home">
      <Header
        showModel={loginModel.showModel}
        showProfileModel={profileModel.showModel}
        showInputMobile={showInputMobile}
        setShowInputMobile={setShowInputMobile}
      />

      <Container>
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="text-uppercase my-5">Your Favourite Product</h3>
          <Breadcrumb className="mt-2">
            <BreadcrumbItem>
              <Link to="/" className="text-decoration-none">
                <code>Home</code>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              <code>favourites</code>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        {user?._id && favouritesData.favourites.length > 0 && (
          <Row className="mb-4">
            {favouritesData.favourites.map((favourite) => (
              <ProductItem
                key={favourite.productId._id}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                product={favourite.productId}
              />
            ))}
          </Row>
        )}
        {(favouritesData.favourites.length === 0 || !user?._id) && (
          <div className="text-center">
            <img
              style={{ height: "60vh" }}
              src={NoResultImage}
              alt="No result "
            />
          </div>
        )}

        <Button
          className="rounded-1 border-0 my-5 d-block m-auto shadow"
          style={{ backgroundColor: "deeppink" }}
        >
          <Link to="/products" className="text-white text-decoration-none">
            View other products
          </Link>
        </Button>
      </Container>

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

export default Favourite;
